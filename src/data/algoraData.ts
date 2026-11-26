export interface OrganelleInfo {
  id: "cell-wall" | "chloroplast" | "pyrenoid" | "starch-granules" | "cytoplasm" | "nucleus";
  name: string;
  role: string;
  description: string;
  position: [number, number, number];
  accentColor: string;
}

export const CHLORELLA_ORGANELLES: OrganelleInfo[] = [
  {
    id: "cell-wall",
    name: "Cell wall",
    role: "Structural envelope",
    description:
      "A rigid, multilayered microfibrillar barrier composed of polysaccharides and glycoproteins that protects the cell while permitting selective nutrient and gas diffusion.",
    position: [0.95, 0.55, 0.55],
    accentColor: "#35A66A",
  },
  {
    id: "chloroplast",
    name: "Chloroplast",
    role: "Solar energy capture",
    description:
      "A large, cup shaped organelle occupying most of the cell volume. Rich in chlorophyll a and b, it harvests photons to drive oxygenic photosynthesis.",
    position: [-0.62, 0.15, 0.65],
    accentColor: "#176B43",
  },
  {
    id: "pyrenoid",
    name: "Pyrenoid",
    role: "Carbon concentrating core",
    description:
      "A dense proteinaceous microcompartment embedded inside the chloroplast containing RuBisCO, concentrating dissolved inorganic carbon for efficient fixation.",
    position: [0.0, -0.18, 0.25],
    accentColor: "#4EC485",
  },
  {
    id: "starch-granules",
    name: "Starch granules",
    role: "Energy reserve",
    description:
      "Crystalline polysaccharide plates deposited around the pyrenoid and within the stroma, storing chemical energy synthesized during active light cycles.",
    position: [0.35, -0.35, 0.48],
    accentColor: "#DCE8DF",
  },
  {
    id: "cytoplasm",
    name: "Cytoplasm",
    role: "Metabolic medium",
    description:
      "The aqueous intracellular matrix enclosed by the plasma membrane, hosting dissolved ions, ribosomes, and metabolic pathways that sustain cellular homeostasis.",
    position: [-0.25, 0.62, 0.42],
    accentColor: "#93D3AE",
  },
  {
    id: "nucleus",
    name: "Nucleus",
    role: "Genetic control center",
    description:
      "A membrane bound organelle nestled within the open cup of the chloroplast, coordinating gene expression, repair, and cellular division.",
    position: [0.22, 0.42, 0.35],
    accentColor: "#248756",
  },
];

export interface ScienceConcept {
  index: string;
  title: string;
  subtitle: string;
  description: string;
  mechanism: string;
}

export const SCIENCE_CONCEPTS: ScienceConcept[] = [
  {
    index: "01",
    title: "Photosynthesis",
    subtitle: "Light driven biochemical conversion",
    description:
      "Chlorophyll pigments inside the cup shaped chloroplast absorb specific wavelengths of visible light, exciting electrons that power cellular energy synthesis.",
    mechanism: "Photons → Electron transport → ATP & NADPH",
  },
  {
    index: "02",
    title: "Carbon fixation",
    subtitle: "Inorganic carbon assimilation",
    description:
      "Through the Calvin cycle centered around the pyrenoid, Chlorella vulgaris utilizes dissolved inorganic carbon from aerated water to build organic biomass.",
    mechanism: "Dissolved CO₂ → RuBisCO fixation → Organic carbon",
  },
  {
    index: "03",
    title: "Oxygen generation",
    subtitle: "Continuous biological release",
    description:
      "During oxygenic photosynthesis, water molecules are split to replenish electrons, releasing pure molecular oxygen back into the surrounding air stream.",
    mechanism: "H₂O photolysis → Dissolved O₂ → Clean indoor air",
  },
];

export interface ReactorComponent {
  id: "crown" | "chamber" | "display" | "filter" | "pump";
  name: string;
  tag: string;
  description: string;
  offsetY: number;
}

export const REACTOR_COMPONENTS: ReactorComponent[] = [
  {
    id: "crown",
    name: "Photosynthetic LED crown",
    tag: "Optical array",
    description:
      "Precision tuned full spectrum illumination engineered to match chlorophyll absorption peaks without harsh glare inside architectural interiors.",
    offsetY: 1.45,
  },
  {
    id: "chamber",
    name: "Borosilicate algae chamber",
    tag: "1L living culture",
    description:
      "A transparent cylindrical vessel housing living Chlorella vulgaris suspended in nutrient medium, allowing continuous visual connection with the culture.",
    offsetY: 0.45,
  },
  {
    id: "display",
    name: "Integrated telemetry module",
    tag: "Environmental sensors",
    description:
      "Minimal front facing display and concealed sensor array tracking culture temperature, ambient air temperature, and relative humidity.",
    offsetY: 0.0,
  },
  {
    id: "filter",
    name: "Particulate and carbon stage",
    tag: "Air filtration",
    description:
      "Multi stage mechanical and activated carbon assembly positioned in the lower intake plenum to capture airborne particulates and volatile compounds.",
    offsetY: -0.6,
  },
  {
    id: "pump",
    name: "Concealed circulation housing",
    tag: "Fluidics & aeration",
    description:
      "Low noise peristaltic and aeration hardware tucked cleanly inside the brushed aluminium base to keep microalgae gently suspended and aerated.",
    offsetY: -1.25,
  },
];

export interface ArchitectureStep {
  step: string;
  circuit: "air" | "algae" | "digital";
  title: string;
  detail: string;
}

export const ARCHITECTURE_STEPS: ArchitectureStep[] = [
  {
    step: "01",
    circuit: "air",
    title: "Air intake",
    detail: "Quiet radial draw pulls indoor ambient air through perimeter acoustic louvers.",
  },
  {
    step: "02",
    circuit: "air",
    title: "Integrated air filtration",
    detail: "Air passes through the replaceable particulate and activated carbon filter assembly.",
  },
  {
    step: "03",
    circuit: "algae",
    title: "Microalgae cultivation",
    detail: "Living Chlorella vulgaris grows inside the illuminated borosilicate photobioreactor.",
  },
  {
    step: "04",
    circuit: "algae",
    title: "Liquid circulation and aeration",
    detail: "Concealed aeration gently mixes the culture and exchanges dissolved gases.",
  },
  {
    step: "05",
    circuit: "digital",
    title: "Environmental sensor monitoring",
    detail: "Onboard probes continuously sample culture temperature, ambient air, and humidity.",
  },
  {
    step: "06",
    circuit: "digital",
    title: "Intelligent digital interface",
    detail: "Clean telemetry surfaces system health, lighting schedules, and circulation status.",
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What species of microalgae does Algora use?",
    answer:
      "Algora is designed around Chlorella vulgaris, a single celled freshwater green microalga studied extensively for its resilience, rapid photosynthesis, and absence of flagella.",
  },
  {
    question: "How does the air purification path relate to the algae chamber?",
    answer:
      "Incoming room air first passes through the mechanical and activated carbon filter module in the lower housing, while a dedicated aeration circuit bubbles air through the 1 litre microalgae culture.",
  },
  {
    question: "Is the Chlorella culture safe for indoor spaces?",
    answer:
      "Chlorella vulgaris is a non pathogenic freshwater microalga enclosed within a sealed borosilicate vessel with filtered gas exchange.",
  },
  {
    question: "How much maintenance does the compact prototype require?",
    answer:
      "The unit is engineered for clean, serviceable mechanical access, with periodic nutrient top ups and scheduled filter cartridge replacements guided by the monitoring interface.",
  },
  {
    question: "Are the metrics shown on the website live customer performance figures?",
    answer:
      "No. All telemetry readings displayed in the interactive dashboard mockup are clearly marked demonstration values illustrating the interface design.",
  },
  {
    question: "Can Algora scale beyond a desktop unit?",
    answer:
      "Yes. Our research roadmap extends from compact desktop photobioreactors to modular architectural panels and larger urban environmental installations.",
  },
];
