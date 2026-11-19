// The road to the platinum, built from the official descriptions: story
// chapters in order, then named story missions, the finale, stranger
// finales, collectibles, activities, robbery and money, the 100% cleanup
// and the platinum itself. Each stage names the trophies it holds by the
// roadmap_stage key in app/data/trophies.json.

// Stages in the order a player should work through them.
export const ROADMAP_STAGES = [
  {
    id: 'prep',
    title: 'Before you start',
    blurb:
      'GTA VI has no mission replay and no New Game Plus, and 15 manual save slots plus one autosave. Keep one save at the start of every chapter and one untouched save from just before the final mission. Never use cheats on your trophy save — they switch off trophies and saving. One trophy can be missed (see Chapter 1 below); everything else stays available after the credits.',
    trophyStage: null,
  },
  {
    id: 'chapter-1',
    title: 'Chapter 1',
    blurb:
      'Play the opening mission Gone Fishing, then the chapter through. Do Lucia\u2019s balcony meditation while you are here — it is the one missable moment in the whole list.',
    trophyStage: 'chapter-1',
  },
  {
    id: 'chapter-2',
    title: 'Chapter 2',
    blurb:
      'Character switching between Jason and Lucia opens up here, and with it most free-roam trophies. The Vice City Real Estate app unlocks after the mission Daily Driver.',
    trophyStage: 'chapter-2',
  },
  {
    id: 'chapter-3',
    title: 'Chapter 3',
    blurb:
      'The mission Yasmani\u2019s Jewelry Jobs hands you the Snap Gun for jewelry robberies. Race Against Yago in the street-racing strand is time-sensitive — save first, then race.',
    trophyStage: 'chapter-3',
  },
  {
    id: 'chapter-4',
    title: 'Chapter 4',
    blurb:
      'Near the end of this chapter the optional mission That\u2019s Where The Money Is unlocks bank vault robberies.',
    trophyStage: 'chapter-4',
  },
  {
    id: 'story-missions',
    title: 'Named story missions',
    blurb:
      'Six trophies are named for story missions — Breakfast Run, The Cartel Heist, Child\u2019s Play, Headliners, VCIA Takedown and Operation Savage Glory. They pop as you play the story, in mission order.',
    trophyStage: 'story-missions',
  },
  {
    id: 'finale',
    title: 'The final mission',
    blurb:
      'Finish the final mission for the gold trophy. Keep your pre-finale save untouched. After the credits, everything outside the story stays open.',
    trophyStage: 'finale',
  },
  {
    id: 'strangers',
    title: 'Stranger finales',
    blurb:
      'Finish the stranger strands: Andy, Kenton, Billy, Randy and Tyrone each have a final mission, and 8 other strands together earn Strangers & Freaks. Andy\u2019s, Billy\u2019s and Tyrone\u2019s strands do not count toward that 8 — each has its own trophy.',
    trophyStage: 'strangers',
  },
  {
    id: 'collectibles',
    title: 'Collectibles',
    blurb:
      'Cards (3 sets), WAiNK locations (100), vehicles discovered (100) and all 52 areas of Leonida. Fold these into your exploration: tag a WAiNK location in each new area and scan the traffic you meet.',
    trophyStage: 'collectibles',
  },
  {
    id: 'activities',
    title: 'Activities',
    blurb:
      'Stunts (250), shooting-range golds (42), drone races (14 locations), races (20 wins), challenges (50), fishing, arcade, hunting, meditation, gym, combat and the odd one-offs. Most complete by playing; the ranges and the stunts are the long grinds.',
    trophyStage: 'activities',
  },
  {
    id: 'robbery-and-money',
    title: 'Robbery and money',
    blurb:
      'Shops, jewelry stores, armored trucks, bank vaults (5) and one illegal operation per gang (9), plus laundering $250,000 of Marked Bills, spending $100,000 in shops, buying all 8 garages and registering 10 vehicles. Vaults need a partner along.',
    trophyStage: 'robbery-and-money',
  },
  {
    id: 'cleanup',
    title: 'Cleanup: 100% completion',
    blurb:
      'Open the 100% checklist under Progress, then Stats, then 100% Completion (it appears after the story) and work down whatever is left: 300 stunts, 70 of 80 challenges, 200 of 277 vehicles, all 8 vaults and all 39 illegal operations. Nothing on it is missable.',
    trophyStage: 'cleanup',
  },
  {
    id: 'platinum',
    title: 'The platinum',
    blurb:
      'Vice Got a Price! pops the moment the other 54 are yours. Around 200 hours in total by PowerPyx\u2019s estimate — long, not hard.',
    trophyStage: 'platinum',
  },
];

// The trophies that belong to one roadmap stage, in list order.
export function stageTrophies(trophies, stageId) {
  return trophies.filter((t) => t.roadmap_stage === stageId);
}

// How far along one stage is, as earned and total counts.
export function stageProgress(trophies, stageId, earnedIds) {
  const stage = stageTrophies(trophies, stageId);
  const earned = stage.filter((t) => earnedIds.has(t.id)).length;
  return { earned, total: stage.length };
}
