// Organism definitions with preyIds (references by id), population, and imageUrl
// Prey relationships: predator eats prey (e.g. fish eats plankton)
// Images are stored in public/images/organisms/

const img = (id) => `/images/organisms/${id}.jpg`;

/**
 * Calculate trophic level for an organism
 * Producers = 0, Primary consumers = 1, Secondary = 2, etc.
 */
function calculateTrophicLevel(organism, allOrganisms, memo = new Map()) {
  if (organism.preyIds === null || organism.preyIds.length === 0) {
    return 0; // Producer
  }
  if (memo.has(organism.id)) return memo.get(organism.id);

  let maxPreyLevel = 0;
  for (const preyId of organism.preyIds) {
    const prey = allOrganisms.find((o) => o.id === preyId);
    if (prey) {
      const preyLevel = calculateTrophicLevel(prey, allOrganisms, memo);
      maxPreyLevel = Math.max(maxPreyLevel, preyLevel);
    }
  }
  const level = maxPreyLevel + 1;
  memo.set(organism.id, level);
  return level;
}

/**
 * Assign proportional starting populations based on trophic level
 * Producers: 80, Primary: 50, Secondary: 30, Tertiary: 15, Apex: 5
 */
function assignProportionalPopulations(organisms) {
  const levelPopulations = { 0: 80, 1: 40, 2: 20, 3: 10, 4: 5 };
  const memo = new Map();

  return organisms.map((org) => {
    const level = calculateTrophicLevel(org, organisms, memo);
    const population = levelPopulations[level] ?? 5;
    return { ...org, trophicLevel: level, population };
  });
}

const OCEAN_ORGANISMS_RAW = [
  { id: 'plankton', name: 'Plankton', preyIds: null, imageUrl: img('plankton') },
  { id: 'seaweed', name: 'Seaweed', preyIds: null, imageUrl: img('seaweed') },
  { id: 'jellyfish', name: 'Jellyfish', preyIds: ['plankton'], imageUrl: img('jellyfish') },
  { id: 'fish', name: 'Fish', preyIds: ['jellyfish', 'plankton'], imageUrl: img('fish') },
  { id: 'shellfish', name: 'Shellfish', preyIds: ['plankton', 'seaweed'], imageUrl: img('shellfish') },
  { id: 'octopus', name: 'Octopus', preyIds: ['fish', 'shellfish'], imageUrl: img('octopus') },
  { id: 'dolphin', name: 'Dolphins', preyIds: ['fish', 'octopus'], imageUrl: img('dolphin'), apexPredator: true },
  { id: 'turtle', name: 'Turtles', preyIds: ['jellyfish', 'shellfish', 'seaweed'], imageUrl: img('turtle') },
  { id: 'shark', name: 'Sharks', preyIds: ['turtle', 'octopus', 'fish'], imageUrl: img('shark'), apexPredator: true },
];

const AUS_NATIVE_ORGANISMS_RAW = [
  { id: 'acacia', name: 'Acacia', preyIds: null, imageUrl: img('acacia') },
  { id: 'grasses', name: 'Grasses', preyIds: null, imageUrl: img('grasses') },
  { id: 'insects', name: 'Insects', preyIds: ['acacia', 'grasses'], imageUrl: img('insects') },
  { id: 'bilby', name: 'Bilbies', preyIds: ['grasses', 'insects'], imageUrl: img('bilby') },
  { id: 'kangaroo', name: 'Kangaroos', preyIds: ['grasses'], imageUrl: img('kangaroo') },
  { id: 'rabbit', name: 'Rabbits', preyIds: ['grasses'], imageUrl: img('rabbit') },
  { id: 'snake', name: 'Snakes', preyIds: ['insects', 'bilby', 'rabbit'], imageUrl: img('snake') },
  { id: 'eagle', name: 'Wedge-tailed Eagles', preyIds: ['snake', 'kangaroo', 'rabbit'], imageUrl: img('eagle'), apexPredator: true },
  { id: 'dingo', name: 'Dingoes', preyIds: ['bilby', 'kangaroo', 'rabbit'], imageUrl: img('dingo'), apexPredator: true },
  { id: 'cane_toads', name: 'Cane Toads', preyIds: ['insects'], imageUrl: img('cane_toads') },
  { id: 'feral_cats', name: 'Feral Cats', preyIds: ['bilby', 'snake', 'rabbit'], imageUrl: img('feral_cats'), apexPredator: true },
];

// Apply proportional populations based on food chain position
const OCEAN_ORGANISMS = assignProportionalPopulations(OCEAN_ORGANISMS_RAW);
const AUS_NATIVE_ORGANISMS = assignProportionalPopulations(AUS_NATIVE_ORGANISMS_RAW);

export const ECOSYSTEMS = {
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    organisms: OCEAN_ORGANISMS,
    defaultSpecies: ['plankton', 'fish', 'dolphin'],
  },
  ausNative: {
    id: 'ausNative',
    name: 'Australian Native',
    organisms: AUS_NATIVE_ORGANISMS,
    defaultSpecies: ['grasses', 'kangaroo', 'dingo'],
  },
};
