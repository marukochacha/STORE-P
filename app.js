/* ======================= FORMAT HELPER ======================= */
function formatRp(n){ return "Rp " + n.toLocaleString('id-ID'); }
function starString(rating){
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5-full);
}

/* ======================= TOAST ======================= */
let toastTimer;
function showToast(msg){
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> toast.classList.remove('show'), 2400);
}

/* ======================= JALANKAN SESI SAAT HALAMAN DIBUKA ======================= */
initSession();
