import json, re

from test_day2 import day2_vocab

vocab_items = []
for item in day2_vocab:
    vocab_items.append({
        "headword": item[0],
        "pronunciation": item[1],
        "partOfSpeech": item[2],
        "definition": item[3],
        "example": item[4],
        "relatedForms": item[5],
        "collocations": item[6],
        "synonyms": item[7],
        "antonyms": item[8],
        "tags": item[9]
    })

day2_data = {
    "day": 2,
    "title": "People and Family",
    "topic": "Family members and relationships",
    "description": "Introduce yourself and describe the people in your family.",
    "stage": "Foundation — Daily Life",
    "focus": "By the end of today, you can introduce yourself and talk about your family members and relationships using the verb be and subject pronouns.",
    "grammar": [
        {
            "title": "Verb be and Subject Pronouns",
            "explanation": "The verb be connects a subject pronoun (I, you, he, she, it, we, they) to a description, name, or status. In the present tense, be has three forms: am, is, and are. We use contractions like I'm, he's, and they're in everyday speech.",
            "structures": [
                {"pattern": "I + am ('m)", "label": "First Person Singular"},
                {"pattern": "He / She / It + is ('s)", "label": "Third Person Singular"},
                {"pattern": "You / We / They + are ('re)", "label": "Plural and Second Person"},
                {"pattern": "Am / Is / Are + subject ...?", "label": "Question Form"},
                {"pattern": "Subject + am not / isn't / aren't", "label": "Negative Form"}
            ],
            "examples": [
                {"sentence": "I am close to my mother.", "usesVocabulary": ["mother", "close"]},
                {"sentence": "He is my older brother and he is very tall.", "usesVocabulary": ["brother", "tall"]},
                {"sentence": "She is a kind person and a loving grandmother.", "usesVocabulary": ["kind", "person", "grandmother"]},
                {"sentence": "They are happy together with their three children.", "usesVocabulary": ["happy", "together", "children"]},
                {"sentence": "Are you married or single?", "usesVocabulary": ["married", "single"]},
                {"sentence": "My parents are not old, but they are wise.", "usesVocabulary": ["parents", "old"]}
            ],
            "commonUsage": [
                "Introducing people: This is my sister Sarah. She is a doctor.",
                "Describing age: My father is fifty years old.",
                "Describing relationship status: He is single, but my brother is married.",
                "Describing character and appearance: They are very friendly and kind."
            ],
            "commonMistakes": [
                {"wrong": "They is my parents.", "right": "They are my parents.", "note": "Use 'are' with plural subject pronouns like they and we."},
                {"wrong": "He are tall.", "right": "He is tall.", "note": "Use 'is' with he, she, and it."},
                {"wrong": "I is a happy person.", "right": "I am a happy person.", "note": "Use 'am' with I."},
                {"wrong": "She have twenty years old.", "right": "She is twenty years old.", "note": "In English, use the verb 'be' to state age, not have."}
            ]
        }
    ],
    "vocabulary": vocab_items,
    "conversations": [
        {
            "title": "Looking at Family Photos",
            "setting": "Emily shows a photo album to her colleague Mark in the break room.",
            "lines": [
                {"speaker": "Mark", "text": "Is this a photo of your family on holiday?"},
                {"speaker": "Emily", "text": "Yes, it is! Let me introduce them. This is my mother and that is my father."},
                {"speaker": "Mark", "text": "Your mother has a warm smile. Do you look like her?"},
                {"speaker": "Emily", "text": "People say I look like my mother, but my brother looks like our father."},
                {"speaker": "Mark", "text": "Is your brother tall? He looks like a teenager in this picture."},
                {"speaker": "Emily", "text": "Yes, my brother is very tall now, though he was young in that picture."},
                {"speaker": "Mark", "text": "Who is the child sitting beside your grandparents?"},
                {"speaker": "Emily", "text": "That baby is my little niece! She is very sweet and we all love her."}
            ],
            "vocabularyUsed": ["photo", "family", "introduce", "mother", "father", "smile", "look like", "people", "brother", "tall", "teenager", "young", "child", "grandparents", "baby", "niece", "love"]
        },
        {
            "title": "Meeting the New Neighbor",
            "setting": "David talks to his new neighbor Mrs. Jenkins near their garden gate.",
            "lines": [
                {"speaker": "Mrs. Jenkins", "text": "Good morning! It is nice to see a friendly face in the neighborhood."},
                {"speaker": "David", "text": "Good morning! I am your new neighbor from number four. Are you living here alone?"},
                {"speaker": "Mrs. Jenkins", "text": "My husband and I live here together. Our children are grown adults now."},
                {"speaker": "David", "text": "That sounds lovely. How many children do you have?"},
                {"speaker": "Mrs. Jenkins", "text": "We have one son and one daughter, and they are both married."},
                {"speaker": "David", "text": "Do they live nearby with your grandchildren?"},
                {"speaker": "Mrs. Jenkins", "text": "Yes, our son has a young baby and twin boys, so every family member is very busy!"},
                {"speaker": "David", "text": "You must be a very proud grandmother. Let me know if you need any help."}
            ],
            "vocabularyUsed": ["friendly face", "neighbor", "husband", "together", "children", "adult", "son", "daughter", "married", "baby", "twin", "member", "family", "grandmother"]
        },
        {
            "title": "Talking About Relatives",
            "setting": "Sara and her partner Leo talk while having evening tea.",
            "lines": [
                {"speaker": "Sara", "text": "My aunt and uncle called this afternoon. They want to visit us."},
                {"speaker": "Leo", "text": "Which aunt? The one who lives with your cousin in Bristol?"},
                {"speaker": "Sara", "text": "Yes! Aunt Claire. She is a very kind and smart person."},
                {"speaker": "Leo", "text": "Is her son coming too? He is a funny teenager now."},
                {"speaker": "Sara", "text": "Yes, and my nephew will join them for the weekend trip."},
                {"speaker": "Leo", "text": "Our home will be full! Are you close to your cousin?"},
                {"speaker": "Sara", "text": "We are very close. We are the same age and we love spending time together."},
                {"speaker": "Leo", "text": "Wonderful! We are always happy when your relatives visit."}
            ],
            "vocabularyUsed": ["aunt", "uncle", "cousin", "kind", "smart", "person", "son", "teenager", "nephew", "close", "age", "love", "together", "happy", "relative"]
        }
    ],
    "paragraphs": [
        {
            "title": "My Extended Family",
            "kind": "personal story",
            "text": "Family is the center of my life. My parents live in a small town with my grandfather and grandmother. I have an older sister who is married to a wonderful husband, and they have a baby daughter and a young son. My brother is still single and lives in the city. We are a close family, and every member stays in touch. When we gather together, our aunt, uncle, and cousin also join the party. We share delicious food, look at old photos, and laugh for hours. I truly love every relative in our family.",
            "vocabularyUsed": ["family", "parents", "grandfather", "grandmother", "sister", "married", "husband", "baby", "daughter", "young", "son", "brother", "single", "close", "member", "together", "aunt", "uncle", "cousin", "photo", "love", "relative"]
        },
        {
            "title": "Describing the People I Love",
            "kind": "daily-life description",
            "text": "Every person in my household has a distinct character. My father is tall and quiet, but he is very kind. My mother is short and energetic, with a friendly smile that brightens any room. My twin brothers are identical, but their personalities are different: one is smart and reads books all day, while the other is an active teenager who plays football. Although we argue sometimes, we are happy together. Our elderly neighbor often says we are the most friendly family on the street.",
            "vocabularyUsed": ["person", "father", "tall", "kind", "mother", "short", "friendly", "smile", "twin", "brother", "smart", "teenager", "happy", "together", "neighbor", "family"]
        },
        {
            "title": "A Special Family Milestone",
            "kind": "narrative",
            "text": "Last Sunday, my grandparents celebrated fifty years of marriage. All forty people at the celebration were relatives or close friends. My mother took the microphone to introduce my grandfather and grandmother to the young children. My cousin played the piano, and my nephew and niece danced together on the floor. It was wonderful to see adults, teenagers, and babies sharing such joy. Seeing my grandparents smile at each other reminded me why family bonds are so important at any age.",
            "vocabularyUsed": ["grandparents", "married", "people", "relative", "close", "mother", "introduce", "grandfather", "grandmother", "young", "children", "cousin", "nephew", "niece", "together", "adult", "teenager", "baby", "smile", "family", "age"]
        }
    ]
}

with open("content/day-02.json", "w") as f:
    json.dump(day2_data, f, indent=2)

print("Created content/day-02.json successfully")
