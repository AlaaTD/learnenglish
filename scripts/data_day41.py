# -*- coding: utf-8 -*-
"""Data definition for Day 41: Friendship."""

vocab_day41 = [
    {
        "headword": "childhood friend",
        "pronunciation": "/ˈtʃaɪldhʊd frend/",
        "partOfSpeech": "noun",
        "definition": "A close companion known and loved since early childhood.",
        "example": "David is my childhood friend; we used to build treehouses together thirty years ago.",
        "translation": "صديق الطفولة",
        "exampleArabic": "ديفيد هو صديق طفولتي؛ اعتدنا على بناء بيوت الأشجار معاً قبل ثلاثين عاماً.",
        "relatedForms": ["childhood friends"],
        "collocations": ["old childhood friend", "beloved childhood friend"],
        "synonyms": ["early companion"],
        "antonyms": ["new acquaintance"],
        "tags": ["friendship", "people"]
    },
    {
        "headword": "lifelong friend",
        "pronunciation": "/ˈlaɪflɔːŋ frend/",
        "partOfSpeech": "noun",
        "definition": "A friend with whom a close personal bond has lasted for one's whole life.",
        "example": "Meeting Maria in primary school gifted me a lifelong friend who never left my side.",
        "translation": "صديق العمر / صديق مدى الحياة",
        "exampleArabic": "أهداني لقائي بماريا في المدرسة الابتدائية صديقة عمر لم تفارق جانبي أبداً.",
        "relatedForms": ["lifelong friends"],
        "collocations": ["cherish a lifelong friend", "become lifelong friends"],
        "synonyms": ["friend for life", "constant friend"],
        "antonyms": ["fair-weather friend"],
        "tags": ["friendship", "people"]
    },
    {
        "headword": "close acquaintance",
        "pronunciation": "/kloʊs əˈkweɪntəns/",
        "partOfSpeech": "noun",
        "definition": "A person whom one knows fairly well and interacts with regularly, but not as an intimate friend.",
        "example": "He is a close acquaintance from our running club, so we often chat after morning jogs.",
        "translation": "معرفة وثيقة (شخص تعرفه جيداً دون أن يكون صديقاً مقرباً)",
        "exampleArabic": "إنه معرفة وثيقة من نادي الجري لدينا، لذا غالباً ما نتجاذب أطراف الحديث بعد الجري الصباحي.",
        "relatedForms": ["close acquaintances"],
        "collocations": ["remain a close acquaintance", "casual or close acquaintance"],
        "synonyms": ["familiar associate"],
        "antonyms": ["stranger", "intimate friend"],
        "tags": ["relationships", "people"]
    },
    {
        "headword": "confidant",
        "pronunciation": "/ˈkɑːnfɪdænt/",
        "partOfSpeech": "noun",
        "definition": "A person with whom one shares personal secrets or private matters, trusting them not to repeat them.",
        "example": "My older sister has always been my most trusted confidant in times of emotional distress.",
        "translation": "مستودع الأسرار / الصديق المخلص المؤتمن",
        "exampleArabic": "كانت أختي الكبرى دائماً مستودع أسراري الأكثر موثوقية في أوقات الضيق العاطفي.",
        "relatedForms": ["confidants", "confidante"],
        "collocations": ["trusted confidant", "act as a confidant"],
        "synonyms": ["intimate friend", "trusted advisor"],
        "antonyms": [],
        "tags": ["friendship", "trust"]
    },
    {
        "headword": "soulmate",
        "pronunciation": "/ˈsoʊlmeɪt/",
        "partOfSpeech": "noun",
        "definition": "A person ideally suited to another by temperament, mutual affinity, deep understanding, or love.",
        "example": "They connected so deeply on an intellectual level that they considered each other platonic soulmates.",
        "translation": "توأم الروح",
        "exampleArabic": "تواصلا بعمق على المستوى الفكري لدرجة أنهما اعتبرا بعضهما توأمي روح.",
        "relatedForms": ["soulmates"],
        "collocations": ["find your soulmate", "platonic soulmate"],
        "synonyms": ["kindred spirit", "twin flame"],
        "antonyms": [],
        "tags": ["relationships", "emotions"]
    },
    {
        "headword": "pal",
        "pronunciation": "/pæl/",
        "partOfSpeech": "noun",
        "definition": "An informal term for a close friend or companion.",
        "example": "I am going to grab lunch with a few college pals this Saturday afternoon.",
        "translation": "صاحب / رفيق (بشكل غير رسمي)",
        "exampleArabic": "سأذهب لتناول الغداء مع عدد من رفقاء الكلية بعد ظهر يوم السبت هذا.",
        "relatedForms": ["pals"],
        "collocations": ["old pal", "best pal", "pen pal"],
        "synonyms": ["mate", "chum", "buddy"],
        "antonyms": ["rival"],
        "tags": ["informal", "friendship"]
    },
    {
        "headword": "buddy",
        "pronunciation": "/ˈbʌdi/",
        "partOfSpeech": "noun",
        "definition": "A close informal friend, partner, or comrade.",
        "example": "He and his gym buddy push each other to lift heavier weights every workout.",
        "translation": "صديق مقرب / زميل درب (بَدي)",
        "exampleArabic": "يشجع هو وصديق صالة الألعاب الرياضية بعضهما البعض على رفع أوزان أثقل في كل تمرين.",
        "relatedForms": ["buddies"],
        "collocations": ["old buddy", "workout buddy", "travel buddy"],
        "synonyms": ["pal", "mate", "friend"],
        "antonyms": [],
        "tags": ["informal", "friendship"]
    },
    {
        "headword": "chum",
        "pronunciation": "/tʃʌm/",
        "partOfSpeech": "noun",
        "definition": "A warm and affectionate informal term for an intimate close friend.",
        "example": "Grandfather loved recounting tales of daring adventures with his childhood chums.",
        "translation": "رفيق حميم / خِلّ وفي",
        "exampleArabic": "أحب جدي رواية حكايات المغامرات الجريئة مع رفقاء طفولته الحميمين.",
        "relatedForms": ["chums"],
        "collocations": ["old chum", "school chum"],
        "synonyms": ["bosom buddy", "cronie"],
        "antonyms": [],
        "tags": ["informal", "friendship"]
    },
    {
        "headword": "circle of friends",
        "pronunciation": "/ˈsɜːrkəl əv frendz/",
        "partOfSpeech": "noun",
        "definition": "A group of interconnected people who know and socialize regularly with one another.",
        "example": "Moving to a new city forced him to step outside his comfort zone and build a fresh circle of friends.",
        "translation": "دائرة الأصدقاء / شلة الأصحاب",
        "exampleArabic": "أجبره الانتقال إلى مدينة جديدة على الخروج من منطقة راحته وبناء دائرة أصدقاء جديدة.",
        "relatedForms": ["circles of friends"],
        "collocations": ["wide circle of friends", "tight-knit circle of friends"],
        "synonyms": ["social circle", "friend group"],
        "antonyms": [],
        "tags": ["social", "friendship"]
    },
    {
        "headword": "playmate",
        "pronunciation": "/ˈpleɪmeɪt/",
        "partOfSpeech": "noun",
        "definition": "A childhood friend or companion with whom a child plays games and toys.",
        "example": "The sandbox in the park was where little Tommy met his very first playmate.",
        "translation": "رفيق اللعب في الطفولة",
        "exampleArabic": "كان صندوق الرمل في الحديقة هو المكان الذي التقى فيه تومي الصغير برفيق لعبه الأول.",
        "relatedForms": ["playmates"],
        "collocations": ["childhood playmate", "constant playmate"],
        "synonyms": ["play companion"],
        "antonyms": [],
        "tags": ["childhood", "friendship"]
    },
    {
        "headword": "companionship",
        "pronunciation": "/kəmˈpænjənʃɪp/",
        "partOfSpeech": "noun",
        "definition": "The pleasant feeling of fellowship, friendship, and having someone to spend time with.",
        "example": "Elderly individuals often adopt affectionate pets for comforting daily companionship.",
        "translation": "الصحبة والأنس والرفقة الطيبة",
        "exampleArabic": "غالباً ما يتبنى كبار السن حيوانات أليفة حنونة للاستمتاع بصحبة يومية مريحة.",
        "relatedForms": ["companion"],
        "collocations": ["enjoy companionship", "provide companionship"],
        "synonyms": ["fellowship", "togetherness", "company"],
        "antonyms": ["solitude", "isolation"],
        "tags": ["values", "relationships"]
    },
    {
        "headword": "unconditional support",
        "pronunciation": "/ˌʌnkənˈdɪʃənl səˈpɔːrt/",
        "partOfSpeech": "noun",
        "definition": "Total and unwavering emotional, moral, or practical backing without any strings or prerequisites attached.",
        "example": "True friends provide unconditional support during times of grief, failure, and career transition.",
        "translation": "الدعم غير المشروط والمساندة المطلقة",
        "exampleArabic": "يقدم الأصدقاء الحقيقيون دعماً غير مشروط في أوقات الحزن والفشل والتحولات المهنية.",
        "relatedForms": [],
        "collocations": ["offer unconditional support", "rely on unconditional support"],
        "synonyms": ["unwavering backing", "steadfast loyalty"],
        "antonyms": ["conditional help"],
        "tags": ["support", "values"]
    },
    {
        "headword": "loyalty",
        "pronunciation": "/ˈlɔɪəlti/",
        "partOfSpeech": "noun",
        "definition": "The quality of staying firm and faithful in one's friendship, duty, or allegiance.",
        "example": "Her steadfast loyalty never wavered even when rumors circulated about her best friend.",
        "translation": "الوفاء والولاء والإخلاص",
        "exampleArabic": "لم يتزعزع وفاؤها الثابت أبداً حتى عندما انتشرت الشائعات حول صديقتها المفضلة.",
        "relatedForms": ["loyal", "loyally"],
        "collocations": ["fierce loyalty", "prove loyalty", "unwavering loyalty"],
        "synonyms": ["faithfulness", "devotion", "allegiance"],
        "antonyms": ["disloyalty", "treachery"],
        "tags": ["values", "virtues"]
    },
    {
        "headword": "trustworthiness",
        "pronunciation": "/ˈtrʌstwɜːrðinəs/",
        "partOfSpeech": "noun",
        "definition": "The ability to be relied on as honest, truthful, dependable, and deserving of trust.",
        "example": "In choosing a confidant, honesty and absolute trustworthiness are the most vital criteria.",
        "translation": "الجدارة بالثقة والأمانة",
        "exampleArabic": "عند اختيار مستودع لأسرارك، يعد الصدق والجدارة المطلقة بالثقة أهم المعايير على الإطلاق.",
        "relatedForms": ["trustworthy"],
        "collocations": ["demonstrate trustworthiness", "reputation for trustworthiness"],
        "synonyms": ["reliability", "integrity", "faithfulness"],
        "antonyms": ["unreliability", "deceitfulness"],
        "tags": ["trust", "virtues"]
    },
    {
        "headword": "dependability",
        "pronunciation": "/dɪˌpendəˈbɪləti/",
        "partOfSpeech": "noun",
        "definition": "The quality of being trustworthy, consistent, and reliable in keeping promises and showing up.",
        "example": "What I admire most about Sarah is her dependability; she always arrives when she promises to.",
        "translation": "الاعتمادية والقدرة على الوفاء بالوعود",
        "exampleArabic": "أكثر ما يعجبني في سارة هو اعتماديتها العالية؛ فهي تحضر دائماً عندما تعد بذلك.",
        "relatedForms": ["dependable"],
        "collocations": ["proven dependability", "admire dependability"],
        "synonyms": ["reliability", "consistency", "steadiness"],
        "antonyms": ["unreliability", "fickleness"],
        "tags": ["values", "character"]
    },
    {
        "headword": "empathy",
        "pronunciation": "/ˈempəθi/",
        "partOfSpeech": "noun",
        "definition": "The ability to understand and share the feelings, perspective, and emotions of another person.",
        "example": "Listening with genuine empathy helps ease a friend's anxiety without offering unasked advice.",
        "translation": "التعاطف الوجداني والشعور بالآخر",
        "exampleArabic": "يساعد الاستماع بتعاطف وجداني صادق على تخفيف قلق الصديق دون تقديم نصائح غير مطلوبة.",
        "relatedForms": ["empathize", "empathetic"],
        "collocations": ["show empathy", "feel empathy", "deep empathy"],
        "synonyms": ["compassion", "understanding", "sensitivity"],
        "antonyms": ["apathy", "callousness"],
        "tags": ["emotions", "interpersonal"]
    },
    {
        "headword": "mutual understanding",
        "pronunciation": "/ˈmjuːtʃuəl ˌʌndərˈstændɪŋ/",
        "partOfSpeech": "noun",
        "definition": "A shared state of sympathy, harmony, and comprehension existing between two people.",
        "example": "Years of shared laughter created a quiet mutual understanding that required few words.",
        "translation": "التفاهم المتبادل والانسجام المشترك",
        "exampleArabic": "خلقت سنوات من الضحك المشترك تفاهماً متبادلاً هادئاً لم يتطلب سوى القليل من الكلمات.",
        "relatedForms": [],
        "collocations": ["reach mutual understanding", "deep mutual understanding"],
        "synonyms": ["rapport", "harmony", "sympathy"],
        "antonyms": ["misunderstanding"],
        "tags": ["relationships"]
    },
    {
        "headword": "shared secret",
        "pronunciation": "/ʃerd ˈsiːkrət/",
        "partOfSpeech": "noun",
        "definition": "Private information or personal vulnerability known only to an intimate pair of friends.",
        "example": "A shared secret from high school sealed their unbreakable bond across the decades.",
        "translation": "سر مشترك بين صديقين",
        "exampleArabic": "عزز سر مشترك من المدرسة الثانوية رابطتهما المتينة التي لا تنفصم عبر العقود.",
        "relatedForms": ["shared secrets"],
        "collocations": ["keep a shared secret", "whisper a shared secret"],
        "synonyms": ["mutual confidence"],
        "antonyms": ["public knowledge"],
        "tags": ["trust", "friendship"]
    },
    {
        "headword": "unbreakable bond",
        "pronunciation": "/ʌnˈbreɪkəbəl bɑːnd/",
        "partOfSpeech": "noun",
        "definition": "A deep and permanent emotional connection that cannot be severed by time, distance, or hardship.",
        "example": "Surviving hardship together forged an unbreakable bond between the two soldiers.",
        "translation": "رابطة متينة لا تنفصم / وثاق لا ينقطع",
        "exampleArabic": "أدى تجاوز الصعاب معاً إلى صياغة رابطة متينة لا تنفصم بين الجنديين.",
        "relatedForms": ["unbreakable bonds"],
        "collocations": ["forge an unbreakable bond", "share an unbreakable bond"],
        "synonyms": ["indissoluble tie", "ironclad connection"],
        "antonyms": ["fragile connection"],
        "tags": ["relationships", "strength"]
    },
    {
        "headword": "warmhearted",
        "pronunciation": "/ˌwɔːrmˈhɑːrtɪd/",
        "partOfSpeech": "adjective",
        "definition": "Sympathetic, generous, kind, and affectionate in nature.",
        "example": "She is such a warmhearted person; she welcomes every newcomer with open arms and a smile.",
        "translation": "طيّب القلب / دافئ المشاعر حنون",
        "exampleArabic": "إنها إنسانة طيبة القلب للغاية؛ ترحب بكل قادم جديد بذراعين مفتوحتين وابتسامة.",
        "relatedForms": ["warmheartedness"],
        "collocations": ["warmhearted friend", "warmhearted gesture"],
        "synonyms": ["kindhearted", "tenderhearted", "benevolent"],
        "antonyms": ["coldhearted", "callous"],
        "tags": ["personality", "kindness"]
    },
    {
        "headword": "hang out",
        "pronunciation": "/hæŋ aʊt/",
        "partOfSpeech": "phrasal verb",
        "definition": "To spend time relaxing and socializing informally with friends.",
        "example": "We used to hang out at the local coffee shop every Friday after school.",
        "translation": "يقضي وقتاً ممتعاً ويتسكع مع الأصدقاء",
        "exampleArabic": "اعتدنا قضاء الوقت معاً في المقهى المحلي كل يوم جمعة بعد المدرسة.",
        "relatedForms": ["hung out", "hanging out"],
        "collocations": ["hang out together", "hang out at the mall"],
        "synonyms": ["spend time", "chill out", "socialize"],
        "antonyms": [],
        "tags": ["informal", "phrasal verbs"]
    },
    {
        "headword": "get back in touch",
        "pronunciation": "/ɡet bæk ɪn tʌtʃ/",
        "partOfSpeech": "phrase",
        "definition": "To resume communication with someone after a prolonged period of silence or absence.",
        "example": "I was thrilled when my college roommate decided to get back in touch after ten years abroad.",
        "translation": "يعاود التواصل ويستأنف الصلة",
        "exampleArabic": "غمرتني السعادة عندما قرر زميل سكني الجامعي معاودة التواصل بعد عشر سنوات في الخارج.",
        "relatedForms": ["got back in touch", "getting back in touch"],
        "collocations": ["finally get back in touch", "want to get back in touch"],
        "synonyms": ["reconnect", "resume contact"],
        "antonyms": ["lose touch"],
        "tags": ["actions", "communication"]
    },
    {
        "headword": "catch up with",
        "pronunciation": "/kætʃ ʌp wɪð/",
        "partOfSpeech": "phrasal verb",
        "definition": "To talk with someone you have not seen recently to discover what has happened in their life.",
        "example": "Let's meet for a hot cup of tea to catch up with all your latest travel news.",
        "translation": "يلتقي ليتدارك الأخبار ويطمئن على الأحوال",
        "exampleArabic": "دعنا نلتقي لتناول كوب شاي ساخن لنتدارك الأخبار ونطلع على آخر مستجدات رحلاتك.",
        "relatedForms": ["caught up with", "catching up with"],
        "collocations": ["catch up with old friends", "catch up with news"],
        "synonyms": ["exchange news", "reacquaint"],
        "antonyms": [],
        "tags": ["phrasal verbs", "social"]
    },
    {
        "headword": "drift apart",
        "pronunciation": "/drɪft əˈpɑːrt/",
        "partOfSpeech": "phrasal verb",
        "definition": "To gradually become less close and friendly over time as lives and priorities diverge.",
        "example": "After graduation, different career choices and distance caused the two friends to drift apart slowly.",
        "translation": "يتباعدان تدريجياً وتفتر العلاقة مع الوقت",
        "exampleArabic": "بعد التخرج، تسببت الخيارات المهنية المختلفة والمسافات في تباعد الصديقين ببطء.",
        "relatedForms": ["drifted apart", "drifting apart"],
        "collocations": ["slowly drift apart", "begin to drift apart"],
        "synonyms": ["grow apart", "estrange slowly"],
        "antonyms": ["grow closer"],
        "tags": ["phrasal verbs", "change"]
    },
    {
        "headword": "reminisce about",
        "pronunciation": "/ˌremɪˈnɪs əˈbaʊt/",
        "partOfSpeech": "phrasal verb",
        "definition": "To indulge in enjoyable recollection of past events and nostalgic memories.",
        "example": "The old classmates sat together by the fireplace to reminisce about their high school adventures.",
        "translation": "يسترجع الذكريات بحنين وشوق",
        "exampleArabic": "جلس زملاء الدراسة القدامى معاً بجانب المدفأة لاسترجاع ذكريات مغامراتهم في المدرسة الثانوية.",
        "relatedForms": ["reminisced about", "reminiscing about"],
        "collocations": ["reminisce about the past", "reminisce about youth"],
        "synonyms": ["look back on", "recall fondly"],
        "antonyms": ["forget"],
        "tags": ["memory", "actions"]
    },
    {
        "headword": "confide in",
        "pronunciation": "/kənˈfaɪd ɪn/",
        "partOfSpeech": "phrasal verb",
        "definition": "To tell someone personal things because you trust that they will not tell anyone else.",
        "example": "Whenever John feels overwhelmed, he knows he can confide in his brother without judgment.",
        "translation": "يبوح بأسراره لـ / يفضفض لـ",
        "exampleArabic": "كلما شعر جون بالإرهاق، يعلم أنه يستطيع البوح بأسراره لأخيه دون خوف من الأحكام المسبقة.",
        "relatedForms": ["confided in", "confiding in"],
        "collocations": ["confide in a friend", "confide in a parent"],
        "synonyms": ["open up to", "unburden oneself to"],
        "antonyms": ["hide secrets from"],
        "tags": ["trust", "actions"]
    },
    {
        "headword": "lean on",
        "pronunciation": "/liːn ɑːn/",
        "partOfSpeech": "phrasal verb",
        "definition": "To depend on someone for emotional support, guidance, or encouragement during tough times.",
        "example": "During my career crisis, I needed a dependable friend to lean on for perspective.",
        "translation": "يتكئ عليه عاطفياً / يستند إلى دعمه",
        "exampleArabic": "أثناء أزمتي المهنية، احتجت إلى صديق يُعتمد عليه للاستناد إلى دعمه ورؤيته.",
        "relatedForms": ["leaned on", "leaning on"],
        "collocations": ["lean on a friend", "someone to lean on"],
        "synonyms": ["rely on", "count on", "depend upon"],
        "antonyms": [],
        "tags": ["support", "actions"]
    },
    {
        "headword": "stand by",
        "pronunciation": "/stænd baɪ/",
        "partOfSpeech": "phrasal verb",
        "definition": "To remain loyal to someone and support them, especially in difficult circumstances.",
        "example": "True friends stand by each other through personal hardship and professional setbacks.",
        "translation": "يقف بجانب فلان ويسانده في المحن",
        "exampleArabic": "يقف الأصدقاء الحقيقيون بجانب بعضهم البعض في المحن الشخصية والانتكاسات المهنية.",
        "relatedForms": ["stood by", "standing by"],
        "collocations": ["stand by a friend", "stand by someone through thick and thin"],
        "synonyms": ["support", "back up", "stick with"],
        "antonyms": ["abandon", "desert"],
        "tags": ["loyalty", "actions"]
    },
    {
        "headword": "share memories",
        "pronunciation": "/ʃer ˈmeməriz/",
        "partOfSpeech": "phrase",
        "definition": "To recount and discuss common past experiences and nostalgic moments together.",
        "example": "Family reunions are a wonderful time to share memories and celebrate family heritage.",
        "translation": "يتشارك الذكريات الجميلة",
        "exampleArabic": "تعد لمّات العائلة وقتاً رائعاً لتشارك الذكريات والاحتفاء بالتراث العائلي.",
        "relatedForms": ["shared memories", "sharing memories"],
        "collocations": ["fondly share memories", "gather to share memories"],
        "synonyms": ["recall the past", "exchange stories"],
        "antonyms": [],
        "tags": ["memory", "actions"]
    },
    {
        "headword": "laugh together",
        "pronunciation": "/læf təˈɡeðər/",
        "partOfSpeech": "phrase",
        "definition": "To experience amusement, joy, and humor in each other's physical or digital company.",
        "example": "There is nothing more healing than meeting an old friend to laugh together about silly mistakes.",
        "translation": "يضحكان معاً من القلب",
        "exampleArabic": "لا يوجد شيء يبعث على الشفاء أكثر من لقاء صديق قديم للضحك معاً على أخطاء الماضي البسيطة.",
        "relatedForms": ["laughed together", "laughing together"],
        "collocations": ["laugh together often", "laugh together until tears come"],
        "synonyms": ["share laughter"],
        "antonyms": [],
        "tags": ["joy", "actions"]
    },
    {
        "headword": "form a bond",
        "pronunciation": "/fɔːrm ə bɑːnd/",
        "partOfSpeech": "phrase",
        "definition": "To establish a close, enduring relationship based on shared values or experiences.",
        "example": "The students formed a bond while working late nights in the engineering laboratory.",
        "translation": "يبني علاقة متينة ورابطة وثيقة",
        "exampleArabic": "بنى الطلاب رابطة وثيقة أثناء عملهم في ساعات الليل المتأخرة بمختبر الهندسة.",
        "relatedForms": ["formed a bond", "forming a bond"],
        "collocations": ["quickly form a bond", "form a bond of friendship"],
        "synonyms": ["forge a connection", "build rapport"],
        "antonyms": ["grow distant"],
        "tags": ["relationships", "actions"]
    },
    {
        "headword": "test of time",
        "pronunciation": "/test əv taɪm/",
        "partOfSpeech": "idiom",
        "definition": "The ability of something to remain strong, valuable, or intact over an extended period of years.",
        "example": "Their friendship stood the test of time, lasting through decades of geographic relocation.",
        "translation": "اختبار الزمن وتقلبات الأيام",
        "exampleArabic": "صمدت صداقتهما في وجه اختبار الزمن، واستمرت عبر عقود من الانتقال الجغرافي.",
        "relatedForms": [],
        "collocations": ["stand the test of time", "pass the test of time"],
        "synonyms": ["endurance", "lasting proof"],
        "antonyms": [],
        "tags": ["time", "idioms"]
    },
    {
        "headword": "enduring friendship",
        "pronunciation": "/ɪnˈdʊrɪŋ ˈfrendʃɪp/",
        "partOfSpeech": "noun",
        "definition": "A friendship that continues to exist in a strong, steady state over a very long duration.",
        "example": "Their enduring friendship inspired everyone in their social circle with its quiet devotion.",
        "translation": "صداقة وطيدة تدوم وتصمد عبر السنين",
        "exampleArabic": "ألهمت صداقتهما الوطيدة كل فرد في دائرتهما الاجتماعية بوفائها الهادئ.",
        "relatedForms": ["enduring friendships"],
        "collocations": ["celebrate an enduring friendship", "testament to an enduring friendship"],
        "synonyms": ["lasting friendship", "abiding bond"],
        "antonyms": ["transient acquaintance"],
        "tags": ["friendship", "longevity"]
    },
    {
        "headword": "lifelong bond",
        "pronunciation": "/ˈlaɪflɔːŋ bɑːnd/",
        "partOfSpeech": "noun",
        "definition": "An emotional tie that connects individuals for their entire lifespans without breaking.",
        "example": "Growing up as neighbors created a lifelong bond that no subsequent move could dissolve.",
        "translation": "وثاق مدى الحياة / رابطة العمر",
        "exampleArabic": "خلقت نشأتهما كجيران وثاقاً مدى الحياة لم تستطع أي خطوة انتقال لاحقة أن تذيبه.",
        "relatedForms": ["lifelong bonds"],
        "collocations": ["share a lifelong bond", "forge a lifelong bond"],
        "synonyms": ["permanent tie", "eternal friendship"],
        "antonyms": [],
        "tags": ["friendship", "longevity"]
    },
    {
        "headword": "nostalgic memory",
        "pronunciation": "/nɑːˈstældʒɪk ˈmeməri/",
        "partOfSpeech": "noun",
        "definition": "A sentimental recollection of happiness experienced in a past time or place.",
        "example": "Flipping through their school yearbook stirred up many a warm nostalgic memory.",
        "translation": "ذكرى مفعمة بالحنين والنوستالجيا",
        "exampleArabic": "أثار تصفح كتاب التخرج السنوي العديد من الذكريات الدافئة المفعمة بالحنين.",
        "relatedForms": ["nostalgic memories"],
        "collocations": ["evoke a nostalgic memory", "cherish a nostalgic memory"],
        "synonyms": ["fond recollection"],
        "antonyms": [],
        "tags": ["memory", "emotions"]
    },
    {
        "headword": "lost touch",
        "pronunciation": "/lɔːst tʌtʃ/",
        "partOfSpeech": "phrase",
        "definition": "Ceased to have regular contact or communication with someone over time.",
        "example": "We were inseparable during college, but we unfortunately lost touch after moving abroad.",
        "translation": "انقطعت أخباره وانقطع التواصل معه",
        "exampleArabic": "كنا لا نفترق أثناء دراستنا بالكلية، لكن للأسف انقطع التواصل بيننا بعد الانتقال إلى الخارج.",
        "relatedForms": ["lose touch", "losing touch"],
        "collocations": ["have lost touch", "gradually lost touch"],
        "synonyms": ["drifted apart", "stopped communicating"],
        "antonyms": ["stayed in touch"],
        "tags": ["change", "communication"]
    },
    {
        "headword": "reach back out",
        "pronunciation": "/riːtʃ bæk aʊt/",
        "partOfSpeech": "phrase",
        "definition": "To initiate contact again after an extended silence or following a previous message.",
        "example": "I decided to reach back out to my former mentor to thank her for her early guidance.",
        "translation": "يعاود التواصل والمبادرة بالاتصال ثانية",
        "exampleArabic": "قررت معاودة التواصل مع مرشدتي السابقة لشكرها على توجيهها المبكر لي.",
        "relatedForms": ["reached back out", "reaching back out"],
        "collocations": ["reach back out to someone", "hesitant to reach back out"],
        "synonyms": ["contact again", "follow up"],
        "antonyms": [],
        "tags": ["actions", "communication"]
    },
    {
        "headword": "rekindle friendship",
        "pronunciation": "/riːˈkɪndl ˈfrendʃɪp/",
        "partOfSpeech": "phrase",
        "definition": "To revive or re-establish a warm friendly relationship that had grown dormant or distant.",
        "example": "Meeting at their twenty-year reunion allowed the estranged classmates to rekindle friendship.",
        "translation": "يُحيي الصداقة ويعيد إشعال دفئها القديم",
        "exampleArabic": "أتاح اللقاء في حفل لمّ الشمل بعد عشرين عاماً لزملاء الدراسة المنقطعين إحياء صداقتهم القديمة.",
        "relatedForms": ["rekindled friendship", "rekindling friendship"],
        "collocations": ["rekindle an old friendship", "effort to rekindle friendship"],
        "synonyms": ["revive friendship", "restore connection"],
        "antonyms": ["sever friendship"],
        "tags": ["healing", "friendship"]
    },
    {
        "headword": "grow closer",
        "pronunciation": "/ɡroʊ ˈkloʊsər/",
        "partOfSpeech": "phrase",
        "definition": "To become progressively more intimate, trusting, and united over time.",
        "example": "Sharing honest vulnerability allowed the two roommates to grow closer month after month.",
        "translation": "تزداد العلاقة بينهما قرباً وحميمية",
        "exampleArabic": "أتاحت مشاركة المشاعر الصادقة لزميلتي السكن زيادة القرب والترابط شهراً بعد شهر.",
        "relatedForms": ["grew closer", "growing closer"],
        "collocations": ["grow closer over time", "continue to grow closer"],
        "synonyms": ["deepen connection", "bond tightly"],
        "antonyms": ["drift apart"],
        "tags": ["relationships", "growth"]
    },
    {
        "headword": "mutual affection",
        "pronunciation": "/ˈmjuːtʃuəl əˈfekʃən/",
        "partOfSpeech": "noun",
        "definition": "A shared feeling of warmth, caring, fondness, and goodwill between two people.",
        "example": "Their genuine mutual affection was evident to anyone who saw them greeting one another.",
        "translation": "المودة والمحبة المتبادلة",
        "exampleArabic": "كانت مودتهما ومحبتهما المتبادلة واضحة لأي شخص يراهما يتبادلان التحية.",
        "relatedForms": [],
        "collocations": ["feel mutual affection", "display mutual affection"],
        "synonyms": ["shared fondness", "reciprocal love"],
        "antonyms": ["mutual hostility"],
        "tags": ["emotions", "relationships"]
    },
    {
        "headword": "thick as thieves",
        "pronunciation": "/θɪk æz θiːvz/",
        "partOfSpeech": "idiom",
        "definition": "Extremely close, intimate, and sharing private confidences.",
        "example": "Those two cousins used to be as thick as thieves, constantly whispering and laughing together.",
        "translation": "سمن على عسل / رفيقان حميمان لا يفترقان",
        "exampleArabic": "كان هذان ابنا العم رفيقين حميمين لا يفترقان، يتهامسان ويضحكان معاً طوال الوقت.",
        "relatedForms": [],
        "collocations": ["as thick as thieves", "remain thick as thieves"],
        "synonyms": ["inseparable", "extremely close"],
        "antonyms": ["distant", "hostile"],
        "tags": ["idioms", "closeness"]
    },
    {
        "headword": "fair-weather friend",
        "pronunciation": "/ˌfer ˈweðər frend/",
        "partOfSpeech": "noun",
        "definition": "A person who is friendly only when things are going well, and disappears in adversity.",
        "example": "When he lost his job, he discovered who his true allies were versus who was merely a fair-weather friend.",
        "translation": "صديق المصلحة والرخاء (الذي يختفي في الشدائد)",
        "exampleArabic": "عندما فقد وظيفته، اكتشف من هم حلفاؤه الحقيقيون ومن كان مجرد صديق رخاء ومصلحة.",
        "relatedForms": ["fair-weather friends"],
        "collocations": ["unmask a fair-weather friend", "beware of fair-weather friends"],
        "synonyms": ["opportunist", "unreliable companion"],
        "antonyms": ["lifelong friend", "steadfast ally"],
        "tags": ["friendship", "character"]
    },
    {
        "headword": "through thick and thin",
        "pronunciation": "/θruː θɪk ænd θɪn/",
        "partOfSpeech": "idiom",
        "definition": "Under all conditions, no matter how challenging, painful, or difficult.",
        "example": "She stood by her childhood companion through thick and thin, through illness and prosperity.",
        "translation": "في السراء والضراء / على الحلوة والمرة",
        "exampleArabic": "وقفت بجانب رفيقة طفولتها في السراء والضراء، في المرض والرخاء.",
        "relatedForms": [],
        "collocations": ["stay together through thick and thin", "loyal through thick and thin"],
        "synonyms": ["in good times and bad", "steadfastly"],
        "antonyms": [],
        "tags": ["loyalty", "idioms"]
    },
    {
        "headword": "bosom friend",
        "pronunciation": "/ˈbʊzəm frend/",
        "partOfSpeech": "noun",
        "definition": "A very close and dear intimate friend.",
        "example": "Anne Shirley famously longed for a bosom friend with whom she could share her wildest dreams.",
        "translation": "الخل الوفي / الصديق المقرب الحميم جداً",
        "exampleArabic": "اشتهرت آن شيرلي بتوقها لوجود خِلّ وفي مقرب تشاركه أبعد أحلامها.",
        "relatedForms": ["bosom friends"],
        "collocations": ["find a bosom friend", "confide in a bosom friend"],
        "synonyms": ["intimate friend", "soulmate"],
        "antonyms": ["stranger"],
        "tags": ["friendship", "literary"]
    },
    {
        "headword": "kindred spirit",
        "pronunciation": "/ˈkɪndrəd ˈspɪrɪt/",
        "partOfSpeech": "noun",
        "definition": "A person whose interests, beliefs, or attitudes are similar to one's own.",
        "example": "From our very first conversation about astronomy, I knew I had found a kindred spirit in Elena.",
        "translation": "روح متآلفة وقريبة / شخص شبيه في الفكر والشعور",
        "exampleArabic": "منذ محادثتنا الأولى حول علم الفلك، علمت أنني وجدت روحاً متآلفة وقريبة في إيلينا.",
        "relatedForms": ["kindred spirits"],
        "collocations": ["meet a kindred spirit", "recognize a kindred spirit"],
        "synonyms": ["like-minded soul", "soulmate"],
        "antonyms": [],
        "tags": ["relationships", "affinity"]
    },
    {
        "headword": "sympathetic ear",
        "pronunciation": "/ˌsɪmpəˈθetɪk ɪr/",
        "partOfSpeech": "noun",
        "definition": "A willing and compassionate listener who offers understanding without judgment.",
        "example": "When work stress mounted, having a coworker who lent a sympathetic ear made all the difference.",
        "translation": "أذن صاغية ومتعاطفة",
        "exampleArabic": "عندما تراكمت ضغوط العمل، كان لوجود زميل يعير أذناً صاغية ومتعاطفة بالغ الأثر والفرق.",
        "relatedForms": [],
        "collocations": ["lend a sympathetic ear", "offer a sympathetic ear"],
        "synonyms": ["compassionate listener"],
        "antonyms": ["deaf ear"],
        "tags": ["support", "empathy"]
    },
    {
        "headword": "heart-to-heart",
        "pronunciation": "/ˌhɑːrt tə ˈhɑːrt/",
        "partOfSpeech": "noun",
        "definition": "A candid, intimate, and completely honest personal conversation between two people.",
        "example": "A late-night heart-to-heart resolved the unspoken tension between the two longtime companions.",
        "translation": "حديث من القلب إلى القلب بكل صراحة ودفء",
        "exampleArabic": "حل حديث متأخر من القلب إلى القلب التوتر غير المعلن بين الرفيقين القديمين.",
        "relatedForms": ["heart-to-hearts"],
        "collocations": ["have a heart-to-heart", "heart-to-heart conversation"],
        "synonyms": ["candid chat", "intimate conversation"],
        "antonyms": ["superficial small talk"],
        "tags": ["communication", "closeness"]
    },
    {
        "headword": "shoulder to cry on",
        "pronunciation": "/ˈʃoʊldər tuː kraɪ ɑːn/",
        "partOfSpeech": "phrase",
        "definition": "Someone who listens sympathetically to your problems and offers comfort in sadness.",
        "example": "When her engagement ended, her best friend was always there to offer a shoulder to cry on.",
        "translation": "سند ومواساة في الحزن (كتف تبكي عليه)",
        "exampleArabic": "عندما انتهت خطوبتها، كانت صديقتها المفضلة موجودة دائماً لتقدم لها سنداً ومواساة.",
        "relatedForms": [],
        "collocations": ["be a shoulder to cry on", "need a shoulder to cry on"],
        "synonyms": ["comforting presence", "sympathetic supporter"],
        "antonyms": [],
        "tags": ["comfort", "emotions"]
    },
    {
        "headword": "inseparable",
        "pronunciation": "/ɪnˈsepərəbəl/",
        "partOfSpeech": "adjective",
        "definition": "Unable or extremely unwilling to be separated; always seen together.",
        "example": "Throughout their university years, the two roommates were virtually inseparable.",
        "translation": "لا يفترقان أبداً / ملازمان لبعضهما",
        "exampleArabic": "طوال سنوات دراستهما الجامعية، كان رفيقا السكن عملياً لا يفترقان أبداً.",
        "relatedForms": ["inseparably"],
        "collocations": ["virtually inseparable", "inseparable friends"],
        "synonyms": ["attached", "indivisible", "thick as thieves"],
        "antonyms": ["estranged", "separated"],
        "tags": ["closeness", "friendship"]
    },
    {
        "headword": "cherish friendship",
        "pronunciation": "/ˈtʃerɪʃ ˈfrendʃɪp/",
        "partOfSpeech": "phrase",
        "definition": "To protect, value, and hold dear the bond of companionship with deep gratitude.",
        "example": "As we grow older, we learn to cherish friendship as life's most precious treasure.",
        "translation": "يُقدّر الصداقة ويصونها بعزة ومحبة",
        "exampleArabic": "مع تقدمنا في العمر، نتعلم تقدير الصداقة والاعتزاز بها كأثمن كنوز الحياة.",
        "relatedForms": ["cherished friendship", "cherishing friendship"],
        "collocations": ["deeply cherish friendship", "cherish lifelong friendship"],
        "synonyms": ["treasure companionship", "value friends"],
        "antonyms": ["neglect friendship"],
        "tags": ["values", "actions"]
    }
]

grammar_day41 = [
    {
        "title": "Used to",
        "explanation": "We use 'used to + base verb' to talk about past habits, routines, or states that were true in the past but are NO LONGER true today. For negatives, we use 'didn't use to + base verb' (note 'use', not 'used'). For questions, we use 'Did you use to + base verb?'. In friendship conversations, it is the primary structure for reminiscing about childhood and comparing past dynamics to the present.",
        "explanationArabic": "نستخدم 'used to + الفعل الأساسي' للحديث عن عادات أو حالات أو روتين كان صحيحاً ومستمراً في الماضي ولكنه لم يعد كذلك اليوم. في النفي نستخدم 'didn't use to + الفعل' (لاحظ كتابة use بدون d). وفي السؤال نستخدم 'Did you use to + الفعل؟'. وتعتبر هذه القاعدة الركيزة الأساسية عند استرجاع ذكريات الصداقة ومقارنة الماضي بالحاضر.",
        "rules": [
            "Affirmative: Subject + used to + V1 (base verb) for discontinued past habits or states.",
            "Negative: Subject + didn't use to + V1 (base verb) — 'use', not 'used'.",
            "Question: Did + subject + use to + V1 (base verb)?",
            "Do not confuse with 'be used to + -ing' (which means accustomed to)."
        ],
        "rulesArabic": [
            "الإثبات: الفاعل + used to + الفعل الأساسي لعادات أو حالات ماضية انقطعت الآن.",
            "النفي: الفاعل + didn't use to + الفعل الأساسي (تُكتب use بدون حرف d).",
            "السؤال: ?Did + الفاعل + use to + الفعل الأساسي",
            "لا تخلط بينها وبين 'be used to + -ing' التي تعني معتاداً على شيء في الحاضر."
        ],
        "structures": [
            {
                "pattern": "Subject + used to + V1 (base)",
                "explanation": "Expresses a past habit or state that no longer exists.",
                "explanationArabic": "يعبر عن عادة أو حالة ماضية لم تعد موجودة اليوم."
            },
            {
                "pattern": "Subject + didn't use to + V1 (base)",
                "explanation": "Negative form showing something was not true in the past.",
                "explanationArabic": "صيغة النفي لتوضيح أن الأمر لم يكن صحيحاً في الماضي."
            },
            {
                "pattern": "Did + Subject + use to + V1 (base)?",
                "explanation": "Question asking about past habits or states.",
                "explanationArabic": "سؤال عن عادات أو حالات سابقة في الماضي."
            }
        ],
        "examples": [
            {
                "sentence": "We used to hang out at the park every weekend when we were children.",
                "translation": "اعتدنا قضاء الوقت معاً في الحديقة كل عطلة نهاية أسبوع عندما كنا أطفالاً.",
                "usesVocabulary": ["hang out"]
            },
            {
                "sentence": "My childhood friend and I used to share memories and whisper every shared secret.",
                "translation": "اعتدت أنا وصديق طفولتي أن نتشارك الذكريات ونتهامس بكل سر مشترك بيننا.",
                "usesVocabulary": ["childhood friend", "share memories", "shared secret"]
            },
            {
                "sentence": "Did you use to confide in your sister before she moved to London?",
                "translation": "هل اعتدت البوح بأسرارك لأختك قبل أن تنتقل إلى لندن؟",
                "usesVocabulary": ["confide in"]
            },
            {
                "sentence": "We didn't use to drift apart, but university life took us to opposite sides of the globe.",
                "translation": "لم نكن نعتد التباعد، لكن الحياة الجامعية أخذتنا إلى طرفي نقيض في العالم.",
                "usesVocabulary": ["drift apart"]
            }
        ],
        "commonMistakes": [
            {
                "wrong": "We didn't used to talk every day.",
                "right": "We didn't use to talk every day.",
                "note": "After 'didn't', the 'd' is dropped: use 'didn't use to'.",
                "noteArabic": "بعد 'didn't'، نحذف حرف d من used: فنقول 'didn't use to'."
            },
            {
                "wrong": "I am used to play with my childhood friend.",
                "right": "I used to play with my childhood friend.",
                "note": "'Am used to' means accustomed to. For past discontinued habits, use 'used to + base verb'.",
                "noteArabic": "'Am used to' تعني معتاداً على شيء في الحاضر؛ أما للعادات الماضية المنقطعة فنستخدم 'used to + الفعل المجرد'."
            }
        ]
    }
]

convs_day41 = [
    {
        "title": "Reconnecting with a Childhood Friend",
        "titleArabic": "معاودة التواصل مع صديق الطفولة",
        "setting": "Cozy neighborhood coffee shop patio",
        "settingArabic": "شرفة مقهى دافئ في الحي",
        "roles": ["Evelyn", "Marcus"],
        "vocabularyUsed": ["childhood friend", "lifelong friend", "close acquaintance", "confidant", "soulmate", "pal", "buddy", "chum", "circle of friends", "playmate"],
        "lines": [
            {
                "speaker": "Evelyn",
                "text": "Marcus! I cannot believe my eyes! It has been fifteen years since we last spoke, my old pal.",
                "translation": "ماركوس! لا أصدق عينيّ! لقد مرت خمسة عشر عاماً منذ آخر حديث بيننا، يا صاحبي القديم."
            },
            {
                "speaker": "Marcus",
                "text": "Evelyn! You were my favorite childhood friend and playground buddy back in elementary school.",
                "translation": "إيفلين! لقد كنتِ صديقة طفولتي المفضلة ورفيقة ساحة اللعب في المدرسة الابتدائية."
            },
            {
                "speaker": "Evelyn",
                "text": "We used to be inseparable playmates. Remember our little neighborhood circle of friends?",
                "translation": "اعتدنا أن نكون رفقاء لعب لا نفترق. هل تتذكر دائرة أصدقاء حيّنا الصغيرة؟"
            },
            {
                "speaker": "Marcus",
                "text": "Of course! Every school chum in the neighborhood gathered on our street to ride bicycles.",
                "translation": "بالتأكيد! كان كل رفيق في المدرسة من الحي يجتمع في شارعنا لركوب الدراجات."
            },
            {
                "speaker": "Evelyn",
                "text": "You were more than just a close acquaintance; you were my most trusted confidant.",
                "translation": "كنتَ أكثر من مجرد معرفة وثيقة؛ لقد كنتَ مستودع أسراري الأكثر أمانة."
            },
            {
                "speaker": "Marcus",
                "text": "People used to tease us, claiming we were intellectual soulmates because we shared every thought.",
                "translation": "اعتاد الناس ممازحتنا زاعمين أننا توأما روح فكريان لأننا كنا نتشارك كل فكرة."
            },
            {
                "speaker": "Evelyn",
                "text": "Life took us on wild journeys, but in my heart you remain a lifelong friend.",
                "translation": "أخذتنا الحياة في رحلات متباينة، لكنك في قلبي تظل صديق العمر مدى الحياة."
            },
            {
                "speaker": "Marcus",
                "text": "Let's sit down right now and recount everything that happened since those golden years.",
                "translation": "دعنا نجلس الآن ونسترجع كل ما حدث منذ تلك السنوات الذهبية."
            }
        ]
    },
    {
        "title": "Recalling the Bonds that Shaped Us",
        "titleArabic": "استرجاع الروابط التي صقلتنا",
        "setting": "Park bench under autumn maple trees",
        "settingArabic": "مقعد في الحديقة تحت أشجار القيقب الخريفية",
        "roles": ["Hannah", "Liam"],
        "vocabularyUsed": ["companionship", "unconditional support", "loyalty", "trustworthiness", "dependability", "empathy", "mutual understanding", "shared secret", "unbreakable bond", "warmhearted"],
        "lines": [
            {
                "speaker": "Hannah",
                "text": "Looking at this park brings back so much warmth. Your loyal companionship carried me through university.",
                "translation": "النظر إلى هذه الحديقة يعيد الكثير من الدفء. لقد ساعدتني رفقتك الوفية على تجاوز أيام الجامعة."
            },
            {
                "speaker": "Liam",
                "text": "You always offered unconditional support whenever exam anxiety or family pressures threatened my peace.",
                "translation": "كنتِ تقدمين دائماً دعماً غير مشروط كلما هدد قلق الامتحانات أو الضغوط العائلية سلامي النفسي."
            },
            {
                "speaker": "Hannah",
                "text": "Your steadfast loyalty and absolute trustworthiness made you feel like family rather than just a friend.",
                "translation": "وفاؤك الراسخ وجدارتك المطلقة بالثقة جعلاك تبدو كفرد من العائلة وليس مجرد صديق."
            },
            {
                "speaker": "Liam",
                "text": "I deeply admired your dependability; if you promised to meet at dawn to study, you were always there.",
                "translation": "لقد أُعجبت بشدة باعتماديتك؛ فإذا وعدتِ باللقاء عند الفجر للدراسة، كنتِ دائماً حاضرة."
            },
            {
                "speaker": "Hannah",
                "text": "We listened to each other with profound empathy, building deep mutual understanding without judgment.",
                "translation": "كنا نستمع لبعضنا بتعاطف وجداني عميق، فبنينا تفاهماً متبادلاً عميقاً دون أحكام مسبقة."
            },
            {
                "speaker": "Liam",
                "text": "Do you still remember that funny shared secret we hid from everyone in dorm hall three?",
                "translation": "هل ما زلتِ تتذكرين ذلك السر المشترك المضحك الذي أخفيناه عن الجميع في قاعة السكن الثالثة؟"
            },
            {
                "speaker": "Hannah",
                "text": "I will never forget it! Sharing vulnerable laughter forged an unbreakable bond between us.",
                "translation": "لن أنساه أبداً! لقد صاغ تشارك الضحكات الصادقة بيننا رابطة متينة لا تنفصم."
            },
            {
                "speaker": "Liam",
                "text": "You have always been such a warmhearted person, and having you as a friend is my greatest blessing.",
                "translation": "لطالما كنتِ إنسانة طيبة القلب ودافئة المشاعر، ووجودك كصديقة هو أعظم نعمي."
            }
        ]
    },
    {
        "title": "Through Thick and Thin",
        "titleArabic": "في السراء والضراء",
        "setting": "Quiet rooftop terrace overlooking the city",
        "settingArabic": "شرفة سطح هادئة تطل على أفق المدينة",
        "roles": ["Nathan", "Julian"],
        "vocabularyUsed": ["hang out", "get back in touch", "catch up with", "drift apart", "reminisce about", "confide in", "lean on", "stand by", "share memories", "laugh together", "form a bond", "test of time", "enduring friendship", "lifelong bond", "nostalgic memory", "lost touch", "reach back out", "rekindle friendship", "grow closer", "mutual affection", "thick as thieves", "fair-weather friend", "through thick and thin", "bosom friend", "kindred spirit", "sympathetic ear", "heart-to-heart", "shoulder to cry on", "inseparable", "cherish friendship"],
        "lines": [
            {
                "speaker": "Nathan",
                "text": "We used to hang out on this very rooftop fifteen years ago, dreaming about who we would become.",
                "translation": "اعتدنا قضاء الوقت معاً على هذا السطح بالذات قبل خمسة عشر عاماً، نحلم بما سنكون عليه مستقبلاً."
            },
            {
                "speaker": "Julian",
                "text": "We were as thick as thieves back then; people used to say we were completely inseparable bosom friends.",
                "translation": "كنا كالسمن على العسل في ذلك الحين؛ اعتاد الناس القول إننا رفيقان حميمان لا يفترقان إطلاقاً."
            },
            {
                "speaker": "Nathan",
                "text": "When you moved to Tokyo, we slowly lost touch and started to drift apart across the ocean.",
                "translation": "عندما انتقلتَ إلى طوكيو، انقطع التواصل بيننا ببطء وبدأنا نتباعد تدريجياً عبر المحيط."
            },
            {
                "speaker": "Julian",
                "text": "I am so glad you decided to reach back out and get back in touch so we could rekindle friendship.",
                "translation": "أنا سعيد للغاية لأنك قررت المبادرة بالتواصل ومعاودة الاتصال لنحيي صداقتنا من جديد."
            },
            {
                "speaker": "Nathan",
                "text": "An enduring friendship withstands the test of time; true friends stand by each other through thick and thin.",
                "translation": "الصداقة الوطيدة تصمد أمام اختبار الزمن؛ فالأصدقاء الحقيقيون يقفون بجانب بعضهم في السراء والضراء."
            },
            {
                "speaker": "Julian",
                "text": "A fair-weather friend disappears during tragedy, but having your sympathetic ear was my shoulder to cry on.",
                "translation": "صديق الرخاء يختفي أثناء المآسي، لكن وجود أذنك الصاغية كان كتفاً وسنداً لي لمواساتي."
            },
            {
                "speaker": "Nathan",
                "text": "Having this late-night heart-to-heart proves that our mutual affection and kindred spirit never faded.",
                "translation": "إن إجراء هذا الحديث الصادق من القلب إلى القلب يثبت أن مودتنا المتبادلة وتآلف أرواحنا لم يبهتا قط."
            },
            {
                "speaker": "Julian",
                "text": "As we share memories and laugh together, I realize how deeply I cherish friendship like ours.",
                "translation": "وبينما نتشارك الذكريات ونضحك معاً، أدرك كم أقدر وأصون صداقة نادرة كصداقتنا."
            }
        ]
    }
]

paras_day41 = [
    {
        "title": "The Golden Threads of Enduring Companionship",
        "titleArabic": "الخيوط الذهبية للرفقة الدائمة",
        "kind": "reflective",
        "vocabularyUsed": ["enduring friendship", "test of time", "cherish friendship", "companionship", "loyalty", "trustworthiness", "dependability", "form a bond"],
        "text": "Human happiness finds its deepest nourishment in the comforting soil of an enduring friendship. When two young souls form a bond rooted in mutual respect, their companionship blossoms across decades of life changes. True camaraderie demands steadfast loyalty, unquestioned trustworthiness, and consistent dependability in times of storm and serenity alike. While trivial acquaintances fade as circumstances shift, authentic allies withstand the rigorous test of time. As mature individuals navigate career pressures and geographic dislocations, they learn to cherish friendship as life's most priceless treasure. Nurturing these lifelong connections requires mindful intention, empathetic listening, and regular gratitude for the people who walk beside us.",
        "translation": "تجد السعادة الإنسانية أعمق تغذية لها في تربة الصداقة الوطيدة المريحة. وعندما يبني شابان رابطة متجذرة في الاحترام المتبادل، تزهر رفقتهما عبر عقود من تقلبات الحياة. ويتطلب الوفاء الحقيقي إخلاصاً ثابتاً وأمانة لا يرقى إليها الشك واعتمادية متسقة في أوقات العواصف والسكينة على السواء. وبينما تتلاشى المعارف السطحية مع تغير الظروف، يصمد الحلفاء الصادقون في وجه اختبار الزمن الصارم. ومع تنقل الأفراد الناضجين بين ضغوط العمل وتغير الأماكن، يتعلمون تقدير الصداقة كأثمن كنوز الحياة. إن رعاية هذه الروابط الدائمة تتطلب اهتماماً واعياً واستماعاً متعاطفاً وامتناناً دائماً لأولئك الذين يسيرون بجانبنا."
    },
    {
        "title": "Nostalgia and Rekindling Lost Connections",
        "titleArabic": "الحنين وإحياء الروابط المفقودة",
        "kind": "informative",
        "vocabularyUsed": ["reminisce about", "share memories", "laugh together", "nostalgic memory", "lost touch", "reach back out", "rekindle friendship", "grow closer"],
        "text": "Modern life often scatters close companions across distant continents, causing intimate circles to gradually lose touch. Yet, a dormant bond never truly expires if goodwill remains intact. Years later, one brave message to reach back out can dissolve decades of silence in a heartbeat. When estranged companions gather over coffee to reminisce about university shenanigans, every nostalgic memory awakens fresh warmth. As they share memories and laugh together about youthful misadventures, the old emotional rhythm returns effortlessly. Taking proactive initiative to rekindle friendship allows mature adults to grow closer with renewed appreciation for their shared history, proving that genuine affection transcends time, silence, and geographic distance.",
        "translation": "غالباً ما تشتت الحياة المعاصرة الرفقاء المقربين عبر قارات متباعدة، مما يجعل الدوائر الحميمة تفقد التواصل تدريجياً. ومع ذلك، فإن الرابطة الراكدة لا تموت أبداً إذا بقيت المودة سليمة. وبعد سنوات، يمكن لرسالة شجاعة واحدة لمعاودة التواصل أن تذيب عقوداً من الصمت في طرفة عين. وعندما يجتمع الرفقاء المتباعدون على فنجان قهوة لاسترجاع ذكريات أيام الجامعة، توقظ كل ذكرى حنين دفئاً متجدداً. وبينما يتشاركون الذكريات ويضحكون معاً على مغامرات الشباب، يعود التناغم القديم دون عناء. إن المبادرة الإيجابية لإحياء الصداقة تتيح للبالغين زيادة التقارب بتقدير متجدد لتاريخهم المشترك، ليثبتوا أن المودة الصادقة تتجاوز الزمن والصمت والمسافات."
    },
    {
        "title": "The Meaning of a Soulmate and Kindred Spirit",
        "titleArabic": "معنى توأم الروح والروح المتآلفة",
        "kind": "reflective",
        "vocabularyUsed": ["soulmate", "kindred spirit", "confidant", "empathy", "mutual understanding", "unbreakable bond", "heart-to-heart", "shoulder to cry on"],
        "text": "Finding a platonic soulmate or true kindred spirit is among the rarest gifts of the human experience. Unlike superficial peers, an authentic confidant listens with unconditional empathy and intuitive mutual understanding. When heartbreak strikes or personal failure overwhelms, this trusted companion provides an unwavering shoulder to cry on. Late-night heart-to-heart dialogues untangle complex emotions and illuminate paths forward through darkened seasons. Shared vulnerability and transparent honesty forge an unbreakable bond that withstands adversity and honors truth. In a fragmented world dominated by transient digital transactions, having a companion who truly understands your inner spirit grounds your soul in lasting peace, dignity, and belonging.",
        "translation": "إن العثور على توأم روح أو رفيق متآلف الفكر هو من أندر هدايا التجربة الإنسانية. وخلافاً للأقران السطحيين، يستمع مستودع الأسرار الحقيقي بتعاطف غير مشروط وتفهم متبادل بديهي. وعندما يحل انكسار القلب أو يطغى الفشل الشخصي، يوفر هذا الرفيق الموثوق كتفاً ومواساة للاستناد إليها. وتفكك الحوارات الليلية الصريحة من القلب إلى القلب المشاعر المعقدة وتنير دروب التقدم عبر الفصول المظلمة. إن الضعف المشترك والصدق الشفاف يصوغان رابطة متينة لا تنفصم تصمد أمام الشدائد وتبجل الحقيقة. وفي عالم مجزأ تهيمن عليه المعاملات الرقمية العابرة، فإن وجود رفيق يفهم روحك الداخلية بعمق يرسخ نفسك في سلام وأصالة وانتماء دائم."
    }
]
