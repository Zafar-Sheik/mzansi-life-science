/** Everyday biology: practical Life Sciences for health, home and community. Not examined. */
import type { Lesson } from "../types";

export const EVERYDAY: Lesson[] = [
  {
    slug: "eat-well-spend-less",
    topic: "daily-nutrition",
    order: 1,
    title: "Eat Well, Spend Less",
    tagline: "A healthy plate on a tight budget – and how to read the label before you buy.",
    emoji: "🥗",
    caps: "Everyday biology (links to CAPS Gr 11 animal nutrition, balanced diet and nutritional disorders)",
    objectives: ["Build a balanced, affordable meal", "Read a food label and compare products", "Cut down on hidden sugar and salt", "Store and prepare food safely"],
    styles: ["kinaesthetic", "visual"],
    xp: 45,
    terms: [
      { term: "Food-based dietary guidelines", def: "Simple national guidelines for healthy eating, e.g. 'enjoy a variety of foods' and 'eat plenty of vegetables and fruit every day'." },
      { term: "Serving size", def: "The amount of food a nutrition label's 'per serving' values refer to." },
      { term: "Added sugar", def: "Sugar added to food or drinks during processing or cooking (not the sugar naturally in fruit or milk)." },
      { term: "Food poisoning", def: "Illness from eating food contaminated with bacteria, viruses or toxins." },
    ],
    chunks: [
      {
        id: "plate",
        title: "Build a plate (tool)",
        minutes: 8,
        blocks: [
          { type: "widget", widget: "plate-builder", props: { mode: "plate" } },
          { type: "keypoints", points: ["**Half the plate**: vegetables and fruit – morogo, cabbage, carrots and butternut are cheap and full of vitamins.", "**A quarter**: starch – choose brown bread, samp, maize meal and potatoes with skins.", "**A quarter**: protein – **beans, lentils, eggs and tinned pilchards** cost less than meat and are just as good.", "Drink **clean water**; keep fizzy drinks, chips and fried snacks for special occasions."] },
        ],
      },
      {
        id: "labels",
        title: "Read the label (tool)",
        minutes: 7,
        blocks: [
          { type: "widget", widget: "plate-builder", props: { mode: "label" } },
          { type: "widget", widget: "drill", props: { generators: ["food-label"], title: "Food label maths" } },
          { type: "callout", variant: "life", title: "Three label tricks", md: "1. Compare **per 100 g**, not per serving. 2. Sugar has many names: glucose, fructose, sucrose, syrup, maltodextrin. 3. 'Low fat' foods often have **extra sugar** added." },
        ],
      },
      {
        id: "safety",
        title: "Food safety at home",
        minutes: 5,
        blocks: [
          { type: "sequence", id: "food-safety", title: "Five keys to safer food", steps: ["Keep clean – wash hands and surfaces", "Separate raw meat from cooked food", "Cook thoroughly, especially chicken and meat", "Keep food at safe temperatures – refrigerate leftovers within 2 hours", "Use safe water and fresh, unexpired ingredients"], explain: "Bacteria such as *Salmonella* and *Listeria* multiply fastest between 5 °C and 60 °C." },
          { type: "quiz", id: "q-eat-well", questions: [
            { q: "Which is the cheapest good source of protein?", options: ["Steak", "Dried beans and lentils", "Fizzy drinks", "Chips"], answer: 1, explain: "Legumes are cheap and also give fibre and iron." },
            { q: "To compare two cereals fairly you should look at…", options: ["the box colour", "the 'per 100 g' column", "the price only", "the advert"], answer: 1, explain: "Per 100 g is the same amount for every product." },
            { q: "Leftover food should be put in the fridge…", options: ["the next day", "within about 2 hours", "never", "after a week"], answer: 1, explain: "Bacteria multiply quickly at room temperature." },
          ] },
          { type: "terms" },
        ],
      },
    ],
  },
  {
    slug: "germs-vaccines-medicines",
    topic: "daily-germs",
    order: 1,
    title: "Germs, Vaccines & Medicines",
    tagline: "Handwashing, HIV and TB facts, vaccines – and why you finish your antibiotics.",
    emoji: "🧼",
    caps: "Everyday biology (links to CAPS Gr 11 microorganisms and immunity, Gr 12 evolution in action)",
    objectives: ["Explain how infections spread and how to break the chain", "Explain how vaccines protect individuals and communities", "Use antibiotics correctly and explain antibiotic resistance", "Spot health myths and find reliable information"],
    styles: ["kinaesthetic", "read-write"],
    xp: 45,
    terms: [
      { term: "Chain of infection", def: "The steps by which a pathogen spreads: source → way out → way of spreading → way in → new host." },
      { term: "Herd immunity", def: "Protection of a community when enough people are immune that a disease can't spread." },
      { term: "Antibiotic resistance", def: "Bacteria that are no longer killed by an antibiotic." },
      { term: "ARVs", def: "Antiretroviral medicines that stop HIV multiplying; taken every day for life." },
    ],
    chunks: [
      {
        id: "spread",
        title: "Break the chain",
        minutes: 6,
        blocks: [
          { type: "widget", widget: "germ-lab", props: { mode: "handwash" } },
          { type: "keypoints", points: ["**Air** (coughs, sneezes): TB, flu, COVID-19 – cover coughs, open windows.", "**Hands and surfaces**: diarrhoea, colds – wash hands with soap.", "**Water and food**: cholera, typhoid – safe water and cooking.", "**Blood and body fluids**: HIV, hepatitis B – condoms, never share needles or razors.", "**Insects**: malaria – nets and repellent."] },
        ],
      },
      {
        id: "vaccines",
        title: "Vaccines and antibiotics (lab)",
        minutes: 9,
        blocks: [
          { type: "widget", widget: "germ-lab", props: { mode: "herd" } },
          { type: "widget", widget: "germ-lab", props: { mode: "antibiotics" } },
          { type: "callout", variant: "life", title: "Using medicines wisely", md: "Take antibiotics **exactly as prescribed and finish the course**, even when you feel better. **Never** share antibiotics or use old ones. Antibiotics do **not** work on colds and flu (viruses). Keep your child's **Road-to-Health booklet** up to date – vaccines at clinics are free." },
        ],
      },
      {
        id: "myths",
        title: "Myth or fact?",
        minutes: 5,
        blocks: [
          { type: "widget", widget: "sorter", props: { id: "health-myths", title: "Myth or fact?", colour: "var(--t-daily)", buckets: ["Myth", "Fact"], items: [
            { text: "Antibiotics cure the flu", bucket: "Myth" }, { text: "Vaccines cause the disease they protect against", bucket: "Myth" }, { text: "HIV can be cured by herbal mixtures", bucket: "Myth" },
            { text: "TB is curable if you finish the treatment", bucket: "Fact" }, { text: "Someone on ARVs with an undetectable viral load does not pass HIV on through sex", bucket: "Fact" }, { text: "Soap and water remove most germs from your hands", bucket: "Fact" },
          ] } },
          { type: "quiz", id: "q-germs", questions: [
            { q: "Why should you finish a course of antibiotics?", options: ["To use up the box", "So that the more resistant bacteria are also killed", "Because they taste nice", "To get a refund"], answer: 1, explain: "Stopping early leaves resistant bacteria alive to multiply." },
            { q: "Herd immunity protects…", options: ["only vaccinated people", "people who can't be vaccinated, like newborns", "cattle only", "nobody"], answer: 1, explain: "When most people are immune, the disease can't reach the vulnerable." },
          ] },
          { type: "terms" },
        ],
      },
    ],
  },
  {
    slug: "sexual-reproductive-health",
    topic: "daily-sexual-health",
    order: 1,
    title: "Sexual & Reproductive Health",
    tagline: "Consent, contraception, STIs and HIV prevention – facts to protect your future.",
    emoji: "💗",
    caps: "Everyday biology (links to CAPS Gr 12 human reproduction and the menstrual cycle, Gr 11 immunity; Life Orientation)",
    objectives: ["Explain consent and healthy relationships", "Describe how different contraceptives work", "Describe common STIs and how to prevent them", "Know where to get free, confidential help"],
    styles: ["read-write"],
    xp: 45,
    terms: [
      { term: "Consent", def: "A clear, freely given 'yes' to sexual activity that can be withdrawn at any time. Someone drunk, asleep or under the age of consent cannot consent." },
      { term: "Contraception", def: "Methods that prevent pregnancy." },
      { term: "STI", def: "Sexually transmitted infection, e.g. HIV, chlamydia, gonorrhoea, syphilis, herpes, HPV." },
      { term: "PrEP", def: "Pre-exposure prophylaxis – a daily pill (or injection) taken by HIV-negative people to prevent HIV infection." },
      { term: "PEP", def: "Post-exposure prophylaxis – ARVs taken within 72 hours after possible exposure to HIV, for 28 days." },
      { term: "Dual protection", def: "Using a condom plus another contraceptive – protection against STIs and pregnancy." },
    ],
    chunks: [
      {
        id: "consent",
        title: "Consent and healthy relationships",
        minutes: 5,
        blocks: [
          { type: "keypoints", points: ["Consent must be **clear, freely given, sober and ongoing** – you can say no at any time, even if you said yes before.", "Pressure, threats, gifts in exchange for sex, or someone much older pursuing a learner are **red flags**.", "In South Africa the age of consent is **16**. Sex with a child under 12 is always rape.", "Abuse is never the victim's fault. Tell a trusted adult or call **Childline 116** (free) or the **GBV Command Centre 0800 428 428**."] },
        ],
      },
      {
        id: "contraception",
        title: "How contraception works",
        minutes: 7,
        blocks: [
          { type: "table", headers: ["Method", "How it works (biology)", "Protects against STIs?"], rows: [
            ["**Male or female condom**", "A barrier stops sperm reaching the ovum", "✅ Yes – the only method that does"],
            ["**The pill**", "Synthetic oestrogen and progesterone inhibit FSH and LH, so no ovulation", "❌"],
            ["**Injection** (2- or 3-monthly)", "Progesterone stops ovulation and thickens cervical mucus", "❌"],
            ["**Implant** (in the arm, 3 years)", "Slowly releases progesterone", "❌"],
            ["**IUD** (loop)", "Prevents fertilisation / implantation in the uterus", "❌"],
            ["**Emergency contraception** ('morning-after pill')", "High-dose hormone delays ovulation – take within 72 hours (sooner is better)", "❌"],
          ] },
          { type: "callout", variant: "life", title: "Free and confidential", md: "Contraception, condoms, HIV tests, PrEP and PEP are **free at public clinics**. From age 12 you may get contraceptives and an HIV test without your parents' consent, and nurses must keep it **confidential**." },
          { type: "widget", widget: "cycle-lab" },
        ],
      },
      {
        id: "stis",
        title: "STIs and HIV prevention",
        minutes: 6,
        blocks: [
          { type: "keypoints", points: ["Many STIs have **no symptoms** – the only way to know is to **get tested**.", "Bacterial STIs (chlamydia, gonorrhoea, syphilis) are **curable** with antibiotics – partners must be treated too.", "Viral STIs (HIV, herpes, HPV) are not curable but can be **managed**. The **HPV vaccine** given to Grade 5 girls at school prevents most cervical cancer.", "**HIV prevention:** condoms, **PrEP**, **PEP within 72 hours**, testing, ARVs (U = U: undetectable = untransmittable), and medical male circumcision lowers the risk for men."] },
          { type: "quiz", id: "q-sexual-health", questions: [
            { q: "Which contraceptive also protects against STIs?", options: ["The pill", "The injection", "Condoms", "The implant"], answer: 2, explain: "Only barrier methods stop infected fluids passing between partners." },
            { q: "PEP must be started within…", options: ["72 hours of possible HIV exposure", "1 month", "6 months", "a year"], answer: 0, explain: "The sooner the better – go to a clinic or hospital immediately." },
            { q: "The contraceptive pill prevents pregnancy mainly by…", options: ["killing sperm", "stopping ovulation", "blocking the vagina", "removing the uterus lining"], answer: 1, explain: "High oestrogen and progesterone inhibit FSH and LH (negative feedback)." },
          ] },
          { type: "terms" },
        ],
      },
    ],
  },
  {
    slug: "first-aid",
    topic: "daily-first-aid",
    order: 1,
    title: "First Aid That Saves Lives",
    tagline: "What to do in the first five minutes – before the ambulance arrives.",
    emoji: "🚑",
    caps: "Everyday biology (links to CAPS Gr 11 gas exchange and circulation, Gr 12 nervous system and homeostasis)",
    objectives: ["Follow DRSABC in an emergency", "Do CPR at the right rate and depth", "Help someone who is choking, bleeding, burnt, fitting or bitten by a snake", "Know which numbers to call"],
    styles: ["kinaesthetic", "auditory"],
    xp: 50,
    terms: [
      { term: "DRSABC", def: "The order of first aid: Danger, Response, Send for help, Airway, Breathing, CPR." },
      { term: "CPR", def: "Cardiopulmonary resuscitation: chest compressions (and rescue breaths) to keep blood flowing to the brain when the heart has stopped." },
      { term: "Recovery position", def: "Lying an unconscious, breathing person on their side so their airway stays open." },
      { term: "Shock", def: "A dangerous drop in blood flow – pale, cold, clammy skin, fast weak pulse – after bleeding, burns or injury." },
    ],
    chunks: [
      {
        id: "trainer",
        title: "First-aid trainer (tool)",
        minutes: 14,
        blocks: [
          { type: "widget", widget: "first-aid-sim" },
        ],
      },
      {
        id: "why",
        title: "The biology behind it",
        minutes: 5,
        blocks: [
          { type: "keypoints", points: ["Brain cells start dying **4–6 minutes** without oxygen – CPR pushes oxygenated blood to the brain until help arrives.", "Pressing on a wound helps **platelets** form a clot.", "Cooling a burn stops heat damaging deeper **tissues and nerve endings**.", "A tourniquet or tight bandage cuts off blood – **cells below it die** without oxygen."] },
          { type: "sequence", id: "drsabc", title: "Put DRSABC in order", steps: ["Danger", "Response", "Send for help", "Airway", "Breathing", "CPR"], explain: "Check for danger first – then the casualty." },
          { type: "quiz", id: "q-first-aid", questions: [
            { q: "How fast should CPR compressions be?", options: ["10–20 per minute", "100–120 per minute", "200 per minute", "As slow as possible"], answer: 1, explain: "About two per second – the beat of 'Stayin' Alive'." },
            { q: "What should you put on a burn?", options: ["Butter", "Toothpaste", "Cool running water for 20 minutes", "Ice"], answer: 2, explain: "Cool water stops the burning and eases pain." },
            { q: "The national ambulance number in South Africa is…", options: ["10111", "10177", "911", "0800 123 123"], answer: 1, explain: "10177 for an ambulance; 112 from any cellphone; 10111 for the police." },
          ] },
          { type: "terms" },
        ],
      },
    ],
  },
  {
    slug: "brain-sleep-stress",
    topic: "daily-mind",
    order: 1,
    title: "Your Brain on Sleep, Stress & Substances",
    tagline: "Look after the organ that does your exams.",
    emoji: "😴",
    caps: "Everyday biology (links to CAPS Gr 12 nervous system, endocrine system and homeostasis)",
    objectives: ["Explain why sleep matters for memory and learning", "Describe the stress response and healthy ways to cope", "Describe how alcohol, nicotine and drugs affect the nervous system", "Know where to get help"],
    styles: ["read-write", "auditory"],
    xp: 45,
    terms: [
      { term: "Stress response", def: "The 'fight or flight' reaction: the sympathetic nervous system and adrenalin raise heart rate, breathing and blood glucose." },
      { term: "Neurotransmitter", def: "A chemical that carries impulses across a synapse – many drugs change how these work." },
      { term: "Addiction", def: "A condition in which a person can't stop using a substance or behaviour despite harm, because of changes in the brain's reward system." },
      { term: "Tolerance", def: "Needing more of a drug to get the same effect." },
    ],
    chunks: [
      {
        id: "sleep",
        title: "Sleep and memory",
        minutes: 5,
        blocks: [
          { type: "keypoints", points: ["Teenagers need about **8–10 hours** of sleep.", "During deep sleep the brain **moves new learning into long-term memory** – an all-nighter before an exam actually makes you remember less.", "Screens at night delay the sleep hormone **melatonin**. Put the phone away 30–60 minutes before bed."] },
          { type: "callout", variant: "break", title: "Try it now", md: "Box breathing: breathe in for 4, hold for 4, out for 4, hold for 4 – four times. It activates the **parasympathetic** nervous system and calms the stress response." },
        ],
      },
      {
        id: "stress",
        title: "Stress",
        minutes: 6,
        blocks: [
          { type: "table", headers: ["Short-term stress", "Long-term stress"], rows: [
            ["Adrenalin: faster heart and breathing, more glucose, sharper focus", "Cortisol stays high: poor sleep, lower immunity, headaches, anxiety, depression"],
            ["Can help you perform in a race or exam", "Harms health and learning – needs action"],
          ] },
          { type: "keypoints", points: ["**Helps:** exercise, sleep, talking to someone, breaking work into small tasks, time outdoors.", "**Get help** if you feel hopeless for more than two weeks: a teacher, clinic nurse, or **SADAG 0800 567 567** (free, 24 hours)."] },
        ],
      },
      {
        id: "substances",
        title: "Substances",
        minutes: 6,
        blocks: [
          { type: "match", id: "substance-match", title: "Match the substance to its effect", pairs: [
            { left: "Alcohol", right: "Slows down the CNS: poor coordination, slurred speech, damages the liver" },
            { left: "Nicotine", right: "Highly addictive stimulant; with tobacco smoke causes lung cancer and heart disease" },
            { left: "Dagga (cannabis)", right: "Affects memory and concentration, especially in the developing teenage brain" },
            { left: "Tik (methamphetamine)", right: "Floods the brain with dopamine – severe addiction, paranoia, brain damage" },
            { left: "Energy drinks (caffeine)", right: "Stimulant – racing heart and poor sleep in large amounts" },
          ] },
          { type: "quiz", id: "q-mind", questions: [
            { q: "Which part of the nervous system calms the body after stress?", options: ["Sympathetic", "Parasympathetic", "Spinal cord only", "Cerebellum"], answer: 1, explain: "'Rest and digest'." },
            { q: "Why is an all-nighter a bad exam strategy?", options: ["The brain consolidates memories during sleep", "Sleep makes you forget", "Exams are at night", "It isn't – it's great"], answer: 0, explain: "Without sleep, less is stored in long-term memory." },
          ] },
          { type: "terms" },
        ],
      },
    ],
  },
  {
    slug: "grow-your-own-food",
    topic: "daily-garden",
    order: 1,
    title: "Grow Your Own Food",
    tagline: "From seed to plate: soil, compost, water and natural pest control.",
    emoji: "🥕",
    caps: "Everyday biology (links to CAPS Gr 11 photosynthesis, plant reproduction, food security and ecology)",
    objectives: ["Prepare soil and make compost", "Plant seeds and seedlings correctly", "Garden in a water-wise way", "Control pests naturally"],
    styles: ["kinaesthetic", "read-write"],
    xp: 45,
    terms: [
      { term: "Compost", def: "Decomposed plant and kitchen waste that adds nutrients and improves soil." },
      { term: "Mulch", def: "A layer of dry grass, leaves or straw on the soil that keeps moisture in and weeds out." },
      { term: "Companion planting", def: "Growing plants together that help each other, e.g. marigolds that repel pests." },
      { term: "Crop rotation", def: "Changing the crop grown in a bed each season so nutrients aren't used up and pests don't build up." },
    ],
    chunks: [
      {
        id: "soil",
        title: "Soil and compost",
        minutes: 6,
        blocks: [
          { type: "sequence", id: "compost-heap", title: "Make a compost heap", steps: ["Choose a shady corner", "Add a layer of 'browns' (dry leaves, straw, cardboard)", "Add a layer of 'greens' (vegetable peels, grass, coffee grounds)", "Repeat the layers and keep it as damp as a squeezed sponge", "Turn it every week or two to add oxygen", "Use the dark, crumbly compost after 2–3 months"], explain: "Bacteria and fungi (**decomposers**) break down the waste – a mini nutrient cycle. No meat or oil: they attract pests." },
        ],
      },
      {
        id: "plant",
        title: "Planting and watering",
        minutes: 6,
        blocks: [
          { type: "keypoints", points: ["Plant seeds about **twice as deep as the seed is wide**; keep them moist until they germinate.", "Seeds need **water, oxygen and a suitable temperature** to germinate (not light!).", "Grow quick, nutritious crops: **spinach, morogo, beans, onions, tomatoes, butternut**.", "**Water-wise:** water early morning or evening, at the roots; **mulch** the soil; reuse grey water from washing; trench or keyhole beds hold water."] },
          { type: "widget", widget: "photosynthesis-lab" },
        ],
      },
      {
        id: "pests",
        title: "Natural pest control",
        minutes: 5,
        blocks: [
          { type: "widget", widget: "sorter", props: { id: "garden-friends", title: "Garden friend or foe?", colour: "var(--t-daily)", buckets: ["Friend", "Foe"], items: [
            { text: "Ladybirds (eat aphids)", bucket: "Friend" }, { text: "Earthworms", bucket: "Friend" }, { text: "Bees", bucket: "Friend" },
            { text: "Aphids sucking sap", bucket: "Foe" }, { text: "Cutworms", bucket: "Foe" }, { text: "Snails eating seedlings", bucket: "Foe" },
          ] } },
          { type: "callout", variant: "life", title: "Spray-free pest control", md: "Plant **marigolds, garlic and basil** among vegetables; pick off snails at night; spray aphids with soapy water or a chilli-garlic mix; rotate crops each season." },
          { type: "quiz", id: "q-garden", questions: [
            { q: "Which three things do seeds need to germinate?", options: ["Light, soil, fertiliser", "Water, oxygen and a suitable temperature", "Sun, wind, rain", "Compost, light, CO₂"], answer: 1, explain: "Seeds use stored food, so they don't need light until the leaves grow." },
            { q: "Mulch helps because it…", options: ["kills earthworms", "keeps moisture in the soil and suppresses weeds", "adds pests", "makes the soil hot"], answer: 1, explain: "Less evaporation means less watering." },
          ] },
          { type: "terms" },
        ],
      },
    ],
  },
  {
    slug: "safe-water-healthy-home",
    topic: "daily-water",
    order: 1,
    title: "Safe Water & a Healthy Home",
    tagline: "Make water safe to drink, save water and power, and cut your waste.",
    emoji: "🚰",
    caps: "Everyday biology (links to CAPS Gr 11 human impact on the environment and microorganisms)",
    objectives: ["Make water safe to drink at home", "Reduce your household water and electricity use", "Reduce, reuse and recycle waste", "Keep a home free of disease-carrying pests"],
    styles: ["kinaesthetic", "read-write"],
    xp: 45,
    terms: [
      { term: "Water purification", def: "Removing harmful microorganisms and chemicals so water is safe to drink." },
      { term: "Grey water", def: "Used water from basins, baths and washing machines that can be reused in the garden (not toilets' water)." },
      { term: "Recycling", def: "Processing used materials (paper, glass, cans, plastic) into new products." },
      { term: "Vector", def: "An animal such as a mosquito, fly or rat that carries pathogens to humans." },
    ],
    chunks: [
      {
        id: "safe",
        title: "Make water safe",
        minutes: 6,
        blocks: [
          { type: "table", headers: ["Method", "How", "Kills"], rows: [
            ["**Boiling**", "Bring to a rolling boil for 1 minute, cool, store covered", "Bacteria, viruses, protists"],
            ["**Bleach**", "1 teaspoon of household bleach (unscented) in 20–25 litres; wait 2 hours", "Most bacteria and viruses"],
            ["**Settling and filtering**", "Let dirty water stand, pour off the clear water and filter through a clean cloth – then boil or treat", "Removes mud – NOT germs on its own"],
            ["**SODIS (solar disinfection)**", "Clear plastic bottles of clear water in full sun for 6 hours", "UV and heat kill many germs"],
          ] },
          { type: "callout", variant: "safety", title: "When to be extra careful", md: "After floods, from rivers and dams, and when your municipality issues a **boil-water notice**. Babies, the elderly and people with HIV are most at risk of diarrhoea." },
        ],
      },
      {
        id: "save",
        title: "Save water and energy (tool)",
        minutes: 8,
        blocks: [
          { type: "widget", widget: "footprint-lab", props: { mode: "water" } },
          { type: "widget", widget: "footprint-lab", props: { mode: "carbon" } },
        ],
      },
      {
        id: "home",
        title: "A healthy home",
        minutes: 5,
        blocks: [
          { type: "keypoints", points: ["Keep food covered and bins closed – flies carry germs from rubbish and faeces to food.", "Empty standing water (old tyres, containers) where mosquitoes breed.", "Keep rats away: no food scraps outside, seal holes.", "Open windows every day – fresh air lowers the spread of TB.", "Separate recyclables – reclaimers and buy-back centres collect paper, cans, glass and plastic."] },
          { type: "quiz", id: "q-water-home", questions: [
            { q: "Filtering cloudy water through a cloth makes it safe to drink.", options: ["True", "False – it removes mud but not germs"], answer: 1, explain: "You still need to boil it or add bleach." },
            { q: "How much bleach treats 20–25 litres of clear water?", options: ["1 cup", "1 teaspoon", "Half the bottle", "None"], answer: 1, explain: "About 1 teaspoon of unscented household bleach; wait 2 hours." },
            { q: "Why empty old containers of standing water?", options: ["They smell", "Mosquitoes breed in them", "They waste space", "They attract bees"], answer: 1, explain: "Mosquito larvae develop in still water." },
          ] },
          { type: "terms" },
        ],
      },
    ],
  },
];
