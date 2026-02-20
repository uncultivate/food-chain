import { create } from 'zustand';
import { ECOSYSTEMS } from '../simulation/ecosystems.js';
import { initSimulation, simulateOneTick } from '../simulation/foodChain.js';

export const useSimulationStore = create((set, get) => ({
  ecosystem: 'ocean',
  selectedSpecies: ECOSYSTEMS.ocean.defaultSpecies,
  maxTicks: 50,
  currentTick: 0,
  isPlaying: false,
  speed: 1,
  invaderEnabled: false,
  invaderSpecies: ECOSYSTEMS.ocean.organisms[5]?.id ?? null,
  invaderPopulation: 5,
  populationHistory: [],
  organisms: [],
  organismMap: {},
  simulationState: null,

  setEcosystem: (ecosystem) => {
    const eco = ECOSYSTEMS[ecosystem];
    set({
      ecosystem,
      selectedSpecies: eco.defaultSpecies,
      invaderSpecies: eco.organisms[5]?.id ?? null,
    });
  },

  setSelectedSpecies: (selectedSpecies) => set({ selectedSpecies }),
  setMaxTicks: (maxTicks) => set({ maxTicks }),
  setSpeed: (speed) => set({ speed }),
  setInvaderEnabled: (invaderEnabled) => set({ invaderEnabled }),
  setInvaderSpecies: (invaderSpecies) => set({ invaderSpecies }),
  setInvaderPopulation: (invaderPopulation) => set({ invaderPopulation }),

  reset: () => {
    const { ecosystem, selectedSpecies, maxTicks, invaderEnabled, invaderSpecies, invaderPopulation } = get();
    const eco = ECOSYSTEMS[ecosystem];
    const invaderConfig = invaderEnabled && invaderSpecies
      ? {
          organismId: invaderSpecies,
          startPopulation: invaderPopulation ?? 5,
        }
      : null;

    const simState = initSimulation(eco, selectedSpecies, invaderConfig);
    set({
      currentTick: 0,
      isPlaying: false,
      populationHistory: [],
      organisms: simState.organisms,
      organismMap: simState.organismMap,
      simulationState: simState,
    });
  },

  runOneTick: () => {
    const { simulationState, currentTick, maxTicks, populationHistory } = get();
    if (!simulationState || currentTick >= maxTicks) {
      set({ isPlaying: false });
      return;
    }

    try {
      simulateOneTick(simulationState, currentTick, maxTicks);
    } catch (err) {
      console.error('[FoodChain] simulateOneTick error:', err);
      set({ isPlaying: false });
      return;
    }

    const newHistory = simulationState.organisms.map((org) => ({
      id: org.id,
      name: org.name,
      time: org.time[org.time.length - 1],
      population: org.populationOverTime[org.populationOverTime.length - 1],
    }));

    set({
      currentTick: currentTick + 1,
      organisms: simulationState.organisms,
      organismMap: simulationState.organismMap,
      populationHistory: [...populationHistory, newHistory],
    });
  },

  play: () => {
    get().reset();
    set({ isPlaying: true });
  },

  pause: () => set({ isPlaying: false }),

  getCurrentPopulations: () => {
    const { organisms } = get();
    return organisms.map((o) => ({ id: o.id, name: o.name, population: o.population }));
  },

  getPopulationTrends: () => {
    const { populationHistory } = get();
    if (populationHistory.length < 2) return {};
    const prev = populationHistory[populationHistory.length - 2];
    const curr = populationHistory[populationHistory.length - 1];
    const prevMap = Object.fromEntries(prev.map((p) => [p.id, p.population]));
    const currMap = Object.fromEntries(curr.map((p) => [p.id, p.population]));
    const trends = {};
    for (const id of Object.keys(currMap)) {
      const p = prevMap[id] ?? currMap[id];
      const c = currMap[id];
      if (c > p) trends[id] = 'up';
      else if (c < p) trends[id] = 'down';
      else trends[id] = 'stable';
    }
    return trends;
  },

  getChartData: () => {
    const { organisms, simulationState, maxTicks, currentTick } = get();
    const invader = simulationState?.invader;
    const invaderId = invader?.organism?.id;
    const invaderEntryTick = Math.floor(0.5 * maxTicks);
    const invaderOrg = invaderId ? organisms.find((o) => o.id === invaderId) : null;
    const displayOrgs = [...organisms];
    if (invader?.organism && invaderId && !invaderOrg) {
      displayOrgs.push({ id: invaderId, name: invader.organism.name, populationOverTime: [], time: [] });
    }
    if (displayOrgs.length === 0) return [];
    const maxTime = currentTick;
    const data = [];
    for (let t = 0; t < maxTime; t++) {
      const point = { time: t + 1 };
      for (const org of displayOrgs) {
        if (invaderId && org.id === invaderId) {
          const idx = t - invaderEntryTick;
          point[org.name] = t < invaderEntryTick ? 0 : (invaderOrg?.populationOverTime?.[idx] ?? 0);
        } else {
          point[org.name] = org.populationOverTime?.[t] ?? 0;
        }
      }
      data.push(point);
    }
    return data;
  },
}));
