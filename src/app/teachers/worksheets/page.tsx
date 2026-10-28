import type { Metadata } from "next";
import { Suspense } from "react";
import { WorksheetBuilder } from "@/components/pages/worksheet-builder";

export const metadata: Metadata = { title: "Worksheet generator", description: "Printable Grade 11 and 12 Life Sciences worksheets with memos – genetics, DNA, meiosis, population ecology, magnification and Section A terms – generated from LifeMzansi's question generators." };

export default function WorksheetsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-10 text-muted">Loading…</div>}>
      <WorksheetBuilder />
    </Suspense>
  );
}
