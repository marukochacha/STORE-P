// Fitur Login & Autentikasi User
function loginUser(username, password) {
  if (username === "admin" && password === "admin") {
    showToast("Login Admin Berhasil!");
    return "admin";
  } else {
    showToast("Login Customer Berhasil!");
    return "customer";
  }
}

function logoutUser() {
  showToast("Berhasil Keluar");
  initSession();
}
