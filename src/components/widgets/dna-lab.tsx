"use client";
import { useMemo, useState } from "react";
import { Dices, RotateCcw, Wand2 } from "lucide-react";
import { AMINO_NAMES, anticodons, CODON_TABLE, complementDNA, transcribe, triplets } from "@/lib/bio/genetic-code";
import { solvePuzzle } from "@/lib/progress";
import { cn, seededRandom } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Explain, useToolUse } from "./sim-kit";
import { Segmented, Toggle, WidgetFrame } from "./widget-frame";

type Stage = "replication" | "transcription" | "translation" | "mutation";
const COLOUR: Record<string, string> = { A: "#16a34a", T: "#dc2626", U: "#d97706", C: "#2563eb", G: "#9333ea" };
const START = "TACGGTCAAATT";

function Base({ b, outline, dim, small }: { b: string; outline?: boolean; dim?: boolean; small?: boolean }) {
  return (
    <span className={cn("grid shrink-0 place-items-center rounded-md font-mono font-bold transition", small ? "h-7 w-6 text-xs" : "h-9 w-7 text-sm", outline ? "border-2 bg-surface" : "text-white", dim && "opacity-30")}
      style={outline ? { borderColor: COLOUR[b] ?? "var(--border)", color: COLOUR[b] ?? "var(--text-muted)" } : { background: COLOUR[b] ?? "var(--surface-2)" }}>
      {b}
    </span>
  );
}

function Strand({ label, bases, outline, codons }: { label: string; bases: string; outline?: boolean; codons?: boolean }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-bold tracking-wider text-muted uppercase">{label}</div>
      <div className="flex flex-wrap gap-1">
        {(codons ? triplets(bases) : [bases]).map((group, gi) => (
          <span key={gi} className={cn("flex gap-0.5", codons && "rounded-lg border border-dashed border-line p-0.5")}>
            {[...group].map((b, i) => <Base key={i} b={b} outline={outline} />)}
          </span>
        ))}
      </div>
    </div>
  );
}

const protein = (mrna: string) => {
  const out: string[] = [];
  for (const c of triplets(mrna)) {
    if (c.length < 3) break;
    const aa = CODON_TABLE[c];
    out.push(aa);
    if (aa === "Stop") break;
  }
  return out;
};

/**
 * The DNA lab: replication, transcription and translation for one strand –
 * either "you pair it" (tap the matching base for each position) or "show me"
 * – and a mutation bench to see how a point mutation or a frameshift changes
 * the protein.
 */
export function DnaLab({ stage: initial = "transcription" }: { stage?: Stage }) {
  const touch = useToolUse();
  const [stage, setStage] = useState<Stage>(initial);
  const [template, setTemplate] = useState(START);
  const [built, setBuilt] = useState("");
  const [practice, setPractice] = useState(true);
  const [wrong, setWrong] = useState<string | null>(null);
  const [mutant, setMutant] = useState(START);
  const [seed, setSeed] = useState(1);

  const target = stage === "replication" ? complementDNA(template) : stage === "transcription" ? transcribe(template) : "";
  const mrna = transcribe(template);
  const done = built.length >= target.length && target.length > 0;
  const keys = stage === "replication" ? ["A", "T", "C", "G"] : ["A", "U", "C", "G"];

  const press = (b: string) => {
    touch();
    if (done) return;
    const want = target[built.length];
    if (b === want) {
      const next = built + b;
      setBuilt(next);
      setWrong(null);
      if (next.length === target.length) solvePuzzle(`dna-lab:${stage}:${template}`, 10);
    } else {
      const partner = template[built.length];
      setWrong(stage === "replication" ? `${partner} pairs with ${want} in DNA.` : partner === "A" ? "DNA A pairs with U in RNA – there is no T in RNA." : `${partner} on the DNA pairs with ${want} on the mRNA.`);
    }
  };
  const newStrand = () => {
    const r = seededRandom(`dna-${seed}`);
    const s = Array.from({ length: 12 }, () => "ATCG"[Math.floor(r() * 4)]).join("");
    // Start with TAC so that the mRNA starts with the start codon AUG.
    const t = `TAC${s.slice(3)}`;
    setSeed((x) => x + 1);
    setTemplate(t);
    setMutant(t);
    setBuilt("");
    setWrong(null);
  };
  const go = (s: Stage) => {
    setStage(s);
    setBuilt("");
    setWrong(null);
  };

  const original = useMemo(() => protein(transcribe(template)), [template]);
  const mutated = useMemo(() => protein(transcribe(mutant)), [mutant]);
  const kind = useMemo(() => {
    if (mutant === template) return null;
    if (mutant.length !== template.length) return "frameshift";
    if (mutated.join() === original.join()) return "silent";
    if (mutated.includes("Stop") && mutated.indexOf("Stop") < original.length - (original.includes("Stop") ? 1 : 0)) return "nonsense";
    return "missense";
  }, [mutant, template, mutated, original]);

  return (
    <WidgetFrame title="DNA & protein synthesis lab" colour="var(--t-cell)" instruction="Pick a stage. In ‘you pair it’ mode, tap the matching base for each position.">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented colour="var(--t-cell)" value={stage} onChange={go} options={[{ id: "replication", label: "1. Replication" }, { id: "transcription", label: "2. Transcription" }, { id: "translation", label: "3. Translation" }, { id: "mutation", label: "Mutations" }]} />
        <Button size="sm" variant="ghost" onClick={newStrand}><Dices className="h-4 w-4" /> New strand</Button>
      </div>

      {(stage === "replication" || stage === "transcription") && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Toggle on={practice} onChange={(v) => { setPractice(v); setBuilt(""); }}>You pair it</Toggle>
            <Toggle on={!practice} onChange={(v) => { setPractice(!v); setBuilt(v ? target : ""); }}>Show me</Toggle>
          </div>
          <Strand label={stage === "replication" ? "Original DNA strand (unzipped)" : "DNA template strand"} bases={template} />
          <div className="flex gap-1 pl-0.5 text-xs text-muted" aria-hidden>{[...template].map((_, i) => <span key={i} className="w-7 text-center">{i < (practice ? built.length : target.length) ? "┊" : ""}</span>)}</div>
          <div>
            <div className="mb-1 text-[11px] font-bold tracking-wider text-muted uppercase">{stage === "replication" ? "New complementary strand" : "mRNA"}</div>
            <div className="flex flex-wrap gap-1">
              {[...target].map((b, i) => (practice ? (i < built.length ? <Base key={i} b={b} outline /> : <span key={i} className={cn("grid h-9 w-7 place-items-center rounded-md border-2 border-dashed text-sm", i === built.length ? "border-brand" : "border-line")}>{i === built.length ? "?" : ""}</span>) : <Base key={i} b={b} outline />))}
            </div>
          </div>
          {practice && !done && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Choose the matching base">
              {keys.map((k) => <button key={k} onClick={() => press(k)} className="h-12 w-12 rounded-xl border-2 font-mono text-xl font-bold transition hover:brightness-110" style={{ borderColor: COLOUR[k], color: COLOUR[k] }}>{k}</button>)}
              <button onClick={() => setBuilt((b) => b.slice(0, -1))} className="h-12 rounded-xl border-2 border-line px-3 text-sm font-semibold text-muted">Undo</button>
            </div>
          )}
          {wrong && <p role="status" className="rounded-xl bg-warning/10 p-2 text-sm">💡 {wrong}</p>}
          {done && <p role="status" className="rounded-xl bg-success/10 p-2 text-sm font-semibold">✅ {stage === "replication" ? "Two identical DNA molecules – each with one old and one new strand (semi-conservative replication)." : "mRNA complete! It now leaves the nucleus through a nuclear pore and goes to a ribosome."}</p>}
          <Explain colour="var(--t-cell)">
            {stage === "replication" ? <>DNA <strong>unwinds</strong> and <strong>unzips</strong> as the weak hydrogen bonds break. Free nucleotides in the nucleus pair with each strand: <strong>A–T</strong> and <strong>C–G</strong> (complementary base pairing). This happens in <strong>interphase</strong>, before cell division, so that each new cell gets a full copy.</> : <>Only <strong>one strand</strong> (the template) is copied. RNA nucleotides pair with it: DNA <strong>A → U</strong>, T → A, C → G, G → C. Transcription happens in the <strong>nucleus</strong>.</>}
          </Explain>
        </div>
      )}

      {stage === "translation" && (
        <div className="mt-4 space-y-3">
          <Strand label="mRNA codons (at the ribosome)" bases={mrna} outline codons />
          <Strand label="tRNA anticodons" bases={anticodons(mrna)} codons />
          <div>
            <div className="mb-1 text-[11px] font-bold tracking-wider text-muted uppercase">Amino acids (joined by peptide bonds)</div>
            <div className="flex flex-wrap items-center gap-1">
              {protein(mrna).map((aa, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span title={AMINO_NAMES[aa]} className={cn("grid h-10 min-w-14 place-items-center rounded-full px-2 font-mono text-sm font-bold text-white", aa === "Stop" ? "bg-danger" : "bg-gradient-to-br from-eco to-diversity")}>{aa}</span>
                  {i < protein(mrna).length - 1 && <span className="h-1 w-2 rounded bg-muted" />}
                </span>
              ))}
            </div>
          </div>
          <Explain colour="var(--t-cell)">The ribosome reads the mRNA <strong>three bases (one codon) at a time</strong>. A tRNA with the matching <strong>anticodon</strong> brings the right amino acid. Neighbouring amino acids are joined by <strong>peptide bonds</strong>. The <em>order of bases</em> decides the <em>order of amino acids</em>, which decides the shape and job of the protein. AUG (methionine) is the start codon; UAA, UAG and UGA mean stop.</Explain>
        </div>
      )}

      {stage === "mutation" && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-muted">Tap a base on the template to change it (A → C → G → T). Or insert / delete a base and watch the reading frame shift.</p>
          <div className="flex flex-wrap gap-1">
            {[...mutant].map((b, i) => (
              <button key={i} onClick={() => { touch(); setMutant(mutant.slice(0, i) + "ACGT"[("ACGT".indexOf(b) + 1) % 4] + mutant.slice(i + 1)); }} aria-label={`Base ${i + 1}: ${b}. Tap to change`} className={cn("rounded-md", mutant[i] !== template[i] && mutant.length === template.length && "ring-2 ring-danger ring-offset-1")}>
                <Base b={b} />
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => { touch(); setMutant(mutant.slice(0, 4) + "A" + mutant.slice(4)); }}>Insert a base</Button>
            <Button size="sm" variant="secondary" onClick={() => { touch(); setMutant(mutant.slice(0, 4) + mutant.slice(5)); }}>Delete a base</Button>
            <Button size="sm" variant="ghost" onClick={() => setMutant(template)}><RotateCcw className="h-4 w-4" /> Undo mutations</Button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl bg-surface-2 p-3 text-sm"><div className="text-xs font-bold text-muted uppercase">Normal protein</div><div className="mt-1 font-mono">{original.join(" – ")}</div></div>
            <div className="rounded-xl bg-surface-2 p-3 text-sm"><div className="text-xs font-bold text-muted uppercase">Mutated protein</div><div className="mt-1 font-mono">{mutated.map((aa, i) => <span key={i} className={cn(aa !== original[i] && "font-bold text-danger")}>{aa}{i < mutated.length - 1 ? " – " : ""}</span>)}</div></div>
          </div>
          <Explain colour="var(--t-cell)">
            {kind === null && <><Wand2 className="mr-1 inline h-4 w-4" />Make a mutation to see what happens.</>}
            {kind === "silent" && <><strong>No change to the protein (a harmless mutation).</strong> The new codon codes for the same amino acid – several codons code for each amino acid.</>}
            {kind === "missense" && <><strong>Point mutation – one amino acid changes.</strong> The protein may fold differently and not work (like sickle-cell anaemia), or it may still work.</>}
            {kind === "nonsense" && <><strong>A stop codon appears early.</strong> The protein is cut short and probably won&apos;t work – a harmful mutation.</>}
            {kind === "frameshift" && <><strong>Frameshift!</strong> Adding or removing one base shifts every codon after it, so almost every amino acid after the mutation changes. These are usually very harmful.</>}
          </Explain>
        </div>
      )}
    </WidgetFrame>
  );
}
