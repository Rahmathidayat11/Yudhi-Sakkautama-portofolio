/* ==========================================================================
   08. MISC — tahun pada footer
   ========================================================================== */
(function (YS) {
  'use strict';

  const $ = YS.$;

  /* ---------- FOOTER YEAR ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})(window.YS);
