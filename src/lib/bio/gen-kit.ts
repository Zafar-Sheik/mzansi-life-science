/** Shared helpers for the seeded question generators. */
import type { PracticeProblem, Topic } from "@/content/types";

export type Rng = () => number;
export const int = (r: Rng, lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1));
export const pick = <T,>(r: Rng, arr: readonly T[]): T => arr[Math.floor(r() * arr.length)];

export interface Generator {
  id: string;
  title: string;
  topic: Topic;
  /** Quick enough for the Speed Bio game. */
  speed?: boolean;
  make: (seed: number | string) => PracticeProblem;
}

/** Capitalise the first letter of a sentence. */
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** South African number formatting: decimal comma, no trailing zeros. */
export const za = (n: number, dp = 2) => String(Number(n.toFixed(dp))).replace(".", ",");
