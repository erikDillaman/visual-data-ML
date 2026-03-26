// ══════════════════════════════════════════════════
//  DECISION TREE MODULE
//  Depends on: ITEMS (data.js), svgIcon / rarityPill /
//  elementPill / dangerPill / valuePill / customFeatures (app.js)
// ══════════════════════════════════════════════════

// ── State ─────────────────────────────────────────
let dt = {
  question:      '',
  trainingItems: [],   // shuffled ITEMS
  labels:        {},   // itemId -> true (yes) | false (no)
  currentIndex:  0,
  tree:          null,
};

let _dragStartX  = null;
let _dragDelta   = 0;
let _swiping     = false;  // debounce

// ── Open / Close ──────────────────────────────────
function openDecisionTree() {
  dt.question     = '';
  dt.labels       = {};
  dt.currentIndex = 0;
  dt.tree         = null;
  dt.trainingItems = [...ITEMS].sort(() => Math.random() - 0.5);

  document.getElementById('dt-question-input').value = '';
  _showPhase('question');
  document.getElementById('dt-modal').classList.remove('hidden');
}

function closeDT() {
  document.getElementById('dt-modal').classList.add('hidden');
  document.removeEventListener('keydown', _dtKey);
}

function _showPhase(phase) {
  ['question', 'swipe', 'building', 'tree'].forEach(p => {
    document.getElementById('dt-phase-' + p).classList.add('hidden');
  });
  document.getElementById('dt-phase-' + phase).classList.remove('hidden');

  _updateStepper(phase);

  document.removeEventListener('keydown', _dtKey);
  if (phase === 'swipe') {
    _renderSwipeCard();
    document.addEventListener('keydown', _dtKey);
  }
  if (phase === 'building') {
    setTimeout(_trainAndShow, 900);
  }
  if (phase === 'tree') {
    _renderTree();
  }
}

function _updateStepper(phase) {
  const steps = {
    question: 1,
    swipe:    2,
    building: 2,
    tree:     3,
  };
  const active = steps[phase] || 1;

  [1, 2, 3].forEach(function(n) {
    const el = document.getElementById('dt-step-' + n);
    el.classList.remove('active', 'done');
    if (n < active)      el.classList.add('done');
    else if (n === active) el.classList.add('active');
  });
}

function _dtKey(e) {
  if (e.key === 'ArrowRight') { e.preventDefault(); dtSwipe(true);  }
  if (e.key === 'ArrowLeft')  { e.preventDefault(); dtSwipe(false); }
}

// ── Phase: Question ───────────────────────────────
function dtStartTraining() {
  const q = document.getElementById('dt-question-input').value.trim();
  if (!q) { alert('Please enter a question for the AI to answer!'); return; }
  dt.question = q;
  _showPhase('swipe');
}

// ── Phase: Swipe ──────────────────────────────────
function _updateBuildBtn() {
  const labeledIds = Object.keys(dt.labels);
  const yesCount   = labeledIds.filter(function(id) { return dt.labels[id]; }).length;
  const noCount    = labeledIds.length - yesCount;
  const canBuild   = yesCount >= 1 && noCount >= 1;

  document.getElementById('dt-count-yes').textContent = yesCount + ' YES';
  document.getElementById('dt-count-no').textContent  = noCount + ' NO';

  const btn  = document.getElementById('dt-build-btn');
  const hint = document.getElementById('dt-build-hint');
  btn.disabled = !canBuild;

  if (canBuild) {
    hint.textContent = 'Ready! Label more for a better tree, or build now.';
  } else if (yesCount === 0 && noCount === 0) {
    hint.textContent = 'Label at least one YES and one NO to build';
  } else if (yesCount === 0) {
    hint.textContent = 'Need at least one YES label to build';
  } else {
    hint.textContent = 'Need at least one NO label to build';
  }
}

function dtBuildTree() {
  _showPhase('building');
}

function _renderSwipeCard() {
  if (dt.currentIndex >= dt.trainingItems.length) {
    // All items labeled — auto-build
    dtBuildTree();
    return;
  }

  _swiping = false;
  const item    = dt.trainingItems[dt.currentIndex];
  const labeled = Object.keys(dt.labels).length;
  const total   = dt.trainingItems.length;

  document.getElementById('dt-swipe-question').textContent = '\u201c' + dt.question + '\u201d';
  document.getElementById('dt-progress-label').textContent = labeled + ' of ' + total + ' labeled';

  // Reset YES/NO indicators
  document.getElementById('dt-yes-ind').style.opacity = '0';
  document.getElementById('dt-no-ind').style.opacity  = '0';

  const card = document.getElementById('dt-swipe-card');
  card.style.transition = 'none';
  card.style.transform  = 'translateX(0) rotate(0deg)';
  card.style.opacity    = '1';

  card.innerHTML =
    '<div class="dt-card-icon">' + svgIcon(item.id) + '</div>' +
    '<div class="dt-card-name">' + _esc(item.name) + '</div>' +
    '<div class="dt-card-cat">'  + _esc(item.cat)  + '</div>' +
    '<div class="dt-card-pills">' +
      rarityPill(item.rarity) +
      elementPill(item.element) +
      dangerPill(item.danger) +
      valuePill(item.value) +
      (item.usable
        ? '<span class="pill pill-safe">Usable</span>'
        : '<span class="pill pill-common">Not Usable</span>') +
    '</div>';

  // Attach drag events
  card.onmousedown  = _dragStart;
  card.ontouchstart = _dragStart;
}

function _dragStart(e) {
  if (_swiping) return;
  e.preventDefault();
  const touch  = e.touches ? e.touches[0] : e;
  _dragStartX  = touch.clientX;
  _dragDelta   = 0;
  const card   = document.getElementById('dt-swipe-card');
  card.style.transition = 'none';

  document.onmousemove  = _dragMove;
  document.ontouchmove  = _dragMove;
  document.onmouseup    = _dragEnd;
  document.ontouchend   = _dragEnd;
}

function _dragMove(e) {
  if (_dragStartX === null || _swiping) return;
  const touch  = e.touches ? e.touches[0] : e;
  _dragDelta   = touch.clientX - _dragStartX;
  const card   = document.getElementById('dt-swipe-card');
  card.style.transform = 'translateX(' + _dragDelta + 'px) rotate(' + (_dragDelta * 0.1) + 'deg)';

  const yesEl = document.getElementById('dt-yes-ind');
  const noEl  = document.getElementById('dt-no-ind');
  if (_dragDelta > 20) {
    yesEl.style.opacity = Math.min(1, _dragDelta / 90).toString();
    noEl.style.opacity  = '0';
  } else if (_dragDelta < -20) {
    noEl.style.opacity  = Math.min(1, -_dragDelta / 90).toString();
    yesEl.style.opacity = '0';
  } else {
    yesEl.style.opacity = '0';
    noEl.style.opacity  = '0';
  }
}

function _dragEnd() {
  document.onmousemove  = null;
  document.ontouchmove  = null;
  document.onmouseup    = null;
  document.ontouchend   = null;

  if (_swiping) return;

  if (Math.abs(_dragDelta) > 80) {
    dtSwipe(_dragDelta > 0);
  } else {
    const card = document.getElementById('dt-swipe-card');
    card.style.transition = 'transform 0.3s ease';
    card.style.transform  = 'translateX(0) rotate(0deg)';
    document.getElementById('dt-yes-ind').style.opacity = '0';
    document.getElementById('dt-no-ind').style.opacity  = '0';
  }
  _dragStartX = null;
  _dragDelta  = 0;
}

function dtSwipe(isYes) {
  if (_swiping) return;
  const item = dt.trainingItems[dt.currentIndex];
  if (!item) return;
  _swiping = true;
  dt.labels[item.id] = isYes;

  const card   = document.getElementById('dt-swipe-card');
  const yesEl  = document.getElementById('dt-yes-ind');
  const noEl   = document.getElementById('dt-no-ind');
  card.style.transition = 'transform 0.32s ease, opacity 0.32s ease';

  if (isYes) {
    card.style.transform  = 'translateX(440px) rotate(22deg)';
    yesEl.style.opacity   = '1';
    noEl.style.opacity    = '0';
  } else {
    card.style.transform  = 'translateX(-440px) rotate(-22deg)';
    noEl.style.opacity    = '1';
    yesEl.style.opacity   = '0';
  }
  card.style.opacity = '0';

  _updateBuildBtn();

  setTimeout(function() {
    dt.currentIndex++;
    _renderSwipeCard();
  }, 340);
}

// ── Decision Tree Algorithm ───────────────────────
const _FEATURES = ['rarity', 'element', 'cat', 'weight', 'danger', 'usable', 'value'];

const _FEAT_LABEL = {
  rarity: 'Rarity', element: 'Element', cat: 'Type',
  weight: 'Weight', danger: 'Danger', usable: 'Usable', value: 'Value',
};

function _fval(item, feat) {
  switch (feat) {
    case 'rarity':  return item.rarity;
    case 'element': return item.element;
    case 'cat':     return item.cat;
    case 'weight':  return item.weight;
    case 'danger':  return item.danger;
    case 'usable':  return item.usable ? 'Usable' : 'Not Usable';
    case 'value':   return item.value;
  }
  const cf = (typeof customFeatures !== 'undefined')
    ? customFeatures.find(function(c) { return c.key === feat; })
    : null;
  return cf ? (cf.values[item.id] || cf.categories[0]) : null;
}

function _entropy(items) {
  if (!items.length) return 0;
  const yes = items.filter(function(i) { return i._label; }).length;
  const p   = yes / items.length;
  if (p <= 0 || p >= 1) return 0;
  return -(p * Math.log2(p)) - ((1 - p) * Math.log2(1 - p));
}

function _bestSplit(items, features) {
  const baseE = _entropy(items);
  let best = { gain: -1, feature: null, splitVal: null, isNumeric: false };

  features.forEach(function(feat) {
    if (feat === 'value') {
      const vals = Array.from(new Set(items.map(function(i) { return i.value; }))).sort(function(a, b) { return a - b; });
      for (let k = 0; k < vals.length - 1; k++) {
        const thr   = (vals[k] + vals[k + 1]) / 2;
        const left  = items.filter(function(i) { return i.value <= thr; });
        const right = items.filter(function(i) { return i.value > thr; });
        if (!left.length || !right.length) continue;
        const gain  = baseE
          - (left.length / items.length) * _entropy(left)
          - (right.length / items.length) * _entropy(right);
        if (gain > best.gain) best = { gain: gain, feature: feat, splitVal: thr, isNumeric: true };
      }
    } else {
      const unique = Array.from(new Set(items.map(function(i) { return _fval(i, feat); })));
      unique.forEach(function(v) {
        const left  = items.filter(function(i) { return _fval(i, feat) === v; });
        const right = items.filter(function(i) { return _fval(i, feat) !== v; });
        if (!left.length || !right.length) return;
        const gain  = baseE
          - (left.length / items.length) * _entropy(left)
          - (right.length / items.length) * _entropy(right);
        if (gain > best.gain) best = { gain: gain, feature: feat, splitVal: v, isNumeric: false };
      });
    }
  });

  return best;
}

function _buildDTree(items, features, depth, maxDepth) {
  const yes = items.filter(function(i) { return i._label; }).length;
  const no  = items.length - yes;

  if (depth >= maxDepth || items.length < 2 || yes === 0 || no === 0) {
    return { isLeaf: true, label: yes >= no ? 'yes' : 'no', count: { yes: yes, no: no }, items: items };
  }

  const best = _bestSplit(items, features);
  if (best.gain <= 1e-9 || !best.feature) {
    return { isLeaf: true, label: yes >= no ? 'yes' : 'no', count: { yes: yes, no: no }, items: items };
  }

  let leftItems, rightItems, condition;
  if (best.isNumeric) {
    leftItems  = items.filter(function(i) { return i.value <= best.splitVal; });
    rightItems = items.filter(function(i) { return i.value > best.splitVal; });
    condition  = 'Value \u2264 ' + Math.round(best.splitVal);
  } else {
    leftItems  = items.filter(function(i) { return _fval(i, best.feature) === best.splitVal; });
    rightItems = items.filter(function(i) { return _fval(i, best.feature) !== best.splitVal; });
    const fl   = _FEAT_LABEL[best.feature] || best.feature;
    condition  = (best.feature === 'usable') ? best.splitVal : (fl + ' = ' + best.splitVal);
  }

  return {
    isLeaf:    false,
    feature:   best.feature,
    splitVal:  best.splitVal,
    isNumeric: best.isNumeric,
    condition: condition,
    count:     { yes: yes, no: no },
    items:     items,
    left:      _buildDTree(leftItems,  features, depth + 1, maxDepth),
    right:     _buildDTree(rightItems, features, depth + 1, maxDepth),
  };
}

function _trainAndShow() {
  // Only train on items that were actually labeled
  const labeledItems = dt.trainingItems.filter(function(item) {
    return item.id in dt.labels;
  });
  const trainingData = labeledItems.map(function(item) {
    return Object.assign({}, item, { _label: dt.labels[item.id] === true });
  });

  const features = _FEATURES.slice();
  if (typeof customFeatures !== 'undefined') {
    customFeatures.forEach(function(cf) { features.push(cf.key); });
  }

  dt.tree = _buildDTree(trainingData, features, 0, 3);
  _showPhase('tree');
}

// ── Tree Visualization ────────────────────────────
function _treeDepth(node) {
  if (node.isLeaf) return 0;
  return 1 + Math.max(_treeDepth(node.left), _treeDepth(node.right));
}

function _renderTree() {
  document.getElementById('dt-tree-question').textContent = '\u201c' + dt.question + '\u201d';

  // Check edge case: all same label among labeled items
  const labeledIds = Object.keys(dt.labels);
  const yes = labeledIds.filter(function(id) { return dt.labels[id]; }).length;
  const no  = labeledIds.length - yes;
  const container = document.getElementById('dt-tree-scroll');

  // Update the note with actual count
  const count = labeledIds.length;
  document.getElementById('dt-tree-note').innerHTML =
    'Trained on your <strong>' + count + ' labeled example' + (count !== 1 ? 's' : '') + '</strong>. ' +
    'Each split was chosen to best separate your YES from NO items. Follow any path top-to-bottom to classify a new item!';

  if (yes === 0 || no === 0) {
    const label = yes > 0 ? 'YES' : 'NO';
    const col   = yes > 0 ? '#4ade80' : '#f87171';
    const svg = document.getElementById('dt-tree-svg');
    svg.style.display = 'none';
    const msg = document.createElement('div');
    msg.className = 'dt-all-same';
    msg.innerHTML =
      '<span class="dt-all-same-emoji">' + (yes > 0 ? '✓' : '✗') + '</span>' +
      '<h3 style="color:' + col + '">All items were labeled ' + label + '!</h3>' +
      '<p>A decision tree needs both YES and NO examples to learn from. ' +
      'Try retraining and mix up your labels!</p>';
    container.appendChild(msg);
    return;
  }
  // Make sure the SVG is visible (in case of a retrain)
  document.getElementById('dt-tree-svg').style.display = 'block';

  // Layout constants
  const NW = 210, NH = 76;   // internal node
  const LW = 178, LH = 88;   // leaf node
  const HGAP = 28, VGAP = 82;
  const PAD = 28;

  let leafIdx = 0;

  function assignPos(node, depth) {
    node._depth = depth;
    if (node.isLeaf) {
      node._x  = PAD + leafIdx * (LW + HGAP);
      node._y  = PAD + depth * (NH + VGAP);
      node._cx = node._x + LW / 2;
      leafIdx++;
    } else {
      assignPos(node.left,  depth + 1);
      assignPos(node.right, depth + 1);
      node._cx = (node.left._cx + node.right._cx) / 2;
      node._x  = node._cx - NW / 2;
      node._y  = PAD + depth * (NH + VGAP);
    }
  }

  assignPos(dt.tree, 0);

  const depth  = _treeDepth(dt.tree);
  const svgW   = PAD + leafIdx * (LW + HGAP) - HGAP + PAD;
  const svgH   = PAD + depth * (NH + VGAP) + LH + PAD;

  let edgesSVG = '';
  let nodesSVG = '';

  function drawEdges(node) {
    if (node.isLeaf) return;
    const x1 = node._cx;
    const y1 = node._y + NH;

    const lx = node.left._cx;
    const ly = node.left._y;
    const rx = node.right._cx;
    const ry = node.right._y;

    // Curved paths for a nicer look
    const lPath = 'M ' + x1 + ' ' + y1 + ' C ' + x1 + ' ' + ((y1 + ly) / 2) + ' ' + lx + ' ' + ((y1 + ly) / 2) + ' ' + lx + ' ' + ly;
    const rPath = 'M ' + x1 + ' ' + y1 + ' C ' + x1 + ' ' + ((y1 + ry) / 2) + ' ' + rx + ' ' + ((y1 + ry) / 2) + ' ' + rx + ' ' + ry;

    edgesSVG += '<path d="' + lPath + '" stroke="#7c3aed" stroke-width="2" fill="none" opacity="0.5"/>';
    edgesSVG += '<path d="' + rPath + '" stroke="#7c3aed" stroke-width="2" fill="none" opacity="0.5"/>';

    // YES badge (left edge midpoint)
    const lmx = (x1 + lx) / 2;
    const lmy = (y1 + ly) / 2;
    const rmx = (x1 + rx) / 2;
    const rmy = (y1 + ry) / 2;

    edgesSVG +=
      '<rect x="' + (lmx - 18) + '" y="' + (lmy - 12) + '" width="36" height="20" rx="10" ' +
        'fill="rgba(74,222,128,0.18)" stroke="#4ade80" stroke-width="1.2"/>' +
      '<text x="' + lmx + '" y="' + (lmy + 2) + '" text-anchor="middle" fill="#4ade80" ' +
        'font-size="10" font-weight="700" font-family="Segoe UI,system-ui,sans-serif">YES</text>';

    edgesSVG +=
      '<rect x="' + (rmx - 15) + '" y="' + (rmy - 12) + '" width="30" height="20" rx="10" ' +
        'fill="rgba(248,113,113,0.18)" stroke="#f87171" stroke-width="1.2"/>' +
      '<text x="' + rmx + '" y="' + (rmy + 2) + '" text-anchor="middle" fill="#f87171" ' +
        'font-size="10" font-weight="700" font-family="Segoe UI,system-ui,sans-serif">NO</text>';

    drawEdges(node.left);
    drawEdges(node.right);
  }

  function drawNodes(node) {
    const ff = 'font-family="Segoe UI,system-ui,sans-serif"';

    if (node.isLeaf) {
      const isYes  = node.label === 'yes';
      const bg     = isYes ? 'rgba(22,101,52,0.55)'   : 'rgba(127,29,29,0.55)';
      const border = isYes ? '#4ade80'                  : '#f87171';
      const col    = isYes ? '#4ade80'                  : '#f87171';
      const symbol = isYes ? '\u2713 YES'               : '\u2717 NO';

      // Truncate item names
      const names   = node.items.map(function(i) { return i.name; });
      let   nameStr = names.join(', ');
      if (nameStr.length > 30) nameStr = names.slice(0, 2).join(', ') + (names.length > 2 ? ' +' + (names.length - 2) + ' more' : '');

      nodesSVG +=
        '<rect x="' + node._x + '" y="' + node._y + '" width="' + LW + '" height="' + LH + '" rx="13" ' +
          'fill="' + bg + '" stroke="' + border + '" stroke-width="2"/>' +
        '<text x="' + node._cx + '" y="' + (node._y + 28) + '" text-anchor="middle" fill="' + col + '" ' +
          'font-size="20" font-weight="900" ' + ff + '>' + symbol + '</text>' +
        '<text x="' + node._cx + '" y="' + (node._y + 48) + '" text-anchor="middle" fill="#aaaacc" ' +
          'font-size="10" ' + ff + '>' + node.count.yes + '\u2713  ' + node.count.no + '\u2717</text>' +
        '<text x="' + node._cx + '" y="' + (node._y + 64) + '" text-anchor="middle" fill="#666688" ' +
          'font-size="9" ' + ff + '>' + _escSvg(nameStr) + '</text>' +
        '<text x="' + node._cx + '" y="' + (node._y + 78) + '" text-anchor="middle" fill="#555577" ' +
          'font-size="8" ' + ff + '>' + node.items.length + ' item' + (node.items.length !== 1 ? 's' : '') + '</text>';
    } else {
      // Condition text: split long conditions to two tspan lines if needed
      const cond    = node.condition;
      const condLen = cond.length;
      let condSVG;
      if (condLen <= 20) {
        condSVG =
          '<text x="' + node._cx + '" y="' + (node._y + 44) + '" text-anchor="middle" fill="#e8e8f0" ' +
            'font-size="13" font-weight="700" ' + ff + '>' + _escSvg(cond) + '?</text>';
      } else {
        // Break at = or ≤
        const breakAt = cond.indexOf(' = ') !== -1 ? cond.indexOf(' = ') + 3
                      : cond.indexOf(' \u2264 ') !== -1 ? cond.indexOf(' \u2264 ') + 3
                      : Math.floor(condLen / 2);
        const line1 = cond.slice(0, breakAt).trim();
        const line2 = cond.slice(breakAt).trim() + '?';
        condSVG =
          '<text x="' + node._cx + '" y="' + (node._y + 38) + '" text-anchor="middle" fill="#e8e8f0" ' +
            'font-size="12" font-weight="700" ' + ff + '>' + _escSvg(line1) + '</text>' +
          '<text x="' + node._cx + '" y="' + (node._y + 53) + '" text-anchor="middle" fill="#e8e8f0" ' +
            'font-size="12" font-weight="700" ' + ff + '>' + _escSvg(line2) + '</text>';
      }

      nodesSVG +=
        '<rect x="' + node._x + '" y="' + node._y + '" width="' + NW + '" height="' + NH + '" rx="11" ' +
          'fill="rgba(26,10,58,0.92)" stroke="#7c3aed" stroke-width="1.8"/>' +
        '<text x="' + node._cx + '" y="' + (node._y + 18) + '" text-anchor="middle" fill="#8888aa" ' +
          'font-size="9" font-weight="700" letter-spacing="0.09em" ' + ff + '>IS THIS TRUE?</text>' +
        condSVG +
        '<text x="' + node._cx + '" y="' + (node._y + 68) + '" text-anchor="middle" fill="#555577" ' +
          'font-size="9" ' + ff + '>' + node.count.yes + '\u2713  ' + node.count.no + '\u2717  (of ' + node.items.length + ' items)</text>';

      drawNodes(node.left);
      drawNodes(node.right);
    }
  }

  drawEdges(dt.tree);
  drawNodes(dt.tree);

  const svg = document.getElementById('dt-tree-svg');
  svg.setAttribute('width',   svgW);
  svg.setAttribute('height',  svgH);
  svg.setAttribute('viewBox', '0 0 ' + svgW + ' ' + svgH);
  svg.innerHTML = edgesSVG + nodesSVG;
}

// ── Utility ───────────────────────────────────────
function _escSvg(s) {
  return String(s)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

function _esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
