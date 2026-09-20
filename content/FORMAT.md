# Content Format — 90-Day Curriculum

Every day lives in one JSON file: `content/day-XX.json` (zero-padded, e.g. `day-07.json`).
The fixed plan for all 90 days lives in `content/curriculum-plan.json` (day number, title,
topic, description, stage, grammar lesson titles). Day files MUST match the plan.

## File structure

```json
{
  "day": 1,
  "title": "My Daily Routine",
  "topic": "Daily routine and time",
  "description": "One or two sentences describing the learning unit.",
  "stage": "Foundation — Daily Life",
  "focus": "One clear sentence: what the learner will be able to do after this day.",
  "grammar": [
    {
      "title": "Present Simple",
      "explanation": "Very simple English explanation (2–4 sentences).",
      "structures": [
        { "pattern": "I / You / We / They + verb", "label": "Positive" },
        { "pattern": "He / She / It + verb + s", "label": "Positive" },
        { "pattern": "Do + I/you/we/they + verb?", "label": "Question" },
        { "pattern": "I / You / We / They do not (don't) + verb", "label": "Negative" }
      ],
      "examples": [
        { "sentence": "I wake up at seven every day.", "usesVocabulary": ["wake up"] },
        { "sentence": "She starts work at nine.", "usesVocabulary": ["start"] }
      ],
      "commonUsage": [
        "Habits and routines: I eat breakfast at eight.",
        "Facts: Water boils at 100 degrees."
      ],
      "commonMistakes": [
        { "wrong": "I wakes up at seven.", "right": "I wake up at seven.", "note": "Use the base verb with I, you, we, they." }
      ]
    }
  ],
  "vocabulary": [
    {
      "headword": "wake up",
      "pronunciation": "/weɪk ʌp/",
      "partOfSpeech": "phrasal verb",
      "definition": "to stop sleeping",
      "example": "I wake up at seven every morning.",
      "relatedForms": ["wake (v)", "awake (adj)"],
      "collocations": ["wake up early", "wake up late"],
      "synonyms": [],
      "antonyms": ["fall asleep"],
      "tags": ["routine", "morning"]
    }
  ],
  "conversations": [
    {
      "title": "Morning Routine",
      "setting": "Two friends talk on the phone in the morning.",
      "lines": [
        { "speaker": "Maya", "text": "Hi Sam! What time do you wake up?" },
        { "speaker": "Sam",  "text": "I usually wake up at six thirty." }
      ],
      "vocabularyUsed": ["wake up", "usually", ...]
    }
  ],
  "paragraphs": [
    {
      "title": "My Typical Day",
      "kind": "daily-life description",
      "text": "80–130 words of natural English ...",
      "vocabularyUsed": ["wake up", "start", ...]
    }
  ]
}
```

## Hard rules (validated by `npm run content:validate`)

1. Exactly 90 files, day numbers 1–90, all fields present.
2. Exactly **50** vocabulary items per day. No more, no less.
3. **No duplicate headwords** — inside a day, across all 90 days, case-insensitive.
4. Every vocabulary item needs: headword, pronunciation (IPA), partOfSpeech, definition, example.
   Optional: relatedForms, collocations, synonyms, antonyms, tags (arrays of strings).
5. At least 1 grammar lesson per day. Grammar examples should use the day's vocabulary
   (`usesVocabulary` lists headwords from this day's 50).
6. At least 3 conversations, each with ≥ 8 lines and ≥ 5 words from `vocabularyUsed`.
7. At least 3 paragraphs, each 70–140 words, each using ≥ 6 words from `vocabularyUsed`.
8. `vocabularyUsed` only contains headwords from THIS day's 50 (exact strings).
9. Vocabulary coverage: at least 80% of the day's 50 words must appear in at least one
   conversation or paragraph (`vocabularyUsed` across them).
10. English only — no Arabic characters anywhere in the file.

## Quality rules (reviewed, not scriptable)

- The 50 words form one coherent scenario/theme with internal groups — not 50 synonyms,
  not 50 random words.
- Conversations and paragraphs sound natural; vocabulary repeats naturally, not robotically.
- Grammar level matches the day's stage (see `curriculum-plan.json`).
- Reinforcement: older words (from previous days) may appear freely in conversations and
  paragraphs — just never as NEW headwords.

## Ingestion

`npm run content:seed` ingests every `day-XX.json` into SQLite (normalized tables), computes
reinforcement links automatically by matching headwords from earlier days inside conversation
and paragraph text, and refuses to run on an invalid curriculum.
