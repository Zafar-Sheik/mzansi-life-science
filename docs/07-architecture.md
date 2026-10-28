# Architecture

LifeMzansi is a **static Next.js site**. There is no database and no server-side learner data.

## Stack

Next.js 15 (App Router, static generation) · React 19 · TypeScript (strict) · Tailwind CSS 4 · Motion · GSAP 3 · canvas-confetti · Vitest · Playwright. The browser's Web Speech API powers read-aloud.

## Folders

```
src/
  app/                 routes: learn, toolkit (Labs), everyday, careers, flashcards, quiz, exam, exam/mock, games, progress, teachers, api/curriculum
  components/
    learn/             lesson player, block renderer (incl. diagram blocks), quiz, practice, worked examples, flashcards, sequence, match, exam-part
    bio/               answer-input (base keypad, ratio and list keys), problem-card
    widgets/           labs and tools (code-split with next/dynamic), diagrams.ts (diagram data), plot, sim-kit, catalogue
    pages/             client components for each page (learn browser, labs, everyday/careers, games…)
    home/, layout/, ui/, aceternity/
  content/
    lessons/           g11-diversity, g11-energy, g11-environment, g12-genetics, g12-body, g12-evolution, skills, careers, everyday
    exam-g11.ts        Grade 11 and skills Exam Room questions
    exam-g12.ts        Grade 12 Exam Room questions
    games.ts           banks for "This or That?" and "Who Am I?"
    index.ts           LESSONS, LIVE_TOPICS, GLOSSARY, QUESTION_BANK, EXAM_QUESTIONS, masteryIndex
  lib/
    bio/check.ts       answer checker: terms, numbers, ratios, bases, lists
    bio/genetics.ts    Punnett squares, ratios, blood groups, sex linkage, dihybrid crosses
    bio/genetic-code.ts the codon table, transcription, translation
    bio/generators.ts  seeded question generators (incl. Section A terms for every topic)
    topics.ts          strands, topics, papers, colours and paper weightings
    progress.ts, cards.ts, prefs.ts, mastery.ts, mock.ts, worksheet.ts
docs/                  this documentation (rendered at /teachers)
tests/                 Vitest unit + content tests, Playwright e2e
```

## Data flow

- Content is plain TypeScript. Server components read it at build time and pass small, serialisable summaries to client components.
- Diagrams are data (SVG paths, names, functions and marker positions) rendered by one explorer widget – adding a diagram needs no new component.
- Learner state lives in `localStorage` under keys prefixed `lifemzansi:` (prefs, progress, cards, best scores, mock attempts and tool drafts such as the APS calculator).
