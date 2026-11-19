// Leonida Trophy Guide: checklist, roadmap, spoiler mode and progress
// export/import for the 55 GTA VI trophies. Static, offline, no network
// at run time beyond its own data file (app/data/trophies.json).
import {
  KIND_LABELS,
  applyFilters,
  countByGrade,
  countByKind,
} from './filters.js';
import { ROADMAP_STAGES, stageTrophies, stageProgress } from './roadmap.js';

const PROGRESS_KEY = 'gta6-trophy-guide-progress-v1';
const SETTINGS_KEY = 'gta6-trophy-guide-settings-v1';

// A few trophies pre-checked only when ?demo=1 is in the URL, so a
// screenshot can show progress. Never the default, never saved.
const DEMO_EARNED = [2, 3, 8, 15, 42, 55];

const params = new URLSearchParams(window.location.search);
const demoMode = params.get('demo') === '1';

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

let earned = loadProgress();
if (demoMode) earned = new Set(DEMO_EARNED);
let settings = loadSettings();
if (params.get('spoiler') === '1') settings.spoiler = true;
if (params.get('spoiler') === '0') settings.spoiler = false;

let view = params.get('view') || 'checklist';
let guideId = Number(params.get('trophy') || NaN);
if (Number.isInteger(guideId) && trophies.some((t) => t.id === guideId)) {
  view = 'guide';
} else {
  guideId = null;
}
if (!['checklist', 'roadmap', 'guide'].includes(view)) view = 'checklist';
if (view === 'guide' && !guideId) view = 'checklist';

const filters = {
  kind: params.get('kind') || 'all',
  grade: params.get('grade') || 'all',
  query: '',
};
if (!(filters.kind in KIND_LABELS)) filters.kind = 'all';
if (!['all', 'platinum', 'gold', 'silver', 'bronze'].includes(filters.grade)) {
  filters.grade = 'all';
}

const $ = (id) => document.getElementById(id);
const listEl = $('trophyList');
const roadmapEl = $('roadmapStages');
const guideEl = $('guideDetail');

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '[]');
    const ids = new Set(trophies.map((t) => t.id));
    return new Set(saved.filter((id) => ids.has(id)));
  } catch {
    return new Set();
  }
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}');
    return { spoiler: saved.spoiler === true };
  } catch {
    return { spoiler: false };
  }
}

function saveProgress() {
  if (demoMode) return; // demo ticks are for show, never persisted
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// A story trophy's name, description and guide stay hidden while spoiler
// mode is on and the trophy is not yet earned.
function isSpoilerHidden(trophy) {
  return settings.spoiler && trophy.kind === 'story' && !earned.has(trophy.id);
}

function gradeBadge(trophy) {
  const badge = document.createElement('span');
  badge.className = `grade-badge grade-${trophy.grade}`;
  badge.textContent = trophy.grade;
  return badge;
}

function kindTag(trophy) {
  const tag = document.createElement('span');
  tag.className = 'kind-tag';
  tag.textContent = KIND_LABELS[trophy.kind] || trophy.kind;
  return tag;
}

function sourcesList(trophy) {
  const list = document.createElement('ul');
  list.className = 'sources';
  const heading = document.createElement('li');
  heading.textContent = 'Sources:';
  list.append(heading);
  for (const s of trophy.sources || []) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = s.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = s.name;
    item.append(link);
    list.append(item);
  }
  return list;
}

function guideBlock(trophy) {
  const block = document.createElement('div');
  block.className = 'trophy-guide';
  const text = document.createElement('p');
  text.textContent = trophy.guide;
  block.append(text, sourcesList(trophy));
  return block;
}

function toggleEarned(id, isEarned) {
  if (isEarned) earned.add(id);
  else earned.delete(id);
  saveProgress();
  renderAll();
}

function trophyCard(trophy) {
  const hidden = isSpoilerHidden(trophy);
  const card = document.createElement('article');
  card.className = 'trophy-card';
  if (earned.has(trophy.id)) card.classList.add('earned');
  if (trophy.missable) card.classList.add('missable-card');
  card.dataset.trophyId = String(trophy.id);

  const head = document.createElement('div');
  head.className = 'trophy-head';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(trophy.id);
  box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  box.addEventListener('change', () => toggleEarned(trophy.id, box.checked));
  const name = document.createElement('h3');
  name.className = 'trophy-name';
  if (hidden) {
    const placeholder = document.createElement('span');
    placeholder.className = 'spoiler-hidden-name';
    placeholder.textContent = 'Hidden story trophy — earn it to reveal';
    name.append(placeholder);
  } else {
    name.textContent = trophy.name;
  }
  head.append(box, name);
  card.append(head);

  const desc = document.createElement('p');
  desc.className = 'trophy-desc';
  desc.textContent = hidden
    ? 'Its name and description are hidden until you earn it.'
    : trophy.description;
  card.append(desc);

  const tags = document.createElement('div');
  tags.className = 'trophy-tags';
  tags.append(gradeBadge(trophy), kindTag(trophy));
  if (trophy.chapter) {
    const chapter = document.createElement('span');
    chapter.className = 'chapter-tag';
    chapter.textContent = trophy.chapter;
    tags.append(chapter);
  }
  if (trophy.target != null) {
    const target = document.createElement('span');
    target.className = 'target-tag';
    target.textContent = `Target: ${trophy.target.toLocaleString('en-US')}`;
    tags.append(target);
  }
  if (trophy.hidden) {
    const flag = document.createElement('span');
    flag.className = 'hidden-flag';
    flag.textContent = 'Hidden on PS5';
    tags.append(flag);
  }
  if (trophy.missable) {
    const flag = document.createElement('span');
    flag.className = 'missable-flag';
    flag.textContent = 'Missable';
    tags.append(flag);
  }
  card.append(tags);

  const actions = document.createElement('div');
  actions.className = 'trophy-actions';
  if (!hidden) {
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'guide-toggle';
    toggle.textContent = 'Show guide';
    const guide = guideBlock(trophy);
    guide.hidden = true;
    toggle.addEventListener('click', () => {
      guide.hidden = !guide.hidden;
      toggle.textContent = guide.hidden ? 'Show guide' : 'Hide guide';
    });
    actions.append(toggle);
    card.append(guide);
  }
  const open = document.createElement('button');
  open.type = 'button';
  open.className = 'open-guide';
  open.textContent = 'Open guide';
  open.addEventListener('click', () => openGuide(trophy.id));
  actions.append(open);
  card.append(actions);
  return card;
}

function renderProgress() {
  const total = trophies.length;
  const pct = Math.round((earned.size / total) * 100);
  $('progressText').textContent = `${earned.size} of ${total} earned`;
  $('progressPct').textContent = `${pct}%`;
  $('progressFill').style.width = `${pct}%`;
  const byGrade = countByGrade(trophies);
  const earnedByGrade = countByGrade(trophies.filter((t) => earned.has(t.id)));
  $('gradeChips').replaceChildren(
    ...['platinum', 'gold', 'silver', 'bronze'].map((grade) => {
      const chip = document.createElement('span');
      chip.textContent = `${grade}: ${earnedByGrade[grade]}/${byGrade[grade]}`;
      return chip;
    }),
  );
}

function renderKindFilters() {
  const counts = countByKind(trophies);
  const container = $('kindFilters');
  container.replaceChildren();
  for (const [kind, label] of Object.entries(KIND_LABELS)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `kind-btn${filters.kind === kind ? ' active' : ''}`;
    button.textContent = kind === 'all' ? `${label} (55)` : `${label} (${counts[kind]})`;
    button.setAttribute('aria-pressed', String(filters.kind === kind));
    button.addEventListener('click', () => {
      filters.kind = kind;
      renderKindFilters();
      renderChecklist();
    });
    container.append(button);
  }
}

function renderChecklist() {
  const shown = applyFilters(trophies, filters);
  listEl.replaceChildren(...shown.map(trophyCard));
  const earnedShown = shown.filter((t) => earned.has(t.id)).length;
  $('listCount').textContent =
    `Showing ${shown.length} of ${trophies.length} trophies` +
    (shown.length ? ` · ${earnedShown} earned in this view` : '');
  $('emptyNote').hidden = shown.length > 0;
  const note = $('controlsNote');
  if (filters.kind === 'online') {
    note.textContent = 'No online trophies: all 55 are single-player, so this filter is empty by design.';
  } else if (note.dataset.sticky !== 'true') {
    note.textContent = '';
  }
}

function renderRoadmap() {
  roadmapEl.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const section = document.createElement('section');
    section.className = 'roadmap-stage';
    const heading = document.createElement('h2');
    heading.textContent = stage.title;
    if (stage.trophyStage) {
      const progress = stageProgress(trophies, stage.trophyStage, earned);
      const count = document.createElement('span');
      count.className = 'stage-count';
      count.textContent = ` · ${progress.earned}/${progress.total} earned`;
      heading.append(count);
    }
    const blurb = document.createElement('p');
    blurb.textContent = stage.blurb;
    section.append(heading, blurb);
    if (stage.trophyStage) {
      const list = document.createElement('ul');
      list.className = 'roadmap-trophies';
      for (const trophy of stageTrophies(trophies, stage.trophyStage)) {
        const item = document.createElement('li');
        if (earned.has(trophy.id)) item.classList.add('earned');
        const box = document.createElement('input');
        box.type = 'checkbox';
        box.checked = earned.has(trophy.id);
        box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
        box.addEventListener('change', () => toggleEarned(trophy.id, box.checked));
        const label = document.createElement('span');
        label.textContent = isSpoilerHidden(trophy)
          ? 'Hidden story trophy — earn it to reveal'
          : `${trophy.name} — ${trophy.description}`;
        item.append(box, label);
        if (trophy.missable) {
          const flag = document.createElement('span');
          flag.className = 'missable-flag';
          flag.textContent = 'Missable';
          item.append(flag);
        }
        list.append(item);
      }
      section.append(list);
    }
    roadmapEl.append(section);
  }
}

function openGuide(id) {
  guideId = id;
  view = 'guide';
  renderGuide();
  showView('guide');
  window.scrollTo(0, 0);
}

function renderGuide() {
  const trophy = trophies.find((t) => t.id === guideId);
  guideEl.replaceChildren();
  if (!trophy) return;
  const hidden = isSpoilerHidden(trophy);
  const title = document.createElement('h2');
  title.textContent = hidden ? 'Hidden story trophy' : trophy.name;
  const desc = document.createElement('p');
  desc.className = 'trophy-desc';
  desc.textContent = hidden
    ? 'This story trophy is hidden until you earn it. Turn off “Hide story spoilers” above to see it, or tick it off in the checklist once you have earned it.'
    : trophy.description;
  const tags = document.createElement('div');
  tags.className = 'trophy-tags';
  tags.append(gradeBadge(trophy), kindTag(trophy));
  if (trophy.chapter) {
    const chapter = document.createElement('span');
    chapter.className = 'chapter-tag';
    chapter.textContent = trophy.chapter;
    tags.append(chapter);
  }
  if (trophy.missable) {
    const flag = document.createElement('span');
    flag.className = 'missable-flag';
    flag.textContent = 'Missable — see the guide';
    tags.append(flag);
  }
  guideEl.append(title, desc, tags);
  if (!hidden) guideEl.append(guideBlock(trophy));
  const nav = document.createElement('div');
  nav.className = 'guide-nav';
  const index = trophies.findIndex((t) => t.id === guideId);
  const prev = trophies[(index - 1 + trophies.length) % trophies.length];
  const next = trophies[(index + 1) % trophies.length];
  for (const [label, target] of [
    [`← ${prev.name}`, prev.id],
    [`${next.name} →`, next.id],
  ]) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quiet';
    button.textContent = label;
    button.addEventListener('click', () => openGuide(target));
    nav.append(button);
  }
  guideEl.append(nav);
}

function showView(nextView) {
  view = nextView;
  document.body.classList.toggle('view-guide', view === 'guide');
  $('checklistView').hidden = view !== 'checklist';
  $('roadmapView').hidden = view !== 'roadmap';
  $('guideView').hidden = view !== 'guide';
  $('tabChecklist').classList.toggle('active', view === 'checklist');
  $('tabRoadmap').classList.toggle('active', view === 'roadmap');
}

function renderAll() {
  renderProgress();
  renderChecklist();
  renderRoadmap();
  if (view === 'guide') renderGuide();
}

function flashNote(message) {
  const note = $('controlsNote');
  note.dataset.sticky = 'true';
  note.textContent = message;
  window.setTimeout(() => {
    note.dataset.sticky = 'false';
    if (filters.kind !== 'online') note.textContent = '';
  }, 4000);
}

function exportProgress() {
  const payload = {
    game: 'Grand Theft Auto VI',
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort((a, b) => a - b),
  };
  const link = document.createElement('a');
  link.href = URL.createObjectURL(
    new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }),
  );
  link.download = 'gta6-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(link.href);
  flashNote(`Exported ${earned.size} earned trophies to gta6-trophy-progress.json.`);
}

async function importProgress(file) {
  try {
    const parsed = JSON.parse(await file.text());
    const ids = Array.isArray(parsed) ? parsed : parsed.earned;
    if (!Array.isArray(ids)) throw new Error('no earned list');
    const known = new Set(trophies.map((t) => t.id));
    const imported = ids.filter((id) => known.has(id));
    if (imported.length === 0 && ids.length > 0) {
      throw new Error('no known trophy ids');
    }
    earned = new Set(imported);
    saveProgress();
    renderAll();
    flashNote(`Imported ${earned.size} earned trophies.`);
  } catch {
    flashNote('That file is not a trophy-progress export — nothing was changed.');
  }
}

$('tabChecklist').addEventListener('click', () => showView('checklist'));
$('tabRoadmap').addEventListener('click', () => showView('roadmap'));
$('guideBack').addEventListener('click', () => showView('checklist'));
$('searchBox').addEventListener('input', (event) => {
  filters.query = event.target.value;
  renderChecklist();
});
$('gradeFilter').value = filters.grade;
$('gradeFilter').addEventListener('change', (event) => {
  filters.grade = event.target.value;
  renderChecklist();
});
$('spoilerToggle').checked = settings.spoiler;
$('spoilerToggle').addEventListener('change', (event) => {
  settings.spoiler = event.target.checked;
  saveSettings();
  renderAll();
});
$('exportBtn').addEventListener('click', exportProgress);
$('importInput').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) await importProgress(file);
  event.target.value = '';
});
$('resetBtn').addEventListener('click', () => {
  if (!window.confirm('Clear all earned trophies? This cannot be undone.')) return;
  earned = new Set();
  saveProgress();
  renderAll();
  flashNote('Progress cleared.');
});

renderKindFilters();
renderAll();
showView(view);
if (view === 'guide') window.scrollTo(0, 0);
