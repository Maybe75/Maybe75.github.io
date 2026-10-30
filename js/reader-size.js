/* 文章页右上角的字号调节
   —— 让访客按自己的眼睛调正文大小，选择记在浏览器里，下次打开还是这个大小。
   只在有 #articleContent 的页面（也就是文章页）出现。 */
(function () {
  'use strict';

  if (!document.getElementById('articleContent')) return;

  var KEY = 'fusheng.readScale';
  var MIN = 0.85;
  var MAX = 1.60;
  var STEP = 0.10;
  var scale = 1;

  try {
    var saved = parseFloat(localStorage.getItem(KEY));
    if (!isNaN(saved)) scale = Math.min(MAX, Math.max(MIN, saved));
  } catch (e) { /* 隐私模式下读不到就用默认 */ }

  var box = document.createElement('div');
  box.id = 'fsCtl';
  box.setAttribute('role', 'group');
  box.setAttribute('aria-label', '正文字号');
  box.innerHTML =
    '<button type="button" data-d="-" title="字号调小" aria-label="字号调小">A−</button>' +
    '<span class="fs-val" title="当前字号">100%</span>' +
    '<button type="button" data-d="+" title="字号调大" aria-label="字号调大">A+</button>';

  var valEl = box.querySelector('.fs-val');

  function apply() {
    document.documentElement.style.setProperty('--read-scale', String(scale));
    if (valEl) valEl.textContent = Math.round(scale * 100) + '%';
  }

  box.addEventListener('click', function (e) {
    var btn = e.target;
    if (!btn || btn.tagName !== 'BUTTON') return;

    var step = btn.getAttribute('data-d') === '+' ? STEP : -STEP;
    scale = Math.round((scale + step) * 100) / 100;
    scale = Math.min(MAX, Math.max(MIN, scale));
    apply();

    try { localStorage.setItem(KEY, String(scale)); } catch (e2) { /* 忽略 */ }
  });

  function mount() {
    document.body.appendChild(box);
    apply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
