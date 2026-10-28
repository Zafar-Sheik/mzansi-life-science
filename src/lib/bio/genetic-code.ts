/** The genetic code and helpers shared by the DNA lab and the generators. */

const BASES = ["U", "C", "A", "G"] as const;

/** Amino acids in codon-table order (first base U,C,A,G × second base × third base). */
const AA =
  "Phe Phe Leu Leu Ser Ser Ser Ser Tyr Tyr Stop Stop Cys Cys Stop Trp " +
  "Leu Leu Leu Leu Pro Pro Pro Pro His His Gln Gln Arg Arg Arg Arg " +
  "Ile Ile Ile Met Thr Thr Thr Thr Asn Asn Lys Lys Ser Ser Arg Arg " +
  "Val Val Val Val Ala Ala Ala Ala Asp Asp Glu Glu Gly Gly Gly Gly";

/** mRNA codon → three-letter amino acid (or "Stop"). */
export const CODON_TABLE: Record<string, string> = (() => {
  const names = AA.split(" ");
  const out: Record<string, string> = {};
  BASES.forEach((a, i) => BASES.forEach((b, j) => BASES.forEach((c, k) => { out[`${a}${b}${c}`] = names[i * 16 + j * 4 + k]; })));
  return out;
})();

/** Full names for read-aloud and explanations. */
export const AMINO_NAMES: Record<string, string> = {
  Phe: "phenylalanine", Leu: "leucine", Ser: "serine", Tyr: "tyrosine", Cys: "cysteine", Trp: "tryptophan", Pro: "proline", His: "histidine",
  Gln: "glutamine", Arg: "arginine", Ile: "isoleucine", Met: "methionine", Thr: "threonine", Asn: "asparagine", Lys: "lysine", Val: "valine",
  Ala: "alanine", Asp: "aspartic acid", Glu: "glutamic acid", Gly: "glycine", Stop: "stop (no amino acid)",
};

const DNA_PAIR: Record<string, string> = { A: "T", T: "A", C: "G", G: "C" };
const RNA_FROM_DNA: Record<string, string> = { A: "U", T: "A", C: "G", G: "C" };
const RNA_PAIR: Record<string, string> = { A: "U", U: "A", C: "G", G: "C" };

/** The complementary DNA strand (A–T, C–G). */
export const complementDNA = (s: string) => [...s].map((b) => DNA_PAIR[b] ?? "?").join("");
/** mRNA transcribed from a DNA template strand (A→U, T→A, C→G, G→C). */
export const transcribe = (template: string) => [...template].map((b) => RNA_FROM_DNA[b] ?? "?").join("");
/** tRNA anticodons for an mRNA strand (A–U, C–G). */
export const anticodons = (mrna: string) => [...mrna].map((b) => RNA_PAIR[b] ?? "?").join("");
/** Split a strand into triplets: "AUGGCC" → ["AUG", "GCC"]. */
export const triplets = (s: string) => s.match(/.{1,3}/g) ?? [];
/** Translate mRNA into amino acids (stops at a stop codon). */
export function translate(mrna: string): string[] {
  const out: string[] = [];
  for (const c of triplets(mrna)) {
    if (c.length < 3) break;
    const aa = CODON_TABLE[c];
    if (aa === "Stop") break;
    out.push(aa);
  }
  return out;
}

/** Codons that code for each amino acid (for building questions). */
export const CODONS_FOR: Record<string, string[]> = Object.entries(CODON_TABLE).reduce<Record<string, string[]>>((acc, [codon, aa]) => {
  (acc[aa] ??= []).push(codon);
  return acc;
}, {});
