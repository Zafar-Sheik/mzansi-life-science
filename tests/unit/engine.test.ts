/** The Life Sciences answer checker, the genetics engine and the question generators. */
import { describe, expect, it } from "vitest";
import { checkAnswer, readRatio, sameRatio } from "@/lib/bio/check";
import { GENERATORS } from "@/lib/bio/generators";
import { anticodons, CODON_TABLE, complementDNA, transcribe, translate } from "@/lib/bio/genetic-code";
import { diPhenotypes, dihybridGametes, monoGenotypes, monoPhenotypes, simplest, TRAITS, uniqueGametes } from "@/lib/bio/genetics";
import { photoRate } from "@/components/widgets/photosynthesis-lab";
import { apsPoints } from "@/components/widgets/aps-calculator";

describe("checkAnswer", () => {
  it("words ignore case, spaces, a leading article and end punctuation", () => {
    expect(checkAnswer("  Glomerulus. ", { answer: "glomerulus", kind: "word" }).ok).toBe(true);
    expect(checkAnswer("the cerebellum", { answer: "cerebellum", kind: "word" }).ok).toBe(true);
    expect(checkAnswer("ADH", { answer: "ADH | antidiuretic hormone", kind: "word" }).ok).toBe(true);
    expect(checkAnswer("antidiuretic hormone", { answer: "ADH | antidiuretic hormone", kind: "word" }).ok).toBe(true);
    expect(checkAnswer("meiosys", { answer: "meiosis", kind: "word" }).message).toMatch(/spelling/);
    expect(checkAnswer("mitosis", { answer: "meiosis", kind: "word" }).ok).toBe(false);
  });

  it("numbers accept decimal commas, units, % and a tolerance", () => {
    expect(checkAnswer("36,9", { answer: "36.9", kind: "number" }).ok).toBe(true);
    expect(checkAnswer("120 lizards", { answer: "120", kind: "number" }).ok).toBe(true);
    expect(checkAnswer("25%", { answer: "25", kind: "number" }).ok).toBe(true);
    expect(checkAnswer("8 000", { answer: "8000", kind: "number" }).ok).toBe(true);
    expect(checkAnswer("8,1", { answer: "8", kind: "number", tol: 0.15 }).ok).toBe(true);
    expect(checkAnswer("8,5", { answer: "8", kind: "number", tol: 0.15 }).ok).toBe(false);
    expect(checkAnswer("60000", { answer: "60", kind: "number" }).message).toMatch(/units|decimal/);
    expect(checkAnswer("seven", { answer: "7", kind: "number" }).unreadable).toBe(true);
  });

  it("ratios accept equivalent forms but not the wrong order", () => {
    expect(readRatio("9 : 3 : 3 : 1")).toEqual([9, 3, 3, 1]);
    expect(sameRatio([3, 1], [6, 2])).toBe(true);
    expect(checkAnswer("3:1", { answer: "3:1", kind: "ratio" }).ok).toBe(true);
    expect(checkAnswer("6 : 2", { answer: "3:1", kind: "ratio" }).ok).toBe(true);
    expect(checkAnswer("1:3", { answer: "3:1", kind: "ratio" }).message).toMatch(/order/);
    expect(checkAnswer("1:2:1", { answer: "3:1", kind: "ratio" }).ok).toBe(false);
  });

  it("bases ignore spaces and spot T/U mix-ups", () => {
    expect(checkAnswer("aug gcc", { answer: "AUGGCC", kind: "bases" }).ok).toBe(true);
    expect(checkAnswer("ATGGCC", { answer: "AUGGCC", kind: "bases" }).message).toMatch(/uracil/);
    expect(checkAnswer("AUGGC", { answer: "AUGGCC", kind: "bases" }).message).toMatch(/bases/);
    expect(checkAnswer("AUG GXX", { answer: "AUGGCC", kind: "bases" }).unreadable).toBe(true);
  });

  it("lists ignore order; gametes are case-sensitive", () => {
    expect(checkAnswer("ab, AB, aB, Ab", { answer: "AB, Ab, aB, ab", kind: "list" }).ok).toBe(true);
    expect(checkAnswer("AB, AB, AB, AB", { answer: "AB, Ab, aB, ab", kind: "list" }).ok).toBe(false);
    expect(checkAnswer("b and a", { answer: "A, B", kind: "list" }).ok).toBe(true);
    expect(checkAnswer("A", { answer: "A, B", kind: "list" }).message).toMatch(/2 items/);
  });

  it("empty input is unreadable, never correct", () => {
    expect(checkAnswer("   ", { answer: "x", kind: "word" }).ok).toBe(false);
  });
});

describe("genetic code", () => {
  it("pairs bases, transcribes and translates", () => {
    expect(complementDNA("ATGC")).toBe("TACG");
    expect(transcribe("TACGGT")).toBe("AUGCCA");
    expect(anticodons("AUGCCA")).toBe("UACGGU");
    expect(CODON_TABLE.AUG).toBe("Met");
    expect(CODON_TABLE.UAA).toBe("Stop");
    expect(CODON_TABLE.UGG).toBe("Trp");
    expect(CODON_TABLE.GGG).toBe("Gly");
    expect(Object.keys(CODON_TABLE).length).toBe(64);
    expect(translate("AUGGCCUAAGGG")).toEqual(["Met", "Ala"]);
  });
});

describe("genetics engine", () => {
  const tall = TRAITS[0];
  it("monohybrid ratios", () => {
    expect(simplest(monoPhenotypes(["T", "t"], ["T", "t"], "complete", tall.names).map((x) => x.count))).toEqual([3, 1]);
    expect(monoGenotypes(["T", "t"], ["T", "t"]).map((x) => `${x.label}:${x.count}`)).toEqual(["TT:1", "Tt:2", "tt:1"]);
    const pink = TRAITS.find((t) => t.mode === "incomplete")!;
    expect(monoPhenotypes(["R", "r"], ["R", "r"], "incomplete", pink.names).map((x) => x.count)).toEqual([1, 2, 1]);
  });
  it("blood groups and sex linkage", () => {
    expect(monoPhenotypes(["IA", "i"], ["IB", "i"], "blood", { dom: "", rec: "" }).map((x) => x.label)).toEqual(["A", "B", "AB", "O"]);
    const kids = monoPhenotypes(["XH", "Xh"], ["XH", "Y"], "sex-linked", { dom: "", rec: "", disorder: "haemophilia" });
    expect(kids.find((k) => k.label === "male with haemophilia")?.count).toBe(1);
    expect(kids.find((k) => k.label === "carrier female")?.count).toBe(1);
  });
  it("dihybrid crosses", () => {
    expect(uniqueGametes(dihybridGametes(["T", "t"], ["R", "r"]))).toEqual(["TR", "Tr", "tR", "tr"]);
    expect(diPhenotypes([["T", "t"], ["R", "r"]], [["T", "t"], ["R", "r"]], [TRAITS[0].names, TRAITS[2].names]).map((x) => x.count)).toEqual([9, 3, 3, 1]);
  });
});

describe("lab models", () => {
  it("photosynthesis: light is limiting in dim light, enzymes denature when hot", () => {
    expect(photoRate(20, 0.2, 30)).toBeLessThan(photoRate(80, 0.2, 30));
    expect(photoRate(100, 0.2, 48)).toBeLessThan(photoRate(100, 0.2, 30));
  });
  it("APS points follow the NSC levels", () => {
    expect([85, 75, 65, 55, 45, 35, 10].map(apsPoints)).toEqual([7, 6, 5, 4, 3, 2, 1]);
  });
});

describe("generators", () => {
  it("there are at least 30, with unique ids", () => {
    expect(GENERATORS.length).toBeGreaterThanOrEqual(30);
    expect(new Set(GENERATORS.map((g) => g.id)).size).toBe(GENERATORS.length);
  });

  for (const g of GENERATORS) {
    it(`${g.id}: 150 problems, every memo alternative passes its own checker`, () => {
      for (let seed = 0; seed < 150; seed++) {
        const p = g.make(seed);
        expect(p.q.length).toBeGreaterThan(5);
        expect(p.solution.length).toBeGreaterThan(5);
        expect(p.q).not.toMatch(/undefined|NaN|\{|\}/);
        expect(p.solution).not.toMatch(/undefined|NaN/);
        expect(p.answer).not.toMatch(/undefined|NaN|\{|\}/);
        for (const alt of p.answer.split(" | ")) {
          const r = checkAnswer(alt, p);
          expect(r.ok, `${g.id}#${seed}: ${alt} (${r.message})`).toBe(true);
        }
        // Deterministic: the same seed makes the same problem.
        expect(g.make(seed).answer).toBe(p.answer);
      }
    });
  }

  it("produce variety", () => {
    for (const g of GENERATORS) {
      const answers = new Set(Array.from({ length: 60 }, (_, s) => g.make(s).answer));
            // A few generators have only a handful of possible answers (e.g. 25%, 50%, 75%, 100%).
      expect(answers.size, g.id).toBeGreaterThanOrEqual(({ "mono-ratio": 3, "sex-linked": 3, "mono-percent": 4 } as Record<string, number>)[g.id] ?? 5);
    }
  });
});
