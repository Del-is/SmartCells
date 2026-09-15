export interface DictionaryEntry {
  word: string;
  partOfSpeech?: string;
  phonetic?: string;
  definition: string;
  synonyms: string[];
  examples: string[];
}

export const INSTANT_DICTIONARY: Record<string, DictionaryEntry> = {
  "jeopardy": {
    word: "jeopardy",
    partOfSpeech: "noun",
    phonetic: "/ˈdʒɛp.ər.di/",
    definition: "Danger of loss, harm, or failure; peril or hazard that threatens safety, survival, or success.",
    synonyms: ["peril", "hazard", "danger", "risk", "endangerment", "precariousness"],
    examples: [
      "The sudden revocation of state funding placed the university's research program in serious jeopardy.",
      "Deforestation puts countless rare wildlife species in continuous jeopardy.",
      "The Fifth Amendment protects defendants against being placed in double jeopardy for the same offense."
    ]
  },
  "photosynthesis": {
    word: "photosynthesis",
    partOfSpeech: "noun",
    phonetic: "/ˌfoʊ.toʊˈsɪn.θə.sɪs/",
    definition: "The biological process by which green plants, algae, and cyanobacteria synthesize organic nutrients from carbon dioxide and water using light energy absorbed by chlorophyll.",
    synonyms: ["carbon fixation", "light reaction", "phototrophic synthesis"],
    examples: [
      "Photosynthesis in the chloroplasts converts solar photons into chemical bond energy in glucose.",
      "Without photosynthesis, Earth's oxygen-rich atmosphere would deplete rapidly."
    ]
  },
  "mitosis": {
    word: "mitosis",
    partOfSpeech: "noun",
    phonetic: "/maɪˈtoʊ.sɪs/",
    definition: "A type of eukaryotic cell division that results in two daughter cells each having the identical number and kind of chromosomes as the parent nucleus.",
    synonyms: ["cell division", "karyokinesis", "cellular replication"],
    examples: [
      "During mitosis, replicated chromosomes condense and align along the metaphase plate before separation.",
      "Uncontrolled mitosis is one of the hallmarks of malignant tumor proliferation."
    ]
  },
  "meiosis": {
    word: "meiosis",
    partOfSpeech: "noun",
    phonetic: "/maɪˈoʊ.sɪs/",
    definition: "A specialized form of reductional cell division in sexually reproducing organisms that reduces chromosome numbers by half, producing four genetically diverse gametes.",
    synonyms: ["reduction division", "gametogenesis"],
    examples: [
      "Meiosis generates genetic variation through homologous crossing-over and independent assortment."
    ]
  },
  "hypothesis": {
    word: "hypothesis",
    partOfSpeech: "noun",
    phonetic: "/haɪˈpɒθ.ə.sɪs/",
    definition: "A proposed, testable, and falsifiable scientific explanation made on the basis of limited evidence as a starting point for further empirical investigation.",
    synonyms: ["postulation", "conjecture", "theory", "premise", "supposition"],
    examples: [
      "The researchers formulated a testable hypothesis regarding the antibiotic efficacy of the fungal extract.",
      "If experimental trials contradict the hypothesis, it must be refined or rejected."
    ]
  },
  "catalyst": {
    word: "catalyst",
    partOfSpeech: "noun",
    phonetic: "/ˈkæt.əl.ɪst/",
    definition: "A substance that increases the rate of a chemical reaction by lowering the activation energy without itself undergoing any permanent chemical change.",
    synonyms: ["accelerator", "activator", "stimulant", "enzyme", "spark"],
    examples: [
      "Platinum serves as an effective heterogeneous catalyst in automobile exhaust converters.",
      "Her impassioned speech served as the catalyst for immediate municipal environmental reform."
    ]
  },
  "metaphor": {
    word: "metaphor",
    partOfSpeech: "noun",
    phonetic: "/ˈmɛt.ə.fɔːr/",
    definition: "A figure of speech in which a word or phrase is applied to an object or action to which it is not literally applicable, expressing a symbolic equivalence.",
    synonyms: ["analogy", "allegory", "symbol", "figurative expression", "emblem"],
    examples: [
      "Shakespeare's famous phrase 'All the world's a stage' is an enduring literary metaphor.",
      "The author employed a raging wildfire as a metaphor for unchecked civil unrest."
    ]
  },
  "osmosis": {
    word: "osmosis",
    partOfSpeech: "noun",
    phonetic: "/ɒzˈmoʊ.sɪs/",
    definition: "The spontaneous net movement or diffusion of solvent molecules through a selectively permeable membrane into a region of higher solute concentration.",
    synonyms: ["passive diffusion", "solvent flux", "permeation"],
    examples: [
      "Water moves into plant root hair cells from the surrounding moist soil primarily via osmosis.",
      "Reverse osmosis desalination facilities supply fresh potable water to arid coastal communities."
    ]
  },
  "equilibrium": {
    word: "equilibrium",
    partOfSpeech: "noun",
    phonetic: "/ˌiː.kwɪˈlɪb.ri.əm/",
    definition: "A state in which opposing forces or influences are balanced; in chemistry, when forward and reverse reaction rates are equal.",
    synonyms: ["balance", "homeostasis", "stability", "symmetry", "poise"],
    examples: [
      "Dynamic equilibrium is reached when the rate of evaporation equals the rate of condensation.",
      "The inner ear semicircular canals play a crucial role in maintaining bodily equilibrium."
    ]
  },
  "entropy": {
    word: "entropy",
    partOfSpeech: "noun",
    phonetic: "/ˈɛn.trə.pi/",
    definition: "A thermodynamic quantity representing the unavailability of a system's thermal energy for conversion into mechanical work, often interpreted as the degree of disorder or randomness in the system.",
    synonyms: ["disorder", "randomness", "decay", "thermal dissipation"],
    examples: [
      "The second law of thermodynamics asserts that the total entropy of an isolated system always increases over time."
    ]
  },
  "ephemeral": {
    word: "ephemeral",
    partOfSpeech: "adjective",
    phonetic: "/ɪˈfɛm.ər.əl/",
    definition: "Lasting for a very short time; transitory; fleeting.",
    synonyms: ["transitory", "fleeting", "transient", "momentary", "evanescent"],
    examples: [
      "The delicate blossoms of the cherry tree are cherished precisely for their ephemeral beauty.",
      "Fame in the digital era can often prove fleeting and ephemeral."
    ]
  },
  "ubiquitous": {
    word: "ubiquitous",
    partOfSpeech: "adjective",
    phonetic: "/juːˈbɪk.wɪ.təs/",
    definition: "Present, appearing, or found everywhere simultaneously; omnipresent.",
    synonyms: ["omnipresent", "pervasive", "universal", "widespread", "prevalent"],
    examples: [
      "Smartphones have evolved from luxury novelties into ubiquitous tools of daily life.",
      "Microorganisms are ubiquitous, inhabiting deep thermal sea vents to polar ice caps."
    ]
  },
  "paradigm": {
    word: "paradigm",
    partOfSpeech: "noun",
    phonetic: "/ˈpær.ə.daɪm/",
    definition: "A distinct set of concepts or thought patterns, including theories, research methods, postulates, and standards for what constitutes legitimate contributions to a field.",
    synonyms: ["model", "framework", "archetype", "pattern", "prototype", "standard"],
    examples: [
      "The shift from Newtonian mechanics to Einstein's relativity represented a monumental scientific paradigm shift."
    ]
  },
  "benevolent": {
    word: "benevolent",
    partOfSpeech: "adjective",
    phonetic: "/bəˈnɛv.əl.ənt/",
    definition: "Well meaning and kindly; marked by or disposed to doing good.",
    synonyms: ["kind", "generous", "altruistic", "compassionate", "magnanimous", "beneficent"],
    examples: [
      "The benevolent patron financed university scholarships for underrepresented STEM students."
    ]
  },
  "mitigate": {
    word: "mitigate",
    partOfSpeech: "verb",
    phonetic: "/ˈmɪt.ɪ.ɡeɪt/",
    definition: "Make less severe, serious, or painful; to lessen the gravity or harshness of something.",
    synonyms: ["alleviate", "reduce", "diminish", "lessen", "attenuate", "palliate"],
    examples: [
      "Early levee reinforcement helped mitigate catastrophic damage from seasonal flooding.",
      "Regular exercise can significantly mitigate cardiovascular health risks."
    ]
  },
  "pragmatic": {
    word: "pragmatic",
    partOfSpeech: "adjective",
    phonetic: "/præɡˈmæt.ɪk/",
    definition: "Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.",
    synonyms: ["practical", "realistic", "sensible", "utilitarian", "hard-headed"],
    examples: [
      "The committee adopted a pragmatic approach to budget allocation rather than pursuing ideological extremes."
    ]
  },
  "resilient": {
    word: "resilient",
    partOfSpeech: "adjective",
    phonetic: "/rɪˈzɪl.jənt/",
    definition: "Able to withstand or recover quickly from difficult conditions, shocks, or deformations.",
    synonyms: ["tough", "durable", "buoyant", "adaptable", "hardy", "elastic"],
    examples: [
      "Ecosystems with rich biodiversity prove far more resilient when facing climate fluctuations.",
      "The students demonstrated admirable resilience in preparing for challenging national exams."
    ]
  },
  "tenacious": {
    word: "tenacious",
    partOfSpeech: "adjective",
    phonetic: "/təˈneɪ.ʃəs/",
    definition: "Tending to keep a firm hold of something; clinging or adhering closely; persistent and determined.",
    synonyms: ["persistent", "determined", "resolute", "dogged", "stubborn", "unyielding"],
    examples: [
      "Her tenacious devotion to laboratory inquiry ultimately led to the vaccine breakthrough."
    ]
  },
  "synergy": {
    word: "synergy",
    partOfSpeech: "noun",
    phonetic: "/ˈsɪn.ər.dʒi/",
    definition: "The interaction or cooperation of two or more organizations, substances, or agents to produce a combined effect greater than the sum of their separate effects.",
    synonyms: ["collaboration", "cooperation", "symbiosis", "harmony", "alliance"],
    examples: [
      "The synergy between software engineers and clinical doctors expedited diagnostic imaging accuracy."
    ]
  },
  "cellular": {
    word: "cellular",
    partOfSpeech: "adjective",
    phonetic: "/ˈsɛl.jʊ.lər/",
    definition: "Relating to, consisting of, or resembling cells, especially the microscopic structural and functional units of living organisms.",
    synonyms: ["alveolar", "honeycombed", "compartmentalized", "biological"],
    examples: [
      "Cellular respiration converts biochemical energy from nutrients into ATP molecules."
    ]
  },
  "gravity": {
    word: "gravity",
    partOfSpeech: "noun",
    phonetic: "/ˈɡræv.ɪ.ti/",
    definition: "The universal force of attraction acting between all matter; also refers to extreme seriousness or importance.",
    synonyms: ["gravitation", "attraction", "solemnity", "seriousness", "severity"],
    examples: [
      "Newtonian gravity mathematically describes the elliptical orbits of planets around the Sun.",
      "The doctor's somber expression conveyed the gravity of the medical diagnosis."
    ]
  }
};

export function lookupInstantWord(rawWord: string): DictionaryEntry | null {
  if (!rawWord) return null;
  const clean = rawWord.trim().toLowerCase();
  
  // Exact match
  if (INSTANT_DICTIONARY[clean]) {
    return INSTANT_DICTIONARY[clean];
  }

  // Check singular/plural or basic inflections
  if (clean.endsWith('s') && INSTANT_DICTIONARY[clean.slice(0, -1)]) {
    return INSTANT_DICTIONARY[clean.slice(0, -1)];
  }
  if (clean.endsWith('es') && INSTANT_DICTIONARY[clean.slice(0, -2)]) {
    return INSTANT_DICTIONARY[clean.slice(0, -2)];
  }
  if (clean.endsWith('ies') && INSTANT_DICTIONARY[clean.slice(0, -3) + 'y']) {
    return INSTANT_DICTIONARY[clean.slice(0, -3) + 'y'];
  }

  return null;
}
