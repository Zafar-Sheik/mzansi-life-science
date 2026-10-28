/** Exam Room: NSC-style Grade 12 questions. Every memo line is ONE mark – the tests enforce it. */
import type { ExamQuestion } from "./types";

export const G12_EXAMS: ExamQuestion[] = [
  // ------------------------------------------------------------------ DNA
  {
    id: "g12-dna-structure", topic: "g12-dna", title: "DNA structure and replication", lesson: "dna-structure",
    figure: { widget: "diagram", props: { diagram: "nucleotide", mode: "quiz" } },
    parts: [
      { q: "Name the scientists who first described the double-helix structure of DNA.", marks: 2, level: "knowing", memo: ["Watson", "Crick"] },
      { q: "Name the THREE components of a DNA nucleotide.", marks: 3, level: "knowing", memo: ["Deoxyribose sugar", "Phosphate", "Nitrogenous base"] },
      { q: "Describe the process of DNA replication.", marks: 5, level: "knowing", memo: ["The DNA double helix unwinds", "and the weak hydrogen bonds break so the strands separate (unzip)", "Each strand acts as a template", "Free nucleotides attach to complementary bases (A–T, C–G)", "Two identical DNA molecules form"] },
      { q: "Explain why DNA replication is important.", marks: 2, level: "understanding", memo: ["So that the chromosome number/DNA is doubled before cell division", "and each new cell receives an identical copy of the genetic material"] },
    ],
  },
  {
    id: "g12-dna-protein", topic: "g12-dna", title: "Protein synthesis", lesson: "protein-synthesis",
    figure: { widget: "dna-lab", props: { stage: "translation" } },
    source: "Part of a DNA template strand: **TAC CTT GGA**\n\n| mRNA codon | Amino acid |\n|---|---|\n| AUG | Methionine |\n| GAA | Glutamic acid |\n| CCU | Proline |\n| GGA | Glycine |",
    parts: [
      { q: "Write down the mRNA sequence transcribed from this DNA strand.", marks: 2, level: "applying", memo: ["AUG GAA", "CCU"] },
      { q: "Give the tRNA anticodon for the second codon.", marks: 1, level: "applying", memo: ["CUU"] },
      { q: "Give the sequence of amino acids coded for.", marks: 2, level: "applying", memo: ["Methionine – Glutamic acid", "– Proline"] },
      { q: "Describe the process of translation.", marks: 5, level: "knowing", memo: ["mRNA attaches to a ribosome", "tRNA molecules carry specific amino acids to the ribosome", "The anticodon on tRNA pairs with the complementary codon on mRNA", "Adjacent amino acids are joined by peptide bonds", "to form a polypeptide/protein in the order coded by the mRNA"] },
      { q: "If the third base of the DNA template changed from C to T, explain how this would affect the protein.", marks: 3, level: "applying", memo: ["The DNA triplet becomes TAT, so the mRNA codon becomes AUA instead of AUG", "A different amino acid may be coded / the start codon is lost", "so the protein may have a different structure and function (or not be made)"] },
    ],
  },
  {
    id: "g12-dna-profiling", topic: "g12-dna", title: "DNA profiling", lesson: "dna-structure",
    source: "DNA was collected from blood at a crime scene and from three suspects (X, Y and Z). The band patterns of the crime-scene DNA matched suspect Y exactly.",
    parts: [
      { q: "Which suspect was most likely at the crime scene?", marks: 1, level: "applying", memo: ["Suspect Y"] },
      { q: "Explain why DNA profiling can be used to identify individuals.", marks: 2, level: "understanding", memo: ["Every person's DNA has a unique sequence/pattern", "except identical twins"] },
      { q: "State TWO other uses of DNA profiling.", marks: 2, level: "knowing", memo: ["Paternity testing / identifying relatives", "Identifying bodies after disasters / diagnosing genetic disorders / matching organ donors"] },
    ],
  },
  // ------------------------------------------------------------------ Meiosis
  {
    id: "g12-meiosis-phases", topic: "g12-meiosis", title: "The phases of meiosis", lesson: "meiosis",
    figure: { widget: "meiosis-lab" },
    parts: [
      { q: "Name the phase in which homologous chromosomes pair up and crossing over occurs.", marks: 1, level: "knowing", memo: ["Prophase I"] },
      { q: "Describe what happens during anaphase I.", marks: 3, level: "knowing", memo: ["Spindle fibres contract/shorten", "Homologous chromosomes separate", "one chromosome of each pair moves to opposite poles"] },
      { q: "A cell of a cat (2n = 38) undergoes meiosis. How many chromosomes will be in each cell at the end of meiosis II?", marks: 1, level: "applying", memo: ["19"] },
      { q: "Tabulate TWO differences between mitosis and meiosis.", marks: 5, level: "understanding", memo: ["Table with caption and headings", "Mitosis: one division", "Meiosis: two divisions", "Mitosis: produces two diploid, identical cells", "Meiosis: produces four haploid, genetically different cells"] },
    ],
  },
  {
    id: "g12-meiosis-nd", topic: "g12-meiosis", title: "Abnormal meiosis", lesson: "meiosis",
    source: "The karyotype of a child shows three copies of chromosome 21.",
    parts: [
      { q: "Name the genetic disorder shown by this karyotype.", marks: 1, level: "knowing", memo: ["Down syndrome / trisomy 21"] },
      { q: "State the total number of chromosomes in each body cell of this child.", marks: 1, level: "applying", memo: ["47"] },
      { q: "Explain how non-disjunction in the mother could have caused this disorder.", marks: 4, level: "understanding", memo: ["During meiosis, chromosome pair 21 did not separate (in anaphase I or II)", "so one ovum received two copies of chromosome 21 (n + 1 = 24)", "This ovum was fertilised by a normal sperm with one chromosome 21", "so the zygote had three copies of chromosome 21"] },
    ],
  },
  // ------------------------------------------------------------------ Genetics
  {
    id: "g12-gen-mono", topic: "g12-genetics", title: "A monohybrid cross", lesson: "monohybrid-crosses",
    figure: { widget: "punnett-lab", props: { start: "mono" } },
    source: "In guinea pigs, black fur (B) is dominant over brown fur (b). A heterozygous black male is crossed with a brown female.",
    parts: [
      { q: "Give the genotype of the female.", marks: 1, level: "knowing", memo: ["bb"] },
      { q: "Use a genetic cross to show the possible genotypes and phenotypes of the offspring.", marks: 6, level: "applying", memo: ["P₁ phenotype: black × brown; genotype: Bb × bb", "Meiosis", "G/gametes: B, b × b, b", "Fertilisation", "F₁ genotypes: Bb, Bb, bb, bb", "F₁ phenotypes: 50% black : 50% brown (1 : 1)"] },
      { q: "What is this type of cross called and why is it useful?", marks: 2, level: "understanding", memo: ["A test cross", "it shows whether an individual with the dominant phenotype is homozygous or heterozygous"] },
    ],
  },
  {
    id: "g12-gen-blood", topic: "g12-genetics", title: "Blood groups and paternity", lesson: "inheritance-patterns",
    source: "A mother has blood group A and her child has blood group O. Two men claim to be the father: Man 1 is group AB and Man 2 is group B.",
    parts: [
      { q: "Give the genotype of the child.", marks: 1, level: "knowing", memo: ["ii"] },
      { q: "Give the genotype of the mother.", marks: 1, level: "applying", memo: ["Iᴬi"] },
      { q: "Explain which man could be the father.", marks: 4, level: "evaluating", memo: ["The child must receive an i allele from the father", "Man 1 (AB) has genotype IᴬIᴮ and has no i allele, so he cannot be the father", "Man 2 (B) could be Iᴮi", "so Man 2 could be the father"] },
      { q: "Explain why blood groups are an example of multiple alleles.", marks: 2, level: "understanding", memo: ["There are more than two alleles for the gene in the population", "(Iᴬ, Iᴮ and i), although each person has only two"] },
    ],
  },
  {
    id: "g12-gen-sexlinked", topic: "g12-genetics", title: "Sex-linked inheritance", lesson: "inheritance-patterns",
    figure: { widget: "pedigree-lab" },
    source: "Haemophilia is a sex-linked recessive disorder (Xʰ). A carrier woman marries a man who does not have haemophilia.",
    parts: [
      { q: "Give the genotypes of the woman and the man.", marks: 2, level: "applying", memo: ["Woman: XᴴXʰ", "Man: XᴴY"] },
      { q: "Use a Punnett square to show the genotypes of their possible children.", marks: 4, level: "applying", memo: ["Gametes: Xᴴ, Xʰ × Xᴴ, Y", "Correct Punnett square", "Offspring genotypes: XᴴXᴴ, XᴴXʰ", "XᴴY, XʰY"] },
      { q: "What percentage of their sons are expected to have haemophilia?", marks: 1, level: "applying", memo: ["50%"] },
      { q: "Explain why haemophilia is more common in males.", marks: 2, level: "understanding", memo: ["Males have only one X chromosome", "so one recessive allele causes the disorder (there is no dominant allele to mask it)"] },
    ],
  },
  {
    id: "g12-gen-dihybrid", topic: "g12-genetics", title: "A dihybrid cross", lesson: "inheritance-patterns",
    figure: { widget: "punnett-lab", props: { start: "di" } },
    source: "In pea plants, tall (T) is dominant over short (t) and round seeds (R) are dominant over wrinkled seeds (r). A plant heterozygous for both characteristics is crossed with a short plant with wrinkled seeds.",
    parts: [
      { q: "Give the genotype of each parent.", marks: 2, level: "applying", memo: ["TtRr", "ttrr"] },
      { q: "List all the possible gametes of the heterozygous parent.", marks: 2, level: "applying", memo: ["TR, Tr", "tR, tr"] },
      { q: "Give the expected phenotypic ratio of the offspring.", marks: 2, level: "applying", memo: ["1 tall round : 1 tall wrinkled", ": 1 short round : 1 short wrinkled"] },
      { q: "State Mendel's law of independent assortment.", marks: 2, level: "knowing", memo: ["The alleles of different genes", "separate into gametes independently of each other during meiosis"] },
    ],
  },
  {
    id: "g12-gen-engineering", topic: "g12-genetics", title: "Mutations and genetic engineering", lesson: "mutations-genetic-engineering",
    parts: [
      { q: "Define a gene mutation.", marks: 2, level: "knowing", memo: ["A change in the sequence of bases", "in the DNA of a gene"] },
      { q: "Explain how sickle-cell anaemia is caused by a gene mutation.", marks: 3, level: "understanding", memo: ["One base in the haemoglobin gene is substituted", "so one amino acid in haemoglobin changes", "and red blood cells become sickle-shaped and carry less oxygen"] },
      { q: "Describe how bacteria are genetically engineered to produce human insulin.", marks: 4, level: "knowing", memo: ["The insulin gene is cut from human DNA with enzymes", "A plasmid is removed from a bacterium and cut open", "The insulin gene is inserted into the plasmid, which is returned to the bacterium", "The bacteria multiply and produce insulin, which is extracted"] },
      { q: "Give ONE argument for and ONE argument against using stem cells from embryos.", marks: 2, level: "evaluating", memo: ["For: they can develop into any cell type to treat diseases/injuries", "Against: the embryo is destroyed (ethical/religious objections)"] },
    ],
  },
  // ------------------------------------------------------------------ Vertebrate reproduction
  {
    id: "g12-vert-strategies", topic: "g12-vertebrate-repro", title: "Reproductive strategies", lesson: "vertebrate-reproduction",
    figure: { widget: "diagram", props: { diagram: "amniotic-egg", mode: "quiz" } },
    parts: [
      { q: "Differentiate between ovipary and vivipary.", marks: 2, level: "knowing", memo: ["Ovipary: eggs are laid and the embryo develops outside the mother's body", "Vivipary: the embryo develops inside the uterus and is nourished through a placenta"] },
      { q: "Explain why animals with external fertilisation produce very large numbers of eggs.", marks: 2, level: "understanding", memo: ["Many gametes are lost / eaten / not fertilised", "so producing many increases the chance that some offspring survive"] },
      { q: "Describe TWO functions of the amnion.", marks: 2, level: "knowing", memo: ["Contains amniotic fluid that prevents the embryo from drying out", "Protects the embryo against mechanical shock"] },
      { q: "Explain why precocial young need less parental care than altricial young.", marks: 2, level: "understanding", memo: ["Precocial young are well developed at birth (eyes open, can move)", "so they can find food and escape predators soon after birth"] },
    ],
  },
  // ------------------------------------------------------------------ Human reproduction
  {
    id: "g12-repro-cycle", topic: "g12-human-repro", title: "Hormones and the menstrual cycle", lesson: "menstrual-cycle-pregnancy",
    figure: { widget: "cycle-lab" },
    parts: [
      { q: "Name the hormone that stimulates the development of a follicle.", marks: 1, level: "knowing", memo: ["FSH"] },
      { q: "Name the gland that secretes FSH and LH.", marks: 1, level: "knowing", memo: ["Pituitary gland / hypophysis"] },
      { q: "Explain the role of LH in the menstrual cycle.", marks: 2, level: "knowing", memo: ["Causes ovulation", "and the formation of the corpus luteum"] },
      { q: "Explain how the contraceptive pill, which contains progesterone, prevents pregnancy.", marks: 3, level: "applying", memo: ["High progesterone levels", "inhibit the secretion of FSH and LH (negative feedback)", "so no follicle matures and ovulation does not occur"] },
      { q: "Explain why progesterone levels stay high during pregnancy.", marks: 2, level: "understanding", memo: ["The corpus luteum is maintained and the placenta secretes progesterone", "to keep the endometrium thick so the foetus stays implanted"] },
    ],
  },
  {
    id: "g12-repro-structures", topic: "g12-human-repro", title: "Gametes, fertilisation and the placenta", lesson: "menstrual-cycle-pregnancy",
    figure: { widget: "diagram", props: { diagram: "sperm", mode: "quiz" } },
    parts: [
      { q: "Describe how a sperm cell is adapted for its function.", marks: 3, level: "knowing", memo: ["Acrosome contains enzymes to penetrate the ovum", "Middle piece has many mitochondria to release energy", "Tail (flagellum) for swimming"] },
      { q: "Name the place in the female reproductive system where fertilisation normally takes place.", marks: 1, level: "knowing", memo: ["Fallopian tube / oviduct"] },
      { q: "Describe THREE functions of the placenta.", marks: 3, level: "knowing", memo: ["Allows food and oxygen to diffuse from the mother to the foetus", "Allows CO₂ and wastes to pass from the foetus to the mother", "Secretes progesterone / acts as a barrier to some pathogens"] },
      { q: "Explain why a woman should not drink alcohol during pregnancy.", marks: 2, level: "applying", memo: ["Alcohol crosses the placenta into the foetus", "and can cause foetal alcohol syndrome / brain damage"] },
    ],
  },
  {
    id: "g12-repro-gametogenesis", topic: "g12-human-repro", title: "Spermatogenesis and puberty", lesson: "human-reproductive-systems",
    figure: { widget: "diagram", props: { diagram: "male-repro", mode: "quiz" } },
    parts: [
      { q: "Describe the process of spermatogenesis.", marks: 4, level: "knowing", memo: ["Under the influence of testosterone", "diploid cells in the seminiferous tubules divide by mitosis", "some undergo meiosis to form haploid spermatids", "which mature into sperm"] },
      { q: "Explain why the testes are found in the scrotum outside the body.", marks: 2, level: "understanding", memo: ["The temperature in the scrotum is lower than body temperature", "which is best for sperm production"] },
      { q: "State the function of the prostate gland.", marks: 1, level: "knowing", memo: ["Secretes an alkaline fluid that neutralises acids / helps sperm move"] },
    ],
  },
  // ------------------------------------------------------------------ Nervous system
  {
    id: "g12-nerv-reflex", topic: "g12-nervous", title: "The reflex arc", lesson: "nervous-system",
    figure: { widget: "diagram", props: { diagram: "reflex-arc", mode: "quiz" } },
    parts: [
      { q: "Define a reflex action.", marks: 2, level: "knowing", memo: ["A quick, automatic (involuntary) response", "to a stimulus"] },
      { q: "Name the type of neuron that carries impulses from the spinal cord to the effector.", marks: 1, level: "knowing", memo: ["Motor neuron"] },
      { q: "Explain the importance of reflex actions.", marks: 2, level: "understanding", memo: ["They are very fast", "so they protect the body from injury/danger"] },
      { q: "A person's spinal cord is damaged in the neck. Explain why the person cannot feel touch on the legs.", marks: 3, level: "applying", memo: ["Impulses from receptors in the legs travel to the spinal cord", "but cannot pass the damaged area", "to reach the brain (cerebrum), where sensations are interpreted"] },
    ],
  },
  {
    id: "g12-nerv-brain", topic: "g12-nervous", title: "The brain and neurons", lesson: "nervous-system",
    figure: { widget: "diagram", props: { diagram: "brain", mode: "quiz" } },
    parts: [
      { q: "Name the part of the brain that controls the heart rate.", marks: 1, level: "knowing", memo: ["Medulla oblongata"] },
      { q: "State the function of the corpus callosum.", marks: 1, level: "knowing", memo: ["Connects the two cerebral hemispheres so they can communicate"] },
      { q: "Explain why a person who has drunk alcohol may struggle to walk in a straight line.", marks: 2, level: "applying", memo: ["Alcohol affects the cerebellum", "which controls balance and the coordination of muscles"] },
      { q: "Explain the function of the myelin sheath.", marks: 2, level: "understanding", memo: ["It insulates the axon", "and speeds up the transmission of impulses"] },
      { q: "Explain why impulses travel in one direction only across a synapse.", marks: 2, level: "understanding", memo: ["Neurotransmitters are only released from the axon terminal of one neuron", "and only the next neuron has receptors for them"] },
    ],
  },
  // ------------------------------------------------------------------ Senses
  {
    id: "g12-senses-eye", topic: "g12-senses", title: "The eye", lesson: "eye-and-ear",
    figure: { widget: "diagram", props: { diagram: "eye", mode: "quiz" } },
    parts: [
      { q: "Name the part of the eye with the most cones.", marks: 1, level: "knowing", memo: ["Yellow spot / fovea"] },
      { q: "Describe how the pupil responds to bright light.", marks: 3, level: "knowing", memo: ["The circular muscles of the iris contract and the radial muscles relax", "the pupil constricts (becomes smaller)", "so less light enters the eye"] },
      { q: "Explain why there is no image formed at the blind spot.", marks: 2, level: "understanding", memo: ["The blind spot has no photoreceptors (rods and cones)", "so light falling there does not generate impulses"] },
      { q: "Explain how short-sightedness is corrected.", marks: 3, level: "applying", memo: ["A concave lens is placed in front of the eye", "which diverges the light rays", "so the image falls on the retina"] },
    ],
  },
  {
    id: "g12-senses-ear", topic: "g12-senses", title: "The ear", lesson: "eye-and-ear",
    figure: { widget: "diagram", props: { diagram: "ear", mode: "quiz" } },
    parts: [
      { q: "Name the structure that equalises pressure on both sides of the eardrum.", marks: 1, level: "knowing", memo: ["Eustachian tube"] },
      { q: "Describe how sound waves are converted into impulses.", marks: 5, level: "knowing", memo: ["Sound waves cause the eardrum to vibrate", "The ossicles amplify the vibrations and pass them to the oval window", "Pressure waves are set up in the fluid of the cochlea", "Hair cells of the organ of Corti are stimulated", "and impulses are carried by the auditory nerve to the brain"] },
      { q: "Name the parts of the ear that detect changes in the speed and direction of movement.", marks: 1, level: "knowing", memo: ["Semicircular canals (cristae)"] },
      { q: "Explain how grommets help a child with a middle-ear infection.", marks: 2, level: "applying", memo: ["Grommets are inserted into the eardrum to drain fluid from the middle ear", "so the eardrum and ossicles can vibrate freely and hearing improves"] },
    ],
  },
  // ------------------------------------------------------------------ Endocrine
  {
    id: "g12-endo-thyroid", topic: "g12-endocrine", title: "Thyroxin and negative feedback", lesson: "endocrine-system",
    parts: [
      { q: "Name the gland that secretes TSH.", marks: 1, level: "knowing", memo: ["Pituitary gland / hypophysis"] },
      { q: "Describe the negative feedback mechanism when the thyroxin level in the blood is low.", marks: 4, level: "understanding", memo: ["The low level of thyroxin is detected and the pituitary secretes more TSH", "TSH stimulates the thyroid gland", "to secrete more thyroxin", "so the thyroxin level returns to normal"] },
      { q: "Explain why a lack of iodine in the diet causes goitre.", marks: 3, level: "understanding", memo: ["Iodine is needed to make thyroxin, so thyroxin levels stay low", "The pituitary keeps secreting TSH", "which over-stimulates the thyroid so it enlarges"] },
    ],
  },
  {
    id: "g12-endo-glands", topic: "g12-endocrine", title: "Glands and hormones", lesson: "endocrine-system",
    parts: [
      { q: "Name the gland that secretes adrenalin.", marks: 1, level: "knowing", memo: ["Adrenal gland"] },
      { q: "Describe THREE effects of adrenalin that prepare the body for 'fight or flight'.", marks: 3, level: "knowing", memo: ["Increases heart rate and breathing rate", "Increases blood glucose (glycogen → glucose)", "Dilates the pupils / diverts blood to the muscles"] },
      { q: "Explain why endocrine glands are called ductless glands.", marks: 2, level: "understanding", memo: ["They have no ducts", "and secrete hormones directly into the blood"] },
      { q: "Name the hormone that is deficient in a person with type 1 diabetes.", marks: 1, level: "knowing", memo: ["Insulin"] },
    ],
  },
  // ------------------------------------------------------------------ Homeostasis
  {
    id: "g12-homeo-glucose", topic: "g12-homeostasis", title: "Blood glucose", lesson: "homeostasis",
    figure: { widget: "homeostasis-lab", props: { mode: "glucose" } },
    source: "The blood glucose of two people was measured every 30 minutes after a meal at time 0. Person A's glucose rose to 8 mmol/L and returned to 5 mmol/L after 2 hours. Person B's glucose rose to 14 mmol/L and was still 12 mmol/L after 2 hours.",
    parts: [
      { q: "Which person probably has diabetes mellitus? Give a reason.", marks: 2, level: "applying", memo: ["Person B", "the glucose level rose higher and did not return to normal"] },
      { q: "Describe how the blood glucose level of person A returned to normal.", marks: 4, level: "understanding", memo: ["The pancreas detected the high glucose level", "and secreted insulin", "which caused the liver/muscles to convert excess glucose to glycogen", "and increased the uptake of glucose by cells"] },
      { q: "Explain why glucose may appear in the urine of person B.", marks: 2, level: "understanding", memo: ["The blood glucose is so high that not all the glucose in the filtrate", "can be reabsorbed in the proximal convoluted tubule"] },
    ],
  },
  {
    id: "g12-homeo-temp", topic: "g12-homeostasis", title: "Thermoregulation and salt balance", lesson: "homeostasis",
    figure: { widget: "homeostasis-lab", props: { mode: "temperature" } },
    parts: [
      { q: "Name the part of the brain that controls body temperature.", marks: 1, level: "knowing", memo: ["Hypothalamus"] },
      { q: "Describe how the body responds when it is too cold.", marks: 4, level: "understanding", memo: ["Vasoconstriction: arterioles in the skin constrict", "less blood flows near the surface so less heat is lost", "Less sweat is produced", "Shivering generates heat (muscle contractions)"] },
      { q: "Describe how the body responds when the sodium level in the blood is low.", marks: 3, level: "understanding", memo: ["The adrenal glands secrete more aldosterone", "which increases the reabsorption of sodium in the kidney tubules", "so the sodium level returns to normal"] },
    ],
  },
  // ------------------------------------------------------------------ Plant responses
  {
    id: "g12-plant-photo", topic: "g12-plant-responses", title: "Phototropism investigation", lesson: "plant-responses",
    source: "Three groups of bean seedlings were placed in a box with light from one side. Group A was untreated, group B had the tips removed, and group C had the tips covered with foil caps. After three days, only group A had bent towards the light.",
    parts: [
      { q: "Name the growth response shown by group A.", marks: 1, level: "knowing", memo: ["Phototropism (positive)"] },
      { q: "Explain why group A bent towards the light.", marks: 4, level: "understanding", memo: ["Auxins moved to the shaded side", "so the shaded side had a higher concentration of auxins", "and the cells on the shaded side elongated more", "so the stem bent towards the light"] },
      { q: "Explain the result for group C.", marks: 2, level: "applying", memo: ["The tip could not detect the direction of light", "so auxins were evenly distributed and the stem grew straight"] },
      { q: "State the advantage of phototropism to a plant.", marks: 1, level: "understanding", memo: ["The leaves receive more light for photosynthesis"] },
    ],
  },
  {
    id: "g12-plant-hormones", topic: "g12-plant-responses", title: "Plant hormones and defences", lesson: "plant-responses",
    parts: [
      { q: "Name the plant hormone that causes stomata to close in a drought.", marks: 1, level: "knowing", memo: ["Abscisic acid"] },
      { q: "State TWO functions of gibberellins.", marks: 2, level: "knowing", memo: ["Stimulate seed germination", "Stimulate stem elongation / flowering"] },
      { q: "Explain how farmers use auxins commercially.", marks: 2, level: "applying", memo: ["As rooting powder to stimulate root growth in cuttings", "as weedkillers / to produce seedless fruit"] },
      { q: "Describe ONE chemical and ONE physical defence of plants.", marks: 2, level: "knowing", memo: ["Chemical: poisons / bitter tannins / ethylene warning signals", "Physical: thorns / hairs / thick cuticle"] },
    ],
  },
  // ------------------------------------------------------------------ Evolution
  {
    id: "g12-evo-selection", topic: "g12-evolution", title: "Natural selection", lesson: "evidence-for-evolution",
    figure: { widget: "selection-lab" },
    source: "A population of beetles includes light and dark individuals. After a veld fire blackened the soil, the percentage of dark beetles increased from 20% to 85% over 15 generations.",
    parts: [
      { q: "Explain the increase in dark beetles using Darwin's theory of natural selection.", marks: 6, level: "applying", memo: ["There was variation in colour in the beetle population", "On the dark soil, light beetles were more visible to predators", "so more light beetles were eaten (dark beetles were camouflaged)", "Dark beetles survived and reproduced", "passing the allele for dark colour to their offspring", "Over generations the proportion of dark beetles increased"] },
      { q: "Explain how Lamarck would have explained the change.", marks: 2, level: "understanding", memo: ["Beetles would have become darker during their lifetime because of the dark soil (acquired a characteristic)", "and passed this acquired characteristic to their offspring"] },
      { q: "State why Lamarck's theory was rejected.", marks: 1, level: "understanding", memo: ["Characteristics acquired during a lifetime do not change the DNA of gametes, so they are not inherited"] },
    ],
  },
  {
    id: "g12-evo-evidence", topic: "g12-evolution", title: "Evidence and speciation", lesson: "speciation-evolution-in-action",
    parts: [
      { q: "State THREE lines of evidence for evolution.", marks: 3, level: "knowing", memo: ["Fossil record", "Modification by descent / homologous structures", "Genetics / biogeography"] },
      { q: "Describe how speciation occurs through geographic isolation.", marks: 6, level: "understanding", memo: ["A population is separated by a geographical barrier", "so there is no gene flow between the two populations", "Each population is exposed to different environmental conditions", "Natural selection occurs independently in each population", "The populations become genetically and phenotypically different over many generations", "so they can no longer interbreed – they are different species"] },
      { q: "Define a species.", marks: 2, level: "knowing", memo: ["A group of similar organisms", "that can interbreed to produce fertile offspring"] },
    ],
  },
  {
    id: "g12-evo-resistance", topic: "g12-evolution", title: "Evolution in present times", lesson: "speciation-evolution-in-action",
    figure: { widget: "germ-lab", props: { mode: "antibiotics" } },
    source: "Mosquitoes in a malaria area were sprayed with the same insecticide every year. In the first year 95% of the mosquitoes died; after eight years only 30% died.",
    parts: [
      { q: "Explain how the mosquito population became resistant to the insecticide.", marks: 5, level: "applying", memo: ["There was variation in the population – some mosquitoes were resistant (mutation)", "The insecticide killed the non-resistant mosquitoes", "The resistant mosquitoes survived", "and reproduced, passing on the allele for resistance", "so the proportion of resistant mosquitoes increased each year"] },
      { q: "Suggest TWO ways to reduce the development of resistance.", marks: 2, level: "evaluating", memo: ["Use different insecticides in rotation", "Use other methods such as nets and draining standing water"] },
      { q: "Tabulate ONE difference between natural and artificial selection.", marks: 3, level: "understanding", memo: ["Table with caption and headings", "Natural selection: the environment selects", "Artificial selection: humans select"] },
    ],
  },
  // ------------------------------------------------------------------ Human evolution
  {
    id: "g12-human-evo-skulls", topic: "g12-human-evolution", title: "Apes and humans", lesson: "human-evolution",
    parts: [
      { q: "State TWO characteristics that humans share with other primates.", marks: 2, level: "knowing", memo: ["Opposable thumbs", "Binocular / stereoscopic vision / nails instead of claws / large brain"] },
      { q: "Tabulate THREE differences between the skull of an African ape and a human.", marks: 7, level: "understanding", memo: ["Table with caption and headings", "Ape: foramen magnum towards the back", "Human: foramen magnum central/forward", "Ape: prognathous jaw", "Human: non-prognathous (flat face)", "Ape: large brow ridges / small cranium", "Human: small brow ridges / large cranium"] },
      { q: "Explain why the position of the foramen magnum is evidence of bipedalism.", marks: 2, level: "understanding", memo: ["A central/forward foramen magnum means the skull balances on top of the spine", "which is needed for walking upright"] },
    ],
  },
  {
    id: "g12-human-evo-fossils", topic: "g12-human-evolution", title: "Fossils and Out of Africa", lesson: "human-evolution",
    parts: [
      { q: "Name the World Heritage Site near Johannesburg that is famous for hominid fossils.", marks: 1, level: "knowing", memo: ["Cradle of Humankind"] },
      { q: "Name the scientist who described the Taung Child.", marks: 1, level: "knowing", memo: ["Raymond Dart"] },
      { q: "Describe the evidence for the Out of Africa hypothesis.", marks: 4, level: "understanding", memo: ["The oldest fossils of Homo sapiens are found in Africa", "Fossils of Homo sapiens outside Africa are younger", "Mitochondrial DNA shows all modern humans share a female ancestor in Africa", "The oldest tools/cultural artefacts are found in Africa (e.g. Blombos Cave)"] },
      { q: "Explain why mitochondrial DNA is useful for tracing ancestry.", marks: 2, level: "understanding", memo: ["It is inherited only from the mother", "so it changes only through mutation and can be traced back through the female line"] },
    ],
  },
];
