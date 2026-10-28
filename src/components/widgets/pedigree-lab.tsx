"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Explain, useToolUse } from "./sim-kit";
import { Segmented, Toggle, WidgetFrame } from "./widget-frame";

interface Person { id: number; x: number; gen: 1 | 2 | 3; male: boolean; affected: boolean; carrier?: boolean; genotype: string; options: string[]; why: string }
interface Pedigree { id: string; title: string; key: string; how: string; people: Person[]; couples: [number, number, number[]][] }

const PEDIGREES: Pedigree[] = [
  {
    id: "albinism", title: "Albinism (recessive)", key: "Shaded = albinism (aa). A = normal pigment, a = albinism.",
    how: "Two normal parents (1 and 2) have a child with albinism (3), so the trait must be recessive and both parents must carry it.",
    people: [
      { id: 1, x: 140, gen: 1, male: true, affected: false, genotype: "Aa", options: ["AA", "Aa", "aa"], why: "Normal, but his daughter (3) is aa – she got one a from him." },
      { id: 2, x: 220, gen: 1, male: false, affected: false, genotype: "Aa", options: ["AA", "Aa", "aa"], why: "Normal, but her daughter (3) is aa – she got one a from her." },
      { id: 3, x: 90, gen: 2, male: false, affected: true, genotype: "aa", options: ["AA", "Aa", "aa"], why: "She shows the recessive trait, so she must be homozygous recessive." },
      { id: 4, x: 180, gen: 2, male: true, affected: false, genotype: "AA or Aa", options: ["AA", "Aa", "AA or Aa"], why: "Normal, and his parents are both Aa – he could be AA or Aa. We can't tell." },
      { id: 5, x: 260, gen: 2, male: true, affected: false, genotype: "Aa", options: ["AA", "Aa", "aa"], why: "Normal, but his son (7) has albinism, so he must carry a." },
      { id: 6, x: 340, gen: 2, male: false, affected: true, genotype: "aa", options: ["AA", "Aa", "aa"], why: "Shows albinism, so she is aa." },
      { id: 7, x: 260, gen: 3, male: true, affected: true, genotype: "aa", options: ["AA", "Aa", "aa"], why: "Shows albinism, so he is aa." },
      { id: 8, x: 340, gen: 3, male: false, affected: false, genotype: "Aa", options: ["AA", "Aa", "aa"], why: "Normal, but her mother (6) is aa and gave her an a." },
    ],
    couples: [[1, 2, [3, 4, 5]], [5, 6, [7, 8]]],
  },
  {
    id: "haemophilia", title: "Haemophilia (sex-linked)", key: "Shaded = haemophilia. Dot = carrier female. Xᴴ = normal, Xʰ = haemophilia.",
    how: "The disorder appears in sons of a normal mother – she must be a carrier. Males show it with just one Xʰ.",
    people: [
      { id: 1, x: 140, gen: 1, male: true, affected: false, genotype: "XᴴY", options: ["XᴴY", "XʰY"], why: "A normal male has the normal allele on his only X." },
      { id: 2, x: 220, gen: 1, male: false, affected: false, carrier: true, genotype: "XᴴXʰ", options: ["XᴴXᴴ", "XᴴXʰ", "XʰXʰ"], why: "Normal, but her son (3) has haemophilia – he got his Xʰ from her." },
      { id: 3, x: 90, gen: 2, male: true, affected: true, genotype: "XʰY", options: ["XᴴY", "XʰY"], why: "An affected male has Xʰ on his only X chromosome." },
      { id: 4, x: 180, gen: 2, male: false, affected: false, genotype: "XᴴXᴴ or XᴴXʰ", options: ["XᴴXᴴ", "XᴴXʰ", "XᴴXᴴ or XᴴXʰ"], why: "She got Xᴴ from her father; from her carrier mother she could have got Xᴴ or Xʰ." },
      { id: 5, x: 260, gen: 2, male: false, affected: false, carrier: true, genotype: "XᴴXʰ", options: ["XᴴXᴴ", "XᴴXʰ", "XʰXʰ"], why: "Normal, but her son (7) has haemophilia, so she is a carrier." },
      { id: 6, x: 340, gen: 2, male: true, affected: false, genotype: "XᴴY", options: ["XᴴY", "XʰY"], why: "A normal male." },
      { id: 7, x: 260, gen: 3, male: true, affected: true, genotype: "XʰY", options: ["XᴴY", "XʰY"], why: "Affected male – his Xʰ came from his mother (5), never from his father." },
      { id: 8, x: 340, gen: 3, male: false, affected: false, genotype: "XᴴXᴴ or XᴴXʰ", options: ["XᴴXᴴ", "XᴴXʰ", "XᴴXᴴ or XᴴXʰ"], why: "Xᴴ from her father (6); from her mother either allele." },
    ],
    couples: [[1, 2, [3, 4, 5]], [5, 6, [7, 8]]],
  },
  {
    id: "dimples", title: "Dimples (dominant)", key: "Shaded = dimples (D_). D = dimples (dominant), d = no dimples.",
    how: "Two parents with dimples (5 and 6) have a child without (7), so 'no dimples' is recessive and dimples is dominant.",
    people: [
      { id: 1, x: 140, gen: 1, male: true, affected: true, genotype: "Dd", options: ["DD", "Dd", "dd"], why: "Has dimples, but his son (4) has none – so he passed on d." },
      { id: 2, x: 220, gen: 1, male: false, affected: false, genotype: "dd", options: ["DD", "Dd", "dd"], why: "No dimples = recessive phenotype = dd." },
      { id: 3, x: 90, gen: 2, male: false, affected: true, genotype: "Dd", options: ["DD", "Dd", "dd"], why: "Has dimples; her mother (2) is dd, so she must have one d." },
      { id: 4, x: 180, gen: 2, male: true, affected: false, genotype: "dd", options: ["DD", "Dd", "dd"], why: "No dimples = dd." },
      { id: 5, x: 260, gen: 2, male: true, affected: true, genotype: "Dd", options: ["DD", "Dd", "dd"], why: "Has dimples; his mother is dd, and his son (7) is dd." },
      { id: 6, x: 340, gen: 2, male: false, affected: true, genotype: "Dd", options: ["DD", "Dd", "dd"], why: "Has dimples, but her son (7) is dd, so she passed on d." },
      { id: 7, x: 260, gen: 3, male: true, affected: false, genotype: "dd", options: ["DD", "Dd", "dd"], why: "No dimples = dd." },
      { id: 8, x: 340, gen: 3, male: false, affected: true, genotype: "DD or Dd", options: ["DD", "Dd", "DD or Dd"], why: "Both parents are Dd: she could be DD or Dd." },
    ],
    couples: [[1, 2, [3, 4, 5]], [5, 6, [7, 8]]],
  },
];

const Y = { 1: 50, 2: 140, 3: 230 } as const;

/**
 * Pedigree reader: tap any person to see their genotype and how we know it,
 * or switch on "work it out" and choose the genotype yourself first.
 */
export function PedigreeLab() {
  const touch = useToolUse();
  const [pid, setPid] = useState(PEDIGREES[0].id);
  const ped = PEDIGREES.find((p) => p.id === pid)!;
  const [sel, setSel] = useState<number | null>(null);
  const [quiz, setQuiz] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const person = ped.people.find((p) => p.id === sel);
  const P = (id: number) => ped.people.find((p) => p.id === id)!;
  const answered = person ? answers[`${pid}-${person.id}`] : undefined;

  return (
    <WidgetFrame title="Pedigree diagrams" colour="var(--t-cell)" instruction="Squares are males, circles are females. Tap a person to work out their genotype.">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented colour="var(--t-cell)" value={pid} onChange={(v) => { touch(); setPid(v); setSel(null); }} options={PEDIGREES.map((p) => ({ id: p.id, label: p.title }))} />
        <Toggle on={quiz} onChange={setQuiz}>Work it out myself</Toggle>
      </div>
      <p className="mt-2 text-xs text-muted">{ped.key}</p>
      <div className="mt-2 grid gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <svg viewBox="0 0 420 270" className="diagram rounded-2xl border border-line bg-bg" role="group" aria-label={`Pedigree diagram: ${ped.title}`}>
          {ped.couples.map(([a, b, kids], i) => {
            const pa = P(a);
            const pb = P(b);
            const midX = (pa.x + pb.x) / 2;
            const yy = Y[pa.gen];
            const kidsX = kids.map((k) => P(k).x);
            const barY = yy + 45;
            return (
              <g key={i} style={{ stroke: "var(--text)" }} strokeWidth={1.5} fill="none">
                <line x1={pa.x} y1={yy} x2={pb.x} y2={yy} />
                <line x1={midX} y1={yy} x2={midX} y2={barY} />
                <line x1={Math.min(...kidsX, midX)} y1={barY} x2={Math.max(...kidsX, midX)} y2={barY} />
                {kidsX.map((x, j) => <line key={j} x1={x} y1={barY} x2={x} y2={Y[P(kids[j]).gen] - 14} />)}
              </g>
            );
          })}
          {ped.people.map((p) => {
            const y = Y[p.gen];
            const on = sel === p.id;
            const fill = p.affected ? "var(--t-cell)" : "var(--surface)";
            return (
              <g key={p.id} role="button" tabIndex={0} aria-label={`Person ${p.id}, ${p.male ? "male" : "female"}, ${p.affected ? "affected" : "not affected"}`} onClick={() => { touch(); setSel(p.id); }} onKeyDown={(e) => e.key === "Enter" && setSel(p.id)} style={{ cursor: "pointer" }}>
                {p.male ? <rect x={p.x - 14} y={y - 14} width={28} height={28} style={{ fill, stroke: on ? "var(--brand)" : "var(--text)" }} strokeWidth={on ? 3.5 : 1.5} /> : <circle cx={p.x} cy={y} r={14} style={{ fill, stroke: on ? "var(--brand)" : "var(--text)" }} strokeWidth={on ? 3.5 : 1.5} />}
                {p.carrier && <circle cx={p.x} cy={y} r={4} style={{ fill: "var(--t-cell)" }} />}
                <text x={p.x} y={y + 30} textAnchor="middle" fontSize={11} fontWeight={700}>{p.id}</text>
                {(!quiz || answers[`${pid}-${p.id}`]) && <text x={p.x + 18} y={y - 14} fontSize={9} className="muted">{p.genotype}</text>}
              </g>
            );
          })}
          <text x={10} y={Y[1] + 4} fontSize={11} fontWeight={700} className="muted">I</text>
          <text x={10} y={Y[2] + 4} fontSize={11} fontWeight={700} className="muted">II</text>
          <text x={10} y={Y[3] + 4} fontSize={11} fontWeight={700} className="muted">III</text>
        </svg>
        <div>
          {!person && <p className="rounded-xl bg-surface-2 p-3 text-sm text-muted">Tap a person in the diagram.</p>}
          {person && (
            <div className="rounded-xl bg-surface-2 p-3 text-sm">
              <div className="font-display text-lg font-bold">Person {person.id}</div>
              <div className="text-muted">{person.male ? "Male" : "Female"} · {person.affected ? "shows the trait" : person.carrier ? "carrier (normal)" : "does not show the trait"}</div>
              {quiz && !answered ? (
                <div className="mt-2">
                  <div className="font-semibold">What is the genotype?</div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {person.options.map((o) => <button key={o} onClick={() => { touch(); setAnswers((a) => ({ ...a, [`${pid}-${person.id}`]: o })); }} className="rounded-lg border-2 border-line px-2.5 py-1 font-mono font-bold hover:border-cell/50">{o}</button>)}
                  </div>
                </div>
              ) : (
                <div className={cn("mt-2 rounded-lg p-2", !quiz || answered === person.genotype ? "bg-success/10" : "bg-warning/10")}>
                  {quiz && <div className="font-semibold">{answered === person.genotype ? "✅ Correct!" : `Not quite – you chose ${answered}.`}</div>}
                  <div>Genotype: <strong className="font-mono">{person.genotype}</strong></div>
                  <div className="mt-1">{person.why}</div>
                </div>
              )}
            </div>
          )}
          <Explain colour="var(--t-cell)">{ped.how} Always start with the people who show the <strong>recessive phenotype</strong> – their genotype is certain.</Explain>
        </div>
      </div>
    </WidgetFrame>
  );
}
