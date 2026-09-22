# English90 — Color System & Visual Language Audit

> **Scope:** deep forensic analysis of the uploaded English90 codebase, focused on color, visual hierarchy, surface treatment, and the visual patterns that can make a product feel generic or AI-template-like.
>
> **Important:** this document is a **design-system / implementation plan**. It does not change application logic, content, routing, data models, or learning behavior.

---

## 1. Executive conclusion

المشكلة الأساسية في English90 ليست أن "الألوان سيئة".

المشكلة أن النظام الحالي فيه **design intent كويس جدًا، لكن التنفيذ خرج في أكثر من اتجاه في نفس الوقت**.

الفكرة المكتوبة داخل `globals.css` تقول تقريبًا:

- هدوء.
- ألوان muted.
- لا gradients في الـUI.
- accent واحد.
- ألوان semantic محدودة.
- surfaces بسيطة.

لكن الـimplementation الفعلي يضيف فوق ذلك:

- `brand + clay + sky + emerald + amber + rose`.
- نظامي تسمية متداخلين: `zinc / brand / ...` و `night / mist`.
- hardcoded hex colors داخل بعض المكونات.
- `ring` بكثافة عالية.
- shadows بكثافة عالية.
- `backdrop-blur` في الـnavigation والـtabs.
- rounded pills كثيرة جدًا.
- بعض الـcomponents تتعامل مع اللون كجزء من decoration بدل كجزء من information hierarchy.

**النتيجة:** حتى لو كانت كل قيمة لون منفردة "جميلة"، فإن مجموعها يعطي إحساسًا قريبًا من SaaS/AI dashboard template بدل منتج تعليمي له شخصية واضحة.

الحل ليس إضافة ألوان أجمل.

الحل هو:

> **تقليل عدد القرارات البصرية، ثم جعل القرارات القليلة المتبقية لها معنى ثابت جدًا.**

---

# 2. ماذا فحصت داخل المشروع؟

تمت مراجعة المصدر الموجود في:

- `src/app/globals.css`
- `src/components/ui.tsx`
- `src/components/nav.tsx`
- `src/components/grammar-academy.tsx`
- `src/components/day-exercise.tsx`
- `src/components/dashboard/hero-art.tsx`
- `src/app/(app)/page.tsx`
- `src/app/(app)/journey/page.tsx`
- `src/app/(app)/progress/page.tsx`
- `src/app/(app)/day/[day]/page.tsx`
- `src/app/(app)/vocabulary/page.tsx`
- `src/app/(app)/vocabulary/[id]/page.tsx`
- `src/components/vocabulary-card.tsx`
- وباقي الـshared components التي تعتمد على نظام الألوان.

تم كذلك عمل static count على source الحالي للأشكال البصرية المتكررة.

### مؤشرات واضحة في الـcodebase الحالي

| Pattern | Count تقريبي في JSX/TSX | ملاحظته |
|---|---:|---|
| `shadow*` | 93 | كثافة كبيرة نسبيًا، خصوصًا مع rings والـblur |
| `ring-*` | 100 | كثير من الحالات تستخدم ring كـdecoration وليس كـfocus/state فقط |
| `backdrop-blur*` | 12 | موجود بكثرة في shell/navigation |
| `rounded-full` | 88 | استخدام واسع جدًا للـpills/circles |
| `rounded-2xl` | 40 | معظم الـcontainers تتحول إلى cards |
| `rounded-xl` | 42 | يضيف طبقة ثانية من الـcard/control grammar |
| gradient-related usage | 2 في source search المباشر | العدد قليل، لكن الـhero art نفسه يعتمد على عدة طبقات gradient داخل SVG/overlay |
| color-heavy utility occurrences في `grammar-academy.tsx` | 480+ | أكبر hotspot بصري في المشروع |

> **مهم:** الأرقام أعلاه هي static source counts من النسخة المرفوعة، وليست telemetry من runtime.

---

# 3. أول تشخيص مهم: النظام الحالي عنده "ازدواجية هوية"

## 3.1 `brand` يقول شيئًا، والـcomments تقول شيئًا آخر

في `globals.css`، الـ`brand` الحالي هو indigo/slate blue:

```css
--color-brand-600: #3f52a3;
--color-brand-500: #5468bd;
--color-brand-400: #7386d0;
```

لكن داخل `ui.tsx` توجد comments تصف الـprimary accent بأنه **clay**.

هذا ليس مجرد تعليق غير صحيح.

هو مؤشر على أن **الـdesign language تغيرت أثناء التطوير بدون إعادة توحيد الـtokens**.

النتيجة العملية:

- developer يفكر `brand = blue`.
- component documentation تفكر `brand = clay`.
- بعض screens تستخدم `clay` فعليًا.
- semantic colors تستخدم أخضر/أصفر/أزرق/أحمر.

وبالتالي اللون لم يعد يحمل معنى واحدًا على مستوى المنتج.

---

# 4. ثاني تشخيص: عندك أكثر من neutral system

الملف الأساسي يعرف:

- `zinc-*`
- ثم يعرف لاحقًا `night-*`
- ثم `mist-*`

بعض القيم متطابقة تمامًا، وبعضها ليس مطابقًا.

مثال:

```text
zinc-700  = #1c2743
night-700 = #1c2743
```

لكن:

```text
zinc-200 = #c7d3e8
mist-200 = #ccd8ee
```

فأنت لا تملك "neutral واحد"؛ أنت تملك **عدة أسماء لنفس الفكرة مع اختلافات صغيرة**.

هذه الاختلافات الصغيرة هي بالضبط النوع الذي يجعل النظام يفقد coherence مع الوقت.

### القرار المقترح

يجب وجود **neutral scale واحدة فقط**.

ثم semantic aliases فوقها:

```text
surface.canvas
surface.raised
surface.panel
border.subtle
border.default
text.primary
text.secondary
text.tertiary
```

بدل:

```text
zinc-...
night-...
mist-...
```

---

# 5. ثالث تشخيص: المشكلة ليست color palette فقط — المشكلة في "component grammar"

لو غيرنا كل الـhex codes فقط وتركنا نفس الـcomponents، English90 سيظل يبدو قريبًا من template.

السبب هو هذه السلسلة:

```text
rounded container
+ border
+ shadow
+ ring
+ tinted background
+ icon circle
+ status pill
+ another pill
+ another nested card
```

كل component يحاول أن يكون "مميزًا".

ومع تراكم components، الصفحة نفسها تصبح مشبعة بالـmicro-highlights.

المنتج الحقيقي عادة يحتاج شيئًا عكس ذلك:

```text
structure
→ hierarchy
→ one clear action
→ restrained status
→ whitespace
```

وليس:

```text
card
→ badge
→ glow
→ ring
→ icon bubble
→ colored state
→ shadow
```

---

# 6. لماذا هذا يعطي إحساس "AI-generated"؟

هذا وصف بصري، وليس حكمًا تقنيًا.

لكن هناك مجموعة patterns أصبحت شائعة جدًا في generated UI:

1. أزرق/بنفسجي كمحور افتراضي.
2. كل شيء داخل rounded cards.
3. ألوان مختلفة لتوضيح كل معلومة صغيرة.
4. `backdrop-blur`/glass treatment.
5. shadows متعددة بدل hierarchy حقيقي.
6. glow / ring حول active elements.
7. pills في كل مكان.
8. dashboard density مرتفعة مع كل metric له لون.
9. gradients لإعطاء "depth" بدل استخدام layout وtypography.
10. كل section مصمم ليبدو كـcomponent منفصل بدل أن يبدو جزءًا من نفس الصفحة.

المشكلة ليست أن هذه الأدوات ممنوعة.

المشكلة هي استخدامها **في نفس المنتج وبنفس الوقت**.

English90 فيه حاليًا عددًا كافيًا من هذه الإشارات ليظهر هذا الإحساس، حتى مع palette muted.

---

# 7. الاتجاه المقترح للمنتج: "Study Ink"

الهوية المقترحة ليست:

- futuristic AI
- neon productivity
- glass SaaS
- purple/blue tech

بل:

> **Study tool له طابع كتاب/مكتب/حبر حديث — مع accent طبيعي خافت.**

الفكرة النفسية:

```text
ink → concentration
paper → learning
moss → progress / growth
brass → emphasis / achievement
brick → error / destructive
```

هذا يعطي English90 شخصية أقرب إلى **study instrument** وليس AI dashboard.

---

# 8. Color philosophy الجديدة

## القاعدة الأساسية

> **Neutral first. Color second.**

الـneutral يجب أن يحمل معظم الـscreen.

### Internal visual budget heuristic

هذه ليست قاعدة WCAG ولا معيارًا رسميًا؛ هذه قاعدة داخلية مقترحة للمنتج:

```text
~80–90%  neutral surfaces / text
~5–10%   primary accent
~1–5%    semantic colors
<1–2%    decorative color
```

الهدف ليس القياس حرفيًا بالبكسل.

الهدف هو منع الصفحة من أن تصبح "كلها أحداث بصرية".

---

# 9. الـPalette المقترحة — Dark First

الـapp shell الحالي بالفعل dark-first، لذلك يجب تصميم الـsystem حول هذه الحقيقة بدل محاولة جعله يبدو كـlight SaaS مع dark mode.

## 9.1 Canvas & surfaces

| Token | Hex | الاستخدام |
|---|---|---|
| `ink-950` | `#101412` | page canvas |
| `ink-900` | `#171C19` | main surface / card |
| `ink-850` | `#1B211D` | subtle raised surface |
| `ink-800` | `#202822` | selected / interactive surface |
| `ink-700` | `#2B342E` | strong border / separators |
| `ink-600` | `#3A443D` | control borders / visible dividers |

هذه الألوان ليست black/blue.

هي charcoal neutral فيه لمسة خضراء شديدة الخفة؛ لذلك يظل هادئًا من غير الإحساس التقليدي بـ"midnight SaaS".

---

## 9.2 Text

| Token | Hex | الاستخدام |
|---|---|---|
| `paper-100` | `#F1F0E9` | primary text |
| `paper-300` | `#B6BBB2` | secondary text |
| `paper-500` | `#878E86` | tertiary / metadata |
| `paper-600` | `#70786F` | disabled / very quiet metadata |

### Rule

`paper-500` و `paper-600` لا يستخدمان للنص الأساسي.

الـsecondary text يجب أن يظل واضحًا، وليس مجرد "gray that disappears".

---

## 9.3 Primary accent — Moss

| Token | Hex | الاستخدام |
|---|---|---|
| `moss-300` | `#A7BA95` | very soft highlight |
| `moss-400` | `#8FA97D` | dark-mode primary action |
| `moss-500` | `#7F956F` | progress / selected |
| `moss-600` | `#5D745F` | strong tint / semantic backing |
| `moss-700` | `#4F6654` | light-mode primary |

الـmoss هو **اللون الوحيد الذي نسمح له بالظهور بكثافة كمحور للـinteraction**.

ليس مطلوبًا أن يكون أخضرًا ساطعًا.

بل العكس: قوته تأتي من كونه muted ومميز عن blue/purple SaaS palette.

---

## 9.4 Secondary highlight — Brass

| Token | Hex | الاستخدام |
|---|---|---|
| `brass-300` | `#D8B97D` | small highlight |
| `brass-400` | `#C59A5B` | streak / achievement / emphasis |
| `brass-600` | `#7C5D2D` | light-mode text/badge |

**Brass ليس second primary.**

يظهر في:

- streaks
- milestone
- "special" learning moment
- tiny decorative marker

ولا يتحول إلى لون لكل card.

---

## 9.5 Error — Brick

| Token | Hex | الاستخدام |
|---|---|---|
| `brick-300` | `#D59183` | dark-mode error text/indicator |
| `brick-400` | `#C06A5E` | primary error accent |
| `brick-600` | `#9B4B43` | light-mode destructive |

الخطأ يجب أن يكون واضحًا بدون glow أو saturated red.

---

# 10. ماذا نفعل بالـsuccess / warning / info؟

بدل أربع عائلات لونية مختلفة لكل semantic concept، نستخدم:

### Success

أغلب الحالات:

```text
moss + check/icon + text
```

لا نحتاج emerald مستقل إذا كان اللون الرئيسي أصلًا moss.

### Warning

```text
brass + icon + label
```

### Error

```text
brick + icon + label
```

### Info

```text
neutral + moss marker
```

ممكن استخدام blue في حالات قليلة جدًا مثل external link / audio / informational state، لكن ليس كـprimary visual language.

---

# 11. أهم قرار: لا تجعل اللون هو الذي يبني الـhierarchy

بدل:

```text
Card A = blue
Card B = green
Card C = yellow
Card D = purple
```

استخدم:

```text
Card A = same surface
Card B = same surface
Card C = same surface
Card D = same surface
```

ثم hierarchy تأتي من:

1. الحجم.
2. typography.
3. whitespace.
4. divider.
5. position.
6. icon.
7. color — في النهاية.

هذا مهم جدًا لEnglish90 لأن المحتوى نفسه غني:

- 50 words.
- translations.
- examples.
- grammar.
- audio.
- review states.
- progress.

لو كل نوع محتوى أخذ لونًا مختلفًا، الصفحة تصبح noisy جدًا.

---

# 12. قواعد الـsurface الجديدة

## Rule 1 — not every section is a card

أكبر تغيير مطلوب.

لو section لا يحتاج isolation حقيقي، لا تضعه في:

```text
rounded + border + shadow
```

يمكنه أن يكون مجرد content block يفصل بينه وبين اللي بعده:

```text
heading
content

──────── divider

heading
content
```

أكثر هدوءًا، وأكثر نضجًا.

---

## Rule 2 — shadows almost disappear

نستخدم shadow أساسًا عندما يكون هناك **elevation حقيقي**:

- dropdown
- modal
- floating menu
- overlay

أما cards داخل الصفحة:

```text
border + surface difference
```

تكفي في أغلب الحالات.

### المطلوب

لا تستخدم shadow لكي تقول "هذه card".

استخدم contrast في surface أو separator.

---

## Rule 3 — no glass for ordinary navigation

الـnavigation الحالي يستخدم:

```text
backdrop-blur
+ alpha background
+ shadow
+ ring
```

هذا يعطي glass / AI-SaaS feel.

المقترح:

```text
solid dark surface
+ 1px border
+ almost no shadow
```

وتظل الـnavigation ثابتة وواضحة من غير أن تحاول أن تكون "futuristic".

---

# 13. Border language

الـborder يجب أن يعبّر عن structure، وليس decoration.

## ثلاث درجات فقط

```text
subtle  → sections / quiet separators
default → inputs / cards
strong  → active / focused state
```

لا نحتاج عشر درجات border visually.

### مهم

لا تستخدم `ring` كبديل للـborder في كل active state.

الـring يستخدم أساسًا للـfocus أو حالة تحتاج distinction واضح.

---

# 14. Radius language

الـcurrent system يستخدم عددًا ضخمًا من `rounded-full` و`rounded-xl/2xl`.

المقترح:

| Element | Radius |
|---|---|
| page-level hero | 20–24px |
| major card | 14–18px |
| standard card | 12–14px |
| input / button | 10–12px |
| small badge | 7–9px |
| pill | فقط عندما يكون semantic مناسبًا |
| avatar / icon circle | full |

### قاعدة بسيطة

لو كل حاجة pill، ولا حاجة تبان special.

---

# 15. Buttons

## Primary

Primary button هو المكان الطبيعي الوحيد الذي نسمح فيه بالـaccent fill الواضح.

Dark mode:

```text
background = moss-400
foreground = ink-950
```

هذا pair يعطي contrast مرتفعًا جدًا في الـspot check.

## Secondary

```text
surface + border
```

ليس button ملونًا ثانيًا.

## Ghost

```text
transparent
→ subtle hover surface
```

## Destructive

يبدأ neutral.

ويصبح brick عند الحاجة / hover / confirmed destructive context.

---

# 16. Navigation

## الوضع الحالي

الـactive nav يميل إلى:

```text
colored fill
+ shadow
+ ring
```

المقترح:

```text
surface tint
+ small moss indicator
+ stronger text
```

مثال بصري:

```text
Home
Day 22       ← active: very subtle surface + 2px moss marker
Grammar
Journey
Review
```

ليس كل active destination يحتاج badge-like pill.

---

# 17. Tabs

الـTabBar الحالي هو segmented control واضح جدًا.

لا يجب أن تكون كل مجموعة tabs في شكل "pill container".

لشاشات القراءة/التعلم:

```text
text tab
────────────
active tab = text + moss underline / small marker
```

ولـsmall compact filters فقط، segmented control مقبول.

هذا سيغير الإحساس العام للموقع أكثر مما سيغيره تبديل 20 لون.

---

# 18. Progress UI

Progress عنصر مهم جدًا في English90.

لكن progress لا يحتاج دائمًا إلى color fill قوي.

## القاعدة

### Track

neutral.

### Fill

moss.

### Special milestone

brass marker صغير.

### Failed / incorrect

brick marker فقط عند الحاجة.

لا نستخدم أربعة ألوان في كل progress system.

---

# 19. Grammar Academy — أكبر hotspot

`src/components/grammar-academy.tsx` هو أهم ملف يحتاج refactor بصري.

ليس لأن المحتوى سيئ، بل لأن كثافة الـcolor utilities مرتفعة جدًا.

في الصفحة الواحدة يوجد مزيج من:

- brand
- emerald
- clay
- night
- mist
- zinc
- rings
- bordered pills
- colored statuses
- multiple dark surfaces

### الاتجاه المقترح

اجعل الـgrammar screen تقريبًا:

```text
ink background
↓
paper text
↓
neutral section divisions
↓
moss for selected/current
↓
brass for one special learning emphasis
↓
brick only for error
```

وهذا وحده سيجعل الصفحة تبدو أقل "template" بكثير.

---

# 20. Day Exercise — إزالة الـhardcoded colors

في `day-exercise.tsx` توجد colors مباشرة خارج الـtoken system، مثل:

```text
#34d399
#fbbf24
#f87171
#131c31
#1f2d4e
#060a12
```

هذا خطر على consistency.

كل colors يجب أن تذهب إلى semantic tokens.

مثال:

```text
excellent → moss
needs review → brass
wrong → brick
```

لكن لا نريد تحويل كل score إلى full colored background.

يفضل:

```text
icon + label + tiny marker
```

مع surface neutral.

---

# 21. Hero Art

`hero-art.tsx` يحتوي عدة طبقات gradient/overlay في الـillustration.

هذا ليس نفس خطورة gradient في UI controls، لأن الـart نفسه يمكن أن يحتاج tonal transitions.

لكن مع اتجاه English90 الجديد:

## مسموح

- gradient داخل artwork نفسه.
- tonal sky / mountain treatment.
- image-based atmosphere.

## غير مرغوب

- gradient button.
- gradient tab.
- gradient card.
- gradient badge.
- gradient text.
- glow وراء كل interactive element.

### القاعدة

> **The illustration may have atmosphere. The interface should have restraint.**

---

# 22. Light theme

الكود الحالي يحتوي support للـlight theme، لكن `AppLayout` يفرض `dark` على `.e90-shell`.

هذا يجعل هناك mismatch معماري:

```text
root theme preference
        ↓
   dark/light class
        ↓
AppLayout forces dark
```

قبل إعادة توسيع palette للـlight mode، يجب اتخاذ قرار واضح:

### القرار المقترح

- **App shell = dark-first coherent system.**
- أي light surfaces خارج الـapp shell يمكن أن تستخدم paper palette.
- لو أردنا light app mode لاحقًا، يُبنى كـpaired system وليس مجرد قلب الألوان.

Apple توصي أصلًا بأن dark mode ليس مجرد inversion ميكانيكي للـlight palette؛ الألوان والـsurfaces يجب أن تتكيف حسب الـappearance.  

---

# 23. Paper palette للـfuture light mode

لو سيتم دعم light mode كامل لاحقًا:

| Token | Hex |
|---|---|
| `paper-canvas` | `#F4F0E8` |
| `paper-surface` | `#FBF9F3` |
| `paper-raised` | `#EEE9DD` |
| `paper-line` | `#D8D2C5` |
| `ink-text` | `#1B201C` |
| `ink-muted` | `#5C645B` |
| `moss-solid` | `#4F6654` |
| `brass-solid` | `#7C5D2D` |
| `brick-solid` | `#9B4B43` |

هذه palette تجعل الـlight mode يبدو أقرب إلى paper/editorial study environment بدل white SaaS dashboard.

---

# 24. Accessibility / contrast

المبدأ المستخدم هنا متوافق مع WCAG:

- النص العادي: **4.5:1 على الأقل**.
- النص الكبير: **3:1 على الأقل**.
- عناصر الـUI / meaningful graphical objects: **3:1 على الأقل** مقابل adjacent colors حيث ينطبق ذلك.

### Spot checks على الـnew palette

```text
paper-100 #F1F0E9 on ink-950 #101412  ≈ 16.25:1
paper-300 #B6BBB2 on ink-950 #101412  ≈ 9.50:1
moss-400  #8FA97D on ink-950 #101412  ≈ 7.20:1
brass-400 #C59A5B on ink-950 #101412  ≈ 7.20:1
brick-400 #C06A5E on ink-950 #101412  ≈ 4.83:1
moss-700  #4F6654 on white           ≈ 6.25:1
```

هذه **spot checks** وليست replacement عن full accessibility audit.

المصدر: W3C WCAG 2.2 وUnderstanding Success Criterion 1.4.3 / 1.4.11.

---

# 25. قاعدة مهمة: لا تعتمد على اللون وحده

مثلاً:

```text
green = correct
red = wrong
```

هذا غير كافٍ وحده.

الأفضل:

```text
✓ Correct
✕ Incorrect
```

مع اللون كطبقة إضافية.

هذه القاعدة مهمة خصوصًا في:

- quizzes
- review states
- vocabulary states
- progress
- grammar result

Apple وW3C كلاهما يؤكدان أن اللون لا يجب أن يكون الطريقة الوحيدة لفهم حالة أو معلومة مهمة.

---

# 26. Semantic color architecture الجديدة

بدل استخدام اسم اللون في كل component:

```text
bg-emerald-950
text-emerald-300
border-emerald-800
```

نبدأ بالتفكير semantic-first:

```text
--ui-accent
--ui-accent-strong
--ui-accent-soft

--ui-success
--ui-success-soft

--ui-warning
--ui-warning-soft

--ui-danger
--ui-danger-soft

--ui-surface
--ui-surface-raised
--ui-border
--ui-text
--ui-text-muted
```

هذا يفصل **المعنى** عن **الـhue**.

وهذا يسمح بتغيير الهوية بدون إعادة بناء كل component.

فكرة semantic aliases معروفة أيضًا في design systems مثل Radix Colors، حيث يتم فصل معنى اللون عن scale نفسه. 

---

# 27. Architecture المقترحة للـtokens

بدل:

```text
zinc-950
night-900
mist-300
brand-600
clay-400
```

نحو:

```css
--color-surface-canvas
--color-surface-default
--color-surface-raised
--color-surface-interactive

--color-border-subtle
--color-border-default
--color-border-strong

--color-text-primary
--color-text-secondary
--color-text-tertiary

--color-accent
--color-accent-hover
--color-accent-soft

--color-highlight
--color-danger
--color-danger-soft
```

ثم نربط هذه الـsemantic tokens بالـpalette الداخلية.

---

# 28. قاعدة interaction state

كل interactive component يجب أن يمر عبر الحالات التالية:

```text
rest
hover
pressed
focus
selected
disabled
```

ولكن ليس المطلوب أن كل state يغير:

- background
- border
- ring
- shadow
- color
- opacity

في نفس اللحظة.

اختر **signal واحدًا أو اثنين** لكل state.

مثال:

### Hover

```text
surface + slightly stronger text
```

### Selected

```text
surface tint + accent marker
```

### Focus

```text
visible focus ring
```

### Pressed

```text
1–2px movement أو surface shift
```

### Disabled

```text
contrast reduction + cursor state
```

هذا يقلل visual noise جدًا.

---

# 29. ممنوعات صريحة داخل النظام الجديد

## ممنوع 1

Gradient داخل:

- primary buttons
- tabs
- cards
- badges
- text

## ممنوع 2

Glow لمجرد أن العنصر active.

## ممنوع 3

ثلاث shadows لنفس component.

## ممنوع 4

Colored background لكل metric.

## ممنوع 5

Pill لكل label.

## ممنوع 6

Icon داخل colored circle إلا إذا الدائرة نفسها لها purpose.

## ممنوع 7

إضافة لون جديد إلى component بدون تعريف semantic role له.

## ممنوع 8

Hardcoded hex داخل JSX/TSX للـUI.

---

# 30. قاعدة "one hero per screen"

كل screen يمكن أن يكون له **one dominant visual anchor** فقط.

مثلاً Home:

```text
Hero / current day
    ↓
Journey structure
    ↓
Progress
```

لا تجعل:

```text
hero + colored stat cards + colored stage cards + colored badges + glowing tabs
```

كلها anchors متنافسة.

---

# 31. Typography يجب أن تحمل جزءًا أكبر من الـhierarchy

أحد أسباب زيادة اللون هو محاولة جعل المعلومات المختلفة تبدو مختلفة.

الحل ليس مزيدًا من الألوان.

الحل:

```text
font size
font weight
line height
spacing
position
```

English90 عنده أصلًا:

- Inter للـshell
- Lexend للمحتوى الإنجليزي
- Readex Pro للعربية

وهذا كافٍ جدًا لبناء hierarchy غني من غير الحاجة إلى تلوين كل layer.

---

# 32. Spacing كجزء من color strategy

الـvisual calm لا يأتي من اللون وحده.

لو عندك لون هادئ جدًا لكن:

```text
10 cards
12 badges
15 icons
20 borders
```

في viewport صغير، الصفحة ستظل noisy.

لذلك الـnew system يجب أن يقلل أيضًا عدد الـvisual boundaries.

### قاعدة

> **One divider can replace three cards.**

---

# 33. Component migration map

## Phase 1 — Tokens only

### File

```text
src/app/globals.css
```

### المطلوب

- حذف duplicate neutral aliases.
- تعريف semantic tokens.
- تعريف dark-first palette.
- الاحتفاظ بـfocus colors واضحة.
- عدم تغيير layout.

---

## Phase 2 — Shared primitives

### File

```text
src/components/ui.tsx
```

ابدأ هنا لأن معظم الشاشات تعتمد عليه.

### الأولويات

1. `buttonClass`
2. `Card`
3. `TabBar`
4. `StatTile`
5. `ProgressBar`
6. `Eyebrow`
7. `ErrorState`

### النتيجة المطلوبة

لو أصلحت `ui.tsx`، جزء كبير من الموقع يتغير بشكل متسق تلقائيًا.

---

## Phase 3 — Navigation

### File

```text
src/components/nav.tsx
```

### المطلوب

- remove heavy glass.
- reduce shadow.
- active state يصبح subtle surface + moss marker.
- secondary links تبقى neutral.
- bottom nav لا يحتاج glowing active pill.

---

## Phase 4 — Grammar Academy

### File

```text
src/components/grammar-academy.tsx
```

هذا أكبر visual cleanup.

الهدف:

```text
neutral 80%+
accent for current state
brass for special emphasis
brick only for error
```

---

## Phase 5 — Day Exercise

### File

```text
src/components/day-exercise.tsx
```

### المطلوب

- إزالة hardcoded hex colors.
- تحويل score colors إلى semantic tokens.
- تقليل colored result boxes.
- الحفاظ على وضوح correctness.

---

## Phase 6 — Home / Journey / Progress

### Files

```text
src/app/(app)/page.tsx
src/app/(app)/journey/page.tsx
src/app/(app)/progress/page.tsx
```

### المطلوب

- تقليل card-on-card.
- تقليل rings.
- neutralize secondary metrics.
- accent واحد للـcurrent progress.
- brass فقط للحظات milestone.

---

# 34. ترتيب التنفيذ المقترح

لا تبدأ بتعديل كل screen يدويًا.

الترتيب الصحيح:

```text
1. Token system
2. Shared primitives
3. Nav
4. Grammar
5. Day Exercise
6. Home
7. Journey
8. Progress
9. Vocabulary
10. Settings/Admin edge cases
```

هذا يمنع أن نخلق 8 palettes محلية مختلفة أثناء إعادة التصميم.

---

# 35. Validation بعد كل مرحلة

بعد كل refactor، لا نسأل:

> "هل اللون حلو؟"

السؤال الصحيح:

### 1. هل أعرف أين أنظر أولًا؟

### 2. هل الـprimary action واضح؟

### 3. هل الـstatus واضح بدون اللون؟

### 4. هل الصفحة تبدو كمنتج واحد؟

### 5. هل هناك أكثر من accent يتنافس؟

### 6. هل هناك card ليس لها سبب حقيقي؟

### 7. هل يوجد glow / ring / shadow يمكن حذفه بدون loss؟

### 8. هل النص الثانوي ما زال مقروءًا؟

### 9. هل الـactive state واضح بدون أن يكون shouting؟

### 10. هل الـscreen ما زال يبدو جيدًا عند grayscale؟

اختبار الـgrayscale مهم جدًا هنا:

لو الصفحة تنهار بصريًا بدون الألوان، فهذا يعني أن hierarchy نفسها ضعيفة.

---

# 36. اختبار مهم جدًا: grayscale test

اعمل screenshot لكل screen ثم راجعها grayscale.

المفروض تظل واضحة:

```text
headline
section hierarchy
primary action
progress
selected state
warning/error
```

لو كل هذه تختفي بدون اللون، لا تضف ألوانًا.

أصلح:

- spacing
- size
- weight
- shape
- position
- separators

أولًا.

---

# 37. اختبار ثاني: squint test

صغر الـscreen أو اعمل blur بصري بسيط.

اسأل:

> ما هي أول 3 مناطق تلفت العين؟

في الصفحة التعليمية الجيدة، غالبًا يجب أن تكون:

```text
current learning context
main action
progress / next action
```

وليس:

```text
badge
icon
colored stat
border
shadow
```

---

# 38. اختبار ثالث: color removal

اعمل temporary CSS:

```css
* {
  filter: grayscale(1);
}
```

ثم راجع hierarchy.

لا يجب أن تصبح الصفحة "مملة" عند grayscale؛ يجب أن تبقى منظمة.

---

# 39. الاختيار النهائي للهوية

لو سنلتزم باتجاه واحد للمشروع، فالاتجاه هو:

> **English90 = quiet study instrument, not AI dashboard.**

ترجمة ذلك إلى visual system:

```text
charcoal / paper surfaces
        +
muted moss accent
        +
small brass moments
        +
brick for errors
        +
strong typography
        +
fewer cards
        +
fewer pills
        +
minimal shadows
        +
no UI gradients
```

---

# 40. ما الذي لا نغيّره؟

هذا المشروع لا يحتاج visual rewrite شامل.

لا نغيّر الآن:

- routing
- data models
- Prisma
- learning logic
- vocabulary logic
- audio architecture
- grammar logic
- authentication
- content

التغيير المطلوب في المرحلة الأولى هو **visual language فقط**.

---

# 41. Definition of Done

نعتبر نظام الألوان الجديد جاهزًا عندما:

```text
[ ] يوجد neutral system واحد
[ ] يوجد accent رئيسي واحد
[ ] يوجد highlight ثانوي واحد
[ ] يوجد danger واضح
[ ] لا توجد hardcoded UI colors خارج token layer
[ ] لا توجد duplicate neutral scales
[ ] الـnavigation لا تعتمد على glass effect
[ ] active states لا تحتاج glow
[ ] cards ليست الوسيلة الوحيدة للـhierarchy
[ ] tabs ليست كلها pills
[ ] progress لا يتحول إلى rainbow
[ ] grammar screen أصبحت هادئة بصريًا
[ ] day exercise يستخدم semantic states
[ ] grayscale hierarchy ما زالت واضحة
[ ] focus state ما زالت واضحة
[ ] contrast checks تمر
```

---

# 42. Research notes / principles behind the direction

## W3C / WCAG 2.2

W3C يحدد حدًا أدنى للنص العادي قدره 4.5:1، والنص الكبير 3:1، كما يحدد 3:1 للـnon-text contrast في الحالات التي تحتاج فيها العناصر البصرية إلى أن تكون قابلة للتمييز.

المراجع:

- WCAG 2.2 — W3C
- Understanding SC 1.4.3 Contrast (Minimum)
- Understanding SC 1.4.11 Non-text Contrast

## Apple Human Interface Guidelines

إرشادات Apple الحديثة تؤكد على استخدام accent color بشكل judicious، وعلى تصميم dark mode كحالة مستقلة وليست مجرد عكس ميكانيكي للألوان، كما تؤكد على عدم الاعتماد على اللون وحده لإيصال المعلومات المهمة.

## Radix Colors

Radix تستخدم فكرة scales متعددة الدرجات مع semantic aliases، وتفصل بين color scale وبين semantic role مثل `accent` و`success` و`danger`. هذا مناسب جدًا للهدف هنا: أن يكون معنى اللون منفصلًا عن اسم الـhue.

---

# 43. Final implementation principle

أهم قاعدة في المشروع كله:

> **لا نحاول جعل English90 يبدو "أجمل" بإضافة أشياء. نجعله يبدو أصدق بحذف الأشياء التي لا يحتاجها.**

التحسين الحقيقي هنا لن يكون:

```text
more color
more glow
more gradient
more cards
```

بل:

```text
fewer colors
fewer borders
fewer shadows
fewer pills
stronger hierarchy
better spacing
clearer semantic roles
```

وده هو المسار الذي سيبعد English90 عن شكل الـAI-generated SaaS ويخليه يبدو كمنتج له visual identity خاصة به.
