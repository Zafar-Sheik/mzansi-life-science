/**
 * Content model for lessons. Lessons are plain TypeScript data so that they
 * are type-checked and can be tested automatically: every quiz answer, every
 * practice answer (it must pass its own checker) and every exam memo is
 * validated by the test-suite.
 */

export type Grade = 11 | 12;

/**
 * Knowledge areas. The first four follow the CAPS Life Sciences strands
 * (Life Processes is split in two so each grade's block has its own colour);
 * the last three are our own: science skills, careers and everyday biology.
 */
export type Strand =
  | "Cells & Genetics"
  | "Energy for Life"
  | "Reproduction & Response"
  | "Diversity & Evolution"
  | "Environmental Studies"
  | "Science Skills"
  | "Careers"
  | "Everyday Biology";

/**
 * 1 = Paper 1, 2 = Paper 2, 3 = examined in both papers (scientific skills),
 * 0 = not examined – careers and everyday biology are for life.
 */
export type Paper = 0 | 1 | 2 | 3;

/** A CAPS topic in a specific grade, a skills topic, or a careers / everyday topic (see src/lib/topics.ts). */
export type Topic =
  // Grade 11
  | "g11-microorganisms"
  | "g11-plants"
  | "g11-animals"
  | "g11-photosynthesis"
  | "g11-nutrition"
  | "g11-respiration"
  | "g11-gas-exchange"
  | "g11-excretion"
  | "g11-population"
  | "g11-human-impact"
  // Grade 12
  | "g12-dna"
  | "g12-meiosis"
  | "g12-genetics"
  | "g12-vertebrate-repro"
  | "g12-human-repro"
  | "g12-nervous"
  | "g12-senses"
  | "g12-endocrine"
  | "g12-homeostasis"
  | "g12-plant-responses"
  | "g12-evolution"
  | "g12-human-evolution"
  // Skills (both grades, both papers)
  | "skills-investigation"
  // Careers & vocational
  | "career-health"
  | "career-land"
  | "career-lab"
  | "career-pathways"
  // Everyday biology
  | "daily-nutrition"
  | "daily-germs"
  | "daily-sexual-health"
  | "daily-first-aid"
  | "daily-mind"
  | "daily-garden"
  | "daily-water";

export type CalloutVariant = "key" | "tip" | "mistake" | "memory" | "exam" | "break" | "real-world" | "safety" | "life";

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface Term {
  term: string;
  def: string;
}

/**
 * How a typed answer is checked (see src/lib/bio/check.ts):
 * - word:     one word or short phrase; case, extra spaces and end punctuation ignored. Alternatives separated by " | "
 * - sentence: a short phrase or sentence; case and punctuation ignored, word order counts
 * - number:   a number (decimal comma or point; % and units ignored); `tol` sets an allowed error
 * - ratio:    a ratio like 3:1 or 9:3:3:1 (equivalent ratios such as 6:2 are accepted)
 * - bases:    a sequence of DNA/RNA bases or codons (spaces and dashes ignored)
 * - list:     several items in any order, separated by commas (e.g. gametes "AB, Ab, aB, ab")
 */
export type AnswerKind = "word" | "sentence" | "number" | "ratio" | "bases" | "list";

export interface PracticeProblem {
  q: string;
  /** The memo answer. Alternatives are separated by " | " (e.g. `ovary | ovaries`). */
  answer: string;
  kind?: AnswerKind;
  /** For number answers: the largest difference that still counts as right (e.g. 0.5). */
  tol?: number;
  hint?: string;
  /** Full explanation (markdown), shown after an attempt. */
  solution: string;
}

export interface WorkedStep {
  md: string;
  /** Why this step works – the bit learners usually skip. */
  why?: string;
}

export type Block =
  | { type: "text"; md: string }
  | { type: "callout"; variant: CalloutVariant; title?: string; md: string }
  | { type: "keypoints"; points: string[] }
  | { type: "flashcards"; cards: { front: string; back: string }[] }
  /** Renders the lesson's own key terms as flashcards. */
  | { type: "terms" }
  | { type: "quiz"; id: string; questions: QuizQuestion[] }
  | { type: "widget"; widget: WidgetName; props?: Record<string, unknown> }
  /** Put the steps in order (a process, a pathway, a sequence of events). */
  | { type: "sequence"; id: string; title: string; steps: string[]; explain: string }
  /** Match each item to its partner (structure ↔ function, hormone ↔ gland…). */
  | { type: "match"; id: string; title: string; pairs: { left: string; right: string }[] }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
  /** A worked example revealed one step at a time ("predict, then reveal"). */
  | { type: "worked"; title: string; problem: string; steps: WorkedStep[] }
  /** Typed-answer practice with hints, instant checking and full explanations. */
  | { type: "practice"; id: string; title?: string; problems: PracticeProblem[] }
  /** A short exam-style question with a memo the learner self-marks against. */
  | { type: "exam"; question: ExamPart & { id: string } }
  /** A labelled schematic diagram you can tap (see the diagram widget). */
  | { type: "diagram"; diagram: DiagramId; mode?: "explore" | "quiz" };

export type DiagramId =
  | "flower"
  | "leaf"
  | "alveolus"
  | "digestive"
  | "nephron"
  | "kidney"
  | "eye"
  | "ear"
  | "brain"
  | "neuron"
  | "reflex-arc"
  | "female-repro"
  | "male-repro"
  | "sperm"
  | "amniotic-egg"
  | "nucleotide"
  | "chloroplast"
  | "mitochondrion"
  | "virus"
  | "bacterium";

export type WidgetName =
  | "sorter"
  | "drill"
  | "diagram"
  | "punnett-lab"
  | "dna-lab"
  | "meiosis-lab"
  | "photosynthesis-lab"
  | "population-lab"
  | "selection-lab"
  | "homeostasis-lab"
  | "cycle-lab"
  | "eye-lab"
  | "investigation-planner"
  | "graph-lab"
  | "microscope-lab"
  | "germ-lab"
  | "plate-builder"
  | "first-aid-sim"
  | "career-explorer"
  | "aps-calculator"
  | "footprint-lab"
  | "pedigree-lab"
  | "respiration-lab";

export interface Chunk {
  id: string;
  title: string;
  /** Rough reading/doing time in minutes – chunks are kept short (2–10 min). */
  minutes: number;
  blocks: Block[];
}

export interface Lesson {
  slug: string;
  topic: Topic;
  order: number;
  title: string;
  tagline: string;
  emoji: string;
  /** CAPS reference. */
  caps: string;
  objectives: string[];
  /** Learning style tags used in docs: visual, auditory, read-write, kinaesthetic */
  styles: ("visual" | "auditory" | "read-write" | "kinaesthetic")[];
  xp: number;
  /** Key concepts – feed the lesson flashcards, the global deck and the games. */
  terms: Term[];
  chunks: Chunk[];
}

/** Cognitive levels used in the DBE Life Sciences examination guidelines. */
export type CognitiveLevel = "knowing" | "understanding" | "applying" | "evaluating";

export interface ExamPart {
  q: string;
  marks: number;
  /** Each memo line is one mark (one tick), exactly like an NSC marking memo. */
  memo: string[];
  level?: CognitiveLevel;
}

export interface ExamQuestion {
  id: string;
  topic: Topic;
  title: string;
  /** Stimulus: an investigation, a table of results, a description of a diagram or a passage. */
  source?: string;
  /** Optional interactive figure (a diagram or lab) shown with the source. */
  figure?: { widget: WidgetName; props?: Record<string, unknown> };
  /** The lesson to revise for this question. */
  lesson?: string;
  parts: ExamPart[];
}
