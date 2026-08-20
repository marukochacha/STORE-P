/* ======================= DATA PRODUK GADGET ======================= */
/* Catatan PENTING soal foto & video lokal:
   Produk di bawah ini memakai nama FILE LOKAL (bukan link internet),
   contoh: "ipad.jpg" dan "ipad.mp4". Supaya muncul, taruh file-file berikut
   PERSIS di folder yang SAMA dengan file index.html ini:
     - ipad.jpg      + ipad.mp4
     - iphone 15.jpg + iphone.mp4
     - case.jpg      + case.mp4
     - macbook.jpg   + VID MACBOOK.mp4
   Kalau kamu buka index.html langsung dari HP/laptop (double click), taruh
   semua file gambar & video itu satu folder dengan index.html.
   Kalau di-hosting/upload ke server, upload juga semua file itu di folder
   yang sama dengan index.html.
   Catatan: nama file yang ada spasi ("iphone 15.jpg", "VID MACBOOK.mp4")
   ditulis di kode pakai %20 (kode untuk spasi), tapi file aslinya tetap
   kamu simpan dengan nama asli (pakai spasi biasa), tidak perlu diganti.

   PERBAIKAN: video iPad sebelumnya tertulis "pad.mp4" (typo, kurang huruf
   "i") sehingga tidak ketemu filenya dan gagal diputar. Sekarang sudah
   dibetulkan jadi "ipad.mp4" — pastikan nama file video iPad kamu juga
   persis "ipad.mp4". */
const DEMO_VIDEO = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const products = [
  {id:1,name:"iPad",price:7999000,oldPrice:8999000,desc:"Tablet layar lebar dengan performa kencang, cocok untuk kerja, belajar, gambar digital, dan hiburan.",rating:4.8,sold:412,stock:48,cat:"ipad",badge:"Best Seller",
   img:"ipad.jpg",
   gallery:["ipad.jpg"],
   video:"ipad.mp4",
   colors:[{name:"Space Gray",hex:"#3a3d40"},{name:"Silver",hex:"#c9cdd1"}],
   sizes:["128GB","256GB"]},
  {id:2,name:"iPhone 15",price:13999000,oldPrice:14999000,desc:"Smartphone flagship dengan kamera canggih, performa cepat, dan desain premium.",rating:4.9,sold:288,stock:120,cat:"smartphone",badge:"Baru",
   img:"iphone%2015.jpg",
   gallery:["iphone%2015.jpg"],
   video:"iphone.mp4",
   colors:[{name:"Hitam",hex:"#1c1c1c"},{name:"Putih",hex:"#f5f5f5"},{name:"Biru",hex:"#2e6cd9"}],
   sizes:["128GB","256GB"]},
  {id:3,name:"Case",price:99000,oldPrice:129000,desc:"Case pelindung pas di bodi, bahan kuat anti benturan, tetap tipis dan nyaman digenggam.",rating:4.7,sold:196,stock:65,cat:"aksesoris",badge:"Best Seller",
   img:"case.jpg",
   gallery:["case.jpg"],
   video:"case.mp4",
   colors:[{name:"Hitam",hex:"#1c1c1c"},{name:"Bening",hex:"#e9e9e9"}],
   sizes:["Standard"]},
  {id:4,name:"MacBook",price:16999000,oldPrice:null,desc:"Laptop tipis dan ringan dengan performa kencang, baterai awet, cocok untuk kerja maupun kuliah.",rating:4.8,sold:150,stock:20,cat:"macbook",badge:"Baru",
   img:"macbook.jpg",
   gallery:["macbook.jpg"],
   video:"VID%20MACBOOK.mp4",
   colors:[{name:"Silver",hex:"#c9cdd1"},{name:"Space Gray",hex:"#3a3d40"}],
   sizes:["256GB","512GB"]},
];

const sampleReviews = [
  {name:"Dimas Pratama",avatar:"https://i.pravatar.cc/60?img=33",rating:5,text:"Kualitas build-nya premium, pengiriman cepat dan packing aman!"},
  {name:"Sinta Amelia",avatar:"https://i.pravatar.cc/60?img=45",rating:4,text:"Barangnya bagus, cuma dus agak penyok dikit pas nyampe."},
  {name:"Fajar Nugroho",avatar:"https://i.pravatar.cc/60?img=22",rating:5,text:"Sudah kedua kalinya beli di sini, garansi resmi dan responsif."},
];

/* ======================= DATA SUPPLIER ======================= */
let suppliers = [
  {id:1, name:"CV Sumber Elektronik", contact:"Budi Santoso", phone:"081234567890", email:"budi@sumberelektronik.co.id", cat:"smartphone", address:"Jl. Pasar Baru No. 12, Jakarta", status:"Aktif"},
  {id:2, name:"PT Aksesoris Nusantara", contact:"Rina Wulandari", phone:"081298765432", email:"rina@aksesorisnusantara.id", cat:"aksesoris", address:"Jl. Kembang Raya No. 5, Bandung", status:"Aktif"},
  {id:3, name:"UD Gadget Sejahtera", contact:"Andi Firmansyah", phone:"081311223344", email:"andi@gadgetsejahtera.com", cat:"ipad", address:"Jl. Diponegoro No. 88, Surabaya", status:"Nonaktif"},
];
let nextSupplierId = 4;
let editingSupplierId = null;
let deletingSupplierId = null;

/* ======================= AKUN (PERSIST DI localStorage) =======================
   registeredUsers dan sesi login pembeli yang aktif disimpan ke localStorage
   supaya kalau halaman dibuka lagi (bukan lewat tombol "Keluar Akun"),
   pembeli yang sudah login tidak perlu login ulang — langsung masuk ke
   halaman pembeli. */
let registeredUsers = [];              // {email, username, password, phone, address}
const ADMIN_CREDENTIALS = {username:"admin", password:"admin123"};
let addImageObjectURL = null;
let addVideoObjectURL = null;

const STORAGE_KEY_USERS = 'gsp_registeredUsers';
const STORAGE_KEY_ACTIVE = 'gsp_activeUserEmail';

function saveUsersToStorage(){
  try{ localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registeredUsers)); }catch(e){}
}
function setActiveSession(email){
  try{ localStorage.setItem(STORAGE_KEY_ACTIVE, email); }catch(e){}
}
function clearActiveSession(){
  try{ localStorage.removeItem(STORAGE_KEY_ACTIVE); }catch(e){}
}

/* ======================= PESANAN GLOBAL (TOKO) =======================
   PENTING: daftar pesanan ini SENGAJA dipisah dari appState dan TIDAK
   pernah direset saat pembeli logout. Ini yang membuat pesanan yang baru
   dibuat pembeli tetap muncul di dashboard Admin > Pesanan, karena satu-
   satunya cara membuka dashboard admin di demo ini adalah lewat halaman
   pilih peran (yang mengharuskan pembeli logout dulu). */
let allOrders = []; // {id, owner, items, subtotal, shipping, total, address, payment, status, date, dateObj}

/* ======================= STATE APLIKASI ======================= */
let appState = {
  loggedIn:false,
  user:{email:"",username:"",password:"",phone:"",address:""},
  cart:[],       // {lineId, productId, name, price, img, color, size, qty, checked}
  currentProductId:null,
  selectedColor:null,
  selectedSize:null,
  checkoutItems:[],
  activeCat:"semua",
  gallerySlideIndex:0,
  editingProductId:null,
  reportRange:"harian",
};
let nextLineId = 1;
