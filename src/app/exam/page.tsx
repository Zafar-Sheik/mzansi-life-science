import type { Metadata } from "next";
import { Suspense } from "react";
import { EXAM_QUESTIONS } from "@/content";
import { ExamRoom } from "@/components/pages/exam-room";

export const metadata: Metadata = { title: "Exam Room", description: "NSC-style Grade 11 and 12 Life Sciences questions with marking memos – investigations, diagrams, genetics crosses, graphs and essays – for every CAPS topic." };

export default function ExamPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10 text-muted">Loading…</div>}>
      <ExamRoom questions={EXAM_QUESTIONS} />
    </Suspense>
  );
}
