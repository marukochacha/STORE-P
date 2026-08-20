/* ======================= ADMIN DASHBOARD LOGIC ======================= */
function adminGoTo(tab){
  document.querySelectorAll('#adminBottomNav .nav-item').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.admin-tabpanel').forEach(p => p.classList.toggle('active', p.id === 'adminPanel-' + tab));
  if(tab === 'ringkasan') renderAdmin();
  if(tab === 'pesanan') renderAdminOrders();
  if(tab === 'barang') renderAdminProducts();
  if(tab === 'supplier') renderSupplierList();
  if(tab === 'tambah') { /* form statis, tidak perlu render ulang */ }
  if(tab === 'laporan') renderReport();
}

function renderAdmin(){
  document.getElementById('adminStatProducts').textContent = products.length;
  document.getElementById('adminStatOrders').textContent = allOrders.length;
  const revenue = allOrders.reduce((s,o) => s + o.total, 0);
  document.getElementById('adminStatRevenue').textContent = formatRp(revenue);
  const pending = allOrders.filter(o => o.status === "Menunggu Konfirmasi").length;
  document.getElementById('adminStatPending').textContent = pending;
  updateAdminPendingBadge();
}

/* ----- TAB: PESANAN + KONFIRMASI (NOTIFIKASI PENJUALAN) ----- */
function renderAdminOrders(){
  const ordersEl = document.getElementById('adminOrdersList');
  if(allOrders.length === 0){
    ordersEl.innerHTML = `<div class="empty-state"><div class="emoji">📭</div>Belum ada pesanan masuk dari pembeli.</div>`;
    updateAdminPendingBadge();
    return;
  }
  const statusOptions = ["Menunggu Konfirmasi","Dikemas","Dikirim","Selesai","Dibatalkan"];
  ordersEl.innerHTML = allOrders.map((o,idx) => `
    <div class="admin-order-card ${o.status==='Menunggu Konfirmasi' ? 'is-pending' : ''}">
      <div class="admin-order-top">
        <b>${o.id} ${o.status==='Menunggu Konfirmasi' ? '<span class="new-order-tag">🔔 Pesanan Baru</span>' : ''}</b>
        <select class="status-select" onchange="updateOrderStatus(${idx}, this.value)">
          ${statusOptions.map(s => `<option value="${s}" ${o.status===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="order-items-list">${o.items.map(l => `${l.name} x${l.qty}`).join('<br>')}</div>
      <div class="order-items-list" style="opacity:.7;">👤 ${o.owner || '-'}</div>
      <div class="order-total-row"><span>${o.date}</span><span>${formatRp(o.total)}</span></div>
      ${o.status==='Menunggu Konfirmasi' ? `<button class="btn btn-primary" style="width:100%;margin-top:10px;" onclick="confirmOrder(${idx})">✔ Konfirmasi Pesanan</button>` : ''}
    </div>
  `).join('');
  updateAdminPendingBadge();
}

function confirmOrder(idx){
  allOrders[idx].status = "Dikemas";
  showToast(`${allOrders[idx].id} dikonfirmasi, mulai dikemas`);
  renderAdminOrders();
  renderAdmin();
}

function updateOrderStatus(idx, status){
  allOrders[idx].status = status;
  showToast(`Status ${allOrders[idx].id} diubah ke "${status}"`);
  renderAdminOrders();
  renderAdmin();
}

function updateAdminPendingBadge(){
  const pending = allOrders.filter(o => o.status === "Menunggu Konfirmasi").length;
  const badge = document.getElementById('adminPendingBadge');
  if(badge){
    badge.textContent = pending;
    badge.style.display = pending > 0 ? 'flex' : 'none';
  }
}

/* ----- TAB: LIHAT BARANG (+ EDIT) ----- */
function renderAdminProducts(){
  const grid = document.getElementById('adminProductGrid');
  if(!grid) return;
  grid.innerHTML = products.map(p => `
    <div class="admin-prod-card">
      <img src="${p.img}" alt="${p.name}">
      <div class="admin-prod-body">
        <div class="admin-prod-name">${p.name}</div>
        <div class="admin-prod-meta">
          Kategori: ${p.cat}<br>
          Stok: ${p.stock} · Terjual: ${p.sold}<br>
          ★ ${p.rating || 0}
        </div>
        <div class="admin-prod-price">${formatRp(p.price)}</div>
        <button class="btn-edit-prod" onclick="openEditProduct(${p.id})">✎ Edit Barang</button>
      </div>
    </div>
  `).join('');
}

function openEditProduct(productId){
  const p = products.find(p => p.id === productId);
  if(!p) return;
  appState.editingProductId = productId;
  document.getElementById('editName').value = p.name;
  document.getElementById('editPrice').value = p.price;
  document.getElementById('editStock').value = p.stock;
  document.getElementById('editDesc').value = p.desc;
  document.getElementById('editProductModal').classList.add('open');
}
function closeEditProductModal(){
  document.getElementById('editProductModal').classList.remove('open');
  appState.editingProductId = null;
}
function saveEditProduct(){
  const p = products.find(p => p.id === appState.editingProductId);
  if(!p) return;
  const name = document.getElementById('editName').value.trim();
  const price = parseInt(document.getElementById('editPrice').value, 10);
  const stock = parseInt(document.getElementById('editStock').value, 10);
  const desc = document.getElementById('editDesc').value.trim();

  if(!name || isNaN(price) || price < 0 || isNaN(stock) || stock < 0){
    showToast("Isi data barang dengan benar ya");
    return;
  }

  p.name = name; p.price = price; p.stock = stock; p.desc = desc;

  closeEditProductModal();
  renderAdminProducts();
  renderAdmin();
  showToast(`${p.name} berhasil diperbarui`);
}

/* ----- TAB: SUPPLIER ----- */
const CAT_LABEL = {smartphone:"Smartphone", ipad:"iPad", macbook:"MacBook", aksesoris:"Aksesoris"};

function renderSupplierList(){
  const el = document.getElementById('supplierList');
  if(!el) return;
  if(suppliers.length === 0){
    el.innerHTML = `<div class="empty-state"><div class="emoji">🚚</div>Belum ada supplier terdaftar.<br>Tambahkan supplier pertamamu.</div>`;
    return;
  }
  el.innerHTML = suppliers.map(s => `
    <div class="supplier-card">
      <div class="supplier-top">
        <div>
          <div class="supplier-name">${s.name}</div>
          <div class="supplier-cat">${CAT_LABEL[s.cat] || s.cat}</div>
        </div>
        <span class="supplier-status ${s.status==='Aktif' ? 'aktif' : 'nonaktif'}" onclick="toggleSupplierStatus(${s.id})" title="Klik untuk ubah status">${s.status}</span>
      </div>
      <div class="supplier-meta">
        <b>Kontak:</b> ${s.contact || '-'}<br>
        <b>Telepon:</b> ${s.phone || '-'}<br>
        <b>Email:</b> ${s.email || '-'}<br>
        <b>Alamat:</b> ${s.address || '-'}
      </div>
      <div class="supplier-actions">
        <button class="btn-edit-supplier" onclick="openEditSupplierModal(${s.id})">✎ Edit</button>
        <button class="btn-del-supplier" onclick="openDeleteSupplierModal(${s.id})">🗑 Hapus</button>
      </div>
    </div>
  `).join('');
}

function openAddSupplierModal(){
  editingSupplierId = null;
  document.getElementById('supplierModalTitle').textContent = 'Tambah Supplier';
  document.getElementById('supName').value = '';
  document.getElementById('supContact').value = '';
  document.getElementById('supPhone').value = '';
  document.getElementById('supEmail').value = '';
  document.getElementById('supCat').value = 'smartphone';
  document.getElementById('supAddress').value = '';
  document.getElementById('supStatus').value = 'Aktif';
  document.getElementById('errSupName').style.display = 'none';
  document.getElementById('errSupPhone').style.display = 'none';
  document.getElementById('supplierModal').classList.add('open');
}

function openEditSupplierModal(id){
  const s = suppliers.find(s => s.id === id);
  if(!s) return;
  editingSupplierId = id;
  document.getElementById('supplierModalTitle').textContent = 'Edit Supplier';
  document.getElementById('supName').value = s.name;
  document.getElementById('supContact').value = s.contact;
  document.getElementById('supPhone').value = s.phone;
  document.getElementById('supEmail').value = s.email;
  document.getElementById('supCat').value = s.cat;
  document.getElementById('supAddress').value = s.address;
  document.getElementById('supStatus').value = s.status;
  document.getElementById('errSupName').style.display = 'none';
  document.getElementById('errSupPhone').style.display = 'none';
  document.getElementById('supplierModal').classList.add('open');
}

function closeSupplierModal(){
  document.getElementById('supplierModal').classList.remove('open');
  editingSupplierId = null;
}

function saveSupplier(){
  const name = document.getElementById('supName').value.trim();
  const contact = document.getElementById('supContact').value.trim();
  const phone = document.getElementById('supPhone').value.trim();
  const email = document.getElementById('supEmail').value.trim();
  const cat = document.getElementById('supCat').value;
  const address = document.getElementById('supAddress').value.trim();
  const status = document.getElementById('supStatus').value;

  let ok = true;
  if(!name){ document.getElementById('errSupName').style.display = 'block'; ok = false; }
  else document.getElementById('errSupName').style.display = 'none';

  const phoneValid = /^[0-9]{9,14}$/.test(phone);
  if(!phoneValid){ document.getElementById('errSupPhone').style.display = 'block'; ok = false; }
  else document.getElementById('errSupPhone').style.display = 'none';

  if(!ok) return;

  if(editingSupplierId){
    const s = suppliers.find(s => s.id === editingSupplierId);
    s.name = name; s.contact = contact; s.phone = phone; s.email = email;
    s.cat = cat; s.address = address; s.status = status;
    showToast(`${name} berhasil diperbarui`);
  } else {
    suppliers.push({id:nextSupplierId++, name, contact, phone, email, cat, address, status});
    showToast(`${name} berhasil ditambahkan sebagai supplier`);
  }

  closeSupplierModal();
  renderSupplierList();
}

function toggleSupplierStatus(id){
  const s = suppliers.find(s => s.id === id);
  if(!s) return;
  s.status = s.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
  renderSupplierList();
  showToast(`Status ${s.name} diubah ke "${s.status}"`);
}

function openDeleteSupplierModal(id){
  const s = suppliers.find(s => s.id === id);
  if(!s) return;
  deletingSupplierId = id;
  document.getElementById('deleteSupplierText').textContent = `"${s.name}" akan dihapus permanen dari daftar supplier.`;
  document.getElementById('deleteSupplierModal').classList.add('open');
}
function closeDeleteSupplierModal(){
  document.getElementById('deleteSupplierModal').classList.remove('open');
  deletingSupplierId = null;
}
function confirmDeleteSupplier(){
  const s = suppliers.find(s => s.id === deletingSupplierId);
  suppliers = suppliers.filter(s => s.id !== deletingSupplierId);
  closeDeleteSupplierModal();
  renderSupplierList();
  if(s) showToast(`${s.name} dihapus dari daftar supplier`);
}

/* ----- TAB: TAMBAH BARANG ----- */
function previewAddImage(e){
  const file = e.target.files[0];
  if(!file) return;
  if(addImageObjectURL) URL.revokeObjectURL(addImageObjectURL);
  addImageObjectURL = URL.createObjectURL(file);
  document.getElementById('addImagePreview').innerHTML = `<img src="${addImageObjectURL}" alt="Preview gambar produk">`;
}
function previewAddVideo(e){
  const file = e.target.files[0];
  if(!file) return;
  if(addVideoObjectURL) URL.revokeObjectURL(addVideoObjectURL);
  addVideoObjectURL = URL.createObjectURL(file);
  document.getElementById('addVideoPreview').innerHTML = `<video src="${addVideoObjectURL}" controls></video>`;
}

function submitNewProduct(){
  const name = document.getElementById('addName').value.trim();
  const price = parseInt(document.getElementById('addPrice').value, 10);
  const cat = document.getElementById('addCat').value;
  const desc = document.getElementById('addDesc').value.trim();
  const stock = parseInt(document.getElementById('addStock').value, 10) || 0;

  if(!name || isNaN(price) || price <= 0 || !desc){
    showToast("Lengkapi nama, harga, dan deskripsi produk dulu ya");
    return;
  }
  if(!addImageObjectURL){
    showToast("Upload gambar produk dulu ya");
    return;
  }

  const newId = Math.max(...products.map(p => p.id)) + 1;
  products.push({
    id:newId, name, price, oldPrice:null, desc, rating:0, sold:0, stock, cat, badge:"Baru",
    img:addImageObjectURL,
    gallery:[addImageObjectURL],
    video: addVideoObjectURL || null,
    colors:[{name:"Default", hex:"#d9829d"}],
    sizes:["Standard"]
  });

  document.getElementById('addName').value = '';
  document.getElementById('addPrice').value = '';
  document.getElementById('addDesc').value = '';
  document.getElementById('addStock').value = '';
  document.getElementById('addImageFile').value = '';
  document.getElementById('addVideoFile').value = '';
  document.getElementById('addImagePreview').innerHTML = '';
  document.getElementById('addVideoPreview').innerHTML = '';
  addImageObjectURL = null;
  addVideoObjectURL = null;

  renderAdminProducts();
  renderAdmin();
  renderHome();
  showToast(`${name} berhasil ditambahkan ke katalog`);
}

/* ----- TAB: LAPORAN KEUANGAN ----- */
function setReportRange(range){
  appState.reportRange = range;
  document.querySelectorAll('.report-toggle button').forEach(b => b.classList.toggle('active', b.dataset.range === range));
  renderReport();
}

function renderReport(){
  const totalRevenue = allOrders.reduce((s,o) => s + o.total, 0);
  document.getElementById('reportSummaryValue').textContent = formatRp(totalRevenue);

  const range = appState.reportRange;
  const groups = {};
  allOrders.forEach(o => {
    const d = o.dateObj || new Date();
    let key, label;
    if(range === 'harian'){
      key = d.toISOString().slice(0,10);
      label = d.toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'});
    } else if(range === 'bulanan'){
      key = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0');
      label = d.toLocaleDateString('id-ID', {month:'long', year:'numeric'});
    } else {
      key = String(d.getFullYear());
      label = key;
    }
    if(!groups[key]) groups[key] = {label, total:0, count:0};
    groups[key].total += o.total;
    groups[key].count += 1;
  });

  const keys = Object.keys(groups).sort().reverse();
  const listEl = document.getElementById('reportList');
  if(keys.length === 0){
    listEl.innerHTML = `<div class="empty-state"><div class="emoji">📊</div>Belum ada transaksi untuk dilaporkan.<br>Laporan akan otomatis muncul saat ada pesanan masuk.</div>`;
    return;
  }
  listEl.innerHTML = keys.map(k => `
    <div class="report-row">
      <div>
        <div class="rlabel">${groups[k].label}</div>
        <div class="rsub">${groups[k].count} pesanan</div>
      </div>
      <div class="ramount">${formatRp(groups[k].total)}</div>
    </div>
  `).join('');
}
