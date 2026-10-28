"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { Strand, Topic } from "@/content/types";
import { Widget } from "@/components/widgets";
import { WIDGET_CATALOGUE } from "@/components/widgets/catalogue";
import { useProgress } from "@/lib/progress";
import { strandMeta, topicMeta } from "@/lib/topics";
import { cn } from "@/lib/utils";
import { GlowCard } from "@/components/aceternity/glow-card";

export interface LifeLesson { slug: string; topic: Topic; title: string; tagline: string; emoji: string; minutes: number }

const COPY: Record<"Everyday Biology" | "Careers", { eyebrow: string; title: string; text: string; note: string }> = {
  "Everyday Biology": {
    eyebrow: "Everyday biology",
    title: "Biology you can use today",
    text: "The Life Sciences you’ll use every day of your life: eating well when money is tight, reading food labels, understanding germs, vaccines and medicines, looking after your sexual health, saving a life with first aid, sleeping and coping with stress, growing your own food and keeping water safe.",
    note: "This is health education, not medical advice. For your own health, visit your local clinic – services at public clinics are free. In an emergency, call 10177 (ambulance) or 112 from a cellphone.",
  },
  Careers: {
    eyebrow: "Careers & study paths",
    title: "Where Life Sciences can take you",
    text: "Life Sciences opens doors to hundreds of careers – in hospitals and clinics, on farms and in game reserves, in labs, food factories and the police forensic service. Explore the careers, work out your APS, and find the route that fits you: university, a TVET college, a learnership or a job straight after matric.",
    note: "Admission requirements and APS scores change every year and differ between institutions. Always check the latest prospectus of the university or college you want to apply to.",
  },
};

/** Everyday biology and Careers: lessons plus ready-to-use tools for life after the exam. */
export function LifeArea({ area, lessons }: { area: Extract<Strand, "Everyday Biology" | "Careers">; lessons: LifeLesson[] }) {
  const progress = useProgress();
  const tools = WIDGET_CATALOGUE.filter((w) => w.area === area);
  const [active, setActive] = useState(tools[0]?.title ?? "");
  const tool = tools.find((t) => t.title === active) ?? tools[0];
  const st = strandMeta(area);
  const copy = COPY[area];
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="rounded-[2rem] border border-line p-6 md:p-10" style={{ background: `linear-gradient(135deg, color-mix(in oklab, ${st.colour} 16%, var(--surface)), var(--surface) 55%, color-mix(in oklab, var(--t-eco) 10%, var(--surface)))` }}>
        <p className="text-sm font-bold tracking-wider uppercase" style={{ color: st.colour }}>{st.emoji} {copy.eyebrow}</p>
        <h1 className="mt-1 font-display text-4xl font-bold tracking-tight md:text-5xl">{copy.title}</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted">{copy.text}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {tools.map((t) => <button key={t.title} onClick={() => { setActive(t.title); document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" }); }} className="rounded-full border bg-surface/80 px-3 py-1 text-sm font-semibold transition hover:text-white" style={{ borderColor: `color-mix(in oklab, ${st.colour} 40%, transparent)` }} onMouseEnter={(e) => (e.currentTarget.style.background = st.colour)} onMouseLeave={(e) => (e.currentTarget.style.background = "")}>{t.emoji} {t.title}</button>)}
        </div>
      </div>

      <h2 className="mt-10 font-display text-2xl font-bold">Lessons</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((l) => (
          <Link key={l.slug} href={`/learn/${l.slug}`} className="group">
            <GlowCard colour={topicMeta(l.topic).colour} className="h-full p-5 transition group-hover:-translate-y-0.5">
              <div className="flex items-start justify-between"><span className="text-3xl">{l.emoji}</span>{progress.completedLessons[l.slug] && <CheckCircle2 className="h-5 w-5 text-success" />}</div>
              <h3 className="mt-2 font-display text-lg font-bold">{l.title}</h3>
              <p className="mt-1 text-sm text-muted">{l.tagline}</p>
              <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: st.colour }}>{l.minutes} min <ArrowRight className="h-4 w-4" /></p>
            </GlowCard>
          </Link>
        ))}
      </div>

      {tool && (
        <>
          <h2 id="tools" className="mt-10 scroll-mt-20 font-display text-2xl font-bold">Tools</h2>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tools.map((t) => <button key={t.title} onClick={() => setActive(t.title)} aria-pressed={active === t.title} className={cn("rounded-full border px-3 py-1 text-sm font-semibold transition", active === t.title ? "text-white" : "border-line text-muted hover:text-fg")} style={active === t.title ? { background: st.colour, borderColor: st.colour } : undefined}>{t.emoji} {t.title}</button>)}
          </div>
          <p className="mt-2 text-sm text-muted">{tool.description}</p>
          <div key={tool.title} className="mt-4"><Widget name={tool.name} props={tool.props} /></div>
        </>
      )}
      <p className="mt-8 rounded-2xl border border-line bg-surface-2/60 p-4 text-sm text-muted">{copy.note}</p>
    </div>
  );
}
