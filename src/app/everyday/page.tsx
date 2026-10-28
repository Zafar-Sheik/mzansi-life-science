import type { Metadata } from "next";
import { LESSONS } from "@/content";
import { isDaily } from "@/lib/topics";
import { LifeArea, type LifeLesson } from "@/components/pages/life-work";

export const metadata: Metadata = { title: "Everyday biology", description: "Biology you can use at home: balanced meals on a budget, food labels, germs, vaccines and antibiotics, sexual health, first aid, sleep and stress, growing your own food and safe water – with a plate builder, first-aid trainer and footprint calculator." };

export default function EverydayPage() {
  const lessons: LifeLesson[] = LESSONS.filter((l) => isDaily(l.topic)).map((l) => ({ slug: l.slug, topic: l.topic, title: l.title, tagline: l.tagline, emoji: l.emoji, minutes: l.chunks.reduce((a, c) => a + c.minutes, 0) }));
  return <LifeArea area="Everyday Biology" lessons={lessons} />;
}
