import type { DiagramId, Grade, Strand, Topic, WidgetName } from "@/content/types";

export interface CatalogueEntry {
  name: WidgetName;
  title: string;
  topic: Topic;
  /** Where the tool lives in the Labs, Everyday and Careers pages. */
  area: Strand;
  description: string;
  emoji: string;
  /** Other grades the tool is useful for. */
  grades?: Grade[];
  props?: Record<string, unknown>;
}

const diagram = (diagram: DiagramId, title: string, topic: Topic, area: Strand, emoji: string, description: string): CatalogueEntry => ({ name: "diagram", title, topic, area, emoji, description, props: { diagram } });

/** Every interactive lab, diagram and tool, used by the Labs, Everyday and Careers pages and the docs. */
export const WIDGET_CATALOGUE: CatalogueEntry[] = [
  // Cells & genetics
  { name: "dna-lab", title: "DNA & protein synthesis lab", topic: "g12-dna", area: "Cells & Genetics", emoji: "🧬", description: "Replicate, transcribe and translate a strand base by base – then mutate it and watch the protein change." },
  { name: "meiosis-lab", title: "Meiosis step by step", topic: "g12-meiosis", area: "Cells & Genetics", emoji: "✂️", description: "Nine phases with maternal and paternal chromosomes, crossing over and non-disjunction." },
  { name: "punnett-lab", title: "Punnett square lab", topic: "g12-genetics", area: "Cells & Genetics", emoji: "🧪", description: "Monohybrid, incomplete and co-dominance, blood groups, sex-linked and dihybrid crosses – predict, then reveal." },
  { name: "pedigree-lab", title: "Pedigree reader", topic: "g12-genetics", area: "Cells & Genetics", emoji: "🌳", description: "Work out everyone's genotype in albinism, haemophilia and dimples pedigrees." },
  { name: "drill", title: "Endless genetics & DNA drill", topic: "g12-genetics", area: "Cells & Genetics", emoji: "♾️", props: { generators: ["dna-complement", "dna-transcribe", "dna-anticodon", "dna-amino", "dna-chargaff", "meiosis-numbers", "meiosis-combinations", "mono-ratio", "mono-percent", "mono-parent", "gametes", "dihybrid", "blood-groups", "sex-linked"], title: "Genetics & DNA drill" }, description: "Fresh crosses, base-pairing, codon and meiosis questions every time." },
  diagram("nucleotide", "DNA structure diagram", "g12-dna", "Cells & Genetics", "🪜", "Nucleotides, base pairs, hydrogen bonds and the sugar–phosphate backbone."),
  // Energy for life
  { name: "photosynthesis-lab", title: "Photosynthesis: limiting factors", topic: "g11-photosynthesis", area: "Energy for Life", emoji: "🌿", description: "Pondweed under a lamp: change light, CO₂ and temperature and count the bubbles." },
  { name: "respiration-lab", title: "Cellular respiration lab", topic: "g11-respiration", area: "Energy for Life", emoji: "⚡", description: "Aerobic vs anaerobic pathways and ATP, a yeast experiment, and lactic acid during exercise." },
  diagram("chloroplast", "Chloroplast diagram", "g11-photosynthesis", "Energy for Life", "🍃", "Grana, stroma, lamellae and starch – where each phase happens."),
  diagram("leaf", "Leaf cross-section", "g11-photosynthesis", "Energy for Life", "🍂", "Cuticle, palisade and spongy mesophyll, veins and stomata."),
  diagram("mitochondrion", "Mitochondrion diagram", "g11-respiration", "Energy for Life", "🔋", "Outer membrane, cristae and matrix."),
  diagram("digestive", "Digestive system diagram", "g11-nutrition", "Energy for Life", "🍲", "From the mouth to the anus – tap every organ."),
  diagram("alveolus", "Alveolus diagram", "g11-gas-exchange", "Energy for Life", "🫁", "How the alveolus is adapted for gaseous exchange."),
  diagram("kidney", "Kidney diagram", "g11-excretion", "Energy for Life", "🫘", "Cortex, medulla, pelvis, ureter and blood vessels."),
  diagram("nephron", "Nephron diagram", "g11-excretion", "Energy for Life", "🧫", "Ultrafiltration, reabsorption and secretion along the nephron."),
  { name: "drill", title: "Grade 11 terminology drill", topic: "g11-nutrition", area: "Energy for Life", emoji: "📝", props: { generators: ["terms-g11-microorganisms", "terms-g11-plants", "terms-g11-animals", "terms-g11-photosynthesis", "terms-g11-nutrition", "terms-g11-respiration", "terms-g11-gas-exchange", "terms-g11-excretion", "terms-g11-population", "terms-g11-human-impact"], title: "Grade 11 biological terms" }, description: "Section A practice: the correct biological term for every Grade 11 topic." },
  // Reproduction & response
  { name: "cycle-lab", title: "The menstrual cycle", topic: "g12-human-repro", area: "Reproduction & Response", emoji: "📅", description: "Drag through 28 days: FSH, LH, oestrogen, progesterone, the ovary and the endometrium." },
  { name: "eye-lab", title: "The eye in action", topic: "g12-senses", area: "Reproduction & Response", emoji: "👁️", description: "Accommodation, the pupil reflex and eye defects with their corrections." },
  { name: "homeostasis-lab", title: "Homeostasis lab", topic: "g12-homeostasis", area: "Reproduction & Response", emoji: "🌡️", description: "Negative feedback for blood glucose, body temperature and water balance (ADH)." },
  diagram("eye", "Eye diagram", "g12-senses", "Reproduction & Response", "👁️", "Every part of the eye – explore, then find it and name it."),
  diagram("ear", "Ear diagram", "g12-senses", "Reproduction & Response", "👂", "Outer, middle and inner ear: hearing and balance."),
  diagram("brain", "Brain diagram", "g12-nervous", "Reproduction & Response", "🧠", "Cerebrum, cerebellum, medulla oblongata, corpus callosum, hypothalamus, pituitary."),
  diagram("neuron", "Neuron diagram", "g12-nervous", "Reproduction & Response", "〰️", "Dendrites, cell body, axon, myelin sheath and nodes of Ranvier."),
  diagram("reflex-arc", "Reflex arc diagram", "g12-nervous", "Reproduction & Response", "⚡", "Receptor → sensory neuron → interneuron → motor neuron → effector."),
  diagram("female-repro", "Female reproductive system", "g12-human-repro", "Reproduction & Response", "♀️", "Ovaries, Fallopian tubes, uterus, endometrium, cervix and vagina."),
  diagram("male-repro", "Male reproductive system", "g12-human-repro", "Reproduction & Response", "♂️", "Testes, epididymis, sperm duct, glands, urethra and penis."),
  diagram("sperm", "Sperm cell diagram", "g12-human-repro", "Reproduction & Response", "🏊", "Acrosome, nucleus, middle piece and tail."),
  diagram("amniotic-egg", "Amniotic egg diagram", "g12-vertebrate-repro", "Reproduction & Response", "🥚", "Shell, amnion, chorion, allantois, yolk sac and albumen."),
  { name: "drill", title: "Grade 12 terminology drill", topic: "g12-endocrine", area: "Reproduction & Response", emoji: "📝", props: { generators: ["terms-g12-dna", "terms-g12-meiosis", "terms-g12-genetics", "terms-g12-vertebrate-repro", "terms-g12-human-repro", "terms-g12-nervous", "terms-g12-senses", "terms-g12-endocrine", "terms-g12-homeostasis", "terms-g12-plant-responses", "terms-g12-evolution", "terms-g12-human-evolution"], title: "Grade 12 biological terms" }, description: "Section A practice: the correct biological term for every Grade 12 topic." },
  // Diversity & evolution
  { name: "selection-lab", title: "Natural selection lab", topic: "g12-evolution", area: "Diversity & Evolution", emoji: "🪲", description: "Be the bird: eat the beetles you can see, then watch the population evolve." },
  diagram("flower", "Flower diagram", "g11-plants", "Diversity & Evolution", "🌸", "Sepals, petals, stamens and carpels."),
  diagram("virus", "Virus diagram", "g11-microorganisms", "Diversity & Evolution", "🦠", "Capsid, genetic material, envelope and spikes."),
  diagram("bacterium", "Bacterium diagram", "g11-microorganisms", "Diversity & Evolution", "🧫", "A prokaryotic cell: no nucleus, a plasmid and a flagellum."),
  // Environment
  { name: "population-lab", title: "Population ecology lab", topic: "g11-population", area: "Environmental Studies", emoji: "🐟", description: "Mark–recapture a pond of fish, then explore J- and S-shaped growth and predator–prey cycles." },
  { name: "footprint-lab", title: "Water & carbon footprint", topic: "g11-human-impact", area: "Environmental Studies", emoji: "👣", grades: [11, 12], description: "Work out your household's water use and carbon footprint – and what to change first." },
  { name: "drill", title: "Population maths drill", topic: "g11-population", area: "Environmental Studies", emoji: "🧮", props: { generators: ["mark-recapture", "quadrat"], title: "Population estimates" }, description: "Endless mark–recapture and quadrat calculations." },
  // Skills
  { name: "investigation-planner", title: "Investigation planner", topic: "skills-investigation", area: "Science Skills", emoji: "📋", grades: [11, 12], description: "Sort the variables, choose the hypothesis, make it reliable and valid." },
  { name: "graph-lab", title: "Graph lab", topic: "skills-investigation", area: "Science Skills", emoji: "📈", grades: [11, 12], description: "Line, bar, histogram or pie? Earn all 6 rubric marks." },
  { name: "microscope-lab", title: "Microscope & magnification", topic: "skills-investigation", area: "Science Skills", emoji: "🔬", grades: [11, 12], description: "Change lenses, see the view, and calculate actual size in µm." },
  { name: "drill", title: "Skills calculations drill", topic: "skills-investigation", area: "Science Skills", emoji: "➗", grades: [11, 12], props: { generators: ["magnification", "percent-change"], title: "Skills calculations" }, description: "Magnification, actual size and percentage change." },
  // Everyday biology
  { name: "plate-builder", title: "Budget plate & food labels", topic: "daily-nutrition", area: "Everyday Biology", emoji: "🥗", grades: [11, 12], description: "Build a balanced, affordable plate and decode food labels with traffic lights and teaspoons of sugar." },
  { name: "germ-lab", title: "Germ lab", topic: "daily-germs", area: "Everyday Biology", emoji: "🧼", grades: [11, 12], description: "Herd immunity, why you finish your antibiotics, and how clean your hands really are." },
  { name: "first-aid-sim", title: "First-aid trainer", topic: "daily-first-aid", area: "Everyday Biology", emoji: "🚑", grades: [11, 12], description: "Six emergencies step by step, plus a CPR rhythm trainer." },
  { name: "footprint-lab", title: "Save water at home", topic: "daily-water", area: "Everyday Biology", emoji: "🚰", grades: [11, 12], props: { mode: "water" }, description: "Find the biggest water savings in your home." },
  { name: "drill", title: "Food label maths", topic: "daily-nutrition", area: "Everyday Biology", emoji: "🏷️", grades: [11, 12], props: { generators: ["food-label"], title: "Food label maths" }, description: "Teaspoons of sugar and kilojoules per serving." },
  // Careers
  { name: "career-explorer", title: "Career explorer", topic: "career-health", area: "Careers", emoji: "🧭", grades: [11, 12], description: "Find careers that fit you – and the university, college or learnership route to each." },
  { name: "aps-calculator", title: "APS calculator", topic: "career-pathways", area: "Careers", emoji: "🎓", grades: [11, 12], description: "Your Admission Point Score and the NSC pass you are on track for." },
];

export const WIDGET_COUNT = new Set(WIDGET_CATALOGUE.map((w) => w.title)).size;
