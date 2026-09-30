# -*- coding: utf-8 -*-
"""Verification script for Stage 7 (Days 61-70) candidate headwords."""

import json, glob

def load_existing():
    existing = {}
    for f in sorted(glob.glob("content/day-*.json")):
        with open(f, "r", encoding="utf-8") as fp:
            d = json.load(fp)
            for v in d["vocabulary"]:
                hw = v["headword"].strip().lower()
                existing[hw] = d["day"]
    return existing

def verify_candidates(candidates_dict):
    existing = load_existing()
    all_new = {}
    errors = []

    for day, words in candidates_dict.items():
        if len(words) != 50:
            errors.append(f"Day {day} has {len(words)} words, expected 50.")
        
        seen_in_day = set()
        for w in words:
            w_norm = w.strip().lower()
            if w_norm in seen_in_day:
                errors.append(f"Day {day} internal duplicate: '{w}'")
            seen_in_day.add(w_norm)

            if w_norm in existing:
                errors.append(f"Day {day} word '{w}' already exists in Day {existing[w_norm]}!")
            
            if w_norm in all_new:
                errors.append(f"Day {day} word '{w}' duplicate with Day {all_new[w_norm]}!")
            else:
                all_new[w_norm] = day

    if errors:
        print(f"FAILED with {len(errors)} error(s):")
        for e in errors[:20]:
            print(" -", e)
        return False
    else:
        print(f"SUCCESS: All {len(all_new)} candidate headwords across {len(candidates_dict)} days are 100% unique!")
        return True

if __name__ == "__main__":
    print("Helper ready.")
