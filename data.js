/* ======================= DATA PRODUK GADGET ======================= */
/* Catatan PENTING soal foto & video lokal:
   Produk di bawah ini memakai nama FILE LOKAL (bukan link internet).
   Supaya muncul, taruh file-file berikut PERSIS di folder yang SAMA
   dengan file index.html ini:
     - ipad.jpg        + ipadvid.mp4
     - 15.jpg          + 15vid.mp4
     - 16.jpg          + 16vid.mp4
     - 17.jpg          + 17vid.mp4
     - 17pro.jpg       + 17provid.mp4
     - case1.jpg       + case1.mp4
     - case2.jpg       + case2.mp4
     - macbook neo .jpg + neovid.mp4
   Kalau kamu buka index.html langsung dari HP/laptop (double click), taruh
   semua file gambar & video itu satu folder dengan index.html.
   Kalau di-hosting/upload ke server, upload juga semua file itu di folder
   yang sama dengan index.html.
   Catatan: nama file yang ada spasi ("macbook neo .jpg") ditulis di kode
   pakai %20 (kode untuk spasi), tapi file aslinya tetap kamu simpan dengan
   nama asli (pakai spasi biasa), tidak perlu diganti. */
const DEMO_VIDEO = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const products = [
  {id:1,name:"iPad",price:7999000,oldPrice:8999000,desc:"Tablet layar lebar dengan performa kencang, cocok untuk kerja, belajar, gambar digital, dan hiburan.",rating:4.8,sold:412,stock:48,cat:"ipad",badge:"Best Seller",
   img:"ipad.jpg",
   gallery:["ipad.jpg"],
   video:"ipadvid.mp4",
   colors:[{name:"Space Gray",hex:"#3a3d40"},{name:"Silver",hex:"#c9cdd1"}],
   sizes:["128GB","256GB"]},
  {id:2,name:"iPhone 15",price:13999000,oldPrice:14999000,desc:"Smartphone flagship dengan kamera canggih, performa cepat, dan desain premium.",rating:4.9,sold:288,stock:120,cat:"smartphone",badge:"Baru",
   img:"15.jpg",
   gallery:["15.jpg"],
   video:"15vid.mp4",
   colors:[{name:"Hitam",hex:"#1c1c1c"},{name:"Putih",hex:"#f5f5f5"},{name:"Biru",hex:"#2e6cd9"}],
   sizes:["128GB","256GB"]},
  {id:3,name:"iPhone 16",price:15999000,oldPrice:16999000,desc:"Generasi terbaru dengan chip lebih kencang, kamera lebih tajam, dan baterai lebih awet.",rating:4.9,sold:203,stock:95,cat:"smartphone",badge:"Baru",
   img:"16.jpg",
   gallery:["16.jpg"],
   video:"16vid.mp4",
   colors:[{name:"Hitam",hex:"#1c1c1c"},{name:"Putih",hex:"#f5f5f5"},{name:"Ungu",hex:"#8a6bd9"}],
   sizes:["128GB","256GB"]},
  {id:4,name:"iPhone 17",price:17999000,oldPrice:null,desc:"Smartphone terbaru dengan desain lebih tipis, layar lebih responsif, dan performa kelas atas.",rating:4.9,sold:97,stock:80,cat:"smartphone",badge:"Baru",
   img:"17.jpg",
   gallery:["17.jpg"],
   video:"17vid.mp4",
   colors:[{name:"Hitam",hex:"#1c1c1c"},{name:"Putih",hex:"#f5f5f5"},{name:"Lavender",hex:"#c9b6e4"}],
   sizes:["128GB","256GB"]},
  {id:5,name:"iPhone 17 Pro",price:21999000,oldPrice:null,desc:"Versi Pro dengan kamera profesional, bodi titanium, dan performa paling kencang di lini iPhone 17.",rating:4.9,sold:64,stock:40,cat:"smartphone",badge:"Baru",
   img:"17pro.jpg",
   gallery:["17pro.jpg"],
   video:"17provid.mp4",
   colors:[{name:"Titanium Hitam",hex:"#2b2b2b"},{name:"Titanium Putih",hex:"#d8d6d1"}],
   sizes:["256GB","512GB"]},
  {id:6,name:"Case",price:99000,oldPrice:129000,desc:"Case pelindung pas di bodi, bahan kuat anti benturan, tetap tipis dan nyaman digenggam.",rating:4.7,sold:196,stock:65,cat:"aksesoris",badge:"Best Seller",
   img:"case1.jpg",
   gallery:["case1.jpg","case2.jpg"],
   video:"case1.mp4",
   colors:[{name:"Hitam",hex:"#1c1c1c"},{name:"Bening",hex:"#e9e9e9"}],
   sizes:["Standard"]},
  {id:7,name:"MacBook",price:16999000,oldPrice:null,desc:"Laptop tipis dan ringan dengan performa kencang, baterai awet, cocok untuk kerja maupun kuliah.",rating:4.8,sold:150,stock:20,cat:"macbook",badge:"Baru",
   img:"macbook%20neo%20.jpg",
   gallery:["macbook%20neo%20.jpg"],
   video:"neovid.mp4",
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
