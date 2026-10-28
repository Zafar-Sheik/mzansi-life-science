import { G11_DIVERSITY } from "./lessons/g11-diversity";
import { G11_ENERGY } from "./lessons/g11-energy";
import { G11_ENVIRONMENT } from "./lessons/g11-environment";
import { G12_GENETICS } from "./lessons/g12-genetics";
import { G12_BODY } from "./lessons/g12-body";
import { G12_EVOLUTION } from "./lessons/g12-evolution";
import { SKILLS } from "./lessons/skills";
import { CAREERS } from "./lessons/careers";
import { EVERYDAY } from "./lessons/everyday";
import { G11_EXAMS } from "./exam-g11";
import { G12_EXAMS } from "./exam-g12";
import type { ExamQuestion, Lesson, QuizQuestion, Term, Topic } from "./types";
import { TOPICS } from "@/lib/topics";
import { GENERATORS } from "@/lib/bio/generators";
import type { MasteryIndex } from "@/lib/mastery";

const TOPIC_ORDER = TOPICS.map((t) => t.topic);

/** Every lesson, in teaching order (Grade 11, Grade 12, skills, then careers and everyday biology). */
export const LESSONS: Lesson[] = [...G11_DIVERSITY, ...G11_ENERGY, ...G11_ENVIRONMENT, ...G12_GENETICS, ...G12_BODY, ...G12_EVOLUTION, ...SKILLS, ...CAREERS, ...EVERYDAY].sort(
  (a, b) => TOPIC_ORDER.indexOf(a.topic) - TOPIC_ORDER.indexOf(b.topic) || a.order - b.order,
);

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

export function lessonsForTopic(t: Topic): Lesson[] {
  return LESSONS.filter((l) => l.topic === t);
}

/** Topics that have lessons. */
export const LIVE_TOPICS: Topic[] = TOPIC_ORDER.filter((t) => LESSONS.some((l) => l.topic === t));

export function neighbours(slug: string) {
  const i = LESSONS.findIndex((l) => l.slug === slug);
  return { prev: i > 0 ? LESSONS[i - 1] : undefined, next: i >= 0 && i < LESSONS.length - 1 ? LESSONS[i + 1] : undefined };
}

/** Topic → lesson slugs (used for topic badges). */
export const TOPIC_INDEX: Record<string, string[]> = Object.fromEntries(TOPIC_ORDER.map((t) => [t, lessonsForTopic(t).map((l) => l.slug)]));

export interface TermEntry extends Term {
  topic: Topic;
  lesson: { slug: string; title: string };
}

/** The glossary: every key term from every lesson (duplicates removed). */
export const GLOSSARY: TermEntry[] = (() => {
  const seen = new Set<string>();
  const out: TermEntry[] = [];
  for (const l of LESSONS) {
    for (const t of l.terms) {
      const k = `${l.topic}::${t.term.toLowerCase()}`;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({ ...t, topic: l.topic, lesson: { slug: l.slug, title: l.title } });
    }
  }
  return out;
})();

export interface BankQuestion extends QuizQuestion {
  id: string;
  topic: Topic;
  lesson: { slug: string; title: string };
}

/** Every multiple-choice question from every lesson – the Quiz Arena draws from this. */
export const QUESTION_BANK: BankQuestion[] = LESSONS.flatMap((l) =>
  l.chunks.flatMap((c) =>
    c.blocks.flatMap((b) => (b.type === "quiz" ? b.questions.map((q, i) => ({ ...q, id: `${b.id}-${i}`, topic: l.topic, lesson: { slug: l.slug, title: l.title } })) : [])),
  ),
);

/** The Exam Room: NSC-style questions for every examined topic, in syllabus order. */
export const EXAM_QUESTIONS: ExamQuestion[] = [...G11_EXAMS, ...G12_EXAMS].sort((a, b) => TOPIC_ORDER.indexOf(a.topic) - TOPIC_ORDER.indexOf(b.topic));

export type { Lesson, Topic } from "./types";

/** Everything the weak-spot coach needs to turn progress into per-topic mastery. */
export function masteryIndex(): MasteryIndex {
  const quizTopic: Record<string, Topic> = {};
  const examTopic: Record<string, Topic> = {};
  for (const l of LESSONS) for (const c of l.chunks) for (const b of c.blocks) {
    if (b.type === "quiz") quizTopic[b.id] = l.topic;
    if (b.type === "practice") quizTopic[`practice:${b.id}`] = l.topic;
    if (b.type === "exam") examTopic[b.question.id] = l.topic;
  }
  for (const q of EXAM_QUESTIONS) examTopic[q.id] = q.topic;
  const topics = TOPICS.filter((t) => LIVE_TOPICS.includes(t.topic) && t.paper !== 0).map((t) => ({
    topic: t.topic, grade: t.grade, title: t.title, emoji: t.emoji, colour: t.colour, slug: t.slug,
    lessons: lessonsForTopic(t.topic).map((l) => ({ slug: l.slug, title: l.title })),
    generators: GENERATORS.filter((g) => g.topic === t.topic).map((g) => g.id),
    examQuestions: EXAM_QUESTIONS.filter((q) => q.topic === t.topic).length,
  }));
  return { topics, quizTopic, examTopic };
}
