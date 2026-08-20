// Utility Helper & Inisialisasi Aplikasi
function formatRp(amount) {
  return "Rp " + amount.toLocaleString('id-ID');
}

let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

function initSession() {
  console.log("Aplikasi berhasil dimuat.");
  if (typeof renderHome === "function") renderHome();
}

window.addEventListener('DOMContentLoaded', () => {
  initSession();
});
