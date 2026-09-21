import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(root, "content");

// ==========================================
// DAY 8: What I Can Do
// ==========================================
const day08 = {
  day: 8,
  stage: "Foundation — Daily Life",
  title: "What I Can Do",
  topic: "Abilities, skills and talents",
  description: "Talk about what you can and cannot do well.",
  focus: "Master 50 core words for skills, talents, languages, musical instruments, and mental/physical abilities; master 'Can / Can't for Ability'; engage with 3 realistic dialogues and 3 reading texts.",
  vocabulary: [
    {
      headword: "ability",
      pronunciation: "/əˈbɪləti/",
      partOfSpeech: "noun",
      definition: "possession of the means or skill required to do something",
      example: "She has an exceptional ability to learn foreign languages quickly.",
      relatedForms: ["able (adjective)"],
      collocations: ["natural ability", "musical ability", "test your ability"],
      synonyms: ["capability", "capacity", "aptitude"],
      antonyms: ["inability"],
      tags: ["skills", "talents"],
      translation: "قدرة / استطاعة",
      exampleArabic: "لديها قدرة استثنائية على تعلم اللغات الأجنبية بسرعة."
    },
    {
      headword: "skill",
      pronunciation: "/skɪl/",
      partOfSpeech: "noun",
      definition: "the ability to do something well; expertise",
      example: "Speaking English fluently is a valuable communication skill.",
      relatedForms: ["skillful (adjective)"],
      collocations: ["communication skill", "learn a skill", "practical skill"],
      synonyms: ["proficiency", "talent"],
      antonyms: ["incompetence"],
      tags: ["skills", "learning"],
      translation: "مهارة / براعة",
      exampleArabic: "التحدث باللغة الإنجليزية بطلاقة مهارة تواصل قيمة."
    },
    {
      headword: "talent",
      pronunciation: "/ˈtælənt/",
      partOfSpeech: "noun",
      definition: "natural aptitude or skill",
      example: "He has a genuine talent for playing the acoustic guitar.",
      relatedForms: ["talented (adjective)"],
      collocations: ["natural talent", "musical talent", "show talent"],
      synonyms: ["gift", "flair"],
      antonyms: [],
      tags: ["skills", "talents"],
      translation: "موهبة فطرية",
      exampleArabic: "لديه موهبة حقيقية في العزف على الغيتار الصوتي."
    },
    {
      headword: "language",
      pronunciation: "/ˈlæŋɡwɪdʒ/",
      partOfSpeech: "noun",
      definition: "the method of human communication, either spoken or written",
      example: "Learning a second language opens up broad career opportunities.",
      relatedForms: [],
      collocations: ["foreign language", "first language", "speak a language"],
      synonyms: ["tongue", "speech"],
      antonyms: [],
      tags: ["communication", "learning"],
      translation: "لغة",
      exampleArabic: "تعلم لغة ثانية يفتح فرصاً مهنية واسعة."
    },
    {
      headword: "music",
      pronunciation: "/ˈmjuːzɪk/",
      partOfSpeech: "noun",
      definition: "vocal or instrumental sounds combined in such a way as to produce beauty of form, harmony, and expression of emotion",
      example: "Listening to gentle classical music helps me concentrate while studying.",
      relatedForms: ["musician (noun)", "musical (adjective)"],
      collocations: ["classical music", "listen to music", "live music"],
      synonyms: [],
      antonyms: [],
      tags: ["arts", "music"],
      translation: "موسيقى",
      exampleArabic: "الاستماع إلى الموسيقى الكلاسيكية الهادئة يساعدني على التركيز أثناء الدراسة."
    },
    {
      headword: "song",
      pronunciation: "/sɒŋ/",
      partOfSpeech: "noun",
      definition: "a short poem or other set of words set to music or meant to be sung",
      example: "The children sing a joyful English song at school.",
      relatedForms: [],
      collocations: ["sing a song", "favorite song", "folk song"],
      synonyms: ["tune", "melody"],
      antonyms: [],
      tags: ["arts", "music"],
      translation: "أغنية / أنشودة",
      exampleArabic: "يغني الأطفال أغنية إنجليزية مبهجة في المدرسة."
    },
    {
      headword: "instrument",
      pronunciation: "/ˈɪnstrəmənt/",
      partOfSpeech: "noun",
      definition: "an object or device for producing musical sounds",
      example: "Can you play any musical instrument like the violin or piano?",
      relatedForms: ["instrumental (adjective)"],
      collocations: ["musical instrument", "play an instrument"],
      synonyms: [],
      antonyms: [],
      tags: ["arts", "music"],
      translation: "آلة موسيقية",
      exampleArabic: "هل تستطيع العزف على أي آلة موسيقية مثل الكمان أو البيانو؟"
    },
    {
      headword: "guitar",
      pronunciation: "/ɡɪˈtɑː/",
      partOfSpeech: "noun",
      definition: "a stringed musical instrument, with six strings, played with fingers or a plectrum",
      example: "He practices playing the acoustic guitar for an hour every day.",
      relatedForms: ["guitarist (noun)"],
      collocations: ["acoustic guitar", "play guitar", "electric guitar"],
      synonyms: [],
      antonyms: [],
      tags: ["arts", "music"],
      translation: "غيتار",
      exampleArabic: "يمارس العزف على الغيتار الصوتي لمدة ساعة كل يوم."
    },
    {
      headword: "piano",
      pronunciation: "/piˈænəʊ/",
      partOfSpeech: "noun",
      definition: "a large keyboard musical instrument with wooden hammers that strike steel strings",
      example: "She plays classic Beethoven melodies on her upright piano.",
      relatedForms: ["pianist (noun)"],
      collocations: ["play piano", "grand piano", "piano lessons"],
      synonyms: [],
      antonyms: [],
      tags: ["arts", "music"],
      translation: "بيانو",
      exampleArabic: "تعزف ألحان بيتهوفن الكلاسيكية على البيانو القائم الخاص بها."
    },
    {
      headword: "driver",
      pronunciation: "/ˈdraɪvə/",
      partOfSpeech: "noun",
      definition: "a person who drives a vehicle",
      example: "Our bus driver is very careful and follows every traffic rule.",
      relatedForms: ["drive (verb)"],
      collocations: ["safe driver", "taxi driver", "bus driver"],
      synonyms: ["motorist", "operator"],
      antonyms: [],
      tags: ["transport", "people"],
      translation: "سائق",
      exampleArabic: "سائق الحافلة لدينا حذر للغاية ويتبع كل قواعد المرور."
    },
    {
      headword: "license",
      pronunciation: "/ˈlaɪsns/",
      partOfSpeech: "noun",
      definition: "a permit from an authority to own or use something, do a particular thing, or carry on a trade",
      example: "He passed the official driving test and obtained his driver's license.",
      relatedForms: [],
      collocations: ["driver's license", "valid license", "get a license"],
      synonyms: ["permit", "authorization"],
      antonyms: [],
      tags: ["documents", "transport"],
      translation: "رخصة (قيادة أو مزاولة)",
      exampleArabic: "اجتاز اختبار القيادة الرسمي وحصل على رخصة قيادته."
    },
    {
      headword: "computer",
      pronunciation: "/kəmˈpjuːtə/",
      partOfSpeech: "noun",
      definition: "an electronic device for storing and processing data according to instructions",
      example: "I use my desktop computer to edit video tutorials and practice coding.",
      relatedForms: [],
      collocations: ["desktop computer", "use a computer", "computer screen"],
      synonyms: ["PC", "machine"],
      antonyms: [],
      tags: ["technology", "devices"],
      translation: "كمبيوتر / حاسوب",
      exampleArabic: "أستخدم جهاز الحاسوب المكتبي لتحرير الدروس المرئية وممارسة البرمجة."
    },
    {
      headword: "drawing",
      pronunciation: "/ˈdrɔːɪŋ/",
      partOfSpeech: "noun",
      definition: "a picture or diagram made with a pencil, pen, or crayon rather than paint",
      example: "She made a charming pencil drawing of an old stone bridge.",
      relatedForms: ["draw (verb)"],
      collocations: ["pencil drawing", "make a drawing", "detailed drawing"],
      synonyms: ["sketch", "illustration"],
      antonyms: [],
      tags: ["arts", "creativity"],
      translation: "رسم (بالقلم أو الرصاص)",
      exampleArabic: "قامت بعمل رسم رائع بالقلم الرصاص لجسر حجري قديم."
    },
    {
      headword: "painting",
      pronunciation: "/ˈpeɪntɪŋ/",
      partOfSpeech: "noun",
      definition: "a picture produced using paint, or the action of applying paint",
      example: "The colorful oil painting on the living room wall shows a quiet beach.",
      relatedForms: ["paint (verb)", "painter (noun)"],
      collocations: ["oil painting", "famous painting", "original painting"],
      synonyms: ["artwork", "canvas"],
      antonyms: [],
      tags: ["arts", "creativity"],
      translation: "لوحة فنية / رسم بالألوان",
      exampleArabic: "اللوحة الزيتية الملونة على حائط غرفة المعيشة تعرض شاطئاً هادئاً."
    },
    {
      headword: "photograph",
      pronunciation: "/ˈfəʊtəɡrɑːf/",
      partOfSpeech: "noun",
      definition: "a picture made using a camera, in which an image is focused onto film or digital sensor",
      example: "He took a crisp photograph of the city skyline at dusk.",
      relatedForms: ["photography (noun)", "photographer (noun)"],
      collocations: ["take a photograph", "black-and-white photograph", "digital photograph"],
      synonyms: ["photo", "picture"],
      antonyms: [],
      tags: ["arts", "photography"],
      translation: "صورة فوتوغرافية",
      exampleArabic: "التقط صورة فوتوغرافية واضحة لأفق المدينة عند الغسق."
    },
    {
      headword: "chess",
      pronunciation: "/tʃes/",
      partOfSpeech: "noun",
      definition: "a board game of strategic skill for two players, played on a checkered board on sixty-four squares",
      example: "My father taught me how to play tactical chess when I was eight.",
      relatedForms: [],
      collocations: ["play chess", "game of chess", "chess board"],
      synonyms: [],
      antonyms: [],
      tags: ["games", "strategy"],
      translation: "شطرنج",
      exampleArabic: "علمني والدي كيفية لعب الشطرنج التكتيكي عندما كنت في الثامنة."
    },
    {
      headword: "bicycle",
      pronunciation: "/ˈbaɪsɪkl/",
      partOfSpeech: "noun",
      definition: "a vehicle composed of two wheels held in a frame one behind the other, propelled by pedals",
      example: "He rides his blue bicycle to work along the river path.",
      relatedForms: [],
      collocations: ["ride a bicycle", "new bicycle", "bicycle helmet"],
      synonyms: ["bike", "cycle"],
      antonyms: [],
      tags: ["transport", "vehicles"],
      translation: "دراجة هوائية / بسكليت",
      exampleArabic: "يركب دراجته الهوائية الزرقاء إلى العمل على طول مسار النهر."
    },
    {
      headword: "car",
      pronunciation: "/kɑː/",
      partOfSpeech: "noun",
      definition: "a road vehicle, typically with four wheels, powered by an internal engine",
      example: "She drives her compact electric car to the office every morning.",
      relatedForms: [],
      collocations: ["drive a car", "electric car", "park a car"],
      synonyms: ["automobile", "vehicle"],
      antonyms: [],
      tags: ["transport", "vehicles"],
      translation: "سيارة",
      exampleArabic: "تقود سيارتها الكهربائية المدمجة إلى المكتب كل صباح."
    },
    {
      headword: "can",
      pronunciation: "/kæn/",
      partOfSpeech: "verb",
      definition: "be able to; have the ability or opportunity to do something",
      example: "I can speak three languages: Arabic, English, and French.",
      relatedForms: ["could (past)"],
      collocations: ["can do", "can speak", "can play"],
      synonyms: ["be able to"],
      antonyms: ["cannot"],
      tags: ["modals", "ability"],
      verbForms: { v1: "can", v2: "could", v3: "been able" },
      translation: "يستطيع / يقدر على",
      exampleArabic: "أستطيع التحدث بثلاث لغات: العربية والإنجليزية والفرنسية."
    },
    {
      headword: "speak",
      pronunciation: "/spiːk/",
      partOfSpeech: "verb",
      definition: "say something in order to convey information, an opinion, or a feeling",
      example: "She speaks fluent English with great confidence.",
      relatedForms: ["speaker (noun)"],
      collocations: ["speak fluently", "speak English", "speak clearly"],
      synonyms: ["talk", "converse"],
      antonyms: [],
      tags: ["actions", "communication"],
      verbForms: { v1: "speak", v2: "spoke", v3: "spoken" },
      translation: "يتحدث / يتكلم",
      exampleArabic: "تتحدث الإنجليزية بطلاقة وبثقة كبيرة."
    },
    {
      headword: "sing",
      pronunciation: "/sɪŋ/",
      partOfSpeech: "verb",
      definition: "make musical sounds with the voice, especially a tune with words",
      example: "He loves to sing traditional folk songs with his cousins.",
      relatedForms: ["singer (noun)"],
      collocations: ["sing a song", "sing well", "sing loudly"],
      synonyms: ["vocalize", "chant"],
      antonyms: [],
      tags: ["actions", "arts"],
      verbForms: { v1: "sing", v2: "sang", v3: "sung" },
      translation: "يغني / ينشد",
      exampleArabic: "يحب أن يغني أغاني شعبية تقليدية مع أبناء عمومته."
    },
    {
      headword: "dance",
      pronunciation: "/dɑːns/",
      partOfSpeech: "verb",
      definition: "move rhythmically to music, typically following a set sequence of steps",
      example: "They dance gracefully at traditional community celebrations.",
      relatedForms: ["dancer (noun)"],
      collocations: ["dance gracefully", "learn to dance", "dance together"],
      synonyms: ["sway", "waltz"],
      antonyms: [],
      tags: ["actions", "arts"],
      verbForms: { v1: "dance", v2: "danced", v3: "danced" },
      translation: "يرقص / يتحرك على إيقاع الموسيقى",
      exampleArabic: "يرقصون برشاقة في الاحتفالات المجتمعية التقليدية."
    },
    {
      headword: "draw",
      pronunciation: "/drɔː/",
      partOfSpeech: "verb",
      definition: "produce a picture or diagram by making lines and marks on paper with a pen or pencil",
      example: "He can draw realistic portraits of animals and flowers.",
      relatedForms: ["drawer (noun)"],
      collocations: ["draw a picture", "draw well", "draw lines"],
      synonyms: ["sketch", "illustrate"],
      antonyms: [],
      tags: ["actions", "arts"],
      verbForms: { v1: "draw", v2: "drew", v3: "drawn" },
      translation: "يرسم (بالخطوط والقلم)",
      exampleArabic: "يستطيع رسم صور واقعية للحيوانات والأزهار."
    },
    {
      headword: "paint",
      pronunciation: "/peɪnt/",
      partOfSpeech: "verb",
      definition: "produce a picture with colors, or apply liquid coloring to a surface",
      example: "She paints serene landscape scenes using watercolors.",
      relatedForms: ["painter (noun)"],
      collocations: ["paint a picture", "paint walls", "paint with watercolors"],
      synonyms: ["color", "tint"],
      antonyms: [],
      tags: ["actions", "arts"],
      verbForms: { v1: "paint", v2: "painted", v3: "painted" },
      translation: "يرسم بالألوان / يدهن",
      exampleArabic: "ترسم مشاهد طبيعية هادئة باستخدام الألوان المائية."
    },
    {
      headword: "ride",
      pronunciation: "/raɪd/",
      partOfSpeech: "verb",
      definition: "sit on and control the movement of an animal or a bicycle/motorcycle",
      example: "Children learn to ride a bicycle in the safe playground.",
      relatedForms: ["rider (noun)"],
      collocations: ["ride a bike", "ride a horse", "ride safely"],
      synonyms: [],
      antonyms: [],
      tags: ["actions", "transport"],
      verbForms: { v1: "ride", v2: "rode", v3: "ridden" },
      translation: "يركب (دراجة أو حصاناً)",
      exampleArabic: "يتعلم الأطفال ركوب الدراجة في الملعب الآمن."
    },
    {
      headword: "drive",
      pronunciation: "/draɪv/",
      partOfSpeech: "verb",
      definition: "operate and control the direction and speed of a motor vehicle",
      example: "He can drive a car safely even on busy city highways.",
      relatedForms: ["driver (noun)"],
      collocations: ["drive a car", "drive safely", "learn to drive"],
      synonyms: ["steer", "operate"],
      antonyms: [],
      tags: ["actions", "transport"],
      verbForms: { v1: "drive", v2: "drove", v3: "driven" },
      translation: "يقود (سيارة أو مركبة)",
      exampleArabic: "يستطيع قيادة السيارة بأمان حتى على الطرق السريعة المزدحمة في المدينة."
    },
    {
      headword: "fly",
      pronunciation: "/flaɪ/",
      partOfSpeech: "verb",
      definition: "move through the air using wings, or pilot an aircraft",
      example: "Trained commercial pilots can fly large passenger airplanes.",
      relatedForms: ["flight (noun)"],
      collocations: ["fly a plane", "fly abroad", "fly high"],
      synonyms: ["soar", "pilot"],
      antonyms: [],
      tags: ["actions", "transport"],
      verbForms: { v1: "fly", v2: "flew", v3: "flown" },
      translation: "يطير / يقود طائرة",
      exampleArabic: "يستطيع الطيارون التجاريون المدربون قيادة طائرات الركاب الكبيرة."
    },
    {
      headword: "fix",
      pronunciation: "/fɪks/",
      partOfSpeech: "verb",
      definition: "mend or repair something that is damaged or not working",
      example: "My uncle can fix broken wooden chairs and doors easily.",
      relatedForms: ["fixture (noun)"],
      collocations: ["fix a problem", "fix a car", "fix broken items"],
      synonyms: ["repair", "mend"],
      antonyms: ["break", "damage"],
      tags: ["actions", "skills"],
      verbForms: { v1: "fix", v2: "fixed", v3: "fixed" },
      translation: "يُصلح / يُسوي",
      exampleArabic: "يستطيع عمي إصلاح الكراسي والأبواب الخشبية المكسورة بسهولة."
    },
    {
      headword: "repair",
      pronunciation: "/rɪˈpeə/",
      partOfSpeech: "verb",
      definition: "restore something damaged, faulty, or worn to a good condition",
      example: "The certified technician repaired my laptop computer in an hour.",
      relatedForms: ["repair (noun)"],
      collocations: ["repair a machine", "repair damage", "repair easily"],
      synonyms: ["fix", "mend", "restore"],
      antonyms: ["break"],
      tags: ["actions", "skills"],
      verbForms: { v1: "repair", v2: "repaired", v3: "repaired" },
      translation: "يُرمم / يُصلح جهازاً",
      exampleArabic: "أصلح الفني المعتمد حاسوبي المحمول في غضون ساعة."
    },
    {
      headword: "build",
      pronunciation: "/bɪld/",
      partOfSpeech: "verb",
      definition: "construct something by putting parts or material together",
      example: "Engineers build strong bridges that withstand heavy earthquakes.",
      relatedForms: ["builder (noun)", "building (noun)"],
      collocations: ["build a house", "build skills", "build trust"],
      synonyms: ["construct", "erect"],
      antonyms: ["demolish", "destroy"],
      tags: ["actions", "skills"],
      verbForms: { v1: "build", v2: "built", v3: "built" },
      translation: "يبني / يُشيّد",
      exampleArabic: "يبني المهندسون جسوراً قوية تصمد أمام الزلازل العنيفة."
    },
    {
      headword: "create",
      pronunciation: "/kriˈeɪt/",
      partOfSpeech: "verb",
      definition: "bring something into existence; cause something to happen as a result of one's actions",
      example: "Good authors create imaginative worlds with words.",
      relatedForms: ["creation (noun)", "creative (adjective)"],
      collocations: ["create art", "create opportunities", "create a plan"],
      synonyms: ["produce", "invent", "generate"],
      antonyms: ["destroy"],
      tags: ["actions", "creativity"],
      verbForms: { v1: "create", v2: "created", v3: "created" },
      translation: "يخلق / يُبدع / يبتكر",
      exampleArabic: "يبتكر المؤلفون الجيدون عوالم مليئة بالخيال بالكلمات."
    },
    {
      headword: "bake",
      pronunciation: "/beɪk/",
      partOfSpeech: "verb",
      definition: "cook food by dry heat without direct exposure to a flame, typically in an oven",
      example: "My grandmother bakes delicious cinnamon rolls every Saturday.",
      relatedForms: ["baker (noun)", "bakery (noun)"],
      collocations: ["bake bread", "bake a cake", "freshly baked"],
      synonyms: ["roast"],
      antonyms: [],
      tags: ["actions", "cooking"],
      verbForms: { v1: "bake", v2: "baked", v3: "baked" },
      translation: "يخبز (في الفرن)",
      exampleArabic: "تخبز جدتي لفائف القرفة اللذيذة كل يوم سبت."
    },
    {
      headword: "type",
      pronunciation: "/taɪp/",
      partOfSpeech: "verb",
      definition: "write something on a computer or typewriter using a keyboard",
      example: "She can type seventy words per minute without making errors.",
      relatedForms: ["typist (noun)"],
      collocations: ["type fast", "type accurately", "type an email"],
      synonyms: ["key in", "input"],
      antonyms: [],
      tags: ["actions", "technology"],
      verbForms: { v1: "type", v2: "typed", v3: "typed" },
      translation: "يكتب على لوحة المفاتيح / يطبع",
      exampleArabic: "تستطيع الكتابة بسرعة سبعين كلمة في الدقيقة دون ارتكاب أخطاء."
    },
    {
      headword: "count",
      pronunciation: "/kaʊnt/",
      partOfSpeech: "verb",
      definition: "determine the total number of a collection of items",
      example: "The little boy can count from one to one hundred in English.",
      relatedForms: ["counter (noun)"],
      collocations: ["count numbers", "count aloud", "count accurately"],
      synonyms: ["calculate", "enumerate"],
      antonyms: [],
      tags: ["actions", "math"],
      verbForms: { v1: "count", v2: "counted", v3: "counted" },
      translation: "يعد / يحصي",
      exampleArabic: "يستطيع الصبي الصغير العد من واحد إلى مئة باللغة الإنجليزية."
    },
    {
      headword: "solve",
      pronunciation: "/sɒlv/",
      partOfSpeech: "verb",
      definition: "find an answer to, explanation for, or means of dealing with a problem",
      example: "Can you solve this complex mathematics puzzle?",
      relatedForms: ["solution (noun)"],
      collocations: ["solve a problem", "solve a puzzle", "solve an issue"],
      synonyms: ["resolve", "work out"],
      antonyms: ["complicate"],
      tags: ["actions", "thinking"],
      verbForms: { v1: "solve", v2: "solved", v3: "solved" },
      translation: "يحل (مشكلة أو مسألة)",
      exampleArabic: "هل يمكنك حل هذا اللغز الرياضي المعقد؟"
    },
    {
      headword: "remember",
      pronunciation: "/rɪˈmembə/",
      partOfSpeech: "verb",
      definition: "have in or be able to bring to one's mind an awareness of someone or something",
      example: "I always remember the new English vocabulary by reviewing flashcards.",
      relatedForms: ["remembrance (noun)"],
      collocations: ["remember words", "remember clearly", "remember to do"],
      synonyms: ["recall", "recollect"],
      antonyms: ["forget"],
      tags: ["actions", "memory"],
      verbForms: { v1: "remember", v2: "remembered", v3: "remembered" },
      translation: "يتذكر / يذكر",
      exampleArabic: "أتذكر دائماً مفردات اللغة الإنجليزية الجديدة من خلال مراجعة البطاقات التعليمية."
    },
    {
      headword: "forget",
      pronunciation: "/fəˈɡet/",
      partOfSpeech: "verb",
      definition: "fail to remember or inadvertently neglect to do something",
      example: "Don't forget to review your grammar structures before the exam.",
      relatedForms: ["forgetful (adjective)"],
      collocations: ["forget a name", "never forget", "easy to forget"],
      synonyms: ["overlook"],
      antonyms: ["remember"],
      tags: ["actions", "memory"],
      verbForms: { v1: "forget", v2: "forgot", v3: "forgotten" },
      translation: "ينسى / يغفل عن",
      exampleArabic: "لا تنسَ مراجعة تراكيب القواعد الخاصة بك قبل الامتحان."
    },
    {
      headword: "understand",
      pronunciation: "/ˌʌndəˈstænd/",
      partOfSpeech: "verb",
      definition: "perceive the intended meaning of words, a language, or a concept",
      example: "I can understand spoken English when the speaker talks clearly.",
      relatedForms: ["understanding (noun)"],
      collocations: ["understand clearly", "fully understand", "understand English"],
      synonyms: ["comprehend", "grasp"],
      antonyms: ["misunderstand"],
      tags: ["actions", "thinking"],
      verbForms: { v1: "understand", v2: "understood", v3: "understood" },
      translation: "يفهم / يستوعب",
      exampleArabic: "أستطيع فهم اللغة الإنجليزية المنطوقة عندما يتحدث المتكلم بوضوح."
    },
    {
      headword: "learn",
      pronunciation: "/lɜːn/",
      partOfSpeech: "verb",
      definition: "gain or acquire knowledge of or skill in something by study or experience",
      example: "We learn new English communication skills every single day.",
      relatedForms: ["learner (noun)", "learning (noun)"],
      collocations: ["learn quickly", "learn a language", "learn by doing"],
      synonyms: ["acquire", "master"],
      antonyms: [],
      tags: ["actions", "learning"],
      verbForms: { v1: "learn", v2: "learned", v3: "learned" },
      translation: "يتعلم / يكتسب معرفة",
      exampleArabic: "نتعلم مهارات تواصل باللغة الإنجليزية جديدة كل يوم."
    },
    {
      headword: "teach",
      pronunciation: "/tiːtʃ/",
      partOfSpeech: "verb",
      definition: "impart knowledge to or instruct someone as to how to do something",
      example: "Our instructor teaches English grammar using practical examples.",
      relatedForms: ["teacher (noun)"],
      collocations: ["teach a language", "teach students", "teach effectively"],
      synonyms: ["instruct", "educate", "train"],
      antonyms: ["learn"],
      tags: ["actions", "learning"],
      verbForms: { v1: "teach", v2: "taught", v3: "taught" },
      translation: "يُعلّم / يُدرّس",
      exampleArabic: "يُعلّم مدرسنا قواعد اللغة الإنجليزية باستخدام أمثلة عملية."
    },
    {
      headword: "explain",
      pronunciation: "/ɪkˈspleɪn/",
      partOfSpeech: "verb",
      definition: "make an idea or situation clear to someone by describing it in more detail",
      example: "Can you explain the difference between 'can' and 'able to'?",
      relatedForms: ["explanation (noun)"],
      collocations: ["explain clearly", "explain a concept", "explain in detail"],
      synonyms: ["clarify", "elucidate"],
      antonyms: ["confuse"],
      tags: ["actions", "communication"],
      verbForms: { v1: "explain", v2: "explained", v3: "explained" },
      translation: "يشرح / يوضح",
      exampleArabic: "هل يمكنك شرح الفرق بين 'can' و 'able to'؟"
    },
    {
      headword: "show",
      pronunciation: "/ʃəʊ/",
      partOfSpeech: "verb",
      definition: "allow or cause something to be visible; demonstrate an ability or truth",
      example: "Please show me how to play that chord on the guitar.",
      relatedForms: [],
      collocations: ["show how to", "show talent", "show results"],
      synonyms: ["demonstrate", "display"],
      antonyms: ["hide", "conceal"],
      tags: ["actions", "demonstration"],
      verbForms: { v1: "show", v2: "showed", v3: "shown" },
      translation: "يُري / يوضح عملياً / يُظهر",
      exampleArabic: "يرجى أن تريني كيف تعزف تلك النغمة على الغيتار."
    },
    {
      headword: "try",
      pronunciation: "/traɪ/",
      partOfSpeech: "verb",
      definition: "make an attempt or effort to do something",
      example: "Always try your best to speak English without fear of making mistakes.",
      relatedForms: ["trial (noun)"],
      collocations: ["try hard", "try your best", "try to learn"],
      synonyms: ["attempt", "endeavor"],
      antonyms: ["give up"],
      tags: ["actions", "effort"],
      verbForms: { v1: "try", v2: "tried", v3: "tried" },
      translation: "يحاول / يجرب",
      exampleArabic: "حاول دائماً بذل قصارى جهدك للتحدث بالإنجليزية دون خوف من ارتكاب الأخطاء."
    },
    {
      headword: "able",
      pronunciation: "/ˈeɪbl/",
      partOfSpeech: "adjective",
      definition: "having the power, skill, means, or opportunity to do something",
      example: "With daily practice, you will be able to speak fluent English.",
      relatedForms: ["ability (noun)"],
      collocations: ["be able to", "perfectly able"],
      synonyms: ["capable", "competent"],
      antonyms: ["unable"],
      tags: ["skills", "ability"],
      translation: "قادر على / متمكن",
      exampleArabic: "مع الممارسة اليومية، ستكون قادراً على التحدث بإنجليزية طليقة."
    },
    {
      headword: "fluent",
      pronunciation: "/ˈfluːənt/",
      partOfSpeech: "adjective",
      definition: "able to express oneself easily, smoothly, and articulately in a foreign language",
      example: "She is fluent in both English and Arabic.",
      relatedForms: ["fluency (noun)", "fluently (adverb)"],
      collocations: ["fluent speaker", "fluent English", "become fluent"],
      synonyms: ["articulate", "natural"],
      antonyms: ["hesitant"],
      tags: ["descriptions", "language"],
      translation: "فصيح / طليق اللسان",
      exampleArabic: "هي طليقة اللسان في كل من اللغتين الإنجليزية والعربية."
    },
    {
      headword: "quick",
      pronunciation: "/kwɪk/",
      partOfSpeech: "adverb",
      definition: "moving fast or doing something in a short time; rapid in learning",
      example: "He is a quick learner who memorizes new words effortlessly.",
      relatedForms: ["quickly (adverb)"],
      collocations: ["quick learner", "quick response", "quick mind"],
      synonyms: ["fast", "rapid", "swift"],
      antonyms: ["slow"],
      tags: ["descriptions", "speed"],
      translation: "سريع (في التعلم أو الحركة)",
      exampleArabic: "إنه سريع التعلم يحفظ الكلمات الجديدة دون عناء."
    },
    {
      headword: "slow",
      pronunciation: "/sləʊ/",
      partOfSpeech: "adjective",
      definition: "moving or operating, or designed to do so, only at a low speed; taking a long time",
      example: "Progress in language learning might feel slow at first, but it is steady.",
      relatedForms: ["slowly (adverb)"],
      collocations: ["slow pace", "slow progress", "slow learner"],
      synonyms: ["gradual", "unhurried"],
      antonyms: ["quick", "fast"],
      tags: ["descriptions", "speed"],
      translation: "بطيء / متمهل",
      exampleArabic: "قد يبدو التقدم في تعلم اللغة بطيئاً في البداية، ولكنه ثابت ومستمر."
    },
    {
      headword: "easy",
      pronunciation: "/ˈiːzi/",
      partOfSpeech: "adjective",
      definition: "achieved without great effort; presenting few difficulties",
      example: "This elementary grammar lesson is very easy to understand.",
      relatedForms: ["easily (adverb)"],
      collocations: ["easy to understand", "easy task", "make it easy"],
      synonyms: ["simple", "effortless"],
      antonyms: ["hard", "difficult"],
      tags: ["descriptions", "difficulty"],
      translation: "سهل / يسير",
      exampleArabic: "هذا الدرس النحوي التمهيدي سهل الفهم للغاية."
    },
    {
      headword: "hard",
      pronunciation: "/hɑːd/",
      partOfSpeech: "adjective",
      definition: "requiring a great deal of endurance or effort; not easy",
      example: "Learning to pronounce unfamiliar sounds can be hard at first.",
      relatedForms: ["hardly (adverb)"],
      collocations: ["hard work", "work hard", "hard problem"],
      synonyms: ["difficult", "tough", "challenging"],
      antonyms: ["easy"],
      tags: ["descriptions", "difficulty"],
      translation: "صعب / شاق",
      exampleArabic: "تعلم نطق الأصوات غير المألوفة قد يكون صعباً في البداية."
    },
    {
      headword: "difficult",
      pronunciation: "/ˈdɪfɪkəlt/",
      partOfSpeech: "adjective",
      definition: "needing much effort or skill to accomplish, deal with, or understand",
      example: "Solving this advanced mathematical equation is quite difficult.",
      relatedForms: ["difficulty (noun)"],
      collocations: ["difficult question", "difficult task", "find it difficult"],
      synonyms: ["hard", "challenging", "complex"],
      antonyms: ["easy", "simple"],
      tags: ["descriptions", "difficulty"],
      translation: "صعب / معقد",
      exampleArabic: "حل هذه المعادلة الرياضية المتقدمة صعب ومعقد للغاية."
    }
  ],
  grammar: [
    {
      title: "Can / Can't for Ability",
      titleArabic: "استخدام Can و Can't للتعبير عن القدرة والاستطاعة",
      explanation: "We use 'can' to express that someone has the ability or skill to do something. We use 'cannot' or 'can't' to express lack of ability. Important rules: 1. 'Can' never changes its form (no -s for he/she/it). 2. Always use the bare base form of the verb after 'can' (do not use 'to'). 3. For questions, invert 'can' and the subject: 'Can you speak English?'",
      explanationArabic: "نستخدم الفعل المساعد 'can' للتعبير عن امتلاك الشخص القدرة أو المهارة لفعل شيء ما، ونستخدم 'cannot' أو اختصارها 'can't' للتعبير عن عدم الاستطاعة. قواعد أساسية: 1. الفعل 'can' لا يتغير شكله أبداً (لا نضيف s مع he/she/it). 2. يأتي بعده الفعل في المصدر المجرد دائماً بدون 'to'. 3. في السؤال، نقدم can على الفاعل: 'Can you speak English?'",
      structures: [
        {
          pattern: "Subject + can + base verb",
          explanation: "Positive sentence expressing ability",
          explanationArabic: "الجملة المثبتة للتعبير عن القدرة"
        },
        {
          pattern: "Subject + cannot / can't + base verb",
          explanation: "Negative sentence expressing lack of ability",
          explanationArabic: "جملة النفي للتعبير عن عدم الاستطاعة"
        },
        {
          pattern: "Can + Subject + base verb?",
          explanation: "Question asking about personal ability",
          explanationArabic: "سؤال للسؤال عن امتلاك المهارة أو القدرة"
        },
        {
          pattern: "Yes, Subject + can. / No, Subject + can't.",
          explanation: "Short answers to ability questions",
          explanationArabic: "الإجابات القصيرة بنعم أو لا"
        }
      ],
      examples: [
        {
          sentence: "I can speak two languages fluently.",
          translation: "أستطيع التحدث بلغتين بطلاقة.",
          usesVocabulary: ["can", "speak", "language", "fluent"]
        },
        {
          sentence: "She can play the acoustic guitar and sing.",
          translation: "هي تستطيع العزف على الغيتار الصوتي والغناء.",
          usesVocabulary: ["can", "guitar", "sing"]
        },
        {
          sentence: "He can't drive a car without a valid license.",
          translation: "لا يستطيع قيادة السيارة بدون رخصة صالحة.",
          usesVocabulary: ["can", "drive", "car", "license"]
        },
        {
          sentence: "Can you solve this difficult math puzzle?",
          translation: "هل تستطيع حل هذا اللغز الرياضي الصعب؟",
          usesVocabulary: ["can", "solve", "difficult"]
        }
      ],
      commonUsage: [
        "I can swim. (أستطيع السباحة.)",
        "Can you help me? (هل يمكنك مساعدتي؟)",
        "They can't speak French. (لا يستطيعون التحدث بالفرنسية.)"
      ],
      commonMistakes: [
        {
          wrong: "He cans speak English.",
          right: "He can speak English.",
          explanation: "Modal verbs like 'can' never add '-s' for the third person singular."
        },
        {
          wrong: "I can to drive.",
          right: "I can drive.",
          explanation: "Do not put 'to' after 'can'; use the bare infinitive."
        }
      ]
    }
  ],
  conversations: [
    {
      title: "Discovering Talents and Hobbies",
      titleArabic: "اكتشاف المواهب والهوايات",
      setting: "Sitting in the student activity lounge on a Tuesday afternoon",
      settingArabic: "الجلوس في صالة الأنشطة الطلابية بعد ظهر الثلاثاء",
      lines: [
        {
          speaker: "Samir",
          text: "Can you play any musical instrument, like the piano or acoustic guitar?",
          translation: "هل تستطيع العزف على أي آلة موسيقية، مثل البيانو أو الغيتار الصوتي؟"
        },
        {
          speaker: "Hani",
          text: "I can play the piano reasonably well, but I can't sing any song in tune.",
          translation: "أستطيع العزف على البيانو بشكل معقول، لكنني لا أستطيع غناء أي أغنية بإيقاع صحيح."
        },
        {
          speaker: "Samir",
          text: "That is still a wonderful talent! Do you also have any artistic drawing ability?",
          translation: "تلك لا تزال موهبة رائعة! هل لديك أيضاً أي قدرة على الرسم الفني؟"
        },
        {
          speaker: "Hani",
          text: "No, drawing is quite difficult for me, but my sister can paint beautiful oil pictures.",
          translation: "لا، الرسم صعب جداً بالنسبة لي، لكن أختي تستطيع رسم لوحات زيتية جميلة."
        },
        {
          speaker: "Samir",
          text: "I love creative arts. I can take a crisp photograph with my camera, but I can't dance.",
          translation: "أنا أحب الفنون الإبداعية؛ أستطيع التقاط صورة فوتوغرافية واضحة بكاميرتي، لكن لا أستطيع الرقص."
        },
        {
          speaker: "Hani",
          text: "Can you ride a bicycle or drive a car in heavy traffic?",
          translation: "هل تستطيع ركوب دراجة هوائية أو قيادة سيارة في حركة مرور مزدحمة؟"
        },
        {
          speaker: "Samir",
          text: "I can ride a bicycle easily, and I am currently learning to drive to get my driver's license.",
          translation: "أستطيع ركوب الدراجة الهوائية بسهولة، وأتعلم القيادة حالياً للحصول على رخصة القيادة."
        },
        {
          speaker: "Hani",
          text: "Good luck with your driving practice; with patience, you will be able to pass!",
          translation: "بالتوفيق في ممارسة القيادة؛ مع الصبر، ستكون قادراً على النجاح!"
        }
      ],
      vocabularyUsed: [
        "can", "instrument", "piano", "guitar", "sing", "song", "talent",
        "drawing", "ability", "difficult", "paint", "photograph", "dance",
        "ride", "bicycle", "drive", "car", "license", "easy", "able"
      ]
    },
    {
      title: "Learning Practical Computer and Language Skills",
      titleArabic: "تعلم مهارات الحاسوب واللغات العملية",
      setting: "In the college computer lab after class",
      settingArabic: "في معمل حاسوب الكلية بعد المحاضرة",
      lines: [
        {
          speaker: "Rami",
          text: "Can you type fast on this desktop computer without looking at the keyboard?",
          translation: "هل تستطيع الكتابة بسرعة على هذا الحاسوب المكتبي دون النظر إلى لوحة المفاتيح؟"
        },
        {
          speaker: "Dalia",
          text: "Yes, I can type over sixty words a minute because I practiced hard last summer.",
          translation: "نعم، أستطيع كتابة أكثر من ستين كلمة في الدقيقة لأنني تدربت بجد الصيف الماضي."
        },
        {
          speaker: "Rami",
          text: "That is such an impressive skill! Can you also fix software problems or repair computers?",
          translation: "هذه مهارة مبهرة حقاً! هل يمكنك أيضاً إصلاح مشاكل البرمجيات أو ترميم الحواسيب؟"
        },
        {
          speaker: "Dalia",
          text: "I can fix minor operating glitches and build simple web pages, but I can't repair hardware.",
          translation: "أستطيع إصلاح الأعطال البرمجية البسيطة وبناء صفحات ويب بسيطة، لكني لا أستطيع إصلاح العتاد."
        },
        {
          speaker: "Rami",
          text: "Can you understand this English technical manual? Some sentences look very hard.",
          translation: "هل يمكنك فهم هذا الدليل الفني الإنجليزي؟ بعض الجمل تبدو صعبة للغاية."
        },
        {
          speaker: "Dalia",
          text: "I can understand most of it. Let me explain the tricky grammar rules to you.",
          translation: "أستطيع فهم معظمه. دعني أشرح لك قواعد اللغة المعقدة."
        },
        {
          speaker: "Rami",
          text: "Thank you, Dalia. When you teach me, difficult concepts suddenly become easy.",
          translation: "شكراً لكِ يا داليا. عندما تعلمينني، تصبح المفاهيم الصعبة سهلة فجأة."
        },
        {
          speaker: "Dalia",
          text: "Whenever we try our best and help each other, we all learn much quicker.",
          translation: "كلما بذلنا قصارى جهدنا وساعد بعضنا بعضاً، تعلمنا جميعاً بشكل أسرع."
        }
      ],
      vocabularyUsed: [
        "can", "type", "computer", "quick", "hard", "skill", "fix", "repair",
        "build", "understand", "explain", "teach", "difficult", "easy", "try", "learn"
      ]
    },
    {
      title: "Playing Chess and Brain Games",
      titleArabic: "لعب الشطرنج وألعاب الذكاء",
      setting: "At the university games room beside the library",
      settingArabic: "في غرفة الألعاب الجامعية بجوار المكتبة",
      lines: [
        {
          speaker: "Nabil",
          text: "Do you know how to play strategic chess, or do you find it too slow?",
          translation: "هل تعرف كيف تلعب الشطرنج الاستراتيجي، أم تجده بطيئاً للغاية؟"
        },
        {
          speaker: "Yasser",
          text: "I can play chess well! My grandfather taught me the rules when I was a child.",
          translation: "أستطيع لعب الشطرنج جيداً! علمني جدي القواعد عندما كنت طفلاً."
        },
        {
          speaker: "Nabil",
          text: "Can you solve this tactical chess puzzle? White must deliver checkmate in three moves.",
          translation: "هل تستطيع حل هذا اللغز التكتيكي للشطرنج؟ يجب على الأبيض تنفيذ كش مات في ثلاث نقلات."
        },
        {
          speaker: "Yasser",
          text: "Let me count the open squares on the board. Yes, I remember this classic maneuver!",
          translation: "دعني أعد المربعات المفتوحة على الرقعة. نعم، أنا أتذكر هذه المناورة الكلاسيكية!"
        },
        {
          speaker: "Nabil",
          text: "Show me your winning move before I forget where my knight is standing.",
          translation: "أرني نقلتك الفائزة قبل أن أنسى أين يقف حصاني."
        },
        {
          speaker: "Yasser",
          text: "Move the queen to the corner square; that creates an inescapable double attack.",
          translation: "حرك الملكة إلى مربع الزاوية؛ هذا يخلق هجوماً مزدوجاً لا مهرب منه."
        },
        {
          speaker: "Nabil",
          text: "Brilliant! You have a real talent for analytical thinking and problem-solving.",
          translation: "عبقري! لديك موهبة حقيقية في التفكير التحليلي وحل المشكلات."
        },
        {
          speaker: "Yasser",
          text: "Chess teaches patience and mental discipline, which helps us in our language studies too.",
          translation: "يعلم الشطرنج الصبر والانضباط الذهني، وهو ما يساعدنا في دراساتنا اللغوية أيضاً."
        }
      ],
      vocabularyUsed: [
        "chess", "slow", "can", "teach", "solve", "count", "remember", "show",
        "forget", "create", "talent", "language"
      ]
    }
  ],
  paragraphs: [
    {
      title: "Developing Valuable Communication Skills",
      titleArabic: "تطوير مهارات تواصل قيمة",
      kind: "education",
      text: "Acquiring a foreign language is an empowering journey that develops practical communication skills for life. When you commit to studying English daily, you become able to understand spoken lectures and speak with fluent confidence. At first, learning complex grammar might seem hard or slow, but consistent practice makes the process much easier. When students try without fear, they remember new vocabulary and solve communicative challenges with ease. Experienced teachers explain difficult concepts clearly and show beginners how to express their ideas naturally. Building strong language ability opens endless doors for future international opportunities.",
      translation: "إن اكتساب لغة أجنبية رحلة تمكينية تطور مهارات تواصل عملية مدى الحياة. عندما تلتزم بدراسة اللغة الإنجليزية يومياً، تصبح قادراً على فهم المحاضرات المنطوقة والتحدث بطلاقة وثقة. في البداية، قد يبدو تعلم القواعد المعقدة صعباً أو بطيئاً، لكن الممارسة المستمرة تجعل العملية أسهل بكثير. وعندما يحاول الطلاب دون خوف، يتذكرون المفردات الجديدة ويحلون التحديات التواصلية بسهولة. يشرح المعلمون ذوو الخبرة المفاهيم الصعبة بوضوح ويظهرون للمبتدئين كيفية التعبير عن أفكارهم بعفوية. إن بناء قدرة لغوية قوية يفتح أبواباً لا حصر لها للفرص الدولية المستقبلية.",
      vocabularyUsed: [
        "language", "skill", "able", "understand", "speak", "fluent", "hard",
        "slow", "easy", "try", "remember", "solve", "teach", "explain", "difficult",
        "show", "build", "ability"
      ]
    },
    {
      title: "Creative Talents in Our Community",
      titleArabic: "المواهب الإبداعية في مجتمعنا",
      kind: "culture",
      text: "Every individual in our community possesses unique abilities and creative talents waiting to be shared. Some people can play a musical instrument like the piano or guitar with remarkable feeling. Others can sing melodic songs or dance with rhythmic grace at cultural festivals. Many talented artists draw pencil portraits or create colorful oil paintings that inspire viewers in local galleries. A skilled photographer can capture a striking photograph of nature at sunset with quick precision. When communities celebrate diverse artistic skills, they create an inspiring environment where everyone can flourish.",
      translation: "يمتلك كل فرد في مجتمعنا قدرات فريدة ومواهب إبداعية تنتظر المشاركة. يستطيع بعض الناس العزف على آلة موسيقية مثل البيانو أو الغيتار بإحساس رائع. ويمكن لآخرين غناء أغانٍ عذبة أو الرقص برشاقة إيقاعية في المهرجانات الثقافية. ويرسم العديد من الفنانين الموهوبين لوحات بالقلم الرصاص أو يبتكرون لوحات زيتية ملونة تلهم المشاهدين في المعارض المحلية. ويستطيع المصور البارع التقاط صورة فوتوغرافية مذهلة للطبيعة عند الغروب بدقة سريعة. وعندما تحتفي المجتمعات بالمهارات الفنية المتنوعة، فإنها تخلق بيئة ملهمة يزدهر فيها الجميع.",
      vocabularyUsed: [
        "ability", "talent", "can", "instrument", "piano", "guitar", "sing",
        "song", "dance", "draw", "create", "painting", "photograph", "quick", "skill"
      ]
    },
    {
      title: "Learning Practical Everyday Skills",
      titleArabic: "تعلم مهارات عملية يومية",
      kind: "lifestyle",
      text: "Mastering practical everyday skills builds self-reliance and gives you confidence to navigate modern life smoothly. Learning how to ride a bicycle safely allows you to travel through green parks and exercise outdoors. When young people obtain a driver's license and learn to drive a car carefully, they gain independence for commuting to university or work. At home, being able to bake nutritious bread or fix small broken household appliances saves money and prevents waste. Furthermore, learning how to type efficiently on a computer helps you complete work assignments quickly. Continuous learning keeps our minds active and sharp.",
      translation: "إن إتقان المهارات العملية اليومية يبني الاعتماد على الذات ويمنحك الثقة للتعامل مع الحياة المعاصرة بسلاسة. يتيح لك تعلم كيفية ركوب الدراجة بأمان التنقل عبر المنتزهات الخضراء وممارسة الرياضة في الهواء الطلق. وعندما يحصل الشباب على رخصة قيادة ويتعلمون قيادة السيارة بحذر، يكتسبون استقلالية للتنقل إلى الجامعة أو العمل. وفي المنزل، فإن القدرة على خبز خبز مغذٍ أو إصلاح الأجهزة المنزلية الصغيرة المعطلة توفر المال وتمنع الهدر. علاوة على ذلك، فإن تعلم كيفية الطباعة بكفاءة على الحاسوب يساعدك على إنجاز مهام العمل بسرعة. إن التعلم المستمر يبقي عقولنا نشطة ويقظة.",
      vocabularyUsed: [
        "skill", "ride", "bicycle", "driver", "license", "drive", "car",
        "able", "bake", "fix", "type", "computer", "quick", "learn"
      ]
    }
  ]
};

fs.writeFileSync(path.join(contentDir, "day-08.json"), JSON.stringify(day08, null, 2), "utf8");
console.log("✓ Day 8 created successfully!");
