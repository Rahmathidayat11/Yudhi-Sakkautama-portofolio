/* ==========================================================================
   02. TEXT ANIMATION — Hero typing, split text, scramble, scroll reveal, counter
   ========================================================================== */
(function (YS) {
  'use strict';

  const $ = YS.$;
  const $$ = YS.$$;
  const prefersReduced = YS.prefersReduced;

  /* ---------------------------------------------------------------
     HERO SEQUENCE — typing effect + reveal hero lines
  --------------------------------------------------------------- */
  const ROLES = [
    'Mining Exploration',
    'HSE Professional',
    'Project Management',
    'Digital Innovation'
  ];
  const typingEl = $('#typing');
  let heroStarted = false;

  function startHeroSequence() {
    if (heroStarted || !typingEl) return;
    heroStarted = true;
    revealHero();
    if (prefersReduced) {
      typingEl.textContent = ROLES.join(' · ');
      return;
    }
    let roleIdx = 0, charIdx = 0, deleting = false;

    (function tick() {
      const current = ROLES[roleIdx];
      charIdx += deleting ? -1 : 1;
      typingEl.textContent = current.slice(0, charIdx);

      let delay = deleting ? 38 : 62;
      if (!deleting && charIdx === current.length) { deleting = true; delay = 1500; }
      else if (deleting && charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % ROLES.length; delay = 320; }

      setTimeout(tick, delay);
    })();
  }

  // Hero lines dimunculkan setelah preloader selesai agar animasi karakter terlihat
  function revealHero() {
    $$('.hero [data-reveal]').forEach(el => {
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => el.classList.add('is-visible'), delay);
    });
  }

  YS.events.addEventListener('ys:hero-start', startHeroSequence);

  /* ---------------------------------------------------------------
     TEXT SPLIT ENGINE — per kata & per karakter
  --------------------------------------------------------------- */
  function buildUnit(text, mode, index) {
    const word = document.createElement('span');
    word.className = 'split-word';

    const inner = document.createElement('span');
    inner.className = 'split-word__inner';
    if (mode === 'chars') {
      Array.from(text).forEach((ch, ci) => {
        const c = document.createElement('span');
        c.className = 'split-char';
        c.textContent = ch;
        c.style.setProperty('--i', (index * 52 + ci * 34) + 'ms');
        inner.appendChild(c);
      });
    } else {
      inner.textContent = text;
      inner.style.setProperty('--i', (index * 62) + 'ms');
    }

    word.appendChild(inner);
    return word;
  }

  function splitText(el, mode) {
    if (!el || el.dataset.splitDone) return;
    el.dataset.splitDone = '1';

    // Kumpulkan node, dukung <br> dan <em> tanpa merusak struktur
    const nodes = Array.from(el.childNodes);
    const frag = document.createDocumentFragment();
    let index = 0;

    nodes.forEach(node => {
      if (node.nodeType === 3) {                        // teks
        node.textContent.split(/(\s+)/).forEach(part => {
          if (part === '') return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          frag.appendChild(buildUnit(part, mode, index++));
        });
      } else if (node.nodeName === 'BR') {
        frag.appendChild(document.createElement('br'));
        index = 0;
      } else {                                          // elemen inline (<em>, <mark>)
        const wrapper = node.cloneNode(false);          // pertahankan tag
        node.textContent.split(/(\s+)/).forEach(part => {
          if (part === '') return;
          if (/^\s+$/.test(part)) { wrapper.appendChild(document.createTextNode(' ')); return; }
          wrapper.appendChild(buildUnit(part, mode, index++));
        });
        frag.appendChild(wrapper);
      }
    });

    el.innerHTML = '';
    el.appendChild(frag);
    el.dataset.splitDone = 'done';
  }

  $$('[data-split="words"]').forEach(el => splitText(el, 'words'));
  $$('[data-split="chars"]').forEach(el => splitText(el, 'chars'));

  /* ---------------------------------------------------------------
     SCRAMBLE TEXT — decode saat masuk viewport
  --------------------------------------------------------------- */
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$%&*/<>';
  function scramble(el) {
    const final = el.textContent;
    const total = 26;
    let frame = 0;
    el.classList.add('is-scrambling');

    (function step() {
      el.textContent = final
        .split('')
        .map((ch, i) => {
          if (ch === ' ') return ' ';
          if (frame / total > i / final.length) return ch;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join('');

      frame++;
      if (frame <= total) requestAnimationFrame(step);
      else { el.textContent = final; el.classList.remove('is-scrambling'); }
    })();
  }

  if (!prefersReduced) {
    const scrambleObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        scramble(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    $$('[data-scramble]').forEach(el => scrambleObserver.observe(el));
  }

  /* ---------------------------------------------------------------
     SCROLL REVEAL
  --------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => el.classList.add('is-visible'), delay);
      obs.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  $$('[data-reveal]').forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------------
     COUNTERS
  --------------------------------------------------------------- */
  function runCounter(el) {
    const target = parseFloat(el.dataset.counter || '0');
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    (function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    })(start);
  }

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      runCounter(entry.target);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  $$('[data-counter]').forEach(el => counterObserver.observe(el));
})(window.YS);
