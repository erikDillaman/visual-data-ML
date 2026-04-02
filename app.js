// Generic framework — reads all dataset config from data.js (DATASET_META, FEATURES, ICONS, ITEMS)

// ══════════════════════════════════════════════════
//  RENDERING HELPERS
// ══════════════════════════════════════════════════

function getIcon(id) {
  return (typeof ICONS !== 'undefined' && ICONS[id])
    ? ICONS[id]
    : (typeof TEST_ICONS !== 'undefined' && TEST_ICONS[id])
      ? TEST_ICONS[id]
      : `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="30" fill="#333"/></svg>`;
}

// Render a feature value as an HTML pill/badge
function renderFeatureValue(feature, item) {
  const val = item[feature.key];
  if (feature.type === 'boolean') {
    return val
      ? `<span class="${feature.trueClass}">${feature.trueLabel}</span>`
      : `<span class="${feature.falseClass}">${feature.falseLabel}</span>`;
  }
  if (feature.type === 'number') {
    return `<span class="pill ${feature.pillClass || 'pill-value'}">${feature.prefix || ''}${val}</span>`;
  }
  // enum / default
  const cls = (feature.pillClasses && feature.pillClasses[val]) || 'pill-custom';
  return `<span class="pill ${cls}">${val}</span>`;
}

function customPill(val) {
  return `<span class="pill pill-custom">${val}</span>`;
}

// Reads cardBorderColors from whichever FEATURE has it defined
function getCardBorderColor(item) {
  for (const f of FEATURES) {
    if (f.cardBorderColors) return f.cardBorderColors[item[f.key]] || '#aaaaaa';
  }
  return '#aaaaaa';
}

// Reads cardGlowColors from whichever FEATURE has it defined
function getCardGlowColor(item) {
  for (const f of FEATURES) {
    if (f.cardGlowColors) return f.cardGlowColors[item[f.key]] || 'rgba(200,200,220,0.06)';
  }
  return 'rgba(200,200,220,0.06)';
}

// ══════════════════════════════════════════════════
//  CUSTOM FEATURE SYSTEM
// ══════════════════════════════════════════════════
let customFeatures = []; // { name, key, categories, values:{itemId:cat} }
let currentDatasetId = null;
let exploreMode = false;
let exploreGroundTruth = {};
let _userStories = [];
let _readStoryIds = new Set();
const expandedCards = new Set();
let modalFeatureName = '';
let modalCategories  = [];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
}

// ── GENERIC FALLBACKS (dataset files override these by redefining them) ──
function getPresetsForFeature(name) {
  const n = name.toLowerCase();
  if (n.includes('level') || n.includes('tier') || n.includes('rank') || n.includes('grade')) {
    return [['Low','Medium','High'], ['Tier 1','Tier 2','Tier 3','Tier 4']];
  }
  if (n.includes('type') || n.includes('class') || n.includes('kind') || n.includes('category')) {
    return [['Type A','Type B','Type C','Type D'], ['Class 1','Class 2','Class 3']];
  }
  if (n.includes('color') || n.includes('colour')) {
    return [['Red','Blue','Green','Yellow'], ['Dark','Light','Neutral']];
  }
  if (n.includes('size') || n.includes('scale')) {
    return [['Small','Medium','Large'], ['Tiny','Small','Medium','Large','Huge']];
  }
  return [['Type A','Type B','Type C','Type D'], ['Low','Medium','High']];
}

function inferCategory(item, _featureName, categories) {
  return categories[item.id % categories.length];
}

// ── MODAL CONTROLS ──
function openAddFeature() {
  modalFeatureName = '';
  document.getElementById('feature-name-input').value = '';
  document.querySelectorAll('#feature-chips .chip').forEach(c => c.classList.remove('selected'));
  document.getElementById('modal-step1').classList.remove('hidden-step');
  document.getElementById('modal-step2').classList.add('hidden-step');
  document.getElementById('feature-modal').classList.remove('hidden');
}
function closeFeatureModal() {
  document.getElementById('feature-modal').classList.add('hidden');
}
function selectFeatureSuggestion(name, btn) {
  document.querySelectorAll('#feature-chips .chip').forEach(c => c.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('feature-name-input').value = name;
  modalFeatureName = name;
}
function proceedToCategories() {
  const val = document.getElementById('feature-name-input').value.trim();
  if (!val) { alert('Please enter or pick a feature name.'); return; }
  modalFeatureName = val;
  const key = slugify(val);
  if (customFeatures.some(cf => cf.key === key) || FEATURES.some(f => f.key === key)) {
    alert(`"${val}" already exists as a feature!`); return;
  }
  const presets = getPresetsForFeature(val);
  const presetsDiv = document.getElementById('category-presets');
  presetsDiv.innerHTML = presets.map((cats, i) => `
    <div class="preset-option${i===0?' selected':''}" id="preset-opt-${i}" onclick="selectPreset(${i})">
      <strong>${i===0 ? '⭐ Recommended' : `Option ${i+1}`}</strong>
      <div class="cats-preview">${cats.map(c=>`<span class="cat-chip">${c}</span>`).join('')}</div>
    </div>`).join('') + `
    <div class="preset-option" id="preset-opt-custom" onclick="selectCustomPreset()">
      <strong>✏ Create Your Own</strong>
      <div id="custom-cats-placeholder" class="cats-preview" style="color:rgba(192,132,252,0.5);font-size:0.7rem;font-style:italic">Click to define your own categories</div>
      <div id="custom-cats-area" class="custom-cats-area" style="display:none">
        <div class="cats-preview" id="custom-cat-tags"></div>
        <div class="custom-cat-input-row" onclick="event.stopPropagation()">
          <input class="custom-cat-input" id="custom-cat-input" placeholder="Add a category…" onkeydown="customCatKeydown(event)"/>
          <button class="btn-add-cat" onclick="addCustomCat()">+ Add</button>
        </div>
      </div>
    </div>`;
  modalCategories = [...presets[0]];
  document.getElementById('modal-feature-name-display').textContent = `"${val}"`;
  document.getElementById('modal-step1').classList.add('hidden-step');
  document.getElementById('modal-step2').classList.remove('hidden-step');
}
function selectPreset(idx) {
  document.querySelectorAll('.preset-option').forEach(el => el.classList.remove('selected'));
  document.getElementById(`preset-opt-${idx}`).classList.add('selected');
  modalCategories = [...getPresetsForFeature(modalFeatureName)[idx]];
}
function selectCustomPreset() {
  document.querySelectorAll('.preset-option').forEach(el => el.classList.remove('selected'));
  document.getElementById('preset-opt-custom').classList.add('selected');
  document.getElementById('custom-cats-placeholder').style.display = 'none';
  document.getElementById('custom-cats-area').style.display = 'block';
  modalCategories = getCustomCats();
  document.getElementById('custom-cat-input').focus();
}
function getCustomCats() {
  return Array.from(document.querySelectorAll('#custom-cat-tags .cat-tag')).map(t => t.dataset.val);
}
function addCustomCat() {
  const input = document.getElementById('custom-cat-input');
  const val = input.value.trim();
  if (!val) return;
  const tag = document.createElement('span');
  tag.className = 'cat-chip cat-tag';
  tag.dataset.val = val;
  tag.innerHTML = `${val} <button class="remove-cat" onclick="removeCustomCat(this);event.stopPropagation()" title="Remove">×</button>`;
  document.getElementById('custom-cat-tags').appendChild(tag);
  input.value = '';
  modalCategories = getCustomCats();
}
function removeCustomCat(btn) {
  btn.closest('.cat-tag').remove();
  modalCategories = getCustomCats();
}
function customCatKeydown(e) {
  if (e.key === 'Enter') { e.preventDefault(); addCustomCat(); }
}
function backToStep1() {
  document.getElementById('modal-step1').classList.remove('hidden-step');
  document.getElementById('modal-step2').classList.add('hidden-step');
}
function confirmAndInfer() {
  if (!modalCategories.length) { alert('Please add at least one category.'); return; }
  const key = slugify(modalFeatureName);
  const values = {};
  ITEMS.forEach(item => { values[item.id] = inferCategory(item, modalFeatureName, modalCategories); });
  customFeatures.push({ name: modalFeatureName, key, categories: modalCategories, values });
  closeFeatureModal();
  buildCards();
  buildTable();
}

// ── EDIT A FEATURE VALUE IN-PLACE ──
// targetEl: the element to replace (passed directly from table pills; card view uses the fv- id span)
function startEdit(evt, itemId, featureKey, currentVal, targetEl) {
  evt.stopPropagation();
  const span = targetEl || document.getElementById(`fv-${itemId}-${featureKey}`);
  if (!span) return;

  const feature = FEATURES.find(f => f.key === featureKey);

  if (feature && feature.type === 'number') {
    const inp = document.createElement('input');
    inp.type = 'number'; inp.min = 0; inp.max = 9999;
    inp.value = currentVal;
    inp.className = 'feat-select';
    inp.style.width = '64px';
    const doSave = () => {
      const newVal = Math.max(0, parseInt(inp.value) || 0);
      const item = ITEMS.find(i => i.id === itemId);
      if (item) item[featureKey] = newVal;
      buildCards();
      buildTable();
    };
    inp.onblur     = doSave;
    inp.onkeydown  = e => { if (e.key === 'Enter') inp.blur(); e.stopPropagation(); };
    inp.onclick    = e => e.stopPropagation();
    span.replaceWith(inp);
    inp.focus(); inp.select();
    return;
  }

  let options;
  if (feature) {
    options = feature.type === 'boolean' ? ['Yes', 'No'] : (feature.options || []);
  } else {
    options = (customFeatures.find(cf => cf.key === featureKey) || {}).categories || [];
  }
  if (!options.length) return;

  const sel = document.createElement('select');
  sel.className = 'feat-select';
  options.forEach(opt => {
    const o = document.createElement('option');
    o.value = opt; o.textContent = opt; o.selected = (opt === currentVal);
    sel.appendChild(o);
  });
  const doSave = () => {
    const newVal = sel.value;
    const item = ITEMS.find(i => i.id === itemId);
    if (item && feature) {
      if (feature.type === 'boolean') item[featureKey] = (newVal === 'Yes');
      else item[featureKey] = newVal;
    } else {
      const cf = customFeatures.find(c => c.key === featureKey);
      if (cf) cf.values[itemId] = newVal;
    }
    buildCards();
    buildTable();
  };
  sel.onchange = doSave;
  sel.onblur   = doSave;
  sel.onclick  = e => e.stopPropagation();
  span.replaceWith(sel);
  sel.focus();
}

// ── CARD TOGGLE ──
function toggleCard(evt, cardEl) {
  if (evt.target.closest('.card-pill-edit') || evt.target.tagName === 'SELECT') return;
  const id = Number(cardEl.dataset.itemId);
  cardEl.classList.toggle('expanded');
  if (cardEl.classList.contains('expanded')) expandedCards.add(id);
  else expandedCards.delete(id);
}

function updateSectionLabel() {
  const lbl = document.getElementById('section-label');
  if (!lbl) return;
  if (exploreMode) {
    const items = _visibleItems();
    const wrong = items.filter(function(item) {
      const clf = getItemClassification(item);
      return clf && !clf.correct;
    }).length;
    lbl.innerHTML = wrong > 0
      ? `<span style="color:#f87171">✗ ${wrong} misclassified</span> &bull; <span style="color:#4ade80">✓ ${items.length - wrong} correct</span> &bull; Click a card to expand`
      : `<span style="color:#4ade80">✓ All ${items.length} correctly classified</span> &bull; Click a card to expand`;
  } else {
    lbl.textContent = `Click a card to expand`;
  }
}

// In explore mode, only show items that have a ground-truth classification entry.
function _visibleItems() {
  if (!exploreMode) return ITEMS;
  return ITEMS.filter(function(item) {
    return Object.prototype.hasOwnProperty.call(exploreGroundTruth, String(item.id));
  });
}

// ══════════════════════════════════════════════════
//  BUILD CARDS
// ══════════════════════════════════════════════════
function buildCards() {
  const grid = document.getElementById('card-grid');
  grid.innerHTML = _visibleItems().map(item => {
    const borderColor = getCardBorderColor(item);
    const glowColor   = getCardGlowColor(item);

    // Classification badge (Explore Mode only)
    let clfBadge = '';
    if (exploreMode) {
      const clf = getItemClassification(item);
      if (clf !== null) {
        if (clf.correct) {
          clfBadge = `<span class="card-clf-badge clf-correct" title="Correctly classified"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="rgba(74,222,128,0.18)" stroke="#4ade80" stroke-width="1.3"/><path d="M5 8l2.5 2.5L11 5.5" stroke="#4ade80" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
        } else {
          clfBadge = `<span class="card-clf-badge clf-wrong" title="Misclassified by the model"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="rgba(248,113,113,0.18)" stroke="#f87171" stroke-width="1.3"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#f87171" stroke-width="1.6" stroke-linecap="round"/></svg></span>`;
        }
      }
    }

    const featureRows = FEATURES.map(f => {
      const editVal = f.type === 'boolean' ? (item[f.key] ? 'Yes' : 'No') : item[f.key];
      return `<div class="feature-row">
        <span class="feature-label">${f.label}</span>
        <span id="fv-${item.id}-${f.key}" class="card-pill-edit" onclick="startEdit(event,${item.id},'${f.key}','${String(editVal).replace(/'/g,"\\'")}')">
          ${renderFeatureValue(f, item)}
        </span>
      </div>`;
    }).join('');

    const customRows = customFeatures.map(cf => {
      const val = cf.values[item.id] || cf.categories[0];
      return `<div class="feature-row">
        <span class="feature-label">${cf.name}</span>
        <span id="fv-${item.id}-${cf.key}" class="card-pill-edit" onclick="startEdit(event,${item.id},'${cf.key}','${val.replace(/'/g,"\\'")}')">
          ${customPill(val)}
        </span>
      </div>`;
    }).join('');

    const subtitleKey = (typeof DATASET_META !== 'undefined' && DATASET_META.subtitleKey) || 'cat';

    return `
<div class="item-card" data-item-id="${item.id}" style="--rarity-color:${borderColor}; --glow-color:${glowColor}" onclick="toggleCard(event,this)">
  ${clfBadge}
  <span class="card-chevron">▼</span>
  <div class="card-icon-area">${getIcon(item.id)}</div>
  <div class="card-body">
    <div>
      <div class="card-name">${item.name}</div>
      <div class="card-category">${item[subtitleKey] || ''}</div>
    </div>
    <div class="card-hint">▼ Click to see features</div>
    <div class="card-features">${featureRows}${customRows}</div>
  </div>
</div>`;
  }).join('');

  document.querySelectorAll('.item-card').forEach(card => {
    if (expandedCards.has(Number(card.dataset.itemId))) card.classList.add('expanded');
  });
  updateSectionLabel();
}

// ══════════════════════════════════════════════════
//  BUILD TABLE
// ══════════════════════════════════════════════════
function buildTableHeaders() {
  const tr = document.querySelector('#data-table thead tr');
  tr.innerHTML = '';

  // Explore mode: non-sortable classification column
  if (exploreMode) {
    const thClf = document.createElement('th');
    thClf.className = 'col-classify-header';
    thClf.innerHTML = `<span title="Model classification accuracy">✓/✗</span>`;
    tr.appendChild(thClf);
  }

  const thItem = document.createElement('th');
  thItem.setAttribute('data-col', '0');
  thItem.innerHTML = `Item <span class="sort-indicator">⇅</span>`;
  thItem.onclick = () => sortTable(0);
  tr.appendChild(thItem);

  FEATURES.forEach((f, i) => {
    const th = document.createElement('th');
    th.setAttribute('data-col', i + 1);
    th.innerHTML = `${f.label} <span class="sort-indicator">⇅</span>`;
    th.onclick = () => sortTable(i + 1);
    tr.appendChild(th);
  });

  customFeatures.forEach((cf, i) => {
    const col = 1 + FEATURES.length + i;
    const th = document.createElement('th');
    th.setAttribute('data-custom', cf.key);
    th.setAttribute('data-col', col);
    th.innerHTML = `${cf.name} <span class="sort-indicator">⇅</span>`;
    th.onclick = () => sortTable(col);
    tr.appendChild(th);
  });
}

function _itemRow(item) {
  const subtitleKey = (typeof DATASET_META !== 'undefined' && DATASET_META.subtitleKey) || 'cat';

  // Explore mode: classification indicator cell
  let classifyTd = '';
  if (exploreMode) {
    const clf = getItemClassification(item);
    if (clf !== null) {
      classifyTd = clf.correct
        ? `<td class="col-classify-cell clf-correct" title="Correctly classified"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="rgba(74,222,128,0.18)" stroke="#4ade80" stroke-width="1.3"/><path d="M5 8l2.5 2.5L11 5.5" stroke="#4ade80" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></td>`
        : `<td class="col-classify-cell clf-wrong" title="Misclassified by the model"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="rgba(248,113,113,0.18)" stroke="#f87171" stroke-width="1.3"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#f87171" stroke-width="1.6" stroke-linecap="round"/></svg></td>`;
    } else {
      classifyTd = `<td class="col-classify-cell">—</td>`;
    }
  }

  const featCols = FEATURES.map(f => {
    const editVal = f.type === 'boolean' ? (item[f.key] ? 'Yes' : 'No') : item[f.key];
    return `<td><span class="table-pill-edit" onclick="startEdit(event,${item.id},'${f.key}','${String(editVal).replace(/'/g,"\\'")}',this)">${renderFeatureValue(f, item)}</span></td>`;
  }).join('');
  const customCols = customFeatures.map(cf => {
    const val = cf.values[item.id] || cf.categories[0];
    return `<td><span class="table-pill-edit" onclick="startEdit(event,${item.id},'${cf.key}','${val.replace(/'/g,"\\'")}',this)">${customPill(val)}</span></td>`;
  }).join('');
  return `
<tr data-id="${item.id}">
  ${classifyTd}
  <td>
    <div class="td-item">
      ${getIcon(item.id)}
      <div class="td-item-text">
        <span class="td-item-name">${item.name}</span>
        <span class="td-item-cat">${item[subtitleKey] || ''}</span>
      </div>
    </div>
  </td>
  ${featCols}
  ${customCols}
</tr>`;
}

function buildTable() {
  buildTableHeaders();
  document.getElementById('table-body').innerHTML = _visibleItems().map(_itemRow).join('');
}

// ══════════════════════════════════════════════════
//  SORT
// ══════════════════════════════════════════════════
let sortCol = -1;
let sortDir = 1; // 1=asc, -1=desc

function sortTable(col) {
  if (sortCol === col) sortDir *= -1;
  else { sortCol = col; sortDir = 1; }

  document.querySelectorAll('#data-table th').forEach((th) => {
    th.classList.remove('sorted-asc', 'sorted-desc');
    const ind = th.querySelector('.sort-indicator');
    const thCol = th.getAttribute('data-col');
    if (thCol !== null && parseInt(thCol) === col) {
      th.classList.add(sortDir === 1 ? 'sorted-asc' : 'sorted-desc');
      if (ind) ind.textContent = sortDir === 1 ? '↑' : '↓';
    } else {
      if (ind) ind.textContent = '⇅';
    }
  });

  const data = [..._visibleItems()];
  data.sort((a, b) => {
    let va, vb;
    if (col === 0) {
      va = a.name; vb = b.name;
    } else if (col <= FEATURES.length) {
      const f = FEATURES[col - 1];
      if (f.sortWeight) {
        va = f.sortWeight[a[f.key]] || 0; vb = f.sortWeight[b[f.key]] || 0;
      } else if (f.type === 'boolean') {
        va = a[f.key] ? 1 : 0; vb = b[f.key] ? 1 : 0;
      } else {
        va = a[f.key]; vb = b[f.key];
      }
    } else {
      const cf = customFeatures[col - 1 - FEATURES.length];
      if (cf) { va = cf.values[a.id] || cf.categories[0]; vb = cf.values[b.id] || cf.categories[0]; }
      else return 0;
    }
    if (typeof va === 'string') return sortDir * va.localeCompare(vb);
    return sortDir * (va - vb);
  });

  document.getElementById('table-body').innerHTML = data.map(_itemRow).join('');
}

// ══════════════════════════════════════════════════
//  VIEW TOGGLE
// ══════════════════════════════════════════════════
function setView(view) {
  document.getElementById('view-inbox').classList.toggle('active', view === 'inbox');
  document.getElementById('view-card').classList.toggle('active', view === 'card');
  document.getElementById('view-table').classList.toggle('active', view === 'table');
  // Primary tab active states
  var tabDataset = document.getElementById('tab-dataset');
  var tabInbox   = document.getElementById('tab-inbox');
  if (tabDataset) tabDataset.classList.toggle('active', view === 'card' || view === 'table');
  if (tabInbox)   tabInbox.classList.toggle('active', view === 'inbox');
  // Cards/Table secondary toggle
  document.getElementById('btn-card').classList.toggle('active', view === 'card');
  document.getElementById('btn-table').classList.toggle('active', view === 'table');
}

// ══════════════════════════════════════════════════
//  INBOX / USER STORIES
// ══════════════════════════════════════════════════
function renderInbox() {
  var list = document.getElementById('inbox-list');
  if (!list) return;
  if (!_userStories.length) {
    list.innerHTML = '<div class="inbox-empty">No user stories for this dataset.</div>';
    _updateInboxBadge();
    return;
  }
  list.innerHTML = _userStories.map(function(story, idx) {
    var isRead = _readStoryIds.has(story.id);
    return '<div class="inbox-story' + (isRead ? ' read' : '') + '" id="story-row-' + idx + '" onclick="toggleStory(' + idx + ')">' +
      '<div class="story-summary">' +
        '<div class="story-avatar">' + (story.avatar || '💬') + '</div>' +
        '<div class="story-meta">' +
          '<div class="story-from-row">' +
            '<span class="story-from">' + _esc(story.from) + '</span>' +
            '<span class="story-unread-dot"></span>' +
          '</div>' +
          '<div class="story-subject">' + _esc(story.subject) + '</div>' +
          '<div class="story-preview">' + _esc(story.preview) + '</div>' +
        '</div>' +
        '<span class="story-chevron">▼</span>' +
      '</div>' +
      '<div class="story-body"><div class="story-body-inner">' + _esc(story.body) + '</div></div>' +
    '</div>';
  }).join('');
  _updateInboxBadge();
}

function toggleStory(idx) {
  var story = _userStories[idx];
  var row = document.getElementById('story-row-' + idx);
  if (!row) return;
  var isOpen = row.classList.contains('open');
  // Close all others
  document.querySelectorAll('.inbox-story.open').forEach(function(el) { el.classList.remove('open'); });
  if (!isOpen) {
    row.classList.add('open');
    // Mark as read
    row.classList.add('read');
    _readStoryIds.add(story.id);
    _updateInboxBadge();
  }
}

function _updateInboxBadge() {
  var badge = document.getElementById('inbox-badge');
  if (!badge) return;
  var unread = _userStories.filter(function(s) { return !_readStoryIds.has(s.id); }).length;
  if (unread > 0) {
    badge.textContent = unread;
    badge.style.display = '';
  } else {
    badge.style.display = 'none';
  }
}

function _esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ══════════════════════════════════════════════════
//  INIT — inject metadata from DATASET_META
// ══════════════════════════════════════════════════
function initDataset() {
  if (typeof DATASET_META === 'undefined') return;
  document.title = DATASET_META.title;
  const h1 = document.querySelector('.header-title h1');
  if (h1) h1.textContent = DATASET_META.title;
  const sub = document.querySelector('.header-title p');
  if (sub) sub.textContent = DATASET_META.subtitle;
  const footer = document.querySelector('footer');
  if (footer) footer.textContent = DATASET_META.footer;

  // Populate Add-Feature suggestion chips from FEATURE_SUGGESTIONS
  const chips = document.getElementById('feature-chips');
  if (chips && typeof FEATURE_SUGGESTIONS !== 'undefined') {
    chips.innerHTML = FEATURE_SUGGESTIONS.map(s =>
      `<button class="chip" onclick="selectFeatureSuggestion('${s.name.replace(/'/g,"\\'")}',this)">${s.emoji} ${s.name}</button>`
    ).join('');
  }
}

// ══════════════════════════════════════════════════
//  DATASET SELECTION
// ══════════════════════════════════════════════════

let _dsMode = 'build';

function setDSMode(mode) {
  _dsMode = mode;
  document.getElementById('ds-mode-build').classList.toggle('active', mode === 'build');
  document.getElementById('ds-mode-explore').classList.toggle('active', mode === 'explore');
}

function showDatasetSelect() {
  const grid = document.getElementById('ds-grid');
  grid.innerHTML = DATASETS.map(ds => `
    <div class="ds-card" onclick="loadDataset('${ds.id}')">
      <div class="ds-emoji">${ds.emoji}</div>
      <h3>${ds.name}</h3>
      <p>${ds.description}</p>
      <span class="ds-tagline">${ds.tagline}</span>
      <button class="btn-primary ds-btn">Explore →</button>
    </div>
  `).join('');
}

function loadDataset(id) {
  currentDatasetId = id;
  exploreMode = (_dsMode === 'explore');
  const ds = DATASETS.find(d => d.id === id);
  if (!ds) return;

  const files = [ds.testFile, ds.dataFile];
  if (exploreMode && ds.exploreFile) {
    files.push(ds.exploreFile);
  } else {
    exploreMode = false;
  }

  let loaded = 0;
  const onLoaded = function() { if (++loaded === files.length) launchApp(); };

  files.forEach(function(file) {
    const s = document.createElement('script');
    s.src = file;
    s.onload = onLoaded;
    document.head.appendChild(s);
  });
}

function launchApp() {
  document.getElementById('dataset-select-screen').classList.add('hidden');

  if (exploreMode && window._pendingExploreModel) {
    _activateExploreMode(window._pendingExploreModel);
    window._pendingExploreModel = null;
  } else {
    exploreMode = false;
    _userStories = [];
    _readStoryIds = new Set();
    document.getElementById('model-actions').classList.remove('hidden');
    setView('card');
  }

  initDataset();
  buildCards();
  buildTable();
  renderInbox();
}

// ── Kick off with the selection screen ──
showDatasetSelect();

// ══════════════════════════════════════════════════
//  EXPLORE MODE
// ══════════════════════════════════════════════════

function _activateExploreMode(data) {
  exploreGroundTruth = data.exploreGroundTruth || {};

  // Load user stories
  _userStories = Array.isArray(data.userStories) ? data.userStories : [];
  _readStoryIds = new Set();

  // Restore model state without opening any modal or rebuilding views yet
  _restoreModel(data, true);

  // Build the tree from training labels (explore files store tree: null)
  if (!dt.tree) _buildExploreTree();

  // Banner
  document.getElementById('explore-banner').classList.remove('hidden');

  // Context box
  const question = dt.question || '';
  const desc = data.exploreContext || '';
  if (question || desc) {
    document.getElementById('explore-ctx-question').textContent = '\u201c' + question + '\u201d';
    document.getElementById('explore-ctx-description').textContent = desc;
    document.getElementById('explore-context-box').classList.remove('hidden');
  }

  // Hide build-mode controls, show inbox tab via body class (see CSS)
  document.body.classList.add('explore-mode');

  // Default to inbox view in explore mode if stories exist
  if (_userStories.length) setView('inbox');
}

function _buildExploreTree() {
  if (!dt.labels || Object.keys(dt.labels).length < 2) return;
  const labeledItems = ITEMS.filter(function(item) {
    return Object.prototype.hasOwnProperty.call(dt.labels, item.id);
  });
  const trainingData = labeledItems.map(function(item) {
    return Object.assign({}, item, { _label: dt.labels[item.id] === true });
  });
  const splitFeatures = dt.selectedFeatures
    ? Array.from(dt.selectedFeatures)
    : FEATURES.map(function(f) { return f.key; }).filter(function(k) { return k !== dt.labelFeature; });
  dt.tree = _buildDTree(trainingData, splitFeatures, 0, 3);
}

function getItemClassification(item) {
  if (!exploreMode || !dt.tree) return null;
  const key = String(item.id);
  if (!Object.prototype.hasOwnProperty.call(exploreGroundTruth, key)) return null;
  const groundTruth = Boolean(exploreGroundTruth[key]);
  const predicted = _classify(dt.tree, item);
  return { correct: predicted === groundTruth, predicted: predicted };
}

// ══════════════════════════════════════════════════
//  SAVE / LOAD MODEL
// ══════════════════════════════════════════════════

function exportModel() {
  const itemEdits = {};
  ITEMS.forEach(function(item) {
    const vals = {};
    FEATURES.forEach(function(f) { vals[f.key] = item[f.key]; });
    itemEdits[item.id] = vals;
  });

  const saveData = {
    version: 1,
    datasetId: currentDatasetId,
    itemEdits: itemEdits,
    customFeatures: customFeatures,
    model: {
      question: dt.question,
      labelFeature: dt.labelFeature,
      labelValue: dt.labelValue,
      selectedFeatures: dt.selectedFeatures ? Array.from(dt.selectedFeatures) : null,
      labels: dt.labels,
      tree: dt.tree,
    }
  };

  const json = JSON.stringify(saveData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'model-' + (currentDatasetId || 'dataset') + '.dtmodel';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importModel() {
  document.getElementById('model-file-input').click();
}

function _onModelFileSelected(e) {
  const file = e.target.files[0];
  if (!file) return;
  e.target.value = '';
  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const data = JSON.parse(ev.target.result);
      _restoreModel(data);
    } catch (err) {
      alert('Could not read model file: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function _restoreModel(data, suppressUI) {
  if (!data || data.version !== 1) {
    alert('Unsupported model file format.');
    return;
  }
  if (data.datasetId !== currentDatasetId) {
    alert('This model was saved for the "' + data.datasetId + '" dataset, but you are currently using "' + currentDatasetId + '". Please load the matching dataset first.');
    return;
  }

  // Restore item feature edits
  if (data.itemEdits) {
    ITEMS.forEach(function(item) {
      const edits = data.itemEdits[item.id];
      if (edits) {
        FEATURES.forEach(function(f) {
          if (Object.prototype.hasOwnProperty.call(edits, f.key)) {
            item[f.key] = edits[f.key];
          }
        });
      }
    });
  }

  // Restore custom features
  customFeatures.length = 0;
  if (Array.isArray(data.customFeatures)) {
    data.customFeatures.forEach(function(cf) { customFeatures.push(cf); });
  }

  // Restore decision tree state
  const m = data.model || {};
  dt.question         = m.question     || '';
  dt.labelFeature     = m.labelFeature || null;
  dt.labelValue       = m.labelValue   || '';
  dt.labels           = m.labels       || {};
  dt.selectedFeatures = Array.isArray(m.selectedFeatures) ? new Set(m.selectedFeatures) : null;
  dt.tree             = m.tree         || null;
  dt.currentIndex     = 0;
  dt.testCorrections  = {};
  dt.trainingItems    = [...ITEMS].sort(function() { return Math.random() - 0.5; });
  dt._unclassifiedGroups = [];

  // Sync _dtMode (global in dtree.js)
  if (typeof _dtMode !== 'undefined') {
    _dtMode = dt.labelFeature ? 'feature' : 'question';
  }

  if (!suppressUI) {
    // Rebuild data views
    buildCards();
    buildTable();

    // Open modal at the appropriate phase
    if (dt.tree) {
      document.getElementById('dt-modal').classList.remove('hidden');
      _showPhase('tree');
    } else if (Object.keys(dt.labels).length > 0) {
      document.getElementById('dt-modal').classList.remove('hidden');
      _showPhase('swipe');
    }
  }
}
