// Fitur Dashboard Admin, Supplier, dan Laporan
function adminGoTo(tab) {
  console.log("Pindah ke tab: " + tab);
}

function renderAdminProducts() {
  console.log("Rendering Produk Admin");
}

/* ----- EDIT PRODUK ----- */
function closeEditProductModal() {
  document.getElementById('editProductModal').classList.remove('open');
  appState.editingProductId = null;
}

function saveEditProduct() {
  const p = products.find(p => p.id === appState.editingProductId);
  if (!p) return;
  const name = document.getElementById('editName').value.trim();
  const price = parseFloat(document.getElementById('editPrice').value);
  const stock = parseInt(document.getElementById('editStock').value, 10);
  const desc = document.getElementById('editDesc').value.trim();

  if (!name || isNaN(price) || isNaN(stock)) {
    showToast("Mohon lengkapi data barang dengan benar");
    return;
  }

  p.name = name;
  p.price = price;
  p.stock = stock;
  p.desc = desc;

  closeEditProductModal();
  renderAdminProducts();
  renderHome();
  showToast("Data barang berhasil diperbarui ⚡");
}

/* ----- SUPPLIER LOGIC ----- */
function renderSupplierList() {
  const listEl = document.getElementById('supplierList');
  if (!listEl) return;

  if (suppliers.length === 0) {
    listEl.innerHTML = `<div class="empty-state"><div class="emoji">🚚</div>Belum ada data supplier.<br>Klik tombol di atas untuk menambah supplier baru.</div>`;
    return;
  }

  listEl.innerHTML = suppliers.map(s => `
    <div class="supplier-card">
      <div class="supplier-top">
        <div>
          <div class="supplier-name">${s.name}</div>
          <div class="supplier-cat">Kategori: ${s.cat}</div>
        </div>
        <span class="supplier-status ${s.status.toLowerCase()}" onclick="toggleSupplierStatus(${s.id})">
          ${s.status === 'Aktif' ? '● Aktif' : '○ Nonaktif'}
        </span>
      </div>
      <div class="supplier-meta">
        <b>PIC:</b> ${s.contact || '-'}<br>
        <b>No. Telp:</b> ${s.phone || '-'}<br>
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

function toggleSupplierStatus(id) {
  const sup = suppliers.find(s => s.id === id);
  if (sup) {
    sup.status = sup.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    renderSupplierList();
    showToast(`Status supplier "${sup.name}" diubah ke ${sup.status}`);
  }
}

function openAddSupplierModal() {
  editingSupplierId = null;
  document.getElementById('supplierModalTitle').textContent = "Tambah Supplier";
  document.getElementById('supName').value = "";
  document.getElementById('supContact').value = "";
  document.getElementById('supPhone').value = "";
  document.getElementById('supEmail').value = "";
  document.getElementById('supCat').value = "smartphone";
  document.getElementById('supAddress').value = "";
  document.getElementById('supStatus').value = "Aktif";
  document.getElementById('errSupName').style.display = 'none';
  document.getElementById('errSupPhone').style.display = 'none';
  document.getElementById('supplierModal').classList.add('open');
}

function openEditSupplierModal(id) {
  const sup = suppliers.find(s => s.id === id);
  if (!sup) return;
  editingSupplierId = id;
  document.getElementById('supplierModalTitle').textContent = "Edit Supplier";
  document.getElementById('supName').value = sup.name;
  document.getElementById('supContact').value = sup.contact;
  document.getElementById('supPhone').value = sup.phone;
  document.getElementById('supEmail').value = sup.email;
  document.getElementById('supCat').value = sup.cat;
  document.getElementById('supAddress').value = sup.address;
  document.getElementById('supStatus').value = sup.status;
  document.getElementById('errSupName').style.display = 'none';
  document.getElementById('errSupPhone').style.display = 'none';
  document.getElementById('supplierModal').classList.add('open');
}

function closeSupplierModal() {
  document.getElementById('supplierModal').classList.remove('open');
  editingSupplierId = null;
}

function saveSupplier() {
  const name = document.getElementById('supName').value.trim();
  const contact = document.getElementById('supContact').value.trim();
  const phone = document.getElementById('supPhone').value.trim();
  const email = document.getElementById('supEmail').value.trim();
  const cat = document.getElementById('supCat').value;
  const address = document.getElementById('supAddress').value.trim();
  const status = document.getElementById('supStatus').value;

  let valid = true;
  if (!name) {
    document.getElementById('errSupName').style.display = 'block';
    valid = false;
  } else {
    document.getElementById('errSupName').style.display = 'none';
  }

  if (phone && !/^[0-9]{9,14}$/.test(phone)) {
    document.getElementById('errSupPhone').style.display = 'block';
    valid = false;
  } else {
    document.getElementById('errSupPhone').style.display = 'none';
  }

  if (!valid) return;

  if (editingSupplierId) {
    const sup = suppliers.find(s => s.id === editingSupplierId);
    if (sup) {
      sup.name = name;
      sup.contact = contact;
      sup.phone = phone;
      sup.email = email;
      sup.cat = cat;
      sup.address = address;
      sup.status = status;
      showToast("Data supplier berhasil diperbarui");
    }
  } else {
    suppliers.push({
      id: nextSupplierId++,
      name, contact, phone, email, cat, address, status
    });
    showToast("Supplier baru berhasil ditambahkan ⚡");
  }

  closeSupplierModal();
  renderSupplierList();
}

function openDeleteSupplierModal(id) {
  deletingSupplierId = id;
  const sup = suppliers.find(s => s.id === id);
  if (sup) {
    document.getElementById('deleteSupplierText').textContent = `Yakin ingin menghapus supplier "${sup.name}"? Data ini tidak bisa dikembalikan.`;
  }
  document.getElementById('deleteSupplierModal').classList.add('open');
}

function closeDeleteSupplierModal() {
  document.getElementById('deleteSupplierModal').classList.remove('open');
  deletingSupplierId = null;
}

function confirmDeleteSupplier() {
  if (deletingSupplierId) {
    suppliers = suppliers.filter(s => s.id !== deletingSupplierId);
    showToast("Supplier berhasil dihapus");
    renderSupplierList();
  }
  closeDeleteSupplierModal();
}

/* ----- TAMBAH BARANG LOGIC ----- */
function previewAddImage(e) {
  const file = e.target.files[0];
  const preview = document.getElementById('addImagePreview');
  if (file) {
    if (addImageObjectURL) URL.revokeObjectURL(addImageObjectURL);
    addImageObjectURL = URL.createObjectURL(file);
    preview.innerHTML = `<img src="${addImageObjectURL}" alt="Preview Gambar">`;
  } else {
    preview.innerHTML = '';
  }
}

function previewAddVideo(e) {
  const file = e.target.files[0];
  const preview = document.getElementById('addVideoPreview');
  if (file) {
    if (addVideoObjectURL) URL.revokeObjectURL(addVideoObjectURL);
    addVideoObjectURL = URL.createObjectURL(file);
    preview.innerHTML = `<video src="${addVideoObjectURL}" controls style="width:100%;max-height:170px;border-radius:10px;margin-top:8px;"></video>`;
  } else {
    preview.innerHTML = '';
  }
}

function submitNewProduct() {
  const name = document.getElementById('addName').value.trim();
  const price = parseFloat(document.getElementById('addPrice').value);
  const cat = document.getElementById('addCat').value;
  const desc = document.getElementById('addDesc').value.trim();
  const stock = parseInt(document.getElementById('addStock').value, 10) || 0;

  if (!name || isNaN(price) || price <= 0) {
    showToast("Mohon isi nama dan harga produk dengan benar");
    return;
  }

  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const imgSrc = addImageObjectURL || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80";
  const videoSrc = addVideoObjectURL || null;

  const newProd = {
    id: newId,
    name,
    price,
    oldPrice: null,
    desc: desc || "Produk gadget pilihan berkualitas tinggi.",
    rating: 5.0,
    sold: 0,
    stock,
    cat,
    badge: "Baru",
    img: imgSrc,
    gallery: [imgSrc],
    video: videoSrc,
    colors: [{ name: "Default", hex: "#3f2b30" }],
    sizes: ["Standard"]
  };

  products.unshift(newProd);

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

  renderHome();
  showToast(`Produk "${name}" berhasil ditambahkan! ⚡`);
  adminGoTo('barang');
}

/* ----- LAPORAN KEUANGAN LOGIC ----- */
function setReportRange(range) {
  appState.reportRange = range;
  document.querySelectorAll('.report-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.range === range);
  });
  renderReport();
}

function renderReport() {
  const summaryEl = document.getElementById('reportSummaryValue');
  const listEl = document.getElementById('reportList');
  if (!summaryEl || !listEl) return;

  const totalRev = allOrders.reduce((s, o) => s + o.total, 0);
  summaryEl.textContent = formatRp(totalRev);

  if (allOrders.length === 0) {
    listEl.innerHTML = `<div class="empty-state"><div class="emoji">📈</div>Belum ada transaksi terhitung.<br>Laporan akan muncul otomatis saat ada pesanan masuk.</div>`;
    return;
  }

  const grouped = {};
  allOrders.forEach(o => {
    let key = o.date;
    const d = o.dateObj || new Date();

    if (appState.reportRange === 'bulanan') {
      key = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    } else if (appState.reportRange === 'tahunan') {
      key = d.getFullYear().toString();
    }

    if (!grouped[key]) {
      grouped[key] = { count: 0, total: 0 };
    }
    grouped[key].count += 1;
    grouped[key].total += o.total;
  });

  listEl.innerHTML = Object.keys(grouped).map(key => `
    <div class="report-row">
      <div>
        <div class="rlabel">${key}</div>
        <div class="rsub">${grouped[key].count} transaksi selesai</div>
      </div>
      <div class="ramount">${formatRp(grouped[key].total)}</div>
    </div>
  `).join('');
}
