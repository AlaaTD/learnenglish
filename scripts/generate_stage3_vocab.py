# -*- coding: utf-8 -*-
"""Generate STAGE_3_VOCABULARY.md with tables and verb forms."""

import json

irregular_verbs = {
    'wear': ('wear', 'wore', 'worn'),
    'pay': ('pay', 'paid', 'paid'),
    'tell': ('tell', 'told', 'told'),
    'say': ('say', 'said', 'said'),
    'speak': ('speak', 'spoke', 'spoken'),
    'take': ('take', 'took', 'taken'),
    'give': ('give', 'gave', 'given'),
    'get': ('get', 'got', 'gotten'),
    'have': ('have', 'had', 'had'),
    'make': ('make', 'made', 'made'),
    'do': ('do', 'did', 'done'),
    'go': ('go', 'went', 'gone'),
    'see': ('see', 'saw', 'seen'),
    'come': ('come', 'came', 'come'),
    'know': ('know', 'knew', 'known'),
    'think': ('think', 'thought', 'thought'),
    'find': ('find', 'found', 'found'),
    'leave': ('leave', 'left', 'left'),
    'feel': ('feel', 'felt', 'felt'),
    'bring': ('bring', 'brought', 'brought'),
    'begin': ('begin', 'began', 'begun'),
    'keep': ('keep', 'kept', 'kept'),
    'hold': ('hold', 'held', 'held'),
    'write': ('write', 'wrote', 'written'),
    'stand': ('stand', 'stood', 'stood'),
    'hear': ('hear', 'heard', 'heard'),
    'let': ('let', 'let', 'let'),
    'mean': ('mean', 'meant', 'meant'),
    'set': ('set', 'set', 'set'),
    'meet': ('meet', 'met', 'met'),
    'run': ('run', 'ran', 'run'),
    'show': ('show', 'showed', 'shown'),
    'sit': ('sit', 'sat', 'sat'),
    'lie': ('lie', 'lay', 'lain'),
    'lead': ('lead', 'led', 'led'),
    'read': ('read', 'read', 'read'),
    'grow': ('grow', 'grew', 'grown'),
    'lose': ('lose', 'lost', 'lost'),
    'fall': ('fall', 'fell', 'fallen'),
    'send': ('send', 'sent', 'sent'),
    'build': ('build', 'built', 'built'),
    'understand': ('understand', 'understood', 'understood'),
    'draw': ('draw', 'drew', 'drawn'),
    'break': ('break', 'broke', 'broken'),
    'spend': ('spend', 'spent', 'spent'),
    'cut': ('cut', 'cut', 'cut'),
    'rise': ('rise', 'rose', 'risen'),
    'drive': ('drive', 'drove', 'driven'),
    'buy': ('buy', 'bought', 'bought'),
    'choose': ('choose', 'chose', 'chosen'),
    'eat': ('eat', 'ate', 'eaten'),
    'drink': ('drink', 'drank', 'drunk'),
    'sleep': ('sleep', 'slept', 'slept'),
    'fly': ('fly', 'flew', 'flown'),
    'swim': ('swim', 'swam', 'swum'),
    'ride': ('ride', 'rode', 'ridden'),
    'wake': ('wake', 'woke', 'woken'),
    'sell': ('sell', 'sold', 'sold'),
    'catch': ('catch', 'caught', 'caught'),
    'teach': ('teach', 'taught', 'taught'),
    'fight': ('fight', 'fought', 'fought'),
    'throw': ('throw', 'threw', 'thrown'),
    'win': ('win', 'won', 'won'),
    'forget': ('forget', 'forgot', 'forgotten'),
    'freeze': ('freeze', 'froze', 'frozen'),
    'hide': ('hide', 'hid', 'hidden'),
    'shake': ('shake', 'shook', 'shaken'),
    'shine': ('shine', 'shone', 'shone'),
    'shut': ('shut', 'shut', 'shut'),
    'sing': ('sing', 'sang', 'sung'),
    'sink': ('sink', 'sank', 'sunk'),
    'steal': ('steal', 'stole', 'stolen'),
    'tear': ('tear', 'tore', 'torn'),
    'withdraw': ('withdraw', 'withdrew', 'withdrawn'),
    'sail': ('sail', 'sailed', 'sailed'),
    'climb': ('climb', 'climbed', 'climbed'),
    'conquer': ('conquer', 'conquered', 'conquered'),
    'roam': ('roam', 'roamed', 'roamed'),
    'navigate': ('navigate', 'navigated', 'navigated'),
    'invest': ('invest', 'invested', 'invested'),
    'transfer': ('transfer', 'transferred', 'transferred'),
    'marvel': ('marvel', 'marveled', 'marveled'),
    'recount': ('recount', 'recounted', 'recounted'),
    'narrate': ('narrate', 'narrated', 'narrated'),
    'reminisce': ('reminisce', 'reminisced', 'reminisced'),
    'relive': ('relive', 'relived', 'relived'),
    'witness firsthand': ('witness firsthand', 'witnessed firsthand', 'witnessed firsthand'),
    'describe in detail': ('describe in detail', 'described in detail', 'described in detail'),
    'deposit money': ('deposit money', 'deposited money', 'deposited money'),
    'insert card': ('insert card', 'inserted card', 'inserted card'),
    'swipe card': ('swipe card', 'swiped card', 'swiped card'),
    'visited': ('visit', 'visited', 'visited'),
    'explored': ('explore', 'explored', 'explored'),
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
    '# قاموس مفردات المرحلة الثالثة (الأيام 21 إلى 30) — 500 كلمة مع تصريفات الأفعال والترجمة العربية\n',
    'هذا الملف يحتوي على تجميع واستخراج شامل لجميع كلمات المرحلة الثالثة: مواقف الحياة الواقعية (Real-Life Situations) من اليوم الحادي والعشرين حتى اليوم الثلاثين، بعدد **50 كلمة لكل يوم** (إجمالي **500 كلمة فريدة 100% وبدون أي تكرار**).\n',
    'تمت إضافة **تصريفات الأفعال الثلاثة (V1 / V2 / V3)** بجانب كل فعل لتسهيل الحفظ والمراجعة مع الترجمة الدقيقة لكل كلمة.\n',
    '---\n'
]

for d in range(21, 31):
    p = plan[d]
    fname = f'content/day-{d}.json'
    with open(fname, encoding='utf-8') as jf:
        data = json.load(jf)
    
    lines.append(f'## 📅 اليوم {d}: {p["title"]} ({p["topic"]})\n')
    lines.append('| # | الكلمة (Word) | تصريفات الفعل (V1 / V2 / V3) | الترجمة العربية (Translation) |')
    lines.append('|---|---|---|---|')
    
    for i, v in enumerate(data['vocabulary'], 1):
        hw = v['headword']
        pos = v['partOfSpeech']
        trans = v['translation']
        vf = get_verb_forms(hw, pos)
        lines.append(f'| {i} | **{hw}** | {vf} | {trans} |')
    lines.append('\n---\n')

with open('STAGE_3_VOCABULARY.md', 'w', encoding='utf-8') as out:
    out.write('\n'.join(lines))

print('STAGE_3_VOCABULARY.md written successfully!')
