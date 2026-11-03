/* ==========================================================================
   03. INTERACTIONS — 3D tilt + spotlight, magnetic buttons, portfolio filters
   ========================================================================== */
(function (YS) {
  'use strict';

  const $$ = YS.$$;
  const prefersReduced = YS.prefersReduced;
  const canHover = YS.canHover;

  /* ---------------------------------------------------------------
     3D TILT + SPOTLIGHT
  --------------------------------------------------------------- */
  if (!prefersReduced && canHover) {
    $$('[data-tilt]').forEach(card => {
      let raf = null;
      let targetRX = 0, targetRY = 0, curRX = 0, curRY = 0;

      const render = () => {
        curRX += (targetRX - curRX) * 0.14;
        curRY += (targetRY - curRY) * 0.14;
        card.style.transform =
          `perspective(900px) rotateX(${curRX.toFixed(3)}deg) rotateY(${curRY.toFixed(3)}deg) translateY(-4px)`;
        raf = Math.abs(targetRX - curRX) > 0.01 || Math.abs(targetRY - curRY) > 0.01
          ? requestAnimationFrame(render) : null;
      };

      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        targetRY = (px - 0.5) * 11;
        targetRX = (0.5 - py) * 11;
        card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        if (!raf) raf = requestAnimationFrame(render);
      });

      card.addEventListener('mouseleave', () => {
        targetRX = 0; targetRY = 0;
        if (!raf) raf = requestAnimationFrame(render);
      });
    });
  }

  /* ---------------------------------------------------------------
     MAGNETIC BUTTONS
  --------------------------------------------------------------- */
  if (!prefersReduced && canHover) {
    $$('[data-magnetic]').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.18;
        const y = (e.clientY - r.top - r.height / 2) * 0.28;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---------------------------------------------------------------
     PORTFOLIO FILTERS
  --------------------------------------------------------------- */
  const filters = $$('.filter');
  const works = $$('.work');
  const worksEmpty = YS.$('#worksEmpty');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(f => {
        const active = f === btn;
        f.classList.toggle('is-active', active);
        f.setAttribute('aria-selected', String(active));
      });

      const key = btn.dataset.filter;
      let shown = 0;

      works.forEach(work => {
        const tags = (work.dataset.tags || '').split(/\s+/);
        const match = key === 'all' || tags.includes(key);
        work.classList.toggle('is-hidden', !match);
        if (match) {
          shown++;
          work.classList.remove('is-filtering');
          void work.offsetWidth; // paksa reflow agar animasi ulang
          work.classList.add('is-filtering');
        }
      });

      if (worksEmpty) worksEmpty.hidden = shown !== 0;
    });
  });
})(window.YS);
