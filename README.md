# LifeMzansi

**An interactive Grade 11 & 12 Life Sciences companion for South African learners (CAPS, NSC Paper 1 and Paper 2) – plus scientific skills, careers in the life sciences and everyday biology you can use at home.**

It's the sister app of *MathsMzansi*, *PhysicsMzansi*, *EnglishMzansi*, *AccountingMzansi*, *GeoMzansi* and *CodeMzansi*, with the same learning design and accessibility features. Built with Next.js, Motion, GSAP and Aceternity UI patterns – designed to make biology click, and to work for every learner, including learners with ADHD, dyslexia and other learning differences.

## What's inside

- 📚 **46 lessons** in short steps, covering every CAPS Grade 11 and 12 topic:
  - *Grade 11 (Paper 1):* microorganisms and immunity, plant diversity and reproduction, animal body plans, population ecology, human impact on the environment
  - *Grade 11 (Paper 2):* photosynthesis, animal nutrition and the liver, cellular respiration, gaseous exchange, excretion and the kidneys
  - *Grade 12 (Paper 1):* reproduction in vertebrates, human reproduction and the menstrual cycle, the nervous system, the eye and ear, the endocrine system, homeostasis, plant hormones and responses
  - *Grade 12 (Paper 2):* DNA and protein synthesis, meiosis, genetics and inheritance (monohybrid, dihybrid, blood groups, sex linkage, pedigrees, mutations, genetic engineering), evolution and speciation, human evolution and the Cradle of Humankind
  - *Scientific skills (every paper):* investigations, hypotheses and variables, reliability and validity, tables and the 6-mark graph, biological drawings and magnification
- 👆 **20 tappable diagrams** – eye, ear, brain, neuron, reflex arc, nephron, kidney, alveolus, digestive system, flower, leaf, chloroplast, mitochondrion, virus, bacterium, sperm, the reproductive systems, the amniotic egg and DNA. Explore one part at a time, then *Find it* and *Name it* like an exam question.
- 🔬 **Labs** – Punnett squares (all cross types, with the exam layout), a DNA lab (replication, transcription, translation, mutations), a meiosis stepper (crossing over, non-disjunction), photosynthesis limiting factors, respiration and fermentation, mark–recapture and growth curves, natural selection ("be the bird"), homeostasis, the menstrual cycle, the eye, a pedigree reader, an investigation planner, a graph lab and a microscope lab.
- 💼 **Careers & vocational learning** – health, farming and nature, lab and biotech careers, a career explorer with the university / TVET / learnership route to each career, and an APS calculator.
- 🏡 **Everyday biology** – eating well on a budget and reading food labels, germs, vaccines and antibiotics, sexual and reproductive health, first aid (with a CPR rhythm trainer), the brain, sleep, stress and substances, growing your own food, and safe water at home.
- ✍️ **Typed answers that understand biology**: terms with accepted alternatives, numbers with decimal commas and units, ratios (6 : 2 = 3 : 1), DNA/RNA bases with a tap-in base keypad (and feedback on T/U mix-ups), and gametes or blood groups in any order.
- ♾️ **41 question generators** – genetics crosses, DNA base pairing, codons, meiosis numbers, mark–recapture, quadrats, magnification, percentage change, food-label maths, and Section A terminology for every examined topic.
- 🃏 **Flashcards** with spaced repetition for 310 key terms, ⚔️ a **Quiz Arena**, 📝 an **Exam Room** (56 NSC-style questions, 471 marks, one-tick-per-mark memos), ⏱️ **mock papers** for Grade 11 and 12, Paper 1 and Paper 2, with NSC levels, 🎯 a **weak-spot coach** and a 🖨️ **worksheet generator**.
- 🎮 **Games**: Speed Bio, This or That?, Who Am I?, Concept Pairs, True/False Blitz, Odd One Out, Bio Hangman.
- 🧠 **Accessibility**: step mode, focus mode, focus sprints, calm mode, reading ruler, word anchors, dyslexia-friendly fonts, read-aloud for every lesson and diagram part, high contrast, extra time on mocks, and tap/keyboard alternatives for every puzzle.
- 🔒 **No accounts, no tracking**: progress stays on the learner's device.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Command | |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run typecheck` | TypeScript strict check |
| `npm run lint` | ESLint (zero warnings) |
| `npm test` | Answer-checker, genetics-engine, generator and content-integrity tests (Vitest) |
| `npm run test:e2e` | Browser tests on desktop + mobile (Playwright; needs a production build) |
| `npm run check` | typecheck + lint + test + build |

## Deploying

Every page is statically generated. There is no backend and there are no environment variables. Node 18.18+ is required.

```bash
npm ci
npm run check
npm start
```

## Documentation

The teacher guide and technical documentation live in [`docs/`](docs) and are rendered in the app at `/teachers`: overview, quick-start, CAPS curriculum map, learning design, ADHD & accessibility, labs and diagrams, careers and everyday biology, design system, architecture, content authoring, testing and privacy.

## A note on the curriculum

Paper weightings follow the DBE Life Sciences examination guidelines approximately; they change a little from year to year, and provinces sometimes split the Grade 11 topics between the papers differently. Always check the current guidelines and your school's Annual Teaching Plan. Health content is education, not medical advice.
