# -*- coding: utf-8 -*-
"""Generator for Days 53, 54, 55, 56."""

import json, os, sys
from scripts.curriculum_engine import write_day

# ==============================================================================
# DAY 53: Healthy Habits (Sleep, diet and lifestyle)
# Grammar: ["Present Perfect Continuous"]
# ==============================================================================
vocab_53 = [
    # Nutrition & Diet (15)
    {"headword": "nutrition", "pronunciation": "/njuːˈtrɪʃn/", "partOfSpeech": "noun", "definition": "The process of providing or obtaining the food necessary for health and growth.", "example": "Good nutrition is essential for sustained physical energy.", "translation": "تغذية", "exampleArabic": "التغذية الجيدة ضرورية للحفاظ على الطاقة البدنية المستمرة.", "collocations": ["balanced nutrition", "poor nutrition"], "synonyms": ["nourishment"], "antonyms": ["malnutrition"], "tags": ["health", "diet"]},
    {"headword": "calorie", "pronunciation": "/ˈkæləri/", "partOfSpeech": "noun", "definition": "A unit of energy, often used to measure the energy value of foods.", "example": "He has been tracking every calorie in his digital fitness log.", "translation": "سعر حراري / كالوري", "exampleArabic": "إنه يتتبع كل سعر حراري في سجله الرياضي الرقمي.", "collocations": ["burn calories", "calorie deficit"], "synonyms": [], "antonyms": [], "tags": ["health", "diet"]},
    {"headword": "nutrient", "pronunciation": "/ˈnjuːtriənt/", "partOfSpeech": "noun", "definition": "A substance that provides nourishment essential for growth and life.", "example": "Fresh greens supply vital nutrients to the immune system.", "translation": "عنصر غذائي / مادة مغذية", "exampleArabic": "توفر الخضراوات الطازجة عناصر غذائية حيوية لجهاز المناعة.", "collocations": ["essential nutrients", "rich in nutrients"], "synonyms": ["nourishment"], "antonyms": [], "tags": ["health", "diet"]},
    {"headword": "carbohydrate", "pronunciation": "/ˌkɑːbəʊˈhaɪdreɪt/", "partOfSpeech": "noun", "definition": "An organic compound such as starch or sugar that provides energy.", "example": "Athletes consume complex carbohydrates before competing.", "translation": "كربوهيدرات / نشويات", "exampleArabic": "يتناول الرياضيون الكربوهيدرات المعقدة قبل المنافسة.", "collocations": ["complex carbohydrates", "low in carbohydrates"], "synonyms": ["carbs"], "antonyms": [], "tags": ["health", "diet"]},
    {"headword": "protein", "pronunciation": "/ˈprəʊtiːn/", "partOfSpeech": "noun", "definition": "A nutrient found in meat, eggs, and beans that builds tissue.", "example": "She has been adding lean protein to every morning meal.", "translation": "بروتين", "exampleArabic": "إنها تضيف البروتين الخالي من الدهون إلى كل وجبة صباحية.", "collocations": ["lean protein", "protein intake"], "synonyms": [], "antonyms": [], "tags": ["health", "diet"]},
    {"headword": "dietary fiber", "pronunciation": "/ˈdaɪətəri ˈfaɪbə/", "partOfSpeech": "noun", "definition": "Plant material that cannot be digested, promoting digestive health.", "example": "Dietary fiber supports smooth digestive transit.", "translation": "ألياف غذائية", "exampleArabic": "تدعم الألياف الغذائية حركة الجهاز الهضمي بسلاسة.", "collocations": ["high dietary fiber", "soluble dietary fiber"], "synonyms": ["roughage"], "antonyms": [], "tags": ["health", "diet"]},
    {"headword": "vitamin", "pronunciation": "/ˈvɪtəmɪn/", "partOfSpeech": "noun", "definition": "An organic substance essential in small quantities for normal metabolism.", "example": "He has been taking vitamin D supplements during winter.", "translation": "فيتامين", "exampleArabic": "إنه يتناول مكملات فيتامين د خلال فصل الشتاء.", "collocations": ["multivitamin", "essential vitamins"], "synonyms": [], "antonyms": [], "tags": ["health", "diet"]},
    {"headword": "mineral", "pronunciation": "/ˈmɪnərəl/", "partOfSpeech": "noun", "definition": "An inorganic nutrient needed by the body to function properly.", "example": "Nuts and seeds provide trace minerals like zinc and iron.", "translation": "معدن غذائي", "exampleArabic": "توفر المكسرات والبذور معادن نادرة مثل الزنك والحديد.", "collocations": ["trace minerals", "vital minerals"], "synonyms": [], "antonyms": [], "tags": ["health", "diet"]},
    {"headword": "antioxidant", "pronunciation": "/ˌæntiˈɒksɪdənt/", "partOfSpeech": "noun", "definition": "A substance that inhibits oxidation and protects cells from damage.", "example": "Berries are celebrated for their potent antioxidant content.", "translation": "مضاد أكسدة", "exampleArabic": "يشتهر التوت باحتوائه العالي على مضادات الأكسدة القوية.", "collocations": ["rich in antioxidants", "natural antioxidants"], "synonyms": [], "antonyms": [], "tags": ["health", "diet"]},
    {"headword": "hydration", "pronunciation": "/haɪˈdreɪʃn/", "partOfSpeech": "noun", "definition": "The process of causing something to absorb and retain water.", "example": "Maintaining adequate hydration prevents mid-day headaches.", "translation": "ترطيب الجسم / شرب الماء الكافي", "exampleArabic": "يحمي الحفاظ على ترطيب الجسم الكافي من صداع منتصف النهار.", "collocations": ["proper hydration", "daily hydration"], "synonyms": [], "antonyms": ["dehydration"], "tags": ["health", "wellness"]},
    {"headword": "whole grain", "pronunciation": "/ˌhəʊl ˈɡreɪn/", "partOfSpeech": "noun", "definition": "Grain made from entire kernel of grain including bran and germ.", "example": "She has been replacing refined flour with hearty whole grain bread.", "translation": "حبوب كاملة", "exampleArabic": "إنها تستبدل الدقيق المكرر بخبز الحبوب الكاملة المشبع.", "collocations": ["whole grain cereal", "100% whole grain"], "synonyms": [], "antonyms": ["refined grain"], "tags": ["health", "diet"]},
    {"headword": "portion size", "pronunciation": "/ˈpɔːʃn saɪz/", "partOfSpeech": "noun", "definition": "The amount of a food served or consumed in one sitting.", "example": "Controlling portion size is a practical habit for weight management.", "translation": "حجم الحصة الغذائية", "exampleArabic": "يُعد التحكم في حجم الحصة الغذائية عادة عملية لإدارة الوزن.", "collocations": ["manage portion size", "sensible portion size"], "synonyms": ["serving size"], "antonyms": [], "tags": ["health", "diet"]},
    {"headword": "processed food", "pronunciation": "/ˈprəʊsest fuːd/", "partOfSpeech": "noun", "definition": "Food that has undergone deliberate change before being available to eat.", "example": "He has been eliminating processed food from his shopping cart.", "translation": "طعام معالج / أغذية مصنعة", "exampleArabic": "إنه يستبعد الأغذية المصنعة من عربة تسوقه.", "collocations": ["avoid processed food", "ultra-processed food"], "synonyms": ["packaged food"], "antonyms": ["whole food"], "tags": ["health", "diet"]},
    {"headword": "dietary supplement", "pronunciation": "/ˈdaɪətəri ˈsʌplɪmənt/", "partOfSpeech": "noun", "definition": "A product taken by mouth to add further nutritional value to the diet.", "example": "A daily dietary supplement can fill minor nutritional gaps.", "translation": "مكمل غذائي", "exampleArabic": "يمكن للمكمل الغذائي اليومي أن يسد الفجوات الغذائية البسيطة.", "collocations": ["take a dietary supplement", "herbal dietary supplement"], "synonyms": [], "antonyms": [], "tags": ["health", "wellness"]},
    {"headword": "balanced diet", "pronunciation": "/ˌbælənst ˈdaɪət/", "partOfSpeech": "noun", "definition": "A diet that contains the proper proportions of nutrients necessary for health.", "example": "They have been maintaining a balanced diet for six months.", "translation": "نظام غذائي متوازن", "exampleArabic": "إنهم يحافظون على نظام غذائي متوازن منذ ستة أشهر.", "collocations": ["adopt a balanced diet", "maintain a balanced diet"], "synonyms": [], "antonyms": [], "tags": ["health", "diet"]},

    # Meal Prep & Eating Patterns (10)
    {"headword": "meal prep", "pronunciation": "/ˈmiːl prep/", "partOfSpeech": "noun", "definition": "The practice of preparing meals in advance for several days.", "example": "Weekend meal prep saves considerable cooking time during busy weekdays.", "translation": "تجهيز الوجبات مسبقاً", "exampleArabic": "يوفر تجهيز الوجبات مسبقاً في عطلة نهاية الأسبوع وقتاً طويلاً للطهي.", "collocations": ["do meal prep", "weekly meal prep"], "synonyms": ["batch cooking"], "antonyms": [], "tags": ["lifestyle", "diet"]},
    {"headword": "wholesome", "pronunciation": "/ˈhəʊlsəm/", "partOfSpeech": "adjective", "definition": "Promoting health or well-being of body and mind.", "example": "She prefers wholesome home-cooked soups over greasy takeout.", "translation": "صحي / مفيد للجسم / نقي", "exampleArabic": "تفضل الحساء الصحي المطبوخ منزلياً على الوجبات السريعة الدسمة.", "collocations": ["wholesome ingredients", "wholesome meal"], "synonyms": ["healthful", "salubrious"], "antonyms": ["unhealthy"], "tags": ["health", "diet"]},
    {"headword": "nourishing", "pronunciation": "/ˈnʌrɪʃɪŋ/", "partOfSpeech": "adjective", "definition": "Containing substances necessary for growth, health, and good condition.", "example": "A warm nourishing bowl of oatmeal provides enduring fuel.", "translation": "مُغَذٍّ / مقوٍّ للبدن", "exampleArabic": "يوفر وعاء الشوفان الدافئ والمغذي طاقة تدوم طويلاً.", "collocations": ["nourishing soup", "richly nourishing"], "synonyms": ["nutritious"], "antonyms": ["depleting"], "tags": ["health", "diet"]},
    {"headword": "intermittent fasting", "pronunciation": "/ˌɪntəˈmɪtənt ˈfɑːstɪŋ/", "partOfSpeech": "noun", "definition": "An eating plan that switches between fasting and eating on a regular schedule.", "example": "He has been practicing intermittent fasting to improve cellular autophagy.", "translation": "الصيام المتقطع", "exampleArabic": "إنه يمارس الصيام المتقطع لتحسين تجدد الخلايا.", "collocations": ["try intermittent fasting", "intermittent fasting protocol"], "synonyms": [], "antonyms": [], "tags": ["diet", "lifestyle"]},
    {"headword": "binge eating", "pronunciation": "/ˈbɪndʒ ˌiːtɪŋ/", "partOfSpeech": "noun", "definition": "The consumption of large quantities of food in a short period of time.", "example": "She has been addressing stressful triggers that cause binge eating.", "translation": "نوبات نهم الطعام / الإفراط القهري في الأكل", "exampleArabic": "إنها تعالج المحفزات المسببة للتوتر والتي تؤدي لنوبات نهم الطعام.", "collocations": ["overcome binge eating", "binge eating episode"], "synonyms": ["compulsive overeating"], "antonyms": [], "tags": ["diet", "psychology"]},
    {"headword": "junk food", "pronunciation": "/ˈdʒʌŋk fuːd/", "partOfSpeech": "noun", "definition": "Prepackaged food of low nutritional value, high in sugar or fat.", "example": "He has been giving up junk food to regain his stamina.", "translation": "أطعمة ضارة / وجبات سريعة غير صحية", "exampleArabic": "إنه يتخلى عن الأطعمة الضارة لاستعادة قدرته على التحمل.", "collocations": ["crave junk food", "cut down on junk food"], "synonyms": ["fast food"], "antonyms": ["health food"], "tags": ["diet", "health"]},
    {"headword": "sugar intake", "pronunciation": "/ˈʃʊɡə ˌɪnteɪk/", "partOfSpeech": "noun", "definition": "The total amount of sugar consumed through food and drinks.", "example": "Reducing daily sugar intake protects metabolic health.", "translation": "كمية السكر المتناولة", "exampleArabic": "يحمي تقليل كمية السكر المتناولة يومياً صحة التمثيل الغذائي.", "collocations": ["limit sugar intake", "excessive sugar intake"], "synonyms": [], "antonyms": [], "tags": ["diet", "health"]},
    {"headword": "cholesterol", "pronunciation": "/kəˈlestərɒl/", "partOfSpeech": "noun", "definition": "A compound found in body tissues and blood plasma.", "example": "His physician noted that his cholesterol has been dropping steadily.", "translation": "كوليسترول", "exampleArabic": "لاحظ طبيبه أن مستوى الكوليسترول لديه ينخفض بثبات.", "collocations": ["high cholesterol", "lower cholesterol"], "synonyms": [], "antonyms": [], "tags": ["health", "blood"]},
    {"headword": "metabolism", "pronunciation": "/məˈtæbəlɪzəm/", "partOfSpeech": "noun", "definition": "The chemical processes that occur within a living organism to maintain life.", "example": "Regular brisk walking boosts personal basal metabolism.", "translation": "التمثيل الغذائي / الأيض", "exampleArabic": "يعزز المشي السريع المنتظم معدل الأيض الأساسي للشخص.", "collocations": ["boost metabolism", "slow metabolism"], "synonyms": [], "antonyms": [], "tags": ["biology", "health"]},
    {"headword": "digestive health", "pronunciation": "/daɪˈdʒestɪv helθ/", "partOfSpeech": "noun", "definition": "The proper functioning of the gastrointestinal system.", "example": "Fermented vegetables nurture long-term digestive health.", "translation": "صحة الجهاز الهضمي", "exampleArabic": "تغذي الخضراوات المخمرة صحة الجهاز الهضمي على المدى الطويل.", "collocations": ["support digestive health", "optimal digestive health"], "synonyms": [], "antonyms": [], "tags": ["health", "digestion"]},

    # Gut & Sleep Science (10)
    {"headword": "gut flora", "pronunciation": "/ˈɡʌt ˈflɔːrə/", "partOfSpeech": "noun", "definition": "The complex community of microorganisms living in the digestive tract.", "example": "Prebiotics strengthen the beneficial bacteria within the gut flora.", "translation": "بكتيريا الأمعاء النافعة / الميكروبيوم", "exampleArabic": "تقوي البريبايوتكس البكتيريا المفيدة داخل فلورا الأمعاء.", "collocations": ["healthy gut flora", "restore gut flora"], "synonyms": ["microbiome"], "antonyms": [], "tags": ["health", "biology"]},
    {"headword": "deep sleep", "pronunciation": "/ˌdiːp ˈsliːp/", "partOfSpeech": "noun", "definition": "The stage of sleep characterized by slow delta brain waves, vital for repair.", "example": "He has been getting more deep sleep since dimming evening screens.", "translation": "النوم العميق", "exampleArabic": "إنه يحصل على مزيد من النوم العميق منذ تخفيف إضاءة الشاشات مساءً.", "collocations": ["enter deep sleep", "lack of deep sleep"], "synonyms": ["slow-wave sleep"], "antonyms": ["light sleep"], "tags": ["sleep", "health"]},
    {"headword": "rem sleep", "pronunciation": "/ˌɑːr iː ˈem sliːp/", "partOfSpeech": "noun", "definition": "Rapid eye movement sleep, a stage linked to dreaming and memory consolidation.", "example": "Adequate rem sleep is necessary for processing complex memories.", "translation": "نوم حركة العين السريعة (مرحلة الأحلام)", "exampleArabic": "يُعد نوم حركة العين السريعة الكافي ضرورياً لمعالجة الذكريات المعقدة.", "collocations": ["disrupt rem sleep", "prolong rem sleep"], "synonyms": [], "antonyms": [], "tags": ["sleep", "neurology"]},
    {"headword": "circadian rhythm", "pronunciation": "/sɜːˈkeɪdiən ˈrɪðəm/", "partOfSpeech": "noun", "definition": "The natural 24-hour cycle that regulates physical and mental states.", "example": "Morning sunlight exposure aligns the biological circadian rhythm.", "translation": "الساعة البيولوجية / الإيقاع اليومي", "exampleArabic": "يضبط التعرض لضوء شمس الصباح الإيقاع الحيوي للساعة البيولوجية.", "collocations": ["disrupt circadian rhythm", "natural circadian rhythm"], "synonyms": ["biological clock"], "antonyms": [], "tags": ["sleep", "biology"]},
    {"headword": "sleep hygiene", "pronunciation": "/ˈsliːp ˈhaɪdʒiːn/", "partOfSpeech": "noun", "definition": "Habits and practices conducive to sleeping well on a regular basis.", "example": "She has been upgrading her sleep hygiene by keeping her bedroom cool.", "translation": "عادات النوم الصحية / نظافة النوم", "exampleArabic": "إنها تحسن عادات نومها الصحية بالحفاظ على برودة غرفة نومها.", "collocations": ["good sleep hygiene", "practice sleep hygiene"], "synonyms": [], "antonyms": [], "tags": ["sleep", "wellness"]},
    {"headword": "bedtime routine", "pronunciation": "/ˈbedtaɪm ruːˈtiːn/", "partOfSpeech": "noun", "definition": "A consistent sequence of relaxing activities carried out before sleep.", "example": "A soothing bedtime routine prepares the brain for sound rest.", "translation": "روتين وقت النوم / طقوس ما قبل النوم", "exampleArabic": "يجهز روتين وقت النوم المهدئ الدماغ لراحة هنيئة.", "collocations": ["calming bedtime routine", "establish a bedtime routine"], "synonyms": [], "antonyms": [], "tags": ["sleep", "lifestyle"]},
    {"headword": "power nap", "pronunciation": "/ˈpaʊə næp/", "partOfSpeech": "noun", "definition": "A short sleep taken during the working day to restore mental energy.", "example": "A twenty-minute power nap revives focus without causing grogginess.", "translation": "غفوة طاقة سريعة / قيلولة منشطة", "exampleArabic": "تجدد غفوة الطاقة لمدة عشرين دقيقة التركيز دون أن تسبب ثقلاً أو دواراً.", "collocations": ["take a power nap", "refreshing power nap"], "synonyms": ["catnap"], "antonyms": [], "tags": ["sleep", "productivity"]},
    {"headword": "well-rested", "pronunciation": "/ˌwel ˈrestɪd/", "partOfSpeech": "adjective", "definition": "Having had enough sleep to feel fresh and alert.", "example": "He has been waking up well-rested every single morning this week.", "translation": "مرتاح ونشيط بعد النوم", "exampleArabic": "إنه يستيقظ مرتاحاً ونشيطاً كل صباح هذا الأسبوع.", "collocations": ["feel well-rested", "wake up well-rested"], "synonyms": ["refreshed"], "antonyms": ["exhausted"], "tags": ["sleep", "wellness"]},
    {"headword": "sleep deprivation", "pronunciation": "/ˈsliːp ˌdeprɪˈveɪʃn/", "partOfSpeech": "noun", "definition": "The condition of suffering from a lack of sufficient sleep.", "example": "Chronic sleep deprivation damages cognitive reaction times.", "translation": "الحرمان من النوم / قلة النوم المزمنة", "exampleArabic": "يضر الحرمان المزمن من النوم بسرعة ردود الفعل المعرفية.", "collocations": ["suffer from sleep deprivation", "effects of sleep deprivation"], "synonyms": [], "antonyms": [], "tags": ["sleep", "health"]},
    {"headword": "sedentary", "pronunciation": "/ˈsedntri/", "partOfSpeech": "adjective", "definition": "Spending much time seated; somewhat inactive physically.", "example": "Office workers often develop back strain from a sedentary routine.", "translation": "خامل / قليل الحركة / معتمد على الجلوس", "exampleArabic": "غالباً ما يصاب موظفو المكاتب بإجهاد الظهر بسبب الروتين قليل الحركة.", "collocations": ["sedentary lifestyle", "sedentary job"], "synonyms": ["inactive"], "antonyms": ["physically active"], "tags": ["lifestyle", "health"]},

    # Activity & Mind-Body Wellness (15)
    {"headword": "physically active", "pronunciation": "/ˈfɪzɪkli ˈæktɪv/", "partOfSpeech": "adjective", "definition": "Regularly engaging in physical exercise or movement.", "example": "They have been remaining physically active through daily brisk walks.", "translation": "نشط بدنياً / ممارس للحركة", "exampleArabic": "إنهم يحافظون على نشاطهم البدني عبر المشي السريع اليومي.", "collocations": ["stay physically active", "remain physically active"], "synonyms": ["energetic"], "antonyms": ["sedentary"], "tags": ["fitness", "lifestyle"]},
    {"headword": "daily step", "pronunciation": "/ˈdeɪli step/", "partOfSpeech": "noun", "definition": "A unit of walking activity measured across an entire day.", "example": "She has been hitting her ten-thousand daily step goal without fail.", "translation": "خطوة يومية (في عداد المشي)", "exampleArabic": "إنها تحقق هدف العشرة آلاف خطوة يومية دون إخفاق.", "collocations": ["daily step count", "reach daily steps"], "synonyms": [], "antonyms": [], "tags": ["fitness", "wellness"]},
    {"headword": "outdoor recreation", "pronunciation": "/ˌaʊtdɔː ˌrekriˈeɪʃn/", "partOfSpeech": "noun", "definition": "Physical leisure activities carried out in open natural spaces.", "example": "Engaging in outdoor recreation lowers stress hormones considerably.", "translation": "استجمام ونشاط في الهواء الطلق", "exampleArabic": "تخفض ممارسة الاستجمام في الهواء الطلق هرمونات التوتر بصورة ملحوظة.", "collocations": ["enjoy outdoor recreation", "parks and outdoor recreation"], "synonyms": ["nature activities"], "antonyms": [], "tags": ["lifestyle", "wellness"]},
    {"headword": "stress management", "pronunciation": "/ˈstres ˈmænɪdʒmənt/", "partOfSpeech": "noun", "definition": "Techniques aimed at controlling a person's level of stress.", "example": "He has been studying stress management strategies for months.", "translation": "إدارة الضغوط النفسية / تخفيف التوتر", "exampleArabic": "إنه يدرس استراتيجيات إدارة التوتر منذ عدة أشهر.", "collocations": ["effective stress management", "stress management course"], "synonyms": [], "antonyms": [], "tags": ["wellness", "psychology"]},
    {"headword": "meditation", "pronunciation": "/ˌmedɪˈteɪʃn/", "partOfSpeech": "noun", "definition": "A practice where an individual uses a technique to train attention.", "example": "Quiet meditation in the morning calms a turbulent mind.", "translation": "تأمل", "exampleArabic": "يهدئ التأمل الصامت في الصباح العقل المضطرب.", "collocations": ["daily meditation", "guided meditation"], "synonyms": ["contemplation"], "antonyms": [], "tags": ["mindfulness", "wellness"]},
    {"headword": "mindfulness", "pronunciation": "/ˈmaɪndflnəs/", "partOfSpeech": "noun", "definition": "The psychological quality of focusing one's awareness on the present moment.", "example": "She has been cultivating mindfulness during ordinary daily chores.", "translation": "يقظة ذهنية / حضور ذهني", "exampleArabic": "إنها تنمي اليقظة الذهنية أثناء تأدية الأعمال المنزلية العادية.", "collocations": ["practice mindfulness", "mindfulness exercise"], "synonyms": ["present awareness"], "antonyms": ["distraction"], "tags": ["mindfulness", "wellness"]},
    {"headword": "mental clarity", "pronunciation": "/ˈmentl ˈklærəti/", "partOfSpeech": "noun", "definition": "A state of psychological sharpness, focus, and absence of confusion.", "example": "A brisk morning stroll provides wonderful mental clarity.", "translation": "صفاء ذهني / وضوح فكري", "exampleArabic": "تمنح النزهة الصباحية السريعة صفاءً ذهنياً رائعاً.", "collocations": ["gain mental clarity", "restore mental clarity"], "synonyms": ["lucidity"], "antonyms": ["brain fog"], "tags": ["mindfulness", "psychology"]},
    {"headword": "breathing exercise", "pronunciation": "/ˈbriːðɪŋ ˈeksəsaɪz/", "partOfSpeech": "noun", "definition": "Controlled breathing patterns used to induce calmness.", "example": "A slow diaphragmatic breathing exercise lowers acute heart rate.", "translation": "تمرين تنفس", "exampleArabic": "يخفض تمرين التنفس البطني البطيء ضربات القلب المتسارعة.", "collocations": ["do a breathing exercise", "deep breathing exercise"], "synonyms": [], "antonyms": [], "tags": ["wellness", "mindfulness"]},
    {"headword": "self-care routine", "pronunciation": "/ˌself ˈkeə ruːˈtiːn/", "partOfSpeech": "noun", "definition": "Deliberate practices executed regularly to maintain personal health.", "example": "She has been designing an intentional self-care routine.", "translation": "روتين العناية بالذات", "exampleArabic": "إنها تصمم روتين عناية ذاتية واعياً وموجهاً.", "collocations": ["daily self-care routine", "nurturing self-care routine"], "synonyms": [], "antonyms": [], "tags": ["wellness", "lifestyle"]},
    {"headword": "detoxify", "pronunciation": "/diːˈtɒksɪfaɪ/", "partOfSpeech": "verb", "definition": "To remove toxic or unhealthy substances from the body.", "example": "Drinking copious clean water helps the kidneys detoxify the bloodstream.", "translation": "يطهر الجسم من السموم", "exampleArabic": "يساعد شرب الماء النقي الوفير الكليتين على تنقية مجرى الدم من السموم.", "verbForms": {"v1": "detoxify", "v2": "detoxified", "v3": "detoxified"}, "collocations": ["naturally detoxify", "detoxify the body"], "synonyms": ["cleanse", "purify"], "antonyms": ["contaminate"], "tags": ["health", "wellness"]},
    {"headword": "longevity", "pronunciation": "/lɒnˈdʒevəti/", "partOfSpeech": "noun", "definition": "Long life; great duration of individual life.", "example": "Regular aerobic exercise contributes greatly to lifelong longevity.", "translation": "طول العمر بصحة وعافية", "exampleArabic": "تسهم التمارين الهوائية المنتظمة إسهاماً كبيراً في التمتع بطول العمر بعافية.", "collocations": ["promote longevity", "secret to longevity"], "synonyms": ["long life"], "antonyms": [], "tags": ["health", "wellness"]},
    {"headword": "wellness", "pronunciation": "/ˈwelnəs/", "partOfSpeech": "noun", "definition": "The state of being in good health, especially as an actively pursued goal.", "example": "They have been attending an inspiring community wellness retreat.", "translation": "عافية شاملة / صحة متكاملة", "exampleArabic": "إنهم يحضرون مخيماً مجتمعياً ملهماً للعافية والصحة الشاملة.", "collocations": ["holistic wellness", "wellness retreat"], "synonyms": ["well-being"], "antonyms": ["illness"], "tags": ["wellness", "health"]},
    {"headword": "aerobic exercise", "pronunciation": "/eəˈrəʊbɪk ˈeksəsaɪz/", "partOfSpeech": "noun", "definition": "Physical exercise of low to high intensity that depends on aerobic energy.", "example": "He has been doing moderate aerobic exercise four times a week.", "translation": "تمارين هوائية (أيروبيك)", "exampleArabic": "إنه يمارس تمارين هوائية معتدلة أربع مرات أسبوعياً.", "collocations": ["engage in aerobic exercise", "regular aerobic exercise"], "synonyms": ["cardio"], "antonyms": ["anaerobic exercise"], "tags": ["fitness", "health"]},
    {"headword": "water consumption", "pronunciation": "/ˈwɔːtə kənˈsʌmpʃn/", "partOfSpeech": "noun", "definition": "The act of taking in water by drinking.", "example": "Tracking daily water consumption ensures steady cellular hydration.", "translation": "استهلاك الماء / كمية شرب الماء", "exampleArabic": "يضمن تتبع كمية استهلاك الماء اليومية ترطيباً خلوياً ثابتاً.", "collocations": ["increase water consumption", "daily water consumption"], "synonyms": ["fluid intake"], "antonyms": [], "tags": ["health", "hydration"]},
    {"headword": "superfood", "pronunciation": "/ˈsuːpəfuːd/", "partOfSpeech": "noun", "definition": "A nutrient-rich food considered to be especially beneficial for health and well-being.", "example": "Chia seeds and blueberries are recognized as quintessential superfoods.", "translation": "غذاء خارق فائق القيمة الغذائية", "exampleArabic": "تعتبر بذور الشيا والتوت الأزرق من الأغذية الخارقة فائقة القيمة الغذائية.", "collocations": ["nutrient-dense superfood", "eat superfoods"], "synonyms": [], "antonyms": [], "tags": ["health", "diet"]}
]

grammar_53 = [
    {
        "title": "Present Perfect Continuous",
        "titleArabic": "المضارع التام المستمر",
        "explanation": "We use the Present Perfect Continuous to talk about actions or lifestyle habits that started in the past and have continued up to the present moment, or actions that finished very recently with visible, tangible results right now. When discussing health, fitness, sleep, and nutrition, this tense is the gold standard for describing routines that you have maintained over time. The formula is: Subject + have / has + been + Verb-ing. We frequently use 'for' (duration) and 'since' (starting point).",
        "explanationArabic": "نستخدم زمن المضارع التام المستمر للحديث عن أفعال أو عادات معيشية وصحية بدأت في الماضي وما زالت مستمرة حتى اللحظة الحالية، أو انتهت قبل قليل ولها أثر واضح في الحاضر. وفي سياق الحديث عن الصحة والعادات والرياضة والنوم، تعتبر هذه القاعدة هي الأداة المثالية لوصف العادات التي داوم عليها الشخص. القاعدة: الفاعل + have / has + been + الفعل مضافاً له ing. وغالباً ما نقترن بـ for (للمدة) و since (لبداية الفترة).",
        "structures": [
            {"label": "Affirmative · الإثبات", "pattern": "Subject + have / has + been + V-ing", "explanation": "Describes a healthy habit or activity ongoing from the past until now.", "explanationArabic": "يصف عادة صحية أو نشاطاً مستمراً بدأ في الماضي وما زال متواصلاً."},
            {"label": "Negative · النفي", "pattern": "Subject + have / has + not + been + V-ing", "explanation": "Shows an action that has not been taking place over recent time.", "explanationArabic": "يوضح فعلاً لم يكن مستمراً طوال الفترة الأخيرة."},
            {"label": "Question · السؤال", "pattern": "Have / Has + Subject + been + V-ing?", "explanation": "Asks about continuous habits or ongoing health routines.", "explanationArabic": "يسأل عن عادات مستمرة أو روتين صحي متواصل."}
        ],
        "examples": [
            {"sentence": "I have been practicing intermittent fasting and meal prep every week since January.", "translation": "إنني أمارس الصيام المتقطع وتجهيز الوجبات مسبقاً كل أسبوع منذ شهر يناير.", "usesVocabulary": ["intermittent fasting", "meal prep"]},
            {"sentence": "She has been tracking her daily step count and aerobic exercise consistently for three months.", "translation": "إنها تتتبع عدد خطواتها اليومية والتمارين الهوائية بثبات منذ ثلاثة أشهر.", "usesVocabulary": ["daily step", "aerobic exercise"]},
            {"sentence": "They have been focusing on proper hydration and balanced nutrition to improve gut flora.", "translation": "إنهم يركزون على الترطيب المناسب والتغذية المتوازنة لتحسين بكتيريا الأمعاء النافعة.", "usesVocabulary": ["hydration", "nutrition", "gut flora"]},
            {"sentence": "He has been getting more deep sleep because he established a relaxing bedtime routine.", "translation": "إنه يحصل على مزيد من النوم العميق لأنه أرسى روتيناً مهدئاً لما قبل النوم.", "usesVocabulary": ["deep sleep", "bedtime routine"]}
        ],
        "commonMistakes": [
            {"wrong": "I have been meditate every morning for a year.", "right": "I have been meditating every morning for a year.", "note": "Always add -ing to the main verb after 'have/has been'.", "noteArabic": "يجب دائماً إضافة -ing للفعل الأساسي بعد have/has been."},
            {"wrong": "He has been practicing yoga since three months.", "right": "He has been practicing yoga for three months.", "note": "Use 'for' with periods of time (three months, two weeks) and 'since' with specific starting points (January, Monday).", "noteArabic": "استخدم for للمدد الزمنية (مثل ثلاثة أشهر) و since مع نقاط البداية المحددة."}
        ],
        "commonUsage": [
            "Habitual ongoing actions: 'I have been drinking two liters of water daily.' (تُستخدم للعادات الصحية المستمرة عبر الزمن.)",
            "Recent activity with present results: 'My muscles are sore because I have been lifting weights.' (تُستخدم لحدث انتهى مؤخراً وله أثر حاضر.)",
            "Expressing duration: 'She has been studying nutrition for five years.' (تُستخدم لتوضيح المدة الزمنية لنشاط متواصل.)"
        ]
    }
]

convs_53 = [
    {
        "title": "Adopting a Wholesome Diet",
        "titleArabic": "تبني نظام غذائي صحي ومتكامل",
        "setting": "Two colleagues chat in the staff kitchen while heating wholesome meals.",
        "lines": [
            {"speaker": "Adam", "text": "That colorful bowl looks delicious! Have you been doing weekly meal prep lately?"},
            {"speaker": "Sara", "text": "Yes, I have been preparing whole grain dishes loaded with dietary fiber every Sunday."},
            {"speaker": "Adam", "text": "I noticed you completely cut out junk food and excessive sugar intake."},
            {"speaker": "Sara", "text": "I have been eliminating processed food because my cholesterol and metabolism needed improvement."},
            {"speaker": "Adam", "text": "Have you been pairing that with intermittent fasting or dietary supplements?"},
            {"speaker": "Sara", "text": "I have been practicing a gentle fasting window, and my digestive health has improved dramatically."},
            {"speaker": "Adam", "text": "Adding a daily superfood like chia seeds also nourishes your gut flora."},
            {"speaker": "Sara", "text": "Exactly; balanced nutrition has completely transformed my daily energy!"}
        ],
        "vocabularyUsed": ["meal prep", "whole grain", "dietary fiber", "junk food", "sugar intake", "processed food", "cholesterol", "metabolism", "intermittent fasting", "dietary supplement", "digestive health", "superfood", "gut flora", "nutrition"]
    },
    {
        "title": "Optimizing Sleep Hygiene and Recovery",
        "titleArabic": "تحسين عادات النوم والتعافي البدني",
        "setting": "A wellness counselor discusses evening habits with an exhausted office worker.",
        "lines": [
            {"speaker": "Counselor", "text": "You look fatigued. Have you been struggling with severe sleep deprivation?"},
            {"speaker": "Client", "text": "Yes, I have been waking up groggy because my circadian rhythm is completely out of balance."},
            {"speaker": "Counselor", "text": "Have you been following a relaxing bedtime routine to prepare for sleep?"},
            {"speaker": "Client", "text": "Not really; I have been staring at bright computer screens until midnight."},
            {"speaker": "Counselor", "text": "Strict sleep hygiene is critical if you want restorative deep sleep and rem sleep."},
            {"speaker": "Client", "text": "Would a short twenty-minute power nap in the afternoon help my mental clarity?"},
            {"speaker": "Counselor", "text": "A brief nap helps, but consistent habits ensure you wake up well-rested every single day."},
            {"speaker": "Client", "text": "I will incorporate a mindful breathing exercise tonight to calm my nervous system."}
        ],
        "vocabularyUsed": ["sleep deprivation", "circadian rhythm", "bedtime routine", "sleep hygiene", "deep sleep", "rem sleep", "power nap", "mental clarity", "well-rested", "breathing exercise"]
    },
    {
        "title": "Staying Physically Active at Work",
        "titleArabic": "المحافظة على النشاط البدني وتجنب الخمول المكتبي",
        "setting": "Two friends discuss their fitness trackers while walking in the park.",
        "lines": [
            {"speaker": "Lina", "text": "I have been wearing a fitness tracker to avoid remaining sedentary all afternoon."},
            {"speaker": "Tariq", "text": "That is smart. Have you been hitting your daily step target consistently?"},
            {"speaker": "Lina", "text": "Yes! I have been remaining physically active by taking brisk outdoor recreation walks."},
            {"speaker": "Tariq", "text": "I have been combining aerobic exercise with a daily self-care routine for stress management."},
            {"speaker": "Lina", "text": "Mindfulness and daily meditation also help detoxify the mind from workplace tension."},
            {"speaker": "Tariq", "text": "And monitoring water consumption guarantees steady hydration throughout the day."},
            {"speaker": "Lina", "text": "Investing in lifelong wellness is truly the greatest secret to longevity."},
            {"speaker": "Tariq", "text": "I agree completely; prioritizing health yields rewards that last a lifetime."}
        ],
        "vocabularyUsed": ["sedentary", "daily step", "physically active", "outdoor recreation", "aerobic exercise", "self-care routine", "stress management", "mindfulness", "meditation", "detoxify", "water consumption", "hydration", "wellness", "longevity"]
    }
]

para1_text_53 = (
    "Transforming personal well-being begins in the kitchen through intentional nutritional choices that nourish the body. "
    "For the past several months, health-conscious individuals have been embracing meal prep to ensure that every dish features "
    "wholesome ingredients. By replacing sugary snacks with whole grain staples rich in dietary fiber, they have been stabilizing "
    "their daily metabolism and supporting long-term digestive health. Rather than counting every single calorie obsessively, "
    "they focus on consuming lean protein and antioxidant rich foods that support cellular repair. Eliminating processed food "
    "and curbing excessive sugar intake has been protecting their cardiovascular markers, while adding a natural superfood "
    "like ground flaxseed strengthens the gut flora, proving that balanced nutrition is the true foundation of vitality."
)

para2_text_53 = (
    "Restorative sleep is the cornerstone of biological recovery, yet modern lifestyles often compromise our natural cycles. "
    "Many professionals have been experiencing chronic sleep deprivation because artificial blue light disrupts their biological "
    "circadian rhythm. To counter this exhaustion, health advocates have been establishing a calming bedtime routine as part of "
    "strict sleep hygiene. Committing to cool, dark sleeping environments allows individuals to enjoy uninterrupted deep sleep "
    "and crucial rem sleep, enabling them to awaken genuinely well-rested. Taking a well-timed twenty-minute power nap during "
    "demanding afternoons also sharpens mental clarity, ensuring that cognitive faculties remain sharp throughout the entire working day."
)

para3_text_53 = (
    "Sustainable vitality requires an active synergy between physical movement and deliberate mental rejuvenation. To break free "
    "from a sedentary desk routine, workers have been staying physically active by reaching their ten-thousand daily step goal. "
    "They have been incorporating outdoor recreation and moderate aerobic exercise into their weekends while tracking adequate "
    "water consumption for cellular hydration. Concurrently, practicing stress management through silent meditation and a calming "
    "breathing exercise helps detoxify the psyche from accumulated anxiety. By honoring a nurturing self-care routine and "
    "cultivating present mindfulness, committed individuals have been investing in lifelong longevity and holistic personal wellness."
)

paras_53 = [
    {
        "title": "Nutritional Transformation and Gut Health",
        "titleArabic": "التحول الغذائي وصحة الجهاز الهضمي",
        "kind": "informative",
        "text": para1_text_53,
        "translation": "يبدأ التحول في العافية الشخصية من المطبخ عبر خيارات غذائية واعية تغذي البدن. فطوال الأشهر الماضية، تبنى المهتمون بالصحة تجهيز الوجبات مسبقاً لضمان احتواء كل وجبة على مكونات صحية نقية. وباستبدال المقرمشات السكرية بحبوب كاملة غنية بالألياف الغذائية، عملوا على استقرار عملية الأيض ودعم صحة الجهاز الهضمي. وبدلاً من العد الهوسي لكل سعر حراري، يركزون على البروتين ومضادات الأكسدة التي تدعم تجدد الخلايا، بينما يحمي استبعاد الأغذية المصنعة وتقليل السكر صحة الشرايين.",
        "vocabularyUsed": ["meal prep", "wholesome", "whole grain", "dietary fiber", "metabolism", "digestive health", "calorie", "protein", "antioxidant", "processed food", "sugar intake", "superfood", "gut flora", "nutrition"]
    },
    {
        "title": "Sleep Architecture and Cellular Recovery",
        "titleArabic": "معمارية النوم والتعافي الخلوي",
        "kind": "expository",
        "text": para2_text_53,
        "translation": "يُعد النوم المرمم حجر الزاوية للتعافي البيولوجي، غير أن أنماط الحياة العصرية غالباً ما تخل بدوراتنا الطبيعية. فقد عانى الكثير من المهنيين من حرمان مزمن من النوم بسبب الضوء الأزرق الذي يعطل ساعتهم البيولوجية. ولمواجهة هذا الإرهاق، أرسى دعاة الصحة روتيناً مهدئاً لما قبل النوم كجزء من عادات النوم الصحية. ويوفر النوم في بيئة مظلمة وباردة نوماً عميقاً متواصلاً ونوم حركة العين السريعة، مما يتيح الاستيقاظ بنشاط وراحة، بينما تعيد الغفوة النهارية الصفاء الذهني.",
        "vocabularyUsed": ["sleep deprivation", "circadian rhythm", "bedtime routine", "sleep hygiene", "deep sleep", "rem sleep", "well-rested", "power nap", "mental clarity"]
    },
    {
        "title": "Active Living, Stress Relief, and Longevity",
        "titleArabic": "الحياة النشطة، وإدارة الضغوط، وطول العمر بالعافية",
        "kind": "reflective",
        "text": para3_text_53,
        "translation": "تتطلب الحيوية المستدامة تناغماً فعالاً بين الحركة البدنية والتجدد الذهني الواعي. وللخروج من الروتين المكتبي الخامل، حرص العاملون على البقاء نشطين بدنياً عبر تحقيق هدف الخطوات اليومية. وقد دمجوا الاستجمام في الهواء الطلق والتمارين الهوائية المعتدلة في عطلاتهم مع تتبع استهلاك الماء للترطيب. وبالتوازي مع ذلك، تساعد إدارة الضغوط عبر التأمل وتمارين التنفس على تطهير النفس من القلق، ليكون روتين العناية بالذات واليقظة الذهنية استثماراً حقيقياً في طول العمر والعافية.",
        "vocabularyUsed": ["sedentary", "physically active", "daily step", "outdoor recreation", "aerobic exercise", "water consumption", "hydration", "stress management", "meditation", "breathing exercise", "detoxify", "self-care routine", "mindfulness", "longevity", "wellness"]
    }
]

if __name__ == "__main__":
    print("Writing Day 53...")
    write_day(53, vocab_53, grammar_53, convs_53, paras_53)
