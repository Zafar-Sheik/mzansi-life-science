/** Careers & vocational learning: where Life Sciences can take you, and how to get there. Not examined. */
import type { Lesson } from "../types";

export const CAREERS: Lesson[] = [
  {
    slug: "health-careers",
    topic: "career-health",
    order: 1,
    title: "Careers in Health & Care",
    tagline: "Nurses, pharmacists, paramedics, therapists – the people who keep Mzansi healthy.",
    emoji: "🩺",
    caps: "Careers (links to CAPS Gr 11–12 human physiology, immunity and reproduction)",
    objectives: ["Describe at least six health careers and what they involve", "Know the different study routes into health work", "Link health careers to the Life Sciences topics they use", "Find out how to get experience before you apply"],
    styles: ["read-write", "kinaesthetic"],
    xp: 50,
    terms: [
      { term: "Community service", def: "A compulsory year that newly qualified health professionals work in public hospitals and clinics." },
      { term: "Internship", def: "Supervised work after a degree before full registration (e.g. for doctors and pharmacists)." },
      { term: "HPCSA", def: "Health Professions Council of South Africa – registers doctors, therapists, radiographers and others." },
      { term: "SANC", def: "South African Nursing Council – registers nurses and midwives." },
      { term: "Job shadowing", def: "Spending a day or more watching someone at work to learn what their job is really like." },
    ],
    chunks: [
      {
        id: "careers",
        title: "Who does what?",
        minutes: 8,
        blocks: [
          { type: "table", headers: ["Career", "Uses which Life Sciences?", "Route"], rows: [
            ["Professional nurse / midwife", "Human reproduction, immunity, the body", "Bachelor of Nursing (4 years) or Diploma (3 years); registered with SANC"],
            ["Medical doctor", "Everything about the human body", "MBChB (6 years) + internship + community service"],
            ["Pharmacist", "Immunity, disease, homeostasis", "BPharm (4 years) + internship"],
            ["Paramedic", "Nervous system, breathing, homeostasis, first aid", "Diploma or degree in Emergency Medical Care"],
            ["Physiotherapist / occupational therapist", "Muscles, nerves, the brain", "4-year degree"],
            ["Dietitian", "Nutrition, diabetes, homeostasis", "BSc Dietetics (4 years)"],
            ["Radiographer", "Anatomy (X-rays, scans)", "4-year degree"],
            ["Community health worker", "Disease, HIV, TB, nutrition", "Short courses, on the job"],
          ] },
          { type: "callout", variant: "real-world", title: "Mzansi needs you", md: "South Africa has far fewer doctors and nurses per person than recommended, especially in rural areas. Many provinces and the national Department of Health offer **bursaries** for health sciences – often in return for working in the public sector afterwards." },
        ],
      },
      {
        id: "explore",
        title: "Explore (tool)",
        minutes: 10,
        blocks: [
          { type: "widget", widget: "career-explorer" },
          { type: "match", id: "health-match", title: "Who would you call?", pairs: [
            { left: "A baby is about to be born at the clinic", right: "Midwife" },
            { left: "A car crash on the N1", right: "Paramedic" },
            { left: "Your gran needs her chronic medication explained", right: "Pharmacist" },
            { left: "A rugby player is learning to walk after a knee operation", right: "Physiotherapist" },
            { left: "A family needs a meal plan for type 2 diabetes", right: "Dietitian" },
          ] },
        ],
      },
      {
        id: "start",
        title: "Start now",
        minutes: 5,
        blocks: [
          { type: "keypoints", points: ["**Volunteer** at a clinic, hospice, old-age home or with a home-based care NGO.", "**Job shadow** a nurse, pharmacist or doctor during the holidays – ask politely by email.", "Do a **first-aid course** (St John or the Red Cross) – it looks great on applications.", "Keep **Life Sciences, Mathematics and Physical Sciences** marks high – most health degrees need all three.", "Apply **early** (often in Grade 12 term 1–2) – health sciences fill up fast."] },
          { type: "quiz", id: "q-health-careers", questions: [
            { q: "Which council registers nurses in South Africa?", options: ["HPCSA", "SANC", "SAPS", "NSFAS"], answer: 1, explain: "The South African Nursing Council." },
            { q: "After their degree, doctors in SA must do…", options: ["nothing more", "an internship and community service", "a learnership", "a TVET course"], answer: 1, explain: "2 years of internship then 1 year of community service." },
            { q: "A good way to find out if you'd like a health career is to…", options: ["guess", "job shadow or volunteer", "only watch TV dramas", "wait until after matric"], answer: 1, explain: "Real experience shows you what the job is like." },
          ] },
          { type: "terms" },
        ],
      },
    ],
  },
  {
    slug: "land-and-nature-careers",
    topic: "career-land",
    order: 1,
    title: "Careers in Farming, Food & Nature",
    tagline: "Feed the country, protect the rhino, guide the tourists.",
    emoji: "🚜",
    caps: "Careers (links to CAPS Gr 11 plants, photosynthesis, population ecology and human impact; Gr 12 genetics and evolution)",
    objectives: ["Describe careers in agriculture, food science and conservation", "Explain how these careers link to food security and the environment", "Know the college, university and on-the-job routes", "Identify entrepreneurship opportunities in agriculture"],
    styles: ["read-write", "kinaesthetic"],
    xp: 50,
    terms: [
      { term: "Agricultural college", def: "A college that trains farmers and farm managers (e.g. diploma courses in agriculture)." },
      { term: "Agri-business", def: "A business in the farming value chain: growing, processing, packaging, selling or supplying farmers." },
      { term: "Field guide", def: "A trained person who leads visitors in nature and teaches them about wildlife and plants." },
      { term: "Food technologist", def: "A scientist who develops, preserves and tests the safety and quality of food." },
    ],
    chunks: [
      {
        id: "careers",
        title: "From soil to safari",
        minutes: 8,
        blocks: [
          { type: "table", headers: ["Career", "Life Sciences you'll use", "Route"], rows: [
            ["Farmer / farm manager", "Photosynthesis, plant reproduction, soil, pests, genetics of livestock", "Agricultural college diploma, degree or on-the-job"],
            ["Agricultural scientist / agronomist", "Plant breeding, GMOs, food security", "BSc Agriculture"],
            ["Veterinarian / animal health technician", "Animal body systems, immunity, disease", "BVSc (Onderstepoort) or Diploma in Animal Health"],
            ["Food scientist / technologist", "Microorganisms, fermentation, nutrition", "Degree or diploma in food science / technology"],
            ["Nature conservation officer / ranger", "Population ecology, biodiversity, alien species", "Diploma or degree in Nature Conservation"],
            ["Field guide", "Animal behaviour, plants, ecology", "Accredited field-guide courses and on-the-job training"],
            ["Horticulturist / landscaper", "Plants, soil, water-wise gardening", "TVET course, learnership or diploma"],
          ] },
          { type: "widget", widget: "career-explorer" },
        ],
      },
      {
        id: "enterprise",
        title: "Start your own",
        minutes: 6,
        blocks: [
          { type: "callout", variant: "life", title: "Green business ideas", md: "Vegetable tunnels, **hydroponics**, mushroom growing (on old straw or coffee grounds), **beekeeping**, **seedling nurseries**, **composting and worm farms**, indigenous plant nurseries, and making amasi or atchar – all use your Life Sciences. Start small, keep records, and look for local agricultural support programmes and co-operatives." },
          { type: "widget", widget: "sorter", props: { id: "green-careers", title: "Which area?", colour: "var(--t-career)", buckets: ["Farming & food", "Conservation & nature"], items: [
            { text: "Breeding drought-tolerant maize", bucket: "Farming & food" }, { text: "Testing yoghurt for bacteria", bucket: "Farming & food" }, { text: "Vaccinating Nguni cattle", bucket: "Farming & food" },
            { text: "Counting rhinos from a helicopter", bucket: "Conservation & nature" }, { text: "Removing alien wattle trees", bucket: "Conservation & nature" }, { text: "Guiding tourists in Kruger", bucket: "Conservation & nature" },
          ] } },
          { type: "quiz", id: "q-land-careers", questions: [
            { q: "Which Life Sciences topic does a game ranger use most?", options: ["Meiosis", "Population ecology", "The ear", "Excretion"], answer: 1, explain: "Counting, managing and protecting populations." },
            { q: "Where can you study to become a vet in South Africa?", options: ["Any TVET college", "Onderstepoort (University of Pretoria)", "A nursing college", "Online only"], answer: 1, explain: "The Faculty of Veterinary Science at Onderstepoort." },
          ] },
          { type: "terms" },
        ],
      },
    ],
  },
  {
    slug: "lab-and-biotech-careers",
    topic: "career-lab",
    order: 1,
    title: "Careers in the Lab, Biotech & Forensics",
    tagline: "Test the blood, build the vaccine, solve the crime.",
    emoji: "🧫",
    caps: "Careers (links to CAPS Gr 12 DNA, genetics, genetic engineering and Gr 11 microorganisms and immunity)",
    objectives: ["Describe laboratory and biotechnology careers", "Explain how DNA technology is used in forensics and medicine", "Know the skills and qualifications labs look for", "Practise basic lab skills and safety"],
    styles: ["kinaesthetic", "read-write"],
    xp: 50,
    terms: [
      { term: "Biotechnology", def: "Using living organisms or their parts (cells, enzymes, DNA) to make products such as medicines, vaccines and food." },
      { term: "Medical technologist", def: "A scientist who tests blood, tissue and other samples to help diagnose disease." },
      { term: "Forensic science", def: "Using science (such as DNA profiling) to investigate crimes." },
      { term: "Aseptic technique", def: "Working in a way that prevents contamination by microorganisms." },
    ],
    chunks: [
      {
        id: "careers",
        title: "Life in the lab",
        minutes: 7,
        blocks: [
          { type: "table", headers: ["Career", "What you'd do", "Route"], rows: [
            ["Medical technologist", "Run blood tests, find TB in sputum, count CD4 cells", "4-year Bachelor of Health Sciences (Medical Laboratory Science)"],
            ["Laboratory assistant", "Prepare samples and media, clean and calibrate equipment", "TVET course or learnership"],
            ["Forensic scientist", "DNA profiling of crime-scene evidence", "BSc (Genetics, Biochemistry, Chemistry) then training"],
            ["Biotechnologist", "Make vaccines, medicines, biofuels, better crops", "BSc Biotechnology / Microbiology / Biochemistry"],
            ["Research scientist", "Discover new knowledge (e.g. HIV and TB research in SA)", "BSc → Honours → Master's → PhD"],
          ] },
          { type: "callout", variant: "real-world", title: "World-class science at home", md: "South African scientists helped identify new COVID-19 variants, lead global HIV and TB research, and run one of the world's largest DNA databases for fighting crime. **You** could be next." },
        ],
      },
      {
        id: "skills",
        title: "Lab skills",
        minutes: 7,
        blocks: [
          { type: "sequence", id: "lab-safety", title: "Starting a practical safely", steps: ["Read the method and identify the hazards", "Put on a lab coat and goggles; tie back long hair", "Check that glassware isn't cracked", "Work neatly and label every container", "Clean up, dispose of waste correctly and wash your hands"], explain: "Labs look for people who are careful, accurate and record everything." },
          { type: "widget", widget: "dna-lab", props: { stage: "replication" } },
          { type: "quiz", id: "q-lab-careers", questions: [
            { q: "Which technique is used to identify suspects from blood at a crime scene?", options: ["Photosynthesis", "DNA profiling", "Dialysis", "Pollination"], answer: 1, explain: "DNA profiling compares band patterns." },
            { q: "Aseptic technique prevents…", options: ["fire", "contamination by microorganisms", "osmosis", "evolution"], answer: 1, explain: "Flaming loops, sterilising equipment and working near a flame keep cultures pure." },
          ] },
          { type: "terms" },
        ],
      },
    ],
  },
  {
    slug: "path-after-matric",
    topic: "career-pathways",
    order: 1,
    title: "Your Path After Matric",
    tagline: "University, TVET, learnerships and bursaries – a plan that fits you.",
    emoji: "🧭",
    caps: "Careers & study planning (APS, NSC pass levels, institutions, funding, applications)",
    objectives: ["Calculate your APS and know your NSC pass level", "Compare universities, universities of technology, TVET colleges and learnerships", "Know the main funding options (NSFAS, bursaries, learnerships)", "Make an application timeline"],
    styles: ["kinaesthetic", "read-write"],
    xp: 55,
    terms: [
      { term: "APS", def: "Admission Point Score – points calculated from your NSC results, used by universities for admission." },
      { term: "Bachelor's pass", def: "The NSC pass that allows you to apply for a degree at a university." },
      { term: "TVET college", def: "A Technical and Vocational Education and Training college – practical, career-focused qualifications." },
      { term: "Learnership", def: "A work-based programme where you study and work at the same time, often with a stipend." },
      { term: "NSFAS", def: "The National Student Financial Aid Scheme – government funding for students at public universities and TVET colleges who qualify." },
      { term: "Bursary", def: "Money for studying that usually doesn't have to be repaid (sometimes in return for working for the funder)." },
    ],
    chunks: [
      {
        id: "aps",
        title: "Your APS (tool)",
        minutes: 8,
        blocks: [
          { type: "widget", widget: "aps-calculator" },
          { type: "callout", variant: "tip", title: "Not there yet?", md: "Your Grade 11 final and Grade 12 June results are what most universities use for provisional admission. There's time to improve – and if a degree isn't possible yet, a **higher certificate** or **diploma** can lead to a degree later." },
        ],
      },
      {
        id: "routes",
        title: "Four routes",
        minutes: 7,
        blocks: [
          { type: "table", headers: ["Route", "Best for", "Examples (Life Sciences)"], rows: [
            ["**University**", "Theory-heavy careers needing a degree", "Medicine, pharmacy, BSc, veterinary science, teaching"],
            ["**University of technology**", "Practical diplomas and degrees", "Biomedical technology, nature conservation, food technology, emergency medical care"],
            ["**TVET college**", "Hands-on, career-focused courses (N certificates, NC(V))", "Primary agriculture, hospitality, laboratory assistance"],
            ["**Learnership / apprenticeship**", "Earning while you learn", "Pharmacist's assistant, laboratory assistant, horticulture"],
          ] },
          { type: "sequence", id: "application-timeline", title: "Your Grade 12 application timeline", steps: [
            "Grade 11: research careers and entry requirements",
            "Start of Grade 12: get application forms and certified copies of your ID and results",
            "Apply to universities and colleges (many close mid-year)",
            "Apply for NSFAS and bursaries (deadlines vary)",
            "Write your final exams – your results confirm your place",
            "Register and arrange accommodation for the new year",
          ], explain: "Late applications are the most common reason good learners miss out – start early." },
        ],
      },
      {
        id: "money",
        title: "Paying for it",
        minutes: 5,
        blocks: [
          { type: "keypoints", points: ["**NSFAS**: for South African students from households below an income threshold, at public universities and TVET colleges.", "**Bursaries**: from government departments (health, agriculture, education – e.g. Funza Lushaka for teachers), companies and universities.", "**Learnerships**: you are paid a stipend while you learn.", "**Scam alert:** real bursaries and NSFAS are **free to apply for**. Never pay anyone to 'secure' funding or a place."] },
          { type: "quiz", id: "q-pathways", questions: [
            { q: "APS is usually calculated from…", options: ["your Grade 9 marks", "your best six subjects, often without Life Orientation", "only Life Sciences", "your age"], answer: 1, explain: "Most universities use six subjects – check each one's rules." },
            { q: "A learnership means you…", options: ["only study theory", "work and study at the same time", "must pay fees first", "need a bachelor's pass"], answer: 1, explain: "Learnerships combine workplace experience with study." },
            { q: "Someone asks for R500 to 'guarantee' your NSFAS funding. You should…", options: ["pay quickly", "refuse – it's a scam", "pay half", "give your ID number"], answer: 1, explain: "NSFAS applications are free." },
          ] },
          { type: "terms" },
        ],
      },
    ],
  },
];
