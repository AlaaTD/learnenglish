# -*- coding: utf-8 -*-
"""Generator for Day 47: Celebrations."""

import json

vocab_data = [
    {
        "headword": "carnival",
        "pronunciation": "/ˈkɑːnɪvl/",
        "partOfSpeech": "noun",
        "definition": "A lively public festival involving music, dancing, colorful costumes, and parades.",
        "example": "Thousands of excited visitors danced through the streets during the annual summer carnival.",
        "translation": "كرنفال / مهرجان شعبي صاخب ومبهج",
        "exampleArabic": "رقص الآلاف من الزوار المتحمسين عبر الشوارع خلال الكرنفال الصيفي السنوي.",
        "relatedForms": ["carnivalesque"],
        "collocations": ["street carnival", "annual carnival"],
        "synonyms": ["festival", "fiesta", "jamboree"],
        "antonyms": [],
        "tags": ["celebrations", "festivals"]
    },
    {
        "headword": "commemoration",
        "pronunciation": "/kəˌmeməˈreɪʃn/",
        "partOfSpeech": "noun",
        "definition": "A ceremony or event honoring the memory of a person or significant historical event.",
        "example": "A solemn civic commemoration was held at the town square to honor fallen veterans.",
        "translation": "إحياء ذكرى / مراسم تأبين وتكريم",
        "exampleArabic": "أقيمت مراسم إحياء ذكرى وتأبين مهيبة في ساحة البلدة تكريماً للمحاربين القدامى الراحلين.",
        "relatedForms": ["commemorate", "commemorative"],
        "collocations": ["solemn commemoration", "annual commemoration"],
        "synonyms": ["memorial", "tribute", "observance"],
        "antonyms": [],
        "tags": ["celebrations", "traditions"]
    },
    {
        "headword": "conviviality",
        "pronunciation": "/kənˌvɪviˈæləti/",
        "partOfSpeech": "noun",
        "definition": "The quality of being friendly, lively, welcoming, and enjoyable in social gatherings.",
        "example": "The family banquet was filled with laughter, music, and the warm conviviality of lifelong friends.",
        "translation": "أنس ومسامرة / بهجة المعاشرة والمودة الدافئة",
        "exampleArabic": "امتلأت المأدبة العائلية بالضحك والموسيقى والأنس والمسامرة الدافئة لأصدقاء العمر.",
        "relatedForms": ["convivial", "convivially"],
        "collocations": ["warm conviviality", "spirit of conviviality"],
        "synonyms": ["geniality", "festivity", "sociability"],
        "antonyms": ["aloofness", "hostility"],
        "tags": ["celebrations", "social"]
    },
    {
        "headword": "extravaganza",
        "pronunciation": "/ɪkˌstrævəˈɡænzə/",
        "partOfSpeech": "noun",
        "definition": "An elaborate, spectacular, and lavish entertainment or celebration.",
        "example": "The hotel grand opening featured a two-hour musical extravaganza with acrobats and laser shows.",
        "translation": "عرض استعراضي باذخ / مهرجان احتفالي ضخم",
        "exampleArabic": "تضمن الافتتاح الكبير للفندق عرضاً استعراضياً موسيقياً باذخاً استمر ساعتين مع لاعبي أكروبات وعروض ليزر.",
        "relatedForms": [],
        "collocations": ["musical extravaganza", "multimedia extravaganza"],
        "synonyms": ["spectacle", "pageant", "showcase"],
        "antonyms": [],
        "tags": ["celebrations", "entertainment"]
    },
    {
        "headword": "festival",
        "pronunciation": "/ˈfestɪvl/",
        "partOfSpeech": "noun",
        "definition": "A day or period of celebration, typically a religious or cultural one with performances.",
        "example": "The ancient lantern festival attracted travelers from all corners of the globe.",
        "translation": "مهرجان / احتفال ثقافي أو ديني دوري",
        "exampleArabic": "اجتذب مهرجان الفوانيس القديم مسافرين من جميع أنحاء المعمورة.",
        "relatedForms": ["festive", "festivity"],
        "collocations": ["film festival", "lantern festival"],
        "synonyms": ["celebration", "fiesta", "carnival"],
        "antonyms": [],
        "tags": ["celebrations", "culture"]
    },
    {
        "headword": "festivity",
        "pronunciation": "/feˈstɪvəti/",
        "partOfSpeech": "noun",
        "definition": "The celebration of something in a joyful and lively way, or festive activities.",
        "example": "The wedding festivities continued into the early morning with traditional folk dances.",
        "translation": "احتفالية / مظاهر البهجة والسرور في العرس أو العيد",
        "exampleArabic": "استمرت الاحتفالات ومظاهر البهجة في الزفاف حتى الصباح الباكر مع الرقصات الشعبية التقليدية.",
        "relatedForms": ["festive"],
        "collocations": ["holiday festivities", "join the festivity"],
        "synonyms": ["celebration", "revelry", "merriment"],
        "antonyms": ["gloom", "solemnity"],
        "tags": ["celebrations", "joy"]
    },
    {
        "headword": "fiesta",
        "pronunciation": "/fiˈestə/",
        "partOfSpeech": "noun",
        "definition": "A festival, religious feast day, or lively public carnival especially in Spanish-speaking cultures.",
        "example": "The neighborhood organized a street fiesta with homemade paella, acoustic guitars, and dancing.",
        "translation": "فييستا / مهرجان شعبي بهيج",
        "exampleArabic": "نظم الحي مهرجاناً شعبياً في الشارع مع طبق الباييلا المحضر منزلياً والغيتارات الكلاسيكية والرقص.",
        "relatedForms": [],
        "collocations": ["street fiesta", "lively fiesta"],
        "synonyms": ["party", "carnival", "festival"],
        "antonyms": [],
        "tags": ["celebrations", "culture"]
    },
    {
        "headword": "gala",
        "pronunciation": "/ˈɡɑːlə/",
        "partOfSpeech": "noun",
        "definition": "A festive celebration, especially a glamorous social event with entertainment and formal dinner.",
        "example": "Philanthropists gathered at the charity gala and raised over a million dollars for pediatric healthcare.",
        "translation": "حفل خيري راقٍ / مهرجان فاخر",
        "exampleArabic": "اجتمع فاعلو الخير في الحفل الخيري الفاخر وجمعوا أكثر من مليون دولار لرعاية صحة الأطفال.",
        "relatedForms": [],
        "collocations": ["charity gala", "gala dinner"],
        "synonyms": ["extravaganza", "soiree", "benefit"],
        "antonyms": [],
        "tags": ["celebrations", "formal"]
    },
    {
        "headword": "jubilee",
        "pronunciation": "/ˈdʒuːbɪliː/",
        "partOfSpeech": "noun",
        "definition": "A special anniversary of an event, especially one celebrating twenty-five, fifty, or sixty years.",
        "example": "The entire nation celebrated the monarch's golden jubilee with parades, fireworks, and public holidays.",
        "translation": "يوبيل / عيد سنوي فارق واحتفال بذكرى عريقة",
        "exampleArabic": "احتفلت الأمة بأسرها باليوبيل الذهبي للملك بالمواكب والألعاب النارية والعطلات الرسمية.",
        "relatedForms": [],
        "collocations": ["silver jubilee", "golden jubilee", "diamond jubilee"],
        "synonyms": ["anniversary", "commemoration", "centenary"],
        "antonyms": [],
        "tags": ["celebrations", "milestones"]
    },
    {
        "headword": "pageant",
        "pronunciation": "/ˈpædʒənt/",
        "partOfSpeech": "noun",
        "definition": "A public entertainment consisting of a procession of people in elaborate, colorful costumes.",
        "example": "The historical pageant enacted scenes from the founding of the city using authentic period costumes.",
        "translation": "استعراض تاريخي مسرحي / موكب تمثيلي مبهر",
        "exampleArabic": "جسد الاستعراض المسرحي التاريخي مشاهد من تأسيس المدينة باستخدام أزياء تراثية أصيلة.",
        "relatedForms": ["pageantry"],
        "collocations": ["historical pageant", "colorful pageant"],
        "synonyms": ["spectacle", "parade", "tableau"],
        "antonyms": [],
        "tags": ["celebrations", "culture"]
    },
    {
        "headword": "revelry",
        "pronunciation": "/ˈrevlri/",
        "partOfSpeech": "noun",
        "definition": "Lively and noisy festivities, especially when these involve drinking and merrymaking.",
        "example": "The sounds of midnight revelry echoed across the harbor as the New Year approached.",
        "translation": "صخب الاحتفال / سمر ومرح صاخب",
        "exampleArabic": "ترددت أصوات سمر وصخب الاحتفال في منتصف الليل عبر الميناء مع اقتراب العام الجديد.",
        "relatedForms": ["reveler", "revel"],
        "collocations": ["midnight revelry", "night of revelry"],
        "synonyms": ["merrymaking", "celebration", "festivity"],
        "antonyms": ["mourning", "quietude"],
        "tags": ["celebrations", "nightlife"]
    },
    {
        "headword": "spectacle",
        "pronunciation": "/ˈspektəkl/",
        "partOfSpeech": "noun",
        "definition": "A visually striking, remarkable, or impressive event, display, or performance.",
        "example": "The opening ceremony of the international athletic games was an unforgettable visual spectacle.",
        "translation": "مشهد مذهل / استعراض بصري مبهر",
        "exampleArabic": "كان حفل افتتاح دورة الألعاب الرياضية الدولية مشهداً مذهلاً واستعراضاً بصرياً لا يُنسى.",
        "relatedForms": ["spectacular"],
        "collocations": ["grand spectacle", "visual spectacle"],
        "synonyms": ["extravaganza", "display", "phenomenon"],
        "antonyms": [],
        "tags": ["celebrations", "entertainment"]
    },
    {
        "headword": "soiree",
        "pronunciation": "/ˈswɑːreɪ/",
        "partOfSpeech": "noun",
        "definition": "An elegant evening party or gathering, typically in a private house, for conversation or music.",
        "example": "The art patron hosted an intimate musical soiree featuring a talented young violin soloist.",
        "translation": "أمسية راقية / سهرة خاصة للموسيقى والأدب",
        "exampleArabic": "استضاف راعي الفنون أمسية موسيقية راقية وحميمة أحياها عازف كمان شاب موهوب.",
        "relatedForms": [],
        "collocations": ["musical soiree", "elegant soiree"],
        "synonyms": ["evening party", "reception", "gathering"],
        "antonyms": [],
        "tags": ["celebrations", "parties"]
    },
    {
        "headword": "masquerade",
        "pronunciation": "/ˌmæskəˈreɪd/",
        "partOfSpeech": "noun",
        "definition": "A masked ball or party where guests wear fancy dress and masks.",
        "example": "Guests wore Venetian feathered masks and velvet cloaks to the historic palace masquerade.",
        "translation": "حفلة تنكرية / حفل بالأقنعة",
        "exampleArabic": "ارتدى الضيوف أقنعة فينيسية مرصعة بالريش وعباءات مخملية في الحفلة التنكرية بالقصر التاريخي.",
        "relatedForms": ["masquerader"],
        "collocations": ["masquerade ball", "attend a masquerade"],
        "synonyms": ["masked ball", "costume party"],
        "antonyms": [],
        "tags": ["celebrations", "parties"]
    },
    {
        "headword": "potluck",
        "pronunciation": "/ˈpɒtlʌk/",
        "partOfSpeech": "noun",
        "definition": "A meal or gathering where each guest or family contributes a homemade dish to share.",
        "example": "Our neighborhood association organized a festive potluck dinner in the community park pavilion.",
        "translation": "مأدبة تشاركية / وليمة يساهم فيها كل ضيف بطبق",
        "exampleArabic": "نظمت رابطة أحيائنا مأدبة عشاء تشاركية واحتفالية في مظلة حديقة الحي.",
        "relatedForms": [],
        "collocations": ["potluck dinner", "potluck lunch"],
        "synonyms": ["shared meal", "bring-a-plate"],
        "antonyms": [],
        "tags": ["celebrations", "food"]
    },
    {
        "headword": "housewarming",
        "pronunciation": "/ˈhaʊswɔːmɪŋ/",
        "partOfSpeech": "noun",
        "definition": "A party given by someone after moving into a new home, to celebrate with friends.",
        "example": "They received indoor plants and kitchen gadgets from close friends during their housewarming party.",
        "translation": "حفلة نُزُل / احتفال الانتقال إلى بيت جديد",
        "exampleArabic": "تلقوا نباتات منزلية وأدوات مطبخ من أصدقائهم المقربين خلال حفلة الانتقال إلى بيتهم الجديد.",
        "relatedForms": [],
        "collocations": ["housewarming party", "housewarming gift"],
        "synonyms": ["new-home party"],
        "antonyms": [],
        "tags": ["celebrations", "parties"]
    },
    {
        "headword": "homecoming",
        "pronunciation": "/ˈhəʊmkʌmɪŋ/",
        "partOfSpeech": "noun",
        "definition": "An annual celebration for alumni of a school or university; a return home.",
        "example": "Alumni from across thirty graduation classes returned to campus for the emotional homecoming weekend.",
        "translation": "يوم العودة للخريجين / احتفال لقاء الخريجين السنوي",
        "exampleArabic": "عاد الخريجون من ثلاثين دفعة دراسية إلى الحرم الجامعي لحضور عطلة نهاية أسبوع لقاء الخريجين المؤثرة.",
        "relatedForms": [],
        "collocations": ["homecoming game", "homecoming queen"],
        "synonyms": ["alumni reunion", "return"],
        "antonyms": [],
        "tags": ["celebrations", "milestones"]
    },
    {
        "headword": "send-off",
        "pronunciation": "/ˈsend ɒf/",
        "partOfSpeech": "noun",
        "definition": "A gathering or celebration to wish someone good luck when departing on a long journey or retirement.",
        "example": "Colleagues organized a warm, heartfelt send-off for their retiring mentor after thirty years of leadership.",
        "translation": "حفلة توديع / احتفال وداع وتكريم للمسافر أو المتقاعد",
        "exampleArabic": "نظم الزملاء حفل توديع دافئاً ومخلصاً لمرشدهم المتقاعد بعد ثلاثين عاماً من القيادة.",
        "relatedForms": [],
        "collocations": ["proper send-off", "retirement send-off"],
        "synonyms": ["farewell party", "goodbye celebration"],
        "antonyms": ["welcome"],
        "tags": ["celebrations", "parties"]
    },
    {
        "headword": "centenary",
        "pronunciation": "/senˈtiːnəri/",
        "partOfSpeech": "noun",
        "definition": "The one-hundredth anniversary of a significant historical event or institution.",
        "example": "The public library celebrated its centenary by displaying original architectural sketches from 1924.",
        "translation": "المئوية / الذكرى المئوية لتأسيس حدث أو مؤسسة",
        "exampleArabic": "احتفلت المكتبة العامة بمئويتها من خلال عرض المخططات المعمارية الأصلية من عام 1924.",
        "relatedForms": ["centennial"],
        "collocations": ["mark a centenary", "centenary celebrations"],
        "synonyms": ["centennial", "hundredth anniversary"],
        "antonyms": [],
        "tags": ["celebrations", "milestones"]
    },
    {
        "headword": "custom",
        "pronunciation": "/ˈkʌstəm/",
        "partOfSpeech": "noun",
        "definition": "A widely accepted way of behaving or doing something that is specific to a particular society.",
        "example": "In our coastal town, it is an ancient custom to give sea salt and fresh bread to new neighbors.",
        "translation": "عُرف / عادة اجتماعية متوارثة",
        "exampleArabic": "في بلدتنا الساحلية، من الأعراف والعادات القديمة إهداء ملح البحر والخبز الطازج للجيران الجدد.",
        "relatedForms": ["customary", "customarily"],
        "collocations": ["ancient custom", "local custom"],
        "synonyms": ["tradition", "practice", "convention"],
        "antonyms": ["novelty", "innovation"],
        "tags": ["traditions", "culture"]
    },
    {
        "headword": "folklore",
        "pronunciation": "/ˈfəʊklɔː/",
        "partOfSpeech": "noun",
        "definition": "The traditional beliefs, customs, stories, and songs of a community, passed through generations.",
        "example": "Grandmothers preserved regional folklore by chanting musical ballads during winter festivals.",
        "translation": "فولكلور / مأثورات شعبية وتراث شفهي",
        "exampleArabic": "حافظت الجدات على الفولكلور الإقليمي من خلال إنشاد الموشحات والقصائد المغناة في مهرجانات الشتاء.",
        "relatedForms": ["folkloric"],
        "collocations": ["traditional folklore", "study folklore"],
        "synonyms": ["mythology", "oral lore", "folk tradition"],
        "antonyms": [],
        "tags": ["traditions", "culture"]
    },
    {
        "headword": "observance",
        "pronunciation": "/əbˈzɜːvəns/",
        "partOfSpeech": "noun",
        "definition": "The practice of observing or complying with a law, custom, or religious ritual.",
        "example": "Strict dietary observance during the holy month fostered deep spiritual mindfulness.",
        "translation": "إقامة الشعائر / مراعاة الطقوس والأعراف",
        "exampleArabic": "عززت مراعاة الشعائر الغذائية الصارمة خلال الشهر الفضيل يقظة روحية عميقة.",
        "relatedForms": ["observe", "observant"],
        "collocations": ["religious observance", "strict observance"],
        "synonyms": ["celebration", "commemoration", "practice"],
        "antonyms": ["neglect", "disregard"],
        "tags": ["traditions", "religion"]
    },
    {
        "headword": "rite",
        "pronunciation": "/raɪt/",
        "partOfSpeech": "noun",
        "definition": "A religious or other solemn ceremony or act.",
        "example": "The graduation ceremony is a meaningful rite of passage marking entry into adult life.",
        "translation": "طقس / شعيرة رسمية أو دينية",
        "exampleArabic": "تعد مراسم التخرج طقساً انتقالياً ذا مغزى يمثل الدخول في مرحلة النضج وحياة البالغين.",
        "relatedForms": ["ritual"],
        "collocations": ["rite of passage", "sacred rite"],
        "synonyms": ["ceremony", "ritual", "observance"],
        "antonyms": [],
        "tags": ["traditions", "rituals"]
    },
    {
        "headword": "ritual",
        "pronunciation": "/ˈrɪtʃuəl/",
        "partOfSpeech": "noun",
        "definition": "A religious or solemn ceremony consisting of a series of actions performed according to a prescribed order.",
        "example": "Lighting the silver candles before dinner had become a sacred family ritual every Friday.",
        "translation": "طقس متبع / شعيرة وممارسة راتبة",
        "exampleArabic": "أصبح إشعال الشموع الفضية قبل العشاء طقساً عائلياً مقدساً في كل يوم جمعة.",
        "relatedForms": ["ritualistic", "ritually"],
        "collocations": ["daily ritual", "ancient ritual"],
        "synonyms": ["ceremony", "service", "rite"],
        "antonyms": [],
        "tags": ["traditions", "rituals"]
    },
    {
        "headword": "tradition",
        "pronunciation": "/trəˈdɪʃn/",
        "partOfSpeech": "noun",
        "definition": "The transmission of customs or beliefs from generation to generation.",
        "example": "It is our treasured family tradition to gather around the fire and sing old ballads on solstice night.",
        "translation": "تقليد / موروث متناقل عبر الأجيال",
        "exampleArabic": "إنه تقليد عائلي عزيز لدينا أن نجتمع حول الموقد وننشد الأغاني القديمة في ليلة الانقلاب الشتوي.",
        "relatedForms": ["traditional", "traditionally"],
        "collocations": ["uphold tradition", "family tradition"],
        "synonyms": ["custom", "heritage", "convention"],
        "antonyms": ["novelty"],
        "tags": ["traditions", "culture"]
    },
    {
        "headword": "ceremonial",
        "pronunciation": "/ˌserɪˈməʊniəl/",
        "partOfSpeech": "adjective",
        "definition": "Relating to or used for formal events, rites, or rituals.",
        "example": "The royal ambassador carried a ceremonial gold staff adorned with precious emeralds.",
        "translation": "مراسمي / طقسي مخصص للاحتفالات الرسمية",
        "exampleArabic": "حمل السفير الملكي عصا ذهبية مراسمية مرصعة بالزمرد النفيس.",
        "relatedForms": ["ceremony", "ceremonially"],
        "collocations": ["ceremonial dress", "ceremonial role"],
        "synonyms": ["formal", "ritual", "solemn"],
        "antonyms": ["informal", "casual"],
        "tags": ["traditions", "formal"]
    },
    {
        "headword": "pageantry",
        "pronunciation": "/ˈpædʒəntri/",
        "partOfSpeech": "noun",
        "definition": "Elaborate, grand display or colorful ceremony.",
        "example": "Foreign visitors marveled at the dazzling pageantry and trumpets during the parliamentary opening.",
        "translation": "أبهة واستعراض مبهر / فخامة المراسم الاحتفالية",
        "exampleArabic": "اندهش الزوار الأجانب من الأبهة والفخامة الباهرة وأبواق الاحتفال أثناء افتتاح البرلمان.",
        "relatedForms": ["pageant"],
        "collocations": ["pomp and pageantry", "royal pageantry"],
        "synonyms": ["pomp", "grandeur", "spectacle"],
        "antonyms": ["simplicity"],
        "tags": ["traditions", "spectacle"]
    },
    {
        "headword": "festive",
        "pronunciation": "/ˈfestɪv/",
        "partOfSpeech": "adjective",
        "definition": "Cheerful and jovially celebratory; suitable for a festival.",
        "example": "The city center took on a wonderfully festive appearance with pine garlands and fairy lights.",
        "translation": "احتفالي / بهيج ومفعم بأجواء الأعياد",
        "exampleArabic": "اتخذ وسط المدينة مظهراً احتفالياً رائعاً مع أكاليل الصنوبر والأضواء البراقة الساحرة.",
        "relatedForms": ["festivity"],
        "collocations": ["festive mood", "festive season"],
        "synonyms": ["joyous", "cheerful", "jolly"],
        "antonyms": ["somber", "gloomy"],
        "tags": ["celebrations", "mood"]
    },
    {
        "headword": "solemnity",
        "pronunciation": "/səˈlemnəti/",
        "partOfSpeech": "noun",
        "definition": "The state or quality of being serious, dignified, and formally reverent.",
        "example": "The solemnity of the swearing-in oath silenced the vast hall as citizens witnessed history.",
        "translation": "مهابة وجلال / وقار واحتشام رسمي",
        "exampleArabic": "أسكتت مهابة وجلال قسم اليمين القاعة الفسيحة بينما شهد المواطنون لحظة تاريخية.",
        "relatedForms": ["solemn", "solemnly"],
        "collocations": ["great solemnity", "maintain solemnity"],
        "synonyms": ["seriousness", "gravity", "dignity"],
        "antonyms": ["frivolity", "levity"],
        "tags": ["traditions", "formal"]
    },
    {
        "headword": "memento",
        "pronunciation": "/məˈmentəʊ/",
        "partOfSpeech": "noun",
        "definition": "An object kept as a reminder or souvenir of a person, place, or event.",
        "example": "Each wedding guest received a small hand-carved olive wood box as a keepsake memento.",
        "translation": "تذكار / هدية تذكارية لحفظ الذكرى",
        "exampleArabic": "تلقى كل ضيف في الزفاف صندوقاً صغيراً من خشب الزيتون المنحوت يدوياً كهدية تذكارية.",
        "relatedForms": [],
        "collocations": ["cherished memento", "keepsake memento"],
        "synonyms": ["souvenir", "keepsake", "token"],
        "antonyms": [],
        "tags": ["gifts", "memories"]
    },
    {
        "headword": "token",
        "pronunciation": "/ˈtəʊkən/",
        "partOfSpeech": "noun",
        "definition": "A thing serving as a visible or tangible representation of a fact, quality, or feeling.",
        "example": "She accepted the engraved silver pen as a modest token of gratitude from her students.",
        "translation": "عربون ورمز / دلالة تقدير رمزية",
        "exampleArabic": "قبلت القلم الفضي المنقوش كعربون تواضع ورمز امتنان من طلابها.",
        "relatedForms": [],
        "collocations": ["token of appreciation", "token of affection"],
        "synonyms": ["symbol", "expression", "sign"],
        "antonyms": [],
        "tags": ["gifts", "appreciation"]
    },
    {
        "headword": "tribute",
        "pronunciation": "/ˈtrɪbjuːt/",
        "partOfSpeech": "noun",
        "definition": "An act, statement, or gift that is intended to show gratitude, respect, or admiration.",
        "example": "The orchestra concluded the gala with a moving musical tribute to their retiring conductor.",
        "translation": "إشادة وتكريم / تحية تقدير وعرفان",
        "exampleArabic": "اختتمت الأوركسترا الحفل بإشادة وتكريم موسيقي مؤثر لقائد الأوركسترا المتقاعد.",
        "relatedForms": [],
        "collocations": ["pay tribute", "fitting tribute"],
        "synonyms": ["accolade", "homage", "salute"],
        "antonyms": ["criticism", "insult"],
        "tags": ["celebrations", "honor"]
    },
    {
        "headword": "confetti",
        "pronunciation": "/kənˈfeti/",
        "partOfSpeech": "noun",
        "definition": "Small pieces of colored paper or plastic thrown during celebrations, especially at weddings.",
        "example": "Guests threw shimmering rose-gold confetti over the happy newlyweds as they stepped from the chapel.",
        "translation": "قصاصات ملونة / كونفيتي يُنثر في الأفراح",
        "exampleArabic": "نثر الضيوف قصاصات ورقية ملونة براقة من الذهب الوردي فوق العروسين السعيدين وهما يخرجان من القاعة.",
        "relatedForms": [],
        "collocations": ["shower of confetti", "biodegradable confetti"],
        "synonyms": ["streamers", "paper sparkles"],
        "antonyms": [],
        "tags": ["decorations", "weddings"]
    },
    {
        "headword": "streamer",
        "pronunciation": "/ˈstriːmə/",
        "partOfSpeech": "noun",
        "definition": "A long, narrow strip of colored paper or ribbon hung up as a decoration.",
        "example": "Children enthusiastically hung brightly colored paper streamers across the ceiling for the birthday party.",
        "translation": "شريط زينة ملون وممتد",
        "exampleArabic": "علق الأطفال بحماس أشرطة زينة ورقية زاهية الألوان عبر السقف لحفلة عيد الميلاد.",
        "relatedForms": [],
        "collocations": ["party streamers", "paper streamers"],
        "synonyms": ["ribbon", "bunting", "banner"],
        "antonyms": [],
        "tags": ["decorations", "parties"]
    },
    {
        "headword": "garland",
        "pronunciation": "/ˈɡɑːlənd/",
        "partOfSpeech": "noun",
        "definition": "A wreath of flowers, leaves, or ribbon, worn on the head or hung as a festive decoration.",
        "example": "Fresh jasmine garlands adorned the archway where the bride and groom exchanged rings.",
        "translation": "إكليل زهور / طوق من الرياحين للزينة",
        "exampleArabic": "زينت أطواق وأكاليل الياسمين الطازجة القوس الذي تبادل فيه العروسان الخواتم.",
        "relatedForms": [],
        "collocations": ["flower garland", "festive garland"],
        "synonyms": ["wreath", "swag", "coronet"],
        "antonyms": [],
        "tags": ["decorations", "weddings"]
    },
    {
        "headword": "fireworks",
        "pronunciation": "/ˈfaɪəwɜːks/",
        "partOfSpeech": "noun",
        "definition": "Devices containing gunpowder and other chemicals that cause spectacular explosions when ignited.",
        "example": "A brilliant display of multicolored fireworks illuminated the night sky above the ancient fortress.",
        "translation": "ألعاب نارية / مفرقعات مضيئة في السماء",
        "exampleArabic": "أضاء عرض رائع من الألعاب النارية متعددة الألوان سماء الليل فوق القلعة القديمة.",
        "relatedForms": [],
        "collocations": ["fireworks display", "set off fireworks"],
        "synonyms": ["pyrotechnics", "illuminations"],
        "antonyms": [],
        "tags": ["celebrations", "spectacle"]
    },
    {
        "headword": "procession",
        "pronunciation": "/prəˈseʃn/",
        "partOfSpeech": "noun",
        "definition": "A number of people or vehicles moving forward in an orderly, formal fashion.",
        "example": "The vibrant carnival procession featured brass bands, decorated floats, and masked dancers.",
        "translation": "موكب / مسيرة احتفالية منظمة",
        "exampleArabic": "ضم موكب الكرنفال المبهج فرقاً نحاسية وعربات استعراضية مزينة وراقصين مقنعين.",
        "relatedForms": ["processional"],
        "collocations": ["festive procession", "funeral procession"],
        "synonyms": ["parade", "cavalcade", "cortege"],
        "antonyms": [],
        "tags": ["celebrations", "culture"]
    },
    {
        "headword": "caterer",
        "pronunciation": "/ˈkeɪtərə/",
        "partOfSpeech": "noun",
        "definition": "A person or company providing food and drink at a social event or gathering.",
        "example": "We hired a renowned organic caterer who prepared an exquisite five-course wedding banquet.",
        "translation": "متعهد طعام وحفلات / ممون ولائم",
        "exampleArabic": "استأجرنا متعهد طعام وحفلات شهيراً للمأكولات العضوية أعد مأدبة زفاف رائعة من خمسة أطباق.",
        "relatedForms": ["cater", "catering"],
        "collocations": ["wedding caterer", "professional caterer"],
        "synonyms": ["food provider", "banquet manager"],
        "antonyms": [],
        "tags": ["food", "events"]
    },
    {
        "headword": "catering",
        "pronunciation": "/ˈkeɪtərɪŋ/",
        "partOfSpeech": "noun",
        "definition": "The provision of food and drink at a social event or gathering.",
        "example": "The venue management handled all the floral decor, audio systems, and high-end catering.",
        "translation": "خدمات الضيافة والتموين / توريد الأغذية للحفلات",
        "exampleArabic": "تولت إدارة المكان جميع الديكورات الزهرية والأنظمة الصوتية وخدمات الضيافة والتموين الراقية.",
        "relatedForms": ["caterer"],
        "collocations": ["catering service", "in-house catering"],
        "synonyms": ["food service", "provisioning"],
        "antonyms": [],
        "tags": ["food", "events"]
    },
    {
        "headword": "unveil",
        "pronunciation": "/ˌʌnˈveɪl/",
        "partOfSpeech": "verb",
        "definition": "Remove a veil or covering from, in particular uncover a new monument or work of art as part of a ceremony.",
        "example": "The mayor will formally unveil the bronze commemorative statue of the poet during tomorrow's jubilee.",
        "translation": "يزيح الستار / يكشف النقاب في احتفال رسمي",
        "exampleArabic": "سيزيح العمدة الستار رسمياً عن التمثال التذكاري البرونزي للشاعر خلال يوبيل الغد.",
        "relatedForms": ["unveiling"],
        "collocations": ["unveil a monument", "unveil a plaque"],
        "synonyms": ["reveal", "uncover", "inaugurate"],
        "antonyms": ["conceal", "cover"],
        "tags": ["celebrations", "ceremony"]
    },
    {
        "headword": "salute",
        "pronunciation": "/səˈluːt/",
        "partOfSpeech": "verb",
        "definition": "Express admiration and respect for someone or something in a formal way.",
        "example": "Citizens gathered by the harbor to salute the heroic coastal rescue team with applause and whistles.",
        "translation": "يحيي / يوجه تحية إجلال وإكبار",
        "exampleArabic": "تجمع المواطنون عند الميناء لتحية فريق الإنقاذ الساحلي البطولي بالتصفيق الحار والهتاف.",
        "relatedForms": ["salutation"],
        "collocations": ["salute bravery", "formally salute"],
        "synonyms": ["honor", "pay homage", "acclaim"],
        "antonyms": ["disparage"],
        "tags": ["celebrations", "honor"]
    },
    {
        "headword": "festoon",
        "pronunciation": "/feˈstuːn/",
        "partOfSpeech": "verb",
        "definition": "Adorn a place with ribbons, garlands, or other decorations.",
        "example": "Volunteers worked all afternoon to festoon the town square with olive branches and golden lanterns.",
        "translation": "يزين بالشرائط والأكاليل المعلقة",
        "exampleArabic": "عمل المتطوعون طوال بعد الظهر لتزيين ساحة البلدة بأغصان الزيتون والفوانيس الذهبية المعلقة.",
        "relatedForms": [],
        "collocations": ["festoon with ribbons", "festoon the hall"],
        "synonyms": ["decorate", "adorn", "deck"],
        "antonyms": ["strip", "bare"],
        "tags": ["decorations", "events"]
    },
    {
        "headword": "bunting",
        "pronunciation": "/ˈbʌntɪŋ/",
        "partOfSpeech": "noun",
        "definition": "Rows of small colored flags hung between poles or across streets for decoration.",
        "example": "Festive red, white, and blue bunting fluttered gently in the sea breeze along the promenade.",
        "translation": "رايات زينة / أعلام مثلثة معلقة للاحتفال",
        "exampleArabic": "رفرفت رايات الزينة الاحتفالية الحمراء والبيضاء والزرقاء برقة في نسيم البحر على طول الكورنيش.",
        "relatedForms": [],
        "collocations": ["hang bunting", "decorative bunting"],
        "synonyms": ["flags", "streamers", "pennants"],
        "antonyms": [],
        "tags": ["decorations", "events"]
    },
    {
        "headword": "centerpiece",
        "pronunciation": "/ˈsentəpiːs/",
        "partOfSpeech": "noun",
        "definition": "An ornamental object or decorative arrangement used in a central position on a banquet table.",
        "example": "A magnificent crystal bowl filled with fresh orchids served as the centerpiece on the wedding table.",
        "translation": "قطعة زينة مركزية / تحفة تتوسط طاولة المأدبة",
        "exampleArabic": "كان الوعاء البلوري الرائع المليء بزهور الأوركيد الطازجة بمثابة تحفة مركزية تزين طاولة الزفاف.",
        "relatedForms": [],
        "collocations": ["table centerpiece", "floral centerpiece"],
        "synonyms": ["focal point", "table ornament"],
        "antonyms": [],
        "tags": ["decorations", "weddings"]
    },
    {
        "headword": "sparkler",
        "pronunciation": "/ˈspɑːklə/",
        "partOfSpeech": "noun",
        "definition": "A hand-held firework that produces brilliant sparks as it burns slowly.",
        "example": "At the stroke of midnight, joyful guests stepped into the courtyard and waved glittering sparklers.",
        "translation": "عصا شرار نارية / شعلة احتفالية براقة",
        "exampleArabic": "عند تمام منتصف الليل، خرج الضيوف المبتهجون إلى الفناء ولوحوا بعصي الشرر النارية المتلألئة.",
        "relatedForms": [],
        "collocations": ["light sparklers", "wave a sparkler"],
        "synonyms": ["firework"],
        "antonyms": [],
        "tags": ["celebrations", "spectacle"]
    },
    {
        "headword": "bonfire",
        "pronunciation": "/ˈbɒnfaɪə/",
        "partOfSpeech": "noun",
        "definition": "A large open-air fire used for celebration, festive signaling, or warmth.",
        "example": "Villagers gathered around a roaring beach bonfire on midsummer eve, singing ancestral folk songs.",
        "translation": "نار احتفالية / شعلة نار كبرى في الهواء الطلق",
        "exampleArabic": "اجتمع القرويون حول نار احتفالية كبرى مشتعلة على الشاطئ في عشية منتصف الصيف، منشدين أغاني الأجداد الشعبية.",
        "relatedForms": [],
        "collocations": ["beach bonfire", "roaring bonfire"],
        "synonyms": ["blaze", "campfire"],
        "antonyms": [],
        "tags": ["celebrations", "outdoors"]
    },
    {
        "headword": "commemorate",
        "pronunciation": "/kəˈmeməreɪt/",
        "partOfSpeech": "verb",
        "definition": "Recall and show respect for someone or something in a ceremony or gathering.",
        "example": "We assemble every spring to commemorate the brave architects who designed our historic aqueduct.",
        "translation": "يخلد ذكرى / يحتفل بذكرى شخص أو إنجاز",
        "exampleArabic": "نجتمع كل ربيع لنخلد ذكرى المهندسين الشجعان الذين صمموا قناتنا المائية التاريخية.",
        "relatedForms": ["commemoration"],
        "collocations": ["commemorate an anniversary", "commemorate the fallen"],
        "synonyms": ["honor", "memorialize", "celebrate"],
        "antonyms": ["forget", "ignore"],
        "tags": ["celebrations", "traditions"]
    },
    {
        "headword": "rejoice",
        "pronunciation": "/rɪˈdʒɔɪs/",
        "partOfSpeech": "verb",
        "definition": "Feel or show great joy, delight, or celebration.",
        "example": "The entire neighborhood came together to rejoice over the safe homecoming of the stranded rescue crew.",
        "translation": "يبتهج / يفرح فرحاً غامراً ويعبر عن سروره",
        "exampleArabic": "تجمع الحي بأسره ليبتهج ويفرح فرحاً غامراً بالعودة الآمنة لطاقم الإنقاذ العالق إلى ديارهم.",
        "relatedForms": ["rejoicing"],
        "collocations": ["rejoice in victory", "rejoice together"],
        "synonyms": ["celebrate", "exult", "delight"],
        "antonyms": ["mourn", "lament"],
        "tags": ["celebrations", "joy"]
    },
    {
        "headword": "reveler",
        "pronunciation": "/ˈrevələ/",
        "partOfSpeech": "noun",
        "definition": "A person who is enjoying themselves in a lively and noisy way at a celebration.",
        "example": "Costumed revelers filled the historic cobblestone alleyways with laughter, singing, and tambourines.",
        "translation": "محتفل / شخص مشارك في لهو وصخب الاحتفالات",
        "exampleArabic": "ملأ المحتفلون بالأزياء التنكرية أزقة الحصى التاريخية بالضحك والغناء والدفوف.",
        "relatedForms": ["revelry"],
        "collocations": ["carnival reveler", "midnight reveler"],
        "synonyms": ["partygoer", "merrymaker", "celebrator"],
        "antonyms": [],
        "tags": ["celebrations", "people"]
    },
    {
        "headword": "merrymaking",
        "pronunciation": "/ˈmerimeɪkɪŋ/",
        "partOfSpeech": "noun",
        "definition": "The process of enjoying oneself with others, especially by dancing and drinking.",
        "example": "After a bountiful harvest, days of hearty food, music, and general merrymaking followed in the village.",
        "translation": "مرح واحتفال / بهجة ومسرة جماعية",
        "exampleArabic": "بعد حصاد وفير، تلت أيام من الطعام الشهي والموسيقى والمرح والاحتفال الجماعي في القرية.",
        "relatedForms": ["merrymaker"],
        "collocations": ["sound of merrymaking", "hours of merrymaking"],
        "synonyms": ["revelry", "festivity", "fun"],
        "antonyms": ["mourning", "sorrow"],
        "tags": ["celebrations", "joy"]
    }
]

grammar_data = [
    {
        "title": "Would for Past Habits and Preferences",
        "explanation": "The modal auxiliary 'would' has two major functions in conversational English: 1) Expressing Past Habits (Nostalgic Routines): We use 'would + base verb' to describe repeated, regular actions in the past that no longer occur ('Every summer, our grandmother would bake festive pastries for the village'). Important: unlike 'used to', 'would' cannot describe past states or conditions (Say 'She used to live near the festival', NOT 'She would live...'). 2) Expressing Preferences: We use 'would rather + base verb' or 'would prefer + to-infinitive' to express present or future choices ('I would rather attend a quiet soiree than a noisy street carnival'; 'They would prefer to celebrate at home').",
        "explanationArabic": "للفعل المساعد (would) وظيفتان رئيسيتان هامتان: 1) التعبير عن العادات الماضية المتكررة (Past Habits): نستخدم (would + الفعل المجرد) لوصف أفعال وروتينيات كان يتكرر حدوثها في الماضي بصبغة نوستالجية ومحبة ('في كل عطلة، كانت جدتي تصنع المعجنات للاحتفال'). انتبه: لا نستخدم would مع الحالات الثابتة past states، بل نستخدم used to (نقول: I used to love carnivals، ولا نقول: I would love carnivals). 2) التعبير عن التفضيلات (Preferences): نستخدم (would rather + الفعل المجرد) أو (would prefer + to والمصدر) لتفضيل خيار على آخر ('أفضل حضور أمسية راقية هادئة على الذهاب لكرنفال صاخب').",
        "rules": [
            "Past habits: Subject + would + base verb ('During the festival, we would dance until dawn'). Only for repeated actions, not states.",
            "Would rather + base verb: Expresses preference between options ('I would rather stay home than join the revelry').",
            "Would prefer + to + verb: Expresses formal preference ('She would prefer to hire an organic caterer').",
            "Contrast: Use 'used to' for past states/conditions ('He used to be a festival organizer', not 'would be')."
        ],
        "rulesArabic": [
            "العادات الماضية المتكررة: الفاعل + would + المصدر المجرد بدون to (للأفعال الحركية المتكررة فقط).",
            "صيغة التفضيل (would rather): تُتبع بالمصدر المجرد مباشرة ('would rather dance than sing').",
            "صيغة التفضيل (would prefer): تُتبع بـ to + المصدر ('would prefer to celebrate quietly').",
            "الحالات الثابتة: نستخدم used to وليس would مع أفعال الحالة مثل be, live, know, like."
        ],
        "structures": [
            {
                "pattern": "Subject + would + Base Verb (when + past context)",
                "explanation": "Describes a recurring, habitual past action carried out with nostalgia.",
                "explanationArabic": "يصف عادة أو فعلاً متكرراً في الماضي بنبرة حنين."
            },
            {
                "pattern": "Subject + would rather + Base Verb (+ than + Base Verb)",
                "explanation": "Expresses preference for one action over an alternative.",
                "explanationArabic": "يعبر عن تفضيل فعل معين على بديل آخر."
            },
            {
                "pattern": "Subject + would prefer + to + Base Verb",
                "explanation": "States a formal preference using a to-infinitive.",
                "explanationArabic": "يوضح تفضيلاً رسمياً باستخدام to مع المصدر."
            }
        ],
        "examples": [
            {
                "sentence": "Every spring, our grandfather would unveil the ancestral wooden carvings for the centenary.",
                "translation": "في كل ربيع، كان جدنا يزيح الستار عن المنحوتات الخشبية الموروثة بمناسبة المئوية.",
                "usesVocabulary": ["unveil", "centenary"]
            },
            {
                "sentence": "I would rather watch the fireworks from the balcony than walk through the crowded carnival.",
                "translation": "أفضل مشاهدة الألعاب النارية من الشرفة على السير وسط الكرنفال المزدحم.",
                "usesVocabulary": ["fireworks", "carnival"]
            },
            {
                "sentence": "She would prefer to distribute a hand-crafted memento as a sincere token of gratitude.",
                "translation": "تفضل توزيع تذكار مصنوع يدوياً كعربون ورمز صادق للامتنان.",
                "usesVocabulary": ["memento", "token"]
            },
            {
                "sentence": "As young children, we would festoon the fireplace with evergreen garlands during holiday festivities.",
                "translation": "عندما كنا أطفالاً صغاراً، كنا نزين الموقد بأكاليل دائمة الخضرة أثناء الاحتفالات بالأعياد.",
                "usesVocabulary": ["festoon", "garland", "festivity"]
            }
        ],
        "commonMistakes": [
            {
                "wrong": "When I was young, I would have a large house near the festival grounds.",
                "right": "When I was young, I used to have a large house near the festival grounds.",
                "note": "Do not use 'would' for past states or possessions; use 'used to' instead.",
                "noteArabic": "لا تستخدم would للحالات الثابتة أو الملكية في الماضي؛ بل استخدم used to."
            },
            {
                "wrong": "I would rather to attend the soiree tomorrow evening.",
                "right": "I would rather attend the soiree tomorrow evening.",
                "note": "'Would rather' takes the bare infinitive without 'to'.",
                "noteArabic": "التركيب would rather يُتبع بالمصدر المجرد مباشرة بدون to."
            }
        ]
    }
]

convs_data = [
    {
        "title": "Planning the Annual City Carnival",
        "titleArabic": "التخطيط لكرنفال المدينة السنوي",
        "setting": "Municipal cultural affairs planning boardroom",
        "settingArabic": "قاعة اجتماعات التخطيط للشؤون الثقافية البلدية",
        "roles": ["Festival Director", "Event Coordinator"],
        "vocabularyUsed": ["carnival", "extravaganza", "festival", "festivity", "fiesta", "gala", "revelry", "spectacle", "reveler"],
        "lines": [
            {
                "speaker": "Majid",
                "text": "Salma, our community expects this year’s summer carnival to surpass all previous cultural editions.",
                "translation": "سلمى، يتوقع مجتمعنا أن يتجاوز الكرنفال الصيفي لهذا العام جميع الدورات الثقافية السابقة."
            },
            {
                "speaker": "Salma",
                "text": "We are ready! The opening night will be an unprecedented audiovisual extravaganza with aerial acrobats.",
                "translation": "نحن على أتم الاستعداد! ستكون ليلة الافتتاح عرضاً استعراضياً وبصرياً غير مسبوق مع لاعبي بهلوان جويين."
            },
            {
                "speaker": "Majid",
                "text": "When we were younger, the neighborhood festival would feature only acoustic folk troupes.",
                "translation": "عندما كنا أصغر سناً، كان المهرجان يقدم فقط فرقاً فولكلورية تقليدية تعزف آلات وترية."
            },
            {
                "speaker": "Salma",
                "text": "True, but modern audiences love diverse programs. We included a daytime Latin fiesta alongside the historic parade.",
                "translation": "هذا صحيح، لكن الجمهور المعاصر يحب البرامج المتنوعة. لقد أدرجنا فييستا ومهرجاناً لاتينياً نهارياً بجانب الموكب التاريخي."
            },
            {
                "speaker": "Majid",
                "text": "I would rather ensure top-tier crowd safety before organizing the VIP charity gala at the theater.",
                "translation": "أفضل ضمان أعلى مستويات السلامة للحشود قبل تنظيم الحفل الخيري الراقي في المسرح."
            },
            {
                "speaker": "Salma",
                "text": "Every participating reveler will feel safe because we coordinated with emergency medical response teams.",
                "translation": "سيشعر كل محتفل مشارك بالأمان لأننا نسقنا مع فرق الاستجابة الطبية للطوارئ."
            },
            {
                "speaker": "Majid",
                "text": "How late will the public revelry and street dancing continue on opening weekend?",
                "translation": "إلى أي ساعة متأخرة ستستمر الاحتفالات الصاخبة والرقص في الشوارع في عطلة نهاية أسبوع الافتتاح؟"
            },
            {
                "speaker": "Salma",
                "text": "The outdoor festivity winds down at midnight, leaving visitors with the memory of an unforgettable visual spectacle.",
                "translation": "تختتم الاحتفالات الخارجية في منتصف الليل، تاركة للزوار ذكرى مشهد واستعراض بصري لا يُنسى."
            }
        ]
    },
    {
        "title": "Organizing Private Social Gatherings",
        "titleArabic": "تنظيم التجمعات والمناسبات الاجتماعية الخاصة",
        "setting": "Cozy living room with tea and planning notebooks",
        "settingArabic": "غرفة جلوس مريحة مع الشاي ودفاتر التخطيط",
        "roles": ["Party Host", "Close Friend"],
        "vocabularyUsed": ["soiree", "masquerade", "potluck", "housewarming", "homecoming", "send-off", "caterer", "catering", "conviviality"],
        "lines": [
            {
                "speaker": "Dalia",
                "text": "Heba, I need your creative input for the formal dinner soiree I am organizing next month.",
                "translation": "هبة، أحتاج إلى لمستك الإبداعية للأمسية والسهرة الراقية التي أنظمها الشهر المقبل."
            },
            {
                "speaker": "Heba",
                "text": "I would love to help! Why not make it a glamorous Venetian masquerade where everyone wears decorative masks?",
                "translation": "يسعدني جداً المساعدة! لمَ لا نجعلها حفلة تنكرية فينيسية ساحرة حيث يرتدي الجميع أقنعة زخرفية؟"
            },
            {
                "speaker": "Dalia",
                "text": "That sounds delightful, but I would rather keep it slightly more casual, like the housewarming we hosted in the spring.",
                "translation": "يبدو ذلك مبهجاً، لكني أفضل إبقاءها أقل رسمية قليلاً، مثل حفلة النُزُل والانتقال لبيتنا الجديد التي أقمناها في الربيع."
            },
            {
                "speaker": "Heba",
                "text": "Remember our college days? We would organize an informal weekend potluck where every guest brought their favorite family dessert.",
                "translation": "أتذكرين أيام دراستنا الجامعية؟ كنا ننظم مأدبة تشاركية غير رسمية في عطلة نهاية الأسبوع حيث يحضر كل ضيف حلوى عائلته المفضلة."
            },
            {
                "speaker": "Dalia",
                "text": "Yes, those gatherings had wonderful warmth and effortless conviviality that made everyone feel cherished.",
                "translation": "نعم، كانت لتلك التجمعات ألفة دافئة وأنس ومسامرة عفوية جعلت الجميع يشعرون بالمحبة والتقدير."
            },
            {
                "speaker": "Heba",
                "text": "Are you planning to hire an outside caterer, or manage the kitchen preparation yourself?",
                "translation": "هل تخططين لاستئجار متعهد طعام وحفلات خارجي، أم إدارة تجهيزات المطبخ بنفسك؟"
            },
            {
                "speaker": "Dalia",
                "text": "I would prefer to hire a reliable boutique firm to manage the catering so I can focus on entertaining our guests.",
                "translation": "أفضل استئجار شركة ضيافة متخصصة وموثوقة لإدارة خدمات التموين والطعام حتى أتمكن من التفرغ للترحيب بضيوفنا."
            },
            {
                "speaker": "Heba",
                "text": "Smart decision. It will be the perfect homecoming celebration for our visiting childhood friends before their send-off.",
                "translation": "قرار ذكي. سيكون هذا الاحتفال المثالي بلقاء وعودة أصدقاء طفولتنا الزائرين قبل حفل توديعهم."
            }
        ]
    },
    {
        "title": "Decorating the Festive Celebration Grounds",
        "titleArabic": "تزيين ساحات الاحتفال والمناسبات البهيجة",
        "setting": "Historic seaside plaza before evening festivities",
        "settingArabic": "ساحة شاطئية تاريخية قبل انطلاق احتفالات المساء",
        "roles": ["Decorator", "Assistant"],
        "vocabularyUsed": ["confetti", "streamer", "garland", "fireworks", "centerpiece", "sparkler", "bonfire", "festoon", "bunting"],
        "lines": [
            {
                "speaker": "Yousef",
                "text": "Ziad, look at how beautifully the sea breeze catches each colorful triangular bunting along the perimeter fence.",
                "translation": "زياد، انظر كم تلتقط نسائم البحر رايات الزينة المثلثة الملونة بجمال على طول السياج المحيط."
            },
            {
                "speaker": "Ziad",
                "text": "It looks fantastic! Have we finished hanging every bright metallic streamer across the main stage rafters?",
                "translation": "يبدو رائعاً! هل انتهينا من تعليق كل أشرطة الزينة المعدنية اللامعة عبر عوارض المسرح الرئيسي؟"
            },
            {
                "speaker": "Yousef",
                "text": "Yes, and the team began to festoon the stone entrance archway with natural olive and jasmine garland arrangements.",
                "translation": "نعم، وبدأ الفريق بتزيين قوس المدخل الحجري بأطواق وأكاليل طبيعية من الزيتون والياسمين."
            },
            {
                "speaker": "Ziad",
                "text": "Every banquet table now displays a hand-carved wooden centerpiece filled with fresh wildflowers and lanterns.",
                "translation": "تعرض كل طاولة مأدبة الآن تحفة زينة مركزية خشبية منحوتة يدوياً مليئة بالزهور البرية الطازجة والفوانيس."
            },
            {
                "speaker": "Yousef",
                "text": "When midnight strikes, cannon blasts will shower the courtyard with thousands of shimmering confetti squares.",
                "translation": "عندما تدق الساعة منتصف الليل، ستنثر المدافع فوق الفناء آلاف القصاصات الورقية الملونة البراقة."
            },
            {
                "speaker": "Ziad",
                "text": "Guests will also gather on the beach where a massive bonfire has been built for warmth and communal singing.",
                "translation": "سيجتمع الضيوف أيضاً على الشاطئ حيث بُنيت نار احتفالية كبرى لتوفير الدفء والغناء الجماعي."
            },
            {
                "speaker": "Yousef",
                "text": "Every guest will hold a sparkling sparkler while watching the midnight fireworks light up the dark ocean.",
                "translation": "سيحمل كل ضيف عصا شرار نارية متلألئة بينما يشاهدون الألعاب النارية في منتصف الليل تضيء المحيط المظلم."
            },
            {
                "speaker": "Ziad",
                "text": "This harmonious celebration will be remembered by the whole town for many seasons to come.",
                "translation": "سيتذكر أهل البلدة بأسرها هذا الاحتفال المتناغم لمواسم عديدة قادمة."
            }
        ]
    }
]

para1_text = (
    "Across centuries, human communities have anchored their identity in the patient preservation of ancestral custom. "
    "Through enchanting oral folklore, elders transmitted moral lessons that taught youth the sacred value of kindness. "
    "The diligent community observance of seasonal transitions brought comfort and order to ancient agricultural life. "
    "Every village wedding included a solemn rite of passage, guiding young lovers from individual youth into shared "
    "destiny. During the annual harvest ritual, villagers would bake flatbreads using grain from the first field and share "
    "them with wanderers. Upholding this living tradition linked distant generations in mutual loyalty. Even amid modern "
    "technological change, the timeless ceremonial grace of family rituals preserves the essential solemnity of cultural "
    "roots."
)

para2_text = (
    "A grand civic commemoration was organized to mark the town's momentous centenary of self-governance. The commemorative "
    "committee staged an elaborate historical pageant, with citizens wearing authentic colonial garments to reenact the "
    "founding treaty. Brass trumpets sounded across the boulevard as dazzling military pageantry enthralled thousands of "
    "spectators. Dignitaries assembled on the town hall terrace to commemorate visionary civic leaders whose sacrifices "
    "secured public welfare. With formal bugle calls, veteran officers stepped forward to salute the national colors. The "
    "climax arrived when the governor helped unveil a towering marble fountain commemorating a century of peaceful civic "
    "harmony."
)

para3_text = (
    "During the festive winter jubilee, sparkling harbor reflections transformed the historic quarter into an enchanting "
    "realm of wonder. Each arriving foreign diplomat received an engraved brass memento as a modest token of hospitality. "
    "In the grand amphitheater, musicians played an emotional symphonic tribute to frontline disaster relief volunteers. "
    "Outside, a vibrant lantern procession wound its way through narrow cobblestone streets as neighbors stepped onto "
    "balconies to rejoice together. Hours of spontaneous laughter, dancing, and heartfelt merrymaking proved that cultural "
    "celebrations strengthen communal fellowship, reminding us that genuine happiness multiplies when shared selflessly."
)

paras_data = [
    {
        "title": "Sacred Rites and Cultural Roots",
        "titleArabic": "الشعائر المقدسة والجذور الثقافية",
        "kind": "informative",
        "text": para1_text,
        "translation": "عبر القرون، رسخت المجتمعات الإنسانية هويتها في الصيانة الصبورة للأعراف والعادات المتوارثة. ومن خلال الفولكلور الشفهي الساحر، نقل كبار السن دروساً أخلاقية علمت الشباب القيمة المقدسة للطف. وجلبت المراعاة المجتمعية الدؤوبة لشعائر تقلبات الفصول الراحة والنظام للحياة الزراعية القديمة. وتضمن كل عرس قروي طقساً انتقالياً مهيباً يقود الحبيبين من الشباب الفردي إلى المصير المشترك. وخلال طقس الحصاد السنوي، كان القرويون يخبزون خبزاً مسطحاً باستخدام حبوب الحقل الأول ويشاركونها مع العابرين. وربط الحفاظ على هذا التقليد الحي الأجيال البعيدة بالولاء المتبادل. وحتى وسط التغير التكنولوجي الحديث، فإن النعمة والمراسمية الخالدة للطقوس العائلية تحافظ على المهابة والجلال الجوهري للجذور الثقافية.",
        "vocabularyUsed": ["custom", "folklore", "observance", "rite", "ritual", "tradition", "ceremonial", "solemnity"]
    },
    {
        "title": "Honoring a Century of Harmony",
        "titleArabic": "تكريم قرن من التناغم والريادة",
        "kind": "narrative",
        "text": para2_text,
        "translation": "نُظمت مراسم إحياء ذكرى مدنية كبرى للاحتفال بمئوية الإدارة الذاتية الفارقة للبلدة. وقدمت اللجنة الاحتفالية استعراضاً تاريخياً مسرحياً متقناً، حيث ارتدى المواطنون أزياء تراثية أصيلة لإعادة تمثيل معاهدة التأسيس. ودوت الأبواق النحاسية عبر الشارع العريض بينما أسرت الأبهة والفخامة العسكرية المبهرة آلاف المتفرجين. واجتمع الوجهاء في شرفة مبنى البلدية لتخليد ذكرى القادة المدنيين أصحاب الرؤى الذين ضمنت تضحياتهم الرفاهية العامة. ومع نداءات البوق الرسمية، تقدم الضباط المتقاعدون لتوجيه التحية العسكرية لألوان العلم الوطني. وبلغت الاحتفالية ذروتها عندما ساعد الحاكم في إزاحة الستار عن نافورة رخامية شاهقة تخلد قرناً من التناغم المدني السلمي.",
        "vocabularyUsed": ["commemoration", "centenary", "pageant", "pageantry", "commemorate", "salute", "unveil"]
    },
    {
        "title": "The Communal Heart of Festivities",
        "titleArabic": "القلب النابض للاحتفالات المجتمعية",
        "kind": "reflective",
        "text": para3_text,
        "translation": "خلال اليوبيل الشتوي الاحتفالي، حولت انعكاسات الميناء المتلألئة الحي التاريخي إلى عالم ساحر من العجب. وتلقى كل دبلوماسي أجنبي قادم تذكاراً نحاسياً منقوشاً كعربون ورمز متواضع لحسن الضيافة. وفي المدرج الكبير، عزف الموسيقيون تحية وإشادة سمفونية مؤثرة لمتطوعي الإغاثة في الخطوط الأمامية للكوارث. وفي الخارج، شق موكب الفوانيس المبهج طريقه عبر شوارع الحصى الضيقة بينما خرج الجيران إلى الشرفات ليبتهجوا ويفرحوا معاً. وأثبتت ساعات من الضحك العفوي والرقص والمرح والاحتفال القلبي أن الاحتفالات الثقافية تعزز التآلف المجتمعي، مذكرة إيانا بأن السعادة الحقيقية تتضاعف عندما نتشاركها بلا أنانية.",
        "vocabularyUsed": ["festive", "jubilee", "memento", "token", "tribute", "procession", "rejoice", "merrymaking"]
    }
]

# Write out python file
with open("scripts/data_day47.py", "w", encoding="utf-8") as f:
    f.write("# -*- coding: utf-8 -*-\n")
    f.write('"""Data definition for Day 47: Celebrations."""\n\n')
    f.write("true = True\nfalse = False\n\n")
    f.write(f"vocab_day47 = {json.dumps(vocab_data, ensure_ascii=False, indent=4)}\n\n")
    f.write(f"grammar_day47 = {json.dumps(grammar_data, ensure_ascii=False, indent=4)}\n\n")
    f.write(f"convs_day47 = {json.dumps(convs_data, ensure_ascii=False, indent=4)}\n\n")
    f.write(f"paras_day47 = {json.dumps(paras_data, ensure_ascii=False, indent=4)}\n")

print("Successfully created scripts/data_day47.py")

from scripts.curriculum_engine import write_day
write_day(47, vocab_data, grammar_data, convs_data, paras_data)
