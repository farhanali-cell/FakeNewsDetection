import os, csv, sys
from collections import Counter

csv.field_size_limit(min(sys.maxsize, 2**31 - 1))
ROOT = os.path.dirname(os.path.abspath(__file__))
SKIP = {"venv", "node_modules", ".git", "TruthLens_Urdu_Archive"}
WANTED = [
    "retrain_model.py",
    "test_topic_stratified.py",
    "topic_stratified_test_results.csv",
    "combined_training_data.csv",
]

found = {}
for dp, dn, fn in os.walk(ROOT):
    dn[:] = [d for d in dn if d not in SKIP]
    for f in fn:
        if f in WANTED:
            found.setdefault(f, []).append(os.path.join(dp, f))

# desktop par bhi dhoondo (dataset folder project ke bahar ho sakta hai)
desk = os.path.join(os.path.expanduser("~"), "Desktop")
for dp, dn, fn in os.walk(desk):
    dn[:] = [d for d in dn if d not in SKIP and d != "FakeNewsDetection"]
    for f in fn:
        if f in WANTED:
            found.setdefault(f, []).append(os.path.join(dp, f))

print("=== FILES FOUND ===")
for w in WANTED:
    print(w, "->", found.get(w, "NOT FOUND"))

KEYS = [
    "test_size",
    "random_state",
    "accuracy",
    "classification_report",
    "confusion_matrix",
    "LogisticRegression",
    "TfidfVectorizer",
    "max_features",
    "ngram",
    "stratify",
    "C=",
    "max_iter",
    "read_csv",
    "drop_duplicates",
    "dataset",
    "ISOT",
    "fake_and_real",
]

for name in ["retrain_model.py", "test_topic_stratified.py"]:
    for p in found.get(name, []):
        print("\n=== KEY LINES:", p, "===")
        with open(p, encoding="utf-8", errors="ignore") as fh:
            for i, line in enumerate(fh, 1):
                if any(k in line for k in KEYS):
                    print(f"{i}: {line.rstrip()}")

for p in found.get("topic_stratified_test_results.csv", []):
    print("\n=== RESULTS CSV:", p, "===")
    with open(p, encoding="utf-8", errors="ignore", newline="") as fh:
        rows = list(csv.reader(fh))
    print("rows (header ke baghair):", len(rows) - 1)
    for r in rows[:40]:
        print(r)

for p in found.get("combined_training_data.csv", []):
    print("\n=== TRAINING CSV:", p, "===")
    with open(p, encoding="utf-8", errors="ignore", newline="") as fh:
        rd = csv.reader(fh)
        header = next(rd)
        print("columns:", header)
        counters = [Counter() for _ in header]
        n = 0
        for row in rd:
            n += 1
            for i, v in enumerate(row[: len(header)]):
                if len(counters[i]) <= 50:
                    counters[i][v[:40]] += 1
    print("total rows:", n)
    for h, c in zip(header, counters):
        if len(c) <= 20:
            print(f"  {h}: {dict(c)}")
