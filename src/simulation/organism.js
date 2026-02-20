/**
 * Organism simulation logic - ported from Python Streamlit app
 * grow(): Producers grow toward 110 cap when population < 100
 * eat(): Proportional consumption from prey; starve (×0.8) if insufficient
 * die(): 5% population loss per tick
 */

export function createOrganism(id, name, preyIds, volume, population) {
  return {
    id,
    name,
    preyIds,
    volume: volume ?? null,
    population,
    populationOverTime: [],
    time: [],
  };
}

export function grow(organism) {
  if (organism.preyIds === null) {
    // Producer
    if (organism.population < 100) {
      organism.population =
        organism.population *
        (1 + 0.5 * ((110 - organism.population) / 100));
    }
  }
}

export function eat(organism, organisms, organismMap) {
  if (!organism.preyIds) return;

  const preyObjs = organism.preyIds
    .map((pid) => organismMap[pid])
    .filter((p) => p && organisms.includes(p));

  let sumPrey = preyObjs.reduce((s, p) => s + p.population, 0);

  if (sumPrey === 0) return;

  let totalEats = 0;
  for (const p of preyObjs) {
    const eats = Math.min(
      (p.population / sumPrey) * (organism.volume / 10) * organism.population,
      p.population / 5
    );
    organism.population += eats;
    p.population -= eats;
    totalEats += eats;
  }

  // Starve if insufficient food
  if (sumPrey < organism.volume * organism.population) {
    organism.population *= 0.8;
  }
}

export function die(organism, iteration) {
  organism.population = Math.max(organism.population * 0.95, 0);
  organism.time.push(iteration + 1);
  organism.populationOverTime.push(organism.population);
}
