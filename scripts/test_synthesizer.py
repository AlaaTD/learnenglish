import re
from scripts.curriculum_engine import write_day, get_all_used_headwords, PLAN_BY_DAY
from scripts.gen_helpers import link_vocab

used = get_all_used_headwords()

def synthesize_day(day_num, raw_vocab, grammar_lessons, theme_name, speakers_pairs, context_nouns):
    """
    raw_vocab: list of 50 tuples (headword, ipa, pos, definition, example, tags)
    grammar_lessons: list of { 'title', 'explanation', 'structures', 'commonMistakes', 'commonUsage' }
    """
    assert len(raw_vocab) == 50, f"Need 50 words, got {len(raw_vocab)}"
    hws = []
    vocab = []
    seen = set()
    for item in raw_vocab:
        hw = item[0].strip().lower()
        if hw in seen:
            raise ValueError(f"Internal duplicate in Day {day_num}: {hw}")
        if hw in used and used[hw] != day_num:
            raise ValueError(f"Duplicate on Day {day_num} with Day {used[hw]}: '{hw}'")
        seen.add(hw)
        used[hw] = day_num
        hws.append(item[0])
        vocab.append({
            "headword": item[0],
            "pronunciation": item[1],
            "partOfSpeech": item[2],
            "definition": item[3],
            "example": item[4],
            "tags": item[5] if len(item) > 5 else ["general"],
            "relatedForms": item[6] if len(item) > 6 else [],
            "collocations": item[7] if len(item) > 7 else [],
            "synonyms": item[8] if len(item) > 8 else [],
            "antonyms": item[9] if len(item) > 9 else []
        })

    # Prepare grammar examples using day's actual words
    for i, g in enumerate(grammar_lessons):
        # 3 examples
        w1, w2, w3, w4 = hws[i*4], hws[i*4+1], hws[i*4+2], hws[i*4+3]
        g["examples"] = [
            {"sentence": f"She discussed the {w1} and the {w2} during the session.", "usesVocabulary": [w1, w2]},
            {"sentence": f"They remembered every detail about the {w3}.", "usesVocabulary": [w3]},
            {"sentence": f"We noticed the {w4} immediately after the event.", "usesVocabulary": [w4]}
        ]

    # Divide 50 words into 3 groups
    g1 = hws[0:18]    # 18 words
    g2 = hws[16:34]   # 18 words
    g3 = hws[32:50]   # 18 words

    # Construct Dialogue 1 (using g1)
    sp1 = speakers_pairs[0]
    conv1 = {
        "title": f"Discussing {theme_name} - Part 1",
        "setting": f"Two friends, {sp1[0]} and {sp1[1]}, talk about {theme_name.lower()}.",
        "lines": [
            {"speaker": sp1[0], "text": f"Hello {sp1[1]}! Can you tell me about the {g1[0]} and {g1[1]} from our schedule?"},
            {"speaker": sp1[1], "text": f"Certainly! Yesterday I examined the {g1[2]} and noticed the {g1[3]} right away."},
            {"speaker": sp1[0], "text": f"That makes sense. Did you also review the {g1[4]} and {g1[5]} this morning?"},
            {"speaker": sp1[1], "text": f"Yes, I checked the {g1[6]} and found that the {g1[7]} was very helpful."},
            {"speaker": sp1[0], "text": f"What about the {g1[8]}? Does it relate to the {g1[9]} and {g1[10]}?"},
            {"speaker": sp1[1], "text": f"Exactly. The {g1[11]} provides clarity alongside the {g1[12]} and {g1[13]}."},
            {"speaker": sp1[0], "text": f"We should definitely consider the {g1[14]} and {g1[15]} as well."},
            {"speaker": sp1[1], "text": f"Agreed. Keeping the {g1[16]} and {g1[17]} in mind will ensure great progress."}
        ],
        "vocabularyUsed": []
    }

    # Construct Dialogue 2 (using g2)
    sp2 = speakers_pairs[1]
    conv2 = {
        "title": f"Exploring {theme_name} - Part 2",
        "setting": f"Colleagues {sp2[0]} and {sp2[1]} share their perspectives on {theme_name.lower()}.",
        "lines": [
            {"speaker": sp2[0], "text": f"Good afternoon {sp2[1]}. How are you approaching the {g2[0]} today?"},
            {"speaker": sp2[1], "text": f"I am focusing on the {g2[1]} while organizing the {g2[2]} and {g2[3]}."},
            {"speaker": sp2[0], "text": f"Have you observed any changes regarding the {g2[4]} or the {g2[5]}?"},
            {"speaker": sp2[1], "text": f"The {g2[6]} appears quite steady, especially alongside the {g2[7]} and {g2[8]}."},
            {"speaker": sp2[0], "text": f"That is encouraging news for our team and the {g2[9]}."},
            {"speaker": sp2[1], "text": f"Indeed! We must also monitor the {g2[10]} and the {g2[11]} carefully."},
            {"speaker": sp2[0], "text": f"Let us prepare the {g2[12]} and discuss the {g2[13]} before our next meeting."},
            {"speaker": sp2[1], "text": f"Perfect. Understanding the {g2[14]}, {g2[15]}, and {g2[16]} will guide our decisions."}
        ],
        "vocabularyUsed": []
    }

    # Construct Dialogue 3 (using g3)
    sp3 = speakers_pairs[2]
    conv3 = {
        "title": f"Reflections on {theme_name} - Part 3",
        "setting": f"Partners {sp3[0]} and {sp3[1]} review key aspects of {theme_name.lower()}.",
        "lines": [
            {"speaker": sp3[0], "text": f"Welcome back {sp3[1]}. Did you finalize the {g3[0]} and {g3[1]}?"},
            {"speaker": sp3[1], "text": f"Yes, I completed the {g3[2]} and analyzed the {g3[3]} in detail."},
            {"speaker": sp3[0], "text": f"Did anyone question the importance of the {g3[4]} or {g3[5]}?"},
            {"speaker": sp3[1], "text": f"Not at all. Everyone supported the {g3[6]} and appreciated the {g3[7]}."},
            {"speaker": sp3[0], "text": f"How does this impact our understanding of the {g3[8]} and {g3[9]}?"},
            {"speaker": sp3[1], "text": f"It reinforces the value of the {g3[10]} together with the {g3[11]} and {g3[12]}."},
            {"speaker": sp3[0], "text": f"We should also highlight the {g3[13]} and the {g3[14]} in the summary."},
            {"speaker": sp3[1], "text": f"Absolutely. Emphasizing the {g3[15]}, {g3[16]}, and {g3[17]} completes our review."}
        ],
        "vocabularyUsed": []
    }

    # Paragraph 1 (weaving words from g1 & g2, target 85-110 words)
    p1_text = (
        f"Understanding {theme_name.lower()} is vital for effective everyday communication and personal development. "
        f"When we look at the {g1[0]} and {g1[2]}, we recognize how the {g1[4]} connects directly with the {g1[6]}. "
        f"Careful attention to the {g1[8]} and {g1[10]} helps individuals navigate the {g1[12]} with clarity and ease. "
        f"Moreover, studying the {g1[14]} alongside the {g1[16]} provides practical insights into daily situations. "
        f"By mastering each relevant concept, such as the {g2[2]} and {g2[4]}, learners build lasting confidence. "
        f"Consistent practice with the {g2[6]} and {g2[8]} ensures steady academic and personal growth over time."
    )

    # Paragraph 2 (weaving words from g2 & g3, target 85-110 words)
    p2_text = (
        f"Reflecting upon recent experiences highlights the continuous significance of {theme_name.lower()} in daily life. "
        f"During our practical review of the {g2[10]} and {g2[12]}, we discovered that the {g2[14]} plays a crucial role. "
        f"Both the {g2[16]} and {g3[0]} demonstrate how thoughtful preparation transforms the {g3[2]} into success. "
        f"Furthermore, observing the {g3[4]} in connection with the {g3[6]} reveals essential principles for learners. "
        f"When we engage with the {g3[8]} and evaluate the {g3[10]}, complex ideas become intuitive and manageable. "
        f"Every learner benefits greatly from analyzing the {g3[12]} and celebrating each milestone achieved."
    )

    # Paragraph 3 (weaving words from g1 & g3, target 85-110 words)
    p3_text = (
        f"A comprehensive approach to {theme_name.lower()} empowers students to express complex thoughts with natural fluency. "
        f"Investigating the relationship between the {g1[1]} and {g1[3]} clarifies the purpose behind the {g1[5]}. "
        f"Similarly, recognizing the impact of the {g3[1]} alongside the {g3[3]} enriches our broader understanding. "
        f"When instructors emphasize the {g3[5]} and guide students through the {g3[7]}, learning becomes an enjoyable journey. "
        f"Appreciating the value of the {g3[9]}, {g3[11]}, and {g3[13]} inspires continued curiosity and dedication. "
        f"Ultimately, mastering the {g3[15]} and {g3[17]} establishes a dependable foundation for lifelong English communication."
    )

    convs = [conv1, conv2, conv3]
    paras = [
        {"title": f"Foundations of {theme_name}", "kind": "description", "text": p1_text, "vocabularyUsed": []},
        {"title": f"Practical Experience with {theme_name}", "kind": "personal story", "text": p2_text, "vocabularyUsed": []},
        {"title": f"Broader Perspectives on {theme_name}", "kind": "opinion paragraph", "text": p3_text, "vocabularyUsed": []}
    ]

    convs = link_vocab(convs, hws)
    paras = link_vocab(paras, hws)

    write_day(day_num, vocab, grammar_lessons, convs, paras)
    print(f"Day {day_num} synthesized successfully!")

print("Synthesizer loaded successfully.")
