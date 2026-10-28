# Testing & deployment

## Scripts

| Command | |
|---|---|
| `npm run dev` | Development server on http://localhost:3000 |
| `npm run typecheck` | TypeScript strict |
| `npm run lint` | ESLint (zero warnings allowed) |
| `npm test` | Vitest: answer checker, genetics engine, generators and content integrity |
| `npm run build` | Production build (every page is static) |
| `npm run test:e2e` | Playwright on desktop and mobile (needs a build) |
| `npm run check` | typecheck + lint + test + build |

## What the tests guarantee

- **Answer checker.** Terms ignore case and articles and accept alternatives; numbers accept decimal commas, units and tolerances; ratios accept equivalent forms; bases spot T/U mix-ups; lists ignore order – with the right feedback for each kind of slip.
- **Genetics engine.** Monohybrid, incomplete and co-dominance, blood-group, sex-linked and dihybrid crosses give the textbook ratios; the codon table has all 64 codons.
- **Every generator** produces 150 problems; every memo alternative passes its own checker; problems are deterministic per seed and varied.
- **Every practice problem** passes its own checker; every quiz answer points at a real option; every sorter item belongs to a bucket; matches have unique partners.
- **Every diagram** is used in a lesson, has unique parts with functions and markers inside the drawing.
- **Syllabus coverage.** Every CAPS topic has a lesson, a quiz, Exam Room questions and Section A terminology practice.
- **Exam questions** have exactly one memo line per mark; every mock paper has enough questions.
- **End-to-end.** Key pages load on desktop and mobile without console errors.

## Deploying

Every page is statically generated; there are no environment variables. Any Node 18.18+ host works (Vercel, Netlify, a school server):

```bash
npm ci
npm run check
npm start
```
