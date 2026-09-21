import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(root, "content");

// ==========================================
// DAY 6: My Week
// ==========================================
const day06 = {
  day: 6,
  stage: "Foundation — Daily Life",
  title: "My Week",
  topic: "Days of the week, habits and free time",
  description: "Say how often you do things and talk about your week.",
  focus: "Master 50 core words for days of the week, frequency adverbs, leisure activities and habits; master 'Adverbs of Frequency'; engage with 3 realistic dialogues and 3 reading texts.",
  vocabulary: [
    {
      headword: "often",
      pronunciation: "/ˈɒfn/",
      partOfSpeech: "adverb",
      definition: "many times on different occasions; frequently",
      example: "I often run in the neighborhood park before work.",
      relatedForms: [],
      collocations: ["how often", "quite often", "very often"],
      synonyms: ["frequently", "regularly"],
      antonyms: ["rarely", "seldom"],
      tags: ["time", "frequency"],
      translation: "غالباً / في كثير من الأحيان",
      exampleArabic: "غالباً ما أركض في حديقة الحي قبل العمل."
    },
    {
      headword: "rarely",
      pronunciation: "/ˈreəli/",
      partOfSpeech: "adverb",
      definition: "not often; seldom; only on a few occasions",
      example: "He rarely stays up late on a weekday night.",
      relatedForms: [],
      collocations: ["rarely happen", "rarely see", "very rarely"],
      synonyms: ["seldom", "infrequently"],
      antonyms: ["often", "frequently"],
      tags: ["time", "frequency"],
      translation: "نادراً",
      exampleArabic: "نادراً ما يسهر لوقت متأخر في ليلة من أيام الأسبوع."
    },
    {
      headword: "seldom",
      pronunciation: "/ˈseldəm/",
      partOfSpeech: "adverb",
      definition: "almost never; not commonly or frequently",
      example: "We seldom eat fast food because we love cooking at home.",
      relatedForms: [],
      collocations: ["seldom seen", "seldom speak", "very seldom"],
      synonyms: ["rarely", "scarcely"],
      antonyms: ["often", "frequently"],
      tags: ["time", "frequency"],
      translation: "قلما / نادراً جداً",
      exampleArabic: "قلما نأكل الوجبات السريعة لأننا نحب الطبخ في المنزل."
    },
    {
      headword: "hardly ever",
      pronunciation: "/ˈhɑːdli ˈevə/",
      partOfSpeech: "adverb",
      definition: "almost never; on very few occasions indeed",
      example: "She hardly ever misses her weekly swimming session.",
      relatedForms: [],
      collocations: ["hardly ever go", "hardly ever complain"],
      synonyms: ["almost never"],
      antonyms: ["always", "constantly"],
      tags: ["time", "frequency"],
      translation: "قلما يحدث ذلك / نادراً للغاية",
      exampleArabic: "نادراً للغاية ما تفوت جلستها الأسبوعية للسباحة."
    },
    {
      headword: "frequently",
      pronunciation: "/ˈfriːkwəntli/",
      partOfSpeech: "adverb",
      definition: "regularly or happening at short intervals",
      example: "They frequently travel to coastal towns during the summer.",
      relatedForms: ["frequent (adjective)"],
      collocations: ["frequently ask", "occur frequently", "visit frequently"],
      synonyms: ["often", "regularly"],
      antonyms: ["rarely", "seldom"],
      tags: ["time", "frequency"],
      translation: "بشكل متكرر / مراراً",
      exampleArabic: "يسافرون بشكل متكرر إلى المدن الساحلية خلال الصيف."
    },
    {
      headword: "occasionally",
      pronunciation: "/əˈkeɪʒnəli/",
      partOfSpeech: "adverb",
      definition: "at infrequent or irregular intervals; from time to time",
      example: "We occasionally go to the cinema on Saturday evening.",
      relatedForms: ["occasional (adjective)"],
      collocations: ["meet occasionally", "occasionally visit", "happen occasionally"],
      synonyms: ["sometimes", "now and then"],
      antonyms: ["always", "constantly"],
      tags: ["time", "frequency"],
      translation: "بين الحين والآخر / أحياناً",
      exampleArabic: "نذهب أحياناً إلى السينما مساء يوم السبت."
    },
    {
      headword: "regularly",
      pronunciation: "/ˈreɡjələli/",
      partOfSpeech: "adverb",
      definition: "at uniform intervals of time; with a steady rhythm or habit",
      example: "She regularly practices speaking English with her study partner.",
      relatedForms: ["regular (adjective)"],
      collocations: ["exercise regularly", "meet regularly", "practice regularly"],
      synonyms: ["consistently", "routinely"],
      antonyms: ["irregularly"],
      tags: ["time", "frequency"],
      translation: "بانتظام / بصورة دورية",
      exampleArabic: "تمارس التحدث باللغة الإنجليزية بانتظام مع زميل دراستها."
    },
    {
      headword: "constantly",
      pronunciation: "/ˈkɒnstəntli/",
      partOfSpeech: "adverb",
      definition: "all the time or repeatedly without stopping",
      example: "He constantly checks his phone for new messages during study hours.",
      relatedForms: ["constant (adjective)"],
      collocations: ["constantly check", "constantly learn", "change constantly"],
      synonyms: ["continuously", "always"],
      antonyms: ["rarely"],
      tags: ["time", "frequency"],
      translation: "باستمرار / بشكل دائم",
      exampleArabic: "يتفقد هاتفه باستمرار بحثاً عن رسائل جديدة خلال ساعات الدراسة."
    },
    {
      headword: "weekly",
      pronunciation: "/ˈwiːkli/",
      partOfSpeech: "adverb",
      definition: "once a week or every week",
      example: "Our group meets weekly to discuss new English vocabulary books.",
      relatedForms: ["weekly (adjective)"],
      collocations: ["meet weekly", "weekly schedule", "weekly planner"],
      synonyms: ["every week"],
      antonyms: [],
      tags: ["time", "routine"],
      translation: "أسبوعياً",
      exampleArabic: "تجتمع مجموعتنا أسبوعياً لمناقشة كتب المفردات الإنجليزية الجديدة."
    },
    {
      headword: "monthly",
      pronunciation: "/ˈmʌnθli/",
      partOfSpeech: "adverb",
      definition: "once a month or every month",
      example: "We review our financial budget and expenses monthly.",
      relatedForms: ["monthly (adjective)"],
      collocations: ["pay monthly", "review monthly", "monthly report"],
      synonyms: ["every month"],
      antonyms: [],
      tags: ["time", "routine"],
      translation: "شهرياً",
      exampleArabic: "نراجع ميزانيتنا المالية ونفقاتنا شهرياً."
    },
    {
      headword: "yearly",
      pronunciation: "/ˈjɪəli/",
      partOfSpeech: "adverb",
      definition: "once a year or every year",
      example: "The school organizes a big sports competition yearly.",
      relatedForms: ["yearly (adjective)"],
      collocations: ["yearly visit", "celebrate yearly", "yearly plan"],
      synonyms: ["annually"],
      antonyms: [],
      tags: ["time", "routine"],
      translation: "سنوياً",
      exampleArabic: "تنظم المدرسة مسابقة رياضية كبيرة سنوياً."
    },
    {
      headword: "once",
      pronunciation: "/wʌns/",
      partOfSpeech: "adverb",
      definition: "on one occasion or for one time only",
      example: "I swim in the municipal pool once a week.",
      relatedForms: [],
      collocations: ["once a week", "once a month", "just once"],
      synonyms: ["singly"],
      antonyms: [],
      tags: ["time", "frequency"],
      translation: "مرة واحدة",
      exampleArabic: "أسبح في حمام السباحة البلدي مرة واحدة في الأسبوع."
    },
    {
      headword: "twice",
      pronunciation: "/twaɪs/",
      partOfSpeech: "adverb",
      definition: "two times; on two occasions",
      example: "He jogs around the neighborhood park twice a day.",
      relatedForms: [],
      collocations: ["twice a day", "twice a week", "think twice"],
      synonyms: [],
      antonyms: [],
      tags: ["time", "frequency"],
      translation: "مرتين",
      exampleArabic: "يهرول حول حديقة الحي مرتين في اليوم."
    },
    {
      headword: "monday",
      pronunciation: "/ˈmʌndeɪ/",
      partOfSpeech: "noun",
      definition: "the first day of the working week, following Sunday",
      example: "Our English course begins on Monday morning at nine.",
      relatedForms: [],
      collocations: ["on Monday", "Monday morning", "next Monday"],
      synonyms: [],
      antonyms: [],
      tags: ["time", "days"],
      translation: "يوم الإثنين",
      exampleArabic: "تبدأ دورتنا في اللغة الإنجليزية صباح يوم الإثنين في التاسعة."
    },
    {
      headword: "tuesday",
      pronunciation: "/ˈtjuːzdeɪ/",
      partOfSpeech: "noun",
      definition: "the day of the week between Monday and Wednesday",
      example: "I have a football match scheduled for next Tuesday.",
      relatedForms: [],
      collocations: ["on Tuesday", "Tuesday afternoon", "every Tuesday"],
      synonyms: [],
      antonyms: [],
      tags: ["time", "days"],
      translation: "يوم الثلاثاء",
      exampleArabic: "لدي مباراة كرة قدم مجدولة ليوم الثلاثاء القادم."
    },
    {
      headword: "wednesday",
      pronunciation: "/ˈwenzdeɪ/",
      partOfSpeech: "noun",
      definition: "the day of the week between Tuesday and Thursday",
      example: "We visit the art museum every Wednesday afternoon.",
      relatedForms: [],
      collocations: ["on Wednesday", "Wednesday morning", "next Wednesday"],
      synonyms: [],
      antonyms: [],
      tags: ["time", "days"],
      translation: "يوم الأربعاء",
      exampleArabic: "نزور متحف الفنون بعد ظهر كل أربعاء."
    },
    {
      headword: "thursday",
      pronunciation: "/ˈθɜːzdeɪ/",
      partOfSpeech: "noun",
      definition: "the day of the week between Wednesday and Friday",
      example: "She goes to the gym on Thursday evening after work.",
      relatedForms: [],
      collocations: ["on Thursday", "Thursday night", "every Thursday"],
      synonyms: [],
      antonyms: [],
      tags: ["time", "days"],
      translation: "يوم الخميس",
      exampleArabic: "تذهب إلى الصالة الرياضية مساء يوم الخميس بعد العمل."
    },
    {
      headword: "friday",
      pronunciation: "/ˈfraɪdeɪ/",
      partOfSpeech: "noun",
      definition: "the day of the week between Thursday and Saturday",
      example: "Friday is a special family day for prayer and gathering.",
      relatedForms: [],
      collocations: ["on Friday", "Friday prayer", "Friday evening"],
      synonyms: [],
      antonyms: [],
      tags: ["time", "days"],
      translation: "يوم الجمعة",
      exampleArabic: "يوم الجمعة هو يوم عائلي مميز للصلاة والتجمع."
    },
    {
      headword: "saturday",
      pronunciation: "/ˈsætədeɪ/",
      partOfSpeech: "noun",
      definition: "the day of the week between Friday and Sunday",
      example: "On Saturday, I relax at home and read my favorite novel.",
      relatedForms: [],
      collocations: ["on Saturday", "Saturday morning", "Saturday night"],
      synonyms: [],
      antonyms: [],
      tags: ["time", "days"],
      translation: "يوم السبت",
      exampleArabic: "يوم السبت، أسترخي في المنزل وأقرأ روايتي المفضلة."
    },
    {
      headword: "sunday",
      pronunciation: "/ˈsʌndeɪ/",
      partOfSpeech: "noun",
      definition: "the day of the week between Saturday and Monday",
      example: "We prepare our weekly plan every Sunday evening.",
      relatedForms: [],
      collocations: ["on Sunday", "Sunday evening", "Sunday dinner"],
      synonyms: [],
      antonyms: [],
      tags: ["time", "days"],
      translation: "يوم الأحد",
      exampleArabic: "نعد خطتنا الأسبوعية مساء كل أحد."
    },
    {
      headword: "week",
      pronunciation: "/wiːk/",
      partOfSpeech: "noun",
      definition: "a period of seven consecutive days",
      example: "There are seven days in a full week.",
      relatedForms: ["weekly (adverb)"],
      collocations: ["this week", "next week", "last week"],
      synonyms: [],
      antonyms: [],
      tags: ["time", "periods"],
      translation: "أسبوع",
      exampleArabic: "توجد سبعة أيام في الأسبوع الكامل."
    },
    {
      headword: "weekend",
      pronunciation: "/ˌwiːkˈend/",
      partOfSpeech: "noun",
      definition: "the days of the week when many people do not work, especially Saturday and Sunday",
      example: "What are your special plans for this upcoming weekend?",
      relatedForms: [],
      collocations: ["have a nice weekend", "over the weekend", "weekend break"],
      synonyms: [],
      antonyms: ["weekday"],
      tags: ["time", "leisure"],
      translation: "عطلة نهاية الأسبوع",
      exampleArabic: "ما هي خططك الخاصة لعطلة نهاية الأسبوع القادمة هذه؟"
    },
    {
      headword: "weekday",
      pronunciation: "/ˈwiːkdeɪ/",
      partOfSpeech: "noun",
      definition: "any day of the week other than Sunday or Saturday",
      example: "I get up early on weekdays to catch the morning train.",
      relatedForms: [],
      collocations: ["on a weekday", "weekday morning", "busy weekday"],
      synonyms: ["working day"],
      antonyms: ["weekend"],
      tags: ["time", "work"],
      translation: "يوم عمل عادي (خلال الأسبوع)",
      exampleArabic: "أستيقظ مبكراً في أيام الأسبوع العادية للحاق بقطار الصباح."
    },
    {
      headword: "month",
      pronunciation: "/mʌnθ/",
      partOfSpeech: "noun",
      definition: "each of the twelve named periods into which a year is divided",
      example: "February is the shortest month of the entire calendar year.",
      relatedForms: ["monthly (adverb)"],
      collocations: ["this month", "next month", "end of the month"],
      synonyms: [],
      antonyms: [],
      tags: ["time", "calendar"],
      translation: "شهر",
      exampleArabic: "فبراير هو أقصر شهر في السنة التقويمية بأكملها."
    },
    {
      headword: "year",
      pronunciation: "/jɪə/",
      partOfSpeech: "noun",
      definition: "the time taken by the earth to make one complete orbit around the sun (365 days)",
      example: "I set three clear goals for myself at the start of each new year.",
      relatedForms: ["yearly (adverb)"],
      collocations: ["new year", "last year", "next year"],
      synonyms: ["twelvemonth"],
      antonyms: [],
      tags: ["time", "calendar"],
      translation: "سنة / عام",
      exampleArabic: "أحدد ثلاثة أهداف واضحة لنفسي في بداية كل عام جديد."
    },
    {
      headword: "calendar",
      pronunciation: "/ˈkælɪndə/",
      partOfSpeech: "noun",
      definition: "a chart or series of pages showing the days, weeks, and months of a year",
      example: "Mark your exam date clearly on the wall calendar.",
      relatedForms: [],
      collocations: ["wall calendar", "desk calendar", "check the calendar"],
      synonyms: ["almanac"],
      antonyms: [],
      tags: ["time", "organization"],
      translation: "تقويم / رزنامة",
      exampleArabic: "حدد موعد امتحانك بوضوح على تقويم الحائط."
    },
    {
      headword: "schedule",
      pronunciation: "/ˈʃedjuːl/",
      partOfSpeech: "noun",
      definition: "a plan for carrying out a process or procedure, giving lists of times and events",
      example: "My daily study schedule includes two hours of listening practice.",
      relatedForms: [],
      collocations: ["busy schedule", "tight schedule", "daily schedule"],
      synonyms: ["timetable", "program"],
      antonyms: [],
      tags: ["time", "organization"],
      translation: "جدول زمني / جدول مواعيد",
      exampleArabic: "يتضمن جدول دراستي اليومي ساعتين من ممارسة الاستماع."
    },
    {
      headword: "plan",
      pronunciation: "/plæn/",
      partOfSpeech: "noun",
      definition: "a detailed proposal for doing or achieving something",
      example: "We have a solid plan to improve our English fluency this term.",
      relatedForms: ["plan (verb)"],
      collocations: ["action plan", "make a plan", "solid plan"],
      synonyms: ["strategy", "scheme"],
      antonyms: [],
      tags: ["goals", "organization"],
      translation: "خطة / مخطط",
      exampleArabic: "لدينا خطة قوية لتحسين طلاقتنا في اللغة الإنجليزية هذا الفصل."
    },
    {
      headword: "activity",
      pronunciation: "/ækˈtɪvəti/",
      partOfSpeech: "noun",
      definition: "a thing that a person or group does or has done",
      example: "Outdoor physical activity is essential for maintaining high energy.",
      relatedForms: ["active (adjective)"],
      collocations: ["physical activity", "daily activity", "leisure activity"],
      synonyms: ["pursuit", "undertaking"],
      antonyms: ["inactivity"],
      tags: ["leisure", "health"],
      translation: "نشاط / فعالية",
      exampleArabic: "النشاط البدني في الهواء الطلق ضروري للحفاظ على طاقة عالية."
    },
    {
      headword: "hobby",
      pronunciation: "/ˈhɒbi/",
      partOfSpeech: "noun",
      definition: "an activity done regularly in one's leisure time for pleasure",
      example: "His favorite hobby is playing the guitar on weekend afternoons.",
      relatedForms: [],
      collocations: ["favorite hobby", "pursue a hobby", "have a hobby"],
      synonyms: ["pastime", "interest"],
      antonyms: [],
      tags: ["leisure", "interests"],
      translation: "هواية",
      exampleArabic: "هوايته المفضلة هي العزف على الغيتار في فترات ما بعد ظهر عطلة نهاية الأسبوع."
    },
    {
      headword: "sport",
      pronunciation: "/spɔːt/",
      partOfSpeech: "noun",
      definition: "an activity involving physical exertion and skill in which an individual or team competes",
      example: "Basketball is a fast-paced sport that requires great teamwork.",
      relatedForms: ["sporty (adjective)"],
      collocations: ["play sport", "watch sport", "favorite sport"],
      synonyms: ["athletics"],
      antonyms: [],
      tags: ["sports", "fitness"],
      translation: "رياضة",
      exampleArabic: "كرة السلة هي رياضة سريعة الوتيرة تتطلب عملاً جماعياً رائعاً."
    },
    {
      headword: "game",
      pronunciation: "/ɡeɪm/",
      partOfSpeech: "noun",
      definition: "a form of play or sport, especially a competitive one played according to rules",
      example: "We play an entertaining board game together every Friday night.",
      relatedForms: [],
      collocations: ["board game", "video game", "play a game"],
      synonyms: ["match", "contest"],
      antonyms: [],
      tags: ["leisure", "games"],
      translation: "لعبة / مباراة",
      exampleArabic: "نلعب لعبة طاولة مسلية معاً كل مساء جمعة."
    },
    {
      headword: "match",
      pronunciation: "/mætʃ/",
      partOfSpeech: "noun",
      definition: "a contest in which people or teams compete against each other in a sport",
      example: "Are you going to watch the football match on television tonight?",
      relatedForms: [],
      collocations: ["football match", "tennis match", "win a match"],
      synonyms: ["game", "fixture"],
      antonyms: [],
      tags: ["sports", "events"],
      translation: "مباراة رياضية",
      exampleArabic: "هل ستشاهد مباراة كرة القدم على التلفزيون الليلة؟"
    },
    {
      headword: "gym",
      pronunciation: "/dʒɪm/",
      partOfSpeech: "noun",
      definition: "a hall or room equipped with facilities for physical exercise and fitness",
      example: "I go to the gym three times a week to lift weights.",
      relatedForms: [],
      collocations: ["go to the gym", "gym workout", "join a gym"],
      synonyms: ["fitness center"],
      antonyms: [],
      tags: ["fitness", "places"],
      translation: "صالة ألعاب رياضية / جيم",
      exampleArabic: "أذهب إلى صالة الألعاب الرياضية ثلاث مرات أسبوعياً لرفع الأثقال."
    },
    {
      headword: "pool",
      pronunciation: "/puːl/",
      partOfSpeech: "noun",
      definition: "a small area of still water, or an artificial basin constructed for swimming",
      example: "The community sports center has a heated indoor swimming pool.",
      relatedForms: [],
      collocations: ["swimming pool", "indoor pool", "jump in the pool"],
      synonyms: ["swimming pool"],
      antonyms: [],
      tags: ["leisure", "places"],
      translation: "مسبح / حوض سباحة",
      exampleArabic: "يحتوي المركز الرياضي المجتمعي على مسبح داخلي دافئ."
    },
    {
      headword: "park",
      pronunciation: "/pɑːk/",
      partOfSpeech: "noun",
      definition: "a large public garden or area of land used for recreation and walking",
      example: "Families gather in the green park on sunny Saturday afternoons.",
      relatedForms: [],
      collocations: ["public park", "walk in the park", "city park"],
      synonyms: ["gardens", "green space"],
      antonyms: [],
      tags: ["places", "nature"],
      translation: "حديقة عامة / منتزه",
      exampleArabic: "تتجمع العائلات في المنتزه الأخضر في فترات ما بعد ظهر السبت المشمسة."
    },
    {
      headword: "cinema",
      pronunciation: "/ˈsɪnəmə/",
      partOfSpeech: "noun",
      definition: "a movie theater where films are shown for public entertainment",
      example: "We watched a fascinating historical documentary at the cinema.",
      relatedForms: [],
      collocations: ["go to the cinema", "cinema ticket", "local cinema"],
      synonyms: ["movie theater", "pictures"],
      antonyms: [],
      tags: ["entertainment", "places"],
      translation: "سينما / دار عرض",
      exampleArabic: "شاهدنا فيلماً وثائقياً تاريخياً مشوقاً في السينما."
    },
    {
      headword: "museum",
      pronunciation: "/mjuːˈziːəm/",
      partOfSpeech: "noun",
      definition: "a building in which objects of historical, scientific, or artistic interest are exhibited",
      example: "The national museum has an outstanding collection of ancient artifacts.",
      relatedForms: [],
      collocations: ["art museum", "visit a museum", "history museum"],
      synonyms: [],
      antonyms: [],
      tags: ["culture", "places"],
      translation: "متحف",
      exampleArabic: "يضم المتحف الوطني مجموعة متميزة من القطع الأثرية القديمة."
    },
    {
      headword: "concert",
      pronunciation: "/ˈkɒnsət/",
      partOfSpeech: "noun",
      definition: "a musical performance given in public, typically by several performers or of several compositions",
      example: "They attended a classical music concert at the town theater.",
      relatedForms: [],
      collocations: ["music concert", "live concert", "go to a concert"],
      synonyms: ["performance", "show"],
      antonyms: [],
      tags: ["entertainment", "music"],
      translation: "حفلة موسيقية",
      exampleArabic: "حضروا حفلة موسيقية كلاسيكية في مسرح البلدة."
    },
    {
      headword: "play",
      pronunciation: "/pleɪ/",
      partOfSpeech: "verb",
      definition: "to engage in activity for enjoyment and recreation rather than a serious purpose",
      example: "The children play football in the courtyard every evening.",
      relatedForms: ["player (noun)"],
      collocations: ["play football", "play chess", "play guitar"],
      synonyms: ["participate", "compete"],
      antonyms: ["work"],
      tags: ["actions", "leisure"],
      verbForms: { v1: "play", v2: "played", v3: "played" },
      translation: "يلعب / يعزف",
      exampleArabic: "يلعب الأطفال كرة القدم في الفناء كل مساء."
    },
    {
      headword: "swim",
      pronunciation: "/swɪm/",
      partOfSpeech: "verb",
      definition: "to propel oneself through water using bodily movements",
      example: "I swim forty laps in the indoor pool every Tuesday.",
      relatedForms: ["swimmer (noun)"],
      collocations: ["swim laps", "swim in the pool", "learn to swim"],
      synonyms: [],
      antonyms: [],
      tags: ["actions", "sports"],
      verbForms: { v1: "swim", v2: "swam", v3: "swum" },
      translation: "يسبح",
      exampleArabic: "أسبح أربعين دورة في المسبح الداخلي كل يوم ثلاثاء."
    },
    {
      headword: "run",
      pronunciation: "/rʌn/",
      partOfSpeech: "verb",
      definition: "to move at a speed faster than a walk, never having both feet on the ground at the same time",
      example: "He runs five kilometers along the river every Thursday.",
      relatedForms: ["runner (noun)"],
      collocations: ["run fast", "run five kilometers", "run a marathon"],
      synonyms: ["sprint", "race"],
      antonyms: ["walk"],
      tags: ["actions", "sports"],
      verbForms: { v1: "run", v2: "ran", v3: "run" },
      translation: "يركض / يجري",
      exampleArabic: "يركض خمسة كيلومترات على طول النهر كل يوم خميس."
    },
    {
      headword: "jog",
      pronunciation: "/dʒɒɡ/",
      partOfSpeech: "verb",
      definition: "to run at a steady, gentle pace, especially as a form of physical exercise",
      example: "She jogs gently through the neighborhood every Wednesday morning.",
      relatedForms: ["jogger (noun)"],
      collocations: ["go jogging", "jog in the park", "morning jog"],
      synonyms: ["trot"],
      antonyms: ["sprint"],
      tags: ["actions", "sports"],
      verbForms: { v1: "jog", v2: "jogged", v3: "jogged" },
      translation: "يهرول (ركض خفيف للرياضة)",
      exampleArabic: "تهرول بهدوء عبر الحي كل صباح أربعاء."
    },
    {
      headword: "read",
      pronunciation: "/riːd/",
      partOfSpeech: "verb",
      definition: "to look at and comprehend the meaning of written or printed matter",
      example: "I read two chapters of an English novel before going to sleep.",
      relatedForms: ["reader (noun)"],
      collocations: ["read a book", "read carefully", "read aloud"],
      synonyms: ["peruse", "scan"],
      antonyms: [],
      tags: ["actions", "learning"],
      verbForms: { v1: "read", v2: "read", v3: "read" },
      translation: "يقرأ",
      exampleArabic: "أقرأ فصلين من رواية إنجليزية قبل النوم."
    },
    {
      headword: "write",
      pronunciation: "/raɪt/",
      partOfSpeech: "verb",
      definition: "to mark letters, words, or other symbols on paper or computer with a pen, pencil, or keyboard",
      example: "She writes a thoughtful entry in her personal journal every Sunday.",
      relatedForms: ["writer (noun)"],
      collocations: ["write notes", "write an essay", "write neatly"],
      synonyms: ["inscribe", "compose"],
      antonyms: [],
      tags: ["actions", "learning"],
      verbForms: { v1: "write", v2: "wrote", v3: "written" },
      translation: "يكتب",
      exampleArabic: "تكتب تدوينة مفيدة في مذكراتها الشخصية كل يوم أحد."
    },
    {
      headword: "listen",
      pronunciation: "/ˈlɪsn/",
      partOfSpeech: "verb",
      definition: "to give attention with the ear to hearing sounds, speech, or music",
      example: "We listen to English audio recordings while traveling to university.",
      relatedForms: ["listener (noun)"],
      collocations: ["listen carefully", "listen to music", "listen to podcast"],
      synonyms: ["hear", "hearken"],
      antonyms: ["ignore"],
      tags: ["actions", "senses"],
      verbForms: { v1: "listen", v2: "listened", v3: "listened" },
      translation: "يستمع / يُنصت",
      exampleArabic: "نستمع إلى تسجيلات صوتية باللغة الإنجليزية أثناء السفر إلى الجامعة."
    },
    {
      headword: "travel",
      pronunciation: "/ˈtrævl/",
      partOfSpeech: "verb",
      definition: "to make a journey, typically of some length or to a distant place",
      example: "They travel to new countries twice a year to learn about other cultures.",
      relatedForms: ["traveler (noun)"],
      collocations: ["travel abroad", "travel by train", "travel widely"],
      synonyms: ["journey", "voyage"],
      antonyms: ["stay"],
      tags: ["actions", "travel"],
      verbForms: { v1: "travel", v2: "traveled", v3: "traveled" },
      translation: "يسافر / يرتحل",
      exampleArabic: "يسافرون إلى بلدان جديدة مرتين في السنة للتعرف على ثقافات أخرى."
    },
    {
      headword: "stay",
      pronunciation: "/steɪ/",
      partOfSpeech: "verb",
      definition: "to remain in the same place and not depart or move away",
      example: "We stay at home on cold rainy days and watch educational films.",
      relatedForms: [],
      collocations: ["stay at home", "stay calm", "stay awake"],
      synonyms: ["remain", "abide"],
      antonyms: ["leave", "travel"],
      tags: ["actions", "living"],
      verbForms: { v1: "stay", v2: "stayed", v3: "stayed" },
      translation: "يمكث / يبقى",
      exampleArabic: "نبقى في المنزل في الأيام الممطرة الباردة ونشاهد أفلاماً تعليمية."
    },
    {
      headword: "practice",
      pronunciation: "/ˈpræktɪs/",
      partOfSpeech: "verb",
      definition: "to perform an activity repeatedly or regularly in order to improve proficiency",
      example: "You must practice English conversation every day to speak fluently.",
      relatedForms: ["practiced (adjective)"],
      collocations: ["practice speaking", "daily practice", "practice regularly"],
      synonyms: ["train", "rehearse"],
      antonyms: ["neglect"],
      tags: ["actions", "learning"],
      verbForms: { v1: "practice", v2: "practiced", v3: "practiced" },
      translation: "يمارس / يتدرب على",
      exampleArabic: "يجب أن تمارس المحادثة الإنجليزية كل يوم لتتحدث بطلاقة."
    },
    {
      headword: "spend",
      pronunciation: "/spend/",
      partOfSpeech: "verb",
      definition: "to pass or use time or pay money for goods or services",
      example: "He spends his weekend reading books and resting peacefully.",
      relatedForms: ["spender (noun)"],
      collocations: ["spend time", "spend money", "spend the weekend"],
      synonyms: ["devote", "expend"],
      antonyms: ["save"],
      tags: ["actions", "time"],
      verbForms: { v1: "spend", v2: "spent", v3: "spent" },
      translation: "يقضي (وقتاً) / ينفق (مالاً)",
      exampleArabic: "يقضي عطلة نهاية أسبوعه في قراءة الكتب والاستراحة بسلام."
    }
  ],
  grammar: [
    {
      title: "Adverbs of Frequency",
      titleArabic: "ظروف التكرار (always, usually, often, sometimes, rarely, never)",
      explanation: "Adverbs of frequency describe how often an action happens. Normal position: directly BEFORE the main verb (e.g., 'I often run'). Position with verb 'be': directly AFTER the verb 'be' (e.g., 'She is always punctual'). Frequency expressions like 'once a week', 'twice a month', and 'weekly' usually appear at the very end of the sentence.",
      explanationArabic: "توضح ظروف التكرار مدى تكرار حدوث الفعل. موقعها القياسي: تأتي مباشرة قبل الفعل الأساسي (مثل: I often run). ومع فعل الكينونة be تأتي مباشرة بعده (مثل: She is always punctual). أما العبارات الزمنية مثل once a week و twice a month و weekly فتأتي عادةً في نهاية الجملة.",
      structures: [
        {
          pattern: "Subject + Adverb of Frequency + Main Verb + Object",
          explanation: "Normal placement before standard main verbs",
          explanationArabic: "الموضع المعتاد قبل الأفعال الرئيسية"
        },
        {
          pattern: "Subject + be (am/is/are) + Adverb of Frequency",
          explanation: "Placement immediately following the verb 'be'",
          explanationArabic: "الموضع بعد فعل الكينونة be مباشرة"
        },
        {
          pattern: "How often + do/does + Subject + Verb?",
          explanation: "Question used to inquire about frequency of habits",
          explanationArabic: "سؤال للاستفسار عن مدى تكرار عادة معينة"
        },
        {
          pattern: "Subject + Verb + once / twice a week",
          explanation: "Expressing precise numerical frequencies at the end",
          explanationArabic: "التعبير عن التكرار بأعداد محددة في نهاية الجملة"
        }
      ],
      examples: [
        {
          sentence: "I often run in the park on Wednesday morning.",
          translation: "أنا غالباً ما أركض في المنتزه صباح الأربعاء.",
          usesVocabulary: ["often", "run", "park", "wednesday"]
        },
        {
          sentence: "He regularly practices English speaking and writing.",
          translation: "هو يمارس التحدث والكتابة بالإنجليزية بانتظام.",
          usesVocabulary: ["regularly", "practice", "write"]
        },
        {
          sentence: "They seldom travel during a busy work week.",
          translation: "هم نادراً ما يسافرون خلال أسبوع عمل حافل.",
          usesVocabulary: ["seldom", "travel", "week"]
        },
        {
          sentence: "She swims in the indoor pool twice a week.",
          translation: "هي تسبح في المسبح الداخلي مرتين في الأسبوع.",
          usesVocabulary: ["swim", "pool", "twice", "week"]
        }
      ],
      commonUsage: [
        "I rarely eat fast food. (نادراً ما أتناول الوجبات السريعة.)",
        "How often do you go to the gym? (كم مرة تذهب إلى الجيم؟)",
        "We occasionally visit the museum. (نزور المتحف بين الحين والآخر.)"
      ],
      commonMistakes: [
        {
          wrong: "I go often to the gym.",
          right: "I often go to the gym.",
          explanation: "Place the frequency adverb 'often' before the main verb 'go', not after it."
        },
        {
          wrong: "She rarely is late.",
          right: "She is rarely late.",
          explanation: "With verb 'be', the adverb comes AFTER 'is', not before."
        }
      ]
    }
  ],
  conversations: [
    {
      title: "Planning the Weekly Schedule",
      titleArabic: "تخطيط الجدول الأسبوعي",
      setting: "At the university study lounge on Sunday evening",
      settingArabic: "في قاعة الدراسة بالجامعة مساء الأحد",
      lines: [
        {
          speaker: "Sami",
          text: "Let's check our calendar and organize our schedule for this upcoming week.",
          translation: "دعنا نتفقد تقويمنا وننظم جدولنا لهذا الأسبوع القادم."
        },
        {
          speaker: "Adel",
          text: "On Monday and Wednesday, we have our English lectures and study club.",
          translation: "يومي الإثنين والأربعاء، لدينا محاضرات اللغة الإنجليزية ونادي الدراسة."
        },
        {
          speaker: "Sami",
          text: "How often do you go to the gym on a weekday?",
          translation: "كم مرة تذهب إلى الصالة الرياضية في يوم عمل عادي؟"
        },
        {
          speaker: "Adel",
          text: "I regularly workout at the gym on Tuesday and Thursday after class.",
          translation: "أتدرب بانتظام في الصالة الرياضية يومي الثلاثاء والخميس بعد المحاضرة."
        },
        {
          speaker: "Sami",
          text: "Do you have any sport activity planned for Friday or the weekend?",
          translation: "هل لديك أي نشاط رياضي مخطط ليوم الجمعة أو عطلة نهاية الأسبوع؟"
        },
        {
          speaker: "Adel",
          text: "On Friday, I swim in the community pool, and on Saturday, I jog in the park.",
          translation: "يوم الجمعة، أسبح في مسبح الحي، ويوم السبت، أهرول في المنتزه."
        },
        {
          speaker: "Sami",
          text: "That is a very healthy plan. I seldom jog, but I love reading at home on Sunday.",
          translation: "هذه خطة صحية جداً. أنا قلما أهرول، لكني أعشق القراءة في المنزل يوم الأحد."
        },
        {
          speaker: "Adel",
          text: "Balancing physical activity and study makes our week productive and calm.",
          translation: "الموازنة بين النشاط البدني والدراسة تجعل أسبوعنا مثمراً وهادئاً."
        }
      ],
      vocabularyUsed: [
        "calendar", "schedule", "week", "monday", "wednesday", "often", "gym",
        "weekday", "regularly", "tuesday", "thursday", "sport", "activity", "friday",
        "weekend", "swim", "pool", "saturday", "jog", "park", "plan", "seldom",
        "read", "sunday"
      ]
    },
    {
      title: "Hobbies and Weekend Plans",
      titleArabic: "الهوايات وخطط عطلة نهاية الأسبوع",
      setting: "Talking over a hot cup of tea at a cafe counter on Thursday afternoon",
      settingArabic: "الحديث على كوب شاي ساخن عند منضدة مقهى بعد ظهر الخميس",
      lines: [
        {
          speaker: "Lina",
          text: "What is your favorite hobby when you have free time on the weekend?",
          translation: "ما هي هوايتك المفضلة عندما يكون لديك وقت فراغ في عطلة نهاية الأسبوع؟"
        },
        {
          speaker: "Rania",
          text: "I love to listen to podcasts and write short stories in my journal.",
          translation: "أحب الاستماع إلى التدوينات الصوتية وكتابة قصص قصيرة في مذكراتي."
        },
        {
          speaker: "Lina",
          text: "Do you ever go to the cinema or attend a music concert?",
          translation: "هل تذهبين على الإطلاق إلى السينما أو تحضرين حفلة موسيقية؟"
        },
        {
          speaker: "Rania",
          text: "I occasionally go to the cinema, but I rarely attend a live concert.",
          translation: "أذهب أحياناً إلى السينما، لكني نادراً ما أحضر حفلة موسيقية حية."
        },
        {
          speaker: "Lina",
          text: "My family and I frequently visit the city museum once a month.",
          translation: "أنا وعائلتي نزور متحف المدينة بشكل متكرر مرة في الشهر."
        },
        {
          speaker: "Rania",
          text: "That sounds wonderful. How do you spend your Sunday evening?",
          translation: "هذا يبدو رائعاً. كيف تقضين مساء يوم الأحد؟"
        },
        {
          speaker: "Lina",
          text: "We play a friendly board game together and prepare for Monday morning.",
          translation: "نلعب لعبة ألواح ودية معاً ونستعد لصباح يوم الإثنين."
        },
        {
          speaker: "Rania",
          text: "Having dedicated family time is truly the best way to end the week.",
          translation: "إن تخصيص وقت للعائلة هو حقاً أفضل طريقة لاختتام الأسبوع."
        }
      ],
      vocabularyUsed: [
        "hobby", "weekend", "listen", "write", "cinema", "concert", "occasionally",
        "rarely", "frequently", "museum", "once", "month", "spend", "sunday", "play",
        "game", "monday", "week"
      ]
    },
    {
      title: "Sports and Fitness Habits",
      titleArabic: "عادات الرياضة واللياقة البدنية",
      setting: "Walking outside the local athletic center",
      settingArabic: "المشي خارج المركز الرياضي المحلي",
      lines: [
        {
          speaker: "Youssef",
          text: "How many times a week do you run outside along the river path?",
          translation: "كم مرة في الأسبوع تركض في الخارج على طول مسار النهر؟"
        },
        {
          speaker: "Majid",
          text: "I run twice a week, usually on Tuesday and Saturday mornings.",
          translation: "أركض مرتين في الأسبوع، عادة صباح يومي الثلاثاء والسبت."
        },
        {
          speaker: "Youssef",
          text: "Do you ever play in an official football match with your college team?",
          translation: "هل تلعب على الإطلاق في مباراة كرة قدم رسمية مع فريق كليتك؟"
        },
        {
          speaker: "Majid",
          text: "Yes, we have a competitive match weekly, and our fans constantly cheer for us.",
          translation: "نعم، لدينا مباراة تنافسية أسبوعياً، ومشجعونا يهتفون لنا باستمرار."
        },
        {
          speaker: "Youssef",
          text: "I hardly ever play team sports; I prefer to stay at home and practice yoga.",
          translation: "أنا نادراً للغاية ما ألعب رياضات جماعية؛ أفضل البقاء في المنزل وممارسة اليوغا."
        },
        {
          speaker: "Majid",
          text: "Practicing regularly is what matters most for your physical fitness and mind.",
          translation: "الممارسة بانتظام هي الأهم للياقتك البدنية وذهنك."
        },
        {
          speaker: "Youssef",
          text: "I agree. We also have a yearly fitness evaluation this coming month.",
          translation: "أوافقك الرأي. لدينا أيضاً تقييم لياقة سنوي في هذا الشهر القادم."
        },
        {
          speaker: "Majid",
          text: "Good luck with your preparation; stay focused and keep moving forward!",
          translation: "بالتوفيق في استعداداتك؛ ابقَ مركزاً وواصل التقدم للأمام!"
        }
      ],
      vocabularyUsed: [
        "week", "run", "twice", "tuesday", "saturday", "play", "match", "weekly",
        "constantly", "hardly ever", "sport", "stay", "practice", "regularly",
        "yearly", "month"
      ]
    }
  ],
  paragraphs: [
    {
      title: "My Balanced Weekly Routine",
      titleArabic: "روتيني الأسبوعي المتوازن",
      kind: "personal story",
      text: "Every Sunday night, I open my calendar to review my schedule for the upcoming week. On each weekday, I wake up early and practice reading English articles before heading to work. On Monday and Wednesday, I go to the gym for a brisk workout, while on Thursday, I jog around the public park. When the weekend arrives, I slow down my pace. On Friday, our extended family gathers for a special home-cooked lunch. On Saturday, I spend peaceful hours pursuing my favorite hobby, playing the guitar and listening to music. This structured routine keeps my body energetic and my mind completely refreshed.",
      translation: "كل ليلة أحد، أفتح تقويمي لمراجعة جدولي للأسبوع القادم. في كل يوم من أيام العمل، أستيقظ مبكراً وأمارس قراءة مقالات إنجليزية قبل التوجه للعمل. ويومي الإثنين والأربعاء، أذهب إلى صالة الألعاب الرياضية لممارسة تمارين سريعة، بينما يوم الخميس، أهرول حول المنتزه العام. وعندما تحل عطلة نهاية الأسبوع، أبطئ وتيرتي. ويوم الجمعة، تجتمع عائلتنا الكبيرة لتناول غداء مطبوخ منزلياً خاص. ويوم السبت، أقضي ساعات هادئة في ممارسة هوايتي المفضلة، عازفاً على الغيتار ومستمعاً إلى الموسيقى. يحافظ هذا الروتين المنظم على نشاط بدني وانتعاش ذهني التام.",
      vocabularyUsed: [
        "sunday", "calendar", "schedule", "week", "weekday", "practice", "read",
        "monday", "wednesday", "gym", "thursday", "jog", "park", "weekend",
        "friday", "saturday", "spend", "hobby", "play", "listen"
      ]
    },
    {
      title: "Staying Active Throughout the Year",
      titleArabic: "الحفاظ على النشاط طوال العام",
      kind: "health",
      text: "Maintaining physical fitness throughout the year requires consistent discipline and a clear plan. Health experts regularly recommend engaging in moderate exercise at least twice a week. You can swim forty laps in a heated indoor pool, run along the city river, or participate in a lively football match with friends. People who constantly sit at desks hardly ever get enough movement during busy working days. By scheduling weekly activities like a brisk walk in the park or visiting a historical museum, you protect your long-term health, reduce daily tension, and stay motivated every single month.",
      translation: "يتطلب الحفاظ على اللياقة البدنية طوال العام انضباطاً مستمراً وخطة واضحة. يوصي خبراء الصحة بانتظام بممارسة تمارين معتدلة مرتين في الأسبوع على الأقل. يمكنك السباحة أربعين شوطاً في مسبح داخلي مدفأ، أو الركض على طول نهر المدينة، أو المشاركة في مباراة كرة قدم حماسية مع الأصدقاء. الأشخاص الذين يجلسون باستمرار خلف المكاتب نادراً للغاية ما يحصلون على حركة كافية خلال أيام العمل الحافلة. ومن خلال جدولة أنشطة أسبوعية مثل المشي السريع في المنتزه أو زيارة متحف تاريخي، فإنك تحمي صحتك على المدى الطويل، وتقلل التوتر اليومي، وتظل متحفزاً في كل شهر.",
      vocabularyUsed: [
        "year", "plan", "regularly", "twice", "week", "swim", "pool", "run",
        "match", "constantly", "hardly ever", "weekly", "activity", "park",
        "museum", "stay", "month"
      ]
    },
    {
      title: "How People Spend Their Free Time",
      titleArabic: "كيف يقضي الناس أوقات فراغهم",
      kind: "cultural",
      text: "Across the world, people enjoy varied leisure activities when they finish their daily responsibilities. Some individuals prefer quiet indoor pursuits; they read classic books, write personal journals, or play strategic board games with family members. Others frequently seek outdoor adventures; they travel to distant scenic mountains or spend joyful afternoons in a neighborhood park. Younger crowds often go to the cinema to watch premiere movies or attend an energetic weekend concert. Regardless of which hobby you choose, dedicating time to relax recharge ensures happiness and productivity for the days ahead.",
      translation: "حول العالم، يستمتع الناس بأنشطة ترفيهية متنوعة عندما ينهون مسؤولياتهم اليومية. يفضل بعض الأفراد الأنشطة الهادئة في الأماكن المغلقة؛ فهم يقرؤون الكتب الكلاسيكية، أو يكتبون مذكرات شخصية، أو يلعبون ألعاب ألواح استراتيجية مع أفراد العائلة. ويسعى آخرون بشكل متكرر إلى مغامرات في الهواء الطلق؛ فيسافرون إلى جبال خلابة بعيدة أو يقضون فترات بعد ظهر مبهجة في منتزه الحي. وغالباً ما يذهب الشباب إلى السينما لمشاهدة العروض الأولى للأفلام أو حضور حفلة موسيقية حماسية في عطلة نهاية الأسبوع. وبغض النظر عن الهواية التي تختارها، فإن تخصيص وقت للاسترخاء وإعادة شحن طاقتك يضمن السعادة والإنتاجية للأيام القادمة.",
      vocabularyUsed: [
        "activity", "read", "write", "play", "game", "frequently", "travel",
        "spend", "park", "often", "cinema", "weekend", "concert", "hobby"
      ]
    }
  ]
};

fs.writeFileSync(path.join(contentDir, "day-06.json"), JSON.stringify(day06, null, 2), "utf8");
console.log("✓ Day 6 created successfully!");
