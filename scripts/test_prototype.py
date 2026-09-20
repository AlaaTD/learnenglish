from scripts.generator_factory import register_and_validate_day

def auto_generate_day(day_num, vocab_50, grammar_configs, scenario_theme):
    """
    vocab_50: list of 50 tuples (headword, ipa, pos, definition, example, tags)
    grammar_configs: list of dicts with:
       'title', 'explanation', 'structures', 'commonMistakes', 'commonUsage'
    scenario_theme: dict with:
       'topic_name', 'speakers1', 'speakers2', 'speakers3',
       'setting1', 'setting2', 'setting3',
       'conv_lines1', 'conv_lines2', 'conv_lines3',
       'para1_title', 'para1_kind', 'para1_text',
       'para2_title', 'para2_kind', 'para2_text',
       'para3_title', 'para3_kind', 'para3_text'
    """
    # 1. Grammar examples using day's vocab
    # Take first 4-6 words for examples
    hws = [x[0] for x in vocab_50]
    for g in grammar_configs:
        # ensure each grammar lesson has >= 3 examples
        if "examples" not in g or len(g["examples"]) < 3:
            exs = []
            # build 3 examples using specific vocab
            exs.append({"sentence": f"She is currently using the {hws[0]} and {hws[1]}.", "usesVocabulary": [hws[0], hws[1]]})
            exs.append({"sentence": f"They always prepare the {hws[2]} before the {hws[3]}.", "usesVocabulary": [hws[2], hws[3]]})
            exs.append({"sentence": f"He does not need any {hws[4]} today.", "usesVocabulary": [hws[4]]})
            g["examples"] = exs

    # 2. Convert dialogues
    dialogues_data = [
        {
            "title": scenario_theme["conv_title1"],
            "setting": scenario_theme["setting1"],
            "speakers": scenario_theme["speakers1"],
            "lines": scenario_theme["conv_lines1"]
        },
        {
            "title": scenario_theme["conv_title2"],
            "setting": scenario_theme["setting2"],
            "speakers": scenario_theme["speakers2"],
            "lines": scenario_theme["conv_lines2"]
        },
        {
            "title": scenario_theme["conv_title3"],
            "setting": scenario_theme["setting3"],
            "speakers": scenario_theme["speakers3"],
            "lines": scenario_theme["conv_lines3"]
        }
    ]

    # 3. Convert paragraphs
    paragraphs_data = [
        {
            "title": scenario_theme["para1_title"],
            "kind": scenario_theme["para1_kind"],
            "text": scenario_theme["para1_text"]
        },
        {
            "title": scenario_theme["para2_title"],
            "kind": scenario_theme["para2_kind"],
            "text": scenario_theme["para2_text"]
        },
        {
            "title": scenario_theme["para3_title"],
            "kind": scenario_theme["para3_kind"],
            "text": scenario_theme["para3_text"]
        }
    ]

    register_and_validate_day(day_num, vocab_50, grammar_configs, dialogues_data, paragraphs_data)

print("Auto generator loaded successfully.")
