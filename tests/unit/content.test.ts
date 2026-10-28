/**
 * Content integrity tests: every lesson, quiz, practice problem, puzzle,
 * diagram and exam question must be well-formed, so learners never meet a
 * broken activity.
 */
import { describe, expect, it } from "vitest";
import { EXAM_QUESTIONS, GLOSSARY, LESSONS, LIVE_TOPICS, QUESTION_BANK, TOPIC_INDEX } from "@/content";
import { DASH, RIDDLES } from "@/content/games";
import { DIAGRAMS } from "@/components/widgets/diagrams";
import { WIDGET_CATALOGUE } from "@/components/widgets/catalogue";
import { TOPICS } from "@/lib/topics";
import { BADGES, TOPIC_BADGES } from "@/lib/progress";
import { checkAnswer } from "@/lib/bio/check";
import { getGenerator } from "@/lib/bio/generators";
import { buildMock, MOCK_IDS, paperQuestions } from "@/lib/mock";
import type { Block } from "@/content/types";

const blocks = LESSONS.flatMap((l) => l.chunks.flatMap((c) => c.blocks.map((b) => ({ lesson: `${l.slug}/${c.id}`, b }))));
const of = <T extends Block["type"]>(t: T) => blocks.filter((x) => x.b.type === t) as { lesson: string; b: Extract<Block, { type: T }> }[];

/** Every string anywhere in the content, with where it came from. */
function allStrings(): { where: string; s: string }[] {
  const out: { where: string; s: string }[] = [];
  const walk = (v: unknown, where: string) => {
    if (typeof v === "string") out.push({ where, s: v });
    else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${where}[${i}]`));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, `${where}.${k}`);
  };
  LESSONS.forEach((l) => walk(l, l.slug));
  EXAM_QUESTIONS.forEach((q) => walk(q, q.id));
  return out;
}

describe("curriculum structure", () => {
  it("has unique slugs and chunk ids, objectives, terms and short chunks", () => {
    expect(LESSONS.length).toBeGreaterThanOrEqual(40);
    expect(new Set(LESSONS.map((l) => l.slug)).size).toBe(LESSONS.length);
    for (const l of LESSONS) {
      expect(new Set(l.chunks.map((c) => c.id)).size, l.slug).toBe(l.chunks.length);
      expect(l.chunks.length, l.slug).toBeGreaterThanOrEqual(2);
      expect(l.objectives.length, l.slug).toBeGreaterThan(0);
      expect(l.terms.length, `${l.slug} needs key terms`).toBeGreaterThanOrEqual(2);
      for (const c of l.chunks) {
        expect(c.minutes, `${l.slug}/${c.id}`).toBeLessThanOrEqual(15);
        expect(c.blocks.length, `${l.slug}/${c.id}`).toBeGreaterThan(0);
      }
    }
  });

  it("every CAPS, skills, careers and everyday topic has at least one lesson, in order", () => {
    expect(LIVE_TOPICS.length).toBe(TOPICS.length);
    for (const t of TOPICS) expect(TOPIC_INDEX[t.topic].length, t.topic).toBeGreaterThanOrEqual(1);
    for (const slugs of Object.values(TOPIC_INDEX)) {
      const orders = slugs.map((s) => LESSONS.find((l) => l.slug === s)!.order);
      expect(orders).toEqual([...orders].sort((a, b) => a - b));
    }
  });

  it("every topic has a badge", () => {
    for (const t of TOPICS) {
      expect(TOPIC_BADGES[t.topic], t.topic).toBeTruthy();
      expect(BADGES.some((b) => b.id === TOPIC_BADGES[t.topic])).toBe(true);
    }
  });

  it("every lesson has something to do (a quiz, practice, puzzle, widget or exam question)", () => {
    const active = new Set(["quiz", "practice", "sequence", "match", "widget", "exam"]);
    for (const l of LESSONS) expect(l.chunks.some((c) => c.blocks.some((b) => active.has(b.type))), l.slug).toBe(true);
  });

  it("every lab used in a lesson is reachable from the Labs page (sorters live with their lesson)", () => {
    const catalogued = new Set(WIDGET_CATALOGUE.map((w) => w.name));
    for (const { lesson, b } of of("widget")) if (b.widget !== "sorter") expect(catalogued.has(b.widget), `${lesson}: ${b.widget}`).toBe(true);
  });

  it("every diagram is used in a lesson and has well-formed parts", () => {
    const used = new Set([...of("diagram").map((x) => x.b.diagram), ...of("widget").filter((x) => x.b.widget === "diagram").map((x) => (x.b.props as { diagram: string }).diagram)]);
    for (const d of Object.values(DIAGRAMS)) {
      expect(used.has(d.id), `diagram ${d.id} is not used in any lesson`).toBe(true);
      expect(d.parts.length, d.id).toBeGreaterThanOrEqual(4);
      expect(new Set(d.parts.map((p) => p.id)).size, `${d.id}: duplicate part ids`).toBe(d.parts.length);
      expect(new Set(d.parts.map((p) => p.name)).size, `${d.id}: duplicate part names`).toBe(d.parts.length);
      for (const p of d.parts) {
        expect(p.fn.length, `${d.id}/${p.id}`).toBeGreaterThan(10);
        expect(p.d, `${d.id}/${p.id}`).not.toMatch(/NaN|undefined/);
        expect(p.at[0], `${d.id}/${p.id}`).toBeGreaterThanOrEqual(0);
        expect(p.at[0], `${d.id}/${p.id}`).toBeLessThanOrEqual(400);
        expect(p.at[1], `${d.id}/${p.id}`).toBeGreaterThanOrEqual(0);
        expect(p.at[1], `${d.id}/${p.id}`).toBeLessThanOrEqual(300);
      }
    }
  });

  it("game banks are well-formed", () => {
    expect(DASH.length).toBeGreaterThanOrEqual(30);
    for (const d of DASH) expect(d.answer, d.s).not.toBe(d.other);
    expect(RIDDLES.length).toBeGreaterThanOrEqual(25);
    expect(new Set(RIDDLES.map((r) => r.answer)).size).toBe(RIDDLES.length);
    for (const r of RIDDLES) expect(LIVE_TOPICS, r.answer).toContain(r.topic);
  });

  it("no stray escaped newlines or leftover accounting content", () => {
    for (const { where, s } of allStrings()) {
      expect(/\\n(?![a-zA-Z])/.test(s), `${where} has a literal \\n`).toBe(false);
      expect(/\b(Paper 3|Home Language|set work|poem)\b/.test(s), `${where} has leftover English content`).toBe(false);
    }
  });
});

describe("quizzes", () => {
  it("have unique ids and answers that point at a real option", () => {
    const ids = of("quiz").map((x) => x.b.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const { lesson, b } of of("quiz")) {
      expect(b.questions.length, lesson).toBeGreaterThanOrEqual(2);
      for (const q of b.questions) {
        expect(q.options.length, `${lesson}: ${q.q}`).toBeGreaterThanOrEqual(2);
        expect(new Set(q.options).size, `${lesson}: duplicate options`).toBe(q.options.length);
        expect(q.answer, `${lesson}: ${q.q}`).toBeGreaterThanOrEqual(0);
        expect(q.answer, `${lesson}: ${q.q}`).toBeLessThan(q.options.length);
        expect(q.explain.length).toBeGreaterThan(5);
      }
    }
    expect(QUESTION_BANK.length).toBeGreaterThanOrEqual(120);
  });

  it("don't always put the right answer in the same place", () => {
    const counts = [0, 1, 2, 3].map((k) => QUESTION_BANK.filter((q) => q.answer === k).length);
    expect(counts.filter((c) => c > 0).length).toBeGreaterThanOrEqual(3);
  });
});

describe("practice problems and generators", () => {
  it("every memo answer passes its own checker, with an explanation", () => {
    for (const { lesson, b } of of("practice")) {
      for (const p of b.problems) {
        for (const alt of p.answer.split(" | ")) {
          const res = checkAnswer(alt, p);
          expect(res.ok, `${lesson}: ${p.q} → ${alt} (${res.message})`).toBe(true);
        }
        expect(p.solution.length, `${lesson}: ${p.q}`).toBeGreaterThan(3);
      }
    }
  });

  it("drills point at real generators", () => {
    const drills = [...of("widget").filter((x) => x.b.widget === "drill").map((x) => x.b.props), ...WIDGET_CATALOGUE.filter((w) => w.name === "drill").map((w) => w.props)];
    expect(drills.length).toBeGreaterThan(5);
    for (const p of drills) for (const id of ((p?.generators as string[]) ?? [])) expect(getGenerator(id), id).toBeTruthy();
  });

  it("worked examples have steps", () => {
    for (const { lesson, b } of of("worked")) expect(b.steps.length, lesson).toBeGreaterThanOrEqual(2);
    expect(of("worked").length).toBeGreaterThanOrEqual(12);
  });
});

describe("puzzles", () => {
  it("sorter items all belong to a declared bucket", () => {
    const sorters = [
      ...of("widget").filter((x) => x.b.widget === "sorter").map((x) => ({ where: x.lesson, props: x.b.props as { id: string; buckets: string[]; items: { text: string; bucket: string }[] } })),
      ...WIDGET_CATALOGUE.filter((w) => w.name === "sorter").map((w) => ({ where: `toolkit/${w.title}`, props: w.props as { id: string; buckets: string[]; items: { text: string; bucket: string }[] } })),
    ];
    expect(sorters.length).toBeGreaterThanOrEqual(5);
    const ids = sorters.map((s) => s.props.id);
    expect(new Set(ids).size, "sorter ids must be unique").toBe(ids.length);
    for (const s of sorters) {
      expect(s.props.items.length, s.where).toBeGreaterThanOrEqual(4);
      expect(new Set(s.props.items.map((i) => i.text)).size, `${s.where}: duplicate items`).toBe(s.props.items.length);
      for (const it of s.props.items) expect(s.props.buckets, `${s.where}: ${it.text}`).toContain(it.bucket);
      for (const b of s.props.buckets) expect(s.props.items.some((i) => i.bucket === b), `${s.where}: empty bucket ${b}`).toBe(true);
    }
  });

  it("sequences and matches are well-formed with unique ids", () => {
    const ids = [...of("sequence").map((x) => x.b.id), ...of("match").map((x) => x.b.id)];
    expect(new Set(ids).size).toBe(ids.length);
    for (const { lesson, b } of of("sequence")) {
      expect(b.steps.length, lesson).toBeGreaterThanOrEqual(3);
      expect(new Set(b.steps).size, lesson).toBe(b.steps.length);
    }
    for (const { lesson, b } of of("match")) {
      expect(b.pairs.length, lesson).toBeGreaterThanOrEqual(3);
      expect(new Set(b.pairs.map((p) => p.right)).size, `${lesson}: duplicate right-hand side`).toBe(b.pairs.length);
      expect(new Set(b.pairs.map((p) => p.left)).size, `${lesson}: duplicate left-hand side`).toBe(b.pairs.length);
    }
  });
});

describe("exam questions", () => {
  it("have unique ids, exactly one memo line per mark and a live topic", () => {
    expect(EXAM_QUESTIONS.length).toBeGreaterThanOrEqual(50);
    const ids = [...EXAM_QUESTIONS.map((q) => q.id), ...of("exam").map((x) => x.b.question.id)];
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of EXAM_QUESTIONS) {
      expect(LIVE_TOPICS, q.id).toContain(q.topic);
      for (const p of q.parts) expect(p.memo.length, `${q.id}: ${p.q}`).toBe(p.marks);
      if (q.lesson) expect(LESSONS.some((l) => l.slug === q.lesson), q.id).toBe(true);
    }
    for (const { lesson, b } of of("exam")) expect(b.question.memo.length, lesson).toBe(b.question.marks);
  });

  it("every mock paper has questions and sensible length", () => {
    for (const id of MOCK_IDS) {
      const qs = paperQuestions(EXAM_QUESTIONS, id);
      expect(qs.length, id).toBeGreaterThanOrEqual(5);
      const full = buildMock(EXAM_QUESTIONS, id);
      expect(full.marks, id).toBeGreaterThan(60);
      const quick = buildMock(EXAM_QUESTIONS, id, { quick: true, seed: 7 });
      expect(quick.marks, id).toBeGreaterThanOrEqual(40);
      expect(quick.marks, id).toBeLessThanOrEqual(full.marks);
    }
  });
});

describe("glossary", () => {
  it("has a healthy number of unique terms", () => {
    expect(GLOSSARY.length).toBeGreaterThanOrEqual(220);
    for (const g of GLOSSARY) expect(g.def.length, g.term).toBeGreaterThan(5);
  });
});

describe("syllabus coverage", () => {
  it("every examined topic has exam questions and a lesson quiz", () => {
    for (const t of TOPICS.filter((x) => x.paper !== 0)) {
      expect(EXAM_QUESTIONS.filter((q) => q.topic === t.topic).length, t.topic).toBeGreaterThanOrEqual(1);
      expect(QUESTION_BANK.some((q) => q.topic === t.topic), t.topic).toBe(true);
    }
  });

  it("every examined topic has Section A terminology practice", () => {
    for (const t of TOPICS.filter((x) => x.paper === 1 || x.paper === 2)) expect(getGenerator(`terms-${t.topic}`), t.topic).toBeTruthy();
  });
});
