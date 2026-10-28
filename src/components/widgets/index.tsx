"use client";
import dynamic from "next/dynamic";
import type { WidgetName } from "@/content/types";

const loading = () => <div className="h-64 animate-pulse rounded-2xl border border-line bg-surface-2" />;

/** Widgets are code-split so each lesson only downloads what it uses. */
const REGISTRY: Record<WidgetName, React.ComponentType<Record<string, unknown>>> = {
  sorter: dynamic(() => import("./sorter").then((m) => m.Sorter as never), { loading }),
  drill: dynamic(() => import("./drill").then((m) => m.Drill as never), { loading }),
  diagram: dynamic(() => import("./diagram-explorer").then((m) => m.DiagramExplorer as never), { loading }),
  "punnett-lab": dynamic(() => import("./punnett-lab").then((m) => m.PunnettLab as never), { loading }),
  "dna-lab": dynamic(() => import("./dna-lab").then((m) => m.DnaLab as never), { loading }),
  "meiosis-lab": dynamic(() => import("./meiosis-lab").then((m) => m.MeiosisLab as never), { loading }),
  "photosynthesis-lab": dynamic(() => import("./photosynthesis-lab").then((m) => m.PhotosynthesisLab as never), { loading }),
  "respiration-lab": dynamic(() => import("./respiration-lab").then((m) => m.RespirationLab as never), { loading }),
  "population-lab": dynamic(() => import("./population-lab").then((m) => m.PopulationLab as never), { loading }),
  "selection-lab": dynamic(() => import("./selection-lab").then((m) => m.SelectionLab as never), { loading }),
  "homeostasis-lab": dynamic(() => import("./homeostasis-lab").then((m) => m.HomeostasisLab as never), { loading }),
  "cycle-lab": dynamic(() => import("./cycle-lab").then((m) => m.CycleLab as never), { loading }),
  "eye-lab": dynamic(() => import("./eye-lab").then((m) => m.EyeLab as never), { loading }),
  "investigation-planner": dynamic(() => import("./investigation-planner").then((m) => m.InvestigationPlanner as never), { loading }),
  "graph-lab": dynamic(() => import("./graph-lab").then((m) => m.GraphLab as never), { loading }),
  "microscope-lab": dynamic(() => import("./microscope-lab").then((m) => m.MicroscopeLab as never), { loading }),
  "pedigree-lab": dynamic(() => import("./pedigree-lab").then((m) => m.PedigreeLab as never), { loading }),
  "germ-lab": dynamic(() => import("./germ-lab").then((m) => m.GermLab as never), { loading }),
  "plate-builder": dynamic(() => import("./plate-builder").then((m) => m.PlateBuilder as never), { loading }),
  "first-aid-sim": dynamic(() => import("./first-aid-sim").then((m) => m.FirstAidSim as never), { loading }),
  "career-explorer": dynamic(() => import("./career-explorer").then((m) => m.CareerExplorer as never), { loading }),
  "aps-calculator": dynamic(() => import("./aps-calculator").then((m) => m.ApsCalculator as never), { loading }),
  "footprint-lab": dynamic(() => import("./footprint-lab").then((m) => m.FootprintLab as never), { loading }),
};

export function Widget({ name, props }: { name: WidgetName; props?: Record<string, unknown> }) {
  const C = REGISTRY[name];
  if (!C) return <p className="text-danger">Unknown widget: {name}</p>;
  return <C {...(props ?? {})} />;
}
