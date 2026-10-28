/** Scientific skills – examined in both papers in Grades 11 and 12 (CAPS Specific Aim 2). */
import type { Lesson } from "../types";

export const SKILLS: Lesson[] = [
  {
    slug: "scientific-investigations",
    topic: "skills-investigation",
    order: 1,
    title: "Planning a Scientific Investigation",
    tagline: "Hypotheses, variables, controls – the marks hiding in every paper.",
    emoji: "🔬",
    caps: "Specific Aim 2 (Gr 11 & 12): investigating phenomena – aim, hypothesis, variables, planning, controls, reliability, validity, safety and ethics",
    objectives: ["Write an aim and a testable hypothesis", "Identify independent, dependent and controlled variables", "Explain the purpose of a control", "Explain how to improve reliability and validity"],
    styles: ["kinaesthetic", "read-write"],
    xp: 75,
    terms: [
      { term: "Aim", def: "What the investigation sets out to find out, e.g. 'To investigate the effect of temperature on…'." },
      { term: "Hypothesis", def: "A testable prediction of the relationship between the independent and dependent variables." },
      { term: "Independent variable", def: "The variable the investigator deliberately changes." },
      { term: "Dependent variable", def: "The variable that is measured – it changes because of the independent variable." },
      { term: "Controlled (fixed) variables", def: "All other variables that are kept the same so that it is a fair test." },
      { term: "Control", def: "A set-up without the factor being tested, used for comparison." },
      { term: "Reliability", def: "Getting the same results when the investigation is repeated – improved by repeating and by larger samples." },
      { term: "Validity", def: "The investigation tests what it is supposed to test – improved by controlling variables and using a control." },
    ],
    chunks: [
      {
        id: "words",
        title: "The vocabulary",
        minutes: 6,
        blocks: [
          { type: "table", headers: ["Word", "Ask yourself", "Example (light and photosynthesis)"], rows: [
            ["Aim", "What are we finding out?", "To investigate the effect of **light intensity** on the **rate of photosynthesis**"],
            ["Hypothesis", "What do we predict?", "**As light intensity increases, the rate of photosynthesis increases**"],
            ["Independent variable", "What did they **change**?", "Light intensity (distance from the lamp)"],
            ["Dependent variable", "What did they **measure**?", "Number of O₂ bubbles per minute"],
            ["Controlled variables", "What was kept the **same**?", "Temperature, CO₂, same plant, time"],
            ["Control", "What is the comparison?", "The same set-up in the dark"],
          ] },
          { type: "callout", variant: "memory", title: "I change, D depends", md: "**I**ndependent = **I** change it. **D**ependent = **D**ata I collect. The hypothesis always links them: \"If/As [independent] increases, [dependent] will increase/decrease.\"" },
        ],
      },
      {
        id: "planner",
        title: "Plan it (lab)",
        minutes: 12,
        blocks: [
          { type: "widget", widget: "investigation-planner" },
          { type: "practice", id: "p-variables", title: "Name the variables", problems: [
            { q: "Learners measured how quickly yeast produced CO₂ at 10 °C, 20 °C, 30 °C and 40 °C. What is the **independent variable**?", answer: "temperature", hint: "What did they change on purpose?", solution: "**Temperature** – the dependent variable is the volume (or rate) of CO₂ produced." },
            { q: "A learner tests whether fertiliser affects the number of beans produced per plant. What is the **dependent variable**?", answer: "number of beans | number of beans produced | number of beans per plant | the number of beans produced per plant", kind: "word", hint: "What did they count at the end?", solution: "**The number of beans produced per plant**." },
          ] },
        ],
      },
      {
        id: "reliable",
        title: "Reliable, valid and safe",
        minutes: 7,
        blocks: [
          { type: "keypoints", points: [
            "**Reliability:** repeat the investigation, use a **larger sample**, calculate an **average**.",
            "**Validity:** keep all other variables **constant**, include a **control**, use suitable apparatus and an appropriate method.",
            "**Safety:** goggles with chemicals, heat alcohol in a **water bath** (never over a flame), handle glassware carefully, wash hands after handling soil, microbes or animals.",
            "**Ethics:** get **informed consent** from people, keep their data private, never harm animals.",
          ] },
          { type: "exam", question: { id: "ex-skills-1", q: "A learner investigated the effect of exercise on pulse rate using one friend. State TWO ways in which the learner could improve the reliability of the investigation.", marks: 2, level: "evaluating", memo: [
            "Use a larger sample (more learners)", "Repeat the investigation and calculate an average",
          ] } },
          { type: "quiz", id: "q-investigation", questions: [
            { q: "Repeating an investigation improves its…", options: ["validity", "reliability", "hypothesis", "independent variable"], answer: 1, explain: "Repeats show whether the results are consistent." },
            { q: "A control is used to…", options: ["make it faster", "compare results and show that the factor being tested caused the change", "increase the sample", "measure the dependent variable"], answer: 1, explain: "Without a control you can't be sure what caused the result." },
            { q: "Which is a testable hypothesis?", options: ["Plants are nice", "Bean plants given more water will grow taller", "Water is H₂O", "Let's grow beans"], answer: 1, explain: "It links the independent variable (water) to the dependent variable (height)." },
          ] },
          { type: "terms" },
        ],
      },
    ],
  },
  {
    slug: "data-and-graphs",
    topic: "skills-investigation",
    order: 2,
    title: "Tables, Graphs & Data",
    tagline: "Six marks for a graph – learn the rubric and earn them every time.",
    emoji: "📈",
    caps: "Specific Aim 2: recording, presenting and interpreting data – tables, line graphs, bar graphs, histograms, pie charts; trends; calculations (averages, percentages, rates)",
    objectives: ["Draw a table with all the marks", "Choose the correct type of graph", "Draw a graph that earns all 6 rubric marks", "Describe trends and do data calculations"],
    styles: ["visual", "kinaesthetic"],
    xp: 75,
    terms: [
      { term: "Line graph", def: "A graph for continuous data, with points joined by straight lines." },
      { term: "Bar graph", def: "A graph for discontinuous (category) data, with separate bars." },
      { term: "Histogram", def: "A graph for continuous data grouped into class intervals – the bars touch." },
      { term: "Pie chart", def: "A circle divided into sectors that show parts of a whole (percentages)." },
      { term: "Trend", def: "The general pattern in data, e.g. 'as temperature increases, the rate increases up to 37 °C and then decreases'." },
      { term: "Mean (average)", def: "The sum of the values divided by the number of values." },
    ],
    chunks: [
      {
        id: "tables",
        title: "Tables",
        minutes: 5,
        blocks: [
          { type: "keypoints", points: ["A **caption (heading)** that names both variables.", "**Column headings** with **units** (only in the heading, not in every cell).", "The **independent variable in the first column**.", "Values in order (e.g. lowest to highest temperature)."] },
          { type: "callout", variant: "exam", title: "Tabulate the differences", md: "When asked to \"tabulate differences\", draw a table with a caption and column headings: one mark is for the **table format**, the rest for **matched** pairs of differences in the same row." },
        ],
      },
      {
        id: "graphs",
        title: "Graphs (lab)",
        minutes: 12,
        blocks: [
          { type: "widget", widget: "graph-lab" },
          { type: "table", headers: ["Rubric mark", "What the marker looks for"], rows: [
            ["1", "Correct **type** of graph"],
            ["1", "**Caption/heading** naming both variables"],
            ["1", "**X-axis**: correct label and unit (independent variable)"],
            ["1", "**Y-axis**: correct label and unit (dependent variable)"],
            ["1", "Correct, even **scale** on both axes"],
            ["1", "**Plotting**: all points correct (and joined for a line graph)"],
          ] },
        ],
      },
      {
        id: "calc",
        title: "Trends and calculations",
        minutes: 8,
        blocks: [
          { type: "worked", title: "Describing a trend", problem: "Enzyme activity: 10 °C → 1, 20 °C → 2,5, 30 °C → 4, 40 °C → 5,5, 50 °C → 3, 60 °C → 0,5 g/min. Describe the trend.", steps: [
            { md: "**As the temperature increases from 10 °C to 40 °C, the activity of the enzyme increases**", why: "Name both variables and the direction of change." },
            { md: "**…and then decreases from 40 °C to 60 °C.**", why: "Mention every change of direction and where it happens – here the optimum is about 40 °C." },
          ] },
          { type: "worked", title: "Percentage change", problem: "A potato strip had a mass of 25 g. After 30 minutes in salt water its mass was 20 g. Calculate the percentage decrease.", steps: [
            { md: "Change = 25 – 20 = 5 g", why: "Subtract to find the change." },
            { md: "% change = (5 ÷ 25) × 100 = **20%**", why: "Always divide by the **original** value." },
            { md: "The mass decreased because water left the potato cells by **osmosis** into the more concentrated salt solution.", why: "Link the number back to biology." },
          ] },
          { type: "widget", widget: "drill", props: { generators: ["percent-change", "magnification"], title: "Skills calculations" } },
          { type: "quiz", id: "q-graphs", questions: [
            { q: "Which graph shows the number of learners with each blood group?", options: ["Line graph", "Bar graph", "Histogram", "Scatter plot"], answer: 1, explain: "Blood groups are categories (discontinuous data)." },
            { q: "The independent variable goes on the…", options: ["y-axis", "x-axis", "caption only", "legend"], answer: 1, explain: "Independent on the x-axis, dependent on the y-axis." },
            { q: "The bars of a histogram…", options: ["have gaps between them", "touch each other", "are always the same height", "are drawn horizontally"], answer: 1, explain: "Histograms show continuous, grouped data." },
          ] },
          { type: "terms" },
        ],
      },
    ],
  },
  {
    slug: "drawings-and-microscope",
    topic: "skills-investigation",
    order: 3,
    title: "Biological Drawings & Magnification",
    tagline: "Draw it, label it, scale it – and calculate actual size in micrometres.",
    emoji: "✏️",
    caps: "Specific Aim 2: biological drawings and diagrams (line drawings, labels, caption, scale), using a microscope, magnification and scale calculations",
    objectives: ["Make a biological line drawing that earns full marks", "Calculate total magnification", "Calculate actual size and magnification", "Convert between mm and µm"],
    styles: ["visual", "kinaesthetic"],
    xp: 65,
    terms: [
      { term: "Magnification", def: "How many times bigger an image is than the real object: image size ÷ actual size." },
      { term: "Micrometre (µm)", def: "One thousandth of a millimetre: 1 mm = 1 000 µm." },
      { term: "Scale line", def: "A line on a diagram that represents a real length, e.g. a line labelled 10 µm." },
      { term: "Field of view", def: "The circle you see through a microscope – it gets smaller as magnification increases." },
    ],
    chunks: [
      {
        id: "drawings",
        title: "Biological drawings",
        minutes: 6,
        blocks: [
          { type: "keypoints", points: ["Use a **sharp pencil** and **single, clear lines** – no shading or sketching.", "Make it **large** (at least half a page) and in the **correct proportions**.", "Write a **caption/heading** saying what it is and the **magnification** or view (e.g. *transverse section of a leaf ×100*).", "**Label lines** are drawn with a ruler, don't cross, and touch the part. Labels go on one or both sides, not on the drawing.", "Draw only what you **see**, not what the textbook shows."] },
          { type: "diagram", diagram: "leaf", mode: "quiz" },
        ],
      },
      {
        id: "magnification",
        title: "Magnification (lab)",
        minutes: 10,
        blocks: [
          { type: "widget", widget: "microscope-lab" },
          { type: "worked", title: "Actual size", problem: "A drawing of a cheek cell is 30 mm wide. The magnification is ×500. Calculate the actual width in µm.", steps: [
            { md: "Change the image size to µm: 30 mm × 1 000 = **30 000 µm**", why: "Both sizes must be in the same unit." },
            { md: "Actual size = image size ÷ magnification = 30 000 ÷ 500 = **60 µm**", why: "Rearranged from magnification = image ÷ actual." },
          ] },
          { type: "practice", id: "p-magnification", title: "Your turn", problems: [
            { q: "A microscope has a ×10 eyepiece and a ×40 objective. What is the total magnification?", answer: "400", kind: "number", hint: "Multiply the two lenses.", solution: "10 × 40 = **×400**" },
            { q: "Convert **2,5 mm** to micrometres.", answer: "2500", kind: "number", hint: "1 mm = 1 000 µm.", solution: "2,5 × 1 000 = **2 500 µm**" },
            { q: "A pollen grain is 40 µm across. In a diagram it is 20 mm across. What is the magnification?", answer: "500", kind: "number", hint: "20 mm = 20 000 µm. Magnification = image ÷ actual.", solution: "20 000 ÷ 40 = **×500**" },
          ] },
          { type: "quiz", id: "q-microscope", questions: [
            { q: "How many micrometres are in 1 mm?", options: ["10", "100", "1 000", "1 000 000"], answer: 2, explain: "1 mm = 1 000 µm." },
            { q: "When you switch from the ×10 to the ×40 objective, the field of view…", options: ["gets bigger", "gets smaller", "stays the same", "disappears"], answer: 1, explain: "Higher magnification shows a smaller area in more detail." },
          ] },
          { type: "terms" },
        ],
      },
    ],
  },
];
