export interface ElementData {
  number: number;
  symbol: string;
  name: string;
  weight: string;
  category: 
    | 'reactive-nonmetal'
    | 'noble-gas'
    | 'alkali-metal'
    | 'alkaline-earth'
    | 'metalloid'
    | 'post-transition'
    | 'transition-metal'
    | 'lanthanide'
    | 'actinide'
    | 'unknown';
  period: number;
  group: number;
  x: number; // Column in 18-col grid (1-18)
  y: number; // Row in grid (1-7 for main, 8 for lanthanides, 9 for actinides)
  phase: 'Gas' | 'Liquid' | 'Solid' | 'Synthetic';
  electronConfig: string;
  summary: string;
  discoveredBy?: string;
}

export const PERIODIC_ELEMENTS: ElementData[] = [
  // Period 1
  {
    number: 1, symbol: 'H', name: 'Hydrogen', weight: '1.008',
    category: 'reactive-nonmetal', period: 1, group: 1, x: 1, y: 1, phase: 'Gas',
    electronConfig: '1s¹',
    summary: 'The lightest and most abundant chemical element in the universe, powering stars and essential to water and organic life.',
    discoveredBy: 'Henry Cavendish (1766)'
  },
  {
    number: 2, symbol: 'He', name: 'Helium', weight: '4.0026',
    category: 'noble-gas', period: 1, group: 18, x: 18, y: 1, phase: 'Gas',
    electronConfig: '1s²',
    summary: 'A colorless, odorless noble gas with the lowest boiling point of any element; widely used in cryogenics and MRI machines.',
    discoveredBy: 'Pierre Janssen & Norman Lockyer (1868)'
  },

  // Period 2
  {
    number: 3, symbol: 'Li', name: 'Lithium', weight: '6.94',
    category: 'alkali-metal', period: 2, group: 1, x: 1, y: 2, phase: 'Solid',
    electronConfig: '[He] 2s¹',
    summary: 'The least dense solid element and an alkali metal crucial for rechargeable batteries, aerospace alloys, and pharmaceuticals.',
    discoveredBy: 'Johan August Arfwedson (1817)'
  },
  {
    number: 4, symbol: 'Be', name: 'Beryllium', weight: '9.0122',
    category: 'alkaline-earth', period: 2, group: 2, x: 2, y: 2, phase: 'Solid',
    electronConfig: '[He] 2s²',
    summary: 'A lightweight, stiff alkaline earth metal used in aerospace structures, satellite mirrors, and James Webb Space Telescope optics.',
    discoveredBy: 'Louis-Nicolas Vauquelin (1798)'
  },
  {
    number: 5, symbol: 'B', name: 'Boron', weight: '10.81',
    category: 'metalloid', period: 2, group: 13, x: 13, y: 2, phase: 'Solid',
    electronConfig: '[He] 2s² 2p¹',
    summary: 'A low-abundance metalloid used in borosilicate glassware (Pyrex), fiberglass insulation, and plant cell wall formation.',
    discoveredBy: 'Joseph Louis Gay-Lussac & Louis Jacques Thénard (1808)'
  },
  {
    number: 6, symbol: 'C', name: 'Carbon', weight: '12.011',
    category: 'reactive-nonmetal', period: 2, group: 14, x: 14, y: 2, phase: 'Solid',
    electronConfig: '[He] 2s² 2p²',
    summary: 'The chemical basis of all known life, capable of forming millions of organic compounds as well as diamond and graphene.',
    discoveredBy: 'Known since antiquity'
  },
  {
    number: 7, symbol: 'N', name: 'Nitrogen', weight: '14.007',
    category: 'reactive-nonmetal', period: 2, group: 15, x: 15, y: 2, phase: 'Gas',
    electronConfig: '[He] 2s² 2p³',
    summary: 'Makes up about 78% of Earth’s atmosphere and is a foundational constituent of amino acids, proteins, and DNA.',
    discoveredBy: 'Daniel Rutherford (1772)'
  },
  {
    number: 8, symbol: 'O', name: 'Oxygen', weight: '15.999',
    category: 'reactive-nonmetal', period: 2, group: 16, x: 16, y: 2, phase: 'Gas',
    electronConfig: '[He] 2s² 2p⁴',
    summary: 'A highly reactive nonmetal and oxidizing agent essential for cellular respiration and comprising roughly 21% of our air.',
    discoveredBy: 'Carl Wilhelm Scheele & Joseph Priestley (1774)'
  },
  {
    number: 9, symbol: 'F', name: 'Fluorine', weight: '18.998',
    category: 'reactive-nonmetal', period: 2, group: 17, x: 17, y: 2, phase: 'Gas',
    electronConfig: '[He] 2s² 2p⁵',
    summary: 'The most electronegative and chemically reactive of all elements, forming tough polymers like Teflon and fluorides for dental health.',
    discoveredBy: 'Henri Moissan (1886)'
  },
  {
    number: 10, symbol: 'Ne', name: 'Neon', weight: '20.180',
    category: 'noble-gas', period: 2, group: 18, x: 18, y: 2, phase: 'Gas',
    electronConfig: '[He] 2s² 2p⁶',
    summary: 'A chemically inert noble gas that emits a brilliant reddish-orange glow in high-voltage electrical discharge signs.',
    discoveredBy: 'William Ramsay & Morris Travers (1898)'
  },

  // Period 3
  {
    number: 11, symbol: 'Na', name: 'Sodium', weight: '22.990',
    category: 'alkali-metal', period: 3, group: 1, x: 1, y: 3, phase: 'Solid',
    electronConfig: '[Ne] 3s¹',
    summary: 'A soft, silvery alkali metal that reacts vigorously with water; vital for nerve signal transmission and fluid regulation as table salt.',
    discoveredBy: 'Humphry Davy (1807)'
  },
  {
    number: 12, symbol: 'Mg', name: 'Magnesium', weight: '24.305',
    category: 'alkaline-earth', period: 3, group: 2, x: 2, y: 3, phase: 'Solid',
    electronConfig: '[Ne] 3s²',
    summary: 'A shiny gray metal essential for enzymatic catalysis and central to the chlorophyll molecule in photosynthesizing plants.',
    discoveredBy: 'Joseph Black (1755)'
  },
  {
    number: 13, symbol: 'Al', name: 'Aluminum', weight: '26.982',
    category: 'post-transition', period: 3, group: 13, x: 13, y: 3, phase: 'Solid',
    electronConfig: '[Ne] 3s² 3p¹',
    summary: 'The third most abundant element in Earth’s crust; prized for low density, high conductivity, and corrosion-resistant oxide layer.',
    discoveredBy: 'Hans Christian Ørsted (1825)'
  },
  {
    number: 14, symbol: 'Si', name: 'Silicon', weight: '28.085',
    category: 'metalloid', period: 3, group: 14, x: 14, y: 3, phase: 'Solid',
    electronConfig: '[Ne] 3s² 3p²',
    summary: 'A hard, brittle semiconductor backbone of modern microchips, solar photovoltaics, and silicate rock minerals.',
    discoveredBy: 'Jöns Jacob Berzelius (1824)'
  },
  {
    number: 15, symbol: 'P', name: 'Phosphorus', weight: '30.974',
    category: 'reactive-nonmetal', period: 3, group: 15, x: 15, y: 3, phase: 'Solid',
    electronConfig: '[Ne] 3s² 3p³',
    summary: 'Essential to structural DNA, RNA, and the cellular energy transfer currency ATP; also prominent in fertilizers and match heads.',
    discoveredBy: 'Hennig Brand (1669)'
  },
  {
    number: 16, symbol: 'S', name: 'Sulfur', weight: '32.06',
    category: 'reactive-nonmetal', period: 3, group: 16, x: 16, y: 3, phase: 'Solid',
    electronConfig: '[Ne] 3s² 3p⁴',
    summary: 'A bright yellow nonmetal vital for amino acids cysteine and methionine, rubber vulcanization, and sulfuric acid synthesis.',
    discoveredBy: 'Known since antiquity'
  },
  {
    number: 17, symbol: 'Cl', name: 'Chlorine', weight: '35.45',
    category: 'reactive-nonmetal', period: 3, group: 17, x: 17, y: 3, phase: 'Gas',
    electronConfig: '[Ne] 3s² 3p⁵',
    summary: 'A yellow-green halogen gas utilized globally for drinking water disinfection, sanitation, PVC piping, and chemical synthesis.',
    discoveredBy: 'Carl Wilhelm Scheele (1774)'
  },
  {
    number: 18, symbol: 'Ar', name: 'Argon', weight: '39.948',
    category: 'noble-gas', period: 3, group: 18, x: 18, y: 3, phase: 'Gas',
    electronConfig: '[Ne] 3s² 3p⁶',
    summary: 'The third most common gas in Earth’s atmosphere (0.93%), used as an inert shielding gas in welding and double-pane insulated windows.',
    discoveredBy: 'Lord Rayleigh & William Ramsay (1894)'
  },

  // Period 4
  {
    number: 19, symbol: 'K', name: 'Potassium', weight: '39.098',
    category: 'alkali-metal', period: 4, group: 1, x: 1, y: 4, phase: 'Solid',
    electronConfig: '[Ar] 4s¹',
    summary: 'An essential dietary mineral and alkali metal required for heart muscle contraction, neural depolarization, and plant nutrition.',
    discoveredBy: 'Humphry Davy (1807)'
  },
  {
    number: 20, symbol: 'Ca', name: 'Calcium', weight: '40.078',
    category: 'alkaline-earth', period: 4, group: 2, x: 2, y: 4, phase: 'Solid',
    electronConfig: '[Ar] 4s²',
    summary: 'Vital for bone and tooth mineral density, neurotransmitter release, muscle contraction, and construction materials like cement.',
    discoveredBy: 'Humphry Davy (1808)'
  },
  {
    number: 21, symbol: 'Sc', name: 'Scandium', weight: '44.956',
    category: 'transition-metal', period: 4, group: 3, x: 3, y: 4, phase: 'Solid',
    electronConfig: '[Ar] 3d¹ 4s²',
    summary: 'A silvery transition metal added to aluminum alloys to dramatically increase strength and weldability in aerospace frames.',
    discoveredBy: 'Lars Fredrik Nilson (1879)'
  },
  {
    number: 22, symbol: 'Ti', name: 'Titanium', weight: '47.867',
    category: 'transition-metal', period: 4, group: 4, x: 4, y: 4, phase: 'Solid',
    electronConfig: '[Ar] 3d² 4s²',
    summary: 'Renowned for exceptional strength-to-weight ratio and biocompatibility, ideal for jet engines, medical implants, and titanium dioxide paint.',
    discoveredBy: 'William Gregor (1791)'
  },
  {
    number: 23, symbol: 'V', name: 'Vanadium', weight: '50.942',
    category: 'transition-metal', period: 4, group: 5, x: 5, y: 4, phase: 'Solid',
    electronConfig: '[Ar] 3d³ 4s²',
    summary: 'Used predominantly to strengthen structural steel alloys, high-speed tool bits, and emerging grid-scale redox flow batteries.',
    discoveredBy: 'Andrés Manuel del Río (1801)'
  },
  {
    number: 24, symbol: 'Cr', name: 'Chromium', weight: '51.996',
    category: 'transition-metal', period: 4, group: 6, x: 6, y: 4, phase: 'Solid',
    electronConfig: '[Ar] 3d⁵ 4s¹',
    summary: 'Imparts corrosion resistance and bright shine to stainless steel and chrome plating; forms vivid ruby red and emerald green gemstones.',
    discoveredBy: 'Louis-Nicolas Vauquelin (1797)'
  },
  {
    number: 25, symbol: 'Mn', name: 'Manganese', weight: '54.938',
    category: 'transition-metal', period: 4, group: 7, x: 7, y: 4, phase: 'Solid',
    electronConfig: '[Ar] 3d⁵ 4s²',
    summary: 'Indispensable in iron and steel smelting to prevent embrittlement, and vital for the oxygen-evolving complex in photosynthesis.',
    discoveredBy: 'Johan Gottlieb Gahn (1774)'
  },
  {
    number: 26, symbol: 'Fe', name: 'Iron', weight: '55.845',
    category: 'transition-metal', period: 4, group: 8, x: 8, y: 4, phase: 'Solid',
    electronConfig: '[Ar] 3d⁶ 4s²',
    summary: 'The most common element on Earth by mass, central to hemoglobin oxygen transport in blood and steel civil infrastructure.',
    discoveredBy: 'Known since antiquity'
  },
  {
    number: 27, symbol: 'Co', name: 'Cobalt', weight: '58.933',
    category: 'transition-metal', period: 4, group: 9, x: 9, y: 4, phase: 'Solid',
    electronConfig: '[Ar] 3d⁷ 4s²',
    summary: 'Found at the active site of vitamin B12 (cobalamin) and a key component of lithium-ion battery cathodes and powerful magnets.',
    discoveredBy: 'Georg Brandt (1735)'
  },
  {
    number: 28, symbol: 'Ni', name: 'Nickel', weight: '58.693',
    category: 'transition-metal', period: 4, group: 10, x: 10, y: 4, phase: 'Solid',
    electronConfig: '[Ar] 3d⁸ 4s²',
    summary: 'Resistant to corrosion and oxidation, widely used in coinage, stainless steels, and energy storage battery formulations.',
    discoveredBy: 'Axel Fredrik Cronstedt (1751)'
  },
  {
    number: 29, symbol: 'Cu', name: 'Copper', weight: '63.546',
    category: 'transition-metal', period: 4, group: 11, x: 11, y: 4, phase: 'Solid',
    electronConfig: '[Ar] 3d¹⁰ 4s¹',
    summary: 'A reddish-orange metal with excellent thermal and electrical conductivity, fundamental to electrical grids, electronics, and plumbing.',
    discoveredBy: 'Known since antiquity'
  },
  {
    number: 30, symbol: 'Zn', name: 'Zinc', weight: '65.38',
    category: 'transition-metal', period: 4, group: 12, x: 12, y: 4, phase: 'Solid',
    electronConfig: '[Ar] 3d¹⁰ 4s²',
    summary: 'Used in galvanization to protect iron from rust, alloyed into brass, and essential for hundreds of human metabolic enzymes.',
    discoveredBy: 'Andreas Sigismund Marggraf (1746)'
  },
  {
    number: 31, symbol: 'Ga', name: 'Gallium', weight: '69.723',
    category: 'post-transition', period: 4, group: 13, x: 13, y: 4, phase: 'Solid',
    electronConfig: '[Ar] 3d¹⁰ 4s² 4p¹',
    summary: 'A metal that melts in human hands (29.8°C), essential for gallium arsenide (GaAs) semiconductors and blue laser diodes.',
    discoveredBy: 'Paul-Émile Lecoq de Boisbaudran (1875)'
  },
  {
    number: 32, symbol: 'Ge', name: 'Germanium', weight: '72.630',
    category: 'metalloid', period: 4, group: 14, x: 14, y: 4, phase: 'Solid',
    electronConfig: '[Ar] 3d¹⁰ 4s² 4p²',
    summary: 'A semiconductor metalloid enabling high-speed transistors, fiber-optic communication cables, and infrared night-vision optics.',
    discoveredBy: 'Clemens Winkler (1886)'
  },
  {
    number: 33, symbol: 'As', name: 'Arsenic', weight: '74.922',
    category: 'metalloid', period: 4, group: 15, x: 15, y: 4, phase: 'Solid',
    electronConfig: '[Ar] 3d¹⁰ 4s² 4p³',
    summary: 'Historically famous as a poison; also an important n-type dopant in semiconductor microchips and optoelectronic devices.',
    discoveredBy: 'Albertus Magnus (1250)'
  },
  {
    number: 34, symbol: 'Se', name: 'Selenium', weight: '78.971',
    category: 'reactive-nonmetal', period: 4, group: 16, x: 16, y: 4, phase: 'Solid',
    electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁴',
    summary: 'Exhibits photovoltaic and photoconductive properties; essential trace nutrient in antioxidant enzymes like glutathione peroxidase.',
    discoveredBy: 'Jöns Jacob Berzelius (1817)'
  },
  {
    number: 35, symbol: 'Br', name: 'Bromine', weight: '79.904',
    category: 'reactive-nonmetal', period: 4, group: 17, x: 17, y: 4, phase: 'Liquid',
    electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁵',
    summary: 'One of only two liquid elements at standard conditions; a fuming red-brown halogen used in flame retardants and water purification.',
    discoveredBy: 'Antoine Jérôme Balard (1826)'
  },
  {
    number: 36, symbol: 'Kr', name: 'Krypton', weight: '83.798',
    category: 'noble-gas', period: 4, group: 18, x: 18, y: 4, phase: 'Gas',
    electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁶',
    summary: 'A dense noble gas used in energy-saving fluorescent lights, flash photography lamps, and precision laser spectroscopy.',
    discoveredBy: 'William Ramsay & Morris Travers (1898)'
  },

  // Period 5
  {
    number: 37, symbol: 'Rb', name: 'Rubidium', weight: '85.468',
    category: 'alkali-metal', period: 5, group: 1, x: 1, y: 5, phase: 'Solid',
    electronConfig: '[Kr] 5s¹',
    summary: 'A highly reactive alkali metal used in rubidium atomic frequency standards, GPS satellite clocks, and laser cooling experiments.',
    discoveredBy: 'Robert Bunsen & Gustav Kirchhoff (1861)'
  },
  {
    number: 38, symbol: 'Sr', name: 'Strontium', weight: '87.62',
    category: 'alkaline-earth', period: 5, group: 2, x: 2, y: 5, phase: 'Solid',
    electronConfig: '[Kr] 5s²',
    summary: 'Burns with an intense, brilliant crimson-red flame, making it the premier coloring agent in fireworks and emergency signal flares.',
    discoveredBy: 'Adair Crawford (1790)'
  },
  {
    number: 39, symbol: 'Y', name: 'Yttrium', weight: '88.906',
    category: 'transition-metal', period: 5, group: 3, x: 3, y: 5, phase: 'Solid',
    electronConfig: '[Kr] 4d¹ 5s²',
    summary: 'Critical constituent of YBCO high-temperature superconductors, YAG lasers used in surgical cutting, and LED phosphor coatings.',
    discoveredBy: 'Johan Gadolin (1794)'
  },
  {
    number: 40, symbol: 'Zr', name: 'Zirconium', weight: '91.224',
    category: 'transition-metal', period: 5, group: 4, x: 4, y: 5, phase: 'Solid',
    electronConfig: '[Kr] 4d² 5s²',
    summary: 'Extremely resistant to heat and corrosion with low neutron absorption, making it the ideal cladding for nuclear reactor fuel rods.',
    discoveredBy: 'Martin Heinrich Klaproth (1789)'
  },
  {
    number: 41, symbol: 'Nb', name: 'Niobium', weight: '92.906',
    category: 'transition-metal', period: 5, group: 5, x: 5, y: 5, phase: 'Solid',
    electronConfig: '[Kr] 4d⁴ 5s¹',
    summary: 'Key alloy in superconducting magnets for MRI scanners and particle accelerators like the Large Hadron Collider.',
    discoveredBy: 'Charles Hatchett (1801)'
  },
  {
    number: 42, symbol: 'Mo', name: 'Molybdenum', weight: '95.95',
    category: 'transition-metal', period: 5, group: 6, x: 6, y: 5, phase: 'Solid',
    electronConfig: '[Kr] 4d⁵ 5s¹',
    summary: 'Features one of the highest melting points among elements; essential for structural steel alloys and biological nitrogen-fixing enzymes.',
    discoveredBy: 'Carl Wilhelm Scheele (1778)'
  },
  {
    number: 43, symbol: 'Tc', name: 'Technetium', weight: '[98]',
    category: 'transition-metal', period: 5, group: 7, x: 7, y: 5, phase: 'Synthetic',
    electronConfig: '[Kr] 4d⁵ 5s²',
    summary: 'The lowest-atomic-number element without stable isotopes; Tc-99m is the workhorse tracer in millions of nuclear medical scans each year.',
    discoveredBy: 'Emilio Segrè & Carlo Perrier (1937)'
  },
  {
    number: 44, symbol: 'Ru', name: 'Ruthenium', weight: '101.07',
    category: 'transition-metal', period: 5, group: 8, x: 8, y: 5, phase: 'Solid',
    electronConfig: '[Kr] 4d⁷ 5s¹',
    summary: 'A platinum-group metal that hardens platinum alloys, serves as an efficient catalyst in metathesis reactions, and lines hard disk read heads.',
    discoveredBy: 'Karl Ernst Claus (1844)'
  },
  {
    number: 45, symbol: 'Rh', name: 'Rhodium', weight: '102.91',
    category: 'transition-metal', period: 5, group: 9, x: 9, y: 5, phase: 'Solid',
    electronConfig: '[Kr] 4d⁸ 5s¹',
    summary: 'One of the rarest and most valuable precious metals, critical in three-way automotive catalytic converters to scrub nitrogen oxides.',
    discoveredBy: 'William Hyde Wollaston (1804)'
  },
  {
    number: 46, symbol: 'Pd', name: 'Palladium', weight: '106.42',
    category: 'transition-metal', period: 5, group: 10, x: 10, y: 5, phase: 'Solid',
    electronConfig: '[Kr] 4d¹⁰',
    summary: 'Can absorb up to 900 times its own volume in hydrogen gas; premier catalyst in vehicle catalytic converters and cross-coupling reactions.',
    discoveredBy: 'William Hyde Wollaston (1802)'
  },
  {
    number: 47, symbol: 'Ag', name: 'Silver', weight: '107.87',
    category: 'transition-metal', period: 5, group: 11, x: 11, y: 5, phase: 'Solid',
    electronConfig: '[Kr] 4d¹⁰ 5s¹',
    summary: 'Possesses the highest electrical conductivity, thermal conductivity, and reflectivity of any known metal; widely used in electronics and mirrors.',
    discoveredBy: 'Known since antiquity'
  },
  {
    number: 48, symbol: 'Cd', name: 'Cadmium', weight: '112.41',
    category: 'transition-metal', period: 5, group: 12, x: 12, y: 5, phase: 'Solid',
    electronConfig: '[Kr] 4d¹⁰ 5s²',
    summary: 'A soft, bluish-white metal historically used in NiCd batteries, electroplating, and cadmium telluride (CdTe) thin-film solar panels.',
    discoveredBy: 'Karl Samuel Leberecht Hermann & Friedrich Stromeyer (1817)'
  },
  {
    number: 49, symbol: 'In', name: 'Indium', weight: '114.82',
    category: 'post-transition', period: 5, group: 13, x: 13, y: 5, phase: 'Solid',
    electronConfig: '[Kr] 4d¹⁰ 5s² 5p¹',
    summary: 'Combined with tin oxide to form ITO (indium tin oxide), the transparent conductive coating on smartphone touchscreens and flat-panel displays.',
    discoveredBy: 'Ferdinand Reich & Hieronymous Theodor Richter (1863)'
  },
  {
    number: 50, symbol: 'Sn', name: 'Tin', weight: '118.71',
    category: 'post-transition', period: 5, group: 14, x: 14, y: 5, phase: 'Solid',
    electronConfig: '[Kr] 4d¹⁰ 5s² 5p²',
    summary: 'Alloyed with copper since ancient times to make bronze, and essential today in lead-free electronics solder and corrosion-resistant tin plating.',
    discoveredBy: 'Known since antiquity'
  },
  {
    number: 51, symbol: 'Sb', name: 'Antimony', weight: '121.76',
    category: 'metalloid', period: 5, group: 15, x: 15, y: 5, phase: 'Solid',
    electronConfig: '[Kr] 4d¹⁰ 5s² 5p³',
    summary: 'A lustrous gray metalloid added to lead to increase hardness in lead-acid car battery plates, bullet alloys, and flame-retardant compounds.',
    discoveredBy: 'Known since antiquity'
  },
  {
    number: 52, symbol: 'Te', name: 'Tellurium', weight: '127.60',
    category: 'metalloid', period: 5, group: 16, x: 16, y: 5, phase: 'Solid',
    electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁴',
    summary: 'One of the rarest elements in Earth’s crust; used in cadmium telluride solar cells, phase-change optical discs, and thermoelectric generators.',
    discoveredBy: 'Franz-Joseph Müller von Reichenstein (1782)'
  },
  {
    number: 53, symbol: 'I', name: 'Iodine', weight: '126.90',
    category: 'reactive-nonmetal', period: 5, group: 17, x: 17, y: 5, phase: 'Solid',
    electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁵',
    summary: 'A lustrous purple-black solid halogen; essential in human diet for thyroid hormone production and widely used as a surgical antiseptic.',
    discoveredBy: 'Bernard Courtois (1811)'
  },
  {
    number: 54, symbol: 'Xe', name: 'Xenon', weight: '131.29',
    category: 'noble-gas', period: 5, group: 18, x: 18, y: 5, phase: 'Gas',
    electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁶',
    summary: 'A dense noble gas that generates bright blue-white flash pulses in xenon arc lamps and provides propellant for spacecraft ion thrusters.',
    discoveredBy: 'William Ramsay & Morris Travers (1898)'
  },

  // Period 6
  {
    number: 55, symbol: 'Cs', name: 'Cesium', weight: '132.91',
    category: 'alkali-metal', period: 6, group: 1, x: 1, y: 6, phase: 'Solid',
    electronConfig: '[Xe] 6s¹',
    summary: 'The most reactive alkali metal; the hyperfine transition of Cs-133 defines the international standard second in atomic clocks.',
    discoveredBy: 'Robert Bunsen & Gustav Kirchhoff (1860)'
  },
  {
    number: 56, symbol: 'Ba', name: 'Barium', weight: '137.33',
    category: 'alkaline-earth', period: 6, group: 2, x: 2, y: 6, phase: 'Solid',
    electronConfig: '[Xe] 6s²',
    summary: 'Imparts a brilliant green color to fireworks; insoluble barium sulfate is ingested as a radiopaque contrast agent for gastrointestinal X-rays.',
    discoveredBy: 'Carl Wilhelm Scheele (1772)'
  },

  // Lanthanides (La 57 to Lu 71) -> row 8
  {
    number: 57, symbol: 'La', name: 'Lanthanum', weight: '138.91',
    category: 'lanthanide', period: 6, group: 3, x: 3, y: 8, phase: 'Solid',
    electronConfig: '[Xe] 5d¹ 6s²',
    summary: 'The prototype of the lanthanide series, used in high-refractive-index camera lenses, carbon arc studio lighting, and hybrid car battery electrodes.',
    discoveredBy: 'Carl Gustaf Mosander (1839)'
  },
  {
    number: 58, symbol: 'Ce', name: 'Cerium', weight: '140.12',
    category: 'lanthanide', period: 6, group: 3, x: 4, y: 8, phase: 'Solid',
    electronConfig: '[Xe] 4f¹ 5d¹ 6s²',
    summary: 'The most abundant rare-earth element, essential in catalytic converters to store oxygen and in ceria glass-polishing abrasives.',
    discoveredBy: 'Martin Heinrich Klaproth & Jöns Jacob Berzelius (1803)'
  },
  {
    number: 59, symbol: 'Pr', name: 'Praseodymium', weight: '140.91',
    category: 'lanthanide', period: 6, group: 3, x: 5, y: 8, phase: 'Solid',
    electronConfig: '[Xe] 4f³ 6s²',
    summary: 'Imparts bright yellow-green colors to glassware and didymium glass welders’ goggles; component of strong neodymium aircraft magnets.',
    discoveredBy: 'Carl Auer von Welsbach (1885)'
  },
  {
    number: 60, symbol: 'Nd', name: 'Neodymium', weight: '144.24',
    category: 'lanthanide', period: 6, group: 3, x: 6, y: 8, phase: 'Solid',
    electronConfig: '[Xe] 4f⁴ 6s²',
    summary: 'Combined with iron and boron to create NdFeB magnets—the strongest permanent magnets known, driving EV motors and wind turbines.',
    discoveredBy: 'Carl Auer von Welsbach (1885)'
  },
  {
    number: 61, symbol: 'Pm', name: 'Promethium', weight: '[145]',
    category: 'lanthanide', period: 6, group: 3, x: 7, y: 8, phase: 'Synthetic',
    electronConfig: '[Xe] 4f⁵ 6s²',
    summary: 'An exclusively radioactive lanthanide with no stable isotopes; utilized in atomic batteries for space probes and luminous paint signals.',
    discoveredBy: 'Jacob A. Marinsky, Lawrence E. Glendenin & Charles D. Coryell (1945)'
  },
  {
    number: 62, symbol: 'Sm', name: 'Samarium', weight: '150.36',
    category: 'lanthanide', period: 6, group: 3, x: 8, y: 8, phase: 'Solid',
    electronConfig: '[Xe] 4f⁶ 6s²',
    summary: 'Powers heat-resistant samarium-cobalt (SmCo) permanent magnets used in defense guided missiles and precision headphones.',
    discoveredBy: 'Paul-Émile Lecoq de Boisbaudran (1879)'
  },
  {
    number: 63, symbol: 'Eu', name: 'Europium', weight: '151.96',
    category: 'lanthanide', period: 6, group: 3, x: 9, y: 8, phase: 'Solid',
    electronConfig: '[Xe] 4f⁷ 6s²',
    summary: 'The most chemically reactive lanthanide; its brilliant red and blue phosphorescence serves as anti-counterfeiting ink in Euro banknotes.',
    discoveredBy: 'Eugène-Anatole Demarçay (1896)'
  },
  {
    number: 64, symbol: 'Gd', name: 'Gadolinium', weight: '157.25',
    category: 'lanthanide', period: 6, group: 3, x: 10, y: 8, phase: 'Solid',
    electronConfig: '[Xe] 4f⁷ 5d¹ 6s²',
    summary: 'Paramagnetic element whose compounds are standard intravenous contrast agents in MRI scans to highlight tumors and blood vessels.',
    discoveredBy: 'Jean Charles Galissard de Marignac (1880)'
  },
  {
    number: 65, symbol: 'Tb', name: 'Terbium', weight: '158.93',
    category: 'lanthanide', period: 6, group: 3, x: 11, y: 8, phase: 'Solid',
    electronConfig: '[Xe] 4f⁹ 6s²',
    summary: 'Emits a bright green phosphorescence used in fluorescent displays and is the chief element in Terfenol-D magnetostrictive sonar transducers.',
    discoveredBy: 'Carl Gustaf Mosander (1843)'
  },
  {
    number: 66, symbol: 'Dy', name: 'Dysprosium', weight: '162.50',
    category: 'lanthanide', period: 6, group: 3, x: 12, y: 8, phase: 'Solid',
    electronConfig: '[Xe] 4f¹⁰ 6s²',
    summary: 'Added to neodymium magnets to keep them from demagnetizing under extreme high-temperature operating conditions in electric vehicles.',
    discoveredBy: 'Paul-Émile Lecoq de Boisbaudran (1886)'
  },
  {
    number: 67, symbol: 'Ho', name: 'Holmium', weight: '164.93',
    category: 'lanthanide', period: 6, group: 3, x: 13, y: 8, phase: 'Solid',
    electronConfig: '[Xe] 4f¹¹ 6s²',
    summary: 'Boasts the highest magnetic moment of any natural element; concentrates magnetic flux in high-field magnets and holmium YAG medical lasers.',
    discoveredBy: 'Per Teodor Cleve (1879)'
  },
  {
    number: 68, symbol: 'Er', name: 'Erbium', weight: '167.26',
    category: 'lanthanide', period: 6, group: 3, x: 14, y: 8, phase: 'Solid',
    electronConfig: '[Xe] 4f¹² 6s²',
    summary: 'Doped into optical fiber cables (EDFAs) to optically amplify laser light signals across thousands of miles of transoceanic internet cables.',
    discoveredBy: 'Carl Gustaf Mosander (1843)'
  },
  {
    number: 69, symbol: 'Tm', name: 'Thulium', weight: '168.93',
    category: 'lanthanide', period: 6, group: 3, x: 15, y: 8, phase: 'Solid',
    electronConfig: '[Xe] 4f¹³ 6s²',
    summary: 'The second-rarest lanthanide; bombarded in nuclear reactors to create portable X-ray sources for medical and non-destructive testing.',
    discoveredBy: 'Per Teodor Cleve (1879)'
  },
  {
    number: 70, symbol: 'Yb', name: 'Ytterbium', weight: '173.05',
    category: 'lanthanide', period: 6, group: 3, x: 16, y: 8, phase: 'Solid',
    electronConfig: '[Xe] 4f¹⁴ 6s²',
    summary: 'Used in cutting-edge optical lattice atomic clocks with unprecedented stability, stainless steel stress gauges, and fiber lasers.',
    discoveredBy: 'Jean Charles Galissard de Marignac (1878)'
  },
  {
    number: 71, symbol: 'Lu', name: 'Lutetium', weight: '174.97',
    category: 'lanthanide', period: 6, group: 3, x: 17, y: 8, phase: 'Solid',
    electronConfig: '[Xe] 4f¹⁴ 5d¹ 6s²',
    summary: 'The densest and hardest lanthanide; lutetium-177 is an advanced radiopharmaceutical targeting and destroying neuroendocrine cancer cells.',
    discoveredBy: 'Georges Urbain & Carl Auer von Welsbach (1907)'
  },

  // Remaining Period 6 transition and post-transition metals (columns 4-18)
  {
    number: 72, symbol: 'Hf', name: 'Hafnium', weight: '178.49',
    category: 'transition-metal', period: 6, group: 4, x: 4, y: 6, phase: 'Solid',
    electronConfig: '[Xe] 4f¹⁴ 5d² 6s²',
    summary: 'Possesses exceptional neutron absorption capabilities for nuclear submarine control rods and acts as a high-k gate insulator in Intel microprocessors.',
    discoveredBy: 'Dirk Coster & George de Hevesy (1923)'
  },
  {
    number: 73, symbol: 'Ta', name: 'Tantalum', weight: '180.95',
    category: 'transition-metal', period: 6, group: 5, x: 5, y: 6, phase: 'Solid',
    electronConfig: '[Xe] 4f¹⁴ 5d³ 6s²',
    summary: 'Extremely resistant to chemical corrosion, prized for miniature high-capacitance capacitors inside mobile phones and surgical bone pins.',
    discoveredBy: 'Anders Gustaf Ekeberg (1802)'
  },
  {
    number: 74, symbol: 'W', name: 'Tungsten', weight: '183.84',
    category: 'transition-metal', period: 6, group: 6, x: 6, y: 6, phase: 'Solid',
    electronConfig: '[Xe] 4f¹⁴ 5d⁴ 6s²',
    summary: 'Holds the highest melting point of all elements (3,422°C); fabricated into incandescent lamp filaments, armor-piercing projectiles, and rocket nozzles.',
    discoveredBy: 'Carl Wilhelm Scheele (1781)'
  },
  {
    number: 75, symbol: 'Re', name: 'Rhenium', weight: '186.21',
    category: 'transition-metal', period: 6, group: 7, x: 7, y: 6, phase: 'Solid',
    electronConfig: '[Xe] 4f¹⁴ 5d⁵ 6s²',
    summary: 'One of the rarest elements in Earth’s crust; added to nickel superalloys to withstand the intense thermal environment of commercial jet engine turbines.',
    discoveredBy: 'Masataka Ogawa (1908) & Walter Noddack (1925)'
  },
  {
    number: 76, symbol: 'Os', name: 'Osmium', weight: '190.23',
    category: 'transition-metal', period: 6, group: 8, x: 8, y: 6, phase: 'Solid',
    electronConfig: '[Xe] 4f¹⁴ 5d⁶ 6s²',
    summary: 'The densest natural element on Earth (22.59 g/cm³), twice as dense as lead; utilized in wear-resistant fountain pen tips and electrical contacts.',
    discoveredBy: 'Smithson Tennant (1803)'
  },
  {
    number: 77, symbol: 'Ir', name: 'Iridium', weight: '192.22',
    category: 'transition-metal', period: 6, group: 9, x: 9, y: 6, phase: 'Solid',
    electronConfig: '[Xe] 4f¹⁴ 5d⁷ 6s²',
    summary: 'The most corrosion-resistant metal known; a worldwide iridium-rich clay layer marks the Chicxulub asteroid impact that ended the dinosaurs.',
    discoveredBy: 'Smithson Tennant (1803)'
  },
  {
    number: 78, symbol: 'Pt', name: 'Platinum', weight: '195.08',
    category: 'transition-metal', period: 6, group: 10, x: 10, y: 6, phase: 'Solid',
    electronConfig: '[Xe] 4f¹⁴ 5d⁹ 6s¹',
    summary: 'A noble metal resistant to tarnish, famous in fine jewelry, hydrogen fuel cell catalyst electrodes, and cisplatin anti-cancer drugs.',
    discoveredBy: 'Antonio de Ulloa (1735)'
  },
  {
    number: 79, symbol: 'Au', name: 'Gold', weight: '196.97',
    category: 'transition-metal', period: 6, group: 11, x: 11, y: 6, phase: 'Solid',
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹',
    summary: 'The most malleable and ductile metal known; prized as a global monetary store of value and corrosion-proof connector coating in electronics.',
    discoveredBy: 'Known since antiquity'
  },
  {
    number: 80, symbol: 'Hg', name: 'Mercury', weight: '200.59',
    category: 'transition-metal', period: 6, group: 12, x: 12, y: 6, phase: 'Liquid',
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s²',
    summary: 'Known historically as quicksilver, the only metallic element that is liquid at standard temperature and pressure; used in older thermometers and barometers.',
    discoveredBy: 'Known since antiquity'
  },
  {
    number: 81, symbol: 'Tl', name: 'Thallium', weight: '204.38',
    category: 'post-transition', period: 6, group: 13, x: 13, y: 6, phase: 'Solid',
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹',
    summary: 'A soft, malleable post-transition metal historically used in rodenticides; today applied in infrared optical detectors and myocardial perfusion imaging.',
    discoveredBy: 'William Crookes (1861)'
  },
  {
    number: 82, symbol: 'Pb', name: 'Lead', weight: '207.2',
    category: 'post-transition', period: 6, group: 14, x: 14, y: 6, phase: 'Solid',
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²',
    summary: 'A dense, low-melting metal that shields against X-rays and gamma radiation; the final stable decay product of uranium and thorium radioactive decay chains.',
    discoveredBy: 'Known since antiquity'
  },
  {
    number: 83, symbol: 'Bi', name: 'Bismuth', weight: '208.98',
    category: 'post-transition', period: 6, group: 15, x: 15, y: 6, phase: 'Solid',
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³',
    summary: 'Features iridescent staircase-like hopper crystals; non-toxic heavy metal alternative used in Pepto-Bismol stomach relief and sprinkler fire fuses.',
    discoveredBy: 'Claude François Geoffroy (1753)'
  },
  {
    number: 84, symbol: 'Po', name: 'Polonium', weight: '[209]',
    category: 'post-transition', period: 6, group: 16, x: 16, y: 6, phase: 'Solid',
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴',
    summary: 'An intensely radioactive alpha-emitter discovered by Marie and Pierre Curie, used as an alpha-particle trigger in early atomic weapons.',
    discoveredBy: 'Marie & Pierre Curie (1898)'
  },
  {
    number: 85, symbol: 'At', name: 'Astatine', weight: '[210]',
    category: 'reactive-nonmetal', period: 6, group: 17, x: 17, y: 6, phase: 'Solid',
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵',
    summary: 'The rarest naturally occurring element in Earth’s crust (less than 1 gram present globally at any moment); researched for alpha immunotherapy.',
    discoveredBy: 'Dale R. Corson, Kenneth Ross MacKenzie & Emilio Segrè (1940)'
  },
  {
    number: 86, symbol: 'Rn', name: 'Radon', weight: '[222]',
    category: 'noble-gas', period: 6, group: 18, x: 18, y: 6, phase: 'Gas',
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶',
    summary: 'A radioactive, colorless noble gas produced by the natural decay of radium in soil and rocks; a notable indoor air quality health concern.',
    discoveredBy: 'Friedrich Ernst Dorn (1900)'
  },

  // Period 7
  {
    number: 87, symbol: 'Fr', name: 'Francium', weight: '[223]',
    category: 'alkali-metal', period: 7, group: 1, x: 1, y: 7, phase: 'Solid',
    electronConfig: '[Rn] 7s¹',
    summary: 'The second-rarest element in Earth’s crust and the second-most electropositive element; decomposes rapidly with a half-life of 22 minutes.',
    discoveredBy: 'Marguerite Perey (1939)'
  },
  {
    number: 88, symbol: 'Ra', name: 'Radium', weight: '[226]',
    category: 'alkaline-earth', period: 7, group: 2, x: 2, y: 7, phase: 'Solid',
    electronConfig: '[Rn] 7s²',
    summary: 'Famous luminescent radioactive element isolated from pitchblende by Marie Curie; historically used in watch dials and modern bone cancer palliative therapy.',
    discoveredBy: 'Marie & Pierre Curie (1898)'
  },

  // Actinides (Ac 89 to Lr 103) -> row 9
  {
    number: 89, symbol: 'Ac', name: 'Actinium', weight: '[227]',
    category: 'actinide', period: 7, group: 3, x: 3, y: 9, phase: 'Solid',
    electronConfig: '[Rn] 6d¹ 7s²',
    summary: 'A radioactive element giving its name to the actinide series; actinium-225 is investigated as an alpha-emitter for targeted oncology therapies.',
    discoveredBy: 'André-Louis Debierne (1899)'
  },
  {
    number: 90, symbol: 'Th', name: 'Thorium', weight: '232.04',
    category: 'actinide', period: 7, group: 3, x: 4, y: 9, phase: 'Solid',
    electronConfig: '[Rn] 6d² 7s²',
    summary: 'Abundant weakly radioactive actinide named after the Norse god Thor, researched worldwide as an inherently safe, proliferation-resistant nuclear fuel.',
    discoveredBy: 'Jöns Jacob Berzelius (1829)'
  },
  {
    number: 91, symbol: 'Pa', name: 'Protactinium', weight: '231.04',
    category: 'actinide', period: 7, group: 3, x: 5, y: 9, phase: 'Solid',
    electronConfig: '[Rn] 5f² 6d¹ 7s²',
    summary: 'A dense, highly toxic radioactive metal intermediate formed in the radioactive decay chain of uranium-235.',
    discoveredBy: 'Kasimir Fajans & Oswald Helmuth Göhring (1913)'
  },
  {
    number: 92, symbol: 'U', name: 'Uranium', weight: '238.03',
    category: 'actinide', period: 7, group: 3, x: 6, y: 9, phase: 'Solid',
    electronConfig: '[Rn] 5f³ 6d¹ 7s²',
    summary: 'The primary nuclear fuel for nuclear power reactors worldwide; U-235 undergoes neutron-induced nuclear fission to generate massive energy.',
    discoveredBy: 'Martin Heinrich Klaproth (1789)'
  },
  {
    number: 93, symbol: 'Np', name: 'Neptunium', weight: '[237]',
    category: 'actinide', period: 7, group: 3, x: 7, y: 9, phase: 'Synthetic',
    electronConfig: '[Rn] 5f⁴ 6d¹ 7s²',
    summary: 'The first transuranic synthetic element produced in particle accelerators, named after Neptune as it lies directly beyond uranium.',
    discoveredBy: 'Edwin McMillan & Philip H. Abelson (1940)'
  },
  {
    number: 94, symbol: 'Pu', name: 'Plutonium', weight: '[244]',
    category: 'actinide', period: 7, group: 3, x: 8, y: 9, phase: 'Synthetic',
    electronConfig: '[Rn] 5f⁶ 7s²',
    summary: 'Fissile isotope Pu-239 fuels nuclear reactors and weapons; Pu-238 alpha decay powers radioisotope thermoelectric generators on Voyager and Mars rovers.',
    discoveredBy: 'Glenn T. Seaborg et al. (1940)'
  },
  {
    number: 95, symbol: 'Am', name: 'Americium', weight: '[243]',
    category: 'actinide', period: 7, group: 3, x: 9, y: 9, phase: 'Synthetic',
    electronConfig: '[Rn] 5f⁷ 7s²',
    summary: 'A synthetic actinide whose isotope Am-241 ionizes air in household ionization smoke detectors, saving countless lives worldwide.',
    discoveredBy: 'Glenn T. Seaborg et al. (1944)'
  },
  {
    number: 96, symbol: 'Cm', name: 'Curium', weight: '[247]',
    category: 'actinide', period: 7, group: 3, x: 10, y: 9, phase: 'Synthetic',
    electronConfig: '[Rn] 5f⁷ 6d¹ 7s²',
    summary: 'Named in honor of Marie and Pierre Curie, curium provided the alpha-particle X-ray spectrometer sources aboard several Mars exploration rovers.',
    discoveredBy: 'Glenn T. Seaborg, Ralph A. James & Albert Ghiorso (1944)'
  },
  {
    number: 97, symbol: 'Bk', name: 'Berkelium', weight: '[247]',
    category: 'actinide', period: 7, group: 3, x: 11, y: 9, phase: 'Synthetic',
    electronConfig: '[Rn] 5f⁹ 7s²',
    summary: 'Named after UC Berkeley where it was synthesized by bombarding americium with alpha particles; target material used to synthesize tennessine.',
    discoveredBy: 'Stanley G. Thompson, Albert Ghiorso & Glenn T. Seaborg (1949)'
  },
  {
    number: 98, symbol: 'Cf', name: 'Californium', weight: '[251]',
    category: 'actinide', period: 7, group: 3, x: 12, y: 9, phase: 'Synthetic',
    electronConfig: '[Rn] 5f¹⁰ 7s²',
    summary: 'A potent spontaneous neutron emitter; Californium-252 is utilized in neutron moisture gauges, oil well logging, and nuclear reactor startup.',
    discoveredBy: 'Stanley G. Thompson et al. (1950)'
  },
  {
    number: 99, symbol: 'Es', name: 'Einsteinium', weight: '[252]',
    category: 'actinide', period: 7, group: 3, x: 13, y: 9, phase: 'Synthetic',
    electronConfig: '[Rn] 5f¹¹ 7s²',
    summary: 'Named after Albert Einstein; discovered in the radioactive debris fallout of the first thermonuclear hydrogen bomb test (Ivy Mike) in 1952.',
    discoveredBy: 'Albert Ghiorso et al. (1952)'
  },
  {
    number: 100, symbol: 'Fm', name: 'Fermium', weight: '[257]',
    category: 'actinide', period: 7, group: 3, x: 14, y: 9, phase: 'Synthetic',
    electronConfig: '[Rn] 5f¹² 7s²',
    summary: 'Named in honor of Enrico Fermi; the heaviest element that can currently be synthesized by neutron capture in nuclear reactors.',
    discoveredBy: 'Albert Ghiorso et al. (1953)'
  },
  {
    number: 101, symbol: 'Md', name: 'Mendelevium', weight: '[258]',
    category: 'actinide', period: 7, group: 3, x: 15, y: 9, phase: 'Synthetic',
    electronConfig: '[Rn] 5f¹³ 7s²',
    summary: 'Named in honor of Dmitri Mendeleev, father of the periodic table; synthesized one atom at a time via alpha bombardment of einsteinium.',
    discoveredBy: 'Albert Ghiorso, Bernard G. Harvey et al. (1955)'
  },
  {
    number: 102, symbol: 'No', name: 'Nobelium', weight: '[259]',
    category: 'actinide', period: 7, group: 3, x: 16, y: 9, phase: 'Synthetic',
    electronConfig: '[Rn] 5f¹⁴ 7s²',
    summary: 'Named after Alfred Nobel, inventor of dynamite and founder of the Nobel Prizes; synthesized in heavy-ion linear accelerators.',
    discoveredBy: 'Joint Institute for Nuclear Research (1966)'
  },
  {
    number: 103, symbol: 'Lr', name: 'Lawrencium', weight: '[266]',
    category: 'actinide', period: 7, group: 3, x: 17, y: 9, phase: 'Synthetic',
    electronConfig: '[Rn] 5f¹⁴ 7s² 7p¹',
    summary: 'The final member of the actinide series, named for Ernest Lawrence, pioneer of the cyclotron particle accelerator.',
    discoveredBy: 'Albert Ghiorso et al. (1961)'
  },

  // Remaining Period 7 Superheavy Transition & Post-Transition (columns 4-18)
  {
    number: 104, symbol: 'Rf', name: 'Rutherfordium', weight: '[267]',
    category: 'transition-metal', period: 7, group: 4, x: 4, y: 7, phase: 'Synthetic',
    electronConfig: '[Rn] 5f¹⁴ 6d² 7s²',
    summary: 'The first transactinide superheavy element, named in honor of Ernest Rutherford, the father of nuclear physics.',
    discoveredBy: 'Dubna & Berkeley laboratories (1964/1969)'
  },
  {
    number: 105, symbol: 'Db', name: 'Dubnium', weight: '[268]',
    category: 'transition-metal', period: 7, group: 5, x: 5, y: 7, phase: 'Synthetic',
    electronConfig: '[Rn] 5f¹⁴ 6d³ 7s²',
    summary: 'A synthetic transactinide element named after the Russian nuclear research center in Dubna where heavy element synthesis flourished.',
    discoveredBy: 'Dubna & Berkeley laboratories (1968/1970)'
  },
  {
    number: 106, symbol: 'Sg', name: 'Seaborgium', weight: '[269]',
    category: 'transition-metal', period: 7, group: 6, x: 6, y: 7, phase: 'Synthetic',
    electronConfig: '[Rn] 5f¹⁴ 6d⁴ 7s²',
    summary: 'Named after American chemist Glenn T. Seaborg, the first time an element was named after a living person.',
    discoveredBy: 'Lawrence Berkeley Laboratory (1974)'
  },
  {
    number: 107, symbol: 'Bh', name: 'Bohrium', weight: '[270]',
    category: 'transition-metal', period: 7, group: 7, x: 7, y: 7, phase: 'Synthetic',
    electronConfig: '[Rn] 5f¹⁴ 6d⁵ 7s²',
    summary: 'Named in honor of Danish physicist Niels Bohr, fundamental contributor to quantum mechanics and atomic orbital models.',
    discoveredBy: 'GSI Helmholtz Centre for Heavy Ion Research (1981)'
  },
  {
    number: 108, symbol: 'Hs', name: 'Hassium', weight: '[269]',
    category: 'transition-metal', period: 7, group: 8, x: 8, y: 7, phase: 'Synthetic',
    electronConfig: '[Rn] 5f¹⁴ 6d⁶ 7s²',
    summary: 'Named after the German state of Hesse (Hassia); forms volatile hassium tetroxide (HsO₄) demonstrating periodic chemical trends.',
    discoveredBy: 'GSI Helmholtz Centre for Heavy Ion Research (1984)'
  },
  {
    number: 109, symbol: 'Mt', name: 'Meitnerium', weight: '[278]',
    category: 'unknown', period: 7, group: 9, x: 9, y: 7, phase: 'Synthetic',
    electronConfig: '[Rn] 5f¹⁴ 6d⁷ 7s²',
    summary: 'Named in honor of Lise Meitner, the pioneering Austrian physicist who discovered nuclear fission alongside Otto Hahn.',
    discoveredBy: 'GSI Helmholtz Centre for Heavy Ion Research (1982)'
  },
  {
    number: 110, symbol: 'Ds', name: 'Darmstadtium', weight: '[281]',
    category: 'unknown', period: 7, group: 10, x: 10, y: 7, phase: 'Synthetic',
    electronConfig: '[Rn] 5f¹⁴ 6d⁸ 7s²',
    summary: 'Named after Darmstadt, Germany, the home city of the GSI accelerator where multiple superheavy elements were brought into existence.',
    discoveredBy: 'GSI Helmholtz Centre for Heavy Ion Research (1994)'
  },
  {
    number: 111, symbol: 'Rg', name: 'Roentgenium', weight: '[282]',
    category: 'unknown', period: 7, group: 11, x: 11, y: 7, phase: 'Synthetic',
    electronConfig: '[Rn] 5f¹⁴ 6d⁹ 7s²',
    summary: 'Named in honor of Wilhelm Conrad Röntgen, the discoverer of X-rays and recipient of the first Nobel Prize in Physics.',
    discoveredBy: 'GSI Helmholtz Centre for Heavy Ion Research (1994)'
  },
  {
    number: 112, symbol: 'Cn', name: 'Copernicium', weight: '[285]',
    category: 'transition-metal', period: 7, group: 12, x: 12, y: 7, phase: 'Synthetic',
    electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s²',
    summary: 'Named after astronomer Nicolaus Copernicus; due to relativistic electron effects, Copernicium is predicted to behave as a volatile noble metal gas.',
    discoveredBy: 'GSI Helmholtz Centre for Heavy Ion Research (1996)'
  },
  {
    number: 113, symbol: 'Nh', name: 'Nihonium', weight: '[286]',
    category: 'post-transition', period: 7, group: 13, x: 13, y: 7, phase: 'Synthetic',
    electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹',
    summary: 'The first chemical element discovered in an Asian nation, named after Nihon (Japan) by researchers at the RIKEN Nishina Center.',
    discoveredBy: 'RIKEN (2004)'
  },
  {
    number: 114, symbol: 'Fl', name: 'Flerovium', weight: '[289]',
    category: 'post-transition', period: 7, group: 14, x: 14, y: 7, phase: 'Synthetic',
    electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²',
    summary: 'Named after the Flerov Laboratory of Nuclear Reactions in Russia; sits near the theoretical "Island of Stability" for superheavy nuclei.',
    discoveredBy: 'Joint Institute for Nuclear Research & LLNL (1998)'
  },
  {
    number: 115, symbol: 'Mc', name: 'Moscovium', weight: '[290]',
    category: 'post-transition', period: 7, group: 15, x: 15, y: 7, phase: 'Synthetic',
    electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³',
    summary: 'Named in honor of the Moscow region; synthesized by bombarding americium-243 targets with calcium-48 ion beams.',
    discoveredBy: 'Joint Institute for Nuclear Research & LLNL (2003)'
  },
  {
    number: 116, symbol: 'Lv', name: 'Livermorium', weight: '[293]',
    category: 'post-transition', period: 7, group: 16, x: 16, y: 7, phase: 'Synthetic',
    electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴',
    summary: 'Named after the Lawrence Livermore National Laboratory in California, celebrating international collaboration in nuclear science.',
    discoveredBy: 'Joint Institute for Nuclear Research & LLNL (2000)'
  },
  {
    number: 117, symbol: 'Ts', name: 'Tennessine', weight: '[294]',
    category: 'unknown', period: 7, group: 17, x: 17, y: 7, phase: 'Synthetic',
    electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵',
    summary: 'Named after the state of Tennessee (Oak Ridge National Laboratory, Vanderbilt, and UT Knoxville) which provided key target isotopes.',
    discoveredBy: 'Joint Institute for Nuclear Research, LLNL & ORNL (2010)'
  },
  {
    number: 118, symbol: 'Og', name: 'Oganesson', weight: '[294]',
    category: 'noble-gas', period: 7, group: 18, x: 18, y: 7, phase: 'Synthetic',
    electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶',
    summary: 'The highest atomic number element currently confirmed (118), completing Period 7; named after Russian nuclear physicist Yuri Oganessian.',
    discoveredBy: 'Joint Institute for Nuclear Research & LLNL (2002)'
  }
];

export const ELEMENT_CATEGORIES = [
  { id: 'all', label: 'All Elements', color: 'bg-slate-100 text-slate-800 border-slate-300' },
  { id: 'reactive-nonmetal', label: 'Reactive Nonmetals', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'noble-gas', label: 'Noble Gases', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { id: 'alkali-metal', label: 'Alkali Metals', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  { id: 'alkaline-earth', label: 'Alkaline Earth Metals', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  { id: 'metalloid', label: 'Metalloids', color: 'bg-teal-100 text-teal-800 border-teal-300' },
  { id: 'post-transition', label: 'Post-Transition Metals', color: 'bg-sky-100 text-sky-800 border-sky-300' },
  { id: 'transition-metal', label: 'Transition Metals', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'lanthanide', label: 'Lanthanides', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { id: 'actinide', label: 'Actinides', color: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300' },
  { id: 'unknown', label: 'Superheavy / Unknown', color: 'bg-slate-200 text-slate-700 border-slate-400' },
];

export function getCategoryStyles(category: string): { bg: string; text: string; border: string; badge: string } {
  switch (category) {
    case 'reactive-nonmetal':
      return { bg: 'bg-emerald-50 hover:bg-emerald-100', text: 'text-emerald-900', border: 'border-emerald-200', badge: 'bg-emerald-500 text-white' };
    case 'noble-gas':
      return { bg: 'bg-purple-50 hover:bg-purple-100', text: 'text-purple-900', border: 'border-purple-200', badge: 'bg-purple-500 text-white' };
    case 'alkali-metal':
      return { bg: 'bg-rose-50 hover:bg-rose-100', text: 'text-rose-900', border: 'border-rose-200', badge: 'bg-rose-500 text-white' };
    case 'alkaline-earth':
      return { bg: 'bg-amber-50 hover:bg-amber-100', text: 'text-amber-900', border: 'border-amber-200', badge: 'bg-amber-500 text-white' };
    case 'metalloid':
      return { bg: 'bg-teal-50 hover:bg-teal-100', text: 'text-teal-900', border: 'border-teal-200', badge: 'bg-teal-500 text-white' };
    case 'post-transition':
      return { bg: 'bg-sky-50 hover:bg-sky-100', text: 'text-sky-900', border: 'border-sky-200', badge: 'bg-sky-500 text-white' };
    case 'transition-metal':
      return { bg: 'bg-blue-50 hover:bg-blue-100', text: 'text-blue-900', border: 'border-blue-200', badge: 'bg-blue-500 text-white' };
    case 'lanthanide':
      return { bg: 'bg-indigo-50 hover:bg-indigo-100', text: 'text-indigo-900', border: 'border-indigo-200', badge: 'bg-indigo-500 text-white' };
    case 'actinide':
      return { bg: 'bg-fuchsia-50 hover:bg-fuchsia-100', text: 'text-fuchsia-900', border: 'border-fuchsia-200', badge: 'bg-fuchsia-500 text-white' };
    default:
      return { bg: 'bg-slate-50 hover:bg-slate-100', text: 'text-slate-800', border: 'border-slate-200', badge: 'bg-slate-500 text-white' };
  }
}
