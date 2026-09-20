import json, os, re
from scripts.curriculum_engine import write_day, get_all_used_headwords, PLAN_BY_DAY
from scripts.gen_helpers import make_conversation, make_paragraph, link_vocab

used = get_all_used_headwords()

def build_vocab(raw_list):
    res = []
    for item in raw_list:
        h, p, pos, d, ex = item[0], item[1], item[2], item[3], item[4]
        tags = item[5] if len(item) > 5 else ["general"]
        rf = item[6] if len(item) > 6 else []
        col = item[7] if len(item) > 7 else []
        syn = item[8] if len(item) > 8 else []
        ant = item[9] if len(item) > 9 else []
        res.append({
            "headword": h, "pronunciation": p, "partOfSpeech": pos,
            "definition": d, "example": ex, "tags": tags,
            "relatedForms": rf, "collocations": col, "synonyms": syn, "antonyms": ant
        })
    return res

def check_no_dupes(vlist, day_num):
    for v in vlist:
        h = v["headword"].lower().strip()
        if h in used and used[h] != day_num:
            raise ValueError(f"Duplicate on Day {day_num} with Day {used[h]}: '{h}'")
        used[h] = day_num

def generate_day(day_num, raw_vocab, grammar, conv_specs, para_specs):
    vocab = build_vocab(raw_vocab)
    check_no_dupes(vocab, day_num)
    
    convs = [make_conversation(c[0], c[1], c[2], c[3]) for c in conv_specs]
    paras = [make_paragraph(p[0], p[1], p[2]) for p in para_specs]
    
    hws = [v["headword"] for v in vocab]
    convs = link_vocab(convs, hws)
    paras = link_vocab(paras, hws)
    
    write_day(day_num, vocab, grammar, convs, paras)
    print(f"Day {day_num} generated successfully!")

# ==========================================
# DAY 8: What I Can Do
# Grammar: ["Can / Can't for Ability"]
# ==========================================
d8_raw = [
    ("speak", "/spiːk/", "verb", "to say words with your voice; to know a language", "She can speak three foreign languages fluently.", ["ability", "language"]),
    ("write", "/raɪt/", "verb", "to mark letters or words on a surface with a pen or pencil", "He can write beautiful poetry in English.", ["ability", "communication"]),
    ("sing", "/sɪŋ/", "verb", "to make musical sounds with the voice in tune", "My sister can sing classical melodies wonderfully.", ["talent", "music"]),
    ("dance", "/dɑːns/", "verb", "to move your body rhythmically to music", "They love to dance salsa on weekend evenings.", ["talent", "music"]),
    ("drive", "/draɪv/", "verb", "to operate and control the direction and speed of a motor vehicle", "Can you drive a manual transmission car?", ["skill", "transport"]),
    ("ride", "/raɪd/", "verb", "to sit on and control the movement of a horse, bicycle, or motorcycle", "The children can ride bicycles without training wheels.", ["skill", "sport"]),
    ("play guitar", "/pleɪ ɡɪˈtɑːr/", "phrase", "to perform music on a stringed musical instrument", "He can play guitar around the campfire.", ["talent", "music"]),
    ("play piano", "/pleɪ piˈæn.əʊ/", "phrase", "to perform music on a keyboard instrument", "She plays piano for the local church choir.", ["talent", "music"]),
    ("bake", "/beɪk/", "verb", "to cook food by dry heat without direct exposure to a flame, typically in an oven", "Grandmother can bake delicious crusty bread.", ["skill", "cooking"]),
    ("sew", "/səʊ/", "verb", "to join, fasten, or repair something by making stitches with a needle and thread", "My mother can sew elegant dresses from fabric.", ["skill", "craft"]),
    ("knit", "/nɪt/", "verb", "to make a garment by interlocking loops of wool or other yarn with needles", "She can knit a warm woolen scarf in two days.", ["skill", "craft"]),
    ("fix", "/fɪks/", "verb", "to repair or mend something that is damaged or broken", "He can fix almost any broken household appliance.", ["skill"]),
    ("repair", "/rɪˈpeər/", "verb", "to restore something that is damaged or faulty to good condition", "Can you repair this squeaky wooden chair?", ["skill"]),
    ("solve", "/sɒlv/", "verb", "to find an answer to, explanation for, or means of effectively dealing with a problem", "She can solve complex mathematics equations quickly.", ["mental", "ability"]),
    ("calculate", "/ˈkæl.kjə.leɪt/", "verb", "to determine the amount or number of something mathematically", "He can calculate totals without using an electronic calculator.", ["mental", "ability"]),
    ("type", "/taɪp/", "verb", "to write something using a computer keyboard or typewriter", "I can type sixty words per minute on my keyboard.", ["skill", "work"]),
    ("code", "/kəʊd/", "verb", "to write computer programs or software instructions", "Many students can code simple web applications.", ["skill", "tech"]),
    ("design", "/dɪˈzaɪn/", "verb", "to produce a plan, drawing, or outline for a building, garment, or product", "She can design modern websites and logos.", ["creativity", "skill"]),
    ("skate", "/skeɪt/", "verb", "to move on ice skates or roller skates", "The teenagers can skate smoothly across the frozen rink.", ["sport"]),
    ("ski", "/skiː/", "verb", "to move over snow on a pair of skis", "We ski in the snowy mountains during winter holidays.", ["sport"]),
    ("climb", "/klaɪm/", "verb", "to go or come up a slope or mountain using hands and feet", "Experienced hikers can climb this rocky mountain path.", ["sport", "nature"]),
    ("whistle", "/ˈwɪs.l/", "verb", "to make a clear high-pitched sound by forcing breath through the teeth or lips", "He can whistle cheerful tunes while walking.", ["talent"]),
    ("juggle", "/ˈdʒʌɡ.l/", "verb", "to continuously toss into the air and catch a number of objects so that at least one is in the air", "The circus performer can juggle four tennis balls.", ["talent"]),
    ("talent", "/ˈtæl.ənt/", "noun", "a natural aptitude or skill in a specific activity", "She has an obvious musical talent for singing.", ["ability"]),
    ("skill", "/skɪl/", "noun", "the ability to do something well, usually gained through training or experience", "Typing fast is a very useful modern office skill.", ["ability"]),
    ("ability", "/əˈbɪl.ə.ti/", "noun", "the physical or mental power or skill needed to do something", "She has a remarkable ability to learn languages.", ["ability"]),
    ("fluent", "/ˈfluː.ənt/", "adjective", "able to speak or write a particular foreign language easily and accurately", "He is fluent in both English and Spanish.", ["language"]),
    ("creative", "/kriˈeɪ.tɪv/", "adjective", "having or showing an ability to make new things or think of new ideas", "Creative designers find innovative solutions to problems.", ["quality"]),
    ("artistic", "/ɑːˈtɪs.tɪk/", "adjective", "having natural creative skill in art, music, or writing", "The artistic child painted a magnificent mural.", ["quality"]),
    ("musical", "/ˈmjuː.zɪ.kəl/", "adjective", "having a pleasant sound, or having a natural aptitude for music", "Every member of their musical family plays an instrument.", ["talent"]),
    ("athletic", "/æθˈlet.ɪk/", "adjective", "physically strong, fit, and active; good at sports", "Athletic runners train every day on the track.", ["sport", "health"]),
    ("clever", "/ˈklev.ər/", "adjective", "quick to understand, learn, and devise or apply ideas; intelligent", "She found a clever way to solve the puzzle.", ["mental"]),
    ("capable", "/ˈkeɪ.pə.bl/", "adjective", "having the ability, fitness, or quality necessary to do something", "He is fully capable of managing this department.", ["ability"]),
    ("expert", "/ˈek.spɜːt/", "noun", "a person who has a comprehensive and authoritative knowledge of or skill in a particular area", "Consult an expert mechanic to inspect the engine.", ["work"]),
    ("beginner", "/bɪˈɡɪn.ər/", "noun", "a person just starting to learn a skill or take part in an activity", "This introductory course is perfect for any beginner.", ["education"]),
    ("practice", "/ˈpræk.tɪs/", "verb / noun", "to perform an activity repeatedly or regularly in order to improve or maintain proficiency", "Musicians practice scales for two hours every day.", ["action"]),
    ("improve", "/ɪmˈpruːv/", "verb", "to make or become better in quality or skill", "Consistent study helps improve your English pronunciation.", ["progress"]),
    ("master", "/ˈmɑː.stər/", "verb", "to acquire complete knowledge or skill in an art, technique, or subject", "It takes patience to master a foreign language.", ["progress"]),
    ("fast", "/fɑːst/", "adjective / adverb", "moving or capable of moving at high speed; quickly", "He is a fast runner and wins every sprint race.", ["speed"]),
    ("slowly", "/ˈsləʊ.li/", "adverb", "at a slow speed; not quickly", "Speak slowly so the beginner can understand you.", ["speed"]),
    ("easily", "/ˈiː.zəl.i/", "adverb", "without difficulty or effort", "Athletic swimmers can swim across the bay easily.", ["manner"]),
    ("well", "/wel/", "adverb", "in a good or satisfactory way", "She speaks English very well after years of study.", ["manner"]),
    ("badly", "/ˈbæd.li/", "adverb", "in an unsatisfactory, inadequate, or harmful way", "He sings badly, but he enjoys singing anyway.", ["manner"]),
    ("swimsuit", "/ˈswɪm.suːt/", "noun", "a garment worn for swimming", "Pack your goggles and swimsuit in your sports bag.", ["clothing", "sport"]),
    ("tool", "/tuːl/", "noun", "a device or implement, especially one held in the hand, used to carry out a particular function", "A hammer is an essential manual tool.", ["equipment"]),
    ("instrument", "/ˈɪn.strə.mənt/", "noun", "a device used for producing musical sounds, such as a piano or violin", "The violin is a challenging string instrument.", ["music"]),
    ("language", "/ˈlæŋ.ɡwɪdʒ/", "noun", "the principal method of human communication, consisting of words used in a structured way", "English is a global language of international trade.", ["communication"]),
    ("foreign", "/ˈfɒr.ɪn/", "adjective", "of, from, in, or characteristic of a country or language other than one's own", "Learning a foreign tongue expands your horizons.", ["general"]),
    ("challenge", "/ˈtʃæl.ɪndʒ/", "noun", "a task or situation that tests someone's abilities", "Climbing a steep mountain is an exciting challenge.", ["action"]),
    ("achievement", "/əˈtʃiːv.mənt/", "noun", "a thing done successfully with effort, skill, or courage", "Graduating with honors was her greatest achievement.", ["progress"])
]

d8_grammar = [
    {
        "title": "Can / Can't for Ability",
        "explanation": "Use 'can' + base verb to say that someone has the ability or skill to do something. Use 'cannot' or the contraction 'can't' to express lack of ability. The form 'can' remains identical for all subject pronouns (I, you, he, she, it, we, they) and does not take an -s ending.",
        "structures": [
            {"pattern": "Subject + can + base verb", "label": "Positive Ability"},
            {"pattern": "Subject + can't (cannot) + base verb", "label": "Negative Ability"},
            {"pattern": "Can + subject + base verb ...?", "label": "Question Form"}
        ],
        "examples": [
            {"sentence": "She can speak three foreign languages fluently.", "usesVocabulary": ["speak", "foreign", "fluent"]},
            {"sentence": "He can fix the broken chair with a simple tool.", "usesVocabulary": ["fix", "tool"]},
            {"sentence": "I can't play guitar well, but I can sing cheerful songs.", "usesVocabulary": ["play guitar", "sing", "well"]},
            {"sentence": "Can you design a website or code software?", "usesVocabulary": ["design", "code"]}
        ],
        "commonUsage": [
            "Asking about abilities: Can you drive a car or ride a bicycle?",
            "Stating limitations: I can't swim in deep water yet."
        ],
        "commonMistakes": [
            {"wrong": "She cans swim very fast.", "right": "She can swim very fast.", "note": "Never add -s to 'can', even with he, she, or it."},
            {"wrong": "I can to speak English.", "right": "I can speak English.", "note": "Follow 'can' directly with the base verb without 'to'."}
        ]
    }
]

d8_convs = [
    (
        "Interviewing for a Camp Counselor",
        "Camp Director Marcus interviews applicant Jessica about her skills.",
        ["Marcus", "Jessica"],
        [
            (0, "Welcome Jessica. What skills can you bring to our summer camp?"),
            (1, "I can speak Spanish fluently, and I can also swim and skate easily."),
            (0, "Can you play any musical instrument with the children?"),
            (1, "Yes, I can play guitar and play piano, and I love to sing with groups."),
            (0, "That is wonderful! Can you drive a minibus for field trips?"),
            (1, "Yes, I can drive well and I have a clean driver's license."),
            (0, "Can you also code or design educational posters?"),
            (1, "I can design posters on my computer, and I am eager to learn and improve.")
        ]
    ),
    (
        "Discussing Talents and Hobbies",
        "Ethan and Chloe talk about learning new skills.",
        ["Chloe", "Ethan"],
        [
            (0, "Do you have any artistic talent, Ethan?"),
            (1, "I can draw portraits, but I can't paint landscapes very well."),
            (0, "My grandmother can knit sweaters and sew dresses with ease."),
            (1, "That is an impressive craft skill! Can she also bake bread?"),
            (0, "She can bake the most delicious pies and solve difficult crosswords."),
            (1, "I wish I could whistle loudly or juggle three balls like a clown."),
            (0, "With consistent daily practice, any beginner can master those tricks."),
            (1, "You are right. Every new ability requires patience and dedication.")
        ]
    ),
    (
        "Sports and Outdoor Challenges",
        "Ryan and Olivia compare their athletic abilities.",
        ["Olivia", "Ryan"],
        [
            (0, "Are you ready for our weekend outdoor challenge in the mountains?"),
            (1, "I can climb steep rocky trails, but I can't ski on icy slopes."),
            (0, "Don't worry, we won't ski. We can ride mountain bikes instead."),
            (1, "Great! I can ride fast and I am quite capable on rough terrain."),
            (0, "Do you have the right tool to repair a flat bicycle tire?"),
            (1, "Yes, I can fix a punctured tire in under ten minutes."),
            (0, "You are very clever and athletic. Reaching the peak will be an achievement."),
            (1, "Together, we can solve any problem that arises along the trail.")
        ]
    )
]

d8_paras = [
    (
        "Discovering Personal Talents",
        "daily-life description",
        "Every human being possesses unique abilities and potential. Some individuals have a natural musical talent and can play guitar, play piano, or sing in perfect pitch. Others are more athletic and can run fast, swim across rivers, or climb rocky hills easily. Practical craftspeople can sew garments, knit warm blankets, bake crusty bread, and repair broken furniture using hand tools. Recognizing your strengths allows you to cultivate each valuable skill with confidence."
    ),
    (
        "Learning a Foreign Language",
        "personal story",
        "Learning to speak a foreign language is a thrilling intellectual challenge. When I was a beginner, I could only speak slowly and could not write full paragraphs. However, with disciplined daily practice, my ability began to improve steadily. Now I can type essays in English, solve grammar exercises, and communicate fluently with international visitors. Mastering another language expands your mind and represents an unforgettable personal achievement that transforms your entire life."
    ),
    (
        "Modern Digital Capabilities",
        "opinion paragraph",
        "In our modern technological era, computer literacy has become an essential workplace capability for every ambitious professional. Today, young professionals must learn how to code software, design elegant websites, and calculate statistical data quickly. Fortunately, even an absolute beginner can practice programming online and become a recognized expert over time. When workers are capable, creative, and willing to solve complex problems together, they adapt to new career demands easily and build a prosperous future."
    )
]

generate_day(8, d8_raw, d8_grammar, d8_convs, d8_paras)

# ==========================================
# DAY 9: In My City
# Grammar: ["Articles a / an / the"]
# ==========================================
d9_raw = [
    ("city", "/ˈsɪt.i/", "noun", "a large town, often the seat of a cathedral or university", "London is an ancient and vibrant cosmopolitan city.", ["places"]),
    ("town", "/taʊn/", "noun", "an urban area that has a name and defined boundaries, larger than a village", "We grew up in a peaceful coastal town.", ["places"]),
    ("village", "/ˈvɪl.ɪdʒ/", "noun", "a group of houses and other buildings, situated in a rural area", "My grandparents live in a picturesque mountain village.", ["places"]),
    ("neighborhood", "/ˈneɪ.bə.hʊd/", "noun", "a district, especially one forming a community within a town or city", "Our neighborhood has quiet streets and tall trees.", ["places"]),
    ("street", "/striːt/", "noun", "a public road in a city or town, typically with houses and buildings on side", "Children ride scooters down the one-way street.", ["places"]),
    ("road", "/rəʊd/", "noun", "a wide way between places on which vehicles travel", "The paved road leads toward the international airport.", ["transport"]),
    ("avenue", "/ˈæv.ə.njuː/", "noun", "a broad road in a town or city, typically having trees at regular intervals", "Elegant fashion boutiques line the grand avenue.", ["places"]),
    ("square", "/skweər/", "noun", "an open, typically four-sided area surrounded by buildings in a town", "Pigeons gathered around the fountain in the main square.", ["places"]),
    ("park", "/pɑːk/", "noun", "a large public garden or area of land used for recreation", "Families have pleasant picnics in the community park.", ["places", "nature"]),
    ("building", "/ˈbɪl.dɪŋ/", "noun", "a structure with a roof and walls, such as a house or factory", "That glass skyscraper is the tallest building downtown.", ["places"]),
    ("museum", "/mjuːˈziː.əm/", "noun", "a building in which objects of historical or artistic interest are stored", "Visitors admire ancient artifacts inside the national museum.", ["culture"]),
    ("library", "/ˈlaɪ.brər.i/", "noun", "a building or room containing collections of books for people to read", "Students study quietly inside the university library.", ["education"]),
    ("supermarket", "/ˈsuː.pəˌmɑː.kɪt/", "noun", "a large self-service shop selling foods and household goods", "We buy fresh groceries at the supermarket every Saturday.", ["shopping"]),
    ("market", "/ˈmɑː.kɪt/", "noun", "a regular gathering of people for the purchase and sale of provisions", "Local farmers sell fresh apples at the weekend market.", ["shopping"]),
    ("pharmacy", "/ˈfɑː.mə.si/", "noun", "a shop where medicinal drugs are prepared or sold", "Pick up your prescription from the corner pharmacy.", ["health"]),
    ("hospital", "/ˈhɒs.pɪ.təl/", "noun", "an institution providing medical and surgical treatment to sick people", "The ambulance drove rapidly toward the city hospital.", ["health"]),
    ("clinic", "/ˈklɪn.ɪk/", "noun", "an establishment where patients are given medical treatment", "She visited a specialized dental clinic this morning.", ["health"]),
    ("post office", "/ˈpəʊst ˌɒf.ɪs/", "noun", "a public department or corporation responsible for postal services", "Mail the international parcel at the local post office.", ["service"]),
    ("bank", "/bæŋk/", "noun", "a financial establishment that invests money, pays interest, and lends money", "I deposited my paycheck into the commercial bank.", ["finance"]),
    ("station", "/ˈsteɪ.ʃən/", "noun", "a place on a railway line where trains regularly stop", "Meet me by the ticket barrier at the central station.", ["transport"]),
    ("bus stop", "/ˈbʌs ˌstɒp/", "noun", "a designated place where buses stop for passengers to board or alight", "Several commuters waited patiently at the rainy bus stop.", ["transport"]),
    ("airport", "/ˈeə.pɔːt/", "noun", "a complex of runways and buildings for the takeoff and landing of aircraft", "We arrived at the international airport three hours early.", ["transport"]),
    ("restaurant", "/ˈres.trɒnt/", "noun", "a place where people pay to sit and eat meals that are prepared", "They booked a table at an Italian restaurant downtown.", ["food"]),
    ("cafe", "/ˈkæf.eɪ/", "noun", "a small restaurant selling light meals and drinks", "We sat outside the corner cafe sipping cappuccino.", ["food"]),
    ("bakery", "/ˈbeɪ.kər.i/", "noun", "a place where bread and cakes are made or sold", "The aroma of fresh sourdough wafted from the bakery.", ["food"]),
    ("hotel", "/həʊˈtel/", "noun", "an establishment providing accommodation, meals, and other services for travelers", "Tourists booked three nights at a boutique hotel.", ["travel"]),
    ("cinema", "/ˈsɪn.ə.mɑː/", "noun", "a theater where films are shown for public entertainment", "We watched the blockbuster movie at the downtown cinema.", ["entertainment"]),
    ("theater", "/ˈθɪə.tər/", "noun", "a building or outdoor area in which plays and dramatic performances are given", "Actors rehearsed their lines on the theater stage.", ["culture"]),
    ("bridge", "/brɪdʒ/", "noun", "a structure carrying a road or path across a river or ravine", "Vehicles drove slowly across the historic suspension bridge.", ["infrastructure"]),
    ("monument", "/ˈmɒn.jə.mənt/", "noun", "a statue, building, or other structure erected to commemorate a person", "A marble monument commemorates fallen soldiers.", ["culture"]),
    ("statue", "/ˈstætʃ.uː/", "noun", "a carved or cast figure of a person or animal, especially life-sized", "A bronze statue stands in the center of the plaza.", ["art"]),
    ("fountain", "/ˈfaʊn.tɪn/", "noun", "an ornamental structure in a pool or lake from which water is pumped", "Children threw coins into the splashing water fountain.", ["places"]),
    ("tower", "/taʊər/", "noun", "a tall, narrow building, either free-standing or forming part of a building", "The ancient clock tower overlooks the old harbor.", ["architecture"]),
    ("church", "/tʃɜːtʃ/", "noun", "a building used for public Christian worship", "Bells rang from the stone steeple of the church.", ["places"]),
    ("mosque", "/mɒsk/", "noun", "a Muslim place of worship", "The ornate domes of the grand mosque gleamed in the sun.", ["places"]),
    ("castle", "/ˈkɑː.sl/", "noun", "a large medieval fortified building or set of buildings", "The medieval stone castle stands on a high cliff.", ["history"]),
    ("palace", "/ˈpæl.ɪs/", "noun", "a large and impressive building forming the official residence of a monarch", "Guards in ceremonial uniforms patrol the royal palace.", ["history"]),
    ("stadium", "/ˈsteɪ.di.əm/", "noun", "a sports arena with tiers of seats for spectators", "Sixty thousand cheering fans packed the football stadium.", ["sport"]),
    ("crossroad", "/ˈkrɒs.rəʊd/", "noun", "an intersection of two or more roads", "Stop when the traffic light turns red at the crossroad.", ["transport"]),
    ("sidewalk", "/ˈsaɪd.wɔːk/", "noun", "a paved footpath alongside a street", "Pedestrians walked briskly along the wide sidewalk.", ["transport"]),
    ("pedestrian", "/pəˈdes.tri.ən/", "noun", "a person walking rather than traveling in a vehicle", "Vehicles must yield to any pedestrian on the crossing.", ["transport"]),
    ("traffic", "/ˈtræf.ɪk/", "noun", "vehicles moving on a public highway", "Rush-hour traffic crawled along the main highway.", ["transport"]),
    ("corner", "/ˈkɔː.nər/", "noun", "a place where two streets, surfaces, or sides meet", "There is a convenient newsstand on the street corner.", ["places"]),
    ("center", "/ˈsen.tər/", "noun", "the middle point or area of a city or town", "We walked toward the bustling commercial city center.", ["places"]),
    ("downtown", "/ˌdaʊnˈtaʊn/", "noun / adverb", "in or to the central part of a city, especially the business area", "Many people work in modern offices situated downtown.", ["places"]),
    ("suburb", "/ˈsʌb.ɜːb/", "noun", "an outlying district of a city, especially a residential one", "They moved from downtown to a green, peaceful suburb.", ["places"]),
    ("quiet street", "/ˈkwaɪ.ət striːt/", "phrase", "a residential roadway with very little vehicular traffic or noise", "Children play hopscotch safely on our quiet street.", ["places"]),
    ("lively", "/ˈlaɪv.li/", "adjective", "full of life and energy; active and outgoing", "The night market is colorful, bustling, and lively.", ["atmosphere"]),
    ("crowded", "/ˈkraʊ.dɪd/", "adjective", "full of people, leaving little or no room for movement", "The subway station is always crowded at eight in the morning.", ["atmosphere"]),
    ("historic", "/hɪˈstɒr.ɪk/", "adjective", "famous or important in history; belonging to the past", "Tourists photograph every historic stone monument.", ["culture"])
]

d9_grammar = [
    {
        "title": "Articles a / an / the",
        "explanation": "Use the indefinite article 'a' before consonant sounds (a city, a bank, a hotel). Use 'an' before vowel sounds (an airport, an avenue, an institution). Use 'a' or 'an' when mentioning something for the first time. Use the definite article 'the' when referring to a specific item, an item already mentioned, or something unique (the station, the city center, the tallest building).",
        "structures": [
            {"pattern": "a + consonant sound (a museum / a library)", "label": "Indefinite Consonant"},
            {"pattern": "an + vowel sound (an avenue / an airport)", "label": "Indefinite Vowel"},
            {"pattern": "the + specific / unique noun (the city center / the bridge)", "label": "Definite Article"}
        ],
        "examples": [
            {"sentence": "There is a modern museum and an ancient library downtown.", "usesVocabulary": ["museum", "library", "downtown"]},
            {"sentence": "We met at an outdoor cafe near the train station.", "usesVocabulary": ["cafe", "station"]},
            {"sentence": "The stone bridge connects the city center to the quiet suburb.", "usesVocabulary": ["bridge", "center", "suburb"]}
        ],
        "commonUsage": [
            "Asking for locations: Where is a pharmacy near the central hospital?",
            "Giving directions: Turn left at the traffic light on the corner."
        ],
        "commonMistakes": [
            {"wrong": "She went to an hospital.", "right": "She went to a hospital.", "note": "Hospital begins with a consonant 'h' sound, so use 'a'."},
            {"wrong": "There is the new supermarket on my street.", "right": "There is a new supermarket on my street.", "note": "Use 'a' when introducing an unfamiliar or unspecified singular object."}
        ]
    }
]

d9_convs = [
    (
        "Asking for Directions in Town",
        "Tourist Carlos asks local resident Hannah for directions to the museum.",
        ["Carlos", "Hannah"],
        [
            (0, "Excuse me! Is there a pharmacy or a clinic near this street corner?"),
            (1, "Yes, there is a pharmacy right beside the central post office."),
            (0, "Thank you! Also, how can I walk to the national museum?"),
            (1, "Walk straight along this avenue until you reach the main square."),
            (0, "Is the museum near the historic clock tower?"),
            (1, "Yes, it is opposite the tower, next to an Italian restaurant and a cozy cafe."),
            (0, "Is the city center very crowded at this hour?"),
            (1, "The sidewalk can be crowded with pedestrians, but the park nearby is very quiet.")
        ]
    ),
    (
        "Exploring the Neighborhood",
        "New residents Rachel and Simon discuss local amenities in their town.",
        ["Simon", "Rachel"],
        [
            (0, "How do you like living in this new neighborhood so far?"),
            (1, "I love it! There is a fresh bakery and a local market across the road."),
            (0, "Is there a convenient bus stop near our quiet street?"),
            (1, "Yes, the bus stop is on the corner, and the station is just ten minutes away."),
            (0, "Have you seen the bronze statue and the water fountain in the plaza?"),
            (1, "Yes, and behind the square there is a beautiful church and a medieval castle."),
            (0, "What about entertainment? Is there a cinema or a theater nearby?"),
            (1, "There is a modern cinema downtown and a sports stadium outside the city.")
        ]
    ),
    (
        "A Walk Around the Historic Quarter",
        "Tour guide Marco points out architectural sights to visitor Nora.",
        ["Marco", "Nora"],
        [
            (0, "Welcome to the oldest part of our historic European city."),
            (1, "That ancient stone bridge crossing the river is magnificent!"),
            (0, "Notice the royal palace on the hill and the grand mosque beside the water."),
            (1, "Is that tall building downtown a hotel or a bank?"),
            (0, "It is a luxury hotel with views over the entire bustling center."),
            (1, "The pedestrian traffic is quite lively around this crossroad."),
            (0, "Indeed! People enjoy shopping at the supermarket and strolling through the park."),
            (1, "Living in a lively suburb near such history must be wonderful.")
        ]
    )
]

d9_paras = [
    (
        "Life in My Vibrant City",
        "description",
        "Living in a vibrant modern city offers endless convenience and cultural stimulation. Downtown streets are lined with tall office buildings, a prestigious national museum, and a public library. On any sunny afternoon, pedestrians stroll through the central park, relaxing near the stone water fountain and bronze statue. If you need medicine, there is always a pharmacy or local clinic within walking distance. Bustling cafes, bakeries, and restaurants create an inviting atmosphere throughout every city neighborhood."
    ),
    (
        "Navigating the Historic Town Center",
        "narrative",
        "Our historic town was established hundreds of years ago around an imposing royal palace and a fortified castle. Tourists often gather in the cobblestone square to photograph the ancient church and the clock tower overlooking the river. A graceful stone bridge connects the old town to the modern suburb across the water. Visiting the weekly farmers market allows shoppers to purchase fresh fruit before stopping at a sidewalk cafe for hot coffee and conversation."
    ),
    (
        "Urban Transport and Daily Commuting",
        "practical situation",
        "Commuting through a crowded metropolis requires a reliable public transit system. Passengers gather at each bus stop or walk down to the central railway station to board high-speed electric trains. Traffic often builds up near the main crossroad during rush hour, so many residents prefer walking along the wide sidewalk. Whether travelers need to reach the international airport, the football stadium, or a downtown bank, following clear street signs ensures a smooth and timely arrival."
    )
]

generate_day(9, d9_raw, d9_grammar, d9_convs, d9_paras)

# ==========================================
# DAY 10: Getting to Know You
# Grammar: ["Questions with be and do (Review)"]
# ==========================================
d10_raw = [
    ("first name", "/ˌfɜːst ˈneɪm/", "noun", "a personal name given to someone at birth", "My first name is Alexander, but my friends call me Alex.", ["identity"]),
    ("surname", "/ˈsɜː.neɪm/", "noun", "the hereditary name common to all members of a family; last name", "Smith is the most common British surname.", ["identity"]),
    ("full name", "/ˌfʊl ˈneɪm/", "noun", "the complete name of a person, including first, middle, and family names", "Please print your full name on the registration form.", ["identity"]),
    ("nickname", "/ˈnɪk.neɪm/", "noun", "a familiar or humorous name given to a person instead of the real one", "His childhood nickname was Tiger because of his energy.", ["identity"]),
    ("country", "/ˈkʌn.tri/", "noun", "a nation with its own government, occupying a particular territory", "Brazil is a large South American country.", ["geography"]),
    ("nationality", "/ˌnæʃ.ənˈæl.ə.ti/", "noun", "the status of belonging to a particular nation", "Her mother holds dual Canadian and British nationality.", ["identity"]),
    ("hometown", "/ˈhəʊm.taʊn/", "noun", "the town of one's birth or early life", "I always enjoy returning to my quiet seaside hometown.", ["places"]),
    ("birthplace", "/ˈbɜːθ.pleɪs/", "noun", "the place where a person was born", "Stratford-upon-Avon is the historic birthplace of William Shakespeare.", ["places"]),
    ("native language", "/ˌneɪ.tɪv ˈlæŋ.ɡwɪdʒ/", "phrase", "the language of the country that someone was born in; mother tongue", "Arabic is his native language, but he speaks English fluently.", ["language"]),
    ("occupation", "/ˌɒk.jəˈpeɪ.ʃən/", "noun", "a job or profession", "State your current occupation and employer on the form.", ["work"]),
    ("profession", "/prəˈfeʃ.ən/", "noun", "a paid occupation, especially one that involves prolonged training", "Teaching is an honorable and demanding profession.", ["work"]),
    ("job", "/dʒɒb/", "noun", "a paid position of regular employment", "He found an exciting new job at a software company.", ["work"]),
    ("career", "/kəˈrɪər/", "noun", "an occupation undertaken for a significant period of a person's life", "She built a successful international career in architecture.", ["work"]),
    ("student", "/ˈstjuː.dənt/", "noun", "a person who is studying at a school, college, or university", "Over two thousand university students attended the lecture.", ["education"]),
    ("teacher", "/ˈtiː.tʃər/", "noun", "a person who teaches, especially in a school", "Our English teacher explains complex grammar very clearly.", ["education", "work"]),
    ("engineer", "/ˌen.dʒɪˈnɪər/", "noun", "a person who designs, builds, or maintains engines, machines, or structures", "The civil engineer supervised construction of the bridge.", ["work"]),
    ("doctor", "/ˈdɒk.tər/", "noun", "a person who is qualified to treat people who are ill", "Consult a certified medical doctor if your fever persists.", ["work", "health"]),
    ("nurse", "/nɜːs/", "noun", "a person trained to care for the sick or infirm, especially in a hospital", "The kind hospital nurse checked my temperature and pulse.", ["work", "health"]),
    ("manager", "/ˈmæn.ɪ.dʒər/", "noun", "a person responsible for controlling or administering an organization", "The office manager coordinated weekly departmental schedules.", ["work"]),
    ("introduce yourself", "/ˌɪn.trə.djuːs jɔːˈself/", "phrase", "to tell other people your name and background upon meeting", "Stand up and introduce yourself to the class, please.", ["communication"]),
    ("meet", "/miːt/", "verb", "to come into the presence or company of someone by chance or arrangement", "I am delighted to meet you in person at last.", ["communication"]),
    ("greeting", "/ˈɡriː.tɪŋ/", "noun", "a polite word or sign of welcome or recognition", "She welcomed each conference guest with a warm greeting.", ["communication"]),
    ("handshake", "/ˈhænd.ʃeɪk/", "noun", "an act of shaking a person's hand with one's own as a greeting", "A firm professional handshake creates a positive first impression.", ["social"]),
    ("first impression", "/ˌfɜːst ɪmˈpreʃ.ən/", "phrase", "an initial opinion or feeling about someone", "Punctuality and neat dress create a strong first impression.", ["social"]),
    ("conversation partner", "/ˌkɒn.vəˈseɪ.ʃən ˈpɑːt.nər/", "phrase", "a person with whom one engages in dialogue, especially for practice", "Find a conversation partner to improve your spoken fluency.", ["learning"]),
    ("interest", "/ˈɪn.trəst/", "noun", "the feeling of wanting to give your attention to something", "She shares an avid interest in modern world history.", ["mind"]),
    ("favorite", "/ˈfeɪ.vər.ɪt/", "adjective / noun", "preferred to all others of the same kind", "What is your favorite international cuisine?", ["preference"]),
    ("like most", "/laɪk məʊst/", "phrase", "to prefer above all alternatives", "What do you like most about living in this city?", ["preference"]),
    ("dislike", "/dɪsˈlaɪk/", "verb / noun", "to feel distaste for or hostility toward; an aversion", "I dislike waking up before sunrise on cold mornings.", ["preference"]),
    ("prefer", "/prɪˈfɜːr/", "verb", "to like one thing or person better than another", "I prefer drinking green tea rather than black coffee.", ["preference"]),
    ("personality trait", "/ˌpɜː.sənˈæl.ə.ti treɪt/", "phrase", "a characteristic or quality distinguishing a person", "Patience is an admirable personality trait in educators.", ["character"]),
    ("polite", "/pəˈlaɪt/", "adjective", "having or showing behavior that is respectful and considerate of other people", "It is polite to say thank you when receiving assistance.", ["character"]),
    ("rude", "/ruːd/", "adjective", "offensively impolite or bad-mannered", "Interrupting while someone is speaking is very rude.", ["character"]),
    ("shy", "/ʃaɪ/", "adjective", "nervous or timid in the company of other people", "The shy boy hid behind his mother at the party.", ["character"]),
    ("outgoing", "/ˈaʊtˌɡəʊ.ɪŋ/", "adjective", "friendly, energetic, and socially active", "Her outgoing personality helps her make new friends quickly.", ["character"]),
    ("curious", "/ˈkjʊə.ri.əs/", "adjective", "eager to know or learn something", "Curious children ask dozens of thoughtful questions.", ["character"]),
    ("honest", "/ˈɒn.ɪst/", "adjective", "free of deceit and untruthfulness; sincere", "Give an honest answer whenever someone seeks your advice.", ["character"]),
    ("patient", "/ˈpeɪ.ʃənt/", "adjective", "able to accept or tolerate delays, problems, or suffering without becoming annoyed", "A good teacher is patient with every struggling student.", ["character"]),
    ("ambitious", "/æmˈbɪʃ.əs/", "adjective", "having or showing a strong desire and determination to succeed", "Ambitious young professionals set ambitious career goals.", ["character"]),
    ("background", "/ˈbæk.ɡraʊnd/", "noun", "a person's social heritage, education, and previous experience", "Our team includes specialists from diverse cultural backgrounds.", ["identity"]),
    ("experience", "/ɪkˈspɪə.ri.əns/", "noun", "practical contact with and observation of facts or events", "She gained valuable experience working in healthcare.", ["work", "life"]),
    ("goal", "/ɡəʊl/", "noun", "an aim, desired result, or objective", "My main goal is to speak English fluently in ninety days.", ["ambition"]),
    ("dream", "/driːm/", "noun", "a cherished aspiration, ambition, or ideal", "His lifelong dream is to open a family bakery.", ["ambition"]),
    ("reason", "/ˈriː.zən/", "noun", "a cause, explanation, or justification for an action or event", "What is your main reason for studying the English language?", ["mind"]),
    ("pleasure", "/ˈpleʒ.ər/", "noun", "a feeling of happy satisfaction and enjoyment", "It is a genuine pleasure to meet your family at last.", ["social"]),
    ("nice to meet you", "/naɪs tə miːt juː/", "phrase", "a polite greeting used when meeting someone for the first time", "Hello Mr. Davis, it is very nice to meet you.", ["greeting"]),
    ("where are you from", "/weər ɑː juː frɒm/", "phrase", "a question used to ask someone their place of origin or nationality", "Excuse me, where are you from originally?", ["question"]),
    ("what do you do", "/wɒt duː juː duː/", "phrase", "a question used to ask about someone's job or occupation", "So tell me, what do you do for a living?", ["question"]),
    ("tell me about yourself", "/tel miː əˈbaʊt jɔːˌself/", "phrase", "a prompt asking someone to describe their background and character", "Please tell me about yourself during this interview.", ["communication"]),
    ("welcome", "/ˈwel.kəm/", "noun / verb / exclamation", "an instance of greeting someone gladly; gladly received", "We offer a warm welcome to our international guests.", ["greeting"])
]

d10_grammar = [
    {
        "title": "Questions with be and do (Review)",
        "explanation": "To ask questions in English, use the verb 'be' (Am / Is / Are) for identity, feelings, location, and origin: 'Are you a student?', 'Where are you from?'. Use auxiliary 'do' or 'does' for habits, actions, and occupations with main verbs: 'What do you do?', 'Where do you live?', 'Does he speak English?'.",
        "structures": [
            {"pattern": "Be + subject + adjective / noun / origin ...?", "label": "Questions with be"},
            {"pattern": "Do / Does + subject + base verb ...?", "label": "Questions with do"},
            {"pattern": "Question word + be / do + subject ...?", "label": "Wh- Questions"}
        ],
        "examples": [
            {"sentence": "Where are you from, and what is your hometown?", "usesVocabulary": ["where are you from", "hometown"]},
            {"sentence": "What do you do, and are you an engineer or a doctor?", "usesVocabulary": ["what do you do", "engineer", "doctor"]},
            {"sentence": "Nice to meet you! Tell me about yourself and your career goal.", "usesVocabulary": ["nice to meet you", "tell me about yourself", "career", "goal"]}
        ],
        "commonUsage": [
            "First encounters: Hello, what is your full name and occupation?",
            "Asking about origins: Are you from a big city or a small village?"
        ],
        "commonMistakes": [
            {"wrong": "Where you live?", "right": "Where do you live?", "note": "Present simple action questions require the auxiliary verb 'do'."},
            {"wrong": "Do you a teacher?", "right": "Are you a teacher?", "note": "Use the verb 'be' when questioning a person's profession or status."}
        ]
    }
]

d10_convs = [
    (
        "First Day at Language Class",
        "Students Emma and Tariq introduce themselves before their English lesson starts.",
        ["Tariq", "Emma"],
        [
            (0, "Hello! My first name is Tariq and my surname is Mansoor. What is your name?"),
            (1, "Hi Tariq! Nice to meet you. My full name is Emma Watson, but my nickname is Em."),
            (0, "Where are you from originally, Emma?"),
            (1, "I am from Canada. My hometown is Vancouver. What about you?"),
            (0, "My country is Jordan, and my native language is Arabic."),
            (1, "What do you do for work? Are you a student or do you have a job?"),
            (0, "I am a civil engineer, but I am studying English to advance my professional career."),
            (1, "That is great! Welcome to class. Let us be conversation partners.")
        ]
    ),
    (
        "Networking at a Business Conference",
        "Professionals David and Sandra meet during an afternoon coffee break.",
        ["Sandra", "David"],
        [
            (0, "Good afternoon. It is a pleasure to meet you. Let me introduce myself."),
            (1, "A pleasure to meet you too! I always appreciate a warm greeting and firm handshake."),
            (0, "Please tell me about yourself and what profession you work in."),
            (1, "I work as an IT manager, and my colleague is a hospital doctor."),
            (0, "What is your main reason for attending this conference today?"),
            (1, "My goal is to gain practical experience and network with ambitious peers."),
            (0, "First impressions are very important in our industry."),
            (1, "Indeed. Being honest, polite, and patient always builds lasting partnerships.")
        ]
    ),
    (
        "Getting to Know a Roommate",
        "New flatmates Lucas and Nathan chat about their backgrounds and interests.",
        ["Nathan", "Lucas"],
        [
            (0, "Welcome to the flat, Lucas! Let us talk about our habits and interests."),
            (1, "Thank you, Nathan. What kind of personality traits do you have?"),
            (0, "I am quite outgoing and curious, but I am also quiet when people are studying."),
            (1, "I am a bit shy at first, but I prefer a tidy and peaceful living space."),
            (0, "What is your favorite leisure activity? Do you dislike cooking?"),
            (1, "I like most home-cooked food, and I dream of becoming a master chef."),
            (0, "That is fantastic! My occupation is a high school teacher, so I read often."),
            (1, "We will get along very well. It is wonderful to share this flat with you.")
        ]
    )
]

d10_paras = [
    (
        "First Meetings and Introductions",
        "daily-life description",
        "Meeting new people in an international setting requires courtesy and clear communication. When you introduce yourself, state your full name and your hometown or country of origin. A warm smile and a polite handshake make a favorable first impression on any conversation partner. Asking friendly questions such as where are you from and what do you do shows genuine interest in other human beings. Taking time to listen attentively builds mutual trust and lasting friendships."
    ),
    (
        "My Personal Background and Aspirations",
        "personal story",
        "Allow me to tell me about yourself by sharing my personal journey. My native language is Spanish, and my birthplace is a quiet coastal town in Mexico. Currently, my occupation is a hospital nurse, but my long-term career goal is to become a qualified medical doctor. To achieve this dream, I am dedicated to improving my English skills every single day. I consider myself an honest, patient, and ambitious student who welcomes every educational challenge."
    ),
    (
        "Understanding Different Personalities",
        "opinion paragraph",
        "Every human being possesses a unique blend of personal personality traits, values, and cultural experience. An outgoing person naturally enjoys lively social gatherings, while a shy individual may prefer quiet one-on-one conversations in a smaller setting. Whether someone is curious about scientific research, passionate about teaching as a profession, or focused on technical software engineering, mutual respect is always essential. When colleagues remain polite rather than rude, diverse teams collaborate effectively and achieve extraordinary collective results."
    )
]

generate_day(10, d10_raw, d10_grammar, d10_convs, d10_paras)
