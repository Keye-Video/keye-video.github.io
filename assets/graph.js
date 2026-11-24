/* ============================================================
   Keye Video Team — 实时可交互 Peach Fuzz 知识图谱 + 自动导览组件
   特点：60fps 纯 SVG + 原生 JS（零外部依赖），默认自动导览介绍团队 4 大研究方向，
   支持鼠标悬停邻域高亮、拖拽节点、点击方向筛选、点击论文节点直达项目主页。
   ============================================================ */

(function () {
  'use strict';

  var host = document.getElementById('keye-kg');
  if (!host) return;

  var W = 1120;
  var H = 452;

  /* 统一 Peach Fuzz 暖系配色（与全站 #F87C4C · #FEDCCC · #FFF8F5 · #221916 严丝合缝） */
  var CLUSTERS = {
    all: {
      id: 'all',
      label: 'Overview',
      color: '#F87C4C',
      pill: '#FEDCCC',
      title: 'Keye Video Team · Research Constellation',
      desc: '10 connected papers spanning agentic video systems, closed-loop & fine-grained evaluation, visual-grounded RL rewards, and native video architectures.'
    },
    agents: {
      id: 'agents',
      label: 'Video Agents',
      color: '#F87C4C',
      pill: '#FEDCCC',
      title: 'Agentic Video Systems',
      desc: 'Decoupling dense perception from reasoning contexts, growing dynamic online memory trees, and closing the perceptual loop for code-driven video generation.'
    },
    eval: {
      id: 'eval',
      label: 'Evaluation',
      color: '#D9822B',
      pill: '#FDE8CC',
      title: 'Evaluation & Benchmarks',
      desc: 'Closed-loop adaptive questioning without timestamp or audio shortcuts, 24 fps high-frame-rate action QA, and cross-video spatiotemporal difference probing.'
    },
    rl: {
      id: 'rl',
      label: 'RL & Rewards',
      color: '#C84B31',
      pill: '#FBDCD5',
      title: 'RL & Reward Modeling',
      desc: 'Witness-Adjudicator hypergeometric rewards for weak-to-strong captioning and explicit spatial reasoning rewards that eliminate cross-image Attention Collapse.'
    },
    arch: {
      id: 'arch',
      label: 'Architecture',
      color: '#8D5B4C',
      pill: '#EDE0DA',
      title: 'Native Video Architecture',
      desc: 'Mechanistic prefix attention knockouts and temporal drift analysis revealing half-depth cross-frame binding for native early in-fusion video training.'
    }
  };

  /* 节点数据：核心节点 + 4 个方向枢纽 + 10 篇真实论文 + 轻量卫星概念节点 */
  var NODES = [
    { id: 'core', kind: 'core', label: 'Keye Video Team', cluster: 'all', bx: 560, by: 226, r: 32 },

    { id: 'hub-agents', kind: 'hub', label: 'Video Agents', cluster: 'agents', bx: 744, by: 140, r: 15 },
    { id: 'hub-eval', kind: 'hub', label: 'Evaluation', cluster: 'eval', bx: 742, by: 314, r: 15 },
    { id: 'hub-rl', kind: 'hub', label: 'RL & Rewards', cluster: 'rl', bx: 376, by: 314, r: 15 },
    { id: 'hub-arch', kind: 'hub', label: 'Architecture', cluster: 'arch', bx: 378, by: 140, r: 15 },

    { id: 'vibevideoagent', kind: 'paper', label: 'VibeVideoAgent', metric: '4.03 → 4.41 L3', lblSide: 'top', desc: 'Closing the perceptual loop for code-driven video generation across 239 VibeVideoBench tasks.', cluster: 'agents', url: './vibevideoagent/index.html', bx: 896, by: 82, r: 13.5, latest: true },
    { id: 'videonexus', kind: 'paper', label: 'VideoNexus', metric: '88.6% LVBench', lblSide: 'right', desc: 'Separating detailed native audio-video perception from the planner reasoning context at 44% API cost.', cluster: 'agents', url: './videonexus/index.html', bx: 942, by: 158, r: 12 },
    { id: 'rethinking', kind: 'paper', label: 'Rethinking Video Agents', metric: '+14.2 pts FastAct', lblSide: 'right', desc: 'Analyzing when and why adaptive temporal-spatial video harnesses succeed across models and tasks.', cluster: 'agents', url: './rethinking-video-agents/index.html', bx: 868, by: 222, r: 11.5 },
    { id: 'sprout', kind: 'paper', label: 'Sprout', metric: 'Dynamic Memory Tree', lblSide: 'top', desc: 'Building an online temporal memory tree while reasoning—no upfront offline indexing, releasing frames.', cluster: 'agents', url: './sprout/index.html', bx: 696, by: 68, r: 11.5 },

    { id: 'clve', kind: 'paper', label: 'CLVE', metric: '94% → 0.08% Leak', lblSide: 'top', desc: 'Three-level pure-visual closed-loop evaluation with timestamp filtering and categorical judging.', cluster: 'eval', url: './clve/index.html', bx: 904, by: 292, r: 12.5 },
    { id: 'videoace', kind: 'paper', label: 'VideoACE', metric: '1,000 QA @ 24fps', lblSide: 'bottom', desc: 'Benchmarking agentic video understanding through high-frame-rate actions, tools, and user feedback.', cluster: 'eval', url: './videoace/index.html', bx: 888, by: 374, r: 12 },
    { id: 'deltavid', kind: 'paper', label: 'DELTAVID', metric: '8-Bench Transfer', lblSide: 'bottom', desc: 'Enhancing fine-grained spatiotemporal perception with verifiable cross-video differences.', cluster: 'eval', url: './deltavid/index.html', bx: 696, by: 384, r: 11.5 },

    { id: 'vcap', kind: 'paper', label: 'VCap', metric: '8B SOTA Captioning', lblSide: 'top', desc: 'Witness-Adjudicator hypergeometric rewards enabling weak-to-strong visual captioning.', cluster: 'rl', url: './vcap/index.html', bx: 218, by: 282, r: 12 },
    { id: 'spatialreward', kind: 'paper', label: 'SpatialReward', metric: '+0.90 GEdit RL', lblSide: 'bottom', desc: 'Explicit spatial reasoning rewards bridging the perception gap in online RL for image editing.', cluster: 'rl', url: './spatialreward/index.html', bx: 248, by: 376, r: 12 },

    { id: 'earlyinfusion', kind: 'paper', label: 'Early In-Fusion', metric: '91.2% 1/8 Iso', lblSide: 'top', desc: 'Prefix attention knockouts showing cross-frame binding completes in the lower half of video MLLMs.', cluster: 'arch', url: './early-in-fusion/index.html', bx: 226, by: 108, r: 13 },

    /* 轻量概念卫星节点 */
    { id: 's-mcp', kind: 'sat', label: '7 MCP Primitives', cluster: 'agents', bx: 1038, by: 66, r: 4.2 },
    { id: 's-tree', kind: 'sat', label: 'Frame Release', cluster: 'agents', bx: 564, by: 48, r: 4.2 },
    { id: 's-judge', kind: 'sat', label: 'Categorical Judge', cluster: 'eval', bx: 1038, by: 304, r: 4.2 },
    { id: 's-diff', kind: 'sat', label: 'DELTAVID-10K', cluster: 'eval', bx: 556, by: 404, r: 4.2 },
    { id: 's-wa', kind: 'sat', label: 'Witness–Adjudicator', cluster: 'rl', bx: 98, by: 238, r: 4.2 },
    { id: 's-ac', kind: 'sat', label: 'Attention Collapse', cluster: 'rl', bx: 108, by: 392, r: 4.2 },
    { id: 's-mftd', kind: 'sat', label: '10× Global MFTD', cluster: 'arch', bx: 102, by: 76, r: 4.2 },
    { id: 's-gemma', kind: 'sat', label: 'Gemma 4 · Qwen3-VL', cluster: 'arch', bx: 132, by: 184, r: 4.2 }
  ];

  var EDGES = [
    { from: 'core', to: 'hub-agents', kind: 'core', cluster: 'agents' },
    { from: 'core', to: 'hub-eval', kind: 'core', cluster: 'eval' },
    { from: 'core', to: 'hub-rl', kind: 'core', cluster: 'rl' },
    { from: 'core', to: 'hub-arch', kind: 'core', cluster: 'arch' },

    { from: 'hub-agents', to: 'vibevideoagent', kind: 'paper', cluster: 'agents' },
    { from: 'hub-agents', to: 'videonexus', kind: 'paper', cluster: 'agents' },
    { from: 'hub-agents', to: 'rethinking', kind: 'paper', cluster: 'agents' },
    { from: 'hub-agents', to: 'sprout', kind: 'paper', cluster: 'agents' },

    { from: 'hub-eval', to: 'clve', kind: 'paper', cluster: 'eval' },
    { from: 'hub-eval', to: 'videoace', kind: 'paper', cluster: 'eval' },
    { from: 'hub-eval', to: 'deltavid', kind: 'paper', cluster: 'eval' },

    { from: 'hub-rl', to: 'vcap', kind: 'paper', cluster: 'rl' },
    { from: 'hub-rl', to: 'spatialreward', kind: 'paper', cluster: 'rl' },

    { from: 'hub-arch', to: 'earlyinfusion', kind: 'paper', cluster: 'arch' },

    { from: 'vibevideoagent', to: 's-mcp', kind: 'sat', cluster: 'agents' },
    { from: 'sprout', to: 's-tree', kind: 'sat', cluster: 'agents' },
    { from: 'clve', to: 's-judge', kind: 'sat', cluster: 'eval' },
    { from: 'deltavid', to: 's-diff', kind: 'sat', cluster: 'eval' },
    { from: 'vcap', to: 's-wa', kind: 'sat', cluster: 'rl' },
    { from: 'spatialreward', to: 's-ac', kind: 'sat', cluster: 'rl' },
    { from: 'earlyinfusion', to: 's-mftd', kind: 'sat', cluster: 'arch' },
    { from: 'earlyinfusion', to: 's-gemma', kind: 'sat', cluster: 'arch' },

    /* 跨论文与跨方向真实学术桥接边 */
    { from: 'vibevideoagent', to: 'videonexus', kind: 'bridge', cluster: 'agents' },
    { from: 'videonexus', to: 'sprout', kind: 'bridge', cluster: 'agents' },
    { from: 'rethinking', to: 'videoace', kind: 'bridge' },
    { from: 'rethinking', to: 'clve', kind: 'bridge' },
    { from: 'clve', to: 'earlyinfusion', kind: 'bridge' },
    { from: 'videoace', to: 'deltavid', kind: 'bridge', cluster: 'eval' },
    { from: 'deltavid', to: 'vcap', kind: 'bridge' },
    { from: 'vcap', to: 'spatialreward', kind: 'bridge', cluster: 'rl' },
    { from: 'earlyinfusion', to: 'sprout', kind: 'bridge' }
  ];

  var nodeMap = {};
  var adjMap = {};
  NODES.forEach(function (n, idx) {
    n.x = n.bx;
    n.y = n.by;
    n.dx = 0;
    n.dy = 0;
    n.seed = idx + 1;
    nodeMap[n.id] = n;
    adjMap[n.id] = {};
    adjMap[n.id][n.id] = true;
  });
  EDGES.forEach(function (e) {
    adjMap[e.from][e.to] = true;
    adjMap[e.to][e.from] = true;
  });

  /* 构建交互舞台 DOM */
  var NS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs, parent) {
    var el = document.createElementNS(NS, tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) { el.setAttribute(k, String(attrs[k])); });
    }
    if (parent) parent.appendChild(el);
    return el;
  }

  host.innerHTML = ''
    + '<div class="kg-toolbar">'
    + '  <div class="kg-pills" role="group" aria-label="Research clusters">'
    + '    <button type="button" data-cluster="all" aria-pressed="true" class="is-active"><span class="kg-dot" style="background:#221916"></span>Overview</button>'
    + '    <button type="button" data-cluster="agents" aria-pressed="false"><span class="kg-dot" style="background:#F87C4C"></span>Video Agents</button>'
    + '    <button type="button" data-cluster="eval" aria-pressed="false"><span class="kg-dot" style="background:#D9822B"></span>Evaluation</button>'
    + '    <button type="button" data-cluster="rl" aria-pressed="false"><span class="kg-dot" style="background:#C84B31"></span>RL &amp; Rewards</button>'
    + '    <button type="button" data-cluster="arch" aria-pressed="false"><span class="kg-dot" style="background:#8D5B4C"></span>Architecture</button>'
    + '  </div>'
    + '  <div class="kg-controls">'
    + '    <span class="kg-hint">Hover · Drag · Click paper</span>'
    + '    <button type="button" class="kg-tour-btn" aria-pressed="true">Auto Tour: ON</button>'
    + '  </div>'
    + '</div>'
    + '<div class="kg-canvas-wrap"></div>'
    + '<div class="kg-narrative">'
    + '  <div class="kg-tour-progress"><div class="kg-tour-bar"></div></div>'
    + '  <div class="kg-nar-head"><span class="kg-nar-dot"></span><strong class="kg-nar-title"></strong><span class="kg-nar-metric"></span></div>'
    + '  <p class="kg-nar-desc"></p>'
    + '  <a class="kg-nar-link" href="#publications" hidden>Open Project Page →</a>'
    + '</div>';

  var wrap = host.querySelector('.kg-canvas-wrap');
  var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'kg-svg', role: 'img', 'aria-label': 'Interactive research knowledge graph of Keye Video Team' }, wrap);

  /* 定义柔和 Peach Fuzz 暖晕渐变 */
  var defs = svgEl('defs', {}, svg);
  Object.keys(CLUSTERS).forEach(function (cid) {
    var c = CLUSTERS[cid];
    var grad = svgEl('radialGradient', { id: 'kg-g-' + cid }, defs);
    svgEl('stop', { offset: '0%', 'stop-color': c.color, 'stop-opacity': '0.18' }, grad);
    svgEl('stop', { offset: '65%', 'stop-color': c.color, 'stop-opacity': '0.04' }, grad);
    svgEl('stop', { offset: '100%', 'stop-color': c.color, 'stop-opacity': '0' }, grad);
  });

  var layerGlow = svgEl('g', {}, svg);
  var layerEdges = svgEl('g', {}, svg);
  var layerPulses = svgEl('g', {}, svg);
  var layerNodes = svgEl('g', {}, svg);

  /* 四个星团柔和暖色光晕 */
  var glowEls = {};
  ['agents', 'eval', 'rl', 'arch'].forEach(function (cid) {
    var hub = nodeMap['hub-' + cid];
    glowEls[cid] = svgEl('circle', { cx: hub.bx, cy: hub.by, r: 150, fill: 'url(#kg-g-' + cid + ')' }, layerGlow);
  });

  /* 渲染连线与流动光脉冲 */
  var edgeEls = EDGES.map(function (e, idx) {
    var c = e.cluster ? CLUSTERS[e.cluster].color : '#B8A69E';
    var line = svgEl('line', {
      stroke: c,
      'stroke-width': e.kind === 'core' ? 2.1 : e.kind === 'paper' ? 1.5 : 1.15,
      'stroke-dasharray': e.kind === 'bridge' ? '4 5' : '',
      'stroke-linecap': 'round'
    }, layerEdges);
    var pulse = null;
    if (e.kind !== 'sat') {
      pulse = svgEl('circle', { r: e.kind === 'core' ? 3.2 : 2.4, fill: c }, layerPulses);
    }
    return { edge: e, line: line, pulse: pulse, phase: idx * 0.27 };
  });

  /* 渲染全部节点（支持悬停、拖拽、点击跳转） */
  var hoveredId = null;
  var activeCluster = 'all';
  var autoTour = true;
  var tourOrder = ['all', 'agents', 'eval', 'rl', 'arch'];
  var tourIdx = 0;
  var tourElapsed = 0;
  var prevTs = null;
  var dragging = null;
  var dragMoved = false;

  var nodeEls = NODES.map(function (n) {
    var g = svgEl('g', { class: 'kg-node kg-node--' + n.kind, 'data-id': n.id }, layerNodes);
    var c = (CLUSTERS[n.cluster] || CLUSTERS.all).color;

    if (n.kind === 'core') {
      svgEl('circle', { r: n.r + 9, fill: 'none', stroke: '#FEDCCC', 'stroke-width': 2, 'stroke-dasharray': '5 6', class: 'kg-core-ring' }, g);
      svgEl('circle', { r: n.r, fill: '#FFFFFF', stroke: '#F87C4C', 'stroke-width': 2.6 }, g);
      svgEl('image', { href: './assets/keye-logo.png', x: -22, y: -22, width: 44, height: 44 }, g);
      var ct = svgEl('text', { y: n.r + 20, 'text-anchor': 'middle', class: 'kg-lbl kg-lbl--core' }, g);
      ct.textContent = n.label;
    } else if (n.kind === 'hub') {
      svgEl('circle', { r: n.r + 6, fill: 'none', stroke: c, 'stroke-width': 1.3, opacity: 0.35 }, g);
      svgEl('circle', { r: n.r, fill: '#FFFFFF', stroke: c, 'stroke-width': 2.4 }, g);
      svgEl('circle', { r: 5.5, fill: c }, g);
      var ht = svgEl('text', { y: n.r + 17, 'text-anchor': 'middle', class: 'kg-lbl kg-lbl--hub' }, g);
      ht.textContent = n.label;
    } else if (n.kind === 'paper') {
      if (n.latest) {
        svgEl('circle', { r: n.r + 7, fill: 'none', stroke: '#F87C4C', 'stroke-width': 1.6, class: 'kg-latest-pulse' }, g);
      }
      svgEl('circle', { r: n.r, fill: '#FFFFFF', stroke: c, 'stroke-width': 2.2 }, g);
      svgEl('circle', { r: n.r * 0.44, fill: c }, g);
      var side = n.lblSide || 'top';
      var tx = 0, ty = -n.r - 20, mx = 0, my = -n.r - 7, anchor = 'middle';
      if (side === 'bottom') {
        ty = n.r + 16;
        my = n.r + 29;
      } else if (side === 'right') {
        tx = n.r + 10;
        mx = n.r + 10;
        ty = -2;
        my = 12;
        anchor = 'start';
      }
      var pt = svgEl('text', { x: tx, y: ty, 'text-anchor': anchor, class: 'kg-lbl kg-lbl--paper' }, g);
      pt.textContent = n.label;
      var pm = svgEl('text', { x: mx, y: my, 'text-anchor': anchor, class: 'kg-lbl kg-lbl--metric', fill: c }, g);
      pm.textContent = n.metric;
    } else {
      svgEl('circle', { r: n.r, fill: c, opacity: 0.78 }, g);
      var st = svgEl('text', { y: 15, 'text-anchor': 'middle', class: 'kg-lbl kg-lbl--sat' }, g);
      st.textContent = n.label;
    }

    /* 悬停高亮邻域 */
    g.addEventListener('mouseenter', function () {
      hoveredId = n.id;
      updateNarrative();
    });
    g.addEventListener('mouseleave', function () {
      if (!dragging) {
        hoveredId = null;
        updateNarrative();
      }
    });

    /* 指针拖拽（松手未移动则触发点击跳转或聚焦） */
    g.addEventListener('pointerdown', function (ev) {
      ev.preventDefault();
      autoTour = false;
      syncTourBtn();
      dragging = n;
      dragMoved = false;
      hoveredId = n.id;
      try { g.setPointerCapture(ev.pointerId); } catch (e) {}
    });
    g.addEventListener('pointermove', function (ev) {
      if (dragging !== n) return;
      var pt = toSvgPoint(ev);
      if (Math.hypot(pt.x - n.x, pt.y - n.y) > 4) dragMoved = true;
      n.dx = Math.max(-140, Math.min(140, pt.x - n.bx));
      n.dy = Math.max(-95, Math.min(95, pt.y - n.by));
    });
    g.addEventListener('pointerup', function () {
      if (dragging !== n) return;
      dragging = null;
      if (!dragMoved) {
        if (n.kind === 'paper' && n.url) {
          window.location.href = n.url;
        } else if (n.kind === 'hub') {
          selectCluster(activeCluster === n.cluster ? 'all' : n.cluster, false);
        } else if (n.kind === 'core') {
          selectCluster('all', false);
        }
      }
    });

    return { node: n, g: g };
  });

  function toSvgPoint(ev) {
    var rect = svg.getBoundingClientRect();
    return {
      x: ((ev.clientX - rect.left) / rect.width) * W,
      y: ((ev.clientY - rect.top) / rect.height) * H
    };
  }

  /* 工具栏按钮与导览文案联动 */
  var pillBtns = host.querySelectorAll('.kg-pills button[data-cluster]');
  var tourBtn = host.querySelector('.kg-tour-btn');
  var narDot = host.querySelector('.kg-nar-dot');
  var narTitle = host.querySelector('.kg-nar-title');
  var narMetric = host.querySelector('.kg-nar-metric');
  var narDesc = host.querySelector('.kg-nar-desc');
  var narLink = host.querySelector('.kg-nar-link');
  var tourBar = host.querySelector('.kg-tour-bar');
  var TOUR_MS = 4200;

  function syncTourBtn() {
    tourBtn.setAttribute('aria-pressed', String(autoTour));
    tourBtn.textContent = autoTour ? 'Auto Tour: ON' : 'Auto Tour: OFF';
    if (!autoTour && tourBar) tourBar.style.width = '0%';
  }

  function selectCluster(cid, keepTour) {
    activeCluster = cid;
    var idx = tourOrder.indexOf(cid);
    if (idx !== -1) tourIdx = idx;
    if (!keepTour) {
      autoTour = false;
      syncTourBtn();
    }
    pillBtns.forEach(function (b) {
      var on = b.getAttribute('data-cluster') === cid;
      b.setAttribute('aria-pressed', String(on));
      b.classList.toggle('is-active', on);
    });
    updateNarrative();
  }

  function updateNarrative() {
    var h = hoveredId ? nodeMap[hoveredId] : null;
    if (h && h.kind === 'paper') {
      var cm = CLUSTERS[h.cluster];
      narDot.style.background = cm.color;
      narTitle.textContent = h.label;
      narMetric.textContent = h.metric;
      narMetric.hidden = false;
      narDesc.textContent = h.desc;
      narLink.href = h.url;
      narLink.hidden = false;
      return;
    }
    var cid = (h && h.kind === 'hub') ? h.cluster : activeCluster;
    var info = CLUSTERS[cid] || CLUSTERS.all;
    narDot.style.background = info.color;
    narTitle.textContent = info.title;
    narMetric.textContent = info.label;
    narMetric.hidden = false;
    narDesc.textContent = info.desc;
    narLink.hidden = true;
  }

  pillBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      selectCluster(btn.getAttribute('data-cluster'), false);
    });
  });

  tourBtn.addEventListener('click', function () {
    autoTour = !autoTour;
    tourElapsed = 0;
    syncTourBtn();
  });

  /* 定时同步确保自动导览在所有浏览器环境下稳定推进（悬停/拖拽时自动暂停） */
  setInterval(function () {
    if (!autoTour || hoveredId || dragging) return;
    tourElapsed += 100;
    if (tourBar) tourBar.style.width = Math.min(100, (tourElapsed / TOUR_MS) * 100).toFixed(1) + '%';
    if (tourElapsed >= TOUR_MS) {
      tourElapsed = 0;
      tourIdx = (tourIdx + 1) % tourOrder.length;
      selectCluster(tourOrder[tourIdx], true);
    }
  }, 100);

  updateNarrative();

  /* 60fps 平滑驱动循环（微幅呼吸漂浮 + 沿边光脉冲） */
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var t = 0;

  function tick(ts) {
    var dt = prevTs === null ? 16 : Math.min(50, Math.max(0, ts - prevTs));
    prevTs = ts;
    if (!reduced) t += dt * 0.001;

    /* 更新每个节点有机微浮位置 + 拖拽弹性缓慢回位 */
    NODES.forEach(function (n) {
      if (dragging !== n) {
        n.dx *= 0.96;
        n.dy *= 0.96;
      }
      var amp = reduced ? 0 : (n.kind === 'core' ? 1.2 : n.kind === 'hub' ? 3.2 : 4.2);
      n.x = n.bx + n.dx + Math.sin(t * 1.1 + n.seed * 1.7) * amp;
      n.y = n.by + n.dy + Math.cos(t * 0.9 + n.seed * 2.3) * amp;
    });

    /* 更新星团光晕 */
    ['agents', 'eval', 'rl', 'arch'].forEach(function (cid) {
      var hub = nodeMap['hub-' + cid];
      var w = activeCluster === 'all' || activeCluster === cid ? 1 : 0.2;
      glowEls[cid].setAttribute('cx', hub.x.toFixed(1));
      glowEls[cid].setAttribute('cy', hub.y.toFixed(1));
      glowEls[cid].setAttribute('opacity', String(w));
    });

    /* 判定每个节点的聚焦权重 */
    function nodeWeight(n) {
      if (hoveredId) {
        if (adjMap[hoveredId] && adjMap[hoveredId][n.id]) return 1;
        return 0.14;
      }
      if (activeCluster === 'all') return 1;
      if (n.id === 'core') return 0.72;
      return n.cluster === activeCluster ? 1 : 0.14;
    }

    /* 更新连线与沿边流动光点 */
    edgeEls.forEach(function (item) {
      var a = nodeMap[item.edge.from];
      var b = nodeMap[item.edge.to];
      item.line.setAttribute('x1', a.x.toFixed(1));
      item.line.setAttribute('y1', a.y.toFixed(1));
      item.line.setAttribute('x2', b.x.toFixed(1));
      item.line.setAttribute('y2', b.y.toFixed(1));

      var w = Math.min(nodeWeight(a), nodeWeight(b));
      if (hoveredId && (item.edge.from === hoveredId || item.edge.to === hoveredId)) w = 1;
      var baseOp = item.edge.kind === 'core' ? 0.52 : item.edge.kind === 'paper' ? 0.42 : item.edge.kind === 'bridge' ? 0.32 : 0.24;
      item.line.setAttribute('opacity', (baseOp * w).toFixed(2));

      if (item.pulse) {
        if (w > 0.45 && !reduced) {
          var p = ((t * 0.42 + item.phase) % 1 + 1) % 1;
          item.pulse.setAttribute('cx', (a.x + (b.x - a.x) * p).toFixed(1));
          item.pulse.setAttribute('cy', (a.y + (b.y - a.y) * p).toFixed(1));
          item.pulse.setAttribute('opacity', (0.85 * w).toFixed(2));
        } else {
          item.pulse.setAttribute('opacity', '0');
        }
      }
    });

    /* 更新节点位置与透明度 */
    nodeEls.forEach(function (item) {
      var n = item.node;
      var w = nodeWeight(n);
      var isHover = hoveredId === n.id;
      var sc = isHover ? 1.12 : 1;
      item.g.setAttribute('transform', 'translate(' + n.x.toFixed(1) + ',' + n.y.toFixed(1) + ') scale(' + sc + ')');
      item.g.setAttribute('opacity', w.toFixed(2));
    });

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
