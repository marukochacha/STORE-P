/* ======================= SESI OTOMATIS SAAT APLIKASI DIBUKA ======================= */
function initSession(){
  try{
    const savedUsers = localStorage.getItem(STORAGE_KEY_USERS);
    if(savedUsers) registeredUsers = JSON.parse(savedUsers);
  }catch(e){ registeredUsers = []; }

  let activeEmail = null;
  try{ activeEmail = localStorage.getItem(STORAGE_KEY_ACTIVE); }catch(e){}

  if(activeEmail){
    const match = registeredUsers.find(u => u.email === activeEmail);
    if(match){
      appState.user = {...match};
      appState.loggedIn = true;

      document.getElementById('roleOverlay').style.display = 'none';
      document.getElementById('app').style.display = 'block';

      document.getElementById('profileName').textContent = appState.user.username;
      document.getElementById('profileEmail').textContent = appState.user.email;
      document.getElementById('profilePhone').textContent = appState.user.phone;

      renderHome();
      updateCartBadge();
    }
  }
}

/* ======================= ROLE SELECT LOGIC ======================= */
function chooseRole(role){
  document.getElementById('roleOverlay').style.display = 'none';
  if(role === 'buyer'){
    if(registeredUsers.length > 0){
      document.getElementById('loginOverlay').style.display = 'flex';
    } else {
      document.getElementById('onboardingOverlay').style.display = 'flex';
    }
  } else {
    document.getElementById('adminLoginOverlay').style.display = 'flex';
  }
}

/* ---- login pembeli yang sudah punya akun ---- */
function cancelBuyerLogin(){
  document.getElementById('loginOverlay').style.display = 'none';
  document.getElementById('roleOverlay').style.display = 'flex';
}
function goToSignupFromLogin(){
  document.getElementById('loginOverlay').style.display = 'none';
  document.getElementById('onboardingOverlay').style.display = 'flex';
}
function goToLoginFromSignup(){
  document.getElementById('onboardingOverlay').style.display = 'none';
  document.getElementById('loginOverlay').style.display = 'flex';
}

function loginBuyer(){
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;
  const match = registeredUsers.find(u => u.email === email && u.password === pass);
  const err = document.getElementById('errLogin');
  if(!match){
    err.style.display = 'block';
    return;
  }
  err.style.display = 'none';
  appState.user = {...match};
  appState.loggedIn = true;
  setActiveSession(appState.user.email);

  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('loginOverlay').style.display = 'none';
  document.getElementById('app').style.display = 'block';

  document.getElementById('profileName').textContent = appState.user.username;
  document.getElementById('profileEmail').textContent = appState.user.email;
  document.getElementById('profilePhone').textContent = appState.user.phone;

  renderHome();
  updateCartBadge();
  showToast(`Selamat datang kembali, ${appState.user.username}! ⚡`);
}

/* ---- login admin ---- */
function cancelAdminLogin(){
  document.getElementById('adminLoginOverlay').style.display = 'none';
  document.getElementById('roleOverlay').style.display = 'flex';
}
function adminLoginSubmit(){
  const u = document.getElementById('adminUsername').value.trim();
  const p = document.getElementById('adminPassword').value;
  const err = document.getElementById('errAdminLogin');
  if(u === ADMIN_CREDENTIALS.username && p === ADMIN_CREDENTIALS.password){
    err.style.display = 'none';
    document.getElementById('adminUsername').value = '';
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminLoginOverlay').style.display = 'none';
    document.getElementById('adminApp').style.display = 'block';
    adminGoTo('ringkasan');
  } else {
    err.style.display = 'block';
  }
}

/* admin exit lewat modal konfirmasi */
function openAdminExitModal(){ document.getElementById('adminExitModal').classList.add('open'); }
function closeAdminExitModal(){ document.getElementById('adminExitModal').classList.remove('open'); }
function confirmAdminExit(){
  closeAdminExitModal();
  document.getElementById('adminApp').style.display = 'none';
  document.getElementById('roleOverlay').style.display = 'flex';
  showToast("Keluar dari dashboard admin");
}

/* ======================= ONBOARDING LOGIC ======================= */
function setDot(step){
  document.querySelectorAll('.ob-dot').forEach(d=>{
    d.classList.toggle('active', parseInt(d.dataset.dot) === step);
  });
}

function obNext(fromStep){
  if(fromStep === 1){
    const email = document.getElementById('obEmail').value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    document.getElementById('errEmail').style.display = valid ? 'none' : 'block';
    if(!valid) return;
    appState.user.email = email;
    document.getElementById('obStep1').classList.remove('active');
    document.getElementById('obStep2').classList.add('active');
    setDot(2);
  }
  if(fromStep === 2){
    const uname = document.getElementById('obUsername').value.trim();
    const pass = document.getElementById('obPassword').value;
    let ok = true;
    if(!uname){ document.getElementById('errUsername').style.display='block'; ok=false; }
    else document.getElementById('errUsername').style.display='none';
    if(pass.length < 6){ document.getElementById('errPassword').style.display='block'; ok=false; }
    else document.getElementById('errPassword').style.display='none';
    if(!ok) return;
    appState.user.username = uname;
    appState.user.password = pass;
    document.getElementById('obStep2').classList.remove('active');
    document.getElementById('obStep3').classList.add('active');
    setDot(3);
  }
}

function obBack(fromStep){
  if(fromStep === 2){
    document.getElementById('obStep2').classList.remove('active');
    document.getElementById('obStep1').classList.add('active');
    setDot(1);
  }
  if(fromStep === 3){
    document.getElementById('obStep3').classList.remove('active');
    document.getElementById('obStep2').classList.add('active');
    setDot(2);
  }
}

function obFinish(){
  const phone = document.getElementById('obPhone').value.trim();
  const valid = /^[0-9]{9,14}$/.test(phone);
  document.getElementById('errPhone').style.display = valid ? 'none' : 'block';
  if(!valid) return;
  appState.user.phone = phone;
  appState.user.address = "";
  appState.loggedIn = true;

  // simpan akun supaya lain kali langsung login, tidak perlu daftar ulang
  registeredUsers.push({...appState.user});
  saveUsersToStorage();
  setActiveSession(appState.user.email);

  document.getElementById('onboardingOverlay').style.display = 'none';
  document.getElementById('app').style.display = 'block';

  document.getElementById('profileName').textContent = appState.user.username || "Raka";
  document.getElementById('profileEmail').textContent = appState.user.email;
  document.getElementById('profilePhone').textContent = appState.user.phone;

  renderHome();
  updateCartBadge();
  showToast(`Selamat datang, ${appState.user.username}! ⚡`);
}

/* ======================= LOGOUT (PEMBELI) ======================= */
function openLogoutModal(){ document.getElementById('logoutModal').classList.add('open'); }
function closeLogoutModal(){ document.getElementById('logoutModal').classList.remove('open'); }

function confirmLogout(){
  // akun (registeredUsers) & pesanan (allOrders) SENGAJA TIDAK direset saat
  // logout, supaya lain kali bisa login langsung dan pesanan tetap terlihat
  // oleh Admin di menu Pesanan. Yang dihapus hanya sesi aktif (activeUserEmail),
  // supaya setelah "Keluar Akun" pembeli tetap diminta login lagi.
  clearActiveSession();

  appState.loggedIn = false;
  appState.user = {email:"",username:"",password:"",phone:"",address:""};
  appState.cart = [];
  appState.currentProductId = null;
  appState.selectedColor = null;
  appState.selectedSize = null;
  appState.checkoutItems = [];
  appState.activeCat = "semua";

  closeLogoutModal();
  document.getElementById('app').style.display = 'none';

  document.getElementById('obStep1').classList.add('active');
  document.getElementById('obStep2').classList.remove('active');
  document.getElementById('obStep3').classList.remove('active');
  setDot(1);
  document.getElementById('obEmail').value = '';
  document.getElementById('obUsername').value = 'Raka';
  document.getElementById('obPassword').value = '';
  document.getElementById('obPhone').value = '';

  document.getElementById('roleOverlay').style.display = 'flex';
  showToast("Kamu berhasil keluar");
}
