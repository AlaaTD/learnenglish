import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "content");

// 1. Missing noteArabic for Days 1 to 10 mistakes
const MISTAKES_ARABIC_MAP = {
  // Day 1
  "I wakes up at seven.": "مع ضمائر المتكلم والجمع (I, you, we, they) نستخدم الفعل في المصدر بدون إضافة -s.",
  "He don't work on Fridays.": "مع ضمائر المفرد الغائب (he, she, it) نستخدم doesn't في النفي وليس don't.",
  "Does she works in a bank?": "بعد الفعل المساعد does، يعود الفعل الأساسي إلى صيغة المصدر المجردة بدون -s.",
  "I am wake up early every day.": "للتعبير عن العادات اليومية نستخدم زمن المضارع البسيط مباشرة، ولا نضع am/is/are قبل الفعل الأساسي.",

  // Day 2
  "He are my brother.": "نستخدم 'is' مع ضمائر المفرد الغائب (he, she, it) والأسماء المفردة.",
  "They is married.": "نستخدم 'are' مع ضمائر الجمع والمخاطب (they, we, you) والأسماء الجمع.",
  "I is a student.": "ضمير المتكلم 'I' يقترن دائماً بـ 'am' في المضارع (I am أو I'm).",

  // Day 3
  "There is three rooms in the apartment.": "نستخدم 'There are' مع أسماء الجمع مثل 'three rooms'.",
  "There are a big balcony.": "نستخدم 'There is' مع الأسماء المفردة مثل 'a big balcony'.",
  "The mirror is in the wall.": "الأشياء المثبتة على سطح الحائط تأخذ حرف الجر 'on' وليس 'in'.",
  "The cat is next of the chair.": "التركيب الصحيح لحرف الجر دائماً هو 'next to' ولا نستخدم 'next of'.",

  // Day 4
  "He have a new laptop.": "مع ضمائر المفرد الغائب (he, she, it) نستخدم 'has' وليس 'have'.",
  "She doesn't has a car.": "بعد أداة النفي doesn't، يعود الفعل دائماً إلى المصدر المجرد 'have'.",
  "This is he jacket.": "نستخدم صفة الملكية 'his' للمذكر قبل الاسم، وليس ضمير الفاعل 'he'.",
  "I lost my's wallet.": "صفات الملكية (my, your, his, her) لا تضاف لها أبداً فاصلة الملكية 's.",

  // Day 5
  "I am like pizza.": "الفعل 'like' فعل أساسي في الجملة ولا نضع قبله فعل الكينونة 'am'.",
  "She love fresh fruit.": "مع الفاعل المفرد (he, she, it) نضيف -s لنهاية الفعل في المضارع البسيط: 'loves'.",

  // Day 6
  "I go often to the gym.": "توضع ظروف التكرار (often, always, usually) قبل الفعل الأساسي مباشرة.",
  "She rarely is late.": "مع فعل الكينونة (am, is, are) يأتي ظرف التكرار بعده وليس قبله.",

  // Day 7
  "I will see you in Monday.": "نستخدم حرف الجر 'on' مع أيام الأسبوع وتواريخ الأيام، وليس 'in'.",
  "The session begins on 8:00.": "نستخدم حرف الجر 'at' مع الساعات والأوقات المحددة بالساعة والدقيقة.",

  // Day 8
  "He cans speak English.": "الأفعال الناقصة مثل 'can' لا تقبل إضافة -s إطلاقاً حتى مع الفاعل المفرد.",
  "I can to drive.": "يأتي بعد 'can' المصدر المجرد بدون 'to' (لا تقل can to).",

  // Day 9
  "He works in an bank.": "كلمة 'bank' تبدأ بصوت ساكن (/b/)، لذا نستخدم معها أداة التنكير 'a' وليس 'an'.",
  "She goes to an university.": "كلمة 'university' تبدأ بنطق صوت ساكن شبه صوت الياء (/j/)، لذا تأخذ 'a' وليس 'an'.",

  // Day 10
  "Where do you from?": "للسؤال عن الموطن أو الأصل نستخدم فعل الكينونة 'Where are you from?' بدون do.",
  "What are you do for a job?": "عند السؤال عن المهنة أو الفعل الأساسي، نستخدم الفعل المساعد 'do' (ماذا تفعل) وليس 'are'."
};

// 2. Rich bilingual commonUsage for Days 1 to 10
const DAY_USAGE_MAP = {
  1: {
    "Present Simple": [
      "Use the Present Simple for habits and daily routines that repeat: 'I drink coffee every morning.' (استخدم المضارع البسيط للعادات والروتين اليومي المتكرر: 'أشرب القهوة كل صباح'.)",
      "Use it with frequency adverbs (always, usually, sometimes, never) to express how often: 'She never arrives late.' (استخدمه مع ظروف التكرار لبيان مدى تكرار الفعل: 'هي لا تتأخر أبداً'.)",
      "Use it for universal facts and scientific truths: 'Water boils at 100 degrees.' (استخدمه للحقائق العلمية والثابتة: 'الماء يغلي عند 100 درجة'.)",
      "Use it for fixed schedules and public timetables: 'The train departs at six.' (استخدمه للمواعيد والجداول الزمنية المحددة مسبقاً: 'القطار يغادر في السادسة'.)"
    ]
  },
  2: {
    "Verb be and Subject Pronouns": [
      "Always pair 'am' exclusively with the pronoun 'I' (I am / I'm): 'I am ready.' (يقترن 'am' حصرياً مع الضمير 'I': 'أنا مستعد'.)",
      "Use contractions in everyday speech and messages: he's, she's, it's, we're, they're. (استخدم الاختصارات في المحادثات والرسائل اليومية السريعة مثل he's و they're.)",
      "In yes/no questions, invert the subject and verb: 'You are tired' becomes 'Are you tired?'. (في الأسئلة، اعكس ترتيب الفاعل والفعل: 'Are you tired?'.)",
      "Negative sentences are formed by placing 'not' directly after the verb be: 'He is not here.' (يتكون النفي بوضع 'not' مباشرة بعد فعل الكينونة: 'He is not here'.)"
    ]
  },
  3: {
    "There is / There are": [
      "Use 'There is' (There's) with singular countable nouns and uncountable nouns: 'There's a sofa in the living room.' (استخدم 'There is' مع الأسماء المفردة وغير المعدودة: 'توجد أريكة في غرفة المعيشة'.)",
      "Use 'There are' with plural countable nouns: 'There are two windows.' (استخدم 'There are' مع أسماء الجمع: 'توجد نافذتان'.)",
      "Use 'any' with plural negatives and questions: 'Are there any cups in the kitchen?' (استخدم 'any' مع صيغ النفي والأسئلة لجمع الأشياء: 'هل توجد أي أكواب؟'.)",
      "Short answers repeat is/are: 'Is there a balcony?' - 'Yes, there is.' / 'No, there isn't.' (في الإجابات المختصرة نكرر is/are: 'Yes, there is'.)"
    ],
    "Prepositions of Place": [
      "Use 'on' when an object touches a flat surface or wall: 'The clock is on the wall.' (استخدم 'on' عندما يكون الشيء ملامساً لسطح مستوٍ أو جدار: 'الساعة على الجدار'.)",
      "Use 'in' when an object is inside a 3D enclosed space or room: 'The keys are in the drawer.' (استخدم 'in' عندما يكون الشيء داخل مساحة مغلقة أو غرفة: 'المفاتيح في الدرج'.)",
      "Use 'next to' or 'beside' for immediate adjacency side-by-side: 'The lamp is next to the bed.' (استخدم 'next to' أو 'beside' للدلالة على المجاورة المباشرة جنباً إلى جنب.)",
      "Use 'between' when locating something between two distinct objects: 'The desk is between the windows.' (استخدم 'between' لتحديد موقع شيء يقع بين شيئين محددين.)"
    ]
  },
  4: {
    "Have / Has": [
      "Use 'have' with I, you, we, they, and plural nouns: 'They have a cozy house.' (استخدم 'have' مع I و you و we و they والجمع: 'لديهم منزل دافئ'.)",
      "Use 'has' with he, she, it, and singular nouns: 'He has an urgent meeting.' (استخدم 'has' مع he و she و it والمفرد: 'لديه اجتماع عاجل'.)",
      "In negatives, use 'don't have' or 'doesn't have' — never say doesn't has: 'She doesn't have time.' (في النفي، استخدم don't have أو doesn't have — ولا تقل doesn't has أبداً.)",
      "In questions, start with Do or Does: 'Do you have a question?' / 'Does he have a car?' (في الأسئلة، ابدأ بـ Do أو Does واجعل الفعل المصدر have دائماً.)"
    ],
    "Possessive Adjectives": [
      "Possessive adjectives always precede a noun directly: 'my keys', 'his phone', 'our project'. (تأتي صفات الملكية دائماً قبل الاسم مباشرة لتحديد صاحبه: 'مفاتيحي'، 'هاتفه'.)",
      "Distinguish 'its' (possessive: 'The dog wagged its tail') from 'it's' (contraction of it is). (ميز بين its الملكية بدون فاصلة، و it's التي تعني 'إنه يكون'.)",
      "Their vs There vs They're: 'their car' (ملكية), 'over there' (مكان), 'they're coming' (هم قادمون). (انتبه للتشابه الصوتي: their للملكية، there للمكان، they're اختصار they are.)",
      "Do not use articles (a/an/the) before possessive adjectives: say 'my friend', not 'the my friend'. (لا تضع أداة تعريف قبل صفة الملكية: قل my friend مباشرة.)"
    ]
  },
  5: {
    "Like, Love, Hate + Noun": [
      "Follow these feeling verbs directly with a noun or an -ing activity: 'I love fresh coffee.' / 'I love reading.' (يتبع هذه الأفعال اسم مباشر أو نشاط بصيغة ing: 'أحب القهوة الطازجة'.)",
      "Express degrees of preference: hate < don't like < like < really like < love. (تدرج التفضيل: الكره hate، ثم عدم الإعجاب don't like، ثم الإعجاب like، ثم الحب الشديد love.)",
      "In negatives with he/she/it, use doesn't like/hate: 'He doesn't like cold weather.' (مع المفرد الغائب ننفي بـ doesn't like بدون s في الفعل.)",
      "In questions, use Do / Does: 'Do you like Italian food?' - 'Yes, I do.' (في السؤال استخدم Do أو Does: 'هل تحب الطعام الإيطالي؟'.)"
    ]
  },
  6: {
    "Adverbs of Frequency": [
      "Place frequency adverbs immediately BEFORE the main verb: 'I usually study at night.' (ضع ظرف التكرار قبل الفعل الأساسي مباشرة: 'أنا عادة أدرس في الليل'.)",
      "Place frequency adverbs AFTER the verb 'be' (am, is, are): 'She is always punctual.' (ضع ظرف التكرار بعد فعل الكينونة be مباشرة: 'هي دائماً دقيقة في المواعيد'.)",
      "In questions with 'How often', answer with a frequency adverb or phrase: 'How often do you train?' - 'Twice a week.' (للسؤال عن التكرار استخدم 'How often': 'كم مرة تتدرب؟'.)",
      "Negative adverbs like 'never' and 'rarely' make the sentence negative without needing 'not'. (الظروف مثل never و rarely تعطي معنى النفي بنفسها دون الحاجة لأداة نفي إضافية.)"
    ]
  },
  7: {
    "Prepositions of Time (at, on, in)": [
      "Use 'at' for precise clock times and specific moments: 'at 7:30 AM', 'at noon', 'at night', 'at midnight'. (استخدم 'at' للأوقات المحددة بالساعة ولحظات معينة مثل at noon و at night.)",
      "Use 'on' for days of the week and specific calendar dates: 'on Monday', 'on May 15th', 'on my birthday'. (استخدم 'on' لأيام الأسبوع والتواريخ المحددة بيوم.)",
      "Use 'in' for longer periods: months, seasons, years, decades, and parts of the day: 'in June', 'in winter', 'in 2026', 'in the morning'. (استخدم 'in' للفترات الأطول كالشهور والفصول والسنوات وأجزاء اليوم.)",
      "Do NOT use at/on/in before 'next', 'last', 'every', or 'this': 'I saw him last Monday', not on last Monday. (لا تضع حرف جر قبل كلمات مثل next أو last أو every أو this.)"
    ]
  },
  8: {
    "Can / Can't for Ability": [
      "Can is a modal auxiliary: it NEVER changes form and NEVER adds -s: 'He can speak fluent Arabic.' (الفعل can لا يتغير شكله أبداً ولا يضاف له -s مع المفرد.)",
      "Always follow can with the bare base infinitive without 'to': 'She can dance', not 'can to dance'. (يتبع can دائماً الفعل في المصدر المجرد بدون to.)",
      "Pronunciation tip: 'can' is usually unstressed /kən/, while 'can't' is stressed and clearer /kænt/ or /kɑːnt/. (في النطق، تُنطق can بنبرة خفيفة، بينما can't بنبرة قوية واضحة.)",
      "Use can also for polite requests and asking for permission: 'Can you help me with this luggage?' (تُستخدم can أيضاً لطلب المساعدة أو الاستئذان بلباقة.)"
    ]
  },
  9: {
    "Articles a / an / the": [
      "Use 'a' before consonant SOUNDS: 'a car', 'a user' (/juː/), 'a European city' (/j/). (استخدم 'a' قبل الأصوات الساكنة — العبرة بالصوت المنطوق وليس الحرف المكتوب.)",
      "Use 'an' before vowel SOUNDS: 'an apple', 'an hour' (الصامت h غير ملفوظ), 'an honest person'. (استخدم 'an' قبل الأصوات المتحركة — مثل an hour لأن حرف h صامت.)",
      "Use 'the' when both the speaker and listener know which specific item is meant: 'Pass the salt, please.' (استخدم 'the' عندما يكون الشيء معلوماً ومحدداً للطرفين.)",
      "Zero article: do not use a/an with plural or uncountable general nouns: 'Books expand our horizons.' (لا تضع أداة تنكير مع أسماء الجمع العامة أو الأسماء غير المعدودة العامة.)"
    ]
  },
  10: {
    "Questions with be and do (Review)": [
      "Identify whether the sentence has an action verb or describes a state: action verbs use 'do/does', state/identity uses 'am/is/are'. (إذا كانت الجملة تحتوي على فعل حركة نستخدم do/does، وإذا كانت هوية أو وصفاً نستخدم be.)",
      "Question word order: Question word + Auxiliary (do/does/is/are) + Subject + Base verb/Complement? (ترتيب السؤال: أداة الاستفهام + الفعل المساعد + الفاعل + الفعل الأساسي أو التكملة.)",
      "Short answers repeat the auxiliary: 'Do you work here?' - 'Yes, I do.' / 'Are they ready?' - 'No, they aren't.' (في الإجابات السريعة نكرر الفعل المساعد المستخدم في السؤال.)",
      "Never use do/does together with am/is/are in the same clause: say 'Do you know?', not 'Are you know?'. (لا تجمع بين do وأفعال be في نفس السؤال إطلاقاً.)"
    ]
  }
};

// 3. Extra structures for lessons that have < 3 structures
const EXTRA_STRUCTURES = {
  3: {
    "Prepositions of Place": [
      {
        pattern: "Subject + verb + preposition + noun phrase",
        label: "General Pattern · النمط العام",
        explanation: "Indicates the exact spatial position of a person or object.",
        explanationArabic: "يوضح الموقع المكاني الدقيق لشخص أو شيء بالنسبة لغيره."
      }
    ]
  },
  4: {
    "Possessive Adjectives": [
      {
        pattern: "Is this / Are these + possessive adjective + noun ...?",
        label: "Question Pattern · صيغة السؤال",
        explanation: "Used to ask about ownership or possession of an item.",
        explanationArabic: "تُستخدم للسؤال عن ملكية أو صاحب الشيء."
      }
    ]
  },
  15: {
    "How much / How many": [
      {
        pattern: "How much + uncountable noun + is there / do you have?",
        label: "Uncountable Question · سؤال الكمية",
        explanation: "Asks about the quantity of an uncountable item.",
        explanationArabic: "يُسأل به عن كمية شيء غير معدود (مثل المال أو السكر)."
      },
      {
        pattern: "How many + plural countable noun + are there / do you have?",
        label: "Countable Question · سؤال العدد",
        explanation: "Asks about the exact number of countable objects.",
        explanationArabic: "يُسأل به عن العدد الدقيق لأشياء قابلة للعد."
      }
    ],
    "Much and Many": [
      {
        pattern: "Subject + negative auxiliary + much + uncountable noun",
        label: "Negative with Much · النفي مع Much",
        explanation: "Expresses a small or insufficient amount of an uncountable item.",
        explanationArabic: "ينفي وجود كمية كبيرة من شيء غير معدود."
      },
      {
        pattern: "Subject + negative auxiliary + many + plural countable noun",
        label: "Negative with Many · النفي مع Many",
        explanation: "Expresses a small number of countable items in negative sentences.",
        explanationArabic: "ينفي وجود عدد كبير من الأشياء المعدودة."
      }
    ]
  },
  19: {
    "Polite Requests with Could": [
      {
        pattern: "Could I please + base verb ...?",
        label: "Asking Permission · طلب الإذن بأدب",
        explanation: "Politely requests permission to do something.",
        explanationArabic: "طلب الإذن بالقيام بفعل معين بأعلى درجات الأدب."
      }
    ]
  },
  20: {
    "Review: Questions and Short Answers": [
      {
        pattern: "Question Word + Auxiliary + Subject + Main Verb ...?",
        label: "Information Question · سؤال لطلب معلومات",
        explanation: "Standard Wh- question order for asking about specific facts.",
        explanationArabic: "الترتيب القياسي لأسئلة المعلومات (ماذا، أين، متى، كيف)."
      }
    ]
  },
  27: {
    "Imperatives": [
      {
        pattern: "Please + base verb ... / Base verb ..., please.",
        label: "Polite Request / Directive · توجيه مهذب",
        explanation: "Softens the imperative to sound courteous and polite.",
        explanationArabic: "تلطيف صيغة الأمر لتبدو كطلب مهذب ولبق."
      }
    ],
    "Prepositions of Movement": [
      {
        pattern: "Subject + walk / go + into / out of + building or room",
        label: "Entering / Exiting · الدخول والخروج",
        explanation: "Shows movement crossing a boundary to enter or leave an enclosed space.",
        explanationArabic: "يُعبر عن الحركة لاجتياز مدخل أو حدود للدخول إلى أو الخروج من مكان."
      },
      {
        pattern: "Subject + go / walk + through / across / along + path",
        label: "Transit and Direction · العبور والسير في مسار",
        explanation: "Describes passing inside a tunnel/park (through), over a surface/street (across), or beside a line (along).",
        explanationArabic: "يصف المرور عبر مساحة مجسمة (through) أو عبور شارع (across) أو السير بمحاذاة طريق (along)."
      }
    ]
  },
  44: {
    "May / Might / Could for Possibility": [
      {
        pattern: "Subject + may / might not + base verb",
        label: "Negative Possibility · احتمال عدم الحدوث",
        explanation: "Shows that something possibly will not happen (note: 'could not' means impossibility, not uncertainty).",
        explanationArabic: "يوضح احتمال عدم وقوع الفعل (مع ملاحظة أن could not تعني الاستحالة وليس الشك)."
      }
    ]
  },
  45: {
    "Gerund vs Infinitive (remember, stop, try)": [
      {
        pattern: "remember / stop / try + verb-ing",
        label: "Gerund Meaning · المعنى مع اسم الفاعل",
        explanation: "Focuses on the memory of a past event (remember), quitting a habit (stop), or experimenting (try).",
        explanationArabic: "يتعلق بذكرى حدث ماضٍ (remember)، أو الإقلاع عن عادة نهائياً (stop)، أو تجربة وسيلة جديدة (try)."
      },
      {
        pattern: "remember / stop / try + to + base verb",
        label: "Infinitive Meaning · المعنى مع المصدر",
        explanation: "Focuses on not forgetting a duty (remember), pausing to perform a purpose (stop), or making an effort (try).",
        explanationArabic: "يتعلق بأداء واجب مستقبلي (remember)، أو التوقف المؤقت لغرض آخر (stop)، أو بذل جهد شاق (try)."
      }
    ]
  },
  48: {
    "So / Such for Results": [
      {
        pattern: "Subject + verb + so + adjective / adverb + that + result clause",
        label: "so ... that · لدرجة أن",
        explanation: "Emphasizes the extreme degree of a quality leading to a consequence.",
        explanationArabic: "يؤكد بلوغ الصفة أو الظرف درجة عالية ترتبت عليها نتيجة معينة."
      },
      {
        pattern: "Subject + verb + such + (a/an) + adjective + noun + that + result clause",
        label: "such ... that · لدرجة أن مع الاسم",
        explanation: "Used before an adjective modifying a noun to describe a notable result.",
        explanationArabic: "يُستخدم قبل الصفة المتبوعة باسم للتعبير عن نتيجة قوية مترتبة على ذلك."
      }
    ]
  }
};

let updatedMistakesCount = 0;
let updatedUsageCount = 0;
let updatedStructuresCount = 0;

for (let d = 1; d <= 50; d++) {
  const pad = String(d).padStart(2, "0");
  const filePath = join(contentDir, `day-${pad}.json`);
  const data = JSON.parse(readFileSync(filePath, "utf8"));
  let fileChanged = false;

  for (const g of data.grammar || []) {
    // 1. Update noteArabic
    for (const m of g.commonMistakes || []) {
      if (!m.noteArabic && MISTAKES_ARABIC_MAP[m.wrong]) {
        m.noteArabic = MISTAKES_ARABIC_MAP[m.wrong];
        updatedMistakesCount++;
        fileChanged = true;
      }
    }

    // 2. Update commonUsage for Days 1 to 10
    if (DAY_USAGE_MAP[d] && DAY_USAGE_MAP[d][g.title]) {
      g.commonUsage = DAY_USAGE_MAP[d][g.title];
      updatedUsageCount++;
      fileChanged = true;
    }

    // 3. Add extra structures if defined
    if (EXTRA_STRUCTURES[d] && EXTRA_STRUCTURES[d][g.title]) {
      const extraList = EXTRA_STRUCTURES[d][g.title];
      for (const extra of extraList) {
        const exists = g.structures.some((s) => s.pattern === extra.pattern);
        if (!exists) {
          g.structures.push(extra);
          updatedStructuresCount++;
          fileChanged = true;
        }
      }
    }
  }

  if (fileChanged) {
    writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
    console.log(`Updated day-${pad}.json`);
  }
}

console.log("\nEnrichment Summary:");
console.log(`- Updated ${updatedMistakesCount} common mistakes with noteArabic`);
console.log(`- Updated ${updatedUsageCount} lessons with rich bilingual commonUsage`);
console.log(`- Added ${updatedStructuresCount} new grammatical structures`);
