import type { Metadata } from "next";
import { GLOSSARY } from "@/content";
import { RIDDLES } from "@/content/games";
import { Games } from "@/components/pages/games";

export const metadata: Metadata = { title: "Games room", description: "Speed Bio, This or That?, Who Am I?, concept pairs, true/false blitz, odd one out and bio hangman – Grade 11 and 12 Life Sciences revision games." };

export default function GamesPage() {
  return <Games terms={GLOSSARY.map(({ term, def, topic }) => ({ term, def, topic }))} riddles={RIDDLES} />;
}
