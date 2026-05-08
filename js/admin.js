/* ===== CRYSTAL MUSE - Admin JavaScript ===== */

let products = [];
let orders = [];
let customers = [];
let settings = {};
let currentTab = 'dashboard';

// Auth
function login() {
  const password = document.getElementById('passwordInput').value;
  const storedSettings = JSON.parse(localStorage.getItem('crystalMuseSettings') || '{}');
  const adminPassword = storedSettings.adminPassword || 'admin123';

  if (password === adminPassword) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'flex';
    initAdmin();
    document.getElementById('passwordInput').value = '';
    document.getElementById('loginError').style.display = 'none';
  } else {
    document.getElementById('loginError').style.display = 'block';
  }
}

function logout() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('passwordInput').value = '';
}

// Tab switching
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');

  const titles = {
    dashboard: 'Dashboard',
    products: 'Products',
    orders: 'Orders',
    customers: 'Customers',
    settings: 'Settings'
  };
  document.getElementById('pageTitle').textContent = titles[tab] || 'Dashboard';

  // Refresh content
  if (tab === 'dashboard') renderDashboard();
  if (tab === 'products') renderProductsTable();
  if (tab === 'orders') renderOrdersTable();
  if (tab === 'customers') renderCustomersTable();
  if (tab === 'settings') loadSettingsForm();
}

// Init
function initAdmin() {
  loadLocalData();
  renderDashboard();
}

function loadLocalData() {
  // Load settings from localStorage or file
  settings = JSON.parse(localStorage.getItem('crystalMuseSettings') || '{}');
  if (!settings.storeName) {
    settings = {
      storeName: 'Crystal Muse',
      paypalEmail: 'jingm1658@gmail.com',
      currency: 'USD',
      currencySymbol: '$',
      adminPassword: 'admin123',
      githubToken: '',
      githubRepo: '',
      githubBranch: 'main'
    };
    localStorage.setItem('crystalMuseSettings', JSON.stringify(settings));
  }

  // Load products from localStorage or defaults
  const storedProducts = localStorage.getItem('crystalMuseProducts');
  if (storedProducts) {
    products = JSON.parse(storedProducts);
  } else {
    // Load from file
    fetchProducts();
  }

  // Load orders
  orders = JSON.parse(localStorage.getItem('crystalMuseOrders') || '[]');

  // Load customers
  customers = JSON.parse(localStorage.getItem('crystalMuseCustomers') || '[]');

  // If we have orders but no customers, derive them
  if (orders.length > 0 && customers.length === 0) {
    const customerMap = {};
    orders.forEach(o => {
      if (!customerMap[o.email]) {
        customerMap[o.email] = {
          name: (o.firstName || '') + ' ' + (o.lastName || ''),
          email: o.email,
          orderCount: 0,
          totalSpent: 0,
          lastOrder: o.date
        };
      }
      customerMap[o.email].orderCount++;
      customerMap[o.email].totalSpent += o.total || 0;
    });
    customers = Object.values(customerMap);
    localStorage.setItem('crystalMuseCustomers', JSON.stringify(customers));
  }
}

async function fetchProducts() {
  try {
    const res = await fetch('../data/products.json');
    products = await res.json();
    localStorage.setItem('crystalMuseProducts', JSON.stringify(products));
  } catch (e) {
    console.warn('Could not fetch products.json, using defaults');
    products = getDefaultProducts();
    localStorage.setItem('crystalMuseProducts', JSON.stringify(products));
  }
}

function getDefaultProducts() {
  return [
    { id: 1, name: "Amethyst Harmony Bracelet", price: 34.99, description: "Hand-strung amethyst beads promote calm and spiritual awareness.", image: "https://source.unsplash.com/400x400/?amethyst,crystal,bracelet", category: "Purple Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 25 },
    { id: 2, name: "Rose Quartz Love Bracelet", price: 29.99, description: "Open your heart to love with genuine rose quartz.", image: "https://source.unsplash.com/400x400/?rose,quartz,crystal,jewelry", category: "Pink Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 30 },
    { id: 3, name: "Tiger's Eye Warrior Bracelet", price: 27.99, description: "Channel inner strength with golden-brown tiger's eye.", image: "https://source.unsplash.com/400x400/?tiger,eye,gemstone,bracelet", category: "Gold Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 20 },
    { id: 4, name: "Clear Quartz Clarity Bracelet", price: 24.99, description: "Master healer crystal that amplifies energy and intention.", image: "https://source.unsplash.com/400x400/?clear,quartz,crystal,gemstone", category: "White Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 35 },
    { id: 5, name: "Lapis Lazuli Wisdom Bracelet", price: 39.99, description: "Deep blue lapis lazuli for wisdom and truth.", image: "https://source.unsplash.com/400x400/?lapis,lazuli,blue,gemstone", category: "Blue Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 15 },
    { id: 6, name: "Green Jade Prosperity Bracelet", price: 44.99, description: "Lucky green jade for abundance and prosperity.", image: "https://source.unsplash.com/400x400/?jade,green,gemstone,bracelet", category: "Green Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 18 },
    { id: 7, name: "Citrus Citrine Joy Bracelet", price: 32.99, description: "Warm golden citrine radiates positivity.", image: "https://source.unsplash.com/400x400/?citrine,yellow,gemstone,crystal", category: "Gold Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 22 },
    { id: 8, name: "Selenite Moonlight Bracelet", price: 26.99, description: "Ethereal white selenite with a luminous glow.", image: "https://source.unsplash.com/400x400/?selenite,white,crystal,stone", category: "White Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 20 },
    { id: 9, name: "Obsidian Shield Bracelet", price: 22.99, description: "Deep black obsidian for powerful protection.", image: "https://source.unsplash.com/400x400/?obsidian,black,stone,jewelry", category: "Black Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 28 },
    { id: 10, name: "Carnelian Vitality Bracelet", price: 28.99, description: "Vibrant orange carnelian ignites your creative fire.", image: "https://source.unsplash.com/400x400/?carnelian,orange,gemstone,beads", category: "Orange Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 16 },
    { id: 11, name: "Sodalite Intuition Bracelet", price: 31.99, description: "Deep navy sodalite enhances logic and intuition.", image: "https://source.unsplash.com/400x400/?sodalite,blue,mineral,bracelet", category: "Blue Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 24 },
    { id: 12, name: "Rainbow Moonstone Dream Bracelet", price: 36.99, description: "Iridescent moonstone with flashes of rainbow light.", image: "https://source.unsplash.com/400x400/?moonstone,rainbow,gemstone,crystal", category: "White Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 19 }
  ];
}

// ===== DASHBOARD =====
function renderDashboard() {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalProducts = products.length;
  const totalCustomers = customers.length;

  document.getElementById('statOrders').textContent = totalOrders;
  document.getElementById('statRevenue').textContent = '$' + totalRevenue.toFixed(2);
  document.getElementById('statProducts').textContent = totalProducts;
  document.getElementById('statCustomers').textContent = totalCustomers;

  // Recent 5 orders
  const recentOrders = orders.slice(-5).reverse();
  const tbody = document.getElementById('recentOrdersTable');
  if (recentOrders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--gray-400);padding:20px;">No orders yet</td></tr>';
    return;
  }

  tbody.innerHTML = recentOrders.map(o => `
    <tr>
      <td>#${o.id}</td>
      <td>${(o.firstName || '') + ' ' + (o.lastName || '')}</td>
      <td>${(o.items || []).length} items</td>
      <td>$${(o.total || 0).toFixed(2)}</td>
      <td><span class="status-badge status-${o.status || 'pending'}">${o.status || 'Pending'}</span></td>
      <td>${formatDate(o.date)}</td>
    </tr>
  `).join('');
}

// ===== PRODUCTS =====
function renderProductsTable() {
  const tbody = document.getElementById('productsTable');
  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--gray-400);padding:20px;">No products. Add your first product!</td></tr>';
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>${p.id}</td>
      <td><strong>${p.name}</strong></td>
      <td>$${p.price.toFixed(2)}</td>
      <td>${p.category || '—'}</td>
      <td>${p.stock || 0}</td>
      <td>
        <div class="table-actions">
          <button class="btn-sm btn-edit" onclick="editProduct(${p.id})">✏️ Edit</button>
          <button class="btn-sm btn-delete" onclick="deleteProduct(${p.id})">🗑️ Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function saveProduct() {
  const id = document.getElementById('productFormId').value;
  const name = document.getElementById('prodName').value.trim();
  const price = parseFloat(document.getElementById('prodPrice').value);
  const desc = document.getElementById('prodDesc').value.trim();
  const image = document.getElementById('prodImage').value.trim();
  const category = document.getElementById('prodCategory').value.trim();
  const sizesStr = document.getElementById('prodSizes').value.trim();
  const stock = parseInt(document.getElementById('prodStock').value) || 0;

  if (!name || !price || !desc || !image) {
    showAlert('Please fill in all required fields');
    return;
  }

  const sizes = sizesStr.split(',').map(s => s.trim()).filter(s => s);
  const sizesDefault = sizes.length > 0 ? sizes : ['S (6.5")', 'M (7")', 'L (7.5")'];

  if (id) {
    // Edit existing
    const idx = products.findIndex(p => p.id == id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], name, price, description: desc, image, category, sizes: sizesDefault, stock };
    }
  } else {
    // Add new
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    products.push({
      id: newId,
      name,
      price,
      description: desc,
      image,
      category,
      sizes: sizesDefault,
      stock
    });
  }

  localStorage.setItem('crystalMuseProducts', JSON.stringify(products));
  renderProductsTable();
  resetProductForm();
  showAlert('Product saved!', 'success');
}

function editProduct(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  document.getElementById('productFormTitle').textContent = 'Edit Product';
  document.getElementById('productFormId').value = product.id;
  document.getElementById('prodName').value = product.name;
  document.getElementById('prodPrice').value = product.price;
  document.getElementById('prodDesc').value = product.description;
  document.getElementById('prodImage').value = product.image;
  document.getElementById('prodCategory').value = product.category || '';
  document.getElementById('prodSizes').value = (product.sizes || []).join(', ');
  document.getElementById('prodStock').value = product.stock || 0;

  document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
}

function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  products = products.filter(p => p.id !== id);
  localStorage.setItem('crystalMuseProducts', JSON.stringify(products));
  renderProductsTable();
  showAlert('Product deleted', 'success');
}

function resetProductForm() {
  document.getElementById('productFormTitle').textContent = 'Add New Product';
  document.getElementById('productFormId').value = '';
  document.getElementById('prodName').value = '';
  document.getElementById('prodPrice').value = '';
  document.getElementById('prodDesc').value = '';
  document.getElementById('prodImage').value = '';
  document.getElementById('prodCategory').value = '';
  document.getElementById('prodSizes').value = 'S (6.5"), M (7"), L (7.5")';
  document.getElementById('prodStock').value = '20';
}

// ===== ORDERS =====
function renderOrdersTable() {
  const tbody = document.getElementById('ordersTable');
  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--gray-400);padding:20px;">No orders yet</td></tr>';
    return;
  }

  tbody.innerHTML = orders.map((o, i) => `
    <tr>
      <td>#${o.id}</td>
      <td>${(o.firstName || '') + ' ' + (o.lastName || '')}</td>
      <td>${o.email || '—'}</td>
      <td>${(o.items || []).length} items</td>
      <td>$${(o.total || 0).toFixed(2)}</td>
      <td>
        <select class="status-select" onchange="updateOrderStatus(${i}, this.value)">
          <option value="pending" ${(o.status||'pending') === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Shipped</option>
          <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Delivered</option>
          <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
      <td>${formatDate(o.date)}</td>
    </tr>
  `).join('');
}

function updateOrderStatus(index, status) {
  if (orders[index]) {
    orders[index].status = status;
    localStorage.setItem('crystalMuseOrders', JSON.stringify(orders));
    if (currentTab === 'dashboard') renderDashboard();
    showAlert('Order status updated to: ' + status, 'success');
  }
}

// ===== CUSTOMERS =====
function renderCustomersTable() {
  const tbody = document.getElementById('customersTable');
  if (customers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--gray-400);padding:20px;">No customers yet</td></tr>';
    return;
  }

  tbody.innerHTML = customers.map(c => `
    <tr>
      <td><strong>${c.name || 'Unknown'}</strong></td>
      <td>${c.email || '—'}</td>
      <td>${c.orderCount || 0}</td>
      <td>$${(c.totalSpent || 0).toFixed(2)}</td>
      <td>${formatDate(c.lastOrder)}</td>
    </tr>
  `).join('');
}

// ===== SETTINGS =====
function loadSettingsForm() {
  document.getElementById('setStoreName').value = settings.storeName || 'Crystal Muse';
  document.getElementById('setPaypalEmail').value = settings.paypalEmail || 'jingm1658@gmail.com';
  document.getElementById('setCurrency').value = settings.currency || 'USD';
  document.getElementById('setGithubToken').value = settings.githubToken || '';
  document.getElementById('setGithubRepo').value = settings.githubRepo || '';
  document.getElementById('setGithubBranch').value = settings.githubBranch || 'main';
}

function saveSettings() {
  settings.storeName = document.getElementById('setStoreName').value.trim();
  settings.paypalEmail = document.getElementById('setPaypalEmail').value.trim();
  settings.currency = document.getElementById('setCurrency').value;

  if (!settings.storeName || !settings.paypalEmail) {
    showAlert('Store name and PayPal email are required');
    return;
  }

  localStorage.setItem('crystalMuseSettings', JSON.stringify(settings));
  showSettingsSuccess('Store settings saved!');
}

function changePassword() {
  const current = document.getElementById('currentPassword').value;
  const newPass = document.getElementById('newPassword').value;

  if (current !== settings.adminPassword) {
    showAlert('Current password is incorrect');
    return;
  }
  if (!newPass || newPass.length < 4) {
    showAlert('New password must be at least 4 characters');
    return;
  }

  settings.adminPassword = newPass;
  localStorage.setItem('crystalMuseSettings', JSON.stringify(settings));
  document.getElementById('currentPassword').value = '';
  document.getElementById('newPassword').value = '';
  showSettingsSuccess('Password changed successfully!');
}

function saveGithubSettings() {
  settings.githubToken = document.getElementById('setGithubToken').value.trim();
  settings.githubRepo = document.getElementById('setGithubRepo').value.trim();
  settings.githubBranch = document.getElementById('setGithubBranch').value.trim() || 'main';

  localStorage.setItem('crystalMuseSettings', JSON.stringify(settings));
  showSettingsSuccess('GitHub settings saved!');
}

async function syncToGithub() {
  const token = settings.githubToken;
  const repo = settings.githubRepo;
  const branch = settings.githubBranch || 'main';

  if (!token || !repo) {
    showAlert('Please configure GitHub Token and Repository in Settings first');
    return;
  }

  const filesToSync = {
    'data/products.json': JSON.stringify(products, null, 2),
    'data/orders.json': JSON.stringify(orders, null, 2),
    'data/customers.json': JSON.stringify(customers, null, 2),
    'data/settings.json': JSON.stringify(settings, null, 2)
  };

  showAlert('Syncing to GitHub...', 'success');

  try {
    for (const [path, content] of Object.entries(filesToSync)) {
      await syncFile(token, repo, branch, path, content);
    }
    showAlert('✅ All files synced to GitHub!', 'success');
  } catch (e) {
    showAlert('Sync failed: ' + e.message, 'error');
    console.error('GitHub sync error:', e);
  }
}

async function syncFile(token, repo, branch, path, content) {
  const url = `https://api.github.com/repos/${repo}/contents/${path}`;

  // Get current file SHA if exists
  let sha = null;
  try {
    const getRes = await fetch(url + '?ref=' + branch, {
      headers: { 'Authorization': 'token ' + token, 'Accept': 'application/vnd.github.v3+json' }
    });
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }
  } catch { /* File doesn't exist yet */ }

  // Create or update file
  const body = {
    message: `Update ${path} from admin panel`,
    content: btoa(unescape(encodeURIComponent(content))),
    branch: branch
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': 'token ' + token,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`GitHub API error (${path}): ${err.message}`);
  }
}

// ===== UTILITY =====
function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr.substring(0, 10);
  }
}

function showAlert(message, type = 'error') {
  // Use simple alert for now, or inline message
  if (type === 'error') {
    alert(message);
  } else {
    // For success, try to show on settings page
    const el = document.getElementById('settingsSuccess');
    if (el) {
      el.textContent = message;
      el.style.display = 'block';
      setTimeout(() => { el.style.display = 'none'; }, 3000);
    } else {
      alert(message);
    }
  }
}

function showSettingsSuccess(msg) {
  const el = document.getElementById('settingsSuccess');
  if (el) {
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 3000);
  }
}

// Keyboard shortcut: Enter on login
document.addEventListener('DOMContentLoaded', function() {
  // Check if already logged in (session)
  const hash = window.location.hash;
  if (hash === '#autologin') {
    document.getElementById('passwordInput').value = 'admin123';
    login();
  }
});

// Login on Enter key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && document.getElementById('loginScreen').style.display !== 'none') {
    login();
  }
});
