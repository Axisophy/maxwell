import { Question } from './types';

export const questions: Question[] = [
  // ========================================
  // TIER 1: SPARK - Curious 8-9 year old (50 questions)
  // ========================================
  
  // Biology
  { id: 't1-001', tier: 1, category: 'biology', question: 'How many legs does a spider have?', answers: ['6', '8', '10', '4'], correctIndex: 1 },
  { id: 't1-002', tier: 1, category: 'biology', question: 'What do you call a baby frog?', answers: ['Puppy', 'Cub', 'Tadpole', 'Chick'], correctIndex: 2 },
  { id: 't1-003', tier: 1, category: 'biology', question: 'How many legs does an insect have?', answers: ['4', '6', '8', '10'], correctIndex: 1 },
  { id: 't1-004', tier: 1, category: 'biology', question: 'What animal has a trunk?', answers: ['Giraffe', 'Lion', 'Elephant', 'Zebra'], correctIndex: 2 },
  { id: 't1-005', tier: 1, category: 'biology', question: 'What do caterpillars turn into?', answers: ['Worms', 'Butterflies', 'Beetles', 'Spiders'], correctIndex: 1 },
  { id: 't1-006', tier: 1, category: 'biology', question: 'What do cows give us to drink?', answers: ['Juice', 'Water', 'Milk', 'Tea'], correctIndex: 2 },
  { id: 't1-007', tier: 1, category: 'biology', question: 'How many wings does a bee have?', answers: ['2', '4', '6', '8'], correctIndex: 1 },
  { id: 't1-008', tier: 1, category: 'biology', question: 'What animal says "moo"?', answers: ['Dog', 'Cat', 'Cow', 'Pig'], correctIndex: 2 },
  { id: 't1-009', tier: 1, category: 'biology', question: 'What do birds use to fly?', answers: ['Legs', 'Tails', 'Wings', 'Beaks'], correctIndex: 2 },
  { id: 't1-010', tier: 1, category: 'biology', question: 'What do fish use to breathe?', answers: ['Lungs', 'Gills', 'Nose', 'Mouth'], correctIndex: 1 },
  
  // Space
  { id: 't1-011', tier: 1, category: 'space', question: 'Is the Sun a star or a planet?', answers: ['Planet', 'Star', 'Moon', 'Asteroid'], correctIndex: 1 },
  { id: 't1-012', tier: 1, category: 'space', question: 'What planet is closest to the Sun?', answers: ['Venus', 'Earth', 'Mercury', 'Mars'], correctIndex: 2 },
  { id: 't1-013', tier: 1, category: 'space', question: 'Which is bigger: the Earth or the Moon?', answers: ['The Moon', 'The Earth', 'They are the same', 'It depends'], correctIndex: 1 },
  { id: 't1-014', tier: 1, category: 'space', question: 'What colour is Mars often called?', answers: ['The Blue Planet', 'The Red Planet', 'The Green Planet', 'The Yellow Planet'], correctIndex: 1 },
  { id: 't1-015', tier: 1, category: 'space', question: 'How many planets are in our solar system?', answers: ['7', '8', '9', '10'], correctIndex: 1 },
  { id: 't1-016', tier: 1, category: 'space', question: 'What lights up the sky at night?', answers: ['Clouds', 'Stars', 'Birds', 'Planes'], correctIndex: 1 },
  { id: 't1-017', tier: 1, category: 'space', question: 'What do we call a person who goes to space?', answers: ['Pilot', 'Astronaut', 'Sailor', 'Driver'], correctIndex: 1 },
  { id: 't1-018', tier: 1, category: 'space', question: 'What shape is planet Earth?', answers: ['Flat', 'Square', 'Round', 'Triangle'], correctIndex: 2 },
  { id: 't1-019', tier: 1, category: 'space', question: 'Where does the Sun rise?', answers: ['West', 'North', 'South', 'East'], correctIndex: 3 },
  { id: 't1-020', tier: 1, category: 'space', question: 'What can you see in the sky during the day?', answers: ['Stars', 'The Moon only', 'The Sun', 'Nothing'], correctIndex: 2 },
  
  // Physics
  { id: 't1-021', tier: 1, category: 'physics', question: 'What falls from clouds when it rains?', answers: ['Sand', 'Water', 'Air', 'Dust'], correctIndex: 1 },
  { id: 't1-022', tier: 1, category: 'physics', question: "What's frozen water called?", answers: ['Steam', 'Ice', 'Fog', 'Cloud'], correctIndex: 1 },
  { id: 't1-023', tier: 1, category: 'physics', question: 'What force pulls things down to the ground?', answers: ['Magnetism', 'Wind', 'Gravity', 'Electricity'], correctIndex: 2 },
  { id: 't1-024', tier: 1, category: 'physics', question: 'What do we use to see in the dark?', answers: ['Sound', 'Light', 'Heat', 'Wind'], correctIndex: 1 },
  { id: 't1-025', tier: 1, category: 'physics', question: 'What makes a rainbow appear?', answers: ['Clouds', 'Wind', 'Sun and rain', 'Snow'], correctIndex: 2 },
  { id: 't1-026', tier: 1, category: 'physics', question: 'What sound does thunder make?', answers: ['Whistle', 'Boom', 'Splash', 'Pop'], correctIndex: 1 },
  { id: 't1-027', tier: 1, category: 'physics', question: 'What do magnets attract?', answers: ['Wood', 'Paper', 'Metal', 'Plastic'], correctIndex: 2 },
  { id: 't1-028', tier: 1, category: 'physics', question: 'What colour is the sky on a sunny day?', answers: ['Green', 'Red', 'Blue', 'Purple'], correctIndex: 2 },
  { id: 't1-029', tier: 1, category: 'physics', question: 'What do we call water when it boils?', answers: ['Ice', 'Steam', 'Fog', 'Rain'], correctIndex: 1 },
  { id: 't1-030', tier: 1, category: 'physics', question: 'Does a ball roll up or down a hill on its own?', answers: ['Up', 'Down', 'Sideways', 'It floats'], correctIndex: 1 },
  
  // Earth
  { id: 't1-031', tier: 1, category: 'earth', question: 'What do plants need to grow?', answers: ['Darkness', 'Sunlight and water', 'Only air', 'Just soil'], correctIndex: 1 },
  { id: 't1-032', tier: 1, category: 'earth', question: 'What is the hottest season?', answers: ['Winter', 'Autumn', 'Summer', 'Spring'], correctIndex: 2 },
  { id: 't1-033', tier: 1, category: 'earth', question: "What's the largest ocean on Earth?", answers: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctIndex: 3 },
  { id: 't1-034', tier: 1, category: 'earth', question: 'What colour are most leaves?', answers: ['Red', 'Blue', 'Green', 'Yellow'], correctIndex: 2 },
  { id: 't1-035', tier: 1, category: 'earth', question: 'Where do polar bears live?', answers: ['Desert', 'Jungle', 'Arctic', 'Ocean'], correctIndex: 2 },
  { id: 't1-036', tier: 1, category: 'earth', question: 'What falls from the sky in winter?', answers: ['Leaves', 'Snow', 'Sand', 'Flowers'], correctIndex: 1 },
  { id: 't1-037', tier: 1, category: 'earth', question: 'What do we call a very tall mountain that erupts?', answers: ['Hill', 'Valley', 'Volcano', 'Island'], correctIndex: 2 },
  { id: 't1-038', tier: 1, category: 'earth', question: 'What covers most of the Earth?', answers: ['Land', 'Desert', 'Ice', 'Water'], correctIndex: 3 },
  { id: 't1-039', tier: 1, category: 'earth', question: 'What do worms live in?', answers: ['Water', 'Trees', 'Soil', 'Sky'], correctIndex: 2 },
  { id: 't1-040', tier: 1, category: 'earth', question: 'How many seasons are there in a year?', answers: ['2', '3', '4', '5'], correctIndex: 2 },
  
  // Maths & General Science
  { id: 't1-041', tier: 1, category: 'maths', question: 'How many sides does a triangle have?', answers: ['2', '3', '4', '5'], correctIndex: 1 },
  { id: 't1-042', tier: 1, category: 'maths', question: 'What is 7 + 8?', answers: ['13', '14', '15', '16'], correctIndex: 2 },
  { id: 't1-043', tier: 1, category: 'maths', question: 'How many sides does a square have?', answers: ['3', '4', '5', '6'], correctIndex: 1 },
  { id: 't1-044', tier: 1, category: 'maths', question: 'What is 10 - 3?', answers: ['5', '6', '7', '8'], correctIndex: 2 },
  { id: 't1-045', tier: 1, category: 'maths', question: 'How many hours are in a day?', answers: ['12', '20', '24', '30'], correctIndex: 2 },
  { id: 't1-046', tier: 1, category: 'general', question: 'How many colours are in a rainbow?', answers: ['5', '6', '7', '8'], correctIndex: 2 },
  { id: 't1-047', tier: 1, category: 'general', question: 'What do we use our nose for?', answers: ['Seeing', 'Hearing', 'Smelling', 'Tasting'], correctIndex: 2 },
  { id: 't1-048', tier: 1, category: 'general', question: 'What body part do we think with?', answers: ['Heart', 'Brain', 'Stomach', 'Lungs'], correctIndex: 1 },
  { id: 't1-049', tier: 1, category: 'general', question: 'How many days are in a week?', answers: ['5', '6', '7', '8'], correctIndex: 2 },
  { id: 't1-050', tier: 1, category: 'general', question: 'What do we use ears for?', answers: ['Smelling', 'Seeing', 'Hearing', 'Tasting'], correctIndex: 2 },

  // ========================================
  // TIER 2: FLICKER - Sharp 10-11 year old (50 questions)
  // ========================================
  
  // Biology
  { id: 't2-001', tier: 2, category: 'biology', question: 'What gas do we breathe out that plants need?', answers: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Helium'], correctIndex: 2 },
  { id: 't2-002', tier: 2, category: 'biology', question: 'What type of animal is a dolphin?', answers: ['Fish', 'Reptile', 'Mammal', 'Amphibian'], correctIndex: 2 },
  { id: 't2-003', tier: 2, category: 'biology', question: 'Roughly how many bones are in the human body?', answers: ['About 50', 'About 100', 'About 200', 'About 400'], correctIndex: 2 },
  { id: 't2-004', tier: 2, category: 'biology', question: 'What is the largest land animal?', answers: ['Giraffe', 'Elephant', 'Rhinoceros', 'Hippopotamus'], correctIndex: 1 },
  { id: 't2-005', tier: 2, category: 'biology', question: 'What do herbivores eat?', answers: ['Meat', 'Plants', 'Both', 'Neither'], correctIndex: 1 },
  { id: 't2-006', tier: 2, category: 'biology', question: 'What is the largest organ in the human body?', answers: ['Brain', 'Heart', 'Liver', 'Skin'], correctIndex: 3 },
  { id: 't2-007', tier: 2, category: 'biology', question: 'What do carnivores eat?', answers: ['Plants', 'Meat', 'Both', 'Neither'], correctIndex: 1 },
  { id: 't2-008', tier: 2, category: 'biology', question: 'What type of blood cells fight infections?', answers: ['Red', 'White', 'Blue', 'Green'], correctIndex: 1 },
  { id: 't2-009', tier: 2, category: 'biology', question: 'Where does digestion start?', answers: ['Stomach', 'Mouth', 'Intestines', 'Liver'], correctIndex: 1 },
  { id: 't2-010', tier: 2, category: 'biology', question: 'What carries blood back to the heart?', answers: ['Arteries', 'Veins', 'Capillaries', 'Nerves'], correctIndex: 1 },
  { id: 't2-011', tier: 2, category: 'biology', question: 'What is a baby kangaroo called?', answers: ['Cub', 'Kit', 'Joey', 'Pup'], correctIndex: 2 },
  { id: 't2-012', tier: 2, category: 'biology', question: 'How many chambers does a human heart have?', answers: ['2', '3', '4', '5'], correctIndex: 2 },
  
  // Space
  { id: 't2-013', tier: 2, category: 'space', question: 'What planet is famous for its rings?', answers: ['Jupiter', 'Mars', 'Saturn', 'Neptune'], correctIndex: 2 },
  { id: 't2-014', tier: 2, category: 'space', question: 'What makes the Moon shine?', answers: ['It makes its own light', 'Reflected sunlight', 'Electricity', 'Radioactivity'], correctIndex: 1 },
  { id: 't2-015', tier: 2, category: 'space', question: 'How long does Earth take to orbit the Sun?', answers: ['One day', 'One month', 'One year', 'One decade'], correctIndex: 2 },
  { id: 't2-016', tier: 2, category: 'space', question: 'What is the name of our galaxy?', answers: ['Andromeda', 'The Milky Way', 'The Solar System', 'The Universe'], correctIndex: 1 },
  { id: 't2-017', tier: 2, category: 'space', question: 'Which planet is known for its Great Red Spot?', answers: ['Mars', 'Jupiter', 'Saturn', 'Venus'], correctIndex: 1 },
  { id: 't2-018', tier: 2, category: 'space', question: 'How long does the Moon take to orbit Earth?', answers: ['About 1 week', 'About 1 month', 'About 1 year', 'About 1 day'], correctIndex: 1 },
  { id: 't2-019', tier: 2, category: 'space', question: 'Which planet is hottest?', answers: ['Mercury', 'Venus', 'Mars', 'Jupiter'], correctIndex: 1 },
  { id: 't2-020', tier: 2, category: 'space', question: 'What are shooting stars really?', answers: ['Real stars', 'Meteors', 'Satellites', 'Planets'], correctIndex: 1 },
  { id: 't2-021', tier: 2, category: 'space', question: 'Which planet is known as the Blue Planet?', answers: ['Neptune', 'Uranus', 'Earth', 'Mars'], correctIndex: 2 },
  { id: 't2-022', tier: 2, category: 'space', question: 'What causes the seasons on Earth?', answers: ['Distance from Sun', 'Earth tilted on its axis', 'The Moon', 'Clouds'], correctIndex: 1 },
  
  // Physics
  { id: 't2-023', tier: 2, category: 'physics', question: 'What force keeps planets orbiting the Sun?', answers: ['Magnetism', 'Electricity', 'Gravity', 'Friction'], correctIndex: 2 },
  { id: 't2-024', tier: 2, category: 'physics', question: 'What are the three states of matter?', answers: ['Hot, cold, warm', 'Solid, liquid, gas', 'Earth, water, air', 'Hard, soft, squishy'], correctIndex: 1 },
  { id: 't2-025', tier: 2, category: 'physics', question: 'What type of energy does a moving car have?', answers: ['Potential energy', 'Kinetic energy', 'Chemical energy', 'Nuclear energy'], correctIndex: 1 },
  { id: 't2-026', tier: 2, category: 'physics', question: 'What does a thermometer measure?', answers: ['Weight', 'Speed', 'Temperature', 'Distance'], correctIndex: 2 },
  { id: 't2-027', tier: 2, category: 'physics', question: 'What is the speed of light approximately?', answers: ['Sound speed', '300 km per second', '300,000 km per second', '3 million km per second'], correctIndex: 2 },
  { id: 't2-028', tier: 2, category: 'physics', question: 'What happens to water at 100°C?', answers: ['Freezes', 'Evaporates', 'Nothing', 'Becomes solid'], correctIndex: 1 },
  { id: 't2-029', tier: 2, category: 'physics', question: 'What do we call energy stored in a battery?', answers: ['Kinetic', 'Chemical', 'Nuclear', 'Light'], correctIndex: 1 },
  { id: 't2-030', tier: 2, category: 'physics', question: 'Why do boats float?', answers: ['They are light', 'Buoyancy', 'Magic', 'Motors push them up'], correctIndex: 1 },
  
  // Chemistry
  { id: 't2-031', tier: 2, category: 'chemistry', question: 'What gas do we need to breathe to survive?', answers: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'], correctIndex: 2 },
  { id: 't2-032', tier: 2, category: 'chemistry', question: 'What is H2O the formula for?', answers: ['Salt', 'Sugar', 'Water', 'Air'], correctIndex: 2 },
  { id: 't2-033', tier: 2, category: 'chemistry', question: 'What happens when you mix vinegar and baking soda?', answers: ['Nothing', 'It fizzes', 'It freezes', 'It changes colour'], correctIndex: 1 },
  { id: 't2-034', tier: 2, category: 'chemistry', question: 'What is the symbol for gold?', answers: ['Go', 'Gd', 'Au', 'Ag'], correctIndex: 2 },
  { id: 't2-035', tier: 2, category: 'chemistry', question: 'What is the most common gas in air?', answers: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'], correctIndex: 2 },
  { id: 't2-036', tier: 2, category: 'chemistry', question: 'What makes fizzy drinks fizzy?', answers: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Helium'], correctIndex: 2 },
  
  // Earth
  { id: 't2-037', tier: 2, category: 'earth', question: 'What are scientists who study dinosaurs called?', answers: ['Biologists', 'Archaeologists', 'Palaeontologists', 'Geologists'], correctIndex: 2 },
  { id: 't2-038', tier: 2, category: 'earth', question: 'What causes day and night?', answers: ['The Moon moving', 'Earth spinning', 'The Sun moving', 'Clouds'], correctIndex: 1 },
  { id: 't2-039', tier: 2, category: 'earth', question: 'What is the hardest natural rock?', answers: ['Granite', 'Diamond', 'Marble', 'Sandstone'], correctIndex: 1 },
  { id: 't2-040', tier: 2, category: 'earth', question: 'What causes earthquakes?', answers: ['Wind', 'Rain', 'Moving tectonic plates', 'Volcanoes only'], correctIndex: 2 },
  { id: 't2-041', tier: 2, category: 'earth', question: 'What is lava when it cools?', answers: ['Sand', 'Rock', 'Glass', 'Dirt'], correctIndex: 1 },
  { id: 't2-042', tier: 2, category: 'earth', question: 'What layer of atmosphere protects us from UV rays?', answers: ['Troposphere', 'Ozone layer', 'Stratosphere', 'Mesosphere'], correctIndex: 1 },
  
  // Maths
  { id: 't2-043', tier: 2, category: 'maths', question: 'What is the perimeter of a square with sides of 5cm?', answers: ['10cm', '15cm', '20cm', '25cm'], correctIndex: 2 },
  { id: 't2-044', tier: 2, category: 'maths', question: 'What is 12 × 12?', answers: ['124', '134', '144', '154'], correctIndex: 2 },
  { id: 't2-045', tier: 2, category: 'maths', question: 'How many centimetres in a metre?', answers: ['10', '100', '1000', '10000'], correctIndex: 1 },
  { id: 't2-046', tier: 2, category: 'maths', question: 'What is half of 50?', answers: ['20', '25', '30', '35'], correctIndex: 1 },
  { id: 't2-047', tier: 2, category: 'maths', question: 'How many degrees in a circle?', answers: ['90', '180', '270', '360'], correctIndex: 3 },
  { id: 't2-048', tier: 2, category: 'maths', question: 'What is 25% of 100?', answers: ['15', '20', '25', '30'], correctIndex: 2 },
  { id: 't2-049', tier: 2, category: 'maths', question: 'What shape has 6 sides?', answers: ['Pentagon', 'Hexagon', 'Octagon', 'Heptagon'], correctIndex: 1 },
  { id: 't2-050', tier: 2, category: 'maths', question: 'What is 9 squared?', answers: ['18', '27', '72', '81'], correctIndex: 3 },

  // ========================================
  // TIER 3: GLOW - Curious 12-13 year old (50 questions)
  // ========================================
  
  // Biology
  { id: 't3-001', tier: 3, category: 'biology', question: "What's the powerhouse of the cell?", answers: ['Nucleus', 'Mitochondria', 'Ribosome', 'Cell wall'], correctIndex: 1 },
  { id: 't3-002', tier: 3, category: 'biology', question: 'What kingdom do mushrooms belong to?', answers: ['Plants', 'Animals', 'Fungi', 'Bacteria'], correctIndex: 2 },
  { id: 't3-003', tier: 3, category: 'biology', question: 'What does DNA stand for?', answers: ['Deoxyribonucleic acid', 'Dinitrogen acid', 'Dynamic nuclear acid', 'Dense nucleic arrangement'], correctIndex: 0 },
  { id: 't3-004', tier: 3, category: 'biology', question: 'How many hearts does an octopus have?', answers: ['1', '2', '3', '4'], correctIndex: 2 },
  { id: 't3-005', tier: 3, category: 'biology', question: 'What is the study of living things called?', answers: ['Chemistry', 'Physics', 'Biology', 'Geology'], correctIndex: 2 },
  { id: 't3-006', tier: 3, category: 'biology', question: 'What carries genetic information in cells?', answers: ['Protein', 'Fat', 'DNA', 'Sugar'], correctIndex: 2 },
  { id: 't3-007', tier: 3, category: 'biology', question: 'What organ pumps blood around the body?', answers: ['Brain', 'Lungs', 'Liver', 'Heart'], correctIndex: 3 },
  { id: 't3-008', tier: 3, category: 'biology', question: 'What is photosynthesis?', answers: ['Animal breathing', 'Plants making food from light', 'Cell division', 'Digestion'], correctIndex: 1 },
  { id: 't3-009', tier: 3, category: 'biology', question: 'What are the smallest blood vessels called?', answers: ['Arteries', 'Veins', 'Capillaries', 'Tubes'], correctIndex: 2 },
  { id: 't3-010', tier: 3, category: 'biology', question: 'What is an organism that eats both plants and meat?', answers: ['Herbivore', 'Carnivore', 'Omnivore', 'Decomposer'], correctIndex: 2 },
  { id: 't3-011', tier: 3, category: 'biology', question: 'What part of the cell controls what enters and leaves?', answers: ['Nucleus', 'Cell membrane', 'Mitochondria', 'Cytoplasm'], correctIndex: 1 },
  { id: 't3-012', tier: 3, category: 'biology', question: 'What do we call animals without backbones?', answers: ['Vertebrates', 'Invertebrates', 'Mammals', 'Reptiles'], correctIndex: 1 },
  
  // Physics
  { id: 't3-013', tier: 3, category: 'physics', question: 'Why do we see lightning before we hear thunder?', answers: ['Lightning is louder', 'Light travels faster than sound', 'Thunder starts later', 'Our eyes are faster than ears'], correctIndex: 1 },
  { id: 't3-014', tier: 3, category: 'physics', question: 'Which travels faster: light or sound?', answers: ['Sound', 'Light', 'They are equal', 'It depends on the medium'], correctIndex: 1 },
  { id: 't3-015', tier: 3, category: 'physics', question: 'What unit is used to measure electrical current?', answers: ['Volts', 'Watts', 'Amps', 'Ohms'], correctIndex: 2 },
  { id: 't3-016', tier: 3, category: 'physics', question: 'What is Newton\'s first law about?', answers: ['Gravity', 'Action and reaction', 'Inertia', 'Energy'], correctIndex: 2 },
  { id: 't3-017', tier: 3, category: 'physics', question: 'What type of wave is sound?', answers: ['Transverse', 'Longitudinal', 'Electromagnetic', 'Light'], correctIndex: 1 },
  { id: 't3-018', tier: 3, category: 'physics', question: 'What is measured in Joules?', answers: ['Force', 'Energy', 'Power', 'Speed'], correctIndex: 1 },
  { id: 't3-019', tier: 3, category: 'physics', question: 'What does friction do to motion?', answers: ['Speeds it up', 'Slows it down', 'Has no effect', 'Reverses it'], correctIndex: 1 },
  { id: 't3-020', tier: 3, category: 'physics', question: 'What colour of light has the longest wavelength?', answers: ['Blue', 'Green', 'Yellow', 'Red'], correctIndex: 3 },
  
  // Chemistry
  { id: 't3-021', tier: 3, category: 'chemistry', question: "What's the chemical formula for water?", answers: ['CO2', 'H2O', 'NaCl', 'O2'], correctIndex: 1 },
  { id: 't3-022', tier: 3, category: 'chemistry', question: 'What element does the symbol Fe represent?', answers: ['Fluorine', 'Francium', 'Iron', 'Fermium'], correctIndex: 2 },
  { id: 't3-023', tier: 3, category: 'chemistry', question: "What's the only metal that's liquid at room temperature?", answers: ['Lead', 'Tin', 'Mercury', 'Aluminium'], correctIndex: 2 },
  { id: 't3-024', tier: 3, category: 'chemistry', question: "What gas makes up about 78% of Earth's atmosphere?", answers: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Argon'], correctIndex: 2 },
  { id: 't3-025', tier: 3, category: 'chemistry', question: 'What is the pH of pure water?', answers: ['0', '7', '10', '14'], correctIndex: 1 },
  { id: 't3-026', tier: 3, category: 'chemistry', question: 'What are protons, neutrons, and electrons?', answers: ['Atoms', 'Subatomic particles', 'Molecules', 'Elements'], correctIndex: 1 },
  { id: 't3-027', tier: 3, category: 'chemistry', question: 'What is an element?', answers: ['Two atoms bonded', 'A pure substance of one type of atom', 'A mixture', 'A compound'], correctIndex: 1 },
  { id: 't3-028', tier: 3, category: 'chemistry', question: 'What charge does an electron have?', answers: ['Positive', 'Negative', 'Neutral', 'Variable'], correctIndex: 1 },
  { id: 't3-029', tier: 3, category: 'chemistry', question: 'What is NaCl commonly known as?', answers: ['Sugar', 'Baking soda', 'Table salt', 'Vinegar'], correctIndex: 2 },
  { id: 't3-030', tier: 3, category: 'chemistry', question: 'What do we call substances that speed up reactions without being used up?', answers: ['Reactants', 'Products', 'Catalysts', 'Solvents'], correctIndex: 2 },
  
  // Space
  { id: 't3-031', tier: 3, category: 'space', question: 'How many planets in our solar system have rings?', answers: ['1', '2', '4', '6'], correctIndex: 2 },
  { id: 't3-032', tier: 3, category: 'space', question: 'What is a light-year a measure of?', answers: ['Time', 'Distance', 'Speed', 'Brightness'], correctIndex: 1 },
  { id: 't3-033', tier: 3, category: 'space', question: 'What type of star is our Sun?', answers: ['Red giant', 'White dwarf', 'Yellow dwarf', 'Neutron star'], correctIndex: 2 },
  { id: 't3-034', tier: 3, category: 'space', question: 'What is the asteroid belt between?', answers: ['Earth and Mars', 'Mars and Jupiter', 'Jupiter and Saturn', 'Venus and Earth'], correctIndex: 1 },
  { id: 't3-035', tier: 3, category: 'space', question: 'What causes a solar eclipse?', answers: ['Earth blocks the Sun', 'Moon blocks the Sun', 'Sun moves away', 'Clouds'], correctIndex: 1 },
  { id: 't3-036', tier: 3, category: 'space', question: 'What is the closest star to Earth (other than the Sun)?', answers: ['Sirius', 'Proxima Centauri', 'Betelgeuse', 'Polaris'], correctIndex: 1 },
  
  // Earth
  { id: 't3-037', tier: 3, category: 'earth', question: 'What type of rock is formed from cooled lava?', answers: ['Sedimentary', 'Metamorphic', 'Igneous', 'Limestone'], correctIndex: 2 },
  { id: 't3-038', tier: 3, category: 'earth', question: 'What scale measures earthquake magnitude?', answers: ['Beaufort scale', 'Richter scale', 'Mohs scale', 'Kelvin scale'], correctIndex: 1 },
  { id: 't3-039', tier: 3, category: 'earth', question: 'What is the water cycle?', answers: ['Ocean currents', 'Evaporation, condensation, precipitation cycle', 'River flow', 'Groundwater movement'], correctIndex: 1 },
  { id: 't3-040', tier: 3, category: 'earth', question: 'What layer of Earth do we live on?', answers: ['Core', 'Mantle', 'Crust', 'Magma'], correctIndex: 2 },
  { id: 't3-041', tier: 3, category: 'earth', question: 'What is the main cause of tides?', answers: ['Wind', 'The Moon\'s gravity', 'Earth\'s rotation', 'Ocean currents'], correctIndex: 1 },
  { id: 't3-042', tier: 3, category: 'earth', question: 'What type of rock is formed from layers of sediment?', answers: ['Igneous', 'Metamorphic', 'Sedimentary', 'Volcanic'], correctIndex: 2 },
  
  // Maths
  { id: 't3-043', tier: 3, category: 'maths', question: 'What is the value of Pi (π) to two decimal places?', answers: ['3.12', '3.14', '3.16', '3.18'], correctIndex: 1 },
  { id: 't3-044', tier: 3, category: 'maths', question: 'How many degrees are in a right angle?', answers: ['45°', '90°', '180°', '360°'], correctIndex: 1 },
  { id: 't3-045', tier: 3, category: 'maths', question: 'What is the square root of 144?', answers: ['10', '11', '12', '14'], correctIndex: 2 },
  { id: 't3-046', tier: 3, category: 'maths', question: 'In the equation y = mx + c, what does m represent?', answers: ['The y-intercept', 'The gradient', 'The x value', 'The constant'], correctIndex: 1 },
  { id: 't3-047', tier: 3, category: 'maths', question: 'What is 2 to the power of 5?', answers: ['10', '16', '25', '32'], correctIndex: 3 },
  { id: 't3-048', tier: 3, category: 'maths', question: 'What do we call a polygon with 8 sides?', answers: ['Hexagon', 'Heptagon', 'Octagon', 'Nonagon'], correctIndex: 2 },
  { id: 't3-049', tier: 3, category: 'maths', question: 'What is the area of a rectangle 5m by 3m?', answers: ['8 m²', '15 m²', '16 m²', '30 m²'], correctIndex: 1 },
  { id: 't3-050', tier: 3, category: 'maths', question: 'What is 0.5 as a fraction?', answers: ['1/3', '1/4', '1/2', '2/3'], correctIndex: 2 },

  // ========================================
  // TIER 4: BRIGHT - GCSE Level (50 questions)
  // ========================================
  
  // Physics
  { id: 't4-001', tier: 4, category: 'physics', question: "What's the difference between velocity and speed?", answers: ['They are the same', 'Velocity includes direction', 'Speed includes direction', 'Velocity is always faster'], correctIndex: 1 },
  { id: 't4-002', tier: 4, category: 'physics', question: "What's Ohm's Law?", answers: ['V = IR', 'E = mc²', 'F = ma', 'P = IV'], correctIndex: 0 },
  { id: 't4-003', tier: 4, category: 'physics', question: 'Why are metals good conductors of electricity?', answers: ['They are shiny', 'They have free electrons', 'They are heavy', 'They are solid'], correctIndex: 1 },
  { id: 't4-004', tier: 4, category: 'physics', question: "What's a parsec a unit of?", answers: ['Time', 'Speed', 'Distance', 'Temperature'], correctIndex: 2 },
  { id: 't4-005', tier: 4, category: 'physics', question: 'What does F = ma represent?', answers: ['Power equation', 'Newton\'s second law', 'Energy equation', 'Wave equation'], correctIndex: 1 },
  { id: 't4-006', tier: 4, category: 'physics', question: 'What is electromagnetic radiation?', answers: ['Sound waves', 'Waves of electric and magnetic fields', 'Gravity waves', 'Pressure waves'], correctIndex: 1 },
  { id: 't4-007', tier: 4, category: 'physics', question: 'What happens to resistance when a wire heats up?', answers: ['Decreases', 'Increases', 'Stays the same', 'Becomes zero'], correctIndex: 1 },
  { id: 't4-008', tier: 4, category: 'physics', question: 'What is the unit of frequency?', answers: ['Seconds', 'Hertz', 'Metres', 'Watts'], correctIndex: 1 },
  { id: 't4-009', tier: 4, category: 'physics', question: 'What type of lens converges light?', answers: ['Concave', 'Convex', 'Flat', 'Prismatic'], correctIndex: 1 },
  { id: 't4-010', tier: 4, category: 'physics', question: 'What is specific heat capacity?', answers: ['Temperature of boiling', 'Energy needed to raise 1kg by 1°C', 'Melting point', 'Thermal conductivity'], correctIndex: 1 },
  
  // Chemistry
  { id: 't4-011', tier: 4, category: 'chemistry', question: 'What is the atomic number of carbon?', answers: ['4', '6', '8', '12'], correctIndex: 1 },
  { id: 't4-012', tier: 4, category: 'chemistry', question: 'What type of bond shares electrons between atoms?', answers: ['Ionic', 'Covalent', 'Metallic', 'Hydrogen'], correctIndex: 1 },
  { id: 't4-013', tier: 4, category: 'chemistry', question: "What's the hardest natural substance on Earth?", answers: ['Granite', 'Diamond', 'Quartz', 'Steel'], correctIndex: 1 },
  { id: 't4-014', tier: 4, category: 'chemistry', question: 'What is an isotope?', answers: ['An ion with charge', 'An atom with different neutrons', 'A molecule with two atoms', 'A radioactive element'], correctIndex: 1 },
  { id: 't4-015', tier: 4, category: 'chemistry', question: 'What is an ionic bond?', answers: ['Sharing electrons', 'Transfer of electrons', 'Sharing protons', 'Magnetic attraction'], correctIndex: 1 },
  { id: 't4-016', tier: 4, category: 'chemistry', question: 'What is the relative atomic mass of hydrogen?', answers: ['0', '1', '2', '4'], correctIndex: 1 },
  { id: 't4-017', tier: 4, category: 'chemistry', question: 'What type of reaction gives out heat?', answers: ['Endothermic', 'Exothermic', 'Neutralisation', 'Decomposition'], correctIndex: 1 },
  { id: 't4-018', tier: 4, category: 'chemistry', question: 'What is the pH of a strong acid?', answers: ['0-2', '5-7', '7', '12-14'], correctIndex: 0 },
  { id: 't4-019', tier: 4, category: 'chemistry', question: 'What gas is produced when metals react with acids?', answers: ['Oxygen', 'Carbon dioxide', 'Hydrogen', 'Nitrogen'], correctIndex: 2 },
  { id: 't4-020', tier: 4, category: 'chemistry', question: 'What is electrolysis?', answers: ['Chemical reaction', 'Using electricity to split compounds', 'Mixing solutions', 'Heating metals'], correctIndex: 1 },
  
  // Biology
  { id: 't4-021', tier: 4, category: 'biology', question: 'What part of a plant cell contains chlorophyll?', answers: ['Nucleus', 'Mitochondria', 'Chloroplast', 'Vacuole'], correctIndex: 2 },
  { id: 't4-022', tier: 4, category: 'biology', question: "What's the difference between mitosis and meiosis?", answers: ['Mitosis makes sex cells', 'Meiosis produces identical cells', 'Mitosis produces identical cells, meiosis makes sex cells', 'They are the same process'], correctIndex: 2 },
  { id: 't4-023', tier: 4, category: 'biology', question: 'What carries oxygen in red blood cells?', answers: ['Plasma', 'Haemoglobin', 'Platelets', 'White cells'], correctIndex: 1 },
  { id: 't4-024', tier: 4, category: 'biology', question: 'What is natural selection?', answers: ['Animals choosing mates', 'Survival of the fittest', 'Random mutation', 'Human breeding'], correctIndex: 1 },
  { id: 't4-025', tier: 4, category: 'biology', question: 'What is a dominant allele?', answers: ['Weaker gene', 'Gene expressed even if only one copy', 'Recessive gene', 'Mutated gene'], correctIndex: 1 },
  { id: 't4-026', tier: 4, category: 'biology', question: 'What is homeostasis?', answers: ['Cell division', 'Maintaining stable internal conditions', 'Photosynthesis', 'Respiration'], correctIndex: 1 },
  { id: 't4-027', tier: 4, category: 'biology', question: 'What organ produces insulin?', answers: ['Liver', 'Kidney', 'Pancreas', 'Stomach'], correctIndex: 2 },
  { id: 't4-028', tier: 4, category: 'biology', question: 'What is aerobic respiration?', answers: ['Breathing', 'Respiration with oxygen', 'Respiration without oxygen', 'Photosynthesis'], correctIndex: 1 },
  { id: 't4-029', tier: 4, category: 'biology', question: 'What type of neuron carries signals to muscles?', answers: ['Sensory', 'Relay', 'Motor', 'Brain'], correctIndex: 2 },
  { id: 't4-030', tier: 4, category: 'biology', question: 'What is the order of classification from largest to smallest?', answers: ['Kingdom, Phylum, Class...', 'Species, Genus, Family...', 'Class, Kingdom, Phylum...', 'Order, Family, Genus...'], correctIndex: 0 },
  
  // Maths
  { id: 't4-031', tier: 4, category: 'maths', question: 'What is the quadratic formula used to solve?', answers: ['Linear equations', 'Quadratic equations', 'Cubic equations', 'Differential equations'], correctIndex: 1 },
  { id: 't4-032', tier: 4, category: 'maths', question: 'What is sin(90°)?', answers: ['0', '0.5', '1', 'Undefined'], correctIndex: 2 },
  { id: 't4-033', tier: 4, category: 'maths', question: 'What does the gradient of a distance-time graph represent?', answers: ['Acceleration', 'Speed', 'Distance', 'Time'], correctIndex: 1 },
  { id: 't4-034', tier: 4, category: 'maths', question: 'What is the sum of angles in a triangle?', answers: ['90°', '180°', '270°', '360°'], correctIndex: 1 },
  { id: 't4-035', tier: 4, category: 'maths', question: 'What is cos(0°)?', answers: ['0', '0.5', '1', '-1'], correctIndex: 2 },
  { id: 't4-036', tier: 4, category: 'maths', question: 'What is the formula for the area of a circle?', answers: ['πr', '2πr', 'πr²', '2πr²'], correctIndex: 2 },
  { id: 't4-037', tier: 4, category: 'maths', question: 'What is a prime number?', answers: ['Divisible by 2', 'Only divisible by 1 and itself', 'An even number', 'A negative number'], correctIndex: 1 },
  { id: 't4-038', tier: 4, category: 'maths', question: 'What is the probability of getting heads when flipping a fair coin?', answers: ['0.25', '0.5', '0.75', '1'], correctIndex: 1 },
  
  // Computing & Engineering
  { id: 't4-039', tier: 4, category: 'computing', question: 'What does CPU stand for?', answers: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Processing Unit'], correctIndex: 0 },
  { id: 't4-040', tier: 4, category: 'computing', question: 'What number system do computers use internally?', answers: ['Decimal', 'Binary', 'Hexadecimal', 'Octal'], correctIndex: 1 },
  { id: 't4-041', tier: 4, category: 'computing', question: 'How many bits are in a byte?', answers: ['4', '8', '16', '32'], correctIndex: 1 },
  { id: 't4-042', tier: 4, category: 'engineering', question: 'Why are manhole covers round?', answers: ['Easier to make', "Can't fall through the hole", 'Roll better', 'Historical reasons'], correctIndex: 1 },
  
  // History of Science
  { id: 't4-043', tier: 4, category: 'history', question: 'Who proposed the theory of evolution by natural selection?', answers: ['Isaac Newton', 'Albert Einstein', 'Charles Darwin', 'Gregor Mendel'], correctIndex: 2 },
  { id: 't4-044', tier: 4, category: 'history', question: "What does 'dinosaur' literally mean?", answers: ['Old lizard', 'Terrible lizard', 'Giant reptile', 'Ancient beast'], correctIndex: 1 },
  { id: 't4-045', tier: 4, category: 'history', question: 'Who discovered gravity (according to legend, from an apple)?', answers: ['Einstein', 'Newton', 'Galileo', 'Darwin'], correctIndex: 1 },
  { id: 't4-046', tier: 4, category: 'history', question: 'Who invented the telephone?', answers: ['Thomas Edison', 'Alexander Graham Bell', 'Nikola Tesla', 'Benjamin Franklin'], correctIndex: 1 },
  { id: 't4-047', tier: 4, category: 'history', question: 'What did Marie Curie discover?', answers: ['Gravity', 'Radioactivity', 'DNA', 'Electricity'], correctIndex: 1 },
  { id: 't4-048', tier: 4, category: 'history', question: 'Who first proposed that the Earth orbits the Sun?', answers: ['Galileo', 'Copernicus', 'Newton', 'Kepler'], correctIndex: 1 },
  { id: 't4-049', tier: 4, category: 'history', question: 'What did Mendel study to discover genetics?', answers: ['Mice', 'Flies', 'Peas', 'Bacteria'], correctIndex: 2 },
  { id: 't4-050', tier: 4, category: 'history', question: 'Who discovered penicillin?', answers: ['Louis Pasteur', 'Alexander Fleming', 'Joseph Lister', 'Edward Jenner'], correctIndex: 1 },

  // ========================================
  // TIER 5: BLAZE - A-Level / Enthusiast (50 questions)
  // ========================================
  
  // Physics
  { id: 't5-001', tier: 5, category: 'physics', question: "What's the second law of thermodynamics (simply)?", answers: ['Energy is conserved', 'Entropy always increases', 'Every action has a reaction', 'Force equals mass times acceleration'], correctIndex: 1 },
  { id: 't5-002', tier: 5, category: 'physics', question: "What's activation energy?", answers: ['Energy released in a reaction', 'Minimum energy needed for a reaction', 'Energy stored in bonds', 'Total energy of products'], correctIndex: 1 },
  { id: 't5-003', tier: 5, category: 'physics', question: 'What does e = mc² mean in words?', answers: ['Energy equals mass times speed', 'Energy equals mass times speed of light squared', 'Everything equals matter times light', 'Energy and mass are unrelated'], correctIndex: 1 },
  { id: 't5-004', tier: 5, category: 'physics', question: 'What is the observer effect in physics?', answers: ['Observers see different things', 'Measurement can change what is measured', 'Time appears different to observers', 'Light bends around observers'], correctIndex: 1 },
  { id: 't5-005', tier: 5, category: 'physics', question: 'What is the Heisenberg Uncertainty Principle?', answers: ['Nothing is certain', "Can't know position and momentum precisely together", 'Electrons are uncertain', 'Light is uncertain'], correctIndex: 1 },
  { id: 't5-006', tier: 5, category: 'physics', question: 'What is wave-particle duality?', answers: ['Waves become particles', 'Light and matter have both wave and particle properties', 'Particles create waves', 'Only light is dual'], correctIndex: 1 },
  { id: 't5-007', tier: 5, category: 'physics', question: 'What is red shift evidence of?', answers: ['Stars dying', 'Universe expanding', 'Stars cooling', 'Light slowing'], correctIndex: 1 },
  { id: 't5-008', tier: 5, category: 'physics', question: 'What is nuclear fusion?', answers: ['Splitting atoms', 'Combining atoms', 'Radioactive decay', 'Electron transfer'], correctIndex: 1 },
  { id: 't5-009', tier: 5, category: 'physics', question: 'What is a superconductor?', answers: ['Very good conductor', 'Material with zero resistance at low temp', 'Lightning rod', 'Power generator'], correctIndex: 1 },
  { id: 't5-010', tier: 5, category: 'physics', question: 'What is Planck\'s constant used for?', answers: ['Measuring gravity', 'Quantum calculations', 'Speed of light', 'Electron mass'], correctIndex: 1 },
  
  // Chemistry
  { id: 't5-011', tier: 5, category: 'chemistry', question: "What's a mole in chemistry?", answers: ['A small furry animal', '6.022 × 10²³ particles', 'A unit of volume', 'A type of bond'], correctIndex: 1 },
  { id: 't5-012', tier: 5, category: 'chemistry', question: "What's the unit of electrical resistance?", answers: ['Amp', 'Volt', 'Ohm', 'Watt'], correctIndex: 2 },
  { id: 't5-013', tier: 5, category: 'chemistry', question: 'What is an exothermic reaction?', answers: ['One that absorbs heat', 'One that releases heat', 'One that needs light', 'One that produces gas'], correctIndex: 1 },
  { id: 't5-014', tier: 5, category: 'chemistry', question: 'What is an oxidation reaction?', answers: ['Losing electrons', 'Gaining electrons', 'Gaining protons', 'Losing neutrons'], correctIndex: 0 },
  { id: 't5-015', tier: 5, category: 'chemistry', question: 'What is a buffer solution?', answers: ['Cleaning solution', 'Resists pH change', 'Neutralises acids', 'Dissolves metals'], correctIndex: 1 },
  { id: 't5-016', tier: 5, category: 'chemistry', question: 'What is the Haber process used to make?', answers: ['Steel', 'Ammonia', 'Plastic', 'Glass'], correctIndex: 1 },
  { id: 't5-017', tier: 5, category: 'chemistry', question: 'What is electronegativity?', answers: ['Negative charge', 'Ability to attract electrons in a bond', 'Number of electrons', 'Electron energy'], correctIndex: 1 },
  { id: 't5-018', tier: 5, category: 'chemistry', question: 'What are allotropes?', answers: ['Different elements', 'Same element, different structures', 'Isotopes', 'Ions'], correctIndex: 1 },
  { id: 't5-019', tier: 5, category: 'chemistry', question: 'What is Le Chatelier\'s Principle about?', answers: ['Reaction rates', 'Equilibrium shifting to counteract change', 'Temperature effects', 'Pressure only'], correctIndex: 1 },
  { id: 't5-020', tier: 5, category: 'chemistry', question: 'What type of reaction is esterification?', answers: ['Acid + base', 'Alcohol + carboxylic acid', 'Metal + acid', 'Combustion'], correctIndex: 1 },
  
  // Biology
  { id: 't5-021', tier: 5, category: 'biology', question: 'What organelle is responsible for protein synthesis?', answers: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'], correctIndex: 2 },
  { id: 't5-022', tier: 5, category: 'biology', question: "What's the function of haemoglobin?", answers: ['Fighting infection', 'Carrying oxygen', 'Clotting blood', 'Producing hormones'], correctIndex: 1 },
  { id: 't5-023', tier: 5, category: 'biology', question: 'What shape is a DNA molecule?', answers: ['Single helix', 'Double helix', 'Triple helix', 'Straight chain'], correctIndex: 1 },
  { id: 't5-024', tier: 5, category: 'biology', question: 'What is the function of the Golgi apparatus?', answers: ['Energy production', 'Packaging and secreting proteins', 'Cell division', 'Storage'], correctIndex: 1 },
  { id: 't5-025', tier: 5, category: 'biology', question: 'What is ATP?', answers: ['A protein', 'Energy currency of cells', 'A hormone', 'A vitamin'], correctIndex: 1 },
  { id: 't5-026', tier: 5, category: 'biology', question: 'What is a codon?', answers: ['A gene', 'Three-base sequence coding for amino acid', 'A chromosome', 'A protein'], correctIndex: 1 },
  { id: 't5-027', tier: 5, category: 'biology', question: 'What is synaptic transmission?', answers: ['Nerve impulse across synapse', 'Blood flow', 'Hormone release', 'Cell division'], correctIndex: 0 },
  { id: 't5-028', tier: 5, category: 'biology', question: 'What are stem cells?', answers: ['Plant cells', 'Undifferentiated cells that can become any type', 'Dead cells', 'Cancer cells'], correctIndex: 1 },
  { id: 't5-029', tier: 5, category: 'biology', question: 'What is the Calvin cycle?', answers: ['Water cycle', 'Carbon fixation in photosynthesis', 'Cell cycle', 'Krebs cycle'], correctIndex: 1 },
  { id: 't5-030', tier: 5, category: 'biology', question: 'What is CRISPR used for?', answers: ['Cooking', 'Gene editing', 'Photography', 'Computing'], correctIndex: 1 },
  
  // Maths
  { id: 't5-031', tier: 5, category: 'maths', question: "Why can't you divide by zero?", answers: ['The answer is always zero', 'It gives infinity', "It's undefined and leads to contradictions", 'Computers cannot handle it'], correctIndex: 2 },
  { id: 't5-032', tier: 5, category: 'maths', question: 'What is the next number: 1, 1, 2, 3, 5, 8, ...?', answers: ['11', '12', '13', '14'], correctIndex: 2 },
  { id: 't5-033', tier: 5, category: 'maths', question: 'What is the derivative of x²?', answers: ['x', '2x', 'x²', '2x²'], correctIndex: 1 },
  { id: 't5-034', tier: 5, category: 'maths', question: 'What is i (the imaginary unit) equal to?', answers: ['√1', '√-1', '-1', '1'], correctIndex: 1 },
  { id: 't5-035', tier: 5, category: 'maths', question: 'What is the integral of 2x?', answers: ['2', 'x', 'x²', '2x²'], correctIndex: 2 },
  { id: 't5-036', tier: 5, category: 'maths', question: 'What is e approximately equal to?', answers: ['2.718', '3.142', '1.618', '2.236'], correctIndex: 0 },
  { id: 't5-037', tier: 5, category: 'maths', question: 'What is a logarithm?', answers: ['Multiplication', 'Inverse of exponentiation', 'Type of graph', 'Division'], correctIndex: 1 },
  { id: 't5-038', tier: 5, category: 'maths', question: 'What is the binomial theorem used for?', answers: ['Solving equations', 'Expanding (a+b)^n', 'Finding roots', 'Integration'], correctIndex: 1 },
  { id: 't5-039', tier: 5, category: 'maths', question: 'What is a limit in calculus?', answers: ['Maximum value', 'Value a function approaches', 'Minimum value', 'Undefined point'], correctIndex: 1 },
  { id: 't5-040', tier: 5, category: 'maths', question: 'What is the dot product of two vectors?', answers: ['A vector', 'A scalar', 'A matrix', 'Another name for cross product'], correctIndex: 1 },
  
  // Space & History
  { id: 't5-041', tier: 5, category: 'space', question: 'What percentage of the universe is ordinary matter?', answers: ['About 5%', 'About 25%', 'About 50%', 'About 75%'], correctIndex: 0 },
  { id: 't5-042', tier: 5, category: 'space', question: 'If you drop a hammer and feather on the Moon, which lands first?', answers: ['Hammer', 'Feather', 'Same time', 'Neither falls'], correctIndex: 2 },
  { id: 't5-043', tier: 5, category: 'space', question: 'What is a black hole\'s event horizon?', answers: ['Its center', 'Point of no return for light', 'Its outer edge', 'Its spin axis'], correctIndex: 1 },
  { id: 't5-044', tier: 5, category: 'space', question: 'What causes a star to become a supernova?', answers: ['Running out of fuel', 'Core collapse or white dwarf explosion', 'Getting too hot', 'Spinning too fast'], correctIndex: 1 },
  { id: 't5-045', tier: 5, category: 'space', question: 'What is dark matter?', answers: ['Black holes', 'Unknown matter detected by gravity', 'Anti-matter', 'Empty space'], correctIndex: 1 },
  { id: 't5-046', tier: 5, category: 'history', question: 'Who discovered that washing hands prevents disease and was ignored?', answers: ['Louis Pasteur', 'Ignaz Semmelweis', 'Joseph Lister', 'Robert Koch'], correctIndex: 1 },
  { id: 't5-047', tier: 5, category: 'history', question: 'How many Earths could fit inside the Sun?', answers: ['About 1,000', 'About 13,000', 'About 130,000', 'About 1.3 million'], correctIndex: 3 },
  { id: 't5-048', tier: 5, category: 'computing', question: 'What does the K stand for in KB?', answers: ['Kilo (thousand)', 'Kibi (1024)', 'Key', 'Kernel'], correctIndex: 0 },
  { id: 't5-049', tier: 5, category: 'computing', question: 'What is Big O notation used for?', answers: ['Measuring file size', 'Describing algorithm efficiency', 'Counting operations', 'Rating processors'], correctIndex: 1 },
  { id: 't5-050', tier: 5, category: 'computing', question: 'What is recursion in programming?', answers: ['Repeating code', 'A function calling itself', 'Going backwards', 'Error handling'], correctIndex: 1 },

  // ========================================
  // TIER 6: FURNACE - Undergraduate 🔒
  // ========================================
  
  { id: 't6-001', tier: 6, category: 'physics', question: 'What does the Pauli exclusion principle state?', answers: ['Energy is conserved', 'No two fermions can share a quantum state', 'Light is both wave and particle', 'Momentum is conserved'], correctIndex: 1 },
  { id: 't6-002', tier: 6, category: 'physics', question: 'What is the spin of an electron?', answers: ['0', '½', '1', '2'], correctIndex: 1 },
  { id: 't6-003', tier: 6, category: 'physics', question: 'In the double-slit experiment, what happens when you observe which slit a particle goes through?', answers: ['Pattern gets brighter', 'Interference pattern disappears', 'Particles stop moving', 'Nothing changes'], correctIndex: 1 },
  { id: 't6-004', tier: 6, category: 'physics', question: "What does Maxwell's demon supposedly violate?", answers: ['Conservation of energy', 'Second law of thermodynamics', "Newton's third law", 'Conservation of momentum'], correctIndex: 1 },
  { id: 't6-005', tier: 6, category: 'chemistry', question: 'What geometry does sp³ hybridisation produce?', answers: ['Linear', 'Trigonal planar', 'Tetrahedral', 'Octahedral'], correctIndex: 2 },
  { id: 't6-006', tier: 6, category: 'chemistry', question: 'What is a chiral molecule?', answers: ['One with a double bond', "One that can't be superimposed on its mirror image", 'One with ionic bonds', 'One that conducts electricity'], correctIndex: 1 },
  { id: 't6-007', tier: 6, category: 'biology', question: 'What enzyme unwinds DNA during replication?', answers: ['Polymerase', 'Ligase', 'Helicase', 'Primase'], correctIndex: 2 },
  { id: 't6-008', tier: 6, category: 'biology', question: "What's the difference between genotype and phenotype?", answers: ['They are the same', 'Genotype is genetic code, phenotype is expressed traits', 'Phenotype is genetic code, genotype is traits', 'One is dominant, one recessive'], correctIndex: 1 },
  { id: 't6-009', tier: 6, category: 'maths', question: 'What is i² equal to?', answers: ['1', '-1', 'i', '0'], correctIndex: 1 },
  { id: 't6-010', tier: 6, category: 'maths', question: "What is Euler's identity?", answers: ['e^(iπ) = 1', 'e^(iπ) + 1 = 0', 'e^(iπ) - 1 = 0', 'e^(iπ) = -1'], correctIndex: 1 },
  { id: 't6-011', tier: 6, category: 'maths', question: 'Is π algebraic or transcendental?', answers: ['Algebraic', 'Transcendental', 'Rational', 'Irrational but algebraic'], correctIndex: 1 },
  { id: 't6-012', tier: 6, category: 'maths', question: 'What is the integral of 1/x?', answers: ['x', '1/x²', 'ln|x| + C', 'e^x'], correctIndex: 2 },
  { id: 't6-013', tier: 6, category: 'physics', question: 'What is quantum entanglement?', answers: ['Particles stuck together', 'Correlated quantum states regardless of distance', 'Wave interference', 'Particle decay'], correctIndex: 1 },
  { id: 't6-014', tier: 6, category: 'chemistry', question: 'What is a coordination compound?', answers: ['Simple ionic compound', 'Metal ion with ligands', 'Organic molecule', 'Gas mixture'], correctIndex: 1 },
  { id: 't6-015', tier: 6, category: 'biology', question: 'What is the lac operon?', answers: ['A virus', 'Gene regulation system in bacteria', 'A protein', 'An organelle'], correctIndex: 1 },

  // ========================================
  // TIER 7: FORGE - Graduate Level 🔒
  // ========================================
  
  { id: 't7-001', tier: 7, category: 'physics', question: 'What does the Born rule tell you?', answers: ['How particles decay', 'Probability equals amplitude squared', 'Energy of ground state', 'Speed of quantum tunneling'], correctIndex: 1 },
  { id: 't7-002', tier: 7, category: 'physics', question: 'What mathematical structure represents quantum states?', answers: ['Euclidean space', 'Hilbert space', 'Minkowski space', 'Phase space'], correctIndex: 1 },
  { id: 't7-003', tier: 7, category: 'physics', question: "What's the Schwarzschild radius?", answers: ['Radius of a neutron star', 'Radius where escape velocity equals light speed', 'Radius of electron orbit', 'Radius of the universe'], correctIndex: 1 },
  { id: 't7-004', tier: 7, category: 'biology', question: "What's the endosymbiotic theory?", answers: ['Cells evolved from viruses', 'Mitochondria were once free-living bacteria', 'DNA came from RNA', 'Life began in hot springs'], correctIndex: 1 },
  { id: 't7-005', tier: 7, category: 'biology', question: "What's a prion?", answers: ['A type of virus', 'A misfolded protein that spreads misfolding', 'A bacterial enzyme', 'A genetic mutation'], correctIndex: 1 },
  { id: 't7-006', tier: 7, category: 'biology', question: "What's the difference between a kinase and a phosphatase?", answers: ['They are the same', 'Kinase adds phosphate, phosphatase removes it', 'Kinase removes phosphate, phosphatase adds it', 'One works on DNA, one on RNA'], correctIndex: 1 },
  { id: 't7-007', tier: 7, category: 'chemistry', question: "What's Hückel's rule for aromaticity?", answers: ['4n electrons', '4n+1 electrons', '4n+2 π electrons', '2n π electrons'], correctIndex: 2 },
  { id: 't7-008', tier: 7, category: 'chemistry', question: 'What does the Nernst equation calculate?', answers: ['Reaction rate', 'Electrode potential under non-standard conditions', 'Equilibrium constant', 'Activation energy'], correctIndex: 1 },
  { id: 't7-009', tier: 7, category: 'maths', question: "What does Gödel's first incompleteness theorem prove?", answers: ['Mathematics is complete', 'All statements can be proven', 'Consistent systems have unprovable truths', 'Arithmetic is inconsistent'], correctIndex: 2 },
  { id: 't7-010', tier: 7, category: 'maths', question: "What's the Riemann hypothesis about?", answers: ['Prime distribution', 'Zeros of the zeta function', 'Topology of manifolds', 'Differential equations'], correctIndex: 1 },
  { id: 't7-011', tier: 7, category: 'physics', question: 'What is spontaneous symmetry breaking?', answers: ['Random destruction', 'Ground state has less symmetry than laws', 'Particles changing type', 'Energy conservation violation'], correctIndex: 1 },
  { id: 't7-012', tier: 7, category: 'chemistry', question: 'What is a transition state?', answers: ['Liquid to solid', 'Highest energy point in reaction coordinate', 'Final product', 'Initial reactant'], correctIndex: 1 },

  // ========================================
  // TIER 8: CRUCIBLE - PhD Level 🔒
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
  { id: 't8-010', tier: 8, category: 'physics', question: 'What is renormalization in QFT?', answers: ['Normalizing wave functions', 'Procedure to handle infinities in calculations', 'Resetting energy levels', 'Symmetry restoration'], correctIndex: 1 },

  // ========================================
  // TIER 9: NOVA - Specialist Level 🔒
  // ========================================
  
  { id: 't9-001', tier: 9, category: 'physics', question: "What's a Calabi-Yau manifold?", answers: ['A black hole type', 'Complex manifold for compactified dimensions in string theory', 'Quantum field configuration', 'Spacetime singularity'], correctIndex: 1 },
  { id: 't9-002', tier: 9, category: 'physics', question: "What's the hierarchy problem?", answers: ['Dark matter abundance', 'Why gravity is so weak compared to other forces', 'Neutrino masses', 'Matter-antimatter asymmetry'], correctIndex: 1 },
  { id: 't9-003', tier: 9, category: 'biology', question: "What's horizontal gene transfer and why does it matter?", answers: ['Genes moving parent to child', 'Genes moving between organisms, complicating phylogenetics', 'Mutation process', 'DNA replication error'], correctIndex: 1 },
  { id: 't9-004', tier: 9, category: 'biology', question: "What's phase separation in cell biology?", answers: ['Cell division', 'Membrane-less organelles from liquid-liquid separation', 'Protein crystallization', 'DNA condensation'], correctIndex: 1 },
  { id: 't9-005', tier: 9, category: 'chemistry', question: "What's Marcus theory about?", answers: ['Organic reactions', 'Electron transfer rate vs reorganization energy', 'Crystal structures', 'Polymer chemistry'], correctIndex: 1 },
  { id: 't9-006', tier: 9, category: 'chemistry', question: "What's a frustrated Lewis pair?", answers: ['Failed acid-base reaction', 'Sterically prevented acid-base pair enabling unusual catalysis', 'Unstable compound', 'Weak intermolecular force'], correctIndex: 1 },
  { id: 't9-007', tier: 9, category: 'maths', question: 'What did Perelman prove in 2003?', answers: ["Fermat's Last Theorem", 'The Poincaré conjecture', 'Riemann hypothesis', 'P ≠ NP'], correctIndex: 1 },
  { id: 't9-008', tier: 9, category: 'maths', question: "What's the Langlands program?", answers: ['Computer algorithm', 'Conjectures connecting number theory and geometry', 'Statistical method', 'Cryptography system'], correctIndex: 1 },
  { id: 't9-009', tier: 9, category: 'maths', question: 'What are p-adic numbers?', answers: ['Complex numbers', 'Alternative completion of rationals using prime-based metric', 'Transcendental numbers', 'Hyperreal numbers'], correctIndex: 1 },
  { id: 't9-010', tier: 9, category: 'physics', question: 'What is the AdS/CFT correspondence?', answers: ['Particle classification', 'Duality between gravity in AdS space and CFT on boundary', 'Dark matter theory', 'Quantum gravity approach'], correctIndex: 1 },

  // ========================================
  // TIER 10: SUPERNOVA - World Expert 🔒
  // ========================================
  
  { id: 't10-001', tier: 10, category: 'physics', question: "What's the physical significance of 1/137 in physics?", answers: ['Speed of light', 'Fine-structure constant - one of physics\' unexplained numbers', 'Planck constant', 'Gravitational constant'], correctIndex: 1 },
  { id: 't10-002', tier: 10, category: 'physics', question: "What's the firewall paradox?", answers: ['Star temperature problem', 'Conflict between smooth horizons and unitarity in black holes', 'Plasma containment issue', 'Supernova mechanism'], correctIndex: 1 },
  { id: 't10-003', tier: 10, category: 'physics', question: "What's the holographic principle?", answers: ['3D imaging method', 'Information content encoded on boundaries in one fewer dimension', 'Quantum measurement theory', 'Light interference pattern'], correctIndex: 1 },
  { id: 't10-004', tier: 10, category: 'physics', question: 'What does it mean for a gauge theory to be asymptotically free?', answers: ['No gauge bosons', 'Coupling strength decreases at high energies', 'Theory is finite', 'Symmetry is broken'], correctIndex: 1 },
  { id: 't10-005', tier: 10, category: 'biology', question: "Why is protein folding computationally hard (Levinthal's paradox)?", answers: ['Too many atoms', 'Conformational space is astronomically large yet proteins fold fast', 'Quantum effects', 'Insufficient data'], correctIndex: 1 },
  { id: 't10-006', tier: 10, category: 'maths', question: "What's the Birch and Swinnerton-Dyer conjecture?", answers: ['Prime number distribution', 'Rank of elliptic curve related to L-function behavior', 'Topology theorem', 'Number field theory'], correctIndex: 1 },
  { id: 't10-007', tier: 10, category: 'maths', question: "What's a non-trivial TQFT and why do mathematicians care?", answers: ['Quantum computer design', 'Topological field theory providing manifold invariants', 'Statistical method', 'Encryption algorithm'], correctIndex: 1 },
  { id: 't10-008', tier: 10, category: 'maths', question: "What's the Yang-Baxter equation?", answers: ['Particle physics law', 'Consistency condition for integrable systems, appears in knot theory', 'Differential equation', 'Group theory axiom'], correctIndex: 1 },
  { id: 't10-009', tier: 10, category: 'maths', question: "What's the Grothendieck-Riemann-Roch theorem about?", answers: ['Complex analysis', 'Generalises Riemann-Roch to higher dimensions using K-theory', 'Number theory', 'Differential geometry'], correctIndex: 1 },
  { id: 't10-010', tier: 10, category: 'physics', question: 'What is the ER=EPR conjecture?', answers: ['Energy relation', 'Wormholes may be equivalent to entanglement', 'Electron behavior', 'Radiation formula'], correctIndex: 1 },
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
