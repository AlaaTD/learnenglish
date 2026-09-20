import re
from scripts.curriculum_engine import write_day, get_all_used_headwords, PLAN_BY_DAY
from scripts.gen_helpers import link_vocab

used = get_all_used_headwords()

def register_and_validate_day(day_num, raw_vocab, grammar_data, dialogues_data, paragraphs_data, focus=None):
    """
    raw_vocab: list of 50 tuples (headword, ipa, pos, definition, example, tags)
    grammar_data: list of grammar dicts
    dialogues_data: list of 3 dicts: {'title', 'setting', 'speakers': (A, B), 'lines': [(0/1, text)]}
    paragraphs_data: list of 3 dicts: {'title', 'kind', 'text'}
    """
    assert len(raw_vocab) == 50, f"Day {day_num} must have 50 words, got {len(raw_vocab)}"
    vocab = []
    seen = set()
    for item in raw_vocab:
        hw = item[0].strip().lower()
        if hw in seen:
            raise ValueError(f"Internal duplicate in Day {day_num}: {hw}")
        if hw in used and used[hw] != day_num:
            raise ValueError(f"Duplicate on Day {day_num} with Day {used[hw]}: '{hw}'")
        seen.add(hw)
        used[hw] = day_num
        vocab.append({
            "headword": item[0],
            "pronunciation": item[1],
            "partOfSpeech": item[2],
            "definition": item[3],
            "example": item[4],
            "tags": item[5] if len(item) > 5 else ["general"],
            "relatedForms": item[6] if len(item) > 6 else [],
            "collocations": item[7] if len(item) > 7 else [],
            "synonyms": item[8] if len(item) > 8 else [],
            "antonyms": item[9] if len(item) > 9 else []
        })

    convs = []
    for d in dialogues_data:
        speakers = d["speakers"]
        lines = [{"speaker": speakers[s_idx], "text": text} for s_idx, text in d["lines"]]
        convs.append({
            "title": d["title"],
            "setting": d["setting"],
            "lines": lines,
            "vocabularyUsed": []
        })

    paras = []
    for p in paragraphs_data:
        paras.append({
            "title": p["title"],
            "kind": p["kind"],
            "text": p["text"],
            "vocabularyUsed": []
        })

    hws = [v["headword"] for v in vocab]
    convs = link_vocab(convs, hws)
    paras = link_vocab(paras, hws)

    write_day(day_num, vocab, grammar_data, convs, paras, focus=focus)
    print(f"Day {day_num} generated and written successfully!")

print("Generator factory loaded successfully.")
