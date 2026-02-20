// Organism definitions with preyIds (references by id), volume, population, and imageUrl
// Prey relationships: predator eats prey (e.g. fish eats plankton)
// Images are stored in public/images/organisms/

const img = (id) => `/images/organisms/${id}.jpg`;

const OCEAN_ORGANISMS = [
  { id: 'plankton', name: 'Plankton', preyIds: null, volume: null, population: 100, imageUrl: img('plankton') },
  { id: 'seaweed', name: 'Seaweed', preyIds: null, volume: null, population: 100, imageUrl: img('seaweed') },
  { id: 'jellyfish', name: 'Jellyfish', preyIds: ['plankton'], volume: 3, population: 50, imageUrl: img('jellyfish') },
  { id: 'fish', name: 'Fish', preyIds: ['jellyfish', 'plankton'], volume: 3, population: 50, imageUrl: img('fish') },
  { id: 'shellfish', name: 'Shellfish', preyIds: ['plankton', 'seaweed'], volume: 3, population: 50, imageUrl: img('shellfish') },
  { id: 'octopus', name: 'Octopus', preyIds: ['fish', 'shellfish'], volume: 3, population: 50, imageUrl: img('octopus') },
  { id: 'dolphin', name: 'Dolphins', preyIds: ['fish', 'octopus'], volume: 3, population: 10, imageUrl: img('dolphin') },
  { id: 'turtle', name: 'Turtles', preyIds: ['jellyfish', 'shellfish', 'seaweed'], volume: 3, population: 50, imageUrl: img('turtle') },
  { id: 'shark', name: 'Sharks', preyIds: ['turtle', 'fish'], volume: 3, population: 10, imageUrl: img('shark') },
];

const AUS_NATIVE_ORGANISMS = [
  { id: 'acacia', name: 'Acacia', preyIds: null, volume: null, population: 100, imageUrl: img('acacia') },
  { id: 'grasses', name: 'Grasses', preyIds: null, volume: null, population: 100, imageUrl: img('grasses') },
  { id: 'insects', name: 'Insects', preyIds: ['acacia', 'grasses'], volume: 3, population: 50, imageUrl: img('insects') },
  { id: 'bilby', name: 'Bilbies', preyIds: ['grasses', 'insects'], volume: 3, population: 50, imageUrl: img('bilby') },
  { id: 'kangaroo', name: 'Kangaroos', preyIds: ['grasses'], volume: 3, population: 50, imageUrl: img('kangaroo') },
  { id: 'snake', name: 'Snakes', preyIds: ['insects', 'bilby'], volume: 3, population: 50, imageUrl: img('snake') },
  { id: 'eagle', name: 'Wedge-tailed Eagles', preyIds: ['snake', 'kangaroo'], volume: 3, population: 10, imageUrl: img('eagle'), apexPredator: true },
  { id: 'dingo', name: 'Dingoes', preyIds: ['bilby', 'kangaroo'], volume: 3, population: 10, imageUrl: img('dingo'), apexPredator: true },
  { id: 'cane_toads', name: 'Cane Toads', preyIds: ['insects'], volume: 3, population: 10, imageUrl: img('cane_toads') },
  { id: 'feral_cats', name: 'Feral Cats', preyIds: ['bilby', 'snake'], volume: 3, population: 10, imageUrl: img('feral_cats'), apexPredator: true },
];

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
