import { Taxon, TreeNode } from './types';
import { kingdomColors, domainColors } from './colors';

// ===========================================
// DOMAINS
// ===========================================

export const domains: Taxon[] = [
  {
    id: 'bacteria',
    name: 'Bacteria',
    rank: 'domain',
    parentId: null,
    childIds: ['proteobacteria', 'cyanobacteria', 'firmicutes', 'actinobacteria', 'bacteroidetes'],
    isExtinct: false,
    speciesCount: 30000, // Known species (estimated millions exist)
    description: 'Single-celled organisms without a nucleus. The most abundant life forms on Earth, found in every habitat from deep ocean vents to your gut.',
    commonName: 'Bacteria',
    color: domainColors.bacteria,
    firstAppearance: {
      period: 'Archean',
      periodSlug: 'archean',
      mya: 3500,
    },
  },
  {
    id: 'archaea',
    name: 'Archaea',
    rank: 'domain',
    parentId: null,
    childIds: ['euryarchaeota', 'crenarchaeota', 'thaumarchaeota'],
    isExtinct: false,
    speciesCount: 500, // Known species
    description: 'Single-celled organisms that resemble bacteria but are genetically distinct. Many thrive in extreme environments - boiling hot springs, salt lakes, deep-sea vents.',
    commonName: 'Archaea',
    color: domainColors.archaea,
    firstAppearance: {
      period: 'Archean',
      periodSlug: 'archean',
      mya: 3500,
    },
  },
  {
    id: 'eukarya',
    name: 'Eukarya',
    rank: 'domain',
    parentId: null,
    childIds: ['animalia', 'plantae', 'fungi', 'protista', 'chromista'],
    isExtinct: false,
    speciesCount: 2000000,
    description: 'Organisms with complex cells containing a nucleus. Includes all animals, plants, fungi, and many single-celled organisms.',
    commonName: 'Eukaryotes',
    color: domainColors.eukarya,
    firstAppearance: {
      period: 'Proterozoic',
      periodSlug: 'proterozoic',
      mya: 2100,
    },
  },
];

// ===========================================
// KINGDOMS
// ===========================================

export const kingdoms: Taxon[] = [
  {
    id: 'animalia',
    name: 'Animalia',
    rank: 'kingdom',
    parentId: 'eukarya',
    childIds: [
      'chordata', 'arthropoda', 'mollusca', 'annelida', 'cnidaria',
      'echinodermata', 'porifera', 'platyhelminthes', 'nematoda',
      // Extinct phyla
      'trilobita',
    ],
    isExtinct: false,
    speciesCount: 1500000,
    childGroupCount: 35, // Approximate phyla count
    description: 'Multicellular organisms that consume organic matter, breathe oxygen, can move, and reproduce sexually. From microscopic tardigrades to blue whales.',
    commonName: 'Animals',
    color: kingdomColors.animalia,
    firstAppearance: {
      period: 'Ediacaran',
      periodSlug: 'ediacaran',
      mya: 600,
    },
    notableMembers: [
      { id: 'homo-sapiens', name: 'Homo sapiens', commonName: 'Human' },
      { id: 'balaenoptera-musculus', name: 'Balaenoptera musculus', commonName: 'Blue whale' },
      { id: 'apis-mellifera', name: 'Apis mellifera', commonName: 'Honey bee' },
      { id: 'octopus-vulgaris', name: 'Octopus vulgaris', commonName: 'Common octopus' },
      { id: 'tyrannosaurus-rex', name: 'Tyrannosaurus rex', commonName: 'T. rex', isExtinct: true },
      { id: 'drosophila-melanogaster', name: 'Drosophila melanogaster', commonName: 'Fruit fly' },
    ],
  },
  {
    id: 'plantae',
    name: 'Plantae',
    rank: 'kingdom',
    parentId: 'eukarya',
    childIds: [
      'tracheophyta', 'bryophyta', 'marchantiophyta', 'anthocerotophyta',
      'chlorophyta', 'charophyta',
    ],
    isExtinct: false,
    speciesCount: 400000,
    childGroupCount: 12,
    description: 'Multicellular organisms that produce their own food through photosynthesis. They form the base of most food chains and produce the oxygen we breathe.',
    commonName: 'Plants',
    color: kingdomColors.plantae,
    firstAppearance: {
      period: 'Ordovician',
      periodSlug: 'ordovician',
      mya: 470,
    },
    notableMembers: [
      { id: 'sequoiadendron-giganteum', name: 'Sequoiadendron giganteum', commonName: 'Giant sequoia' },
      { id: 'arabidopsis-thaliana', name: 'Arabidopsis thaliana', commonName: 'Thale cress' },
      { id: 'oryza-sativa', name: 'Oryza sativa', commonName: 'Rice' },
      { id: 'welwitschia-mirabilis', name: 'Welwitschia mirabilis', commonName: 'Welwitschia' },
    ],
  },
  {
    id: 'fungi',
    name: 'Fungi',
    rank: 'kingdom',
    parentId: 'eukarya',
    childIds: [
      'basidiomycota', 'ascomycota', 'zygomycota', 'chytridiomycota', 'glomeromycota',
    ],
    isExtinct: false,
    speciesCount: 150000,
    childGroupCount: 8,
    description: 'Organisms that absorb nutrients from their surroundings. They decompose dead matter, form symbioses with plants, and include yeasts, moulds, and mushrooms.',
    commonName: 'Fungi',
    color: kingdomColors.fungi,
    firstAppearance: {
      period: 'Proterozoic',
      periodSlug: 'proterozoic',
      mya: 1000,
    },
    notableMembers: [
      { id: 'agaricus-bisporus', name: 'Agaricus bisporus', commonName: 'Button mushroom' },
      { id: 'saccharomyces-cerevisiae', name: 'Saccharomyces cerevisiae', commonName: "Brewer's yeast" },
      { id: 'armillaria-ostoyae', name: 'Armillaria ostoyae', commonName: 'Honey fungus' },
      { id: 'ophiocordyceps-unilateralis', name: 'Ophiocordyceps unilateralis', commonName: 'Zombie-ant fungus' },
    ],
  },
  {
    id: 'protista',
    name: 'Protista',
    rank: 'kingdom',
    parentId: 'eukarya',
    childIds: [
      'amoebozoa', 'ciliophora', 'euglenozoa', 'apicomplexa', 'foraminifera',
    ],
    isExtinct: false,
    speciesCount: 100000,
    childGroupCount: 45,
    description: 'A diverse collection of mostly single-celled eukaryotes that don\'t fit into other kingdoms. Note: This is a convenience grouping, not a true evolutionary clade.',
    commonName: 'Protists',
    color: kingdomColors.protista,
    firstAppearance: {
      period: 'Proterozoic',
      periodSlug: 'proterozoic',
      mya: 1800,
    },
    notableMembers: [
      { id: 'amoeba-proteus', name: 'Amoeba proteus', commonName: 'Amoeba' },
      { id: 'paramecium-caudatum', name: 'Paramecium caudatum', commonName: 'Paramecium' },
      { id: 'plasmodium-falciparum', name: 'Plasmodium falciparum', commonName: 'Malaria parasite' },
    ],
  },
  {
    id: 'chromista',
    name: 'Chromista',
    rank: 'kingdom',
    parentId: 'eukarya',
    childIds: [
      'ochrophyta', 'haptophyta', 'cryptophyta', 'oomycota',
    ],
    isExtinct: false,
    speciesCount: 25000,
    childGroupCount: 15,
    description: 'A diverse group including brown algae, diatoms, and water moulds. Many are photosynthetic and form the base of aquatic food chains.',
    commonName: 'Chromists',
    color: kingdomColors.chromista,
    firstAppearance: {
      period: 'Proterozoic',
      periodSlug: 'proterozoic',
      mya: 1000,
    },
    notableMembers: [
      { id: 'macrocystis-pyrifera', name: 'Macrocystis pyrifera', commonName: 'Giant kelp' },
      { id: 'phytophthora-infestans', name: 'Phytophthora infestans', commonName: 'Potato blight' },
    ],
  },
];

// ===========================================
// MAJOR PHYLA (Animalia focus for V1)
// ===========================================

export const animalPhyla: Taxon[] = [
  {
    id: 'chordata',
    name: 'Chordata',
    rank: 'phylum',
    parentId: 'animalia',
    childIds: ['mammalia', 'aves', 'reptilia', 'amphibia', 'actinopterygii', 'chondrichthyes'],
    isExtinct: false,
    speciesCount: 80000,
    description: 'Animals with a notochord (flexible rod) at some stage of development. Includes all vertebrates: mammals, birds, reptiles, amphibians, and fish.',
    commonName: 'Chordates',
    color: kingdomColors.animalia,
    firstAppearance: {
      period: 'Cambrian',
      periodSlug: 'cambrian',
      mya: 530,
    },
  },
  {
    id: 'arthropoda',
    name: 'Arthropoda',
    rank: 'phylum',
    parentId: 'animalia',
    childIds: ['insecta', 'arachnida', 'crustacea', 'myriapoda'],
    isExtinct: false,
    speciesCount: 1200000,
    description: 'Animals with exoskeletons, segmented bodies, and jointed legs. The most diverse animal phylum - includes insects, spiders, crustaceans, and centipedes.',
    commonName: 'Arthropods',
    color: kingdomColors.animalia,
    firstAppearance: {
      period: 'Cambrian',
      periodSlug: 'cambrian',
      mya: 530,
    },
  },
  {
    id: 'mollusca',
    name: 'Mollusca',
    rank: 'phylum',
    parentId: 'animalia',
    childIds: ['gastropoda', 'bivalvia', 'cephalopoda'],
    isExtinct: false,
    speciesCount: 85000,
    description: 'Soft-bodied animals, often with shells. Includes snails, clams, octopuses, and squid - some of the most intelligent invertebrates.',
    commonName: 'Molluscs',
    color: kingdomColors.animalia,
    firstAppearance: {
      period: 'Cambrian',
      periodSlug: 'cambrian',
      mya: 530,
    },
  },
  {
    id: 'annelida',
    name: 'Annelida',
    rank: 'phylum',
    parentId: 'animalia',
    childIds: [],
    isExtinct: false,
    speciesCount: 22000,
    description: 'Segmented worms with bodies divided into repeating ring-like sections. Includes earthworms, leeches, and marine polychaetes.',
    commonName: 'Segmented worms',
    color: kingdomColors.animalia,
    firstAppearance: {
      period: 'Cambrian',
      periodSlug: 'cambrian',
      mya: 520,
    },
  },
  {
    id: 'cnidaria',
    name: 'Cnidaria',
    rank: 'phylum',
    parentId: 'animalia',
    childIds: [],
    isExtinct: false,
    speciesCount: 11000,
    description: 'Radially symmetric animals with stinging cells. Includes jellyfish, corals, sea anemones, and hydroids.',
    commonName: 'Cnidarians',
    color: kingdomColors.animalia,
    firstAppearance: {
      period: 'Ediacaran',
      periodSlug: 'ediacaran',
      mya: 580,
    },
  },
  {
    id: 'echinodermata',
    name: 'Echinodermata',
    rank: 'phylum',
    parentId: 'animalia',
    childIds: [],
    isExtinct: false,
    speciesCount: 7000,
    description: 'Marine animals with five-fold radial symmetry and a water vascular system. Includes starfish, sea urchins, and sea cucumbers.',
    commonName: 'Echinoderms',
    color: kingdomColors.animalia,
    firstAppearance: {
      period: 'Cambrian',
      periodSlug: 'cambrian',
      mya: 520,
    },
  },
  {
    id: 'porifera',
    name: 'Porifera',
    rank: 'phylum',
    parentId: 'animalia',
    childIds: [],
    isExtinct: false,
    speciesCount: 9000,
    description: 'The sponges - simple animals without true tissues or organs. They filter water through pores to capture food particles.',
    commonName: 'Sponges',
    color: kingdomColors.animalia,
    firstAppearance: {
      period: 'Ediacaran',
      periodSlug: 'ediacaran',
      mya: 600,
    },
  },
  {
    id: 'platyhelminthes',
    name: 'Platyhelminthes',
    rank: 'phylum',
    parentId: 'animalia',
    childIds: [],
    isExtinct: false,
    speciesCount: 25000,
    description: 'Flatworms - simple, soft-bodied animals without a body cavity. Includes free-living planarians and parasitic tapeworms and flukes.',
    commonName: 'Flatworms',
    color: kingdomColors.animalia,
    firstAppearance: {
      period: 'Cambrian',
      periodSlug: 'cambrian',
      mya: 530,
    },
  },
  {
    id: 'nematoda',
    name: 'Nematoda',
    rank: 'phylum',
    parentId: 'animalia',
    childIds: [],
    isExtinct: false,
    speciesCount: 25000,
    description: 'Roundworms - slender, cylindrical worms found in almost every habitat. Many are parasites; others are essential soil organisms.',
    commonName: 'Roundworms',
    color: kingdomColors.animalia,
    firstAppearance: {
      period: 'Cambrian',
      periodSlug: 'cambrian',
      mya: 530,
    },
  },
  // EXTINCT PHYLUM
  {
    id: 'trilobita',
    name: 'Trilobita',
    rank: 'class', // Actually a class within Arthropoda, but often treated phylum-level in popular taxonomy
    parentId: 'animalia',
    childIds: [],
    isExtinct: true,
    speciesCount: 20000, // Known fossil species
    description: 'Extinct marine arthropods that dominated the oceans for nearly 300 million years. Their distinctive three-lobed bodies make them among the most recognizable fossils.',
    commonName: 'Trilobites',
    color: kingdomColors.animalia,
    firstAppearance: {
      period: 'Cambrian',
      periodSlug: 'cambrian',
      mya: 521,
    },
    lastAppearance: {
      period: 'Permian',
      periodSlug: 'permian',
      mya: 252,
    },
  },
];

// ===========================================
// HELPER FUNCTIONS
// ===========================================

export function getAllTaxa(): Taxon[] {
  return [...domains, ...kingdoms, ...animalPhyla];
}

export function getTaxonById(id: string): Taxon | undefined {
  return getAllTaxa().find(t => t.id === id);
}

export function getTaxonChildren(parentId: string): Taxon[] {
  return getAllTaxa().filter(t => t.parentId === parentId);
}

export function getKingdomForTaxon(taxon: Taxon): Taxon | undefined {
  if (taxon.rank === 'kingdom') return taxon;
  if (taxon.rank === 'domain') return undefined;

  let current = taxon;
  while (current.parentId) {
    const parent = getTaxonById(current.parentId);
    if (!parent) break;
    if (parent.rank === 'kingdom') return parent;
    current = parent;
  }
  return undefined;
}

export function buildTreeFromTaxon(rootId: string, maxDepth: number = 2): TreeNode | null {
  const taxon = getTaxonById(rootId);
  if (!taxon) return null;

  const buildNode = (t: Taxon, depth: number): TreeNode => {
    const children = depth < maxDepth ? getTaxonChildren(t.id) : [];
    return {
      id: t.id,
      name: t.name,
      rank: t.rank,
      isExtinct: t.isExtinct,
      speciesCount: t.speciesCount,
      color: t.color,
      children: children.length > 0 ? children.map(c => buildNode(c, depth + 1)) : undefined,
    };
  };

  return buildNode(taxon, 0);
}

// Build the full tree from LUCA
export function buildFullTree(): TreeNode {
  return {
    id: 'life',
    name: 'Life',
    rank: 'domain', // Not really, but works for typing
    isExtinct: false,
    speciesCount: 2100000,
    color: '#000000',
    children: domains.map(d => buildTreeFromTaxon(d.id, 2)!),
  };
}
