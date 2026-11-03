/* ==========================================================================
   05. PROJECT MODAL — Menampilkan detail proyek dari YS.PROJECTS
   Bergantung pada: js/projects-data.js (harus dimuat lebih dulu)
   ========================================================================== */
(function (YS) {
  'use strict';

  const $ = YS.$;
  const $$ = YS.$$;

  const PROJECTS = YS.PROJECTS || {};
  const pKeys = Object.keys(PROJECTS);
  const pModal = $('#projectModal');
  if (!pModal || pKeys.length === 0) return;

  const pEls = {
    img: $('#pmodalImg'), cat: $('#pmodalCat'), role: $('#pmodalRole'),
    title: $('#pmodalTitle'), lead: $('#pmodalLead'), context: $('#pmodalContext'),
    challenge: $('#pmodalChallenge'), approach: $('#pmodalApproach'),
    result: $('#pmodalResult'), tags: $('#pmodalTags'),
  };
  let pIndex = 0;
  let pLastFocus = null;

  function renderProject(key) {
    const data = PROJECTS[key];
    if (!data) return;
    pIndex = pKeys.indexOf(key);
    pEls.img.src = data.img;
    pEls.img.alt = data.title;
    pEls.cat.textContent = data.cat;
    pEls.role.textContent = data.role;
    pEls.title.textContent = data.title;
    pEls.lead.textContent = data.lead;
    pEls.context.textContent = data.context;
    pEls.challenge.textContent = data.challenge;
    pEls.approach.textContent = data.approach;
    pEls.result.textContent = data.result;
    pEls.tags.innerHTML = data.tags.map(t => `<span>${t}</span>`).join('');
  }

  function openProject(key) {
    if (!PROJECTS[key]) return;
    pLastFocus = document.activeElement;
    renderProject(key);
    pModal.hidden = false;
    void pModal.offsetWidth; // paksa reflow agar transisi berjalan
    pModal.classList.add('is-open');
    document.body.classList.add('is-locked');
    $('#pmodalNext')?.focus();
  }

  function closeProject() {
    pModal.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    const onEnd = () => {
      pModal.hidden = true;
      pModal.removeEventListener('transitionend', onEnd);
    };
    pModal.addEventListener('transitionend', onEnd);
    // cadangan bila transitionend tidak terpicu
    setTimeout(() => { if (!pModal.classList.contains('is-open')) pModal.hidden = true; }, 500);
    if (pLastFocus && typeof pLastFocus.focus === 'function') pLastFocus.focus();
  }

  function stepProject(dir) {
    const next = (pIndex + dir + pKeys.length) % pKeys.length;
    renderProject(pKeys[next]);
  }

  $$('[data-open-project]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openProject(btn.dataset.openProject);
    });
  });
  $$('[data-close-project]').forEach(el => el.addEventListener('click', closeProject));
  $('#pmodalPrev')?.addEventListener('click', () => stepProject(-1));
  $('#pmodalNext')?.addEventListener('click', () => stepProject(1));

  document.addEventListener('keydown', e => {
    if (pModal.hidden) return;
    if (e.key === 'Escape') closeProject();
    if (e.key === 'ArrowLeft') stepProject(-1);
    if (e.key === 'ArrowRight') stepProject(1);
  });
})(window.YS);
