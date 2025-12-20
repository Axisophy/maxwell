import { Question } from './types';

export const questions: Question[] = [
  // ========================================
  // TIER 1: SPARK - Curious 8-9 year old
  // ========================================

  // Biology
  { id: 't1-001', tier: 1, category: 'biology', question: 'How many legs does a spider have?', answers: ['6', '8', '10', '4'], correctIndex: 1 },
  { id: 't1-002', tier: 1, category: 'biology', question: 'What do you call a baby frog?', answers: ['Puppy', 'Cub', 'Tadpole', 'Chick'], correctIndex: 2 },
  { id: 't1-003', tier: 1, category: 'biology', question: 'How many legs does an insect have?', answers: ['4', '6', '8', '10'], correctIndex: 1 },
  { id: 't1-004', tier: 1, category: 'biology', question: 'What animal has a trunk?', answers: ['Giraffe', 'Lion', 'Elephant', 'Zebra'], correctIndex: 2 },
  { id: 't1-005', tier: 1, category: 'biology', question: 'What do caterpillars turn into?', answers: ['Worms', 'Butterflies', 'Beetles', 'Spiders'], correctIndex: 1 },

  // Space
  { id: 't1-006', tier: 1, category: 'space', question: 'Is the Sun a star or a planet?', answers: ['Planet', 'Star', 'Moon', 'Asteroid'], correctIndex: 1 },
  { id: 't1-007', tier: 1, category: 'space', question: 'What planet is closest to the Sun?', answers: ['Venus', 'Earth', 'Mercury', 'Mars'], correctIndex: 2 },
  { id: 't1-008', tier: 1, category: 'space', question: 'Which is bigger: the Earth or the Moon?', answers: ['The Moon', 'The Earth', 'They are the same', 'It depends'], correctIndex: 1 },
  { id: 't1-009', tier: 1, category: 'space', question: 'What colour is Mars often called?', answers: ['The Blue Planet', 'The Red Planet', 'The Green Planet', 'The Yellow Planet'], correctIndex: 1 },
  { id: 't1-010', tier: 1, category: 'space', question: 'How many planets are in our solar system?', answers: ['7', '8', '9', '10'], correctIndex: 1 },

  // Physics
  { id: 't1-011', tier: 1, category: 'physics', question: 'What falls from clouds when it rains?', answers: ['Sand', 'Water', 'Air', 'Dust'], correctIndex: 1 },
  { id: 't1-012', tier: 1, category: 'physics', question: "What's frozen water called?", answers: ['Steam', 'Ice', 'Fog', 'Cloud'], correctIndex: 1 },
  { id: 't1-013', tier: 1, category: 'physics', question: 'What force pulls things down to the ground?', answers: ['Magnetism', 'Wind', 'Gravity', 'Electricity'], correctIndex: 2 },
  { id: 't1-014', tier: 1, category: 'physics', question: 'What do we use to see in the dark?', answers: ['Sound', 'Light', 'Heat', 'Wind'], correctIndex: 1 },
  { id: 't1-015', tier: 1, category: 'physics', question: 'Which is faster: a car or a snail?', answers: ['A snail', 'A car', 'They are equal', 'It depends on the weather'], correctIndex: 1 },

  // Earth
  { id: 't1-016', tier: 1, category: 'earth', question: 'What do plants need to grow?', answers: ['Darkness', 'Sunlight and water', 'Only air', 'Just soil'], correctIndex: 1 },
  { id: 't1-017', tier: 1, category: 'earth', question: 'What is the hottest season?', answers: ['Winter', 'Autumn', 'Summer', 'Spring'], correctIndex: 2 },
  { id: 't1-018', tier: 1, category: 'earth', question: "What's the largest ocean on Earth?", answers: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctIndex: 3 },

  // Maths
  { id: 't1-019', tier: 1, category: 'maths', question: 'How many sides does a triangle have?', answers: ['2', '3', '4', '5'], correctIndex: 1 },
  { id: 't1-020', tier: 1, category: 'maths', question: 'What is 7 + 8?', answers: ['13', '14', '15', '16'], correctIndex: 2 },

  // ========================================
  // TIER 2: EMBER - Sharp 10-11 year old
  // ========================================

  // Biology
  { id: 't2-001', tier: 2, category: 'biology', question: 'What gas do we breathe out that plants need?', answers: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Helium'], correctIndex: 2 },
  { id: 't2-002', tier: 2, category: 'biology', question: 'What type of animal is a dolphin?', answers: ['Fish', 'Reptile', 'Mammal', 'Amphibian'], correctIndex: 2 },
  { id: 't2-003', tier: 2, category: 'biology', question: 'Roughly how many bones are in the human body?', answers: ['About 50', 'About 100', 'About 200', 'About 400'], correctIndex: 2 },
  { id: 't2-004', tier: 2, category: 'biology', question: 'What is the largest land animal?', answers: ['Giraffe', 'Elephant', 'Rhinoceros', 'Hippopotamus'], correctIndex: 1 },
  { id: 't2-005', tier: 2, category: 'biology', question: 'What do herbivores eat?', answers: ['Meat', 'Plants', 'Both', 'Neither'], correctIndex: 1 },

  // Space
  { id: 't2-006', tier: 2, category: 'space', question: 'What planet is famous for its rings?', answers: ['Jupiter', 'Mars', 'Saturn', 'Neptune'], correctIndex: 2 },
  { id: 't2-007', tier: 2, category: 'space', question: 'What makes the Moon shine?', answers: ['It makes its own light', 'Reflected sunlight', 'Electricity', 'Radioactivity'], correctIndex: 1 },
  { id: 't2-008', tier: 2, category: 'space', question: 'How long does Earth take to orbit the Sun?', answers: ['One day', 'One month', 'One year', 'One decade'], correctIndex: 2 },
  { id: 't2-009', tier: 2, category: 'space', question: 'What is the name of our galaxy?', answers: ['Andromeda', 'The Milky Way', 'The Solar System', 'The Universe'], correctIndex: 1 },
  { id: 't2-010', tier: 2, category: 'space', question: 'Which planet is known for its Great Red Spot?', answers: ['Mars', 'Jupiter', 'Saturn', 'Venus'], correctIndex: 1 },

  // Physics
  { id: 't2-011', tier: 2, category: 'physics', question: 'What force keeps planets orbiting the Sun?', answers: ['Magnetism', 'Electricity', 'Gravity', 'Friction'], correctIndex: 2 },
  { id: 't2-012', tier: 2, category: 'physics', question: 'What are the three states of matter?', answers: ['Hot, cold, warm', 'Solid, liquid, gas', 'Earth, water, air', 'Hard, soft, squishy'], correctIndex: 1 },
  { id: 't2-013', tier: 2, category: 'physics', question: 'What type of energy does a moving car have?', answers: ['Potential energy', 'Kinetic energy', 'Chemical energy', 'Nuclear energy'], correctIndex: 1 },
  { id: 't2-014', tier: 2, category: 'physics', question: 'What does a thermometer measure?', answers: ['Weight', 'Speed', 'Temperature', 'Distance'], correctIndex: 2 },

  // Chemistry
  { id: 't2-015', tier: 2, category: 'chemistry', question: 'What gas do we need to breathe to survive?', answers: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'], correctIndex: 2 },
  { id: 't2-016', tier: 2, category: 'chemistry', question: 'What is H2O the formula for?', answers: ['Salt', 'Sugar', 'Water', 'Air'], correctIndex: 2 },

  // Earth
  { id: 't2-017', tier: 2, category: 'earth', question: 'What are scientists who study dinosaurs called?', answers: ['Biologists', 'Archaeologists', 'Palaeontologists', 'Geologists'], correctIndex: 2 },
  { id: 't2-018', tier: 2, category: 'earth', question: 'What causes day and night?', answers: ['The Moon moving', 'Earth spinning', 'The Sun moving', 'Clouds'], correctIndex: 1 },

  // Maths
  { id: 't2-019', tier: 2, category: 'maths', question: 'What is the perimeter of a square with sides of 5cm?', answers: ['10cm', '15cm', '20cm', '25cm'], correctIndex: 2 },
  { id: 't2-020', tier: 2, category: 'maths', question: 'What is 12 × 12?', answers: ['124', '134', '144', '154'], correctIndex: 2 },

  // ========================================
  // TIER 3: FLAME - Curious 12-13 year old
  // ========================================

  // Biology
  { id: 't3-001', tier: 3, category: 'biology', question: "What's the largest organ in the human body?", answers: ['Heart', 'Brain', 'Liver', 'Skin'], correctIndex: 3 },
  { id: 't3-002', tier: 3, category: 'biology', question: 'What kingdom do mushrooms belong to?', answers: ['Plants', 'Animals', 'Fungi', 'Bacteria'], correctIndex: 2 },
  { id: 't3-003', tier: 3, category: 'biology', question: "What's the powerhouse of the cell?", answers: ['Nucleus', 'Mitochondria', 'Ribosome', 'Cell wall'], correctIndex: 1 },
  { id: 't3-004', tier: 3, category: 'biology', question: 'What does DNA stand for?', answers: ['Deoxyribonucleic acid', 'Dinitrogen acid', 'Dynamic nuclear acid', 'Dense nucleic arrangement'], correctIndex: 0 },
  { id: 't3-005', tier: 3, category: 'biology', question: 'How many hearts does an octopus have?', answers: ['1', '2', '3', '4'], correctIndex: 2 },

  // Physics
  { id: 't3-006', tier: 3, category: 'physics', question: 'Why do we see lightning before we hear thunder?', answers: ['Lightning is louder', 'Light travels faster than sound', 'Thunder starts later', 'Our eyes are faster than ears'], correctIndex: 1 },
  { id: 't3-007', tier: 3, category: 'physics', question: 'Which travels faster: light or sound?', answers: ['Sound', 'Light', 'They are equal', 'It depends on the medium'], correctIndex: 1 },
  { id: 't3-008', tier: 3, category: 'physics', question: 'What unit is used to measure electrical current?', answers: ['Volts', 'Watts', 'Amps', 'Ohms'], correctIndex: 2 },

  // Chemistry
  { id: 't3-009', tier: 3, category: 'chemistry', question: "What's the chemical formula for water?", answers: ['CO2', 'H2O', 'NaCl', 'O2'], correctIndex: 1 },
  { id: 't3-010', tier: 3, category: 'chemistry', question: 'What element does the symbol Fe represent?', answers: ['Fluorine', 'Francium', 'Iron', 'Fermium'], correctIndex: 2 },
  { id: 't3-011', tier: 3, category: 'chemistry', question: "What's the only metal that's liquid at room temperature?", answers: ['Lead', 'Tin', 'Mercury', 'Aluminium'], correctIndex: 2 },
  { id: 't3-012', tier: 3, category: 'chemistry', question: "What gas makes up about 78% of Earth's atmosphere?", answers: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Argon'], correctIndex: 2 },

  // Space
  { id: 't3-013', tier: 3, category: 'space', question: 'How many planets in our solar system have rings?', answers: ['1', '2', '4', '6'], correctIndex: 2, explanation: 'Jupiter, Saturn, Uranus, and Neptune all have ring systems.' },
  { id: 't3-014', tier: 3, category: 'space', question: 'What is a light-year a measure of?', answers: ['Time', 'Distance', 'Speed', 'Brightness'], correctIndex: 1 },

  // Earth
  { id: 't3-015', tier: 3, category: 'earth', question: 'What type of rock is formed from cooled lava?', answers: ['Sedimentary', 'Metamorphic', 'Igneous', 'Ite'], correctIndex: 2 },
  { id: 't3-016', tier: 3, category: 'earth', question: 'What scale measures earthquake magnitude?', answers: ['Beaufort scale', 'Richter scale', 'Mohs scale', 'Kelvin scale'], correctIndex: 1 },

  // Maths
  { id: 't3-017', tier: 3, category: 'maths', question: 'What is the value of Pi to two decimal places?', answers: ['3.12', '3.14', '3.16', '3.18'], correctIndex: 1 },
  { id: 't3-018', tier: 3, category: 'maths', question: 'How many degrees are in a right angle?', answers: ['45', '90', '180', '360'], correctIndex: 1 },
  { id: 't3-019', tier: 3, category: 'maths', question: 'What is the square root of 144?', answers: ['10', '11', '12', '14'], correctIndex: 2 },
  { id: 't3-020', tier: 3, category: 'maths', question: 'In the equation y = mx + c, what does m represent?', answers: ['The y-intercept', 'The gradient', 'The x value', 'The constant'], correctIndex: 1 },

  // ========================================
  // TIER 4: FIRE - GCSE Level
  // ========================================

  // Physics
  { id: 't4-001', tier: 4, category: 'physics', question: "What's the difference between velocity and speed?", answers: ['They are the same', 'Velocity includes direction', 'Speed includes direction', 'Velocity is always faster'], correctIndex: 1 },
  { id: 't4-002', tier: 4, category: 'physics', question: "What's Ohm's Law?", answers: ['V = IR', 'E = mc2', 'F = ma', 'P = IV'], correctIndex: 0 },
  { id: 't4-003', tier: 4, category: 'physics', question: 'Why are metals good conductors of electricity?', answers: ['They are shiny', 'They have free electrons', 'They are heavy', 'They are solid'], correctIndex: 1 },
  { id: 't4-004', tier: 4, category: 'physics', question: "What's a parsec a unit of?", answers: ['Time', 'Speed', 'Distance', 'Temperature'], correctIndex: 2 },

  // Chemistry
  { id: 't4-005', tier: 4, category: 'chemistry', question: 'What is the atomic number of carbon?', answers: ['4', '6', '8', '12'], correctIndex: 1 },
  { id: 't4-006', tier: 4, category: 'chemistry', question: 'What type of bond shares electrons between atoms?', answers: ['Ionic', 'Covalent', 'Metallic', 'Hydrogen'], correctIndex: 1 },
  { id: 't4-007', tier: 4, category: 'chemistry', question: "What's the hardest natural substance on Earth?", answers: ['Granite', 'Diamond', 'Quartz', 'Steel'], correctIndex: 1 },
  { id: 't4-008', tier: 4, category: 'chemistry', question: 'What is an isotope?', answers: ['An ion with charge', 'An atom with different neutrons', 'A molecule with two atoms', 'A radioactive element'], correctIndex: 1 },

  // Biology
  { id: 't4-009', tier: 4, category: 'biology', question: 'What part of a plant cell contains chlorophyll?', answers: ['Nucleus', 'Mitochondria', 'Chloroplast', 'Vacuole'], correctIndex: 2 },
  { id: 't4-010', tier: 4, category: 'biology', question: "What's the difference between mitosis and meiosis?", answers: ['Mitosis makes sex cells', 'Meiosis produces identical cells', 'Mitosis produces identical cells, meiosis makes sex cells', 'They are the same process'], correctIndex: 2 },
  { id: 't4-011', tier: 4, category: 'biology', question: 'What carries oxygen in red blood cells?', answers: ['Plasma', 'Haemoglobin', 'Platelets', 'White cells'], correctIndex: 1 },

  // Maths
  { id: 't4-012', tier: 4, category: 'maths', question: 'What is the quadratic formula used to solve?', answers: ['Linear equations', 'Quadratic equations', 'Cubic equations', 'Differential equations'], correctIndex: 1 },
  { id: 't4-013', tier: 4, category: 'maths', question: 'What is sin(90)?', answers: ['0', '0.5', '1', 'Undefined'], correctIndex: 2 },
  { id: 't4-014', tier: 4, category: 'maths', question: 'What does the gradient of a distance-time graph represent?', answers: ['Acceleration', 'Speed', 'Distance', 'Time'], correctIndex: 1 },

  // Engineering
  { id: 't4-015', tier: 4, category: 'engineering', question: 'Why are manhole covers round?', answers: ['Easier to make', "Can't fall through the hole", 'Roll better', 'Historical reasons'], correctIndex: 1 },

  // History of Science
  { id: 't4-016', tier: 4, category: 'history', question: 'Who proposed the theory of evolution by natural selection?', answers: ['Isaac Newton', 'Albert Einstein', 'Charles Darwin', 'Gregor Mendel'], correctIndex: 2 },
  { id: 't4-017', tier: 4, category: 'history', question: "What does 'dinosaur' literally mean?", answers: ['Old lizard', 'Terrible lizard', 'Giant reptile', 'Ancient beast'], correctIndex: 1 },

  // Computing
  { id: 't4-018', tier: 4, category: 'computing', question: 'What does CPU stand for?', answers: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Processing Unit'], correctIndex: 0 },
  { id: 't4-019', tier: 4, category: 'computing', question: 'What number system do computers use internally?', answers: ['Decimal', 'Binary', 'Hexadecimal', 'Octal'], correctIndex: 1 },
  { id: 't4-020', tier: 4, category: 'computing', question: 'How many bits are in a byte?', answers: ['4', '8', '16', '32'], correctIndex: 1 },

  // ========================================
  // TIER 5: BLAZE - A-Level / Enthusiast
  // ========================================

  // Physics
  { id: 't5-001', tier: 5, category: 'physics', question: "What's the second law of thermodynamics (simply)?", answers: ['Energy is conserved', 'Entropy always increases', 'Every action has a reaction', 'Force equals mass times acceleration'], correctIndex: 1 },
  { id: 't5-002', tier: 5, category: 'physics', question: "What's activation energy?", answers: ['Energy released in a reaction', 'Minimum energy needed for a reaction', 'Energy stored in bonds', 'Total energy of products'], correctIndex: 1 },
  { id: 't5-003', tier: 5, category: 'physics', question: 'What does e = mc2 mean in words?', answers: ['Energy equals mass times speed', 'Energy equals mass times speed of light squared', 'Everything equals matter times light', 'Energy and mass are unrelated'], correctIndex: 1 },
  { id: 't5-004', tier: 5, category: 'physics', question: 'What is the observer effect in physics?', answers: ['Observers see different things', 'Measurement can change what is measured', 'Time appears different to observers', 'Light bends around observers'], correctIndex: 1 },

  // Chemistry
  { id: 't5-005', tier: 5, category: 'chemistry', question: "What's a mole in chemistry?", answers: ['A small furry animal', '6.022 x 10^23 particles', 'A unit of volume', 'A type of bond'], correctIndex: 1 },
  { id: 't5-006', tier: 5, category: 'chemistry', question: "What's the unit of electrical resistance?", answers: ['Amp', 'Volt', 'Ohm', 'Watt'], correctIndex: 2 },
  { id: 't5-007', tier: 5, category: 'chemistry', question: 'What is an exothermic reaction?', answers: ['One that absorbs heat', 'One that releases heat', 'One that needs light', 'One that produces gas'], correctIndex: 1 },

  // Biology
  { id: 't5-008', tier: 5, category: 'biology', question: 'What organelle is responsible for protein synthesis?', answers: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'], correctIndex: 2 },
  { id: 't5-009', tier: 5, category: 'biology', question: "What's the function of haemoglobin?", answers: ['Fighting infection', 'Carrying oxygen', 'Clotting blood', 'Producing hormones'], correctIndex: 1 },
  { id: 't5-010', tier: 5, category: 'biology', question: 'What shape is a DNA molecule?', answers: ['Single helix', 'Double helix', 'Triple helix', 'Straight chain'], correctIndex: 1 },

  // Maths
  { id: 't5-011', tier: 5, category: 'maths', question: "Why can't you divide by zero?", answers: ['The answer is always zero', 'It gives infinity', "It's undefined and leads to contradictions", 'Computers cannot handle it'], correctIndex: 2 },
  { id: 't5-012', tier: 5, category: 'maths', question: 'What is the next number: 1, 1, 2, 3, 5, 8, ...?', answers: ['11', '12', '13', '14'], correctIndex: 2, explanation: 'This is the Fibonacci sequence - each number is the sum of the two before it.' },
  { id: 't5-013', tier: 5, category: 'maths', question: 'What is the derivative of x squared?', answers: ['x', '2x', 'x squared', '2x squared'], correctIndex: 1 },
  { id: 't5-014', tier: 5, category: 'maths', question: 'What is i (the imaginary unit) equal to?', answers: ['Square root of 1', 'Square root of -1', '-1', '1'], correctIndex: 1 },

  // Space
  { id: 't5-015', tier: 5, category: 'space', question: 'What percentage of the universe is ordinary matter?', answers: ['About 5%', 'About 25%', 'About 50%', 'About 75%'], correctIndex: 0, explanation: 'About 68% is dark energy, 27% is dark matter, and only about 5% is ordinary matter.' },
  { id: 't5-016', tier: 5, category: 'space', question: 'If you drop a hammer and feather on the Moon, which lands first?', answers: ['Hammer', 'Feather', 'Same time', 'Neither falls'], correctIndex: 2, explanation: 'Without air resistance, all objects fall at the same rate regardless of mass.' },

  // History
  { id: 't5-017', tier: 5, category: 'history', question: 'Who discovered that washing hands prevents disease and was ignored?', answers: ['Louis Pasteur', 'Ignaz Semmelweis', 'Joseph Lister', 'Robert Koch'], correctIndex: 1 },
  { id: 't5-018', tier: 5, category: 'history', question: 'How many Earths could fit inside the Sun?', answers: ['About 1,000', 'About 13,000', 'About 130,000', 'About 1.3 million'], correctIndex: 3 },

  // Computing
  { id: 't5-019', tier: 5, category: 'computing', question: 'What does the K stand for in KB?', answers: ['Kilo (thousand)', 'Kibi (1024)', 'Key', 'Kernel'], correctIndex: 0 },
  { id: 't5-020', tier: 5, category: 'computing', question: 'What is Big O notation used for?', answers: ['Measuring file size', 'Describing algorithm efficiency', 'Counting operations', 'Rating processors'], correctIndex: 1 },

  // ========================================
  // TIER 6: FURNACE - Undergraduate
  // ========================================

  { id: 't6-001', tier: 6, category: 'physics', question: 'What does the Pauli exclusion principle state?', answers: ['Energy is conserved', 'No two fermions can share a quantum state', 'Light is both wave and particle', 'Momentum is conserved'], correctIndex: 1 },
  { id: 't6-002', tier: 6, category: 'physics', question: 'What is the spin of an electron?', answers: ['0', '1/2', '1', '2'], correctIndex: 1 },
  { id: 't6-003', tier: 6, category: 'physics', question: 'In the double-slit experiment, what happens when you observe which slit a particle goes through?', answers: ['Pattern gets brighter', 'Interference pattern disappears', 'Particles stop moving', 'Nothing changes'], correctIndex: 1 },
  { id: 't6-004', tier: 6, category: 'physics', question: "What does Maxwell's demon supposedly violate?", answers: ['Conservation of energy', 'Second law of thermodynamics', "Newton's third law", 'Conservation of momentum'], correctIndex: 1 },

  { id: 't6-005', tier: 6, category: 'chemistry', question: 'What geometry does sp3 hybridisation produce?', answers: ['Linear', 'Trigonal planar', 'Tetrahedral', 'Octahedral'], correctIndex: 2 },
  { id: 't6-006', tier: 6, category: 'chemistry', question: 'What is a chiral molecule?', answers: ['One with a double bond', "One that can't be superimposed on its mirror image", 'One with ionic bonds', 'One that conducts electricity'], correctIndex: 1 },

  { id: 't6-007', tier: 6, category: 'biology', question: 'What enzyme unwinds DNA during replication?', answers: ['Polymerase', 'Ligase', 'Helicase', 'Primase'], correctIndex: 2 },
  { id: 't6-008', tier: 6, category: 'biology', question: "What's the difference between genotype and phenotype?", answers: ['They are the same', 'Genotype is genetic code, phenotype is expressed traits', 'Phenotype is genetic code, genotype is traits', 'One is dominant, one recessive'], correctIndex: 1 },

  { id: 't6-009', tier: 6, category: 'maths', question: 'What is i squared equal to?', answers: ['1', '-1', 'i', '0'], correctIndex: 1 },
  { id: 't6-010', tier: 6, category: 'maths', question: "What is Euler's identity?", answers: ['e^(i*pi) = 1', 'e^(i*pi) + 1 = 0', 'e^(i*pi) - 1 = 0', 'e^(i*pi) = -1'], correctIndex: 1 },
  { id: 't6-011', tier: 6, category: 'maths', question: 'Is pi algebraic or transcendental?', answers: ['Algebraic', 'Transcendental', 'Rational', 'Irrational but algebraic'], correctIndex: 1 },
  { id: 't6-012', tier: 6, category: 'maths', question: 'What is the integral of 1/x?', answers: ['x', '1/x squared', 'ln|x| + C', 'e^x'], correctIndex: 2 },

  // ========================================
  // TIER 7: FORGE - Graduate Level
  // ========================================

  { id: 't7-001', tier: 7, category: 'physics', question: 'What does the Born rule tell you?', answers: ['How particles decay', 'Probability equals amplitude squared', 'Energy of ground state', 'Speed of quantum tunneling'], correctIndex: 1 },
  { id: 't7-002', tier: 7, category: 'physics', question: 'What mathematical structure represents quantum states?', answers: ['Euclidean space', 'Hilbert space', 'Minkowski space', 'Phase space'], correctIndex: 1 },
  { id: 't7-003', tier: 7, category: 'physics', question: "What's the Schwarzschild radius?", answers: ['Radius of a neutron star', 'Radius where escape velocity equals light speed', 'Radius of electron orbit', 'Radius of the universe'], correctIndex: 1 },

  { id: 't7-004', tier: 7, category: 'biology', question: "What's the endosymbiotic theory?", answers: ['Cells evolved from viruses', 'Mitochondria were once free-living bacteria', 'DNA came from RNA', 'Life began in hot springs'], correctIndex: 1 },
  { id: 't7-005', tier: 7, category: 'biology', question: "What's a prion?", answers: ['A type of virus', 'A misfolded protein that spreads misfolding', 'A bacterial enzyme', 'A genetic mutation'], correctIndex: 1 },
  { id: 't7-006', tier: 7, category: 'biology', question: "What's the difference between a kinase and a phosphatase?", answers: ['They are the same', 'Kinase adds phosphate, phosphatase removes it', 'Kinase removes phosphate, phosphatase adds it', 'One works on DNA, one on RNA'], correctIndex: 1 },

  { id: 't7-007', tier: 7, category: 'chemistry', question: "What's Huckel's rule for aromaticity?", answers: ['4n electrons', '4n+1 electrons', '4n+2 pi electrons', '2n pi electrons'], correctIndex: 2 },
  { id: 't7-008', tier: 7, category: 'chemistry', question: 'What does the Nernst equation calculate?', answers: ['Reaction rate', 'Electrode potential under non-standard conditions', 'Equilibrium constant', 'Activation energy'], correctIndex: 1 },

  { id: 't7-009', tier: 7, category: 'maths', question: "What does Godel's first incompleteness theorem prove?", answers: ['Mathematics is complete', 'All statements can be proven', 'Consistent systems have unprovable truths', 'Arithmetic is inconsistent'], correctIndex: 2 },
  { id: 't7-010', tier: 7, category: 'maths', question: "What's the Riemann hypothesis about?", answers: ['Prime distribution', 'Zeros of the zeta function', 'Topology of manifolds', 'Differential equations'], correctIndex: 1 },

  // ========================================
  // TIER 8: CRUCIBLE - PhD Level
  // ========================================

  { id: 't8-001', tier: 8, category: 'physics', question: "What's the stress-energy tensor?", answers: ['Measure of spacetime curvature', 'Source term in Einstein equations describing energy-momentum', 'Quantum field operator', 'String theory parameter'], correctIndex: 1 },
  { id: 't8-002', tier: 8, category: 'physics', question: 'What did the Aspect experiments demonstrate?', answers: ['Quantum tunneling', 'Violation of Bell inequalities', 'Higgs mechanism', 'Wave-particle duality'], correctIndex: 1 },
  { id: 't8-003', tier: 8, category: 'physics', question: "What's the cosmological constant problem?", answers: ['Dark matter is missing', 'Observed vacuum energy is ~120 orders smaller than predicted', 'Universe expansion is slowing', 'Gravity waves not detected'], correctIndex: 1 },

  { id: 't8-004', tier: 8, category: 'biology', question: 'In Michaelis-Menten kinetics, what does Km represent?', answers: ['Maximum velocity', 'Substrate concentration at half-max velocity', 'Enzyme concentration', 'Product inhibition constant'], correctIndex: 1 },
  { id: 't8-005', tier: 8, category: 'biology', question: "What's the signal hypothesis in cell biology?", answers: ['How neurons communicate', 'Secretory proteins have N-terminal signal sequences', 'DNA damage response', 'Hormone receptor mechanism'], correctIndex: 1 },

  { id: 't8-006', tier: 8, category: 'chemistry', question: 'What nuclear property does NMR spectroscopy exploit?', answers: ['Nuclear charge', 'Nuclear spin precession in magnetic fields', 'Nuclear size', 'Nuclear decay'], correctIndex: 1 },
  { id: 't8-007', tier: 8, category: 'chemistry', question: "What's the Woodward-Hoffmann rules about?", answers: ['Organic synthesis', 'Whether pericyclic reactions are thermally or photochemically allowed', 'Stereochemistry', 'Reaction mechanisms'], correctIndex: 1 },

  { id: 't8-008', tier: 8, category: 'maths', question: "What's a Banach space?", answers: ['A metric space', 'A complete normed vector space', 'A topological group', 'A Riemannian manifold'], correctIndex: 1 },
  { id: 't8-009', tier: 8, category: 'maths', question: "What's the Fourier transform of a Gaussian?", answers: ['A sine wave', 'Another Gaussian', 'A step function', 'A delta function'], correctIndex: 1 },

  // ========================================
  // TIER 9: NOVA - Specialist Level
  // ========================================

  { id: 't9-001', tier: 9, category: 'physics', question: "What's a Calabi-Yau manifold?", answers: ['A black hole type', 'Complex manifold for compactified dimensions in string theory', 'Quantum field configuration', 'Spacetime singularity'], correctIndex: 1 },
  { id: 't9-002', tier: 9, category: 'physics', question: "What's the hierarchy problem?", answers: ['Dark matter abundance', 'Why gravity is so weak compared to other forces', 'Neutrino masses', 'Matter-antimatter asymmetry'], correctIndex: 1 },

  { id: 't9-003', tier: 9, category: 'biology', question: "What's horizontal gene transfer and why does it matter?", answers: ['Genes moving parent to child', 'Genes moving between organisms, complicating phylogenetics', 'Mutation process', 'DNA replication error'], correctIndex: 1 },
  { id: 't9-004', tier: 9, category: 'biology', question: "What's phase separation in cell biology?", answers: ['Cell division', 'Membrane-less organelles from liquid-liquid separation', 'Protein crystallization', 'DNA condensation'], correctIndex: 1 },

  { id: 't9-005', tier: 9, category: 'chemistry', question: "What's Marcus theory about?", answers: ['Organic reactions', 'Electron transfer rate vs reorganization energy', 'Crystal structures', 'Polymer chemistry'], correctIndex: 1 },
  { id: 't9-006', tier: 9, category: 'chemistry', question: "What's a frustrated Lewis pair?", answers: ['Failed acid-base reaction', 'Sterically prevented acid-base pair enabling unusual catalysis', 'Unstable compound', 'Weak intermolecular force'], correctIndex: 1 },

  { id: 't9-007', tier: 9, category: 'maths', question: 'What did Perelman prove in 2003?', answers: ["Fermat's Last Theorem", 'The Poincare conjecture', 'Riemann hypothesis', 'P != NP'], correctIndex: 1 },
  { id: 't9-008', tier: 9, category: 'maths', question: "What's the Langlands program?", answers: ['Computer algorithm', 'Conjectures connecting number theory and geometry', 'Statistical method', 'Cryptography system'], correctIndex: 1 },
  { id: 't9-009', tier: 9, category: 'maths', question: 'What are p-adic numbers?', answers: ['Complex numbers', 'Alternative completion of rationals using prime-based metric', 'Transcendental numbers', 'Hyperreal numbers'], correctIndex: 1 },

  // ========================================
  // TIER 10: SUPERNOVA - World Expert
  // ========================================

  { id: 't10-001', tier: 10, category: 'physics', question: "What's the physical significance of 1/137 in physics?", answers: ['Speed of light', "Fine-structure constant - one of physics' unexplained numbers", 'Planck constant', 'Gravitational constant'], correctIndex: 1 },
  { id: 't10-002', tier: 10, category: 'physics', question: "What's the firewall paradox?", answers: ['Star temperature problem', 'Conflict between smooth horizons and unitarity in black holes', 'Plasma containment issue', 'Supernova mechanism'], correctIndex: 1 },
  { id: 't10-003', tier: 10, category: 'physics', question: "What's the holographic principle?", answers: ['3D imaging method', 'Information content encoded on boundaries in one fewer dimension', 'Quantum measurement theory', 'Light interference pattern'], correctIndex: 1 },
  { id: 't10-004', tier: 10, category: 'physics', question: "What's the AdS/CFT correspondence?", answers: ['Particle classification', 'Duality between gravity in AdS space and CFT on boundary', 'Dark matter theory', 'Quantum gravity approach'], correctIndex: 1 },
  { id: 't10-005', tier: 10, category: 'physics', question: 'What does it mean for a gauge theory to be asymptotically free?', answers: ['No gauge bosons', 'Coupling strength decreases at high energies', 'Theory is finite', 'Symmetry is broken'], correctIndex: 1 },

  { id: 't10-006', tier: 10, category: 'biology', question: "Why is protein folding computationally hard (Levinthal's paradox)?", answers: ['Too many atoms', 'Conformational space is astronomically large yet proteins fold fast', 'Quantum effects', 'Insufficient data'], correctIndex: 1 },

  { id: 't10-007', tier: 10, category: 'maths', question: "What's the Birch and Swinnerton-Dyer conjecture?", answers: ['Prime number distribution', 'Rank of elliptic curve related to L-function behavior', 'Topology theorem', 'Number field theory'], correctIndex: 1 },
  { id: 't10-008', tier: 10, category: 'maths', question: "What's a non-trivial TQFT and why do mathematicians care?", answers: ['Quantum computer design', 'Topological field theory providing manifold invariants', 'Statistical method', 'Encryption algorithm'], correctIndex: 1 },
  { id: 't10-009', tier: 10, category: 'maths', question: "What's the Yang-Baxter equation?", answers: ['Particle physics law', 'Consistency condition for integrable systems, appears in knot theory', 'Differential equation', 'Group theory axiom'], correctIndex: 1 },
  { id: 't10-010', tier: 10, category: 'maths', question: "What's the Grothendieck-Riemann-Roch theorem about?", answers: ['Complex analysis', 'Generalises Riemann-Roch to higher dimensions using K-theory', 'Number theory', 'Differential geometry'], correctIndex: 1 },
];

// Helper function to get questions by tier
export function getQuestionsByTier(tier: number): Question[] {
  return questions.filter(q => q.tier === tier);
}

// Helper function to get random questions for a game
export function getRandomQuestions(tier: number, count: number, excludeIds: string[] = []): Question[] {
  const tierQuestions = questions.filter(q => q.tier === tier && !excludeIds.includes(q.id));
  const shuffled = [...tierQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Shuffle answer order (keeping track of correct answer)
export function shuffleAnswers(question: Question): Question {
  const indices = [0, 1, 2, 3];
  const shuffled = indices.sort(() => Math.random() - 0.5);
  const newAnswers = shuffled.map(i => question.answers[i]) as [string, string, string, string];
  const newCorrectIndex = shuffled.indexOf(question.correctIndex) as 0 | 1 | 2 | 3;

  return {
    ...question,
    answers: newAnswers,
    correctIndex: newCorrectIndex,
  };
}
