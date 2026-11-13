/**
 * ══════════════════════════════════════════════════════════════════════════
 * ANJALI SHIKHARE — ATMOSPHERE ENGINE
 * Light / Dark Mode Switcher + Subtle Animated Background
 * Vanilla JS. No external libraries. prefers-reduced-motion respected.
 * ══════════════════════════════════════════════════════════════════════════
 */
(function () {
  'use strict';

  /* ── CONFIG ─────────────────────────────────────────────────────────── */
  var STORAGE_KEY      = 'anjali-theme';
  var PARTICLE_LIGHT   = 18;   // warm dust particles (light mode)
  var PARTICLE_DARK    = 14;   // cool glow particles (dark mode)
  var REDUCED          = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── INIT ───────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    buildAtmosphere();
    restoreTheme();
    bindToggle();
  });

  /* ── BUILD DOM ──────────────────────────────────────────────────────── */
  function buildAtmosphere() {
    var bg = document.getElementById('atmosphere-bg');
    if (!bg) return;

    // Gradient layers
    var gl = el('div', 'atm-grad-light');
    var gd = el('div', 'atm-grad-dark');
    bg.appendChild(gl);
    bg.appendChild(gd);

    // Orbs
    var orbs = el('div', 'atm-orbs');
    ['l1','l2','l3','d1','d2','d3'].forEach(function(k) {
      orbs.appendChild(el('div', 'atm-orb atm-orb-' + k));
    });
    bg.appendChild(orbs);

    // Particles
    if (!REDUCED) {
      var pc = el('div', 'atm-particles');
      buildParticles(pc, PARTICLE_LIGHT, 'light-p');
      buildParticles(pc, PARTICLE_DARK,  'dark-p');
      bg.appendChild(pc);
    }
  }

  function buildParticles(container, count, cls) {
    for (var i = 0; i < count; i++) {
      var p = el('div', 'atm-particle ' + cls);
      var size  = rand(1.5, 3.5).toFixed(1);
      var x     = rand(2, 98).toFixed(1);
      var y     = rand(5, 92).toFixed(1);
      var pf    = rand(8, 18).toFixed(1);
      var pd    = rand(22, 45).toFixed(1);
      var delay = rand(0, 12).toFixed(1);
      p.style.cssText = [
        'width:'      + size + 'px',
        'height:'     + size + 'px',
        'left:'       + x    + '%',
        'top:'        + y    + '%',
        '--pf:'       + pf   + 's',
        '--pd:'       + pd   + 's',
        '--pa: -'     + delay + 's'
      ].join(';');
      container.appendChild(p);
    }
  }

  /* ── THEME ──────────────────────────────────────────────────────────── */
  function restoreTheme() {
    var saved = localStorage.getItem(STORAGE_KEY);
    // Apply instantly (no animation) on page load
    document.body.style.transition = 'none';
    if (saved === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    // Re-enable transitions on next frame
    requestAnimationFrame(function () {
      document.body.style.transition = '';
    });
    updateAriaLabel();
  }

  function toggleTheme() {
    var isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    updateAriaLabel();
  }

  function updateAriaLabel() {
    var btn = document.getElementById('themeToggleBtn');
    if (!btn) return;
    var isDark = document.body.classList.contains('dark-mode');
    btn.setAttribute('aria-label', isDark
      ? 'Switch to light mode'
      : 'Switch to dark mode');
    btn.setAttribute('title', isDark
      ? 'Switch to light mode'
      : 'Switch to dark mode');
  }

  /* ── BIND ───────────────────────────────────────────────────────────── */
  function bindToggle() {
    var btn = document.getElementById('themeToggleBtn');
    if (!btn) return;
    btn.addEventListener('click', toggleTheme);
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
      }
    });
  }

  /* ── HELPERS ────────────────────────────────────────────────────────── */
  function el(tag, cls) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

})();
