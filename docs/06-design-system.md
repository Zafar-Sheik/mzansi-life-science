# Colours, type & design system

Every colour has **one meaning** across the whole site.

| Token | Meaning |
|---|---|
| `--brand` (indigo) | Actions and links – "you can click this" |
| `--t-cell` (violet) | Cells & Genetics: DNA, meiosis, genetics |
| `--t-energy` (orange) | Energy for Life: photosynthesis, nutrition, respiration, gas exchange, excretion |
| `--t-body` (berry) | Reproduction & Response: reproduction, nervous system, senses, hormones, homeostasis, plant responses |
| `--t-diversity` (teal) | Diversity & Evolution: microorganisms, plants, animals, evolution |
| `--t-eco` (green) | Environmental Studies: population ecology, human impact |
| `--t-skills` (blue) | Science Skills |
| `--t-career` (gold) | Careers |
| `--t-daily` (fuchsia) | Everyday Biology |
| `--danger` (red) | Only errors and common mistakes |
| `--memory` (pink) | Memory hooks and flashcards |
| `--exam` (amber) | Exam tips and the Exam Room |
| `--mzansi` (blue) | "Mzansi moment" real-world callouts |

Each token has light, dark and high-contrast values in `src/app/globals.css`, and a print palette so papers and memos print in black on white.

## Diagrams

Diagram parts use fixed, realistic fills (e.g. retina orange, choroid brown, xylem dark yellow) that read well on light and dark backgrounds, with a theme-coloured outline and letter markers. The selected part is outlined in the brand colour; the others dim in explore mode.

## Type

- **Space Grotesk** for headings, **Inter** for reading (switchable to Atkinson Hyperlegible or OpenDyslexic), **JetBrains Mono** for bases, ratios, numbers and timers.

## Components

Aceternity-style aurora, spotlight, 3D cards, bento grid, moving border and floating dock; GSAP for the hero animation (DNA being transcribed and translated) and lesson transitions; canvas-confetti for celebrations (never in calm mode).
