import json, glob, os

def get_existing_words():
    existing = {}
    for f in sorted(glob.glob("content/day-*.json")):
        with open(f, "r", encoding="utf-8") as fp:
            d = json.load(fp)
            day = d["day"]
            for v in d["vocabulary"]:
                hw = v["headword"].strip().lower()
                if hw not in existing:
                    existing[hw] = day
    return existing

if __name__ == "__main__":
    words = get_existing_words()
    print(f"Loaded {len(words)} unique existing headwords.")
