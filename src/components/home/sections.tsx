"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { Accessibility, ArrowRight, Brain, Briefcase, FlaskConical, Gamepad2, Hammer, GraduationCap, HeartPulse, Infinity as InfinityIcon, Layers, NotebookPen, PartyPopper, PenLine, Sparkles, Swords, Timer, Trophy } from "lucide-react";
import type { Grade, Topic } from "@/content/types";
import { CardBody, CardContainer, CardItem } from "@/components/aceternity/card-3d";
import { BentoGrid, BentoGridItem } from "@/components/aceternity/bento-grid";
import { InfiniteMovingCards } from "@/components/aceternity/infinite-moving-cards";
import { Meteors } from "@/components/aceternity/meteors";
import { GlowCard } from "@/components/aceternity/glow-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProgressBar } from "@/components/ui/progress-bar";
import { gsap, motionAllowed, useGSAP } from "@/lib/gsap";
import { useProgress } from "@/lib/progress";
import { setPrefs, usePrefs } from "@/lib/prefs";
import { PAPER_INFO, STRANDS, TOPICS } from "@/lib/topics";
import { cn } from "@/lib/utils";

export interface TopicSummary {
  topic: Topic;
  lessons: { slug: string; title: string; emoji: string }[];
}

/** Eight knowledge areas: the CAPS strands, science skills, careers and everyday biology. */
export function StrandTracks({ topics }: { topics: TopicSummary[] }) {
  const progress = useProgress();
  const [grade, setGrade] = useState<Grade>(12);
  return (
    <section className="mx-auto max-w-7xl px-4 py-20" aria-labelledby="tracks">
      <SectionHeading eyebrow="Two grades · two papers · plus life" title={<span id="tracks">The whole CAPS Life Sciences syllabus – and biology for life</span>} description="Lessons follow the CAPS Grade 11 and 12 Life Sciences curriculum and the DBE examination guidelines for Paper 1 and Paper 2, with the scientific skills examined in every paper. Then there's biology you can use: careers in the life sciences and everyday health, food and home." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {STRANDS.map((st) => {
          const mine = TOPICS.filter((t) => t.strand === st.strand);
          const live = topics.filter((t) => mine.some((m) => m.topic === t.topic) && t.lessons.length);
          const all = live.flatMap((t) => t.lessons);
          const done = all.filter((l) => progress.completedLessons[l.slug]).length;
          const papers = [...new Set(mine.map((t) => t.paper))];
          const label = papers[0] === 0 ? "For real life" : papers[0] === 3 ? "Every paper" : papers.length > 1 ? "Paper 1 & 2" : `Paper ${papers[0]}`;
          return (
            <CardContainer key={st.strand} className="w-full" containerClassName="w-full">
              <CardBody className="relative h-full w-full overflow-hidden rounded-3xl border border-line bg-surface p-6 shadow-sm">
                <CardItem translateZ={40} className="w-full">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: st.colour }}>{label}</span>
                    <span className="text-xs text-muted">{all.length ? `${done}/${all.length} done` : "coming soon"}</span>
                  </div>
                </CardItem>
                <CardItem translateZ={60} className="mt-4">
                  <h3 className="font-display text-xl font-bold">{st.emoji} {st.strand}</h3>
                  <p className="mt-1 text-sm text-muted">{st.blurb}</p>
                </CardItem>
                <CardItem translateZ={30} className="mt-4 w-full">
                  <ul className="space-y-1">
                    {mine.map((t) => {
                      const n = topics.find((x) => x.topic === t.topic)?.lessons.length ?? 0;
                      return (
                        <li key={t.topic} className="flex items-center gap-2 text-sm">
                          <span aria-hidden>{t.emoji}</span>
                          {n ? <Link href={`/learn?topic=${t.slug}`} className="font-medium hover:underline">{t.title}</Link> : <span className="text-muted">{t.title}</span>}
                          <span className={cn("ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold", n ? "bg-success/15 text-success" : "bg-surface-2 text-muted")}>{t.paper === 1 || t.paper === 2 ? `Gr ${t.grade}` : n ? `${n}` : "soon"}</span>
                        </li>
                      );
                    })}
                  </ul>
                </CardItem>
                <CardItem translateZ={50} className="mt-5 w-full">
                  <ProgressBar value={done} max={Math.max(1, all.length)} colour={st.colour} label={`${st.strand} progress`} />
                  {all.length > 0 && (
                    <Link href={`/learn?strand=${st.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: st.colour }}>
                      {done ? "Continue" : "Start"} {st.short} <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </CardItem>
              </CardBody>
            </CardContainer>
          );
        })}
      </div>
      <div className="mt-6 rounded-3xl border border-dashed border-line p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="mr-auto font-display text-xl font-bold">How the final exams are built</h3>
          {([11, 12] as const).map((g) => (
            <button key={g} onClick={() => setGrade(g)} aria-pressed={grade === g} className={cn("rounded-lg px-3 py-1 text-sm font-bold", grade === g ? "bg-brand text-white" : "bg-surface-2 text-muted")}>Grade {g}</button>
          ))}
        </div>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {([1, 2] as const).map((p) => (
            <div key={p}>
              <div className="text-sm font-bold">{PAPER_INFO[grade][p].title} <span className="font-normal text-muted">· {PAPER_INFO[grade][p].duration} · {PAPER_INFO[grade][p].marks} marks</span></div>
              <ul className="mt-1 space-y-0.5 text-sm text-muted">
                {PAPER_INFO[grade][p].sections.map((sec) => <li key={sec.name}>{sec.name} – <strong className="text-fg">±{sec.marks}</strong></li>)}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">Approximate weightings from the DBE examination guidelines – they shift a little every year, so always check with your teacher. Scientific skills (investigations, graphs, tables, drawings and calculations) are examined in every paper.</p>
      </div>
    </section>
  );
}

/** Teaser for the two "for life" areas: everyday biology and careers. */
export function LifeShelf({ daily, careers }: { daily: { slug: string; title: string; emoji: string; tagline: string }[]; careers: { slug: string; title: string; emoji: string; tagline: string }[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16" aria-labelledby="life-shelf">
      <SectionHeading eyebrow="Biology for life" title={<span id="life-shelf">Use it at home today – and build a career on it tomorrow</span>} description="Life Sciences is the most useful subject you'll ever take. Eat well on a budget, understand your medicines, stay safe, save a life with first aid, grow your own food – and see where the subject can take you after matric." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-line bg-gradient-to-br from-daily/15 via-surface to-surface p-6">
          <div className="flex items-center gap-2 font-display text-xl font-bold"><HeartPulse className="h-5 w-5 text-daily" /> Everyday biology</div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {daily.map((l) => (
              <li key={l.slug}><Link href={`/learn/${l.slug}`} className="flex h-full gap-2 rounded-2xl border border-line bg-surface/80 p-3 transition hover:border-daily/50"><span className="text-2xl">{l.emoji}</span><span><span className="block text-sm font-bold">{l.title}</span><span className="text-xs text-muted">{l.tagline}</span></span></Link></li>
            ))}
          </ul>
          <Link href="/everyday" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-daily">Everyday biology & tools <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="rounded-3xl border border-line bg-gradient-to-br from-career/15 via-surface to-surface p-6">
          <div className="flex items-center gap-2 font-display text-xl font-bold"><Briefcase className="h-5 w-5 text-career" /> Careers &amp; study paths</div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {careers.map((l) => (
              <li key={l.slug}><Link href={`/learn/${l.slug}`} className="flex h-full gap-2 rounded-2xl border border-line bg-surface/80 p-3 transition hover:border-career/50"><span className="text-2xl">{l.emoji}</span><span><span className="block text-sm font-bold">{l.title}</span><span className="text-xs text-muted">{l.tagline}</span></span></Link></li>
            ))}
          </ul>
          <Link href="/careers" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-career">Career explorer & APS calculator <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}

function MiniHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("relative flex h-full min-h-28 w-full flex-1 overflow-hidden rounded-xl", className)}>{children}</div>;
}

export function Features({ tools }: { tools: number }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20" aria-labelledby="features">
      <SectionHeading eyebrow="Why it sticks" title={<span id="features">Biology is something you do</span>} description="You don't learn biology by copying notes. Every idea comes with something to try – a cross to work out, a diagram to tap, a slider to drag – with instant feedback." />
      <BentoGrid className="md:auto-rows-[20rem]">
        <BentoGridItem
          className="md:col-span-2"
          title={`${tools} labs, diagrams & tools`}
          description="Build Punnett squares. Transcribe and translate DNA. Step through meiosis and watch crossing over. Drag the light slider and see photosynthesis speed up. Catch and mark fish to estimate a population. Watch natural selection eat the wrong-coloured beetles. Scroll through the menstrual cycle. Tap any part of the eye, ear, nephron or brain."
          icon={<Hammer className="h-5 w-5 text-brand" />}
          header={
            <MiniHeader className="items-center justify-around bg-gradient-to-br from-cell/15 via-eco/10 to-body/15 p-4">
              {["🧬", "🔬", "🌿", "🦠", "🧠"].map((e, k) => <span key={k} className="grid h-14 w-14 place-items-center rounded-2xl bg-surface/80 text-3xl shadow">{e}</span>)}
            </MiniHeader>
          }
        />
        <BentoGridItem
          title="Practice that never runs out"
          description="Endless genetics crosses, DNA base pairing, mark–recapture, magnification, and Section A biological terms for every topic – checked instantly, with full working."
          icon={<InfinityIcon className="h-5 w-5 text-memory" />}
          header={
            <MiniHeader className="flex-col justify-center gap-1 bg-memory/10 p-4 text-sm">
              <div>Tt × Tt → phenotypic ratio?</div>
              <div className="rounded-lg border-2 border-success bg-surface px-2 py-1 font-mono">3 : 1</div>
              <div className="text-success">Lekker! 🔥 streak 5</div>
            </MiniHeader>
          }
        />
        <BentoGridItem
          title="Exam Room with memos"
          description="Investigations, data tables, graphs, diagrams and genetics crosses for every CAPS topic. Answer first, then tick the memo – just like the markers."
          icon={<NotebookPen className="h-5 w-5 text-exam" />}
          header={<MiniHeader className="flex-col justify-center gap-1 bg-exam/10 p-3 text-xs"><div>3.2 Identify the dependent variable. (1)</div><div className="text-success">✓ The volume of oxygen released</div><div>3.3 State TWO controlled variables. (2)</div><div className="text-success">✓ Temperature ✓ CO₂ concentration</div></MiniHeader>}
        />
        <BentoGridItem
          className="md:col-span-2"
          title="Built for ADHD and dyslexia (and helpful for everyone)"
          description="One idea per screen, diagrams you can tap instead of walls of labels, worked examples revealed a step at a time, read-aloud for every lesson, a reading ruler, dyslexia-friendly fonts, focus sprints with brain breaks, and a calm mode."
          icon={<Brain className="h-5 w-5 text-memory" />}
          header={
            <MiniHeader className="items-center gap-3 bg-gradient-to-r from-memory/15 via-brand/10 to-diversity/15 p-4">
              {[[<Timer key="t" className="h-5 w-5" />, "Focus sprints"], [<Accessibility key="a" className="h-5 w-5" />, "Fonts & sizes"], [<Sparkles key="s" className="h-5 w-5" />, "Calm mode"], [<Trophy key="tr" className="h-5 w-5" />, "XP & badges"]].map(([ic, t], k) => (
                <div key={k} className="flex flex-1 flex-col items-center gap-1 rounded-xl bg-surface/80 p-3 text-center text-xs font-semibold">{ic}{t}</div>
              ))}
            </MiniHeader>
          }
        />
      </BentoGrid>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Link href="/toolkit" className="group"><GlowCard colour="var(--t-eco)" className="flex h-full items-start gap-4 p-5 transition group-hover:-translate-y-0.5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-eco text-white"><FlaskConical className="h-5 w-5" /></span><span><span className="block font-display text-lg font-bold">Labs &amp; diagrams</span><span className="text-sm text-muted">Every simulation, diagram and tool in one place – great for projecting in class.</span></span></GlowCard></Link>
        <Link href="/everyday" className="group"><GlowCard colour="var(--t-daily)" className="flex h-full items-start gap-4 p-5 transition group-hover:-translate-y-0.5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-daily text-white"><HeartPulse className="h-5 w-5" /></span><span><span className="block font-display text-lg font-bold">Everyday biology</span><span className="text-sm text-muted">A budget plate builder, food-label decoder, first-aid trainer, germ lab and a water &amp; carbon footprint calculator.</span></span></GlowCard></Link>
        <Link href="/careers" className="group"><GlowCard colour="var(--t-career)" className="flex h-full items-start gap-4 p-5 transition group-hover:-translate-y-0.5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-career text-white"><Briefcase className="h-5 w-5" /></span><span><span className="block font-display text-lg font-bold">Careers</span><span className="text-sm text-muted">A career explorer, an APS calculator and the routes into health, farming, nature and lab careers – university, TVET and learnerships.</span></span></GlowCard></Link>
      </div>
    </section>
  );
}

const STEPS = [
  { icon: <Sparkles className="h-5 w-5" />, title: "Hook", text: "Every lesson starts with something real – a clinic queue, a braai, a drought, a paternity test, a rhino poaching headline – so you know WHY it matters.", colour: "var(--brand)" },
  { icon: <FlaskConical className="h-5 w-5" />, title: "Do it hands-on", text: "A lab or diagram makes the idea click: tap the parts of the eye, drag a slider to change the light, build a Punnett square, step through meiosis.", colour: "var(--t-diversity)" },
  { icon: <PenLine className="h-5 w-5" />, title: "Practise it", text: "Worked examples revealed one step at a time – predict the next step first – then your turn with typed answers, instant feedback and the reason why.", colour: "var(--t-eco)" },
  { icon: <Brain className="h-5 w-5" />, title: "Check it", text: "Quick quizzes and flashcards use active recall – the most effective way to remember.", colour: "var(--memory)" },
  { icon: <GraduationCap className="h-5 w-5" />, title: "Exam it", text: "Answer real exam-style questions – data, diagrams, investigations – and mark yourself against the memo.", colour: "var(--exam)" },
  { icon: <PartyPopper className="h-5 w-5" />, title: "Celebrate", text: "XP, levels, streaks and badges reward effort – not just being right.", colour: "var(--t-career)" },
];

/** "How a lesson works" – a vertical timeline revealed with GSAP ScrollTrigger. */
export function LessonFlow() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!ref.current || !motionAllowed()) return;
    gsap.fromTo(ref.current.querySelector("[data-line]"), { scaleY: 0 }, {
      scaleY: 1, ease: "none", transformOrigin: "top",
      scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 60%", scrub: true },
    });
    ref.current.querySelectorAll("[data-step]").forEach((el) => {
      gsap.from(el, { opacity: 0, x: -30, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%" } });
    });
  }, { scope: ref });
  return (
    <section className="mx-auto max-w-4xl px-4 py-20" aria-labelledby="flow">
      <SectionHeading eyebrow="Inside every lesson" title={<span id="flow">Six small steps. No walls of text.</span>} description="Lessons are split into 3–10 minute chunks with a clear Next button – perfect for short attention spans and busy school schedules." />
      <div ref={ref} className="relative pl-10">
        <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-line" aria-hidden />
        <div data-line className="absolute top-0 bottom-0 left-4 w-0.5 bg-gradient-to-b from-brand via-diversity to-eco" aria-hidden />
        <ol className="space-y-8">
          {STEPS.map((s, i) => (
            <li key={s.title} data-step className="relative">
              <span className="absolute top-1 -left-10 grid h-8 w-8 place-items-center rounded-full text-white shadow-lg" style={{ background: s.colour }}>{s.icon}</span>
              <GlowCard colour={s.colour} className="p-5">
                <div className="text-xs font-bold text-muted">STEP {i + 1}</div>
                <h3 className="font-display text-xl font-bold">{s.title}</h3>
                <p className="mt-1 text-muted">{s.text}</p>
              </GlowCard>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function TermMarquee({ terms }: { terms: { title: string; text: string; colour: string }[] }) {
  return (
    <section className="py-10" aria-label="Key concepts covered">
      <InfiniteMovingCards items={terms} speed="slow" />
    </section>
  );
}

export function PracticeStrip() {
  const items = [
    { href: "/flashcards", icon: <Layers className="h-6 w-6" />, title: "Flashcards", text: "Spaced repetition of every biological term", colour: "var(--memory)" },
    { href: "/quiz", icon: <Swords className="h-6 w-6" />, title: "Quiz Arena", text: "Mixed-topic rounds, timed or relaxed", colour: "var(--t-diversity)" },
    { href: "/exam", icon: <NotebookPen className="h-6 w-6" />, title: "Exam Room", text: "Exam-style questions with marking memos", colour: "var(--exam)" },
    { href: "/games", icon: <Gamepad2 className="h-6 w-6" />, title: "Games", text: "Speed Bio, This or That?, Who Am I?", colour: "var(--t-eco)" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-10" aria-label="Practice modes">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <Link key={it.href} href={it.href} className="group">
            <GlowCard colour={it.colour} className="h-full p-5 transition group-hover:-translate-y-0.5">
              <span className="grid h-11 w-11 place-items-center rounded-xl text-white" style={{ background: it.colour }}>{it.icon}</span>
              <h3 className="mt-3 font-display text-lg font-bold">{it.title}</h3>
              <p className="text-sm text-muted">{it.text}</p>
            </GlowCard>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function AdhdSection() {
  const prefs = usePrefs();
  return (
    <section className="mx-auto max-w-7xl px-4 py-20" aria-labelledby="adhd">
      <div className="relative overflow-hidden rounded-[2rem] border border-line bg-surface p-8 md:p-12">
        <Meteors number={18} />
        <div className="relative grid gap-10 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-bold tracking-wider text-memory uppercase">Every brain is welcome</p>
            <h2 id="adhd" className="font-display text-3xl font-bold md:text-4xl">Your brain, your settings</h2>
            <p className="mt-3 text-lg text-muted">
              ADHD brains thrive on <strong className="text-fg">novelty, quick feedback and clear next steps</strong>, and struggle with walls of text and hidden progress.
              LifeMzansi is designed around that – and you can tune it right now:
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              <li>🧩 <strong>Chunked lessons</strong> – one idea per screen, worked examples one step at a time</li>
              <li>⏱️ <strong>Focus sprints</strong> – 5/10/15/25 minute timer with movement breaks</li>
              <li>🎯 <strong>Instant feedback</strong> – sort, match and quiz with immediate answers and XP</li>
              <li>🎨 <strong>Consistent colours</strong> – Genetics is violet, Energy orange, the Body berry, Diversity teal, Environment green, Skills blue, Careers gold, Everyday fuchsia; red always means a mistake, pink a memory hook</li>
              <li>👆 <strong>Tap, don&apos;t cram</strong> – diagrams you can tap and quiz yourself on, sliders instead of walls of text, and a hint before every answer</li>
              <li>🔊 <strong>Read aloud</strong>, reading ruler, word anchors and dyslexia-friendly fonts</li>
            </ul>
          </div>
          <div className="grid content-center gap-3">
            {([
              ["stepMode", "One step at a time", "Show lessons chunk by chunk"],
              ["calm", "Calm mode", "No moving backgrounds"],
              ["ruler", "Reading ruler", "A band that follows your pointer"],
              ["wordAnchors", "Word anchors", "Bold the start of each word"],
            ] as const).map(([k, t, d]) => (
              <button key={k} onClick={() => setPrefs({ [k]: !prefs[k] })} aria-pressed={prefs[k]}
                className={cn("flex items-center justify-between rounded-2xl border p-4 text-left transition", prefs[k] ? "border-brand bg-brand-soft" : "border-line bg-surface-2 hover:border-brand/40")}>
                <span><span className="block font-semibold">{t}</span><span className="text-sm text-muted">{d}</span></span>
                <span className={cn("h-6 w-11 rounded-full p-0.5 transition", prefs[k] ? "bg-brand" : "bg-line")}><span className={cn("block h-5 w-5 rounded-full bg-white shadow transition", prefs[k] && "translate-x-5")} /></span>
              </button>
            ))}
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface-2 p-4">
              <span className="mr-auto font-semibold">Reading font</span>
              {(["default", "atkinson", "dyslexic"] as const).map((f) => (
                <button key={f} onClick={() => setPrefs({ font: f })} aria-pressed={prefs.font === f} className={cn("rounded-lg px-2.5 py-1 text-sm", prefs.font === f ? "bg-brand text-white" : "bg-surface")} style={{ fontFamily: f === "atkinson" ? "Atkinson Hyperlegible" : f === "dyslexic" ? "OpenDyslexic" : undefined }}>
                  {f === "default" ? "Inter" : f === "atkinson" ? "Atkinson" : "Dyslexic"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FinalCta({ firstSlug }: { firstSlug: string }) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 text-center">
      <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">Ready to crack the code of life?</h2>
      <p className="mx-auto mt-4 max-w-xl text-lg text-muted">No installs, no sign-up. It runs entirely in your browser – even on a phone.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={`/learn/${firstSlug}`} className="inline-flex items-center gap-2 rounded-2xl bg-brand px-6 py-3 font-semibold text-white shadow-xl shadow-brand/30 transition hover:brightness-110">Start lesson 1 <ArrowRight className="h-4 w-4" /></Link>
        <Link href="/toolkit" className="inline-flex items-center gap-2 rounded-2xl border border-line px-6 py-3 font-semibold transition hover:border-brand/50"><FlaskConical className="h-4 w-4" /> The labs</Link>
        <Link href="/teachers" className="inline-flex items-center gap-2 rounded-2xl border border-line px-6 py-3 font-semibold transition hover:border-brand/50"><GraduationCap className="h-4 w-4" /> I&apos;m a teacher</Link>
      </div>
    </section>
  );
}
