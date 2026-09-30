import json

output_lines = [
    "# قاموس مفردات المرحلة الخامسة (الأيام 41 إلى 50) — 500 كلمة مع تصريفات الأفعال والترجمة العربية\n\n",
    "هذا الملف يحتوي على تجميع واستخراج شامل لجميع كلمات المرحلة الخامسة: العلاقات الاجتماعية والطموح والحياة اليومية المتقدمة من اليوم الحادي والأربعين حتى اليوم الخمسين، بعدد **50 كلمة لكل يوم** (إجمالي **500 كلمة فريدة 100% وبدون أي تكرار** على مستوى الـ 50 يوماً كاملة).\n\n",
    "تمت إضافة **تصريفات الأفعال الثلاثة (V1 / V2 / V3)** بجانب كل فعل لتسهيل الحفظ والمراجعة مع الترجمة الدقيقة لكل كلمة.\n\n",
    "---\n\n"
]

for day_num in range(41, 51):
    fname = f"content/day-{day_num:02d}.json"
    with open(fname, "r", encoding="utf-8") as f:
        data = json.load(f)

    output_lines.append(f"## 📅 اليوم {day_num}: {data['title']} ({data['topic']})\n\n")
    output_lines.append("| # | الكلمة (Word) | تصريفات الفعل (V1 / V2 / V3) | الترجمة العربية (Translation) |\n")
    output_lines.append("|---|---|---|---|\n")

    for idx, v in enumerate(data["vocabulary"], 1):
        hw = f"**{v['headword']}**"
        vf = v.get("verbForms")
        if vf and isinstance(vf, dict) and "v1" in vf:
            forms_str = f"`{vf['v1']}` / `{vf['v2']}` / `{vf['v3']}`"
        else:
            forms_str = "—"
        trans = v.get("translation", "")
        output_lines.append(f"| {idx} | {hw} | {forms_str} | {trans} |\n")

    output_lines.append("\n---\n\n")

with open("STAGE_5_VOCABULARY.md", "w", encoding="utf-8") as f:
    f.writelines(output_lines)

print("Successfully generated STAGE_5_VOCABULARY.md")
