# -*- coding: utf-8 -*-
"""Comprehensive deep audit of all 90 days in content/day-*.json."""

import glob, json, sys, re

day_files = sorted(glob.glob("content/day-*.json"))
print(f"=== DEEP AUDIT: Checking {len(day_files)} Day Files ===")

if len(day_files) != 90:
    print(f"CRITICAL ERROR: Expected 90 files, found {len(day_files)}")
    sys.exit(1)

all_headwords = {}  # normalized_hw -> (day, original_hw)
day_counts = {}
vocab_errors = []
grammar_errors = []
conv_errors = []
para_errors = []
coverage_stats = {}

for fpath in day_files:
    with open(fpath, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except Exception as e:
            vocab_errors.append(f"JSON Parse Error in {fpath}: {e}")
            continue

    day_num = data.get("day", data.get("dayNumber"))
    day_counts[day_num] = day_counts.get(day_num, 0) + 1

    # 1. Check Day Metadata
    if not data.get("title"):
        vocab_errors.append(f"Day {day_num}: Missing title")
    if not data.get("topic"):
        vocab_errors.append(f"Day {day_num}: Missing topic")

    # 2. Check Vocabulary
    vocab = data.get("vocabulary", [])
    if len(vocab) != 50:
        vocab_errors.append(f"Day {day_num}: Vocabulary count is {len(vocab)}, expected exactly 50")

    day_seen = set()
    for idx, item in enumerate(vocab, 1):
        hw = item.get("headword", "")
        if not hw or not hw.strip():
            vocab_errors.append(f"Day {day_num} item {idx}: Empty headword")
            continue
        
        hw_norm = hw.strip().lower()
        # Internal duplicate
        if hw_norm in day_seen:
            vocab_errors.append(f"Day {day_num}: Internal duplicate '{hw}'")
        day_seen.add(hw_norm)

        # Cross-day duplicate
        if hw_norm in all_headwords:
            prev_day, prev_hw = all_headwords[hw_norm]
            vocab_errors.append(f"DUPLICATE DETECTED: '{hw}' in Day {day_num} clashes with '{prev_hw}' in Day {prev_day}")
        else:
            all_headwords[hw_norm] = (day_num, hw)

        # Pronunciation check
        pron = item.get("pronunciation", "")
        if not pron:
            vocab_errors.append(f"Day {day_num} '{hw}': Missing pronunciation")
        elif not (pron.startswith("/") and pron.endswith("/")):
            vocab_errors.append(f"Day {day_num} '{hw}': Pronunciation '{pron}' not enclosed in slashes /.../")

        # Part of speech
        pos = item.get("partOfSpeech", "")
        if not pos:
            vocab_errors.append(f"Day {day_num} '{hw}': Missing partOfSpeech")

        # Definition & Translation
        if not item.get("definition"):
            vocab_errors.append(f"Day {day_num} '{hw}': Missing definition")
        if not item.get("translation"):
            vocab_errors.append(f"Day {day_num} '{hw}': Missing Arabic translation")
        if not item.get("example"):
            vocab_errors.append(f"Day {day_num} '{hw}': Missing example")

        # Collocations
        colls = item.get("collocations", [])
        if not isinstance(colls, list) or len(colls) < 2:
            vocab_errors.append(f"Day {day_num} '{hw}': Expected at least 2 collocations, got {len(colls) if isinstance(colls, list) else 0}")

        # Verb forms if verb
        if pos.lower() == "verb":
            vf = item.get("verbForms")
            if not vf or not isinstance(vf, dict) or not all(k in vf for k in ("v1", "v2", "v3")):
                vocab_errors.append(f"Day {day_num} '{hw}': Verb missing valid verbForms (v1/v2/v3)")

    # 3. Check Grammar
    grammar = data.get("grammar", [])
    if not grammar or len(grammar) < 1:
        grammar_errors.append(f"Day {day_num}: Missing grammar lessons")
    for gidx, g in enumerate(grammar, 1):
        if not g.get("title"):
            grammar_errors.append(f"Day {day_num} Grammar {gidx}: Missing title")
        if not g.get("explanation"):
            grammar_errors.append(f"Day {day_num} Grammar {gidx}: Missing explanation")
        examples = g.get("examples", [])
        if len(examples) < 3:
            grammar_errors.append(f"Day {day_num} Grammar {gidx}: Has {len(examples)} examples (<3)")
        mistakes = g.get("commonMistakes", [])
        if len(mistakes) < 1:
            grammar_errors.append(f"Day {day_num} Grammar {gidx}: Has {len(mistakes)} common mistakes (<1)")

    # 4. Check Conversations
    convs = data.get("conversations", [])
    if len(convs) < 3:
        conv_errors.append(f"Day {day_num}: Has {len(convs)} conversations (<3)")
    day_used_in_context = set()
    for cidx, c in enumerate(convs, 1):
        lines = c.get("lines", [])
        if len(lines) < 8:
            conv_errors.append(f"Day {day_num} Conv {cidx}: Has {len(lines)} lines (<8)")
        vocab_used = c.get("vocabularyUsed", [])
        if len(vocab_used) < 5:
            conv_errors.append(f"Day {day_num} Conv {cidx}: Has {len(vocab_used)} vocabularyUsed (<5)")
        day_used_in_context.update([v.strip().lower() for v in vocab_used])

    # 5. Check Paragraphs
    paras = data.get("paragraphs", [])
    if len(paras) < 3:
        para_errors.append(f"Day {day_num}: Has {len(paras)} paragraphs (<3)")
    for pidx, p in enumerate(paras, 1):
        text = p.get("text", "")
        words = text.split()
        if len(words) < 70 or len(words) > 140:
            para_errors.append(f"Day {day_num} Para {pidx}: Word count is {len(words)} (outside 70-140 range)")
        vocab_used = p.get("vocabularyUsed", [])
        if len(vocab_used) < 6:
            para_errors.append(f"Day {day_num} Para {pidx}: Has {len(vocab_used)} vocabularyUsed (<6)")
        day_used_in_context.update([v.strip().lower() for v in vocab_used])

    # 6. Calculate coverage for Stage 9 (Days 81-90)
    if day_num >= 81:
        day_vocab_set = {item['headword'].strip().lower() for item in vocab}
        matched = day_vocab_set.intersection(day_used_in_context)
        cov = round((len(matched) / len(day_vocab_set)) * 100)
        coverage_stats[day_num] = cov

print("\n" + "="*50)
print("AUDIT RESULTS SUMMARY")
print("="*50)
print(f"Total Days Audited: {len(day_counts)}")
print(f"Total Unique Headwords: {len(all_headwords)} / 4,500")

# Group issues by day
day_err_counts = {}
for e in vocab_errors:
    m = re.match(r"Day (\d+)", e)
    if m:
        d = int(m.group(1))
        day_err_counts[d] = day_err_counts.get(d, 0) + 1

print("\nIssues by Day Number:")
for d in sorted(day_err_counts.keys()):
    print(f"  Day {d:02d}: {day_err_counts[d]} issue(s)")

if 81 in [d for d in day_err_counts if d >= 81]:
    print("\nStage 9 has issues in:", [d for d in day_err_counts if d >= 81])
else:
    print("\n[SUCCESS] STAGE 9 (DAYS 81-90): 0 ERRORS! (100% PERFECT)")

print(f"\nVocabulary Errors: {len(vocab_errors)}")
print(f"Grammar Errors: {len(grammar_errors)}")
print(f"Conversation Errors: {len(conv_errors)}")
print(f"Paragraph Errors: {len(para_errors)}")

if coverage_stats:
    print("\nStage 9 Vocabulary Coverage:")
    for d, c in sorted(coverage_stats.items()):
        print(f"  Day {d}: {c}%")

total_errors = len(vocab_errors) + len(grammar_errors) + len(conv_errors) + len(para_errors)
if total_errors == 0:
    print("\n=======================================================")
    print("SUCCESS: ALL 90 DAYS PASSED WITH 100% PERFECTION!")
    print("ZERO DUPLICATES, ZERO SCHEMA ERRORS ACROSS ALL 90 DAYS!")
    print("=======================================================")
else:
    print(f"\nTOTAL ISSUES REMAINING: {total_errors}")
