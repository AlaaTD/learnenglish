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
        if h in used:
            raise ValueError(f"Duplicate on Day {day_num} with Day {used[h]}: '{h}'")
        used[h] = day_num

# ==========================================
# DAY 5: Food I Eat
# Grammar: ["Like, Love, Hate + Noun"]
# ==========================================
d5_raw = [
    ("bread", "/bred/", "noun", "food made from flour, water, and yeast mixed together and baked", "I eat a slice of toasted bread with butter every morning.", ["food", "baking"]),
    ("butter", "/ˈbʌt.ər/", "noun", "a pale yellow solid food made from cream", "Spread fresh butter on your warm toast.", ["food", "dairy"]),
    ("cheese", "/tʃiːz/", "noun", "a food made from milk, usually yellow or white in color", "My sister loves cheddar cheese with crackers.", ["food", "dairy"]),
    ("milk", "/mɪlk/", "noun", "a white liquid produced by cows or goats used as food", "Pour cold milk into the breakfast bowl.", ["drink", "dairy"]),
    ("tea", "/tiː/", "noun", "a hot drink made by infusing dried leaves in boiling water", "We drink hot black tea with lemon in the afternoon.", ["drink"]),
    ("juice", "/dʒuːs/", "noun", "the liquid that comes from fruit or vegetables", "She drinks fresh orange juice with her breakfast.", ["drink"]),
    ("water", "/ˈwɔː.tər/", "noun", "a clear liquid that falls as rain and is used for drinking", "Drink plenty of clean water throughout the day.", ["drink"]),
    ("sugar", "/ˈʃʊɡ.ər/", "noun", "a sweet substance obtained from plants, used to sweeten food", "Do you take white sugar in your coffee?", ["food", "baking"]),
    ("salt", "/sɒlt/", "noun", "a white crystalline substance used for seasoning food", "Add a pinch of sea salt to the tomato soup.", ["seasoning"]),
    ("pepper", "/ˈpep.ər/", "noun", "a hot-tasting powder made from dried berries used as seasoning", "Season the vegetable salad with black pepper.", ["seasoning"]),
    ("egg", "/eɡ/", "noun", "an oval object produced by a hen, used as food", "He fried a fresh egg for breakfast.", ["food"]),
    ("meat", "/miːt/", "noun", "the flesh of animals used as food", "They do not eat red meat on weekdays.", ["food"]),
    ("beef", "/biːf/", "noun", "the meat from a cow or bull", "We had grilled beef and potatoes for dinner.", ["food", "meat"]),
    ("chicken", "/ˈtʃɪk.ɪn/", "noun", "the meat of a domestic fowl used as food", "She roasted a whole chicken with garlic and herbs.", ["food", "meat"]),
    ("fish", "/fɪʃ/", "noun", "an animal that lives in water, or its flesh eaten as food", "Fresh grilled fish is popular in coastal towns.", ["food", "seafood"]),
    ("rice", "/raɪs/", "noun", "small white or brown grains eaten cooked as food", "Steamed white rice goes well with curry.", ["food", "grains"]),
    ("pasta", "/ˈpæs.tə/", "noun", "food made from flour, eggs, and water molded into shapes", "Italian pasta with tomato sauce is delicious.", ["food", "italian"]),
    ("soup", "/suːp/", "noun", "a liquid dish made by boiling meat, fish, or vegetables", "Hot vegetable soup warms you up in winter.", ["food"]),
    ("salad", "/ˈsæl.əd/", "noun", "a mixture of raw vegetables such as lettuce and tomatoes", "She ordered a green salad with olive oil.", ["food", "healthy"]),
    ("apple", "/ˈæp.l/", "noun", "a round fruit with red, yellow, or green skin and firm flesh", "He eats a crisp green apple as an afternoon snack.", ["food", "fruit"]),
    ("banana", "/bəˈnɑː.nə/", "noun", "a long curved fruit with a yellow skin and soft sweet flesh", "Monkeys and children both love sweet yellow bananas.", ["food", "fruit"]),
    ("orange", "/ˈɒr.ɪndʒ/", "noun", "a round sweet citrus fruit with a thick orange skin", "Peel the juicy orange before eating.", ["food", "fruit"]),
    ("strawberry", "/ˈstrɔː.bər.i/", "noun", "a sweet soft red fruit with small seeds on its surface", "Fresh strawberry slices taste great on ice cream.", ["food", "fruit"]),
    ("grape", "/ɡreɪp/", "noun", "a small round green or purple berry growing in bunches", "We picked sweet purple grapes from the vineyard.", ["food", "fruit"]),
    ("lemon", "/ˈlem.ən/", "noun", "an oval yellow citrus fruit with sour juice", "Squeeze fresh lemon juice over the baked fish.", ["food", "fruit"]),
    ("tomato", "/təˈmɑː.təʊ/", "noun", "a glossy red fruit eaten raw in salads or cooked", "Slice a ripe red tomato for the sandwich.", ["food", "vegetable"]),
    ("potato", "/pəˈteɪ.təʊ/", "noun", "a round starchy root vegetable with brown skin", "Baked potato with melted butter is delicious.", ["food", "vegetable"]),
    ("onion", "/ˈʌn.jən/", "noun", "a vegetable with a strong taste and smell composed of layers", "Chop an onion finely before frying it in oil.", ["food", "vegetable"]),
    ("garlic", "/ˈɡɑː.lɪk/", "noun", "a plant with strong-smelling cloves used in cooking", "Crushed garlic adds wonderful flavor to pasta dishes.", ["food", "vegetable"]),
    ("carrot", "/ˈkær.ət/", "noun", "a long tapering orange-colored root vegetable", "Crunchy raw carrots make a healthy snack.", ["food", "vegetable"]),
    ("cucumber", "/ˈkjuː.kʌm.bər/", "noun", "a long green vegetable with watery flesh eaten raw", "Add sliced cucumber to the summer salad.", ["food", "vegetable"]),
    ("oil", "/ɔɪl/", "noun", "a smooth, thick liquid made from olives or seeds used in cooking", "Heat olive oil in the pan before cooking.", ["cooking"]),
    ("honey", "/ˈhʌn.i/", "noun", "a sweet sticky yellow substance made by bees", "She stirs pure honey into her herbal tea.", ["food", "sweet"]),
    ("jam", "/dʒæm/", "noun", "a sweet spread made from fruit boiled with sugar", "I spread strawberry jam on warm buttered scones.", ["food", "sweet"]),
    ("cake", "/keɪk/", "noun", "a sweet baked food made from flour, sugar, and eggs", "Mother baked a chocolate cake for my birthday.", ["food", "dessert"]),
    ("chocolate", "/ˈtʃɒk.lət/", "noun", "a sweet brown food made from roasted cacao seeds", "Dark chocolate contains less sugar than milk chocolate.", ["food", "sweet"]),
    ("biscuit", "/ˈbɪs.kɪt/", "noun", "a small baked unleavened cake, typically crisp and flat", "We enjoy a crisp ginger biscuit with our tea.", ["food", "snack"]),
    ("sandwich", "/ˈsæn.wɪdʒ/", "noun", "two slices of bread with meat, cheese, or salad between them", "He packed a chicken sandwich for his lunch break.", ["food", "meal"]),
    ("pizza", "/ˈpiːt.sə/", "noun", "a dish of Italian origin consisting of a flat round base of dough", "We ordered a cheese and mushroom pizza for movie night.", ["food", "italian"]),
    ("burger", "/ˈbɜː.ɡər/", "noun", "a round patty of minced beef served inside a sliced bun", "He ordered a grilled beef burger with lettuce.", ["food", "meal"]),
    ("noodle", "/ˈnuː.dl/", "noun", "a strip or ribbon of pasta, typically cooked in broth", "A bowl of chicken noodle soup cures a cold.", ["food", "asian"]),
    ("sweet", "/swiːt/", "adjective", "having the pleasant taste characteristic of sugar or honey", "Ripe mangoes are very sweet and juicy.", ["taste"]),
    ("sour", "/saʊər/", "adjective", "having an acid taste like lemon or vinegar", "Unripe green apples taste very sour.", ["taste"]),
    ("salty", "/ˈsɔːl.ti/", "adjective", "tasting of or containing salt", "Potato chips are crunchy and very salty.", ["taste"]),
    ("bitter", "/ˈbɪt.ər/", "adjective", "having a sharp, pungent taste that is not sweet", "Black coffee without sugar has a bitter flavor.", ["taste"]),
    ("delicious", "/dɪˈlɪʃ.əs/", "adjective", "highly pleasant to the taste", "This homemade vegetable lasagna is absolutely delicious.", ["taste", "quality"]),
    ("fresh", "/freʃ/", "adjective", "recently made, gathered, or harvested; not stale", "Buy fresh vegetables from the local farmers market.", ["food", "quality"]),
    ("thirsty", "/ˈθɜː.sti/", "adjective", "feeling a need to drink", "After running in the heat, I was very thirsty.", ["feeling"]),
    ("appetite", "/ˈæp.ə.taɪt/", "noun", "a natural desire to satisfy a bodily need, especially for food", "Exercising outdoors always gives me a healthy appetite.", ["health"]),
    ("meal", "/miːl/", "noun", "any of the regular occasions on which food is eaten", "Breakfast is the most essential meal of the day.", ["food"])
]

d5_vocab = build_vocab(d5_raw)
check_no_dupes(d5_vocab, 5)

d5_grammar = [
    {
        "title": "Like, Love, Hate + Noun",
        "explanation": "Use verbs of preference like 'like', 'love', and 'hate' followed directly by a noun or noun phrase to express your feelings about foods, activities, or things. In the third person singular (he/she/it), remember to add -s.",
        "structures": [
            {"pattern": "Subject + like / love / hate + noun", "label": "Positive Preference"},
            {"pattern": "Subject + don't / doesn't like + noun", "label": "Negative Preference"},
            {"pattern": "Do / Does + subject + like + noun ...?", "label": "Question Form"}
        ],
        "examples": [
            {"sentence": "I love fresh bread with butter and honey.", "usesVocabulary": ["bread", "butter", "honey", "fresh"]},
            {"sentence": "She likes grilled chicken and steamed rice for lunch.", "usesVocabulary": ["chicken", "rice"]},
            {"sentence": "My brother hates bitter black coffee without sugar.", "usesVocabulary": ["bitter", "sugar"]},
            {"sentence": "Do you like spicy pasta with garlic and cheese?", "usesVocabulary": ["pasta", "garlic", "cheese"]}
        ],
        "commonUsage": [
            "Expressing tastes: I love sweet strawberries, but I hate sour lemons.",
            "Ordering food: We like fresh vegetable soup and crisp salad."
        ],
        "commonMistakes": [
            {"wrong": "She like chocolate.", "right": "She likes chocolate.", "note": "Add -s to the verb with third person singular subjects (he/she/it)."},
            {"wrong": "I am like pizza.", "right": "I like pizza.", "note": "Do not use 'am' before action and state verbs in the present simple."}
        ]
    }
]

d5_convs = [
    make_conversation(
        "Deciding on Lunch",
        "Ben and Lisa discuss what to eat at the food court.",
        ["Lisa", "Ben"],
        [
            (0, "I have a big appetite today! What kind of meal do you want?"),
            (1, "I love Italian food. Let's order a cheese pizza and a fresh salad."),
            (0, "Sounds delicious! Do you like beef burger or chicken sandwich instead?"),
            (1, "I like chicken, but my doctor says I should eat more fresh fish and vegetables."),
            (0, "Then let's share a bowl of chicken noodle soup with fresh bread."),
            (1, "Great idea. Are you thirsty? Would you like some cold orange juice or water?"),
            (0, "I am very thirsty, so I will take mineral water with a slice of lemon."),
            (1, "I will also buy a piece of dark chocolate cake and a sweet biscuit for dessert.")
        ]
    ),
    make_conversation(
        "Cooking Dinner at Home",
        "Oliver and Mia cook a meal together in their apartment.",
        ["Mia", "Oliver"],
        [
            (0, "What ingredients do we have in the kitchen for dinner?"),
            (1, "We have fresh meat, potatoes, carrots, an onion, and garlic."),
            (0, "Let's make a beef stew! Heat some olive oil in the pan first."),
            (1, "Should I chop the onion and garlic now?"),
            (0, "Yes, and add some salt and black pepper to season the beef."),
            (1, "Do we have any steamed rice or pasta to serve with it?"),
            (0, "We have white rice and a loaf of brown bread with butter."),
            (1, "Perfect. The stew will be delicious and warm on this cold evening.")
        ]
    ),
    make_conversation(
        "Talking About Tastes",
        "Noah and Chloe talk about their favorite fruits and drinks.",
        ["Chloe", "Noah"],
        [
            (0, "Do you like sweet fruits or sour ones?"),
            (1, "I love sweet fruits like ripe banana, red strawberry, and sweet grape."),
            (0, "I hate sour fruits like unripe lemon, though I like lemon in hot tea."),
            (1, "Do you take milk or sugar in your morning black tea?"),
            (0, "I love pure honey with hot water, but I dislike white sugar."),
            (1, "What about snacks? Do you eat salty potato chips or sweet chocolate?"),
            (0, "I prefer a crisp green apple or a slice of cheese on toasted bread."),
            (1, "Eating fresh fruit and drinking clean water is definitely much healthier.")
        ]
    )
]

d5_paras = [
    make_paragraph(
        "My Daily Eating Habits",
        "daily-life description",
        "Eating a wholesome meal provides energy for the whole day. For breakfast, I always enjoy fresh bread with butter, a slice of yellow cheese, and a fried egg. I drink warm black tea with a spoonful of sweet honey. For lunch, I prefer a light chicken sandwich or a crisp vegetable salad with cucumber, tomato, and olive oil. If I feel thirsty during the afternoon, I drink clean cold water or freshly squeezed orange juice. Good food keeps the mind alert."
    ),
    make_paragraph(
        "A Weekend Family Dinner",
        "personal story",
        "Every Sunday evening, our whole family gathers to cook a delicious feast together. My father roasts tender beef or chicken with garlic, onion, and potato, seasoning it with salt and black pepper. My mother prepares steamed white rice and a warm pot of vegetable soup. We love sitting around the table sharing stories while the smell of baked bread fills the room. For dessert, my sister serves chocolate cake and fresh strawberry slices with hot tea."
    ),
    make_paragraph(
        "Different Tastes and Flavors",
        "opinion paragraph",
        "Human beings have very different preferences when it comes to food flavors. Some people love sweet desserts like biscuits, cakes, and milk chocolate, while others crave salty snacks like potato chips. In our household, my brother likes sour fruits like lemon and unripe green apples, but my mother hates bitter black coffee without milk or sugar. I personally love fresh fruits such as banana, grape, and orange because they are naturally sweet and full of vitamins."
    )
]

hws5 = [v["headword"] for v in d5_vocab]
d5_convs = link_vocab(d5_convs, hws5)
d5_paras = link_vocab(d5_paras, hws5)

write_day(5, d5_vocab, d5_grammar, d5_convs, d5_paras)
print("Day 5 written successfully!")
