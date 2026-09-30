# -*- coding: utf-8 -*-
"""Verification script for Stage 8 (Days 71-80) candidate headwords."""

import json, glob

def load_existing():
    existing = {}
    for f in sorted(glob.glob("content/day-*.json")):
        with open(f, "r", encoding="utf-8") as fp:
            d = json.load(fp)
            for v in d["vocabulary"]:
                hw = v["headword"].strip().lower()
                existing[hw] = d["day"]
    return existing

candidates = {
    71: [
        "present an argument", "counter-argument", "rebut claim", "logical fallacy", "fallacious reasoning",
        "argumentative flaw", "burden of proof", "devil's advocate", "steel man", "crux of debate",
        "open floor", "moderator role", "panelist", "proposition side", "opposition bench",
        "formal debate", "point of order", "raise an objection", "overrule objection", "closing statement",
        "opening statement", "motion carried", "motion defeated", "casting vote", "speaker's podium",
        "floor speaker", "deliberative assembly", "parliamentary procedure", "on the contrary", "by the same token",
        "conversely", "notwithstanding", "with that said", "to that end", "by extension",
        "draw a distinction", "nuanced position", "categorical claim", "empirical evidence", "anecdotal evidence",
        "cherry-picking", "confirmation bias", "false premise", "begging the question", "false dichotomy",
        "appeal to authority", "post hoc fallacy", "sweeping claim", "circular reasoning", "reductio ad absurdum"
    ],
    72: [
        "breaking story", "headline news", "on-the-ground reporting", "embedded journalist", "news conference",
        "media blackout", "press agent", "journalistic freedom", "editorial slant", "sensationalism",
        "fact-checker", "source verification", "background briefing", "exclusive scoop", "news feed",
        "news syndicate", "press corps", "foreign correspondent", "bureau chief", "photo essay",
        "citizen journalism", "first-hand account", "official communique", "press release", "news aggregator",
        "digital newsroom", "paparazzi", "tabloid journalism", "quality newspaper", "investigative piece",
        "whistleblower protection", "news embargo", "retraction notice", "correction published", "journalistic integrity",
        "named source", "attributed quote", "unverified claim", "clickbait headline", "news cycle",
        "round-the-clock news", "opinion columnist", "editorial independence", "public broadcaster", "state-controlled media",
        "independent press", "watchdog journalism", "press accreditation", "news framing", "misinformation campaign"
    ],
    73: [
        "executive summary", "minutes of meeting", "standing agenda", "open action point", "follow-up task",
        "deliverable deadline", "stakeholder update", "due diligence report", "memo of understanding", "non-disclosure clause",
        "scope of work", "terms of reference", "initiative roadmap", "risk register", "issue log",
        "change request", "sign-off authority", "escalation path", "organizational chart", "reporting line",
        "dotted-line reporting", "matrix organization", "cross-functional team", "working group", "task force",
        "key performance indicator", "balanced scorecard", "benchmarking exercise", "gap analysis", "needs assessment",
        "corrective action report", "preventive measure", "knowledge transfer", "onboarding process", "offboarding checklist",
        "exit interview", "appraisal cycle", "360-degree feedback", "stretch goal", "professional development plan",
        "mentoring relationship", "coaching session", "competency framework", "succession planning", "talent pipeline",
        "workforce planning", "organizational development", "change management", "business continuity plan", "internal audit"
    ],
    74: [
        "algorithmic bias", "data sovereignty", "digital divide", "surveillance capitalism", "platform economy",
        "gig economy worker", "artificial general intelligence", "machine learning model", "neural network", "deep learning",
        "natural language processing", "computer vision", "autonomous vehicle", "drone delivery", "smart city",
        "internet of things", "edge computing", "quantum computing", "blockchain ledger", "decentralized finance",
        "non-fungible token", "augmented reality", "virtual reality", "mixed reality", "digital twin",
        "predictive analytics", "big data analytics", "cloud migration", "zero-day vulnerability", "ransomware attack",
        "phishing attempt", "multi-step verification", "end-to-end encryption", "open-source software", "proprietary system",
        "tech monopoly", "antitrust regulation", "digital regulation", "net neutrality", "content moderation",
        "algorithmic transparency", "explainable AI", "responsible AI", "tech ethics", "digital wellbeing",
        "screen time", "attention economy", "filter bubble", "echo chamber", "data exhaust"
    ],
    75: [
        "civic engagement", "grassroots movement", "community organizing", "social capital", "collective action",
        "civil society", "advocacy group", "lobbying effort", "pressure group", "think tank",
        "policy brief", "public consultation", "town hall meeting", "neighborhood watch", "community policing",
        "social cohesion", "community resilience", "voluntary sector", "charitable foundation", "philanthropic giving",
        "corporate citizenship", "environmental stewardship", "social enterprise", "community benefit", "public goods",
        "common good", "intergenerational equity", "social mobility", "upward mobility", "glass ceiling",
        "systemic inequality", "digital inclusion", "rural connectivity", "urban regeneration", "gentrification",
        "affordable housing", "social housing", "homelessness crisis", "food bank", "community kitchen",
        "mutual aid", "peer support", "social prescribing", "wellbeing economy", "circular economy",
        "sustainable development goal", "green infrastructure", "blue-green space", "participatory budgeting", "community empowerment"
    ],
    76: [
        "narrative arc", "story twist", "cliffhanger", "foreshadowing", "flashback",
        "unreliable narrator", "omniscient narrator", "stream of consciousness", "dramatic irony", "comic relief",
        "protagonist journey", "antagonist motive", "supporting character", "backstory", "subplot",
        "rising action", "falling action", "climactic moment", "denouement", "narrative tension",
        "suspense build-up", "hook opening", "exposition", "rising stakes", "narrative voice",
        "point of view", "first-person narrator", "third-person limited", "frame narrative", "embedded story",
        "anecdote opening", "vivid description", "sensory detail", "figurative language", "metaphorical expression",
        "simile usage", "personification", "hyperbole effect", "understatement", "ironic twist",
        "surprise ending", "ambiguous ending", "open-ended conclusion", "poetic license", "creative nonfiction",
        "memoir writing", "storytelling craft", "narrative coherence", "compelling narrative", "authorial intent"
    ],
    77: [
        "measured opinion", "tentative assertion", "categorical statement", "sweeping generalization", "qualified statement",
        "hedging language", "epistemic marker", "in my estimation", "from my vantage point", "as far as I can tell",
        "to the best of my knowledge", "it stands to reason", "suffice to say", "by all accounts", "on reflection",
        "upon further consideration", "at first blush", "on closer inspection", "taken as a whole", "broadly speaking",
        "speaking frankly", "to put it plainly", "to put it mildly", "to say the least", "if anything",
        "in a manner of speaking", "so to speak", "in no uncertain terms", "without reservation", "with all due respect",
        "give pause for thought", "charitable interpretation", "weigh all sides", "zoom out", "big picture thinking",
        "nuanced view", "considered judgment", "intellectual humility", "epistemic humility", "open-minded approach",
        "critical thinking", "analytical reasoning", "fair-minded assessment", "even-handed analysis", "dispassionate view",
        "impartial standpoint", "balanced perspective", "well-reasoned argument", "value judgment", "preconceived notion"
    ],
    78: [
        "mixed conditional", "counterfactual reasoning", "hypothetical scenario", "what-if analysis", "scenario planning",
        "alternate outcome", "unforeseen consequence", "perverse incentive", "path dependency", "lock-in effect",
        "sunk cost fallacy", "opportunity cost", "leverage analysis", "trade-off decision", "risk-reward ratio",
        "diminishing returns", "economies of scale", "inflection point", "threshold effect", "virtuous cycle",
        "vicious cycle", "second-order effect", "contagion effect", "cascading failure", "systemic risk",
        "moral hazard", "adverse selection", "principal-agent problem", "collective dilemma", "coordination problem",
        "race to the bottom", "tragedy of the commons", "prisoner's dilemma", "zero-sum game", "positive-sum game",
        "Nash equilibrium", "dominant strategy", "co-operative solution", "negotiated outcome", "structured bargaining",
        "principled negotiation", "BATNA", "zone of possible agreement", "integrative bargaining", "distributive bargaining",
        "logrolling", "package deal", "side payment", "best alternative", "win-win negotiation"
    ],
    79: [
        "ellipsis", "tag question", "discourse particle", "filler word", "hedging expression",
        "vague language", "approximator", "softening device", "face-saving strategy", "indirect speech act",
        "implicature", "conversational maxim", "turn-taking signal", "back-channeling", "repair strategy",
        "reformulation", "self-correction", "false start", "filled pause", "unfilled pause",
        "topic shift", "topic change marker", "phatic communion", "small talk formula", "formulaic expression",
        "idiom in context", "colloquial register", "informal contraction", "elided form", "reduced clause",
        "fronting structure", "cleft sentence", "existential there", "dummy subject", "impersonal it",
        "rhetorical question", "indirect question", "exclamative structure", "emphatic do", "broad negative",
        "invariant tag", "response token", "minimal response", "agreement signal", "repair initiator",
        "comprehension check", "spoken discourse", "conversational coherence", "interactional routine", "everyday idiom"
    ],
    80: [
        "register awareness", "contextual appropriacy", "pragmatic competence", "discourse coherence", "textual cohesion",
        "lexical density", "syntactic complexity", "semantic precision", "communicative fluency", "interactional competence",
        "sociolinguistic awareness", "cross-cultural communication", "intercultural competence", "language transfer", "fossilized error",
        "interlanguage", "explicit instruction", "implicit learning", "incidental learning", "deliberate vocabulary study",
        "lexical chunk", "collocational knowledge", "phraseological unit", "multiword expression", "fixed expression",
        "semi-fixed expression", "productive knowledge", "receptive knowledge", "depth of processing", "spaced practice",
        "retrieval practice", "elaborative interrogation", "self-explanation technique", "dual coding", "worked example",
        "problem-based learning", "task-based instruction", "communicative approach", "noticing hypothesis", "comprehensible input",
        "output hypothesis", "interaction hypothesis", "negotiation of meaning", "language awareness", "critical language study",
        "applied linguistics", "corpus-based learning", "authentic material", "language portfolio", "self-assessment rubric"
    ]
}

existing = load_existing()
print(f"Existing total: {len(existing)}")

all_new = {}
errors = []

for day, words in candidates.items():
    if len(words) != 50:
        errors.append(f"Day {day} has {len(words)} words, expected 50.")
    seen_in_day = set()
    for w in words:
        wn = w.strip().lower()
        if wn in seen_in_day:
            errors.append(f"Day {day} internal duplicate: '{w}'")
        seen_in_day.add(wn)
        if wn in existing:
            errors.append(f"Day {day} '{w}' clashes with Day {existing[wn]}")
        if wn in all_new:
            errors.append(f"Day {day} '{w}' cross-day duplicate with Day {all_new[wn]}")
        else:
            all_new[wn] = day

if errors:
    print(f"\nFAILED with {len(errors)} error(s):")
    for e in errors[:30]:
        print(" -", e)
else:
    print(f"\nSUCCESS: All {len(all_new)} candidate headwords across {len(candidates)} days are 100% unique!")
