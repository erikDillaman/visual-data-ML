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
  testCorrections:     {},  // itemId -> leafLabel string, set after test animation
  testItemLeafIds:     {},  // itemId -> leaf._testId, tracks which leaf each test item landed in
  selectedFeatures:    null, // Set of feature keys to use for splits (null = all)
  forcedFeatureKey:    null, // feature key that must appear in next tree build
  _unclassifiedGroups: [], // items pruned from tree — displayed as floating nodes
  _nodeMap:            {}, // nodeId -> node, rebuilt on each render
  _parentMap:          {}, // nodeId -> {parentId, side}, rebuilt on each render
};

let _dragStartX  = null;
let _dragDelta   = 0;
let _swiping     = false;  // debounce
let _dtMode      = 'question'; // 'question' | 'feature'
let _dtNavigating = false;    // true while _navigateToStep is running
let _testSvgClickHandler = null; // click handler for misclassification selection

// ── Multi-class color palette ─────────────────────
var _CLASS_PALETTE = [
  { bg: 'rgba(22,101,52,0.55)',  border: '#4ade80', text: '#4ade80'  }, // green (yes / class 0)
  { bg: 'rgba(127,29,29,0.55)', border: '#f87171', text: '#f87171'  }, // red   (no  / class 1)
  { bg: 'rgba(30,64,175,0.5)',  border: '#60a5fa', text: '#93c5fd'  }, // blue
  { bg: 'rgba(180,83,9,0.5)',   border: '#fbbf24', text: '#fde68a'  }, // amber
  { bg: 'rgba(109,40,217,0.5)', border: '#a855f7', text: '#d8b4fe'  }, // purple
  { bg: 'rgba(21,94,117,0.5)',  border: '#22d3ee', text: '#67e8f9'  }, // cyan
  { bg: 'rgba(159,18,57,0.5)',  border: '#fb7185', text: '#fda4af'  }, // rose
  { bg: 'rgba(124,45,18,0.5)',  border: '#fb923c', text: '#fdba74'  }, // orange
];

function _buildClassColorMap(labels) {
  var map = {};
  // Binary: always keep yes=green, no=red
  if (labels.indexOf('yes') !== -1 && labels.indexOf('no') !== -1 && labels.length === 2) {
    map['yes'] = 0; map['no'] = 1; return map;
  }
  var sorted = labels.slice().sort();
  sorted.forEach(function(l, i) { map[l] = i; });
  return map;
}

function _labelCounts(items) {
  var counts = {};
  items.forEach(function(i) {
    var l = String(i._label);
    counts[l] = (counts[l] || 0) + 1;
  });
  return counts;
}

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
  ['question', 'features', 'swipe', 'building', 'tree', 'test', 'improve'].forEach(p => {
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
  if (phase === 'improve') {
    _renderImprovePhase();
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
    improve:  6,
  };
  const active = steps[phase] || 1;

  [1, 2, 3, 4, 5, 6].forEach(function(n) {
    const el = document.getElementById('dt-step-' + n);
    if (!el) return;
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
    case 6: return dt.tree !== null;
    default: return false;
  }
}

function _navigateToStep(n) {
  const phaseMap = { 1: 'question', 2: 'features', 3: 'swipe', 4: 'tree', 5: 'test', 6: 'improve' };
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
  var feat = document.getElementById('dt-feature-select').value;
  var hint = document.getElementById('dt-feature-hint');
  if (!feat) { if (hint) hint.classList.add('hidden'); return; }
  var classes = Array.from(new Set(ITEMS.map(function(item) { return _fval(item, feat); })))
    .filter(function(v) { return v != null; }).sort();
  if (hint) {
    hint.textContent = classes.length + ' classes found: ' + classes.join(', ') +
      ' — all items will be labeled automatically.';
    hint.classList.remove('hidden');
  }
}

function dtStartTraining() {
  if (_dtMode === 'feature') {
    var feat = document.getElementById('dt-feature-select').value;
    if (!feat) { alert('Please select a feature!'); return; }
    var featLabel = _FEAT_LABEL()[feat] || feat;
    dt.question     = 'What ' + featLabel + ' is this?';
    dt.labelFeature = feat;
    dt.labelValue   = '';  // multi-class: no single YES value
    dt.labels       = {};
    ITEMS.forEach(function(item) {
      var v = _fval(item, feat);
      dt.labels[item.id] = (v != null) ? String(v) : '';
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

// Gini impurity: 0 = perfectly pure, higher = more mixed (multi-class generalization)
function _gini(items) {
  if (!items.length) return 0;
  var counts = _labelCounts(items);
  var n = items.length;
  var sum = 0;
  Object.keys(counts).forEach(function(k) { var p = counts[k] / n; sum += p * p; });
  return 1 - sum;
}

function _bestSplit(items, features) {
  var parentGini = _gini(items);
  var best = { gain: -1, feature: null, splitVal: null, isNumeric: false, math: null };

  features.forEach(function(feat) {
    var _fd = FEATURES.find(function(fd) { return fd.key === feat; });
    if (_fd && _fd.type === 'number') {
      var vals = Array.from(new Set(items.map(function(i) { return _fval(i, feat); }))).sort(function(a, b) { return a - b; });
      for (var k = 0; k < vals.length - 1; k++) {
        var thr    = (vals[k] + vals[k + 1]) / 2;
        var left   = items.filter(function(i) { return i.value <= thr; });
        var right  = items.filter(function(i) { return i.value > thr; });
        if (!left.length || !right.length) continue;
        var leftG  = _gini(left);
        var rightG = _gini(right);
        var totalG = (left.length / items.length) * leftG + (right.length / items.length) * rightG;
        var gain   = parentGini - totalG;
        if (gain > best.gain) {
          best = { gain: gain, feature: feat, splitVal: thr, isNumeric: true,
                   math: { parentGini: parentGini, leftGini: leftG, rightGini: rightG,
                           totalGini: totalG, leftN: left.length, rightN: right.length,
                           totalN: items.length,
                           leftCounts: _labelCounts(left), rightCounts: _labelCounts(right) } };
        }
      }
    } else {
      var unique = Array.from(new Set(items.map(function(i) { return _fval(i, feat); })));
      unique.forEach(function(v) {
        var left   = items.filter(function(i) { return _fval(i, feat) === v; });
        var right  = items.filter(function(i) { return _fval(i, feat) !== v; });
        if (!left.length || !right.length) return;
        var leftG  = _gini(left);
        var rightG = _gini(right);
        var totalG = (left.length / items.length) * leftG + (right.length / items.length) * rightG;
        var gain   = parentGini - totalG;
        if (gain > best.gain) {
          best = { gain: gain, feature: feat, splitVal: v, isNumeric: false,
                   math: { parentGini: parentGini, leftGini: leftG, rightGini: rightG,
                           totalGini: totalG, leftN: left.length, rightN: right.length,
                           totalN: items.length,
                           leftCounts: _labelCounts(left), rightCounts: _labelCounts(right) } };
        }
      });
    }
  });

  return best;
}

function _buildDTree(items, features, depth, maxDepth) {
  var labelCounts = _labelCounts(items);
  var classes = Object.keys(labelCounts);
  var majorityClass = classes.reduce(function(a, b) {
    return labelCounts[a] >= labelCounts[b] ? a : b;
  }, classes[0] || 'no');

  if (depth >= maxDepth || items.length < 2 || classes.length <= 1) {
    return { isLeaf: true, label: majorityClass, count: labelCounts, items: items };
  }

  var best = _bestSplit(items, features);
  if (best.gain <= 1e-9 || !best.feature) {
    return { isLeaf: true, label: majorityClass, count: labelCounts, items: items };
  }

  var leftItems, rightItems, condition;
  if (best.isNumeric) {
    leftItems  = items.filter(function(i) { return _fval(i, best.feature) <= best.splitVal; });
    rightItems = items.filter(function(i) { return _fval(i, best.feature) > best.splitVal; });
    condition  = (_FEAT_LABEL()[best.feature] || best.feature) + ' \u2264 ' + Math.round(best.splitVal);
  } else {
    leftItems  = items.filter(function(i) { return _fval(i, best.feature) === best.splitVal; });
    rightItems = items.filter(function(i) { return _fval(i, best.feature) !== best.splitVal; });
    var fl = _FEAT_LABEL()[best.feature] || best.feature;
    condition  = fl + ' = ' + best.splitVal;
  }

  var left  = _buildDTree(leftItems,  features, depth + 1, maxDepth);
  var right = _buildDTree(rightItems, features, depth + 1, maxDepth);

  if (left.isLeaf && right.isLeaf && left.label === right.label) {
    return { isLeaf: true, label: majorityClass, count: labelCounts, items: items };
  }

  return {
    isLeaf:    false,
    feature:   best.feature,
    splitVal:  best.splitVal,
    isNumeric: best.isNumeric,
    condition: condition,
    count:     labelCounts,
    items:     items,
    splitMath: best.math,
    left:      left,
    right:     right,
  };
}

function _trainAndShow() {
  dt._unclassifiedGroups = []; // fresh tree = no pruned groups
  // Only train on items that were actually labeled
  const labeledItems = dt.trainingItems.filter(function(item) {
    return item.id in dt.labels;
  });
  var trainingData = labeledItems.map(function(item) {
    var raw = dt.labels[item.id];
    // Feature mode: labels are class strings. Question mode: booleans → 'yes'/'no'.
    var label = (dt.labelFeature && dt.labelValue === '') ? String(raw) : (raw === true ? 'yes' : 'no');
    return Object.assign({}, item, { _label: label });
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

  // If a new feature was just added via the leaf flow, guarantee it appears
  // in the tree even if its Gini gain wasn't the highest at every split.
  if (dt.forcedFeatureKey) {
    _ensureForcedFeature(dt.tree, dt.forcedFeatureKey);
    dt.forcedFeatureKey = null;
  }

  _showPhase('tree');
}

// ── Accuracy helpers ──────────────────────────────
function _computeTrainAccuracy() {
  var labeled = Object.keys(dt.labels);
  if (!labeled.length || !dt.tree) return null;
  var correct = labeled.filter(function(id) {
    var item = dt.trainingItems.find(function(i) { return i.id == id; });
    if (!item) return false;
    var predicted = _classify(dt.tree, item); // leaf label string
    var actual = dt.labels[id];
    if (typeof actual === 'boolean') return predicted === (actual ? 'yes' : 'no');
    return String(predicted) === String(actual);
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
  var mathToggleBtn = document.getElementById('dt-math-toggle');
  if (mathToggleBtn) {
    mathToggleBtn.classList.remove('active');
    mathToggleBtn.textContent = 'Show Math';
  }
  var mathPanel = document.getElementById('dt-math-panel');
  if (mathPanel) mathPanel.classList.add('hidden');

  document.getElementById('dt-tree-question').textContent = '\u201c' + dt.question + '\u201d';

  // Update tree legend based on mode
  var legendEl = document.getElementById('dt-tree-legend');
  var isMultiClass = (dt.labelFeature && dt.labelValue === '');
  if (legendEl) {
    if (isMultiClass) {
      legendEl.innerHTML = '<span class="dt-leg-split">\u25c7 Decision Split \u2014 TRUE goes left, FALSE goes right</span>' +
        '<span class="dt-leg-yes">\u25cb Class Leaf \u2014 majority class shown</span>';
    } else {
      legendEl.innerHTML = '<span class="dt-leg-split">\u25c7 Decision Split \u2014 TRUE goes left, FALSE goes right</span>' +
        '<span class="dt-leg-yes">\u2713 YES Leaf</span>' +
        '<span class="dt-leg-no">\u2717 NO Leaf</span>';
    }
  }

  // Check edge case: all same label among labeled items
  var labeledIds = Object.keys(dt.labels);
  var uniqueClasses = Array.from(new Set(labeledIds.map(function(id) { return String(dt.labels[id]); })));
  var container = document.getElementById('dt-tree-scroll');

  // Update the note with actual count
  var count = labeledIds.length;
  document.getElementById('dt-tree-note').innerHTML =
    'Trained on your <strong>' + count + ' labeled example' + (count !== 1 ? 's' : '') + '</strong>.' +
    '<span class="dt-note-tips">' +
      '<span>Hover items for details</span>' +
      '<span>Click a split node to collapse it</span>' +
      '<span>Click TRUE or FALSE to prune a branch</span>' +
    '</span>';

  if (uniqueClasses.length <= 1) {
    var singleLabel = uniqueClasses[0] || 'YES';
    var isBinaryLabel = (singleLabel === 'yes' || singleLabel === 'no');
    var col = '#4ade80';
    var svg = document.getElementById('dt-tree-svg');
    svg.style.display = 'none';
    var msg = document.createElement('div');
    msg.className = 'dt-all-same';
    msg.innerHTML =
      '<span class="dt-all-same-emoji">⚠</span>' +
      '<h3 style="color:' + col + '">All items have the same label!</h3>' +
      '<p>' + (isBinaryLabel
        ? 'A decision tree needs both YES and NO examples to learn from. Try retraining and mix up your labels!'
        : 'All items are labeled <strong>' + _esc(singleLabel) + '</strong>. The tree needs items with different labels to make decisions!') + '</p>';
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

    // TRUE / FALSE badge (left = condition is TRUE, right = condition is FALSE)
    const lmx = (x1 + lx) / 2;
    const lmy = (y1 + ly) / 2;
    const rmx = (x1 + rx) / 2;
    const rmy = (y1 + ry) / 2;

    edgesSVG +=
      '<g data-prune-parent="' + node._id + '" data-prune-side="left" style="cursor:pointer">' +
        '<rect x="' + (lmx - 26) + '" y="' + (lmy - 14) + '" width="52" height="26" rx="13" fill="transparent"/>' +
        '<rect x="' + (lmx - 22) + '" y="' + (lmy - 12) + '" width="44" height="20" rx="10" ' +
          'fill="rgba(74,222,128,0.18)" stroke="#4ade80" stroke-width="1.2"/>' +
        '<text x="' + lmx + '" y="' + (lmy + 2) + '" text-anchor="middle" fill="#4ade80" ' +
          'font-size="10" font-weight="700" font-family="Segoe UI,system-ui,sans-serif">TRUE</text>' +
      '</g>';

    edgesSVG +=
      '<g data-prune-parent="' + node._id + '" data-prune-side="right" style="cursor:pointer">' +
        '<rect x="' + (rmx - 27) + '" y="' + (rmy - 14) + '" width="54" height="26" rx="13" fill="transparent"/>' +
        '<rect x="' + (rmx - 23) + '" y="' + (rmy - 12) + '" width="46" height="20" rx="10" ' +
          'fill="rgba(248,113,113,0.18)" stroke="#f87171" stroke-width="1.2"/>' +
        '<text x="' + rmx + '" y="' + (rmy + 2) + '" text-anchor="middle" fill="#f87171" ' +
          'font-size="10" font-weight="700" font-family="Segoe UI,system-ui,sans-serif">FALSE</text>' +
      '</g>';

    drawEdges(node.left);
    drawEdges(node.right);
  }

  // Build color map from all class labels in this tree
  var _classLabels = [];
  (function collectLabels(node) {
    if (!node) return;
    if (node.isLeaf) {
      Object.keys(node.count).forEach(function(k) {
        if (_classLabels.indexOf(k) === -1) _classLabels.push(k);
      });
    } else { collectLabels(node.left); collectLabels(node.right); }
  })(dt.tree);
  var _colorMap = _buildClassColorMap(_classLabels);

  function drawNodes(node) {
    var ff = 'font-family="Segoe UI,system-ui,sans-serif"';

    if (node.isLeaf) {
      var colorIdx = (_colorMap[node.label] !== undefined) ? _colorMap[node.label] : 0;
      var palette  = _CLASS_PALETTE[colorIdx % _CLASS_PALETTE.length];
      var bg     = palette.bg;
      var border = palette.border;
      var col    = palette.text;
      var isBinary = (node.label === 'yes' || node.label === 'no');
      var symbol = isBinary
        ? (node.label === 'yes' ? '\u2713 YES' : '\u2717 NO')
        : node.label.toUpperCase();
      var countLine = Object.keys(node.count).map(function(k) {
        return node.count[k] + '\u00a0' + k;
      }).join('\u2002\u00b7\u2002');

      // Icon grid layout
      var ICON_S = 22, ICON_G = 3;
      var maxPerRow = Math.max(1, Math.floor((LW - 16) / (ICON_S + ICON_G)));
      var iconRows  = node.items.length ? Math.ceil(node.items.length / maxPerRow) : 0;
      var nodeH     = 52 + iconRows * (ICON_S + ICON_G) + (iconRows ? 8 : 0);
      maxLeafH = Math.max(maxLeafH, nodeH);

      nodesSVG +=
        '<rect x="' + node._x + '" y="' + node._y + '" width="' + LW + '" height="' + nodeH + '" rx="13" ' +
          'fill="' + bg + '" stroke="' + border + '" stroke-width="2"/>' +
        '<text x="' + node._cx + '" y="' + (node._y + 26) + '" text-anchor="middle" fill="' + col + '" ' +
          'font-size="18" font-weight="900" ' + ff + '>' + _escSvg(symbol) + '</text>' +
        '<text x="' + node._cx + '" y="' + (node._y + 44) + '" text-anchor="middle" fill="#aaaacc" ' +
          'font-size="10" ' + ff + '>' + _escSvg(countLine) + '</text>';

      node.items.forEach(function(item, idx) {
        var row      = Math.floor(idx / maxPerRow);
        var colIdx   = idx % maxPerRow;
        var rowStart = row * maxPerRow;
        var rowCount = Math.min(maxPerRow, node.items.length - rowStart);
        var rowW     = rowCount * ICON_S + (rowCount - 1) * ICON_G;
        var ix       = node._x + (LW - rowW) / 2 + colIdx * (ICON_S + ICON_G);
        var iy       = node._y + 52 + row * (ICON_S + ICON_G);
        var uri      = 'data:image/svg+xml,' + encodeURIComponent(getIcon(item.id));
        nodesSVG +=
          '<g data-item-id="' + _escSvg(String(item.id)) + '" style="cursor:pointer">' +
            '<rect x="' + (ix - 1) + '" y="' + (iy - 1) + '" width="' + (ICON_S + 2) + '" height="' + (ICON_S + 2) + '" rx="3" ' +
              'fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>' +
            '<image href="' + uri + '" x="' + ix + '" y="' + iy + '" width="' + ICON_S + '" height="' + ICON_S + '"/>' +
          '</g>';
      });
    } else {
      // Condition text: split long conditions to two tspan lines if needed
      var cond    = node.condition;
      var condLen = cond.length;
      var condSVG;
      if (condLen <= 20) {
        condSVG =
          '<text x="' + node._cx + '" y="' + (node._y + 38) + '" text-anchor="middle" fill="#e8e8f0" ' +
            'font-size="13" font-weight="700" ' + ff + '>' + _escSvg(cond) + '?</text>';
      } else {
        // Break at = or ≤
        var breakAt = cond.indexOf(' = ') !== -1 ? cond.indexOf(' = ') + 3
                    : cond.indexOf(' \u2264 ') !== -1 ? cond.indexOf(' \u2264 ') + 3
                    : Math.floor(condLen / 2);
        var line1 = cond.slice(0, breakAt).trim();
        var line2 = cond.slice(breakAt).trim() + '?';
        condSVG =
          '<text x="' + node._cx + '" y="' + (node._y + 27) + '" text-anchor="middle" fill="#e8e8f0" ' +
            'font-size="12" font-weight="700" ' + ff + '>' + _escSvg(line1) + '</text>' +
          '<text x="' + node._cx + '" y="' + (node._y + 44) + '" text-anchor="middle" fill="#e8e8f0" ' +
            'font-size="12" font-weight="700" ' + ff + '>' + _escSvg(line2) + '</text>';
      }
      var totalCount = Object.keys(node.count).reduce(function(s, k) { return s + node.count[k]; }, 0);

      nodesSVG +=
        '<g data-collapse-id="' + node._id + '" style="cursor:pointer">' +
          '<rect x="' + node._x + '" y="' + node._y + '" width="' + NW + '" height="' + NH + '" rx="11" ' +
            'fill="rgba(26,10,58,0.92)" stroke="#7c3aed" stroke-width="1.8"/>' +
          condSVG +
          '<text x="' + node._cx + '" y="' + (node._y + 64) + '" text-anchor="middle" fill="#555577" ' +
            'font-size="9" ' + ff + '>' + totalCount + ' items</text>' +
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

  var svg = document.getElementById('dt-tree-svg');
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

  // ── Training accuracy banner (feature mode only) ─────────────────────
  // In question mode there is no ground truth, so accuracy is meaningless.
  var accBanner = document.getElementById('dt-train-accuracy');
  if (accBanner) {
    if (!dt.labelFeature) {
      accBanner.classList.add('hidden');
    } else {
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

  // Majority class determines the leaf label from items' _label field
  var _cc = {};
  node.items.forEach(function(i) {
    var l = String(i._label);
    _cc[l] = (_cc[l] || 0) + 1;
  });
  var _ck = Object.keys(_cc);
  node.label  = _ck.reduce(function(a, b) { return _cc[a] >= _cc[b] ? a : b; }, _ck[0] || 'no');
  node.count  = _cc;
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

  function _countsLine(counts) {
    return Object.keys(counts).map(function(k) { return counts[k] + '\u00a0' + k; }).join(' | ');
  }

  function walkNode(node, path) {
    if (node.isLeaf || !node.splitMath) return;
    splitNum++;
    var m  = node.splitMath;
    var n  = m.totalN;
    var parentCounts = node.count;

    var parentCountLine = _countsLine(parentCounts);
    var leftCountLine   = _countsLine(m.leftCounts  || {});
    var rightCountLine  = _countsLine(m.rightCounts || {});

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
            _esc(parentCountLine) + ' of ' + n + ' items' +
            ' &nbsp;&rarr;&nbsp; ' +
            'Gini = <strong>' + m.parentGini.toFixed(4) + '</strong>' +
          '</span>' +
        '</div>' +
        '<div class="math-row math-row-yes">' +
          '<span class="math-label">TRUE branch</span>' +
          '<span class="math-formula">' +
            _esc(leftCountLine) + ' of ' + m.leftN + ' items' +
            ' &nbsp;&rarr;&nbsp; ' +
            'Gini = <strong>' + m.leftGini.toFixed(4) + '</strong>' +
          '</span>' +
        '</div>' +
        '<div class="math-row math-row-no">' +
          '<span class="math-label">FALSE branch</span>' +
          '<span class="math-formula">' +
            _esc(rightCountLine) + ' of ' + m.rightN + ' items' +
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

    walkNode(node.left,  path + ' \u2192 TRUE');
    walkNode(node.right, path + ' \u2192 FALSE');
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

// Walk the built decision tree for one item; returns the leaf label string ('yes'/'no' or class name)
function _classify(node, item) {
  if (node.isLeaf) return node.label;
  var val    = _fval(item, node.feature);
  var goLeft = node.isNumeric
    ? (Number(val) <= node.splitVal)
    : (String(val) === String(node.splitVal));
  return _classify(goLeft ? node.left : node.right, item);
}

// ── Return ordered node list from root → leaf for one item ───────────────
function _computePath(tree, item) {
  var path = [];
  var node = tree;
  while (node) {
    path.push(node);
    if (node.isLeaf) break;
    var val    = _fval(item, node.feature);
    var goLeft = node.isNumeric
      ? (Number(val) <= node.splitVal)
      : (String(val) === String(node.splitVal));
    node = goLeft ? node.left : node.right;
  }
  return path;
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

// ── Render a read-only tree SVG for step 5 ────────────────────────────────
// leafCounts: { _testId → expected landing count } used to pre-size leaf rects.
function _renderTestTree(leafCounts) {
  leafCounts = leafCounts || {};
  var NW = 210, NH = 76;
  var LW = 178;
  var LH_BASE = 52; // leaf height with no icons (matches training tree base)
  var HGAP = 28, VGAP = 82;
  var PAD = 28;
  var ICON_S = 22, ICON_G = 3;
  var maxPerRow = Math.max(1, Math.floor((LW - 16) / (ICON_S + ICON_G)));
  var ff = 'font-family="Segoe UI,system-ui,sans-serif"';

  // Assign test-phase node IDs (separate from _id used in step 4)
  var _nid = 0;
  (function assignTestIds(node) {
    node._testId = ++_nid;
    if (!node.isLeaf) { assignTestIds(node.left); assignTestIds(node.right); }
  })(dt.tree);

  // Assign layout positions
  var leafIdx = 0;
  function assignPos(node, depth) {
    node._depth = depth;
    if (node.isLeaf) {
      node._x    = PAD + leafIdx * (LW + HGAP);
      node._y    = PAD + depth * (NH + VGAP);
      node._cx   = node._x + LW / 2;
      var cnt    = leafCounts[node._testId] || 0;
      var rows   = cnt ? Math.ceil(cnt / maxPerRow) : 0;
      node._testH = LH_BASE + rows * (ICON_S + ICON_G) + (rows ? 8 : 0);
      leafIdx++;
    } else {
      assignPos(node.left,  depth + 1);
      assignPos(node.right, depth + 1);
      node._cx   = (node.left._cx + node.right._cx) / 2;
      node._x    = node._cx - NW / 2;
      node._y    = PAD + depth * (NH + VGAP);
      node._testH = NH;
    }
  }
  assignPos(dt.tree, 0);

  var depth    = _treeDepth(dt.tree);
  var svgW     = PAD + leafIdx * (LW + HGAP) - HGAP + PAD;
  var maxLeafH = 88; // minimum canvas height (matches _renderTree)
  (function scanH(n) {
    if (n.isLeaf) { maxLeafH = Math.max(maxLeafH, n._testH); }
    else { scanH(n.left); scanH(n.right); }
  })(dt.tree);
  var svgH = PAD + depth * (NH + VGAP) + maxLeafH + PAD;

  var edgesSVG = '', nodesSVG = '';

  function drawEdges(node) {
    if (node.isLeaf) return;
    var x1 = node._cx, y1 = node._y + NH;
    var lx = node.left._cx,  ly = node.left._y;
    var rx = node.right._cx, ry = node.right._y;
    var lPath = 'M '+x1+' '+y1+' C '+x1+' '+((y1+ly)/2)+' '+lx+' '+((y1+ly)/2)+' '+lx+' '+ly;
    var rPath = 'M '+x1+' '+y1+' C '+x1+' '+((y1+ry)/2)+' '+rx+' '+((y1+ry)/2)+' '+rx+' '+ry;
    edgesSVG +=
      '<path d="'+lPath+'" stroke="#7c3aed" stroke-width="2" fill="none" opacity="0.5"/>'+
      '<path d="'+rPath+'" stroke="#7c3aed" stroke-width="2" fill="none" opacity="0.5"/>';
    var lmx = (x1+lx)/2, lmy = (y1+ly)/2;
    var rmx = (x1+rx)/2, rmy = (y1+ry)/2;
    edgesSVG +=
      '<rect x="'+(lmx-22)+'" y="'+(lmy-12)+'" width="44" height="20" rx="10" fill="rgba(74,222,128,0.18)" stroke="#4ade80" stroke-width="1.2"/>'+
      '<text x="'+lmx+'" y="'+(lmy+2)+'" text-anchor="middle" fill="#4ade80" font-size="10" font-weight="700" '+ff+'>TRUE</text>'+
      '<rect x="'+(rmx-23)+'" y="'+(rmy-12)+'" width="46" height="20" rx="10" fill="rgba(248,113,113,0.18)" stroke="#f87171" stroke-width="1.2"/>'+
      '<text x="'+rmx+'" y="'+(rmy+2)+'" text-anchor="middle" fill="#f87171" font-size="10" font-weight="700" '+ff+'>FALSE</text>';
    drawEdges(node.left);
    drawEdges(node.right);
  }

  // Build color map for test tree
  var _testClassLabels = [];
  (function collectTestLabels(node) {
    if (!node) return;
    if (node.isLeaf) {
      Object.keys(node.count).forEach(function(k) {
        if (_testClassLabels.indexOf(k) === -1) _testClassLabels.push(k);
      });
    } else { collectTestLabels(node.left); collectTestLabels(node.right); }
  })(dt.tree);
  var _testColorMap = _buildClassColorMap(_testClassLabels);

  function drawNodes(node) {
    if (node.isLeaf) {
      var _tColorIdx = (_testColorMap[node.label] !== undefined) ? _testColorMap[node.label] : 0;
      var _tPalette  = _CLASS_PALETTE[_tColorIdx % _CLASS_PALETTE.length];
      var bg  = _tPalette.bg;
      var bdr = _tPalette.border;
      var col = _tPalette.text;
      var isBinary = (node.label === 'yes' || node.label === 'no');
      var sym = isBinary ? (node.label === 'yes' ? '\u2713 YES' : '\u2717 NO') : node.label.toUpperCase();
      nodesSVG +=
        '<rect data-test-node-id="'+node._testId+'" x="'+node._x+'" y="'+node._y+
          '" width="'+LW+'" height="'+node._testH+'" rx="13"'+
          ' fill="'+bg+'" stroke="'+bdr+'" stroke-width="2"/>'+
        '<text x="'+node._cx+'" y="'+(node._y+26)+'" text-anchor="middle" fill="'+col+
          '" font-size="18" font-weight="900" '+ff+'>'+_escSvg(sym)+'</text>'+
        '<text data-test-count-id="'+node._testId+'" x="'+node._cx+'" y="'+(node._y+44)+'" text-anchor="middle" fill="#aaaacc"'+
          ' font-size="10" '+ff+'></text>';
    } else {
      var cond = node.condition;
      var condSVG;
      if (cond.length <= 20) {
        condSVG =
          '<text x="'+node._cx+'" y="'+(node._y+38)+'" text-anchor="middle" fill="#e8e8f0"'+
          ' font-size="13" font-weight="700" '+ff+'>'+_escSvg(cond)+'?</text>';
      } else {
        var brk = cond.indexOf(' = ') !== -1 ? cond.indexOf(' = ')+3
                : cond.indexOf(' \u2264 ') !== -1 ? cond.indexOf(' \u2264 ')+3
                : Math.floor(cond.length/2);
        condSVG =
          '<text x="'+node._cx+'" y="'+(node._y+27)+'" text-anchor="middle" fill="#e8e8f0"'+
          ' font-size="12" font-weight="700" '+ff+'>'+_escSvg(cond.slice(0,brk).trim())+'</text>'+
          '<text x="'+node._cx+'" y="'+(node._y+44)+'" text-anchor="middle" fill="#e8e8f0"'+
          ' font-size="12" font-weight="700" '+ff+'>'+_escSvg(cond.slice(brk).trim())+'?</text>';
      }
      nodesSVG +=
        '<rect data-test-node-id="'+node._testId+'" x="'+node._x+'" y="'+node._y+
          '" width="'+NW+'" height="'+NH+'" rx="11"'+
          ' fill="rgba(26,10,58,0.92)" stroke="#7c3aed" stroke-width="1.8"/>'+
        condSVG+
        '<text x="'+node._cx+'" y="'+(node._y+64)+'" text-anchor="middle" fill="#555577"'+
          ' font-size="9" '+ff+'>'+node.items.length+' items</text>';
      drawNodes(node.left);
      drawNodes(node.right);
    }
  }

  drawEdges(dt.tree);
  drawNodes(dt.tree);

  var svgEl = document.getElementById('dt-test-tree-svg');
  svgEl.setAttribute('width',   svgW);
  svgEl.setAttribute('height',  svgH);
  svgEl.setAttribute('viewBox', '0 0 '+svgW+' '+svgH);
  svgEl.innerHTML = edgesSVG + nodesSVG;

  // Hover tooltips for test item icons once they land in leaves (attach once)
  if (!svgEl.dataset.tooltipInit) {
    svgEl.dataset.tooltipInit = '1';
    svgEl.addEventListener('mousemove', function(e) {
      var el = e.target.closest('[data-item-id]');
      if (!el) { _hideTestTooltip(); return; }
      var id   = el.getAttribute('data-item-id');
      var item = (typeof TEST_ITEMS !== 'undefined') &&
                 TEST_ITEMS.find(function(i) { return String(i.id) === id; });
      if (!item) { _hideTestTooltip(); return; }
      _showTestTooltip(e, _buildTreeItemTooltip(item));
    });
    svgEl.addEventListener('mouseleave', function() { _hideTestTooltip(); });
  }
}

// ── Main animation loop ───────────────────────────
function dtRunTest() {
  if (!dt.tree || typeof TEST_ITEMS === 'undefined') return;

  dt.testCorrections    = {};
  dt.testMisclassified  = {};
  dt.testItemLeafIds    = {};
  var _retrainBtn = document.getElementById('dt-test-retrain-btn');
  if (_retrainBtn) _retrainBtn.classList.remove('dt-retrain-glow');
  document.getElementById('dt-test-summary').classList.add('hidden');
  document.getElementById('dt-replay-btn').classList.add('hidden');
  var _improveBtnEl = document.getElementById('dt-improve-btn');
  if (_improveBtnEl) _improveBtnEl.classList.add('hidden');
  document.getElementById('dt-test-select-hint').classList.add('hidden');
  document.getElementById('dt-test-misclass-section').classList.add('hidden');
  document.getElementById('dt-test-misclass-items').innerHTML = '';
  _leafFeatHidePrompt();

  // Remove any leftover SVG click handler from a previous run
  var _svgElReset = document.getElementById('dt-test-tree-svg');
  if (_testSvgClickHandler && _svgElReset) {
    _svgElReset.removeEventListener('click', _testSvgClickHandler);
    _svgElReset.classList.remove('selectable');
    _testSvgClickHandler = null;
  }

  // ── Pre-assign test IDs so we can count items per leaf before rendering ──
  var _tempNid = 0;
  (function preId(node) {
    node._testId = ++_tempNid;
    if (!node.isLeaf) { preId(node.left); preId(node.right); }
  })(dt.tree);

  // Pre-classify all items and build traversal paths
  var results = TEST_ITEMS.map(function(item) {
    var path      = _computePath(dt.tree, item);
    var leafLabel = path[path.length - 1].label; // class string or 'yes'/'no'
    var isYes     = (leafLabel === 'yes');
    return { item: item, leafLabel: leafLabel, isYes: isYes, path: path };
  });

  // Count expected landings per leaf so _renderTestTree can size them correctly
  var leafCounts = {};
  results.forEach(function(r) {
    var leafId = r.path[r.path.length - 1]._testId;
    leafCounts[leafId] = (leafCounts[leafId] || 0) + 1;
  });

  // Render read-only tree (also re-assigns _testId and position properties)
  _renderTestTree(leafCounts);

  // ── Animation config ──────────────────────────────
  var FSIZE      = 52;  // flyer pixel size
  var FLY_MS     = 200; // ms to fly between nodes
  var PAUSE_ROOT = 120; // ms at root (just enough to register the item)
  var PAUSE_MID  = 0;   // no pause at intermediate split nodes
  var PAUSE_LEAF = 0;   // no pause at leaf before landing
  var LW = 178;
  var ICON_S = 22, ICON_G = 3;
  var maxPerRow = Math.max(1, Math.floor((LW - 16) / (ICON_S + ICON_G)));

  var flyer         = document.getElementById('dt-test-flyer');
  var yesCount      = 0, noCount = 0;
  var leafLanded    = {}; // _testId → count of icons already placed
  var leafLandedYes = {}; // _testId → count of YES items landed
  var leafLandedNo  = {}; // _testId → count of NO items landed

  // ── Helpers ───────────────────────────────────────

  // Viewport center of a tree node (SVG coords → screen coords)
  function nodeCenter(node) {
    var svgEl = document.getElementById('dt-test-tree-svg');
    var r     = svgEl.getBoundingClientRect();
    return { x: r.left + node._cx, y: r.top + node._y + node._testH / 2 };
  }

  // Snap flyer to (x,y) with no animation
  function snapFlyer(x, y) {
    flyer.style.transition = 'none';
    flyer.style.left = (x - FSIZE/2) + 'px';
    flyer.style.top  = (y - FSIZE/2) + 'px';
  }

  // Animate flyer from its current position to (x,y), then call cb
  function flyTo(x, y, cb) {
    flyer.style.transition = 'left '+FLY_MS+'ms cubic-bezier(0.4,0,0.2,1), top '+FLY_MS+'ms cubic-bezier(0.4,0,0.2,1)';
    flyer.style.left = (x - FSIZE/2) + 'px';
    flyer.style.top  = (y - FSIZE/2) + 'px';
    setTimeout(cb, FLY_MS + 30);
  }

  // Brighten / restore a node rect to show the flyer is "at" that node
  function setHighlight(testId, on) {
    var svgEl = document.getElementById('dt-test-tree-svg');
    var el    = svgEl.querySelector('[data-test-node-id="'+testId+'"]');
    if (!el) return;
    if (on) {
      el.setAttribute('data-orig-stroke', el.getAttribute('stroke'));
      el.setAttribute('data-orig-sw',     el.getAttribute('stroke-width'));
      el.setAttribute('stroke',        '#c084fc');
      el.setAttribute('stroke-width',  '3.5');
    } else {
      el.setAttribute('stroke',       el.getAttribute('data-orig-stroke') || '#7c3aed');
      el.setAttribute('stroke-width', el.getAttribute('data-orig-sw')     || '1.8');
    }
  }

  // Scroll dt-test-tree-wrap so the given node is visible
  function scrollToNode(node) {
    var wrap  = document.getElementById('dt-test-tree-wrap');
    var svgEl = document.getElementById('dt-test-tree-svg');
    var svgR  = svgEl.getBoundingClientRect();
    var wrapR = wrap.getBoundingClientRect();
    var topVP = svgR.top  + node._y;
    var botVP = topVP + node._testH;
    if (botVP > wrapR.bottom - 16) {
      wrap.scrollTop += botVP - wrapR.bottom + 32;
    } else if (topVP < wrapR.top + 16) {
      wrap.scrollTop = Math.max(0, wrap.scrollTop - (wrapR.top - topVP) - 16);
    }
  }

  var leafLandedClasses = {}; // _testId → { className: count }

  // Add the item's icon into its leaf node in the SVG
  function landInLeaf(leafNode, item) {
    var svgEl     = document.getElementById('dt-test-tree-svg');
    var leafLabel = leafNode.label;
    var isYes     = (leafLabel === 'yes');
    var count = leafLanded[leafNode._testId] || 0;
    leafLanded[leafNode._testId] = count + 1;
    var row = Math.floor(count / maxPerRow);
    var col = count % maxPerRow;
    var ix  = leafNode._x + 8 + col * (ICON_S + ICON_G);
    var iy  = leafNode._y + 52 + row * (ICON_S + ICON_G);
    var uri = 'data:image/svg+xml,' + encodeURIComponent(_getTestIcon(item.id));

    // Correct/incorrect outline (feature mode only)
    if (dt.labelFeature) {
      var actualVal = String(_fval(item, dt.labelFeature));
      var ok        = (String(leafLabel) === actualVal);
      var bdr = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bdr.setAttribute('x',            ix - 1);
      bdr.setAttribute('y',            iy - 1);
      bdr.setAttribute('width',        ICON_S + 2);
      bdr.setAttribute('height',       ICON_S + 2);
      bdr.setAttribute('rx',           '3');
      bdr.setAttribute('fill',         'none');
      bdr.setAttribute('stroke',       ok ? '#4ade80' : '#f87171');
      bdr.setAttribute('stroke-width', '1.5');
      bdr.setAttribute('data-item-id', String(item.id));
      svgEl.appendChild(bdr);
    }

    var img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    img.setAttribute('href',         uri);
    img.setAttribute('x',            ix);
    img.setAttribute('y',            iy);
    img.setAttribute('width',        ICON_S);
    img.setAttribute('height',       ICON_S);
    img.setAttribute('data-item-id', String(item.id));
    img.style.opacity = '0';
    svgEl.appendChild(img);
    setTimeout(function() {
      img.style.transition = 'opacity 0.25s ease';
      img.style.opacity    = '1';
    }, 10);

    // Track per-class landings and update leaf count display
    if (!leafLandedClasses[leafNode._testId]) leafLandedClasses[leafNode._testId] = {};
    leafLandedClasses[leafNode._testId][leafLabel] =
      (leafLandedClasses[leafNode._testId][leafLabel] || 0) + 1;

    if (isYes) {
      leafLandedYes[leafNode._testId] = (leafLandedYes[leafNode._testId] || 0) + 1;
    } else {
      leafLandedNo[leafNode._testId]  = (leafLandedNo[leafNode._testId]  || 0) + 1;
    }
    var countEl = svgEl.querySelector('[data-test-count-id="'+leafNode._testId+'"]');
    if (countEl) {
      var classMap = leafLandedClasses[leafNode._testId] || {};
      countEl.textContent = Object.keys(classMap).map(function(k) {
        return classMap[k] + '\u00a0' + k;
      }).join(' \u00b7 ');
    }

    dt.testCorrections[item.id]  = leafLabel; // store predicted class label
    dt.testItemLeafIds[String(item.id)] = leafNode._testId; // track which leaf this item landed in
  }

  // ── Per-item animation ─────────────────────────────
  function runNext(i) {
    if (i >= results.length) {
      // All items done
      flyer.style.display = 'none';

      // Enable misclassification selection
      var _svgEl = document.getElementById('dt-test-tree-svg');
      _svgEl.classList.add('selectable');
      _testSvgClickHandler = function(e) {
        var el = e.target.closest('[data-item-id]');
        if (!el) return;
        _toggleTestMisclassified(el.getAttribute('data-item-id'));
      };
      _svgEl.addEventListener('click', _testSvgClickHandler);
      document.getElementById('dt-test-select-hint').classList.remove('hidden');

      var summary    = document.getElementById('dt-test-summary');
      var bucketLine =
        '<span class="dt-test-sum-yes">'+yesCount+' &#10142; YES &#10003;</span>' +
        '&nbsp;&nbsp;&nbsp;' +
        '<span class="dt-test-sum-no">'+noCount+' &#10142; NO &#10007;</span>';

      if (dt.labelFeature) {
        var totalTest   = TEST_ITEMS.length;
        var correctTest = TEST_ITEMS.filter(function(ti) {
          var predicted = _classify(dt.tree, ti);
          var actual    = String(_fval(ti, dt.labelFeature));
          return String(predicted) === actual;
        }).length;
        var testPct   = Math.round(correctTest / totalTest * 100);
        var testColor = _accColor(testPct);
        var testMsg   = _accMsg(testPct);
        summary.innerHTML =
          '<div class="dt-test-acc-card">'+
            '<div class="dt-test-acc-headline" style="color:'+testColor+'">'+
              '\uD83C\uDFAF '+correctTest+' out of '+totalTest+' correct! ('+testPct+'%)'+
            '</div>'+
            '<div class="dt-test-acc-bar-wrap">'+
              '<div class="dt-test-acc-bar-fill" style="width:'+testPct+'%;background:'+testColor+'"></div>'+
            '</div>'+
            '<div class="dt-test-acc-sub">'+testMsg+'</div>'+
            '<div style="margin-top:4px">'+bucketLine+'</div>'+
          '</div>';
      } else {
        summary.innerHTML = bucketLine;
      }
      summary.classList.remove('hidden');
      document.getElementById('dt-replay-btn').classList.remove('hidden');
      var _impBtn = document.getElementById('dt-improve-btn');
      if (_impBtn) _impBtn.classList.remove('hidden');
      _leafFeatShowPrompt();
      return;
    }

    var res  = results[i];
    var item = res.item;
    var path = res.path;

    // Place flyer at root, hidden, then pop in
    flyer.innerHTML = _getTestIcon(item.id);
    scrollToNode(path[0]);
    var rootC = nodeCenter(path[0]);
    snapFlyer(rootC.x, rootC.y);
    flyer.style.opacity   = '0';
    flyer.style.transform = 'scale(0)';
    flyer.style.display   = 'block';
    flyer.offsetHeight; // force reflow
    flyer.style.transition = 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), opacity 0.18s ease';
    flyer.style.transform  = 'scale(1)';
    flyer.style.opacity    = '1';

    // Walk the path node by node
    var stepIdx = 0;
    function step() {
      var node   = path[stepIdx];
      var isLast = stepIdx === path.length - 1;
      setHighlight(node._testId, true);
      var pause = isLast ? PAUSE_LEAF : (stepIdx === 0 ? PAUSE_ROOT : PAUSE_MID);

      setTimeout(function() {
        setHighlight(node._testId, false);
        if (isLast) {
          // Land in leaf, then advance to next item
          if (res.isYes) yesCount++; else noCount++;
          landInLeaf(node, item);
          flyer.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
          flyer.style.opacity    = '0';
          flyer.style.transform  = 'scale(0.3)';
          setTimeout(function() { runNext(i + 1); }, 300);
        } else {
          // Fly to next node in path, re-anchoring after any scroll
          stepIdx++;
          var nextNode = path[stepIdx];
          scrollToNode(nextNode);
          // Re-anchor flyer at current node's new viewport position post-scroll
          var currC = nodeCenter(node);
          snapFlyer(currC.x, currC.y);
          flyer.offsetHeight;
          var nextC = nodeCenter(nextNode);
          flyTo(nextC.x, nextC.y, step);
        }
      }, pause);
    }

    setTimeout(step, 80); // brief pause after pop-in before first move
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

// ── Toggle a test item's misclassified status ─────────────────────────
function _toggleTestMisclassified(itemId) {
  var svgEl   = document.getElementById('dt-test-tree-svg');
  var itemsEl = document.getElementById('dt-test-misclass-items');
  var sectEl  = document.getElementById('dt-test-misclass-section');
  var img     = svgEl.querySelector('image[data-item-id="' + itemId + '"]');
  if (!img) return;

  if (dt.testMisclassified[itemId] !== undefined) {
    // Deselect: restore icon in leaf, remove from node
    delete dt.testMisclassified[itemId];
    img.style.opacity = '1';
    var existing = itemsEl.querySelector('[data-misclass-id="' + itemId + '"]');
    if (existing) itemsEl.removeChild(existing);
  } else {
    // Select: dim icon in leaf, add to misclassified node
    dt.testMisclassified[itemId] = true;
    img.style.opacity = '0.2';

    var item = (typeof TEST_ITEMS !== 'undefined') &&
               TEST_ITEMS.find(function(i) { return String(i.id) === itemId; });
    var mini = document.createElement('div');
    mini.className = 'dt-test-mini';
    mini.setAttribute('data-misclass-id', String(itemId));
    mini.innerHTML = _getTestIcon(itemId);
    mini.title = 'Click to undo';
    mini.style.cursor = 'pointer';
    if (item && dt.labelFeature) {
      var predicted   = dt.testCorrections[itemId]; // leaf label string
      var actualVal   = String(_fval(item, dt.labelFeature));
      var wasCorrect  = (String(predicted) === actualVal);
      mini.classList.add(wasCorrect ? 'dt-test-mini--correct' : 'dt-test-mini--incorrect');
    }
    (function(id) {
      mini.addEventListener('click', function() { _toggleTestMisclassified(id); });
    })(itemId);
    itemsEl.appendChild(mini);
  }

  var count = Object.keys(dt.testMisclassified).length;
  sectEl.classList.toggle('hidden', count === 0);

  var retrainBtn = document.getElementById('dt-test-retrain-btn');
  if (retrainBtn) retrainBtn.classList.toggle('dt-retrain-glow', count > 0);
}

// ══════════════════════════════════════════════════
//  LEAF FEATURE TRAINER  (Step 5 — Add-a-Feature)
// ══════════════════════════════════════════════════

var _lfState = {
  leafNode:    null,   // the split leaf the user clicked (null = opened from improve phase)
  featureName: '',
  featureKey:  '',
  categories:  ['Yes', 'No'],  // selected categories for this feature
  trainItems:  [],     // 10 items shown for labeling
  trainIdx:    0,
  trainLabels: {},     // itemId → category string (user-labeled)
  allValues:   {}      // itemId → category string (all items, after infer)
};

// ── Detect evenly-split leaf nodes ────────────────
function _leafFeatCheckSplitLeaves() {
  var leaves = [];
  function walk(node) {
    if (!node) return;
    if (node.isLeaf) {
      var counts   = node.count;
      var total    = Object.keys(counts).reduce(function(s, k) { return s + counts[k]; }, 0);
      var maxCount = Object.keys(counts).reduce(function(m, k) { return Math.max(m, counts[k]); }, 0);
      if (total >= 2 && maxCount / total < 0.75) leaves.push(node);
    } else { walk(node.left); walk(node.right); }
  }
  walk(dt.tree);
  return leaves;
}

// ── Show/hide the post-animation prompt ──────────
function _leafFeatShowPrompt() {
  var prompt = document.getElementById('dt-lf-prompt');
  if (!prompt || !dt.tree) return;
  var leaves = _leafFeatCheckSplitLeaves();
  if (!leaves.length) { prompt.classList.add('hidden'); return; }
  prompt.classList.remove('hidden');
  // Add glowing halos to split leaf nodes in the test SVG
  _addTestLeafHalos(leaves);
}

// ── Add pulsing halo overlays to split leaf nodes in the test SVG ────────
function _addTestLeafHalos(splitLeaves) {
  var svgEl = document.getElementById('dt-test-tree-svg');
  if (!svgEl) return;
  // Remove any existing halos from a previous run
  svgEl.querySelectorAll('.dt-leaf-halo').forEach(function(el) { el.parentNode.removeChild(el); });
  splitLeaves.forEach(function(leaf) {
    if (leaf._x === undefined || leaf._testH === undefined) return;
    var LW = 178;
    var halo = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    halo.setAttribute('x',      String(leaf._x - 6));
    halo.setAttribute('y',      String(leaf._y - 6));
    halo.setAttribute('width',  String(LW + 12));
    halo.setAttribute('height', String(leaf._testH + 12));
    halo.setAttribute('rx',     '19');
    halo.setAttribute('class',  'dt-leaf-halo');
    halo.style.pointerEvents = 'all';
    halo.style.cursor = 'pointer';
    (function(n) {
      halo.addEventListener('click', function(e) {
        e.stopPropagation();
        dtGoToImprove(n);
      });
    })(leaf);
    svgEl.appendChild(halo);
  });
}

function _leafFeatHidePrompt() {
  var prompt = document.getElementById('dt-lf-prompt');
  if (prompt) prompt.classList.add('hidden');
}

// ── Step 6: Improve Phase ─────────────────────────────────────────────────
function dtGoToImprove(optLeaf) {
  _lfState.leafNode = optLeaf || null;
  _showPhase('improve');
}

function _leafFeatOpenFromImprove() {
  // Preserve the leaf node set by dtGoToImprove so training prioritises its items
  var leafCtx = _lfState.leafNode;
  _leafFeatOpen(leafCtx);
}

function _renderImprovePhase() {
  var content = document.getElementById('dt-improve-content');
  if (!content) return;
  var qEl = document.getElementById('dt-improve-question');
  if (qEl) qEl.textContent = '\u201c' + dt.question + '\u201d';

  var allTestItems = (typeof TEST_ITEMS !== 'undefined') ? TEST_ITEMS : [];
  var corrections  = dt.testCorrections || {};
  if (!allTestItems.length || !Object.keys(corrections).length) {
    content.innerHTML = '<p style="padding:24px 0;color:var(--text-dim);font-size:0.85rem">Run the test in Step 5 first \u2014 then come back here to see your results!</p>';
    return;
  }

  // If the user clicked a specific leaf, filter to only those items
  var leafNode    = _lfState.leafNode;
  var leafTestId  = leafNode && leafNode._testId;
  var testItems   = allTestItems;
  var leafHeader  = '';

  if (leafTestId) {
    testItems = allTestItems.filter(function(item) {
      return (dt.testItemLeafIds || {})[String(item.id)] === leafTestId;
    });
    var isBin = (leafNode.label === 'yes' || leafNode.label === 'no');
    var leafLbl = isBin
      ? (leafNode.label === 'yes' ? '\u2713 YES' : '\u2717 NO')
      : leafNode.label.toUpperCase();
    var countLine = Object.keys(leafNode.count).map(function(k) {
      return leafNode.count[k] + '\u00a0' + k;
    }).join(' \u00b7 ');
    leafHeader =
      '<div class="dt-improve-leaf-ctx">' +
        '<span class="dt-improve-leaf-badge">' + _esc(leafLbl) + ' leaf</span>' +
        '<span class="dt-improve-leaf-counts">' + _esc(countLine) + ' in training</span>' +
        '<button class="dt-improve-view-all-btn" onclick="dtGoToImprove(null)">View all \u2192</button>' +
      '</div>';
  }

  var isFeatureMode = !!dt.labelFeature;

  if (isFeatureMode) {
    var correct = [], incorrect = [];
    testItems.forEach(function(item) {
      var predicted = corrections[String(item.id)];
      var actual    = String(_fval(item, dt.labelFeature));
      var ok        = (String(predicted) === actual);
      if (ok) correct.push({ item: item, predicted: predicted, actual: actual, ok: true });
      else    incorrect.push({ item: item, predicted: predicted, actual: actual, ok: false });
    });
    content.innerHTML = leafHeader +
      '<div class="dt-improve-columns">' +
        '<div class="dt-improve-col">' +
          '<div class="dt-improve-col-header dt-improve-correct-header">' +
            '<span>\u2713 Correctly Sorted</span>' +
            '<span class="dt-improve-col-count">' + correct.length + '</span>' +
          '</div>' +
          '<div class="dt-improve-items">' +
            (correct.length
              ? correct.map(function(r) { return _improveItemCard(r.item, r.predicted, r.actual, true); }).join('')
              : '<div class="dt-improve-empty">None yet &mdash; the model needs more training!</div>') +
          '</div>' +
        '</div>' +
        '<div class="dt-improve-col">' +
          '<div class="dt-improve-col-header dt-improve-wrong-header">' +
            '<span>\u2717 Incorrectly Sorted</span>' +
            '<span class="dt-improve-col-count">' + incorrect.length + '</span>' +
          '</div>' +
          '<div class="dt-improve-items">' +
            (incorrect.length
              ? incorrect.map(function(r) { return _improveItemCard(r.item, r.predicted, r.actual, false); }).join('')
              : '<div class="dt-improve-empty">None \u2014 great job!</div>') +
          '</div>' +
        '</div>' +
      '</div>';
  } else {
    // Question mode: group by leaf label
    var groups = {};
    testItems.forEach(function(item) {
      var predicted = corrections[String(item.id)] || '?';
      if (!groups[predicted]) groups[predicted] = [];
      groups[predicted].push(item);
    });
    var groupHtml = '<div class="dt-improve-groups">';
    Object.keys(groups).forEach(function(label) {
      var isBin = (label === 'yes' || label === 'no');
      var hdrClass = isBin ? (label === 'yes' ? 'dt-improve-correct-header' : 'dt-improve-wrong-header') : '';
      var hdrLabel = isBin ? (label === 'yes' ? '\u2713 YES' : '\u2717 NO') : label.toUpperCase();
      groupHtml +=
        '<div class="dt-improve-group">' +
          '<div class="dt-improve-col-header ' + hdrClass + '">' +
            '<span>' + _esc(hdrLabel) + '</span>' +
            '<span class="dt-improve-col-count">' + groups[label].length + '</span>' +
          '</div>' +
          '<div class="dt-improve-items">' +
            groups[label].map(function(item) { return _improveItemCard(item, label, null, null); }).join('') +
          '</div>' +
        '</div>';
    });
    groupHtml += '</div>';
    content.innerHTML = leafHeader + groupHtml;
  }
}

function _improveItemCard(item, predicted, actual, correct) {
  // Collect active features
  var activeFeats = FEATURES.filter(function(f) {
    return !dt.selectedFeatures || dt.selectedFeatures.has(f.key);
  });
  var activeCF = (typeof customFeatures !== 'undefined') ? customFeatures.filter(function(cf) {
    return !dt.selectedFeatures || dt.selectedFeatures.has(cf.key);
  }) : [];

  var featHtml = '<div class="dt-improve-feats">' +
    activeFeats.map(function(f) {
      var val = _fval(item, f.key);
      return '<div class="dt-improve-feat">' +
        '<span class="dt-improve-feat-label">' + _esc(f.label || f.key) + '</span>' +
        '<span class="dt-improve-feat-val">' + _esc(String(val != null ? val : '\u2014')) + '</span>' +
        '</div>';
    }).join('') +
    activeCF.map(function(cf) {
      var val = _fval(item, cf.key);
      return '<div class="dt-improve-feat">' +
        '<span class="dt-improve-feat-label">' + _esc(cf.label || cf.key) + '</span>' +
        '<span class="dt-improve-feat-val">' + _esc(String(val != null ? val : '\u2014')) + '</span>' +
        '</div>';
    }).join('') +
    '</div>';

  var correctClass = correct === true ? 'dt-improve-item--correct' : correct === false ? 'dt-improve-item--wrong' : '';
  var badge = '';
  if (actual !== null && correct !== null) {
    badge = correct
      ? '<div class="dt-improve-badge dt-improve-badge-correct">\u2713 ' + _esc(String(actual)) + '</div>'
      : '<div class="dt-improve-badge dt-improve-badge-wrong">\u2717 ' + _esc(String(actual)) + ' \u2192 sorted as: ' + _esc(String(predicted)) + '</div>';
  } else if (predicted) {
    badge = '<div class="dt-improve-badge">' + _esc(String(predicted)) + '</div>';
  }

  return '<div class="dt-improve-item ' + correctClass + '">' +
    '<div class="dt-improve-item-icon">' + _getTestIcon(item.id) + '</div>' +
    '<div class="dt-improve-item-details">' +
      '<div class="dt-improve-item-name">' + _esc(item.name) + '</div>' +
      badge +
      featHtml +
    '</div>' +
  '</div>';
}

// ── Open / close the modal ────────────────────────
function _leafFeatOpen(leafNode) {
  _lfState.leafNode    = leafNode;
  _lfState.featureName = '';
  _lfState.featureKey  = '';
  _lfState.categories  = ['Yes', 'No'];
  _lfState.trainItems  = [];
  _lfState.trainIdx    = 0;
  _lfState.trainLabels = {};
  _lfState.allValues   = {};
  document.getElementById('dt-lf-name-input').value = '';
  _leafFeatShowStep('name');
  document.getElementById('dt-lf-modal').classList.remove('hidden');
}

function _leafFeatClose() {
  document.getElementById('dt-lf-modal').classList.add('hidden');
}

function _leafFeatShowStep(step) {
  ['name', 'cats', 'train', 'review'].forEach(function(s) {
    var el = document.getElementById('dt-lf-step-' + s);
    if (el) el.classList.toggle('hidden', s !== step);
  });
}

// ── Step 1 → 1.5: validate name, go to category selection ───
function _leafFeatGoToCats() {
  var name = document.getElementById('dt-lf-name-input').value.trim();
  if (!name) { alert('Please enter a feature name.'); return; }
  var key = slugify(name);
  if ((typeof customFeatures !== 'undefined' && customFeatures.some(function(cf) { return cf.key === key; })) ||
      FEATURES.some(function(f) { return f.key === key; })) {
    alert('"' + name + '" already exists as a feature!'); return;
  }
  _lfState.featureName = name;
  _lfState.featureKey  = key;
  document.getElementById('dt-lf-cats-name-display').textContent = name;
  _renderCatsStep();
  _leafFeatShowStep('cats');
}

var _CAT_PRESETS = [
  { label: 'Yes / No',          cats: ['Yes', 'No'] },
  { label: 'Low / Medium / High', cats: ['Low', 'Medium', 'High'] },
  { label: 'Small / Large',      cats: ['Small', 'Large'] },
  { label: 'Weak / Strong',      cats: ['Weak', 'Strong'] },
  { label: 'Rare / Common',      cats: ['Rare', 'Common'] },
];

function _renderCatsStep() {
  var presetsEl = document.getElementById('dt-lf-cat-presets');
  if (presetsEl) {
    presetsEl.innerHTML = '';
    _CAT_PRESETS.forEach(function(preset) {
      var btn = document.createElement('button');
      btn.className = 'dt-lf-cat-preset-btn';
      btn.textContent = preset.label;
      btn.onclick = function() {
        var inputs = document.getElementById('dt-lf-cat-inputs');
        inputs.innerHTML = '';
        preset.cats.forEach(function(cat) { _addCatInputWithValue(cat); });
        _updateAddCatBtn();
        presetsEl.querySelectorAll('.dt-lf-cat-preset-btn').forEach(function(b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
      };
      presetsEl.appendChild(btn);
    });
  }
  // Default to Yes / No inputs
  var inputs = document.getElementById('dt-lf-cat-inputs');
  if (inputs) {
    inputs.innerHTML = '';
    _addCatInputWithValue('Yes');
    _addCatInputWithValue('No');
  }
  _updateAddCatBtn();
  // Pre-select "Yes / No" preset button
  var firstBtn = presetsEl && presetsEl.querySelector('.dt-lf-cat-preset-btn');
  if (firstBtn) firstBtn.classList.add('selected');
}

function _addCatInputWithValue(val) {
  var inputs = document.getElementById('dt-lf-cat-inputs');
  if (!inputs) return;
  var row = document.createElement('div');
  row.className = 'dt-lf-cat-input-row';
  var inp = document.createElement('input');
  inp.className = 'modal-input dt-lf-cat-input';
  inp.type = 'text';
  inp.value = val || '';
  inp.placeholder = 'Category name\u2026';
  var rmBtn = document.createElement('button');
  rmBtn.className = 'dt-lf-cat-remove-btn';
  rmBtn.type = 'button';
  rmBtn.textContent = '\u00d7';
  rmBtn.onclick = function() {
    inputs.removeChild(row);
    _updateAddCatBtn();
  };
  row.appendChild(inp);
  row.appendChild(rmBtn);
  inputs.appendChild(row);
  _updateAddCatBtn();
}

function _leafFeatAddCatInput() {
  _addCatInputWithValue('');
}

function _updateAddCatBtn() {
  var inputs = document.getElementById('dt-lf-cat-inputs');
  var btn    = document.getElementById('dt-lf-add-cat-btn');
  if (!inputs || !btn) return;
  btn.style.display = (inputs.children.length >= 6) ? 'none' : '';
}

// ── Step 1.5 → 2: confirm categories, build item pool ───
function _leafFeatConfirmCats() {
  var inputEls = document.querySelectorAll('#dt-lf-cat-inputs .dt-lf-cat-input');
  var cats = Array.from(inputEls).map(function(inp) { return inp.value.trim(); }).filter(Boolean);
  // Deduplicate
  cats = cats.filter(function(c, i) { return cats.indexOf(c) === i; });
  if (cats.length < 2) { alert('Please enter at least 2 categories.'); return; }
  _lfState.categories = cats;

  // Prioritise items that live in the target leaf, then fill to 10 with others
  var leafItems = (_lfState.leafNode && _lfState.leafNode.items) ? _lfState.leafNode.items : [];
  var leafIdSet = {};
  leafItems.forEach(function(i) { leafIdSet[i.id] = true; });
  var others = ITEMS.filter(function(i) { return !leafIdSet[i.id]; })
                    .sort(function() { return Math.random() - 0.5; });
  _lfState.trainItems = leafItems.slice(0, 10).concat(others).slice(0, 10);
  _lfState.trainIdx   = 0;

  document.getElementById('dt-lf-train-q').textContent =
    '\u201c' + _lfState.featureName + '\u201d \u2014 label each item:';
  _leafFeatShowStep('train');
  _leafFeatRenderCard();
}

// ── Step 2: render current training card + category buttons ─────────
function _leafFeatRenderCard() {
  if (_lfState.trainIdx >= _lfState.trainItems.length) {
    _leafFeatInferAll(); return;
  }
  var item = _lfState.trainItems[_lfState.trainIdx];
  var progressEl = document.getElementById('dt-lf-progress');
  if (progressEl) progressEl.textContent = (_lfState.trainIdx + 1) + ' / ' + _lfState.trainItems.length;

  var subtitleKey = (typeof DATASET_META !== 'undefined' && DATASET_META.subtitleKey) || 'cat';
  var card = document.getElementById('dt-lf-card');
  if (!card) return;
  card.innerHTML =
    '<div class="dt-card-icon">' + getIcon(item.id) + '</div>' +
    '<div class="dt-card-name">' + _esc(item.name) + '</div>' +
    '<div class="dt-card-cat">'  + _esc(item[subtitleKey] || '') + '</div>' +
    '<div class="dt-card-pills">' +
      FEATURES.map(function(f) { return renderFeatureValue(f, item); }).join('') +
    '</div>';

  // Render dynamic category buttons
  var btnsEl = document.getElementById('dt-lf-train-btns');
  if (btnsEl) {
    btnsEl.innerHTML = '';
    var cats = _lfState.categories;
    var _catPalette = ['dt-btn-yes', 'dt-btn-no', 'dt-btn-neutral', 'dt-btn-neutral', 'dt-btn-neutral', 'dt-btn-neutral'];
    cats.forEach(function(cat, i) {
      var btn = document.createElement('button');
      btn.className = (_catPalette[i] || 'dt-btn-neutral') + ' dt-lf-cat-train-btn';
      btn.textContent = cat;
      (function(c) { btn.onclick = function() { _leafFeatLabel(c); }; })(cat);
      btnsEl.appendChild(btn);
    });
  }
}

function _leafFeatLabel(val) {
  var item = _lfState.trainItems[_lfState.trainIdx];
  if (!item) return;
  _lfState.trainLabels[item.id] = val;
  _lfState.trainIdx++;
  _leafFeatRenderCard();
}

// ── Step 2 → 3: auto-infer unlabeled items ────────
function _leafFeatInferAll() {
  var cats     = _lfState.categories;
  var allItems = ITEMS.concat(typeof TEST_ITEMS !== 'undefined' ? TEST_ITEMS : []);

  // Count how often each category appeared in the user's training labels
  var catCounts = {};
  cats.forEach(function(c) { catCounts[c] = 0; });
  Object.keys(_lfState.trainLabels).forEach(function(id) {
    var v = _lfState.trainLabels[id];
    if (catCounts[v] !== undefined) catCounts[v]++;
  });
  var trainTotal = cats.reduce(function(s, c) { return s + catCounts[c]; }, 0);

  allItems.forEach(function(item) {
    if (_lfState.trainLabels[item.id] !== undefined) {
      _lfState.allValues[item.id] = _lfState.trainLabels[item.id];
    } else if (trainTotal === 0) {
      // No training data yet: spread evenly using hash
      _lfState.allValues[item.id] = cats[Math.abs(item.id * 7 + 3) % cats.length];
    } else {
      // Proportional assignment: use a deterministic hash to pick a category
      // weighted by training-label frequency
      var hash       = Math.abs(item.id * 7 + 3) % trainTotal;
      var cumulative = 0;
      var assigned   = cats[0];
      for (var j = 0; j < cats.length; j++) {
        cumulative += catCounts[cats[j]];
        if (hash < cumulative) { assigned = cats[j]; break; }
      }
      _lfState.allValues[item.id] = assigned;
    }
  });
  _leafFeatRenderTable();
  _leafFeatShowStep('review');
}

// Map category index to CSS class for review table buttons
var _CAT_VAL_CLASSES = ['dt-lf-val-yes', 'dt-lf-val-no', 'dt-lf-val-cat2', 'dt-lf-val-cat3', 'dt-lf-val-cat4'];

function _catValClass(cat) {
  var idx = _lfState.categories.indexOf(cat);
  return _CAT_VAL_CLASSES[idx] || 'dt-lf-val-no';
}

// ── Step 3: render the review table ──────────────
function _leafFeatRenderTable() {
  var col = document.getElementById('dt-lf-feat-col');
  if (col) col.textContent = _lfState.featureName;
  var tbody = document.getElementById('dt-lf-table-body');
  if (!tbody) return;
  var allItems = ITEMS.concat(typeof TEST_ITEMS !== 'undefined' ? TEST_ITEMS : []);
  var cats = _lfState.categories;
  tbody.innerHTML = '';
  allItems.forEach(function(item) {
    var val       = _lfState.allValues[item.id] || cats[0];
    var isLabeled = _lfState.trainLabels[item.id] !== undefined;

    var tr = document.createElement('tr');
    if (isLabeled) tr.className = 'dt-lf-row-labeled';

    var tdName = document.createElement('td');
    tdName.className = 'dt-lf-name-cell';
    tdName.innerHTML =
      '<span class="dt-lf-icon">' + getIcon(item.id) + '</span>' +
      '<span class="dt-lf-item-name">' + _esc(item.name) + '</span>' +
      (isLabeled ? '<span class="dt-lf-you-badge">you</span>' : '');

    var tdVal = document.createElement('td');
    tdVal.className = 'dt-lf-val-cell';
    var btn = document.createElement('button');
    btn.className = 'dt-lf-val-btn ' + _catValClass(val);
    btn.textContent = val;
    btn.title = 'Click to cycle: ' + cats.join(' \u2192 ');
    (function(id) {
      btn.onclick = function() { _leafFeatToggle(id, btn); };
    })(item.id);
    tdVal.appendChild(btn);

    tr.appendChild(tdName);
    tr.appendChild(tdVal);
    tbody.appendChild(tr);
  });
}

function _leafFeatToggle(itemId, btn) {
  var cats    = _lfState.categories;
  var current = _lfState.allValues[itemId] || cats[0];
  var idx     = cats.indexOf(current);
  var next    = cats[(idx + 1) % cats.length];
  _lfState.allValues[itemId] = next;
  btn.textContent = next;
  btn.className   = 'dt-lf-val-btn ' + _catValClass(next);
}

// ══════════════════════════════════════════════════
//  FORCED-FEATURE INJECTION
//  After adding a new feature via the leaf flow, the next tree build must
//  include that feature as at least one split node — even if its Gini gain
//  wouldn't naturally make it the winner at every split.
// ══════════════════════════════════════════════════

// Return display label for any feature key (built-in or custom)
function _featLabel(key) {
  var f = FEATURES.find(function(fd) { return fd.key === key; });
  if (f) return f.label || key;
  var cf = (typeof customFeatures !== 'undefined') &&
           customFeatures.find(function(c) { return c.key === key; });
  return cf ? (cf.name || key) : key;
}

// True if `key` appears as a split feature anywhere in the tree
function _isFeatUsed(node, key) {
  if (!node || node.isLeaf) return false;
  if (node.feature === key) return true;
  return _isFeatUsed(node.left, key) || _isFeatUsed(node.right, key);
}

// Find the most impure (highest Gini) leaf in the tree and force-split it
// on `key`, constructing proper child leaves from the split.
function _forceSplitOnFeature(tree, key) {
  // Walk tree to find the impurest leaf
  var best = { gini: -1, leaf: null, parent: null, side: null };
  (function walk(node, parent, side) {
    if (!node) return;
    if (node.isLeaf) {
      var items = node.items || [];
      if (!items.length) return;
      var g = _gini(items);
      if (g > best.gini) best = { gini: g, leaf: node, parent: parent, side: side };
    } else {
      walk(node.left,  node, 'left');
      walk(node.right, node, 'right');
    }
  })(tree, null, null);

  var leafNode = best.leaf;
  if (!leafNode) return; // nothing to split

  var items = leafNode.items || [];
  if (!items.length) return;

  // Find the split value that maximises Gini gain (fall back to first value found)
  var parentGini = _gini(items);
  var vals = Array.from(new Set(items.map(function(i) { return _fval(i, key); })));
  var bestGain = -Infinity, bestVal = null;

  vals.forEach(function(v) {
    var left  = items.filter(function(i) { return _fval(i, key) === v; });
    var right = items.filter(function(i) { return _fval(i, key) !== v; });
    if (!left.length || !right.length) return;
    var totalG = (left.length / items.length) * _gini(left) +
                 (right.length / items.length) * _gini(right);
    var gain = parentGini - totalG;
    if (gain > bestGain) { bestGain = gain; bestVal = v; }
  });

  // If every item has the same value (gain is always 0), just pick the first
  if (bestVal === null) bestVal = vals[0] || null;
  if (bestVal === null) return; // feature has no values here — give up

  var leftItems  = items.filter(function(i) { return _fval(i, key) === bestVal; });
  var rightItems = items.filter(function(i) { return _fval(i, key) !== bestVal; });

  // Build count maps and majority labels for each child leaf
  function majorityOf(arr) {
    var cc = _labelCounts(arr);
    return Object.keys(cc).reduce(function(a, b) { return cc[a] >= cc[b] ? a : b; }, Object.keys(cc)[0] || leafNode.label);
  }

  var leftCounts  = _labelCounts(leftItems);
  var rightCounts = rightItems.length ? _labelCounts(rightItems) : {};

  var splitMath = {
    parentGini: parentGini,
    leftGini:   _gini(leftItems),
    rightGini:  rightItems.length ? _gini(rightItems) : 0,
    totalGini:  rightItems.length
      ? (leftItems.length / items.length) * _gini(leftItems) + (rightItems.length / items.length) * _gini(rightItems)
      : parentGini,
    leftN:       leftItems.length,
    rightN:      rightItems.length,
    totalN:      items.length,
    leftCounts:  leftCounts,
    rightCounts: rightCounts,
  };

  // Replace the leaf in-place with a split node
  var splitNode = {
    isLeaf:    false,
    feature:   key,
    splitVal:  bestVal,
    isNumeric: false,
    condition: _featLabel(key) + ' = ' + bestVal,
    count:     _labelCounts(items),
    items:     items,
    splitMath: splitMath,
    left:  { isLeaf: true, label: majorityOf(leftItems),              count: leftCounts,  items: leftItems  },
    right: rightItems.length
      ? { isLeaf: true, label: majorityOf(rightItems),                count: rightCounts, items: rightItems }
      : { isLeaf: true, label: leafNode.label,                        count: {},          items: []         },
  };

  if (!best.parent) {
    // Leaf was the root — overwrite in-place
    Object.keys(splitNode).forEach(function(k) { tree[k] = splitNode[k]; });
  } else {
    best.parent[best.side] = splitNode;
  }
}

// Entry point: if `key` is not already a split anywhere in `tree`, inject it.
function _ensureForcedFeature(tree, key) {
  if (!key || !tree) return;
  if (_isFeatUsed(tree, key)) return; // already present — nothing to do
  _forceSplitOnFeature(tree, key);
}

// ── Apply: register feature + rebuild tree ────────
function _leafFeatApply() {
  customFeatures.push({
    name:       _lfState.featureName,
    key:        _lfState.featureKey,
    categories: _lfState.categories.slice(),
    values:     Object.assign({}, _lfState.allValues)
  });
  // Make sure the new feature participates in the next tree build
  if (dt.selectedFeatures) dt.selectedFeatures.add(_lfState.featureKey);
  // Flag the next build to guarantee this feature appears in the tree
  dt.forcedFeatureKey = _lfState.featureKey;
  _leafFeatClose();
  _leafFeatHidePrompt();
  _showPhase('building');
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

  // Merge test corrections into dt.labels.
  Object.keys(dt.testCorrections).forEach(function(id) {
    var predicted = dt.testCorrections[id]; // leaf label string ('yes'/'no' or class)
    if (dt.testMisclassified[id]) {
      if (dt.labelFeature && dt.labelValue === '') {
        // Multi-class: re-derive correct label from the actual feature value
        var allItems = dt.trainingItems.concat(typeof TEST_ITEMS !== 'undefined' ? TEST_ITEMS : []);
        var src = allItems.find(function(i) { return String(i.id) === String(id); });
        if (src) dt.labels[id] = String(_fval(src, dt.labelFeature));
      } else {
        // Binary question mode: flip yes↔no
        dt.labels[id] = (predicted === 'no'); // was 'yes' → false (no); was 'no' → true (yes)
      }
    } else {
      // Accept prediction
      if (dt.labelFeature && dt.labelValue === '') {
        dt.labels[id] = predicted; // class string
      } else {
        dt.labels[id] = (predicted === 'yes'); // boolean
      }
    }
  });

  // _showPhase('building') triggers _trainAndShow after a short delay,
  // which reads dt.trainingItems + dt.labels — now includes test data
  _showPhase('building');
}

// ── Fullscreen & PNG export ───────────────────────────────────────────────

// Remember where the SVG lived so we can return it after fullscreen closes.
var _fullscreenOrigParent = null;
var _fullscreenSvgId      = null;

// Move (not clone) the SVG into the fullscreen overlay so all event listeners
// (hover tooltips, etc.) continue to work inside fullscreen.
function dtFullscreen(svgId) {
  svgId = svgId || 'dt-tree-svg';
  var svgEl    = document.getElementById(svgId);
  var overlay  = document.getElementById('dt-tree-fullscreen');
  var scrollEl = document.getElementById('dt-fullscreen-scroll');
  if (!svgEl || !overlay) return;

  _fullscreenOrigParent = svgEl.parentElement;
  _fullscreenSvgId      = svgId;

  scrollEl.innerHTML = '';       // clear any previous content
  scrollEl.appendChild(svgEl);  // move the live element — preserves JS listeners
  overlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function dtFullscreenClose(e) {
  if (e && e.target !== document.getElementById('dt-tree-fullscreen')) return;
  var overlay = document.getElementById('dt-tree-fullscreen');

  // Return the SVG to its original container
  if (_fullscreenOrigParent && _fullscreenSvgId) {
    var svgEl = document.getElementById(_fullscreenSvgId);
    if (svgEl) _fullscreenOrigParent.appendChild(svgEl);
  }
  _fullscreenOrigParent = null;
  _fullscreenSvgId      = null;

  overlay.classList.add('hidden');
  document.body.style.overflow = '';
}

// ── Shared PNG downloader (adds item names below every icon) ─────────────
// Works for both the training tree (#dt-tree-svg) and test tree (#dt-test-tree-svg).
function _downloadTreePNG(svgId, filename) {
  var svgEl = document.getElementById(svgId);
  if (!svgEl) return;

  var w = parseInt(svgEl.getAttribute('width'),  10) || Math.round(svgEl.getBoundingClientRect().width);
  var h = parseInt(svgEl.getAttribute('height'), 10) || Math.round(svgEl.getBoundingClientRect().height);
  if (!w || !h) return;

  var scale  = 2;
  var ICON_S = 22; // must match _renderTree / landInLeaf

  // Build a lookup of all items (training + test) by id
  var allItems = (typeof ITEMS !== 'undefined' ? ITEMS : [])
    .concat(typeof TEST_ITEMS !== 'undefined' ? TEST_ITEMS : []);
  var itemMap = {};
  allItems.forEach(function(it) { itemMap[String(it.id)] = it; });

  // Clone the SVG — we're adding text nodes for export only, not live display
  var clone = svgEl.cloneNode(true);

  // For each item icon, add a name label just below it
  var maxLabelBottom = h;
  clone.querySelectorAll('image[data-item-id]').forEach(function(img) {
    var id   = img.getAttribute('data-item-id');
    var item = itemMap[id];
    if (!item) return;

    var name  = item.name || '';
    var label = name.length > 11 ? name.slice(0, 10) + '\u2026' : name;

    var ix = parseFloat(img.getAttribute('x')      || 0);
    var iy = parseFloat(img.getAttribute('y')      || 0);
    var cx = ix + ICON_S / 2;
    var ty = iy + ICON_S + 8; // just below the icon bottom edge

    var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x',           String(cx));
    text.setAttribute('y',           String(ty));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill',        '#c0c0d8');
    text.setAttribute('font-size',   '7');
    text.setAttribute('font-family', 'Segoe UI,system-ui,sans-serif');
    text.textContent = label;
    clone.appendChild(text);

    maxLabelBottom = Math.max(maxLabelBottom, ty + 6);
  });

  // Grow the SVG canvas if labels extend below the original bounds
  var finalH = Math.ceil(maxLabelBottom) + 4;
  clone.setAttribute('height',  String(finalH));
  clone.setAttribute('viewBox', '0 0 ' + w + ' ' + finalH);

  var serializer = new XMLSerializer();
  var svgStr = serializer.serializeToString(clone);
  if (!svgStr.includes('xmlns=')) {
    svgStr = svgStr.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  var blob = new Blob([svgStr], { type: 'image/svg+xml' });
  var url  = URL.createObjectURL(blob);
  var imgEl = new Image();
  imgEl.onload = function() {
    var canvas    = document.createElement('canvas');
    canvas.width  = w * scale;
    canvas.height = finalH * scale;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f0a1e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(scale, scale);
    ctx.drawImage(imgEl, 0, 0, w, finalH);
    URL.revokeObjectURL(url);
    var a      = document.createElement('a');
    a.download = filename;
    a.href     = canvas.toDataURL('image/png');
    a.click();
  };
  imgEl.src = url;
}

function dtDownloadPNG()         { _downloadTreePNG('dt-tree-svg',      'decision-tree.png'); }
function dtDownloadTestPNG()     { _downloadTreePNG('dt-test-tree-svg', 'test-results.png');  }
// Downloads whichever SVG is currently open in the fullscreen overlay
function dtDownloadFullscreenPNG() {
  var id = _fullscreenSvgId || 'dt-tree-svg';
  var fn = (id === 'dt-test-tree-svg') ? 'test-results.png' : 'decision-tree.png';
  _downloadTreePNG(id, fn);
}
