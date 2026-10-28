import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PrefsApplier, themeBootScript } from "@/components/layout/prefs-applier";
import { ReadingRuler } from "@/components/layout/reading-ruler";
import { RewardLayer } from "@/components/layout/reward-layer";
import { ProgressBootstrap } from "@/components/layout/progress-bootstrap";
import { TOPIC_INDEX } from "@/content";

export const metadata: Metadata = {
  title: { default: "LifeMzansi – Grade 11 & 12 Life Sciences (CAPS)", template: "%s · LifeMzansi" },
  description:
    "Interactive CAPS Grade 11 & 12 Life Sciences – microorganisms, plants, animals, photosynthesis, nutrition, respiration, gas exchange, excretion, ecology, human impact, DNA, meiosis, genetics, reproduction, the nervous system, the eye and ear, hormones, homeostasis, plant responses and evolution – plus careers and everyday biology. Labs, diagrams, quizzes, flashcards, exam questions with memos and games. ADHD- and dyslexia-friendly.",
  applicationName: "LifeMzansi",
  keywords: ["Life Sciences", "Biology", "CAPS", "Grade 11", "Grade 12", "NSC", "matric", "DNA", "genetics", "meiosis", "evolution", "photosynthesis", "human reproduction", "nervous system", "South Africa"],
  openGraph: { title: "LifeMzansi", description: "Grade 11 & 12 Life Sciences – the interactive way. Labs, diagrams, exam questions and biology for everyday life.", type: "website" },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#0b0a16" }, { media: "(prefers-color-scheme: light)", color: "#f7f7fb" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-screen">
        <PrefsApplier />
        <ProgressBootstrap topicIndex={TOPIC_INDEX} />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <ReadingRuler />
        <RewardLayer />
      </body>
    </html>
  );
}
