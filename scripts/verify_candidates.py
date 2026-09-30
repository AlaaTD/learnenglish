import json, glob

existing = {}
for f in sorted(glob.glob("content/day-*.json")):
    with open(f, "r", encoding="utf-8") as fp:
        d = json.load(fp)
        day = d["day"]
        for v in d["vocabulary"]:
            hw = v["headword"].strip().lower()
            existing[hw] = day

candidates = {
    52: [
        'physician', 'practitioner', 'surgeon', 'paramedic', 'pediatrician',
        'cardiologist', 'dermatologist', 'pharmacist', 'patient', 'consultation',
        'checkup', 'diagnosis', 'prognosis', 'prescription', 'dosage',
        'stethoscope', 'thermometer', 'syringe', 'injection', 'vaccine',
        'blood pressure', 'pulse rate', 'vital signs', 'x-ray', 'ultrasound',
        'mri scan', 'biopsy', 'specimen', 'lab result', 'referral',
        'treatment plan', 'therapy', 'rehabilitation', 'surgery', 'anesthesia',
        'incision', 'stitches', 'bandage', 'gauze', 'ointment',
        'capsule', 'syrup', 'antibiotic', 'painkiller', 'sedative',
        'antiseptic', 'disinfectant', 'emergency room', 'intensive care unit', 'discharge'
    ],
    53: [
        'nutrition', 'calorie', 'nutrient', 'carbohydrate', 'protein',
        'dietary fiber', 'vitamin', 'mineral', 'antioxidant', 'hydration',
        'whole grain', 'portion size', 'processed food', 'dietary supplement', 'balanced diet',
        'meal prep', 'wholesome', 'nourishing', 'intermittent fasting', 'binge eating',
        'junk food', 'sugar intake', 'cholesterol', 'metabolism', 'digestive health',
        'gut flora', 'deep sleep', 'rem sleep', 'circadian rhythm', 'sleep hygiene',
        'bedtime routine', 'power nap', 'well-rested', 'sleep deprivation', 'sedentary',
        'physically active', 'daily step', 'outdoor recreation', 'stress management', 'meditation',
        'mindfulness', 'mental clarity', 'breathing exercise', 'self-care routine', 'detoxify',
        'longevity', 'wellness', 'aerobic exercise', 'water consumption', 'wholesome food'
    ],
    54: [
        'athlete', 'athletic', 'stamina', 'endurance', 'workout',
        'warm up', 'cool down', 'stretch', 'treadmill', 'dumbbell',
        'barbell', 'bench press', 'push-up', 'pull-up', 'sit-up',
        'squat', 'lunge', 'sprint', 'marathon', 'triathlon',
        'gymnastics', 'martial arts', 'wrestling', 'boxing', 'cycling',
        'rowing', 'aerobics', 'pilates', 'coach', 'trainer',
        'referee', 'umpire', 'tournament', 'championship', 'league',
        'playoffs', 'scoreline', 'penalty', 'foul', 'offside',
        'overtime period', 'runner-up', 'podium', 'sportsmanship', 'record-breaker',
        'personal best', 'warm-up exercise', 'cardiovascular', 'agility', 'coordination'
    ],
    55: [
        'kindergarten', 'elementary school', 'middle school', 'high school', 'curriculum',
        'syllabus', 'textbook', 'chalkboard', 'whiteboard marker', 'pencil case',
        'recess', 'lunchtime break', 'cafeteria', 'hall pass', 'locker',
        'homeroom', 'attendance register', 'tardy', 'truancy', 'classmate',
        'class president', 'valedictorian', 'principal', 'headmaster', 'guidance counselor',
        'substitute teacher', 'school assembly', 'field trip', 'extracurricular', 'school uniform',
        'pop quiz', 'midterm exam', 'final exam', 'report card', 'grade point average',
        'honor roll', 'academic probation', 'diploma', 'commencement', 'graduation ceremony',
        'alumnus', 'alumna', 'class reunion', 'yearbook', 'school bell',
        'detention', 'hallway monitor', 'spelling bee', 'science fair', 'schoolyard'
    ],
    56: [
        'proficiency', 'competence', 'mastery', 'aptitude', 'learning curve',
        'novice', 'beginner level', 'intermediate level', 'advanced level', 'expert',
        'pedagogy', 'methodology', 'comprehension', 'memorization', 'rote learning',
        'mnemonic', 'retention', 'flashcard', 'spaced repetition', 'study guide',
        'tutorial', 'workshop', 'masterclass', 'bootcamp', 'hands-on practice',
        'trial and error', 'troubleshooting skill', 'feedback loop', 'critique', 'constructive criticism',
        'milestone achievement', 'breakthrough', 'plateau', 'steep curve', 'incremental progress',
        'self-paced', 'self-directed', 'autonomous learning', 'cognitive ability', 'intellectual curiosity',
        'practical application', 'role-play exercise', 'simulation', 'case study', 'peer review',
        'fluency development', 'skill set', 'repertoire', 'deliberate practice', 'lifelong learning'
    ],
    57: [
        'mandatory rule', 'compulsory attendance', 'strict regulation', 'statutory requirement', 'protocol requirement',
        'code of ethics', 'standard operating procedure', 'safety guideline', 'curfew', 'restriction',
        'prohibition', 'zero tolerance', 'forbidden action', 'infraction', 'violation',
        'penalty fee', 'sanction', 'disciplinary measure', 'suspension', 'expulsion',
        'permissible', 'allowable', 'authorized access', 'written authorization', 'special permit',
        'clearance level', 'exemption', 'waiver', 'legal obligation', 'binding contract',
        'terms and conditions', 'prerequisite', 'enforce rule', 'abide by rules', 'conform to standards',
        'adhere strictly', 'deviate from protocol', 'override permission', 'grant permission', 'revoke privilege',
        'daily regimen', 'fixed schedule', 'punctuality standard', 'attendance record', 'check-in procedure',
        'mandatory break', 'compliance officer', 'regulatory framework', 'audit protocol', 'official directive'
    ],
    58: [
        'likelihood', 'probability rate', 'statistical chance', 'odds', 'plausibility',
        'conceivable', 'feasible', 'highly probable', 'moderately likely', 'barely possible',
        'remote possibility', 'improbable outcome', 'impossible scenario', 'unthinkable', 'inevitable',
        'inescapable', 'unavoidable', 'conjecture', 'supposition', 'hypothesis',
        'postulate', 'speculate', 'deduce logically', 'infer from evidence', 'surmise',
        'extrapolate', 'educated guess', 'hunch', 'inkling', 'clue deduction',
        'circumstantial evidence', 'conclusive proof', 'indisputable fact', 'unquestionable', 'undeniable',
        'dubious claim', 'questionable assertion', 'wild guess', 'rule out', 'eliminate possibility',
        'narrow down', 'lead to conclusion', 'point toward', 'stand to reason', 'logical inference',
        'foregone conclusion', 'long shot', 'toss-up', 'gamble outcome', 'beyond shadow of doubt'
    ],
    59: [
        'aspiration', 'ambition level', 'long-range vision', 'core objective', 'strategic target',
        'roadmap', 'action plan', 'benchmark goal', 'stepping stone', 'catalyst for change',
        'internal motivation', 'external incentive', 'drive to succeed', 'perseverance', 'resilience',
        'grit', 'determination', 'unwavering focus', 'tenacity', 'industriousness',
        'procrastination', 'overcome hurdle', 'setback recovery', 'stumbling block', 'leap forward',
        'break free', 'reach potential', 'strive for excellence', 'pursue relentlessly', 'stay disciplined',
        'accountability partner', 'self-accountability', 'progress tracking', 'milestone tracker', 'celebrate win',
        'intrinsic reward', 'extrinsic reward', 'vision board', 'affirmation', 'self-efficacy',
        'can-do attitude', 'growth mindset', 'empowerment', 'ignite passion', 'fuel ambition',
        'relentless effort', 'transformative goal', 'conquer challenge', 'rise to occasion', 'achieve greatness'
    ],
    60: [
        'self-actualization', 'personal transformation', 'character development', 'inner growth', 'holistic wellness',
        'mindset shift', 'self-awareness', 'emotional maturity', 'self-discipline', 'self-mastery',
        'introspection practice', 'self-reflection', 'core values', 'moral compass', 'personal philosophy',
        'life purpose', 'self-worth', 'integrity in action', 'humility', 'gratitude mindset',
        'empathy development', 'active compassion', 'patience cultivation', 'temperance', 'equanimity',
        'mindful presence', 'clarity of purpose', 'letting go of ego', 'forgive oneself', 'overcome insecurity',
        'embrace vulnerability', 'boundary setting', 'assertive communication', 'positive self-talk', 'inner harmony',
        'work-life harmony', 'fulfillment', 'self-compassion', 'wisdom gained', 'lessons internalized',
        'renewed purpose', 'reinvent oneself', 'continuous improvement', 'legacy creation', 'broadened horizon',
        'higher potential', 'balanced lifestyle', 'thriving mindset', 'peace of mind', 'the best version of oneself'
    ]
}

all_proposed = {}
duplicates_found = []

for day, words in candidates.items():
    if len(words) != 50:
        print(f"ERROR: Day {day} has {len(words)} words, need 50!")
    for w in words:
        wl = w.strip().lower()
        if wl in existing:
            duplicates_found.append((day, w, f"matches Day {existing[wl]}"))
        if wl in all_proposed:
            duplicates_found.append((day, w, f"matches Day {all_proposed[wl]} in candidates"))
        all_proposed[wl] = day

print(f"Total candidate words: {len(all_proposed)}")
if duplicates_found:
    print(f"Found {len(duplicates_found)} duplicate(s):")
    for d in duplicates_found:
        print("  ", d)
else:
    print("ALL 450 CANDIDATES FOR DAYS 52-60 ARE 100% UNIQUE WITH ZERO CONFLICTS!")
