# -*- coding: utf-8 -*-
"""Generator for Day 52: At the Doctor (Medical visits, tests and advice)."""

import json, os, sys
from scripts.curriculum_engine import write_day

vocab_data = [
    # Medical Professionals & Roles (8)
    {
        "headword": "physician",
        "pronunciation": "/fɪˈzɪʃn/",
        "partOfSpeech": "noun",
        "definition": "A person qualified to practice medicine, especially one who specializes in diagnosis and medical treatment.",
        "example": "The attending physician was consulted when the patient's condition worsened.",
        "translation": "طبيب معالج / ممارس للطب الباطني",
        "exampleArabic": "تمت استشارة الطبيب المعالج عندما تدهورت حالة المريض.",
        "relatedForms": [],
        "collocations": ["attending physician", "chief physician"],
        "synonyms": ["doctor", "medical doctor"],
        "antonyms": [],
        "tags": ["healthcare", "professions"]
    },
    {
        "headword": "practitioner",
        "pronunciation": "/prækˈtɪʃənə/",
        "partOfSpeech": "noun",
        "definition": "A person actively engaged in an art, discipline, or profession, especially medicine.",
        "example": "A skilled general practitioner was assigned to supervise community vaccinations.",
        "translation": "ممارس (طبي)",
        "exampleArabic": "تم تعيين ممارس عام ماهر للإشراف على التطعيمات المجتمعية.",
        "relatedForms": ["practice"],
        "collocations": ["general practitioner", "medical practitioner"],
        "synonyms": ["clinician"],
        "antonyms": [],
        "tags": ["healthcare", "professions"]
    },
    {
        "headword": "surgeon",
        "pronunciation": "/ˈsɜːdʒən/",
        "partOfSpeech": "noun",
        "definition": "A medical practitioner qualified to practice surgery.",
        "example": "The orthopedic surgeon was notified as soon as the emergency patient arrived.",
        "translation": "جراح",
        "exampleArabic": "تم إخطار جراح العظام فور وصول مريض الطوارئ.",
        "relatedForms": ["surgical", "surgery"],
        "collocations": ["orthopedic surgeon", "lead surgeon"],
        "synonyms": [],
        "antonyms": [],
        "tags": ["healthcare", "professions"]
    },
    {
        "headword": "paramedic",
        "pronunciation": "/ˌpærəˈmedɪk/",
        "partOfSpeech": "noun",
        "definition": "A person trained to give emergency medical care to people who are seriously ill or injured, typically in an ambulance.",
        "example": "Emergency oxygen was administered by the paramedic inside the ambulance.",
        "translation": "مسعف",
        "exampleArabic": "تم إعطاء أكسجين الطوارئ من قبل المسعف داخل سيارة الإسعاف.",
        "relatedForms": [],
        "collocations": ["emergency paramedic", "trained paramedic"],
        "synonyms": ["first responder"],
        "antonyms": [],
        "tags": ["healthcare", "emergency"]
    },
    {
        "headword": "pediatrician",
        "pronunciation": "/ˌpiːdiəˈtrɪʃn/",
        "partOfSpeech": "noun",
        "definition": "A medical practitioner specializing in children and their diseases.",
        "example": "The toddler was thoroughly evaluated by an experienced pediatrician.",
        "translation": "طبيب أطفال",
        "exampleArabic": "تم تقييم الطفل الصغير بدقة من قبل طبيب أطفال ذي خبرة.",
        "relatedForms": ["pediatric"],
        "collocations": ["consult a pediatrician", "board-certified pediatrician"],
        "synonyms": [],
        "antonyms": [],
        "tags": ["healthcare", "professions"]
    },
    {
        "headword": "cardiologist",
        "pronunciation": "/ˌkɑːdiˈɒlədʒɪst/",
        "partOfSpeech": "noun",
        "definition": "A doctor who specializes in the study or treatment of heart diseases and heart abnormalities.",
        "example": "An urgent consultation with a cardiologist was requested after abnormal heart rhythms were recorded.",
        "translation": "طبيب قلب",
        "exampleArabic": "طُلبت استشارة عاجلة مع طبيب قلب بعد تسجيل اضطرابات في ضربات القلب.",
        "relatedForms": ["cardiology", "cardiac"],
        "collocations": ["consult a cardiologist", "consultant cardiologist"],
        "synonyms": ["heart specialist"],
        "antonyms": [],
        "tags": ["healthcare", "professions"]
    },
    {
        "headword": "dermatologist",
        "pronunciation": "/ˌdɜːməˈtɒlədʒɪst/",
        "partOfSpeech": "noun",
        "definition": "A medical practitioner qualified to diagnose and treat skin disorders.",
        "example": "The suspicious skin lesion was biopsied by the dermatologist last Thursday.",
        "translation": "طبيب جلدية",
        "exampleArabic": "أُخذت خزعة من الآفة الجلدية المشبوهة بواسطة طبيب الجلدية يوم الخميس الماضي.",
        "relatedForms": ["dermatology"],
        "collocations": ["visit a dermatologist", "licensed dermatologist"],
        "synonyms": ["skin specialist"],
        "antonyms": [],
        "tags": ["healthcare", "professions"]
    },
    {
        "headword": "pharmacist",
        "pronunciation": "/ˈfɑːməsɪst/",
        "partOfSpeech": "noun",
        "definition": "A person who is professionally qualified to prepare and dispense medicinal drugs.",
        "example": "Correct dosage instructions were carefully clarified by the hospital pharmacist.",
        "translation": "صيدلي",
        "exampleArabic": "تم توضيح تعليمات الجرعة الصحيحة بعناية من قبل صيدلي المستشفى.",
        "relatedForms": ["pharmacy"],
        "collocations": ["consult a pharmacist", "dispensing pharmacist"],
        "synonyms": ["chemist", "apothecary"],
        "antonyms": [],
        "tags": ["healthcare", "professions"]
    },

    # Clinical Encounters & Diagnostic Steps (7)
    {
        "headword": "patient",
        "pronunciation": "/ˈpeɪʃnt/",
        "partOfSpeech": "noun",
        "definition": "A person receiving or registered to receive medical treatment.",
        "example": "The elderly patient was admitted to the recovery ward yesterday afternoon.",
        "translation": "مريض",
        "exampleArabic": "أُدخل المريض المسن إلى جناح التعافي بعد ظهر أمس.",
        "relatedForms": [],
        "collocations": ["admit a patient", "outpatient"],
        "synonyms": [],
        "antonyms": [],
        "tags": ["healthcare", "clinical"]
    },
    {
        "headword": "consultation",
        "pronunciation": "/ˌkɒnslˈteɪʃn/",
        "partOfSpeech": "noun",
        "definition": "A meeting with an expert or professional, such as a medical doctor, in order to seek advice.",
        "example": "A formal clinical consultation was scheduled for ten o'clock this morning.",
        "translation": "استشارة طبية",
        "exampleArabic": "تم تحديد موعد استشارة سريرية رسمية في الساعة العاشرة صباح اليوم.",
        "relatedForms": ["consult"],
        "collocations": ["medical consultation", "free consultation"],
        "synonyms": ["appointment", "interview"],
        "antonyms": [],
        "tags": ["healthcare", "clinical"]
    },
    {
        "headword": "checkup",
        "pronunciation": "/ˈtʃekʌp/",
        "partOfSpeech": "noun",
        "definition": "A thorough medical or dental examination to detect any disease or health problems.",
        "example": "A routine annual checkup was completed before the athlete began training.",
        "translation": "فحص طبي دوري / كشف وقائي",
        "exampleArabic": "تم إنجاز فحص طبي دوري سنوي قبل أن يبدأ الرياضي تدريبه.",
        "relatedForms": [],
        "collocations": ["annual checkup", "routine checkup"],
        "synonyms": ["medical examination", "physical"],
        "antonyms": [],
        "tags": ["healthcare", "prevention"]
    },
    {
        "headword": "diagnosis",
        "pronunciation": "/ˌdaɪəɡˈnəʊsɪs/",
        "partOfSpeech": "noun",
        "definition": "The identification of the nature of an illness or other problem by examination of the symptoms.",
        "example": "A definitive diagnosis of acute appendicitis was confirmed by the ultrasound results.",
        "translation": "تشخيص طبي",
        "exampleArabic": "تم تأكيد تشخيص حاسم لالتهاب الزائدة الدودية الحاد عبر نتائج الموجات فوق الصوتية.",
        "relatedForms": ["diagnose", "diagnostic"],
        "collocations": ["confirm a diagnosis", "early diagnosis"],
        "synonyms": ["identification", "assessment"],
        "antonyms": [],
        "tags": ["healthcare", "diagnosis"]
    },
    {
        "headword": "prognosis",
        "pronunciation": "/prɒɡˈnəʊsɪs/",
        "partOfSpeech": "noun",
        "definition": "The likely course of a medical condition or disease.",
        "example": "An optimistic prognosis was delivered to the family after the successful operation.",
        "translation": "تكهن بسير المرض / مآل الحالة المرضية",
        "exampleArabic": "قُدم مآل متفائل لسير المرض إلى العائلة بعد نجاح العملية.",
        "relatedForms": [],
        "collocations": ["favorable prognosis", "poor prognosis"],
        "synonyms": ["forecast", "outlook"],
        "antonyms": [],
        "tags": ["healthcare", "clinical"]
    },
    {
        "headword": "prescription",
        "pronunciation": "/prɪˈskrɪpʃn/",
        "partOfSpeech": "noun",
        "definition": "An instruction written by a medical practitioner that authorizes a patient to be provided with a medicine or treatment.",
        "example": "A digital prescription was sent directly to the local pharmacy by the doctor.",
        "translation": "وصفة طبية / روشتة",
        "exampleArabic": "أُرسلت وصفة طبية رقمية مباشرة إلى الصيدلية المحلية من قبل الطبيب.",
        "relatedForms": ["prescribe"],
        "collocations": ["write a prescription", "fill a prescription"],
        "synonyms": [],
        "antonyms": [],
        "tags": ["healthcare", "medication"]
    },
    {
        "headword": "dosage",
        "pronunciation": "/ˈdəʊsɪdʒ/",
        "partOfSpeech": "noun",
        "definition": "The size or frequency of a dose of a medicine or drug.",
        "example": "The initial antibiotic dosage was reduced when kidney function test results were reviewed.",
        "translation": "مقدار الجرعة / العيار الدوائي",
        "exampleArabic": "تم تقليل جرعة المضاد الحيوي الأولية عندما تمت مراجعة نتائج فحص وظائف الكلى.",
        "relatedForms": ["dose"],
        "collocations": ["recommended dosage", "daily dosage"],
        "synonyms": ["dose"],
        "antonyms": [],
        "tags": ["healthcare", "medication"]
    },

    # Instruments & Clinical Measures (8)
    {
        "headword": "stethoscope",
        "pronunciation": "/ˈsteθəskəʊp/",
        "partOfSpeech": "noun",
        "definition": "A medical instrument for listening to the action of someone's heart or breathing.",
        "example": "A calibrated stethoscope was placed against the patient's chest to detect murmurs.",
        "translation": "سماعة الطبيب",
        "exampleArabic": "وُضعت سماعة طبية معايرة على صدر المريض لرصد أي أصوات غير طبيعية في القلب.",
        "relatedForms": [],
        "collocations": ["use a stethoscope", "listen with a stethoscope"],
        "synonyms": [],
        "antonyms": [],
        "tags": ["healthcare", "instruments"]
    },
    {
        "headword": "thermometer",
        "pronunciation": "/θəˈmɒmɪtə/",
        "partOfSpeech": "noun",
        "definition": "An instrument for measuring and indicating temperature.",
        "example": "An infrared thermometer was aimed at the patient's temple during the triage intake.",
        "translation": "ميزان حرارة / مقياس الحرارة",
        "exampleArabic": "تم توجيه مقياس حرارة بالأشعة تحت الحمراء نحو صدغ المريض أثناء الفرز الأولي.",
        "relatedForms": [],
        "collocations": ["digital thermometer", "read the thermometer"],
        "synonyms": [],
        "antonyms": [],
        "tags": ["healthcare", "instruments"]
    },
    {
        "headword": "syringe",
        "pronunciation": "/sɪˈrɪndʒ/",
        "partOfSpeech": "noun",
        "definition": "A tube with a nozzle and piston for sucking in and ejecting liquid in a thin stream.",
        "example": "A sterile disposable syringe was prepared by the nurse prior to the vaccination.",
        "translation": "حقنة / محقنة طبية",
        "exampleArabic": "تم تجهيز حقنة معقمة تستخدم لمرة واحدة من قبل الممرضة قبل التطعيم.",
        "relatedForms": [],
        "collocations": ["disposable syringe", "needle and syringe"],
        "synonyms": [],
        "antonyms": [],
        "tags": ["healthcare", "instruments"]
    },
    {
        "headword": "injection",
        "pronunciation": "/ɪnˈdʒekʃn/",
        "partOfSpeech": "noun",
        "definition": "An instance of injecting or being injected with a liquid medicine or drug into the body.",
        "example": "A painless intramuscular injection was administered in the upper arm.",
        "translation": "حقنة (عملية الحقن أو إبرة العلاج)",
        "exampleArabic": "أُعطيت حقنة عضلية غير مؤلمة في الجزء العلوي من الذراع.",
        "relatedForms": ["inject"],
        "collocations": ["give an injection", "receive an injection"],
        "synonyms": ["shot", "jab"],
        "antonyms": [],
        "tags": ["healthcare", "medication"]
    },
    {
        "headword": "vaccine",
        "pronunciation": "/ˈvæksiːn/",
        "partOfSpeech": "noun",
        "definition": "A substance used to stimulate the production of antibodies and provide immunity against diseases.",
        "example": "The booster vaccine was distributed to all vulnerable citizens last autumn.",
        "translation": "لقاح / طُعم",
        "exampleArabic": "تم توزيع اللقاح المعزز على جميع المواطنين الأكثر عرضة للخطر الخريف الماضي.",
        "relatedForms": ["vaccinate", "vaccination"],
        "collocations": ["administer a vaccine", "flu vaccine"],
        "synonyms": ["immunization"],
        "antonyms": [],
        "tags": ["healthcare", "prevention"]
    },
    {
        "headword": "blood pressure",
        "pronunciation": "/ˈblʌd preʃə/",
        "partOfSpeech": "noun",
        "definition": "The pressure of the blood in the circulatory system, often measured for diagnosis.",
        "example": "The patient's blood pressure was recorded as normal after twenty minutes of quiet rest.",
        "translation": "ضغط الدم",
        "exampleArabic": "سُجل ضغط دم المريض كطبيعي بعد عشرين دقيقة من الراحة الهادئة.",
        "relatedForms": [],
        "collocations": ["high blood pressure", "check blood pressure"],
        "synonyms": [],
        "antonyms": [],
        "tags": ["healthcare", "vitals"]
    },
    {
        "headword": "pulse rate",
        "pronunciation": "/ˈpʌls reɪt/",
        "partOfSpeech": "noun",
        "definition": "The number of heartbeats per unit of time, typically expressed as beats per minute.",
        "example": "A steady pulse rate was observed throughout the minor surgical procedure.",
        "translation": "معدل النبض",
        "exampleArabic": "لوحظ معدل نبض ثابت طوال الإجراء الجراحي البسيط.",
        "relatedForms": [],
        "collocations": ["elevated pulse rate", "measure pulse rate"],
        "synonyms": ["heart rate"],
        "antonyms": [],
        "tags": ["healthcare", "vitals"]
    },
    {
        "headword": "vital signs",
        "pronunciation": "/ˈvaɪtl saɪnz/",
        "partOfSpeech": "noun",
        "definition": "Clinical measurements, specifically pulse rate, temperature, respiration rate, and blood pressure.",
        "example": "All four vital signs were logged into the electronic health record upon admission.",
        "translation": "العلامات الحيوية (النبض، الضغط، الحرارة، التنفس)",
        "exampleArabic": "سُجلت العلامات الحيوية الأربع كافة في السجل الصحي الإلكتروني فور الدخول.",
        "relatedForms": [],
        "collocations": ["monitor vital signs", "stable vital signs"],
        "synonyms": ["vitals"],
        "antonyms": [],
        "tags": ["healthcare", "vitals"]
    },

    # Imaging & Laboratory Tests (7)
    {
        "headword": "x-ray",
        "pronunciation": "/ˈeks reɪ/",
        "partOfSpeech": "noun",
        "definition": "A photographic or digital image of the internal composition of a part of the body, produced by X-rays.",
        "example": "A diagnostic chest x-ray was ordered immediately to rule out pneumonia.",
        "translation": "أشعة سينية / صورة أشعة إكس",
        "exampleArabic": "طُلبت صورة أشعة سينية تشخيصية للصدر على الفور لاستبعاد الالتهاب الرئوي.",
        "relatedForms": ["x-ray (v)"],
        "collocations": ["chest x-ray", "take an x-ray"],
        "synonyms": ["radiograph"],
        "antonyms": [],
        "tags": ["healthcare", "imaging"]
    },
    {
        "headword": "ultrasound",
        "pronunciation": "/ˈʌltrəsaʊnd/",
        "partOfSpeech": "noun",
        "definition": "The use of ultrasonic waves for diagnostic or therapeutic purposes, especially in imaging internal organs.",
        "example": "An abdominal ultrasound was performed to inspect the gallbladder and liver.",
        "translation": "موجات فوق صوتية / تصوير بالسونار",
        "exampleArabic": "أُجري تصوير بالموجات فوق الصوتية للبطن لفحص المرارة والكبد.",
        "relatedForms": [],
        "collocations": ["pelvic ultrasound", "ultrasound scan"],
        "synonyms": ["sonogram"],
        "antonyms": [],
        "tags": ["healthcare", "imaging"]
    },
    {
        "headword": "mri scan",
        "pronunciation": "/ˌem ɑːr ˈaɪ skæn/",
        "partOfSpeech": "noun",
        "definition": "A medical imaging technique that uses a strong magnetic field and radio waves to produce detailed images of the body.",
        "example": "A brain mri scan was recommended by the neurologist to investigate recurring dizzy spells.",
        "translation": "فحص بالرنين المغناطيسي",
        "exampleArabic": "أوصى طبيب الأعصاب بإجراء فحص بالرنين المغناطيسي للدماغ للتحقيق في نوبات الدوار المتكررة.",
        "relatedForms": [],
        "collocations": ["undergo an mri scan", "mri scan results"],
        "synonyms": ["magnetic resonance imaging"],
        "antonyms": [],
        "tags": ["healthcare", "imaging"]
    },
    {
        "headword": "biopsy",
        "pronunciation": "/ˈbaɪɒpsi/",
        "partOfSpeech": "noun",
        "definition": "An examination of tissue removed from a living body to discover the presence, cause, or extent of a disease.",
        "example": "A tiny tissue biopsy was sent to the pathology laboratory for histological evaluation.",
        "translation": "خزعة نسيجية",
        "exampleArabic": "أُرسلت خزعة نسيجية دقيقة إلى مختبر علم الأمراض للتقييم النسيجي.",
        "relatedForms": ["biopsied"],
        "collocations": ["skin biopsy", "perform a biopsy"],
        "synonyms": [],
        "antonyms": [],
        "tags": ["healthcare", "pathology"]
    },
    {
        "headword": "specimen",
        "pronunciation": "/ˈspesəmən/",
        "partOfSpeech": "noun",
        "definition": "An individual animal, plant, piece of a mineral, etc. taken as an example for scientific examination or analysis.",
        "example": "A sterile urine specimen was collected in a sealed container for microbial culture.",
        "translation": "عينة مخبرية",
        "exampleArabic": "جُمعت عينة بول معقمة في وعاء محكم الإغلاق للزراعة الميكروبية.",
        "relatedForms": [],
        "collocations": ["blood specimen", "collect a specimen"],
        "synonyms": ["sample"],
        "antonyms": [],
        "tags": ["healthcare", "laboratory"]
    },
    {
        "headword": "lab result",
        "pronunciation": "/ˈlæb rɪzʌlt/",
        "partOfSpeech": "noun",
        "definition": "The outcome or data obtained from chemical or pathological laboratory testing.",
        "example": "The comprehensive lab result was uploaded to the secure patient portal within twenty-four hours.",
        "translation": "نتيجة التحليل المخبري",
        "exampleArabic": "رُفعت نتيجة التحليل المخبري الشاملة إلى بوابة المريض الآمنة خلال أربع وعشرين ساعة.",
        "relatedForms": [],
        "collocations": ["await lab results", "abnormal lab result"],
        "synonyms": ["test report"],
        "antonyms": [],
        "tags": ["healthcare", "laboratory"]
    },
    {
        "headword": "referral",
        "pronunciation": "/rɪˈfɜːrəl/",
        "partOfSpeech": "noun",
        "definition": "The act of referring someone or something for consultation, review, or further action.",
        "example": "An urgent specialist referral was written by the family doctor yesterday morning.",
        "translation": "إحالة طبية (تحويل إلى أخصائي)",
        "exampleArabic": "كُتبت إحالة طبية عاجلة إلى أخصائي من قبل طبيب الأسرة صباح أمس.",
        "relatedForms": ["refer"],
        "collocations": ["specialist referral", "obtain a referral"],
        "synonyms": [],
        "antonyms": [],
        "tags": ["healthcare", "clinical"]
    },

    # Treatments, Medications & Procedures (12)
    {
        "headword": "treatment plan",
        "pronunciation": "/ˈtriːtmənt plæn/",
        "partOfSpeech": "noun",
        "definition": "A detailed strategy created by a medical provider outlining therapeutic steps for managing an illness.",
        "example": "A customized treatment plan was drafted to address both chronic pain and physical mobility.",
        "translation": "خطة علاجية",
        "exampleArabic": "وُضعت خطة علاجية مخصصة لمعالجة كل من الألم المزمن والحركة البدنية.",
        "relatedForms": [],
        "collocations": ["comprehensive treatment plan", "follow a treatment plan"],
        "synonyms": ["care plan"],
        "antonyms": [],
        "tags": ["healthcare", "therapy"]
    },
    {
        "headword": "therapy",
        "pronunciation": "/ˈθerəpi/",
        "partOfSpeech": "noun",
        "definition": "Treatment intended to relieve or heal a disorder.",
        "example": "Intensive physical therapy was prescribed for three consecutive months after the fracture.",
        "translation": "علاج (طبي أو نفسي أو تأهيلي)",
        "exampleArabic": "وُصف علاج طبيعي مكثف لمدة ثلاثة أشهر متتالية بعد الكسر.",
        "relatedForms": ["therapeutic", "therapist"],
        "collocations": ["physical therapy", "speech therapy"],
        "synonyms": ["treatment", "remedy"],
        "antonyms": [],
        "tags": ["healthcare", "therapy"]
    },
    {
        "headword": "rehabilitation",
        "pronunciation": "/ˌriːhəˌbɪlɪˈteɪʃn/",
        "partOfSpeech": "noun",
        "definition": "The action of restoring someone to health or normal life through training and therapy.",
        "example": "Comprehensive rehabilitation was completed at the specialized neurological center.",
        "translation": "إعادة تأهيل",
        "exampleArabic": "أُنجزت إعادة التأهيل الشاملة في مركز الأعصاب المتخصص.",
        "relatedForms": ["rehabilitate"],
        "collocations": ["stroke rehabilitation", "rehabilitation clinic"],
        "synonyms": ["rehab"],
        "antonyms": [],
        "tags": ["healthcare", "therapy"]
    },
    {
        "headword": "surgery",
        "pronunciation": "/ˈsɜːdʒəri/",
        "partOfSpeech": "noun",
        "definition": "The branch of medical practice that treats injuries, diseases, and deformities by manual and instrumental operations.",
        "example": "Emergency abdominal surgery was performed successfully late last night.",
        "translation": "عملية جراحية / جراحة",
        "exampleArabic": "أُجريت جراحة طارئة في البطن بنجاح في وقت متأخر من ليلة أمس.",
        "relatedForms": ["surgical", "surgeon"],
        "collocations": ["undergo surgery", "elective surgery"],
        "synonyms": ["operation"],
        "antonyms": [],
        "tags": ["healthcare", "surgery"]
    },
    {
        "headword": "anesthesia",
        "pronunciation": "/ˌænəsˈθiːziə/",
        "partOfSpeech": "noun",
        "definition": "Insensitivity to pain, especially as artificially induced by the administration of gases or the injection of drugs.",
        "example": "General anesthesia was administered smoothly before the surgeon made the first cut.",
        "translation": "تخدير / بنج",
        "exampleArabic": "أُعطي التخدير العام بسلاسة قبل أن يبدأ الجراح الشق الأول.",
        "relatedForms": ["anesthetic", "anesthesiologist"],
        "collocations": ["local anesthesia", "general anesthesia"],
        "synonyms": ["narcotization"],
        "antonyms": [],
        "tags": ["healthcare", "surgery"]
    },
    {
        "headword": "incision",
        "pronunciation": "/ɪnˈsɪʒn/",
        "partOfSpeech": "noun",
        "definition": "A surgical cut made in skin or flesh.",
        "example": "A clean four-centimeter incision was made along the lower abdomen.",
        "translation": "شق جراحي",
        "exampleArabic": "عُمل شق جراحي نظيف بطول أربعة سنتيمترات على طول أسفل البطن.",
        "relatedForms": ["incise"],
        "collocations": ["surgical incision", "clean incision"],
        "synonyms": ["cut", "slit"],
        "antonyms": [],
        "tags": ["healthcare", "surgery"]
    },
    {
        "headword": "stitches",
        "pronunciation": "/ˈstɪtʃɪz/",
        "partOfSpeech": "noun",
        "definition": "Loops of thread or wire used to close a wound in surgery.",
        "example": "Seven neat stitches were removed from the wound seven days after the accident.",
        "translation": "غُرز جراحية / خياطة الجرح",
        "exampleArabic": "أُزيلت سبع غرز أنيقة من الجرح بعد سبعة أيام من الحادث.",
        "relatedForms": ["stitch (v)"],
        "collocations": ["remove stitches", "need stitches"],
        "synonyms": ["sutures"],
        "antonyms": [],
        "tags": ["healthcare", "surgery"]
    },
    {
        "headword": "bandage",
        "pronunciation": "/ˈbændɪdʒ/",
        "partOfSpeech": "noun",
        "definition": "A strip of cloth or other material used to bind up a wound or to protect an injured part of the body.",
        "example": "A clean sterile bandage was wrapped around the sprained ankle by the nurse.",
        "translation": "ضمادة / شاش رابط",
        "exampleArabic": "لُفت ضمادة معقمة ونظيفة حول الكاحل الملتوي من قبل الممرضة.",
        "relatedForms": ["bandage (v)"],
        "collocations": ["elastic bandage", "apply a bandage"],
        "synonyms": ["dressing"],
        "antonyms": [],
        "tags": ["healthcare", "wound care"]
    },
    {
        "headword": "gauze",
        "pronunciation": "/ɡɔːz/",
        "partOfSpeech": "noun",
        "definition": "A thin translucent fabric of silk, linen, or cotton, used especially in medicine for dressings and swabs.",
        "example": "Sterile absorbent gauze was placed over the incision to absorb bleeding.",
        "translation": "شاش طبي",
        "exampleArabic": "وُضع شاش معقم وممتص فوق الشق الجراحي لامتصاص النزيف.",
        "relatedForms": [],
        "collocations": ["sterile gauze", "gauze pad"],
        "synonyms": ["dressing cloth"],
        "antonyms": [],
        "tags": ["healthcare", "wound care"]
    },
    {
        "headword": "ointment",
        "pronunciation": "/ˈɔɪntmənt/",
        "partOfSpeech": "noun",
        "definition": "A smooth oily substance that is rubbed on the skin for medicinal purposes or as a cosmetic.",
        "example": "Soothing antibiotic ointment was applied twice daily to the irritated surface.",
        "translation": "مرهم / دهون طبي",
        "exampleArabic": "وُضع مرهم مضاد حيوي مهدئ مرتين يومياً على السطح المتهيج.",
        "relatedForms": [],
        "collocations": ["antibiotic ointment", "apply ointment"],
        "synonyms": ["salve", "balm"],
        "antonyms": [],
        "tags": ["healthcare", "medication"]
    },
    {
        "headword": "capsule",
        "pronunciation": "/ˈkæpsjuːl/",
        "partOfSpeech": "noun",
        "definition": "A small gelatinous case enclosing a dose of medication, a vitamin, etc., taken orally.",
        "example": "A slow-release capsule was swallowed with a full glass of water every morning.",
        "translation": "كبسولة دوائية",
        "exampleArabic": "تُم ابتلاع كبسولة بطيئة المفعول مع كوب كامل من الماء كل صباح.",
        "relatedForms": [],
        "collocations": ["gelatin capsule", "swallow a capsule"],
        "synonyms": ["pill"],
        "antonyms": [],
        "tags": ["healthcare", "medication"]
    },
    {
        "headword": "syrup",
        "pronunciation": "/ˈsɪrəp/",
        "partOfSpeech": "noun",
        "definition": "A concentrated sweet liquid, especially one used as a vehicle for medication.",
        "example": "A soothing cough syrup was administered to the coughing child before bedtime.",
        "translation": "شراب دوائي",
        "exampleArabic": "أُعطي شراب سعال مهدئ للطفل المصاب بالسعال قبل موعد النوم.",
        "relatedForms": [],
        "collocations": ["cough syrup", "teaspoon of syrup"],
        "synonyms": ["liquid medicine"],
        "antonyms": [],
        "tags": ["healthcare", "medication"]
    },

    # Medications & Facilities (8)
    {
        "headword": "antibiotic",
        "pronunciation": "/ˌæntibaɪˈɒtɪk/",
        "partOfSpeech": "noun",
        "definition": "A medicine that inhibits the growth of or destroys microorganisms.",
        "example": "A seven-day course of a broad-spectrum antibiotic was completed by the patient.",
        "translation": "مضاد حيوي",
        "exampleArabic": "أُكملت دورة علاجية لمدة سبعة أيام من مضاد حيوي واسع النطاق من قبل المريض.",
        "relatedForms": [],
        "collocations": ["prescribe an antibiotic", "take antibiotics"],
        "synonyms": ["antimicrobial"],
        "antonyms": [],
        "tags": ["healthcare", "medication"]
    },
    {
        "headword": "painkiller",
        "pronunciation": "/ˈpeɪnkɪlə/",
        "partOfSpeech": "noun",
        "definition": "A drug or medicine for relieving pain.",
        "example": "An effective mild painkiller was given to the patient to relieve post-operative discomfort.",
        "translation": "مسكن للألم",
        "exampleArabic": "أُعطي مسكن ألم خفيف وفعال للمريض لتخفيف الانزعاج التالي للعملية الجراحية.",
        "relatedForms": [],
        "collocations": ["strong painkiller", "take a painkiller"],
        "synonyms": ["analgesic"],
        "antonyms": [],
        "tags": ["healthcare", "medication"]
    },
    {
        "headword": "sedative",
        "pronunciation": "/ˈsedətɪv/",
        "partOfSpeech": "noun",
        "definition": "A drug that calms someone or makes them sleep.",
        "example": "A calming mild sedative was administered to ease the patient's procedural anxiety.",
        "translation": "مهدئ / مسكن للأعصاب",
        "exampleArabic": "أُعطي مهدئ خفيف لتخفيف قلق المريض المصاحب للإجراء الطبي.",
        "relatedForms": ["sedate"],
        "collocations": ["mild sedative", "administer a sedative"],
        "synonyms": ["tranquilizer"],
        "antonyms": ["stimulant"],
        "tags": ["healthcare", "medication"]
    },
    {
        "headword": "antiseptic",
        "pronunciation": "/ˌæntiˈseptɪk/",
        "partOfSpeech": "noun",
        "definition": "A substance that prevents the growth of disease-causing microorganisms.",
        "example": "A stinging antiseptic was dabbed around the cut before the dressing was applied.",
        "translation": "مطهر جروح",
        "exampleArabic": "مُسح مطهر جروح لاذع حول الجرح قبل وضع الضمادة.",
        "relatedForms": [],
        "collocations": ["apply antiseptic", "antiseptic solution"],
        "synonyms": ["disinfectant"],
        "antonyms": [],
        "tags": ["healthcare", "wound care"]
    },
    {
        "headword": "disinfectant",
        "pronunciation": "/ˌdɪsɪnˈfektənt/",
        "partOfSpeech": "noun",
        "definition": "A chemical liquid that destroys bacteria from surfaces or instruments.",
        "example": "Hospital-grade disinfectant was sprayed across every operating table between procedures.",
        "translation": "مادة مطهرة للأسطح والأدوات",
        "exampleArabic": "رُش مطهر من الفئة المخصصة للمستشفيات على كل طاولة عمليات بين الإجراءات الجراحية.",
        "relatedForms": ["disinfect"],
        "collocations": ["surface disinfectant", "use disinfectant"],
        "synonyms": ["sanitizer"],
        "antonyms": [],
        "tags": ["healthcare", "hygiene"]
    },
    {
        "headword": "emergency room",
        "pronunciation": "/ɪˈmɜːdʒənsi ruːm/",
        "partOfSpeech": "noun",
        "definition": "The department of a hospital that provides immediate treatment for acute illnesses and trauma.",
        "example": "The injured driver was rushed to the nearest emergency room immediately after the crash.",
        "translation": "غرفة الطوارئ / قسم الإسعاف",
        "exampleArabic": "نُقل السائق المصاب على عجل إلى أقرب غرفة طوارئ فور وقوع الحادث.",
        "relatedForms": [],
        "collocations": ["visit the emergency room", "crowded emergency room"],
        "synonyms": ["casualty", "ER"],
        "antonyms": [],
        "tags": ["healthcare", "hospital"]
    },
    {
        "headword": "intensive care unit",
        "pronunciation": "/ɪnˌtensɪv ˈkeər ˌjuːnɪt/",
        "partOfSpeech": "noun",
        "definition": "A specialized department of a hospital that provides intensive treatment medicine for critically ill patients.",
        "example": "The critical patient was transferred to the intensive care unit for around-the-clock monitoring.",
        "translation": "وحدة العناية المركزة",
        "exampleArabic": "نُقل المريض الحرج إلى وحدة العناية المركزة للمراقبة الطبية على مدار الساعة.",
        "relatedForms": [],
        "collocations": ["admit to the intensive care unit", "ICU bed"],
        "synonyms": ["ICU"],
        "antonyms": [],
        "tags": ["healthcare", "hospital"]
    },
    {
        "headword": "discharge",
        "pronunciation": "/dɪsˈtʃɑːdʒ/",
        "partOfSpeech": "noun",
        "definition": "The action of officially allowing someone to leave an institution, typically a hospital.",
        "example": "The patient's formal discharge was authorized once all laboratory markers returned to normal.",
        "translation": "خروج من المستشفى / تصريح خروج رسمي",
        "exampleArabic": "تم التصريح بالخروج الرسمي للمريض بمجرد عودة مؤشرات الفحوصات المخبرية إلى طبيعتها.",
        "relatedForms": ["discharge (v)"],
        "collocations": ["hospital discharge", "discharge summary"],
        "synonyms": ["release"],
        "antonyms": ["admission"],
        "tags": ["healthcare", "hospital"]
    }
]

grammar_data = [
    {
        "title": "Passive Voice (Past Simple Passive)",
        "titleArabic": "المبني للمجهول في الماضي البسيط",
        "explanation": "We use the Past Simple Passive to describe completed events, medical interventions, historical clinical events, and diagnostic steps when the action itself and its recipient are the focus rather than the specific person who carried it out. In medical discharge notes, hospital summaries, and case histories, the Past Simple Passive is the dominant grammatical structure because what was performed on the patient is the central medical record. The formula is: Subject (Receiver) + was / were + Past Participle (V3).",
        "explanationArabic": "نستخدم المبني للمجهول في الماضي البسيط لوصف أحداث مكتملة وتدخلات طبية وفحوصات وإجراءات جراحية تمت في الماضي، عندما يكون التركيز على الإجراء نفسه أو المريض الذي خضع له بدلاً من الفاعل. وتعتبر هذه الصيغة هي الهيكل الأساسي في التقارير الطبية ومذكرات الخروج وسجلات المستشفيات. القاعدة: المفعول به (نائب الفاعل) + was / were + التصريف الثالث للفعل (V3). نستخدم was مع المفرد و were مع الجمع.",
        "structures": [
            {
                "label": "Affirmative · الإثبات",
                "pattern": "Subject + was / were + V3 (Past Participle)",
                "explanation": "Describes a medical intervention or diagnostic event completed in the past.",
                "explanationArabic": "يصف تدخلاً علاجياً أو إجراءً تشخيصياً اكتمل في الماضي."
            },
            {
                "label": "Negative · النفي",
                "pattern": "Subject + was / were + not + V3 (Past Participle)",
                "explanation": "Indicates that a particular procedure or test was not conducted.",
                "explanationArabic": "يوضح أن فحصاً أو تدخلاً معيناً لم يتم تنفيذه."
            },
            {
                "label": "Question · السؤال",
                "pattern": "Was / Were + Subject + V3 (Past Participle)?",
                "explanation": "Asks whether a clinical procedure or medication was administered in the past.",
                "explanationArabic": "يسأل عما إذا كان الإجراء الطبي أو الدواء قد أُعطي في الماضي."
            }
        ],
        "examples": [
            {
                "sentence": "A diagnostic chest x-ray was ordered immediately by the attending physician.",
                "translation": "طُلبت صورة أشعة سينية تشخيصية للصدر على الفور من قبل الطبيب المعالج.",
                "usesVocabulary": ["x-ray", "physician"]
            },
            {
                "sentence": "General anesthesia was administered smoothly before the surgeon made the incision.",
                "translation": "أُعطي التخدير العام بسلاسة قبل أن يبدأ الجراح الشق الجراحي.",
                "usesVocabulary": ["anesthesia", "surgeon", "incision"]
            },
            {
                "sentence": "All four vital signs were recorded accurately by the paramedic in the ambulance.",
                "translation": "سُجلت العلامات الحيوية الأربع بدقة من قبل المسعف في سيارة الإسعاف.",
                "usesVocabulary": ["vital signs", "paramedic"]
            },
            {
                "sentence": "The sterile urine specimen was sent to the pathology lab for urgent analysis.",
                "translation": "أُرسلت العينة البولية المعقمة إلى مختبر علم الأمراض لتحليل عاجل.",
                "usesVocabulary": ["specimen"]
            }
        ],
        "commonMistakes": [
            {
                "wrong": "The patient was discharge from the hospital yesterday.",
                "right": "The patient was discharged from the hospital yesterday.",
                "note": "Always use the past participle form (e.g. discharged, operated), never the base verb after was/were.",
                "noteArabic": "يجب دائماً استخدام التصريف الثالث للفعل (V3 مثل discharged) بعد was/were، ولا يجوز استخدام الفعل المجرد."
            },
            {
                "wrong": "The stitches was removed by the nurse last week.",
                "right": "The stitches were removed by the nurse last week.",
                "note": "Use 'were' with plural subjects (stitches, lab results, vital signs) and 'was' with singular subjects.",
                "noteArabic": "استخدم were مع الفاعل الجمع (مثل stitches أو lab results) و was مع المفرد."
            }
        ],
        "commonUsage": [
            "Medical case histories: 'The fracture was stabilized with splints.' (تُستخدم لتدوين وتوثيق التاريخ الطبي والإجراءات المكتملة.)",
            "Hospital discharge summaries: 'The prescription was explained and official discharge was granted.' (تُستخدم في ملخصات الخروج الرسمية من المستشفى.)",
            "Objective reporting: 'The medication was swallowed with water.' (تُستخدم لإبراز الموضوعية والتركيز على الحدث الطبي بذاته.)"
        ]
    }
]

convs_data = [
    {
        "title": "Hospital Emergency Room Triage",
        "titleArabic": "فرز الحالات في غرفة طوارئ المستشفى",
        "setting": "A senior nurse and a physician review incoming admissions in the hospital trauma bay.",
        "lines": [
            {"speaker": "Physician", "text": "Who was brought into the emergency room by the ambulance crew just now?"},
            {"speaker": "Nurse", "text": "A motor accident patient was transferred by the paramedic with suspected pelvic trauma."},
            {"speaker": "Physician", "text": "Were the patient's vital signs and blood pressure measured during transit?"},
            {"speaker": "Nurse", "text": "Yes, stable blood pressure and an elevated pulse rate were recorded; a digital thermometer showed normal heat."},
            {"speaker": "Physician", "text": "Was an urgent x-ray or an abdominal ultrasound ordered immediately?"},
            {"speaker": "Nurse", "text": "An x-ray was completed right away, and a follow-up mri scan was requested by the surgeon."},
            {"speaker": "Physician", "text": "A sedative was administered to relieve severe agitation; now let us prepare the sterile stitches."},
            {"speaker": "Nurse", "text": "A disposable syringe was readied, and hospital-grade disinfectant was wiped across all surfaces."},
            {"speaker": "Physician", "text": "Excellent; transfer to the intensive care unit is organized if required."}
        ],
        "vocabularyUsed": ["physician", "emergency room", "patient", "paramedic", "vital signs", "blood pressure", "pulse rate", "thermometer", "x-ray", "ultrasound", "mri scan", "surgeon", "sedative", "stitches", "syringe", "disinfectant", "intensive care unit"]
    },
    {
        "title": "Discussing Pathology and Lab Results",
        "titleArabic": "مناقشة نتائج المختبر والفحوصات في العيادة",
        "setting": "A practitioner explains recent diagnostic findings to an outpatient.",
        "lines": [
            {"speaker": "Practitioner", "text": "Welcome to your follow-up consultation. How have you felt since our last meeting?"},
            {"speaker": "Patient", "text": "I was anxious to learn whether the lab result and biopsy findings were finalized."},
            {"speaker": "Practitioner", "text": "Your blood specimen was examined thoroughly, and a clear diagnosis was established yesterday."},
            {"speaker": "Patient", "text": "What kind of prognosis was delivered by the specialist regarding my recovery?"},
            {"speaker": "Practitioner", "text": "An excellent prognosis was confirmed. A cardiologist and a dermatologist reviewed the clinical notes."},
            {"speaker": "Patient", "text": "Was an antibiotic or a strong painkiller included in the digital prescription?"},
            {"speaker": "Practitioner", "text": "An oral antibiotic capsule and a soothing syrup were prescribed by our team."},
            {"speaker": "Patient", "text": "I will visit the local pharmacist right away to have the dosage explained."}
        ],
        "vocabularyUsed": ["practitioner", "consultation", "patient", "lab result", "biopsy", "specimen", "diagnosis", "prognosis", "cardiologist", "dermatologist", "antibiotic", "painkiller", "prescription", "capsule", "syrup", "pharmacist", "dosage"]
    },
    {
        "title": "Post-Operative Dressing and Discharge",
        "titleArabic": "تغيير الضمادات الجراحية وإجراءات الخروج من المستشفى",
        "setting": "A surgical ward nurse prepares a recovered patient for hospital departure.",
        "lines": [
            {"speaker": "Nurse", "text": "Good morning! Your official hospital discharge was authorized early this morning."},
            {"speaker": "Patient", "text": "That is wonderful news. Was my incision inspected by the lead surgeon today?"},
            {"speaker": "Nurse", "text": "Yes, it was examined; healing looks superb, and no redness was found around the stitches."},
            {"speaker": "Patient", "text": "Was a clean bandage or fresh gauze placed over the surgical site?"},
            {"speaker": "Nurse", "text": "Stinging antiseptic was dabbed, and sterile absorbent gauze was secured with a light bandage after ointment was applied."},
            {"speaker": "Patient", "text": "Was any physical therapy or outpatient rehabilitation scheduled for next week?"},
            {"speaker": "Nurse", "text": "A referral for rehabilitation was drafted, and a printed checkup schedule was handed to your family."},
            {"speaker": "Patient", "text": "A chest check with the stethoscope was also done; thank you for the wonderful care."}
        ],
        "vocabularyUsed": ["discharge", "incision", "surgeon", "stitches", "antiseptic", "gauze", "bandage", "ointment", "therapy", "rehabilitation", "referral", "checkup", "stethoscope"]
    }
]

para1_text = (
    "When a critically injured individual was admitted to the hospital, an immediate sequence of life-saving measures "
    "was activated by the clinical staff. The trauma victim was transported to the emergency room where essential vital "
    "signs and blood pressure were monitored without delay. A rapid diagnostic x-ray and an ultrasound were performed to "
    "detect hidden internal bleeding, while a brain mri scan was requested to rule out skull damage. In the meantime, an "
    "intravenous sedative was administered to ease procedural distress, and the on-call surgeon was summoned immediately. "
    "Because decisive clinical interventions were organized with extraordinary efficiency, the unstable patient was stabilized "
    "rapidly before transfer to the intensive care unit was approved."
)

para2_text = (
    "In outpatient medicine, accurate diagnoses depend on meticulous scientific investigations completed behind the scenes. "
    "During a thorough medical consultation, a blood specimen was collected by the nurse and a suspicious tissue biopsy "
    "was submitted for histological evaluation. Within twenty-four hours, the final lab result was reviewed and a definitive "
    "diagnosis was reached by the practitioner. When the diagnostic conclusion was communicated, an encouraging prognosis "
    "was shared with the patient alongside an individualized treatment plan. A tailored digital prescription was sent to the "
    "community pharmacist, ensuring that the correct dosage of antibiotic and supportive capsule medication was dispensed accurately."
)

para3_text = (
    "Following major surgical procedures, careful postoperative protocols are observed to guarantee comprehensive healing. "
    "The deep abdominal incision was closed with sterile stitches, over which soothing ointment and clean absorbent gauze "
    "were placed before a firm protective bandage was wrapped around the wound. Throughout the recovery phase, physical "
    "therapy and guided rehabilitation were scheduled to help restore muscular coordination and functional mobility. When "
    "objective clinical milestones were met, official hospital discharge was authorized by the attending physician, and a "
    "detailed follow-up checkup was scheduled to monitor long-term recovery."
)

paras_data = [
    {
        "title": "Emergency Response and Trauma Protocols",
        "titleArabic": "استجابة الطوارئ وبروتوكولات التعامل مع الرضوض الحادة",
        "kind": "narrative",
        "text": para1_text,
        "translation": "حين أُدخل مصاب بحالة حرجة إلى المستشفى، فُعّلت سلسلة فورية من الإجراءات المنقذة للحياة من قبل الطاقم الطبي. ونُقل ضحية الحادث إلى غرفة الطوارئ حيث روقبت العلامات الحيوية وضغط الدم دون أدنى تأخير. وأُجري تصوير سريع بالأشعة السينية والموجات فوق الصوتية لكشف أي نزيف داخلي، بينما طُلب فحص بالرنين المغناطيسي للدماغ لاستبعاد كسور الجمجمة. وفي غضون ذلك، أُعطي مهدئ وريدي لتخفيف التوتر، واستُدعي الجراح المناوب فوراً. وبفضل التنظيم فائق الكفاءة للتدخلات السريرية، استقرت حالة المريض بسرعة قبل اعتماد نقله إلى العناية المركزة.",
        "vocabularyUsed": ["emergency room", "vital signs", "blood pressure", "x-ray", "ultrasound", "mri scan", "sedative", "surgeon", "patient", "intensive care unit"]
    },
    {
        "title": "Laboratory Investigations and Diagnostic Accuracy",
        "titleArabic": "التحقيقات المخبرية والدقة التشخيصية في العيادات",
        "kind": "expository",
        "text": para2_text,
        "translation": "في الطب الخارجي، تعتمد دقة التشخيص على تحقيقات علمية دقيقة تُجرى خلف الكواليس. فخلال استشارة طبية شاملة، جُمعت عينة دم من قبل الممرضة وأُرسلت خزعة نسيجية مشبوهة للتقييم النسيجي. وخلال أربع وعشرين ساعة، روجعت نتيجة التحليل النهائية وتوصل الممارس إلى تشخيص قاطع. وعند إبلاغ الخلاصة التشخيصية، شُورك مآل مشجع مع المريض بجانب خطة علاجية مخصصة. وأُرسلت وصفة طبية رقمية ملائمة للصيدلي المجتمعي، مما ضمن صرف الجرعة الصحيحة من المضاد الحيوي والكبسولات الداعمة بدقة.",
        "vocabularyUsed": ["consultation", "specimen", "biopsy", "lab result", "diagnosis", "practitioner", "prognosis", "patient", "treatment plan", "prescription", "pharmacist", "dosage", "antibiotic", "capsule"]
    },
    {
        "title": "Postoperative Care and the Path to Discharge",
        "titleArabic": "الرعاية اللاحقة للجراحة ومسار التعافي نحو الخروج",
        "kind": "informative",
        "text": para3_text,
        "translation": "عقب العمليات الجراحية الكبرى، تُتبع بروتوكولات دقيقة لما بعد الجراحة لضمان الشفاء التام. فقد أُغلق الشق الجراحي البطني العميق بغرز معقمة، ووضع فوقها مرهم مهدئ وشاش ممتص نظيف قبل لف ضمادة واقية محكمة حول الجرح. وطوال مرحلة التعافي، جُدول علاج طبيعي وإعادة تأهيل موجهة للمساعدة في استعادة التناسق العضلي والحركة الوظيفية. وحين تحققت المعايير السريرية الموضوعية، صُرّح بالخروج الرسمي من المستشفى من قبل الطبيب المعالج، وحُدد موعد فحص دوري للمتابعة لمراقبة التعافي طويل الأجل.",
        "vocabularyUsed": ["incision", "stitches", "ointment", "gauze", "bandage", "therapy", "rehabilitation", "discharge", "physician", "checkup"]
    }
]

if __name__ == "__main__":
    write_day(52, vocab_data, grammar_data, convs_data, paras_data)
