# -*- coding: utf-8 -*-
"""Generator for Day 46: Arguments and Solutions."""

import json

vocab_data = [
    {
        "headword": "altercation",
        "pronunciation": "/ˌɔːltəˈkeɪʃn/",
        "partOfSpeech": "noun",
        "definition": "A noisy, heated, and angry argument or disagreement in public.",
        "example": "Police were called when a minor parking dispute escalated into a loud physical altercation.",
        "translation": "مشادة كلامية / شجار صاخب وعلني",
        "exampleArabic": "استُدعيت الشرطة عندما تصاعد خلاف بسيط على موقف سيارات إلى مشادة علنية صاخبة وعراك.",
        "relatedForms": ["altercate"],
        "collocations": ["heated altercation", "physical altercation"],
        "synonyms": ["quarrel", "brawl", "clash"],
        "antonyms": ["agreement", "harmony"],
        "tags": ["arguments", "conflict"]
    },
    {
        "headword": "bickering",
        "pronunciation": "/ˈbɪkərɪŋ/",
        "partOfSpeech": "noun",
        "definition": "Petty, bad-tempered, and annoying arguing about trivial matters.",
        "example": "Constant bickering between the tired roommates ruined the relaxed atmosphere of their shared apartment.",
        "translation": "مماراة ومناكفة / جدال عقيم حول توافه الأمور",
        "exampleArabic": "أفسدت المناكفات والجدالات العقيمة المستمرة بين رفيقي السكن المرهقين الجو المريح لشقتهما المشتركة.",
        "relatedForms": ["bicker"],
        "collocations": ["petty bickering", "constant bickering"],
        "synonyms": ["squabbling", "wrangling", "quarreling"],
        "antonyms": ["concord", "peace"],
        "tags": ["arguments", "conflict"]
    },
    {
        "headword": "clash",
        "pronunciation": "/klæʃ/",
        "partOfSpeech": "noun",
        "definition": "A sharp conflict, confrontation, or disagreement between opposing opinions, personalities, or factions.",
        "example": "There was a sharp clash of egos between the chief architect and the lead interior designer.",
        "translation": "صدام / تصادم الآراء أو المصالح",
        "exampleArabic": "وقع صدام حاد في النزعات الفردية بين كبير المهندسين المعماريين ورئيس فريق التصميم الداخلي.",
        "relatedForms": ["clashing"],
        "collocations": ["clash of personalities", "violent clash"],
        "synonyms": ["conflict", "collision", "confrontation"],
        "antonyms": ["harmony", "cooperation"],
        "tags": ["arguments", "conflict"]
    },
    {
        "headword": "confrontation",
        "pronunciation": "/ˌkɒnfrʌnˈteɪʃn/",
        "partOfSpeech": "noun",
        "definition": "A hostile, argumentative, or direct face-to-face meeting between opposing parties.",
        "example": "He deliberately avoided a direct confrontation with his supervisor until he gathered indisputable evidence.",
        "translation": "مواجهة / مجابهة مباشرة وصدامية",
        "exampleArabic": "تجنب عمداً المواجهة الصدامية المباشرة مع مشرفه حتى جمع أدلة لا تقبل الشك.",
        "relatedForms": ["confront", "confrontational"],
        "collocations": ["avoid confrontation", "direct confrontation"],
        "synonyms": ["showdown", "encounter", "face-off"],
        "antonyms": ["evasion", "retreat"],
        "tags": ["arguments", "conflict"]
    },
    {
        "headword": "contention",
        "pronunciation": "/kənˈtenʃn/",
        "partOfSpeech": "noun",
        "definition": "Heated disagreement, competition, or an assertion maintained in an argument.",
        "example": "The distribution of holiday overtime shifts remained a major bone of contention among the nursing staff.",
        "translation": "نزاع وخلاف / نقطة خلاف وتنازع",
        "exampleArabic": "ظل توزيع نوبات العمل الإضافي في العطلات نقطة خلاف ونزاع رئيسية بين طاقم التمريض.",
        "relatedForms": ["contentious", "contend"],
        "collocations": ["bone of contention", "matter of contention"],
        "synonyms": ["dispute", "discord", "friction"],
        "antonyms": ["agreement", "unanimity"],
        "tags": ["arguments", "conflict"]
    },
    {
        "headword": "discord",
        "pronunciation": "/ˈdɪskɔːd/",
        "partOfSpeech": "noun",
        "definition": "Disagreement, tension, or lack of harmony between persons or things.",
        "example": "Unfair financial favoritism sowed bitter seeds of marital discord within their household.",
        "translation": "شقاق / تنافر وخلاف مفسد للوفاق",
        "exampleArabic": "بذر التحيز المالي غير العادل بذور الشقاق الزوجي والخصومة داخل بيتهم.",
        "relatedForms": ["discordant"],
        "collocations": ["marital discord", "sow discord"],
        "synonyms": ["strife", "friction", "disharmony"],
        "antonyms": ["harmony", "accord"],
        "tags": ["arguments", "conflict"]
    },
    {
        "headword": "dispute",
        "pronunciation": "/dɪˈspjuːt/",
        "partOfSpeech": "noun",
        "definition": "A formal or prolonged disagreement or argument, especially between groups or businesses.",
        "example": "The two trading companies submitted their cross-border contract dispute to an independent tribunal.",
        "translation": "نزاع / خلاف رسمي أو قانوني",
        "exampleArabic": "قدمت الشركتان التجاريتان نزاعهما التعاقدي العابر للحدود إلى محكمة تحكيم مستقلة.",
        "relatedForms": ["disputable", "disputant"],
        "collocations": ["settle a dispute", "border dispute"],
        "synonyms": ["controversy", "conflict", "litigation"],
        "antonyms": ["agreement", "settlement"],
        "tags": ["arguments", "conflict"]
    },
    {
        "headword": "dissension",
        "pronunciation": "/dɪˈsenʃn/",
        "partOfSpeech": "noun",
        "definition": "Disagreement that leads to discord and factional division within a group.",
        "example": "Ideological dissension among committee members severely delayed the launch of the charity program.",
        "translation": "انشقاق / فرقة وخلاف يمزق الصفوف",
        "exampleArabic": "أدى الانشقاق الفكري بين أعضاء اللجنة إلى تأخير إطلاق البرنامج الخيري بشدة.",
        "relatedForms": ["dissent"],
        "collocations": ["internal dissension", "cause dissension"],
        "synonyms": ["division", "schism", "infighting"],
        "antonyms": ["unity", "solidarity"],
        "tags": ["arguments", "conflict"]
    },
    {
        "headword": "feud",
        "pronunciation": "/fjuːd/",
        "partOfSpeech": "noun",
        "definition": "A prolonged and bitter quarrel, vendetta, or state of enmity, especially between families.",
        "example": "A tragic generational feud between the two aristocratic families lasted for nearly half a century.",
        "translation": "عداوة موروثة / ثأر ونزاع أسري طويل",
        "exampleArabic": "استمرت عداوة موروثة ونزاع أسري مأساوي بين العائلتين الأرستقراطيتين لما يقرب من نصف قرن.",
        "relatedForms": ["feuding"],
        "collocations": ["family feud", "bitter feud"],
        "synonyms": ["vendetta", "enmity", "bad blood"],
        "antonyms": ["reconciliation", "friendship"],
        "tags": ["arguments", "conflict"]
    },
    {
        "headword": "friction",
        "pronunciation": "/ˈfrɪkʃn/",
        "partOfSpeech": "noun",
        "definition": "Conflict, tension, or animosity resulting from friction between differing opinions or temperaments.",
        "example": "Vague job descriptions caused unnecessary friction between marketing and product engineers.",
        "translation": "احتكاك وتوتر / شحناء بسبب تباين الآراء",
        "exampleArabic": "تسببت التوصيفات الوظيفية الغامضة في احتكاك وتوتر لا داعي له بين فريقي التسويق وهندسة المنتجات.",
        "relatedForms": ["frictional"],
        "collocations": ["cause friction", "interpersonal friction"],
        "synonyms": ["tension", "discord", "strain"],
        "antonyms": ["harmony", "accord"],
        "tags": ["arguments", "conflict"]
    },
    {
        "headword": "hostility",
        "pronunciation": "/hɒˈstɪləti/",
        "partOfSpeech": "noun",
        "definition": "Hostile behavior, intense unfriendliness, or overt opposition.",
        "example": "Despite the polite smiles during dinner, an undercurrent of cold hostility was unmistakable.",
        "translation": "عداء / ضغينة وعدائية ظاهرة",
        "exampleArabic": "على الرغم من الابتسامات المهذبة أثناء العشاء، كان التيار الخفي من العداء الصريح لا تخطئه العين.",
        "relatedForms": ["hostile"],
        "collocations": ["open hostility", "show hostility"],
        "synonyms": ["animosity", "antagonism", "ill will"],
        "antonyms": ["friendliness", "warmth"],
        "tags": ["arguments", "conflict"]
    },
    {
        "headword": "rift",
        "pronunciation": "/rɪft/",
        "partOfSpeech": "noun",
        "definition": "A serious break or fissure in friendly relations between people or groups.",
        "example": "The unexpected dispute over ancestral inheritance caused a deep rift between the two brothers.",
        "translation": "صدع / قطيعة وشقاق في العلاقات",
        "exampleArabic": "تسبب النزاع غير المتوقع حول الميراث الموروث في صدع وقطيعة عميقة بين الأخوين.",
        "relatedForms": [],
        "collocations": ["deep rift", "heal a rift"],
        "synonyms": ["breach", "split", "estrangement"],
        "antonyms": ["reconciliation", "union"],
        "tags": ["arguments", "conflict"]
    },
    {
        "headword": "squabble",
        "pronunciation": "/ˈskwɒbl/",
        "partOfSpeech": "noun",
        "definition": "A noisy quarrel about something petty or unimportant.",
        "example": "The toddlers engaged in a silly squabble over who would ride the wooden rocking horse first.",
        "translation": "مشاحنة / شجار صبياني على أمر تافه",
        "exampleArabic": "انخرط الصغيران في مشاحنة وشجار صبياني حول من سيركب الحصان الخشبي الهزاز أولاً.",
        "relatedForms": ["squabbler"],
        "collocations": ["petty squabble", "silly squabble"],
        "synonyms": ["tussle", "argument", "bickering"],
        "antonyms": ["agreement"],
        "tags": ["arguments", "conflict"]
    },
    {
        "headword": "strife",
        "pronunciation": "/straɪf/",
        "partOfSpeech": "noun",
        "definition": "Angry, bitter, or violent disagreement and conflict over fundamental issues.",
        "example": "Years of devastating civil strife crippled regional infrastructure and divided historical communities.",
        "translation": "فتنة ونزاع / صراع مرير مدمر",
        "exampleArabic": "أدت سنوات من الفتنة والصراع الأهلي المدمر إلى شل البنية التحتية الإقليمية وتمزيق المجتمعات التاريخية.",
        "relatedForms": [],
        "collocations": ["civil strife", "internal strife"],
        "synonyms": ["conflict", "turmoil", "struggle"],
        "antonyms": ["peace", "calm"],
        "tags": ["arguments", "conflict"]
    },
    {
        "headword": "wrangling",
        "pronunciation": "/ˈræŋɡlɪŋ/",
        "partOfSpeech": "noun",
        "definition": "Prolonged, noisy, and complicated arguing or dispute.",
        "example": "After weeks of diplomatic wrangling behind closed doors, a compromise text was finally drafted.",
        "translation": "مماحكات / جدال ونزاع عقيم ومطول",
        "exampleArabic": "بعد أسابيع من المماحكات والجدال الدبلوماسي خلف الأبواب المغلقة، تمت صياغة نص تسوية أخيراً.",
        "relatedForms": ["wrangle", "wrangler"],
        "collocations": ["legal wrangling", "political wrangling"],
        "synonyms": ["haggling", "bickering", "sparring"],
        "antonyms": ["concord"],
        "tags": ["arguments", "conflict"]
    },
    {
        "headword": "antagonism",
        "pronunciation": "/ænˈtæɡənɪzəm/",
        "partOfSpeech": "noun",
        "definition": "Active hostility, deep opposition, or mutual animosity.",
        "example": "The natural antagonism between the rival soccer clubs led to separate stadium entrances for supporters.",
        "translation": "خصومة / عداء وتنافس محتدم",
        "exampleArabic": "أدت الخصومة والعداء المحتدم الطبيعي بين الناديين المتنافسين إلى تخصيص بوابات دخول منفصلة للمشجعين.",
        "relatedForms": ["antagonistic", "antagonize"],
        "collocations": ["deep antagonism", "mutual antagonism"],
        "synonyms": ["hostility", "friction", "antipathy"],
        "antonyms": ["affinity", "amity"],
        "tags": ["arguments", "conflict"]
    },
    {
        "headword": "vendetta",
        "pronunciation": "/venˈdetə/",
        "partOfSpeech": "noun",
        "definition": "A prolonged and bitter feud, characterized by vengeful, retaliatory acts.",
        "example": "He conducted a personal vendetta against the newspaper that published defamatory claims about him.",
        "translation": "ثأر شخصي / حرب انتقامية ضارية",
        "exampleArabic": "شن حرب ثأر وانتقام شخصية ضد الصحيفة التي نشرت ادعاءات تشهيرية بحقه.",
        "relatedForms": [],
        "collocations": ["personal vendetta", "wage a vendetta"],
        "synonyms": ["blood feud", "revenge", "grudge"],
        "antonyms": ["forgiveness", "peace"],
        "tags": ["arguments", "conflict"]
    },
    {
        "headword": "misunderstanding",
        "pronunciation": "/ˌmɪsʌndəˈstændɪŋ/",
        "partOfSpeech": "noun",
        "definition": "A failure to correctly understand something; an informal disagreement arising from poor communication.",
        "example": "A simple linguistic misunderstanding over arrival times caused both parties to wait at different cafes.",
        "translation": "سوء فهم / لبس في التواصل أدى إلى خلاف",
        "exampleArabic": "تسبب سوء فهم لغوي بسيط حول مواعيد الوصول في انتظار الطرفين في مقهيين مختلفين.",
        "relatedForms": ["misunderstand"],
        "collocations": ["clear up a misunderstanding", "tragic misunderstanding"],
        "synonyms": ["misconception", "misinterpretation", "confusion"],
        "antonyms": ["comprehension", "agreement"],
        "tags": ["arguments", "communication"]
    },
    {
        "headword": "standoff",
        "pronunciation": "/ˈstændɒf/",
        "partOfSpeech": "noun",
        "definition": "A situation in which opposing sides cannot agree, resulting in a tense stalemate or confrontation.",
        "example": "The tense armed standoff ended without casualties after seasoned negotiators established a dialogue line.",
        "translation": "مأزق مواجهة متوترة / تجميد الموقف بانتظار حل",
        "exampleArabic": "انتهى مأزق المواجهة المسلحة المتوترة دون وقوع إصابات بعد أن فتح مفاوضون محنكون خط حوار.",
        "relatedForms": [],
        "collocations": ["tense standoff", "resolve a standoff"],
        "synonyms": ["stalemate", "impasse", "deadlock"],
        "antonyms": ["breakthrough", "resolution"],
        "tags": ["arguments", "conflict"]
    },
    {
        "headword": "impasse",
        "pronunciation": "/ˈæmpɑːs/",
        "partOfSpeech": "noun",
        "definition": "A situation in which no progress is possible, especially because of disagreement; a deadlock.",
        "example": "Wage negotiations reached an unexpected impasse when management refused cost-of-living adjustments.",
        "translation": "طريق مسدود / مأزق يستعصي على الحل",
        "exampleArabic": "وصلت مفاوضات الأجور إلى طريق مسدود وغير متوقع عندما رفضت الإدارة تعديلات تكلفة المعيشة.",
        "relatedForms": [],
        "collocations": ["reach an impasse", "break an impasse"],
        "synonyms": ["deadlock", "stalemate", "standstill"],
        "antonyms": ["breakthrough", "progress"],
        "tags": ["arguments", "negotiation"]
    },
    {
        "headword": "accuse",
        "pronunciation": "/əˈkjuːz/",
        "partOfSpeech": "verb",
        "definition": "Claim that someone has done something wrong, illegal, or offensive.",
        "example": "It is counterproductive to accuse colleagues without reviewing the verifiable objective logs.",
        "translation": "يتهم / يوجه اللوم والاتهام",
        "exampleArabic": "من غير المجدي اتهام الزملاء دون مراجعة سجلات البيانات الموضوعية والقابلة للتحقق.",
        "relatedForms": ["accusation", "accuser"],
        "collocations": ["falsely accuse", "accuse of wrongdoing"],
        "synonyms": ["blame", "charge", "indict"],
        "antonyms": ["exonerate", "defend"],
        "tags": ["arguments", "behavior"]
    },
    {
        "headword": "provoke",
        "pronunciation": "/prəˈvəʊk/",
        "partOfSpeech": "verb",
        "definition": "Deliberately stimulate or incite someone to react angrily or aggressively.",
        "example": "He knew his witty sarcasm would provoke his short-tempered opponent into making reckless blunders.",
        "translation": "يستفز / يثير الغضب عمداً",
        "exampleArabic": "علم أن سخريته الذكية ستستفز خصمه سريع الغضب وتدفعه لارتكاب أخطاء متهورة.",
        "relatedForms": ["provocation", "provocative"],
        "collocations": ["deliberately provoke", "provoke a reaction"],
        "synonyms": ["incite", "inflame", "irritate"],
        "antonyms": ["pacify", "appease"],
        "tags": ["arguments", "behavior"]
    },
    {
        "headword": "retaliate",
        "pronunciation": "/rɪˈtælieɪt/",
        "partOfSpeech": "verb",
        "definition": "Make an attack or assault in return for a similar attack or insult.",
        "example": "When provoked by harsh insults, she chose to maintain dignity rather than retaliate in anger.",
        "translation": "ينتقم / يرد الضربة بمثلها",
        "exampleArabic": "عندما استفزتها إهانات قاسية، اختارت الحفاظ على كرامتها بدلاً من الانتقام والرد بغضب.",
        "relatedForms": ["retaliation", "retaliatory"],
        "collocations": ["retaliate swiftly", "refuse to retaliate"],
        "synonyms": ["strike back", "avenge", "reciprocate"],
        "antonyms": ["forgive", "condone"],
        "tags": ["arguments", "behavior"]
    },
    {
        "headword": "insult",
        "pronunciation": "/ɪnˈsʌlt/",
        "partOfSpeech": "verb",
        "definition": "Speak to or treat with disrespect or scornful abuse.",
        "example": "During the heated assembly debate, neither politician resorted to insults or personal attacks.",
        "translation": "يهين / يوجه إساءة أو تحقيراً",
        "exampleArabic": "خلال مناظرة الجمعية الحامية، لم يلجأ أي من السياسيين إلى توجيه الإهانات أو الهجمات الشخصية.",
        "relatedForms": ["insulting", "insultingly"],
        "collocations": ["deeply insult", "hurling insults"],
        "synonyms": ["offend", "affront", "belittle"],
        "antonyms": ["compliment", "praise"],
        "tags": ["arguments", "behavior"]
    },
    {
        "headword": "criticize",
        "pronunciation": "/ˈkrɪtɪsaɪz/",
        "partOfSpeech": "verb",
        "definition": "Indicate the faults of someone or something in a disapproving or analytical way.",
        "example": "A constructive mentor will criticize the flawed technique while encouraging the aspiring student.",
        "translation": "ينتقد / يبيّن العيوب والأخطاء",
        "exampleArabic": "يقوم المرشد البناء بنقد الأسلوب المعيب وفي الوقت ذاته تشجيع الطالب الطموح.",
        "relatedForms": ["criticism", "critical"],
        "collocations": ["sharply criticize", "constructively criticize"],
        "synonyms": ["censure", "disapprove", "rebuke"],
        "antonyms": ["praise", "applaud"],
        "tags": ["arguments", "behavior"]
    },
    {
        "headword": "contradict",
        "pronunciation": "/ˌkɒntrəˈdɪkt/",
        "partOfSpeech": "verb",
        "definition": "Assert the opposite of a statement made by someone; be in conflict with.",
        "example": "He refrained from contradicting his business partner in front of prospective corporate investors.",
        "translation": "يناقض / يعارض القول علناً",
        "exampleArabic": "امتنع عن مناقضة شريكه التجاري أو معارضة قوله أمام المستثمرين التجاريين المحتملين.",
        "relatedForms": ["contradiction", "contradictory"],
        "collocations": ["directly contradict", "contradict oneself"],
        "synonyms": ["dispute", "refute", "deny"],
        "antonyms": ["confirm", "corroborate"],
        "tags": ["arguments", "communication"]
    },
    {
        "headword": "interrupt",
        "pronunciation": "/ˌɪntəˈrʌpt/",
        "partOfSpeech": "verb",
        "definition": "Stop the continuous progress of someone speaking or an activity.",
        "example": "Please do not interrupt while she is explaining the compromise proposal to the board.",
        "translation": "يقاطع / يقطع حديث المتكلم",
        "exampleArabic": "يرجى عدم المقاطعة بينما تشرح مقترح التسوية والوفاق لمجلس الإدارة.",
        "relatedForms": ["interruption"],
        "collocations": ["rudely interrupt", "interrupt a conversation"],
        "synonyms": ["cut in", "butt in", "disrupt"],
        "antonyms": ["listen", "continue"],
        "tags": ["arguments", "communication"]
    },
    {
        "headword": "belittle",
        "pronunciation": "/bɪˈlɪtl/",
        "partOfSpeech": "verb",
        "definition": "Make someone or something seem unimportant, trivial, or of little worth.",
        "example": "A destructive boss uses sarcasm to belittle the honest contributions of junior team members.",
        "translation": "يقلل من شأن / يحط من قدر غيره",
        "exampleArabic": "يستخدم المدير الهدام السخرية للتقليل من شأن المساهمات الصادقة لأعضاء الفريق المبتدئين.",
        "relatedForms": ["belittling"],
        "collocations": ["belittle achievements", "belittle efforts"],
        "synonyms": ["disparage", "deprecate", "demean"],
        "antonyms": ["praise", "magnify"],
        "tags": ["arguments", "behavior"]
    },
    {
        "headword": "escalate",
        "pronunciation": "/ˈeskəleɪt/",
        "partOfSpeech": "verb",
        "definition": "Increase rapidly in intensity, scale, or seriousness.",
        "example": "If neither neighbor yields on the boundary fence, this minor dispute might escalate into a lawsuit.",
        "translation": "يصعّد / يفاقم الأزمة ويزيد حدتها",
        "exampleArabic": "إذا لم يتنازل أي من الجارين بشأن سياج الحدود، فقد يتصاعد هذا الخلاف البسيط إلى دعوى قضائية.",
        "relatedForms": ["escalation"],
        "collocations": ["escalate the conflict", "rapidly escalate"],
        "synonyms": ["intensify", "aggravate", "magnify"],
        "antonyms": ["de-escalate", "diminish"],
        "tags": ["arguments", "conflict"]
    },
    {
        "headword": "de-escalate",
        "pronunciation": "/ˌdiː ˈeskəleɪt/",
        "partOfSpeech": "verb",
        "definition": "Reduce the intensity, danger, or hostility of a conflict.",
        "example": "Trained security officers use calm, empathetic body language to de-escalate aggressive confrontations.",
        "translation": "يهدئ / ينزع فتيل التوتر ويخفف التصعيد",
        "exampleArabic": "يستخدم ضباط الأمن المدربون لغة جسد هادئة ومتعاطفة لتهدئة المواجهات العدوانية ونزع فتيلها.",
        "relatedForms": ["de-escalation"],
        "collocations": ["de-escalate tensions", "effort to de-escalate"],
        "synonyms": ["diffuse", "cool down", "mitigate"],
        "antonyms": ["escalate", "inflame"],
        "tags": ["arguments", "solutions"]
    },
    {
        "headword": "mediate",
        "pronunciation": "/ˈmiːdieɪt/",
        "partOfSpeech": "verb",
        "definition": "Intervene between people in a dispute in order to bring about an agreement or reconciliation.",
        "example": "A neutral community elder stepped forward to mediate the complicated dispute between the land owners.",
        "translation": "يتوسط / يتدخل للوفاق والإصلاح",
        "exampleArabic": "تقدم مسن مجتمعي محايد ليتوسط في النزاع المعقد بين ملاك الأراضي ويصلح بينهم.",
        "relatedForms": ["mediation"],
        "collocations": ["mediate a dispute", "help mediate"],
        "synonyms": ["arbitrate", "negotiate", "intercede"],
        "antonyms": [],
        "tags": ["solutions", "mediation"]
    },
    {
        "headword": "negotiate",
        "pronunciation": "/nɪˈɡəʊʃieɪt/",
        "partOfSpeech": "verb",
        "definition": "Obtain or bring about by discussion; discuss terms toward an agreement.",
        "example": "The diplomatic team worked through the night to negotiate a viable ceasefire agreement.",
        "translation": "يفاوض / يتفاوض للوصول إلى اتفاق",
        "exampleArabic": "عمل الفريق الدبلوماسي طوال الليل للتفاوض حول اتفاق قابل للتطبيق لوقف إطلاق النار.",
        "relatedForms": ["negotiation", "negotiator"],
        "collocations": ["negotiate terms", "negotiate in good faith"],
        "synonyms": ["bargain", "parley", "deliberate"],
        "antonyms": [],
        "tags": ["solutions", "negotiation"]
    },
    {
        "headword": "arbitrate",
        "pronunciation": "/ˈɑːbɪtreɪt/",
        "partOfSpeech": "verb",
        "definition": "Act as an impartial judge or referee to settle an authoritative dispute.",
        "example": "A seasoned judge was appointed to arbitrate the commercial breach-of-contract case.",
        "translation": "يحكّم / يفصل في الخصومة كحكم محايد",
        "exampleArabic": "عُين قاضٍ مخضرم للتحكيم والفصل في قضية خرق العقد التجاري.",
        "relatedForms": ["arbitration", "arbitrator"],
        "collocations": ["arbitrate a dispute", "agree to arbitrate"],
        "synonyms": ["adjudicate", "judge", "referee"],
        "antonyms": [],
        "tags": ["solutions", "legal"]
    },
    {
        "headword": "reconcile",
        "pronunciation": "/ˈrekənsaɪl/",
        "partOfSpeech": "verb",
        "definition": "Restore friendly relations between estranged parties, or make differing ideas compatible.",
        "example": "After months of silence, an honest phone conversation helped reconcile the estranged lifelong friends.",
        "translation": "يصالح / يصلح ذات البين ويزيل الخلاف",
        "exampleArabic": "بعد أشهر من الصمت، ساعدت محادثة هاتفية صادقة في مصالحة الصديقين المتباعدين وإصلاح ذات البين.",
        "relatedForms": ["reconciliation", "reconcilable"],
        "collocations": ["reconcile differences", "attempt to reconcile"],
        "synonyms": ["harmonize", "pacify", "reunite"],
        "antonyms": ["estrange", "alienate"],
        "tags": ["solutions", "peace"]
    },
    {
        "headword": "concede",
        "pronunciation": "/kənˈsiːd/",
        "partOfSpeech": "verb",
        "definition": "Admit that something is true or valid after first denying or resisting it.",
        "example": "After re-checking the financial ledgers, the accountant had to concede that an error had occurred.",
        "translation": "يقر ويعترف / يتنازل عن موقفه المقاوم",
        "exampleArabic": "بعد إعادة فحص الدفاتر المالية، اضطر المحاسب إلى الإقرار والاعتراف بحدوث خطأ.",
        "relatedForms": ["concession"],
        "collocations": ["concede defeat", "reluctantly concede"],
        "synonyms": ["admit", "acknowledge", "yield"],
        "antonyms": ["deny", "refute"],
        "tags": ["solutions", "negotiation"]
    },
    {
        "headword": "compromise",
        "pronunciation": "/ˈkɒmprəmaɪz/",
        "partOfSpeech": "verb",
        "definition": "Settle a dispute by mutual concession.",
        "example": "Both departments agreed to compromise on the budget allocations so all projects could proceed.",
        "translation": "يتوصل إلى حل وسط / يقدم تنازلات متبادلة",
        "exampleArabic": "وافق كلا القسمين على التوصل إلى حل وسط بشأن مخصصات الميزانية حتى تتمكن جميع المشاريع من المضي قدماً.",
        "relatedForms": [],
        "collocations": ["reach a compromise", "willing to compromise"],
        "synonyms": ["meet halfway", "settle", "find middle ground"],
        "antonyms": ["stand firm", "refuse"],
        "tags": ["solutions", "negotiation"]
    },
    {
        "headword": "settle",
        "pronunciation": "/ˈsetl/",
        "partOfSpeech": "verb",
        "definition": "Resolve or reach an agreement about an argument, dispute, or problem.",
        "example": "The neighbors agreed to settle their fence dispute amicably without involving civil courts.",
        "translation": "يسوّي / يحل الخلاف ودياً",
        "exampleArabic": "وافق الجيران على تسوية نزاع السياج ودياً دون اللجوء إلى المحاكم المدنية.",
        "relatedForms": ["settlement"],
        "collocations": ["settle out of court", "settle a quarrel"],
        "synonyms": ["resolve", "clear up", "reconcile"],
        "antonyms": ["prolong", "aggravate"],
        "tags": ["solutions", "peace"]
    },
    {
        "headword": "pacify",
        "pronunciation": "/ˈpæsɪfaɪ/",
        "partOfSpeech": "verb",
        "definition": "Quell the anger, agitation, or excitement of someone.",
        "example": "The store manager offered a full refund and gift voucher to pacify the furious customer.",
        "translation": "يهدئ / يسكّن غضب المنفعل",
        "exampleArabic": "عرض مدير المتجر استرداداً كاملاً للمبلغ وقسيمة هدايا لتهدئة العميل الغاضب وتسكين ثورته.",
        "relatedForms": ["pacification", "pacific"],
        "collocations": ["pacify the crowd", "attempt to pacify"],
        "synonyms": ["calm", "placate", "appease"],
        "antonyms": ["enrage", "provoke"],
        "tags": ["solutions", "peace"]
    },
    {
        "headword": "appease",
        "pronunciation": "/əˈpiːz/",
        "partOfSpeech": "verb",
        "definition": "Pacify or placate someone by acceding to their demands.",
        "example": "Making unreasonable concessions simply to appease a bully rarely creates lasting peace.",
        "translation": "يسترضي / يهادن لتفادي الصدام",
        "exampleArabic": "إن تقديم تنازلات غير معقولة لمجرد استرضاء متنمر نادراً ما يخلق سلاماً دائماً.",
        "relatedForms": ["appeasement"],
        "collocations": ["appease critics", "policy of appeasement"],
        "synonyms": ["placate", "conciliate", "satisfy"],
        "antonyms": ["provoke", "antagonize"],
        "tags": ["solutions", "peace"]
    },
    {
        "headword": "placate",
        "pronunciation": "/pləˈkeɪt/",
        "partOfSpeech": "verb",
        "definition": "Make someone less angry or hostile, usually through gentle concessions or soothing words.",
        "example": "She tried to placate her upset colleague by acknowledging that his frustration was entirely valid.",
        "translation": "يسترضي / يهدئ الخواطر ويزيل الغضب",
        "exampleArabic": "حاولت استرضاء زميلها المنزعج وتهدئة خاطره بالاعتراف بأن إحباطه كان مبرراً تماماً.",
        "relatedForms": ["placation"],
        "collocations": ["placate anger", "effort to placate"],
        "synonyms": ["mollify", "soothe", "calm"],
        "antonyms": ["infuriate", "irritate"],
        "tags": ["solutions", "peace"]
    },
    {
        "headword": "mollify",
        "pronunciation": "/ˈmɒlɪfaɪ/",
        "partOfSpeech": "verb",
        "definition": "Appease the anger or anxiety of someone; soften in feeling.",
        "example": "A heartfelt handwritten apology did much to mollify the client’s understandable indignation.",
        "translation": "يلطف / يهدئ حدة الغضب ويسكن الألم",
        "exampleArabic": "فعل الاعتذار الصادق المكتوب بخط اليد الكثير لتلطيف استياء العميل وغضبه المبرر.",
        "relatedForms": ["mollification"],
        "collocations": ["mollify concerns", "seek to mollify"],
        "synonyms": ["soothe", "pacify", "appease"],
        "antonyms": ["inflame", "exasperate"],
        "tags": ["solutions", "peace"]
    },
    {
        "headword": "harmonize",
        "pronunciation": "/ˈhɑːmənaɪz/",
        "partOfSpeech": "verb",
        "definition": "Bring into agreement, accord, or harmonious consistency.",
        "example": "The executive committee worked hard to harmonize conflicting departmental safety regulations.",
        "translation": "يوائم / ينسق ويجعل الأمور متناغمة ومتوافقة",
        "exampleArabic": "عملت اللجنة التنفيذية بجد لمواءمة لوائح السلامة المتضاربة بين الأقسام وتنسيقها.",
        "relatedForms": ["harmonization", "harmony"],
        "collocations": ["harmonize policies", "harmonize relations"],
        "synonyms": ["coordinate", "reconcile", "align"],
        "antonyms": ["clash", "disrupt"],
        "tags": ["solutions", "peace"]
    },
    {
        "headword": "intervene",
        "pronunciation": "/ˌɪntəˈviːn/",
        "partOfSpeech": "verb",
        "definition": "Come between parties in conflict to prevent or alter a result or course of events.",
        "example": "The teacher had to intervene swiftly before the playground squabble turned into a fight.",
        "translation": "يتدخل / يتدخل لفض النزاع والحيلولة دون تفاقمه",
        "exampleArabic": "اضطرت المعلمة إلى التدخل سريعاً قبل أن تتحول مشاحنة فناء المدرسة إلى شجار.",
        "relatedForms": ["intervention"],
        "collocations": ["intervene directly", "intervene in a crisis"],
        "synonyms": ["step in", "intercede", "arbitrate"],
        "antonyms": ["withdraw", "ignore"],
        "tags": ["solutions", "mediation"]
    },
    {
        "headword": "peacemaker",
        "pronunciation": "/ˈpiːsmeɪkə/",
        "partOfSpeech": "noun",
        "definition": "A person who brings about peace, especially by reconciling disputing parties.",
        "example": "Aunt Sarah was the natural peacemaker of the extended family, always soothing hurt feelings.",
        "translation": "صانع سلام / مصلح يسعى للوفاق",
        "exampleArabic": "كانت العمة سارة صانعة السلام الطبيعية في العائلة الممتدة، ودائماً ما تلطف المشاعر المجروحة.",
        "relatedForms": ["peacemaking"],
        "collocations": ["act as peacemaker", "natural peacemaker"],
        "synonyms": ["conciliator", "mediator", "arbitrator"],
        "antonyms": ["troublemaker", "instigator"],
        "tags": ["solutions", "roles"]
    },
    {
        "headword": "truce",
        "pronunciation": "/truːs/",
        "partOfSpeech": "noun",
        "definition": "An agreement between enemies or opponents to stop fighting or arguing for a certain period.",
        "example": "The exhausting debate concluded when both factions agreed to a weekend truce to reconsider their positions.",
        "translation": "هدنة / وقف مؤقت للخصومة والنزاع",
        "exampleArabic": "اختتم الجدال المنهك عندما وافق كلا الفصيلين على هدنة في عطلة نهاية الأسبوع لإعادة النظر في مواقفهما.",
        "relatedForms": [],
        "collocations": ["call a truce", "temporary truce"],
        "synonyms": ["ceasefire", "armistice", "suspension"],
        "antonyms": ["hostilities", "warfare"],
        "tags": ["solutions", "peace"]
    },
    {
        "headword": "ceasefire",
        "pronunciation": "/ˈsiːsfaɪə/",
        "partOfSpeech": "noun",
        "definition": "A temporary or permanent suspension of fighting; a truce.",
        "example": "International ambassadors negotiated a humanitarian ceasefire to allow food convoys into the besieged region.",
        "translation": "وقف إطلاق النار / إنهاء الاقتتال",
        "exampleArabic": "فاوض السفراء الدوليون على وقف إطلاق نار إنساني للسماح لقوافل الغذاء بدخول المنطقة المحاصرة.",
        "relatedForms": [],
        "collocations": ["declare a ceasefire", "violate a ceasefire"],
        "synonyms": ["truce", "armistice"],
        "antonyms": ["hostilities", "attack"],
        "tags": ["solutions", "peace"]
    },
    {
        "headword": "treaty",
        "pronunciation": "/ˈtriːti/",
        "partOfSpeech": "noun",
        "definition": "A formally concluded and ratified agreement between sovereign states or large organizations.",
        "example": "The historic peace treaty formally established maritime trade corridors and restored diplomatic relations.",
        "translation": "معاهدة / ميثاق واتفاقية ملزمة",
        "exampleArabic": "أرست معاهدة السلام التاريخية ممرات التجارة البحرية رسمياً وأعادت العلاقات الدبلوماسية.",
        "relatedForms": [],
        "collocations": ["sign a treaty", "ratify a treaty"],
        "synonyms": ["accord", "pact", "covenant"],
        "antonyms": [],
        "tags": ["solutions", "legal"]
    },
    {
        "headword": "accord",
        "pronunciation": "/əˈkɔːd/",
        "partOfSpeech": "noun",
        "definition": "An official agreement or treaty; state of mutual concord and agreement.",
        "example": "The signing of the bilateral climate accord represented years of dedicated multilateral diplomacy.",
        "translation": "اتفاق / وفاق وميثاق تفاهم",
        "exampleArabic": "مثّل توقيع اتفاق المناخ الثنائي سنوات من الدبلوماسية المتعددة الأطراف المخلصة.",
        "relatedForms": [],
        "collocations": ["reach an accord", "peace accord"],
        "synonyms": ["pact", "agreement", "treaty"],
        "antonyms": ["discord", "disagreement"],
        "tags": ["solutions", "peace"]
    },
    {
        "headword": "consensus",
        "pronunciation": "/kənˈsensəs/",
        "partOfSpeech": "noun",
        "definition": "A general agreement reached by a group as a whole.",
        "example": "After exhaustive deliberations, the medical council reached a unanimous consensus on the new surgical guidelines.",
        "translation": "إجماع / توافق عام في الرأي",
        "exampleArabic": "بعد مداولات مستفيضة، توصل المجلس الطبي إلى إجماع وتوافق تام في الرأي حول الإرشادات الجراحية الجديدة.",
        "relatedForms": [],
        "collocations": ["reach a consensus", "broad consensus"],
        "synonyms": ["unanimity", "agreement", "concurrence"],
        "antonyms": ["dissension", "disagreement"],
        "tags": ["solutions", "negotiation"]
    },
    {
        "headword": "concession",
        "pronunciation": "/kənˈseʃn/",
        "partOfSpeech": "noun",
        "definition": "A thing that is granted or yielded, especially in response to demands during negotiations.",
        "example": "Offering a fair salary bonus was a strategic concession that secured the signature of the union representatives.",
        "translation": "تنازل / مكسب ممنوح في المفاوضات",
        "exampleArabic": "كان تقديم مكافأة راتب عادلة تنازلاً استراتيجياً ضمن توقيع ممثلي النقابة.",
        "relatedForms": ["concede"],
        "collocations": ["make concessions", "major concession"],
        "synonyms": ["compromise", "allowance", "grant"],
        "antonyms": ["demand", "refusal"],
        "tags": ["solutions", "negotiation"]
    }
]

grammar_data = [
    {
        "title": "Make / Let / Help + Object + Verb",
        "explanation": "Causative and permissive verbs ('make', 'let', 'help') express how an agent influences another person's actions. 1) 'Make + object + base verb' means forcing or compelling someone to do something ('The mediator made them listen to each other'). Notice: NEVER use 'to' with 'make' in the active voice! 2) 'Let + object + base verb' means permitting or allowing someone to do something ('She let him explain his perspective'). NEVER use 'to' with 'let'! 3) 'Help + object + (to) base verb' means assisting someone. 'Help' is unique because it can be followed by either the bare infinitive (base verb) or the to-infinitive ('He helped them resolve the dispute' OR 'He helped them to resolve the dispute').",
        "explanationArabic": "أفعال السببية والسماح (Make و Let و Help) تعبر عن كيفية تأثير الفاعل على تصرفات شخص آخر. 1) الصيغة (make + المفعول به + الفعل المجرد): تعني إجبار شخص أو إلزامه بفعل شيء ما ('أجبرهم الوسيط على الاستماع لبعضهم'). تذكر: لا نستخدم to إطلاقاً مع make في المبني للمعلوم! 2) الصيغة (let + المفعول به + الفعل المجرد): تعني السماح أو الإذن لشخص بفعل شيء ('سمحت له بشرح وجهة نظره'). ولا تأخذ to أبداً! 3) الفعل (help + المفعول به + الفعل المجرد أو to + الفعل): يعني المساعدة، وميزته أنه يقبل كلا الصياغتين ('ساعدهم على حل النزاع' سواءً help them settle أو help them to settle).",
        "rules": [
            "Make + Object + Bare Infinitive (Verb without to): Expresses compulsion or requirement ('He made me rewrite the report').",
            "Let + Object + Bare Infinitive (Verb without to): Expresses permission or allowing ('They let us negotiate the terms').",
            "Help + Object + Bare Infinitive OR to + Verb: Expresses assistance ('She helped him de-escalate the tension' or 'She helped him to de-escalate the tension').",
            "Never use 'to' after 'make' or 'let' in active sentences (Wrong: 'She let him to speak')."
        ],
        "rulesArabic": [
            "Make + المفعول + المصدر المجرد بدون to: يفيد الإلزام أو الإجبار.",
            "Let + المفعول + المصدر المجرد بدون to: يفيد الإذن والسماح.",
            "Help + المفعول + المصدر المجرد (أو to + المصدر): يفيد المعاونة والمساعدة، وكلا الخيارين صحيح لغوياً.",
            "تحذير: لا تضع to بعد make أو let في الجمل العادية المبنية للمعلوم."
        ],
        "structures": [
            {
                "pattern": "Subject + make(s)/made + Object + Base Verb",
                "explanation": "Compelling someone to perform an action.",
                "explanationArabic": "إلزام شخص أو إجباره على أداء الفعل."
            },
            {
                "pattern": "Subject + let(s) + Object + Base Verb",
                "explanation": "Permitting someone to perform an action.",
                "explanationArabic": "السماح لشخص أو الإذن له بأداء الفعل."
            },
            {
                "pattern": "Subject + help(s)/helped + Object + (to) + Base Verb",
                "explanation": "Assisting someone to perform an action.",
                "explanationArabic": "مساعدة شخص على إنجاز الفعل."
            }
        ],
        "examples": [
            {
                "sentence": "The experienced peacemaker helped the colleagues de-escalate their fierce altercation.",
                "translation": "ساعد صانع السلام المخضرم الزملاء على نزع فتيل مشادتهم الشرسة وتخفيف حدتها.",
                "usesVocabulary": ["peacemaker", "de-escalate", "altercation"]
            },
            {
                "sentence": "The manager let both parties explain their perspectives before trying to mediate.",
                "translation": "سمح المدير لكلا الطرفين بشرح وجهات نظرهما قبل محاولة التوسط بينهما.",
                "usesVocabulary": ["mediate"]
            },
            {
                "sentence": "Strict boardroom protocol made the hostile executives concede the accounting discrepancy.",
                "translation": "ألزم بروتوكول قاعة الاجتماعات الصارم المديرين المتخاصمين بالإقرار بالتناقض المحاسبي.",
                "usesVocabulary": ["concede"]
            },
            {
                "sentence": "Diplomatic counselors help conflicting delegates harmonize their trade regulations.",
                "translation": "يساعد المستشارون الدبلوماسيون الوفود المتنازعة على مواءمة لوائحهم التجارية وتنسيقها.",
                "usesVocabulary": ["harmonize"]
            }
        ],
        "commonMistakes": [
            {
                "wrong": "The director made the team to compromise on the delivery deadline.",
                "right": "The director made the team compromise on the delivery deadline.",
                "note": "'Make' is followed by the base verb without 'to' in active voice.",
                "noteArabic": "الفعل make يُتبع بالمصدر المجرد بدون to في جمل المبني للمعلوم."
            },
            {
                "wrong": "Please let me to clarify the misunderstanding.",
                "right": "Please let me clarify the misunderstanding.",
                "note": "'Let' + object is always followed directly by the bare verb without 'to'.",
                "noteArabic": "الفعل let متبوعاً بالمفعول به يأخذ دائماً الفعل المجرد بدون to."
            }
        ]
    }
]

convs_data = [
    {
        "title": "Cooling Down an Office Argument",
        "titleArabic": "تهدئة جدال محتدم في المكتب",
        "setting": "Quiet corridor outside the open-plan marketing zone",
        "settingArabic": "ممر هادئ خارج منطقة التسويق المفتوحة",
        "roles": ["Department Manager", "Team Lead"],
        "vocabularyUsed": ["altercation", "bickering", "clash", "confrontation", "accuse", "provoke", "retaliate", "escalate", "de-escalate"],
        "lines": [
            {
                "speaker": "Rami",
                "text": "Mona, I had to step out because that noisy altercation between Kareem and Dania was getting out of hand.",
                "translation": "منى، اضطررت للخروج لأن تلك المشادة الصاخبة بين كريم ودانية كادت تخرج عن السيطرة."
            },
            {
                "speaker": "Mona",
                "text": "I noticed. Their constant bickering about deadline distribution has turned into a major clash of personalities.",
                "translation": "لقد لاحظت ذلك. إن مناكفاتهم المستمرة حول توزيع المواعيد النهائية قد تحولت إلى صدام كبير في الطباع والنزعات."
            },
            {
                "speaker": "Rami",
                "text": "Neither of them wanted to back down, and Dania seemed ready for an aggressive confrontation in front of everyone.",
                "translation": "لم يرغب أي منهما في التراجع، وبدت دانية مستعدة لمواجهة عدوانية ومجابهة مباشرة أمام الجميع."
            },
            {
                "speaker": "Mona",
                "text": "Kareem tried to provoke her by rolling his eyes, which only made her accuse him of sabotaging the project.",
                "translation": "حاول كريم استفزازها بقلب عينيه سخرية، وهو ما دفعها فقط إلى اتهامه بتخريب المشروع."
            },
            {
                "speaker": "Rami",
                "text": "Then he threatened to retaliate by withholding his graphic assets. That made the dispute escalate rapidly.",
                "translation": "ثم هدد بالانتقام والرد بالمثل من خلال حجب أصوله الرسومية. جعل ذلك الخلاف يتصاعد بسرعة."
            },
            {
                "speaker": "Mona",
                "text": "We need to step in and help them de-escalate before this damages overall team morale.",
                "translation": "نحن بحاجة إلى التدخل ومساعدتهم على تهدئة الموقف ونزع فتيله قبل أن يلحق ذلك الضرر بالروح المعنوية للفريق ككل."
            },
            {
                "speaker": "Rami",
                "text": "I will invite them for a private coffee and let each person express their grievances without interruptions.",
                "translation": "سأدعوهما لتناول قهوة على انفراد وسأسمح لكل شخص بالتعبير عما يضايقه دون مقاطعات."
            },
            {
                "speaker": "Mona",
                "text": "That is wise. Listening calmly will make them realize that their professional goals are completely aligned.",
                "translation": "هذا تصرف حكيم. إن الاستماع بهدوء سيجعلهم يدركون أن أهدافهم المهنية متوافقة تماماً."
            }
        ]
    },
    {
        "title": "Constructive Communication Guidelines",
        "titleArabic": "إرشادات التواصل البناء وفض الخلافات",
        "setting": "Company training seminar on workplace emotional intelligence",
        "settingArabic": "ندوة تدريبية للشركة حول الذكاء العاطفي في بيئة العمل",
        "roles": ["HR Consultant", "Participant"],
        "vocabularyUsed": ["contention", "discord", "dispute", "friction", "insult", "criticize", "contradict", "interrupt", "belittle"],
        "lines": [
            {
                "speaker": "Consultant",
                "text": "Welcome, everyone. Today we examine why minor friction among talented peers frequently turns into destructive discord.",
                "translation": "أهلاً بالجميع. اليوم ندرس لماذا يتحول الاحتكاك البسيط بين الزملاء الموهوبين في كثير من الأحيان إلى شقاق وتنافر هدام."
            },
            {
                "speaker": "Tariq",
                "text": "In our branch, the allocation of remote-work days has become a bitter bone of contention.",
                "translation": "في فرعنا، أصبح توزيع أيام العمل عن بُعد نقطة خلاف ونزاع مريرة."
            },
            {
                "speaker": "Consultant",
                "text": "When disagreements occur, how do people typically communicate during the dispute?",
                "translation": "عندما تقع الخلافات، كيف يتواصل الناس عادة أثناء النزاع؟"
            },
            {
                "speaker": "Tariq",
                "text": "Frustrated staff often criticize colleagues openly, and some even interrupt speakers while they present arguments.",
                "translation": "غالباً ما ينتقد الموظفون المحبطون زملاءهم علانية، بل إن البعض يقاطع المتحدثين أثناء تقديمهم لحججهم."
            },
            {
                "speaker": "Consultant",
                "text": "Does anyone contradict stated facts without presenting alternative data?",
                "translation": "هل يناقض أحد الحقائق المعلنة دون تقديم بيانات بديلة؟"
            },
            {
                "speaker": "Tariq",
                "text": "Yes, and the worst part is when senior leads belittle junior suggestions with subtle sarcasm.",
                "translation": "نعم، والأسوأ هو عندما يقلل كبار القادة من شأن اقتراحات المبتدئين بسخرية خفية."
            },
            {
                "speaker": "Consultant",
                "text": "Degrading speech is practically an insult. We must let people express ideas safely without fear of mockery.",
                "translation": "إن الكلام الذي يحط من القدر بمثابة إهانة فعلية. يجب أن نسمح للناس بالتعبير عن أفكارهم بأمان دون خوف من السخرية."
            },
            {
                "speaker": "Tariq",
                "text": "Establishing clear meeting protocols will certainly help prevent misunderstandings before they fester.",
                "translation": "إن وضع بروتوكولات اجتماعات واضحة سيساعد بالتأكيد على منع سوء الفهم قبل أن يستفحل."
            }
        ]
    },
    {
        "title": "Reaching an Amicable Agreement",
        "titleArabic": "التوصل إلى تسوية واتفاق ودي",
        "setting": "Neutral law firm conference room with panoramic harbor views",
        "settingArabic": "غرفة اجتماعات محايدة بشركة محاماة تطل على مناظر بانورامية للميناء",
        "roles": ["Mediator", "Co-founder"],
        "vocabularyUsed": ["standoff", "impasse", "mediate", "negotiate", "arbitrate", "reconcile", "concede", "compromise", "settle"],
        "lines": [
            {
                "speaker": "Mediator",
                "text": "Good morning. We are here to help both founders break the prolonged standoff regarding software patents.",
                "translation": "صباح الخير. نحن هنا لمساعدة كلا المؤسسين على كسر مأزق المواجهة المتوترة المطول بشأن براءات اختراع البرمجيات."
            },
            {
                "speaker": "Zaid",
                "text": "Thank you. Our private talks reached a complete impasse last month because neither side wanted to yield equity.",
                "translation": "شكراً لك. وصلت محادثاتنا الخاصة إلى طريق مسدود تماماً الشهر الماضي لأن كلا الجانبين رفض التنازل عن حصص الملكية."
            },
            {
                "speaker": "Mediator",
                "text": "My duty is to mediate objectively, not to arbitrate as an authoritarian judge who imposes terms.",
                "translation": "واجبى هو التوسط بنزاهة وموضوعية، وليس التحكيم كقاضٍ متسلط يفرض الشروط."
            },
            {
                "speaker": "Zaid",
                "text": "We truly want to reconcile our partnership and protect the brand we built together from scratch.",
                "translation": "نحن نريد حقاً مصالحة شراكتنا وإصلاح ذات البين لحماية العلامة التجارية التي بنيناها معاً من الصفر."
            },
            {
                "speaker": "Mediator",
                "text": "To negotiate effectively, both of you must be ready to concede minor points in good faith.",
                "translation": "للتفاوض بفاعلية، يجب أن يكون كلاكما على استعداد للإقرار بنقاط ثانوية والتنازل عنها بحسن نية."
            },
            {
                "speaker": "Zaid",
                "text": "I am willing to compromise on licensing rights if my partner agrees to retain our research engineers.",
                "translation": "أنا مستعد للتوصل إلى حل وسط بشأن حقوق الترخيص إذا وافق شريكي على الإبقاء على مهندسي الأبحاث لدينا."
            },
            {
                "speaker": "Mediator",
                "text": "That is an excellent concession. It demonstrates that you genuinely want to settle this dispute out of court.",
                "translation": "هذا تنازل ممتاز. إنه يثبت أنك تريد حقاً تسوية هذا النزاع وحله ودياً خارج أسوار المحكمة."
            },
            {
                "speaker": "Zaid",
                "text": "Let us draft the term sheet immediately so our employees can regain stability and peace of mind.",
                "translation": "دعنا نصوغ ورقة الشروط على الفور حتى يتمكن موظفونا من استعادة الاستقرار وراحة البال."
            }
        ]
    }
]

para1_text = (
    "When organizations neglect internal communication, destructive dissension spreads quietly through the ranks. "
    "A minor unresolved squabble between team leads can ignite a bitter, longstanding feud that poisons department "
    "culture. Lingering hostility erodes daily trust, creating a painful rift that separates once-collaborative units. "
    "This corrosive environment fuels civil strife, dragging productive employees into endless bureaucratic wrangling over "
    "resources. Deep-rooted personal antagonism blinds executives to shared strategic objectives, turning innovative "
    "workplaces into defensive battlegrounds. Without structured interventions, factional bitterness inevitably paralyzes "
    "institutional progress and drains valuable creative energy."
)

para2_text = (
    "Historical conflicts demonstrate that what begins as a minor misunderstanding can deteriorate into a vindictive "
    "personal vendetta if pride prevents dialogue. Wise diplomats know that trying to pacify an outraged opponent through "
    "condescension never succeeds. Instead, skilled negotiators work patiently to appease legitimate fears and placate "
    "wounded dignity with respectful listening. A sincere apology can mollify deep resentment that years of legal arguments "
    "failed to diminish. When leaders actively intervene to harmonize conflicting interests, they transform bitter "
    "adversaries into constructive partners working toward shared prosperity."
)

para3_text = (
    "Achieving lasting peace requires the courageous dedication of an impartial peacemaker who values mutual respect over "
    "triumphalism. During protracted international crises, negotiating a temporary truce or humanitarian ceasefire provides "
    "urgently needed relief to vulnerable civilians. These fragile pauses allow diplomats to draft a comprehensive peace "
    "treaty that addresses root grievances. When opposing states formally sign a binding bilateral accord, they demonstrate "
    "that consensus is achievable even after decades of hostility. Every meaningful concession made during negotiations "
    "paves the way toward sustainable stability and future cooperation."
)

paras_data = [
    {
        "title": "The Roots of Organizational Strife",
        "titleArabic": "جذور النزاع والفرقة في المؤسسات",
        "kind": "informative",
        "text": para1_text,
        "translation": "عندما تهمل المؤسسات التواصل الداخلي، ينتشر الانشقاق والفرقة الهدامة بهدوء في صفوفها. ويمكن لمشاحنة بسيطة لم تُحل بين قادة الفرق أن تشعل عداوة موروثة وخصومة مريرة تفسد ثقافة القسم. ويؤدي العداء المستمر إلى تآكل الثقة اليومية، مما يخلق صدعاً وقطيعة مؤلمة تفصل بين وحدات كانت متعاونة ذات يوم. وتغذي هذه البيئة التآكلية الفتنة والصراع الداخلي، جارّة الموظفين المنتجين إلى مماحكات وجدالات بيروقراطية لا تنتهي حول الموارد. ويعمي العداء والخصومة الشخصية المتجذرة المديرين التنفيذيين عن الأهداف الاستراتيجية المشتركة، محولة أماكن العمل المبتكرة إلى ساحات معارك دفاعية. ودون تدخلات منظمة، يشل استياء الفصائل حتماً التقدم المؤسسي ويستنزف الطاقة الإبداعية القيمة.",
        "vocabularyUsed": ["dissension", "feud", "hostility", "rift", "squabble", "strife", "wrangling", "antagonism"]
    },
    {
        "title": "De-escalating Bitter Feuds",
        "titleArabic": "نزع فتيل الخصومات وتهدئة النفوس",
        "kind": "reflective",
        "text": para2_text,
        "translation": "تثبت النزاعات التاريخية أن ما يبدأ كسوء فهم بسيط يمكن أن يتدهور إلى حرب ثأر وانتقام شخصية إذا حال الكبرياء دون الحوار. ويدرك الدبلوماسيون الحكماء أن محاولة تهدئة خصم غاضب وتسجيل ثورته من خلال التعالي لا تنجح أبداً. وبدلاً من ذلك، يعمل المفاوضون المهرة بصبر لاسترضاء المخاوف المشروعة وتهدئة الخواطر والكرامة المجروحة من خلال الاستماع المحترم. ويمكن لاعتذار صادق أن يلطف الضغينة والاستياء العميق الذي عجزت سنوات من المرافعات القانونية عن تخفيفه. وعندما يتدخل القادة بنشاط لمواءمة المصالح المتضاربة وتنسيقها، فإنهم يحولون الخصوم الألداء إلى شركاء بنائين يعملون من أجل الرخاء المشترك.",
        "vocabularyUsed": ["vendetta", "misunderstanding", "pacify", "appease", "placate", "mollify", "harmonize", "intervene"]
    },
    {
        "title": "The Architecture of Enduring Peace",
        "titleArabic": "بناء السلام الدائم والوفاق",
        "kind": "persuasive",
        "text": para3_text,
        "translation": "يتطلب تحقيق السلام الدائم تفانياً شجاعاً من صانع سلام محايد يقدم الاحترام المتبادل على التباهي بالنصر. وخلال الأزمات الدولية التي طال أمدها، فإن التفاوض على هدنة مؤقتة أو وقف إطلاق نار إنساني يوفر إغاثة ملحة للمدنيين المستضعفين. وتتيح هذه الوقفات المؤقتة والهشة للدبلوماسيين صياغة معاهدة سلام شاملة تعالج المظالم الجذرية. وعندما توقع الدول المتخاصمة رسمياً اتفاق ووفاق سلام ملزم، فإنها تبرهن على أن الإجماع والتوافق ممكن حتى بعد عقود من العداء. وكل تنازل هادف يُقدم أثناء المفاوضات يمهد الطريق نحو استقرار مستدام وتعاون مستقبلي.",
        "vocabularyUsed": ["peacemaker", "truce", "ceasefire", "treaty", "accord", "consensus", "concession"]
    }
]

# Write out python file
with open("scripts/data_day46.py", "w", encoding="utf-8") as f:
    f.write("# -*- coding: utf-8 -*-\n")
    f.write('"""Data definition for Day 46: Arguments and Solutions."""\n\n')
    f.write("true = True\nfalse = False\n\n")
    f.write(f"vocab_day46 = {json.dumps(vocab_data, ensure_ascii=False, indent=4)}\n\n")
    f.write(f"grammar_day46 = {json.dumps(grammar_data, ensure_ascii=False, indent=4)}\n\n")
    f.write(f"convs_day46 = {json.dumps(convs_data, ensure_ascii=False, indent=4)}\n\n")
    f.write(f"paras_day46 = {json.dumps(paras_data, ensure_ascii=False, indent=4)}\n")

print("Successfully created scripts/data_day46.py")

from scripts.curriculum_engine import write_day
write_day(46, vocab_data, grammar_data, convs_data, paras_data)
