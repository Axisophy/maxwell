import { type Book } from './books'

export interface ReadingPath {
  slug: string
  title: string
  question: string // The mood/prompt
  description: string
  bookSlugs: string[] // References to books
  explanations: Record<string, string> // slug -> why this book
  category: 'mood' | 'subject' | 'depth'
}

export const readingPaths: ReadingPath[] = [
  {
    slug: 'impress-at-dinner',
    title: 'Impress at Dinner',
    question: 'I want to impress people at dinner parties',
    description: 'Cocktail party ammunition. Ideas that sound brilliant, are actually profound, and can be explained in under two minutes.',
    category: 'mood',
    bookSlugs: ['elements', 'origin-of-species', 'relativity', 'on-the-nature-of-things', 'flatland'],
    explanations: {
      'elements': 'Drop that Euclid proved there are exactly five Platonic solids - and that this was considered so important it ends the Elements. Then casually mention the proof is beautiful.',
      'origin-of-species': 'Darwin\'s key insight isn\'t "survival of the fittest" - it\'s that small variations, accumulated over deep time, can produce anything. The algorithm that writes itself.',
      'relativity': 'Einstein explains that nothing can travel faster than light not because of engineering limits, but because speed and time are the same thing. Time literally slows down.',
      'on-the-nature-of-things': 'The Romans had atomic theory. Lucretius argued everything is atoms and void - 1,800 years before modern chemistry proved him right.',
      'flatland': 'A Victorian headmaster wrote a novella about two-dimensional beings to explain higher dimensions. It\'s also savage social satire. Both at once.',
    },
  },
  {
    slug: 'fill-with-wonder',
    title: 'Fill You With Wonder',
    question: 'I want to feel awe and wonder',
    description: 'Books that expand your sense of what\'s possible. The universe is stranger and more beautiful than you thought.',
    category: 'mood',
    bookSlugs: ['origin-of-species', 'relativity', 'what-is-life', 'micrographia', 'on-the-sizes-and-distances'],
    explanations: {
      'origin-of-species': 'Every living thing is your cousin. The tree outside your window shares ancestors with you. Darwin shows how one process - natural selection - explains all of life\'s diversity.',
      'relativity': 'Space and time are not the fixed stage on which physics happens - they\'re part of the show. Mass bends spacetime. The faster you move, the slower time passes. Reality is weirder than fiction.',
      'what-is-life': 'A quantum physicist asks how atoms can produce living things. Schrödinger predicted the existence of a "code-script" carrying hereditary information - years before DNA was understood.',
      'micrographia': 'Hooke looked at a cork under a microscope and saw tiny chambers - he called them "cells". He looked at a flea and drew it two feet across. He revealed a hidden world.',
      'on-the-sizes-and-distances': 'In 250 BCE, Aristarchus calculated the Sun was much larger than the Earth using only geometry and observation. He concluded the Earth must orbit the Sun. He was right.',
    },
  },
  {
    slug: 'need-to-concentrate',
    title: 'Going to Need to Concentrate',
    question: 'I want something challenging but rewarding',
    description: 'These aren\'t easy. They\'ll slow you down, make you re-read sentences, reach for paper to work things out. Worth every minute.',
    category: 'depth',
    bookSlugs: ['principia', 'elements', 'treatise-electricity-magnetism', 'almagest', 'cybernetics'],
    explanations: {
      'principia': 'Newton unified terrestrial and celestial mechanics. An apple and the Moon obey the same law. But he wrote in geometric proofs, not modern notation. This is climbing Everest.',
      'elements': 'Pure deductive reasoning from first principles. Euclid builds all of geometry from five postulates. Following each proof exercises mathematical muscles you didn\'t know you had.',
      'treatise-electricity-magnetism': 'Maxwell\'s complete treatment of electromagnetism. Dense, mathematical, foundational. Einstein kept Maxwell\'s portrait on his wall.',
      'almagest': 'Ptolemy\'s geocentric model is wrong - but the mathematics is sophisticated and the observations are careful. Understanding why it worked so well teaches you about science itself.',
      'cybernetics': 'Wiener founded a new discipline. Feedback, information, control - ideas that now permeate everything from engineering to biology to economics. Not light reading.',
    },
  },
  {
    slug: 'something-short',
    title: 'Something Short',
    question: 'I only have a few hours',
    description: 'Complete, important works you can finish in an afternoon. Some of the most influential ideas in history fit in surprisingly few pages.',
    category: 'mood',
    bookSlugs: ['plant-hybridization', 'on-floating-bodies', 'flatland', 'rur', 'time-machine'],
    explanations: {
      'plant-hybridization': 'The foundation of genetics in under 50 pages. Mendel\'s pea experiments were ignored for 35 years, then revolutionised biology. You can read it in an hour.',
      'on-floating-bodies': 'Archimedes on buoyancy - including the famous "Eureka" insight. Brief, elegant, foundational. A few hours with a genius.',
      'flatland': 'A 100-page novella that teaches dimensional geometry through fiction. You\'ll never think about space the same way. Readable in one sitting.',
      'rur': 'The play that invented the word "robot". Two hours of reading that anticipates a century of AI anxiety. Čapek was asking the right questions in 1920.',
      'time-machine': 'Wells invented time travel fiction in under 100 pages. Also a meditation on evolution, entropy, and class. A masterpiece of economy.',
    },
  },
  {
    slug: 'under-30',
    title: 'Written Under 30',
    question: 'What did geniuses write when they were young?',
    description: 'Revolutionary work by scientists who hadn\'t yet turned 30. Youth and insight, captured on the page.',
    category: 'mood',
    bookSlugs: ['frankenstein', 'electromagnetic-field', 'plant-hybridization', 'on-floating-bodies', 'dialogue'],
    explanations: {
      'frankenstein': 'Mary Shelley was 18 when she began writing it, 20 when it was published. She invented science fiction as a teenager.',
      'electromagnetic-field': 'Maxwell was 34 when this was published, but the key insights came earlier. He unified electricity, magnetism, and light - one of the greatest intellectual achievements in history.',
      'plant-hybridization': 'Mendel did his pea experiments in his 30s and 40s, but his mathematical approach came from his training in his 20s. The foundation of genetics from a monk with a background in physics.',
      'on-floating-bodies': 'Archimedes was likely in his 20s or 30s when he developed his principle of buoyancy. "Eureka!" - the most famous bath in scientific history.',
      'dialogue': 'Galileo wrote it at 68, but the observations that convinced him - the moons of Jupiter, the phases of Venus - came when he was in his 40s. Sometimes genius needs time to ripen.',
    },
  },
  {
    slug: 'changed-everything',
    title: 'Changed Everything',
    question: 'Books that actually changed the world',
    description: 'These aren\'t just important books about important ideas. They\'re books that bent history\'s arc. The world before and after was different.',
    category: 'mood',
    bookSlugs: ['origin-of-species', 'principia', 'revolutions', 'elements', 'micrographia'],
    explanations: {
      'origin-of-species': 'Darwin didn\'t just describe evolution - he made it undeniable. Every field of biology, psychology, and medicine was transformed. We\'re still working out the implications.',
      'principia': 'Newton showed that the same laws govern falling apples and orbiting planets. He mathematicised the universe. Everything from satellite navigation to space travel traces back here.',
      'revolutions': 'Copernicus moved the Earth. The book took 30 years to write and he died the year it was published. But it started the Scientific Revolution.',
      'elements': 'The most successful textbook in history. Euclid\'s geometry trained mathematical minds for 2,300 years. Lincoln taught himself logic from it. Einstein called it "holy".',
      'micrographia': 'Hooke revealed an invisible world. The book was a sensation - Samuel Pepys stayed up until 2am reading it. It showed what science could reveal about the hidden fabric of reality.',
    },
  },
]

export function getPathBySlug(slug: string): ReadingPath | undefined {
  return readingPaths.find(path => path.slug === slug)
}

export function getPathsByCategory(category: ReadingPath['category']): ReadingPath[] {
  return readingPaths.filter(path => path.category === category)
}