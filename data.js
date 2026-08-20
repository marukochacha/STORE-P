// Variable Global & Mock Data Store
let products = [
  {
    id: 1,
    name: "Smartphone flagship",
    price: 12000000,
    oldPrice: null,
    desc: "Smartphone flagship dengan performa tinggi.",
    rating: 4.8,
    sold: 12,
    stock: 10,
    cat: "smartphone",
    badge: "Populer",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
    gallery: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80"],
    video: null,
    colors: [{ name: "Hitam", hex: "#000000" }],
    sizes: ["Standard"]
  }
];

let suppliers = [
  {
    id: 1,
    name: "PT Gadget Nusantara",
    contact: "Budi",
    phone: "081234567890",
    email: "budi@gadget.com",
    cat: "smartphone",
    address: "Jakarta",
    status: "Aktif"
  }
];

let allOrders = [];

let appState = {
  editingProductId: null,
  reportRange: 'bulanan'
};

let editingSupplierId = null;
let deletingSupplierId = null;
let nextSupplierId = 2;

let addImageObjectURL = null;
let addVideoObjectURL = null;
