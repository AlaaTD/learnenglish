/**
 * seed-confusables.mjs
 * Seeds 34 confusable word groups into the ConfusableGroup table.
 *
 * Run: node scripts/seed-confusables.mjs
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const GROUPS = [
  // ═══════════════════════════════════════════════════════════
  // CATEGORY 1: Verbs of Action
  // ═══════════════════════════════════════════════════════════
  {
    slug: "make-vs-do",
    category: "verbs-of-action",
    order: 1,
    title: "make vs do",
    titleArabic: "الفرق بين make و do",
    summary: "Use 'make' for creating or producing something. Use 'do' for actions, tasks, and activities.",
    summaryArabic: "نستخدم 'make' لصنع أو إنتاج شيء جديد. ونستخدم 'do' للأنشطة والمهام العامة.",
    words: [
      {
        word: "make",
        color: "blue",
        rule: "Creating, producing, or causing something new",
        ruleArabic: "صنع أو إنتاج أو تسبيب شيء جديد",
        collocations: ["make a decision", "make a mistake", "make a plan", "make lunch", "make money", "make noise", "make progress", "make friends"]
      },
      {
        word: "do",
        color: "purple",
        rule: "Performing actions, tasks, work, or activities",
        ruleArabic: "القيام بأنشطة ومهام وأعمال عامة",
        collocations: ["do homework", "do the dishes", "do exercise", "do a favour", "do research", "do your best", "do damage", "do business"]
      }
    ],
    examples: [
      { sentence: "She made a delicious cake for the party.", sentenceArabic: "صنعت كيكة لذيذة للحفلة.", focus: "make", note: "Creating something new (the cake)" },
      { sentence: "Can you do me a favour?", sentenceArabic: "هل يمكنك مساعدتي؟", focus: "do", note: "Performing a task/action" },
      { sentence: "He made a lot of noise during the exam.", sentenceArabic: "أحدث ضجة كبيرة أثناء الامتحان.", focus: "make", note: "Causing/producing noise" },
      { sentence: "I need to do my homework before dinner.", sentenceArabic: "أحتاج أن أعمل واجبي قبل العشاء.", focus: "do", note: "Performing a routine task" },
      { sentence: "They made a plan to visit London.", sentenceArabic: "وضعوا خطة لزيارة لندن.", focus: "make", note: "Creating a plan" },
      { sentence: "She does yoga every morning.", sentenceArabic: "تمارس اليوغا كل صباح.", focus: "do", note: "Regular activity" }
    ],
    mistakes: [
      { wrong: "I need to make my homework.", right: "I need to do my homework.", noteArabic: "الواجب المنزلي نشاط/مهمة، لذا نستخدم do" },
      { wrong: "She did a mistake.", right: "She made a mistake.", noteArabic: "الأخطاء تُصنع بـ make" },
      { wrong: "Can you do me a coffee?", right: "Can you make me a coffee?", noteArabic: "القهوة تُصنع (منتج جديد) → make" }
    ],
    tips: ["When in doubt: if you can see or touch the result → make. If it's a task/activity → do."],
    tipsArabic: ["القاعدة الذهبية: لو النتيجة شيء ملموس أو مرئي → make. لو هي نشاط أو مهمة → do."]
  },
  {
    slug: "like-vs-love-vs-enjoy",
    category: "verbs-of-action",
    order: 2,
    title: "like vs love vs enjoy",
    titleArabic: "الفرق بين like و love و enjoy",
    summary: "'Like' = general preference. 'Love' = strong feeling. 'Enjoy' = pleasure from doing (always takes -ing).",
    summaryArabic: "'like' للتفضيل العام. 'love' للشعور القوي. 'enjoy' للمتعة من الفعل (يأتي دائماً مع -ing).",
    words: [
      { word: "like", color: "blue", rule: "General positive feeling; can take to-infinitive or -ing", ruleArabic: "إعجاب عام — يمكن استخدامه مع المصدر أو الفعل + ing", collocations: ["like to read", "like reading", "like it when...", "like + noun"] },
      { word: "love", color: "red", rule: "Stronger, more intense feeling; can take to-infinitive or -ing", ruleArabic: "إعجاب أعمق وأقوى — يمكن استخدامه مع المصدر أو الفعل + ing", collocations: ["love to travel", "love dancing", "love + noun"] },
      { word: "enjoy", color: "green", rule: "Find pleasure in doing; ALWAYS takes -ing (never bare infinitive)", ruleArabic: "الاستمتاع بالفعل — يأتي دائماً مع الفعل + ing وليس المصدر", collocations: ["enjoy reading", "enjoy cooking", "enjoy the view", "enjoy yourself"] }
    ],
    examples: [
      { sentence: "I like coffee but I love tea.", sentenceArabic: "أحب القهوة لكنني أعشق الشاي.", focus: "like/love", note: "Degrees of preference" },
      { sentence: "She enjoys swimming in the morning.", sentenceArabic: "تستمتع بالسباحة في الصباح.", focus: "enjoy", note: "enjoy + -ing (not 'to swim')" },
      { sentence: "He loves to cook Italian food.", sentenceArabic: "يعشق طهي الطعام الإيطالي.", focus: "love", note: "love + to-infinitive (also correct: loves cooking)" },
      { sentence: "Do you enjoy your job?", sentenceArabic: "هل تستمتع بعملك؟", focus: "enjoy", note: "enjoy + noun" }
    ],
    mistakes: [
      { wrong: "I enjoy to play tennis.", right: "I enjoy playing tennis.", noteArabic: "enjoy لا يأتي بعده مصدر — دائماً استخدم الفعل + ing" },
      { wrong: "I love very much this city.", right: "I love this city very much.", noteArabic: "الكثافة لا تُغير ترتيب الكلمات" }
    ],
    tips: ["enjoy is the only one that NEVER takes to-infinitive. Always use -ing after enjoy."],
    tipsArabic: ["enjoy هو الوحيد الذي لا يأتي بعده مصدر أبداً. استخدم دائماً الفعل + ing بعد enjoy."]
  },
  {
    slug: "say-vs-tell-vs-speak-vs-talk",
    category: "verbs-of-action",
    order: 3,
    title: "say vs tell vs speak vs talk",
    titleArabic: "الفرق بين say و tell و speak و talk",
    summary: "'Say' focuses on the words spoken. 'Tell' requires a listener. 'Speak' is formal/one-way. 'Talk' is informal/two-way.",
    summaryArabic: "'say' للكلام نفسه. 'tell' يحتاج مستمع. 'speak' رسمي واتجاه واحد. 'talk' غير رسمي وحوار متبادل.",
    words: [
      { word: "say", color: "blue", rule: "Focus on the words themselves. Does NOT need an object person.", ruleArabic: "التركيز على الكلمات المقولة. لا يحتاج شخصاً مستمعاً مذكوراً بعده مباشرة.", collocations: ["say something", "say hello", "say sorry", "say yes/no", "say a word"] },
      { word: "tell", color: "purple", rule: "Always needs a person as object (tell someone). Used for information/instructions.", ruleArabic: "يحتاج دائماً شخصاً مستمعاً مذكوراً مباشرة بعده. يُستخدم للمعلومات والتعليمات.", collocations: ["tell me", "tell a story", "tell the truth", "tell a lie", "tell someone to do"] },
      { word: "speak", color: "green", rule: "Formal, one-directional. Used for languages and formal situations.", ruleArabic: "رسمي، اتجاه واحد. يُستخدم مع اللغات والمواقف الرسمية.", collocations: ["speak English", "speak to someone", "speak at a conference", "speak up"] },
      { word: "talk", color: "orange", rule: "Informal, two-way conversation. Interactive exchange.", ruleArabic: "غير رسمي، حوار متبادل تفاعلي.", collocations: ["talk to/with someone", "talk about", "talk things over", "small talk"] }
    ],
    examples: [
      { sentence: "He said he was tired.", sentenceArabic: "قال إنه كان متعباً.", focus: "say", note: "Reporting words — no direct person after 'said'" },
      { sentence: "She told me a funny story.", sentenceArabic: "حكت لي قصة مضحكة.", focus: "tell", note: "tell + person (me) + object" },
      { sentence: "Do you speak Arabic?", sentenceArabic: "هل تتكلم العربية؟", focus: "speak", note: "speak + language" },
      { sentence: "We talked for hours about our plans.", sentenceArabic: "تحدثنا لساعات عن خططنا.", focus: "talk", note: "Mutual conversation" },
      { sentence: "Can I speak to the manager?", sentenceArabic: "هل يمكنني التحدث مع المدير؟", focus: "speak", note: "Formal request — one person addressing another" }
    ],
    mistakes: [
      { wrong: "She told that she was coming.", right: "She said (that) she was coming.", noteArabic: "tell يحتاج شخصاً بعده مباشرة: She told me/us/him..." },
      { wrong: "Can you say me the time?", right: "Can you tell me the time?", noteArabic: "عندما يكون هناك مستمع مذكور، استخدم tell" },
      { wrong: "I want to talk you.", right: "I want to talk to you.", noteArabic: "talk يحتاج to أو with قبل الشخص المستمع" }
    ],
    tips: ["If you can replace it with 'inform someone' → use tell. If it's just uttering words → use say."],
    tipsArabic: ["إذا كان المعنى 'أخبر شخصاً ما' → استخدم tell. إذا كان المعنى 'نطق بكلمات' → استخدم say."]
  },
  {
    slug: "see-vs-look-vs-watch",
    category: "verbs-of-action",
    order: 4,
    title: "see vs look vs watch",
    titleArabic: "الفرق بين see و look و watch",
    summary: "'See' is passive/involuntary. 'Look' is deliberate but static. 'Watch' is deliberate with movement/change.",
    summaryArabic: "'see' رؤية غير مقصودة. 'look' نظر مقصود ولكن لشيء ثابت. 'watch' مشاهدة لشيء يتحرك أو يتغير.",
    words: [
      { word: "see", color: "blue", rule: "Involuntary/passive vision — happens without effort or intention", ruleArabic: "رؤية غير إرادية تحدث دون قصد أو جهد", collocations: ["I can see", "see a doctor", "see a movie (informal)", "see what I mean"] },
      { word: "look", color: "green", rule: "Deliberate, intentional action — directing eyes at something static", ruleArabic: "نظر مقصود ومتعمد لشيء ثابت", collocations: ["look at something", "look for", "look forward to", "look up", "look good"] },
      { word: "watch", color: "purple", rule: "Deliberate attention to something moving, changing, or happening over time", ruleArabic: "مشاهدة منتبهة لشيء يتحرك أو يتغير مع الوقت", collocations: ["watch TV", "watch a game", "watch someone do something", "watch out"] }
    ],
    examples: [
      { sentence: "I saw a rainbow on my way to work.", sentenceArabic: "رأيت قوس قزح في طريقي للعمل.", focus: "see", note: "Unintentional — it just appeared" },
      { sentence: "Look at this beautiful painting!", sentenceArabic: "انظر إلى هذه اللوحة الجميلة!", focus: "look", note: "Directing attention deliberately to a static thing" },
      { sentence: "We watched the football match all evening.", sentenceArabic: "شاهدنا مباراة كرة القدم طوال المساء.", focus: "watch", note: "Moving/changing event over time" },
      { sentence: "Can you look at my essay and give me feedback?", sentenceArabic: "هل يمكنك النظر في مقالتي وتقديم ملاحظات؟", focus: "look", note: "Deliberate attention to document" }
    ],
    mistakes: [
      { wrong: "I watched a bird in the garden by accident.", right: "I saw a bird in the garden.", noteArabic: "الرؤية العرضية دائماً see وليس watch" },
      { wrong: "Look the TV!", right: "Watch TV!", noteArabic: "look يحتاج 'at' قبل المفعول: Look at the TV. لكن التلفاز يُشاهد بـ watch" }
    ],
    tips: ["See = it comes to you. Look = you go to it (eyes). Watch = you go to it + time passes."],
    tipsArabic: ["see = يأتي إليك. look = توجه عينيك له (ثابت). watch = توجه له + الوقت يمر (متحرك)."]
  },
  {
    slug: "come-vs-go-vs-get",
    category: "verbs-of-action",
    order: 5,
    title: "come vs go vs get",
    titleArabic: "الفرق بين come و go و get",
    summary: "'Come' = movement toward the speaker. 'Go' = movement away from the speaker. 'Get' = arrive/obtain/become.",
    summaryArabic: "'come' حركة نحو المتكلم. 'go' حركة بعيداً عن المتكلم. 'get' وصول أو حصول أو تحول.",
    words: [
      { word: "come", color: "blue", rule: "Movement toward the speaker or listener's location", ruleArabic: "حركة نحو مكان المتكلم أو المستمع", collocations: ["come here", "come to my house", "come back", "come in", "come along"] },
      { word: "go", color: "purple", rule: "Movement away from the current location", ruleArabic: "حركة بعيداً عن المكان الحالي", collocations: ["go there", "go home", "go away", "go out", "go shopping"] },
      { word: "get", color: "green", rule: "Arrive at a place OR obtain something OR become something", ruleArabic: "الوصول إلى مكان أو الحصول على شيء أو التحول إلى حالة", collocations: ["get home", "get a job", "get tired", "get better", "get dressed"] }
    ],
    examples: [
      { sentence: "Come to my office at 3 pm.", sentenceArabic: "تعال إلى مكتبي الساعة الثالثة.", focus: "come", note: "Toward the speaker's location" },
      { sentence: "I'm going to the supermarket. Do you need anything?", sentenceArabic: "ذاهب إلى السوبر ماركت. هل تحتاج شيئاً؟", focus: "go", note: "Away from current location" },
      { sentence: "What time do you usually get home?", sentenceArabic: "في أي وقت تصل عادةً إلى المنزل؟", focus: "get", note: "Arrive at a place" },
      { sentence: "She got very tired after the long flight.", sentenceArabic: "شعرت بتعب شديد بعد الرحلة الطويلة.", focus: "get", note: "Become a state (tired)" }
    ],
    mistakes: [
      { wrong: "Can you come to the store with me?", right: "Can you go to the store with me?", noteArabic: "أنت تتحدث عن مكان بعيد عنك الآن → go" },
      { wrong: "I arrived to my house at 9.", right: "I got home at 9.", noteArabic: "للوصول إلى المنزل استخدم get home (بدون to)" }
    ],
    tips: ["come = toward you/here. go = away from you/there. get home/there = the moment of arrival."],
    tipsArabic: ["come = نحوك. go = بعيداً عنك. get + مكان = لحظة الوصول."]
  },
  {
    slug: "borrow-vs-lend",
    category: "verbs-of-action",
    order: 6,
    title: "borrow vs lend",
    titleArabic: "الفرق بين borrow و lend",
    summary: "'Borrow' = take temporarily (you receive). 'Lend' = give temporarily (you give).",
    summaryArabic: "'borrow' تأخذ شيئاً مؤقتاً (أنت المستقبل). 'lend' تعطي شيئاً مؤقتاً (أنت المُعطي).",
    words: [
      { word: "borrow", color: "blue", rule: "To take something from someone temporarily and return it later", ruleArabic: "أن تأخذ شيئاً من شخص مؤقتاً وتُعيده لاحقاً", collocations: ["borrow money", "borrow a book", "borrow from someone", "borrow something from..."] },
      { word: "lend", color: "purple", rule: "To give something to someone temporarily for them to use", ruleArabic: "أن تُعطي شيئاً لشخص مؤقتاً ليستخدمه ثم يُعيده", collocations: ["lend money", "lend a book", "lend to someone", "lend someone something"] }
    ],
    examples: [
      { sentence: "Can I borrow your pen for a minute?", sentenceArabic: "هل يمكنني استعارة قلمك للحظة؟", focus: "borrow", note: "You are asking to receive temporarily" },
      { sentence: "Can you lend me £10 until Friday?", sentenceArabic: "هل يمكنك إقراضي ١٠ جنيهات حتى يوم الجمعة؟", focus: "lend", note: "You are asking the other person to give temporarily" },
      { sentence: "She borrowed a textbook from the library.", sentenceArabic: "استعارت كتاباً من المكتبة.", focus: "borrow", note: "She received it temporarily" },
      { sentence: "He lent his car to his friend for the weekend.", sentenceArabic: "أعار سيارته لصديقه عطلة نهاية الأسبوع.", focus: "lend", note: "He gave it temporarily" }
    ],
    mistakes: [
      { wrong: "Can you borrow me your umbrella?", right: "Can you lend me your umbrella?", noteArabic: "المتكلم يريد استقبال المظلة ← لذلك يطلب من الآخر أن يُعير (lend)" },
      { wrong: "I lent his book yesterday.", right: "I borrowed his book yesterday.", noteArabic: "أنت أخذت الكتاب منه ← borrow" }
    ],
    tips: ["Trick: borrow = be the borrower (receiver). lend = be the lender (giver)."],
    tipsArabic: ["الحيلة: borrow = أنت المستعير (تأخذ). lend = أنت المُعير (تعطي)."]
  },
  {
    slug: "remember-vs-remind",
    category: "verbs-of-action",
    order: 7,
    title: "remember vs remind",
    titleArabic: "الفرق بين remember و remind",
    summary: "'Remember' = recall something yourself. 'Remind' = cause someone else to remember (external trigger).",
    summaryArabic: "'remember' تتذكر شيئاً من تلقاء نفسك. 'remind' تُذكّر شخصاً آخر (محفز خارجي).",
    words: [
      { word: "remember", color: "blue", rule: "To bring something back to your own mind; self-directed memory", ruleArabic: "استرجاع شيء إلى ذاكرتك أنت من تلقاء نفسك", collocations: ["remember a name", "remember to do", "remember doing", "I can't remember"] },
      { word: "remind", color: "purple", rule: "To make someone else remember; cause an external memory trigger", ruleArabic: "جعل شخص آخر يتذكر — أنت السبب في تذكره", collocations: ["remind someone to do", "remind someone of/about", "remind me later", "this reminds me of..."] }
    ],
    examples: [
      { sentence: "I remembered to lock the door before leaving.", sentenceArabic: "تذكرت قفل الباب قبل الخروج.", focus: "remember", note: "You recalled it yourself" },
      { sentence: "Please remind me to call the doctor tomorrow.", sentenceArabic: "من فضلك ذكّرني بالاتصال بالطبيب غداً.", focus: "remind", note: "You need someone else to trigger your memory" },
      { sentence: "This song reminds me of my childhood.", sentenceArabic: "هذه الأغنية تُذكّرني بطفولتي.", focus: "remind", note: "External thing triggers memory" },
      { sentence: "Do you remember her phone number?", sentenceArabic: "هل تتذكر رقم هاتفها؟", focus: "remember", note: "Accessing your own memory" }
    ],
    mistakes: [
      { wrong: "Please remember me to buy milk.", right: "Please remind me to buy milk.", noteArabic: "تطلب من شخص آخر أن يُذكّرك → remind" },
      { wrong: "This photo reminds me my grandmother.", right: "This photo reminds me of my grandmother.", noteArabic: "remind يحتاج 'of' قبل الشيء الذي يُذكّر به" }
    ],
    tips: ["remember = your own brain works. remind = someone/something activates your brain from outside."],
    tipsArabic: ["remember = دماغك يعمل لوحده. remind = شيء خارجي يُحرك دماغك."]
  },
  {
    slug: "bring-vs-take-vs-carry",
    category: "verbs-of-action",
    order: 8,
    title: "bring vs take vs carry",
    titleArabic: "الفرق بين bring و take و carry",
    summary: "'Bring' = toward here. 'Take' = away from here. 'Carry' = to hold/transport physically.",
    summaryArabic: "'bring' إحضار نحو هنا. 'take' أخذ بعيداً عن هنا. 'carry' حمل شيء جسدياً.",
    words: [
      { word: "bring", color: "blue", rule: "Move something toward the speaker/listener's location", ruleArabic: "نقل شيء نحو مكان المتكلم أو المستمع", collocations: ["bring me...", "bring a gift", "bring food", "bring along"] },
      { word: "take", color: "purple", rule: "Move something away from the speaker/listener's location", ruleArabic: "نقل شيء بعيداً عن مكان المتكلم أو المستمع", collocations: ["take with you", "take away", "take to...", "take an umbrella"] },
      { word: "carry", color: "green", rule: "To hold and support the weight of something while moving", ruleArabic: "حمل شيء وتحمّل وزنه أثناء التنقل — التركيز على الحمل الجسدي", collocations: ["carry a bag", "carry a baby", "carry weight", "carry on"] }
    ],
    examples: [
      { sentence: "Can you bring me a glass of water?", sentenceArabic: "هل يمكنك إحضار كوب ماء لي؟", focus: "bring", note: "Toward where you are now" },
      { sentence: "Don't forget to take your passport when you travel.", sentenceArabic: "لا تنسَ أخذ جواز سفرك عند السفر.", focus: "take", note: "Away from current location" },
      { sentence: "She was carrying three heavy bags.", sentenceArabic: "كانت تحمل ثلاث حقائب ثقيلة.", focus: "carry", note: "Physical act of holding weight" }
    ],
    mistakes: [
      { wrong: "Don't forget to bring your umbrella.", right: "Don't forget to take your umbrella.", noteArabic: "أنت تتحدث عن أخذه معك بعيداً → take" },
      { wrong: "Can you take me a coffee?", right: "Can you bring me a coffee?", noteArabic: "القهوة ستأتي إليك → bring" }
    ],
    tips: ["bring = come with. take = go with. carry = how you transport it (physical effort)."],
    tipsArabic: ["bring = تعال معه. take = اذهب معه. carry = كيفية النقل (الجهد الجسدي)."]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY 2: Prepositions & Time
  // ═══════════════════════════════════════════════════════════
  {
    slug: "since-vs-for",
    category: "prepositions-time",
    order: 1,
    title: "since vs for",
    titleArabic: "الفرق بين since و for",
    summary: "'Since' gives the starting point. 'For' gives the duration (length of time).",
    summaryArabic: "'since' يُحدد نقطة البداية. 'for' يُحدد المدة (طول الفترة الزمنية).",
    words: [
      { word: "since", color: "blue", rule: "From a specific point in the past until now (point in time)", ruleArabic: "منذ نقطة محددة في الماضي حتى الآن", collocations: ["since 2020", "since Monday", "since I was a child", "since last year"] },
      { word: "for", color: "purple", rule: "Over a period/duration of time (length of time)", ruleArabic: "لمدة أو فترة من الوقت (طول المدة)", collocations: ["for 3 years", "for a long time", "for two weeks", "for ages"] }
    ],
    examples: [
      { sentence: "I have lived here since 2018.", sentenceArabic: "عشت هنا منذ عام ٢٠١٨.", focus: "since", note: "Starting point: 2018" },
      { sentence: "I have lived here for six years.", sentenceArabic: "عشت هنا لمدة ست سنوات.", focus: "for", note: "Duration: 6 years" },
      { sentence: "She hasn't called since last Monday.", sentenceArabic: "لم تتصل منذ الاثنين الماضي.", focus: "since", note: "Starting point: last Monday" },
      { sentence: "We've been waiting for 20 minutes.", sentenceArabic: "لقد انتظرنا لمدة ٢٠ دقيقة.", focus: "for", note: "Duration: 20 minutes" }
    ],
    mistakes: [
      { wrong: "I've known him since three years.", right: "I've known him for three years.", noteArabic: "ثلاث سنوات مدة وليست نقطة بداية محددة → for" },
      { wrong: "She's been sick for last week.", right: "She's been sick since last week.", noteArabic: "الأسبوع الماضي نقطة بداية محددة → since" }
    ],
    tips: ["since = answer to 'When did it start?' / for = answer to 'How long?'"],
    tipsArabic: ["since = الجواب عن 'متى بدأ؟' / for = الجواب عن 'كم المدة؟'"]
  },
  {
    slug: "in-on-at-place",
    category: "prepositions-time",
    order: 2,
    title: "in vs on vs at (place)",
    titleArabic: "in و on و at في المكان",
    summary: "at = specific point. on = surface/line. in = enclosed space/area.",
    summaryArabic: "at = نقطة محددة. on = سطح أو خط. in = داخل مساحة مغلقة أو منطقة.",
    words: [
      { word: "at", color: "orange", rule: "A specific point or exact location", ruleArabic: "نقطة محددة أو موقع دقيق", collocations: ["at school", "at the door", "at the top", "at work", "at home", "at the corner"] },
      { word: "on", color: "blue", rule: "A surface, a line, or a mode of transport", ruleArabic: "على سطح أو خط أو وسيلة مواصلات", collocations: ["on the table", "on the wall", "on the bus", "on the street", "on the floor"] },
      { word: "in", color: "green", rule: "Inside an enclosed space, area, or container", ruleArabic: "داخل مساحة مغلقة أو منطقة أو وعاء", collocations: ["in the room", "in Cairo", "in the box", "in the car", "in the country"] }
    ],
    examples: [
      { sentence: "She's at the bus stop.", sentenceArabic: "هي في موقف الحافلة.", focus: "at", note: "Specific point" },
      { sentence: "The book is on the shelf.", sentenceArabic: "الكتاب على الرف.", focus: "on", note: "On a surface" },
      { sentence: "The keys are in my bag.", sentenceArabic: "المفاتيح في حقيبتي.", focus: "in", note: "Inside a container" },
      { sentence: "We live in London.", sentenceArabic: "نحن نعيش في لندن.", focus: "in", note: "Inside a city/area" }
    ],
    mistakes: [
      { wrong: "I'll meet you on the airport.", right: "I'll meet you at the airport.", noteArabic: "المطار نقطة تقابل محددة → at" },
      { wrong: "She's in the bus.", right: "She's on the bus.", noteArabic: "وسائل المواصلات العامة تستخدم on" }
    ],
    tips: ["Think in layers: at = point (🔴), on = surface (📄), in = inside (📦)"],
    tipsArabic: ["فكر في طبقات: at = نقطة (🔴)، on = سطح (📄)، in = داخل (📦)"]
  },
  {
    slug: "in-on-at-time",
    category: "prepositions-time",
    order: 3,
    title: "in vs on vs at (time)",
    titleArabic: "in و on و at في الزمان",
    summary: "at = exact time. on = specific day/date. in = month/year/season/period.",
    summaryArabic: "at = وقت محدد. on = يوم أو تاريخ معين. in = شهر أو سنة أو موسم أو فترة.",
    words: [
      { word: "at", color: "orange", rule: "Exact clock time or fixed time expressions", ruleArabic: "الساعة الدقيقة أو تعبيرات وقت ثابتة", collocations: ["at 3pm", "at midnight", "at noon", "at night", "at the weekend (BrE)"] },
      { word: "on", color: "blue", rule: "A specific day or date", ruleArabic: "يوم محدد أو تاريخ بعينه", collocations: ["on Monday", "on 5th June", "on Christmas Day", "on my birthday", "on the weekend (AmE)"] },
      { word: "in", color: "green", rule: "A period: month, year, decade, century, season, or part of day", ruleArabic: "فترة زمنية: شهر أو سنة أو عقد أو قرن أو موسم أو جزء من اليوم", collocations: ["in July", "in 2024", "in winter", "in the morning", "in the 20th century"] }
    ],
    examples: [
      { sentence: "The meeting is at 10 o'clock.", sentenceArabic: "الاجتماع الساعة العاشرة.", focus: "at", note: "Exact time" },
      { sentence: "I was born on a Tuesday.", sentenceArabic: "وُلدت يوم ثلاثاء.", focus: "on", note: "Specific day" },
      { sentence: "She graduated in June.", sentenceArabic: "تخرجت في شهر يونيو.", focus: "in", note: "A month (period)" },
      { sentence: "He likes to walk in the evenings.", sentenceArabic: "يحب المشي في المساء.", focus: "in", note: "Part of the day" }
    ],
    mistakes: [
      { wrong: "See you in Monday.", right: "See you on Monday.", noteArabic: "الأيام المحددة تستخدم on" },
      { wrong: "She arrived on midnight.", right: "She arrived at midnight.", noteArabic: "منتصف الليل وقت محدد → at" }
    ],
    tips: ["Big → small: in year → in month → on day → at time"],
    tipsArabic: ["من الكبير للصغير: in سنة → in شهر → on يوم → at ساعة"]
  },
  {
    slug: "during-vs-while-vs-for",
    category: "prepositions-time",
    order: 4,
    title: "during vs while vs for",
    titleArabic: "الفرق بين during و while و for",
    summary: "'During' + noun (when). 'While' + verb clause (simultaneous action). 'For' + time duration.",
    summaryArabic: "'during' + اسم (متى). 'while' + جملة فعلية (حدثان في نفس الوقت). 'for' + مدة زمنية.",
    words: [
      { word: "during", color: "blue", rule: "At some point/throughout a noun period", ruleArabic: "في وقت ما خلال أو طوال فترة زمنية (يليه اسم)", collocations: ["during the meeting", "during summer", "during lunch", "during the film"] },
      { word: "while", color: "green", rule: "At the same time as another action (followed by a clause with verb)", ruleArabic: "في نفس وقت حدث آخر (يليه جملة تحتوي على فعل)", collocations: ["while I was sleeping", "while she reads", "while working", "while you wait"] },
      { word: "for", color: "purple", rule: "Expresses the duration/length of time", ruleArabic: "يُعبّر عن المدة أو طول الفترة الزمنية", collocations: ["for two hours", "for a while", "for a long time", "for ages"] }
    ],
    examples: [
      { sentence: "He fell asleep during the lecture.", sentenceArabic: "نام أثناء المحاضرة.", focus: "during", note: "during + noun (lecture)" },
      { sentence: "I listened to music while cooking dinner.", sentenceArabic: "استمعت إلى الموسيقى بينما كنت أطهو العشاء.", focus: "while", note: "while + verb clause" },
      { sentence: "She studied for three hours.", sentenceArabic: "درست لمدة ثلاث ساعات.", focus: "for", note: "Duration" }
    ],
    mistakes: [
      { wrong: "I fell asleep while the movie.", right: "I fell asleep during the movie.", noteArabic: "بعد during يأتي اسم (movie)، بعد while يأتي فعل" },
      { wrong: "During I was cooking, the phone rang.", right: "While I was cooking, the phone rang.", noteArabic: "جملة فيها فعل → while وليس during" }
    ],
    tips: ["during + noun // while + subject + verb // for + number + time unit"],
    tipsArabic: ["during + اسم // while + فاعل + فعل // for + رقم + وحدة زمن"]
  },
  {
    slug: "until-vs-by",
    category: "prepositions-time",
    order: 5,
    title: "until vs by",
    titleArabic: "الفرق بين until و by",
    summary: "'Until' = continuously up to a point. 'By' = at some point before or at a deadline.",
    summaryArabic: "'until' = الاستمرار حتى نقطة زمنية. 'by' = حدوث الشيء قبل أو عند الموعد النهائي.",
    words: [
      { word: "until", color: "blue", rule: "Continuous action/state from now until a specific time (emphasises duration)", ruleArabic: "استمرار الحدث أو الحالة من الآن حتى وقت محدد (يُركّز على الاستمرارية)", collocations: ["until midnight", "until he comes", "wait until", "until the end"] },
      { word: "by", color: "purple", rule: "Something must happen no later than a time (deadline)", ruleArabic: "يجب أن يحدث الشيء في موعد أقصاه هذا الوقت (موعد نهائي)", collocations: ["by Friday", "by the time", "finish by", "by noon", "by 5pm"] }
    ],
    examples: [
      { sentence: "I'll wait here until you come back.", sentenceArabic: "سأنتظر هنا حتى تعود.", focus: "until", note: "Continuous waiting until event" },
      { sentence: "Please send me the report by Friday.", sentenceArabic: "من فضلك أرسل لي التقرير بحلول يوم الجمعة.", focus: "by", note: "Deadline — at some point before Friday" },
      { sentence: "She worked until midnight.", sentenceArabic: "عملت حتى منتصف الليل.", focus: "until", note: "Worked continuously up to midnight" },
      { sentence: "You must finish this by 5pm.", sentenceArabic: "يجب أن تنهي هذا بحلول الخامسة مساءً.", focus: "by", note: "It must be done before 5pm" }
    ],
    mistakes: [
      { wrong: "Finish your homework until dinner.", right: "Finish your homework by dinner.", noteArabic: "الواجب يجب الانتهاء منه قبل العشاء (موعد نهائي) → by" },
      { wrong: "I'll be here by you arrive.", right: "I'll be here until you arrive.", noteArabic: "استمرار الوجود حتى حدث معين → until" }
    ],
    tips: ["until = the action keeps going. by = the action must be completed."],
    tipsArabic: ["until = الحدث يستمر. by = الحدث يجب أن يكتمل قبل الوقت."]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY 3: Adjectives & Adverbs
  // ═══════════════════════════════════════════════════════════
  {
    slug: "big-vs-large-vs-great",
    category: "adjectives-adverbs",
    order: 1,
    title: "big vs large vs great",
    titleArabic: "الفرق بين big و large و great",
    summary: "'Big' is general/informal. 'Large' is formal/size-focused. 'Great' means important, impressive, or excellent.",
    summaryArabic: "'big' عام وغير رسمي. 'large' رسمي ويصف الحجم. 'great' يعني مهم أو رائع أو عظيم.",
    words: [
      { word: "big", color: "blue", rule: "General size; informal; also used for importance or age", ruleArabic: "حجم عام; غير رسمي; يُستخدم أيضاً للأهمية أو العمر", collocations: ["big house", "big deal", "big brother", "big mistake", "big day"] },
      { word: "large", color: "green", rule: "Formal; emphasizes physical size; used for quantities/measurements", ruleArabic: "رسمي; يُركّز على الحجم الجسدي; يُستخدم مع الكميات والقياسات", collocations: ["large room", "large amount", "large-scale", "large company", "large portion"] },
      { word: "great", color: "purple", rule: "Important, impressive, excellent, or of high quality; NOT just big in size", ruleArabic: "مهم أو مبهر أو ممتاز أو عالي الجودة; ليس فقط كبير الحجم", collocations: ["great idea", "great achievement", "great artist", "great time", "great importance"] }
    ],
    examples: [
      { sentence: "That's a big decision to make.", sentenceArabic: "هذا قرار كبير يجب اتخاذه.", focus: "big", note: "Important/significant (informal)" },
      { sentence: "The company has a large number of employees.", sentenceArabic: "الشركة لديها عدد كبير من الموظفين.", focus: "large", note: "Formal, quantity-focused" },
      { sentence: "Einstein was a great scientist.", sentenceArabic: "أينشتاين كان عالماً عظيماً.", focus: "great", note: "Of outstanding importance/quality" }
    ],
    mistakes: [
      { wrong: "We had a large time at the party!", right: "We had a great time at the party!", noteArabic: "'great time' يعني وقتاً رائعاً. 'large' لا تُستخدم بهذا المعنى" },
      { wrong: "He's a great man (meaning: physically tall/big).", right: "He's a big/large man.", noteArabic: "إذا كان المقصود الحجم الجسدي فقط، استخدم big أو large" }
    ],
    tips: ["big = casual size/importance. large = formal size. great = quality/achievement/importance"],
    tipsArabic: ["big = حجم عام (عامي). large = حجم رسمي. great = جودة أو إنجاز أو أهمية"]
  },
  {
    slug: "still-vs-yet-vs-already-vs-anymore",
    category: "adjectives-adverbs",
    order: 2,
    title: "still vs yet vs already vs anymore",
    titleArabic: "الفرق بين still و yet و already و anymore",
    summary: "still = continuing. yet = expected but not happened (negatives/questions). already = sooner than expected. anymore = no longer.",
    summaryArabic: "still = مستمر. yet = متوقع لكن لم يحدث (نفي/سؤال). already = حدث قبل التوقع. anymore = لم يعد.",
    words: [
      { word: "still", color: "blue", rule: "An action/state continues (often longer than expected)", ruleArabic: "حدث أو حالة مستمرة (في الغالب أطول من المتوقع)", collocations: ["still waiting", "still here", "still haven't", "are you still...?"] },
      { word: "yet", color: "purple", rule: "Expected to happen but hasn't — used in negatives and questions", ruleArabic: "متوقع حدوثه لكنه لم يحدث — يُستخدم في النفي والسؤال", collocations: ["not yet", "have you...yet?", "hasn't arrived yet", "yet to be..."] },
      { word: "already", color: "green", rule: "Happened sooner than expected; emphasizes it's done", ruleArabic: "حدث أبكر من المتوقع; يُؤكد أنه تمّ بالفعل", collocations: ["already done", "I've already eaten", "already knew", "already left"] },
      { word: "anymore", color: "orange", rule: "Something that was true is no longer true (always negative)", ruleArabic: "شيء كان صحيحاً لم يعد كذلك (دائماً في الجمل النافية)", collocations: ["not...anymore", "don't smoke anymore", "she doesn't live here anymore"] }
    ],
    examples: [
      { sentence: "Are you still living in Cairo?", sentenceArabic: "هل لا تزال تعيش في القاهرة؟", focus: "still", note: "Continuing state" },
      { sentence: "Has the package arrived yet?", sentenceArabic: "هل وصل الطرد بعد؟", focus: "yet", note: "Expected but uncertain" },
      { sentence: "I've already had breakfast, thanks.", sentenceArabic: "لقد تناولت الإفطار بالفعل، شكراً.", focus: "already", note: "Done — sooner than perhaps expected" },
      { sentence: "She doesn't work there anymore.", sentenceArabic: "هي لم تعد تعمل هناك.", focus: "anymore", note: "No longer true" }
    ],
    mistakes: [
      { wrong: "I haven't finished yet still.", right: "I still haven't finished. / I haven't finished yet.", noteArabic: "still و yet لا يُستخدمان معاً في نفس الجملة" },
      { wrong: "I already didn't see him.", right: "I haven't seen him yet.", noteArabic: "في النفي المتعلق بالمتوقع → yet وليس already" }
    ],
    tips: ["still = in progress. yet = not done. already = done. anymore = stopped."],
    tipsArabic: ["still = جارٍ. yet = لم يتم. already = تمّ. anymore = توقف."]
  },
  {
    slug: "much-vs-many-vs-a-lot-of",
    category: "adjectives-adverbs",
    order: 3,
    title: "much vs many vs a lot of",
    titleArabic: "الفرق بين much و many و a lot of",
    summary: "'Much' + uncountable nouns. 'Many' + countable plural nouns. 'A lot of' works with both.",
    summaryArabic: "'much' مع الأسماء غير المعدودة. 'many' مع الأسماء المعدودة. 'a lot of' مع الاثنين.",
    words: [
      { word: "much", color: "blue", rule: "With uncountable nouns (mainly in negatives and questions)", ruleArabic: "مع الأسماء غير المعدودة (خاصة في الجمل النافية والسؤال)", collocations: ["much water", "much time", "much money", "how much", "too much", "very much"] },
      { word: "many", color: "purple", rule: "With countable plural nouns (mainly in negatives and questions)", ruleArabic: "مع الأسماء المعدودة الجمع (خاصة في الجمل النافية والسؤال)", collocations: ["many people", "many times", "many cars", "how many", "too many", "so many"] },
      { word: "a lot of", color: "green", rule: "Both countable and uncountable — mainly in positive statements", ruleArabic: "مع المعدودة وغير المعدودة — خاصة في الجمل المثبتة", collocations: ["a lot of money", "a lot of people", "lots of", "a lot of time"] }
    ],
    examples: [
      { sentence: "I don't have much time today.", sentenceArabic: "ليس لدي الكثير من الوقت اليوم.", focus: "much", note: "time = uncountable, negative" },
      { sentence: "How many students are in your class?", sentenceArabic: "كم عدد الطلاب في فصلك؟", focus: "many", note: "students = countable, question" },
      { sentence: "She has a lot of friends.", sentenceArabic: "لديها الكثير من الأصدقاء.", focus: "a lot of", note: "Positive statement, countable" },
      { sentence: "We've had a lot of rain this week.", sentenceArabic: "لدينا الكثير من المطر هذا الأسبوع.", focus: "a lot of", note: "Positive statement, uncountable" }
    ],
    mistakes: [
      { wrong: "I have many homework.", right: "I have a lot of homework.", noteArabic: "homework غير معدود → لا تستخدم many" },
      { wrong: "There is much people here.", right: "There are many/a lot of people here.", noteArabic: "people معدودة → many أو a lot of" }
    ],
    tips: ["In positives → prefer 'a lot of'. In negatives/questions → much/many based on countability."],
    tipsArabic: ["في الجمل المثبتة → a lot of. في النفي والسؤال → much أو many حسب المعدودية."]
  },
  {
    slug: "fast-vs-quick-vs-rapid",
    category: "adjectives-adverbs",
    order: 4,
    title: "fast vs quick vs rapid",
    titleArabic: "الفرق بين fast و quick و rapid",
    summary: "'Fast' = high speed (ongoing). 'Quick' = taking little time (brief action). 'Rapid' = formal/sudden change.",
    summaryArabic: "'fast' = سرعة عالية ومستمرة. 'quick' = يستغرق وقتاً قصيراً. 'rapid' = رسمي، تغير مفاجئ وسريع.",
    words: [
      { word: "fast", color: "blue", rule: "Moving or happening at high speed; can be adjective or adverb", ruleArabic: "التحرك أو الحدوث بسرعة عالية — يمكن أن يكون صفة أو حالاً", collocations: ["fast car", "fast runner", "speak fast", "fast food", "fast asleep"] },
      { word: "quick", color: "green", rule: "Taking a short amount of time; brief; done without delay", ruleArabic: "يستغرق وقتاً قصيراً; سريع التنفيذ; يُنجز بلا تأخير", collocations: ["quick meal", "quick question", "quick decision", "have a quick look"] },
      { word: "rapid", color: "purple", rule: "Formal; sudden/intensive rate of change or growth", ruleArabic: "رسمي; معدل مفاجئ وكثيف من التغيير أو النمو", collocations: ["rapid growth", "rapid change", "rapid development", "rapid response"] }
    ],
    examples: [
      { sentence: "She's a very fast swimmer.", sentenceArabic: "هي سبّاحة سريعة جداً.", focus: "fast", note: "High speed ongoing ability" },
      { sentence: "Can I ask you a quick question?", sentenceArabic: "هل يمكنني طرح سؤال سريع؟", focus: "quick", note: "Takes little time" },
      { sentence: "The rapid growth of AI is transforming industries.", sentenceArabic: "النمو السريع للذكاء الاصطناعي يحوّل الصناعات.", focus: "rapid", note: "Formal, intensive rate of change" }
    ],
    mistakes: [
      { wrong: "The economy has a fast growth.", right: "The economy has rapid growth.", noteArabic: "growth (نمو) تغيير مستمر ومكثف → rapid" },
      { wrong: "Let's have a fast lunch.", right: "Let's have a quick lunch.", noteArabic: "وجبة قصيرة الوقت → quick وليس fast" }
    ],
    tips: ["fast = the speed itself. quick = short in time. rapid = formal, intense rate of change."],
    tipsArabic: ["fast = السرعة ذاتها. quick = قصير المدة. rapid = رسمي، معدل تغيير مكثف."]
  },
  {
    slug: "little-vs-few-vs-less-vs-fewer",
    category: "adjectives-adverbs",
    order: 5,
    title: "little vs few vs less vs fewer",
    titleArabic: "الفرق بين little و few و less و fewer",
    summary: "little/less = uncountable. few/fewer = countable. a little/a few = some (positive). little/few (no 'a') = almost none.",
    summaryArabic: "little/less = غير معدود. few/fewer = معدود. a little/a few = قليل (إيجابي). little/few بدون 'a' = كاد لا يوجد.",
    words: [
      { word: "little / a little", color: "blue", rule: "With uncountable nouns. 'A little' = some (positive). 'Little' = almost none (negative).", ruleArabic: "مع غير المعدود. 'a little' = بعض (إيجابي). 'little' بدون 'a' = كاد لا يوجد (سلبي).", collocations: ["a little time", "a little water", "little hope", "little money"] },
      { word: "few / a few", color: "purple", rule: "With countable plural nouns. 'A few' = some (positive). 'Few' = almost none (negative).", ruleArabic: "مع المعدود الجمع. 'a few' = بعض (إيجابي). 'few' بدون 'a' = كاد لا يوجد (سلبي).", collocations: ["a few friends", "a few days", "few people", "few opportunities"] },
      { word: "less", color: "green", rule: "Comparative of 'little' — uncountable; smaller amount", ruleArabic: "صيغة المقارنة لـ little — مع غير المعدود; كمية أقل", collocations: ["less time", "less money", "less work", "less than"] },
      { word: "fewer", color: "orange", rule: "Comparative of 'few' — countable; smaller number", ruleArabic: "صيغة المقارنة لـ few — مع المعدود; عدد أقل", collocations: ["fewer people", "fewer cars", "fewer mistakes", "fewer than"] }
    ],
    examples: [
      { sentence: "I have a little money left — enough for coffee.", sentenceArabic: "لدي بعض المال المتبقي — يكفي لقهوة.", focus: "a little", note: "Some money (positive) — uncountable" },
      { sentence: "There's little hope of finding it now.", sentenceArabic: "لا يكاد يوجد أمل في إيجاده الآن.", focus: "little", note: "Almost none — uncountable (negative)" },
      { sentence: "A few friends came to help me move.", sentenceArabic: "بعض الأصدقاء جاؤوا لمساعدتي في الانتقال.", focus: "a few", note: "Some people (positive) — countable" },
      { sentence: "We need fewer cars and more public transport.", sentenceArabic: "نحتاج عدداً أقل من السيارات ووسائل نقل عامة أكثر.", focus: "fewer", note: "Comparative, countable (cars)" }
    ],
    mistakes: [
      { wrong: "We need less mistakes.", right: "We need fewer mistakes.", noteArabic: "mistakes معدودة → fewer وليس less" },
      { wrong: "I have few time for this.", right: "I have little time for this.", noteArabic: "time غير معدود → little وليس few" }
    ],
    tips: ["Count or not? Countable → few/fewer. Uncountable → little/less."],
    tipsArabic: ["هل يمكن عده؟ معدود → few/fewer. غير معدود → little/less."]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY 4: Modal Verbs
  // ═══════════════════════════════════════════════════════════
  {
    slug: "can-vs-could-vs-be-able-to",
    category: "modal-verbs",
    order: 1,
    title: "can vs could vs be able to",
    titleArabic: "الفرق بين can و could و be able to",
    summary: "'Can' = present ability/permission. 'Could' = past ability or polite/hypothetical. 'Be able to' = specific achievement or future.",
    summaryArabic: "'can' = قدرة أو إذن في الحاضر. 'could' = قدرة ماضية أو مهذب أو افتراضي. 'be able to' = إنجاز محدد أو مستقبل.",
    words: [
      { word: "can", color: "blue", rule: "Present ability, permission, or possibility", ruleArabic: "قدرة حالية أو إذن أو احتمال في الحاضر", collocations: ["I can swim", "can I...?", "she can speak", "you can go"] },
      { word: "could", color: "purple", rule: "Past ability; polite requests; hypothetical/less certain possibility", ruleArabic: "قدرة ماضية; طلبات مهذبة; احتمال افتراضي أو أقل يقيناً", collocations: ["I could swim (past)", "could you...?", "it could be", "could have"] },
      { word: "be able to", color: "green", rule: "Specific one-time achievement; all tenses including future; after modals", ruleArabic: "إنجاز محدد لمرة واحدة; كل الأزمنة حتى المستقبل; بعد الأفعال الناقصة", collocations: ["was able to", "will be able to", "haven't been able to", "being able to"] }
    ],
    examples: [
      { sentence: "Can you drive?", sentenceArabic: "هل تستطيع القيادة؟", focus: "can", note: "Present general ability" },
      { sentence: "Could you pass me the salt, please?", sentenceArabic: "هل يمكنك تمرير الملح من فضلك؟", focus: "could", note: "Polite request" },
      { sentence: "She was able to escape just in time.", sentenceArabic: "استطاعت الهروب في الوقت المناسب.", focus: "be able to", note: "Specific one-time achievement in past" },
      { sentence: "I'll be able to attend the meeting tomorrow.", sentenceArabic: "سأتمكن من حضور الاجتماع غداً.", focus: "be able to", note: "Future — 'can' doesn't work here" }
    ],
    mistakes: [
      { wrong: "I will can finish it.", right: "I will be able to finish it.", noteArabic: "can لا تأتي بعد will — استخدم will be able to" },
      { wrong: "She could to swim when she was five.", right: "She could swim when she was five.", noteArabic: "بعد could تأتي المصدر بدون to" }
    ],
    tips: ["Two modals together? Use 'be able to' instead of 'can'. E.g. I might be able to come."],
    tipsArabic: ["فعلان ناقصان معاً؟ استخدم 'be able to' بدل 'can'. مثل: I might be able to come."]
  },
  {
    slug: "must-vs-have-to-vs-should",
    category: "modal-verbs",
    order: 2,
    title: "must vs have to vs should",
    titleArabic: "الفرق بين must و have to و should",
    summary: "'Must' = strong personal obligation or logical certainty. 'Have to' = external rule/obligation. 'Should' = advice or mild recommendation.",
    summaryArabic: "'must' = إلزام شخصي قوي أو يقين منطقي. 'have to' = قاعدة أو إلزام خارجي. 'should' = نصيحة أو توصية خفيفة.",
    words: [
      { word: "must", color: "red", rule: "Strong personal obligation (from speaker) or logical certainty", ruleArabic: "إلزام شخصي قوي (من المتكلم) أو استنتاج منطقي مؤكد", collocations: ["you must stop", "this must be wrong", "must do", "must not (mustn't)"] },
      { word: "have to", color: "blue", rule: "External obligation — rules, laws, or circumstances require it", ruleArabic: "إلزام خارجي — القواعد أو القوانين أو الظروف تفرضه", collocations: ["I have to work", "you have to pay", "she had to leave", "don't have to (not obligatory)"] },
      { word: "should", color: "green", rule: "Advice, recommendation, or expectation (not obligatory)", ruleArabic: "نصيحة أو توصية أو توقع (ليس إلزامياً)", collocations: ["you should try", "she should call", "should have done", "shouldn't"] }
    ],
    examples: [
      { sentence: "You must wear a seatbelt — it's the law.", sentenceArabic: "يجب عليك ارتداء حزام الأمان — هذا قانون.", focus: "must/have to", note: "Both work here; must = strong; have to = external rule" },
      { sentence: "You should see a doctor about that cough.", sentenceArabic: "يجب عليك مراجعة طبيب بشأن هذا السعال.", focus: "should", note: "Advice — not obligatory" },
      { sentence: "He must be tired after that long journey.", sentenceArabic: "يجب أن يكون متعباً بعد تلك الرحلة الطويلة.", focus: "must", note: "Logical certainty/deduction" },
      { sentence: "You don't have to come if you don't want to.", sentenceArabic: "لا يجب عليك المجيء إذا لم تُرد.", focus: "have to", note: "No obligation" }
    ],
    mistakes: [
      { wrong: "You must to go now.", right: "You must go now.", noteArabic: "بعد must تأتي المصدر بدون to" },
      { wrong: "You mustn't pay — it's free.", right: "You don't have to pay — it's free.", noteArabic: "mustn't = ممنوع. don't have to = ليس إلزامياً (اختياري)" }
    ],
    tips: ["mustn't = forbidden! don't have to = no obligation but allowed."],
    tipsArabic: ["mustn't = ممنوع! don't have to = اختياري وليس إلزامياً."]
  },
  {
    slug: "will-vs-would-vs-going-to",
    category: "modal-verbs",
    order: 3,
    title: "will vs would vs going to",
    titleArabic: "الفرق بين will و would و going to",
    summary: "'Will' = spontaneous decision/promise/prediction. 'Going to' = planned intention or clear evidence. 'Would' = hypothetical/polite.",
    summaryArabic: "'will' = قرار فوري/وعد/تنبؤ. 'going to' = خطة مسبقة أو دليل واضح. 'would' = افتراضي/مهذب.",
    words: [
      { word: "will", color: "blue", rule: "Spontaneous decisions, promises, predictions without evidence", ruleArabic: "قرارات فورية، وعود، تنبؤات بدون دليل واضح", collocations: ["I'll help you", "I think it will rain", "she'll be fine", "will you...?"] },
      { word: "going to", color: "green", rule: "Pre-planned intentions or predictions based on present evidence", ruleArabic: "نوايا مخططة مسبقاً أو تنبؤات مبنية على دليل حالي", collocations: ["I'm going to study", "it's going to rain (dark clouds)", "she's going to have a baby"] },
      { word: "would", color: "purple", rule: "Hypothetical situations; polite requests; past habits", ruleArabic: "مواقف افتراضية; طلبات مهذبة; عادات ماضية", collocations: ["I would travel", "would you like?", "he would always say", "if I were..., I would"] }
    ],
    examples: [
      { sentence: "The phone's ringing — I'll get it!", sentenceArabic: "الهاتف يرن — سأرد عليه!", focus: "will", note: "Spontaneous decision, made right now" },
      { sentence: "I'm going to visit my parents next week.", sentenceArabic: "سأزور والديَّ الأسبوع القادم.", focus: "going to", note: "Pre-planned intention" },
      { sentence: "Look at those clouds — it's going to rain!", sentenceArabic: "انظر إلى تلك الغيوم — ستمطر!", focus: "going to", note: "Prediction based on clear evidence" },
      { sentence: "Would you like some tea?", sentenceArabic: "هل تريد بعض الشاي؟", focus: "would", note: "Polite offer" }
    ],
    mistakes: [
      { wrong: "I decided last week I'll visit Rome.", right: "I decided last week I'm going to visit Rome.", noteArabic: "قرار مُتخذ مسبقاً → going to" },
      { wrong: "I will to travel if I had money.", right: "I would travel if I had money.", noteArabic: "مواقف افتراضية → would" }
    ],
    tips: ["Planned before speaking → going to. Decided at moment of speaking → will."],
    tipsArabic: ["مُخطط قبل الكلام → going to. قرار في لحظة الكلام → will."]
  },
  {
    slug: "may-vs-might-vs-could-possibility",
    category: "modal-verbs",
    order: 4,
    title: "may vs might vs could (possibility)",
    titleArabic: "الفرق بين may و might و could في الاحتمال",
    summary: "'May' = ~50% possibility (more certain). 'Might' = less certain possibility. 'Could' = theoretical possibility.",
    summaryArabic: "'may' = احتمال نحو 50% (أكثر يقيناً). 'might' = احتمال أقل يقيناً. 'could' = احتمال نظري.",
    words: [
      { word: "may", color: "blue", rule: "Possibility: around 50% certain. Also used for formal permission.", ruleArabic: "احتمال: نحو 50% من اليقين. يُستخدم أيضاً للإذن الرسمي.", collocations: ["it may rain", "she may come", "may I help you?", "this may take time"] },
      { word: "might", color: "purple", rule: "Lower possibility than 'may'; more tentative and uncertain", ruleArabic: "احتمال أقل من 'may'; أكثر تحفظاً وعدم يقين", collocations: ["it might work", "I might go", "this might help", "might have been"] },
      { word: "could", color: "green", rule: "Theoretical possibility; one of several options that exist", ruleArabic: "احتمال نظري; واحد من عدة خيارات محتملة", collocations: ["could be", "this could work", "it could be anything", "could have happened"] }
    ],
    examples: [
      { sentence: "She may call us later — she mentioned it.", sentenceArabic: "ربما تتصل بنا لاحقاً — ذكرت ذلك.", focus: "may", note: "Reasonable possibility (~50%)" },
      { sentence: "I might come to the party, but I'm not sure.", sentenceArabic: "ربما أحضر الحفلة، لكنني لست متأكداً.", focus: "might", note: "Less certain" },
      { sentence: "The noise could be a problem later.", sentenceArabic: "الضجة قد تكون مشكلة لاحقاً.", focus: "could", note: "Theoretical possibility" }
    ],
    mistakes: [
      { wrong: "May I to sit here?", right: "May I sit here?", noteArabic: "بعد may يأتي المصدر بدون to" },
      { wrong: "She maybe call later.", right: "She may/might call later.", noteArabic: "maybe كلمة واحدة (ظرف)، أما may be كلمتان (فعل ناقص + be)" }
    ],
    tips: ["Certainty scale: will (certain) > may (~50%) > might (~30%) > could (theoretical)"],
    tipsArabic: ["سلم اليقين: will (مؤكد) > may (50%) > might (30%) > could (نظري)"]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY 5: Nouns & Articles
  // ═══════════════════════════════════════════════════════════
  {
    slug: "a-vs-an-vs-the",
    category: "nouns-articles",
    order: 1,
    title: "a vs an vs the vs Ø",
    titleArabic: "الفرق بين a و an و the وعدم التعريف",
    summary: "a/an = first mention or one of many. the = specific/known to both. Ø = general plural or uncountable.",
    summaryArabic: "a/an = أول ذكر أو واحد من كثيرين. the = محدد ومعروف للطرفين. Ø = الجمع العام أو غير المعدود.",
    words: [
      { word: "a / an", color: "blue", rule: "Indefinite — introducing something for the first time or one of many. 'An' before vowel sounds.", ruleArabic: "نكرة — تقديم شيء لأول مرة أو واحد من كثيرين. 'an' قبل الأصوات الصائتة.", collocations: ["a book", "an apple", "a university (yoo sound)", "an hour (silent h)"] },
      { word: "the", color: "purple", rule: "Definite — specific thing known to both speaker and listener", ruleArabic: "معرفة — شيء محدد معروف للمتكلم والمستمع كليهما", collocations: ["the sun", "the first time", "the book (I mentioned)", "the tallest building"] },
      { word: "Ø (no article)", color: "green", rule: "General statements with uncountable or plural countable nouns", ruleArabic: "تعميمات مع الأسماء غير المعدودة أو جمع الأسماء المعدودة", collocations: ["I love music", "Dogs are loyal", "life is short", "water is important"] }
    ],
    examples: [
      { sentence: "I saw a dog in the park. The dog was barking loudly.", sentenceArabic: "رأيت كلباً في الحديقة. كان الكلب ينبح بصوت عالٍ.", focus: "a → the", note: "First mention (a) → second mention (the)" },
      { sentence: "The moon is beautiful tonight.", sentenceArabic: "القمر جميل الليلة.", focus: "the", note: "Unique thing known to everyone" },
      { sentence: "I love music and Ø dancing.", sentenceArabic: "أحب الموسيقى والرقص.", focus: "Ø", note: "General statement, uncountable" }
    ],
    mistakes: [
      { wrong: "She is best student in class.", right: "She is the best student in the class.", noteArabic: "مع superlatives (best) نستخدم the دائماً" },
      { wrong: "An university in the city.", right: "A university in the city.", noteArabic: "'university' تبدأ بصوت يو (y-sound) وهو ساكن → a وليس an" }
    ],
    tips: ["First time you mention it → a/an. Both know what you mean → the. General truth → no article."],
    tipsArabic: ["أول ذكر → a/an. كلاكما يعرف المقصود → the. حقيقة عامة → لا أداة تعريف."]
  },
  {
    slug: "job-vs-work-vs-career",
    category: "nouns-articles",
    order: 2,
    title: "job vs work vs career vs profession",
    titleArabic: "الفرق بين job و work و career و profession",
    summary: "'Work' is uncountable (activity). 'Job' is countable (specific position). 'Career' is long-term path. 'Profession' is skilled field.",
    summaryArabic: "'work' غير معدود (نشاط). 'job' معدود (منصب محدد). 'career' مسار مهني طويل الأمد. 'profession' مجال مهاري.",
    words: [
      { word: "work", color: "blue", rule: "General activity of doing tasks; uncountable — no plural", ruleArabic: "النشاط العام لأداء المهام; غير معدود — لا جمع له", collocations: ["go to work", "hard work", "work experience", "lots of work", "out of work"] },
      { word: "job", color: "purple", rule: "A specific employment position; countable", ruleArabic: "منصب أو وظيفة محددة; معدود", collocations: ["a part-time job", "apply for a job", "lose your job", "two jobs", "job interview"] },
      { word: "career", color: "green", rule: "Long-term professional path or series of jobs in a field", ruleArabic: "مسار مهني طويل الأمد أو سلسلة وظائف في مجال معين", collocations: ["career path", "successful career", "career change", "career goals", "pursue a career"] },
      { word: "profession", color: "orange", rule: "A skilled, often regulated occupation requiring training/education", ruleArabic: "مهنة مهارية تتطلب تدريباً أو تعليماً, في الغالب منظمة", collocations: ["medical profession", "legal profession", "by profession", "professional standards"] }
    ],
    examples: [
      { sentence: "I have a lot of work to do today.", sentenceArabic: "لديّ الكثير من العمل لأقوم به اليوم.", focus: "work", note: "Uncountable — tasks/activity" },
      { sentence: "She found a new job as a graphic designer.", sentenceArabic: "وجدت وظيفة جديدة كمصممة جرافيك.", focus: "job", note: "Specific position (countable)" },
      { sentence: "He built a successful career in finance.", sentenceArabic: "بنى مسيرة مهنية ناجحة في مجال المالية.", focus: "career", note: "Long-term professional path" },
      { sentence: "Teaching is a challenging and rewarding profession.", sentenceArabic: "التدريس مهنة صعبة ومُجزية.", focus: "profession", note: "Skilled field requiring training" }
    ],
    mistakes: [
      { wrong: "She has two works.", right: "She has two jobs. / She has a lot of work.", noteArabic: "work غير معدود ولا يُجمع; job معدود ويُجمع" },
      { wrong: "What is your job? (asking a doctor formally)", right: "What is your profession?", noteArabic: "للمهن المتخصصة (طبيب، محامي) في السياق الرسمي استخدم profession" }
    ],
    tips: ["work = what you do. job = where/what position. career = your whole working life. profession = your skilled field."],
    tipsArabic: ["work = ما تفعله. job = ماذا/أين وظيفتك. career = مسيرتك المهنية كلها. profession = مجالك المهاري."]
  },
  {
    slug: "house-vs-home-vs-flat",
    category: "nouns-articles",
    order: 3,
    title: "house vs home vs flat vs apartment",
    titleArabic: "الفرق بين house و home و flat و apartment",
    summary: "'House' = the physical building. 'Home' = where you belong (emotional). 'Flat/Apartment' = part of a building.",
    summaryArabic: "'house' = المبنى الجسدي. 'home' = مكان الانتماء (عاطفي). 'flat/apartment' = جزء من مبنى.",
    words: [
      { word: "house", color: "blue", rule: "A physical standalone building where people live", ruleArabic: "مبنى منفصل جسدياً يعيش فيه الناس", collocations: ["detached house", "buy a house", "house prices", "house key"] },
      { word: "home", color: "red", rule: "Where you live and feel you belong; can be any type of residence", ruleArabic: "حيث تعيش وتشعر بالانتماء; يمكن أن يكون أي نوع من المسكن", collocations: ["go home", "feel at home", "home country", "away from home", "make yourself at home"] },
      { word: "flat (BrE) / apartment (AmE)", color: "green", rule: "A unit within a larger building; one floor or part of a building", ruleArabic: "وحدة داخل مبنى أكبر; طابق أو جزء من مبنى", collocations: ["studio flat", "rent an apartment", "first-floor flat", "apartment building"] }
    ],
    examples: [
      { sentence: "They bought a beautiful house in the countryside.", sentenceArabic: "اشتروا منزلاً جميلاً في الريف.", focus: "house", note: "Physical standalone building" },
      { sentence: "After the long trip, it felt so good to be home.", sentenceArabic: "بعد الرحلة الطويلة، كان الشعور رائعاً بالعودة للمنزل.", focus: "home", note: "Emotional sense of belonging" },
      { sentence: "She rents a small flat in the city centre.", sentenceArabic: "تستأجر شقة صغيرة في وسط المدينة.", focus: "flat", note: "Unit in a larger building" }
    ],
    mistakes: [
      { wrong: "I'm going to my house now.", right: "I'm going home now.", noteArabic: "'go home' بدون preposition. 'home' للعودة لمكان الانتماء." },
      { wrong: "Make yourself at house!", right: "Make yourself at home!", noteArabic: "'at home' = تعبير جامد يعني 'ارتاح وكأنك في بيتك'" }
    ],
    tips: ["home = emotional. house = physical structure. flat/apartment = within a building."],
    tipsArabic: ["home = عاطفي. house = مبنى مادي. flat/apartment = وحدة داخل مبنى."]
  },
  {
    slug: "travel-vs-trip-vs-journey",
    category: "nouns-articles",
    order: 4,
    title: "travel vs trip vs journey vs voyage",
    titleArabic: "الفرق بين travel و trip و journey و voyage",
    summary: "'Travel' = general activity (uncountable). 'Trip' = short return visit. 'Journey' = the travel itself. 'Voyage' = long sea/space travel.",
    summaryArabic: "'travel' = النشاط العام (غير معدود). 'trip' = رحلة قصيرة والعودة. 'journey' = الرحلة نفسها (المسافة). 'voyage' = رحلة طويلة بحراً أو فضاءً.",
    words: [
      { word: "travel", color: "blue", rule: "The general activity of going places; uncountable noun / verb", ruleArabic: "النشاط العام للتنقل بين الأماكن; اسم غير معدود وفعل", collocations: ["love travel", "travel insurance", "business travel", "air travel"] },
      { word: "trip", color: "purple", rule: "A specific short journey with return; countable", ruleArabic: "رحلة محددة قصيرة مع العودة; معدود", collocations: ["business trip", "day trip", "round trip", "take a trip"] },
      { word: "journey", color: "green", rule: "The actual process of travelling from A to B (one way); countable", ruleArabic: "عملية التنقل الفعلية من نقطة لأخرى; معدود", collocations: ["long journey", "train journey", "journey time", "life journey"] },
      { word: "voyage", color: "orange", rule: "A long journey by sea or through space; formal/literary", ruleArabic: "رحلة طويلة بالبحر أو عبر الفضاء; رسمي/أدبي", collocations: ["sea voyage", "maiden voyage", "voyage of discovery"] }
    ],
    examples: [
      { sentence: "Travel broadens the mind.", sentenceArabic: "السفر يوسع الآفاق.", focus: "travel", note: "General concept/activity" },
      { sentence: "How was your business trip to Tokyo?", sentenceArabic: "كيف كانت رحلة عملك إلى طوكيو؟", focus: "trip", note: "Short specific journey with return" },
      { sentence: "The journey from London to Edinburgh takes 4.5 hours.", sentenceArabic: "الرحلة من لندن إلى إدنبرة تستغرق 4.5 ساعة.", focus: "journey", note: "The actual travel process one way" }
    ],
    mistakes: [
      { wrong: "I went on a travel to Italy.", right: "I went on a trip to Italy.", noteArabic: "trip معدود ويُستخدم لرحلات محددة. travel غير معدود ولا يأتي بعد 'a'" },
      { wrong: "The travel from here was long.", right: "The journey from here was long.", noteArabic: "travel لا يُستخدم لوصف مدة تنقل محدد — استخدم journey" }
    ],
    tips: ["travel = concept. trip = the event. journey = the distance covered. voyage = epic sea/space travel."],
    tipsArabic: ["travel = المفهوم. trip = الحدث. journey = المسافة المقطوعة. voyage = رحلة بحرية/فضائية."]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY 6: Phrases & Expressions
  // ═══════════════════════════════════════════════════════════
  {
    slug: "at-the-end-vs-in-the-end",
    category: "phrases-expressions",
    order: 1,
    title: "at the end vs in the end",
    titleArabic: "الفرق بين at the end و in the end",
    summary: "'At the end' = a specific point/location in time or place. 'In the end' = finally, after a long time/process.",
    summaryArabic: "'at the end' = نقطة أو موقع محدد في الزمان أو المكان. 'in the end' = في النهاية، بعد وقت أو عملية طويلة.",
    words: [
      { word: "at the end", color: "blue", rule: "A specific point — the end of something particular (+ of)", ruleArabic: "نقطة محددة — نهاية شيء بعينه (+ of)", collocations: ["at the end of the film", "at the end of the street", "at the end of the year"] },
      { word: "in the end", color: "purple", rule: "Eventually; after a lot of time, effort, or uncertainty (no 'of')", ruleArabic: "في نهاية المطاف; بعد الكثير من الوقت أو الجهد أو عدم اليقين (بدون 'of')", collocations: ["in the end, he agreed", "it all worked out in the end", "in the end we decided"] }
    ],
    examples: [
      { sentence: "At the end of the movie, the hero wins.", sentenceArabic: "في نهاية الفيلم، يفوز البطل.", focus: "at the end", note: "Specific point at the end of the film" },
      { sentence: "We argued for hours, but in the end we agreed.", sentenceArabic: "تجادلنا لساعات، لكن في نهاية المطاف اتفقنا.", focus: "in the end", note: "Eventually, after a process" }
    ],
    mistakes: [
      { wrong: "In the end of the chapter, there's a quiz.", right: "At the end of the chapter, there's a quiz.", noteArabic: "نهاية محددة لشيء معين + of → at the end" },
      { wrong: "At the end, everything was fine.", right: "In the end, everything was fine.", noteArabic: "في نهاية المطاف (بعد صراع/عملية) → in the end" }
    ],
    tips: ["at the end + of (specific). in the end = finally (no 'of')."],
    tipsArabic: ["at the end + of (محدد). in the end = في النهاية (بدون 'of')."]
  },
  {
    slug: "used-to-vs-be-used-to",
    category: "phrases-expressions",
    order: 2,
    title: "used to vs be used to vs get used to",
    titleArabic: "الفرق بين used to و be used to و get used to",
    summary: "'Used to do' = past habit (no longer). 'Be used to' = accustomed (present state). 'Get used to' = becoming accustomed (process).",
    summaryArabic: "'used to do' = عادة ماضية (لم تعد). 'be used to' = معتاد (حالة حاضرة). 'get used to' = يتعود (عملية مستمرة).",
    words: [
      { word: "used to + infinitive", color: "blue", rule: "A past habit or state that no longer exists", ruleArabic: "عادة أو حالة ماضية لم تعد موجودة الآن", collocations: ["used to live", "used to eat", "didn't use to", "I used to be..."] },
      { word: "be used to + -ing/noun", color: "purple", rule: "Accustomed to something; a current/established state", ruleArabic: "معتاد على شيء; حالة حالية أو راسخة", collocations: ["I'm used to waking up early", "she's used to the noise", "not used to it yet"] },
      { word: "get used to + -ing/noun", color: "green", rule: "The process of becoming accustomed to something", ruleArabic: "عملية التعود على شيء — الانتقال من غير معتاد إلى معتاد", collocations: ["getting used to it", "you'll get used to it", "it takes time to get used to"] }
    ],
    examples: [
      { sentence: "I used to smoke but I quit 5 years ago.", sentenceArabic: "كنت أدخن لكنني توقفت منذ 5 سنوات.", focus: "used to", note: "Past habit — no longer true" },
      { sentence: "She's used to working long hours.", sentenceArabic: "هي معتادة على العمل لساعات طويلة.", focus: "be used to", note: "Accustomed — current state" },
      { sentence: "It took a while, but I got used to the cold weather.", sentenceArabic: "استغرق بعض الوقت، لكنني تعودت على الطقس البارد.", focus: "get used to", note: "The process of becoming accustomed" }
    ],
    mistakes: [
      { wrong: "I am used to wake up early.", right: "I am used to waking up early.", noteArabic: "بعد 'be used to' يأتي الفعل + ing وليس المصدر" },
      { wrong: "I use to drink coffee every morning.", right: "I used to drink coffee every morning.", noteArabic: "العادة الماضية تحتاج 'used to' وليس 'use to'" }
    ],
    tips: ["used to do = past. be used to doing = present habit. get used to doing = in progress."],
    tipsArabic: ["used to do = ماضٍ. be used to doing = عادة حاضرة. get used to doing = جارٍ التعود."]
  },
  {
    slug: "so-vs-such",
    category: "phrases-expressions",
    order: 3,
    title: "so vs such",
    titleArabic: "الفرق بين so و such",
    summary: "'So' + adjective/adverb. 'Such' + (a) noun or adjective+noun. Both express strong degree.",
    summaryArabic: "'so' + صفة أو ظرف. 'such' + (a) اسم أو صفة + اسم. كلاهما يُعبّر عن درجة قوية.",
    words: [
      { word: "so", color: "blue", rule: "Before adjectives and adverbs to intensify them", ruleArabic: "قبل الصفات والأحوال لتكثيف معناها", collocations: ["so beautiful", "so quickly", "so much", "so many", "so + adj + that"] },
      { word: "such", color: "purple", rule: "Before (a/an +) adjective + noun or just a noun", ruleArabic: "قبل (a/an +) صفة + اسم أو اسم فقط", collocations: ["such a good idea", "such beautiful weather", "such people", "such + noun + that"] }
    ],
    examples: [
      { sentence: "The food was so delicious!", sentenceArabic: "الطعام كان لذيذاً جداً!", focus: "so", note: "so + adjective alone" },
      { sentence: "It was such a delicious meal!", sentenceArabic: "كانت وجبة لذيذة جداً!", focus: "such", note: "such + a + adjective + noun" },
      { sentence: "She speaks so quickly that I can't understand.", sentenceArabic: "تتكلم بسرعة كبيرة جداً لدرجة أنني لا أستطيع الفهم.", focus: "so", note: "so + adverb + that" },
      { sentence: "I've never seen such beautiful scenery.", sentenceArabic: "لم أر قط مثل هذه المناظر الطبيعية الجميلة.", focus: "such", note: "such + adjective + noun (no article for plural/uncountable)" }
    ],
    mistakes: [
      { wrong: "She is such kind.", right: "She is so kind. / She is such a kind person.", noteArabic: "قبل صفة بدون اسم → so. مع صفة + اسم → such (a)" },
      { wrong: "It was so a good film.", right: "It was such a good film.", noteArabic: "قبل a/an + صفة + اسم → such" }
    ],
    tips: ["so + adj/adverb. such + (a/an) + adj + noun."],
    tipsArabic: ["so + صفة/حال. such + (a/an) + صفة + اسم."]
  },
  {
    slug: "too-vs-very-vs-enough",
    category: "phrases-expressions",
    order: 4,
    title: "too vs very vs enough",
    titleArabic: "الفرق بين too و very و enough",
    summary: "'Very' = high degree (neutral). 'Too' = excessive (problem implied). 'Enough' = sufficient (after adj, before noun).",
    summaryArabic: "'very' = درجة عالية (محايد). 'too' = مبالغ فيه (مشكلة ضمنية). 'enough' = كافٍ (بعد الصفة، قبل الاسم).",
    words: [
      { word: "very", color: "blue", rule: "Intensifier — neutral, just emphasises degree", ruleArabic: "مُكثّف — محايد، يُؤكد الدرجة فقط", collocations: ["very good", "very hot", "very quickly", "very much"] },
      { word: "too", color: "red", rule: "Excessive — more than desirable; implies a problem or impossibility", ruleArabic: "مبالغ فيه — أكثر من المطلوب; يعني وجود مشكلة أو استحالة", collocations: ["too hot to eat", "too tired to talk", "too expensive", "too many people"] },
      { word: "enough", color: "green", rule: "Sufficient amount — comes AFTER adjectives, BEFORE nouns", ruleArabic: "كمية كافية — يأتي بعد الصفات وقبل الأسماء", collocations: ["good enough", "old enough to vote", "enough money", "enough time"] }
    ],
    examples: [
      { sentence: "This coffee is very hot.", sentenceArabic: "هذه القهوة ساخنة جداً.", focus: "very", note: "Just emphasising — no problem implied" },
      { sentence: "This coffee is too hot to drink.", sentenceArabic: "هذه القهوة ساخنة جداً لدرجة أنه لا يمكن شربها.", focus: "too", note: "Excessive — it's a problem" },
      { sentence: "You're old enough to make your own decisions.", sentenceArabic: "أنت كبير بما يكفي لاتخاذ قراراتك بنفسك.", focus: "enough", note: "enough AFTER the adjective (old)" },
      { sentence: "We don't have enough money for the trip.", sentenceArabic: "ليس لدينا ما يكفي من المال للرحلة.", focus: "enough", note: "enough BEFORE the noun (money)" }
    ],
    mistakes: [
      { wrong: "She's very tired to work.", right: "She's too tired to work.", noteArabic: "المشكلة/الاستحالة → too, ليس very" },
      { wrong: "I am enough old to drive.", right: "I am old enough to drive.", noteArabic: "enough يأتي بعد الصفة: old enough" }
    ],
    tips: ["very = degree. too = problem. enough: adj + enough OR enough + noun."],
    tipsArabic: ["very = درجة. too = مشكلة. enough: صفة + enough أو enough + اسم."]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY 7: Tricky Pairs
  // ═══════════════════════════════════════════════════════════
  {
    slug: "affect-vs-effect",
    category: "tricky-pairs",
    order: 1,
    title: "affect vs effect",
    titleArabic: "الفرق بين affect و effect",
    summary: "'Affect' is usually a verb (to influence). 'Effect' is usually a noun (the result).",
    summaryArabic: "'affect' غالباً فعل (يؤثر). 'effect' غالباً اسم (النتيجة أو التأثير).",
    words: [
      { word: "affect", color: "blue", rule: "Verb — to have an influence on something; to change", ruleArabic: "فعل — أن يؤثر على شيء; أن يُغير", collocations: ["affect health", "badly affected", "negatively affect", "how does it affect...?"] },
      { word: "effect", color: "purple", rule: "Noun — the result, impact, or consequence of something", ruleArabic: "اسم — النتيجة أو التأثير أو العاقبة لشيء ما", collocations: ["side effect", "have an effect on", "positive effect", "cause and effect", "special effects"] }
    ],
    examples: [
      { sentence: "Stress can badly affect your health.", sentenceArabic: "يمكن أن يؤثر الضغط بشكل سيئ على صحتك.", focus: "affect", note: "Verb — to influence" },
      { sentence: "The effect of stress on health is well-documented.", sentenceArabic: "تأثير الضغط على الصحة موثق جيداً.", focus: "effect", note: "Noun — the result/impact" },
      { sentence: "How did the new policy affect the company?", sentenceArabic: "كيف أثرت السياسة الجديدة على الشركة؟", focus: "affect", note: "Verb in a question" }
    ],
    mistakes: [
      { wrong: "The affect was immediate.", right: "The effect was immediate.", noteArabic: "بعد 'the' يأتي الاسم → effect" },
      { wrong: "Smoking effects your lungs.", right: "Smoking affects your lungs.", noteArabic: "بعد الفاعل يأتي الفعل → affect" }
    ],
    tips: ["RAVEN: Remember Affect Verb Effect Noun."],
    tipsArabic: ["قاعدة RAVEN: تذكّر — Affect فعل، Effect اسم."]
  },
  {
    slug: "quite-vs-rather-vs-fairly",
    category: "tricky-pairs",
    order: 2,
    title: "quite vs rather vs fairly",
    titleArabic: "الفرق بين quite و rather و fairly",
    summary: "'Fairly' = moderately (positive). 'Quite' = to a considerable degree. 'Rather' = more than expected (often negative).",
    summaryArabic: "'fairly' = بشكل معتدل (إيجابي). 'quite' = بدرجة معتبرة. 'rather' = أكثر من المتوقع (في الغالب سلبي).",
    words: [
      { word: "fairly", color: "green", rule: "Moderately — less than 'very'; positive/neutral context", ruleArabic: "بشكل معتدل — أقل من 'very'; سياق إيجابي أو محايد", collocations: ["fairly good", "fairly easy", "fairly well", "fairly common"] },
      { word: "quite", color: "blue", rule: "To a considerable or noticeable degree; also means 'completely' with some adjectives", ruleArabic: "بدرجة معتبرة أو ملحوظة; يعني 'تماماً' مع بعض الصفات", collocations: ["quite good", "quite sure", "quite right", "quite finished", "quite a few"] },
      { word: "rather", color: "purple", rule: "More than expected or desired; often suggests mild criticism or surprise", ruleArabic: "أكثر مما هو متوقع أو مرغوب; في الغالب ينطوي على انتقاد خفيف أو مفاجأة", collocations: ["rather rude", "rather expensive", "rather difficult", "I'd rather", "rather than"] }
    ],
    examples: [
      { sentence: "The test was fairly easy — most students passed.", sentenceArabic: "كان الاختبار سهلاً إلى حد ما — اجتاز معظم الطلاب.", focus: "fairly", note: "Moderate — not very easy, but okay" },
      { sentence: "She's quite talented — really impressive.", sentenceArabic: "إنها موهوبة جداً — رائعة حقاً.", focus: "quite", note: "Considerable degree" },
      { sentence: "The price was rather high for what we got.", sentenceArabic: "كان السعر مرتفعاً نوعاً ما مقارنة بما حصلنا عليه.", focus: "rather", note: "More than expected — mild criticism" }
    ],
    mistakes: [
      { wrong: "That was fairly rude of him.", right: "That was rather rude of him.", noteArabic: "rude (سلبي) + أكثر من المتوقع → rather" },
      { wrong: "She's rather good at singing (just neutral).", right: "She's quite/fairly good at singing.", noteArabic: "rather يُضيف ضمنياً معنى 'مفاجئ/أكثر من المتوقع'" }
    ],
    tips: ["fairly < quite < rather (in degree). rather often implies surprise or criticism."],
    tipsArabic: ["fairly < quite < rather (في الدرجة). rather غالباً تعني مفاجأة أو انتقاد خفيف."]
  },
  {
    slug: "refuse-vs-deny-vs-reject",
    category: "tricky-pairs",
    order: 3,
    title: "refuse vs deny vs reject",
    titleArabic: "الفرق بين refuse و deny و reject",
    summary: "'Refuse' = not willing to do/give. 'Deny' = say something isn't true. 'Reject' = decide not to accept.",
    summaryArabic: "'refuse' = لا يريد الفعل/الإعطاء. 'deny' = يقول إن شيئاً غير صحيح. 'reject' = يقرر عدم القبول.",
    words: [
      { word: "refuse", color: "blue", rule: "Decline to do or give something — a decision not to act", ruleArabic: "رفض الفعل أو الإعطاء — قرار بعدم التصرف", collocations: ["refuse to do", "refuse an offer", "refuse permission", "flatly refuse"] },
      { word: "deny", color: "red", rule: "Say that something is not true; contradict a claim", ruleArabic: "يقول إن شيئاً غير صحيح; ينفي ادعاءً", collocations: ["deny a claim", "deny doing something", "deny access", "deny involvement"] },
      { word: "reject", color: "purple", rule: "Decide not to accept something/someone; dismiss an idea or application", ruleArabic: "يقرر عدم القبول بشيء أو شخص; يرفض فكرة أو طلباً", collocations: ["reject an application", "reject an idea", "feel rejected", "reject a proposal"] }
    ],
    examples: [
      { sentence: "She refused to sign the contract.", sentenceArabic: "رفضت التوقيع على العقد.", focus: "refuse", note: "Not willing to do the action" },
      { sentence: "He denied stealing the money.", sentenceArabic: "نفى سرقة المال.", focus: "deny", note: "Saying the claim is false" },
      { sentence: "Her application was rejected.", sentenceArabic: "رُفض طلبها.", focus: "reject", note: "Decided not to accept it" }
    ],
    mistakes: [
      { wrong: "He denied to help us.", right: "He refused to help us.", noteArabic: "لم يرد الفعل → refuse. deny + فعل يستخدم الفعل + ing: denied stealing" },
      { wrong: "The committee refused her proposal.", right: "The committee rejected her proposal.", noteArabic: "عدم قبول مقترح → reject وليس refuse" }
    ],
    tips: ["refuse = won't do. deny = didn't do (claiming). reject = won't accept."],
    tipsArabic: ["refuse = لن يفعل. deny = لم يفعل (زاعماً). reject = لن يقبل."]
  },
  {
    slug: "agree-vs-accept-vs-approve",
    category: "tricky-pairs",
    order: 4,
    title: "agree vs accept vs approve",
    titleArabic: "الفرق بين agree و accept و approve",
    summary: "'Agree' = share the same opinion. 'Accept' = receive or say yes to. 'Approve' = officially sanction or think positively of.",
    summaryArabic: "'agree' = تشارك نفس الرأي. 'accept' = تستقبل أو توافق على. 'approve' = تُقر رسمياً أو تفكر بإيجابية.",
    words: [
      { word: "agree", color: "blue", rule: "To have the same opinion as someone; to consent to a plan", ruleArabic: "أن تشارك شخصاً نفس الرأي; أن توافق على خطة", collocations: ["agree with someone", "agree to do", "agree on a plan", "I totally agree"] },
      { word: "accept", color: "green", rule: "To receive something offered; to say yes to an invitation or offer", ruleArabic: "استقبال شيء مُقدَّم; قول نعم لدعوة أو عرض", collocations: ["accept an offer", "accept an invitation", "accept responsibility", "accept that..."] },
      { word: "approve", color: "purple", rule: "To officially authorize; to think favourably of something/someone", ruleArabic: "الإقرار الرسمي; التفكير بإيجابية في شيء أو شخص", collocations: ["approve a plan", "FDA approved", "approve of something", "parental approval"] }
    ],
    examples: [
      { sentence: "I agree with your analysis — it's very accurate.", sentenceArabic: "أتفق مع تحليلك — إنه دقيق جداً.", focus: "agree", note: "Same opinion" },
      { sentence: "She accepted the job offer after careful thought.", sentenceArabic: "قبلت عرض العمل بعد تفكير دقيق.", focus: "accept", note: "Received/said yes to an offer" },
      { sentence: "The board approved the new budget.", sentenceArabic: "أقرّ مجلس الإدارة الميزانية الجديدة.", focus: "approve", note: "Official authorization" }
    ],
    mistakes: [
      { wrong: "I accept with your opinion.", right: "I agree with your opinion.", noteArabic: "مشاركة الرأي → agree with. accept يأتي مع شيء مُقدَّم (offer, invitation)" },
      { wrong: "My parents don't agree of my choices.", right: "My parents don't approve of my choices.", noteArabic: "عدم الرضا عن شيء → don't approve of" }
    ],
    tips: ["agree with opinion. accept an offer/invitation. approve (of) officially or personally."],
    tipsArabic: ["agree مع رأي. accept عرض أو دعوة. approve (of) رسمياً أو شخصياً."]
  }
];

async function main() {
  console.log(`Seeding ${GROUPS.length} confusable groups...`);

  for (const group of GROUPS) {
    const { words, examples, mistakes, tips, tipsArabic, ...rest } = group;

    await prisma.confusableGroup.upsert({
      where: { slug: group.slug },
      update: {
        ...rest,
        words: JSON.stringify(words),
        examples: JSON.stringify(examples),
        mistakes: JSON.stringify(mistakes),
        tips: JSON.stringify(tips),
        tipsArabic: JSON.stringify(tipsArabic),
      },
      create: {
        ...rest,
        words: JSON.stringify(words),
        examples: JSON.stringify(examples),
        mistakes: JSON.stringify(mistakes),
        tips: JSON.stringify(tips),
        tipsArabic: JSON.stringify(tipsArabic),
      },
    });

    console.log(`  ✅ ${group.slug}`);
  }

  const total = await prisma.confusableGroup.count();
  console.log(`\n🎉 Done! Total confusable groups in DB: ${total}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
