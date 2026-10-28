/**
 * Schematic, tappable biology diagrams. Every diagram is plain data: SVG paths
 * for each part, the part's name and function, and the point where its letter
 * marker sits (exam diagrams label parts A, B, C…). The diagram widget turns
 * this into an explorer and a "find the part" quiz, so learners who struggle
 * with dense labelled drawings can meet one structure at a time.
 */
import type { DiagramId } from "@/content/types";

export interface DiagramPart {
  id: string;
  name: string;
  /** What it does – one or two short sentences, exam wording. */
  fn: string;
  /** SVG path data (viewBox 0 0 400 300). */
  d: string;
  fill: string;
  /** Draw as a thick line (stroke width) instead of a filled shape. */
  line?: number;
  evenodd?: boolean;
  /** Where the letter marker sits. */
  at: [number, number];
}

export interface Diagram {
  id: DiagramId;
  title: string;
  /** One line about what the diagram shows. */
  intro: string;
  parts: DiagramPart[];
  /** Non-interactive detail drawn on top (outlines, squiggles, arrows). */
  decor?: { d: string; stroke?: string; fill?: string; width?: number; dash?: string }[];
  /** Short text labels drawn on the picture (e.g. "O₂ →"). */
  notes?: { x: number; y: number; text: string; colour?: string }[];
}

// ------------------------------------------------------------------ geometry helpers
const C = (cx: number, cy: number, r: number) => `M${cx - r},${cy}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`;
const E = (cx: number, cy: number, rx: number, ry: number) => `M${cx - rx},${cy}a${rx},${ry} 0 1,0 ${2 * rx},0a${rx},${ry} 0 1,0 ${-2 * rx},0Z`;
const R = (x: number, y: number, w: number, h: number) => `M${x},${y}h${w}v${h}h${-w}Z`;
const ring = (cx: number, cy: number, r1: number, r2: number) => C(cx, cy, r1) + C(cx, cy, r2);
const ringE = (cx: number, cy: number, rx: number, ry: number, t: number) => E(cx, cy, rx, ry) + E(cx, cy, rx - t, ry - t);
const RR = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r},${y}h${w - 2 * r}a${r},${r} 0 0,1 ${r},${r}v${h - 2 * r}a${r},${r} 0 0,1 ${-r},${r}h${-(w - 2 * r)}a${r},${r} 0 0,1 ${-r},${-r}v${-(h - 2 * r)}a${r},${r} 0 0,1 ${r},${-r}Z`;
const pt = (cx: number, cy: number, r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
};
/** An annular sector (a curved band) from angle a0 to a1 (degrees, clockwise, 0 = right). */
const band = (cx: number, cy: number, r1: number, r2: number, a0: number, a1: number) => {
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M${pt(cx, cy, r1, a0)}A${r1},${r1} 0 ${large},1 ${pt(cx, cy, r1, a1)}L${pt(cx, cy, r2, a1)}A${r2},${r2} 0 ${large},0 ${pt(cx, cy, r2, a0)}Z`;
};
const many = (...ds: string[]) => ds.join("");

// ------------------------------------------------------------------ the diagrams
export const DIAGRAMS: Record<DiagramId, Diagram> = {
  eye: {
    id: "eye",
    title: "The human eye (horizontal section)",
    intro: "Light passes through the cornea, aqueous humour, pupil, lens and vitreous humour, and is focused on the retina.",
    parts: [
      { id: "vitreous", name: "Vitreous humour", fn: "Jelly-like substance that keeps the eyeball in shape and refracts light onto the retina.", d: E(246, 150, 70, 92), fill: "#e0f7fa", at: [250, 165] },
      { id: "sclera", name: "Sclera", fn: "Tough, white outer layer that protects the eye, keeps its shape and is where the eye muscles attach.", d: band(220, 150, 118, 111, -148, 148), fill: "#d4d4d8", at: [293, 62] },
      { id: "choroid", name: "Choroid", fn: "Dark, pigmented layer full of blood vessels: it nourishes the retina and absorbs stray light so it isn't reflected inside the eye.", d: band(220, 150, 111, 105, -145, 145), fill: "#92400e", at: [314, 95] },
      { id: "retina", name: "Retina", fn: "Inner layer with the photoreceptors – rods (dim light, black and white) and cones (bright light, colour) – that turn light into nerve impulses.", d: band(220, 150, 105, 98, -140, 140), fill: "#fb923c", at: [306, 205] },
      { id: "cornea", name: "Cornea", fn: "Transparent front part of the sclera that lets light in and refracts (bends) it towards the lens.", d: "M120,86Q60,150 120,214L127,209Q72,150 127,91Z", fill: "#7dd3fc", at: [93, 150] },
      { id: "aqueous", name: "Aqueous humour", fn: "Watery fluid in front of the lens: keeps the front of the eye in shape, refracts light and feeds the cornea and lens.", d: "M127,91Q72,150 127,209L146,203L146,97Z", fill: "#dbeafe", at: [118, 180] },
      { id: "ciliary", name: "Ciliary body (ciliary muscles)", fn: "Contains the ciliary muscles: they contract and relax to change the shape of the lens (accommodation).", d: many(E(150, 88, 7, 11), E(150, 212, 7, 11)), fill: "#a855f7", at: [150, 88] },
      { id: "ligaments", name: "Suspensory ligaments", fn: "Hold the lens in place and connect it to the ciliary body. Tight = thin lens (far vision); slack = round lens (near vision).", d: "M156,94L171,113L168,115L153,97ZM156,206L171,187L168,185L153,203Z", fill: "#475569", at: [163, 104] },
      { id: "lens", name: "Lens", fn: "Transparent, elastic and biconvex: changes shape to focus light exactly on the retina.", d: E(172, 150, 13, 40), fill: "#bae6fd", at: [174, 150] },
      { id: "iris", name: "Iris", fn: "Coloured, muscular ring (circular and radial muscles) that changes the size of the pupil to control how much light enters.", d: many(R(147, 97, 7, 39), R(147, 164, 7, 39)), fill: "#1d4ed8", at: [150, 116] },
      { id: "pupil", name: "Pupil", fn: "The opening in the middle of the iris through which light enters the eye.", d: R(147, 136, 7, 28), fill: "#0f172a", at: [150, 150] },
      { id: "yellow-spot", name: "Yellow spot (fovea)", fn: "Part of the retina with only cones, packed tightly: the place of sharpest, colour vision.", d: E(318, 150, 4, 8), fill: "#facc15", at: [318, 150] },
      { id: "optic-nerve", name: "Optic nerve", fn: "Carries impulses from the retina to the occipital lobe of the cerebrum, where they are interpreted as sight.", d: "M309,183L391,221L384,235L303,197Z", fill: "#fde68a", at: [360, 218] },
      { id: "blind-spot", name: "Blind spot", fn: "Where the optic nerve leaves the eye: no rods or cones, so no image forms here.", d: C(306, 191, 5), fill: "#0f172a", at: [306, 191] },
    ],
  },

  ear: {
    id: "ear",
    title: "The human ear",
    intro: "Sound waves travel through the outer and middle ear as vibrations, and are changed into nerve impulses in the cochlea. The inner ear also controls balance.",
    parts: [
      { id: "pinna", name: "Pinna (outer ear)", fn: "Collects sound waves and directs them into the ear canal.", d: "M40,60C5,95 5,205 45,240C62,252 72,228 62,200C55,180 58,160 72,152L72,138C60,128 72,80 40,60Z", fill: "#fcd5b5", at: [30, 105] },
      { id: "canal", name: "Ear canal (external auditory meatus)", fn: "Carries sound waves to the eardrum. Hairs and wax trap dust and germs.", d: R(72, 136, 96, 18), fill: "#fef3c7", at: [115, 145] },
      { id: "eardrum", name: "Eardrum (tympanic membrane)", fn: "Thin membrane that vibrates when sound waves hit it, passing the vibrations to the ossicles.", d: E(170, 145, 3.5, 24), fill: "#f472b6", at: [166, 166] },
      { id: "middle-ear", name: "Middle ear cavity", fn: "Air-filled space containing the three ossicles.", d: R(174, 108, 56, 80), fill: "#f1f5f9", at: [200, 176] },
      { id: "hammer", name: "Hammer (malleus)", fn: "First ossicle: picks up vibrations from the eardrum. The ossicles amplify the vibrations.", d: "M175,126L190,113L198,119L181,140Z", fill: "#a8a29e", at: [184, 133] },
      { id: "anvil", name: "Anvil (incus)", fn: "Middle ossicle: passes the vibrations from the hammer to the stirrup.", d: "M197,113L212,111L214,125L200,127Z", fill: "#78716c", at: [205, 104] },
      { id: "stirrup", name: "Stirrup (stapes)", fn: "Last ossicle: pushes on the oval window, passing amplified vibrations into the inner ear.", d: "M212,122L229,126L229,138L214,134Z", fill: "#57534e", at: [222, 146] },
      { id: "oval-window", name: "Oval window", fn: "Membrane that passes vibrations from the stirrup to the fluid (perilymph) of the cochlea.", d: E(232, 132, 3, 9), fill: "#ec4899", at: [242, 140] },
      { id: "round-window", name: "Round window", fn: "Membrane that bulges outwards to release the pressure of the vibrations in the cochlea.", d: E(232, 168, 3, 7), fill: "#db2777", at: [233, 168] },
      { id: "eustachian", name: "Eustachian tube", fn: "Connects the middle ear to the pharynx (throat) and equalises the air pressure on both sides of the eardrum.", d: "M188,188L208,188L170,292L150,292Z", fill: "#fcd5b5", at: [176, 250] },
      { id: "vestibule", name: "Sacculus and utriculus (vestibule)", fn: "Contain maculae that detect changes in the position of the head (gravity) – static balance.", d: E(262, 140, 22, 19), fill: "#bfdbfe", at: [262, 142] },
      { id: "canals", name: "Semicircular canals", fn: "Three canals at right angles with cristae that detect changes in the speed and direction of movement – dynamic balance.", d: many(ring(268, 82, 20, 14), ring(305, 66, 20, 14), ring(326, 103, 17, 11)), fill: "#60a5fa", evenodd: true, at: [305, 48] },
      { id: "cochlea", name: "Cochlea", fn: "Coiled, fluid-filled tube containing the organ of Corti: its hair cells change vibrations into nerve impulses (hearing).", d: C(300, 205, 34), fill: "#c4b5fd", at: [300, 205] },
      { id: "auditory-nerve", name: "Auditory nerve", fn: "Carries impulses from the cochlea (and balance organs) to the brain – the temporal lobe of the cerebrum interprets sound.", d: "M328,184L396,156L399,171L333,200Z", fill: "#fde68a", at: [372, 172] },
    ],
    decor: [{ d: "M300,205m-6,0a6,6 0 1,1 12,0a12,12 0 1,1 -24,0a18,18 0 1,1 36,0a24,24 0 1,1 -48,0", stroke: "#6d28d9", width: 1.5 }],
  },

  brain: {
    id: "brain",
    title: "The human brain (side view, front to the left)",
    intro: "The brain and spinal cord form the central nervous system.",
    parts: [
      { id: "cerebrum", name: "Cerebrum", fn: "The largest part, with two hemispheres: thinking, memory, intelligence, language, interpreting sensations and controlling voluntary actions.", d: "M60,170C40,90 120,30 210,35C300,40 360,100 345,170C330,195 290,200 250,190C200,185 150,195 110,200C80,200 65,190 60,170Z", fill: "#fbcfe8", at: [190, 80] },
      { id: "corpus-callosum", name: "Corpus callosum", fn: "Band of nerve fibres that joins the left and right cerebral hemispheres so they can communicate.", d: "M118,152C150,124 252,118 292,150C262,138 160,140 126,160Z", fill: "#f472b6", at: [205, 132] },
      { id: "hypothalamus", name: "Hypothalamus", fn: "Controls body temperature, hunger and thirst, makes ADH, and controls the pituitary gland – the link between the nervous and endocrine systems.", d: E(175, 190, 15, 9), fill: "#fca5a5", at: [175, 190] },
      { id: "pituitary", name: "Pituitary gland (hypophysis)", fn: "The 'master gland': secretes hormones such as GH, TSH, FSH, LH and prolactin that control other glands.", d: many("M170,198L174,198L174,206L170,206Z", E(172, 214, 9, 8)), fill: "#ef4444", at: [172, 216] },
      { id: "cerebellum", name: "Cerebellum", fn: "Coordinates muscle movements and keeps balance and posture.", d: "M255,200C270,185 330,180 345,205C350,230 300,250 270,240C250,232 245,215 255,200Z", fill: "#c4b5fd", at: [300, 215] },
      { id: "medulla", name: "Medulla oblongata", fn: "Controls involuntary actions: heartbeat, breathing rate, blood pressure, swallowing, coughing and peristalsis.", d: "M215,198L245,198L242,250L218,250Z", fill: "#fde68a", at: [230, 225] },
      { id: "spinal-cord", name: "Spinal cord", fn: "Carries impulses between the brain and the body, and is the centre for reflex actions.", d: "M218,250L242,250L240,298L220,298Z", fill: "#fef08a", at: [230, 278] },
    ],
    decor: [{ d: "M100,110C120,90 140,120 160,95C180,75 200,110 220,85C245,70 260,105 290,95M90,150C110,135 130,160 150,140", stroke: "#be185d", width: 1.2 }],
  },

  neuron: {
    id: "neuron",
    title: "A motor neuron",
    intro: "Impulses travel from the dendrites, through the cell body and along the axon to the axon terminals.",
    parts: [
      { id: "dendrites", name: "Dendrites", fn: "Branches that receive impulses and carry them towards the cell body.", d: "M48,135L15,110L18,106L52,130ZM50,168L12,190L15,195L54,172ZM60,124L45,90L50,88L66,122ZM62,177L50,212L55,214L68,178Z", fill: "#f472b6", at: [28, 112] },
      { id: "cell-body", name: "Cell body", fn: "Contains the nucleus and cytoplasm; it keeps the neuron alive.", d: C(70, 150, 28), fill: "#fbcfe8", at: [88, 128] },
      { id: "nucleus", name: "Nucleus", fn: "Controls the activities of the neuron.", d: C(70, 150, 10), fill: "#db2777", at: [70, 150] },
      { id: "axon", name: "Axon", fn: "Long extension that carries impulses away from the cell body.", d: R(98, 146, 222, 8), fill: "#fde68a", at: [307, 150] },
      { id: "myelin", name: "Myelin sheath", fn: "Fatty layer that insulates the axon and speeds up the impulse.", d: many(R(110, 139, 42, 22), R(157, 139, 42, 22), R(204, 139, 42, 22), R(251, 139, 42, 22)), fill: "#fef3c7", at: [178, 150] },
      { id: "nodes", name: "Node of Ranvier", fn: "Gaps in the myelin sheath: the impulse jumps from node to node, so it travels faster.", d: many(R(152, 143, 5, 14), R(199, 143, 5, 14), R(246, 143, 5, 14)), fill: "#f59e0b", at: [154, 150] },
      { id: "terminals", name: "Axon terminals (synaptic knobs)", fn: "Release neurotransmitters into the synapse to pass the impulse to the next neuron or to an effector.", d: many("M318,146L360,120L363,124L322,150ZM318,154L360,180L357,184L320,150ZM318,148L368,148L368,153L318,153Z", C(362, 120, 6), C(360, 183, 6), C(372, 150, 6)), fill: "#a855f7", at: [362, 120] },
    ],
    notes: [{ x: 160, y: 205, text: "direction of impulse →", colour: "#be185d" }],
  },

  "reflex-arc": {
    id: "reflex-arc",
    title: "A reflex arc (spinal cord in cross-section)",
    intro: "Stimulus → receptor → sensory neuron → interneuron → motor neuron → effector → response. The brain is not involved in the quick response.",
    parts: [
      { id: "white", name: "White matter", fn: "Outer part of the spinal cord made of myelinated axons – carries impulses up and down the cord.", d: C(290, 110, 62), fill: "#fef9c3", at: [335, 70] },
      { id: "grey", name: "Grey matter", fn: "Inner, butterfly-shaped part with cell bodies, interneurons and synapses.", d: "M258,78C280,96 300,96 322,78L327,144C306,126 274,126 253,144Z", fill: "#d6d3d1", at: [318, 92] },
      { id: "canal", name: "Central canal", fn: "Contains cerebrospinal fluid.", d: C(290, 112, 4), fill: "#0f172a", at: [290, 112] },
      { id: "ganglion", name: "Dorsal root ganglion", fn: "Swelling on the dorsal root that contains the cell bodies of the sensory neurons.", d: E(212, 72, 14, 10), fill: "#fca5a5", at: [212, 72] },
      { id: "receptor", name: "Receptor (in the skin)", fn: "Detects the stimulus (e.g. heat or pain) and changes it into a nerve impulse.", d: E(40, 250, 14, 10), fill: "#f472b6", at: [40, 250] },
      { id: "sensory", name: "Sensory neuron", fn: "Carries the impulse from the receptor to the spinal cord (through the dorsal root).", d: "M50,244L205,66L284,92L284,98L205,74L56,250Z", fill: "#ef4444", at: [128, 156] },
      { id: "interneuron", name: "Interneuron (connector neuron)", fn: "In the grey matter: passes the impulse from the sensory neuron to the motor neuron.", d: "M282,95L302,124L298,127L278,98Z", fill: "#f59e0b", at: [304, 128] },
      { id: "motor", name: "Motor neuron", fn: "Carries the impulse from the spinal cord to the effector (through the ventral root).", d: "M298,126L240,170L112,270L118,276L244,176L302,130Z", fill: "#2563eb", at: [178, 222] },
      { id: "effector", name: "Effector (muscle)", fn: "Responds to the impulse – the muscle contracts and pulls the hand away.", d: E(95, 282, 26, 12), fill: "#fb7185", at: [95, 282] },
    ],
    notes: [{ x: 15, y: 225, text: "stimulus 🔥", colour: "#dc2626" }, { x: 255, y: 30, text: "dorsal (back)", colour: "#64748b" }, { x: 255, y: 195, text: "ventral (front)", colour: "#64748b" }],
  },

  nephron: {
    id: "nephron",
    title: "A nephron and its blood supply",
    intro: "Urine is formed by ultrafiltration in the glomerulus, then tubular reabsorption and tubular secretion along the tubule.",
    parts: [
      { id: "capsule", name: "Bowman's capsule", fn: "Cup-shaped structure around the glomerulus that collects the filtrate.", d: band(80, 70, 33, 25, 35, 325), fill: "#fde68a", at: [50, 70] },
      { id: "glomerulus", name: "Glomerulus", fn: "Knot of capillaries where ultrafiltration happens: high pressure forces water, glucose, salts and urea out of the blood.", d: C(80, 70, 20), fill: "#ef4444", at: [80, 70] },
      { id: "afferent", name: "Afferent arteriole", fn: "Brings blood to the glomerulus. It is wider than the efferent arteriole, which builds up the high pressure for ultrafiltration.", d: "M100,61L170,38L173,47L102,70Z", fill: "#dc2626", at: [140, 49] },
      { id: "efferent", name: "Efferent arteriole", fn: "Carries blood away from the glomerulus. It is narrower, which keeps the pressure high.", d: "M100,79L168,96L166,102L98,85Z", fill: "#b91c1c", at: [140, 92] },
      { id: "pct", name: "Proximal convoluted tubule", fn: "Reabsorbs all glucose and amino acids, most water and salts back into the blood. Its cells have many mitochondria and microvilli.", d: "M80,103C80,130 130,122 140,140C150,160 110,172 130,190C150,206 192,172 200,140", fill: "#f59e0b", line: 9, at: [138, 142] },
      { id: "loop", name: "Loop of Henle", fn: "Reabsorbs water and salts, which helps make concentrated urine.", d: "M200,140L205,270C207,292 233,292 235,270L240,140", fill: "#0ea5e9", line: 9, at: [220, 287] },
      { id: "dct", name: "Distal convoluted tubule", fn: "Reabsorbs more water (ADH) and sodium (aldosterone); secretes H⁺, K⁺ and drugs to control blood pH (tubular secretion).", d: "M240,140C250,100 300,130 290,90C285,60 320,60 330,80", fill: "#22c55e", line: 9, at: [290, 92] },
      { id: "collecting", name: "Collecting duct", fn: "Reabsorbs water under the control of ADH, and carries urine to the renal pelvis.", d: "M330,80L330,296", fill: "#8b5cf6", line: 12, at: [330, 210] },
      { id: "capillaries", name: "Capillary network (peritubular capillaries)", fn: "Wrap around the tubule and take back the reabsorbed substances into the blood.", d: "M168,100C190,124 255,200 272,255", fill: "#f87171", line: 4, at: [252, 210] },
    ],
    decor: [{ d: "M66,62c6,-8 12,8 18,0s10,8 14,2M64,76c6,8 12,-8 18,0s10,-6 14,0", stroke: "#7f1d1d", width: 1.4 }],
  },

  kidney: {
    id: "kidney",
    title: "The kidney (longitudinal section)",
    intro: "Each kidney has about a million nephrons. Blood comes in through the renal artery and urine leaves through the ureter.",
    parts: [
      { id: "cortex", name: "Cortex", fn: "Outer region that contains the glomeruli, Bowman's capsules and convoluted tubules.", d: "M200,30C110,25 60,90 70,160C80,240 150,285 210,270C260,255 255,210 235,190C225,175 225,125 235,110C255,85 265,35 200,30Z", fill: "#fca5a5", at: [104, 90] },
      { id: "medulla", name: "Medulla (renal pyramids)", fn: "Inner region with the loops of Henle and the collecting ducts, arranged in pyramids.", d: "M150,88L205,118L140,130ZM118,148L195,150L124,186ZM150,216L204,180L144,236Z", fill: "#ef4444", at: [150, 150] },
      { id: "pelvis", name: "Renal pelvis", fn: "Funnel-shaped space that collects urine from the collecting ducts.", d: "M200,120C215,110 230,110 245,125L250,175C235,190 215,190 200,180C210,160 210,140 200,120Z", fill: "#fde68a", at: [225, 150] },
      { id: "ureter", name: "Ureter", fn: "Carries urine from the kidney to the bladder by peristalsis.", d: "M236,178L252,182L250,298L236,298Z", fill: "#fef08a", at: [243, 250] },
      { id: "artery", name: "Renal artery", fn: "Brings oxygenated blood, rich in urea and other wastes, to the kidney.", d: "M245,133L330,118L332,128L247,143Z", fill: "#dc2626", at: [300, 124] },
      { id: "vein", name: "Renal vein", fn: "Carries filtered, deoxygenated blood away from the kidney.", d: "M246,158L332,166L330,177L244,168Z", fill: "#2563eb", at: [300, 170] },
      { id: "renal-capsule", name: "Renal capsule", fn: "Tough outer membrane that protects the kidney.", d: "M200,30C110,25 60,90 70,160C80,240 150,285 210,270", fill: "#7c2d12", line: 4, at: [70, 160] },
    ],
  },

  alveolus: {
    id: "alveolus",
    title: "An alveolus and its blood capillary",
    intro: "Oxygen diffuses from the air in the alveolus into the blood; carbon dioxide diffuses the other way.",
    parts: [
      { id: "bronchiole", name: "Bronchiole", fn: "Small tube that carries air to and from the alveoli.", d: R(20, 135, 125, 30), fill: "#fde68a", at: [60, 150] },
      { id: "capillary", name: "Blood capillary", fn: "Network around each alveolus: blood flowing through keeps the concentration gradient steep.", d: band(220, 150, 100, 86, -60, 200), fill: "#fca5a5", at: [313, 150] },
      { id: "air", name: "Alveolus (air space)", fn: "Tiny air sac. Millions of them give the lungs a huge surface area for gaseous exchange.", d: C(220, 150, 70), fill: "#eff6ff", at: [220, 150] },
      { id: "wall", name: "Alveolar wall", fn: "Only one cell thick (squamous epithelium), so gases diffuse a very short distance.", d: ring(220, 150, 80, 75), fill: "#3b82f6", evenodd: true, at: [163, 93] },
      { id: "moisture", name: "Film of moisture", fn: "Lines the alveolus so that oxygen can dissolve before it diffuses into the blood.", d: ring(220, 150, 75, 70), fill: "#67e8f9", evenodd: true, at: [220, 78] },
      { id: "rbc", name: "Red blood cell", fn: "Contains haemoglobin, which picks up oxygen to form oxyhaemoglobin.", d: many(E(308, 112, 6, 4), E(301, 192, 6, 4), E(250, 238, 6, 4), E(170, 236, 6, 4)), fill: "#b91c1c", at: [308, 112] },
    ],
    notes: [{ x: 238, y: 140, text: "O₂ →", colour: "#1d4ed8" }, { x: 238, y: 168, text: "← CO₂", colour: "#b91c1c" }],
  },

  digestive: {
    id: "digestive",
    title: "The human digestive system",
    intro: "Food is ingested, digested, absorbed, assimilated and the waste egested.",
    parts: [
      { id: "mouth", name: "Mouth (buccal cavity)", fn: "Ingestion; teeth chew food (mechanical digestion) and salivary amylase starts digesting starch.", d: E(200, 22, 26, 12), fill: "#fda4af", at: [200, 22] },
      { id: "salivary", name: "Salivary glands", fn: "Secrete saliva with salivary amylase and mucus.", d: many(E(160, 30, 10, 8), E(240, 30, 10, 8)), fill: "#fdba74", at: [160, 30] },
      { id: "oesophagus", name: "Oesophagus", fn: "Muscular tube that moves food to the stomach by peristalsis.", d: R(193, 34, 14, 70), fill: "#fecaca", at: [200, 70] },
      { id: "liver", name: "Liver", fn: "Makes bile, stores glycogen, deaminates amino acids into urea, breaks down alcohol and poisons (detoxification).", d: "M110,100C130,85 200,90 215,105L205,140C170,150 130,145 110,130Z", fill: "#b45309", at: [150, 115] },
      { id: "gall", name: "Gall bladder", fn: "Stores bile and releases it into the duodenum to emulsify fats.", d: E(165, 146, 10, 8), fill: "#84cc16", at: [165, 146] },
      { id: "stomach", name: "Stomach", fn: "Churns food and secretes gastric juice: HCl kills germs and pepsin starts protein digestion.", d: "M204,104C232,100 270,105 275,135C278,165 240,175 222,160C212,152 208,130 204,104Z", fill: "#fda4af", at: [248, 135] },
      { id: "pancreas", name: "Pancreas", fn: "Secretes pancreatic juice (amylase, trypsin, lipase) into the duodenum, and insulin and glucagon into the blood.", d: "M226,172C245,168 265,170 288,175L286,184C262,181 245,180 228,182Z", fill: "#fde047", at: [260, 178] },
      { id: "duodenum", name: "Duodenum", fn: "First part of the small intestine: bile and pancreatic juice are added here.", d: "M222,160C200,168 196,192 214,200L228,197C214,190 212,178 230,170Z", fill: "#fecdd3", at: [210, 186] },
      { id: "colon", name: "Large intestine (colon)", fn: "Absorbs water and mineral salts from the undigested food, forming faeces.", d: "M128,280L128,205L286,205L286,280L272,280L272,217L142,217L142,280Z", fill: "#fdba74", at: [135, 240] },
      { id: "ileum", name: "Small intestine (ileum)", fn: "Completes digestion and absorbs the digested food through millions of villi.", d: E(207, 248, 55, 24), fill: "#fecdd3", at: [207, 248] },
      { id: "appendix", name: "Appendix", fn: "Small dead-end tube at the start of the large intestine – no digestive function in humans.", d: "M135,280L131,296L138,296L141,280Z", fill: "#f97316", at: [136, 291] },
      { id: "rectum", name: "Rectum", fn: "Stores faeces until they are egested.", d: R(272, 280, 14, 11), fill: "#fb923c", at: [279, 285] },
      { id: "anus", name: "Anus", fn: "Opening through which faeces leave the body (egestion), controlled by sphincter muscles.", d: E(279, 295, 7, 3), fill: "#9a3412", at: [292, 296] },
    ],
    decor: [{ d: "M162,248c8,-14 16,14 24,0s16,14 24,0s16,14 24,0M170,262c8,-10 16,10 24,0s16,10 24,0", stroke: "#be123c", width: 1.4 }],
  },

  flower: {
    id: "flower",
    title: "A flower (longitudinal section)",
    intro: "The stamen (anther + filament) is the male part; the carpel (stigma + style + ovary) is the female part.",
    parts: [
      { id: "peduncle", name: "Flower stalk (peduncle)", fn: "Holds the flower up so that pollinators can reach it.", d: R(193, 260, 14, 38), fill: "#65a30d", at: [200, 282] },
      { id: "receptacle", name: "Receptacle", fn: "Swollen tip of the stalk to which all the flower parts are attached.", d: "M170,250C180,235 220,235 230,250L222,262L178,262Z", fill: "#84cc16", at: [212, 254] },
      { id: "sepals", name: "Sepals", fn: "Green leaf-like parts that protect the flower when it is a bud.", d: "M175,245C140,235 120,215 115,200C140,212 160,225 182,238ZM225,245C260,235 280,215 285,200C260,212 240,225 218,238Z", fill: "#4d7c0f", at: [132, 214] },
      { id: "petals", name: "Petals", fn: "Brightly coloured and often scented to attract insect or bird pollinators.", d: "M180,240C120,200 90,140 110,95C140,130 170,190 190,236ZM220,240C280,200 310,140 290,95C260,130 230,190 210,236Z", fill: "#f9a8d4", at: [116, 125] },
      { id: "filament", name: "Filament", fn: "Stalk that holds the anther up.", d: "M168,236L150,134L155,133L173,235ZM232,236L250,134L245,133L227,235Z", fill: "#facc15", at: [160, 185] },
      { id: "anther", name: "Anther", fn: "Produces pollen grains (by meiosis), which contain the male gametes.", d: many(E(150, 124, 8, 13), E(250, 124, 8, 13)), fill: "#f59e0b", at: [250, 124] },
      { id: "ovary", name: "Ovary", fn: "Contains the ovules. After fertilisation it becomes the fruit.", d: E(200, 216, 22, 24), fill: "#a3e635", at: [185, 202] },
      { id: "ovule", name: "Ovule", fn: "Contains the female gamete (egg cell). After fertilisation it becomes the seed.", d: many(C(195, 212, 5), C(208, 224, 5), C(196, 228, 5)), fill: "#fef9c3", at: [208, 224] },
      { id: "style", name: "Style", fn: "Stalk that holds the stigma up; the pollen tube grows down through it to the ovary.", d: R(196, 122, 8, 72), fill: "#bef264", at: [200, 162] },
      { id: "stigma", name: "Stigma", fn: "Sticky tip that receives pollen during pollination.", d: E(200, 116, 13, 7), fill: "#4d7c0f", at: [200, 112] },
    ],
    decor: [{ d: `${C(140, 104, 2)}${C(146, 98, 2)}${C(258, 100, 2)}${C(264, 107, 2)}`, fill: "#f59e0b" }],
  },

  leaf: {
    id: "leaf",
    title: "A leaf (transverse section)",
    intro: "The leaf is adapted for photosynthesis: a large surface, thin, many chloroplasts in the palisade layer, air spaces and stomata for gas exchange.",
    parts: [
      { id: "cuticle", name: "Cuticle", fn: "Waxy, waterproof layer that reduces water loss. It is transparent so light passes through.", d: R(20, 40, 360, 6), fill: "#fef08a", at: [50, 43] },
      { id: "upper-epidermis", name: "Upper epidermis", fn: "One layer of transparent cells with no chloroplasts – lets light through and protects the leaf.", d: R(20, 46, 360, 16), fill: "#d9f99d", at: [90, 54] },
      { id: "palisade", name: "Palisade mesophyll", fn: "Tall, tightly packed cells with the most chloroplasts – the main site of photosynthesis.", d: many(...Array.from({ length: 12 }, (_, i) => R(22 + i * 30, 63, 26, 58))), fill: "#22c55e", at: [125, 92] },
      { id: "air-spaces", name: "Intercellular air spaces", fn: "Let CO₂ diffuse to the cells and O₂ diffuse out to the stomata.", d: R(20, 124, 360, 95), fill: "#f0fdf4", at: [118, 150] },
      { id: "spongy", name: "Spongy mesophyll", fn: "Loosely packed cells with fewer chloroplasts and large air spaces between them for gas exchange.", d: many(...[40, 85, 150, 205, 340].map((x) => E(x, 145, 18, 14)), ...[60, 115, 175, 230, 320, 360].map((x) => E(x, 195, 18, 14))), fill: "#86efac", at: [85, 145] },
      { id: "vein", name: "Vascular bundle (vein)", fn: "Transports water and minerals in (xylem) and food out (phloem); also supports the leaf.", d: E(272, 170, 38, 34), fill: "#fde68a", at: [298, 156] },
      { id: "xylem", name: "Xylem", fn: "Brings water (a raw material for photosynthesis) and minerals to the leaf.", d: C(272, 160, 12), fill: "#a16207", at: [272, 160] },
      { id: "phloem", name: "Phloem", fn: "Carries the food (sugars) made in photosynthesis to the rest of the plant.", d: E(272, 189, 17, 8), fill: "#ca8a04", at: [272, 189] },
      { id: "lower-epidermis", name: "Lower epidermis", fn: "Protective bottom layer with many stomata.", d: R(20, 220, 360, 14), fill: "#d9f99d", at: [60, 227] },
      { id: "guard", name: "Guard cells", fn: "Bean-shaped cells with chloroplasts that open and close the stoma.", d: many(E(141, 227, 8, 7), E(159, 227, 8, 7)), fill: "#15803d", at: [141, 227] },
      { id: "stoma", name: "Stoma", fn: "Pore through which CO₂ enters and O₂ and water vapour leave the leaf.", d: R(148, 221, 4, 13), fill: "#0f172a", at: [150, 244] },
    ],
    decor: [{ d: Array.from({ length: 12 }, (_, i) => `${C(30 + i * 30, 80, 2.5)}${C(40 + i * 30, 100, 2.5)}`).join(""), fill: "#14532d" }],
  },

  chloroplast: {
    id: "chloroplast",
    title: "A chloroplast",
    intro: "Photosynthesis happens in chloroplasts: the light phase in the grana, the dark phase in the stroma.",
    parts: [
      { id: "membrane", name: "Double membrane", fn: "Two membranes surround the chloroplast and control what enters and leaves.", d: ringE(200, 150, 160, 100, 10), fill: "#15803d", evenodd: true, at: [200, 55] },
      { id: "stroma", name: "Stroma", fn: "Gel-like fluid with enzymes: the site of the dark phase (light-independent reactions), where CO₂ is used to make glucose.", d: E(200, 150, 150, 90), fill: "#dcfce7", at: [300, 195] },
      { id: "lamellae", name: "Lamellae", fn: "Membranes that connect the grana to each other.", d: "M140,132L180,117M220,117L260,142M190,192L260,152", fill: "#4ade80", line: 4, at: [160, 124] },
      { id: "grana", name: "Granum (stack of thylakoids)", fn: "Stacks of thylakoid discs containing chlorophyll: the site of the light phase (photolysis and ATP formation).", d: many(R(100, 112, 40, 40), R(180, 97, 40, 40), R(260, 122, 40, 40), R(150, 172, 40, 40)), fill: "#16a34a", at: [120, 132] },
      { id: "starch", name: "Starch grain", fn: "Glucose made in photosynthesis is stored temporarily as starch.", d: E(255, 205, 22, 12), fill: "#fef3c7", at: [255, 205] },
    ],
    decor: [{ d: [112, 97, 122, 172].flatMap((y, k) => [0, 8, 16, 24, 32].map((dy) => `M${[100, 180, 260, 150][k]},${y + dy + 4}h40`)).join(""), stroke: "#bbf7d0", width: 1.5 }],
  },

  mitochondrion: {
    id: "mitochondrion",
    title: "A mitochondrion",
    intro: "Aerobic respiration: glycolysis happens in the cytoplasm, then the Krebs cycle in the matrix and oxidative phosphorylation on the cristae.",
    parts: [
      { id: "outer", name: "Outer membrane", fn: "Smooth outer membrane that surrounds the mitochondrion.", d: ringE(200, 150, 165, 85, 6), fill: "#ea580c", evenodd: true, at: [200, 67] },
      { id: "matrix", name: "Matrix", fn: "Fluid with enzymes: the site of the Krebs cycle.", d: E(200, 150, 155, 75), fill: "#fff7ed", at: [345, 150] },
      { id: "inner", name: "Inner membrane", fn: "Folded membrane that carries the enzymes of the electron transport chain; the folds are the cristae.", d: ringE(200, 150, 155, 75, 4), fill: "#c2410c", evenodd: true, at: [300, 87] },
      { id: "cristae", name: "Cristae (folds of the inner membrane)", fn: "Folds of the inner membrane that increase the surface area for oxidative phosphorylation (the electron transport chain), where most ATP is made.", d: many(...[80, 140, 200, 260].map((x) => `M${x},80L${x},150L${x + 9},150L${x + 9},80Z`), ...[110, 170, 230, 290].map((x) => `M${x},220L${x},150L${x + 9},150L${x + 9},220Z`)), fill: "#fdba74", at: [114, 182] },
    ],
  },

  virus: {
    id: "virus",
    title: "A virus (e.g. HIV)",
    intro: "A virus is not a cell: it is a protein coat around genetic material. It can only reproduce inside a host cell.",
    parts: [
      { id: "spikes", name: "Glycoprotein spikes", fn: "Proteins that attach to specific receptors on the host cell, so the virus can enter it.", d: many(...Array.from({ length: 12 }, (_, i) => C(200 + 106 * Math.cos((i * Math.PI) / 6), 150 + 106 * Math.sin((i * Math.PI) / 6), 8))), fill: "#ef4444", at: [306, 150] },
      { id: "envelope", name: "Lipid envelope", fn: "Outer membrane taken from the host cell (only some viruses have one).", d: ring(200, 150, 96, 86), fill: "#fca5a5", evenodd: true, at: [200, 58] },
      { id: "capsid", name: "Capsid (protein coat)", fn: "Protein coat that protects the genetic material.", d: "M262,150L231,204L169,204L138,150L169,96L231,96Z", fill: "#fde68a", at: [246, 124] },
      { id: "genome", name: "Genetic material (DNA or RNA)", fn: "Carries the instructions to make new viruses inside the host cell. HIV has RNA.", d: "M168,150C183,118 195,182 210,150C221,124 231,172 242,146", fill: "#7c3aed", line: 5, at: [200, 150] },
    ],
  },

  bacterium: {
    id: "bacterium",
    title: "A bacterium (prokaryote)",
    intro: "Bacteria are single cells with no nucleus and no membrane-bound organelles.",
    parts: [
      { id: "capsule", name: "Capsule (slime layer)", fn: "Protects the bacterium and helps it stick to surfaces.", d: RR(60, 90, 280, 120, 60), fill: "#e0f2fe", at: [130, 94] },
      { id: "wall", name: "Cell wall", fn: "Rigid layer that gives the cell its shape (many antibiotics attack it).", d: RR(70, 98, 260, 104, 52), fill: "#7dd3fc", at: [185, 102] },
      { id: "membrane", name: "Cell membrane", fn: "Controls what enters and leaves the cell.", d: RR(78, 106, 244, 88, 44), fill: "#0ea5e9", at: [240, 109] },
      { id: "cytoplasm", name: "Cytoplasm", fn: "Jelly-like fluid where the cell's chemical reactions happen.", d: RR(84, 112, 232, 76, 38), fill: "#f0f9ff", at: [250, 170] },
      { id: "nucleoid", name: "Nucleoid (circular DNA)", fn: "A single loop of DNA lying freely in the cytoplasm – there is no nucleus.", d: "M140,150C160,125 180,175 200,150C215,130 230,170 250,148", fill: "#7c3aed", line: 5, at: [170, 150] },
      { id: "plasmid", name: "Plasmid", fn: "Small extra ring of DNA; can carry genes such as antibiotic resistance and is used in genetic engineering.", d: ring(290, 135, 10, 6), fill: "#a855f7", evenodd: true, at: [290, 135] },
      { id: "ribosomes", name: "Ribosomes", fn: "Make proteins.", d: many(C(120, 170, 3.5), C(128, 130, 3.5), C(230, 176, 3.5), C(272, 170, 3.5), C(160, 176, 3.5)), fill: "#1e3a8a", at: [120, 170] },
      { id: "flagellum", name: "Flagellum", fn: "Whip-like tail that rotates to move the bacterium.", d: "M340,150C360,130 370,170 388,150C393,145 396,140 399,138", fill: "#0369a1", line: 4, at: [368, 150] },
    ],
  },

  sperm: {
    id: "sperm",
    title: "A human sperm cell",
    intro: "Sperm are adapted to swim to the ovum and fertilise it.",
    parts: [
      { id: "head", name: "Head", fn: "Contains the haploid nucleus and the acrosome.", d: E(90, 150, 40, 26), fill: "#bfdbfe", at: [112, 132] },
      { id: "acrosome", name: "Acrosome", fn: "Cap at the tip of the head with enzymes that dissolve a path through the layers around the ovum.", d: "M50,150C50,128 70,124 82,126C70,135 70,165 82,174C70,176 50,172 50,150Z", fill: "#facc15", at: [60, 150] },
      { id: "nucleus", name: "Haploid nucleus", fn: "Carries 23 chromosomes (n) – the father's genetic material.", d: E(98, 150, 22, 17), fill: "#6366f1", at: [98, 150] },
      { id: "middle", name: "Middle piece", fn: "Packed with mitochondria that release energy (ATP) for swimming.", d: R(130, 143, 70, 14), fill: "#f97316", at: [165, 150] },
      { id: "tail", name: "Tail (flagellum)", fn: "Whips from side to side to move the sperm forward.", d: "M200,150C240,120 270,180 310,150C340,128 360,170 395,150", fill: "#64748b", line: 5, at: [300, 155] },
    ],
    decor: [{ d: "M134,150c6,-8 12,8 18,0s12,8 18,0s12,8 18,0", stroke: "#7c2d12", width: 1.6 }],
  },

  "female-repro": {
    id: "female-repro",
    title: "The female reproductive system (front view)",
    intro: "Ovaries make ova and hormones; fertilisation happens in the Fallopian tube; the embryo implants in the uterus.",
    parts: [
      { id: "ovary", name: "Ovary", fn: "Produces ova (by meiosis) and the hormones oestrogen and progesterone.", d: many(E(80, 140, 22, 14), E(320, 140, 22, 14)), fill: "#fcd34d", at: [80, 140] },
      { id: "funnel", name: "Funnel with fimbriae", fn: "Finger-like fimbriae sweep the released ovum into the Fallopian tube.", d: "M77,110L52,122L56,104ZM323,110L348,122L344,104Z", fill: "#f9a8d4", at: [56, 112] },
      { id: "fallopian", name: "Fallopian tube (oviduct)", fn: "Carries the ovum to the uterus; fertilisation happens here. Cilia move the ovum along.", d: "M150,116C120,100 95,96 77,110M250,116C280,100 305,96 323,110", fill: "#f472b6", line: 8, at: [112, 100] },
      { id: "uterus", name: "Uterus (myometrium)", fn: "Muscular organ in which the foetus develops; contracts strongly during birth.", d: "M150,110L250,110C255,170 230,200 212,215L188,215C170,200 145,170 150,110Z", fill: "#fda4af", at: [238, 130] },
      { id: "endometrium", name: "Endometrium", fn: "Inner lining of the uterus, rich in blood vessels; the blastocyst implants here. It is shed during menstruation.", d: "M165,120L235,120C236,165 220,190 205,200L195,200C180,190 164,165 165,120Z", fill: "#e11d48", at: [200, 160] },
      { id: "cervix", name: "Cervix", fn: "Ring of muscle at the neck of the uterus; it dilates (widens) during birth.", d: R(188, 215, 24, 20), fill: "#f472b6", at: [200, 225] },
      { id: "vagina", name: "Vagina", fn: "Receives sperm during intercourse and is the birth canal.", d: "M188,235L212,235L216,295L184,295Z", fill: "#fbcfe8", at: [200, 270] },
    ],
    decor: [{ d: `${C(74, 138, 4)}${C(86, 143, 3)}${C(314, 141, 4)}${C(326, 136, 3)}`, fill: "#f59e0b" }],
  },

  "male-repro": {
    id: "male-repro",
    title: "The male reproductive system (side view)",
    intro: "Testes make sperm and testosterone; glands add fluids to make semen.",
    parts: [
      { id: "bladder", name: "Bladder", fn: "Stores urine (part of the urinary system).", d: E(150, 70, 40, 30), fill: "#fde68a", at: [150, 64] },
      { id: "seminal", name: "Seminal vesicle", fn: "Secretes a fluid rich in fructose that gives sperm energy.", d: E(205, 95, 11, 22), fill: "#fdba74", at: [205, 95] },
      { id: "prostate", name: "Prostate gland", fn: "Secretes an alkaline fluid that neutralises the acid in the urethra and vagina, and helps sperm swim.", d: E(160, 124, 22, 14), fill: "#a78bfa", at: [160, 124] },
      { id: "cowpers", name: "Cowper's gland", fn: "Secretes mucus that lubricates the urethra before ejaculation.", d: C(176, 150, 7), fill: "#fb923c", at: [176, 150] },
      { id: "scrotum", name: "Scrotum", fn: "Skin sac outside the body that keeps the testes about 2–3 °C cooler than body temperature – best for sperm production.", d: E(197, 218, 36, 44), fill: "#fde2e4", at: [178, 252] },
      { id: "testis", name: "Testis", fn: "Produces sperm (spermatogenesis in the seminiferous tubules) and the hormone testosterone.", d: E(195, 215, 22, 28), fill: "#fca5a5", at: [192, 222] },
      { id: "epididymis", name: "Epididymis", fn: "Coiled tube where sperm mature and are stored.", d: E(219, 203, 8, 24), fill: "#f87171", at: [221, 196] },
      { id: "penis", name: "Penis", fn: "Erectile organ that deposits semen in the vagina; also carries urine out.", d: "M150,150C140,195 100,215 50,238L42,224C90,200 125,182 138,148Z", fill: "#fcd5b5", at: [92, 207] },
      { id: "vas", name: "Sperm duct (vas deferens)", fn: "Carries sperm from the epididymis to the urethra.", d: "M220,182C242,130 240,82 202,80C187,80 176,108 166,120", fill: "#8b5cf6", line: 5, at: [238, 130] },
      { id: "urethra", name: "Urethra", fn: "Carries urine, or semen, out of the body (never both at once).", d: "M150,100L156,154C150,190 122,202 92,216L58,232", fill: "#eab308", line: 5, at: [120, 205] },
    ],
  },

  "amniotic-egg": {
    id: "amniotic-egg",
    title: "The amniotic egg (e.g. a bird's egg)",
    intro: "The amniotic egg let reptiles and birds reproduce on land: the embryo has its own 'pond' (amnion), food (yolk) and waste store (allantois).",
    parts: [
      { id: "shell", name: "Shell", fn: "Hard, porous shell that protects the embryo but lets gases diffuse in and out.", d: ringE(200, 150, 160, 115, 8), fill: "#fde68a", evenodd: true, at: [200, 39] },
      { id: "membranes", name: "Shell membranes", fn: "Two thin membranes under the shell that keep out bacteria and reduce water loss.", d: ringE(200, 150, 152, 107, 4), fill: "#d6d3d1", evenodd: true, at: [350, 150] },
      { id: "air-space", name: "Air space", fn: "Pocket of air at the blunt end – the chick's first breath of air.", d: E(328, 150, 14, 45), fill: "#e0f2fe", at: [328, 150] },
      { id: "albumen", name: "Albumen (egg white)", fn: "Provides water and protein, and cushions the embryo.", d: E(195, 150, 135, 96), fill: "#f8fafc", at: [290, 205] },
      { id: "chorion", name: "Chorion", fn: "Outermost membrane: works with the allantois for gaseous exchange through the shell.", d: ringE(195, 150, 128, 89, 4), fill: "#a78bfa", evenodd: true, at: [195, 63] },
      { id: "yolk", name: "Yolk sac", fn: "Contains the yolk – the embryo's food store.", d: C(180, 165, 50), fill: "#fde047", at: [175, 190] },
      { id: "amnion", name: "Amnion", fn: "Fluid-filled sac (amniotic fluid) that protects the embryo from drying out and from shocks.", d: ring(195, 112, 26, 19), fill: "#60a5fa", evenodd: true, at: [195, 87] },
      { id: "embryo", name: "Embryo", fn: "The developing chick.", d: E(195, 112, 14, 10), fill: "#fb7185", at: [195, 112] },
      { id: "allantois", name: "Allantois", fn: "Stores nitrogenous waste (uric acid) and helps with gaseous exchange.", d: E(255, 110, 22, 16), fill: "#86efac", at: [255, 110] },
    ],
  },

  nucleotide: {
    id: "nucleotide",
    title: "DNA: nucleotides and base pairs",
    intro: "DNA is a double helix: two strands of nucleotides joined by weak hydrogen bonds between complementary bases (A–T, C–G).",
    parts: [
      { id: "nucleotide", name: "One nucleotide", fn: "The building block of DNA: a phosphate, a deoxyribose sugar and a nitrogenous base.", d: R(48, 40, 154, 70), fill: "#64748b", line: 2, at: [50, 112] },
      { id: "phosphate", name: "Phosphate", fn: "Joins one sugar to the next, forming the backbone of each strand.", d: C(70, 62, 14), fill: "#facc15", at: [70, 62] },
      { id: "sugar", name: "Deoxyribose sugar", fn: "The sugar in DNA (RNA has ribose instead).", d: "M95,80L115,70L130,85L122,105L100,103Z", fill: "#f97316", at: [112, 88] },
      { id: "base", name: "Nitrogenous base (adenine)", fn: "One of four bases: adenine, thymine, cytosine or guanine. The order of bases is the genetic code.", d: R(130, 82, 68, 16), fill: "#16a34a", at: [182, 90] },
      { id: "hydrogen", name: "Weak hydrogen bonds", fn: "Hold the two strands together; they break easily so DNA can unzip for replication and transcription.", d: R(197, 80, 6, 20), fill: "#0f172a", at: [200, 72] },
      { id: "partner", name: "Complementary base (thymine)", fn: "Adenine always pairs with thymine, and cytosine with guanine.", d: R(202, 82, 68, 16), fill: "#dc2626", at: [222, 90] },
      { id: "backbone", name: "Sugar–phosphate backbone", fn: "The two 'sides of the ladder', made of alternating sugars and phosphates.", d: "M70,40L70,280M330,40L330,280", fill: "#94a3b8", line: 8, at: [70, 220] },
    ],
    decor: [
      { d: `${R(86, 142, 112, 16)}`, fill: "#2563eb" }, { d: `${R(202, 142, 112, 16)}`, fill: "#9333ea" },
      { d: `${R(86, 192, 112, 16)}`, fill: "#9333ea" }, { d: `${R(202, 192, 112, 16)}`, fill: "#2563eb" },
      { d: `${R(86, 242, 112, 16)}`, fill: "#dc2626" }, { d: `${R(202, 242, 112, 16)}`, fill: "#16a34a" },
      { d: `${R(270, 82, 44, 16)}`, fill: "#dc2626" },
    ],
    notes: [
      { x: 145, y: 94, text: "A", colour: "#ffffff" }, { x: 250, y: 94, text: "T", colour: "#ffffff" },
      { x: 140, y: 154, text: "C", colour: "#ffffff" }, { x: 255, y: 154, text: "G", colour: "#ffffff" },
      { x: 140, y: 204, text: "G", colour: "#ffffff" }, { x: 255, y: 204, text: "C", colour: "#ffffff" },
      { x: 140, y: 254, text: "T", colour: "#ffffff" }, { x: 255, y: 254, text: "A", colour: "#ffffff" },
    ],
  },
};

/** A sentence for read-aloud: the diagram title and every part with its function. */
export const DIAGRAM_SPEECH = (id: DiagramId) => {
  const d = DIAGRAMS[id];
  return `${d.title}. ${d.intro} ${d.parts.map((p) => `${p.name}: ${p.fn}`).join(" ")}`;
};
