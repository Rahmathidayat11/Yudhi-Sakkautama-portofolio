/* ==========================================================================
   06. GALLERY — Lightbox foto dengan navigasi keyboard & klik backdrop
   ========================================================================== */
(function (YS) {
  'use strict';

  const $ = YS.$;
  const $$ = YS.$$;

  const lb = $('#lightbox');
  const lbImg = $('#lightboxImg');
  const lbCaption = $('#lightboxCaption');
  const galleryItems = $$('.g-item');
  if (!lb || galleryItems.length === 0) return;

  let lbIndex = 0;

  function openLightbox(index) {
    lbIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[lbIndex];
    lbImg.src = item.dataset.src;
    lbImg.alt = item.querySelector('img')?.alt || '';
    lbCaption.textContent = item.dataset.caption || '';
    lb.classList.add('is-open');
    document.body.classList.add('is-locked');
  }
  function closeLightbox() {
    lb.classList.remove('is-open');
    document.body.classList.remove('is-locked');
  }

  galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
  $('#lightboxClose')?.addEventListener('click', closeLightbox);
  $('#lightboxPrev')?.addEventListener('click', () => openLightbox(lbIndex - 1));
  $('#lightboxNext')?.addEventListener('click', () => openLightbox(lbIndex + 1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(lbIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(lbIndex + 1);
  });
})(window.YS);
