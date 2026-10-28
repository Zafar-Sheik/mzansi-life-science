"use client";
import { useMemo, useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Explain, useToolUse } from "./sim-kit";
import { Segmented, WidgetFrame } from "./widget-frame";

type Area = "health" | "land" | "lab" | "nature" | "people";
type Route = "university" | "college" | "workplace";

interface Career { name: string; emoji: string; area: Area; what: string; where: string; routes: Route[]; study: string; subjects: string }

export const CAREERS: Career[] = [
  { name: "Medical doctor", emoji: "🩺", area: "health", what: "Diagnose and treat illness and injury.", where: "Clinics, hospitals, private practice", routes: ["university"], study: "MBChB (6 years) + 2 years internship + 1 year community service", subjects: "Life Sciences, Physical Sciences, Mathematics (high marks)" },
  { name: "Professional nurse", emoji: "👩🏾‍⚕️", area: "health", what: "Care for patients, give medicine, run clinics, deliver babies (midwifery).", where: "Clinics, hospitals, schools, mines, home-based care", routes: ["university", "college"], study: "Bachelor of Nursing (4 years) or a Diploma in Nursing (3 years) at a nursing college", subjects: "Life Sciences recommended; Mathematics or Maths Literacy" },
  { name: "Pharmacist", emoji: "💊", area: "health", what: "Make up and dispense medicines and advise patients.", where: "Pharmacies, hospitals, the pharmaceutical industry", routes: ["university"], study: "BPharm (4 years) + internship", subjects: "Life Sciences, Physical Sciences, Mathematics" },
  { name: "Pharmacist's assistant", emoji: "🧴", area: "health", what: "Help the pharmacist prepare and hand out medicine and manage stock.", where: "Pharmacies and clinics", routes: ["workplace", "college"], study: "Learnership / short qualification while working in a pharmacy", subjects: "Life Sciences helpful" },
  { name: "Paramedic / emergency care", emoji: "🚑", area: "health", what: "Respond to emergencies, stabilise patients and get them to hospital.", where: "Ambulance services, rescue teams, mines", routes: ["university", "college", "workplace"], study: "Bachelor or Diploma in Emergency Medical Care; shorter emergency-care courses for ambulance assistants", subjects: "Life Sciences, Mathematics, Physical Sciences helpful" },
  { name: "Physiotherapist", emoji: "🦵", area: "health", what: "Help people recover movement after injury, illness or surgery.", where: "Hospitals, sports teams, private practice", routes: ["university"], study: "BSc Physiotherapy (4 years)", subjects: "Life Sciences, Physical Sciences, Mathematics" },
  { name: "Dietitian", emoji: "🥗", area: "health", what: "Plan healthy eating for patients and communities – diabetes, malnutrition, HIV.", where: "Hospitals, clinics, schools, food companies", routes: ["university"], study: "BSc Dietetics (4 years)", subjects: "Life Sciences, Physical Sciences, Mathematics" },
  { name: "Radiographer", emoji: "🩻", area: "health", what: "Take X-rays and scans, or give radiation treatment for cancer.", where: "Hospitals and imaging practices", routes: ["university"], study: "Bachelor in Radiography (4 years)", subjects: "Life Sciences, Physical Sciences, Mathematics" },
  { name: "Community health worker", emoji: "🏘️", area: "health", what: "Visit homes, check on TB and HIV treatment, give health education.", where: "Communities, clinics, NGOs", routes: ["workplace"], study: "Short training courses on the job", subjects: "Life Sciences very useful" },
  { name: "Environmental health practitioner", emoji: "🚰", area: "health", what: "Inspect food, water and housing to prevent disease in communities.", where: "Municipalities, the Department of Health", routes: ["university"], study: "Bachelor of Environmental Health (4 years)", subjects: "Life Sciences, Physical Sciences, Mathematics" },
  { name: "Optometrist", emoji: "👓", area: "health", what: "Test eyesight, prescribe glasses and detect eye diseases.", where: "Optometry practices, hospitals", routes: ["university"], study: "Bachelor of Optometry (4 years)", subjects: "Life Sciences, Physical Sciences, Mathematics" },
  { name: "Agricultural scientist", emoji: "🌾", area: "land", what: "Improve crops, soil and livestock so farms produce more food sustainably.", where: "Research councils, farms, seed and fertiliser companies", routes: ["university"], study: "BSc Agriculture (4 years)", subjects: "Life Sciences, Mathematics, Physical Sciences" },
  { name: "Farmer / farm manager", emoji: "🚜", area: "land", what: "Grow crops or raise animals and run the farm as a business.", where: "Own or family farm, commercial farms, co-operatives", routes: ["college", "workplace", "university"], study: "Diploma in Agriculture at an agricultural college, or learn on the job", subjects: "Life Sciences, Agricultural Sciences, Mathematics" },
  { name: "Veterinarian", emoji: "🐄", area: "land", what: "Prevent and treat disease in pets, farm animals and wildlife.", where: "Vet practices, farms, game reserves, state vet services", routes: ["university"], study: "BVSc at the University of Pretoria (Onderstepoort) – South Africa's veterinary faculty", subjects: "Life Sciences, Physical Sciences, Mathematics (high marks)" },
  { name: "Animal health technician", emoji: "💉", area: "land", what: "Vaccinate and treat farm animals and advise farmers.", where: "State veterinary services, co-operatives, farms", routes: ["university", "college"], study: "Diploma in Animal Health (3 years)", subjects: "Life Sciences, Mathematics" },
  { name: "Food scientist / technologist", emoji: "🥫", area: "lab", what: "Develop new foods, test food safety and quality.", where: "Food factories, labs, supermarkets' quality control", routes: ["university"], study: "BSc Food Science or Diploma in Food Technology", subjects: "Life Sciences, Physical Sciences, Mathematics" },
  { name: "Field guide", emoji: "🦁", area: "nature", what: "Lead tourists on game drives and walks and teach them about nature.", where: "Game reserves and lodges", routes: ["workplace", "college"], study: "Accredited field-guide qualification (e.g. through FGASA) and on-the-job training", subjects: "Life Sciences, Geography, English" },
  { name: "Nature conservation officer / ranger", emoji: "🦏", area: "nature", what: "Protect wildlife and habitats, fight poaching, manage reserves.", where: "SANParks, provincial parks, private reserves", routes: ["university", "college"], study: "Diploma or Degree in Nature Conservation", subjects: "Life Sciences, Geography, Mathematics" },
  { name: "Environmental officer", emoji: "🌍", area: "nature", what: "Check that mines, factories and building projects don't harm the environment.", where: "Government, mines, consulting companies", routes: ["university"], study: "BSc Environmental Science / Management", subjects: "Life Sciences, Geography, Mathematics" },
  { name: "Horticulturist / landscaper", emoji: "🌻", area: "nature", what: "Grow and care for plants in nurseries, parks and gardens.", where: "Nurseries, municipalities, botanical gardens", routes: ["college", "workplace"], study: "TVET qualification, learnership or Diploma in Horticulture", subjects: "Life Sciences helpful" },
  { name: "Marine biologist", emoji: "🐋", area: "nature", what: "Study ocean life – fisheries, seabirds, sharks and coral.", where: "Research institutes, universities, aquariums", routes: ["university"], study: "BSc then Honours and Master's", subjects: "Life Sciences, Mathematics, Physical Sciences" },
  { name: "Medical technologist", emoji: "🧪", area: "lab", what: "Test blood and tissue samples so doctors can diagnose disease.", where: "Hospital and pathology laboratories (e.g. NHLS)", routes: ["university"], study: "Bachelor of Health Sciences in Medical Laboratory Science (4 years)", subjects: "Life Sciences, Physical Sciences, Mathematics" },
  { name: "Laboratory assistant", emoji: "⚗️", area: "lab", what: "Prepare samples and equipment and do routine tests.", where: "Labs in hospitals, mines, food and water companies", routes: ["college", "workplace"], study: "TVET qualification or learnership", subjects: "Life Sciences, Physical Sciences" },
  { name: "Forensic scientist", emoji: "🔍", area: "lab", what: "Analyse DNA, blood and other evidence from crime scenes.", where: "SAPS Forensic Science Laboratories, private labs", routes: ["university"], study: "BSc (e.g. Genetics, Chemistry or Biochemistry), then specialised training", subjects: "Life Sciences, Physical Sciences, Mathematics" },
  { name: "Biotechnologist", emoji: "🧬", area: "lab", what: "Use living cells and DNA to make medicines, vaccines, biofuels and better crops.", where: "Research councils, vaccine and pharmaceutical companies", routes: ["university"], study: "BSc Biotechnology, Microbiology or Biochemistry", subjects: "Life Sciences, Physical Sciences, Mathematics" },
  { name: "Life Sciences teacher", emoji: "👩🏽‍🏫", area: "people", what: "Teach the next generation – and make biology click for them.", where: "Schools", routes: ["university"], study: "BEd (4 years) or a degree + PGCE (Funza Lushaka bursaries exist for teachers)", subjects: "Life Sciences, plus a second teaching subject" },
];

const QUESTIONS: { q: string; options: { text: string; area: Area }[] }[] = [
  { q: "Which school project sounds most fun?", options: [{ text: "Taking pulse rates before and after exercise", area: "health" }, { text: "Growing beans with different fertilisers", area: "land" }, { text: "Testing which yoghurt has the most bacteria", area: "lab" }, { text: "Counting birds and insects in a nature reserve", area: "nature" }, { text: "Teaching younger kids about handwashing", area: "people" }] },
  { q: "Where would you rather work?", options: [{ text: "In a clinic or hospital", area: "health" }, { text: "On a farm", area: "land" }, { text: "In a laboratory", area: "lab" }, { text: "Outdoors in the bush or at sea", area: "nature" }, { text: "In a school or community", area: "people" }] },
  { q: "Which would make you proudest?", options: [{ text: "Saving someone's life", area: "health" }, { text: "Feeding my community", area: "land" }, { text: "Discovering a new medicine", area: "lab" }, { text: "Saving a species from extinction", area: "nature" }, { text: "Helping a learner pass matric", area: "people" }] },
  { q: "Which Life Sciences topic do you enjoy most?", options: [{ text: "The human body", area: "health" }, { text: "Plants and photosynthesis", area: "land" }, { text: "DNA and genetics", area: "lab" }, { text: "Ecology and evolution", area: "nature" }, { text: "All of it – I like explaining it", area: "people" }] },
];

const AREA_NAMES: Record<Area, string> = { health: "Health & care", land: "Farming & food", lab: "Lab & biotech", nature: "Nature & environment", people: "Teaching & people" };
const ROUTE_NAMES: Record<Route, string> = { university: "🎓 University", college: "🏫 College / TVET", workplace: "🛠️ Learnership / on the job" };

/**
 * Career explorer: a four-question interest quiz that suggests careers, and a
 * searchable list of Life Sciences careers with the study route to each one.
 */
export function CareerExplorer() {
  const touch = useToolUse();
  const [mode, setMode] = useState<"quiz" | "browse">("quiz");
  const [answers, setAnswers] = useState<Area[]>([]);
  const [route, setRoute] = useState<Route | "all">("all");
  const [area, setArea] = useState<Area | "all">("all");
  const [q, setQ] = useState("");
  const done = answers.length === QUESTIONS.length;
  const top = useMemo(() => {
    const count = answers.reduce<Record<string, number>>((m, a) => ({ ...m, [a]: (m[a] ?? 0) + 1 }), {});
    return (Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "health") as Area;
  }, [answers]);
  const list = (mode === "quiz" ? CAREERS.filter((c) => c.area === top) : CAREERS.filter((c) => (area === "all" || c.area === area) && (route === "all" || c.routes.includes(route)) && (!q || `${c.name} ${c.what}`.toLowerCase().includes(q.toLowerCase()))));

  return (
    <WidgetFrame title="Career explorer" colour="var(--t-career)" instruction={mode === "quiz" ? "Answer four quick questions to find careers that fit you." : "Filter by area and by how you'd like to study."}>
      <Segmented colour="var(--t-career)" value={mode} onChange={(m) => { touch(); setMode(m); }} options={[{ id: "quiz", label: "Find my fit" }, { id: "browse", label: "Browse all careers" }]} />
      {mode === "quiz" && !done && (
        <div className="mt-4">
          <div className="text-xs font-bold text-muted uppercase">Question {answers.length + 1} of {QUESTIONS.length}</div>
          <p className="mt-1 font-display text-lg font-bold">{QUESTIONS[answers.length].q}</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {QUESTIONS[answers.length].options.map((o) => <button key={o.text} onClick={() => { touch(); setAnswers((a) => [...a, o.area]); }} className="rounded-xl border-2 border-line px-3 py-2 text-left text-sm hover:border-career/60">{o.text}</button>)}
          </div>
        </div>
      )}
      {mode === "quiz" && done && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <p className="text-sm">Your strongest match: <strong className="text-career">{AREA_NAMES[top]}</strong></p>
          <Button size="sm" variant="ghost" onClick={() => setAnswers([])}><RotateCcw className="h-4 w-4" /> Redo</Button>
        </div>
      )}
      {mode === "browse" && (
        <div className="mt-4 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {(["all", "health", "land", "lab", "nature", "people"] as const).map((a) => <button key={a} onClick={() => setArea(a)} aria-pressed={area === a} className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold", area === a ? "border-career bg-career text-white" : "border-line text-muted")}>{a === "all" ? "All areas" : AREA_NAMES[a]}</button>)}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["all", "university", "college", "workplace"] as const).map((r) => <button key={r} onClick={() => setRoute(r)} aria-pressed={route === r} className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold", route === r ? "border-career bg-career text-white" : "border-line text-muted")}>{r === "all" ? "Any route" : ROUTE_NAMES[r]}</button>)}
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-1.5"><Search className="h-4 w-4 text-muted" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search careers…" className="w-full bg-transparent text-sm outline-none" aria-label="Search careers" /></label>
        </div>
      )}
      {(mode === "browse" || done) && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {list.map((c) => (
            <article key={c.name} className="rounded-2xl border border-line bg-surface p-4">
              <h4 className="font-display text-lg font-bold">{c.emoji} {c.name}</h4>
              <p className="text-sm">{c.what}</p>
              <p className="mt-1 text-xs text-muted"><strong>Where:</strong> {c.where}</p>
              <p className="mt-1 text-xs text-muted"><strong>How:</strong> {c.study}</p>
              <p className="mt-1 text-xs text-muted"><strong>Subjects:</strong> {c.subjects}</p>
              <div className="mt-2 flex flex-wrap gap-1">{c.routes.map((r) => <span key={r} className="rounded-full bg-career/10 px-2 py-0.5 text-[11px] font-semibold text-career">{ROUTE_NAMES[r]}</span>)}</div>
            </article>
          ))}
          {list.length === 0 && <p className="text-sm text-muted">No careers match – try another filter.</p>}
        </div>
      )}
      <Explain colour="var(--t-career)">There is more than one road into most careers. If your marks aren&apos;t high enough for a degree yet, a <strong>higher certificate or diploma</strong> at a university of technology or TVET college, or a <strong>learnership</strong>, can be a stepping stone. Requirements change every year – always check the latest prospectus.</Explain>
    </WidgetFrame>
  );
}
