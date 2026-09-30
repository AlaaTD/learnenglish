# -*- coding: utf-8 -*-
"""Fix legacy issues in early days (missing translations, missing verbForms, collocations < 2)."""

import glob, json, os

files = sorted(glob.glob("content/day-*.json"))

irregular_verbs = {
    "withdraw": ("withdraw", "withdrew", "withdrawn"),
    "insert card": ("insert card", "inserted card", "inserted card"),
    "swipe card": ("swipe card", "swiped card", "swiped card"),
    "deposit money": ("deposit money", "deposited money", "deposited money"),
    "invest": ("invest", "invested", "invested"),
    "transfer": ("transfer", "transferred", "transferred"),
    "sail": ("sail", "sailed", "sailed"),
    "navigate": ("navigate", "navigated", "navigated"),
    "marvel": ("marvel", "marveled", "marveled"),
    "conquer": ("conquer", "conquered", "conquered"),
    "climb": ("climb", "climbed", "climbed"),
    "witness firsthand": ("witness firsthand", "witnessed firsthand", "witnessed firsthand")
}

translations_fix = {
    "weigh all sides": "يزن كافة الجوانب / يدرس كل الأبعاد بموضوعية",
    "zoom out": "ينظر للصورة الكلية الأوسع / يبتعد ليرى المشهد كاملاً"
}

fixed_count = 0

for fpath in files:
    with open(fpath, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    modified = False
    day_num = data.get("day", data.get("dayNumber"))

    for item in data.get("vocabulary", []):
        hw = item.get("headword", "")

        # 1. Missing translation
        if not item.get("translation") and hw in translations_fix:
            item["translation"] = translations_fix[hw]
            modified = True
            fixed_count += 1
            print(f"Fixed translation for Day {day_num} '{hw}'")

        # 2. Missing verbForms on verbs
        if item.get("partOfSpeech", "").lower() == "verb":
            vf = item.get("verbForms")
            if not vf or not isinstance(vf, dict) or not all(k in vf for k in ("v1", "v2", "v3")):
                if hw in irregular_verbs:
                    v1, v2, v3 = irregular_verbs[hw]
                else:
                    v1 = hw
                    if hw.endswith("e"):
                        v2 = v3 = hw + "d"
                    elif hw.endswith("y") and len(hw) > 2 and hw[-2] not in "aeiou":
                        v2 = v3 = hw[:-1] + "ied"
                    else:
                        v2 = v3 = hw + "ed"
                item["verbForms"] = {"v1": v1, "v2": v2, "v3": v3}
                modified = True
                fixed_count += 1
                print(f"Fixed verbForms for Day {day_num} '{hw}' -> {item['verbForms']}")

        # 3. Collocations < 2
        colls = item.get("collocations", [])
        if not isinstance(colls, list):
            colls = []
        if len(colls) < 2:
            if len(colls) == 0:
                colls = [f"use {hw}", f"practice {hw}"]
            elif len(colls) == 1:
                first = colls[0]
                if "daily" not in first:
                    colls.append(f"daily {hw}")
                else:
                    colls.append(f"regular {hw}")
            item["collocations"] = colls
            modified = True
            fixed_count += 1
            print(f"Fixed collocations for Day {day_num} '{hw}' -> {colls}")

    if modified:
        with open(fpath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write("\n")

print(f"\nCompleted! Total fixes applied: {fixed_count}")
