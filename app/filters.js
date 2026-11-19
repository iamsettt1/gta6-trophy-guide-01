// Filter helpers for the GTA VI trophy list: pure functions, no DOM here.
// A trophy's kind is one of story, missable, collectibles, activities or
// online; the official list has no online trophies, so that filter is
// honestly empty and says so in the app.

export const KIND_LABELS = {
  all: 'All kinds',
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  online: 'Online',
};

export const GRADE_LABELS = {
  all: 'All grades',
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
};

// Keep only the trophies of one kind ('all' keeps everything).
export function filterByKind(trophies, kind) {
  if (!kind || kind === 'all') return trophies;
  return trophies.filter((t) => t.kind === kind);
}

// Keep only the trophies of one grade ('all' keeps everything).
export function filterByGrade(trophies, grade) {
  if (!grade || grade === 'all') return trophies;
  return trophies.filter((t) => t.grade === grade);
}

// Keep the trophies whose name, description or guide mentions the query.
export function searchTrophies(trophies, query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return trophies;
  return trophies.filter((t) =>
    [t.name, t.description, t.guide, t.chapter || '']
      .join(' ')
      .toLowerCase()
      .includes(q),
  );
}

// Apply kind, grade and text search together, in that order.
export function applyFilters(trophies, { kind, grade, query }) {
  return searchTrophies(
    filterByGrade(filterByKind(trophies, kind), grade),
    query,
  );
}

// Count how many trophies of each kind (and grade) a list holds.
export function countByKind(trophies) {
  const counts = { story: 0, missable: 0, collectibles: 0, activities: 0, online: 0 };
  for (const t of trophies) {
    if (t.kind in counts) counts[t.kind] += 1;
  }
  return counts;
}

export function countByGrade(trophies) {
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) {
    if (t.grade in counts) counts[t.grade] += 1;
  }
  return counts;
}

// The one missable trophy, by the official descriptions and the guides:
// Positive Mental Attitude, whose Chapter 1 meditation can be missed.
export function missableTrophies(trophies) {
  return trophies.filter((t) => t.missable === true);
}
