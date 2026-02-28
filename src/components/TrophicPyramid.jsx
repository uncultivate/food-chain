import { useState, useMemo } from 'react';
import { useSimulationStore } from '../store/simulationStore';
import { ECOSYSTEMS } from '../simulation/ecosystems';
import styles from './TrophicPyramid.module.css';

const TIER_LABELS = [
  { name: 'Producers', desc: 'Make food from sunlight' },
  { name: 'Primary Consumers', desc: 'Eat producers (herbivores)' },
  { name: 'Secondary Consumers', desc: 'Eat primary consumers' },
  { name: 'Tertiary Consumers', desc: 'Eat secondary consumers' },
  { name: 'Apex Predators', desc: 'Top of the chain—no natural predators' },
];

function getPredators(orgId, organisms) {
  return organisms.filter((o) => o.preyIds?.includes(orgId)).map((o) => o.name);
}

function getTrophicLevel(org, defMap, visited = new Set()) {
  if (visited.has(org.id)) return 0;
  visited.add(org.id);
  if (!org.preyIds?.length) return 0;
  const preyLevels = org.preyIds
    .map((pid) => defMap[pid])
    .filter(Boolean)
    .map((p) => getTrophicLevel(p, defMap, visited));
  return 1 + Math.max(0, ...preyLevels);
}

export function TrophicPyramid() {
  const [imgErrors, setImgErrors] = useState({});
  const [selectedCard, setSelectedCard] = useState(null);
  const { ecosystem, selectedSpecies, organismMap, simulationState } = useSimulationStore();
  const getPopulationTrends = useSimulationStore((s) => s.getPopulationTrends);
  const trends = getPopulationTrends();

  const { tiers, defMap } = useMemo(() => {
    const eco = ECOSYSTEMS[ecosystem];
    const defMap = Object.fromEntries(eco.organisms.map((o) => [o.id, o]));
    const selected = eco.organisms.filter((o) => selectedSpecies.includes(o.id));

    // Add invasive species if present in simulation
    const invader = simulationState?.invader?.organism;
    if (invader && !defMap[invader.id]) {
      defMap[invader.id] = invader;
    }

    const byLevel = {};
    for (const org of selected) {
      // Apex predators always go to level 4 (Apex Predators tier)
      const level = org.apexPredator ? 4 : getTrophicLevel(org, defMap);
      if (!byLevel[level]) byLevel[level] = [];
      byLevel[level].push(org);
    }

    // Add invader to appropriate tier if present
    if (invader) {
      const invaderLevel = invader.apexPredator ? 4 : getTrophicLevel(invader, defMap);
      if (!byLevel[invaderLevel]) byLevel[invaderLevel] = [];
      byLevel[invaderLevel].push({ ...invader, isInvader: true });
    }

    const tiers = Object.entries(byLevel)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([level, orgs]) => ({ level: Number(level), orgs }));
    return { tiers, defMap };
  }, [ecosystem, selectedSpecies, simulationState]);

  const handleImgError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  if (selectedSpecies.length === 0) return null;

  return (
    <div className={styles.pyramid}>
      <div className={styles.tiers}>
        {tiers.map(({ level, orgs }, tierIdx) => {
          const tierInfo = TIER_LABELS[level] ?? { name: `Level ${level}`, desc: '' };
          return (
            <div key={level} className={styles.tier}>
              <div className={styles.tierHeader}>
                <div className={styles.tierLabel}>{tierInfo.name}</div>
                {tierInfo.desc && (
                  <div className={styles.tierDesc}>{tierInfo.desc}</div>
                )}
              </div>
              <div className={styles.tierCards}>
                {orgs.map((org) => {
                  const liveOrg = organismMap[org.id];
                  const pop = liveOrg?.population ?? org.population ?? 0;
                  const showImg = !imgErrors[org.id] && org.imageUrl;
                  const preyNames = org.preyIds
                    ?.map((pid) => defMap[pid]?.name)
                    .filter(Boolean) ?? [];
                  const predatorNames = getPredators(org.id, Object.values(defMap));
                  const trend = trends[org.id];
                  const isSelected = selectedCard === org.id;
                  return (
                    <div
                      key={org.id}
                      className={`${styles.card} ${isSelected ? styles.cardSelected : ''} ${org.isInvader ? styles.invaderCard : ''}`}
                      data-trend={trend}
                      onClick={() => setSelectedCard(isSelected ? null : org.id)}
                      onKeyDown={(e) => e.key === 'Enter' && setSelectedCard(isSelected ? null : org.id)}
                      role="button"
                      tabIndex={0}
                    >
                      {org.isInvader && <div className={styles.invaderBadge}>INVADER</div>}
                      <div className={styles.cardImage}>
                        {showImg ? (
                          <img
                            src={org.imageUrl}
                            alt={org.name}
                            onError={() => handleImgError(org.id)}
                          />
                        ) : (
                          <div className={styles.cardFallback}>
                            {org.name.slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <div className={styles.cardName}>{org.name}</div>
                      <div className={styles.cardPop}>
                        pop: {pop.toFixed(1)}
                        {trend === 'up' && <span className={styles.trendUp}>↑</span>}
                        {trend === 'down' && <span className={styles.trendDown}>↓</span>}
                        {trend === 'stable' && <span className={styles.trendStable}>→</span>}
                      </div>
                      {isSelected && (preyNames.length > 0 || predatorNames.length > 0) && (
                        <div className={styles.cardTooltip}>
                          {preyNames.length > 0 && (
                            <div>Eats: {preyNames.join(', ')}</div>
                          )}
                          {predatorNames.length > 0 && (
                            <div>Eaten by: {predatorNames.join(', ')}</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {tierIdx < tiers.length - 1 && (
                <div className={styles.arrow}>↑</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
