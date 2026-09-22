# English90 — Root-Cause Visual Reading Audit

## الهدف من هذا الملف

هذا الملف لا يعيد اختيار الألوان، ولا يقترح Palette جديدة.

**الألوان الحالية تُعتبر قرارًا مقفولًا في هذه المرحلة.**
الهدف هنا هو معرفة لماذا يشعر المستخدم عند محاولة **التركيز على الكلمة/التعريف بهدف الحفظ** بأن العين تتوه، وأن الصفحة فيها زحمة أو "زغللة" أو صعوبة في تثبيت نقطة النظر.

التحليل مبني على الكود الموجود في المشروع المرفق، مع فصل واضح بين:

- **حقائق مؤكدة من الكود**
- **استنتاجات تصميمية قوية**
- **فرضيات تحتاج اختبار بصري على الشاشة**

> ملاحظة مهمة: هذا تحليل UX/UI وليس تشخيصًا طبيًا للعين. إذا ظهر نفس التشوش خارج English90 أو مع مواقع/شاشات أخرى، فلا يُنسب تلقائيًا للتصميم.

---

# 1. الحكم التنفيذي

## المشكلة الأصلية ليست اللون

بعد مراجعة الـshell والـnavigation وDay page وVocabularyCard وGrammar Academy وExercise، التشخيص الأقوى هو:

> **English90 حاليًا يطلب من العين أن تفعل عدة أشياء في نفس المنطقة البصرية في الوقت نفسه، بينما مهمة المستخدم الأساسية هي مهمة واحدة فقط: قراءة/تثبيت كلمة ومعلومتها.**

المشكلة الأساسية إذن هي:

**Visual Competition + Content Density + Weak Reading Focus + Excessive Component Framing + Inconsistent Typography Application.**

وليس:

**"لون الأزرق غلط"** أو **"نحتاج Palette أجمل"**.

---

# 2. ترتيب أسباب المشكلة حسب قوة الدليل

| السبب | قوة الدليل | تأثيره المتوقع | التصنيف |
|---|---:|---:|---|
| عرض 50 كلمة في Grid من عمودين على Desktop | عالي جدًا | عالي جدًا | Root Cause |
| الكارت الواحد يحتوي عدة طبقات بصرية متزامنة | عالي جدًا | عالي جدًا | Root Cause |
| الـshell والـnavigation دائمًا بارزان أمام مهمة التعلم | عالي | عالي | Root Cause |
| كثرة الحدود + rings + shadows + rounded containers | عالي جدًا | عالي | Root Cause |
| وجود عدة ألوان للحالات والبيانات داخل نفس الشاشة | عالي | متوسط/عالي | Amplifier |
| طول مساحة القراءة في Desktop أكبر من اللازم | عالي | عالي | Root Cause |
| Typography intended-for-reading يتم override لها بواسطة Inter داخل `.e90-shell` | مؤكد من الكود | متوسط/عالي | Implementation Bug |
| وجود عدة أنواع من metadata قبل النص الأساسي | عالي | متوسط/عالي | Amplifier |
| وجود عناصر Header + Focus + Image + Grammar + Tabs قبل الكلمات | عالي | متوسط/عالي | Attention Cost |
| transitions / micro-interactions الكثيرة | متوسط | منخفض/متوسط | Amplifier |
| اللون وحده هو المشكلة | ضعيف | — | **ليس التشخيص الحالي** |

---

# 3. أهم نتيجة: الصفحة لا تعطي العين نقطة تركيز واحدة

في صفحة اليوم، قبل أن يصل المستخدم حتى للكلمات، يمر بصريًا على:

1. Day number / stage
2. عنوان اليوم
3. topic
4. Completed state
5. Previous / Next navigation
6. Today's focus
7. Words learned
8. Progress bar
9. Visual infographic banner
10. Grammar Focus
11. Day tabs
12. بعدها فقط Vocabulary

هذا يعني أن المستخدم الذي يريد ببساطة:

> "أنا عايز أحفظ الكلمة دي"

وصل إلى الكلمة بعد سلسلة طويلة من الـvisual landmarks.

هذا ليس خطأ في وجود هذه المعلومات من حيث المنتج؛ المشكلة هي **أنها لا تنسحب بصريًا عندما تبدأ مهمة التعلم**.

---

# 4. لماذا الـVocabulary Grid الحالي يسبب مشكلة تركيز؟

## الكود الحالي

في `src/app/(app)/day/[day]/page.tsx`:

```tsx
<div className="grid items-start gap-3 lg:grid-cols-2">
  {vocabulary.map((word) => (
    <VocabularyCard ... />
  ))}
</div>
```

اليوم يحتوي 50 كلمة.

على Desktop هذا يعني تقريبًا:

- 25 صفًا
- عمودان
- كارتان في مجال الرؤية الأفقي نفسه
- كل كارت له word + pronunciation + part of speech + definition + Arabic translation + actions

إذن المستخدم لا يقرأ "قائمة كلمات" فقط.

العين تقرأ **مصفوفة من الوحدات البصرية المتساوية**.

وهنا توجد مشكلة مهمة جدًا:

> عندما تكون كل الوحدات قوية ومتساوية، لا توجد وحدة تقول للعين: "أنا الشيء الذي يجب أن تقرأه الآن".

---

# 5. مشكلة عرض النص نفسها: الـDesktop column أعرض مما يحتاجه التعلم

الكود يسمح للـapp shell بعرض يصل إلى:

```tsx
max-w-[1548px]
```

ومع Vocabulary Grid من عمودين، يصبح كل كارت على Desktop عريضًا جدًا.

هذا مهم لأن تعريفات الكلمات في المحتوى نفسه ليست قصيرة دائمًا.

تحليل المحتوى المرفق أظهر:

- 2500 كلمة تم تحليلها
- متوسط طول الـdefinition ≈ 71.7 حرفًا
- الوسيط ≈ 72 حرفًا
- 90th percentile ≈ 97 حرفًا
- أطول definition = 131 حرفًا

والـexample sentences مشابهة:

- المتوسط ≈ 75.5 حرفًا
- الوسيط ≈ 78 حرفًا
- 90th percentile ≈ 95 حرفًا
- أطول example = 119 حرفًا

هذا يجعل سطر النص على شاشة Desktop الواسعة يقترب بسهولة من عرض أكبر من المريح للقراءة المتتابعة، خصوصًا عندما تكون المهمة حفظًا وليس browsing.

WCAG يذكر 80 حرفًا/حرفًا رسوميًا كحد مرجعي للعرض في عرض النص، وGOV.UK Design System يستخدم عادةً حدًا يقارب 75 حرفًا لتجنب السطور الطويلة على الشاشات الكبيرة. هذه ليست أرقامًا "مقدسة" للتصميم، لكنها أدلة قوية على أن **توسيع عمود القراءة إلى أقصى عرض الشاشة ليس الاتجاه الصحيح لمحتوى التعلم**.

المصادر:

- WCAG 2.2 — Visual Presentation: https://www.w3.org/TR/WCAG22/#visual-presentation
- GOV.UK Design System — Layout: https://design-system.service.gov.uk/styles/layout/

---

# 6. المشكلة الأعمق داخل VocabularyCard

الكارت الحالي يبني hierarchy بهذا التسلسل:

```text
HEADWORD
  actions: difficult / audio / expand
pronunciation + part of speech
Definition
Arabic translation
--------------------
Example
Arabic example
Verb forms
Related forms
Collocations
Synonyms
Antonyms
Tags
Conversation usage
Paragraph usage
...
```

المستخدم يريد غالبًا حفظ:

```text
word → meaning → example
```

لكن الكارت يعرض له:

```text
word
controls
state
phonetics
part of speech
meaning
Arabic
state rail
border
surface
shadow
hover affordance
expand affordance
...
```

إذن **المعلومة ليست مهيمنة بصريًا بنفس قوة الـUI المحيط بها**.

هذه نقطة جوهرية.

---

# 7. الـCard نفسه أصبح وحدة تصميمية أكثر من كونه وحدة قراءة

في `VocabularyCard` توجد عدة مؤشرات قوية:

```text
rounded-2xl
border
shadow-card
hover:border-brand-300
hover:shadow-lift
state rail
action buttons
expand button
```

هذا ممتاز لو الهدف:

> "أريد dashboard يضم عناصر قابلة للتفاعل."

لكنه ليس مثاليًا لو الهدف:

> "أريد أن أقرأ وأثبت كلمة في ذاكرتي."

الـcard أصبح يقول بصريًا:

> "أنا Component"

بدل:

> "أنا صفحة نص تعليمية تقرأها بهدوء."

---

# 8. عدد الـVisual Containers مرتفع جدًا

تحليل static للكود أعطى تقريبًا:

- `rounded-full`: **88**
- `rounded-xl`: **42**
- `rounded-2xl`: **40**
- `rounded-3xl`: **14**
- `ring-1`: **38**
- `shadow-sm`: **16**
- `shadow-md`: **12**
- `shadow-lg`: **10**
- `shadow-xl`: **4**
- `shadow-2xl`: **5**
- `backdrop-blur*`: عدة استخدامات عبر الـshell والمودالات والـnavigation

الأرقام ليست حكمًا آليًا بأن التصميم "سيئ".

لكنها تكشف نمطًا واضحًا:

> **هناك framing بصري أكثر مما تحتاجه صفحة تعلم نصية.**

وخصوصًا عندما يتكرر framing نفسه على أكثر من مستوى:

```text
Page
 └── Card
      └── Sub-card
           └── Badge
                └── Icon circle
```

هذا يخلق ما يمكن تسميته:

## Nested Visual Boundaries

أي حدود بصرية داخل حدود بصرية داخل حدود بصرية.

العين تبدأ في قراءة **الحدود نفسها** بدل المحتوى.

---

# 9. الـNavigation نفسها تنافس المحتوى

الـheader الحالي ليس مجرد header.

هو:

- Floating island
- Rounded outer container
- Border
- Shadow
- Backdrop blur
- Logo ring
- Brand badge
- Center segmented dock
- Active state shadow
- Profile pill

وعلى Mobile يوجد:

- floating/mobile menu
- backdrop blur
- bottom navigation
- active pill
- active shadow

هذا أسلوب مناسب جدًا لمنتجات SaaS / dashboards.

لكن English90 ليس مجرد dashboard.

عندما يدخل المستخدم إلى:

> Day → Vocabulary → memorization

يجب أن يتحول الـshell من "واجهة تستعرض نفسها" إلى "إطار هادئ حول المحتوى".

---

# 10. مشكلة مهمة جدًا: الـTypography في الكود ليست مطابقة للنية المكتوبة في التعليقات

في `layout.tsx` يتم تحميل:

```tsx
Lexend
Inter
Readex Pro
```

وفي `globals.css` يوجد وصف واضح أن:

> Lexend للـlesson reading content
> Inter للـdashboard shell

لكن التطبيق يضع:

```css
.e90-shell {
  font-family: var(--font-inter), var(--font-lexend), ...;
}
```

والـ`.e90-shell` يحتوي تقريبًا كل صفحات التطبيق.

بالتالي أغلب محتوى اليوم والـVocabulary والـGrammar يرث `Inter` إلا إذا تم override محليًا.

هذه ليست مسألة ذوق.

إنها **مفارقة بين Design Intent وActual CSS Cascade**.

## المطلوب

لا نغير الخطوط الآن كاختيار جمالي.

أول شيء فقط يجب فعله:

> نجعل font ownership واضحًا.

مثال منطقي:

```text
App Shell / navigation → Inter
Learning content        → Lexend
Arabic                   → Readex Pro
IPA                      → phonetic/system font
```

لكن مع منع الـshell font من ابتلاع reading content.

---

# 11. لماذا تعدد الـFonts قد يزيد إحساس "الصفحة متحركة"؟

في المشروع يوجد تقسيم مطلوب بين:

- Shell typography
- Reading typography
- Arabic typography
- Phonetic typography

هذا ليس خاطئًا.

الخطأ هو أن حدود هذه الأنظمة ليست واضحة بما يكفي.

في واجهة تعلم، الإحساس المطلوب هو:

```text
UI noise ↓
Reading rhythm ↑
```

أي أن المستخدم يجب أن يشعر أن النص له rhythm واحد مستقر.

لكن عند الانتقال بين:

```text
Inter metadata
Lexend intention
Readex Arabic
small uppercase labels
mono phonetics
```

كل عنصر يبدو وكأنه "قطعة UI مستقلة".

هذا يزيد segmentation البصري.

---

# 12. المشكلة ليست فقط في عدد الألوان؛ المشكلة في عدد الـsemantic signals

رغم أن اللون لن يتغير الآن، يجب أن نفهم أين المشكلة.

في الـVocabulary توجد signals للحالة:

- LEARNING
- REVIEW
- MASTERED

وهناك signals أخرى لـ:

- accent
- Arabic warmth
- success
- danger
- warning
- information

ثم فوقها:

- active tab
- progress fill
- primary action
- hover state
- focus state

إذن حتى لو كانت الـPalette متناسقة، العين تستقبل **لغة متعددة**.

القاعدة التي سنطبقها:

> **لا نمنع الألوان؛ نمنع تزامن الإشارات.**

أي لا نريد أن يكون نفس الـviewport مليئًا في الوقت نفسه بـ:

```text
state color
accent
warm translation
progress color
icon color
active tab color
button color
```

كلها بارزة بنفس الدرجة.

---

# 13. مشكلة الـ"micro-label" الكثيرة

يوجد استخدام كبير جدًا لـ:

```text
uppercase
tracking-wider
text-xs
text-[11px]
text-[10px]
```

خصوصًا في Grammar Academy.

هذه الأساليب جيدة لتحديد hierarchy، لكنها عندما تصبح كثيرة تفعل العكس:

> بدل أن يكون label مساعدًا، يصبح عنصرًا يجب على العين قراءته وتفسيره.

ومن ثم يحصل:

```text
MAIN TITLE
small kicker
small status
small day label
small score
small category
small explanation label
...
```

فيصبح كل شيء "metadata".

والنتيجة:

**لا يوجد صمت بصري كافٍ حول المعلومة الأساسية.**

---

# 14. مشكلة خاصة جدًا في التعلم: المستخدم يحتاج تثبيت مكان العين

قراءة محتوى لتعلم لغة ليست مثل browsing.

الهدف ليس:

> scan → click → scan → click

بل غالبًا:

> locate → fixate → pronounce/read → connect meaning → example → repeat

لذلك التصميم يحتاج إلى:

## Stable Reading Anchor

أي مكان واضح وثابت جدًا تبدأ منه العين في كل وحدة.

في الـVocabularyCard الحالي نقطة البدء تتأثر بـ:

- actions في نفس السطر
- state rail
- wrapping
- metadata
- variable word lengths
- variable definition lengths

فتبدأ العين كل مرة بإعادة حساب:

> أين الكلمة؟
> أين معناها؟
> أين المثال؟
> أين الزر؟
> أين الحالة؟

وهذا عكس التصميم المطلوب للحفظ.

---

# 15. المشكلة في الـtwo-column layout ليست فقط "زحمة"

هناك مشكلة ثانية:

## Saccadic Competition

على Desktop، عين المستخدم ترى كارتين متجاورين.

لو كانت الكروت متشابهة جدًا:

```text
[ word A ]   [ word B ]
[ meaning]   [ meaning]
[ Arabic ]   [ Arabic ]
```

فالعين لديها أكثر من anchor أفقي.

وهذا جيد للـbrowsing.

لكنه أسوأ من عمود واحد عندما يكون المطلوب:

> قراءة متتابعة + حفظ.

لذلك ليس المطلوب بالضرورة حذف الـ2-column من كل مكان في التطبيق.

المطلوب هو:

> **في Learning Vocabulary view: الأولوية لعرض قراءة ضيق ومستقر، وليس لأقصى عدد من الكروت على الشاشة.**

---

# 16. المقترح البنيوي الأساسي: Reading-First Vocabulary Layout

## الهدف

نجعل صفحة Vocabulary تشبه صفحة دراسة فعلية، وليس dashboard cards.

### الشكل المفاهيمي

```text
        Day / topic

        Vocabulary
        50 words

        ─────────────────────

        WORD
        pronunciation · part of speech

        Definition in one readable column

        الترجمة

        Example
        Example Arabic

        ─────────────────────

        WORD 02
        ...
```

على Desktop:

```text
          ┌──────────────────────────────┐
          │         reading column       │
          │         ~60–70ch             │
          │                              │
          │   word                       │
          │   metadata                   │
          │   definition                 │
          │   translation                │
          │                              │
          └──────────────────────────────┘
```

وليس:

```text
┌──────────────────┐ ┌──────────────────┐
│ CARD             │ │ CARD             │
│ CARD             │ │ CARD             │
└──────────────────┘ └──────────────────┘
```

---

# 17. لا نحول الـVocabularyCard إلى Card أكبر

هذا خطأ مهم يجب تجنبه.

لا نحل المشكلة هكذا:

> card أكبر + padding أكبر + rounded أكبر + shadow أخف.

الحل هو:

> **تقليل card-ness نفسها.**

### الاتجاه الصحيح

الـVocabulary unit تصبح أقرب إلى:

```text
reading block
+ subtle divider
+ quiet interaction controls
```

وليس:

```text
floating card
```

---

# 18. الشكل المقترح لوحدة الكلمة

## المستوى الأول — Primary

يحتوي فقط على:

```text
WORD
```

هو أكبر شيء في الوحدة.

## المستوى الثاني — pronunciation / part of speech

سطر واحد خفيف.

## المستوى الثالث — definition

هو أهم نص بعد الكلمة.

## المستوى الرابع — Arabic meaning

واضح، لكن لا ينافس definition.

## المستوى الخامس — example

يظهر بهدوء.

## المستوى السادس — details

collapsed.

---

# 19. الـActions يجب ألا تكون في نفس مستوى القراءة

اليوم:

```text
WORD                     [difficulty] [audio] [expand]
```

هذه العناصر كلها في أول نقطة تقع عليها العين.

المطلوب:

```text
WORD
pronunciation · noun

Definition
Arabic meaning
```

والـactions تبقى متاحة، ولكن لا تجلس بصريًا بجوار أهم نص في الشاشة بنفس الوزن.

مبدأ التنفيذ:

> **interaction is available without becoming attention-seeking.**

---

# 20. الـState rail يجب أن يكون signal خفيفًا

الـstate rail الحالي:

```text
before:w-1
```

وهو signal جيد من ناحية semantics.

لكن يجب ألا يصبح عنصرًا بصريًا يغير شكل الكارت.

الهدف:

```text
tiny state signal
```

وليس:

```text
colored card identity
```

الحالة مهمة، لكنها ليست المعلومة التي نحفظها.

---

# 21. الـDefinition width يجب أن يكون مقيدًا

هذه واحدة من أهم التعديلات.

لا تجعل نص التعريف يأخذ كامل عرض الكارت حتى لو كان الكارت عريضًا.

استخدم max-width مقصودًا يعادل تقريبًا:

```text
60–70ch
```

مع ترك whitespace حول النص.

السبب ليس aesthetic فقط.

السطور الأقصر تساعد على تثبيت مكان القراءة وتقليل ضياع السطر، وWCAG/GOV.UK يقدمان حدودًا مرجعية قريبة من هذا المبدأ.

---

# 22. Line-height المستهدف

لا نريد line-height مضغوطًا للمحتوى التعليمي.

المستهدف المقترح:

```text
body reading text: 1.55–1.7
example text:       1.55–1.7
Arabic paragraphs:  1.75–1.95
small UI text:      1.3–1.45
```

هذا يتماشى مع مبدأ إعطاء العين مسافة كافية لتعقب السطر، وهو مذكور بوضوح في WCAG text-spacing guidance.

مصادر:

- https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
- https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation

---

# 23. لا نستخدم `leading-tight` للمعلومة التي تريد حفظها

في الـheadword الحالي يوجد:

```tsx
leading-tight
```

هذا ليس بالضرورة خطأ للعنوان القصير نفسه، لكن يجب أن يكون مقصورًا على عناصر قصيرة.

قاعدة جديدة:

```text
Headword       → tight allowed
Definition     → never tight
Example        → never tight
Explanation    → never tight
Arabic body    → never tight
```

---

# 24. الـWhitespace يجب أن يعمل كـseparator بدل الحدود

في النسخة الجديدة لا نحتاج أن نقول للعين:

```text
هذا block انتهى
```

عن طريق:

```text
border + shadow + background + radius
```

يمكن أن نقولها عن طريق:

```text
vertical rhythm
```

أي:

```text
WORD
  ↓ 8–10px
metadata
  ↓ 14–18px
definition
  ↓ 6–10px
translation
  ↓ 20–28px
example
```

المسافة تصبح هي اللغة الأساسية للفصل.

---

# 25. القاعدة الذهبية الجديدة: Hierarchy before Decoration

يجب أن يكون ترتيب أولوية العين:

```text
1. Learning target
2. Meaning
3. Example
4. Supporting metadata
5. Interaction
6. Status
7. Decoration
```

وليس:

```text
1. Card boundary
2. badge
3. icon
4. colored status
5. button
6. text
```

---

# 26. قواعد ثابتة يجب ألا يتم كسرها

## Rule 01 — One Reading Anchor

كل viewport تعليمي يجب أن يحتوي على **reading anchor واحد واضح**.

## Rule 02 — One Surface Level

لا نستخدم card داخل card داخل card إلا إذا كان المحتوى فعلاً يحتاجه.

## Rule 03 — Borders are exceptions

الحدود للفصل أو التحكم، وليست لتزيين كل section.

## Rule 04 — Shadows are rare

Shadow يدل على elevation حقيقية.

ليس decoration.

## Rule 05 — No decorative circles near reading content

خصوصًا خلف العنوان أو حول progress.

## Rule 06 — Rounded-full for true pills only

لا تستخدم `rounded-full` كحل افتراضي لكل عنصر.

## Rule 07 — Metadata stays quiet

المستخدم لا يجب أن يشعر أن الـmetadata تنافس الـword.

## Rule 08 — Color indicates state, never structure

الألوان لا تصنع layout hierarchy.

## Rule 09 — Typography creates hierarchy

الحجم والوزن والمسافة أهم من اللون.

## Rule 10 — Reading width is intentional

كل block تعليمي طويل يجب أن يكون له حد عرض.

---

# 27. ماذا نفعل بالـDay page؟

## قبل الكلمات

نقلل visual competition.

المقترح:

```text
Day title
short focus sentence
progress

Tabs

Vocabulary
```

بدل:

```text
Header
Focus Card
Image Banner
Grammar Banner
Tabs
Vocabulary
```

ليس المطلوب حذف functionality.

المطلوب أن تكون الـsecondary modules أقل هيمنة.

---

# 28. الـInfographic Banner

الـDayImageBanner الآن يعيش فوق الـtabs وفوق الكلمات.

هذا منطقي تسويقيًا، لكنه غير منطقي كـreading-first flow.

الحل:

- لا يظهر ككتلة ضخمة في المسار الأساسي للحفظ.
- يبقى accessible.
- لكن لا يصبح واحدًا من أكبر visual landmarks قبل المحتوى الأساسي.

القاعدة:

> التعلم أولًا، الإثراء البصري ثانيًا.

---

# 29. Grammar Focus Banner

نفس المشكلة.

الـGrammar Focus مهم، لكنه ليس الشيء الذي يقرأه المستخدم عندما دخل Vocabulary.

لا تجعله يملك نفس visual weight الذي تملكه المهمة الحالية.

---

# 30. Tabs

الـtabs يجب أن تقول:

> "أي نوع محتوى تريد؟"

وليس:

> "أنا عنصر UI بارز يجب أن تراقبه."

عند الصفحة التعليمية:

- active state واضح
- inactive states neutral
- أقل framing
- أقل rounded-full
- لا shadow لكل شيء

---

# 31. Grammar Academy تحتاج نفس المبدأ

الكود فيها يحتوي بكثافة على:

- `text-xs` بكثرة
- `rounded-full`
- `rounded-2xl`
- `rounded-3xl`
- multiple colored states
- score pills
- answer cards
- progress strips
- code-like / mono blocks

المشكلة هنا مشابهة:

**الاختبار نفسه يصبح هو الـUI spectacle.**

المطلوب:

```text
Question
→ choices
→ feedback
→ next
```

ولا شيء يسبق السؤال في الوزن البصري.

---

# 32. Exercise page تحتاج "focus stage"

`day-exercise.tsx` حاليًا يحتوي على:

- topbar
- counter
- success pill
- error pill
- reset
- progress
- stage card
- Arabic hero box
- input
- feedback box
- buttons

هذا كثير بالنسبة لمهمة واحدة.

المطلوب ليس حذفها.

المطلوب تقليل prominence بحيث:

```text
Question

[ input ]

[ Check ]

feedback
```

تكون هي مركز الشاشة.

الـcounter والـprogress والـreset يصبحون peripheral information.

---

# 33. الـ"Squint Test" المطلوب بعد التعديل

بعد أي إعادة تصميم، خذ screenshot للصفحة.

ثم قلل الانتباه للتفاصيل بصريًا (بدون الحاجة لأداة خاصة) واسأل:

> أين تذهب العين أولًا؟

المفروض:

### Vocabulary

```text
WORD → definition
```

### Exercise

```text
question → input
```

### Grammar

```text
rule/example → question
```

لو العين تذهب أولًا إلى:

```text
badge
icon
border
progress
navigation
colored tile
```

فالتصميم ما زال يفشل.

---

# 34. اختبار Grayscale

حول screenshot إلى grayscale.

لو hierarchy ما زالت واضحة:

```text
headline > body > metadata > controls
```

فالنظام يعتمد على structure.

لو الصفحة أصبحت كتلة متساوية بعد حذف اللون، فهذا يعني أن اللون كان يحمل hierarchy أكثر مما ينبغي.

هذا الاختبار مهم جدًا هنا لأننا **قررنا عدم تغيير الـpalette مرة أخرى**.

---

# 35. اختبار Blur / Low-attention

ليس لاختبار العين طبيًا، بل لاختبار hierarchy.

عند تصغير التفاصيل أو إبعاد الصورة قليلًا، يجب أن يبقى:

```text
Primary content
```

أوضح من:

```text
cards / chips / controls / progress
```

إذا اختفت hierarchy، فالصفحة تعتمد على decoration لا structure.

---

# 36. الاختبار الأهم: 3-second target test

افتح الصفحة.

لا تقرأ.

انظر لثلاث ثوانٍ فقط.

ثم أجب:

> ما الذي تريدني الصفحة أن أقرأه الآن؟

في Vocabulary يجب أن تكون الإجابة واضحة جدًا.

إذا كانت الإجابة:

```text
مش عارف — بصيت على الـbadge والprogress والnavigation والكروت كلها
```

فالمشكلة لم تُحل.

---

# 37. الاختبار العملي الأكثر أهمية للمشروع

اختبر 5 كلمات متتالية فقط.

لكل كلمة:

1. اقرأ headword.
2. اقرأ definition.
3. اقرأ Arabic meaning.
4. اقرأ example.
5. انتقل للكلمة التالية.

راقب هل العين تفقد مكانها بين:

```text
word → definition
```

أو بين:

```text
definition → Arabic
```

أو عند الانتقال من:

```text
left card → right card
```

الهدف بعد التعديل هو تقليل إعادة التموضع غير الضرورية.

---

# 38. Architecture المقترحة للـVocabulary

## الصفحة

```text
Page
├── compact day header
├── simple tabs
└── reading column
    ├── word unit 01
    ├── word unit 02
    ├── word unit 03
    └── ...
```

## الوحدة

```text
Word Unit
├── headword + essential action
├── phonetic / part of speech
├── definition
├── Arabic meaning
└── optional details
```

لا نحتاج:

```text
card
  surface
  sub-surface
  chip
  sub-chip
  shadow
  ring
```

---

# 39. ماذا نفعل بالـProgress؟

Progress مهم، لكن ليس من محتوى الكلمة.

لذلك:

```text
Page progress → page chrome
Word content  → reading flow
```

لا تجعل كل كارت يحمل progress أو status visualization إلا إذا كان هناك سبب تعليمي مباشر.

---

# 40. ماذا نفعل بالـStates؟

يجب أن يبقى state مرئيًا.

لكن في hierarchical position منخفضة:

```text
WORD
meaning
example

status ← secondary
```

وليس:

```text
colored rail + badge + colored text + colored icon
```

كلها في نفس اللحظة.

---

# 41. الـArabic لا يجب أن يصبح "لونًا ثانيًا للمحتوى"

الـArabic مهم جدًا لأنه جزء من التعلم.

لكن يجب أن يكون:

```text
meaning clarity
```

وليس:

```text
visual decoration
```

استخدم اللون الحالي كدعم خفيف فقط.

الأهم هو:

- spacing
- font
- direction
- line height
- grouping

---

# 42. لا نريد "AI-looking minimalism" أيضًا

هناك خطأ آخر يجب تجنبه:

بعد إزالة الزحمة، لا نحول التطبيق إلى:

```text
white/black
huge whitespace
one tiny text
no personality
```

الهدف ليس minimalism.

الهدف:

## Intentional Hierarchy

يمكن أن يكون التصميم غنيًا، لكن كل richness يجب أن تخدم مهمة واضحة.

---

# 43. التغيير المطلوب في Personality

English90 يجب أن يشعر بأنه:

```text
Learning instrument
```

وليس:

```text
AI dashboard
```

ولا:

```text
SaaS analytics product
```

الفرق جوهري.

Learning instrument يعني:

- text first
- calm surfaces
- stable reading rhythm
- low interaction noise
- strong repetition
- predictable placement
- visible but quiet state

---

# 44. Prioritized Implementation Plan

## Phase 1 — Typography cascade

**لا نغير الخطوط نفسها.**

نصلح فقط ownership:

```text
shell → Inter
learning content → Lexend
Arabic → Readex Pro
```

نتيجة مطلوبة:

لا يوجد inheritance عرضي يجعل كل المحتوى Inter.

---

## Phase 2 — Vocabulary geometry

هذا أهم تغيير.

- إزالة الاعتماد على `lg:grid-cols-2` في القراءة الأساسية.
- إنشاء reading column بعرض مضبوط.
- استغلال المساحة خارج العمود كـwhitespace.
- جعل الكلمة وحدة قراءة، لا بطاقة Dashboard.

---

## Phase 3 — VocabularyCard hierarchy

ترتيب المحتوى:

```text
Headword
metadata
Definition
Arabic
Example
Details
```

وإعادة ترتيب visual prominence.

---

## Phase 4 — Reduce framing

خفض:

- excessive rounded containers
- nested borders
- shadows
- rings
- decorative surfaces

لا نحذف interaction.

نحذف visual competition فقط.

---

## Phase 5 — Quiet page chrome

في Day page:

- header أصغر
- focus block أبسط
- infographic أقل prominence
- grammar focus أقل prominence
- tabs واضحة لكن هادئة

---

## Phase 6 — Grammar / Exercise alignment

نطبق نفس hierarchy:

```text
content → interaction → feedback → metadata
```

---

# 45. ما الذي لا يجب تغييره الآن

هذه نقطة مقصودة حتى لا نكرر الخطأ السابق.

**لا نغير:**

- palette
- primary hue
- semantic colors
- logo
- overall brand identity
- database / content
- learning logic
- progress logic
- core functionality

في هذه المرحلة:

> **المشكلة البصرية ستُعالج بالـgeometry + typography + hierarchy + density.**

---

# 46. Definition of Done

لا نعتبر المشكلة محلولة حتى تتحقق كل الشروط التالية:

### Reading width

- التعريفات الطويلة لا تتحول إلى سطور Desktop ضخمة.
- القراءة الأساسية في block مضبوط.
- الهدف قريب من 60–70ch للمحتوى الطويل.

### Typography

- Vocabulary content فعليًا يستخدم Reading Font.
- shell font لا يتسرب للمحتوى التعليمي.
- body line-height مريح وثابت.

### Hierarchy

في كل viewport تعليمي:

```text
1 primary target
1 secondary context
few supporting signals
```

### Containers

- الحدود ليست الوسيلة الأساسية للفصل.
- shadows نادرة.
- nested cards قليلة جدًا.

### Color

- لا يتم إعادة تصميم الـpalette.
- اللون يعبر عن state/action عندما يلزم فقط.

### Interaction

- كل الوظائف الحالية تبقى متاحة.
- لا نضيف feature جديدة فقط لإصلاح التصميم.

### Visual tests

- 3-second target test ينجح.
- grayscale test ينجح.
- 5-word reading test ينجح.
- الانتقال بين word → meaning → example مستقر.

---

# 47. النتيجة النهائية التي نريد الوصول إليها

قبل:

```text
I am looking at a dashboard containing vocabulary.
```

بعد:

```text
I am reading vocabulary.
```

هذا هو الهدف الحقيقي.

لو التغيير يجعل الصفحة "أكثر فخامة" لكنه لا يجعل القراءة أكثر ثباتًا، فهو تغيير فاشل.

لو الصفحة أصبحت أقل بهرجة وأكثر قابلية للتركيز، فهذا هو النجاح حتى لو كان التصميم أقل "استعراضًا".

---

# 48. ترتيب تنفيذ لا يتم كسره

```text
1. Fix font cascade
2. Fix reading width
3. Fix VocabularyCard hierarchy
4. Reduce card framing
5. Quiet page chrome
6. Apply same hierarchy to Grammar
7. Apply same hierarchy to Exercise
8. Only then perform visual polish
```

**لا تبدأ من اللون.**

**لا تبدأ من shadows.**

**لا تبدأ من radius.**

ابدأ من:

> **أين تريد العين أن تنظر؟**

ثم اجعل كل شيء آخر يخدم الإجابة.

---

# 49. المراجع

- W3C WCAG 2.2 — Visual Presentation: https://www.w3.org/TR/WCAG22/#visual-presentation
- W3C WCAG 2.2 — Understanding Visual Presentation: https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation
- W3C WCAG 2.2 — Understanding Text Spacing: https://www.w3.org/WAI/WCAG22/Understanding/text-spacing
- W3C Technique C21 — Line spacing: https://www.w3.org/WAI/WCAG22/Techniques/css/C21.html
- GOV.UK Design System — Layout: https://design-system.service.gov.uk/styles/layout/
- GOV.UK Design System — Spacing: https://design-system.service.gov.uk/styles/spacing/
- Research example on web typography and eye movements: https://pmc.ncbi.nlm.nih.gov/articles/PMC6722069/

---

# Final diagnosis

بعد فحص الكود والـcontent:

> **المشكلة الأساسية ليست أن English90 يستخدم اللون الخطأ. المشكلة أن واجهة التعلم مبنية بعقلية dashboard: كروت + حالات + pills + borders + navigation chrome + معلومات كثيرة في نفس الـviewport، بينما مهمة المستخدم هي القراءة والحفظ.**

وأقوى إصلاح ليس Palette جديدة.

أقوى إصلاح هو:

> **تحويل الـVocabulary من Card Grid إلى Reading System مع عرض ضيق، typography ثابتة، hierarchy واحدة، وvisual chrome هادئ.**

وهناك bug واضح يجب إصلاحه أولًا:

> **`Lexend` المقصود به reading content يتم تغطيته بـ`Inter` بسبب `.e90-shell`.**

هذه الملاحظة وحدها تستحق إصلاحًا مستقلًا قبل الحكم النهائي على readability.
