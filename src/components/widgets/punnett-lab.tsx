"use client";
import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { alleleLabel, diCross, diPhenotypes, monoCross, monoGenotypes, monoPhenotypes, type Mode, type Pair, pairLabel, phenotype, simplest, TRAITS, type TraitNames } from "@/lib/bio/genetics";
import { cn } from "@/lib/utils";
import { Explain, useToolUse } from "./sim-kit";
import { Segmented, Toggle, WidgetFrame } from "./widget-frame";

type Kind = "mono" | "blood" | "sex" | "di";

const BLOOD_OPTIONS: Pair[] = [["IA", "IA"], ["IA", "i"], ["IB", "IB"], ["IB", "i"], ["IA", "IB"], ["i", "i"]];
const COLOURS = ["#16a34a", "#f59e0b", "#2563eb", "#db2777", "#7c3aed"];

function PairPicker({ label, options, value, onChange }: { label: string; options: Pair[]; value: Pair; onChange: (p: Pair) => void }) {
  return (
    <div>
      <div className="mb-1 text-xs font-bold text-muted uppercase">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const on = o.join() === value.join();
          return <button key={o.join()} onClick={() => onChange(o)} aria-pressed={on} className={cn("rounded-lg border-2 px-2.5 py-1 font-mono text-sm font-bold transition", on ? "border-cell bg-cell text-white" : "border-line hover:border-cell/50")}>{pairLabel(o)}</button>;
        })}
      </div>
    </div>
  );
}

/**
 * Punnett square lab: pick a trait and the parents' genotypes, predict, then
 * reveal the gametes, the Punnett square and the ratios. Covers complete,
 * incomplete and co-dominance, blood groups, sex-linked traits and dihybrid
 * crosses – and shows the NSC "6-mark" cross layout.
 */
export function PunnettLab({ start = "mono" }: { start?: Kind }) {
  const touch = useToolUse();
  const [kind, setKind] = useState<Kind>(start);
  const [traitId, setTraitId] = useState(TRAITS[0].id);
  const trait = TRAITS.find((t) => t.id === traitId) ?? TRAITS[0];
  const L = trait.gene;
  const l = L.toLowerCase();
  const monoOptions: Pair[] = [[L, L], [L, l], [l, l]];
  const [mother, setMother] = useState<Pair>(["A", "a"]);
  const [father, setFather] = useState<Pair>(["A", "a"]);
  const [disorder, setDisorder] = useState<"H" | "B">("H");
  const [diM, setDiM] = useState<[Pair, Pair]>([["T", "t"], ["R", "r"]]);
  const [diF, setDiF] = useState<[Pair, Pair]>([["T", "t"], ["R", "r"]]);
  const [hidden, setHidden] = useState(true);
  const [layout, setLayout] = useState(false);

  // Keep the genotypes valid for the current trait / cross type.
  const fix = (p: Pair, opts: Pair[]) => (opts.some((o) => o.join() === p.join()) ? p : opts[1]);
  const sexOpts = { mother: [[`X${disorder}`, `X${disorder}`], [`X${disorder}`, `X${disorder.toLowerCase()}`], [`X${disorder.toLowerCase()}`, `X${disorder.toLowerCase()}`]] as Pair[], father: [[`X${disorder}`, "Y"], [`X${disorder.toLowerCase()}`, "Y"]] as Pair[] };
  const m = kind === "mono" ? fix(mother, monoOptions) : kind === "blood" ? fix(mother, BLOOD_OPTIONS) : kind === "sex" ? fix(mother, sexOpts.mother) : mother;
  const f = kind === "mono" ? fix(father, monoOptions) : kind === "blood" ? fix(father, BLOOD_OPTIONS) : kind === "sex" ? fix(father, sexOpts.father) : father;
  const mode: Mode = kind === "blood" ? "blood" : kind === "sex" ? "sex-linked" : trait.mode;
  const names: TraitNames = useMemo(() => (kind === "sex" ? { dom: "", rec: "", disorder: disorder === "H" ? "haemophilia" : "colour-blindness" } : trait.names), [kind, disorder, trait]);

  const result = useMemo(() => {
    if (kind === "di") {
      const ph = diPhenotypes(diM, diF, [TRAITS[0].names, TRAITS[2].names]);
      return { ph, geno: [] as { label: string; count: number }[], total: 16 };
    }
    return { ph: monoPhenotypes(m, f, mode, names), geno: monoGenotypes(m, f), total: 4 };
  }, [kind, m, f, mode, names, diM, diF]);
  const ratio = simplest(result.ph.map((x) => x.count)).join(" : ");
  const colourOf = (label: string) => COLORS_BY(result.ph.map((x) => x.label), label);

  const change = (fn: () => void) => { touch(); setHidden(true); fn(); };
  const gm = kind === "di" ? diM[0].flatMap((a) => diM[1].map((b) => `${a}${b}`)) : m;
  const gf = kind === "di" ? diF[0].flatMap((a) => diF[1].map((b) => `${a}${b}`)) : f;
  const show = (a: string) => (kind === "di" ? a : alleleLabel(a));

  return (
    <WidgetFrame title="Punnett square lab" colour="var(--t-cell)" instruction="Choose the cross and the parents. Predict the offspring first – then reveal.">
      <Segmented colour="var(--t-cell)" value={kind} onChange={(k) => change(() => setKind(k))} options={[{ id: "mono", label: "Monohybrid" }, { id: "blood", label: "Blood groups" }, { id: "sex", label: "Sex-linked" }, { id: "di", label: "Dihybrid" }]} />

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {kind === "mono" && (
          <div className="md:col-span-2">
            <div className="mb-1 text-xs font-bold text-muted uppercase">Trait</div>
            <select value={traitId} onChange={(e) => change(() => setTraitId(e.target.value))} className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm">
              {TRAITS.map((t) => <option key={t.id} value={t.id}>{t.organism}: {t.names.dom}{t.names.mid ? ` / ${t.names.mid}` : ""} / {t.names.rec} ({t.mode === "complete" ? "complete dominance" : t.mode === "incomplete" ? "incomplete dominance" : "co-dominance"})</option>)}
            </select>
            <p className="mt-1 text-xs text-muted">{trait.mode === "complete" ? `${L} (${trait.names.dom}) is dominant over ${l} (${trait.names.rec}).` : `${L}${L} = ${trait.names.dom}, ${L}${l} = ${trait.names.mid}, ${l}${l} = ${trait.names.rec}.`}</p>
          </div>
        )}
        {kind === "sex" && (
          <div className="md:col-span-2">
            <Segmented colour="var(--t-cell)" value={disorder} onChange={(x) => change(() => setDisorder(x))} options={[{ id: "H", label: "Haemophilia" }, { id: "B", label: "Colour-blindness" }]} />
            <p className="mt-1 text-xs text-muted">The recessive allele is on the X chromosome. The Y chromosome carries no allele for this gene.</p>
          </div>
        )}
        {kind === "di" ? (
          <>
            <div className="space-y-2">
              <PairPicker label="Mother: height" options={[["T", "T"], ["T", "t"], ["t", "t"]]} value={diM[0]} onChange={(p) => change(() => setDiM([p, diM[1]]))} />
              <PairPicker label="Mother: seed shape" options={[["R", "R"], ["R", "r"], ["r", "r"]]} value={diM[1]} onChange={(p) => change(() => setDiM([diM[0], p]))} />
            </div>
            <div className="space-y-2">
              <PairPicker label="Father: height" options={[["T", "T"], ["T", "t"], ["t", "t"]]} value={diF[0]} onChange={(p) => change(() => setDiF([p, diF[1]]))} />
              <PairPicker label="Father: seed shape" options={[["R", "R"], ["R", "r"], ["r", "r"]]} value={diF[1]} onChange={(p) => change(() => setDiF([diF[0], p]))} />
            </div>
            <p className="text-xs text-muted md:col-span-2">Pea plants: T (tall) is dominant over t (short); R (round seeds) is dominant over r (wrinkled seeds).</p>
          </>
        ) : (
          <>
            <PairPicker label={`Mother – ${phenotype(m, mode, names)}`} options={kind === "mono" ? monoOptions : kind === "blood" ? BLOOD_OPTIONS : sexOpts.mother} value={m} onChange={(p) => change(() => setMother(p))} />
            <PairPicker label={`Father – ${phenotype(f, mode, names)}`} options={kind === "mono" ? monoOptions : kind === "blood" ? BLOOD_OPTIONS : sexOpts.father} value={f} onChange={(p) => change(() => setFather(p))} />
          </>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Toggle on={!hidden} onChange={(v) => { touch(); setHidden(!v); }}>{hidden ? <><Eye className="mr-1 inline h-3.5 w-3.5" />Reveal the offspring</> : <><EyeOff className="mr-1 inline h-3.5 w-3.5" />Hide (predict again)</>}</Toggle>
        <Toggle on={layout} onChange={setLayout}>Show the exam layout</Toggle>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="mx-auto border-collapse text-center font-mono">
          <thead>
            <tr>
              <th className="p-1 text-[10px] font-bold text-muted">♀ \ ♂</th>
              {gf.map((g, i) => <th key={i} className="min-w-12 border-b-2 border-cell p-2 text-sm font-bold text-cell">{show(g)}</th>)}
            </tr>
          </thead>
          <tbody>
            {gm.map((a, i) => (
              <tr key={i}>
                <th className="border-r-2 border-cell p-2 text-sm font-bold text-cell">{show(a)}</th>
                {gf.map((b, j) => {
                  let geno = "";
                  let ph = "";
                  if (kind === "di") {
                    const cell = diCross(diM, diF)[i][j];
                    geno = cell.map(pairLabel).join("");
                    ph = `${phenotype(cell[0], "complete", TRAITS[0].names)}, ${phenotype(cell[1], "complete", TRAITS[2].names)}`;
                  } else {
                    const cell = monoCross(m, f)[i][j];
                    geno = pairLabel(cell);
                    ph = phenotype(cell, mode, names);
                  }
                  return (
                    <td key={j} className={cn("border border-line p-1.5 text-sm transition", kind === "di" ? "min-w-16" : "min-w-20")} style={hidden ? undefined : { background: `color-mix(in oklab, ${colourOf(ph)} 18%, transparent)` }}>
                      {hidden ? <span className="text-muted">?</span> : <><div className="font-bold">{geno}</div>{kind !== "di" && <div className="font-sans text-[10px] leading-tight text-muted">{ph}</div>}</>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!hidden && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-xs font-bold text-muted uppercase">Phenotypes</div>
            <ul className="mt-1 space-y-1.5">
              {result.ph.map((x) => (
                <li key={x.label} className="text-sm">
                  <div className="flex justify-between"><span>{x.label}</span><strong>{x.count}/{result.total} = {Math.round((x.count / result.total) * 1000) / 10}%</strong></div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-2"><div className="h-full rounded-full transition-[width]" style={{ width: `${(x.count / result.total) * 100}%`, background: colourOf(x.label) }} /></div>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm">Phenotypic ratio: <strong className="font-mono">{ratio}</strong></p>
            {result.geno.length > 0 && <p className="text-sm">Genotypic ratio: <strong className="font-mono">{simplest(result.geno.map((x) => x.count)).join(" : ")}</strong> ({result.geno.map((x) => x.label).join(" : ")})</p>}
          </div>
          <Explain colour="var(--t-cell)">
            {kind === "mono" && (trait.mode === "complete" ? <>One dominant allele is enough to show the dominant trait. Only <strong>{l}{l}</strong> shows {trait.names.rec}. Two heterozygous parents give <strong>3 : 1</strong>; a heterozygote × homozygous recessive (a <em>test cross</em>) gives <strong>1 : 1</strong>.</> : <>In {trait.mode === "incomplete" ? "incomplete dominance the heterozygote is a blend" : "co-dominance both alleles show"} – <strong>{trait.names.mid}</strong>. So the phenotypic ratio equals the genotypic ratio (1 : 2 : 1 for two heterozygotes).</>)}
            {kind === "blood" && <>Iᴬ and Iᴮ are <strong>co-dominant</strong> (IᴬIᴮ = group AB) and both are dominant over <strong>i</strong> (ii = group O). Three alleles for one gene = <strong>multiple alleles</strong>.</>}
            {kind === "sex" && <>Sons get their X from their <strong>mother</strong>, so a carrier mother passes the disorder to half her sons. Males have only one X, so one recessive allele is enough – that is why more males have {names.disorder}.</>}
            {kind === "di" && <>Each gamete gets one allele of each gene, in every combination (<strong>independent assortment</strong>). TtRr × TtRr gives <strong>9 : 3 : 3 : 1</strong>; TtRr × ttrr gives <strong>1 : 1 : 1 : 1</strong>.</>}
          </Explain>
        </div>
      )}

      {layout && kind !== "di" && (
        <div className="mt-4 rounded-2xl border border-dashed border-cell/50 p-4 font-mono text-sm leading-7">
          <div className="mb-1 font-sans text-xs font-bold text-muted uppercase">How to set out a genetic cross (6 marks)</div>
          <div><strong>P₁</strong>&nbsp;&nbsp;Phenotype&nbsp;&nbsp;&nbsp;{phenotype(m, mode, names)} × {phenotype(f, mode, names)} ✓</div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;Genotype&nbsp;&nbsp;&nbsp;&nbsp;{pairLabel(m)} × {pairLabel(f)} ✓</div>
          <div><strong>Meiosis</strong></div>
          <div><strong>G/gametes</strong>&nbsp;&nbsp;{m.map((a) => show(a)).join(", ")} × {f.map((a) => show(a)).join(", ")} ✓</div>
          <div><strong>Fertilisation</strong></div>
          <div><strong>F₁</strong>&nbsp;&nbsp;Genotype&nbsp;&nbsp;&nbsp;&nbsp;{monoCross(m, f).flat().map(pairLabel).join(", ")} ✓</div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;Phenotype&nbsp;&nbsp;&nbsp;{result.ph.map((x) => `${x.count} ${x.label}`).join(" : ")} ✓</div>
          <div className="mt-1 font-sans text-xs text-muted">P₁ and F₁ ✓ · meiosis and fertilisation ✓ – the two words are worth a mark together. Or draw a Punnett square instead of the gametes and F₁ lines.</div>
        </div>
      )}
    </WidgetFrame>
  );
}

function COLORS_BY(labels: string[], label: string) {
  const i = labels.indexOf(label);
  return COLOURS[(i < 0 ? 0 : i) % COLOURS.length];
}
