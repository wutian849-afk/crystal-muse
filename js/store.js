/* ===== CRYSTAL MUSE - Store JavaScript ===== */

// State
let products = [];
let cart = [];
let currentModalProduct = null;
let settings = {};

// Load data
async function loadData() {
  try {
    const [prodRes, settingsRes] = await Promise.all([
      fetch('../data/products.json'),
      fetch('../data/settings.json')
    ]);
    products = await prodRes.json();
    settings = await settingsRes.json();
  } catch (e) {
    // Fallback for GitHub Pages / relative path issues
    console.warn('Could not load data files, using defaults');
    products = getDefaultProducts();
    settings = {
      storeName: 'Crystal Muse',
      paypalEmail: 'jingm1658@gmail.com',
      currency: 'USD',
      currencySymbol: '$'
    };
  }
  renderProducts();
  updateCartCount();
}

function getImage(p) {
  if (p.images && p.images.length > 0) return p.images[0];
  if (p.image) return p.image;
  return "https://source.unsplash.com/400x400/?crystal,gemstone";
}

function getDefaultProducts() {
  return [
    { id: 1, name: "Amethyst Harmony Bracelet", price: 34.99, description: "Hand-strung amethyst beads promote calm and spiritual awareness.", images: ["https://source.unsplash.com/400x400/?amethyst,crystal,bracelet"], category: "Purple Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 25 },
    { id: 2, name: "Rose Quartz Love Bracelet", price: 29.99, description: "Open your heart to love with genuine rose quartz.", images: ["https://source.unsplash.com/400x400/?rose,quartz,crystal,jewelry"], category: "Pink Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 30 },
    { id: 3, name: "Tiger's Eye Warrior Bracelet", price: 27.99, description: "Channel inner strength with golden-brown tiger's eye.", images: ["https://source.unsplash.com/400x400/?tiger,eye,gemstone,bracelet"], category: "Gold Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 20 },
    { id: 4, name: "Clear Quartz Clarity Bracelet", price: 24.99, description: "Master healer crystal that amplifies energy and intention.", images: ["https://source.unsplash.com/400x400/?clear,quartz,crystal,gemstone"], category: "White Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 35 },
    { id: 5, name: "Lapis Lazuli Wisdom Bracelet", price: 39.99, description: "Deep blue lapis lazuli for wisdom and truth.", images: ["https://source.unsplash.com/400x400/?lapis,lazuli,blue,gemstone"], category: "Blue Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 15 },
    { id: 6, name: "Green Jade Prosperity Bracelet", price: 44.99, description: "Lucky green jade for abundance and prosperity.", images: ["https://source.unsplash.com/400x400/?jade,green,gemstone,bracelet"], category: "Green Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 18 },
    { id: 7, name: "Citrus Citrine Joy Bracelet", price: 32.99, description: "Warm golden citrine radiates positivity.", images: ["https://source.unsplash.com/400x400/?citrine,yellow,gemstone,crystal"], category: "Gold Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 22 },
    { id: 8, name: "Selenite Moonlight Bracelet", price: 26.99, description: "Ethereal white selenite with a luminous glow.", images: ["https://source.unsplash.com/400x400/?selenite,white,crystal,stone"], category: "White Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 20 },
    { id: 9, name: "Obsidian Shield Bracelet", price: 22.99, description: "Deep black obsidian for powerful protection.", images: ["https://source.unsplash.com/400x400/?obsidian,black,stone,jewelry"], category: "Black Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 28 },
    { id: 10, name: "Carnelian Vitality Bracelet", price: 28.99, description: "Vibrant orange carnelian ignites your creative fire.", images: ["https://source.unsplash.com/400x400/?carnelian,orange,gemstone,beads"], category: "Orange Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 16 },
    { id: 11, name: "Sodalite Intuition Bracelet", price: 31.99, description: "Deep navy sodalite enhances logic and intuition.", images: ["https://source.unsplash.com/400x400/?sodalite,blue,mineral,bracelet"], category: "Blue Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 24 },
    { id: 12, name: "Rainbow Moonstone Dream Bracelet", price: 36.99, description: "Iridescent moonstone with flashes of rainbow light.", images: ["https://source.unsplash.com/400x400/?moonstone,rainbow,gemstone,crystal"], category: "White Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 19 }
  ];
}

// Cart management
function loadCart() {
  try {
    cart = JSON.parse(localStorage.getItem('crystalMuseCart')) || [];
  } catch { cart = []; }
}

function saveCart() {
  localStorage.setItem('crystalMuseCart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const el = document.getElementById('cartCount');
  if (el) el.textContent = count;
}

function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  grid.innerHTML = products.map(p => `
    <div class="product-card" onclick="openProductModal(${p.id})">
      <img class="product-card-image" src="${getImage(p)}" alt="${p.name}" loading="lazy"
           onerror="this.src='https://source.unsplash.com/400x400/?crystal,gemstone'">
      <div class="product-card-body">
        <div class="product-card-category">${p.category}</div>
        <h3>${p.name}</h3>
        <div class="product-card-price">$${p.price.toFixed(2)}</div>
        <button class="product-card-btn" onclick="event.stopPropagation(); quickAdd(${p.id})">
          🛒 Add to Cart
        </button>
      </div>
    </div>
  `).join('');
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">🛒</div>
        <p>Your cart is empty</p>
        <p style="font-size:0.85rem;margin-top:8px;">Add some crystal energy to get started!</p>
      </div>
    `;
    if (footer) footer.style.display = 'none';
    return;
  }

  container.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <img class="cart-item-image" src="${getImage(item)}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-details">${item.size || 'M (7")'}</div>
        <div class="cart-item-bottom">
          <div class="cart-item-qty">
            <button onclick="changeQty(${i}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${i}, 1)">+</button>
          </div>
          <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${i})">Remove</button>
      </div>
    </div>
  `).join('');

  if (footer) {
    footer.style.display = 'block';
    document.getElementById('cartSubtotal').textContent = '$' + getCartTotal().toFixed(2);
  }
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function quickAdd(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(c => c.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: getImage(product),
      size: product.sizes ? product.sizes[1] : 'M (7")',
      qty: 1
    });
  }
  saveCart();
  renderCart();
  showToast(`${product.name} added to cart!`, 'success');
}

// Modal
function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  currentModalProduct = product;

  document.getElementById('modalImage').src = getImage(product);
  document.getElementById('modalImage').onerror = function() {
    this.src = 'https://source.unsplash.com/400x400/?crystal,gemstone';
  };

  // Render image thumbnails for multi-image support
  var allImages = product.images || (product.image ? [product.image] : []);
  var thumbContainer = document.getElementById('modalThumbnails');
  if (thumbContainer) {
    if (allImages.length > 1) {
      thumbContainer.innerHTML = allImages.map(function(url, idx) {
        return '<div class="thumb' + (idx === 0 ? ' active' : '') + '" onclick="switchImage(this, \'' + url.replace(/'/g, "\\'") + '\')"><img src="' + url + '" alt="view ' + (idx+1) + '"></div>';
      }).join('');
      thumbContainer.style.display = 'flex';
    } else {
      thumbContainer.style.display = 'none';
    }
  }
  document.getElementById('modalName').textContent = product.name;
  document.getElementById('modalPrice').textContent = '$' + product.price.toFixed(2);
  document.getElementById('modalDesc').textContent = product.description;
  document.getElementById('modalQty').value = 1;

  const sizeSelect = document.getElementById('modalSize');
  sizeSelect.innerHTML = (product.sizes || ['S (6.5")', 'M (7")', 'L (7.5")'])
    .map(s => `<option value="${s}">${s}</option>`).join('');

  document.getElementById('productModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function switchImage(el, url) {
  document.getElementById('modalImage').src = url;
  document.querySelectorAll('#modalThumbnails .thumb').forEach(function(t) { t.classList.remove('active'); });
  if (el) el.classList.add('active');
}

function closeModal() {
  document.getElementById('productModal').classList.remove('active');
  document.body.style.overflow = '';
  currentModalProduct = null;
}

function addFromModal() {
  if (!currentModalProduct) return;
  const size = document.getElementById('modalSize').value;
  const qty = parseInt(document.getElementById('modalQty').value) || 1;

  const existing = cart.find(c => c.id === currentModalProduct.id && c.size === size);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: currentModalProduct.id,
      name: currentModalProduct.name,
      price: currentModalProduct.price,
      image: getImage(currentModalProduct),
      size: size,
      qty: qty
    });
  }
  saveCart();
  renderCart();
  closeModal();
  showToast(`${currentModalProduct.name} added to cart!`, 'success');
}

function buyNow() {
  addFromModal();
  // Small delay so cart is updated
  setTimeout(() => {
    // Redirect to checkout or initiate PayPal
    checkout();
  }, 300);
}

// Cart drawer
function openCart() {
  renderCart();
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function checkout() {
  if (cart.length === 0) {
    showToast('Your cart is empty!', 'error');
    return;
  }
  closeCart();
  // Save cart for checkout page
  sessionStorage.setItem('checkoutCart', JSON.stringify(cart));
  window.location.href = '../checkout.html';
}

// Coupon
let appliedCoupon = null;
function applyCoupon() {
  const input = document.getElementById('couponInput');
  const code = input.value.trim().toUpperCase();
  if (!code) { showToast('Enter a coupon code', 'error'); return; }

  const coupons = {
    'WELCOME10': 10,
    'CRYSTAL15': 15,
    'MUSE20': 20
  };

  if (coupons[code]) {
    appliedCoupon = coupons[code];
    showToast(`Coupon applied! ${coupons[code]}% off`, 'success');
    renderCart();
  } else {
    showToast('Invalid coupon code', 'error');
  }
}

// Checkout page
function initCheckoutPage() {
  const cartData = sessionStorage.getItem('checkoutCart');
  if (!cartData) {
    document.getElementById('checkoutItems').innerHTML = '<p style="color:var(--gray-400)">No items in cart</p>';
    return;
  }
  const items = JSON.parse(cartData);
  const container = document.getElementById('checkoutItems');
  let total = 0;

  container.innerHTML = items.map(item => {
    const lineTotal = item.price * item.qty;
    total += lineTotal;
    return `
      <div class="checkout-summary-item">
        <div class="item-left">
          <span>${item.name}</span>
          <span class="item-qty">×${item.qty}</span>
        </div>
        <span>$${lineTotal.toFixed(2)}</span>
      </div>
    `;
  }).join('');

  document.getElementById('checkoutTotal').innerHTML = `
    <span>Total</span>
    <span>$${total.toFixed(2)}</span>
  `;

  // PayPal button
  if (typeof paypal_sdk !== 'undefined' && paypal_sdk.Buttons) {
    paypal_sdk.Buttons({
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: { value: total.toFixed(2) },
            description: 'Crystal Muse Order',
            payee: { email_address: 'jingm1658@gmail.com' }
          }]
        });
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          const form = document.getElementById('checkoutForm');
          const customerData = {
            id: Date.now(),
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value,
            country: document.getElementById('country').value,
            paymentId: details.id,
            payerEmail: details.payer.email_address,
            items: items,
            total: total,
            status: 'pending',
            date: new Date().toISOString()
          };
          saveOrder(customerData);
          sessionStorage.removeItem('checkoutCart');
          showToast(`Payment successful! Order #${customerData.id}`, 'success');
          setTimeout(() => { window.location.href = 'store/index.html'; }, 2000);
        });
      },
      onError: function(err) {
        showToast('Payment failed. Please try again.', 'error');
        console.error('PayPal Error:', err);
      }
    }).render('#paypal-button-container');
  } else {
    // Fallback: show a simple PayPal link
    document.getElementById('paypal-button-container').innerHTML = `
      <p style="text-align:center;color:var(--gray-400);padding:20px;">
        PayPal SDK not loaded. Order by email: ${settings.paypalEmail || 'jingm1658@gmail.com'}
      </p>
      <a href="mailto:${settings.paypalEmail || 'jingm1658@gmail.com'}?subject=Order Inquiry&body=I'd like to order crystal bracelets (Total: $${total.toFixed(2)})"
         style="display:block;text-align:center;padding:14px;background:var(--gold-primary);color:var(--purple-deep);border-radius:6px;font-weight:600;text-decoration:none;">
        📧 Order via Email
      </a>
    `;
  }
}

function saveOrder(orderData) {
  // Save to localStorage for admin panel to read
  let orders = JSON.parse(localStorage.getItem('crystalMuseOrders') || '[]');
  orders.push(orderData);
  localStorage.setItem('crystalMuseOrders', JSON.stringify(orders));

  // Update customers
  let customers = JSON.parse(localStorage.getItem('crystalMuseCustomers') || '[]');
  let customer = customers.find(c => c.email === orderData.email);
  if (customer) {
    customer.orderCount = (customer.orderCount || 0) + 1;
    customer.totalSpent = (customer.totalSpent || 0) + orderData.total;
    customer.lastOrder = orderData.date;
  } else {
    customers.push({
      name: orderData.firstName + ' ' + orderData.lastName,
      email: orderData.email,
      orderCount: 1,
      totalSpent: orderData.total,
      lastOrder: orderData.date
    });
  }
  localStorage.setItem('crystalMuseCustomers', JSON.stringify(customers));
}

// Mobile menu
function toggleMobileMenu() {
  const nav = document.getElementById('navLinks');
  nav.classList.toggle('open');
}

// Toast
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = 'toast ' + type + ' show';
  setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// Keyboard: close modal on Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
    closeCart();
  }
});

// Click overlay to close
document.addEventListener('DOMContentLoaded', function() {
  loadCart();

  // Check if we're on checkout page
  if (window.location.pathname.includes('checkout') || window.location.pathname.endsWith('checkout.html')) {
    // Checkout page init is handled by inline script
    return;
  }

  loadData();

  // Close modal on overlay click
  document.getElementById('productModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
});
