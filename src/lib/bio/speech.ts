/** Turn markdown into something a speech engine can say: drop formatting characters and table pipes. */
export function speakable(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_#>|\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Speak text with the browser's speech engine (South African English when available). */
export function speak(text: string, rate = 1, onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  const s = window.speechSynthesis;
  const u = new SpeechSynthesisUtterance(speakable(text));
  u.lang = "en-ZA";
  u.rate = rate;
  const voice = s.getVoices().find((v) => v.lang === "en-ZA") ?? s.getVoices().find((v) => v.lang.startsWith("en-GB"));
  if (voice) u.voice = voice;
  if (onEnd) {
    u.onend = onEnd;
    u.onerror = onEnd;
  }
  s.cancel();
  s.speak(u);
  return true;
}
