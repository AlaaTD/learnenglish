import json, glob

existing = {}
for f in sorted(glob.glob("content/day-*.json")):
    with open(f, "r", encoding="utf-8") as fp:
        d = json.load(fp)
        day = d["day"]
        for v in d["vocabulary"]:
            hw = v["headword"].strip().lower()
            if hw in existing:
                print(f"DUPLICATE: {hw} in day {day} and day {existing[hw]}")
            existing[hw] = day

print(f"Total verified unique headwords in content/: {len(existing)}")
