import re
import requests
import trafilatura
from rest_framework.permissions import IsAuthenticated
from .models import Submission
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.conf import settings
from django.contrib.auth.models import User
from .models import ContactMessage
from .serializers import ContactMessageSerializer
from detector.ml_model.predict import predict_news

# NAYA: agar input ek URL lage to isse match karega
URL_REGEX = re.compile(r"^https?://\S+$")


def extract_text_from_url(url: str):
    """
    URL se article ka clean text nikalta hai.
    Return: (text, error_message) — dono mein se ek hamesha None hoga.
    """
    downloaded = None
    try:
        downloaded = trafilatura.fetch_url(url)
    except Exception:
        downloaded = None

    if not downloaded:
        # Fallback: kuch sites trafilatura ka default fetcher block kar deti
        # hain, isliye normal requests se bhi try kar lete hain (browser jaisa
        # User-Agent bhej k, warna kai sites bot samajh k block kar deti hain).
        try:
            resp = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
            resp.raise_for_status()
            downloaded = resp.text
        except Exception:
            return (
                None,
                "Is URL tak pohanchne mein masla hua. Link check karein ya seedha text paste karein.",
            )

    try:
        extracted = trafilatura.extract(downloaded)
    except Exception:
        extracted = None

    if not extracted or len(extracted.strip()) < 30:
        return (
            None,
            "Is URL se article extract nahi ho saka. Please article ka text seedha paste karein.",
        )

    return extracted.strip(), None


# ============================
# API Endpoint: /api/detect/
# Model loading ab sirf predict.py mein hota hai (Urdu + English dono).
# Yahan views.py mein alag se koi joblib.load() nahi — wahi purana
# duplicate loading crash ki wajah tha.
#
# NAYA: ab ye endpoint plain text AUR URL dono accept karta hai.
# Agar input ek URL lage, pehle uska article text extract karte hain,
# phir wahi extracted text predict_news() ko bhejte hain.
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

    label = result["prediction"].upper()  # "REAL" ya "FAKE"
    language = result["language"]
    confidence = result["confidence"] if result["confidence"] is not None else 0
    top_keywords = result["top_keywords"]

    # Database mein save karo
    Submission.objects.create(
        user=request.user,
        input_text=text,
        prediction=label,
        confidence=confidence,
    )

    return Response(
        {
            "prediction": label,
            "language": language,
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
        # Security ke liye: hamesha same success message do,
        # taake koi ye pata na laga sake konsa email registered hai
        return Response(
            {"message": "If this email is registered, a reset link has been sent."},
            status=status.HTTP_200_OK,
        )

    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = token_generator.make_token(user)
    reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"

    send_mail(
        subject="Reset your TruthLens password",
        message=f"Click the link below to reset your password:\n\n{reset_link}\n\nIf you did not request this, ignore this email.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
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

        # Admin ko notification email
        try:
            send_mail(
                subject=f"[TruthLens Contact] {contact.subject}",
                message=(
                    f"From: {contact.name} ({contact.email})\n\n" f"{contact.message}"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.EMAIL_HOST_USER],
                fail_silently=True,
            )
        except Exception:
            pass  # message DB mein save ho chuka, email fail hone se request fail nahi honi chahiye

        return Response(
            {"message": "Your message has been sent successfully."},
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
