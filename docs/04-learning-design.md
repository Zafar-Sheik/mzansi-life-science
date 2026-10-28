# Learning design & study tools

## Inside every lesson

1. **Hook** – something real: a clinic queue, TB in your community, a paternity test, a drought.
2. **Do it** – a diagram to tap or a lab to play with.
3. **Worked examples** revealed one step at a time, each step with a *why*.
4. **Your turn** – typed answers checked instantly with hints and full solutions.
5. **Check it** – quizzes, sequence puzzles ("put the steps of urine formation in order"), matching and sorting.
6. **Exam it** – an NSC-style question with a memo to self-mark.
7. **Key terms** as flashcards.

## Answers that understand biology

The checker (`src/lib/bio/check.ts`) understands the kinds of answers Life Sciences asks for:

| Kind | Accepts | Helpful feedback |
|---|---|---|
| Term | Any accepted alternative (ADH or antidiuretic hormone), any case, with or without "the" | "Check the spelling – spelling counts in Section A" |
| Number | Decimal comma or point, units and % after the number, an allowed tolerance | Spots unit slips (mm ↔ µm) and rounding |
| Ratio | 3 : 1, 3:1, 6:2 | Spots ratios in the wrong order |
| Bases | AUG GCC, aug-gcc | Spots T/U mix-ups, reversed strands and missing bases |
| List | Gametes or blood groups in any order | Says how many items are expected; gametes are case-sensitive |

## Study tools

- **Flashcards** with spaced repetition (five boxes), filtered by topic.
- **Quiz Arena** – mixed rounds from every lesson quiz, relaxed or timed.
- **Endless drills** – 41 generators with streaks.
- **Exam Room and mock papers** – self-marked with an NSC achievement level.
- **Weak-spot coach** – mastery per topic and a targeted drill.
- **Games** – Speed Bio, This or That? (compare-and-contrast pairs), Who Am I? (structure riddles), Concept Pairs, True/False Blitz, Odd One Out and Bio Hangman.
