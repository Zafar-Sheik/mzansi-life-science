/**
 * Endless Life Sciences practice: every generator makes a fresh question from
 * a seed, with the memo answer (and accepted alternatives) and a full
 * explanation. The test-suite makes 150 questions per generator and checks
 * that every memo answer passes its own checker.
 */
import type { PracticeProblem, Topic } from "@/content/types";
import { seededRandom } from "@/lib/utils";
import { type Generator, int, pick, type Rng, za } from "./gen-kit";
import { AMINO_NAMES, anticodons, CODON_TABLE, CODONS_FOR, complementDNA, transcribe, triplets } from "./genetic-code";
import { diPhenotypes, dihybridGametes, monoGenotypes, monoPhenotypes, type Pair, pairText, phenotype, simplest, TRAITS, uniqueGametes } from "./genetics";

const rng = (id: string, seed: number | string): Rng => seededRandom(`${id}:${seed}`);
const DNA = ["A", "T", "C", "G"] as const;
const strand = (r: Rng, n: number) => Array.from({ length: n }, () => pick(r, DNA)).join("");
const spaced = (s: string) => triplets(s).join(" ");

// ------------------------------------------------------------------ DNA & protein synthesis

const complementary: Generator = {
  id: "dna-complement",
  title: "Complementary DNA strand",
  topic: "g12-dna",
  speed: true,
  make(seed) {
    const r = rng(this.id, seed);
    const s = strand(r, int(r, 3, 4) * 3);
    const c = complementDNA(s);
    return {
      q: `Write the **complementary DNA strand** for:\n\n\`${spaced(s)}\``,
      answer: c,
      kind: "bases",
      hint: "In DNA, **A pairs with T** and **C pairs with G** (complementary base pairing). Work one base at a time.",
      solution: `Pair each base: A↔T, C↔G.\n\n| Strand | \`${spaced(s)}\` |\n|---|---|\n| Complement | \`${spaced(c)}\` |\n\nThe two strands are held together by **weak hydrogen bonds** between the base pairs.`,
    };
  },
};

const mrna: Generator = {
  id: "dna-transcribe",
  title: "Transcription: DNA → mRNA",
  topic: "g12-dna",
  speed: true,
  make(seed) {
    const r = rng(this.id, seed);
    const s = strand(r, int(r, 3, 4) * 3);
    const m = transcribe(s);
    return {
      q: `This is the **template strand** of a DNA molecule:\n\n\`${spaced(s)}\`\n\nWrite the **mRNA** strand that is transcribed from it.`,
      answer: m,
      kind: "bases",
      hint: "mRNA is complementary to the template. RNA has **uracil (U)** instead of thymine: DNA A → mRNA **U**, T → A, C → G, G → C.",
      solution: `| DNA template | \`${spaced(s)}\` |\n|---|---|\n| mRNA | \`${spaced(m)}\` |\n\nEvery A on the DNA becomes **U** on the mRNA – there is no thymine in RNA. Transcription happens in the **nucleus**; the mRNA then moves to a ribosome.`,
    };
  },
};

const tRNA: Generator = {
  id: "dna-anticodon",
  title: "mRNA codons → tRNA anticodons",
  topic: "g12-dna",
  speed: true,
  make(seed) {
    const r = rng(this.id, seed);
    const m = transcribe(strand(r, int(r, 2, 3) * 3));
    const a = anticodons(m);
    return {
      q: `These are **mRNA codons**:\n\n\`${spaced(m)}\`\n\nWrite the matching **tRNA anticodons**.`,
      answer: a,
      kind: "bases",
      hint: "Anticodons are complementary to codons: A ↔ U and C ↔ G. tRNA is RNA, so it has U, never T.",
      solution: `| mRNA codons | \`${spaced(m)}\` |\n|---|---|\n| tRNA anticodons | \`${spaced(a)}\` |\n\nEach tRNA carries a specific **amino acid** and its anticodon pairs with the codon on the mRNA at the **ribosome** (translation).`,
    };
  },
};

const PRIMERS = ["Met", "Ala", "Gly", "Ser", "Leu", "Lys", "Val", "Pro", "Thr", "Glu", "Asp", "Phe", "Tyr", "Cys", "Arg"];

const aminoAcid: Generator = {
  id: "dna-amino",
  title: "Reading the codon table",
  topic: "g12-dna",
  make(seed) {
    const r = rng(this.id, seed);
    const options = [...new Set(Array.from({ length: 12 }, () => pick(r, PRIMERS)))].slice(0, 5);
    const target = pick(r, options);
    const codon = pick(r, CODONS_FOR[target]);
    const fromDNA = r() < 0.5;
    const tmpl = complementDNA(codon.replace(/U/g, "T"));
    const tableRows = options.map((aa) => `| ${CODONS_FOR[aa].slice(0, 3).join(", ")} | ${aa} (${AMINO_NAMES[aa]}) |`).join("\n");
    return {
      q: `${fromDNA ? `A DNA **template** triplet is \`${tmpl}\`.` : `An **mRNA codon** is \`${codon}\`.`} Use the table to name the **amino acid** it codes for.\n\n| mRNA codons | Amino acid |\n|---|---|\n${tableRows}`,
      answer: `${target} | ${AMINO_NAMES[target]}`,
      kind: "word",
      hint: fromDNA ? "First transcribe the DNA triplet into an mRNA codon (A→U, T→A, C→G, G→C). Then find it in the table." : "Find the codon in the left column.",
      solution: `${fromDNA ? `DNA \`${tmpl}\` → mRNA codon \`${codon}\`.\n\n` : ""}The codon \`${codon}\` codes for **${target} (${AMINO_NAMES[target]})**. Tables in the exam always list **mRNA codons** – check whether you were given DNA, mRNA or a tRNA anticodon first!`,
    };
  },
};

const chargaff: Generator = {
  id: "dna-chargaff",
  title: "Base percentages (A = T, C = G)",
  topic: "g12-dna",
  speed: true,
  make(seed) {
    const r = rng(this.id, seed);
    const a = int(r, 12, 38);
    const g = 50 - a;
    const given = pick(r, ["A", "T", "C", "G"] as const);
    const gv = given === "A" || given === "T" ? a : g;
    const ask = pick(r, (["A", "T", "C", "G"] as const).filter((x) => x !== given));
    const ans = ask === "A" || ask === "T" ? (given === "A" || given === "T" ? gv : 50 - gv) : given === "C" || given === "G" ? gv : 50 - gv;
    return {
      q: `In a DNA molecule, **${gv}%** of the bases are **${NAME[given]} (${given})**. What percentage are **${NAME[ask]} (${ask})**?`,
      answer: String(ans),
      kind: "number",
      hint: "A always pairs with T, so %A = %T. C pairs with G, so %C = %G. All four add up to 100%.",
      solution: `${given} = ${gv}%, so its partner ${PARTNER[given]} = ${gv}%. Together: ${gv * 2}%.\n\nThe other pair shares the rest: 100 − ${gv * 2} = ${100 - gv * 2}%, so each is ${(100 - gv * 2) / 2}%.\n\n**${ask} = ${ans}%**`,
    };
  },
};
const NAME = { A: "adenine", T: "thymine", C: "cytosine", G: "guanine" } as const;
const PARTNER = { A: "T", T: "A", C: "G", G: "C" } as const;

// ------------------------------------------------------------------ Meiosis

const SPECIES = [
  { name: "a human", n2: 46 }, { name: "a dog", n2: 78 }, { name: "a chicken", n2: 78 }, { name: "a pea plant", n2: 14 },
  { name: "a fruit fly", n2: 8 }, { name: "a maize plant", n2: 20 }, { name: "a cat", n2: 38 }, { name: "a horse", n2: 64 }, { name: "a potato plant", n2: 48 },
];

const meiosisNumbers: Generator = {
  id: "meiosis-numbers",
  title: "Chromosome numbers in meiosis",
  topic: "g12-meiosis",
  speed: true,
  make(seed) {
    const r = rng(this.id, seed);
    const s = pick(r, SPECIES);
    const kind = int(r, 0, 4);
    const qs: [string, number, string][] = [
      [`How many chromosomes are in a **gamete** of ${s.name} (2n = ${s.n2})?`, s.n2 / 2, `Meiosis halves the chromosome number: gametes are **haploid (n)**. ${s.n2} ÷ 2 = **${s.n2 / 2}**.`],
      [`How many chromosomes are in each cell at the end of **meiosis I** in ${s.name} (2n = ${s.n2})?`, s.n2 / 2, `Meiosis I separates the **homologous pairs**, so each cell gets n = **${s.n2 / 2}** chromosomes (each still made of two chromatids).`],
      [`How many **cells** are produced when ONE cell of ${s.name} completes meiosis?`, 4, `Meiosis has two divisions: 1 → 2 → **4** haploid cells.`],
      [`How many **homologous pairs** are in a body cell of ${s.name} (2n = ${s.n2})?`, s.n2 / 2, `Homologous chromosomes come in pairs: ${s.n2} ÷ 2 = **${s.n2 / 2} pairs**.`],
      [`A gamete of ${s.name} has an extra chromosome because of **non-disjunction**. How many chromosomes does the zygote have if this gamete fuses with a normal gamete? (2n = ${s.n2})`, s.n2 + 1, `Abnormal gamete: n + 1 = ${s.n2 / 2 + 1}. Normal gamete: n = ${s.n2 / 2}. Zygote: ${s.n2 / 2 + 1} + ${s.n2 / 2} = **${s.n2 + 1}** (2n + 1, like trisomy 21 in Down syndrome).`],
    ];
    const [q, a, sol] = qs[kind];
    return { q, answer: String(a), kind: "number", hint: "Diploid (2n) body cells have pairs; haploid (n) gametes have one of each.", solution: sol };
  },
};

const combos: Generator = {
  id: "meiosis-combinations",
  title: "Random arrangement: 2ⁿ gametes",
  topic: "g12-meiosis",
  make(seed) {
    const r = rng(this.id, seed);
    const n = int(r, 2, 6);
    return {
      q: `A cell has **${n} pairs** of homologous chromosomes. Because of the **random arrangement** of the pairs at the equator in metaphase I, how many genetically different gametes are possible (ignore crossing over)?`,
      answer: String(2 ** n),
      kind: "number",
      hint: "Each pair can line up in 2 ways. Multiply 2 by itself once for every pair: 2ⁿ.",
      solution: `Number of combinations = 2ⁿ = 2^${n} = **${2 ** n}**.\n\nIn humans, n = 23, so 2²³ ≈ 8 million different gametes – before crossing over adds even more variation.`,
    };
  },
};

// ------------------------------------------------------------------ Genetics


function punnettTable(m: Pair, f: Pair) {
  const head = `| | ${f[0]} | ${f[1]} |\n|---|---|---|`;
  const rows = m.map((a) => `| **${a}** | ${f.map((b) => pairText([a, b])).join(" | ")} |`).join("\n");
  return `${head}\n${rows}`;
}

const monoRatio: Generator = {
  id: "mono-ratio",
  title: "Monohybrid crosses: ratios",
  topic: "g12-genetics",
  make(seed) {
    const r = rng(this.id, seed);
    const t = pick(r, TRAITS.filter((x) => x.mode === "complete"));
    const L = t.gene;
    const l = L.toLowerCase();
    const cross = pick(r, [[[L, l], [L, l]], [[L, l], [L, l]], [[L, l], [l, l]], [[L, L], [L, l]]] as [Pair, Pair][]);
    const [m, f] = cross;
    const ph = monoPhenotypes(m, f, "complete", t.names);
    const gen = monoGenotypes(m, f);
    const askGeno = ph.length === 1 || r() < 0.35;
    const list = askGeno ? gen : ph;
    const ratio = simplest(list.map((x) => x.count)).join(":");
    const labels = list.map((x) => x.label);
    return {
      q: `In ${t.organism}, **${t.names.dom}** (${L}) is dominant over **${t.names.rec}** (${l}). A ${pairText(m)} parent is crossed with a ${pairText(f)} parent.\n\nGive the **${askGeno ? "genotypic" : "phenotypic"} ratio** of the offspring (${labels.join(" : ")}).`,
      answer: ratio,
      kind: "ratio",
      hint: "Write each parent's gametes, draw a 2 × 2 Punnett square, then count the boxes.",
      solution: `Gametes: ${m.join(", ")} × ${f.join(", ")}\n\n${punnettTable(m, f)}\n\n${list.map((x) => `${x.label}: ${x.count}/4`).join(" · ")}\n\n**${askGeno ? "Genotypic" : "Phenotypic"} ratio = ${ratio} (${labels.join(" : ")})**`,
    };
  },
};

const monoPercent: Generator = {
  id: "mono-percent",
  title: "Monohybrid crosses: percentages",
  topic: "g12-genetics",
  make(seed) {
    const r = rng(this.id, seed);
    const t = pick(r, TRAITS);
    const L = t.gene;
    const m = pick(r, [[L, L.toLowerCase()], [L, L], [L.toLowerCase(), L.toLowerCase()]] as Pair[]);
    const f: Pair = [L, L.toLowerCase()];
    const ph = monoPhenotypes(m, f, t.mode, t.names);
    const target = pick(r, ph);
    const pct = (target.count / 4) * 100;
    const howTo = t.mode === "complete" ? `**${t.names.dom}** (${L}) is dominant over **${t.names.rec}** (${L.toLowerCase()})` : `there is **${t.mode === "incomplete" ? "incomplete dominance" : "co-dominance"}**: ${L}${L} = ${t.names.dom}, ${L}${L.toLowerCase()} = ${t.names.mid}, ${L.toLowerCase()}${L.toLowerCase()} = ${t.names.rec}`;
    return {
      q: `In ${t.organism}, ${howTo}. A ${pairText(m)} individual is crossed with a ${pairText(f)} individual.\n\nWhat **percentage** of the offspring are expected to have **${target.label}**?`,
      answer: String(pct),
      kind: "number",
      hint: "Draw the 2 × 2 Punnett square. Each box is 25% of the offspring.",
      solution: `${punnettTable(m, f)}\n\n${ph.map((x) => `${x.label}: ${x.count} box${x.count > 1 ? "es" : ""}`).join(" · ")}\n\n${target.count} out of 4 boxes = **${pct}%**.`,
    };
  },
};

const parentGenotype: Generator = {
  id: "mono-parent",
  title: "Work backwards: parents' genotypes",
  topic: "g12-genetics",
  make(seed) {
    const r = rng(this.id, seed);
    const t = pick(r, TRAITS.filter((x) => x.mode === "complete"));
    const L = t.gene;
    const l = L.toLowerCase();
    const scenario = int(r, 0, 2);
    const cases = [
      { story: `Two ${t.names.dom} parents have a ${t.names.rec} offspring. What is the genotype of **each parent**?`, ans: `${L}${l} | ${L}${l}, ${L}${l}`, why: `The ${t.names.rec} offspring is ${l}${l}, so it got one ${l} from each parent. Both parents show the dominant trait, so each must be **${L}${l}** (heterozygous).` },
      { story: `A ${t.names.dom} parent crossed with a ${t.names.rec} parent produces offspring in a **1 : 1** ratio. What is the genotype of the **${t.names.dom} parent**?`, ans: `${L}${l}`, why: `A 1 : 1 ratio comes from ${L}${l} × ${l}${l} (a **test cross**). If the parent were ${L}${L}, all offspring would be ${t.names.dom}.` },
      { story: `A ${t.names.dom} parent crossed with a ${t.names.rec} parent produces **only** ${t.names.dom} offspring (hundreds of them). What is the most likely genotype of the **${t.names.dom} parent**?`, ans: `${L}${L}`, why: `If the parent carried ${l}, about half the offspring would be ${t.names.rec}. All dominant offspring means it is **${L}${L}** (homozygous dominant).` },
    ];
    const c = cases[scenario];
    return {
      q: `In ${t.organism}, ${t.names.dom} (${L}) is dominant over ${t.names.rec} (${l}). ${c.story}`,
      answer: c.ans,
      kind: "list",
      hint: "Start with the individual whose genotype you KNOW: a recessive phenotype is always homozygous recessive.",
      solution: c.why,
    };
  },
};

const gametes: Generator = {
  id: "gametes",
  title: "Gametes from a genotype",
  topic: "g12-genetics",
  speed: true,
  make(seed) {
    const r = rng(this.id, seed);
    const [A, B] = pick(r, [["A", "B"], ["T", "R"], ["Y", "R"], ["D", "E"], ["H", "P"]]);
    const g1: Pair = pick(r, [[A, A], [A, A.toLowerCase()], [A.toLowerCase(), A.toLowerCase()]] as Pair[]);
    const g2: Pair = pick(r, [[B, B.toLowerCase()], [B, B.toLowerCase()], [B.toLowerCase(), B.toLowerCase()], [B, B]] as Pair[]);
    const gs = uniqueGametes(dihybridGametes(g1, g2));
    return {
      q: `List all the **different gametes** that an individual with genotype **${pairText(g1)}${pairText(g2)}** can produce.`,
      answer: gs.join(", "),
      kind: "list",
      hint: "Each gamete gets ONE allele of each gene. Combine each allele of the first gene with each allele of the second (FOIL).",
      solution: `Alleles of gene 1: ${g1.join(", ")} · gene 2: ${g2.join(", ")}.\n\nCombinations: ${dihybridGametes(g1, g2).join(", ")}.\n\nDifferent gametes: **${gs.join(", ")}** (${gs.length}). This is the **law of independent assortment**: the alleles of different genes separate independently.`,
    };
  },
};

const dihybrid: Generator = {
  id: "dihybrid",
  title: "Dihybrid crosses",
  topic: "g12-genetics",
  make(seed) {
    const r = rng(this.id, seed);
    const t1 = TRAITS[0];
    const t2 = pick(r, [TRAITS[1], TRAITS[2]]);
    const both: [Pair, Pair] = [[t1.gene, t1.gene.toLowerCase()], [t2.gene, t2.gene.toLowerCase()]];
    const testCross = r() < 0.5;
    const other: [Pair, Pair] = testCross ? [[t1.gene.toLowerCase(), t1.gene.toLowerCase()], [t2.gene.toLowerCase(), t2.gene.toLowerCase()]] : both;
    const ph = diPhenotypes(both, other, [t1.names, t2.names]);
    const total = ph.reduce((s, x) => s + x.count, 0);
    const target = pick(r, ph);
    const asRatio = r() < 0.5;
    const desc = `In pea plants, tall (${t1.gene}) is dominant over short (${t1.gene.toLowerCase()}), and ${t2.names.dom} (${t2.gene}) is dominant over ${t2.names.rec} (${t2.gene.toLowerCase()}). A plant that is **${pairText(both[0])}${pairText(both[1])}** is crossed with a **${pairText(other[0])}${pairText(other[1])}** plant.`;
    const ratio = simplest(ph.map((x) => x.count)).join(":");
    return {
      q: asRatio ? `${desc}\n\nGive the **phenotypic ratio** of the offspring (${ph.map((x) => x.label).join(" : ")}).` : `${desc}\n\nOut of **${total}** offspring in the Punnett square, how many are **${target.label}**?`,
      answer: asRatio ? ratio : String(target.count),
      kind: asRatio ? "ratio" : "number",
      hint: testCross ? "The aabb parent only makes ab gametes, so the offspring show the other parent's four gametes in equal numbers." : "AaBb × AaBb always gives 9 : 3 : 3 : 1 – two dominant : one dominant : other dominant : both recessive.",
      solution: `${ph.map((x) => `${x.label}: **${x.count}**`).join(" · ")} (out of ${total}).\n\n${asRatio ? `Phenotypic ratio = **${ratio}**` : `**${target.count}** are ${target.label}.`}${testCross ? "\n\nA cross with a homozygous recessive (aabb) is a **test cross**: 1 : 1 : 1 : 1 shows the parent was heterozygous for both genes." : ""}`,
    };
  },
};

const BLOOD = { A: [["IA", "IA"], ["IA", "i"]], B: [["IB", "IB"], ["IB", "i"]], AB: [["IA", "IB"]], O: [["i", "i"]] } as Record<string, Pair[]>;

const bloodGroups: Generator = {
  id: "blood-groups",
  title: "Blood groups (multiple alleles)",
  topic: "g12-genetics",
  make(seed) {
    const r = rng(this.id, seed);
    const all = Object.values(BLOOD).flat();
    const m = pick(r, all);
    const f = pick(r, all);
    const ph = monoPhenotypes(m, f, "blood", { dom: "", rec: "" });
    const askList = r() < 0.5;
    const target = pick(r, ph);
    const show = (p: Pair) => p.map((a) => (a === "IA" ? "Iᴬ" : a === "IB" ? "Iᴮ" : "i")).join("");
    const grid = `| | ${f.map((b) => show([b] as unknown as Pair)).join(" | ")} |\n|---|---|---|\n${m.map((a) => `| **${show([a] as unknown as Pair)}** | ${f.map((b) => `${show([a, b])} (${phenotype([a, b], "blood", { dom: "", rec: "" })})`).join(" | ")} |`).join("\n")}`;
    return {
      q: `Blood groups are controlled by three alleles: **Iᴬ** and **Iᴮ** are co-dominant and both are dominant over **i**. A mother with genotype **${show(m)}** and a father with genotype **${show(f)}** have children.\n\n${askList ? "List **all the possible blood groups** of their children." : `What is the **percentage** chance that a child has blood group **${target.label}**?`}`,
      answer: askList ? ph.map((x) => x.label).join(", ") : String((target.count / 4) * 100),
      kind: askList ? "list" : "number",
      hint: "IᴬIᴬ or Iᴬi → A · IᴮIᴮ or Iᴮi → B · IᴬIᴮ → AB · ii → O. Draw the 2 × 2 Punnett square.",
      solution: `Blood group in each box:\n\n${grid}\n\n${ph.map((x) => `Group ${x.label}: ${x.count}/4 = ${(x.count / 4) * 100}%`).join(" · ")}\n\n${askList ? `Possible groups: **${ph.map((x) => x.label).join(", ")}**` : `**${(target.count / 4) * 100}%**`}`,
    };
  },
};

const DISORDERS = [{ name: "haemophilia", L: "H" }, { name: "colour-blindness", L: "B" }];

const sexLinked: Generator = {
  id: "sex-linked",
  title: "Sex-linked inheritance",
  topic: "g12-genetics",
  make(seed) {
    const r = rng(this.id, seed);
    const d = pick(r, DISORDERS);
    const X = `X${d.L}`;
    const x = `X${d.L.toLowerCase()}`;
    const mother: Pair = pick(r, [[X, x], [X, X], [x, x], [X, x]] as Pair[]);
    const father: Pair = pick(r, [[X, "Y"], [x, "Y"]] as Pair[]);
    const ph = monoPhenotypes(mother, father, "sex-linked", { dom: "", rec: "", disorder: d.name });
    const up = d.L === "H" ? "ᴴ" : "ᴮ";
    const low = d.L === "H" ? "ʰ" : "ᵇ";
    const show = (a: string) => (a === "Y" ? "Y" : `X${a[1] === d.L ? up : low}`);
    const sons = ph.filter((p) => p.label.includes("male") && !p.label.includes("female"));
    const sonsAffected = sons.filter((p) => p.label.includes(d.name)).reduce((s, p) => s + p.count, 0);
    const sonsTotal = sons.reduce((s, p) => s + p.count, 0);
    const askSons = r() < 0.6;
    const affectedAll = ph.filter((p) => p.label.includes(d.name)).reduce((s, p) => s + p.count, 0);
    const pct = askSons ? (sonsAffected / sonsTotal) * 100 : (affectedAll / 4) * 100;
    return {
      q: `${d.name[0].toUpperCase()}${d.name.slice(1)} is caused by a **recessive allele on the X chromosome** (X${low}; normal = X${up}). A mother **${mother.map(show).join("")}** and a father **${father.map(show).join("")}** plan a family.\n\n${askSons ? `What percentage of their **sons** are expected to have ${d.name}?` : `What percentage of **all** their children are expected to have ${d.name}?`}`,
      answer: za(pct, 1),
      kind: "number",
      tol: 0.1,
      hint: "Sons get their X from their MOTHER and their Y from their father. A son with one recessive X has the disorder – there is no second X to mask it.",
      solution: `Offspring: ${ph.map((p) => `${p.label} (${p.count}/4)`).join(" · ")}\n\n${askSons ? `Sons: ${sonsAffected} of ${sonsTotal} affected = **${za(pct, 1)}%**` : `Affected: ${affectedAll} of 4 = **${za(pct, 1)}%**`}\n\nMales are affected more often because they have **only one X chromosome**.`,
    };
  },
};

// ------------------------------------------------------------------ Population ecology

const ANIMALS = ["frogs in a dam", "fish in a pond", "lizards in a garden", "beetles in a field", "mice in a nature reserve", "snails on a farm", "crabs in a mangrove swamp", "bats in a cave"];

const markRecapture: Generator = {
  id: "mark-recapture",
  title: "Mark–recapture estimates",
  topic: "g11-population",
  make(seed) {
    const r = rng(this.id, seed);
    const animal = pick(r, ANIMALS);
    const M = int(r, 3, 12) * 10;
    const R = int(r, 4, 20);
    const factor = int(r, 2, 8);
    const C = R * factor;
    const est = M * factor;
    return {
      q: `Learners estimated the number of ${animal}. They caught and marked **${M}** animals, then released them. A week later they caught **${C}** animals, of which **${R}** were marked.\n\nEstimate the **population size** (round to a whole number).`,
      answer: String(est),
      kind: "number",
      tol: 1,
      hint: "Population (N) = (number marked in first sample × total caught in second sample) ÷ number of marked animals recaptured. N = M × C ÷ R.",
      solution: `N = (M × C) ÷ R\n\nN = (${M} × ${C}) ÷ ${R}\n\nN = ${M * C} ÷ ${R} = **${est}** ${animal.split(" ")[0]}.\n\n**Assumptions:** marked animals mix evenly, marks don't fall off or make animals easier to catch, and no births, deaths or migration between samples.`,
    };
  },
};

const quadrat: Generator = {
  id: "quadrat",
  title: "Quadrat estimates",
  topic: "g11-population",
  make(seed) {
    const r = rng(this.id, seed);
    const plant = pick(r, ["daisies", "aloe plants", "dandelions", "clover plants", "thorn-tree seedlings", "proteas"]);
    const counts = Array.from({ length: 5 }, () => int(r, 2, 14));
    const side = pick(r, [1, 1, 2]);
    const area = pick(r, [100, 200, 400, 500, 1000]);
    const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
    const per = avg / (side * side);
    const est = Math.round(per * area);
    return {
      q: `Five quadrats of **${side} m × ${side} m** were placed randomly in a **${area} m²** field. The numbers of ${plant} counted were: **${counts.join(", ")}**.\n\nEstimate the total number of ${plant} in the field (whole number).`,
      answer: String(est),
      kind: "number",
      tol: 1,
      hint: `Average per quadrat → divide by the quadrat area (${side * side} m²) to get the density per m² → multiply by the field area.`,
      solution: `Average = (${counts.join(" + ")}) ÷ 5 = ${za(avg)} per quadrat.\n\nDensity = ${za(avg)} ÷ ${side * side} m² = ${za(per)} per m².\n\nPopulation = ${za(per)} × ${area} = **${est}** ${plant}.\n\nUse **many, randomly placed** quadrats so the sample is representative.`,
    };
  },
};

// ------------------------------------------------------------------ Skills

const magnification: Generator = {
  id: "magnification",
  title: "Magnification & actual size",
  topic: "skills-investigation",
  make(seed) {
    const r = rng(this.id, seed);
    const actualUm = pick(r, [5, 8, 10, 12, 20, 25, 40, 50, 80, 100]);
    const mag = pick(r, [400, 500, 1000, 1500, 2000, 2500]);
    const imageMm = (actualUm * mag) / 1000;
    const kind = int(r, 0, 1);
    const what = pick(r, ["a cheek cell", "a pollen grain", "a red blood cell", "a stoma", "an amoeba", "a yeast cell", "a root hair cell"]);
    if (kind === 0) {
      return {
        q: `A drawing of ${what} is **${za(imageMm)} mm** long. The drawing is magnified **×${mag}**. Calculate the **actual size** of ${what} in **micrometres (µm)**.`,
        answer: String(actualUm),
        kind: "number",
        tol: 0.05,
        hint: "Actual size = image size ÷ magnification. Change mm to µm first: 1 mm = 1 000 µm.",
        solution: `Image size = ${za(imageMm)} mm = ${za(imageMm * 1000)} µm\n\nActual size = image size ÷ magnification = ${za(imageMm * 1000)} ÷ ${mag} = **${actualUm} µm**`,
      };
    }
    return {
      q: `${what[0].toUpperCase()}${what.slice(1)} is actually **${actualUm} µm** long. In a diagram it is **${za(imageMm)} mm** long. Calculate the **magnification** of the diagram.`,
      answer: String(mag),
      kind: "number",
      tol: 0.5,
      hint: "Magnification = image size ÷ actual size. Use the SAME units for both (1 mm = 1 000 µm).",
      solution: `Image size = ${za(imageMm)} mm = ${za(imageMm * 1000)} µm\n\nMagnification = ${za(imageMm * 1000)} ÷ ${actualUm} = **×${mag}**\n\nMagnification has **no units** – write it as ×${mag}.`,
    };
  },
};

const percentChange: Generator = {
  id: "percent-change",
  title: "Percentage increase & decrease",
  topic: "skills-investigation",
  make(seed) {
    const r = rng(this.id, seed);
    const ctx = pick(r, [
      { what: "the mass of a potato strip in salt solution", unit: "g", lo: 20, hi: 60 },
      { what: "the number of rhinos poached", unit: "", lo: 400, hi: 1200 },
      { what: "the height of a bean seedling", unit: "mm", lo: 30, hi: 90 },
      { what: "the volume of oxygen given off by pondweed", unit: "ml", lo: 10, hi: 40 },
      { what: "the population of a town", unit: "", lo: 2000, hi: 9000 },
    ]);
    const start = int(r, ctx.lo, ctx.hi);
    const end = Math.round(start * (r() < 0.5 ? 0.5 + r() * 0.45 : 1.1 + r() * 0.8));
    const pct = ((end - start) / start) * 100;
    const ans = Math.round(Math.abs(pct) * 10) / 10;
    return {
      q: `${ctx.what[0].toUpperCase()}${ctx.what.slice(1)} changed from **${start}${ctx.unit && ` ${ctx.unit}`}** to **${end}${ctx.unit && ` ${ctx.unit}`}**. Calculate the **percentage ${end > start ? "increase" : "decrease"}** (one decimal place).`,
      answer: za(ans, 1),
      kind: "number",
      tol: 0.15,
      hint: "Percentage change = (change ÷ original value) × 100.",
      solution: `Change = ${end} − ${start} = ${end - start}\n\nPercentage change = (${Math.abs(end - start)} ÷ ${start}) × 100 = **${za(ans, 1)}%** ${end > start ? "increase" : "decrease"}.\n\nAlways divide by the **original (starting)** value.`,
    };
  },
};

// ------------------------------------------------------------------ Everyday biology

const foodLabel: Generator = {
  id: "food-label",
  title: "Food label maths",
  topic: "daily-nutrition",
  make(seed) {
    const r = rng(this.id, seed);
    const food = pick(r, [
      { n: "breakfast cereal", serve: 40, sugar: [20, 35], kj: [1500, 1700] },
      { n: "flavoured yoghurt", serve: 175, sugar: [10, 14], kj: [350, 450] },
      { n: "fizzy cooldrink", serve: 330, sugar: [9, 11], kj: [170, 190] },
      { n: "white bread", serve: 76, sugar: [3, 5], kj: [1000, 1100] },
      { n: "peanut butter", serve: 20, sugar: [5, 8], kj: [2400, 2600] },
      { n: "fruit juice blend", serve: 250, sugar: [9, 12], kj: [180, 210] },
    ]);
    const sugar100 = int(r, food.sugar[0], food.sugar[1]);
    const kj100 = int(r, food.kj[0], food.kj[1]);
    const sugarServe = (sugar100 * food.serve) / 100;
    const tsp = Math.round((sugarServe / 4) * 10) / 10;
    const kjServe = Math.round((kj100 * food.serve) / 100);
    if (r() < 0.5) {
      return {
        q: `A ${food.n} label says it has **${sugar100} g sugar per 100 g (or ml)**. One serving is **${food.serve} g (or ml)**. How many **teaspoons of sugar** are in one serving? (1 teaspoon ≈ 4 g; one decimal place)`,
        answer: za(tsp, 1),
        kind: "number",
        tol: 0.15,
        hint: "Sugar per serving = sugar per 100 × serving ÷ 100. Then divide by 4 g per teaspoon.",
        solution: `Sugar per serving = ${sugar100} × ${food.serve} ÷ 100 = ${za(sugarServe, 1)} g\n\nTeaspoons = ${za(sugarServe, 1)} ÷ 4 = **${za(tsp, 1)} teaspoons**\n\nThe WHO advises less than about **6 teaspoons of added sugar a day** for good health.`,
      };
    }
    return {
      q: `A ${food.n} label says **${kj100} kJ per 100 g (or ml)**. How many **kilojoules** are in one **${food.serve} g (or ml)** serving? (whole number)`,
      answer: String(kjServe),
      kind: "number",
      tol: 1,
      hint: "Energy per serving = energy per 100 × serving size ÷ 100.",
      solution: `Energy = ${kj100} × ${food.serve} ÷ 100 = **${kjServe} kJ**.\n\nA teenager needs roughly 9 000–12 000 kJ a day, depending on age, sex and activity.`,
    };
  },
};

// ------------------------------------------------------------------ Section A terminology

/** "Give the correct biological term" – one bank per CAPS topic. Answers accept the listed alternatives. */
export const TERM_BANK: Partial<Record<Topic, [string, string][]>> = {
  "g11-microorganisms": [
    ["Non-living particles made of a protein coat around DNA or RNA that can only reproduce inside a living cell", "virus | viruses"],
    ["Single-celled organisms with no nucleus and no membrane-bound organelles", "prokaryote | prokaryotes | bacteria"],
    ["The protein coat of a virus", "capsid"],
    ["A weakened or dead form of a pathogen given to stimulate immunity", "vaccine"],
    ["A disease-causing organism", "pathogen"],
    ["Proteins made by lymphocytes that bind to specific antigens", "antibodies | antibody"],
    ["Foreign substances that trigger an immune response", "antigens | antigen"],
    ["Chemicals that kill bacteria or stop them from growing", "antibiotics | antibiotic"],
    ["The thread-like filaments that make up the body of a fungus", "hyphae | hypha"],
    ["The protist that causes malaria", "Plasmodium"],
    ["White blood cells that engulf and digest pathogens", "phagocytes | phagocyte | macrophages"],
    ["Immunity gained when your own body makes antibodies after infection or vaccination", "active immunity"],
  ],
  "g11-plants": [
    ["Plants with no vascular tissue, such as mosses", "bryophytes | bryophyta"],
    ["The life cycle in which a haploid gametophyte generation alternates with a diploid sporophyte generation", "alternation of generations"],
    ["Seed plants whose seeds are not enclosed in a fruit, e.g. pine trees and cycads", "gymnosperms"],
    ["Flowering plants whose seeds are enclosed in a fruit", "angiosperms"],
    ["The transfer of pollen from an anther to a stigma", "pollination"],
    ["The part of the flower where pollen grains are produced", "anther | anthers"],
    ["The sticky tip of the carpel that receives pollen", "stigma"],
    ["The structure that develops from a fertilised ovule", "seed"],
    ["A facility that stores seeds to conserve plant genetic diversity", "seed bank"],
    ["Tissue that transports water and minerals in a plant", "xylem"],
  ],
  "g11-animals": [
    ["The arrangement of body parts so that the body can be divided into mirror halves along one plane only", "bilateral symmetry"],
    ["Animals with three germ layers", "triploblastic"],
    ["Animals with two germ layers", "diploblastic"],
    ["A fluid-filled body cavity completely lined by mesoderm", "coelom"],
    ["The concentration of nerve tissue and sense organs at the front (head) end of an animal", "cephalisation"],
    ["The middle germ layer that develops into muscles and blood", "mesoderm"],
    ["A gut with only one opening for both food and waste", "sac-like gut | blind gut | incomplete gut"],
    ["The phylum of animals with pores, such as sponges", "Porifera"],
    ["The phylum with jointed legs and an exoskeleton", "Arthropoda | arthropods"],
    ["The phylum of segmented worms such as earthworms", "Annelida | annelids"],
  ],
  "g11-photosynthesis": [
    ["The green pigment that absorbs light energy", "chlorophyll"],
    ["The organelle in which photosynthesis takes place", "chloroplast | chloroplasts"],
    ["The splitting of water molecules using light energy", "photolysis"],
    ["The phase of photosynthesis that takes place in the stroma and does not need light directly", "dark phase | light-independent phase | Calvin cycle"],
    ["A factor that is in shortest supply and so slows down the rate of a process", "limiting factor"],
    ["The energy-carrying molecule made in the light phase", "ATP"],
    ["The chemical used to test for starch", "iodine solution | iodine"],
    ["Removing starch from a plant by keeping it in the dark for 2–3 days", "destarching"],
    ["The stacks of thylakoids in a chloroplast", "grana | granum"],
  ],
  "g11-nutrition": [
    ["The mechanical breakdown of food by the teeth", "mastication | chewing"],
    ["The wave-like muscle contractions that push food along the alimentary canal", "peristalsis"],
    ["Finger-like projections of the small intestine that increase the surface area for absorption", "villi | villus"],
    ["The lymph vessel in a villus that absorbs fats", "lacteal"],
    ["The emulsifier made in the liver and stored in the gall bladder", "bile"],
    ["The enzyme in saliva that digests starch", "salivary amylase | amylase | ptyalin"],
    ["The flap that closes the trachea when you swallow", "epiglottis"],
    ["The hormone that lowers blood glucose", "insulin"],
    ["The conversion of excess amino acids into urea in the liver", "deamination"],
    ["The storage carbohydrate made from glucose in the liver and muscles", "glycogen"],
    ["The removal of undigested food from the body", "egestion"],
  ],
  "g11-respiration": [
    ["The first stage of cellular respiration, in the cytoplasm, in which glucose is split into pyruvate", "glycolysis"],
    ["The stage of aerobic respiration that takes place in the matrix of the mitochondria", "Krebs cycle | citric acid cycle"],
    ["Respiration that does not use oxygen", "anaerobic respiration"],
    ["Anaerobic respiration in yeast that produces ethanol and carbon dioxide", "alcoholic fermentation | fermentation"],
    ["The substance that builds up in muscles during anaerobic respiration", "lactic acid"],
    ["The organelle where aerobic respiration takes place", "mitochondrion | mitochondria"],
    ["The final stage of aerobic respiration that produces most ATP", "oxidative phosphorylation | electron transport chain"],
    ["The extra oxygen needed after exercise to break down lactic acid", "oxygen debt"],
  ],
  "g11-gas-exchange": [
    ["The tiny air sacs where gaseous exchange takes place in the lungs", "alveoli | alveolus"],
    ["The dome-shaped muscle that separates the thorax from the abdomen", "diaphragm"],
    ["The muscles between the ribs that help with breathing", "intercostal muscles"],
    ["The process by which oxygen moves from the alveoli into the blood", "diffusion"],
    ["The red pigment in red blood cells that carries oxygen", "haemoglobin"],
    ["The part of the brain that controls the breathing rate", "medulla oblongata"],
    ["The compound formed when oxygen binds to haemoglobin", "oxyhaemoglobin"],
    ["Breathing in", "inhalation | inspiration"],
    ["The C-shaped rings of cartilage keep this tube open", "trachea"],
  ],
  "g11-excretion": [
    ["The removal of metabolic waste from the body", "excretion"],
    ["The functional unit of the kidney", "nephron"],
    ["The knot of capillaries in Bowman's capsule", "glomerulus"],
    ["Filtration under high pressure in the glomerulus", "ultrafiltration | ultra-filtration"],
    ["The reabsorption of useful substances from the filtrate back into the blood", "tubular reabsorption | selective reabsorption"],
    ["The hormone that increases the reabsorption of water in the kidney", "ADH | antidiuretic hormone"],
    ["The regulation of the water and salt content of the body", "osmoregulation"],
    ["The tube that carries urine from the kidney to the bladder", "ureter"],
    ["The tube that carries urine from the bladder out of the body", "urethra"],
    ["A machine that filters the blood when the kidneys fail", "dialysis machine | dialysis | kidney machine"],
  ],
  "g11-population": [
    ["A group of organisms of the same species living in the same area at the same time", "population"],
    ["The maximum number of individuals an environment can support", "carrying capacity"],
    ["Competition between members of the same species", "intraspecific competition"],
    ["Competition between members of different species", "interspecific competition"],
    ["A relationship in which one organism benefits and the other is harmed", "parasitism"],
    ["A relationship in which both organisms benefit", "mutualism"],
    ["A relationship in which one organism benefits and the other is not affected", "commensalism"],
    ["The gradual change in the species of a community over time", "succession | ecological succession"],
    ["The role an organism plays in its ecosystem", "niche | ecological niche"],
    ["A square frame used to sample plants", "quadrat"],
    ["A population growth curve shaped like a J", "geometric growth | exponential growth"],
  ],
  "g11-human-impact": [
    ["The increase in the average temperature of the Earth's surface", "global warming"],
    ["The trapping of heat by gases such as CO₂ and methane", "greenhouse effect | enhanced greenhouse effect"],
    ["The rapid growth of algae in water enriched with nutrients from fertilisers", "eutrophication | algal bloom"],
    ["Species brought into an area where they do not naturally occur and that spread rapidly", "alien invasive species | invasive species | alien species"],
    ["The clearing of forests", "deforestation"],
    ["The variety of all living organisms in an area", "biodiversity"],
    ["The permanent disappearance of a species", "extinction"],
    ["Access by all people at all times to enough nutritious food", "food security"],
    ["Growing one crop over a large area year after year", "monoculture"],
    ["Rain with a low pH caused by sulfur dioxide and nitrogen oxides", "acid rain"],
    ["The total amount of greenhouse gases produced by a person's activities", "carbon footprint"],
  ],
  "g12-dna": [
    ["The building block of DNA made of a sugar, a phosphate and a nitrogenous base", "nucleotide"],
    ["The sugar in DNA", "deoxyribose"],
    ["The process in which DNA makes an identical copy of itself", "replication | DNA replication"],
    ["The formation of mRNA from a DNA template", "transcription"],
    ["The formation of a protein at the ribosome according to the mRNA code", "translation"],
    ["A sequence of three bases on mRNA that codes for an amino acid", "codon"],
    ["A sequence of three bases on tRNA", "anticodon"],
    ["DNA found in mitochondria that is inherited from the mother only", "mitochondrial DNA | mtDNA"],
    ["The pattern of DNA bands used to identify a person", "DNA profile | DNA fingerprint"],
    ["The bond that forms between adjacent amino acids", "peptide bond"],
    ["The base found in RNA but not in DNA", "uracil"],
  ],
  "g12-meiosis": [
    ["Cell division that halves the chromosome number to form gametes", "meiosis"],
    ["Chromosomes that are the same size and shape and carry genes for the same characteristics", "homologous chromosomes | homologous pair"],
    ["The exchange of genetic material between non-sister chromatids", "crossing over"],
    ["The point where chromatids cross over", "chiasma | chiasmata"],
    ["The failure of chromosomes to separate during meiosis", "non-disjunction"],
    ["A cell with one set of chromosomes (n)", "haploid"],
    ["A condition caused by an extra copy of chromosome 21", "Down syndrome | trisomy 21"],
    ["The structure that joins two chromatids", "centromere"],
    ["The phase of meiosis in which homologous pairs line up at the equator", "metaphase I"],
  ],
  "g12-genetics": [
    ["Different forms of the same gene", "alleles | allele"],
    ["The genetic make-up of an organism", "genotype"],
    ["The physical appearance of an organism", "phenotype"],
    ["Having two identical alleles for a characteristic", "homozygous"],
    ["Having two different alleles for a characteristic", "heterozygous"],
    ["Dominance in which the heterozygous phenotype is an intermediate blend", "incomplete dominance"],
    ["Dominance in which both alleles are expressed equally in the heterozygote", "co-dominance | codominance"],
    ["Characteristics controlled by genes on the X chromosome", "sex-linked | sex-linked characteristics"],
    ["A diagram that shows the inheritance of a trait in a family over generations", "pedigree diagram | pedigree | family tree"],
    ["A sudden change in the sequence of bases in DNA", "mutation | gene mutation"],
    ["Organisms whose DNA has been changed by adding genes from another species", "genetically modified organisms | GMOs | GMO | transgenic organisms"],
    ["The position of a gene on a chromosome", "locus"],
    ["Producing a genetically identical copy of an organism", "cloning"],
  ],
  "g12-vertebrate-repro": [
    ["Fertilisation that takes place inside the female's body", "internal fertilisation"],
    ["Reproduction in which eggs are laid and develop outside the body", "ovipary | oviparous"],
    ["Reproduction in which the young develop inside the mother and are nourished by a placenta", "vivipary | viviparous"],
    ["Eggs develop inside the mother but get food from the yolk, then hatch inside her", "ovovivipary | ovoviviparous"],
    ["Young that are helpless at birth and need a lot of parental care", "altricial"],
    ["Young that are well developed and mobile soon after birth", "precocial"],
    ["The membrane of an amniotic egg that stores waste", "allantois"],
    ["The fluid-filled sac that protects the embryo", "amnion"],
  ],
  "g12-human-repro": [
    ["The formation of sperm in the testes", "spermatogenesis"],
    ["The formation of ova in the ovaries", "oogenesis"],
    ["The release of an ovum from the ovary", "ovulation"],
    ["The fusion of a sperm nucleus with an ovum nucleus", "fertilisation | fertilization"],
    ["The embedding of the blastocyst in the endometrium", "implantation"],
    ["The structure that develops from the follicle after ovulation", "corpus luteum"],
    ["The inner lining of the uterus", "endometrium"],
    ["The organ through which the foetus gets food and oxygen from the mother", "placenta"],
    ["The cap on the head of a sperm that contains enzymes", "acrosome"],
    ["The ball of cells that implants in the uterus", "blastocyst"],
    ["The hormone that stimulates the development of a follicle", "FSH | follicle stimulating hormone"],
    ["The hormone that causes ovulation", "LH | luteinising hormone"],
  ],
  "g12-nervous": [
    ["The brain and spinal cord", "central nervous system | CNS"],
    ["A nerve cell", "neuron | neurone"],
    ["The gap between two neurons", "synapse"],
    ["A rapid, automatic response to a stimulus", "reflex action | reflex"],
    ["The pathway of an impulse in a reflex action", "reflex arc"],
    ["The fatty layer that insulates an axon and speeds up the impulse", "myelin sheath"],
    ["The part of the brain that controls balance and muscle coordination", "cerebellum"],
    ["The largest part of the brain that controls thinking, memory and voluntary actions", "cerebrum"],
    ["The part of the nervous system that controls involuntary actions of internal organs", "autonomic nervous system"],
    ["The neuron that carries impulses from a receptor to the CNS", "sensory neuron | afferent neuron"],
    ["The band of nerve fibres that joins the two cerebral hemispheres", "corpus callosum"],
    ["Chemicals that carry an impulse across a synapse", "neurotransmitters | neurotransmitter"],
  ],
  "g12-senses": [
    ["The adjustment of the lens to focus on near or distant objects", "accommodation"],
    ["The layer of the eye that contains the rods and cones", "retina"],
    ["The point on the retina with no rods or cones", "blind spot"],
    ["The point on the retina with the most cones, for the sharpest vision", "yellow spot | fovea"],
    ["The structure that controls how much light enters the eye", "iris"],
    ["Photoreceptors that detect colour", "cones | cone"],
    ["Short-sightedness", "myopia"],
    ["Long-sightedness", "hypermetropia | hyperopia"],
    ["The tube that equalises pressure on both sides of the eardrum", "Eustachian tube"],
    ["The coiled structure in the inner ear that contains receptors for hearing", "cochlea"],
    ["The structures of the inner ear that detect changes in the speed and direction of movement", "semi-circular canals | semicircular canals"],
    ["The small bones of the middle ear", "ossicles | ossicle"],
  ],
  "g12-endocrine": [
    ["Ductless glands that secrete hormones directly into the blood", "endocrine glands"],
    ["Chemical messengers carried in the blood", "hormones | hormone"],
    ["The 'master gland' at the base of the brain", "pituitary gland | hypophysis | pituitary"],
    ["The hormone that prepares the body for 'fight or flight'", "adrenalin | adrenaline"],
    ["The hormone that controls the rate of metabolism", "thyroxin | thyroxine"],
    ["A condition caused by a lack of iodine in the diet, in which the thyroid enlarges", "goitre"],
    ["The hormone that raises blood glucose levels", "glucagon"],
    ["The hormone that controls male secondary sexual characteristics", "testosterone"],
    ["The hormone made by the pituitary gland that stimulates growth", "growth hormone | GH | somatotropin"],
    ["The hormone that stimulates the thyroid gland", "TSH | thyroid stimulating hormone"],
  ],
  "g12-homeostasis": [
    ["Keeping the internal environment of the body constant", "homeostasis"],
    ["A mechanism in which a change triggers a response that reverses that change", "negative feedback"],
    ["The widening of blood vessels near the skin to lose heat", "vasodilation"],
    ["The narrowing of blood vessels near the skin to save heat", "vasoconstriction"],
    ["The hormone that increases the reabsorption of sodium ions", "aldosterone"],
    ["A condition caused by too little insulin", "diabetes mellitus | diabetes"],
    ["The part of the brain that controls body temperature", "hypothalamus"],
    ["Too low a body temperature", "hypothermia"],
  ],
  "g12-plant-responses": [
    ["The growth response of a plant to light from one direction", "phototropism"],
    ["The growth response of a plant to gravity", "geotropism | gravitropism"],
    ["The plant hormone that causes cell elongation and phototropism", "auxins | auxin"],
    ["The plant hormone that stimulates seed germination and stem elongation", "gibberellins | gibberellin"],
    ["The plant hormone that causes stomata to close during water stress", "abscisic acid"],
    ["The tendency of the main stem to grow faster than the side branches", "apical dominance"],
    ["A chemical defence such as a poison or bad taste made by a plant", "secondary compound | toxin | toxins"],
    ["Growth of a fruit without fertilisation, e.g. seedless grapes", "parthenocarpy"],
  ],
  "g12-evolution": [
    ["Changes in the characteristics of a species over a long time", "evolution | biological evolution"],
    ["A group of similar organisms that can interbreed to produce fertile offspring", "species"],
    ["The formation of a new species", "speciation"],
    ["Speciation in which a population is split by a geographical barrier", "allopatric speciation | geographic speciation"],
    ["Structures with the same basic plan but different functions, e.g. the pentadactyl limb", "homologous structures"],
    ["The theory that long periods of little change are interrupted by short periods of rapid change", "punctuated equilibrium"],
    ["Breeding of plants and animals by humans for desired characteristics", "artificial selection | selective breeding"],
    ["Any trace of an organism preserved in rock", "fossil | fossils"],
    ["The differences between individuals of the same species", "variation"],
    ["The theory that organisms with favourable characteristics survive and reproduce more", "natural selection"],
    ["Lamarck's idea that characteristics gained during a lifetime are passed on", "inheritance of acquired characteristics"],
  ],
  "g12-human-evolution": [
    ["Walking upright on two legs", "bipedalism | bipedal"],
    ["The large opening at the base of the skull through which the spinal cord passes", "foramen magnum"],
    ["The ridge of bone above the eye sockets", "brow ridge | brow ridges | supra-orbital ridge"],
    ["The hypothesis that modern humans evolved in Africa and then spread across the world", "Out of Africa hypothesis | Out of Africa"],
    ["A world heritage site near Johannesburg rich in hominid fossils", "Cradle of Humankind"],
    ["The fossil from Taung, the first Australopithecus discovered", "Taung Child | Taung child | Taung skull"],
    ["The genus of the fossil nicknamed 'Mrs Ples'", "Australopithecus"],
    ["A group that includes humans and their extinct bipedal relatives", "hominids | hominins | hominid"],
    ["The ability to hold objects between the thumb and fingers", "opposable thumbs | opposable thumb"],
  ],
};

const TOPIC_TITLES: Partial<Record<Topic, string>> = {
  "g11-microorganisms": "Terms: microorganisms", "g11-plants": "Terms: plants", "g11-animals": "Terms: animal diversity", "g11-photosynthesis": "Terms: photosynthesis",
  "g11-nutrition": "Terms: nutrition", "g11-respiration": "Terms: respiration", "g11-gas-exchange": "Terms: gas exchange", "g11-excretion": "Terms: excretion",
  "g11-population": "Terms: population ecology", "g11-human-impact": "Terms: human impact", "g12-dna": "Terms: DNA", "g12-meiosis": "Terms: meiosis",
  "g12-genetics": "Terms: genetics", "g12-vertebrate-repro": "Terms: vertebrate reproduction", "g12-human-repro": "Terms: human reproduction",
  "g12-nervous": "Terms: nervous system", "g12-senses": "Terms: eye & ear", "g12-endocrine": "Terms: hormones", "g12-homeostasis": "Terms: homeostasis",
  "g12-plant-responses": "Terms: plant responses", "g12-evolution": "Terms: evolution", "g12-human-evolution": "Terms: human evolution",
};

const termGenerators: Generator[] = (Object.entries(TERM_BANK) as [Topic, [string, string][]][]).map(([topic, bank]) => ({
  id: `terms-${topic}`,
  title: TOPIC_TITLES[topic] ?? "Biological terms",
  topic,
  speed: true,
  make(seed: number | string) {
    const r = rng(`terms-${topic}`, seed);
    const [desc, ans] = pick(r, bank);
    const main = ans.split(" | ")[0];
    return {
      q: `Give the correct **biological term** for:\n\n> ${desc}`,
      answer: ans,
      kind: "word" as const,
      hint: `It starts with **${main[0].toUpperCase()}** and has ${main.replace(/[^a-zA-Z]/g, "").length} letters.`,
      solution: `**${main}**${ans.includes(" | ") ? ` (also accepted: ${ans.split(" | ").slice(1).join(", ")})` : ""}. In Section A, **spelling counts** – a misspelt term that changes meaning scores 0.`,
    };
  },
}));

/** Every generator, in syllabus order. */
export const GENERATORS: Generator[] = [
  ...termGenerators.filter((g) => g.topic.startsWith("g11")),
  markRecapture, quadrat,
  complementary, mrna, tRNA, aminoAcid, chargaff,
  meiosisNumbers, combos,
  monoRatio, monoPercent, parentGenotype, gametes, dihybrid, bloodGroups, sexLinked,
  ...termGenerators.filter((g) => g.topic.startsWith("g12")),
  magnification, percentChange,
  foodLabel,
];

export const getGenerator = (id: string) => GENERATORS.find((g) => g.id === id);

/** A problem from a random generator (used by "surprise me"). */
export function anyProblem(seed: number): PracticeProblem {
  const r = seededRandom(`any:${seed}`);
  return GENERATORS[int(r, 0, GENERATORS.length - 1)].make(seed);
}

export { CODON_TABLE };
