import re
import resend
import requests
import trafilatura
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Submission
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.conf import settings
from django.contrib.auth.models import User
from django.db.models import Avg
from .models import ContactMessage
from .serializers import ContactMessageSerializer
from detector.ml_model.predict import predict_news

# Matches the input if it looks like a URL

URL_REGEX = re.compile(r"^https?://\S+$")


def extract_text_from_url(url: str):
    """
    Extracts the clean article text from a URL.
    Returns: (text, error_message), exactly one of which is always None.
    """
    downloaded = None
    try:
        downloaded = trafilatura.fetch_url(url)
    except Exception:
        downloaded = None

    if not downloaded:
        # Fallback: some sites block trafilatura's default fetcher, so we also
        # try plain requests with a browser-like User-Agent, otherwise many
        # sites treat the request as a bot and block it.
        try:
            resp = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
            resp.raise_for_status()
            downloaded = resp.text
        except Exception:
            return (
                None,
                "Could not reach this URL. Please check the link or paste the article text directly.",
            )

    try:
        extracted = trafilatura.extract(downloaded)
    except Exception:
        extracted = None

    if not extracted or len(extracted.strip()) < 30:
        return (
            None,
            "Could not extract an article from this URL. Please paste the article text directly.",
        )

    return extracted.strip(), None


# ============================
# API Endpoint: /api/detect/
# Model loading happens only in predict.py. There is no separate
# joblib.load() here, because duplicate loading used to crash the app.
#
# This endpoint accepts both plain text and a URL. If the input looks
# like a URL, we first extract the article text from it, then pass the
# extracted text to predict_news().
# ============================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def detect_news(request):
    raw_input = request.data.get("text", "")

    if not raw_input or not raw_input.strip():
        return Response(
            {"error": "Please provide news text or a URL to analyze."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    raw_input = raw_input.strip()
    source_url = None

    if URL_REGEX.match(raw_input):
        source_url = raw_input
        text, error = extract_text_from_url(raw_input)
        if error:
            return Response({"error": error}, status=status.HTTP_400_BAD_REQUEST)
    else:
        text = raw_input

    result = predict_news(text)

    label = result["prediction"].upper() # "REAL" or "FAKE"
    confidence = result["confidence"] if result["confidence"] is not None else 0
    top_keywords = result["top_keywords"]

    # Save to the database
    Submission.objects.create(
        user=request.user,
        input_text=text,
        prediction=label,
        confidence=confidence,
    )

    return Response(
        {
            "prediction": label,
            "confidence": confidence,
            "text_preview": text[:100],
            "top_keywords": top_keywords,
            "source_url": source_url,
        },
        status=status.HTTP_200_OK,
    )


# ============================
# Register API: /api/auth/register/
# ============================
@api_view(["POST"])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(
            {"message": "User registered successfully."}, status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================
# Login API: /api/auth/login/
# The response now also includes "is_staff", so the frontend can tell
# whether the user is an admin (to show the Admin Dashboard link).
# ============================
@api_view(["POST"])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    from django.contrib.auth import authenticate

    user = authenticate(username=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
                "is_staff": user.is_staff,
            },
            status=status.HTTP_200_OK,
        )
    else:
        return Response(
            {"error": "Invalid username or password."},
            status=status.HTTP_401_UNAUTHORIZED,
        )


# ============================
# History API: /api/history/
# ============================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_history(request):
    submissions = Submission.objects.filter(user=request.user).order_by("-created_at")

    data = [
        {
            "id": sub.id,
            "text_preview": sub.input_text[:100],
            "prediction": sub.prediction,
            "confidence": sub.confidence,
            "created_at": sub.created_at,
        }
        for sub in submissions
    ]

    return Response(data, status=status.HTTP_200_OK)


# ============================
# Delete single history item: /api/history/<id>/
# ============================
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_history_item(request, id):
    try:
        submission = Submission.objects.get(id=id, user=request.user)
        submission.delete()
        return Response({"message": "Deleted successfully."}, status=status.HTTP_200_OK)
    except Submission.DoesNotExist:
        return Response({"error": "Not found."}, status=status.HTTP_404_NOT_FOUND)


# ============================
# Forgot Password: /api/auth/forgot-password/
# ============================
token_generator = PasswordResetTokenGenerator()


@api_view(["POST"])
def forgot_password(request):
    email = request.data.get("email")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # For security, always return the same success message so nobody
        # can find out which emails are registered
        return Response(
            {"message": "If this email is registered, a reset link has been sent."},
            status=status.HTTP_200_OK,
        )

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = token_generator.make_token(user)
    reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"

    resend.api_key = settings.RESEND_API_KEY

    resend.Emails.send(
        {
            "from": settings.DEFAULT_FROM_EMAIL,
            "to": [email],
            "subject": "Reset your TruthLens password",
            "text": f"Click the link below to reset your password:\n\n{reset_link}\n\nIf you did not request this, ignore this email.",
        }
    )

    return Response(
        {"message": "If this email is registered, a reset link has been sent."},
        status=status.HTTP_200_OK,
    )


# ============================
# Reset Password: /api/auth/reset-password/
# ============================
@api_view(["POST"])
def reset_password(request):
    uid = request.data.get("uid")
    token = request.data.get("token")
    new_password = request.data.get("password")

    if not new_password or len(new_password) < 6:
        return Response(
            {"error": "Password must be at least 6 characters."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)
    except (User.DoesNotExist, ValueError, TypeError):
        return Response(
            {"error": "Invalid reset link."}, status=status.HTTP_400_BAD_REQUEST
        )

    if not token_generator.check_token(user, token):
        return Response(
            {"error": "This reset link has expired or is invalid."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user.set_password(new_password)
    user.save()

    return Response(
        {"message": "Password reset successfully."}, status=status.HTTP_200_OK
    )


# ============================
# Contact API: /api/contact/
# ============================
@api_view(["POST"])
def submit_contact(request):
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():
        contact = serializer.save()

        # Notify the admin by email using Resend's HTTP API (port 443), not
        # SMTP. This avoids any hang/timeout risk and stays within the
        # 5-second cap.
        try:
            requests.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "from": settings.DEFAULT_FROM_EMAIL,
                    "to": [settings.CONTACT_NOTIFICATION_EMAIL],
                    "reply_to": contact.email,
                    "subject": f"[TruthLens Contact] {contact.subject}",
                    "text": (
                        f"From: {contact.name} ({contact.email})\n\n"
                        f"{contact.message}"
                    ),
                },
                timeout=5,
            )
        except Exception:
            pass  # the message is already saved; an email failure must not fail the request

        return Response(
            {"message": "Your message has been sent successfully."},
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================
# ============================
# ADMIN DASHBOARD ENDPOINTS
# All endpoints use IsAdminUser, meaning only users whose Django account
# has is_staff = True can access them (a superuser satisfies this
# automatically).
# ============================
# ============================


# ----------------------------
# GET /api/admin/stats/
# Overall numbers for the stat cards at the top of the dashboard
# ----------------------------
@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_stats(request):
    total_users = User.objects.count()
    total_submissions = Submission.objects.count()
    fake_count = Submission.objects.filter(prediction="FAKE").count()
    real_count = Submission.objects.filter(prediction="REAL").count()
    avg_confidence = Submission.objects.aggregate(avg=Avg("confidence"))["avg"] or 0
    total_contacts = ContactMessage.objects.count()

    return Response(
        {
            "total_users": total_users,
            "total_submissions": total_submissions,
            "fake_count": fake_count,
            "real_count": real_count,
            "avg_confidence": round(avg_confidence, 2),
            "total_contacts": total_contacts,
        },
        status=status.HTTP_200_OK,
    )


# ----------------------------
# GET /api/admin/users/
# Sab registered users ki list (har user ki submission count ke sath)
# ----------------------------
@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_users_list(request):
    users = User.objects.all().order_by("-date_joined")

    data = [
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "is_staff": u.is_staff,
            "is_superuser": u.is_superuser,
            "date_joined": u.date_joined,
            "submission_count": u.submissions.count(),
        }
        for u in users
    ]

    return Response(data, status=status.HTTP_200_OK)


# ----------------------------
# DELETE /api/admin/users/<id>/
# Deletes a user (a superuser cannot be deleted, for safety)
# ----------------------------
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def admin_delete_user(request, id):
    try:
        user = User.objects.get(id=id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    if user.is_superuser:
        return Response(
            {"error": "Superuser account cannot be deleted from here."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user.delete()
    return Response(
        {"message": "User deleted successfully."}, status=status.HTTP_200_OK
    )


# ----------------------------
# GET /api/admin/submissions/
# All submissions from all users in one place (with usernames)
# ----------------------------
@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_submissions_list(request):
    submissions = Submission.objects.select_related("user").order_by("-created_at")

    data = [
        {
            "id": sub.id,
            "username": sub.user.username,
            "text_preview": sub.input_text[:100],
            "prediction": sub.prediction,
            "confidence": sub.confidence,
            "created_at": sub.created_at,
        }
        for sub in submissions
    ]

    return Response(data, status=status.HTTP_200_OK)


# ----------------------------
# DELETE /api/admin/submissions/<id>/
# Deletes any user's submission (admin power)
# ----------------------------
@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def admin_delete_submission(request, id):
    try:
        submission = Submission.objects.get(id=id)
        submission.delete()
        return Response(
            {"message": "Submission deleted successfully."}, status=status.HTTP_200_OK
        )
    except Submission.DoesNotExist:
        return Response(
            {"error": "Submission not found."}, status=status.HTTP_404_NOT_FOUND
        )


# ----------------------------
# POST /api/admin/retrain/
# NOTE: This is a placeholder for now. The real training script needs to be
# called here (via subprocess or a management command) once it is ready.
# For now it only returns a success response so the UI/button can be tested.
# ----------------------------
@api_view(["POST"])
@permission_classes([IsAdminUser])
def admin_retrain(request):
    return Response(
        {
            "message": "Retrain request received. (Connect your actual training script here.)"
        },
        status=status.HTTP_200_OK,
    )
