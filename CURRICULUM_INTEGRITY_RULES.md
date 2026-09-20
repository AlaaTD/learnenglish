# English90 — Curriculum Integrity & No-Repetition Rules
## وثيقة قواعد المنهج ومنع تكرار الكلمات عبر الأيام الـ 90

---

## 1. القاعدة الذهبية: منع التكرار بنسبة 100% (Zero-Repetition Rule)

> [!IMPORTANT]
> **ممنوع تماماً تكرار أي كلمة تم إدخالها في يوم سابق.**  
> إجمالي كلمات المنهج: **90 يوماً × 50 كلمة = 4,500 كلمة فريدة تماماً (Unique Words)**.  
> أي كلمة تم تقديمها في اليوم الأول (Day 1) أو أي يوم سابق، **لا يجوز إطلاقاً** إدراجها ككلمة جديدة في اليوم الثاني (Day 2) أو أي يوم لاحق.

### معايير التحقق من التكرار (Normalization & Matching):
1. **عدم الحساسية لحالة الأحرف (Case-Insensitive):**
   `Work` هي نفسها `work` وتعتبر تكراراً مرفوضاً.
2. **إزالة المسافات الزائدة والرموز (Trim & Normalize):**
   يتم تنظيف الكلمات ومطابقتها بدون مسافات إضافية.
3. **الأفعال المركبة والعبارات (Phrasal Verbs & Phrases):**
   تعتبر كيانات لغوية مستقلة (مثل `wake up`, `get dressed`)، ولكن بمجرد إدراجها ككلمة في يوم ما، يُمنع تكرار نفس العبارة في أي يوم آخر.

---

## 2. الفرق بين "تقديم الكلمة" و"إعادة استخدامها في النصوص"

- **قائمة مفردات اليوم (`vocabulary` array):**
  - مخصصة فقط للـ 50 كلمة **الجديدة كلياً** الخاصة باليوم.
  - لا يجوز أن تحتوي على أي كلمة سبق دراستها في أي يوم سابق.
- **المحادثات والبراجرافات وأمثلة الجرامر (`conversations`, `paragraphs`, `grammar`):**
  - **يُشجع بشدة** استخدام الكلمات التي تم تعلمها في الأيام السابقة داخل المحادثات والفقرات لتثبيت الحفظ (Spaced Reinforcement).
  - استخدام كلمة سابقة داخل جملة محادثة في اليوم الثاني ممتاز ومطلوب، لكن **لا تُسجل في قائمة الـ 50 كلمة الخاصة باليوم الثاني**.

---

## 3. قاعدة تصريفات الأفعال الثلاثة (Verb Conjugation Standard)

> [!TIP]
> **خاص بالأفعال فقط (Verbs & Phrasal Verbs):**  
> كل كلمة نوعها فعل يجب أن تحتوي على التصريفات الثلاثة بشكل إلزامي:
> - `v1`: المصدر / المضارع البسيط (Infinitive / Present / Base Form)
> - `v2`: الماضي البسيط (Past Simple)
> - `v3`: التصريف الثالث / الماضي التام (Past Participle)

### هيكل البيانات في ملف اليوم (`content/day-XX.json`):
```json
{
  "headword": "leave",
  "pronunciation": "/liːv/",
  "partOfSpeech": "verb",
  "definition": "to go away from a place",
  "example": "I leave the house at half past seven.",
  "verbForms": {
    "v1": "leave",
    "v2": "left",
    "v3": "left"
  },
  "relatedForms": [],
  "collocations": ["leave home", "leave work"],
  "synonyms": ["depart"],
  "antonyms": ["arrive", "stay"],
  "tags": ["routine", "movement"]
}
```

### بالنسبة للكلمات غير الأفعال (Nouns, Adjectives, Adverbs, etc.):
- **لا يوضع لها حقل `verbForms`**، ويظل خاصاً بالأفعال فقط.

---

## 4. نظام الفحص والتحقق الآلي (Automated Duplicate Detection)

قبل إدخال بيانات أي يوم جديد (مثل Day 2) في قاعدة البيانات، يجب تشغيل سكريبت الفحص الآلي:

```bash
# فحص يوم محدد ضد جميع الأيام الموجودة للتأكد من عدم وجود تكرار
node scripts/validate-content.mjs --days 2-2
```

### ماذا يفعل السكريبت؟
- يجمع كل الـ `headwords` من جميع ملفات الأيام السابقة.
- يفحص كل كلمة في اليوم الجديد؛ وإذا وجد أي كلمة مكررة من يوم سابق يوقف العملية فوراً ويعطي خطأ يوضح الكلمة واليوم الذي وردت فيه سابقاً:
  ```text
  ERROR day 2 [vocab-duplicate] Headword "walk" is already introduced on Day 1. The earliest day owns the word — replace it with a different topic-appropriate word.
  ```

---

## 5. خطوات إعداد اليوم الثاني والأيام القادمة (Workflow for Upcoming Days)

1. اختيار موضوع اليوم من الخطة المعتمدة (`content/curriculum-plan.json`).
2. تجهيز 50 كلمة جديدة تماماً، مع التأكد التام من عدم ورود أي كلمة منها في أي يوم سابق.
3. إضافة حقل `verbForms` (`v1`, `v2`, `v3`) لجميع الأفعال والأفعال المركبة.
4. كتابة درس الجرامر والمحادثات والفقرات مع توظيف الكلمات الجديدة ودمج كلمات الأيام السابقة لتقوية الحفظ.
5. تشغيل الفحص الآلي للتأكد من خلو المحتوى من أي تكرار أو أخطاء:
   ```bash
   node scripts/validate-content.mjs --days 2-2
   ```
6. حقن المحتوى في قاعدة البيانات:
   ```bash
   node scripts/seed.mjs
   ```
