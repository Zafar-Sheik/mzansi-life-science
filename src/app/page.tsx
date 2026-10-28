import { Hero } from "@/components/home/hero";
import { AdhdSection, Features, FinalCta, LessonFlow, LifeShelf, PracticeStrip, StrandTracks, TermMarquee, type TopicSummary } from "@/components/home/sections";
import { EXAM_QUESTIONS, GLOSSARY, LESSONS, lessonsForTopic } from "@/content";
import { WIDGET_COUNT } from "@/components/widgets/catalogue";
import { isCareer, isDaily, TOPICS, topicMeta } from "@/lib/topics";
import { shuffle } from "@/lib/utils";

export default function HomePage() {
  const topics: TopicSummary[] = TOPICS.map((t) => ({
    topic: t.topic,
    lessons: lessonsForTopic(t.topic).map((l) => ({ slug: l.slug, title: l.title, emoji: l.emoji })),
  }));
  const marquee = shuffle(GLOSSARY.filter((g) => topicMeta(g.topic).paper !== 0), "home").slice(0, 14).map((g) => ({ title: g.term, text: g.def, colour: topicMeta(g.topic).colour }));
  const examParts = EXAM_QUESTIONS.reduce((n, q) => n + q.parts.length, 0);
  const card = (l: (typeof LESSONS)[number]) => ({ slug: l.slug, title: l.title, emoji: l.emoji, tagline: l.tagline });
  return (
    <>
      <Hero stats={{ lessons: LESSONS.length, tools: WIDGET_COUNT, exam: examParts, terms: GLOSSARY.length }} />
      <TermMarquee terms={marquee} />
      <StrandTracks topics={topics} />
      <PracticeStrip />
      <LifeShelf daily={LESSONS.filter((l) => isDaily(l.topic)).map(card)} careers={LESSONS.filter((l) => isCareer(l.topic)).map(card)} />
      <Features tools={WIDGET_COUNT} />
      <LessonFlow />
      <AdhdSection />
      <FinalCta firstSlug={LESSONS[0].slug} />
    </>
  );
}
