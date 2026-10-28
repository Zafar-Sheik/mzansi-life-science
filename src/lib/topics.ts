import type { Grade, Paper, Strand, Topic } from "@/content/types";

/** Every knowledge area has ONE colour across the whole site (see docs/06-design-system.md). */
export const STRANDS: { strand: Strand; colour: string; emoji: string; slug: string; short: string; blurb: string }[] = [
  { strand: "Cells & Genetics", colour: "var(--t-cell)", emoji: "🧬", slug: "cells-genetics", short: "Genetics", blurb: "DNA, RNA and protein synthesis, meiosis, and genetics and inheritance – the code of life and how it is passed on." },
  { strand: "Energy for Life", colour: "var(--t-energy)", emoji: "☀️", slug: "energy", short: "Energy", blurb: "Photosynthesis, animal nutrition, cellular respiration, gaseous exchange and excretion – how living things get, use and clean up after energy." },
  { strand: "Reproduction & Response", colour: "var(--t-body)", emoji: "🧠", slug: "reproduction-response", short: "Body", blurb: "Reproduction in vertebrates and humans, the nervous system, the eye and ear, hormones, homeostasis and how plants respond." },
  { strand: "Diversity & Evolution", colour: "var(--t-diversity)", emoji: "🦎", slug: "diversity-evolution", short: "Diversity", blurb: "Microorganisms, plant and animal diversity, evolution by natural selection, speciation and human evolution." },
  { strand: "Environmental Studies", colour: "var(--t-eco)", emoji: "🌍", slug: "environment", short: "Environment", blurb: "Population ecology and our impact on the atmosphere, water, food security, biodiversity and waste." },
  { strand: "Science Skills", colour: "var(--t-skills)", emoji: "🔬", slug: "skills", short: "Skills", blurb: "Investigations, hypotheses and variables, tables and graphs, biological drawings and microscope calculations – marks in every paper." },
  { strand: "Careers", colour: "var(--t-career)", emoji: "💼", slug: "careers", short: "Careers", blurb: "Where Life Sciences can take you: health, farming and nature, the lab – and the routes to get there after matric." },
  { strand: "Everyday Biology", colour: "var(--t-daily)", emoji: "🏡", slug: "everyday", short: "Everyday", blurb: "Biology you can use today: eating well on a budget, germs and medicines, sexual health, first aid, your brain, growing food and safe water." },
];

export interface TopicMeta {
  topic: Topic;
  grade: Grade;
  strand: Strand;
  title: string;
  emoji: string;
  slug: string;
  blurb: string;
  colour: string;
  /** 1 or 2 for the NSC papers, 3 for skills examined in both papers, 0 for careers and everyday biology (not examined). */
  paper: Paper;
}

const T = (topic: Topic, grade: Grade, strand: Strand, paper: Paper, title: string, emoji: string, blurb: string): TopicMeta => {
  const s = STRANDS.find((x) => x.strand === strand)!;
  return { topic, grade, strand, title, emoji, slug: topic, blurb, colour: s.colour, paper };
};

/** All CAPS Grade 11 and 12 Life Sciences topics (in teaching order), then skills, careers and everyday biology. */
export const TOPICS: TopicMeta[] = [
  // ------------------------------------------------------------- Grade 11
  T("g11-microorganisms", 11, "Diversity & Evolution", 1, "Microorganisms & Immunity", "🦠", "Viruses, bacteria, protists and fungi, the diseases they cause, how they help us, and how the immune system fights back."),
  T("g11-plants", 11, "Diversity & Evolution", 1, "Plant Diversity & Reproduction", "🌸", "Bryophytes, ferns, gymnosperms and angiosperms, alternation of generations, flowers, pollination, seeds and seed banks."),
  T("g11-animals", 11, "Diversity & Evolution", 1, "Animal Diversity", "🐙", "Body plans: symmetry, germ layers, body cavities and gut openings in the six animal phyla."),
  T("g11-population", 11, "Environmental Studies", 1, "Population Ecology", "🦓", "Population size and growth, mark–recapture and quadrats, predation, competition, symbiosis and succession."),
  T("g11-human-impact", 11, "Environmental Studies", 1, "Human Impact on the Environment", "🏭", "Climate change, ozone, water, food security, loss of biodiversity, alien species and solid waste – in South Africa."),
  T("g11-photosynthesis", 11, "Energy for Life", 2, "Photosynthesis", "🌿", "The light and dark phases, limiting factors, investigations, and using the knowledge in greenhouses."),
  T("g11-nutrition", 11, "Energy for Life", 2, "Animal Nutrition", "🍲", "Dentition, the human digestive system, digestion and absorption, the liver, blood sugar and a balanced diet."),
  T("g11-respiration", 11, "Energy for Life", 2, "Cellular Respiration", "⚡", "Aerobic respiration (glycolysis, Krebs cycle, oxidative phosphorylation), anaerobic respiration and fermentation."),
  T("g11-gas-exchange", 11, "Energy for Life", 2, "Gaseous Exchange", "🫁", "The human breathing system, breathing mechanism, gas exchange in the alveoli, transport of gases and breathing control."),
  T("g11-excretion", 11, "Energy for Life", 2, "Excretion in Humans", "🫘", "The urinary system, the nephron, urine formation, osmoregulation (ADH), salt and pH balance, and kidney diseases."),
  // ------------------------------------------------------------- Grade 12
  T("g12-dna", 12, "Cells & Genetics", 2, "DNA: The Code of Life", "🧬", "DNA and RNA structure, DNA replication, DNA profiling and protein synthesis (transcription and translation)."),
  T("g12-meiosis", 12, "Cells & Genetics", 2, "Meiosis", "✂️", "The phases of meiosis, crossing over, the importance of meiosis, non-disjunction and Down syndrome."),
  T("g12-genetics", 12, "Cells & Genetics", 2, "Genetics & Inheritance", "🧪", "Monohybrid and dihybrid crosses, dominance, blood groups, sex determination, sex-linked disorders, pedigrees, mutations and genetic engineering."),
  T("g12-vertebrate-repro", 12, "Reproduction & Response", 1, "Reproduction in Vertebrates", "🥚", "Internal and external fertilisation, ovipary, ovovivipary and vivipary, the amniotic egg, and precocial and altricial development."),
  T("g12-human-repro", 12, "Reproduction & Response", 1, "Human Reproduction", "👶", "The reproductive systems, puberty, gametogenesis, the menstrual cycle, fertilisation, implantation, the placenta and pregnancy."),
  T("g12-nervous", 12, "Reproduction & Response", 1, "The Nervous System", "🧠", "The CNS and PNS, the brain, neurons, the reflex arc, the autonomic nervous system and disorders."),
  T("g12-senses", 12, "Reproduction & Response", 1, "The Eye & the Ear", "👁️", "The structure and function of the eye and the ear, accommodation, the pupil reflex, hearing, balance and their disorders."),
  T("g12-endocrine", 12, "Reproduction & Response", 1, "The Endocrine System", "💉", "Glands, hormones and their functions, and the endocrine system compared with the nervous system."),
  T("g12-homeostasis", 12, "Reproduction & Response", 1, "Homeostasis", "🌡️", "Negative feedback: blood glucose, water and salt balance, carbon dioxide levels and body temperature."),
  T("g12-plant-responses", 12, "Reproduction & Response", 1, "Plant Responses", "🌱", "Plant hormones (auxins, gibberellins, abscisic acid), phototropism and geotropism, and how plants defend themselves."),
  T("g12-evolution", 12, "Diversity & Evolution", 2, "Evolution by Natural Selection", "🦒", "Evidence for evolution, variation, Lamarck, Darwin and punctuated equilibrium, artificial selection, speciation and evolution in action."),
  T("g12-human-evolution", 12, "Diversity & Evolution", 2, "Human Evolution", "🦴", "Humans as primates, bipedalism, the fossil record of the Cradle of Humankind, and the Out of Africa hypothesis."),
  // ------------------------------------------------------------- Skills
  T("skills-investigation", 11, "Science Skills", 3, "Scientific Skills", "🔬", "Hypotheses, variables, fair tests, reliability and validity, tables, graphs, biological drawings and calculations – for both grades and both papers."),
  // ------------------------------------------------------------- Careers & vocational
  T("career-health", 12, "Careers", 0, "Health & Care Careers", "🩺", "Nursing, pharmacy, radiography, physiotherapy, dietetics, emergency care, community health work and more."),
  T("career-land", 12, "Careers", 0, "Farming, Food & Nature Careers", "🚜", "Agriculture, animal health, food science, conservation, field guiding, forestry and environmental work."),
  T("career-lab", 12, "Careers", 0, "Lab, Biotech & Forensics Careers", "🧫", "Laboratory technicians, medical technologists, biotechnologists, forensic scientists and researchers."),
  T("career-pathways", 12, "Careers", 0, "Your Path After Matric", "🧭", "APS scores, university, TVET colleges and learnerships, bursaries and NSFAS, and skills employers want."),
  // ------------------------------------------------------------- Everyday biology
  T("daily-nutrition", 11, "Everyday Biology", 0, "Eat Well, Spend Less", "🥗", "Balanced meals on a budget, reading food labels, sugar and salt, and food safety at home."),
  T("daily-germs", 11, "Everyday Biology", 0, "Germs, Vaccines & Medicines", "🧼", "Handwashing, HIV and TB, how vaccines work, antibiotics and resistance, and spotting health myths."),
  T("daily-sexual-health", 12, "Everyday Biology", 0, "Sexual & Reproductive Health", "💗", "Consent, contraception, STIs, HIV prevention (PrEP and PEP), pregnancy and where to get help."),
  T("daily-first-aid", 11, "Everyday Biology", 0, "First Aid That Saves Lives", "🚑", "DRSABC, CPR, choking, bleeding, burns, fits, snakebite and when to call 10177 or 112."),
  T("daily-mind", 12, "Everyday Biology", 0, "Brain, Sleep, Stress & Substances", "😴", "How sleep, stress, alcohol, nicotine and drugs affect your nervous system – and how to look after your mind."),
  T("daily-garden", 11, "Everyday Biology", 0, "Grow Your Own Food", "🥕", "Soil, compost, planting seeds, water-wise gardening, companion planting and keeping pests away naturally."),
  T("daily-water", 12, "Everyday Biology", 0, "Safe Water & a Healthy Home", "🚰", "Making water safe to drink, saving water and electricity, reducing waste and recycling – at home."),
];

export function topicMeta(t: Topic): TopicMeta {
  return TOPICS.find((x) => x.topic === t)!;
}

export function strandMeta(s: Strand) {
  return STRANDS.find((x) => x.strand === s)!;
}

/** True for careers and everyday-biology topics (not examined). */
export const isLife = (t: Topic) => t.startsWith("career-") || t.startsWith("daily-");
export const isCareer = (t: Topic) => t.startsWith("career-");
export const isDaily = (t: Topic) => t.startsWith("daily-");

export function paperLabel(p: Paper) {
  return p === 1 ? "Paper 1" : p === 2 ? "Paper 2" : p === 3 ? "Paper 1 & 2 · skills" : "For life · not examined";
}

export function paperShort(p: Paper) {
  return p === 0 ? "For life" : p === 3 ? "Both papers" : `Paper ${p}`;
}

/** Short label used on chips, e.g. "Gr 11 · Photosynthesis" or "Careers · Health & Care Careers". */
export function topicLabel(t: Topic) {
  const m = topicMeta(t);
  if (m.paper === 0) return `${m.strand} · ${m.title}`;
  if (m.paper === 3) return `Gr 11 & 12 · ${m.title}`;
  return `Gr ${m.grade} · ${m.title}`;
}

/** Short grade label: "Gr 11", "Gr 11 & 12" for skills, or the area name for topics that aren't examined. */
export function gradeLabel(t: Topic) {
  const m = topicMeta(t);
  return m.paper === 0 ? m.strand : m.paper === 3 ? "Gr 11 & 12" : `Gr ${m.grade}`;
}

/** Does this topic belong in a grade filter? Skills, careers and everyday biology show in both grades. */
export const inGrade = (t: Topic, g: Grade | null) => !g || topicMeta(t).grade === g || topicMeta(t).paper === 0 || topicMeta(t).paper === 3;

export interface PaperSpec {
  title: string;
  duration: string;
  marks: number;
  sections: { name: string; marks: number }[];
}

/**
 * Final-exam papers per grade with the approximate weighting of each topic
 * (DBE Life Sciences examination guidelines; the weightings move a little
 * from year to year and some provinces split Grade 11 differently – always
 * check the latest guidelines and your school's Annual Teaching Plan).
 * Every paper: Section A 50 marks (multiple choice, terminology, matching,
 * short questions), Section B 100 marks (two questions of 50).
 */
export const PAPER_INFO: Record<Grade, Record<1 | 2, PaperSpec>> = {
  11: {
    1: {
      title: "Paper 1 – Diversity & Environment",
      duration: "2½ hours",
      marks: 150,
      sections: [
        { name: "Microorganisms & immunity", marks: 30 },
        { name: "Plant diversity & reproduction", marks: 30 },
        { name: "Animal diversity", marks: 25 },
        { name: "Population ecology", marks: 35 },
        { name: "Human impact on the environment", marks: 30 },
      ],
    },
    2: {
      title: "Paper 2 – Energy & Life Processes",
      duration: "2½ hours",
      marks: 150,
      sections: [
        { name: "Photosynthesis", marks: 30 },
        { name: "Animal nutrition", marks: 35 },
        { name: "Cellular respiration", marks: 25 },
        { name: "Gaseous exchange", marks: 30 },
        { name: "Excretion in humans", marks: 30 },
      ],
    },
  },
  12: {
    1: {
      title: "Paper 1 – Reproduction & Responding",
      duration: "2½ hours",
      marks: 150,
      sections: [
        { name: "Reproduction in vertebrates", marks: 8 },
        { name: "Human reproduction", marks: 41 },
        { name: "Nervous system, eye & ear", marks: 45 },
        { name: "Endocrine system", marks: 24 },
        { name: "Homeostasis", marks: 16 },
        { name: "Plant responses", marks: 16 },
      ],
    },
    2: {
      title: "Paper 2 – Genetics & Evolution",
      duration: "2½ hours",
      marks: 150,
      sections: [
        { name: "DNA: the code of life", marks: 27 },
        { name: "Meiosis", marks: 21 },
        { name: "Genetics & inheritance", marks: 48 },
        { name: "Evolution (incl. human evolution)", marks: 54 },
      ],
    },
  },
};

/** Topic groups for pickers: the two grades, then the topics that belong to both. */
export const TOPIC_GROUPS: { label: string; short: string; has: (t: TopicMeta) => boolean }[] = [
  { label: "Grade 11", short: "Grade 11 only", has: (t) => t.grade === 11 && (t.paper === 1 || t.paper === 2) },
  { label: "Grade 12", short: "Grade 12 only", has: (t) => t.grade === 12 && (t.paper === 1 || t.paper === 2) },
  { label: "Skills, careers & everyday biology", short: "Skills & life only", has: (t) => t.paper === 0 || t.paper === 3 },
];
