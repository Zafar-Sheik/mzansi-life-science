"use client";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, FlaskConical } from "lucide-react";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { Spotlight } from "@/components/aceternity/spotlight";
import { FlipWords } from "@/components/aceternity/flip-words";
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect";
import { MovingBorderLink } from "@/components/aceternity/moving-border";
import { gsap, motionAllowed, useGSAP } from "@/lib/gsap";

const TEMPLATE = "TACCGGTTA".split("");
const MRNA = "AUGGCCAAU".split("");
const AMINO = ["Met", "Ala", "Asn"];
const BASE_COLOUR: Record<string, string> = { A: "#16a34a", T: "#dc2626", U: "#f59e0b", C: "#2563eb", G: "#9333ea" };

/**
 * Hero: Aceternity aurora + spotlight, and a GSAP timeline in which a strip of
 * DNA is transcribed into mRNA, base by base, and the codons are then read
 * by a ribosome into a chain of amino acids – protein synthesis in 6 seconds.
 */
export function Hero({ stats }: { stats: { lessons: number; tools: number; exam: number; terms: number } }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = root.current;
    if (!el) return;
    const fades = el.querySelectorAll("[data-fade]");
    const dna = el.querySelectorAll("[data-dna]");
    const rna = el.querySelectorAll("[data-rna]");
    const codons = el.querySelectorAll("[data-codon]");
    const aminos = el.querySelectorAll("[data-amino]");
    const extras = el.querySelectorAll("[data-extra]");
    if (!motionAllowed()) {
      gsap.set(fades, { opacity: 1, y: 0 });
      gsap.set([...dna, ...rna, ...codons, ...aminos, ...extras], { opacity: 1, y: 0, scale: 1 });
      return;
    }
    gsap.from(fades, { opacity: 0, y: 24, duration: 0.8, stagger: 0.12, ease: "power3.out", delay: 0.2 });
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2.5, delay: 0.6 });
    tl.set(dna, { opacity: 0, y: -10 })
      .set(rna, { opacity: 0, y: 14 })
      .set(codons, { opacity: 0 })
      .set(aminos, { opacity: 0, scale: 0.4 })
      .set(extras, { opacity: 0, y: 8 })
      .to(dna, { opacity: 1, y: 0, duration: 0.3, stagger: 0.06, ease: "power2.out" })
      .to(rna, { opacity: 1, y: 0, duration: 0.3, stagger: 0.12, ease: "back.out(2)" })
      .to(codons, { opacity: 1, duration: 0.3, stagger: 0.25 });
    aminos.forEach((a) => tl.to(a, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2.5)" }));
    tl.to(extras, { opacity: 1, y: 0, duration: 0.5, stagger: 0.25 }).to({}, { duration: 3 });
  }, { scope: root });

  return (
    <AuroraBackground className="border-b border-line">
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="#34d399" />
      <div ref={root} className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 pt-16 pb-20 md:pt-24 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p data-fade className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 text-sm font-semibold text-muted backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-eco" /> CAPS Life Sciences · Grade 11 &amp; 12 · Paper 1 &amp; 2
          </p>
          <h1 className="font-display text-4xl leading-[1.08] font-bold tracking-tight text-fg sm:text-5xl lg:text-6xl">
            <TextGenerateEffect words="Life Sciences you can see, touch and use." highlight={["Life", "Sciences", "use."]} />
          </h1>
          <p data-fade className="mt-5 max-w-xl text-lg text-muted">
            The whole Grade 11 and 12 syllabus in small steps – from{" "}
            <FlipWords words={["DNA and protein synthesis", "Punnett squares", "meiosis", "the menstrual cycle", "the eye and the ear", "hormones", "natural selection", "photosynthesis", "the nephron", "population ecology"]} className="inline-block font-semibold text-brand" />
            {" "}— with labs you can play with, diagrams you can tap, exam questions with memos, and biology for everyday life and your future career.
          </p>
          <div data-fade className="mt-8 flex flex-wrap gap-3">
            <MovingBorderLink href="/learn">Start learning <ArrowRight className="h-4 w-4" /></MovingBorderLink>
            <Link href="/toolkit" className="inline-flex items-center gap-2 rounded-2xl border border-line bg-surface/70 px-6 py-3 font-semibold backdrop-blur transition hover:border-brand/50">
              <FlaskConical className="h-4 w-4 text-eco" /> Open the labs
            </Link>
          </div>
          <dl data-fade className="mt-10 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[[String(stats.lessons), "lessons"], [String(stats.tools), "labs & tools"], [String(stats.exam), "exam questions"], [String(stats.terms), "key terms"]].map(([a, b]) => (
              <div key={b}>
                <dt className="sr-only">{b}</dt>
                <dd className="font-display text-3xl font-bold text-fg">{a}</dd>
                <dd className="text-sm text-muted">{b}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div data-fade className="relative">
          <div className="decorative absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-cell/30 via-eco/20 to-diversity/30 blur-2xl" aria-hidden />
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3 text-xs text-muted">
              <span className="font-mono font-semibold">GR 12 · PROTEIN SYNTHESIS</span>
              <span className="ml-auto rounded-md bg-cell px-2 py-0.5 font-semibold text-white">Live</span>
            </div>
            <div className="px-5 py-6 sm:px-7" role="img" aria-label="Animation: a DNA template strand TAC CGG TTA is transcribed into the mRNA strand AUG GCC AAU; the codons are then translated at a ribosome into the amino acids methionine, alanine and asparagine.">
              <div aria-hidden>
                <div className="text-[11px] font-bold tracking-wider text-muted uppercase">DNA template strand</div>
                <div className="mt-1 flex gap-1">
                  {TEMPLATE.map((b, i) => (
                    <span key={i} data-dna className="grid h-9 w-7 place-items-center rounded-md font-mono text-sm font-bold text-white sm:w-8" style={{ background: BASE_COLOUR[b], opacity: 0 }}>{b}</span>
                  ))}
                </div>
                <div className="my-1 flex gap-1 pl-3 text-xs text-muted">{TEMPLATE.map((_, i) => <span key={i} className="w-7 text-center sm:w-8">┊</span>)}</div>
                <div className="text-[11px] font-bold tracking-wider text-muted uppercase">mRNA (transcription, in the nucleus)</div>
                <div className="mt-1 flex gap-1">
                  {MRNA.map((b, i) => (
                    <span key={i} data-rna className="grid h-9 w-7 place-items-center rounded-md border-2 font-mono text-sm font-bold sm:w-8" style={{ borderColor: BASE_COLOUR[b], color: BASE_COLOUR[b], opacity: 0 }}>{b}</span>
                  ))}
                </div>
                <div className="mt-1 flex gap-1">
                  {[0, 1, 2].map((k) => (
                    <span key={k} data-codon className="w-[5.75rem] rounded-b-lg border-x-2 border-b-2 border-cell/60 text-center text-[10px] font-bold text-cell sm:w-[6.5rem]" style={{ opacity: 0 }}>codon {k + 1}</span>
                  ))}
                </div>
                <div className="mt-4 text-[11px] font-bold tracking-wider text-muted uppercase">Protein (translation, at the ribosome)</div>
                <div className="mt-1 flex items-center gap-1">
                  {AMINO.map((a, i) => (
                    <span key={a} className="flex items-center gap-1">
                      <span data-amino className="grid h-11 w-14 place-items-center rounded-full bg-gradient-to-br from-eco to-diversity font-mono text-sm font-bold text-white shadow" style={{ opacity: 0 }}>{a}</span>
                      {i < AMINO.length - 1 && <span data-amino className="h-1 w-3 rounded bg-muted" style={{ opacity: 0 }} />}
                    </span>
                  ))}
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <div data-extra className="rounded-xl border border-line bg-elevated p-3 text-xs" style={{ opacity: 0 }}>
                    <div className="font-bold text-cell uppercase">Base pairing</div>
                    <div className="mt-1 font-semibold">DNA A → mRNA <span className="text-[#f59e0b]">U</span> · T → A · C ↔ G</div>
                  </div>
                  <div data-extra className="rounded-xl border border-line bg-elevated p-3 text-xs" style={{ opacity: 0 }}>
                    <div className="font-bold text-eco uppercase">Exam tip</div>
                    <div className="mt-1 font-semibold">3 bases = 1 codon = 1 amino acid ✓</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}
