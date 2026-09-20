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
# DAY 6: My Week
# Grammar: ["Adverbs of Frequency"]
# ==========================================
d6_raw = [
    ("Monday", "/ˈmʌn.deɪ/", "noun", "the first day of the working week", "I start my work week on Monday morning.", ["calendar", "week"]),
    ("Tuesday", "/ˈtjuːz.deɪ/", "noun", "the day of the week between Monday and Wednesday", "We have our team meeting every Tuesday.", ["calendar", "week"]),
    ("Wednesday", "/ˈwenz.deɪ/", "noun", "the day of the week between Tuesday and Thursday", "Wednesday is the middle of the working week.", ["calendar", "week"]),
    ("Thursday", "/ˈθɜːz.deɪ/", "noun", "the day of the week between Wednesday and Friday", "I attend an evening English class on Thursday.", ["calendar", "week"]),
    ("Friday", "/ˈfraɪ.deɪ/", "noun", "the day of the week between Thursday and Saturday", "People feel cheerful on Friday afternoon.", ["calendar", "week"]),
    ("Saturday", "/ˈsæt.ə.deɪ/", "noun", "the day of the week between Friday and Sunday", "On Saturday, we visit local farmers markets.", ["calendar", "weekend"]),
    ("Sunday", "/ˈsʌn.deɪ/", "noun", "the day of the week between Saturday and Monday", "Sunday is a day of rest and family dinners.", ["calendar", "weekend"]),
    ("weekend", "/ˌwiːkˈend/", "noun", "Saturday and Sunday combined", "What are your plans for the coming weekend?", ["time"]),
    ("weekday", "/ˈwiːk.deɪ/", "noun", "any day of the week except Saturday and Sunday", "I wake up earlier on a normal weekday.", ["time"]),
    ("often", "/ˈɒf.n/", "adverb", "frequently; many times", "We often go for long walks in the park.", ["frequency"]),
    ("rarely", "/ˈreə.li/", "adverb", "not often; seldom", "He rarely eats fast food because he prefers cooking.", ["frequency"]),
    ("seldom", "/ˈsel.dəm/", "adverb", "almost never", "They seldom stay out past nine in the evening.", ["frequency"]),
    ("hardly ever", "/ˈhɑːd.li ˈev.ər/", "phrase", "almost never; very infrequently", "She hardly ever watches action movies on television.", ["frequency"]),
    ("regularly", "/ˈreɡ.jə.lə.li/", "adverb", "with a constant frequency or repetition", "Exercise regularly to maintain good physical health.", ["frequency"]),
    ("frequently", "/ˈfriː.kwənt.li/", "adverb", "happening at short intervals; often", "Trains frequently depart from this central station.", ["frequency"]),
    ("occasionally", "/əˈkeɪ.ʒən.əl.i/", "adverb", "sometimes but not often", "We occasionally dine at fancy restaurants.", ["frequency"]),
    ("hobby", "/ˈhɒb.i/", "noun", "an activity done regularly in one's leisure time for pleasure", "Photography is his favorite creative hobby.", ["leisure"]),
    ("pastime", "/ˈpɑːs.taɪm/", "noun", "an activity that someone does regularly for enjoyment", "Reading novels is a popular quiet pastime.", ["leisure"]),
    ("leisure", "/ˈleʒ.ər/", "noun", "time when one is not working or occupied; free time", "How do you spend your weekend leisure hours?", ["time", "leisure"]),
    ("activity", "/ækˈtɪv.ə.ti/", "noun", "a thing that a person or group does or has done", "Outdoor activities keep children energetic and happy.", ["action"]),
    ("plan", "/plæn/", "noun", "a detailed proposal for doing or achieving something", "Do you have any definite plan for tomorrow?", ["time"]),
    ("schedule", "/ˈʃedʒ.uːl/", "noun", "a plan that gives expected times for different events", "My busy work schedule leaves little free time.", ["time"]),
    ("routine task", "/ruːˈtiːn tɑːsk/", "phrase", "a regular chore or duty done frequently", "Sorting invoices is a daily routine task.", ["work"]),
    ("chore", "/tʃɔːr/", "noun", "a routine task, especially a household one", "Doing laundry and washing floors are boring chores.", ["home"]),
    ("clean up", "/kliːn ʌp/", "phrasal verb", "to make a place neat and tidy", "Let us clean up the kitchen after breakfast.", ["action"]),
    ("vacuum", "/ˈvæk.juːm/", "verb", "to clean with a vacuum cleaner", "I vacuum the living room carpet every Saturday.", ["home", "cleaning"]),
    ("mop", "/mɒp/", "verb", "to clean or soak up liquid with a mop", "She mopped the kitchen tiles until they shone.", ["home", "cleaning"]),
    ("iron", "/ˈaɪən/", "verb", "to smooth clothes with a heated flat iron", "He irons his work shirts on Sunday evening.", ["clothing", "chores"]),
    ("dust", "/dʌst/", "verb", "to wipe dust from the surface of furniture", "Please dust the bookshelves in the living room.", ["home", "cleaning"]),
    ("exercise", "/ˈek.sə.saɪz/", "verb / noun", "physical activity that you do to make your body strong", "I exercise thirty minutes every morning.", ["health"]),
    ("workout", "/ˈwɜːk.aʊt/", "noun", "a session of vigorous physical exercise or training", "He finished an intense gym workout before breakfast.", ["health"]),
    ("jog", "/dʒɒɡ/", "verb", "to run at a steady, gentle pace", "We jog through the quiet park on Saturdays.", ["health", "sport"]),
    ("swim", "/swɪm/", "verb", "to move through water by moving your arms and legs", "She swims fifty laps in the heated pool.", ["sport"]),
    ("cycle", "/ˈsaɪ.kl/", "verb", "to ride a bicycle", "Many people cycle to work in European cities.", ["transport", "sport"]),
    ("read", "/riːd/", "verb", "to look at and understand the meaning of written words", "I read two chapters of my book every night.", ["hobby"]),
    ("paint", "/peɪnt/", "verb", "to produce a picture using colors and brushes", "My sister paints landscape watercolors in her studio.", ["art", "hobby"]),
    ("draw", "/drɔː/", "verb", "to produce a picture by making lines on paper", "Children love to draw animals with colored pencils.", ["art", "hobby"]),
    ("listen to music", "/ˈlɪs.n tə ˈmjuː.zɪk/", "phrase", "to pay attention to sounds of melody and song", "I relax on the sofa and listen to music.", ["leisure"]),
    ("play games", "/pleɪ ɡeɪmz/", "phrase", "to take part in board games or video games", "We play board games together on Friday nights.", ["leisure"]),
    ("hang out", "/hæŋ aʊt/", "phrasal verb", "to spend time relaxing or socializing informally", "Teens like to hang out at the shopping center.", ["social"]),
    ("visit friends", "/ˈvɪz.ɪt frendz/", "phrase", "to go see friends at their home", "We visit friends in the countryside on holidays.", ["social"]),
    ("stay in", "/steɪ ɪn/", "phrasal verb", "to remain at home rather than go out", "It is raining, so let us stay in tonight.", ["leisure"]),
    ("go out", "/ɡəʊ aʊt/", "phrasal verb", "to leave home to attend an event or socialize", "Young people often go out on Saturday night.", ["social"]),
    ("take a break", "/teɪk ə breɪk/", "phrase", "to stop working for a short period of rest", "Take a break and drink some water.", ["rest"]),
    ("nap", "/næp/", "noun / verb", "a short sleep, especially during the day", "A twenty-minute afternoon nap restores energy.", ["rest"]),
    ("busy week", "/ˈbɪz.i wiːk/", "phrase", "a seven-day period with many duties and activities", "I had a busy week with three major deadlines.", ["time"]),
    ("free time", "/friː taɪm/", "phrase", "time not spent working; leisure", "What do you enjoy doing in your free time?", ["time"]),
    ("day off", "/deɪ ɒf/", "noun", "a day when you do not have to work", "Monday is my day off, so I will sleep late.", ["time", "work"]),
    ("midweek", "/ˌmɪdˈwiːk/", "noun", "the middle of the week, especially Wednesday", "Let us schedule the team call for midweek.", ["time"]),
    ("lifestyle", "/ˈlaɪf.staɪl/", "noun", "the way in which a person or group lives", "A balanced lifestyle includes both work and rest.", ["general"])
]

d6_grammar = [
    {
        "title": "Adverbs of Frequency",
        "explanation": "Adverbs of frequency describe how often an event happens: always (100%), usually (80%), frequently/often (60%), sometimes/occasionally (40%), rarely/seldom (10%), and never (0%). They go before main verbs, but after the verb 'be'.",
        "structures": [
            {"pattern": "Subject + adverb of frequency + main verb", "label": "Standard Placement"},
            {"pattern": "Subject + be + adverb of frequency", "label": "With Verb 'be'"}
        ],
        "examples": [
            {"sentence": "I regularly exercise on Monday and Thursday.", "usesVocabulary": ["regularly", "exercise", "Monday", "Thursday"]},
            {"sentence": "We often visit friends during the weekend.", "usesVocabulary": ["often", "visit friends", "weekend"]},
            {"sentence": "She rarely stays in on Saturday night.", "usesVocabulary": ["rarely", "stay in", "Saturday"]},
            {"sentence": "They seldom clean up the garage on a weekday.", "usesVocabulary": ["seldom", "clean up", "weekday"]}
        ],
        "commonUsage": [
            "Describing habits: I frequently cycle to the library.",
            "Describing leisure: On Friday, we occasionally play games."
        ],
        "commonMistakes": [
            {"wrong": "I go often to the gym.", "right": "I often go to the gym.", "note": "Place adverbs of frequency before the main verb."},
            {"wrong": "She is never rarely tired.", "right": "She is rarely tired.", "note": "Do not combine two negative adverbs."}
        ]
    }
]

d6_convs = [
    (
        "Comparing Weekly Schedules",
        "Sophie and Daniel discuss their weekly habits over coffee.",
        ["Daniel", "Sophie"],
        [
            (0, "How does your typical Monday to Friday work schedule look?"),
            (1, "Monday and Tuesday are very busy, but Wednesday is my day off."),
            (0, "What do you regularly do in your free time on that day off?"),
            (1, "I clean up my apartment, do every household chore, and vacuum the floors."),
            (0, "Do you exercise or workout during the weekday?"),
            (1, "I jog in the park on Thursday and swim at the sports center on Friday."),
            (0, "That is an active lifestyle. I rarely find time to cycle during weekdays."),
            (1, "You should take a break occasionally and make a balanced plan.")
        ]
    ),
    (
        "Weekend Leisure Activities",
        "Lucas and Maya plan what to do on Saturday and Sunday.",
        ["Maya", "Lucas"],
        [
            (0, "Do you want to go out this Saturday or stay in?"),
            (1, "I had a very busy week, so I prefer to stay in and take a nap."),
            (0, "We could listen to music, read a novel, or play games together."),
            (1, "That sounds like a relaxing pastime. We can also visit friends on Sunday."),
            (0, "Yes! Sunday is perfect to hang out with friends in the afternoon."),
            (1, "We seldom get to chat with everyone during the normal workweek."),
            (0, "I will iron my clothes and mop the kitchen floor before we leave."),
            (1, "Great plan. Let us enjoy our leisure time this weekend.")
        ]
    ),
    (
        "Creative Hobbies",
        "Elena and Alex share their favorite artistic hobbies.",
        ["Alex", "Elena"],
        [
            (0, "What is your favorite creative hobby outside of work?"),
            (1, "I often paint watercolors, and my sister likes to draw portraits."),
            (0, "How frequently do you paint in your studio?"),
            (1, "I paint on Tuesday and Friday, right after I finish my work routine task."),
            (0, "I hardly ever paint, but I frequently read books about art history."),
            (1, "Artistic activity provides wonderful relief after a demanding week."),
            (0, "True. Midweek stress disappears as soon as you focus on a craft."),
            (1, "Exactly! Having a creative pastime makes daily life much richer.")
        ]
    )
]

d6_paras = [
    (
        "My Weekly Routine and Chores",
        "daily-life description",
        "My weekly schedule follows a clear rhythm from Monday to Sunday. On every weekday, I wake up early, exercise for twenty minutes, and complete each essential routine task. Wednesday marks the quiet midweek point when I take a break and review my schedule. On Friday evening, I clean up the flat: I vacuum the carpet, mop the kitchen floor, and iron my shirts for the following week. Saturday is reserved for outdoor activities like a gentle jog or a refreshing swim."
    ),
    (
        "How I Spend My Free Time",
        "personal story",
        "Having quality free time allows me to pursue my favorite creative hobby. During the weekend, I often paint landscape scenes or draw sketches in my studio. Sometimes I sit in an armchair to listen to music or read an inspiring book. I rarely go out to noisy clubs; instead, I prefer to stay in, take a short afternoon nap, or play games with close companions. A calm lifestyle brings peace after a demanding, busy week."
    ),
    (
        "Socializing on Weekends",
        "narrative",
        "Sunday is our favorite day of the week because we regularly visit friends and family members. We frequently gather in a sunny garden to share a delicious meal, chat about our weekly events, and hang out together without rushing. My brother hardly ever misses these happy family lunches. We seldom discuss difficult office problems during these pleasant leisure hours. Instead, we plan future holidays, celebrate simple pleasures, take a short afternoon nap, and recharge our spirits before another busy Monday arrives at dawn."
    )
]

generate_day(6, d6_raw, d6_grammar, d6_convs, d6_paras)

# ==========================================
# DAY 7: Telling the Time
# Grammar: ["Prepositions of Time (at, on, in)"]
# ==========================================
d7_raw = [
    ("minute", "/ˈmɪn.ɪt/", "noun", "a period of time equal to sixty seconds", "Wait for me for one minute, please.", ["time"]),
    ("second", "/ˈsek.ənd/", "noun", "the basic unit of time; one sixtieth of a minute", "The race finished in under ten seconds.", ["time"]),
    ("hour", "/aʊər/", "noun", "a period of time equal to sixty minutes", "The journey takes one hour by train.", ["time"]),
    ("quarter past", "/ˈkwɔː.tər pɑːst/", "phrase", "fifteen minutes after a specified hour", "Our train departs at quarter past eight.", ["time"]),
    ("quarter to", "/ˈkwɔː.tər tuː/", "phrase", "fifteen minutes before a specified hour", "The movie starts at quarter to seven.", ["time"]),
    ("noon", "/nuːn/", "noun", "twelve o'clock in the middle of the day; midday", "The cafeteria opens for lunch at noon.", ["time"]),
    ("midday", "/ˌmɪdˈdeɪ/", "noun", "the middle of the day; twelve o'clock", "The summer sun is hottest at midday.", ["time"]),
    ("midnight", "/ˈmɪd.naɪt/", "noun", "twelve o'clock at night", "The fireworks illuminated the sky at midnight.", ["time"]),
    ("dawn", "/dɔːn/", "noun", "the first appearance of light in the sky before sunrise", "Farmers wake up before dawn to tend cattle.", ["nature", "time"]),
    ("dusk", "/dʌsk/", "noun", "the darker stage of twilight in the evening", "Streetlamps illuminate automatically at dusk.", ["nature", "time"]),
    ("sunrise", "/ˈsʌn.raɪz/", "noun", "the time in the morning when the sun first appears", "Watching the sunrise over the ocean is breathtaking.", ["nature", "time"]),
    ("sunset", "/ˈsʌn.set/", "noun", "the time in the evening when the sun disappears", "We watched a beautiful golden sunset from the hill.", ["nature", "time"]),
    ("calendar", "/ˈkæl.ən.dər/", "noun", "a chart showing the days, weeks, and months of a year", "Mark the doctor appointment on the wall calendar.", ["time"]),
    ("appointment", "/əˈpɔɪnt.mənt/", "noun", "an arrangement to meet someone at a particular time", "I have an important dentist appointment at three.", ["schedule"]),
    ("meeting", "/ˈmiː.tɪŋ/", "noun", "an assembly of people for discussion or entertainment", "The business meeting lasted for forty minutes.", ["work"]),
    ("deadline", "/ˈded.laɪn/", "noun", "the latest time or date by which something should be completed", "The project deadline is Friday at five o'clock.", ["work", "time"]),
    ("punctual", "/ˈpʌŋk.tʃu.əl/", "adjective", "happening or doing something at the agreed proper time", "She is always punctual and arrives five minutes early.", ["quality"]),
    ("delay", "/dɪˈleɪ/", "noun / verb", "a period of time by which something is late or postponed", "There is a twenty-minute flight delay today.", ["state"]),
    ("postpone", "/pəʊstˈpəʊn/", "verb", "to cause something to take place at a later time", "They decided to postpone the tennis match due to rain.", ["action"]),
    ("cancel", "/ˈkæn.səl/", "verb", "to decide that an agreed event will not take place", "Never cancel an appointment without calling ahead.", ["action"]),
    ("reschedule", "/ˌriːˈʃedʒ.uːl/", "verb", "to change the scheduled time of an event", "Can we reschedule our consultation to Thursday?", ["action"]),
    ("early morning", "/ˌɜː.li ˈmɔː.nɪŋ/", "phrase", "the initial hours of the day after sunrise", "I enjoy drinking tea in the early morning quiet.", ["time"]),
    ("late night", "/ˌleɪt ˈnaɪt/", "phrase", "the hours near or past midnight", "Studying late night can make you feel exhausted.", ["time"]),
    ("duration", "/djuˈreɪ.ʃən/", "noun", "the time during which something continues", "The flight has a duration of three hours.", ["time"]),
    ("timetable", "/ˈtaɪmˌteɪ.bl/", "noun", "a schedule showing the times at which public events occur", "Check the bus timetable before walking to the stop.", ["travel", "time"]),
    ("clock", "/klɒk/", "noun", "an instrument other than a watch used for measuring time", "The grandfather clock chimed on the hour.", ["time"]),
    ("watchface", "/ˈwɒtʃ.feɪs/", "noun", "the surface of a watch showing hours and minutes", "His wristwatch has a luminous digital watchface.", ["accessory"]),
    ("reminder", "/rɪˈmaɪn.dər/", "noun", "a thing that causes someone to remember something", "Set a phone reminder for your doctor appointment.", ["memory"]),
    ("event", "/ɪˈvent/", "noun", "a thing that happens, especially one of importance", "The school sports day is an annual event.", ["social"]),
    ("season", "/ˈsiː.zən/", "noun", "each of the four divisions of the year (spring, summer, autumn, winter)", "Autumn is my favorite colorful season.", ["nature", "time"]),
    ("spring", "/sprɪŋ/", "noun", "the season after winter and before summer", "Flowers bloom and trees turn green in spring.", ["season"]),
    ("summer", "/ˈsʌm.ər/", "noun", "the warmest season of the year", "Children swim in the lake during hot summer holidays.", ["season"]),
    ("autumn", "/ˈɔː.təm/", "noun", "the season between summer and winter when leaves fall", "Golden leaves fall from oaks in late autumn.", ["season"]),
    ("winter", "/ˈwɪn.tər/", "noun", "the coldest season of the year", "Snow covered the roofs throughout the cold winter.", ["season"]),
    ("month", "/mʌnθ/", "noun", "each of the twelve named periods into which a year is divided", "February is the shortest month of the calendar year.", ["time"]),
    ("year", "/jɪər/", "noun", "a period of 365 days", "I started learning the English language this year.", ["time"]),
    ("century", "/ˈsen.tʃər.i/", "noun", "a period of one hundred years", "The castle was constructed in the sixteenth century.", ["time"]),
    ("decade", "/ˈdek.eɪd/", "noun", "a period of ten years", "Technology advanced rapidly during the last decade.", ["time"]),
    ("era", "/ˈɪə.rə/", "noun", "a long and distinct period of history", "The industrial era transformed worldwide manufacturing.", ["history"]),
    ("moment", "/ˈməʊ.mənt/", "noun", "a very brief period of time", "Please hold the line for just a moment.", ["time"]),
    ("past", "/pɑːst/", "noun / adjective", "the time or a period of time before the moment of speaking", "In the past, people traveled by horse and carriage.", ["time"]),
    ("present", "/ˈprez.ənt/", "noun / adjective", "the period of time now occurring", "Live in the present and appreciate today.", ["time"]),
    ("future", "/ˈfjuː.tʃər/", "noun / adjective", "the period of time that will come after the present", "Invest in education to build a brighter future.", ["time"]),
    ("interval", "/ˈɪn.tə.vəl/", "noun", "an intervening time or space", "There was an interval of fifteen minutes between acts.", ["time"]),
    ("period", "/ˈpɪə.ri.əd/", "noun", "a length or portion of time", "She lived abroad for a period of two years.", ["time"]),
    ("on time", "/ɒn taɪm/", "phrase", "punctual; not late", "The express train arrived precisely on time.", ["time"]),
    ("in time", "/ɪn taɪm/", "phrase", "early enough for something", "We arrived in time to catch the beginning of the movie.", ["time"]),
    ("sooner or later", "/ˈsuː.nər ɔː ˈleɪ.tər/", "phrase", "at some point in the future; inevitably", "Sooner or later, every learner masters English grammar.", ["idiom"]),
    ("ahead of time", "/əˈhed əv taɪm/", "phrase", "in advance; earlier than expected", "Submit your project ahead of time to avoid stress.", ["idiom"]),
    ("timely", "/ˈtaɪm.li/", "adjective", "done or occurring at a favorable or useful time", "Thank you for your timely advice and support.", ["quality"])
]

d7_grammar = [
    {
        "title": "Prepositions of Time (at, on, in)",
        "explanation": "Use 'at' for precise clock times, festivals, and specific moments (at 7 o'clock, at noon, at midnight, at dawn). Use 'on' for days and dates (on Monday, on May 5th, on my birthday). Use 'in' for longer periods like months, seasons, years, decades, and centuries (in July, in winter, in 2026).",
        "structures": [
            {"pattern": "at + precise time (at noon / at midnight / at dawn)", "label": "Precise Points in Time"},
            {"pattern": "on + day / date (on Monday / on Friday)", "label": "Specific Days"},
            {"pattern": "in + month / season / year / period (in summer / in 2026)", "label": "Extended Periods"}
        ],
        "examples": [
            {"sentence": "The doctor appointment starts at quarter past ten.", "usesVocabulary": ["appointment", "quarter past"]},
            {"sentence": "We watched the sunset at dusk and saw stars at midnight.", "usesVocabulary": ["sunset", "dusk", "midnight"]},
            {"sentence": "The school event takes place in spring, on a sunny Friday.", "usesVocabulary": ["event", "spring"]}
        ],
        "commonUsage": [
            "Setting appointments: Let us meet at quarter to two on Tuesday.",
            "Describing seasons: Trees blossom in spring and lose leaves in autumn."
        ],
        "commonMistakes": [
            {"wrong": "The meeting is in Monday.", "right": "The meeting is on Monday.", "note": "Use 'on' with days of the week, not 'in'."},
            {"wrong": "I wake up on 7 o'clock.", "right": "I wake up at 7 o'clock.", "note": "Use 'at' for specific clock hours."}
        ]
    }
]

d7_convs = [
    (
        "Scheduling an Appointment",
        "Receptionist Clara talks with patient George on the phone.",
        ["Clara", "George"],
        [
            (0, "Good morning, Dental Clinic. How can I help you today?"),
            (1, "Hello. I need to make an appointment for a routine checkup."),
            (0, "Certainly. Can you come in on Thursday at quarter past two?"),
            (1, "I have a work meeting until noon on Thursday. Is Friday free?"),
            (0, "We have an opening on Friday at quarter to eleven in the morning."),
            (1, "That is perfect! I will write it on my calendar right now."),
            (0, "Please be punctual and arrive five minutes ahead of time."),
            (1, "Thank you Clara. I will set a reminder on my phone so I arrive on time.")
        ]
    ),
    (
        "Travel Timetable and Delays",
        "Henry and Grace consult the train station departure board.",
        ["Grace", "Henry"],
        [
            (0, "What does the railway timetable say about the express train?"),
            (1, "The departure was scheduled for midday, but there is a slight delay."),
            (0, "How long is the delay? Will we arrive in time for our event?"),
            (1, "The delay duration is just fifteen minutes, so we should be fine."),
            (0, "Good. We can watch the clock and wait on the platform bench."),
            (1, "The train will arrive at quarter past twelve instead of noon."),
            (0, "I am glad we checked the timetable ahead of time."),
            (1, "Yes! Sooner or later, every public transit passenger faces minor delays.")
        ]
    ),
    (
        "Four Seasons of the Year",
        "Adam and Zoe discuss their favorite seasonal weather.",
        ["Zoe", "Adam"],
        [
            (0, "Which season of the year do you enjoy the most?"),
            (1, "I love autumn because the sunset colors are spectacular at dusk."),
            (0, "I prefer spring when flowers bloom after the long cold winter."),
            (1, "Summer is also wonderful for beach trips, especially in the early morning."),
            (0, "At noon in summer the sun is scorching, so I stay indoors until sunset."),
            (1, "Winter brings snowy evenings when people stay warm until midnight."),
            (0, "Every decade and every season has its own unique charm."),
            (1, "Indeed! Living in the present moment makes every season enjoyable.")
        ]
    )
]

d7_paras = [
    (
        "Mastering the Clock and Calendar",
        "daily-life description",
        "Understanding time structures is essential for organizing daily life. A normal hour consists of sixty minutes, and each minute contains sixty seconds. When scheduling an appointment with a colleague, native speakers often use expressions like quarter past eight or quarter to nine. The business day usually peaks around midday or noon, while quiet residential neighborhoods fall silent by midnight. Being punctual reflects respect for other people and ensures every scheduled meeting starts on time."
    ),
    (
        "A Full Year of Seasons",
        "narrative",
        "A single calendar year contains twelve months divided across four distinct seasons. In spring, green shoots emerge at dawn as temperatures rise. Summer brings bright sunshine and long daylight hours until late sunset. In autumn, golden foliage blankets the earth during the interval between warm summer and chilly winter. Looking back over the past decade or historical century, human culture has always celebrated seasonal transitions through community events and festivals."
    ),
    (
        "Handling Deadlines and Delays",
        "practical situation",
        "In the modern workplace, keeping track of each project deadline is absolutely critical for long-term success. When unexpected delays occur, professional workers must promptly inform their clients and reschedule consultations or meetings. It is wise to prepare reports ahead of time rather than rushing during the stressful late night before delivery. Setting an electronic phone reminder ensures that important appointments are never overlooked. Timely communication prevents confusion and builds mutual trust in both the present and future."
    )
]

generate_day(7, d7_raw, d7_grammar, d7_convs, d7_paras)
