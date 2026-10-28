"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Accessibility, BookOpen, Briefcase, FlaskConical, Gamepad2, GraduationCap, HeartPulse, Layers, NotebookPen, Swords } from "lucide-react";
import { FloatingDock } from "@/components/aceternity/floating-dock";
import { levelFor, useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { PrefsPanel } from "./prefs-panel";
import { FocusTimer } from "./focus-timer";
import { Logo } from "./logo";

/** Progress lives in the XP pill. */
export const NAV = [
  { title: "Learn", href: "/learn", icon: <BookOpen className="h-5 w-5" /> },
  { title: "Labs", href: "/toolkit", icon: <FlaskConical className="h-5 w-5" /> },
  { title: "Everyday", href: "/everyday", icon: <HeartPulse className="h-5 w-5" /> },
  { title: "Careers", href: "/careers", icon: <Briefcase className="h-5 w-5" /> },
  { title: "Flashcards", href: "/flashcards", icon: <Layers className="h-5 w-5" /> },
  { title: "Quiz", href: "/quiz", icon: <Swords className="h-5 w-5" /> },
  { title: "Exam Room", href: "/exam", icon: <NotebookPen className="h-5 w-5" /> },
  { title: "Games", href: "/games", icon: <Gamepad2 className="h-5 w-5" /> },
];

/** The phone dock only has room for five; Progress lives in the XP pill, the rest on the home page and in the footer. */
const DOCK = [
  { title: "Learn", href: "/learn", icon: <BookOpen className="h-5 w-5" /> },
  { title: "Labs", href: "/toolkit", icon: <FlaskConical className="h-5 w-5" /> },
  { title: "Everyday", href: "/everyday", icon: <HeartPulse className="h-5 w-5" /> },
  { title: "Quiz", href: "/quiz", icon: <Swords className="h-5 w-5" /> },
  { title: "Exam", href: "/exam", icon: <NotebookPen className="h-5 w-5" /> },
];

export function SiteHeader() {
  const path = usePathname();
  const [prefsOpen, setPrefsOpen] = useState(false);
  const progress = useProgress();
  const lvl = levelFor(progress.xp);
  return (
    <>
      <a href="#main" className="sr-only z-[100] rounded-lg bg-brand px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2">Skip to content</a>
      <header className="hide-in-focus sticky top-0 z-50 border-b border-line/70 bg-bg/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          <Link href="/" className="flex items-center gap-2" aria-label="LifeMzansi home"><Logo /></Link>
          <nav aria-label="Main" className="ml-2 hidden items-center gap-0.5 xl:flex">
            {NAV.map((n) => {
              const active = path.startsWith(n.href);
              return (
                <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined}
                  className={cn("rounded-lg px-2 py-2 text-sm font-medium whitespace-nowrap transition", active ? "bg-brand-soft text-brand" : "text-muted hover:bg-surface-2 hover:text-fg")}>
                  {n.title}
                </Link>
              );
            })}
            <Link href="/teachers" className={cn("rounded-lg px-2.5 py-2 text-sm font-medium transition", path.startsWith("/teachers") ? "bg-brand-soft text-brand" : "text-muted hover:bg-surface-2 hover:text-fg")}>
              <span className="inline-flex items-center gap-1"><GraduationCap className="h-4 w-4" /> Teachers</span>
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <FocusTimer />
            <Link href="/progress" className="flex items-center gap-2 rounded-full border border-line bg-surface px-2 py-1.5 text-sm sm:px-3" title={`${progress.xp} XP`}>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-brand to-info text-[11px] font-bold text-white">{lvl.level}</span>
              <span className="hidden font-semibold whitespace-nowrap tabular-nums sm:inline" data-xp-target>{progress.xp} XP</span>
            </Link>
            <button onClick={() => setPrefsOpen(true)} className="flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3 py-2 text-sm font-medium text-fg transition hover:border-brand/50" aria-label="Open learning preferences">
              <Accessibility className="h-4 w-4 text-brand" /><span className="hidden xl:inline">Preferences</span>
            </button>
          </div>
        </div>
      </header>
      <div className="hide-in-focus">
        <FloatingDock items={DOCK} />
      </div>
      <PrefsPanel open={prefsOpen} onClose={() => setPrefsOpen(false)} />
    </>
  );
}
