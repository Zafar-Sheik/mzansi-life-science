/**
 * A small genetics engine: gametes, Punnett squares and phenotype ratios for
 * monohybrid crosses (complete, incomplete and co-dominance), blood groups,
 * sex-linked traits and dihybrid crosses. Shared by the Punnett lab and the
 * question generators, and covered by the unit tests.
 */

export type Mode = "complete" | "incomplete" | "codominance" | "blood" | "sex-linked";

/** One gene's two alleles, e.g. ["A", "a"], ["IA", "i"], ["XH", "Y"]. */
export type Pair = [string, string];

const RANK = (a: string) => {
  // Dominant (capital) before recessive; IA, IB before i; X before Y; XH before Xh.
  if (a === "Y") return 9;
  if (a.startsWith("X")) return 5 + (a[1] === a[1]?.toUpperCase() ? 0 : 1);
  if (a === "IA") return 0;
  if (a === "IB") return 1;
  if (a === "i") return 2;
  return a === a.toUpperCase() ? 0 : 1;
};

/** Write a genotype the conventional way: dominant allele first ("Aa", not "aA"). */
export function sortPair(p: Pair): Pair {
  return [...p].sort((x, y) => RANK(x) - RANK(y) || x.localeCompare(y)) as Pair;
}

export const pairText = (p: Pair) => sortPair(p).join("");
/** Pretty allele for screen and print: XH → Xᴴ, IA → Iᴬ. */
export const alleleLabel = (a: string) => (a.startsWith("X") && a.length > 1 ? `X${sup(a.slice(1))}` : a === "IA" ? "Iᴬ" : a === "IB" ? "Iᴮ" : a);
export const pairLabel = (p: Pair) => sortPair(p).map(alleleLabel).join("");
function sup(s: string) {
  const map: Record<string, string> = { H: "ᴴ", h: "ʰ", B: "ᴮ", b: "ᵇ", R: "ᴿ", r: "ʳ", D: "ᴰ", d: "ᵈ" };
  return [...s].map((c) => map[c] ?? c).join("");
}

export interface TraitNames {
  /** Phenotype of the dominant / first allele, e.g. "tall". */
  dom: string;
  /** Phenotype of the recessive / second allele, e.g. "short". */
  rec: string;
  /** Incomplete dominance: the blend (e.g. "pink"). Co-dominance: both shown (e.g. "roan"). */
  mid?: string;
  /** Sex-linked disorder name, e.g. "haemophilia". */
  disorder?: string;
}

/** The phenotype for one gene. */
export function phenotype(p: Pair, mode: Mode, names: TraitNames): string {
  const [a, b] = sortPair(p);
  switch (mode) {
    case "complete":
      return a === a.toUpperCase() ? names.dom : names.rec;
    case "incomplete":
    case "codominance":
      return a === b ? (a === a.toUpperCase() || a === "R" ? names.dom : names.rec) : names.mid ?? `${names.dom} and ${names.rec}`;
    case "blood": {
      const s = new Set(p);
      if (s.has("IA") && s.has("IB")) return "AB";
      if (s.has("IA")) return "A";
      if (s.has("IB")) return "B";
      return "O";
    }
    case "sex-linked": {
      const male = p.includes("Y");
      const x = p.filter((q) => q !== "Y");
      const affected = x.every((q) => q[1] === q[1]?.toLowerCase());
      const d = names.disorder ?? "the disorder";
      if (male) return affected ? `male with ${d}` : "normal male";
      if (affected) return `female with ${d}`;
      return x.some((q) => q[1] === q[1]?.toLowerCase()) ? "carrier female" : "normal female";
    }
  }
}

/** Every cell of a monohybrid Punnett square (row = mother's gamete, column = father's gamete). */
export function monoCross(mother: Pair, father: Pair): Pair[][] {
  return mother.map((m) => father.map((f) => sortPair([m, f])));
}

/** Gametes for a dihybrid genotype, e.g. AaBb → AB, Ab, aB, ab (law of independent assortment). */
export function dihybridGametes(g1: Pair, g2: Pair): string[] {
  const out: string[] = [];
  for (const a of g1) for (const b of g2) out.push(`${a}${b}`);
  return out;
}

export const uniqueGametes = (gs: string[]) => [...new Set(gs)];

/** A dihybrid Punnett square: each cell is the two genes' pairs. */
export function diCross(mother: [Pair, Pair], father: [Pair, Pair]): [Pair, Pair][][] {
  const mg = mother[0].flatMap((a) => mother[1].map((b) => [a, b] as const));
  const fg = father[0].flatMap((a) => father[1].map((b) => [a, b] as const));
  return mg.map(([ma, mb]) => fg.map(([fa, fb]) => [sortPair([ma, fa]), sortPair([mb, fb])] as [Pair, Pair]));
}

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/** Count labels and reduce to the simplest whole-number ratio (keeps first-seen order). */
export function tally(labels: string[]): { label: string; count: number }[] {
  const m = new Map<string, number>();
  for (const l of labels) m.set(l, (m.get(l) ?? 0) + 1);
  return [...m.entries()].map(([label, count]) => ({ label, count }));
}

export function simplest(counts: number[]): number[] {
  const g = counts.reduce((a, b) => gcd(a, b));
  return counts.map((c) => c / g);
}

/** Phenotype tally for a monohybrid cross, ordered dominant → mid → recessive (or by blood group / sex). */
export function monoPhenotypes(mother: Pair, father: Pair, mode: Mode, names: TraitNames) {
  const cells = monoCross(mother, father).flat();
  const order = mode === "blood" ? ["A", "B", "AB", "O"] : mode === "sex-linked" ? ["normal female", "carrier female", `female with ${names.disorder}`, "normal male", `male with ${names.disorder}`] : [names.dom, names.mid ?? "", names.rec];
  return tally(cells.map((p) => phenotype(p, mode, names))).sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label));
}

export function monoGenotypes(mother: Pair, father: Pair) {
  const cells = monoCross(mother, father).flat().map(pairText);
  return tally(cells).sort((a, b) => RANK(a.label[0]) - RANK(b.label[0]) || RANK(a.label.slice(-1)) - RANK(b.label.slice(-1)));
}

/** Phenotype tally for a dihybrid cross with complete dominance in both genes. */
export function diPhenotypes(mother: [Pair, Pair], father: [Pair, Pair], names: [TraitNames, TraitNames]) {
  const cells = diCross(mother, father).flat();
  const labels = cells.map(([p1, p2]) => `${phenotype(p1, "complete", names[0])}, ${phenotype(p2, "complete", names[1])}`);
  const order = [`${names[0].dom}, ${names[1].dom}`, `${names[0].dom}, ${names[1].rec}`, `${names[0].rec}, ${names[1].dom}`, `${names[0].rec}, ${names[1].rec}`];
  return tally(labels).sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label));
}

/** Common South African exam traits. */
export const TRAITS: { id: string; gene: string; names: TraitNames; mode: Mode; organism: string }[] = [
  { id: "pea-height", gene: "T", names: { dom: "tall", rec: "short" }, mode: "complete", organism: "pea plants" },
  { id: "pea-colour", gene: "Y", names: { dom: "yellow seeds", rec: "green seeds" }, mode: "complete", organism: "pea plants" },
  { id: "seed-shape", gene: "R", names: { dom: "round seeds", rec: "wrinkled seeds" }, mode: "complete", organism: "pea plants" },
  { id: "albinism", gene: "A", names: { dom: "normal pigmentation", rec: "albinism" }, mode: "complete", organism: "humans" },
  { id: "dimples", gene: "D", names: { dom: "dimples", rec: "no dimples" }, mode: "complete", organism: "humans" },
  { id: "fur-black", gene: "B", names: { dom: "black fur", rec: "brown fur" }, mode: "complete", organism: "guinea pigs" },
  { id: "horns", gene: "H", names: { dom: "hornless", rec: "horned" }, mode: "complete", organism: "Nguni cattle" },
  { id: "earlobes", gene: "E", names: { dom: "free earlobes", rec: "attached earlobes" }, mode: "complete", organism: "humans" },
  { id: "flower-colour", gene: "R", names: { dom: "red flowers", rec: "white flowers", mid: "pink flowers" }, mode: "incomplete", organism: "snapdragons" },
  { id: "roan", gene: "R", names: { dom: "red coat", rec: "white coat", mid: "roan coat (red and white hairs)" }, mode: "codominance", organism: "cattle" },
];
