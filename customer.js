// Fitur & Tampilan Sisi Customer
function renderHome() {
  const app = document.getElementById('app');
  if (!app) return;
  
  // Tampilan sederhana untuk pengujian
  app.innerHTML = `
    <h2>Daftar Produk Store</h2>
    <div style="display:flex; gap:10px; flex-wrap:wrap;">
      ${products.map(p => `
        <div style="border:1px solid #ccc; padding:10px; border-radius:5px;">
          <h4>${p.name}</h4>
          <p>Harga: ${formatRp(p.price)}</p>
          <p>Stok: ${p.stock}</p>
        </div>
      `).join('')}
    </div>
  `;
}
