import json, os, re
from curriculum_engine import write_day, get_all_used_headwords
from gen_helpers import make_conversation, make_paragraph, link_vocab

global_used = get_all_used_headwords()

def check_words(words_list, day_num):
    hws = [w["headword"].lower() for w in words_list]
    assert len(hws) == 50, f"Day {day_num} has {len(hws)} words"
    for hw in hws:
        if hw in global_used:
            raise ValueError(f"Day {day_num} duplicate with Day {global_used[hw]}: {hw}")
        global_used[hw] = day_num

# ==========================================
# DAY 3: My Home
# Grammar: ["There is / There are", "Prepositions of Place"]
# ==========================================
d3_raw = [
    ("living room", "/ˈlɪv.ɪŋ ˌruːm/", "noun", "the room in a house where people sit and relax", "We watch movies together in the living room.", ["sofa", "relax"], ["home"]),
    ("bedroom", "/ˈbed.ruːm/", "noun", "a room used for sleeping", "My bedroom has a large window facing east.", ["sleep", "bed"], ["home"]),
    ("kitchen", "/ˈkɪtʃ.ɪn/", "noun", "a room where food is kept and cooked", "Mother is cooking soup in the kitchen.", ["cook", "meal"], ["home"]),
    ("bathroom", "/ˈbɑːθ.ruːm/", "noun", "a room with a bath or shower and a toilet", "The bathroom is at the end of the hallway.", ["shower", "wash"], ["home"]),
    ("dining room", "/ˈdaɪ.nɪŋ ˌruːm/", "noun", "a room where meals are eaten", "We eat Sunday lunch in the dining room.", ["table", "dinner"], ["home"]),
    ("hallway", "/ˈhɔːl.weɪ/", "noun", "a passage connecting rooms in a building", "Hang your coat in the hallway.", ["corridor"], ["home"]),
    ("balcony", "/ˈbæl.kə.ni/", "noun", "a platform on the outside wall of a building", "I drink coffee on the balcony every morning.", ["terrace"], ["home"]),
    ("garden", "/ˈɡɑː.dən/", "noun", "an area of land next to a house with grass and flowers", "The children love playing in the garden.", ["yard"], ["home"]),
    ("garage", "/ˈɡær.ɑːʒ/", "noun", "a building where a car is kept", "The car is parked safely in the garage.", [], ["home"]),
    ("stairs", "/steəz/", "noun", "a set of steps leading from one floor to another", "Walk carefully down the stairs.", ["steps"], ["home"]),
    ("floor", "/flɔːr/", "noun", "the flat surface that you walk on inside a room", "The wooden floor is clean and shiny.", ["ground"], ["home"]),
    ("ceiling", "/ˈsiː.lɪŋ/", "noun", "the top inside surface of a room", "A modern lamp hangs from the ceiling.", [], ["home"]),
    ("wall", "/wɔːl/", "noun", "one of the sides of a room or building", "We hung family pictures on the wall.", [], ["home"]),
    ("door", "/dɔːr/", "noun", "the movable barrier used to close an entrance", "Please close the front door.", ["entrance"], ["home"]),
    ("window", "/ˈwɪn.dəʊ/", "noun", "an opening in a wall fitted with glass", "Open the window to let fresh air inside.", [], ["home"]),
    ("roof", "/ruːf/", "noun", "the structure covering the top of a building", "Birds are singing on the roof.", [], ["home"]),
    ("furniture", "/ˈfɜː.nɪ.tʃər/", "noun", "objects such as chairs, tables, and beds", "We bought new wooden furniture for the flat.", [], ["furniture"]),
    ("sofa", "/ˈsəʊ.fə/", "noun", "a long comfortable seat with a back and arms", "Grandfather is resting on the soft sofa.", ["couch"], ["furniture"]),
    ("armchair", "/ˈɑːm.tʃeər/", "noun", "a comfortable chair with sides that support your arms", "Father reads his book in the armchair.", [], ["furniture"]),
    ("table", "/ˈteɪ.bl/", "noun", "a flat surface supported by legs", "Put the plates on the dining table.", [], ["furniture"]),
    ("chair", "/tʃeər/", "noun", "a seat for one person that has a back and legs", "Pull up a chair and sit beside me.", [], ["furniture"]),
    ("desk", "/desk/", "noun", "a table that you sit at to write or work", "I keep my computer on my work desk.", [], ["furniture"]),
    ("bed", "/bed/", "noun", "a piece of furniture that you sleep on", "The bed has clean white sheets.", [], ["furniture"]),
    ("wardrobe", "/ˈwɔː.drəʊb/", "noun", "a large cupboard for hanging clothes", "Hang your shirts inside the wardrobe.", ["closet"], ["furniture"]),
    ("shelf", "/ʃelf/", "noun", "a flat horizontal board used for storing things", "There are many novels on the book shelf.", [], ["furniture"]),
    ("drawer", "/drɔːr/", "noun", "a sliding box-shaped container in a piece of furniture", "Keep your keys in the top drawer.", [], ["furniture"]),
    ("carpet", "/ˈkɑː.pɪt/", "noun", "thick woven fabric used to cover a floor", "We have a warm red carpet in the bedroom.", ["rug"], ["furniture"]),
    ("curtain", "/ˈkɜː.tən/", "noun", "a piece of cloth hung to cover a window", "Draw the curtain before turning on the lamp.", ["drapes"], ["furniture"]),
    ("mirror", "/ˈmɪr.ər/", "noun", "a glass surface that reflects your image", "She looked at her hair in the mirror.", [], ["furniture"]),
    ("lamp", "/læmp/", "noun", "a device that produces light", "Turn on the reading lamp on your desk.", ["light"], ["furniture"]),
    ("cushion", "/ˈkʊʃ.ən/", "noun", "a soft pillow used on a sofa or chair", "Place a cushion behind your back.", ["pillow"], ["furniture"]),
    ("blanket", "/ˈblæŋ.kɪt/", "noun", "a thick warm cover used on a bed", "Take an extra blanket if you feel cold.", [], ["furniture"]),
    ("pillow", "/ˈpɪl.əʊ/", "noun", "a soft support for the head when sleeping", "I sleep with one soft pillow.", ["cushion"], ["furniture"]),
    ("fridge", "/frɪdʒ/", "noun", "an appliance used to keep food cold", "There is cold milk inside the fridge.", ["refrigerator"], ["appliances"]),
    ("oven", "/ˈʌv.n/", "noun", "an enclosed space for baking or roasting food", "Bake the bread in the oven for thirty minutes.", [], ["appliances"]),
    ("stove", "/stəʊv/", "noun", "an apparatus for cooking with burners on top", "A pot of soup is simmering on the stove.", ["cooker"], ["appliances"]),
    ("sink", "/sɪŋk/", "noun", "a bowl fixed to a wall with water supply and drain", "Put the dirty cups into the kitchen sink.", [], ["appliances"]),
    ("faucet", "/ˈfɔː.sɪt/", "noun", "a tap that controls the flow of water", "Turn off the faucet while brushing teeth.", ["tap"], ["appliances"]),
    ("cupboard", "/ˈkʌb.əd/", "noun", "a piece of furniture with doors for storing things", "The glasses are stored in the top cupboard.", [], ["furniture"]),
    ("plate", "/pleɪt/", "noun", "a flat round dish for food", "Place a ceramic plate on the dining table.", ["dish"], ["tableware"]),
    ("fork", "/fɔːk/", "noun", "a small utensil with tines used for eating", "Eat your salad with a metal fork.", [], ["tableware"]),
    ("knife", "/naɪf/", "noun", "a sharp utensil used for cutting", "Use a sharp knife to slice the fruit.", [], ["tableware"]),
    ("spoon", "/spuːn/", "noun", "a curved utensil used for soup or liquids", "Stir the coffee with a small spoon.", [], ["tableware"]),
    ("towel", "/taʊəl/", "noun", "a piece of absorbent cloth for drying", "Dry your hands on the clean towel.", [], ["bathroom"]),
    ("soap", "/səʊp/", "noun", "a substance used with water for washing", "Wash your hands thoroughly with mild soap.", [], ["bathroom"]),
    ("tidy", "/ˈtaɪ.di/", "adjective", "neat and in good order", "His bedroom is always tidy and clean.", ["neat"], ["home"]),
    ("messy", "/ˈmes.i/", "adjective", "untidy and full of clutter", "The kids left the living room messy.", ["untidy"], ["home"]),
    ("cozy", "/ˈkəʊ.zi/", "adjective", "giving a feeling of comfort, warmth, and relaxation", "Our small cottage is warm and cozy.", ["comfortable"], ["home"]),
    ("spacious", "/ˈspeɪ.ʃəs/", "adjective", "having plenty of room or space", "The apartment has a bright and spacious kitchen.", ["roomy"], ["home"]),
    ("quiet", "/ˈkwaɪ.ət/", "adjective", "making very little noise; calm", "We live on a quiet residential street.", ["calm"], ["home"])
]

d3_vocab = []
for h, p, pos, d, ex, rf, col, syn, ant, tags in [
    (x[0], x[1], x[2], x[3], x[4], [], x[5], [], [], x[6]) if len(x)==7 else
    (x[0], x[1], x[2], x[3], x[4], x[5], [], [], [], x[6]) if len(x)==7 else
    (x[0], x[1], x[2], x[3], x[4], [], [], [], [], x[6]) if len(x)==7 else
    (x[0], x[1], x[2], x[3], x[4], x[5], [], x[6], [], x[7]) if len(x)==8 else
    (x[0], x[1], x[2], x[3], x[4], [], [], [], [], x[5])
    for x in d3_raw
]:
    d3_vocab.append({
        "headword": h, "pronunciation": p, "partOfSpeech": pos,
        "definition": d, "example": ex, "relatedForms": rf,
        "collocations": col, "synonyms": syn, "antonyms": ant, "tags": tags
    })

check_words(d3_vocab, 3)

d3_grammar = [
    {
        "title": "There is / There are",
        "explanation": "Use 'there is' with singular nouns and uncountable items. Use 'there are' with plural nouns. Use 'is there' or 'are there' for questions.",
        "structures": [
            {"pattern": "There is + singular noun / uncountable noun", "label": "Singular Statement"},
            {"pattern": "There are + plural noun", "label": "Plural Statement"},
            {"pattern": "Is there + singular noun ...?", "label": "Singular Question"},
            {"pattern": "Are there + plural noun ...?", "label": "Plural Question"},
            {"pattern": "There isn't / There aren't", "label": "Negative Form"}
        ],
        "examples": [
            {"sentence": "There is a comfortable sofa in the living room.", "usesVocabulary": ["sofa", "living room"]},
            {"sentence": "There are four chairs around the dining table.", "usesVocabulary": ["chair", "table"]},
            {"sentence": "There is cold milk inside the kitchen fridge.", "usesVocabulary": ["fridge", "kitchen"]},
            {"sentence": "Are there clean towels in the bathroom?", "usesVocabulary": ["towel", "bathroom"]}
        ],
        "commonUsage": [
            "Describing rooms: There is a balcony outside the bedroom.",
            "Listing contents: In the kitchen, there is a stove and there are cupboards."
        ],
        "commonMistakes": [
            {"wrong": "There is two windows in my room.", "right": "There are two windows in my room.", "note": "Use 'there are' when referring to plural objects."}
        ]
    },
    {
        "title": "Prepositions of Place",
        "explanation": "Prepositions of place show where an object or person is located relative to another. Common prepositions include in, on, under, behind, next to, between, and above.",
        "structures": [
            {"pattern": "Subject + is/are + preposition + noun", "label": "Location Sentence"}
        ],
        "examples": [
            {"sentence": "The lamp is on the work desk.", "usesVocabulary": ["lamp", "desk"]},
            {"sentence": "The red carpet is under the bed.", "usesVocabulary": ["carpet", "bed"]},
            {"sentence": "The mirror is on the bedroom wall.", "usesVocabulary": ["mirror", "bedroom", "wall"]}
        ],
        "commonUsage": [
            "Giving directions in a house: The bathroom is next to the bedroom.",
            "Describing positions: Put the cushion on the armchair."
        ],
        "commonMistakes": [
            {"wrong": "The plate is at the table.", "right": "The plate is on the table.", "note": "Use 'on' for objects sitting on top of a flat horizontal surface."}
        ]
    }
]

d3_convs = [
    make_conversation(
        "Touring the New Flat",
        "Anna gives her friend Lucas a tour of her new apartment.",
        ["Lucas", "Anna"],
        [
            (0, "Your new apartment is so bright and spacious!"),
            (1, "Thank you! Here is the living room with a comfortable sofa and a soft armchair."),
            (0, "I love the warm red carpet on the floor. Where is the balcony?"),
            (1, "The balcony is right through that door next to the big window."),
            (0, "There is a lovely garden view from here. It is very quiet."),
            (1, "Yes! Now look into the kitchen. There is a new stove and a modern fridge."),
            (0, "The dining room table has six chairs. It looks very tidy!"),
            (1, "Let's walk down the hallway to see the bedroom and bathroom.")
        ]
    ),
    make_conversation(
        "Settling into the Bedroom",
        "Liam and Sophie arrange their furniture and storage.",
        ["Liam", "Sophie"],
        [
            (0, "Where should we place the work desk in this bedroom?"),
            (1, "Put the desk under the window so there is natural light."),
            (0, "Good idea. The reading lamp can sit right on the desk."),
            (1, "Is there enough room beside the bed for the wooden wardrobe?"),
            (0, "Yes, and we can put extra blankets and a pillow inside the top drawer."),
            (1, "Let's hang this oval mirror on the wall above the shelf."),
            (0, "What about the window curtain? We should hang it before night."),
            (1, "Perfect. Place that soft cushion on the chair while I fix the curtain.")
        ]
    ),
    make_conversation(
        "Preparing Dinner in the Kitchen",
        "Carlos and Elena clean and prepare the kitchen for cooking.",
        ["Elena", "Carlos"],
        [
            (0, "Is the kitchen clean enough to start cooking?"),
            (1, "It is quite tidy now. I cleaned the sink and wiped the faucet."),
            (0, "Where are the clean plates and cups?"),
            (1, "They are in the top cupboard above the oven."),
            (0, "Hand me a sharp knife and a cutting board, please."),
            (1, "Here is a knife, and there are forks and spoons in this small drawer."),
            (0, "Take a clean towel and dry the dishes while I preheat the oven."),
            (1, "I will also wash my hands with soap before touching the food.")
        ]
    )
]

d3_paras = [
    make_paragraph(
        "A Tour of Our Home",
        "description",
        "Our home is very cozy, quiet, and comfortable. On the ground floor, there is a spacious living room with a large sofa, a matching armchair, and a soft cushion. A thick carpet covers the wooden floor. Next to the living room, there is a dining room with a sturdy wooden table and four chairs. The kitchen has a modern fridge, a clean stove, and an oven where my mother bakes bread. There are clean plates and glasses stored in the tall cupboard."
    ),
    make_paragraph(
        "My Personal Bedroom Sanctuary",
        "personal story",
        "My bedroom is on the upper floor, up the stairs. It is always tidy and bright because sunlight enters through the large window. Beside the bed, there is a desk with a reading lamp and a comfortable chair. A tall wardrobe holds my clothes, and I keep my journals inside a wooden drawer. On the wall, there is a bookshelf and an elegant mirror. A warm blanket and a soft pillow make my bed the perfect place to rest."
    ),
    make_paragraph(
        "A Pleasant Saturday Morning",
        "daily-life description",
        "On Saturday mornings, our household is calm and cheerful. I wake up, walk down the hallway, and enter the bathroom to wash my hands with soap and dry them on a soft towel. Then I step into the kitchen, turn on the water faucet, and fill the kettle. Father is already on the balcony watering plants, while our dog plays outside in the garden. Although the kitchen counter looks a little messy after breakfast, we clean the sink together."
    )
]

hws3 = [v["headword"] for v in d3_vocab]
d3_convs = link_vocab(d3_convs, hws3)
d3_paras = link_vocab(d3_paras, hws3)

write_day(3, d3_vocab, d3_grammar, d3_convs, d3_paras)
print("Day 3 written successfully!")
