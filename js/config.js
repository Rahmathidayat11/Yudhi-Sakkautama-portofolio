/* ==========================================================================
   KONFIGURASI FORM KONTAK
   ---------------------------------------------------------------------------
   SATU-SATUNYA FILE YANG PERLU ANDA UBAH untuk mengaktifkan pengiriman email.

   CARA MENDAPATKAN ACCESS KEY (gratis, tanpa server):
   1. Buka  https://web3forms.com
   2. Masukkan email tujuan:  yudhisak@sunariepusaka.id
   3. Klik "Create Access Key"
   4. Cek kotak masuk email tersebut, salin Access Key yang dikirim
   5. Salin js/config.local.js.example menjadi js/config.local.js,
      lalu tempel kunci Anda di sana (file itu diabaikan git)

   Kunci TIDAK ditaruh di file ini agar tidak ikut ter-push ke GitHub.
   Selama kunci belum diisi, form berjalan dalam MODE DEMO.
   ========================================================================== */
window.YS = window.YS || {};

window.YS.CONTACT = {
  /* Diisi lewat js/config.local.js — lihat config.local.js.example */
  accessKey: '',

  /* Email tujuan yang ditampilkan pada pesan sukses & dipakai saat pendaftaran key */
  email: 'yudhisak@sunariepusaka.id',

  /* Endpoint Web3Forms — tidak perlu diubah */
  endpoint: 'https://api.web3forms.com/submit',
};
