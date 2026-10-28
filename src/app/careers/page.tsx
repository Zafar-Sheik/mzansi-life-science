import type { Metadata } from "next";
import { LESSONS } from "@/content";
import { isCareer } from "@/lib/topics";
import { LifeArea, type LifeLesson } from "@/components/pages/life-work";

export const metadata: Metadata = { title: "Careers", description: "Where Life Sciences can take you: health, farming, food and nature, the lab and biotech – with a career explorer, an APS calculator and the routes through university, TVET colleges and learnerships." };

export default function CareersPage() {
  const lessons: LifeLesson[] = LESSONS.filter((l) => isCareer(l.topic)).map((l) => ({ slug: l.slug, topic: l.topic, title: l.title, tagline: l.tagline, emoji: l.emoji, minutes: l.chunks.reduce((a, c) => a + c.minutes, 0) }));
  return <LifeArea area="Careers" lessons={lessons} />;
}
