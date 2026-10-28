/**
 * Exam Room: NSC-style Grade 11 questions (and scientific-skills questions for
 * both grades). Every memo line is ONE mark – the tests enforce it.
 */
import type { ExamQuestion } from "./types";

export const G11_EXAMS: ExamQuestion[] = [
  // ------------------------------------------------------------------ Microorganisms
  {
    id: "g11-micro-structure", topic: "g11-microorganisms", title: "Viruses and bacteria", lesson: "microorganisms",
    figure: { widget: "diagram", props: { diagram: "bacterium", mode: "quiz" } },
    parts: [
      { q: "Give TWO reasons why viruses are considered to be non-living.", marks: 2, level: "knowing", memo: ["They have no cellular structure / no cytoplasm, organelles or cell membrane", "They cannot reproduce outside a living host cell / have no metabolism"] },
      { q: "Name the part of a bacterium that is used in genetic engineering.", marks: 1, level: "knowing", memo: ["Plasmid"] },
      { q: "Tabulate TWO differences between a virus and a bacterium.", marks: 5, level: "understanding", memo: ["Table with caption and column headings", "Virus: no cellular structure", "Bacterium: has a cell (cell wall, membrane, cytoplasm)", "Virus: reproduces only inside a living host cell", "Bacterium: reproduces on its own by binary fission"] },
      { q: "Explain why antibiotics are not used to treat influenza.", marks: 2, level: "understanding", memo: ["Influenza is caused by a virus", "Antibiotics act on bacterial structures (e.g. cell walls, ribosomes) that viruses do not have"] },
    ],
  },
  {
    id: "g11-micro-disease", topic: "g11-microorganisms", title: "Diseases and the immune system", lesson: "immunity-and-disease",
    source: "The table shows the number of new TB cases per 100 000 people in a district before and after a community health programme was introduced.\n\n| Year | 2018 | 2019 | 2020 | 2021 | 2022 |\n|---|---|---|---|---|---|\n| New TB cases per 100 000 | 650 | 610 | 540 | 470 | 410 |",
    parts: [
      { q: "Name the organism that causes TB.", marks: 1, level: "knowing", memo: ["*Mycobacterium tuberculosis* / a bacterium"] },
      { q: "Describe the trend in new TB cases from 2018 to 2022.", marks: 1, level: "applying", memo: ["The number of new TB cases decreased each year"] },
      { q: "Calculate the percentage decrease in new TB cases from 2018 to 2022. Show your working.", marks: 3, level: "applying", memo: ["(650 − 410) = 240", "240 ÷ 650 × 100", "= 36,9%"] },
      { q: "Suggest TWO measures the programme might have included to reduce the spread of TB.", marks: 2, level: "applying", memo: ["Making sure patients complete the full 6-month course of antibiotics / directly observed treatment", "Screening and testing contacts / better ventilation / education about covering coughs"] },
      { q: "Explain why people who are HIV-positive are more likely to develop TB.", marks: 2, level: "understanding", memo: ["HIV destroys T-helper lymphocytes / weakens the immune system", "so the body cannot fight off the TB bacteria"] },
    ],
  },
  {
    id: "g11-micro-immunity", topic: "g11-microorganisms", title: "Immunity", lesson: "immunity-and-disease",
    parts: [
      { q: "Differentiate between an antigen and an antibody.", marks: 2, level: "knowing", memo: ["Antigen: a foreign substance/protein that triggers an immune response", "Antibody: a protein made by lymphocytes that binds to a specific antigen"] },
      { q: "State the type of immunity a baby gets from breast milk.", marks: 2, level: "knowing", memo: ["Natural", "passive immunity"] },
      { q: "Explain why passive immunity only lasts for a short time.", marks: 2, level: "understanding", memo: ["The antibodies are not made by the body itself", "so no memory cells are formed and the antibodies are broken down"] },
    ],
  },
  // ------------------------------------------------------------------ Plants
  {
    id: "g11-plants-groups", topic: "g11-plants", title: "Plant groups", lesson: "plant-diversity",
    parts: [
      { q: "Name the plant group that has seeds but no flowers.", marks: 1, level: "knowing", memo: ["Gymnosperms"] },
      { q: "Explain why mosses only grow in damp places.", marks: 2, level: "understanding", memo: ["They have no vascular tissue to transport water / no true roots", "and their sperm need water to swim to the egg"] },
      { q: "Describe alternation of generations.", marks: 3, level: "understanding", memo: ["A diploid sporophyte generation produces haploid spores by meiosis", "Spores grow into a haploid gametophyte that produces gametes by mitosis", "Gametes fuse to form a diploid zygote that grows into a new sporophyte"] },
      { q: "Explain the importance of seed banks.", marks: 2, level: "understanding", memo: ["They store seeds of many species/varieties to conserve genetic diversity", "so that crops or species lost through disease, drought or climate change can be re-grown (food security)"] },
    ],
  },
  {
    id: "g11-plants-flower", topic: "g11-plants", title: "The flower and pollination", lesson: "flowers-and-seeds",
    figure: { widget: "diagram", props: { diagram: "flower", mode: "quiz" } },
    parts: [
      { q: "Name the part of the flower that develops into a fruit.", marks: 1, level: "knowing", memo: ["Ovary"] },
      { q: "Name the part of the flower that produces pollen.", marks: 1, level: "knowing", memo: ["Anther"] },
      { q: "Describe THREE ways in which wind-pollinated flowers are adapted for pollination.", marks: 3, level: "knowing", memo: ["Feathery stigmas hang outside the flower to catch pollen", "Large amounts of light, smooth pollen", "Anthers hang outside on long filaments"] },
      { q: "Explain why a flower pollinated by sunbirds is often red and produces a lot of nectar.", marks: 2, level: "applying", memo: ["Birds are attracted to bright red/orange colours", "and the nectar is a food reward for the bird"] },
    ],
  },
  // ------------------------------------------------------------------ Animals
  {
    id: "g11-animals-plans", topic: "g11-animals", title: "Body plans", lesson: "animal-body-plans",
    source: "Animal **A** is a jellyfish. Animal **B** is a tapeworm. Animal **C** is an earthworm.",
    parts: [
      { q: "Name the phylum of animal A.", marks: 1, level: "knowing", memo: ["Cnidaria"] },
      { q: "State the type of symmetry of animal A and animal C.", marks: 2, level: "knowing", memo: ["A: radial symmetry", "C: bilateral symmetry"] },
      { q: "Animal B is triploblastic and acoelomate. Explain what these two terms mean.", marks: 2, level: "knowing", memo: ["Triploblastic: three germ layers (ectoderm, mesoderm, endoderm)", "Acoelomate: no fluid-filled body cavity / no coelom"] },
      { q: "Explain ONE advantage of a coelom to animal C.", marks: 2, level: "understanding", memo: ["Organs can move and grow independently of the body wall", "the fluid acts as a hydrostatic skeleton for movement"] },
      { q: "Explain why cephalisation developed in animals with bilateral symmetry.", marks: 2, level: "understanding", memo: ["Bilateral animals move forward, so the front end meets the environment first", "so sense organs and nerve tissue are concentrated at the front (head)"] },
    ],
  },
  {
    id: "g11-animals-phyla", topic: "g11-animals", title: "Classifying animals", lesson: "animal-body-plans",
    parts: [
      { q: "Name the phylum to which insects and spiders belong.", marks: 1, level: "knowing", memo: ["Arthropoda"] },
      { q: "Give TWO features of the phylum Porifera.", marks: 2, level: "knowing", memo: ["The body has many pores / water flows through the body", "No true tissues / no symmetry / no gut"] },
      { q: "Tabulate TWO differences between Cnidaria and Annelida.", marks: 5, level: "understanding", memo: ["Table with caption and headings", "Cnidaria: radial symmetry", "Annelida: bilateral symmetry", "Cnidaria: diploblastic / gut with one opening", "Annelida: triploblastic / gut with two openings"] },
    ],
  },
  // ------------------------------------------------------------------ Population
  {
    id: "g11-pop-capture", topic: "g11-population", title: "Mark–recapture", lesson: "population-size",
    source: "Learners estimated the population of lizards in their school garden. They caught 24 lizards, marked each with a dot of non-toxic paint and released them. Three days later they caught 30 lizards, of which 6 were marked.",
    parts: [
      { q: "Calculate the estimated population of lizards. Show ALL working.", marks: 3, level: "applying", memo: ["N = (M × C) ÷ R", "= (24 × 30) ÷ 6", "= 120 lizards"] },
      { q: "Explain why the learners used non-toxic paint.", marks: 2, level: "understanding", memo: ["Toxic paint could kill or harm the lizards", "so the marked lizards would not survive/be recaptured and the estimate would be invalid"] },
      { q: "State TWO ways in which the learners could make their estimate more reliable.", marks: 2, level: "evaluating", memo: ["Repeat the investigation and calculate an average", "Use larger samples"] },
    ],
  },
  {
    id: "g11-pop-growth", topic: "g11-population", title: "Population growth", lesson: "population-size",
    figure: { widget: "population-lab", props: { mode: "growth" } },
    source: "The graph in the lab shows the growth of a population of yeast in a flask (logistic growth) compared with geometric growth.",
    parts: [
      { q: "Name the phase in which the population grows most rapidly.", marks: 1, level: "knowing", memo: ["Exponential / log phase"] },
      { q: "Explain why the logistic curve levels off.", marks: 3, level: "understanding", memo: ["Environmental resistance increases", "e.g. food runs out / waste builds up / space is limited", "so the birth rate equals the death rate at the carrying capacity"] },
      { q: "State TWO density-independent factors that could suddenly decrease a population.", marks: 2, level: "knowing", memo: ["Fire / flood", "Drought / extreme temperatures"] },
    ],
  },
  {
    id: "g11-pop-interactions", topic: "g11-population", title: "Interactions in the community", lesson: "community-interactions",
    parts: [
      { q: "Define the term 'interspecific competition'.", marks: 2, level: "knowing", memo: ["Competition between individuals of different species", "for the same limited resources"] },
      { q: "Give ONE example of mutualism and explain how each organism benefits.", marks: 3, level: "applying", memo: ["Oxpeckers and buffalo / bees and flowers (any correct example)", "Organism 1 benefit, e.g. oxpecker gets food (ticks)", "Organism 2 benefit, e.g. buffalo is rid of parasites"] },
      { q: "Describe secondary succession after a veld fire.", marks: 3, level: "understanding", memo: ["Soil is still present after the fire", "grasses and herbs quickly grow from seeds/roots in the soil", "followed by shrubs and trees until a stable climax community forms"] },
    ],
  },
  // ------------------------------------------------------------------ Human impact
  {
    id: "g11-impact-eutro", topic: "g11-human-impact", title: "Eutrophication", lesson: "human-impact-air-water",
    source: "Fertiliser from farms drains into a dam. Scientists measured the dissolved oxygen in the dam over four months.\n\n| Month | 1 | 2 | 3 | 4 |\n|---|---|---|---|---|\n| Dissolved oxygen (mg/L) | 9 | 7 | 4 | 2 |",
    parts: [
      { q: "Describe what happened to the dissolved oxygen over the four months.", marks: 1, level: "applying", memo: ["It decreased from 9 mg/L to 2 mg/L"] },
      { q: "Explain the decrease in dissolved oxygen.", marks: 4, level: "understanding", memo: ["Nitrates/phosphates from fertiliser cause rapid growth of algae (algal bloom)", "The algae die", "Bacteria decompose the dead algae", "and use up the oxygen during respiration"] },
      { q: "State the likely effect on fish in the dam.", marks: 1, level: "applying", memo: ["Fish die from lack of oxygen"] },
      { q: "Suggest TWO ways to reduce eutrophication.", marks: 2, level: "applying", memo: ["Use less fertiliser / apply it correctly", "Treat sewage / protect wetlands and buffer strips of plants near water"] },
    ],
  },
  {
    id: "g11-impact-climate", topic: "g11-human-impact", title: "The enhanced greenhouse effect", lesson: "human-impact-air-water",
    parts: [
      { q: "Name TWO greenhouse gases.", marks: 2, level: "knowing", memo: ["Carbon dioxide", "Methane / nitrous oxide / CFCs / water vapour"] },
      { q: "Explain how burning coal to generate electricity contributes to global warming.", marks: 3, level: "understanding", memo: ["Burning coal releases carbon dioxide", "which increases the amount of greenhouse gas in the atmosphere", "so more heat is trapped (enhanced greenhouse effect)"] },
      { q: "Suggest TWO ways in which a household can reduce its carbon footprint.", marks: 2, level: "applying", memo: ["Use less electricity (switch off lights, solar water heater, LED bulbs)", "Use public/shared transport / recycle / eat less meat"] },
      { q: "Explain why ozone depletion is a health risk.", marks: 2, level: "understanding", memo: ["Less ozone means more UV radiation reaches the Earth", "which increases the risk of skin cancer / cataracts"] },
    ],
  },
  {
    id: "g11-impact-biodiversity", topic: "g11-human-impact", title: "Biodiversity and food security", lesson: "human-impact-land-food",
    parts: [
      { q: "Define the term 'food security'.", marks: 2, level: "knowing", memo: ["When all people at all times have access", "to sufficient, safe and nutritious food"] },
      { q: "Explain how alien invasive plants reduce biodiversity.", marks: 3, level: "understanding", memo: ["They have no natural enemies in South Africa", "so they spread rapidly", "and outcompete indigenous plants for water, light and space"] },
      { q: "Describe how rhino poaching threatens biodiversity.", marks: 2, level: "understanding", memo: ["Rhinos are killed faster than they can reproduce", "so the population decreases and the species may become extinct"] },
      { q: "Name the method of control in which a natural enemy is used to control an alien species.", marks: 1, level: "knowing", memo: ["Biological control"] },
    ],
  },
  // ------------------------------------------------------------------ Photosynthesis
  {
    id: "g11-photo-light", topic: "g11-photosynthesis", title: "Light intensity and photosynthesis", lesson: "photosynthesis",
    figure: { widget: "photosynthesis-lab" },
    source: "An *Elodea* plant was placed at different distances from a lamp and the bubbles of gas released per minute were counted.\n\n| Distance from lamp (cm) | 10 | 20 | 30 | 40 | 50 |\n|---|---|---|---|---|---|\n| Bubbles per minute | 48 | 36 | 20 | 12 | 6 |",
    parts: [
      { q: "Identify the independent variable.", marks: 1, level: "knowing", memo: ["Distance from the lamp / light intensity"] },
      { q: "Identify the dependent variable.", marks: 1, level: "knowing", memo: ["Number of bubbles per minute / rate of photosynthesis"] },
      { q: "State TWO variables that must be kept constant.", marks: 2, level: "knowing", memo: ["Temperature of the water", "Amount of CO₂ / same plant / time"] },
      { q: "Draw a line graph of the results.", marks: 6, level: "applying", memo: ["Correct type of graph (line graph)", "Caption mentioning both variables", "X-axis: distance from the lamp (cm), correctly labelled", "Y-axis: number of bubbles per minute, correctly labelled", "Correct scale on both axes", "All points plotted correctly and joined"] },
      { q: "Write a conclusion for this investigation.", marks: 2, level: "evaluating", memo: ["As the distance from the lamp increases (light intensity decreases)", "the rate of photosynthesis decreases"] },
    ],
  },
  {
    id: "g11-photo-phases", topic: "g11-photosynthesis", title: "Phases of photosynthesis", lesson: "photosynthesis",
    figure: { widget: "diagram", props: { diagram: "chloroplast", mode: "quiz" } },
    parts: [
      { q: "Name the part of the chloroplast where the light phase takes place.", marks: 1, level: "knowing", memo: ["Grana / thylakoids"] },
      { q: "Describe the events of the light phase.", marks: 4, level: "knowing", memo: ["Chlorophyll absorbs light energy", "Light energy splits water into hydrogen and oxygen (photolysis)", "Oxygen is released", "Energy is used to form ATP"] },
      { q: "Explain why the rate of photosynthesis decreases at very high temperatures.", marks: 2, level: "understanding", memo: ["The enzymes controlling the dark phase", "are denatured"] },
      { q: "Explain why a plant is destarched before investigating whether light is needed for photosynthesis.", marks: 2, level: "understanding", memo: ["To remove all starch already in the leaves", "so that any starch found was made during the investigation"] },
    ],
  },
  // ------------------------------------------------------------------ Nutrition
  {
    id: "g11-nutrition-digest", topic: "g11-nutrition", title: "Digestion and absorption", lesson: "digestion",
    figure: { widget: "diagram", props: { diagram: "digestive", mode: "quiz" } },
    parts: [
      { q: "Name the organ that produces bile.", marks: 1, level: "knowing", memo: ["Liver"] },
      { q: "Explain the role of bile in digestion.", marks: 2, level: "understanding", memo: ["Bile emulsifies fats into small droplets", "increasing the surface area for lipase to act on"] },
      { q: "Name the enzyme that digests protein in the stomach.", marks: 1, level: "knowing", memo: ["Pepsin"] },
      { q: "Describe how the small intestine is adapted for absorption.", marks: 4, level: "knowing", memo: ["Long, so food spends more time there", "Many villi and microvilli increase the surface area", "Thin walls (one cell thick) – short diffusion distance", "Dense capillary network and lacteals carry absorbed food away"] },
    ],
  },
  {
    id: "g11-nutrition-diet", topic: "g11-nutrition", title: "Diet and the liver", lesson: "liver-and-diet",
    parts: [
      { q: "Name the disease caused by a lack of protein in young children.", marks: 1, level: "knowing", memo: ["Kwashiorkor"] },
      { q: "Describe how the liver deals with excess amino acids.", marks: 3, level: "knowing", memo: ["Deamination takes place", "The amino group is removed and converted into urea", "which is carried to the kidneys and excreted"] },
      { q: "Explain how insulin lowers the blood glucose level.", marks: 2, level: "understanding", memo: ["Insulin stimulates the liver and muscles to convert glucose to glycogen", "and increases the uptake of glucose by cells"] },
      { q: "Explain why a diet high in refined sugar increases the risk of type 2 diabetes.", marks: 2, level: "applying", memo: ["High sugar intake leads to weight gain/obesity", "and cells become less responsive to insulin (insulin resistance)"] },
    ],
  },
  // ------------------------------------------------------------------ Respiration
  {
    id: "g11-resp-yeast", topic: "g11-respiration", title: "Respiration in yeast", lesson: "cellular-respiration",
    figure: { widget: "respiration-lab" },
    source: "Learners set up two flasks of yeast and sugar solution at 35 °C, each connected to a test tube of limewater. Flask A had live yeast; flask B had boiled yeast.",
    parts: [
      { q: "State the purpose of flask B.", marks: 1, level: "understanding", memo: ["It is the control (to show that living yeast is needed)"] },
      { q: "What would you observe in the limewater connected to flask A?", marks: 1, level: "applying", memo: ["The limewater turns milky"] },
      { q: "Explain your answer to the previous question.", marks: 2, level: "understanding", memo: ["The live yeast respires and releases carbon dioxide", "which turns limewater milky"] },
      { q: "Write the word equation for alcoholic fermentation.", marks: 2, level: "knowing", memo: ["Glucose →", "ethanol + carbon dioxide (+ energy)"] },
      { q: "Name TWO industries that use alcoholic fermentation.", marks: 2, level: "knowing", memo: ["Baking (bread)", "Brewing / wine-making / biofuel"] },
    ],
  },
  {
    id: "g11-resp-stages", topic: "g11-respiration", title: "Aerobic and anaerobic respiration", lesson: "cellular-respiration",
    parts: [
      { q: "Name the stage of respiration that takes place in the cytoplasm.", marks: 1, level: "knowing", memo: ["Glycolysis"] },
      { q: "Tabulate THREE differences between aerobic and anaerobic respiration in humans.", marks: 7, level: "understanding", memo: ["Table with caption and headings", "Aerobic: oxygen is used", "Anaerobic: no oxygen is used", "Aerobic: CO₂ and water are produced", "Anaerobic: lactic acid is produced", "Aerobic: a lot of energy (36–38 ATP)", "Anaerobic: little energy (2 ATP)"] },
    ],
  },
  // ------------------------------------------------------------------ Gas exchange
  {
    id: "g11-gas-breathing", topic: "g11-gas-exchange", title: "Breathing mechanism", lesson: "gaseous-exchange",
    figure: { widget: "diagram", props: { diagram: "alveolus", mode: "quiz" } },
    parts: [
      { q: "Describe the process of inhalation.", marks: 5, level: "knowing", memo: ["The diaphragm contracts and flattens", "The external intercostal muscles contract and the ribs move up and outwards", "The volume of the thoracic cavity increases", "so the pressure in the lungs decreases", "Air rushes in from the outside"] },
      { q: "State THREE ways in which the alveoli are adapted for gaseous exchange.", marks: 3, level: "knowing", memo: ["Large surface area (many alveoli)", "Thin walls – one cell thick", "Moist lining / rich blood supply"] },
      { q: "Explain how a smoker's cilia being destroyed leads to a 'smoker's cough'.", marks: 2, level: "understanding", memo: ["Cilia can no longer sweep mucus and dust out of the airways", "so mucus builds up and the person coughs to remove it"] },
    ],
  },
  {
    id: "g11-gas-data", topic: "g11-gas-exchange", title: "Breathing rate and exercise", lesson: "gaseous-exchange",
    source: "A learner measured her breathing rate before, during and after a 5-minute run.\n\n| Time (min) | 0 (rest) | 2 | 5 | 8 | 12 |\n|---|---|---|---|---|---|\n| Breaths per minute | 15 | 28 | 34 | 22 | 16 |",
    parts: [
      { q: "State the breathing rate at rest.", marks: 1, level: "knowing", memo: ["15 breaths per minute"] },
      { q: "Explain why the breathing rate increased during the run.", marks: 3, level: "understanding", memo: ["The muscles respire faster and produce more CO₂", "The medulla oblongata detects the rise in CO₂", "and sends impulses to the breathing muscles to contract faster"] },
      { q: "Explain why the breathing rate did not return to normal immediately after the run.", marks: 2, level: "understanding", memo: ["An oxygen debt built up / lactic acid formed", "and extra oxygen is needed to break down the lactic acid"] },
    ],
  },
  // ------------------------------------------------------------------ Excretion
  {
    id: "g11-excretion-urine", topic: "g11-excretion", title: "Urine formation", lesson: "excretion-kidneys",
    figure: { widget: "diagram", props: { diagram: "nephron", mode: "quiz" } },
    source: "The table shows the concentration of some substances (g/100 ml) in blood plasma, glomerular filtrate and urine of a healthy person.\n\n| Substance | Plasma | Filtrate | Urine |\n|---|---|---|---|\n| Protein | 8,0 | 0 | 0 |\n| Glucose | 0,1 | 0,1 | 0 |\n| Urea | 0,03 | 0,03 | 2,0 |",
    parts: [
      { q: "Explain why there is no protein in the filtrate.", marks: 2, level: "understanding", memo: ["Protein molecules are too large", "to pass through the walls of the glomerulus/Bowman's capsule during ultrafiltration"] },
      { q: "Explain why there is no glucose in the urine.", marks: 2, level: "understanding", memo: ["All the glucose is reabsorbed", "in the proximal convoluted tubule"] },
      { q: "Explain why urea is more concentrated in urine than in the filtrate.", marks: 2, level: "understanding", memo: ["Water is reabsorbed from the filtrate", "but urea is not reabsorbed"] },
      { q: "Describe the role of ADH when a person is dehydrated.", marks: 3, level: "understanding", memo: ["More ADH is secreted by the pituitary gland", "The walls of the collecting ducts/DCT become more permeable to water", "so more water is reabsorbed and a small amount of concentrated urine forms"] },
    ],
  },
  {
    id: "g11-excretion-kidney", topic: "g11-excretion", title: "Kidney disease", lesson: "excretion-kidneys",
    parts: [
      { q: "Name THREE excretory organs and a substance each excretes.", marks: 3, level: "knowing", memo: ["Kidneys – urea / excess water and salts", "Lungs – carbon dioxide", "Skin – sweat (water, salts) / liver – bile pigments"] },
      { q: "Explain how a dialysis machine removes urea from the blood.", marks: 3, level: "understanding", memo: ["Blood flows past a partially permeable membrane", "the dialysis fluid contains no urea", "so urea diffuses from the blood into the dialysis fluid"] },
      { q: "Explain why a patient must take medication after a kidney transplant.", marks: 2, level: "understanding", memo: ["The immune system recognises the new kidney as foreign and may reject it", "Immunosuppressant drugs prevent rejection"] },
    ],
  },
  // ------------------------------------------------------------------ Skills (both grades, both papers)
  {
    id: "skills-enzyme", topic: "skills-investigation", title: "Investigation: temperature and amylase", lesson: "scientific-investigations",
    source: "Learners mixed starch with amylase in test tubes at 10 °C, 20 °C, 37 °C, 50 °C and 70 °C. Every minute they tested a drop from each tube with iodine and recorded the time taken for the starch to disappear.\n\n| Temperature (°C) | 10 | 20 | 37 | 50 | 70 |\n|---|---|---|---|---|---|\n| Time for starch to disappear (min) | 18 | 10 | 3 | 8 | starch still present after 30 |",
    parts: [
      { q: "State a hypothesis for this investigation.", marks: 2, level: "applying", memo: ["Amylase works fastest at 37 °C / as temperature increases, the rate of starch digestion increases", "up to an optimum, then decreases"] },
      { q: "Identify the dependent variable.", marks: 1, level: "knowing", memo: ["Time taken for the starch to disappear"] },
      { q: "Explain the result at 70 °C.", marks: 2, level: "understanding", memo: ["The amylase was denatured at the high temperature", "so it could not break down the starch"] },
      { q: "Describe a suitable control for this investigation.", marks: 2, level: "applying", memo: ["A test tube with starch and water but no amylase", "kept at each temperature"] },
      { q: "State ONE way to improve the validity of the investigation.", marks: 1, level: "evaluating", memo: ["Keep the volume and concentration of amylase and starch the same / keep pH constant"] },
    ],
  },
  {
    id: "skills-graph-bar", topic: "skills-investigation", title: "Data handling: blood groups", lesson: "data-and-graphs",
    figure: { widget: "graph-lab" },
    source: "A survey of a Grade 12 class recorded the blood groups of the learners: A = 11, B = 6, AB = 2, O = 15.",
    parts: [
      { q: "Calculate the percentage of learners with blood group O. Show your working.", marks: 2, level: "applying", memo: ["15 ÷ 34 × 100", "= 44,1%"] },
      { q: "Name the most suitable type of graph to display these results and give a reason.", marks: 2, level: "applying", memo: ["Bar graph", "because blood groups are discontinuous categories"] },
      { q: "Explain why this is an example of discontinuous variation.", marks: 2, level: "understanding", memo: ["There are distinct categories (A, B, AB, O)", "with no intermediate phenotypes"] },
    ],
  },
  {
    id: "skills-microscope", topic: "skills-investigation", title: "Magnification", lesson: "drawings-and-microscope",
    figure: { widget: "microscope-lab" },
    parts: [
      { q: "A cell is viewed with a ×10 eyepiece and a ×40 objective lens. Calculate the total magnification.", marks: 1, level: "applying", memo: ["×400"] },
      { q: "A drawing of a red blood cell is 32 mm in diameter at a magnification of ×4 000. Calculate the actual diameter in µm. Show your working.", marks: 3, level: "applying", memo: ["32 mm = 32 000 µm", "32 000 ÷ 4 000", "= 8 µm"] },
      { q: "State THREE rules for making a good biological drawing.", marks: 3, level: "knowing", memo: ["Use a sharp pencil and single continuous lines / no shading", "A heading/caption with the magnification", "Label lines drawn with a ruler, parallel, touching the part"] },
    ],
  },
  {
    id: "skills-planning", topic: "skills-investigation", title: "Planning an investigation", lesson: "scientific-investigations",
    figure: { widget: "investigation-planner" },
    source: "A learner wants to find out whether listening to music affects the pulse rate of teenagers.",
    parts: [
      { q: "Write down a suitable aim for this investigation.", marks: 2, level: "applying", memo: ["To investigate the effect of listening to music", "on the pulse rate of teenagers"] },
      { q: "Identify the independent variable.", marks: 1, level: "knowing", memo: ["Listening to music or not / type of music"] },
      { q: "State THREE variables that should be kept constant.", marks: 3, level: "applying", memo: ["Age/sex of the learners", "The time the learners listen / volume of the music", "The learners are seated/at rest and the method of measuring the pulse"] },
      { q: "Explain why the learner should get permission from the participants.", marks: 2, level: "understanding", memo: ["It is an ethical requirement / informed consent", "participants must agree to take part and know what will happen"] },
    ],
  },
];
