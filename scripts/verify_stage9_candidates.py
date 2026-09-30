# -*- coding: utf-8 -*-
"""Verification script for Stage 9 (Days 81-90) candidate headwords."""

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
    81: [  # Day 81: A Week in My Life (Integrating daily life topics)
        "morning ritual", "evening wind-down", "midweek slump", "weekend reset", "weekly meal prep",
        "habit tracker", "daily commute routine", "time-blocking method", "chore schedule", "errand run",
        "grocery haul", "laundry day", "deep clean routine", "mid-afternoon recharge", "digital detox hour",
        "morning stretch", "lunch break stroll", "bedtime reading", "early bird wake-up", "night owl habit",
        "desk decluttering", "planner check-in", "batch cooking", "pantry restocking", "trash collection day",
        "family dinner night", "leisure evening", "recharge routine", "Sunday planning session", "fitness regimen",
        "hydration habit", "screen-free morning", "commute playlist", "wardrobe prep", "budget check",
        "inbox zero goal", "daily journaling", "dog walking route", "coffee brewing ritual", "tea break pause",
        "home cooked meal", "quick tidy-up", "relaxation ritual", "midday stretch", "evening walk",
        "bedtime wind-down routine", "productive sprint", "unwind session", "schedule buffer", "balanced day"
    ],
    82: [  # Day 82: Work and Dreams (Career and ambitions)
        "career aspiration", "dream vocation", "passion project", "side venture", "vocational calling",
        "portfolio career", "career pivot", "entrepreneurial ambition", "lifelong ambition", "professional milestone",
        "creative endeavor", "stepping stone role", "dream job", "freelance journey", "business venture",
        "personal brand", "industry recognition", "career breakthrough", "founding story", "vision manifesto",
        "startup dream", "professional legacy", "bold career leap", "niche expertise", "consulting practice",
        "creative autonomy", "work fulfillment", "meaningful work", "calling in life", "climbing the ladder",
        "glass ceiling breaker", "entrepreneurial mindset", "career trajectory", "industry pioneer", "breakthrough role",
        "professional pinnacle", "strategic career move", "unconventional career", "passion-driven work", "career reinvention",
        "professional calling", "commercial success", "creative fulfillment", "dream pursuit", "industry acclaim",
        "hallmark achievement", "purpose-driven career", "career independence", "business mastermind", "visionary goal"
    ],
    83: [  # Day 83: People Who Shaped Me (Influential people and memories)
        "formative mentor", "guiding light", "role model figure", "inspiring teacher", "childhood companion",
        "fatherly wisdom", "motherly warmth", "grandparent legacy", "trusted confidant", "pillar of strength",
        "ethical lodestar", "unwavering support", "lifelong ally", "inspirational figure", "generous benefactor",
        "firm disciplinarian", "empathetic listener", "sympathetic soul", "wise elder", "family anchor",
        "mentor figure", "unsung hero", "positive influence", "nurturing guide", "source of comfort",
        "formative influence", "treasured memory", "unforgettable teacher", "guardian angel", "guiding hand",
        "patient instructor", "supportive peer", "loyal companion", "humble role model", "sympathetic mentor",
        "cherished elder", "trusted advisor", "motivational coach", "forgiving parent", "courageous pioneer",
        "generous soul", "beloved relative", "compassionate friend", "encouraging mentor", "faithful confidant",
        "inspiring leader", "selfless volunteer", "steadfast friend", "wise counselor", "formative bond"
    ],
    84: [  # Day 84: Travel Stories (Journeys and memories)
        "scenic detour", "breathtaking vista", "mountain pass trek", "winding coastal road", "remote village stay",
        "train journey memory", "missed connection mishap", "lost luggage adventure", "unplanned detour", "hidden gem discovery",
        "vibrant bazaar visit", "historic landmark tour", "local homestay", "off-the-beaten-track route", "cultural immersion trip",
        "picturesque alleyway", "sun-drenched coastline", "rugged mountain trail", "bustling night market", "tranquil lakeside retreat",
        "ancient ruins exploration", "cross-country road trip", "overnight sleeper train", "quaint harbor village", "desert dune safari",
        "backpacking expedition", "ferry crossing experience", "charming seaside cafe", "bumpy dirt track", "panoramic lookout point",
        "local food tasting", "spontaneous itinerary", "bilingual tour guide", "harrowing flight delay", "scenic overlook stop",
        "remote hiking trail", "peaceful countryside escape", "historic cobblestone street", "tropical island getaway", "cultural festival experience",
        "mountain peak ascent", "local hospitality gesture", "travel journal entry", "unforgettable travel memory", "winding riverboat cruise",
        "lively street scene", "majestic waterfall visit", "foggy morning drive", "traditional handicraft market", "sunset horizon view"
    ],
    85: [  # Day 85: Technology in My Life (Personal technology integration)
        "smart home device", "cloud backup service", "wearable fitness tracker", "virtual meeting tool", "digital note-taking app",
        "wireless earbud convenience", "smartphone addiction check", "automated backup routine", "smart home thermostat", "app notification clutter",
        "home office setup", "digital cleanup session", "paperless office shift", "smart assistant prompt", "high-speed broadband plan",
        "online banking app", "streaming subscription", "password manager tool", "software update alert", "ergonomic workspace gadget",
        "remote desktop tool", "digital clutter removal", "dual-monitor workstation", "tech troubleshooting step", "portable power bank",
        "smart lighting preset", "e-reader screen", "noise-canceling headset", "voice dictation feature", "cloud storage sync",
        "mobile payment convenience", "smart calendar reminder", "device battery lifespan", "screen glare filter", "tech-free evening",
        "smart home hub", "digital declutter routine", "backup hard drive", "touchscreen responsiveness", "app ecosystem integration",
        "video conferencing background", "smart door lock", "wearable health metric", "cable management solution", "digital workspace setup",
        "personal cloud server", "automated workflow trigger", "wi-fi signal booster", "digital productivity suite", "device sync status"
    ],
    86: [  # Day 86: Health and Choices (Lifestyle decisions)
        "mindful eating habit", "restorative sleep cycle", "daily step target", "balanced meal plate", "hydration routine",
        "stress relief practice", "mindfulness meditation session", "morning stretching routine", "healthy snack swap", "outdoor cardio workout",
        "preventative check-up", "mental health day", "posture correction habit", "sugar intake reduction", "strength training routine",
        "herbal tea habit", "guided breathing exercise", "active recovery day", "clean eating philosophy", "sleep quality tracker",
        "walking lunch break", "daily meditation practice", "portion control strategy", "home workout circuit", "fresh fruit intake",
        "sedentary habit reduction", "evening herbal brew", "ergonomic seating choice", "screen break habit", "positive lifestyle change",
        "mindful breathing technique", "whole grain diet", "immune system boost", "daily wellness routine", "weekend hike tradition",
        "mental clarity exercise", "balanced lifestyle choice", "sleep routine discipline", "caloric balance awareness", "morning sunlight exposure",
        "stretching exercise break", "healthy habit streak", "refined sugar avoidance", "physical wellness check", "body flexibility routine",
        "mindful walking stroll", "healthy cooking choice", "deep relaxation technique", "daily health commitment", "vitality restoration"
    ],
    87: [  # Day 87: Modern Life and Opinions (Society today)
        "modern fast pace", "urban loneliness trend", "consumerism culture", "remote work flexibility", "social media influence",
        "generational viewpoint", "sustainable lifestyle choice", "workplace diversity push", "minimalist living philosophy", "commuter stress factor",
        "digital social connection", "ethical shopping habit", "modern etiquette norm", "work-life boundary setting", "civic awareness surge",
        "community volunteer spirit", "environmental consciousness shift", "online discourse civility", "cashless society trend", "modern family dynamic",
        "urban living challenge", "shared mobility option", "fast fashion critique", "cultural heritage preservation", "public transit upgrade",
        "digital citizenship norm", "intergenerational dialogue", "neighborhood solidarity sense", "modern lifestyle debate", "mindful consumption trend",
        "social cohesion effort", "eco-friendly daily choice", "public space revitalization", "healthy boundary practice", "cultural dialogue bridge",
        "modern parenting approach", "civic responsibility sense", "balanced life perspective", "urban greening campaign", "contemporary society trend",
        "digital age dilemma", "community mutual respect", "sustainable consumption ethic", "modern society challenge", "workplace culture evolution",
        "ethical consumer stance", "social responsibility awareness", "shared community value", "public dialogue tone", "thoughtful civic perspective"
    ],
    88: [  # Day 88: Plans and Possibilities (Future plans and hypotheticals)
        "long-range plan", "five-year horizon", "contingency roadmap", "bold leap forward", "alternate life path",
        "bucket list ambition", "hypothetical relocation", "future milestone target", "dream home vision", "career change possibility",
        "financial freedom target", "speculative venture idea", "ideal retirement vision", "future sabbatical plan", "bold adventure plan",
        "strategic pivot plan", "new business blueprint", "back-up contingency plan", "transformative life choice", "aspirational roadmap",
        "flexible future plan", "hypothetical scenario study", "bold life decision", "future horizon scanning", "planned career transition",
        "contingency fund target", "unexplored opportunity path", "five-year vision statement", "ambitious life milestone", "dream journey itinerary",
        "calculated life risk", "future relocation dream", "speculative career pivot", "forward-looking strategy", "potential life change",
        "alternative career trajectory", "daring creative pursuit", "bold future commitment", "hypothetical business model", "personal growth roadmap",
        "strategic life milestone", "forward vision mapping", "calculated leap of faith", "adventurous life plan", "visionary life roadmap",
        "unforeseen opportunity horizon", "proactive future readiness", "transformative personal goal", "bold life venture", "future lifestyle vision"
    ],
    89: [  # Day 89: Reflections (Memories and lessons learned)
        "poignant memory", "hard-won wisdom", "formative life lesson", "nostalgic reflection", "cherished childhood keepsake",
        "past mistake realization", "turning point moment", "transformative realization", "bittersweet recollection", "gratitude reflection practice",
        "deep life insight", "unforgettable life lesson", "peaceful self-acceptance", "childhood home memory", "overcoming past regret",
        "personal resilience story", "quiet moment of reflection", "valuable life takeaway", "cherished family tradition", "forgiving past missteps",
        "youthful dream memory", "life crossroad choice", "enduring core value", "growth through adversity", "fond nostalgic memory",
        "reflective journal entry", "humbling life experience", "inner peace realization", "perspective shift moment", "cherished life milestone",
        "lesson in humility", "past triumph reflection", "healing old wounds", "treasured life lesson", "meaningful memory spark",
        "enduring personal truth", "wisdom of hindsight", "reflective life pause", "childhood wonder memory", "reconciling past choices",
        "life journey gratitude", "priceless life lesson", "revisiting old memories", "gratitude for hardships", "clarity of hindsight",
        "embracing life lessons", "heartfelt personal reflection", "treasured nostalgic moment", "serene life acceptance", "culminating life wisdom"
    ],
    90: [  # Day 90: Real-Life English Integration (Putting it all together)
        "communicative confidence", "expressive fluency", "linguistic autonomy", "authentic voice discovery", "mastery of nuance",
        "conversational ease", "refined language intuition", "effortless code-switching", "spontaneous expression skill", "rich descriptive vocabulary",
        "confident public speech", "cross-cultural fluency", "linguistic self-assurance", "natural discourse mastery", "idiomatic eloquence",
        "spontaneous speech delivery", "polyglot learning mindset", "depth of comprehension", "empowered language speaker", "articulate self-expression",
        "autonomous language journey", "cultural communication bridge", "celebration of progress", "linguistic empowerment", "triumphant milestone",
        "fluency breakthrough moment", "lifelong language pursuit", "natural English speaker", "expressive language mastery", "confident debate skills",
        "mastery of spoken nuances", "authentic communication flow", "linguistic versatility", "deep language confidence", "spontaneous spoken eloquence",
        "confident language user", "mastery of idioms", "rich conversational repertoire", "joy of bilingualism", "confident world communicator",
        "seamless English fluency", "elevated language style", "lifelong English journey", "proud learning achievement", "communicative triumph",
        "empowered global citizen", "natural expressive flow", "confident conversationalist", "rich linguistic repertoire", "enduring fluency commitment"
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
