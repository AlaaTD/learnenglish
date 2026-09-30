# -*- coding: utf-8 -*-
"""Verify all 90 days in content/day-*.json."""

import glob, json, sys

files = sorted(glob.glob("content/day-*.json"))
print(f"Total day files found: {len(files)}")

if len(files) != 90:
    print(f"ERROR: Expected 90 files, found {len(files)}")

all_words = {}
errors = []

for f in files:
    with open(f, "r", encoding="utf-8") as fp:
        data = json.load(fp)
    day = data.get("day", data.get("dayNumber"))
    vocab = data["vocabulary"]
    if len(vocab) != 50:
        errors.append(f"Day {day} has {len(vocab)} words instead of 50")
    seen_in_day = set()
    for item in vocab:
        hw = item["headword"].strip().lower()
        if hw in seen_in_day:
            errors.append(f"Day {day} internal duplicate: {hw}")
        seen_in_day.add(hw)
        if hw in all_words:
            errors.append(f"Duplicate: '{hw}' in Day {day} and Day {all_words[hw]}")
        else:
            all_words[hw] = day

print(f"Total unique headwords across all files: {len(all_words)}")
if errors:
    print(f"FAILED with {len(errors)} error(s):")
    for e in errors[:25]:
        print(" -", e)
    sys.exit(1)
else:
    print("PERFECT SUCCESS! All 90 days have exactly 50 words each (4,500 words total) with ZERO duplicates!")
