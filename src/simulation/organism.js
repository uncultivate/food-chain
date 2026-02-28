/**
 * Organism simulation logic - ported from Python Streamlit app
 * Parameters are read from SIMULATION_CONFIG (defaults + per-trophic-level overrides)
 * grow(): Producers grow toward a configurable cap
 * eat(): Proportional consumption from prey with configurable starvation behavior
 * die(): Configurable natural population loss per tick
 */
import { SIMULATION_CONFIG } from './simulationConfig.js';

function resolveTrophicLevel(organism) {
  if (Number.isFinite(organism.trophicLevel)) return organism.trophicLevel;
  return !organism.preyIds || organism.preyIds.length === 0 ? 0 : 1;
}

function getLevelConfig(organism) {
  const level = resolveTrophicLevel(organism);
  const levelOverrides = SIMULATION_CONFIG.trophicLevels[level] ?? {};
  return {
    grow: {
      ...SIMULATION_CONFIG.defaults.grow,
      ...(levelOverrides.grow ?? {}),
    },
    eat: {
      ...SIMULATION_CONFIG.defaults.eat,
      ...(levelOverrides.eat ?? {}),
    },
    die: {
      ...SIMULATION_CONFIG.defaults.die,
      ...(levelOverrides.die ?? {}),
    },
  };
}

export function grow(organism) {
  const { grow: growConfig } = getLevelConfig(organism);
  if (!organism.preyIds || organism.preyIds.length === 0) {
    // Producer
    if (organism.population < growConfig.startThreshold) {
      organism.population =
        organism.population *
        (1 + growConfig.rate * ((growConfig.cap - organism.population) / growConfig.startThreshold));
    }
  }
}

export function eat(organism, organisms, organismMap) {
  const { eat: eatConfig } = getLevelConfig(organism);
  if (!organism.preyIds) return;
  const invaderMultiplier = organism.isInvader
    ? (SIMULATION_CONFIG.invader?.consumptionFactorMultiplier ?? 2)
    : 1;
  const effectiveConsumptionFactor = eatConfig.consumptionFactor * invaderMultiplier;

  const preyObjs = organism.preyIds
    .map((pid) => organismMap[pid])
    .filter((p) => p && organisms.includes(p));

  let sumPrey = preyObjs.reduce((s, p) => s + p.population, 0);

  if (sumPrey === 0) return;

  for (const p of preyObjs) {
    const eats = Math.min(
      (p.population / sumPrey) * effectiveConsumptionFactor * organism.population,
      p.population / eatConfig.preyLossCapDivisor
    );
    organism.population += eats;
    p.population -= eats;
  }

  // Starve if insufficient food
  if (sumPrey < eatConfig.starvationNeedPerPredator * organism.population) {
    organism.population *= eatConfig.starvationPenaltyMultiplier;
  }
}

export function die(organism, iteration) {
  const { die: dieConfig } = getLevelConfig(organism);
  organism.population = Math.max(organism.population * dieConfig.naturalDeathMultiplier, 0);
  organism.time.push(iteration + 1);
  organism.populationOverTime.push(organism.population);
}
