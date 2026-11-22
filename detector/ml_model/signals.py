import re
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Analyzer ek hi baar banta hai (module load par), har request par nahi
_analyzer = SentimentIntensityAnalyzer()

CLICKBAIT_PHRASES = [
    "you won't believe",
    "shocking",
    "mind-blowing",
    "jaw-dropping",
    "what happens next",
    "doctors hate",
    "they don't want you to know",
    "what they aren't telling you",
    "exposed",
    "miracle",
    "share before",
    "goes viral",
    "must see",
    "secret",
]

# Word boundary ke saath match, taake "secret" "Secretary" mein na mile
CLICKBAIT_REGEX = [(p, re.compile(rf"\b{re.escape(p)}\b")) for p in CLICKBAIT_PHRASES]

ATTRIBUTION_PATTERN = re.compile(
    r"\b(said|says|according to|told|reported|announced|stated|confirmed|explained)\b",
    re.IGNORECASE,
)
QUOTE_PATTERN = re.compile(r'[\u201c"]([^\u201d"]{5,}?)[\u201d"]')
NUMBER_PATTERN = re.compile(r"\b\d[\d,.]*%?")

_MONTHS = (
    r"(?:january|february|march|april|may|june|july|august|september|october|"
    r"november|december|jan|feb|mar|apr|jun|jul|aug|sept|sep|oct|nov|dec)\.?"
)
DATE_PATTERN = re.compile(
    rf"\b{_MONTHS}\s+\d{{1,2}}\b"
    rf"|\b\d{{1,2}}\s+{_MONTHS}"
    r"|\b(?:19|20)\d{2}\b"
    r"|\b(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b",
    re.IGNORECASE,
)

STRONG_EMOTION_THRESHOLD = (
    0.5  # sentence-level |VADER compound| is se upar = strongly emotional
)
MAX_SENTENCES = 200  # bohat lambe text par speed control


def _split_sentences(text: str):
    parts = re.split(r"(?<=[.!?])\s+", text.strip())
    return [p for p in parts if p.strip()]


def _tone_label(share: float) -> str:
    # Thresholds heuristic hain, real articles par testing ke baad tune honge
    if share < 0.15:
        return "neutral"
    if share < 0.35:
        return "moderately emotional"
    return "highly emotional"


def analyze_signals(text: str) -> dict:
    text = str(text).replace("\u2019", "'")  # curly apostrophe ko straight karo
    lowered = text.lower()

    words = re.findall(r"[A-Za-z]+", text)
    total_words = len(words)

    # ALL CAPS: sirf 4+ letters wale words (chhote acronyms ignore)
    caps_words = [w for w in words if len(w) >= 4 and w.isupper()]
    caps_ratio = len(caps_words) / total_words if total_words else 0.0

    clickbait_found = [p for p, rx in CLICKBAIT_REGEX if rx.search(lowered)]

    sentences = _split_sentences(text)[:MAX_SENTENCES]
    compounds = [_analyzer.polarity_scores(s)["compound"] for s in sentences]
    if compounds:
        strong = sum(1 for c in compounds if abs(c) >= STRONG_EMOTION_THRESHOLD)
        emotional_share = strong / len(compounds)
        avg_sentiment = sum(compounds) / len(compounds)
    else:
        emotional_share = 0.0
        avg_sentiment = 0.0

    sentence_word_counts = [len(s.split()) for s in sentences]
    avg_sentence_length = (
        sum(sentence_word_counts) / len(sentence_word_counts)
        if sentence_word_counts
        else 0.0
    )

    return {
        "word_count": len(text.split()),
        "caps_words": len(caps_words),
        "caps_ratio": round(caps_ratio, 3),
        "exclamation_count": text.count("!"),
        "clickbait_phrases": clickbait_found,
        "emotional_share": round(emotional_share, 2),
        "emotional_tone": _tone_label(emotional_share),
        "avg_sentiment": round(avg_sentiment, 2),
        "quote_count": len(QUOTE_PATTERN.findall(text)),
        "attribution_count": len(ATTRIBUTION_PATTERN.findall(text)),
        "number_count": len(NUMBER_PATTERN.findall(text)),
        "date_count": len(DATE_PATTERN.findall(text)),
        "avg_sentence_length": round(avg_sentence_length, 1),
    }
