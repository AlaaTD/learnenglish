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

def create_stage_day(day_num, raw_vocab, grammar, conv_specs, para_specs):
    vocab = build_vocab(raw_vocab)
    check_no_dupes(vocab, day_num)
    
    convs = [make_conversation(c[0], c[1], c[2], c[3]) for c in conv_specs]
    paras = [make_paragraph(p[0], p[1], p[2]) for p in para_specs]
    
    hws = [v["headword"] for v in vocab]
    convs = link_vocab(convs, hws)
    paras = link_vocab(paras, hws)
    
    write_day(day_num, vocab, grammar, convs, paras)
    print(f"Day {day_num} successfully built!")

# =============================================================
# DAY 11: Right Now or Every Day?
# Grammar: ["Present Simple vs Present Continuous"]
# =============================================================
d11_raw = [
    ("right now", "/raɪt naʊ/", "phrase", "at this exact moment in time", "I am studying English right now at my desk.", ["time"]),
    ("at the moment", "/ət ðə ˈməʊ.mənt/", "phrase", "at the present time; currently", "She is living with her sister at the moment.", ["time"]),
    ("currently", "/ˈkʌr.ənt.li/", "adverb", "at the present time", "He is currently working on a major engineering project.", ["time"]),
    ("nowadays", "/ˈnaʊ.ə.deɪz/", "adverb", "at the present time, in comparison with the past", "Nowadays, many professionals work remotely from home.", ["time"]),
    ("temporary", "/ˈtem.prər.i/", "adjective", "lasting for only a limited period of time; not permanent", "This small rented room is only a temporary arrangement.", ["state"]),
    ("permanent", "/ˈpɜː.mə.nənt/", "adjective", "lasting or intended to last indefinitely without change", "She finally secured a permanent position at the hospital.", ["state"]),
    ("standing", "/ˈstæn.dɪŋ/", "verb / adjective", "remaining on one's feet in an upright position", "The teacher is standing near the whiteboard.", ["action"]),
    ("sitting", "/ˈsɪt.ɪŋ/", "verb / adjective", "resting on one's buttocks with the weight supported", "We are sitting around the coffee table.", ["action"]),
    ("holding", "/ˈhəʊl.dɪŋ/", "verb", "grasping or carrying something in your hand", "The traveler is holding a leather passport case.", ["action"]),
    ("carrying", "/ˈkær.i.ɪŋ/", "verb", "supporting and moving someone or something from one place to another", "She is carrying a heavy cardboard box upstairs.", ["action"]),
    ("waiting", "/ˈweɪ.tɪŋ/", "verb", "staying in a place until an expected event happens", "Commuters are waiting at the central bus stop.", ["action"]),
    ("wearing", "/ˈweə.rɪŋ/", "verb", "having clothing, jewelry, or footwear on one's body", "He is wearing a warm woolen coat today.", ["action"]),
    ("listening", "/ˈlɪs.nɪŋ/", "verb", "paying attention to sound or speech", "Students are listening carefully to the audio lesson.", ["action"]),
    ("watching", "/ˈwɒtʃ.ɪŋ/", "verb", "looking at someone or something for an amount of time", "The family is watching an entertaining comedy film.", ["action"]),
    ("shining", "/ˈʃaɪ.nɪŋ/", "verb", "giving out or reflecting bright light", "The bright sun is shining through the bedroom window.", ["nature"]),
    ("raining", "/ˈreɪ.nɪŋ/", "verb", "falling as water droplets from clouds in the sky", "It is raining heavily outside, so take an umbrella.", ["weather"]),
    ("blowing", "/ˈbləʊ.ɪŋ/", "verb", "moving air created by the wind", "A cool autumn wind is blowing through the garden.", ["weather"]),
    ("ringing", "/ˈrɪŋ.ɪŋ/", "verb", "making a clear resonant sound, as a bell or telephone", "The office telephone is ringing loudly on the desk.", ["action"]),
    ("happening", "/ˈhæp.ən.ɪŋ/", "verb", "taking place or occurring", "What is happening outside in the street?", ["action"]),
    ("changing", "/ˈtʃeɪn.dʒɪŋ/", "verb", "becoming different or making something different", "The autumn weather is changing rapidly this week.", ["action"]),
    ("improving", "/ɪmˈpruː.vɪŋ/", "verb", "becoming or making something better in quality", "Her English pronunciation is improving every day.", ["progress"]),
    ("developing", "/dɪˈvel.ə.pɪŋ/", "verb", "growing or causing something to grow and become more advanced", "The student is developing strong communication skills.", ["progress"]),
    ("increasing", "/ɪnˈkriː.sɪŋ/", "verb", "becoming greater in size, amount, or degree", "The population of our city is increasing rapidly.", ["progress"]),
    ("decreasing", "/dɪˈkriː.sɪŋ/", "verb", "becoming smaller or fewer in size or number", "Winter temperatures are decreasing sharply tonight.", ["progress"]),
    ("falling", "/ˈfɔː.lɪŋ/", "verb", "moving downward, typically rapidly and freely without control", "Golden leaves are falling from the park trees.", ["action"]),
    ("rising", "/ˈraɪ.zɪŋ/", "verb", "moving upward or increasing in level or height", "The morning sun is rising over the hills.", ["action"]),
    ("moving", "/ˈmuː.vɪŋ/", "verb", "changing position or causing something to change position", "The train is moving smoothly along the tracks.", ["action"]),
    ("stopping", "/ˈstɒp.ɪŋ/", "verb", "coming to an end or causing something to come to an end", "The red bus is stopping at the corner.", ["action"]),
    ("preparing", "/prɪˈpeə.rɪŋ/", "verb", "making something ready for use or consideration", "The chef is preparing a delicious evening meal.", ["action"]),
    ("creating", "/kriˈeɪ.tɪŋ/", "verb", "bringing something into existence through skill or imagination", "The artist is creating a colorful oil painting.", ["action"]),
    ("checking", "/ˈtʃek.ɪŋ/", "verb", "examining something in order to determine its accuracy", "He is checking his email messages on his laptop.", ["action"]),
    ("sending", "/ˈsend.ɪŋ/", "verb", "causing to go or be taken to a particular destination", "I am sending a short text message to my brother.", ["action"]),
    ("receiving", "/rɪˈsiː.vɪŋ/", "verb", "getting or being given something provided or sent", "She is receiving congratulations from her colleagues.", ["action"]),
    ("calling", "/ˈkɔː.lɪŋ/", "verb", "telephoning someone, or crying out in a loud voice", "My mother is calling me from the kitchen.", ["action"]),
    ("resting", "/ˈrest.ɪŋ/", "verb", "ceasing work or movement in order to relax or sleep", "Father is resting peacefully on the comfortable sofa.", ["action"]),
    ("feeling", "/ˈfiː.lɪŋ/", "verb", "experiencing an emotion or physical sensation", "I am feeling energetic and cheerful this morning.", ["state"]),
    ("thinking", "/ˈθɪŋ.kɪŋ/", "verb", "using one's mind actively to form ideas or opinions", "She is thinking about her upcoming exam.", ["mental"]),
    ("wondering", "/ˈwʌn.dər.ɪŋ/", "verb", "desiring to know something; feeling curiosity", "We are wondering where the missing cat went.", ["mental"]),
    ("hoping", "/ˈhəʊ.pɪŋ/", "verb", "wanting something to happen and thinking that it could", "They are hoping for sunny weather this weekend.", ["mental"]),
    ("believing", "/bɪˈliː.vɪŋ/", "verb", "accepting that something is true or real", "She is believing in her potential to succeed.", ["mental"]),
    ("daily habit", "/ˌdeɪ.li ˈhæb.ɪt/", "phrase", "a settled or regular tendency done each day", "Drinking herbal tea is a healthy daily habit.", ["habit"]),
    ("regular routine", "/ˌreɡ.jə.lər ruːˈtiːn/", "phrase", "a customary or established way of doing things", "Her regular routine includes a morning walk.", ["habit"]),
    ("in progress", "/ɪn ˈprəʊ.ɡres/", "phrase", "currently taking place; under way", "Renovations on the museum building are in progress.", ["state"]),
    ("at present", "/ət ˈprez.ənt/", "phrase", "at the present time; now", "At present, the director is busy in a meeting.", ["time"]),
    ("these days", "/ðiːz deɪz/", "phrase", "in the present period; nowadays", "These days, more people cycle than drive in town.", ["time"]),
    ("right away", "/raɪt əˈweɪ/", "phrase", "immediately; without delay", "Please reply to the urgent email right away.", ["time"]),
    ("habitual", "/həˈbɪtʃ.u.əl/", "adjective", "done constantly or as a habit; regular", "Late sleeping is his habitual weekend pattern.", ["quality"]),
    ("continuous", "/kənˈtɪn.ju.əs/", "adjective", "forming an unbroken whole; without interruption", "There was a continuous stream of traffic.", ["grammar"]),
    ("interrupted", "/ˌɪn.təˈrʌp.tɪd/", "adjective", "stopped from continuing by something unexpected", "His concentration was interrupted by the telephone.", ["state"]),
    ("progressing", "/prəˈɡres.ɪŋ/", "verb", "developing or moving forward gradually toward a goal", "The language students are progressing nicely.", ["progress"])
]

d11_grammar = [
    {
        "title": "Present Simple vs Present Continuous",
        "explanation": "Use the Present Simple for habits, daily routines, facts, and permanent situations: 'I walk to work every day.' Use the Present Continuous (be + verb-ing) for actions happening right now, temporary situations, and ongoing trends: 'I am walking right now because it is sunny.'",
        "structures": [
            {"pattern": "Present Simple: Subject + base verb (+ -s for he/she/it)", "label": "Habits & Routines"},
            {"pattern": "Present Continuous: Subject + am/is/are + verb-ing", "label": "Actions Happening Now"},
            {"pattern": "Time markers: every day / usually VS right now / at the moment", "label": "Comparison"}
        ],
        "examples": [
            {"sentence": "I usually work at the office, but currently I am working from home.", "usesVocabulary": ["currently"]},
            {"sentence": "She is wearing a raincoat right now because it is raining heavily.", "usesVocabulary": ["wearing", "right now", "raining"]},
            {"sentence": "The train is moving fast at the moment.", "usesVocabulary": ["moving", "at the moment"]}
        ],
        "commonUsage": [
            "Contrasting routines with current actions: Normally I drink tea, but today I am drinking coffee.",
            "Describing changing situations: English learners are improving their skills these days."
        ],
        "commonMistakes": [
            {"wrong": "I am knowing the answer right now.", "right": "I know the answer right now.", "note": "Stative verbs like know, understand, and like are rarely used in the continuous form."},
            {"wrong": "Look, it rains outside!", "right": "Look, it is raining outside!", "note": "Use the Present Continuous for an action observable at this exact moment."}
        ]
    }
]

d11_convs = [
    (
        "Busy at the Office Desk",
        "Colleagues Liam and Sophia discuss their current tasks.",
        ["Liam", "Sophia"],
        [
            (0, "Hi Sophia! What are you doing right now at your desk?"),
            (1, "I am checking incoming emails and sending monthly reports to the manager."),
            (0, "Is the director waiting for the financial spreadsheet at the moment?"),
            (1, "Yes, he is currently standing near the printer and holding the files."),
            (0, "Our regular routine is usually calmer on Tuesday mornings."),
            (1, "True, but nowadays workload is increasing because our client base is growing."),
            (0, "I am feeling quite energetic today, so I can assist you with typing."),
            (1, "Thank you Liam! I am hoping we finish before the telephone starts ringing again.")
        ]
    ),
    (
        "Checking on the Weather",
        "Oliver calls his sister Mia to ask about current conditions.",
        ["Mia", "Oliver"],
        [
            (0, "Hello Oliver! Are you walking home from the university right now?"),
            (1, "I was walking, but I am sitting inside a cafe at present because it is raining."),
            (0, "A cold wind is blowing in our neighborhood, and temperatures are falling."),
            (1, "Yes, dark clouds are moving rapidly across the sky, and rain is falling heavily."),
            (0, "Are you wearing your thick winter jacket and carrying an umbrella?"),
            (1, "I am wearing my coat, but I forgot my umbrella in my temporary locker."),
            (0, "Stay inside until the rain is stopping. Father is preparing dinner right away."),
            (1, "Good idea. I am resting with hot cocoa while watching pedestrians hurry by.")
        ]
    ),
    (
        "Reflecting on Life Changes",
        "Emma and Lucas chat in a quiet park during a lunch break.",
        ["Emma", "Lucas"],
        [
            (0, "Have you noticed how our town is changing these days?"),
            (1, "Yes, urban development is in progress everywhere and new housing is rising."),
            (0, "I am thinking about finding a permanent apartment near the city center."),
            (1, "Are you still living in that temporary shared flat with your cousin?"),
            (0, "Yes, but I am wondering if rental prices are decreasing or stabilizing."),
            (1, "Public transit is definitely improving, so commuting is becoming much easier."),
            (0, "I am believing that learning English is helping me build a stronger career."),
            (1, "You are progressing wonderfully, Emma. Hard work always brings great rewards.")
        ]
    )
]

d11_paras = [
    (
        "Everyday Routines Versus Current Actions",
        "daily-life description",
        "Distinguishing between routine habits and current actions is fundamental in English. Under normal conditions, my regular routine begins early: I drink tea, review notes, and walk to work. However, right now at the moment, I am sitting inside a library because it is raining outside and the wind is blowing. Through the window, I can see pedestrians carrying umbrellas and commuters waiting at the bus stop. Temporary events require the continuous tense, whereas habitual activities use the simple present."
    ),
    (
        "A Changing Workplace",
        "opinion paragraph",
        "Nowadays, modern workplace practices are developing and changing in remarkable ways across the globe. Currently, millions of professionals are working remotely from home and sending digital messages across international borders in seconds. Electronic communication is increasing rapidly, while paper paperwork is steadily decreasing. Although some employees find this continuous digital shift challenging, many believe it provides greater personal flexibility. Organizations are currently creating flexible hybrid schedules that allow employees to balance intense projects with quiet hours of resting."
    ),
    (
        "Personal Growth and Improvement",
        "personal story",
        "Learning a language is an exciting journey that is always in progress. At present, I am dedicating two hours every evening to studying grammar and listening to foreign dialogues. I am feeling much more confident, and my vocabulary is improving with every single lesson. When I am sitting on the train, I find myself thinking in English and wondering about new idioms. With continuous practice, my skills are progressing nicely, and I am hoping to achieve complete fluency."
    )
]

create_stage_day(11, d11_raw, d11_grammar, d11_convs, d11_paras)
