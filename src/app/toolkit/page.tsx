import type { Metadata } from "next";
import { Toolkit } from "@/components/pages/toolkit";

export const metadata: Metadata = { title: "Labs & tools", description: "Interactive Life Sciences labs: a Punnett square lab, DNA and protein synthesis lab, meiosis stepper, photosynthesis and respiration labs, mark–recapture, natural selection, the menstrual cycle, the eye, homeostasis, tappable diagrams, an investigation planner and graph checker." };

export default function ToolkitPage() {
  return <Toolkit />;
}
