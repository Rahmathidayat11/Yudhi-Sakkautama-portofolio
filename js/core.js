/* ==========================================================================
   YUDHI SAKKAUTAMA — PERSONAL PROFESSIONAL HUB
   01. CORE — Utilitas bersama, preloader, navbar, scroll chrome
   ========================================================================== */
window.YS = window.YS || {};

(function (YS) {
  'use strict';

  /* ---------- Utilitas bersama ---------- */
  YS.$ = (sel, ctx = document) => ctx.querySelector(sel);
  YS.$$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  YS.prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  YS.canHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* Event bus sederhana — dipakai lintas modul (mis. ys:hero-start) */
  YS.events = document;

  const $ = YS.$;
  const $$ = YS.$$;

  /* ---------- Preloader ---------- */
  const preloader = $('#preloader');
  const preloaderBar = $('#preloaderBar');
  let progress = 0;

  const progressTimer = setInterval(() => {
    progress = Math.min(progress + Math.random() * 16 + 6, 96);
    if (preloaderBar) preloaderBar.style.width = progress + '%';
  }, 130);

  function finishPreloader() {
    clearInterval(progressTimer);
    if (preloaderBar) preloaderBar.style.width = '100%';
    setTimeout(() => {
      preloader && preloader.classList.add('is-done');
      document.body.classList.remove('is-locked');
      YS.events.dispatchEvent(new CustomEvent('ys:hero-start'));
    }, 420);
  }

  document.body.classList.add('is-locked');
  window.addEventListener('load', () => setTimeout(finishPreloader, 700));
  // Pengaman bila 'load' tertunda karena aset eksternal
  setTimeout(finishPreloader, 4200);

  /* ---------- Navbar: sticky, mobile menu, active link ---------- */
  const nav = $('#nav');
  const navLinks = $('#navLinks');
  const navToggle = $('#navToggle');

  YS.onScrollNav = () => nav && nav.classList.toggle('is-stuck', window.scrollY > 40);
  YS.onScrollNav();

  navToggle && navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });

  $$('.nav__link, .nav__cta').forEach(link => {
    link.addEventListener('click', () => {
      navLinks && navLinks.classList.remove('is-open');
      navToggle && navToggle.classList.remove('is-open');
      navToggle && navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Active link via IntersectionObserver
  const sections = $$('main > section[id]');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      $$('.nav__link').forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + id));
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => sectionObserver.observe(s));

  /* ---------- Scroll progress ---------- */
  const progressBar = $('#scrollProgress');
  YS.updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  };

  /* ---------- Cursor glow ---------- */
  const glow = $('#cursorGlow');
  if (glow) {
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2, glowX = mouseX, glowY = mouseY;

    window.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    (function animateGlow() {
      glowX += (mouseX - glowX) * 0.09;
      glowY += (mouseY - glowY) * 0.09;
      glow.style.transform = `translate3d(${glowX - 210}px, ${glowY - 210}px, 0)`;
      requestAnimationFrame(animateGlow);
    })();
  }

  /* ---------- Scroll to top + parallax ornament ---------- */
  const toTop = $('#toTop');
  const toTopRing = toTop?.querySelector('.to-top__ring circle');
  const parallaxEls = $$('[data-parallax]');

  toTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: YS.prefersReduced ? 'auto' : 'smooth' });
  });

  YS.updateScrollChrome = function (progressPct) {
    if (toTop) {
      toTop.classList.toggle('is-visible', window.scrollY > 620);
      if (toTopRing) {
        const len = 126;
        toTopRing.style.strokeDashoffset = String(len - (len * progressPct) / 100);
      }
    }
    if (!YS.prefersReduced) {
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0;
        el.style.transform = `translate3d(0, ${(window.scrollY * speed).toFixed(1)}px, 0)`;
      });
    }
  };

  /* ---------- Scroll handler terpusat (RAF-batched) ---------- */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      YS.onScrollNav();
      YS.updateProgress();
      const max = document.documentElement.scrollHeight - window.innerHeight;
      YS.updateScrollChrome(max > 0 ? (window.scrollY / max) * 100 : 0);
      ticking = false;
    });
  }, { passive: true });

  YS.updateProgress();

})(window.YS);
