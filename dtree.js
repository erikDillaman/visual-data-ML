// ══════════════════════════════════════════════════
//  DECISION TREE MODULE
//  Depends on: ITEMS, FEATURES, ICONS, DATASET_META (data.js)
//              getIcon, renderFeatureValue, customFeatures (app.js)
// ══════════════════════════════════════════════════

// ── State ─────────────────────────────────────────
let dt = {
  question:         '',
  trainingItems:    [],   // shuffled ITEMS
  labels:           {},   // itemId -> true (yes) | false (no)
  labelFeature:     null, // feature key used as label (excluded from splits)
  labelValue:       '',   // value that means YES (feature mode only)
  currentIndex:     0,
  tree:             null,
  showMath:         false,
  testCorrections:     {},  // itemId -> true/false, set when user moves icons in Test phase
  selectedFeatures:    null, // Set of feature keys to use for splits (null = all)
  _unclassifiedGroups: [], // items pruned from tree — displayed as floating nodes
  _nodeMap:            {}, // nodeId -> node, rebuilt on each render
  _parentMap:          {}, // nodeId -> {parentId, side}, rebuilt on each render
};

let _dragStartX  = null;
let _dragDelta   = 0;
let _swiping     = false;  // debounce
let _dtMode      = 'question'; // 'question' | 'feature'
let _dtNavigating = false;    // true while _navigateToStep is running

// ── Open / Close ──────────────────────────────────
function openDecisionTree() {
  dt.question         = '';
  dt.labels           = {};
  dt.labelFeature     = null;
  dt.labelValue       = '';
  dt.currentIndex     = 0;
  dt.tree             = null;
  dt.selectedFeatures = null;
  dt._unclassifiedGroups = [];
  dt.trainingItems       = [...ITEMS].sort(() => Math.random() - 0.5);

  document.getElementById('dt-question-input').value = '';
  dtSetMode('question');
  _showPhase('question');
  document.getElementById('dt-modal').classList.remove('hidden');
}

function closeDT() {
  document.getElementById('dt-modal').classList.add('hidden');
  document.removeEventListener('keydown', _dtKey);
}

function _showPhase(phase) {
  ['question', 'features', 'swipe', 'building', 'tree', 'test'].forEach(p => {
    document.getElementById('dt-phase-' + p).classList.add('hidden');
  });
  document.getElementById('dt-phase-' + phase).classList.remove('hidden');

  _updateStepper(phase);

  document.removeEventListener('keydown', _dtKey);
  if (phase === 'features') {
    _renderFeaturePicker();
  }
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
    features: 2,
    swipe:    3,
    building: 3,
    tree:     4,
    test:     5,
  };
  const active = steps[phase] || 1;

  [1, 2, 3, 4, 5].forEach(function(n) {
    const el = document.getElementById('dt-step-' + n);
    el.classList.remove('active', 'done', 'dt-step-clickable');
    el.onclick = null;
    if (n < active)        el.classList.add('done');
    else if (n === active) el.classList.add('active');

    if (_isStepNavigable(n, active)) {
      el.classList.add('dt-step-clickable');
      el.onclick = (function(step) { return function() { _navigateToStep(step); }; })(n);
    }
  });
}

function _isStepNavigable(stepNum, activeStep) {
  if (stepNum === activeStep) return false;
  switch (stepNum) {
    case 1: return true;
    case 2: return !!dt.question;
    case 3: return !!dt.question && _dtMode === 'question';
    case 4: return dt.tree !== null;
    case 5: return dt.tree !== null;
    default: return false;
  }
}

function _navigateToStep(n) {
  const phaseMap = { 1: 'question', 2: 'features', 3: 'swipe', 4: 'tree', 5: 'test' };
  const phase = phaseMap[n];
  if (!phase) return;

  _dtNavigating = true;
  _showPhase(phase);
  _dtNavigating = false;

  // Restore question-phase UI when going back to step 1
  if (n === 1) {
    if (_dtMode === 'feature' && dt.labelFeature) {
      // feature select values persist in DOM; just ensure correct mode is shown
      dtSetMode('feature');
    } else {
      dtSetMode('question');
      document.getElementById('dt-question-input').value = dt.question || '';
    }
  }
}

function _dtKey(e) {
  if (e.key === 'ArrowRight') { e.preventDefault(); dtSwipe(true);  }
  if (e.key === 'ArrowLeft')  { e.preventDefault(); dtSwipe(false); }
}

// ── Phase: Question ───────────────────────────────
function dtSetMode(mode) {
  _dtMode = mode;
  document.getElementById('dt-mode-question').classList.toggle('hidden', mode !== 'question');
  document.getElementById('dt-mode-feature').classList.toggle('hidden', mode !== 'feature');
  document.getElementById('dt-tab-question').classList.toggle('active', mode === 'question');
  document.getElementById('dt-tab-feature').classList.toggle('active', mode === 'feature');
  if (mode === 'feature') _populateFeatureSelect();
}

function _populateFeatureSelect() {
  const sel = document.getElementById('dt-feature-select');
  const prev = sel.value;
  sel.innerHTML = '<option value="">— Select a feature —</option>';
  _FEATURES().forEach(function(f) {
    const opt = document.createElement('option');
    opt.value = f;
    opt.textContent = _FEAT_LABEL()[f] || f;
    sel.appendChild(opt);
  });
  if (typeof customFeatures !== 'undefined') {
    customFeatures.forEach(function(cf) {
      const opt = document.createElement('option');
      opt.value = cf.key;
      opt.textContent = cf.label || cf.key;
      sel.appendChild(opt);
    });
  }
  sel.value = prev;
  dtFeatureSelectChanged();
}

function dtFeatureSelectChanged() {
  const feat = document.getElementById('dt-feature-select').value;
  const valGroup = document.getElementById('dt-value-group');
  if (!feat) { valGroup.classList.add('hidden'); return; }
  const values = Array.from(new Set(ITEMS.map(function(item) { return _fval(item, feat); })))
    .filter(function(v) { return v != null; }).sort();
  const valSel = document.getElementById('dt-value-select');
  valSel.innerHTML = '<option value="">— Select a value —</option>';
  values.forEach(function(v) {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = v;
    valSel.appendChild(opt);
  });
  valGroup.classList.remove('hidden');
}

function dtStartTraining() {
  if (_dtMode === 'feature') {
    const feat = document.getElementById('dt-feature-select').value;
    const val  = document.getElementById('dt-value-select').value;
    if (!feat) { alert('Please select a feature!'); return; }
    if (!val)  { alert('Please select a value for YES!'); return; }
    const featLabel = _FEAT_LABEL()[feat] || feat;
    dt.question = featLabel + ': ' + val + '?';
    dt.labelFeature = feat;
    dt.labelValue   = val;
    dt.labels = {};
    ITEMS.forEach(function(item) {
      dt.labels[item.id] = String(_fval(item, feat)) === String(val);
    });
  } else {
    const q = document.getElementById('dt-question-input').value.trim();
    if (!q) { alert('Please enter a question for the AI to answer!'); return; }
    dt.question = q;
  }
  dt.selectedFeatures = null; // will be initialized in feature picker
  _showPhase('features');
}

function dtConfirmFeatures() {
  if (_dtMode === 'feature') {
    _showPhase('building');
  } else {
    _showPhase('swipe');
  }
}

// ── Phase: Feature Picker ──────────────────────────
function _renderFeaturePicker() {
  const container = document.getElementById('dt-feature-pills');
  container.innerHTML = '';

  const allFeatureKeys = _FEATURES().slice();
  if (typeof customFeatures !== 'undefined') {
    customFeatures.forEach(function(cf) { allFeatureKeys.push(cf.key); });
  }
  // Exclude the label feature itself from being a split candidate
  const available = dt.labelFeature
    ? allFeatureKeys.filter(function(f) { return f !== dt.labelFeature; })
    : allFeatureKeys;

  // Initialize selectedFeatures to all available on first visit
  if (!dt.selectedFeatures) {
    dt.selectedFeatures = new Set(available);
  }

  // Update button label based on mode
  const continueBtn = document.getElementById('dt-features-continue-btn');
  continueBtn.textContent = _dtMode === 'feature' ? 'Build Tree \u2192' : 'Start Labeling \u2192';

  available.forEach(function(feat) {
    const label = _FEAT_LABEL()[feat] || feat;
    const pill = document.createElement('button');
    pill.className = 'dt-feat-pill' + (dt.selectedFeatures.has(feat) ? ' selected' : '');
    pill.textContent = label;
    pill.onclick = function() {
      if (dt.selectedFeatures.has(feat)) {
        dt.selectedFeatures.delete(feat);
        pill.classList.remove('selected');
      } else {
        dt.selectedFeatures.add(feat);
        pill.classList.add('selected');
      }
      _updateFeaturePickerHint();
    };
    container.appendChild(pill);
  });

  _updateFeaturePickerHint();
}

function _updateFeaturePickerHint() {
  const count = dt.selectedFeatures ? dt.selectedFeatures.size : 0;
  const btn   = document.getElementById('dt-features-continue-btn');
  const hint  = document.getElementById('dt-features-hint');
  btn.disabled = count === 0;
  if (count === 0) {
    hint.textContent = 'Select at least one feature to continue.';
  } else {
    hint.textContent = count + ' feature' + (count === 1 ? '' : 's') + ' selected \u2014 the AI will only use ' + (count === 1 ? 'this one' : 'these') + ' when deciding.';
  }
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
    // All items labeled — auto-build (unless we're navigating back)
    if (_dtNavigating) {
      _updateBuildBtn();
    } else {
      dtBuildTree();
    }
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

  const _subtitleKey = (typeof DATASET_META !== 'undefined' && DATASET_META.subtitleKey) || 'cat';
  card.innerHTML =
    '<div class="dt-card-icon">' + getIcon(item.id) + '</div>' +
    '<div class="dt-card-name">' + _esc(item.name) + '</div>' +
    '<div class="dt-card-cat">'  + _esc(item[_subtitleKey] || '') + '</div>' +
    '<div class="dt-card-pills">' +
      FEATURES.map(function(f) { return renderFeatureValue(f, item); }).join('') +
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
// These are functions instead of constants so they read FEATURES lazily (after dataset loads).
function _FEATURES() { return FEATURES.map(function(f) { return f.key; }); }
function _FEAT_LABEL() { return FEATURES.reduce(function(acc, f) { acc[f.key] = f.label; return acc; }, {}); }

function _fval(item, feat) {
  const f = FEATURES.find(function(fd) { return fd.key === feat; });
  if (f) {
    if (f.type === 'boolean') return item[feat] ? 'Yes' : 'No';
    return item[feat];
  }
  const cf = (typeof customFeatures !== 'undefined')
    ? customFeatures.find(function(c) { return c.key === feat; })
    : null;
  return cf ? (cf.values[item.id] || cf.categories[0]) : null;
}

// Gini impurity: 0 = perfectly pure, 0.5 = maximally mixed (50/50)
function _gini(items) {
  if (!items.length) return 0;
  const yes = items.filter(function(i) { return i._label; }).length;
  const p   = yes / items.length;
  return 1 - p * p - (1 - p) * (1 - p);
}

function _bestSplit(items, features) {
  const parentGini = _gini(items);
  let best = { gain: -1, feature: null, splitVal: null, isNumeric: false, math: null };

  features.forEach(function(feat) {
    const _fd = FEATURES.find(function(fd) { return fd.key === feat; });
    if (_fd && _fd.type === 'number') {
      const vals = Array.from(new Set(items.map(function(i) { return _fval(i, feat); }))).sort(function(a, b) { return a - b; });
      for (let k = 0; k < vals.length - 1; k++) {
        const thr    = (vals[k] + vals[k + 1]) / 2;
        const left   = items.filter(function(i) { return i.value <= thr; });
        const right  = items.filter(function(i) { return i.value > thr; });
        if (!left.length || !right.length) continue;
        const leftG  = _gini(left);
        const rightG = _gini(right);
        const totalG = (left.length / items.length) * leftG + (right.length / items.length) * rightG;
        const gain   = parentGini - totalG;
        if (gain > best.gain) {
          best = { gain: gain, feature: feat, splitVal: thr, isNumeric: true,
                   math: { parentGini: parentGini, leftGini: leftG, rightGini: rightG,
                           totalGini: totalG, leftN: left.length, rightN: right.length,
                           totalN: items.length,
                           leftYes: left.filter(function(i){return i._label;}).length,
                           rightYes: right.filter(function(i){return i._label;}).length } };
        }
      }
    } else {
      const unique = Array.from(new Set(items.map(function(i) { return _fval(i, feat); })));
      unique.forEach(function(v) {
        const left   = items.filter(function(i) { return _fval(i, feat) === v; });
        const right  = items.filter(function(i) { return _fval(i, feat) !== v; });
        if (!left.length || !right.length) return;
        const leftG  = _gini(left);
        const rightG = _gini(right);
        const totalG = (left.length / items.length) * leftG + (right.length / items.length) * rightG;
        const gain   = parentGini - totalG;
        if (gain > best.gain) {
          best = { gain: gain, feature: feat, splitVal: v, isNumeric: false,
                   math: { parentGini: parentGini, leftGini: leftG, rightGini: rightG,
                           totalGini: totalG, leftN: left.length, rightN: right.length,
                           totalN: items.length,
                           leftYes: left.filter(function(i){return i._label;}).length,
                           rightYes: right.filter(function(i){return i._label;}).length } };
        }
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
    leftItems  = items.filter(function(i) { return _fval(i, best.feature) <= best.splitVal; });
    rightItems = items.filter(function(i) { return _fval(i, best.feature) > best.splitVal; });
    condition  = (_FEAT_LABEL()[best.feature] || best.feature) + ' \u2264 ' + Math.round(best.splitVal);
  } else {
    leftItems  = items.filter(function(i) { return _fval(i, best.feature) === best.splitVal; });
    rightItems = items.filter(function(i) { return _fval(i, best.feature) !== best.splitVal; });
    const fl   = _FEAT_LABEL()[best.feature] || best.feature;
    condition  = fl + ' = ' + best.splitVal;
  }

  return {
    isLeaf:    false,
    feature:   best.feature,
    splitVal:  best.splitVal,
    isNumeric: best.isNumeric,
    condition: condition,
    count:     { yes: yes, no: no },
    items:     items,
    splitMath: best.math,
    left:      _buildDTree(leftItems,  features, depth + 1, maxDepth),
    right:     _buildDTree(rightItems, features, depth + 1, maxDepth),
  };
}

function _trainAndShow() {
  dt._unclassifiedGroups = []; // fresh tree = no pruned groups
  // Only train on items that were actually labeled
  const labeledItems = dt.trainingItems.filter(function(item) {
    return item.id in dt.labels;
  });
  const trainingData = labeledItems.map(function(item) {
    return Object.assign({}, item, { _label: dt.labels[item.id] === true });
  });

  let splitFeatures;
  if (dt.selectedFeatures && dt.selectedFeatures.size > 0) {
    splitFeatures = Array.from(dt.selectedFeatures);
  } else {
    const features = _FEATURES();
    if (typeof customFeatures !== 'undefined') {
      customFeatures.forEach(function(cf) { features.push(cf.key); });
    }
    splitFeatures = dt.labelFeature
      ? features.filter(function(f) { return f !== dt.labelFeature; })
      : features;
  }

  dt.tree = _buildDTree(trainingData, splitFeatures, 0, 3);
  _showPhase('tree');
}

// ── Accuracy helpers ──────────────────────────────
function _computeTrainAccuracy() {
  var labeled = Object.keys(dt.labels);
  if (!labeled.length || !dt.tree) return null;
  var correct = labeled.filter(function(id) {
    var item = dt.trainingItems.find(function(i) { return i.id == id; });
    if (!item) return false;
    return _classify(dt.tree, item) === (dt.labels[id] === true);
  }).length;
  return { correct: correct, total: labeled.length };
}

function _accColor(pct) {
  if (pct >= 80) return '#4ade80';
  if (pct >= 60) return '#fbbf24';
  return '#f87171';
}

function _accMsg(pct) {
  if (pct === 100) return '🌟 Perfect! Every training example was right!';
  if (pct >= 80)   return '🎯 Great job! Your model learned well.';
  if (pct >= 60)   return '👍 Not bad! Try labeling more items to improve it.';
  return '💡 Keep experimenting — more labels can help the tree!';
}

// ── Tree Visualization ────────────────────────────
function _treeDepth(node) {
  if (node.isLeaf) return 0;
  return 1 + Math.max(_treeDepth(node.left), _treeDepth(node.right));
}

function _renderTree() {
  // Run Gini tests each time a tree is built (results go to browser console)
  _runGiniTests();

  // Reset math panel state
  dt.showMath = false;
  const mathToggleBtn = document.getElementById('dt-math-toggle');
  if (mathToggleBtn) {
    mathToggleBtn.classList.remove('active');
    mathToggleBtn.textContent = 'Show Math';
  }
  const mathPanel = document.getElementById('dt-math-panel');
  if (mathPanel) mathPanel.classList.add('hidden');

  document.getElementById('dt-tree-question').textContent = '\u201c' + dt.question + '\u201d';

  // Check edge case: all same label among labeled items
  const labeledIds = Object.keys(dt.labels);
  const yes = labeledIds.filter(function(id) { return dt.labels[id]; }).length;
  const no  = labeledIds.length - yes;
  const container = document.getElementById('dt-tree-scroll');

  // Update the note with actual count
  const count = labeledIds.length;
  document.getElementById('dt-tree-note').innerHTML =
    'Trained on your <strong>' + count + ' labeled example' + (count !== 1 ? 's' : '') + '</strong>.' +
    '<span class="dt-note-tips">' +
      '<span>Hover items for details</span>' +
      '<span>Click a split node to collapse it</span>' +
      '<span>Click YES or NO to prune a branch</span>' +
    '</span>';

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

  // ── Assign unique IDs to every node and build lookup maps ─────────────
  let _nid = 0;
  dt._nodeMap   = {};
  dt._parentMap = {};
  function _assignNodeIds(node, parentId, side) {
    node._id = ++_nid;
    dt._nodeMap[node._id] = node;
    if (parentId !== null) dt._parentMap[node._id] = { parentId: parentId, side: side };
    if (!node.isLeaf) {
      _assignNodeIds(node.left,  node._id, 'left');
      _assignNodeIds(node.right, node._id, 'right');
    }
  }
  _assignNodeIds(dt.tree, null, null);

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

  let maxLeafH = LH; // updated dynamically inside drawNodes

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
      '<g data-prune-parent="' + node._id + '" data-prune-side="left" style="cursor:pointer">' +
        '<rect x="' + (lmx - 22) + '" y="' + (lmy - 14) + '" width="44" height="26" rx="13" fill="transparent"/>' +
        '<rect x="' + (lmx - 18) + '" y="' + (lmy - 12) + '" width="36" height="20" rx="10" ' +
          'fill="rgba(74,222,128,0.18)" stroke="#4ade80" stroke-width="1.2"/>' +
        '<text x="' + lmx + '" y="' + (lmy + 2) + '" text-anchor="middle" fill="#4ade80" ' +
          'font-size="10" font-weight="700" font-family="Segoe UI,system-ui,sans-serif">YES</text>' +
      '</g>';

    edgesSVG +=
      '<g data-prune-parent="' + node._id + '" data-prune-side="right" style="cursor:pointer">' +
        '<rect x="' + (rmx - 19) + '" y="' + (rmy - 14) + '" width="38" height="26" rx="13" fill="transparent"/>' +
        '<rect x="' + (rmx - 15) + '" y="' + (rmy - 12) + '" width="30" height="20" rx="10" ' +
          'fill="rgba(248,113,113,0.18)" stroke="#f87171" stroke-width="1.2"/>' +
        '<text x="' + rmx + '" y="' + (rmy + 2) + '" text-anchor="middle" fill="#f87171" ' +
          'font-size="10" font-weight="700" font-family="Segoe UI,system-ui,sans-serif">NO</text>' +
      '</g>';

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

      // Icon grid layout
      const ICON_S = 22, ICON_G = 3;
      const maxPerRow = Math.max(1, Math.floor((LW - 16) / (ICON_S + ICON_G)));
      const iconRows  = node.items.length ? Math.ceil(node.items.length / maxPerRow) : 0;
      const nodeH     = 52 + iconRows * (ICON_S + ICON_G) + (iconRows ? 8 : 0);
      maxLeafH = Math.max(maxLeafH, nodeH);

      nodesSVG +=
        '<rect x="' + node._x + '" y="' + node._y + '" width="' + LW + '" height="' + nodeH + '" rx="13" ' +
          'fill="' + bg + '" stroke="' + border + '" stroke-width="2"/>' +
        '<text x="' + node._cx + '" y="' + (node._y + 26) + '" text-anchor="middle" fill="' + col + '" ' +
          'font-size="18" font-weight="900" ' + ff + '>' + symbol + '</text>' +
        '<text x="' + node._cx + '" y="' + (node._y + 44) + '" text-anchor="middle" fill="#aaaacc" ' +
          'font-size="10" ' + ff + '>' + node.count.yes + '\u2713  ' + node.count.no + '\u2717</text>';

      node.items.forEach(function(item, idx) {
        const row      = Math.floor(idx / maxPerRow);
        const colIdx   = idx % maxPerRow;
        const rowStart = row * maxPerRow;
        const rowCount = Math.min(maxPerRow, node.items.length - rowStart);
        const rowW     = rowCount * ICON_S + (rowCount - 1) * ICON_G;
        const ix       = node._x + (LW - rowW) / 2 + colIdx * (ICON_S + ICON_G);
        const iy       = node._y + 52 + row * (ICON_S + ICON_G);
        const uri      = 'data:image/svg+xml,' + encodeURIComponent(getIcon(item.id));
        nodesSVG +=
          '<g data-item-id="' + _escSvg(String(item.id)) + '" style="cursor:pointer">' +
            '<rect x="' + (ix - 1) + '" y="' + (iy - 1) + '" width="' + (ICON_S + 2) + '" height="' + (ICON_S + 2) + '" rx="3" ' +
              'fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>' +
            '<image href="' + uri + '" x="' + ix + '" y="' + iy + '" width="' + ICON_S + '" height="' + ICON_S + '"/>' +
          '</g>';
      });
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
        '<g data-collapse-id="' + node._id + '" style="cursor:pointer">' +
          '<rect x="' + node._x + '" y="' + node._y + '" width="' + NW + '" height="' + NH + '" rx="11" ' +
            'fill="rgba(26,10,58,0.92)" stroke="#7c3aed" stroke-width="1.8"/>' +
          '<text x="' + node._cx + '" y="' + (node._y + 18) + '" text-anchor="middle" fill="#8888aa" ' +
            'font-size="9" font-weight="700" letter-spacing="0.09em" ' + ff + '>IS THIS TRUE?</text>' +
          condSVG +
          '<text x="' + node._cx + '" y="' + (node._y + 68) + '" text-anchor="middle" fill="#555577" ' +
            'font-size="9" ' + ff + '>' + node.count.yes + '\u2713  ' + node.count.no + '\u2717  (of ' + node.items.length + ' items)</text>' +
        '</g>';

      drawNodes(node.left);
      drawNodes(node.right);
    }
  }

  drawEdges(dt.tree);
  drawNodes(dt.tree);

  let svgH = PAD + depth * (NH + VGAP) + maxLeafH + PAD;

  // ── Unclassified groups (items pruned from tree) ───────────────────────
  let unclassifiedSVG = '';
  let svgW_total = svgW;
  if (dt._unclassifiedGroups && dt._unclassifiedGroups.length > 0) {
    const UW = 200, UGAP = 20;
    const ICON_S = 22, ICON_G = 3;
    const uy = svgH + 28;

    // Compute the tallest group box for correct canvas height
    let maxGroupH = 0;
    dt._unclassifiedGroups.forEach(function(group) {
      const maxPerRow = Math.max(1, Math.floor((UW - 16) / (ICON_S + ICON_G)));
      const iconRows  = group.items.length ? Math.ceil(group.items.length / maxPerRow) : 0;
      const groupH    = 50 + iconRows * (ICON_S + ICON_G) + (iconRows ? 8 : 0);
      maxGroupH = Math.max(maxGroupH, groupH);
    });

    const totalUnclassW = PAD + dt._unclassifiedGroups.length * (UW + UGAP) - UGAP + PAD;
    svgW_total = Math.max(svgW, totalUnclassW);
    svgH = uy + maxGroupH + PAD;

    unclassifiedSVG +=
      '<text x="' + PAD + '" y="' + (uy - 10) + '" fill="#888" font-size="10" font-style="italic" ' +
        'font-family="Segoe UI,system-ui,sans-serif">Unclassified after pruning:</text>';

    dt._unclassifiedGroups.forEach(function(group, idx) {
      const ux        = PAD + idx * (UW + UGAP);
      const maxPerRow = Math.max(1, Math.floor((UW - 16) / (ICON_S + ICON_G)));
      const iconRows  = group.items.length ? Math.ceil(group.items.length / maxPerRow) : 0;
      const groupH    = 50 + iconRows * (ICON_S + ICON_G) + (iconRows ? 8 : 0);
      const yes = group.items.filter(function(i) { return i._label; }).length;
      const no  = group.items.length - yes;

      unclassifiedSVG +=
        '<rect x="' + ux + '" y="' + uy + '" width="' + UW + '" height="' + groupH + '" rx="11" ' +
          'fill="rgba(240,232,210,0.07)" stroke="#888" stroke-width="1.5" stroke-dasharray="6,3"/>' +
        '<text x="' + (ux + UW / 2) + '" y="' + (uy + 20) + '" text-anchor="middle" fill="#aaa" ' +
          'font-size="10" font-weight="700" font-family="Segoe UI,system-ui,sans-serif">? UNCLASSIFIED DATA</text>' +
        '<text x="' + (ux + UW / 2) + '" y="' + (uy + 36) + '" text-anchor="middle" fill="#888" ' +
          'font-size="9" font-family="Segoe UI,system-ui,sans-serif">' +
          group.items.length + ' item' + (group.items.length !== 1 ? 's' : '') +
          ' (' + yes + '\u2713 ' + no + '\u2717)</text>';

      group.items.forEach(function(item, iIdx) {
        const row      = Math.floor(iIdx / maxPerRow);
        const colIdx   = iIdx % maxPerRow;
        const rowStart = row * maxPerRow;
        const rowCount = Math.min(maxPerRow, group.items.length - rowStart);
        const rowW     = rowCount * ICON_S + (rowCount - 1) * ICON_G;
        const ix       = ux + (UW - rowW) / 2 + colIdx * (ICON_S + ICON_G);
        const iy       = uy + 44 + row * (ICON_S + ICON_G);
        const uri      = 'data:image/svg+xml,' + encodeURIComponent(getIcon(item.id));
        unclassifiedSVG +=
          '<g data-item-id="' + _escSvg(String(item.id)) + '" style="cursor:pointer">' +
            '<rect x="' + (ix - 1) + '" y="' + (iy - 1) + '" width="' + (ICON_S + 2) + '" height="' + (ICON_S + 2) + '" rx="3" ' +
              'fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>' +
            '<image href="' + uri + '" x="' + ix + '" y="' + iy + '" width="' + ICON_S + '" height="' + ICON_S + '"/>' +
          '</g>';
      });
    });
  }

  const svg = document.getElementById('dt-tree-svg');
  svg.setAttribute('width',   svgW_total);
  svg.setAttribute('height',  svgH);
  svg.setAttribute('viewBox', '0 0 ' + svgW_total + ' ' + svgH);
  svg.innerHTML = edgesSVG + nodesSVG + unclassifiedSVG;

  // ── Attach click handlers to interactive SVG elements ─────────────────
  svg.querySelectorAll('[data-collapse-id]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      dtCollapseNode(parseInt(el.getAttribute('data-collapse-id'), 10));
    });
  });

  svg.querySelectorAll('[data-prune-parent]').forEach(function(el) {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      dtPruneBranch(
        parseInt(el.getAttribute('data-prune-parent'), 10),
        el.getAttribute('data-prune-side')
      );
    });
  });

  // ── Item icon hover tooltips ───────────────────────────────────────────
  if (!svg.dataset.tooltipInit) {
    svg.dataset.tooltipInit = '1';
    svg.addEventListener('mousemove', function(e) {
      var el = e.target.closest('[data-item-id]');
      if (!el) { _hideTestTooltip(); return; }
      var id   = el.getAttribute('data-item-id');
      var item = ITEMS.find(function(i) { return String(i.id) === id; });
      if (!item) { _hideTestTooltip(); return; }
      _showTestTooltip(e, _buildTreeItemTooltip(item));
    });
    svg.addEventListener('mouseleave', function() { _hideTestTooltip(); });
  }

  // ── Training accuracy banner ──────────────────────────────────────────
  var accBanner = document.getElementById('dt-train-accuracy');
  if (accBanner) {
    var acc = _computeTrainAccuracy();
    if (acc && acc.total > 0) {
      var pct   = Math.round(acc.correct / acc.total * 100);
      var color = _accColor(pct);
      var msg   = _accMsg(pct);
      accBanner.innerHTML =
        '<div class="dt-train-acc-row">' +
          '<span class="dt-train-acc-label">Training Accuracy</span>' +
          '<span class="dt-train-acc-score" style="color:' + color + '">' +
            acc.correct + ' / ' + acc.total + ' correct' +
            '<span>(' + pct + '%)</span>' +
          '</span>' +
        '</div>' +
        '<div class="dt-acc-bar-wrap">' +
          '<div class="dt-acc-bar-fill" style="width:' + pct + '%;background:' + color + '"></div>' +
        '</div>' +
        '<div class="dt-train-acc-msg">' + msg + '</div>';
      accBanner.classList.remove('hidden');
    } else {
      accBanner.classList.add('hidden');
    }
  }

  // ── Click-and-drag panning ─────────────────────────────────────────────
  if (!container.dataset.dragInit) {
    container.dataset.dragInit = '1';
    var dragState = { active: false, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 };

    container.addEventListener('mousedown', function(e) {
      if (e.button !== 0) return;
      dragState.active     = true;
      dragState.startX     = e.clientX;
      dragState.startY     = e.clientY;
      dragState.scrollLeft = container.scrollLeft;
      dragState.scrollTop  = container.scrollTop;
      container.style.cursor = 'grabbing';
      e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
      if (!dragState.active) return;
      container.scrollLeft = dragState.scrollLeft - (e.clientX - dragState.startX);
      container.scrollTop  = dragState.scrollTop  - (e.clientY - dragState.startY);
    });

    document.addEventListener('mouseup', function() {
      if (!dragState.active) return;
      dragState.active = false;
      container.style.cursor = 'grab';
    });
  }
}

// ── Interactive Tree Operations ───────────────────

// Return a flat array of all items in a subtree
function _collectAllItems(node) {
  if (!node) return [];
  if (node.isLeaf) return node.items ? node.items.slice() : [];
  return _collectAllItems(node.left).concat(_collectAllItems(node.right));
}

// Collapse an internal node: convert it to a leaf using majority-class label
function dtCollapseNode(nodeId) {
  var node = dt._nodeMap && dt._nodeMap[nodeId];
  if (!node || node.isLeaf) return;

  // Gather all descendant items so the leaf displays them correctly
  node.items = _collectAllItems(node);

  // Majority class determines the leaf label
  node.label  = node.count.yes >= node.count.no ? 'yes' : 'no';
  node.isLeaf = true;

  delete node.left;
  delete node.right;
  delete node.feature;
  delete node.splitVal;
  delete node.isNumeric;
  delete node.condition;
  delete node.splitMath;

  _renderTree();
}

// Prune a branch (side = 'left' for YES, 'right' for NO).
// Items that were routed down the pruned branch become Unclassified Data.
// The parent node is replaced in the tree by its surviving child.
function dtPruneBranch(parentNodeId, side) {
  var parent = dt._nodeMap && dt._nodeMap[parentNodeId];
  if (!parent || parent.isLeaf) return;

  var prunedChild = side === 'left' ? parent.left : parent.right;
  var keptChild   = side === 'left' ? parent.right : parent.left;
  if (!prunedChild) return;

  // Collect items going down the pruned branch
  var unclassItems = _collectAllItems(prunedChild);
  if (unclassItems.length > 0) {
    dt._unclassifiedGroups.push({ items: unclassItems });
  }

  // Splice the parent out of the tree, replacing it with the kept child
  var parentInfo = dt._parentMap && dt._parentMap[parentNodeId];
  if (!parentInfo) {
    // Parent is root — the kept child becomes the new root
    dt.tree = keptChild;
  } else {
    var grandparent = dt._nodeMap[parentInfo.parentId];
    if (parentInfo.side === 'left') {
      grandparent.left  = keptChild;
    } else {
      grandparent.right = keptChild;
    }
  }

  _renderTree();
}

// ── Gini Tests ────────────────────────────────────
function _runGiniTests() {
  const results = [];

  function assert(label, actual, expected, tol) {
    tol = tol == null ? 1e-9 : tol;
    const pass = Math.abs(actual - expected) <= tol;
    results.push({ label: label, pass: pass, actual: actual, expected: expected });
    return pass;
  }

  // Pure sets
  const pureYes = [{ _label: true }, { _label: true }, { _label: true }];
  assert('Gini(all YES) = 0', _gini(pureYes), 0);

  const pureNo = [{ _label: false }, { _label: false }];
  assert('Gini(all NO) = 0', _gini(pureNo), 0);

  // Empty set
  assert('Gini([]) = 0', _gini([]), 0);

  // 50/50 split — maximum impurity = 0.5
  const half = [{ _label: true }, { _label: false }];
  assert('Gini(1Y 1N) = 0.5', _gini(half), 0.5, 1e-9);

  // 3Y 1N: p=0.75, Gini = 1 - 0.75^2 - 0.25^2 = 0.375
  const threeOne = [{ _label: true }, { _label: true }, { _label: true }, { _label: false }];
  assert('Gini(3Y 1N) = 0.375', _gini(threeOne), 0.375, 1e-9);

  // Total Weighted Gini:
  //   left  = [Y, Y, N] → p=2/3, Gini = 1 - 4/9 - 1/9 = 4/9 ≈ 0.4444
  //   right = [N, N]    → Gini = 0
  //   total = (3/5)×(4/9) + (2/5)×0 = 4/15 ≈ 0.2667
  const left  = [{ _label: true  }, { _label: true  }, { _label: false }];
  const right = [{ _label: false }, { _label: false }];
  const n     = left.length + right.length;
  const totalG = (left.length / n) * _gini(left) + (right.length / n) * _gini(right);
  assert('Total Weighted Gini([2Y1N],[2N]) = 4/15', totalG, 4 / 15, 1e-9);

  // Gini gain
  const parent = left.concat(right);
  const gain   = _gini(parent) - totalG;
  // parent = [Y,Y,N,N,N]: p=2/5=0.4, Gini = 1 - 0.16 - 0.36 = 0.48
  // gain = 0.48 - 4/15 ≈ 0.2133
  assert('Gini Gain([2Y1N],[2N]) ≈ 0.2133', gain, 0.48 - 4 / 15, 1e-9);

  const passed = results.filter(function(r) { return r.pass; }).length;
  const total  = results.length;

  console.group('Gini Impurity Tests');
  results.forEach(function(r) {
    const icon = r.pass ? '✓' : '✗';
    const msg  = icon + ' ' + r.label + ' → got ' + r.actual.toFixed(6) + ', expected ' + r.expected.toFixed(6);
    if (r.pass) { console.log(msg); } else { console.warn(msg); }
  });
  console.log(passed + '/' + total + ' tests passed');
  console.groupEnd();

  return { passed: passed, total: total, results: results };
}

// ── Math Toggle ───────────────────────────────────
function toggleMathPanel() {
  dt.showMath = !dt.showMath;
  const btn   = document.getElementById('dt-math-toggle');
  const panel = document.getElementById('dt-math-panel');
  if (dt.showMath) {
    btn.classList.add('active');
    btn.textContent = 'Hide Math';
    _renderMathPanel();
    panel.classList.remove('hidden');
  } else {
    btn.classList.remove('active');
    btn.textContent = 'Show Math';
    panel.classList.add('hidden');
  }
}

function _renderMathPanel() {
  const panel = document.getElementById('dt-math-panel');
  if (!dt.tree) { panel.innerHTML = ''; return; }

  let html = '<h3 class="math-panel-title">Gini Impurity — How Each Split Was Chosen</h3>';
  html += '<p class="math-panel-intro">At each split, the AI tries every possible question and picks the one that lowers the Total Weighted Gini Impurity the most. A Gini of 0 means a node is perfectly pure (all YES or all NO). A Gini of 0.5 means it\'s a 50/50 mix.</p>';

  let splitNum = 0;

  function walkNode(node, path) {
    if (node.isLeaf || !node.splitMath) return;
    splitNum++;
    const m   = node.splitMath;
    const n   = m.totalN;
    const lno = m.leftN  - m.leftYes;
    const rno = m.rightN - m.rightYes;

    html +=
      '<div class="math-split-block">' +
        '<div class="math-split-header">' +
          '<span class="math-split-num">Split ' + splitNum + '</span>' +
          '<span class="math-split-cond">' + _esc(node.condition) + '?</span>' +
          '<span class="math-split-path">' + _esc(path) + '</span>' +
        '</div>' +
        '<div class="math-row">' +
          '<span class="math-label">Parent node</span>' +
          '<span class="math-formula">' +
            node.count.yes + '\u2713 ' + node.count.no + '\u2717 of ' + n + ' items' +
            ' &nbsp;&rarr;&nbsp; ' +
            'Gini = 1 \u2212 (' + node.count.yes + '/' + n + ')\u00b2 \u2212 (' + node.count.no + '/' + n + ')\u00b2' +
            ' = <strong>' + m.parentGini.toFixed(4) + '</strong>' +
          '</span>' +
        '</div>' +
        '<div class="math-row math-row-yes">' +
          '<span class="math-label">YES branch</span>' +
          '<span class="math-formula">' +
            m.leftYes + '\u2713 ' + lno + '\u2717 of ' + m.leftN + ' items' +
            ' &nbsp;&rarr;&nbsp; ' +
            'Gini = <strong>' + m.leftGini.toFixed(4) + '</strong>' +
          '</span>' +
        '</div>' +
        '<div class="math-row math-row-no">' +
          '<span class="math-label">NO branch</span>' +
          '<span class="math-formula">' +
            m.rightYes + '\u2713 ' + rno + '\u2717 of ' + m.rightN + ' items' +
            ' &nbsp;&rarr;&nbsp; ' +
            'Gini = <strong>' + m.rightGini.toFixed(4) + '</strong>' +
          '</span>' +
        '</div>' +
        '<div class="math-row math-row-total">' +
          '<span class="math-label">Total Weighted Gini</span>' +
          '<span class="math-formula">' +
            '(' + m.leftN + '/' + n + ') \u00d7 ' + m.leftGini.toFixed(4) +
            ' + (' + m.rightN + '/' + n + ') \u00d7 ' + m.rightGini.toFixed(4) +
            ' = <strong>' + m.totalGini.toFixed(4) + '</strong>' +
          '</span>' +
        '</div>' +
        '<div class="math-row math-row-gain">' +
          '<span class="math-label">Gini Gain</span>' +
          '<span class="math-formula">' +
            m.parentGini.toFixed(4) + ' \u2212 ' + m.totalGini.toFixed(4) +
            ' = <strong>' + (m.parentGini - m.totalGini).toFixed(4) + '</strong>' +
            ' <em>(higher = better split)</em>' +
          '</span>' +
        '</div>' +
      '</div>';

    walkNode(node.left,  path + ' \u2192 YES');
    walkNode(node.right, path + ' \u2192 NO');
  }

  walkNode(dt.tree, 'Root');
  panel.innerHTML = html;
}

// ── Utility ───────────────────────────────────────

// Build tooltip HTML for an item icon hovered in the tree or unclassified section.
// Shows name + the feature values used by this tree.
function _buildTreeItemTooltip(item) {
  var activeFeatures = (dt.selectedFeatures && dt.selectedFeatures.size > 0)
    ? FEATURES.filter(function(f) { return dt.selectedFeatures.has(f.key); })
    : FEATURES;
  var html = '<strong>' + _esc(item.name) + '</strong>';
  activeFeatures.forEach(function(f) {
    var val = _fval(item, f.key);
    if (val == null) return;
    html += '<span><em>' + _esc(f.label || f.key) + ':</em> ' + _esc(String(val)) + '</span>';
  });
  return html;
}

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

// ══════════════════════════════════════════════════
//  PHASE 4 — TEST YOUR MODEL
// ══════════════════════════════════════════════════

// Floating tooltip element (created once, reused)
var _dtTooltipEl = null;

function _getOrCreateTooltip() {
  if (!_dtTooltipEl) {
    _dtTooltipEl = document.getElementById('dt-float-tooltip');
  }
  return _dtTooltipEl;
}

function _showTestTooltip(e, html) {
  var el = _getOrCreateTooltip();
  if (!el) return;
  el.innerHTML = html;
  el.style.display = 'block';
  _moveTestTooltip(e);
}

function _moveTestTooltip(e) {
  var el = _getOrCreateTooltip();
  if (!el || el.style.display === 'none') return;
  var x = e.clientX + 14;
  var y = e.clientY - 12;
  var w = el.offsetWidth;
  var h = el.offsetHeight;
  if (x + w > window.innerWidth  - 8) x = e.clientX - w - 14;
  if (y + h > window.innerHeight - 8) y = e.clientY - h - 12;
  el.style.left = x + 'px';
  el.style.top  = y + 'px';
}

function _hideTestTooltip() {
  var el = _getOrCreateTooltip();
  if (el) el.style.display = 'none';
}

// Get icon from TEST_ICONS (falls back to a plain circle)
function _getTestIcon(id) {
  return (typeof TEST_ICONS !== 'undefined' && TEST_ICONS[id])
    ? TEST_ICONS[id]
    : '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="30" fill="#555"/></svg>';
}

// Walk the built decision tree for one item; returns true = YES, false = NO
function _classify(node, item) {
  if (node.isLeaf) return node.label === 'yes';
  var val    = _fval(item, node.feature);
  var goLeft = node.isNumeric
    ? (Number(val) <= node.splitVal)
    : (String(val) === String(node.splitVal));
  return _classify(goLeft ? node.left : node.right, item);
}

// ── Entry points ──────────────────────────────────
function dtGoToTest() {
  if (!dt.tree) return;
  if (typeof TEST_ITEMS === 'undefined' || !TEST_ITEMS.length) {
    alert('test_data.js not loaded — make sure it is included before data.js.');
    return;
  }
  document.getElementById('dt-test-question').textContent = '\u201c' + dt.question + '\u201d';
  _showPhase('test');
  dtRunTest();
}

function dtGoBackToTree() {
  _showPhase('tree');
}

// ── Main animation loop ───────────────────────────
function dtRunTest() {
  if (!dt.tree || typeof TEST_ITEMS === 'undefined') return;

  // Reset buckets and summary
  document.getElementById('dt-bucket-yes-items').innerHTML = '';
  document.getElementById('dt-bucket-no-items').innerHTML  = '';
  document.getElementById('dt-bucket-yes-count').textContent = '0';
  document.getElementById('dt-bucket-no-count').textContent  = '0';
  document.getElementById('dt-test-summary').classList.add('hidden');
  document.getElementById('dt-replay-btn').classList.add('hidden');
  document.getElementById('dt-test-switch-hint').classList.add('hidden');
  dt.testCorrections = {};
  var _retrainBtn = document.getElementById('dt-test-retrain-btn');
  if (_retrainBtn) _retrainBtn.classList.remove('dt-retrain-glow');

  // Pre-classify all test items
  var results = TEST_ITEMS.map(function(item) {
    return { item: item, isYes: _classify(dt.tree, item) };
  });

  var yesCount = 0;
  var noCount  = 0;
  var flyer    = document.getElementById('dt-test-flyer');

  // Start hidden
  flyer.style.transition = 'none';
  flyer.style.opacity    = '0';
  flyer.style.transform  = 'scale(0)';

  function runNext(i) {
    if (i >= results.length) {
      // All done — hide flyer, show summary
      flyer.style.transition = 'opacity 0.2s ease';
      flyer.style.opacity    = '0';

      var summary = document.getElementById('dt-test-summary');
      var bucketLine =
        '<span class="dt-test-sum-yes">' + yesCount + ' &#10142; YES &#10003;</span>' +
        '&nbsp;&nbsp;&nbsp;' +
        '<span class="dt-test-sum-no">' + noCount + ' &#10142; NO &#10007;</span>';

      if (dt.labelFeature && dt.labelValue !== '') {
        // Feature mode — we have ground truth, show real accuracy
        var totalTest   = TEST_ITEMS.length;
        var correctTest = TEST_ITEMS.filter(function(ti) {
          var predicted    = _classify(dt.tree, ti);
          var groundTruth  = String(_fval(ti, dt.labelFeature)) === String(dt.labelValue);
          return predicted === groundTruth;
        }).length;
        var testPct   = Math.round(correctTest / totalTest * 100);
        var testColor = _accColor(testPct);
        var testMsg   = _accMsg(testPct);
        summary.innerHTML =
          '<div class="dt-test-acc-card">' +
            '<div class="dt-test-acc-headline" style="color:' + testColor + '">' +
              '🎯 ' + correctTest + ' out of ' + totalTest + ' correct! (' + testPct + '%)' +
            '</div>' +
            '<div class="dt-test-acc-bar-wrap">' +
              '<div class="dt-test-acc-bar-fill" style="width:' + testPct + '%;background:' + testColor + '"></div>' +
            '</div>' +
            '<div class="dt-test-acc-sub">' + testMsg + '</div>' +
            '<div style="margin-top:4px">' + bucketLine + '</div>' +
          '</div>';
      } else {
        // Question mode — no ground truth, show bucket counts only
        summary.innerHTML = bucketLine;
      }
      summary.classList.remove('hidden');
      document.getElementById('dt-replay-btn').classList.remove('hidden');
      document.getElementById('dt-test-switch-hint').classList.remove('hidden');
      return;
    }

    var res   = results[i];
    var item  = res.item;
    var isYes = res.isYes;

    // ─── 1. Appear in center ─────────────────────
    flyer.style.transition = 'none';
    flyer.style.transform  = 'scale(0)';
    flyer.style.opacity    = '0';
    flyer.innerHTML        = _getTestIcon(item.id);

    // Force reflow so transition registers
    flyer.offsetHeight;

    flyer.style.transition = 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease';
    flyer.style.transform  = 'scale(1)';
    flyer.style.opacity    = '1';

    // ─── 2. Fly to bucket after 650ms ────────────
    setTimeout(function() {
      var flyerRect  = flyer.getBoundingClientRect();
      var targetEl   = document.getElementById(isYes ? 'dt-bucket-yes-items' : 'dt-bucket-no-items');
      var targetRect = targetEl.getBoundingClientRect();

      var flyerCX  = flyerRect.left  + flyerRect.width  / 2;
      var flyerCY  = flyerRect.top   + flyerRect.height / 2;
      var targetCX = targetRect.left + targetRect.width  / 2;
      var targetCY = targetRect.top  + targetRect.height / 2;

      var dx = targetCX - flyerCX;
      var dy = targetCY - flyerCY;

      flyer.style.transition = 'transform 0.42s cubic-bezier(0.4,0,1,1), opacity 0.32s ease 0.12s';
      flyer.style.transform  = 'translate(' + dx + 'px,' + dy + 'px) scale(0.38)';
      flyer.style.opacity    = '0';

      // ─── 3. Land in bucket after fly ──────────
      setTimeout(function() {
        if (isYes) yesCount++;
        else       noCount++;

        // Update count label
        document.getElementById(isYes ? 'dt-bucket-yes-count' : 'dt-bucket-no-count')
          .textContent = String(isYes ? yesCount : noCount);

        // Build tooltip HTML
        var tooltipHtml = '<strong>' + _esc(item.name) + '</strong>' +
          FEATURES.map(function(f) {
            var val = f.type === 'boolean'
              ? (item[f.key] ? _esc(f.trueLabel)  : _esc(f.falseLabel))
              : _esc(String(item[f.key] !== undefined ? item[f.key] : '\u2014'));
            return '<span><em>' + _esc(f.label) + '</em>: ' + val + '</span>';
          }).join('');

        // Create mini icon element
        var mini = document.createElement('div');
        mini.className = 'dt-test-mini';
        mini.innerHTML = _getTestIcon(item.id);
        mini.dataset.itemId = String(item.id);
        mini.dataset.isYes  = isYes ? '1' : '0';
        dt.testCorrections[item.id] = isYes;

        // ── Correct / incorrect badge (feature mode only) ──
        if (dt.labelFeature && dt.labelValue !== '') {
          var groundTruth = String(_fval(item, dt.labelFeature)) === String(dt.labelValue);
          var isCorrect   = (isYes === groundTruth);
          mini.classList.add(isCorrect ? 'dt-test-mini--correct' : 'dt-test-mini--incorrect');
          var badge = document.createElement('div');
          badge.className = 'dt-mini-badge ' + (isCorrect ? 'dt-mini-badge--correct' : 'dt-mini-badge--incorrect');
          badge.textContent = isCorrect ? '✓' : '✗';
          mini.appendChild(badge);
        }

        mini.addEventListener('mouseenter', function(e) { _showTestTooltip(e, tooltipHtml); });
        mini.addEventListener('mousemove',  _moveTestTooltip);
        mini.addEventListener('mouseleave', _hideTestTooltip);
        (function(capturedId) {
          mini.addEventListener('click', function() { _hideTestTooltip(); dtSwitchBucket(capturedId); });
        })(item.id);

        document.getElementById(isYes ? 'dt-bucket-yes-items' : 'dt-bucket-no-items')
          .appendChild(mini);

        // Flash bucket border
        var bucket = document.getElementById(isYes ? 'dt-bucket-yes' : 'dt-bucket-no');
        bucket.classList.add('dt-bucket-flash');
        setTimeout(function() { bucket.classList.remove('dt-bucket-flash'); }, 420);

        // ─── 4. Next item ──────────────────────
        setTimeout(function() { runNext(i + 1); }, 180);
      }, 460);
    }, 650);
  }

  runNext(0);
}

// ── Switch a test item between YES / NO buckets ───
function dtSwitchBucket(itemId) {
  var yesEl = document.getElementById('dt-bucket-yes-items');
  var noEl  = document.getElementById('dt-bucket-no-items');
  var mini  = yesEl.querySelector('[data-item-id="' + itemId + '"]') ||
               noEl.querySelector('[data-item-id="' + itemId + '"]');
  if (!mini) return;

  var wasYes = mini.dataset.isYes === '1';
  var nowYes = !wasYes;

  (wasYes ? yesEl : noEl).removeChild(mini);
  mini.dataset.isYes = nowYes ? '1' : '0';
  (nowYes ? yesEl : noEl).appendChild(mini);

  dt.testCorrections[itemId] = nowYes;

  // Update per-bucket counts
  var newYes = yesEl.children.length;
  var newNo  = noEl.children.length;
  document.getElementById('dt-bucket-yes-count').textContent = newYes;
  document.getElementById('dt-bucket-no-count').textContent  = newNo;

  // Update bottom summary bar if it's visible
  var summary = document.getElementById('dt-test-summary');
  if (summary && !summary.classList.contains('hidden')) {
    summary.innerHTML =
      '<span class="dt-test-sum-yes">' + newYes + ' &#10142; YES &#10003;</span>' +
      '&nbsp;&nbsp;&nbsp;' +
      '<span class="dt-test-sum-no">' + newNo + ' &#10142; NO &#10007;</span>';
  }

  // Flash destination bucket
  var dest = document.getElementById(nowYes ? 'dt-bucket-yes' : 'dt-bucket-no');
  dest.classList.add('dt-bucket-flash');
  setTimeout(function() { dest.classList.remove('dt-bucket-flash'); }, 420);

  // Glow the Retrain button
  var retrainBtn = document.getElementById('dt-test-retrain-btn');
  if (retrainBtn) retrainBtn.classList.add('dt-retrain-glow');
}

// ── Retrain using original labels + test corrections ─
function dtRetrainWithCorrections() {
  // Add any test items to the training pool (avoid duplicates)
  if (typeof TEST_ITEMS !== 'undefined') {
    TEST_ITEMS.forEach(function(ti) {
      if (!dt.trainingItems.some(function(tr) { return tr.id === ti.id; })) {
        dt.trainingItems.push(ti);
      }
    });
  }

  // Merge test corrections into dt.labels
  Object.keys(dt.testCorrections).forEach(function(id) {
    dt.labels[id] = dt.testCorrections[id];
  });

  // _showPhase('building') triggers _trainAndShow after a short delay,
  // which reads dt.trainingItems + dt.labels — now includes test data
  _showPhase('building');
}
