# -*- coding: utf-8 -*-
"""Generate STAGE_9_VOCABULARY.md and append Days 81-90 to vocabulary_days.txt."""

import json, os

STAGE_9_DOC = "STAGE_9_VOCABULARY.md"
VOCAB_DAYS_FILE = "vocabulary_days.txt"

content_lines = [
    "# قاموس مفردات المرحلة التاسعة (الأيام 81 إلى 90) — 500 كلمة مع تصريفات الأفعال والترجمة العربية",
    "",
    "هذا الملف يحتوي على تجميع واستخراج شامل لجميع كلمات المرحلة التاسعة والأخيرة: **التكامل والإنجليزية الواقعية (Integration — Real English)** من اليوم الحادي والثمانين حتى اليوم التسعين، بعدد **50 كلمة لكل يوم** (إجمالي **500 كلمة فريدة 100% وبدون أي تكرار** على مستوى المنهج كاملاً: **4,500 كلمة فريدة عبر 90 يوماً**).",
    "",
    "تمت إضافة **تصريفات الأفعال الثلاثة (V1 / V2 / V3)** بجانب كل فعل لتسهيل الحفظ والمراجعة مع الترجمة الدقيقة لكل كلمة وسياقها.",
    "",
    "---",
    ""
]

days_vocab_append = []

for day_num in range(81, 91):
    file_path = f"content/day-{day_num:02d}.json"
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    title = data.get("title", f"Day {day_num}")
    topic = data.get("topic", "")
    vocab_list = data.get("vocabulary", [])
    
    # Markdown section
    content_lines.append(f"## 📅 اليوم {day_num}: {title} ({topic})")
    content_lines.append("")
    content_lines.append("| # | الكلمة (Word) | تصريفات الفعل (V1 / V2 / V3) | الترجمة العربية (Translation) |")
    content_lines.append("|---|---|---|---|")
    
    day_words = []
    for idx, item in enumerate(vocab_list, 1):
        hw = item["headword"]
        trans = item.get("translation", "")
        day_words.append(hw)
        
        pos = item.get("partOfSpeech", "").lower()
        vf = item.get("verbForms")
        if pos == "verb" and vf and isinstance(vf, dict):
            v1 = vf.get("v1", hw)
            v2 = vf.get("v2", hw + "ed")
            v3 = vf.get("v3", hw + "ed")
            verb_col = f"`{v1}` / `{v2}` / `{v3}`"
        elif pos == "verb":
            verb_col = f"`{hw}` / `{hw}ed` / `{hw}ed`"
        else:
            verb_col = "—"
            
        content_lines.append(f"| {idx} | **{hw}** | {verb_col} | {trans} |")
        
    content_lines.append("")
    content_lines.append("---")
    content_lines.append("")
    
    # vocabulary_days.txt format
    days_vocab_append.append(f"=== DAY {day_num} — {title} ===")
    days_vocab_append.append(",".join(day_words))
    days_vocab_append.append("")

# Write STAGE_9_VOCABULARY.md
with open(STAGE_9_DOC, "w", encoding="utf-8") as f:
    f.write("\n".join(content_lines))
print(f"Generated {STAGE_9_DOC} successfully.")

# Append to vocabulary_days.txt if not already there
with open(VOCAB_DAYS_FILE, "r", encoding="utf-8") as f:
    existing_txt = f.read()

if "=== DAY 81" not in existing_txt:
    with open(VOCAB_DAYS_FILE, "a", encoding="utf-8") as f:
        f.write("\n" + "\n".join(days_vocab_append) + "\n")
    print(f"Appended Days 81-90 to {VOCAB_DAYS_FILE}.")
else:
    print(f"Days 81-90 already present in {VOCAB_DAYS_FILE}.")
