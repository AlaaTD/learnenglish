# Helper functions for generating dialogues, paragraphs, and IPA pronunciations
import random

def make_conversation(title, setting, speakers, lines_data):
    """
    lines_data: list of (speaker_idx, text)
    """
    lines = [{"speaker": speakers[s_idx], "text": text} for s_idx, text in lines_data]
    return {
        "title": title,
        "setting": setting,
        "lines": lines,
        "vocabularyUsed": []
    }

def make_paragraph(title, kind, text):
    return {
        "title": title,
        "kind": kind,
        "text": text,
        "vocabularyUsed": []
    }

def link_vocab(items, vocab_headwords):
    # Finds which headwords from vocab_headwords appear in the text/lines of the item
    headword_set = {w.lower(): w for w in vocab_headwords}
    # Sort by length descending to match longest phrase first
    sorted_words = sorted(headword_set.keys(), key=lambda x: -len(x))
    
    for item in items:
        if "lines" in item:
            full_text = " ".join(line["text"] for line in item["lines"]).lower()
        else:
            full_text = item["text"].lower()
            
        used = []
        for w in sorted_words:
            # Word boundary search
            import re
            pattern = r'\b' + re.escape(w) + r'\b'
            if re.search(pattern, full_text):
                used.append(headword_set[w])
        item["vocabularyUsed"] = used
    return items
