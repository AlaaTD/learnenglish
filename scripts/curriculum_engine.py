import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(ROOT, "content")
PLAN_PATH = os.path.join(CONTENT_DIR, "curriculum-plan.json")

with open(PLAN_PATH, "r", encoding="utf-8") as f:
    PLAN = json.load(f)

PLAN_BY_DAY = {d["day"]: d for d in PLAN["days"]}

def get_all_used_headwords(exclude_day=None):
    used = {}
    for fname in sorted(os.listdir(CONTENT_DIR)):
        m = re.match(r"^day-(\d{2})\.json$", fname)
        if m:
            day_num = int(m.group(1))
            if exclude_day is not None and day_num == exclude_day:
                continue
            with open(os.path.join(CONTENT_DIR, fname), "r", encoding="utf-8") as f:
                data = json.load(f)
                for v in data.get("vocabulary", []):
                    hw = v["headword"].strip().lower()
                    if hw not in used:
                        used[hw] = day_num
    return used

def write_day(day_num, vocabulary, grammar, conversations, paragraphs, focus=None):
    plan_info = PLAN_BY_DAY[day_num]
    assert len(vocabulary) == 50, f"Day {day_num} must have exactly 50 vocabulary items, got {len(vocabulary)}"
    
    # Check duplicate within day
    seen = set()
    for v in vocabulary:
        hw = v["headword"].strip().lower()
        if hw in seen:
            raise ValueError(f"Day {day_num} has internal duplicate: {hw}")
        seen.add(hw)
        assert v.get("pronunciation", "").startswith("/"), f"Day {day_num} '{hw}' pronunciation must start with /"
        assert v.get("partOfSpeech"), f"Day {day_num} '{hw}' missing partOfSpeech"
        assert v.get("definition"), f"Day {day_num} '{hw}' missing definition"
        assert v.get("example"), f"Day {day_num} '{hw}' missing example"
        for field in ["relatedForms", "collocations", "synonyms", "antonyms", "tags"]:
            if field not in v:
                v[field] = []

    # Check grammar titles match plan
    plan_grammar = plan_info["grammar"]
    assert len(grammar) == len(plan_grammar), f"Day {day_num} grammar count {len(grammar)} != plan {len(plan_grammar)}"
    for i, g in enumerate(grammar):
        assert g["title"] == plan_grammar[i], f"Day {day_num} grammar title '{g['title']}' != plan '{plan_grammar[i]}'"
        assert len(g.get("examples", [])) >= 3, f"Day {day_num} grammar #{i+1} must have >= 3 examples"
        assert len(g.get("commonMistakes", [])) >= 1, f"Day {day_num} grammar #{i+1} must have >= 1 common mistake"

    # Check conversations
    assert len(conversations) >= 3, f"Day {day_num} must have >= 3 conversations"
    used_in_context = set()
    for ci, c in enumerate(conversations):
        assert len(c["lines"]) >= 8, f"Day {day_num} conv '{c['title']}' has {len(c['lines'])} lines (<8)"
        assert len(c["vocabularyUsed"]) >= 5, f"Day {day_num} conv '{c['title']}' has {len(c['vocabularyUsed'])} words (<5)"
        for w in c["vocabularyUsed"]:
            key = w.strip().lower()
            assert key in seen, f"Day {day_num} conv '{c['title']}' uses unknown word '{w}'"
            used_in_context.add(key)

    # Check paragraphs
    assert len(paragraphs) >= 3, f"Day {day_num} must have >= 3 paragraphs"
    for pi, p in enumerate(paragraphs):
        words_count = len(p["text"].strip().split())
        assert 70 <= words_count <= 140, f"Day {day_num} para '{p['title']}' has {words_count} words (need 70-140)"
        assert len(p["vocabularyUsed"]) >= 6, f"Day {day_num} para '{p['title']}' has {len(p['vocabularyUsed'])} words (<6)"
        for w in p["vocabularyUsed"]:
            key = w.strip().lower()
            assert key in seen, f"Day {day_num} para '{p['title']}' uses unknown word '{w}'"
            used_in_context.add(key)

    coverage = round((len(used_in_context) / len(seen)) * 100)
    assert coverage >= 80, f"Day {day_num} coverage is {coverage}% (<80%)"

    data = {
        "day": day_num,
        "title": plan_info["title"],
        "topic": plan_info["topic"],
        "description": plan_info["description"],
        "stage": plan_info["stage"],
        "focus": focus or f"By the end of today, you can communicate clearly about {plan_info['topic'].lower()} using the day's 50 vocabulary items and grammar.",
        "grammar": grammar,
        "vocabulary": vocabulary,
        "conversations": conversations,
        "paragraphs": paragraphs
    }

    fname = f"day-{str(day_num).zfill(2)}.json"
    target_path = os.path.join(CONTENT_DIR, fname)
    with open(target_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Successfully wrote {fname} (coverage: {coverage}%)")

print("Curriculum engine loaded successfully.")
