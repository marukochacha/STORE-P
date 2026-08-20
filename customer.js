/* ======================= NAVIGASI VIEW (PEMBELI) ======================= */
function goTo(viewName, opts){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById('view-' + viewName).classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n=>{
    n.classList.toggle('active', n.dataset.nav === viewName);
  });

  const headerHome = document.getElementById('headerHomeState');
  const headerBack = document.getElementById('headerBackState');
  const titles = {detail:"Detail Produk", cart:"Keranjang Belanja", checkout:"Checkout", orders:"Status Pesanan", profile:"Profil Saya"};

  if(viewName === 'home'){
    headerHome.style.display = 'flex';
    headerBack.style.display = 'none';
  } else {
    headerHome.style.display = 'none';
    headerBack.style.display = 'flex';
    document.getElementById('headerTitle').textContent = titles[viewName] || "";
  }

  if(viewName === 'cart') renderCart();
  if(viewName === 'orders') renderOrders();
  if(viewName === 'profile') renderProfile();

  window.scrollTo({top:0, behavior:'instant'});
}

function handleBack(){
  const active = document.querySelector('.view.active').id.replace('view-','');
  if(active === 'checkout'){ goTo('cart'); return; }
  if(active === 'detail'){ goTo('home'); return; }
  goTo('home');
}

/* ======================= RENDER HOME ======================= */
function renderHome(){
  const best = products.filter(p => p.badge === "Best Seller");
  document.getElementById('bestsellerScroll').innerHTML = best.map(p => productCardHTML(p)).join('');
  renderProductGrid();
}

function renderProductGrid(){
  const filtered = appState.activeCat === "semua" ? products : products.filter(p => p.cat === appState.activeCat);
  document.getElementById('productGrid').innerHTML = filtered.map(p => productCardHTML(p)).join('');
}

function productCardHTML(p){
  return `
    <div class="p-card">
      <div class="p-img" onclick="openDetail(${p.id})">
        ${p.badge ? `<span class="p-badge">${p.badge}</span>` : ""}
        <img src="${p.img}" alt="${p.name}">
        ${p.video ? `<span class="p-video-badge">▶ Video</span>` : ""}
      </div>
      <div class="p-body">
        <div class="p-name" onclick="openDetail(${p.id})">${p.name}</div>
        <div class="p-desc">${p.desc.slice(0,42)}...</div>
        <div class="p-rating"><span class="stars">★</span> ${p.rating} · ${p.sold} terjual</div>
        <div class="p-price">${formatRp(p.price)}</div>
        <div class="p-actions">
          <button class="btn-cart-sm" onclick="quickAddToCart(${p.id})">+ Keranjang</button>
          <button class="btn-buy-sm" onclick="openDetail(${p.id})">Beli Direct</button>
        </div>
      </div>
    </div>
  `;
}

document.getElementById('catChips').addEventListener('click', e=>{
  const chip = e.target.closest('.chip');
  if(!chip) return;
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
  chip.classList.add('active');
  appState.activeCat = chip.dataset.cat;
  renderProductGrid();
});

function quickAddToCart(productId){
  const p = products.find(p => p.id === productId);
  addLineToCart(p, p.colors[0].name, p.sizes[0], 1);
  showToast(`${p.name} ditambahkan (${p.colors[0].name}, ${p.sizes[0]})`);
}

/* ======================= RENDER DETAIL PRODUK + GALERI FOTO/VIDEO ======================= */
function buildGallerySlides(p){
  const photos = (p.gallery && p.gallery.length) ? p.gallery : [p.img];
  const slides = photos.map(src => ({type:'image', src}));
  if(p.video){ slides.push({type:'video', src:p.video}); }
  return slides;
}

function openDetail(productId){
  appState.currentProductId = productId;
  appState.gallerySlideIndex = 0;
  const p = products.find(p => p.id === productId);
  appState.selectedColor = p.colors[0].name;
  appState.selectedSize = p.sizes[0];
  const slides = buildGallerySlides(p);

  document.getElementById('view-detail').innerHTML = `
    <div class="pd-gallery">
      <div class="pd-slides" id="pdSlides">
        ${slides.map((s,i) => s.type === 'image'
          ? `<div class="pd-slide"><img src="${s.src}" alt="${p.name} foto ${i+1}"></div>`
          : `<div class="pd-slide video-slide"><video controls playsinline preload="metadata" poster="${p.img}"><source src="${s.src}" type="video/mp4"></video><span class="pd-play-hint">▶ Video Produk</span></div>`
        ).join('')}
      </div>
      ${slides.length > 1 ? `
        <div class="pd-arrow prev" onclick="pdSlideStep(-1)">‹</div>
        <div class="pd-arrow next" onclick="pdSlideStep(1)">›</div>
      ` : ""}
    </div>
    ${slides.length > 1 ? `
      <div class="pd-dots" id="pdDots">
        ${slides.map((s,i) => `<div class="pd-dot ${i===0?'active':''}" data-i="${i}" onclick="pdSlideGo(${i})"></div>`).join('')}
      </div>
    ` : ""}

    <div class="pd-cat">${p.cat}</div>
    <h2 class="pd-name">${p.name}</h2>
    <div class="pd-meta">
      <span>${starString(p.rating)} ${p.rating}</span>
      <span>·</span>
      <span>${p.sold} terjual</span>
    </div>
    <div class="pd-price">${formatRp(p.price)} ${p.oldPrice ? `<span style="font-size:13px;color:#c7a7ae;text-decoration:line-through;font-weight:400;">${formatRp(p.oldPrice)}</span>` : ""}</div>
    <p class="pd-desc">${p.desc}</p>

    <div class="variant-block">
      <h4>Pilih Warna: <span id="colorLabel">${p.colors[0].name}</span></h4>
      <div class="color-opts" id="colorOpts">
        ${p.colors.map((c,i) => `
          <div class="color-dot ${i===0?'selected':''}" data-color="${c.name}" onclick="selectColor('${c.name}')">
            <div class="color-inner" style="background:${c.hex};"></div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="variant-block">
      <h4>Pilih Varian: <span id="sizeLabel">${p.sizes[0]}</span></h4>
      <div class="size-opts" id="sizeOpts">
        ${p.sizes.map((s,i) => `
          <div class="size-opt ${i===0?'selected':''}" data-size="${s}" onclick="selectSize('${s}')">${s}</div>
        `).join('')}
      </div>
    </div>

    <div class="section-title" style="margin-top:10px;"><h2 style="font-size:15px;">Ulasan Pembeli</h2></div>
    ${sampleReviews.map(r => `
      <div class="review-item">
        <img src="${r.avatar}" alt="${r.name}">
        <div>
          <div class="review-name">${r.name}</div>
          <div class="review-stars">${starString(r.rating)}</div>
          <div class="review-text">${r.text}</div>
        </div>
      </div>
    `).join('')}

    <div class="pd-sticky-bar">
      <button class="btn-add-cart" onclick="addToCartFromDetail()">+ Keranjang</button>
      <button class="btn-buy-now" onclick="buyNowFromDetail()">Beli Sekarang</button>
    </div>
  `;

  const slidesEl = document.getElementById('pdSlides');
  if(slidesEl){
    slidesEl.addEventListener('scroll', ()=>{
      const idx = Math.round(slidesEl.scrollLeft / slidesEl.clientWidth);
      setActiveDot(idx);
    }, {passive:true});
  }

  goTo('detail');
}

function pdSlideGo(index){
  const slidesEl = document.getElementById('pdSlides');
  if(!slidesEl) return;
  slidesEl.scrollTo({left: index * slidesEl.clientWidth, behavior:'smooth'});
  setActiveDot(index);
}
function pdSlideStep(delta){
  const slidesEl = document.getElementById('pdSlides');
  if(!slidesEl) return;
  const current = Math.round(slidesEl.scrollLeft / slidesEl.clientWidth);
  const dotsCount = document.querySelectorAll('.pd-dot').length;
  let next = current + delta;
  if(next < 0) next = 0;
  if(next > dotsCount - 1) next = dotsCount - 1;
  pdSlideGo(next);
}
function setActiveDot(index){
  document.querySelectorAll('.pd-dot').forEach(d=>{
    d.classList.toggle('active', parseInt(d.dataset.i) === index);
  });
}

function selectColor(colorName){
  appState.selectedColor = colorName;
  document.getElementById('colorLabel').textContent = colorName;
  document.querySelectorAll('.color-dot').forEach(d=>{
    d.classList.toggle('selected', d.dataset.color === colorName);
  });
}
function selectSize(size){
  appState.selectedSize = size;
  document.getElementById('sizeLabel').textContent = size;
  document.querySelectorAll('.size-opt').forEach(d=>{
    d.classList.toggle('selected', d.dataset.size === size);
  });
}

function addToCartFromDetail(){
  const p = products.find(p => p.id === appState.currentProductId);
  addLineToCart(p, appState.selectedColor, appState.selectedSize, 1);
  showToast(`${p.name} (${appState.selectedColor}, ${appState.selectedSize}) masuk keranjang`);
}

function buyNowFromDetail(){
  const p = products.find(p => p.id === appState.currentProductId);
  appState.checkoutItems = [{
    lineId:null, productId:p.id, name:p.name, price:p.price, img:p.img,
    color:appState.selectedColor, size:appState.selectedSize, qty:1
  }];
  renderCheckout();
  goTo('checkout');
}

/* ======================= CART LOGIC ======================= */
function addLineToCart(p, color, size, qty){
  const existing = appState.cart.find(l => l.productId === p.id && l.color === color && l.size === size);
  if(existing){
    existing.qty += qty;
  } else {
    appState.cart.push({
      lineId: nextLineId++, productId:p.id, name:p.name, price:p.price, img:p.img,
      color, size, qty, checked:true
    });
  }
  updateCartBadge();
}

function updateCartBadge(){
  const totalQty = appState.cart.reduce((s,l) => s + l.qty, 0);
  document.getElementById('headerCartBadge').textContent = totalQty;
  const navBadge = document.getElementById('navCartBadge');
  navBadge.textContent = totalQty;
  navBadge.style.display = totalQty > 0 ? 'flex' : 'none';
}

function renderCart(){
  const el = document.getElementById('cartContent');
  if(appState.cart.length === 0){
    el.innerHTML = `<div class="empty-state"><div class="emoji">🛒</div>Keranjang kamu masih kosong.<br>Yuk mulai belanja gadget!</div>`;
    return;
  }

  const itemsHTML = appState.cart.map(l => `
    <div class="cart-item">
      <input type="checkbox" class="cart-check" ${l.checked?'checked':''} onchange="toggleCartCheck(${l.lineId})">
      <img src="${l.img}" alt="${l.name}">
      <div class="ci-info">
        <div class="ci-name">${l.name}</div>
        <div class="ci-variant">Warna: ${l.color} · Varian: ${l.size}</div>
        <div class="ci-price">${formatRp(l.price)}</div>
        <div class="ci-qty">
          <button class="qbtn" onclick="changeQty(${l.lineId},-1)">−</button>
          <span>${l.qty}</span>
          <button class="qbtn" onclick="changeQty(${l.lineId},1)">+</button>
        </div>
        <div class="ci-delete" onclick="removeLine(${l.lineId})">Hapus</div>
      </div>
    </div>
  `).join('');

  const checkedLines = appState.cart.filter(l => l.checked);
  const subtotal = checkedLines.reduce((s,l) => s + l.price * l.qty, 0);
  const shipping = checkedLines.length > 0 ? 20000 : 0;
  const total = subtotal + shipping;

  el.innerHTML = itemsHTML + `
    <div class="summary-box">
      <div class="summary-row"><span>Subtotal (${checkedLines.length} produk dipilih)</span><span>${formatRp(subtotal)}</span></div>
      <div class="summary-row"><span>Ongkos Kirim</span><span>${formatRp(shipping)}</span></div>
      <div class="summary-row total"><span>Total</span><span>${formatRp(total)}</span></div>
      <button class="checkout-btn" ${checkedLines.length===0?'disabled':''} onclick="goToCheckout()">Checkout (${checkedLines.length})</button>
    </div>
  `;
}

function toggleCartCheck(lineId){
  const l = appState.cart.find(l => l.lineId === lineId);
  if(l) l.checked = !l.checked;
  renderCart();
}
function changeQty(lineId, delta){
  const l = appState.cart.find(l => l.lineId === lineId);
  if(!l) return;
  l.qty += delta;
  if(l.qty <= 0){ appState.cart = appState.cart.filter(x => x.lineId !== lineId); }
  updateCartBadge();
  renderCart();
}
function removeLine(lineId){
  appState.cart = appState.cart.filter(l => l.lineId !== lineId);
  updateCartBadge();
  renderCart();
  showToast("Produk dihapus dari keranjang");
}

function goToCheckout(){
  const checkedLines = appState.cart.filter(l => l.checked);
  if(checkedLines.length === 0) return;
  appState.checkoutItems = checkedLines.map(l => ({...l}));
  renderCheckout();
  goTo('checkout');
}

/* ======================= CHECKOUT LOGIC ======================= */
function renderCheckout(){
  const items = appState.checkoutItems;
  const subtotal = items.reduce((s,l) => s + l.price * l.qty, 0);
  const shipping = 20000;
  const total = subtotal + shipping;

  document.getElementById('view-checkout').innerHTML = `
    <div class="co-block">
      <h4>Ringkasan Produk</h4>
      ${items.map(l => `
        <div class="co-item-row">
          <span>${l.name} (${l.color}, ${l.size}) x${l.qty}</span>
          <span>${formatRp(l.price * l.qty)}</span>
        </div>
      `).join('')}
    </div>

    <div class="co-block">
      <h4>Alamat Pengiriman</h4>
      <textarea class="co-addr-input" id="coAddress">${appState.user.address || ''}</textarea>
    </div>

    <div class="co-block">
      <h4>Metode Pembayaran</h4>
      <div class="pay-option">💵 COD — Bayar di Tempat</div>
    </div>

    <div class="summary-box">
      <div class="summary-row"><span>Subtotal</span><span>${formatRp(subtotal)}</span></div>
      <div class="summary-row"><span>Ongkos Kirim</span><span>${formatRp(shipping)}</span></div>
      <div class="summary-row total"><span>Total Bayar</span><span>${formatRp(total)}</span></div>
      <button class="checkout-btn" onclick="placeOrder()">Buat Pesanan</button>
    </div>
  `;
}

function placeOrder(){
  const address = document.getElementById('coAddress').value.trim();
  if(!address){
    showToast("Alamat pengiriman wajib diisi");
    return;
  }
  appState.user.address = address;
  // simpan alamat terbaru ke akun juga
  const acc = registeredUsers.find(u => u.email === appState.user.email);
  if(acc){ acc.address = address; saveUsersToStorage(); }

  const items = appState.checkoutItems;
  const subtotal = items.reduce((s,l) => s + l.price * l.qty, 0);
  const shipping = 20000;
  const total = subtotal + shipping;
  const orderId = "#GSP-" + Math.random().toString(36).substring(2,8).toUpperCase();
  const now = new Date();

  // Pesanan disimpan ke daftar GLOBAL (allOrders), bukan ke appState,
  // supaya tetap ada & terlihat oleh Admin walau pembeli logout.
  allOrders.unshift({
    id:orderId, owner:appState.user.email, items, subtotal, shipping, total,
    address, payment:"COD - Bayar di Tempat", status:"Menunggu Konfirmasi",
    date:now.toLocaleDateString('id-ID', {day:'numeric',month:'long',year:'numeric'}),
    dateObj: now
  });

  const orderedLineIds = items.filter(i => i.lineId).map(i => i.lineId);
  appState.cart = appState.cart.filter(l => !orderedLineIds.includes(l.lineId));
  appState.checkoutItems = [];
  updateCartBadge();
  updateAdminPendingBadge();

  goTo('orders');
  showToast(`Pesanan ${orderId} dibuat! Menunggu konfirmasi penjual ⚡`);
}

/* ======================= ORDERS LOGIC (PEMBELI) ======================= */
function myOrders(){
  // Pembeli hanya melihat pesanan miliknya sendiri, diambil dari allOrders global.
  return allOrders.filter(o => o.owner === appState.user.email);
}

function renderOrders(){
  const el = document.getElementById('ordersList');
  const orders = myOrders();
  if(orders.length === 0){
    el.innerHTML = `<div class="empty-state"><div class="emoji">📦</div>Belum ada pesanan.<br>Yuk mulai belanja gadget dulu!</div>`;
    return;
  }
  el.innerHTML = orders.map(o => `
    <div class="order-card">
      <div class="order-top">
        <div>
          <div class="order-id">${o.id}</div>
          <div class="order-date">${o.date}</div>
        </div>
        <span class="order-status-badge">${o.status}</span>
      </div>
      <div class="order-items-list">
        ${o.items.map(l => `${l.name} — ${l.color}, ${l.size} x${l.qty}`).join('<br>')}
      </div>
      <div class="order-items-list" style="opacity:.75;">📍 ${o.address}</div>
      <div class="order-total-row"><span>${o.payment}</span><span>${formatRp(o.total)}</span></div>
    </div>
  `).join('');
}

/* ======================= PROFILE LOGIC ======================= */
function renderProfile(){
  document.getElementById('profileName').textContent = appState.user.username || "Raka";
  document.getElementById('profileEmail').textContent = appState.user.email || "-";
  document.getElementById('profilePhone').textContent = appState.user.phone || "-";
  document.getElementById('profileAddress').textContent = appState.user.address || "Belum diisi";
  document.getElementById('addressInput').value = appState.user.address || "";

  const orders = myOrders();
  document.getElementById('statOrders').textContent = orders.length;
  const totalSpent = orders.reduce((s,o) => s + o.total, 0);
  document.getElementById('statSpent').textContent = formatRp(totalSpent);
  document.getElementById('statCartCount').textContent = appState.cart.reduce((s,l) => s + l.qty, 0);
}

function saveAddress(){
  const val = document.getElementById('addressInput').value.trim();
  appState.user.address = val;
  const acc = registeredUsers.find(u => u.email === appState.user.email);
  if(acc){ acc.address = val; saveUsersToStorage(); }
  document.getElementById('profileAddress').textContent = val || "Belum diisi";
  showToast("Alamat berhasil disimpan");
}
