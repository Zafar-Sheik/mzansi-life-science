/** Banks for the Games room: "This or That?" statements and "Who Am I?" riddles. */
import type { Topic } from "./types";

export interface DashItem {
  /** The statement shown to the learner. */
  s: string;
  /** The right choice and the decoy. */
  answer: string;
  other: string;
  why: string;
}

/** Quick two-way sorts – the classic "compare and contrast" pairs of the syllabus. */
export const DASH: DashItem[] = [
  { s: "Produces four haploid cells", answer: "meiosis", other: "mitosis", why: "Meiosis has two divisions and halves the chromosome number." },
  { s: "Produces two identical diploid cells", answer: "mitosis", other: "meiosis", why: "Mitosis copies a cell exactly – for growth and repair." },
  { s: "Crossing over happens", answer: "meiosis", other: "mitosis", why: "Crossing over happens in prophase I of meiosis." },
  { s: "Contains the sugar deoxyribose", answer: "DNA", other: "RNA", why: "DNA = deoxyribonucleic acid. RNA has ribose." },
  { s: "Contains uracil", answer: "RNA", other: "DNA", why: "RNA has U instead of T." },
  { s: "Double-stranded", answer: "DNA", other: "RNA", why: "DNA is a double helix; RNA is single-stranded." },
  { s: "Leaves the nucleus to go to the ribosome", answer: "mRNA", other: "DNA", why: "DNA never leaves the nucleus – mRNA carries the code out." },
  { s: "Happens in the stroma of the chloroplast", answer: "dark phase", other: "light phase", why: "The light phase happens on the grana (thylakoids)." },
  { s: "Water is split and oxygen is released", answer: "light phase", other: "dark phase", why: "Photolysis of water happens in the light phase." },
  { s: "Glucose is split into two pyruvate molecules", answer: "glycolysis", other: "Krebs cycle", why: "Glycolysis happens in the cytoplasm." },
  { s: "Takes place in the matrix of the mitochondrion", answer: "Krebs cycle", other: "glycolysis", why: "The Krebs cycle needs oxygen and happens in the matrix." },
  { s: "Yeast makes ethanol and CO₂", answer: "anaerobic", other: "aerobic", why: "Alcoholic fermentation happens without oxygen." },
  { s: "Produces the most ATP", answer: "aerobic", other: "anaerobic", why: "Aerobic respiration releases about 36–38 ATP per glucose." },
  { s: "Diaphragm contracts and flattens", answer: "inhalation", other: "exhalation", why: "The thorax gets bigger, pressure drops, air rushes in." },
  { s: "Intercostal muscles relax, ribs move down and in", answer: "exhalation", other: "inhalation", why: "The thorax gets smaller, pressure rises, air is pushed out." },
  { s: "Lowers blood glucose", answer: "insulin", other: "glucagon", why: "Insulin makes the liver convert glucose to glycogen." },
  { s: "Raises blood glucose", answer: "glucagon", other: "insulin", why: "Glucagon converts glycogen back to glucose." },
  { s: "Secreted when you are dehydrated", answer: "ADH", other: "aldosterone", why: "ADH makes the collecting ducts more permeable to water." },
  { s: "Increases the reabsorption of sodium", answer: "aldosterone", other: "ADH", why: "Aldosterone (from the adrenal cortex) controls salt balance." },
  { s: "Ciliary muscles contract, lens becomes more convex", answer: "near object", other: "distant object", why: "A rounder lens bends light more to focus a close object." },
  { s: "Suspensory ligaments are tight, lens is flat", answer: "distant object", other: "near object", why: "Ciliary muscles relax and the ligaments pull the lens thin." },
  { s: "Radial muscles of the iris contract, pupil widens", answer: "dim light", other: "bright light", why: "A wide pupil lets in more light." },
  { s: "Detects colour in bright light", answer: "cones", other: "rods", why: "Cones are concentrated in the yellow spot (fovea)." },
  { s: "Controls balance and coordination", answer: "cerebellum", other: "cerebrum", why: "The cerebellum coordinates movement and balance." },
  { s: "Controls heart rate and breathing", answer: "medulla oblongata", other: "cerebellum", why: "The medulla controls involuntary actions like breathing." },
  { s: "Carries impulses from receptors to the CNS", answer: "sensory neuron", other: "motor neuron", why: "Sensory = toward the CNS; motor = away to effectors." },
  { s: "Fast, short-lived response via impulses", answer: "nervous system", other: "endocrine system", why: "Hormones are slower but last longer." },
  { s: "Slow, long-lasting response via the blood", answer: "endocrine system", other: "nervous system", why: "Hormones travel in the blood to target organs." },
  { s: "Stem bends towards light", answer: "auxins", other: "abscisic acid", why: "Auxins move to the shaded side and make those cells elongate." },
  { s: "Closes stomata during drought", answer: "abscisic acid", other: "gibberellins", why: "Abscisic acid is the plant's 'stress hormone'." },
  { s: "Young are helpless and need lots of care", answer: "altricial", other: "precocial", why: "Like humans and many birds that hatch blind and naked." },
  { s: "Eggs are laid and hatch outside the mother", answer: "ovipary", other: "vivipary", why: "Ovi = egg, -pary = birth: birds and most reptiles." },
  { s: "Fertilisation in water, many eggs released", answer: "external fertilisation", other: "internal fertilisation", why: "Most fish and frogs – many eggs because most are lost." },
  { s: "Has a placenta", answer: "vivipary", other: "ovipary", why: "Viviparous young are fed through a placenta." },
  { s: "Released in the middle of the menstrual cycle to trigger ovulation", answer: "LH", other: "FSH", why: "An LH surge around day 14 releases the ovum." },
  { s: "Maintains the endometrium after ovulation", answer: "progesterone", other: "oestrogen", why: "Progesterone is made by the corpus luteum." },
  { s: "Both alleles show in the heterozygote (red and white hairs)", answer: "co-dominance", other: "incomplete dominance", why: "Roan cattle show both colours." },
  { s: "The heterozygote is a blend (pink flowers)", answer: "incomplete dominance", other: "co-dominance", why: "Red × white → pink: neither allele dominates." },
  { s: "One organism benefits, the other is harmed", answer: "parasitism", other: "commensalism", why: "Like ticks on cattle." },
  { s: "Both organisms benefit", answer: "mutualism", other: "commensalism", why: "Like oxpeckers and buffalo, or bees and flowers." },
  { s: "Competition between two different species", answer: "interspecific", other: "intraspecific", why: "Inter = between species. Intra = within one species." },
  { s: "Population growth with no limits – a J-curve", answer: "geometric growth", other: "logistic growth", why: "Logistic growth levels off at the carrying capacity – an S-curve." },
  { s: "Has no nucleus", answer: "bacteria", other: "fungi", why: "Bacteria are prokaryotes." },
  { s: "Cannot be killed by antibiotics", answer: "viruses", other: "bacteria", why: "Antibiotics target bacterial structures – viruses don't have them." },
  { s: "Three germ layers", answer: "triploblastic", other: "diploblastic", why: "Ecto-, meso- and endoderm. Cnidarians are diploblastic." },
  { s: "Same basic structure, different function (e.g. arm and wing)", answer: "homologous structures", other: "analogous structures", why: "Homologous structures suggest common ancestry." },
  { s: "Gradual change over very long periods", answer: "gradualism", other: "punctuated equilibrium", why: "Punctuated equilibrium = long stable periods + short bursts of change." },
  { s: "Larger brain, smaller jaws, no brow ridges", answer: "Homo sapiens", other: "Australopithecus", why: "Australopithecines had small brains and big jaws." },
  { s: "Long, narrow pelvis", answer: "African apes", other: "humans", why: "Humans have a short, wide pelvis for bipedal walking." },
  { s: "Gamete has 23 chromosomes", answer: "haploid", other: "diploid", why: "Human gametes are n = 23; body cells are 2n = 46." },
];

export interface Riddle {
  riddle: string;
  answer: string;
  topic: Topic;
}

/** "Who am I?" – a structure or organism describes itself. */
export const RIDDLES: Riddle[] = [
  { riddle: "I am a tiny air sac with walls one cell thick, wrapped in capillaries. Millions of me give your lungs a huge surface area.", answer: "alveolus", topic: "g11-gas-exchange" },
  { riddle: "I am a dome of muscle. When I contract I flatten, and air rushes into your lungs.", answer: "diaphragm", topic: "g11-gas-exchange" },
  { riddle: "I am a ball of capillaries inside Bowman's capsule. Blood is filtered through me under high pressure.", answer: "glomerulus", topic: "g11-excretion" },
  { riddle: "I am the functional unit of the kidney. You have about a million of me in each kidney.", answer: "nephron", topic: "g11-excretion" },
  { riddle: "I am a finger-like fold in your small intestine. My lacteal absorbs fats.", answer: "villus", topic: "g11-nutrition" },
  { riddle: "I make bile, store glycogen, break down alcohol and turn extra amino acids into urea.", answer: "liver", topic: "g11-nutrition" },
  { riddle: "I am the green pigment that traps light energy in the grana.", answer: "chlorophyll", topic: "g11-photosynthesis" },
  { riddle: "I am the powerhouse of the cell. The Krebs cycle happens in my matrix.", answer: "mitochondrion", topic: "g11-respiration" },
  { riddle: "I have a protein capsid and DNA or RNA inside. I can only reproduce inside your cells.", answer: "virus", topic: "g11-microorganisms" },
  { riddle: "I am a protist carried by the female Anopheles mosquito. I cause malaria.", answer: "Plasmodium", topic: "g11-microorganisms" },
  { riddle: "I am a fern. My spores are in sori under my fronds, and I need water for my sperm to swim.", answer: "pteridophyte", topic: "g11-plants" },
  { riddle: "I am a cnidarian, like a jellyfish. I have two germ layers and radial symmetry.", answer: "Cnidaria", topic: "g11-animals" },
  { riddle: "I am the maximum population size the environment can support. Populations level off at me.", answer: "carrying capacity", topic: "g11-population" },
  { riddle: "I am the rapid growth of algae when fertiliser washes into a dam. I use up the oxygen and fish die.", answer: "eutrophication", topic: "g11-human-impact" },
  { riddle: "I am made of a phosphate, a deoxyribose sugar and a nitrogenous base.", answer: "nucleotide", topic: "g12-dna" },
  { riddle: "I carry an amino acid to the ribosome and have an anticodon at one end.", answer: "tRNA", topic: "g12-dna" },
  { riddle: "I am the point where two non-sister chromatids cross over in prophase I.", answer: "chiasma", topic: "g12-meiosis" },
  { riddle: "I am the failure of chromosomes to separate in meiosis. I can cause Down syndrome.", answer: "non-disjunction", topic: "g12-meiosis" },
  { riddle: "I am a diagram that shows how a trait is inherited in a family. Circles are females, squares are males.", answer: "pedigree diagram", topic: "g12-genetics" },
  { riddle: "I am the cap on the head of a sperm cell, full of enzymes that dissolve a path into the ovum.", answer: "acrosome", topic: "g12-human-repro" },
  { riddle: "I form from the empty follicle after ovulation and I secrete progesterone.", answer: "corpus luteum", topic: "g12-human-repro" },
  { riddle: "I connect the foetus to the mother. Food and oxygen diffuse across me – but your blood and hers never mix.", answer: "placenta", topic: "g12-human-repro" },
  { riddle: "I am a membrane in the amniotic egg that stores nitrogenous waste.", answer: "allantois", topic: "g12-vertebrate-repro" },
  { riddle: "I am the gap between two neurons. Neurotransmitters carry the impulse across me.", answer: "synapse", topic: "g12-nervous" },
  { riddle: "I am a fatty layer around an axon. I insulate it and make impulses travel faster.", answer: "myelin sheath", topic: "g12-nervous" },
  { riddle: "I am the band of nerve fibres that connects the left and right cerebral hemispheres.", answer: "corpus callosum", topic: "g12-nervous" },
  { riddle: "I am the coiled, fluid-filled part of your inner ear. My hair cells turn vibrations into impulses.", answer: "cochlea", topic: "g12-senses" },
  { riddle: "I connect your middle ear to your throat and equalise the pressure on both sides of your eardrum.", answer: "Eustachian tube", topic: "g12-senses" },
  { riddle: "I am the part of the retina with the most cones – look straight at something and its image falls on me.", answer: "yellow spot", topic: "g12-senses" },
  { riddle: "I am the master gland. I sit under the hypothalamus and control many other glands.", answer: "pituitary gland", topic: "g12-endocrine" },
  { riddle: "I am a hormone made in the thyroid. I need iodine and I control your metabolic rate.", answer: "thyroxin", topic: "g12-endocrine" },
  { riddle: "I am the part of the brain that acts as your thermostat and makes ADH.", answer: "hypothalamus", topic: "g12-homeostasis" },
  { riddle: "I am the plant hormone that collects on the shaded side of a stem and makes it bend to the light.", answer: "auxin", topic: "g12-plant-responses" },
  { riddle: "I am the opening at the base of your skull. In humans I am right under the skull – a sign of walking upright.", answer: "foramen magnum", topic: "g12-human-evolution" },
  { riddle: "I am a fossil skull of a child found in a lime quarry in the North West in 1924. Raymond Dart described me.", answer: "Taung Child", topic: "g12-human-evolution" },
  { riddle: "I am the formation of a new species after a population is split by a river or mountain.", answer: "allopatric speciation", topic: "g12-evolution" },
];
