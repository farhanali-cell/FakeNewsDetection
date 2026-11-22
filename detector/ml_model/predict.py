import re
import joblib
from pathlib import Path

MODELS_DIR = Path(__file__).resolve().parent / "models"

english_vectorizer = joblib.load(MODELS_DIR / "tfidf_vectorizer_v2.pkl")
english_model = joblib.load(MODELS_DIR / "fake_news_model_v2.pkl")


CONFIDENCE_THRESHOLD = 65.0  # below this = "uncertain"
MIN_WORD_COUNT = 15  # fewer words than this = "not enough content"


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


def get_confidence(model, vec, prediction):
    try:
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(vec)[0]
            classes = list(model.classes_)
            idx = classes.index(prediction)
            return round(float(proba[idx]) * 100, 2)
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

        # In the English model, the classes are 0 (Fake) and 1 (Real). The class
        # at model.classes_[-1] (i.e. 1 = Real) goes with the positive coefficient
        # direction, so we sort in descending order for Real and ascending for Fake.

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
    # If the text is too short, return "not enough content" right away
    word_count = len(str(text).strip().split())
    if word_count < MIN_WORD_COUNT:
        return {
            "prediction": "Uncertain",
            "confidence": None,
            "top_keywords": [],
            "message": "Not enough content to analyze confidently. Please paste a fuller article (at least a few sentences).",
        }

    cleaned = clean_english_text(text)
    vec = english_vectorizer.transform([cleaned])
    pred = english_model.predict(vec)[0]
    model, vectorizer = english_model, english_vectorizer
    label = "Real" if pred == 1 else "Fake"

    confidence = get_confidence(model, vec, pred)
    top_keywords = get_top_keywords(model, vectorizer, vec, pred)

    # If confidence is available and low, flag the result as uncertain
    message = None
    if confidence is not None and confidence < CONFIDENCE_THRESHOLD:
        message = "Model isn't fully confident about this prediction — the text may not clearly resemble typical news content, or its style may differ from the training data. Please verify manually."

    return {
        "prediction": label,
        "confidence": confidence,
        "top_keywords": top_keywords,
        "message": message,
    }
