# -*- coding: utf-8 -*-
"""Generate STAGE_4_VOCABULARY.md with tables and verb forms, and update vocabulary_days.txt."""

import json

irregular_verbs = {
    'hang': ('hang', 'hung', 'hung'),
    'reboot': ('reboot', 'rebooted', 'rebooted'),
    'install': ('install', 'installed', 'installed'),
    'uninstall': ('uninstall', 'uninstalled', 'uninstalled'),
    'reinstall': ('reinstall', 'reinstalled', 'reinstalled'),
    'configure': ('configure', 'configured', 'configured'),
    'customize': ('customize', 'customized', 'customized'),
    'assign': ('assign', 'assigned', 'assigned'),
    'delegate': ('delegate', 'delegated', 'delegated'),
    'streamline': ('streamline', 'streamlined', 'streamlined'),
    'accelerate': ('accelerate', 'accelerated', 'accelerated'),
    'defer': ('defer', 'deferred', 'deferred'),
    'push back': ('push back', 'pushed back', 'pushed back'),
    'oversee': ('oversee', 'oversaw', 'overseen'),
    'execute': ('execute', 'executed', 'executed'),
    'finalize': ('finalize', 'finalized', 'finalized'),
    'collaborate': ('collaborate', 'collaborated', 'collaborated'),
    'comply with': ('comply with', 'complied with', 'complied with'),
    'abide by': ('abide by', 'abided by', 'abided by'),
    'adhere to': ('adhere to', 'adhered to', 'adhered to'),
    'interact': ('interact', 'interacted', 'interacted'),
    'cooperate': ('cooperate', 'cooperated', 'cooperated'),
    'sync up': ('sync up', 'synced up', 'synced up'),
    'circle back': ('circle back', 'circled back', 'circled back'),
    'dial in': ('dial in', 'dialed in', 'dialed in'),
    'aspire to': ('aspire to', 'aspired to', 'aspired to'),
    'debug': ('debug', 'debugged', 'debugged'),
    'roll back': ('roll back', 'rolled back', 'rolled back'),
    'troubleshoot': ('troubleshoot', 'troubleshot', 'troubleshot'),
    'diagnose': ('diagnose', 'diagnosed', 'diagnosed'),
    'resolve': ('resolve', 'resolved', 'resolved'),
    'paraphrase': ('paraphrase', 'paraphrased', 'paraphrased'),
}

def get_verb_forms(hw, pos):
    pos_clean = pos.lower().strip()
    if pos_clean not in ['verb', 'phrasal verb', 'irregular verb']:
        return '—'
    w = hw.lower().strip()
    if w in irregular_verbs:
        v1, v2, v3 = irregular_verbs[w]
        return f'`{v1}` / `{v2}` / `{v3}`'
    
    if w.endswith('e'):
        past = w + 'd'
    elif w.endswith('y') and len(w) > 2 and w[-2] not in 'aeiou':
        past = w[:-1] + 'ied'
    else:
        past = w + 'ed'
    return f'`{w}` / `{past}` / `{past}`'

with open('content/curriculum-plan.json', encoding='utf-8') as f:
    plan = {d['day']: d for d in json.load(f)['days']}

lines = [
    '# قاموس مفردات المرحلة الرابعة (الأيام 31 إلى 40) — 500 كلمة مع تصريفات الأفعال والترجمة العربية\n',
    'هذا الملف يحتوي على تجميع واستخراج شامل لجميع كلمات المرحلة الرابعة: العمل والتكنولوجيا (Work, Career and Technology) من اليوم الحادي والثلاثين حتى اليوم الأربعين، بعدد **50 كلمة لكل يوم** (إجمالي **500 كلمة فريدة 100% وبدون أي تكرار**).\n',
    'تمت إضافة **تصريفات الأفعال الثلاثة (V1 / V2 / V3)** بجانب كل فعل لتسهيل الحفظ والمراجعة مع الترجمة الدقيقة لكل كلمة.\n',
    '---\n'
]

txt_append = []

for d in range(31, 41):
    p = plan[d]
    fname = f'content/day-{d}.json'
    with open(fname, encoding='utf-8') as jf:
        data = json.load(jf)
    
    lines.append(f'## 📅 اليوم {d}: {p["title"]} ({p["topic"]})\n')
    lines.append('| # | الكلمة (Word) | تصريفات الفعل (V1 / V2 / V3) | الترجمة العربية (Translation) |')
    lines.append('|---|---|---|---|')
    
    day_words = []
    for i, v in enumerate(data['vocabulary'], 1):
        hw = v['headword']
        pos = v['partOfSpeech']
        trans = v['translation']
        vf = get_verb_forms(hw, pos)
        lines.append(f'| {i} | **{hw}** | {vf} | {trans} |')
        day_words.append(hw)
    lines.append('\n---\n')
    
    txt_append.append(f'\n\n=== DAY {d} — {p["title"]} ===\n' + ','.join(day_words))

with open('STAGE_4_VOCABULARY.md', 'w', encoding='utf-8') as out:
    out.write('\n'.join(lines))

with open('vocabulary_days.txt', 'a', encoding='utf-8') as out_txt:
    out_txt.write(''.join(txt_append))

print('STAGE_4_VOCABULARY.md generated successfully!')
print('vocabulary_days.txt updated successfully!')
