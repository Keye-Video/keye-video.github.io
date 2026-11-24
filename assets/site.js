/* ============================================================
   Keye Video Team — 正式版交互脚本（零外部依赖）
   功能：移动端菜单、论文标签筛选、中英双语切换、目录高亮、BibTeX 复制、图表灯箱
   ============================================================ */

(function () {
  'use strict';

  /* 1. 移动端汉堡导航 */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.topbar-inner .nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* 2. 团队首页论文分类筛选 */
  var filterBar = document.querySelector('.filter-bar[data-pub-filter]');
  if (filterBar) {
    var paperCards = document.querySelectorAll('.paper-card[data-tags]');
    filterBar.querySelectorAll('button[data-tag]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tag = btn.getAttribute('data-tag');
        filterBar.querySelectorAll('button[data-tag]').forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === btn));
        });
        paperCards.forEach(function (card) {
          var tags = (card.getAttribute('data-tags') || '').split(/\s+/);
          card.hidden = !(tag === 'all' || tags.indexOf(tag) !== -1);
        });
      });
    });
  }

  /* 3. 中英双语切换 */
  var langBtns = document.querySelectorAll('.ar-lang button[data-lang]');
  function setLang(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
    langBtns.forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
    });
    try { localStorage.setItem('keye-video-lang', lang); } catch (e) {}
  }
  if (langBtns.length) {
    var saved = null;
    try { saved = localStorage.getItem('keye-video-lang'); } catch (e) {}
    if (saved === 'en' || saved === 'zh') setLang(saved);
    langBtns.forEach(function (btn) {
      btn.addEventListener('click', function () { setLang(btn.getAttribute('data-lang')); });
    });
  }

  /* 4. 论文页目录滚动高亮 */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.ar-toc a[href^="#"], .ar-side a[href^="#"]'));
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var sectionIds = [];
    tocLinks.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      if (id && sectionIds.indexOf(id) === -1) sectionIds.push(id);
    });
    var sections = sectionIds.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    function activate(id) {
      tocLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + id); });
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) activate(entry.target.id); });
    }, { rootMargin: '-12% 0px -72% 0px', threshold: 0 });
    sections.forEach(function (sec) { io.observe(sec); });
    if (sections.length) activate(sections[0].id);
  }

  /* 5. 代码块 / BibTeX 一键复制 */
  document.querySelectorAll('.ar-main pre').forEach(function (pre) {
    if (pre.querySelector('.pre-copy')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pre-copy';
    btn.textContent = 'Copy';
    btn.addEventListener('click', function () {
      var codeEl = pre.querySelector('code');
      var text = (codeEl ? codeEl.textContent : pre.textContent).trim();
      var done = function () {
        btn.textContent = 'Copied';
        btn.classList.add('done');
        setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('done'); }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () {});
      }
    });
    pre.appendChild(btn);
  });

  /* 6. 图表点击放大灯箱 */
  var zoomTargets = document.querySelectorAll('[data-zoom]');
  if (zoomTargets.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<button type="button" class="lightbox-close" aria-label="Close">×</button><div class="lightbox-content"></div>';
    document.body.appendChild(lb);
    var lbBody = lb.querySelector('.lightbox-content');
    var closeLb = function () { lb.classList.remove('open'); lbBody.innerHTML = ''; };
    lb.querySelector('.lightbox-close').addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });
    zoomTargets.forEach(function (el) {
      el.classList.add('zoomable');
      el.addEventListener('click', function () {
        lbBody.innerHTML = '';
        lbBody.appendChild(el.cloneNode(true));
        lb.classList.add('open');
      });
    });
  }
})();
