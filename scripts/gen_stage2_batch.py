import json, os, re
from scripts.curriculum_engine import write_day, get_all_used_headwords, PLAN_BY_DAY
from scripts.gen_helpers import make_conversation, make_paragraph, link_vocab

used = get_all_used_headwords()

def build_vocab(raw_list):
    res = []
    for item in raw_list:
        h, p, pos, d, ex = item[0], item[1], item[2], item[3], item[4]
        tags = item[5] if len(item) > 5 else ["general"]
        rf = item[6] if len(item) > 6 else []
        col = item[7] if len(item) > 7 else []
        syn = item[8] if len(item) > 8 else []
        ant = item[9] if len(item) > 9 else []
        res.append({
            "headword": h, "pronunciation": p, "partOfSpeech": pos,
            "definition": d, "example": ex, "tags": tags,
            "relatedForms": rf, "collocations": col, "synonyms": syn, "antonyms": ant
        })
    return res

def check_no_dupes(vlist, day_num):
    for v in vlist:
        h = v["headword"].lower().strip()
        if h in used and used[h] != day_num:
            raise ValueError(f"Duplicate on Day {day_num} with Day {used[h]}: '{h}'")
        used[h] = day_num

def generate_day(day_num, raw_vocab, grammar, conv_specs, para_specs):
    vocab = build_vocab(raw_vocab)
    check_no_dupes(vocab, day_num)
    
    convs = [make_conversation(c[0], c[1], c[2], c[3]) for c in conv_specs]
    paras = [make_paragraph(p[0], p[1], p[2]) for p in para_specs]
    
    hws = [v["headword"] for v in vocab]
    convs = link_vocab(convs, hws)
    paras = link_vocab(paras, hws)
    
    write_day(day_num, vocab, grammar, convs, paras)
    print(f"Day {day_num} generated successfully!")

print("Stage 2 generator initialized.")
