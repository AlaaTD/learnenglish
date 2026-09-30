# -*- coding: utf-8 -*-
"""Generate STAGE_7_VOCABULARY.md and append Days 61-70 to vocabulary_days.txt."""

import json

# 1. Generate STAGE_7_VOCABULARY.md
output_lines = [
    "# قاموس مفردات المرحلة السابعة (الأيام 61 إلى 70) — 500 كلمة مع تصريفات الأفعال والترجمة العربية\n\n",
    "هذا الملف يحتوي على تجميع واستخراج شامل لجميع كلمات المرحلة السابعة: المشكلات والقرارات والآراء (Problems, Decisions and Opinions) من اليوم الحادي والستين حتى اليوم السبعين، بعدد **50 كلمة لكل يوم** (إجمالي **500 كلمة فريدة 100% وبدون أي تكرار** على مستوى الـ 70 يوماً كاملة: 3,500 كلمة فريدة).\n\n",
    "تمت إضافة **تصريفات الأفعال الثلاثة (V1 / V2 / V3)** بجانب كل فعل لتسهيل الحفظ والمراجعة مع الترجمة الدقيقة لكل كلمة.\n\n",
    "---\n\n"
]

txt_append_lines = []

for day_num in range(61, 71):
    fname = f"content/day-{day_num}.json"
    with open(fname, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Markdown
    output_lines.append(f"## 📅 اليوم {day_num}: {data['title']} ({data['topic']})\n\n")
    output_lines.append("| # | الكلمة (Word) | تصريفات الفعل (V1 / V2 / V3) | الترجمة العربية (Translation) |\n")
    output_lines.append("|---|---|---|---|\n")
    
    day_words = []
    for idx, v in enumerate(data["vocabulary"], 1):
        hw_str = v["headword"]
        day_words.append(hw_str)
        hw = f"**{hw_str}**"
        vf = v.get("verbForms")
        if vf and isinstance(vf, dict) and "v1" in vf:
            forms_str = f"`{vf['v1']}` / `{vf['v2']}` / `{vf['v3']}`"
        else:
            forms_str = "—"
        trans = v.get("translation", "")
        output_lines.append(f"| {idx} | {hw} | {forms_str} | {trans} |\n")
    
    output_lines.append("\n---\n\n")
    
    # Text file format
    txt_append_lines.append(f"=== DAY {day_num} — {data['title']} ===\n")
    txt_append_lines.append(",".join(day_words) + "\n\n")

# Write STAGE_7_VOCABULARY.md
with open("STAGE_7_VOCABULARY.md", "w", encoding="utf-8") as f:
    f.writelines(output_lines)
print("Successfully generated STAGE_7_VOCABULARY.md")

# Append to vocabulary_days.txt
with open("vocabulary_days.txt", "a", encoding="utf-8") as f:
    f.writelines(txt_append_lines)
print("Successfully appended Days 61-70 to vocabulary_days.txt")
