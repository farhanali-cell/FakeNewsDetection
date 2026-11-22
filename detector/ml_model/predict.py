import re
import joblib
from pathlib import Path
from .signals import analyze_signals
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

MODELS_DIR = Path(__file__).resolve().parent / "models"

english_vectorizer = joblib.load(MODELS_DIR / "tfidf_vectorizer_v2.pkl")
english_model = joblib.load(MODELS_DIR / "fake_news_model_v2.pkl")


CONFIDENCE_THRESHOLD = 60.0  # below this = "uncertain"
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
            if feature_names[i] not in ENGLISH_STOP_WORDS
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


def confidence_band(confidence):
    if confidence is None:
        return None
    if confidence >= 85:
        return "high"
    if confidence >= CONFIDENCE_THRESHOLD:
        return "moderate"
    return "low"


def build_explanation(label, leaning, confidence, top_keywords, signals):
    lines = []

    # Line 1: model verdict and confidence band
    if label == "Uncertain":
        lines.append(
            f"The model's confidence is low ({confidence}%), so no clear verdict is given. "
            f"The text leans slightly towards {leaning.lower()}, but the indicators are weak."
        )
    else:
        if confidence is None:
            line = f"The model rates this text as {label.lower()}."
        else:
            band = confidence_band(confidence)
            line = f"The model rates this text as {label.lower()} with {band} confidence ({confidence}%)."
        if top_keywords:
            line += f" Words that pushed the score most: {', '.join(top_keywords[:3])}."
        lines.append(line)

    # Line 2: sensational style indicators
    concerns = []
    if signals["caps_words"] >= 3 or signals["caps_ratio"] >= 0.05:
        concerns.append("frequent ALL-CAPS words")
    if signals["exclamation_count"] >= 3:
        concerns.append("repeated exclamation marks")
    if signals["clickbait_phrases"]:
        shown = ", ".join(f'"{p}"' for p in signals["clickbait_phrases"][:2])
        concerns.append(f"clickbait-style phrasing ({shown})")
    if signals["emotional_tone"] == "highly emotional":
        concerns.append("strongly emotional language")

    if concerns:
        lines.append("Style indicators worth noting: " + "; ".join(concerns) + ".")
    else:
        lines.append(
            "No strong sensational style indicators were found "
            "(ALL-CAPS, exclamation marks, clickbait phrases, emotional tone)."
        )

    # Line 3: credibility indicators
    supports = []
    if signals["attribution_count"] or signals["quote_count"]:
        supports.append("attributed sources or quotes")
    if signals["number_count"] + signals["date_count"] >= 2:
        supports.append("specific figures or dates")
    if signals["emotional_tone"] == "neutral":
        supports.append("a neutral tone")

    if supports:
        lines.append("Credibility indicators present: " + ", ".join(supports) + ".")
    else:
        lines.append(
            "Few credibility indicators were found (attributed sources, quotes, figures or dates)."
        )

    # Line 4: caution
    lines.append(
        "These are statistical indicators, not proof. Please verify important claims with trusted sources."
    )
    return lines


def predict_news(text: str) -> dict:
    # If the text is too short, return "not enough content" right away
    word_count = len(str(text).strip().split())
    if word_count < MIN_WORD_COUNT:
        return {
            "prediction": "Uncertain",
            "confidence": None,
            "top_keywords": [],
            "model_leaning": None,
            "explanation": [],
            "signals": None,
            "message": "Not enough content to analyze confidently. Please paste a fuller article (at least a few sentences).",
        }

    cleaned = clean_english_text(text)
    vec = english_vectorizer.transform([cleaned])
    pred = english_model.predict(vec)[0]
    model, vectorizer = english_model, english_vectorizer
    label = "Real" if pred == 1 else "Fake"

    confidence = get_confidence(model, vec, pred)
    top_keywords = get_top_keywords(model, vectorizer, vec, pred)

    # Model ka jhukao (leaning) alag save karte hain, kyunke low confidence par verdict Uncertain ho jayega
    model_leaning = label
    message = None
    if confidence is not None and confidence < CONFIDENCE_THRESHOLD:
        label = "Uncertain"
        message = "The model is not confident enough to give a clear verdict. The text may not clearly resemble typical news content, or its style may differ from the training data. Please verify manually."

    # Signals raw text par nikalte hain (cleaned text mein caps aur punctuation hat chuke hote hain)
    signals = analyze_signals(text)
    explanation = build_explanation(
        label, model_leaning, confidence, top_keywords, signals
    )

    return {
        "prediction": label,
        "model_leaning": model_leaning,
        "confidence": confidence,
        "top_keywords": top_keywords,
        "explanation": explanation,
        "signals": signals,
        "message": message,
    }
