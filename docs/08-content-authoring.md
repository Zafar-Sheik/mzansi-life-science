# Writing lessons & exam questions

## Lessons

Lessons live in `src/content/lessons/*.ts` as typed objects. A lesson has a `slug`, a `topic`, objectives, key `terms`, and `chunks` of `blocks`. Block types: `text`, `callout`, `keypoints`, `flashcards`, `terms`, `quiz`, `widget`, `diagram`, `sequence`, `match`, `table`, `worked`, `practice` and `exam`.

Practice problems need an `answer` the checker can read and a `kind`:

- `word` – a term; alternatives separated by ` | ` (e.g. `ADH | antidiuretic hormone`)
- `sentence` – a short phrase where word order matters
- `number` – optionally with `tol` for an allowed error
- `ratio` – e.g. `9:3:3:1`
- `bases` – DNA/RNA bases, e.g. `AUGGCC`
- `list` – items in any order, e.g. gametes `TR, Tr, tR, tr`

## Diagrams

Add a diagram to `src/components/widgets/diagrams.ts` (and its id to `DiagramId` in `src/content/types.ts`). Each part needs an SVG path in a 400 × 300 box, a name, a one- or two-sentence function in exam wording, and the `at` point for its letter marker. Use it in a lesson with `{ type: "diagram", diagram: "eye" }` (add `mode: "quiz"` to start in Find-it mode).

## Exam questions

Add them to `src/content/exam-g11.ts` or `exam-g12.ts`. **Every memo line is one mark** – a part worth 3 marks has exactly 3 memo lines. Use the DBE cognitive levels: `knowing`, `understanding`, `applying`, `evaluating`. A table question ("tabulate…") has one memo line for the table itself. Link a `lesson` so learners can revise, and add a `figure` (a diagram or lab) where it helps.

## Checks before you commit

`npm run check` runs typecheck, lint, the unit and content tests and the production build.
