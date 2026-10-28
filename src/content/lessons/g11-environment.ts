/** Grade 11 – Environmental studies: population ecology and human impact on the environment (Paper 1). */
import type { Lesson } from "../types";

export const G11_ENVIRONMENT: Lesson[] = [
  {
    slug: "population-size",
    topic: "g11-population",
    order: 1,
    title: "Population Size & Growth",
    tagline: "How many springbok are in the reserve? Count them without counting them all.",
    emoji: "🦓",
    caps: "Gr 11 Term 3: Population ecology – population size and density, factors that change population size, growth curves (geometric and logistic), carrying capacity, estimating population size (mark–recapture, quadrats, census), human population growth",
    objectives: ["Define population, density and carrying capacity", "Explain natality, mortality, immigration and emigration", "Interpret geometric and logistic growth curves", "Estimate population size with mark–recapture and quadrats"],
    styles: ["kinaesthetic", "visual"],
    xp: 80,
    terms: [
      { term: "Population", def: "A group of organisms of the same species living in the same area at the same time that can interbreed." },
      { term: "Population density", def: "The number of individuals per unit area (or volume)." },
      { term: "Natality", def: "The birth rate of a population." },
      { term: "Mortality", def: "The death rate of a population." },
      { term: "Carrying capacity", def: "The maximum population size that an environment can support sustainably." },
      { term: "Environmental resistance", def: "All the factors that limit population growth, e.g. food, space, predators, disease." },
      { term: "Mark–recapture", def: "A method of estimating the size of a population of mobile animals by marking a sample and recapturing." },
      { term: "Quadrat", def: "A square frame of known area used to sample plants or slow-moving animals." },
    ],
    chunks: [
      {
        id: "change",
        title: "What changes population size?",
        minutes: 5,
        blocks: [
          { type: "callout", variant: "key", title: "The population equation", md: "**Change in population = (births + immigration) – (deaths + emigration)**\n\nNatality and immigration **increase** a population; mortality and emigration **decrease** it." },
          { type: "widget", widget: "sorter", props: { id: "pop-factors", title: "Density-dependent or density-independent?", colour: "var(--t-eco)", buckets: ["Density-dependent", "Density-independent"], items: [
            { text: "Competition for food", bucket: "Density-dependent" }, { text: "Disease spreading in a crowded herd", bucket: "Density-dependent" }, { text: "Predation", bucket: "Density-dependent" },
            { text: "A veld fire", bucket: "Density-independent" }, { text: "A flood", bucket: "Density-independent" }, { text: "A very cold winter", bucket: "Density-independent" },
          ] } },
          { type: "text", md: "**Density-dependent** factors get stronger as the population gets crowded. **Density-independent** factors affect a population no matter how big it is." },
        ],
      },
      {
        id: "curves",
        title: "Growth curves",
        minutes: 7,
        blocks: [
          { type: "widget", widget: "population-lab", props: { mode: "growth" } },
          { type: "keypoints", points: [
            "**Geometric (J-shaped):** unlimited growth – only possible for a short time with no environmental resistance.",
            "**Logistic (S-shaped):** lag phase → exponential (log) phase → **stationary phase** at the carrying capacity.",
            "In the stationary phase, **births ≈ deaths** – the population fluctuates around the carrying capacity.",
            "The **human population** has been growing geometrically since the industrial revolution (medicine, farming, sanitation) – now over 8 billion.",
          ] },
        ],
      },
      {
        id: "estimate",
        title: "Estimating population size (lab)",
        minutes: 12,
        blocks: [
          { type: "widget", widget: "population-lab", props: { mode: "capture" } },
          { type: "worked", title: "Mark–recapture calculation", problem: "Learners caught 30 frogs in a dam, marked them and released them. A week later they caught 40 frogs, of which 8 were marked. Estimate the population.", steps: [
            { md: "Write the formula: **N = (M × C) ÷ R**", why: "M = marked in the first sample, C = total caught in the second sample, R = marked animals recaptured." },
            { md: "Substitute: N = (30 × 40) ÷ 8", why: "The proportion of marked frogs in the second sample (8/40) should equal the proportion in the whole population (30/N)." },
            { md: "N = 1 200 ÷ 8 = **150 frogs**", why: "Always give the answer as a whole number of animals." },
          ] },
          { type: "worked", title: "Quadrat calculation", problem: "Four 1 m² quadrats in a 200 m² field contain 6, 9, 4 and 5 daisies. Estimate the number of daisies in the field.", steps: [
            { md: "Average per quadrat = (6 + 9 + 4 + 5) ÷ 4 = **6 daisies per m²**", why: "Averaging several random quadrats makes the estimate more reliable." },
            { md: "Population = 6 × 200 = **1 200 daisies**", why: "Density × total area." },
          ] },
          { type: "widget", widget: "drill", props: { generators: ["mark-recapture", "quadrat"], title: "Population estimates" } },
          { type: "exam", question: { id: "ex-pop-1", q: "State THREE assumptions that are made when the mark–recapture method is used.", marks: 3, level: "knowing", memo: [
            "The marked animals mix evenly with the rest of the population", "The marks do not harm the animals or make them easier/harder to catch, and do not rub off", "There are no births, deaths, immigration or emigration between the two samples",
          ] } },
          { type: "terms" },
        ],
      },
    ],
  },
  {
    slug: "community-interactions",
    topic: "g11-population",
    order: 2,
    title: "Interactions & Succession",
    tagline: "Predators, competitors, partners and parasites – and how a bare field becomes a forest.",
    emoji: "🐆",
    caps: "Gr 11 Term 3: Population ecology – predation, competition (intra- and interspecific), competitive exclusion and resource partitioning, specialisation, symbiosis (mutualism, commensalism, parasitism), social organisation, ecological succession",
    objectives: ["Explain predator–prey relationships with graphs", "Distinguish intra- and interspecific competition and explain resource partitioning", "Describe mutualism, commensalism and parasitism with SA examples", "Describe primary and secondary succession"],
    styles: ["visual", "read-write"],
    xp: 70,
    terms: [
      { term: "Predation", def: "An interaction in which one organism (the predator) kills and eats another (the prey)." },
      { term: "Competitive exclusion", def: "Two species competing for exactly the same resources cannot coexist – one will be eliminated." },
      { term: "Resource partitioning", def: "Competing species divide resources (e.g. feed at different heights or times) so they can coexist." },
      { term: "Symbiosis", def: "A close relationship between two different species living together." },
      { term: "Mutualism", def: "A symbiosis in which both species benefit." },
      { term: "Commensalism", def: "A symbiosis in which one species benefits and the other is unaffected." },
      { term: "Parasitism", def: "A symbiosis in which the parasite benefits and the host is harmed." },
      { term: "Ecological succession", def: "The gradual change in the species composition of a community over time until a climax community forms." },
    ],
    chunks: [
      {
        id: "predation",
        title: "Predators and prey",
        minutes: 6,
        blocks: [
          { type: "widget", widget: "population-lab", props: { mode: "predator" } },
          { type: "callout", variant: "exam", title: "Reading the graph", md: "Describe the pattern (**cycles**), say that **predators peak after prey**, explain why (food supply), and note there are **fewer predators** than prey." },
        ],
      },
      {
        id: "competition",
        title: "Competition and symbiosis",
        minutes: 8,
        blocks: [
          { type: "keypoints", points: [
            "**Intraspecific competition** – within one species (two male kudu fighting over females) – is usually the most intense because they need exactly the same things.",
            "**Interspecific competition** – between species (lions and hyenas for the same prey).",
            "**Resource partitioning:** giraffes browse high, kudu at middle height and steenbok low – they share the same trees.",
            "**Specialisation** reduces competition – each species has its own **niche**.",
          ] },
          { type: "widget", widget: "sorter", props: { id: "symbiosis-types", title: "Which kind of relationship?", colour: "var(--t-eco)", buckets: ["Mutualism", "Commensalism", "Parasitism"], items: [
            { text: "Oxpeckers eat ticks off buffalo", bucket: "Mutualism" }, { text: "Bees pollinate flowers and get nectar", bucket: "Mutualism" }, { text: "Nitrogen-fixing bacteria in bean root nodules", bucket: "Mutualism" },
            { text: "Cattle egrets catch insects stirred up by grazing cattle", bucket: "Commensalism" }, { text: "Barnacles on a whale", bucket: "Commensalism" },
            { text: "Ticks feed on a dog's blood", bucket: "Parasitism" }, { text: "Tapeworm in a person's gut", bucket: "Parasitism" }, { text: "Mistletoe growing on a tree", bucket: "Parasitism" },
          ] } },
          { type: "text", md: "**Social organisation** also helps survival: meerkats take turns as sentries, wild dogs hunt in packs, and bees divide labour between queen, workers and drones." },
        ],
      },
      {
        id: "succession",
        title: "Succession",
        minutes: 6,
        blocks: [
          { type: "sequence", id: "primary-succession", title: "Primary succession on bare rock", steps: [
            "Pioneer species such as lichens colonise bare rock",
            "Lichens break down rock and add organic matter, forming thin soil",
            "Mosses and small plants grow in the thin soil",
            "Grasses and shrubs establish as the soil deepens",
            "Trees grow and shade out smaller plants",
            "A stable climax community forms",
          ], explain: "**Secondary succession** happens where soil already exists (after a fire, flood or an abandoned field), so it is much faster." },
          { type: "quiz", id: "q-interactions", questions: [
            { q: "Giraffe, kudu and steenbok feeding at different heights is an example of…", options: ["competitive exclusion", "resource partitioning", "parasitism", "predation"], answer: 1, explain: "They divide the resource (leaves) so they can coexist." },
            { q: "Which relationship benefits one species and harms the other?", options: ["Mutualism", "Commensalism", "Parasitism", "Resource partitioning"], answer: 2, explain: "The parasite benefits; the host is harmed." },
            { q: "The first organisms to colonise bare rock are called…", options: ["climax species", "pioneer species", "decomposers", "predators"], answer: 1, explain: "Pioneer species like lichens start soil formation." },
          ] },
          { type: "exam", question: { id: "ex-pred-1", q: "Explain why the peak in the predator population occurs after the peak in the prey population.", marks: 2, level: "understanding", memo: [
            "When there is plenty of prey, predators have more food and reproduce more", "but it takes time for predator numbers to increase (breeding/growth takes time)",
          ] } },
          { type: "terms" },
        ],
      },
    ],
  },
  {
    slug: "human-impact-air-water",
    topic: "g11-human-impact",
    order: 1,
    title: "Climate Change, Air & Water",
    tagline: "Coal, carbon and a water-scarce country: our impact on the atmosphere and hydrosphere.",
    emoji: "🏭",
    caps: "Gr 11 Term 4: Human impact on the environment – the atmosphere (greenhouse effect, global warming, carbon footprint, ozone depletion), water availability (dams, wetlands, alien plants), water quality (eutrophication, sewage, mining, thermal pollution), water conservation",
    objectives: ["Explain the enhanced greenhouse effect and the consequences of global warming", "Describe causes and effects of ozone depletion", "Explain how human activities reduce water availability and quality", "Suggest ways to conserve water and reduce your carbon footprint"],
    styles: ["read-write", "kinaesthetic"],
    xp: 75,
    terms: [
      { term: "Greenhouse effect", def: "The trapping of heat in the atmosphere by gases such as CO₂ and methane, keeping the Earth warm enough for life." },
      { term: "Enhanced greenhouse effect", def: "Extra heat trapped because humans have increased the amount of greenhouse gases – causing global warming." },
      { term: "Carbon footprint", def: "The total amount of greenhouse gases produced by a person's or organisation's activities." },
      { term: "Ozone layer", def: "A layer of O₃ in the stratosphere that absorbs harmful UV radiation." },
      { term: "Eutrophication", def: "Nutrient enrichment of water (from fertiliser or sewage) causing algal blooms that use up the oxygen when they die." },
      { term: "Acid mine drainage", def: "Acidic, metal-rich water that flows out of old mines and pollutes rivers." },
      { term: "Wetland", def: "Land that is saturated with water – it filters water, controls floods and is a habitat for many species." },
    ],
    chunks: [
      {
        id: "climate",
        title: "The atmosphere",
        minutes: 8,
        blocks: [
          { type: "keypoints", points: [
            "**Greenhouse gases:** carbon dioxide (burning coal, petrol, deforestation), methane (cattle, landfills, rice paddies), nitrous oxide (fertilisers), CFCs.",
            "South Africa gets most of its electricity from **coal**, making it one of the biggest CO₂ emitters in Africa.",
            "**Consequences of global warming:** more droughts and floods, rising sea levels, melting ice, coral bleaching, spread of malaria to new areas, crop failure and **food insecurity**, species extinction.",
            "**Ozone depletion:** CFCs (old fridges, aerosols) break down ozone → more **UV radiation** → skin cancer, cataracts, damage to crops and plankton. The Montreal Protocol banned CFCs – the hole is slowly recovering.",
          ] },
          { type: "callout", variant: "mistake", title: "Don't mix them up", md: "The **greenhouse effect** (heat trapped → warming) and **ozone depletion** (thinner ozone → more UV) are **different problems**. CFCs happen to cause both." },
          { type: "widget", widget: "footprint-lab", props: { mode: "carbon" } },
        ],
      },
      {
        id: "water",
        title: "Water: quantity and quality",
        minutes: 8,
        blocks: [
          { type: "table", headers: ["Problem", "Cause", "Effect"], rows: [
            ["Less water available", "Alien plants (e.g. bluegum, black wattle) use lots of water; destroying wetlands; dams and over-use", "Rivers and dams dry up – 'Day Zero' in Cape Town in 2018"],
            ["Eutrophication", "Fertiliser and sewage run into rivers and dams", "Algal bloom → algae die → decomposers use up O₂ → fish die (Hartbeespoort Dam)"],
            ["Acid mine drainage", "Water flowing through old gold and coal mines", "Low pH and heavy metals kill aquatic life and pollute drinking water"],
            ["Thermal pollution", "Hot water from power stations and factories", "Warm water holds less oxygen – fish suffocate"],
            ["Disease", "Raw sewage in rivers", "Cholera, typhoid and diarrhoea"],
          ] },
          { type: "sequence", id: "eutrophication", title: "Eutrophication step by step", steps: [
            "Fertiliser or sewage washes into a dam",
            "Extra nitrates and phosphates cause an algal bloom",
            "Algae block light, so plants below die",
            "Algae and plants die and are decomposed by bacteria",
            "Bacteria use up the dissolved oxygen",
            "Fish and other animals die from lack of oxygen",
          ], explain: "The problem isn't the algae themselves – it's the oxygen used when they decompose." },
          { type: "widget", widget: "footprint-lab", props: { mode: "water" } },
        ],
      },
      {
        id: "check",
        title: "Check yourself",
        minutes: 5,
        blocks: [
          { type: "quiz", id: "q-air-water", questions: [
            { q: "Which gas is released by cattle and landfill sites?", options: ["Ozone", "Methane", "Oxygen", "Nitrogen"], answer: 1, explain: "Methane is a powerful greenhouse gas." },
            { q: "Why do fish die during eutrophication?", options: ["The algae poison them", "Decomposers use up the oxygen", "The water gets too cold", "The fertiliser is toxic"], answer: 1, explain: "Decomposition of dead algae removes the dissolved oxygen." },
            { q: "Removing alien plants from catchment areas…", options: ["increases water in rivers", "decreases rainfall", "causes eutrophication", "increases CO₂"], answer: 0, explain: "Alien trees use much more water than indigenous fynbos and grassland (Working for Water programme)." },
            { q: "Ozone depletion mainly increases…", options: ["global temperatures", "UV radiation reaching the Earth", "acid rain", "sea levels"], answer: 1, explain: "Ozone absorbs UV; less ozone means more UV." },
          ] },
          { type: "exam", question: { id: "ex-climate-1", q: "Describe FOUR possible consequences of global warming for South Africa.", marks: 4, level: "understanding", memo: [
            "More frequent and severe droughts / water shortages", "Crop failure leading to food insecurity", "Rising sea levels / flooding of coastal areas", "Spread of diseases such as malaria / loss of biodiversity / extinction of species",
          ] } },
          { type: "terms" },
        ],
      },
    ],
  },
  {
    slug: "human-impact-land-food",
    topic: "g11-human-impact",
    order: 2,
    title: "Food Security, Biodiversity & Waste",
    tagline: "Feeding 60 million people without destroying the land that feeds us.",
    emoji: "🌾",
    caps: "Gr 11 Term 4: Human impact – food security (drought, GMOs, monoculture, pests, loss of topsoil, wastage), loss of biodiversity (habitat destruction, poaching, alien invasive species), indigenous knowledge, solid waste disposal",
    objectives: ["Explain the factors that threaten food security", "Describe the causes of loss of biodiversity, including poaching and alien invasives", "Discuss the role of indigenous knowledge in conservation", "Describe solid waste management: reduce, reuse, recycle"],
    styles: ["read-write", "kinaesthetic"],
    xp: 70,
    terms: [
      { term: "Food security", def: "When all people at all times have access to enough safe, nutritious food." },
      { term: "Monoculture", def: "Growing a single crop over a large area year after year." },
      { term: "Biodiversity", def: "The variety of species, genes and ecosystems in an area." },
      { term: "Alien invasive species", def: "Species introduced from elsewhere that spread rapidly and harm indigenous ecosystems." },
      { term: "Poaching", def: "The illegal hunting or harvesting of animals or plants." },
      { term: "Bioremediation", def: "Using living organisms to clean up pollution." },
      { term: "Indigenous knowledge", def: "Knowledge of plants, animals and the environment developed by local communities over generations." },
    ],
    chunks: [
      {
        id: "food",
        title: "Food security",
        minutes: 7,
        blocks: [
          { type: "widget", widget: "sorter", props: { id: "food-security", title: "Does it help or harm food security?", colour: "var(--t-eco)", buckets: ["Threat", "Solution"], items: [
            { text: "Drought linked to climate change", bucket: "Threat" }, { text: "Loss of topsoil by erosion", bucket: "Threat" }, { text: "Monoculture that spreads plant disease", bucket: "Threat" }, { text: "Food wasted in shops and homes", bucket: "Threat" },
            { text: "Drought-resistant GM maize", bucket: "Solution" }, { text: "Crop rotation and contour ploughing", bucket: "Solution" }, { text: "Food gardens at schools and homes", bucket: "Solution" }, { text: "Seed banks", bucket: "Solution" },
          ] } },
          { type: "table", headers: ["Genetically modified crops", ""], rows: [
            ["✅ For", "Higher yields, pest resistance (Bt maize), drought tolerance, more nutrients, less pesticide spraying"],
            ["❌ Against", "Possible harm to insects and ecosystems, cross-pollination with wild plants, farmers depend on seed companies, long-term effects not fully known"],
          ] },
        ],
      },
      {
        id: "biodiversity",
        title: "Losing biodiversity",
        minutes: 7,
        blocks: [
          { type: "keypoints", points: [
            "**Habitat destruction:** farming, mining, housing and roads destroy grassland, wetlands and forests.",
            "**Poaching:** rhino horn and pangolin scales are trafficked illegally; abalone (perlemoen) is overharvested.",
            "**Alien invasive species:** water hyacinth chokes dams; Australian wattles and bluegums use huge amounts of water; prickly pear and lantana take over the veld.",
            "**Overharvesting** of medicinal plants (e.g. *Warburgia*, wild ginger) – people now cultivate them.",
            "**Biological control:** insects from the alien plant's home country are released to eat it (e.g. weevils on water hyacinth).",
          ] },
          { type: "callout", variant: "real-world", title: "Indigenous knowledge", md: "Traditional healers' knowledge of plants such as ***Hoodia***, ***Pelargonium*** and **rooibos** has led to medicines and products. Benefit-sharing laws now make sure communities share in the profits. Traditional practices such as rotating grazing land also help conserve the veld." },
        ],
      },
      {
        id: "waste",
        title: "Solid waste",
        minutes: 6,
        blocks: [
          { type: "sequence", id: "waste-hierarchy", title: "The waste hierarchy – best option first", steps: ["Reduce (buy less, avoid packaging)", "Reuse (bottles, bags, containers)", "Recycle (paper, glass, cans, plastic)", "Recover (compost food waste, biogas)", "Dispose safely in a landfill"], explain: "Landfills release methane, leach toxins into groundwater and take up land – they should be the last resort." },
          { type: "callout", variant: "life", title: "Make a difference at home", md: "Separate recyclables for the local reclaimers (waste pickers recycle most of SA's packaging), compost food scraps for your garden, and take a reusable bag to the shops." },
          { type: "quiz", id: "q-land", questions: [
            { q: "Which is an example of biological control?", options: ["Spraying herbicide", "Releasing weevils that eat water hyacinth", "Burning the veld", "Building a dam"], answer: 1, explain: "A natural enemy controls the invasive species." },
            { q: "Monoculture threatens food security because…", options: ["it uses less land", "a single disease or pest can wipe out the whole crop", "it increases biodiversity", "it needs no fertiliser"], answer: 1, explain: "All the plants are genetically similar and equally vulnerable." },
            { q: "The best option in the waste hierarchy is to…", options: ["recycle", "reduce", "landfill", "burn"], answer: 1, explain: "Not producing waste at all is best." },
          ] },
          { type: "exam", question: { id: "ex-alien-1", q: "Explain why alien invasive plants are a threat to water availability and biodiversity in South Africa.", marks: 4, level: "understanding", memo: [
            "Alien plants use more water than indigenous plants", "so less water flows into rivers and dams", "They spread rapidly because they have no natural enemies", "and outcompete indigenous species, reducing biodiversity",
          ] } },
          { type: "terms" },
        ],
      },
    ],
  },
];
