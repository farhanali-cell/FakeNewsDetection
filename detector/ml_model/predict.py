import re
import math
import joblib
from pathlib import Path

MODELS_DIR = Path(__file__).resolve().parent / "models"

english_vectorizer = joblib.load(MODELS_DIR / "tfidf_vectorizer_v2.pkl")
english_model = joblib.load(MODELS_DIR / "fake_news_model_v2.pkl")
urdu_pipeline = joblib.load(MODELS_DIR / "pakistan_urdu_fake_true_svm.pkl")
# NAYA: ye ek Pipeline hai (steps: 'tfidf' + 'svm'), isliye vectorizer aur
# classifier ko andar se hi nikal rahe hain — taake dono hamesha consistent rahein.
urdu_vectorizer = urdu_pipeline.named_steps["tfidf"]
urdu_model = urdu_pipeline.named_steps["svm"]

CONFIDENCE_THRESHOLD = 65.0  # is se neeche = "uncertain"
MIN_WORD_COUNT = 15  # itne se kam words = "not enough content"


def clean_text(text: str) -> str:
    text = re.sub(r"[^\u0600-\u06FF\s]", " ", str(text))
    text = re.sub(r"\s+", " ", text).strip()
    return text


def clean_english_text(text: str) -> str:
    text = str(text).lower()
    text = re.sub(r"\[.*?\]", "", text)
    text = re.sub(r"https?://\S+|www\.\S+", "", text)
    text = re.sub(r"<.*?>+", "", text)
    text = re.sub(r"[^\w\s]", "", text)
    text = re.sub(r"\n", " ", text)
    text = re.sub(r"\w*\d\w*", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def is_urdu(text: str, threshold: float = 0.3) -> bool:
    text = str(text).strip()
    if not text:
        return False
    urdu_chars = len(re.findall(r"[\u0600-\u06FF]", text))
    return (urdu_chars / len(text)) > threshold


def get_confidence(model, vec, prediction):
    try:
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(vec)[0]
            classes = list(model.classes_)
            idx = classes.index(prediction)
            return round(float(proba[idx]) * 100, 2)
        if hasattr(model, "decision_function"):
            # NAYA: LinearSVC ke paas predict_proba nahi hota. Iski jagah
            # decision_function (hyperplane se distance) nikal k sigmoid se
            # 0-100% confidence approximate karte hain. Ye asal probability
            # nahi hai, sirf model kitna "sure" hai uska andaza hai.
            score = model.decision_function(vec)
            score = float(score[0]) if hasattr(score, "__len__") else float(score)
            approx_conf = 1 / (1 + math.exp(-abs(score)))
            return round(approx_conf * 100, 2)
    except Exception:
        pass
    return None


def get_top_keywords(model, vectorizer, vec, prediction, top_n=5):
    try:
        feature_names = vectorizer.get_feature_names_out()
        present_indices = vec.nonzero()[1]

        coefficients = None
        if hasattr(model, "coef_"):
            coefficients = model.coef_[0]
        elif hasattr(model, "estimators_"):
            coefs = [est.coef_[0] for est in model.estimators_ if hasattr(est, "coef_")]
            if coefs:
                coefficients = sum(coefs) / len(coefs)

        if coefficients is None:
            return []

        contributions = [
            (feature_names[i], float(vec[0, i] * coefficients[i]))
            for i in present_indices
        ]

        # NAYA: prediction ab string ho sakti hai (Urdu SVM) ya int (English model).
        # Jo class model.classes_[-1] (alphabetically/numerically bari) hoti hai wo
        # positive coefficient direction ke sath jati hai, isliye usay descending
        # order mein sort karte hain, warna ascending.
        classes = list(model.classes_) if hasattr(model, "classes_") else None
        if classes is not None:
            want_positive = prediction == classes[-1]
        else:
            want_positive = prediction == 1

        contributions.sort(key=lambda x: x[1], reverse=want_positive)
        return [word for word, _ in contributions[:top_n]]
    except Exception:
        return []


def predict_news(text: str) -> dict:
    # Bohat chota text ho to seedha "not enough content" bol do
    word_count = len(str(text).strip().split())
    if word_count < MIN_WORD_COUNT:
        return {
            "language": "Unknown",
            "prediction": "Uncertain",
            "confidence": None,
            "top_keywords": [],
            "message": "Not enough content to analyze confidently. Please paste a fuller article (at least a few sentences).",
        }

    if is_urdu(text):
        cleaned = clean_text(text)
        vec = urdu_vectorizer.transform([cleaned])
        pred = urdu_model.predict(vec)[0]  # "FAKE" ya "TRUE" (string)
        language = "Urdu"
        model, vectorizer = urdu_model, urdu_vectorizer
        label = "Fake" if pred == "FAKE" else "Real"
    else:
        cleaned = clean_english_text(text)
        vec = english_vectorizer.transform([cleaned])
        pred = english_model.predict(vec)[0]
        language = "English"
        model, vectorizer = english_model, english_vectorizer
        label = "Real" if pred == 1 else "Fake"

    confidence = get_confidence(model, vec, pred)
    top_keywords = get_top_keywords(model, vectorizer, vec, pred)

    # Agar confidence available ho aur low ho to "Uncertain" mark karo
    message = None
    if confidence is not None and confidence < CONFIDENCE_THRESHOLD:
        message = "Model isn't fully confident about this prediction — the text may not clearly resemble typical news content, or its style may differ from the training data. Please verify manually."

    return {
        "language": language,
        "prediction": label,
        "confidence": confidence,
        "top_keywords": top_keywords,
        "message": message,
    }
 