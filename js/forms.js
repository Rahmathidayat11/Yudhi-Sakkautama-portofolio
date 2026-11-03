/* ==========================================================================
   07. FORMS — Validasi + pengiriman form kontak ke email, dan unduh profil
   Konfigurasi ada di js/config.js (window.YS.CONTACT)
   ========================================================================== */
(function (YS) {
  'use strict';

  const $ = YS.$;
  const $$ = YS.$$;

  const form = $('#contactForm');
  const formStatus = $('#formStatus');
  const CONFIG = YS.CONTACT || {};

  /* Kunci belum diisi -> jalankan mode demo agar situs tetap berfungsi */
  const isConfigured = () =>
    Boolean(CONFIG.accessKey) && !/^(GANTI-|ISI-ACCESS-KEY)/.test(CONFIG.accessKey);

  if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnLabel = submitBtn ? submitBtn.innerHTML : '';
    let sending = false;

    const mark = (input, valid) => {
      const field = input.closest('.field');
      if (!field) return;
      field.classList.toggle('has-error', !valid);
      field.classList.toggle('is-valid', valid);
    };

    const setStatus = (text, isError) => {
      if (!formStatus) return;
      formStatus.textContent = text;
      formStatus.classList.toggle('is-error', Boolean(isError));
    };

    const setLoading = (state) => {
      sending = state;
      if (!submitBtn) return;
      submitBtn.disabled = state;
      submitBtn.classList.toggle('is-loading', state);
      submitBtn.innerHTML = state
        ? 'Mengirim… <span class="btn__spinner" aria-hidden="true"></span>'
        : btnLabel;
    };

    const readField = (selector) => $(selector);

    /* ---------- Validasi ---------- */
    function validate() {
      const name = readField('#name');
      const email = readField('#email');
      const message = readField('#message');

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      const nameOk = name.value.trim().length >= 2;
      const msgOk = message.value.trim().length >= 5;

      mark(name, nameOk);
      mark(email, emailOk);
      mark(message, msgOk);

      if (!(nameOk && emailOk && msgOk)) {
        setStatus('Mohon lengkapi nama, email yang valid, dan pesan Anda.', true);
        // Fokuskan kolom pertama yang bermasalah agar mudah diperbaiki
        const firstBad = [!nameOk && name, !emailOk && email, !msgOk && message].find(Boolean);
        if (firstBad) firstBad.focus();
        return null;
      }

      return {
        name: name.value.trim(),
        email: email.value.trim(),
        subject: readField('#subject').value,
        message: message.value.trim(),
      };
    }

    /* ---------- Kirim ke Web3Forms ---------- */
    async function sendToEmail(data) {
      const payload = {
        access_key: CONFIG.accessKey,
        subject: '[Website] ' + data.subject + ' — dari ' + data.name,
        from_name: 'Personal Hub Yudhi Sakkautama',
        name: data.name,
        email: data.email,
        topik: data.subject,
        message: data.message,
        /* Honeypot: bot biasanya mengisi kolom tersembunyi ini */
        botcheck: form.querySelector('[name="botcheck"]')?.checked || false,
      };

      const res = await fetch(CONFIG.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });

      return res.json();
    }

    /* ---------- Submit ---------- */
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (sending) return;

      const data = validate();
      if (!data) return;

      /* Mode demo: kunci belum diisi */
      if (!isConfigured()) {
        setStatus(
          'Terima kasih, ' + data.name + '. Form sudah tervalidasi — mode demo aktif karena ' +
          'access key Web3Forms belum diisi di js/config.js.',
          false
        );
        form.reset();
        $$('.field', form).forEach((f) => f.classList.remove('is-valid', 'has-error'));
        return;
      }

      setLoading(true);
      setStatus('Mengirim pesan Anda…', false);

      try {
        const result = await sendToEmail(data);

        if (result && result.success) {
          setStatus(
            'Terima kasih, ' + data.name + '. Pesan Anda sudah terkirim. ' +
            'Saya akan membalas melalui email secepatnya.',
            false
          );
          form.reset();
          $$('.field', form).forEach((f) => f.classList.remove('is-valid', 'has-error'));
        } else {
          throw new Error((result && result.message) || 'Pengiriman gagal.');
        }
      } catch (err) {
        const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
        setStatus(
          offline
            ? 'Koneksi internet terputus. Silakan periksa jaringan lalu coba lagi.'
            : 'Pesan gagal dikirim. Silakan coba lagi, atau hubungi langsung ke ' +
              (CONFIG.email || 'email yang tertera di halaman ini') + '.',
          true
        );
      } finally {
        setLoading(false);
      }
    });

    /* ---------- Validasi saat keluar kolom ---------- */
    $$('input, textarea', form).forEach((el) => {
      el.addEventListener('blur', () => {
        if (!el.value.trim()) return;
        if (el.type === 'email') mark(el, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
        else mark(el, el.value.trim().length >= 2);
      });
    });
  }

  /* ---------- Download professional profile (placeholder yang aman) ---------- */
  $('#downloadCv')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (formStatus) formStatus.textContent = '';
    alert('Profil profesional (PDF) dapat ditautkan di sini setelah dokumen final disiapkan.');
  });
})(window.YS);
