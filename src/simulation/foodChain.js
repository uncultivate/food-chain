/**
 * Food chain simulation - runs tick-by-tick
 * Ported from Python Streamlit app
 */

import { grow, eat, die } from './organism.js';

function deepCloneOrganism(def) {
  return {
    ...def,
    population: def.population,
    populationOverTime: [],
    time: [],
  };
}

/**
 * Run one tick of the simulation
 * @param {Object} state - { organisms, organismMap, selectedIds, invader }
 * @param {number} tick - current tick (0-indexed)
 * @param {number} totalTicks - total ticks to run
 * @returns updated state (mutated)
 */
export function simulateOneTick(state, tick, totalTicks) {
  const { organisms, organismMap, invader } = state;
  const invaderEntryTick = Math.floor(0.5 * totalTicks);

  // Add invader at 50% mark (population was 0 until now)
  if (invader?.organism && tick === invaderEntryTick) {
    const invaderOrg = deepCloneOrganism(invader.organism);
    invaderOrg.population = invader.startPopulation ?? 5;
    invaderOrg.isInvader = true;
    organisms.push(invaderOrg);
    organismMap[invaderOrg.id] = invaderOrg;
  }

  for (const org of organisms) {
    grow(org);
  }
  for (const org of organisms) {
    eat(org, organisms, organismMap);
  }
  for (const org of organisms) {
    die(org, tick);
  }

  return state;
}

/**
 * Initialize simulation state from ecosystem config
 * @param {Object} ecosystem - from ECOSYSTEMS
 * @param {string[]} selectedIds - organism ids to include
 * @param {Object} invaderConfig - { organismId, startPopulation } or null
 */
export function initSimulation(ecosystem, selectedIds, invaderConfig) {
  const organismDefs = ecosystem.organisms;
  const organismMap = {};
  const organisms = [];

  for (const id of selectedIds) {
    const def = organismDefs.find((o) => o.id === id);
    if (!def) continue;
    // Don't add invader yet if it's in selectedIds - it enters later
    if (invaderConfig && invaderConfig.organismId === id) continue;

    const org = deepCloneOrganism(def);
    organisms.push(org);
    organismMap[id] = org;
  }

  let invader = null;
  if (invaderConfig?.organismId) {
    const invDef = organismDefs.find((o) => o.id === invaderConfig.organismId);
    if (invDef) {
      invader = {
        organism: { ...invDef, isInvader: true },
        startPopulation: invaderConfig.startPopulation ?? 5,
      };
    }
  }

  return { organisms, organismMap, selectedIds, invader };
}
