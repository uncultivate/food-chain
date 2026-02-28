export const SIMULATION_CONFIG = {
  invader: {
    consumptionFactorMultiplier: 2,
  },
  defaults: {
    grow: {
      startThreshold: 100,
      cap: 110,
      rate: 0.5,
    },
    eat: {
      consumptionFactor: 0.3,
      preyLossCapDivisor: 5,
      starvationNeedPerPredator: 3,
      starvationPenaltyMultiplier: 0.8,
    },
    die: {
      naturalDeathMultiplier: 0.95,
    },
  },
  trophicLevels: {
    0: {
      grow: {
        rate: 0.6,
      },
    },
    1: {
      eat: {
        consumptionFactor: 0.4,
      },
    },
    2: {
      eat: {
        consumptionFactor: 0.35,
      },
    },
    3: {
      eat: {
        consumptionFactor: 0.3,
      },
    },
    4: {
      eat: {
        consumptionFactor: 0.25,
      },
    },
  },
};
