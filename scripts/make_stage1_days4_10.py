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

# -------------------------------------------------------------
# DAY 4: The Things I Have
# Grammar: ["Have / Has", "Possessive Adjectives"]
# -------------------------------------------------------------
d4_raw = [
    ("wallet", "/ˈwɒl.ɪt/", "noun", "a small folding case for keeping paper money and cards", "I keep some cash in my brown leather wallet.", ["personal", "money"]),
    ("backpack", "/ˈbæk.pæk/", "noun", "a bag carried on the back with two shoulder straps", "He carries his heavy books in a blue backpack.", ["personal", "bag"]),
    ("suitcase", "/ˈsuːt.keɪs/", "noun", "a large rectangular case used for carrying clothes on trips", "Pack your winter clothes in the large suitcase.", ["travel", "bag"]),
    ("umbrella", "/ʌmˈbrel.ə/", "noun", "a device used for protection against rain", "Take an umbrella because it might rain today.", ["personal", "weather"]),
    ("glasses", "/ˈɡlɑː.sɪz/", "noun", "lenses worn in a frame to help you see better", "Grandmother wears reading glasses to read the newspaper.", ["personal", "vision"]),
    ("sunglasses", "/ˈsʌŋˌɡlɑː.sɪz/", "noun", "dark glasses that protect your eyes from the sun", "Wear sunglasses when you walk in bright sunlight.", ["personal", "summer"]),
    ("laptop", "/ˈlæp.tɒp/", "noun", "a portable personal computer", "She works on her laptop in the quiet library.", ["technology", "work"]),
    ("charger", "/ˈtʃɑː.dʒər/", "noun", "a device used for charging phone or laptop batteries", "Do not forget your phone charger before leaving.", ["technology"]),
    ("headphones", "/ˈhed.fəʊnz/", "noun", "a pair of speakers worn over or in the ears", "I listen to English podcasts through my headphones.", ["technology", "audio"]),
    ("notebook", "/ˈnəʊt.bʊk/", "noun", "a book with blank pages for writing notes", "Write important vocabulary in your personal notebook.", ["study", "stationery"]),
    ("pen", "/pen/", "noun", "an instrument used for writing with ink", "Sign the official document with a blue pen.", ["stationery"]),
    ("pencil", "/ˈpen.səl/", "noun", "a wooden instrument with graphite used for drawing or writing", "The artist drew a portrait with a graphite pencil.", ["stationery"]),
    ("passport", "/ˈpɑːs.pɔːt/", "noun", "an official document identifying you as a citizen when traveling", "Keep your passport in a safe zippered pocket.", ["travel", "documents"]),
    ("keys", "/kiːz/", "noun", "pieces of metal cut to open a specific lock", "I always keep my house keys in my coat pocket.", ["personal"]),
    ("keychain", "/ˈkiː.tʃeɪn/", "noun", "a small chain or ring on which keys are kept", "She has a shiny souvenir keychain on her house keys.", ["personal"]),
    ("identity card", "/aɪˈden.tə.ti kɑːd/", "noun", "an official card proving a person's identity", "Show your identity card at the reception desk.", ["documents"]),
    ("credit card", "/ˈkred.ɪt kɑːd/", "noun", "a small plastic card used to make purchases on credit", "He paid for the groceries using a credit card.", ["money"]),
    ("cash", "/kæʃ/", "noun", "money in the form of notes and coins", "Do you carry any paper cash in your wallet?", ["money"]),
    ("coin", "/kɔɪn/", "noun", "a flat, round piece of metal used as money", "I dropped a small metal coin on the ground.", ["money"]),
    ("phone case", "/fəʊn keɪs/", "noun", "a protective cover for a mobile phone", "Her mobile phone case has a colorful floral design.", ["personal", "technology"]),
    ("tablet", "/ˈtæb.lət/", "noun", "a thin portable computer with a touchscreen display", "Children enjoy drawing pictures on the electronic tablet.", ["technology"]),
    ("camera", "/ˈkæm.rə/", "noun", "a device used for capturing photographs or recording videos", "He took beautiful photos with his digital camera.", ["technology", "hobby"]),
    ("necklace", "/ˈnek.ləs/", "noun", "a piece of jewelry worn around the neck", "She wore an elegant pearl necklace to the wedding.", ["jewelry", "accessory"]),
    ("ring", "/rɪŋ/", "noun", "a small circular band of metal worn on a finger", "He wears a simple gold wedding ring on his hand.", ["jewelry", "accessory"]),
    ("bracelet", "/ˈbreɪ.slət/", "noun", "an ornamental band or chain worn on the wrist", "Her silver bracelet glistened in the morning light.", ["jewelry", "accessory"]),
    ("earrings", "/ˈɪə.rɪŋz/", "noun", "jewelry worn on the earlobes", "My sister bought sparkling silver earrings yesterday.", ["jewelry", "accessory"]),
    ("handbag", "/ˈhænd.bæɡ/", "noun", "a small bag carried by hand or over the shoulder", "She placed her phone and wallet inside her leather handbag.", ["personal", "bag"]),
    ("bottle", "/ˈbɒt.l/", "noun", "a container with a narrow neck for liquids", "Always carry a reusable water bottle when exercising.", ["personal", "health"]),
    ("comb", "/kəʊm/", "noun", "a strip of plastic or metal with teeth used for untangling hair", "Use a comb to tidy your hair before the interview.", ["grooming"]),
    ("tissue", "/ˈtɪʃ.uː/", "noun", "a piece of soft absorbent disposable paper", "Carry a pack of paper tissues in your backpack.", ["hygiene"]),
    ("scissors", "/ˈsɪz.əz/", "noun", "an instrument with two pivoting blades used for cutting paper", "Cut the wrapping paper neatly with sharp scissors.", ["tools"]),
    ("ticket", "/ˈtɪk.ɪt/", "noun", "a piece of paper or card giving the holder a right to travel or enter", "Keep your train ticket ready for inspection.", ["travel"]),
    ("receipt", "/rɪˈsiːt/", "noun", "a printed document confirming that goods have been paid for", "Keep the store receipt if you want an exchange.", ["shopping"]),
    ("document", "/ˈdɒk.jə.mənt/", "noun", "an official paper providing information or proof", "Store each important document inside a folder.", ["office", "documents"]),
    ("folder", "/ˈfəʊl.dər/", "noun", "a cover or case for holding loose papers", "Place your certificates inside a plastic folder.", ["office", "stationery"]),
    ("diary", "/ˈdaɪə.ri/", "noun", "a daily record of personal thoughts, events, or appointments", "She writes in her personal diary before bedtime.", ["writing", "personal"]),
    ("gift", "/ɡɪft/", "noun", "a present given willingly without payment", "He brought a thoughtful birthday gift for his friend.", ["social"]),
    ("box", "/bɒks/", "noun", "a container with flat sides and a lid", "Put the old letters inside this cardboard box.", ["storage"]),
    ("pocket", "/ˈpɒk.ɪt/", "noun", "a small bag sewn into clothing for carrying small items", "Keep your hands warm in your jacket pocket.", ["clothing"]),
    ("battery", "/ˈbæt.ər.i/", "noun", "a device producing electricity to power devices", "The remote control needs a fresh replacement battery.", ["technology"]),
    ("belongings", "/bɪˈlɒŋ.ɪŋz/", "noun", "the personal things that you own", "Do not leave your personal belongings unattended here.", ["personal"]),
    ("item", "/ˈaɪ.təm/", "noun", "an individual article or object", "Check each valuable item on your packing list.", ["general"]),
    ("own", "/əʊn/", "verb", "to possess something as property", "They own a comfortable small house in the countryside.", ["possession"]),
    ("possess", "/pəˈzes/", "verb", "to have or hold something as property", "He does not possess a private motor vehicle.", ["possession"]),
    ("carry", "/ˈkær.i/", "verb", "to hold or support while moving from one place to another", "Can you help me carry this heavy suitcase?", ["action"]),
    ("valuable", "/ˈvæl.jə.bl/", "adjective", "worth a lot of money or very important", "Keep your valuable jewelry in a locked drawer.", ["quality"]),
    ("useful", "/ˈjuːs.fəl/", "adjective", "able to be used for a practical purpose", "A bilingual dictionary is very useful for learners.", ["quality"]),
    ("personal", "/ˈpɜː.sən.əl/", "adjective", "belonging to a particular person", "Keep your personal papers and diary completely private.", ["quality"]),
    ("missing", "/ˈmɪs.ɪŋ/", "adjective", "not present or unable to be found", "One important document is missing from this folder.", ["state"]),
    ("lost", "/lɒst/", "adjective", "unable to be found or misplaced", "He found his lost car keys under the sofa.", ["state"])
]

d4_vocab = build_vocab(d4_raw)
check_no_dupes(d4_vocab, 4)

d4_grammar = [
    {
        "title": "Have / Has",
        "explanation": "Use 'have' with I, you, we, and they. Use 'has' with he, she, and it. In negative sentences, use 'do not have' (don't have) or 'does not have' (doesn't have). In questions, use 'Do you have...?' or 'Does he have...?'.",
        "structures": [
            {"pattern": "I / You / We / They + have + noun", "label": "Positive (Plural/I/You)"},
            {"pattern": "He / She / It + has + noun", "label": "Positive (Third Person)"},
            {"pattern": "Subject + don't / doesn't have + noun", "label": "Negative Form"},
            {"pattern": "Do / Does + subject + have + noun ...?", "label": "Question Form"}
        ],
        "examples": [
            {"sentence": "I have my passport and my brown leather wallet.", "usesVocabulary": ["passport", "wallet"]},
            {"sentence": "She has a modern laptop and wireless headphones.", "usesVocabulary": ["laptop", "headphones"]},
            {"sentence": "He does not have his house keys in his coat pocket.", "usesVocabulary": ["keys", "pocket"]},
            {"sentence": "Do you have an umbrella in your backpack?", "usesVocabulary": ["umbrella", "backpack"]}
        ],
        "commonUsage": [
            "Talking about possessions: I have a new phone case and a spare charger.",
            "Describing what you carry: We have paper tissues and a water bottle."
        ],
        "commonMistakes": [
            {"wrong": "She have a credit card.", "right": "She has a credit card.", "note": "Use 'has' with he, she, and it."},
            {"wrong": "He doesn't has his keys.", "right": "He doesn't have his keys.", "note": "After doesn't, use the base verb 'have'."}
        ]
    },
    {
        "title": "Possessive Adjectives",
        "explanation": "Possessive adjectives (my, your, his, her, its, our, their) show ownership and come before a noun. They never take an -s ending.",
        "structures": [
            {"pattern": "Possessive adjective + noun", "label": "Possessive Form"}
        ],
        "examples": [
            {"sentence": "This is my notebook and his pencil.", "usesVocabulary": ["notebook", "pencil"]},
            {"sentence": "Her gold ring is very valuable to her family.", "usesVocabulary": ["ring", "valuable"]},
            {"sentence": "Our teacher placed her documents inside a neat folder.", "usesVocabulary": ["document", "folder"]}
        ],
        "commonUsage": [
            "Identifying belongings: Is this your handbag or their suitcase?",
            "Pointing out objects: His camera is on the table."
        ],
        "commonMistakes": [
            {"wrong": "This is his's wallet.", "right": "This is his wallet.", "note": "Possessive adjectives do not take an apostrophe or -s."},
            {"wrong": "Her's sunglasses are new.", "right": "Her sunglasses are new.", "note": "Use 'her' before a noun, not 'hers'."}
        ]
    }
]

d4_convs = [
    make_conversation(
        "Packing for a Weekend Trip",
        "Sarah and Michael check their bags before catching a train.",
        ["Michael", "Sarah"],
        [
            (0, "Do you have your passport and train ticket ready?"),
            (1, "Yes, I have my passport, ticket, and wallet inside my handbag."),
            (0, "Did you pack your phone charger and laptop?"),
            (1, "My laptop, charger, and headphones are in my black backpack."),
            (0, "Look outside, it looks cloudy. Do we have an umbrella?"),
            (1, "I have a small folding umbrella in the side pocket."),
            (0, "Good. I have some cash and my credit card in my coat pocket."),
            (1, "Make sure you have your house keys before we lock the front door.")
        ]
    ),
    make_conversation(
        "Lost and Found at the Office",
        "Receptionist James helps visitor Linda find her missing items.",
        ["James", "Linda"],
        [
            (0, "Good afternoon. Can I help you find something?"),
            (1, "Yes please, I think I left a personal item in the conference room."),
            (0, "What does your missing belongings look like?"),
            (1, "It is a small blue leather folder with an identity card and a diary inside."),
            (0, "Someone brought a blue folder earlier. Does it have a pen inside?"),
            (1, "Yes! There is a silver pen and a notebook in the front sleeve."),
            (0, "Here it is. We also found a pair of reading glasses nearby."),
            (1, "Those glasses are mine too! Thank you so much for your help.")
        ]
    ),
    make_conversation(
        "Shopping for Accessories",
        "Emma and Chloe browse items in an accessory boutique.",
        ["Chloe", "Emma"],
        [
            (0, "Look at this stylish leather handbag with matching keychain."),
            (1, "It is beautiful, and it has plenty of space for a bottle and tissues."),
            (0, "Do you like this silver bracelet and matching earrings?"),
            (1, "Yes, they look very valuable and elegant with that necklace."),
            (0, "I also want to buy a new phone case and a sturdy cardboard box for my gift."),
            (1, "That is a very useful idea. Does the shop take credit card or only cash?"),
            (0, "They accept both credit card and paper cash, and provide a receipt."),
            (1, "Great, let's pay at the counter and take our receipt.")
        ]
    )
]

d4_paras = [
    make_paragraph(
        "What I Carry Every Day",
        "daily-life description",
        "Every morning before I leave home, I check my personal belongings carefully. I always carry my brown leather wallet with some cash and my credit card. My backpack contains my laptop, a spare charger, wireless headphones, and a clean notebook. In the outer pocket, I keep an umbrella, house keys with a small keychain, and a pack of soft tissues. I also have a reusable water bottle. Having each useful item ready saves me time throughout a busy working day."
    ),
    make_paragraph(
        "A Memorable Birthday Gift",
        "personal story",
        "On my birthday last year, my parents gave me a small wrapped box. Inside, there was a wonderful gift: an antique fountain pen and a leather-bound diary. My sister gave me a silver necklace with a tiny ring pendant, while my brother surprised me with a pair of designer sunglasses. Each valuable item holds sentimental meaning for me. I keep these treasures in a special wooden drawer in my bedroom so that nothing gets lost or missing."
    ),
    make_paragraph(
        "Preparing Important Travel Documents",
        "practical situation",
        "Traveling abroad requires careful organization of every official document. Before going to the airport, I place my passport, national identity card, boarding ticket, and purchase receipt inside a clear plastic folder. I keep my digital camera and tablet safely packed in my carry-on suitcase. It is important to check the battery of each electronic device before departure. When travelers own valuable belongings, keeping them in an inner zippered pocket prevents theft or accidental loss."
    )
]

hws4 = [v["headword"] for v in d4_vocab]
d4_convs = link_vocab(d4_convs, hws4)
d4_paras = link_vocab(d4_paras, hws4)

write_day(4, d4_vocab, d4_grammar, d4_convs, d4_paras)
print("Day 4 written successfully!")
