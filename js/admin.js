     1|/* ===== CRYSTAL MUSE - Admin JavaScript ===== */
     2|
     3|let products = [];
     4|let orders = [];
     5|let customers = [];
     6|let settings = {};
     7|let currentTab = 'dashboard';
     8|
     9|// Auth
    10|function login() {
    11|  const password = document.getElementById('passwordInput').value;
    12|  const storedSettings = JSON.parse(localStorage.getItem('crystalMuseSettings') || '{}');
    13|  const adminPassword = storedSettings.adminPassword || 'admin123';
    14|
    15|  if (password === adminPassword) {
    16|    document.getElementById('loginScreen').style.display = 'none';
    17|    document.getElementById('adminPanel').style.display = 'flex';
    18|    initAdmin();
    19|    document.getElementById('passwordInput').value = '';
    20|    document.getElementById('loginError').style.display = 'none';
    21|  } else {
    22|    document.getElementById('loginError').style.display = 'block';
    23|  }
    24|}
    25|
    26|function logout() {
    27|  document.getElementById('loginScreen').style.display = 'flex';
    28|  document.getElementById('adminPanel').style.display = 'none';
    29|  document.getElementById('passwordInput').value = '';
    30|}
    31|
    32|// Tab switching
    33|function switchTab(tab) {
    34|  currentTab = tab;
    35|  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    36|  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    37|  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    38|  document.getElementById('tab-' + tab).classList.add('active');
    39|
    40|  const titles = {
    41|    dashboard: 'Dashboard',
    42|    products: 'Products',
    43|    orders: 'Orders',
    44|    customers: 'Customers',
    45|    settings: 'Settings'
    46|  };
    47|  document.getElementById('pageTitle').textContent = titles[tab] || 'Dashboard';
    48|
    49|  // Refresh content
    50|  if (tab === 'dashboard') renderDashboard();
    51|  if (tab === 'products') renderProductsTable();
    52|  if (tab === 'orders') renderOrdersTable();
    53|  if (tab === 'customers') renderCustomersTable();
    54|  if (tab === 'settings') loadSettingsForm();
    55|}
    56|
    57|// Init
    58|function initAdmin() {
    59|  loadLocalData();
    60|  renderDashboard();
    61|}
    62|
    63|function loadLocalData() {
    64|  // Load settings from localStorage or file
    65|  settings = JSON.parse(localStorage.getItem('crystalMuseSettings') || '{}');
    66|  if (!settings.storeName) {
    67|    settings = {
    68|      storeName: 'Crystal Muse',
    69|      paypalEmail: 'jingm1658@gmail.com',
    70|      currency: 'USD',
    71|      currencySymbol: '$',
    72|      adminPassword: 'admin123',
    73|      githubToken: '',
    74|      githubRepo: '',
    75|      githubBranch: 'main'
    76|    };
    77|    localStorage.setItem('crystalMuseSettings', JSON.stringify(settings));
    78|  }
    79|
    80|  // Load products from localStorage or defaults
    81|  const storedProducts = localStorage.getItem('crystalMuseProducts');
    82|  if (storedProducts) {
    83|    products = JSON.parse(storedProducts);
    84|  } else {
    85|    // Load from file
    86|    fetchProducts();
    87|  }
    88|
    89|  // Load orders
    90|  orders = JSON.parse(localStorage.getItem('crystalMuseOrders') || '[]');
    91|
    92|  // Load customers
    93|  customers = JSON.parse(localStorage.getItem('crystalMuseCustomers') || '[]');
    94|
    95|  // If we have orders but no customers, derive them
    96|  if (orders.length > 0 && customers.length === 0) {
    97|    const customerMap = {};
    98|    orders.forEach(o => {
    99|      if (!customerMap[o.email]) {
   100|        customerMap[o.email] = {
   101|          name: (o.firstName || '') + ' ' + (o.lastName || ''),
   102|          email: o.email,
   103|          orderCount: 0,
   104|          totalSpent: 0,
   105|          lastOrder: o.date
   106|        };
   107|      }
   108|      customerMap[o.email].orderCount++;
   109|      customerMap[o.email].totalSpent += o.total || 0;
   110|    });
   111|    customers = Object.values(customerMap);
   112|    localStorage.setItem('crystalMuseCustomers', JSON.stringify(customers));
   113|  }
   114|}
   115|
   116|async function fetchProducts() {
   117|  try {
   118|    const res = await fetch('../data/products.json');
   119|    products = await res.json();
   120|    localStorage.setItem('crystalMuseProducts', JSON.stringify(products));
   121|  } catch (e) {
   122|    console.warn('Could not fetch products.json, using defaults');
   123|    products = getDefaultProducts();
   124|    localStorage.setItem('crystalMuseProducts', JSON.stringify(products));
   125|  }
   126|}
   127|
   128|function getDefaultProducts() {
   129|  return [
   130|    { id: 1, name: "Amethyst Harmony Bracelet", price: 34.99, description: "Hand-strung amethyst beads promote calm and spiritual awareness.", images: ["https://source.unsplash.com/400x400/?amethyst,crystal,bracelet"], category: "Purple Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 25 },
   131|    { id: 2, name: "Rose Quartz Love Bracelet", price: 29.99, description: "Open your heart to love with genuine rose quartz.", images: ["https://source.unsplash.com/400x400/?rose,quartz,crystal,jewelry"], category: "Pink Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 30 },
   132|    { id: 3, name: "Tiger's Eye Warrior Bracelet", price: 27.99, description: "Channel inner strength with golden-brown tiger's eye.", images: ["https://source.unsplash.com/400x400/?tiger,eye,gemstone,bracelet"], category: "Gold Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 20 },
   133|    { id: 4, name: "Clear Quartz Clarity Bracelet", price: 24.99, description: "Master healer crystal that amplifies energy and intention.", images: ["https://source.unsplash.com/400x400/?clear,quartz,crystal,gemstone"], category: "White Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 35 },
   134|    { id: 5, name: "Lapis Lazuli Wisdom Bracelet", price: 39.99, description: "Deep blue lapis lazuli for wisdom and truth.", images: ["https://source.unsplash.com/400x400/?lapis,lazuli,blue,gemstone"], category: "Blue Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 15 },
   135|    { id: 6, name: "Green Jade Prosperity Bracelet", price: 44.99, description: "Lucky green jade for abundance and prosperity.", images: ["https://source.unsplash.com/400x400/?jade,green,gemstone,bracelet"], category: "Green Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 18 },
   136|    { id: 7, name: "Citrus Citrine Joy Bracelet", price: 32.99, description: "Warm golden citrine radiates positivity.", images: ["https://source.unsplash.com/400x400/?citrine,yellow,gemstone,crystal"], category: "Gold Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 22 },
   137|    { id: 8, name: "Selenite Moonlight Bracelet", price: 26.99, description: "Ethereal white selenite with a luminous glow.", images: ["https://source.unsplash.com/400x400/?selenite,white,crystal,stone"], category: "White Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 20 },
   138|    { id: 9, name: "Obsidian Shield Bracelet", price: 22.99, description: "Deep black obsidian for powerful protection.", images: ["https://source.unsplash.com/400x400/?obsidian,black,stone,jewelry"], category: "Black Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 28 },
   139|    { id: 10, name: "Carnelian Vitality Bracelet", price: 28.99, description: "Vibrant orange carnelian ignites your creative fire.", images: ["https://source.unsplash.com/400x400/?carnelian,orange,gemstone,beads"], category: "Orange Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 16 },
   140|    { id: 11, name: "Sodalite Intuition Bracelet", price: 31.99, description: "Deep navy sodalite enhances logic and intuition.", images: ["https://source.unsplash.com/400x400/?sodalite,blue,mineral,bracelet"], category: "Blue Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 24 },
   141|    { id: 12, name: "Rainbow Moonstone Dream Bracelet", price: 36.99, description: "Iridescent moonstone with flashes of rainbow light.", images: ["https://source.unsplash.com/400x400/?moonstone,rainbow,gemstone,crystal"], category: "White Crystals", sizes: ['S (6.5")', 'M (7")', 'L (7.5")'], stock: 19 }
   142|  ];
   143|}
   144|
   145|// ===== DASHBOARD =====
   146|function renderDashboard() {
   147|  const totalOrders = orders.length;
   148|  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
   149|  const totalProducts = products.length;
   150|  const totalCustomers = customers.length;
   151|
   152|  document.getElementById('statOrders').textContent = totalOrders;
   153|  document.getElementById('statRevenue').textContent = '$' + totalRevenue.toFixed(2);
   154|  document.getElementById('statProducts').textContent = totalProducts;
   155|  document.getElementById('statCustomers').textContent = totalCustomers;
   156|
   157|  // Recent 5 orders
   158|  const recentOrders = orders.slice(-5).reverse();
   159|  const tbody = document.getElementById('recentOrdersTable');
   160|  if (recentOrders.length === 0) {
   161|    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--gray-400);padding:20px;">No orders yet</td></tr>';
   162|    return;
   163|  }
   164|
   165|  tbody.innerHTML = recentOrders.map(o => `
   166|    <tr>
   167|      <td>#${o.id}</td>
   168|      <td>${(o.firstName || '') + ' ' + (o.lastName || '')}</td>
   169|      <td>${(o.items || []).length} items</td>
   170|      <td>$${(o.total || 0).toFixed(2)}</td>
   171|      <td><span class="status-badge status-${o.status || 'pending'}">${o.status || 'Pending'}</span></td>
   172|      <td>${formatDate(o.date)}</td>
   173|    </tr>
   174|  `).join('');
   175|}
   176|
   177|// ===== IMAGE UPLOAD (GitHub API) =====
   178|
   179|function getGithubConfig() {
   180|  const s = JSON.parse(localStorage.getItem('crystalMuseSettings') || '{}');
   181|  return {
   182|    token: s.githubToken || '',
   183|    repo: s.githubRepo || 'wutian849-afk/crystal-muse',
   184|    branch: s.githubBranch || 'main'
   185|  };
   186|}
   187|
   188|// Click upload area triggers file picker
   189|document.addEventListener('DOMContentLoaded', function() {
   190|  const uploadArea = document.getElementById('imageUploadArea');
   191|  if (uploadArea) {
   192|    uploadArea.addEventListener('click', function(e) {
   193|      // Don't trigger if clicking remove button or preview
   194|      if (e.target.closest('.btn-remove') || e.target.closest('.image-preview')) return;
   195|      document.getElementById('prodImageInput').click();
   196|    });
   197|  }
   198|
   199|  // Check if already logged in (session)
   200|  const hash = window.location.hash;
   201|  if (hash === '#autologin') {
   202|    document.getElementById('passwordInput').value = 'admin123';
   203|    login();
   204|  }
   205|});
   206|
   207|function handleImageSelect(event) {
   208|  const file = event.target.files[0];
   209|  if (!file) return;
   210|
   211|  // Validate file size (max 2MB)
   212|  if (file.size > 2 * 1024 * 1024) {
   213|    setUploadStatus('Image too large. Max 2MB.', 'error');
   214|    return;
   215|  }
   216|
   217|  // Show local preview immediately
   218|  const reader = new FileReader();
   219|  reader.onload = function(e) {
   220|    showImagePreview(e.target.result);
   221|    setUploadStatus('Uploading to GitHub...', 'uploading');
   222|    
   223|    // Upload to GitHub API
   224|    uploadImageToGithub(file);
   225|  };
   226|  reader.readAsDataURL(file);
   227|}
   228|
   229|function uploadImageToGithub(file) {
   230|  const config = getGithubConfig();
   231|  if (!config.token) {
   232|    setUploadStatus('⚠️ Set GitHub Token in Settings first', 'error');
   233|    return;
   234|  }
   235|
   236|  // Generate unique filename: timestamp_originalname
   237|  const timestamp = Date.now();
   238|  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
   239|  const filename = timestamp + '_' + safeName;
   240|  const path = 'assets/' + filename;
   241|
   242|  // Read file as base64
   243|  const reader = new FileReader();
   244|  reader.onload = function(e) {
   245|    const base64Content = e.target.result.split(',')[1]; // Remove data: prefix
   246|
   247|    const body = {
   248|      message: 'Upload product image: ' + filename,
   249|      content: base64Content,
   250|      branch: config.branch
   251|    };
   252|
   253|    const url = `https://api.github.com/repos/${config.repo}/contents/${path}`;
   254|
   255|    fetch(url, {
   256|      method: 'PUT',
   257|      headers: {
   258|        'Authorization': 'token ' + config.token,
   259|        'Accept': 'application/vnd.github.v3+json',
   260|        'Content-Type': 'application/json'
   261|      },
   262|      body: JSON.stringify(body)
   263|    })
   264|    .then(res => {
   265|      if (!res.ok) return res.json().then(err => { throw new Error(err.message); });
   266|      return res.json();
   267|    })
   268|    .then(data => {
   269|      // Get raw URL from GitHub
   270|      const rawUrl = `https://raw.githubusercontent.com/${config.repo}/${config.branch}/${path}`;
   271|      document.getElementById('prodImage').value = rawUrl;
   272|      setUploadStatus('✅ Image uploaded to GitHub!', 'success');
   273|    })
   274|    .catch(err => {
   275|      console.error('Upload failed:', err);
   276|      setUploadStatus('❌ Upload failed: ' + err.message + '. Check Settings > GitHub Token.', 'error');
   277|    });
   278|  };
   279|  reader.readAsDataURL(file);
   280|}
   281|
   282|function showImagePreview(src) {
   283|  document.getElementById('uploadPlaceholder').style.display = 'none';
   284|  const preview = document.getElementById('imagePreview');
   285|  preview.style.display = 'block';
   286|  document.getElementById('previewImg').src = src;
   287|}
   288|
   289|function removeUploadedImage() {
   290|  document.getElementById('imagePreview').style.display = 'none';
   291|  document.getElementById('uploadPlaceholder').style.display = 'flex';
   292|  document.getElementById('prodImage').value = '';
   293|  document.getElementById('prodImageInput').value = '';
   294|  document.getElementById('uploadStatus').textContent = '';
   295|}
   296|
   297|function setUploadStatus(msg, type) {
   298|  const el = document.getElementById('uploadStatus');
   299|  if (!el) return;
   300|  el.textContent = msg;
   301|  el.className = 'upload-status' + (type ? ' ' + type : '');
   302|}
   303|
   304|// ===== PRODUCTS =====
   305|function renderProductsTable() {
   306|  const tbody = document.getElementById('productsTable');
   307|  if (products.length === 0) {
   308|    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--gray-400);padding:20px;">No products. Add your first product!</td></tr>';
   309|    return;
   310|  }
   311|
   312|  tbody.innerHTML = products.map(p => `
   313|    <tr>
   314|      <td>${p.id}</td>
   315|      <td><strong>${p.name}</strong></td>
   316|      <td>$${p.price.toFixed(2)}</td>
   317|      <td>${p.category || '—'}</td>
   318|      <td>${p.stock || 0}</td>
   319|      <td>
   320|        <div class="table-actions">
   321|          <button class="btn-sm btn-edit" onclick="editProduct(${p.id})">✏️ Edit</button>
   322|          <button class="btn-sm btn-delete" onclick="deleteProduct(${p.id})">🗑️ Delete</button>
   323|        </div>
   324|      </td>
   325|    </tr>
   326|  `).join('');
   327|}
   328|
   329|function saveProduct() {
   330|  const id = document.getElementById('productFormId').value;
   331|  const name = document.getElementById('prodName').value.trim();
   332|  const price = parseFloat(document.getElementById('prodPrice').value);
   333|  const desc = document.getElementById('prodDesc').value.trim();
   334|  const imagesField = document.getElementById('prodImages').value.trim();
  const images = imagesField ? JSON.parse(imagesField) : [];
  const pImagesPending = pendingUploads.filter(function(p) { return p.url; }).map(function(p) { return p.url; });
  const allImages = images.concat(pImagesPending.filter(function(u) { return images.indexOf(u) === -1; }));
   335|  const category = document.getElementById('prodCategory').value.trim();
   336|  const sizesStr = document.getElementById('prodSizes').value.trim();
   337|  const stock = parseInt(document.getElementById('prodStock').value) || 0;
   338|
   339|  if (!name || !price || !desc || allImages.length === 0) {
   340|    showAlert('Please fill in all required fields and upload at least one image');
   341|    return;
   342|  }
   343|
   344|  const sizes = sizesStr.split(',').map(s => s.trim()).filter(s => s);
   345|  const sizesDefault = sizes.length > 0 ? sizes : ['S (6.5")', 'M (7")', 'L (7.5")'];
   346|
   347|  if (id) {
   348|    // Edit existing
   349|    const idx = products.findIndex(p => p.id == id);
   350|    if (idx !== -1) {
   351|      products[idx] = { ...products[idx], name, price, description: desc, images: allImages, category, sizes: sizesDefault, stock };
   352|    }
   353|  } else {
   354|    // Add new
   355|    const newId = Math.max(...products.map(p => p.id), 0) + 1;
   356|    products.push({
   357|      id: newId,
   358|      name,
   359|      price,
   360|      description: desc,
   361|      images: allImages,
   362|      category,
   363|      sizes: sizesDefault,
   364|      stock
   365|    });
   366|  }
   367|
   368|  localStorage.setItem('crystalMuseProducts', JSON.stringify(products));
   369|  renderProductsTable();
   370|  resetProductForm();
   371|  showAlert('Product saved!', 'success');
   372|}
   373|
   374|function editProduct(id) {
   375|  const product = products.find(p => p.id === id);
   376|  if (!product) return;
   377|
   378|  document.getElementById('productFormTitle').textContent = 'Edit Product';
   379|  document.getElementById('productFormId').value = product.id;
   380|  document.getElementById('prodName').value = product.name;
   381|  document.getElementById('prodPrice').value = product.price;
   382|  document.getElementById('prodDesc').value = product.description;
   383|  document.getElementById('prodImage').value = product.image; // Keep hidden field
   384|  // If product has an image URL, show it as preview
   385|  if (product.image) {
   386|    showImagePreview(product.image);
   387|  } else {
   388|    removeUploadedImage();
   389|  }
   390|  document.getElementById('prodCategory').value = product.category || '';
   391|  document.getElementById('prodSizes').value = (product.sizes || []).join(', ');
   392|  document.getElementById('prodStock').value = product.stock || 0;
   393|
   394|  document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
   395|}
   396|
   397|function deleteProduct(id) {
   398|  if (!confirm('Delete this product?')) return;
   399|  products = products.filter(p => p.id !== id);
   400|  localStorage.setItem('crystalMuseProducts', JSON.stringify(products));
   401|  renderProductsTable();
   402|  showAlert('Product deleted', 'success');
   403|}
   404|
   405|function resetProductForm() {
   406|  document.getElementById('productFormTitle').textContent = 'Add New Product';
   407|  document.getElementById('productFormId').value = '';
   408|  document.getElementById('prodName').value = '';
   409|  document.getElementById('prodPrice').value = '';
   410|  document.getElementById('prodDesc').value = '';
   411|  document.getElementById('prodImage').value = '';
   412|  removeUploadedImage();
   413|  document.getElementById('prodCategory').value = '';
   414|  document.getElementById('prodSizes').value = 'S (6.5"), M (7"), L (7.5")';
   415|  document.getElementById('prodStock').value = '20';
   416|}
   417|
   418|// ===== ORDERS =====
   419|function renderOrdersTable() {
   420|  const tbody = document.getElementById('ordersTable');
   421|  if (orders.length === 0) {
   422|    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--gray-400);padding:20px;">No orders yet</td></tr>';
   423|    return;
   424|  }
   425|
   426|  tbody.innerHTML = orders.map((o, i) => `
   427|    <tr>
   428|      <td>#${o.id}</td>
   429|      <td>${(o.firstName || '') + ' ' + (o.lastName || '')}</td>
   430|      <td>${o.email || '—'}</td>
   431|      <td>${(o.items || []).length} items</td>
   432|      <td>$${(o.total || 0).toFixed(2)}</td>
   433|      <td>
   434|        <select class="status-select" onchange="updateOrderStatus(${i}, this.value)">
   435|          <option value="pending" ${(o.status||'pending') === 'pending' ? 'selected' : ''}>Pending</option>
   436|          <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Shipped</option>
   437|          <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Delivered</option>
   438|          <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
   439|        </select>
   440|      </td>
   441|      <td>${formatDate(o.date)}</td>
   442|    </tr>
   443|  `).join('');
   444|}
   445|
   446|function updateOrderStatus(index, status) {
   447|  if (orders[index]) {
   448|    orders[index].status = status;
   449|    localStorage.setItem('crystalMuseOrders', JSON.stringify(orders));
   450|    if (currentTab === 'dashboard') renderDashboard();
   451|    showAlert('Order status updated to: ' + status, 'success');
   452|  }
   453|}
   454|
   455|// ===== CUSTOMERS =====
   456|function renderCustomersTable() {
   457|  const tbody = document.getElementById('customersTable');
   458|  if (customers.length === 0) {
   459|    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--gray-400);padding:20px;">No customers yet</td></tr>';
   460|    return;
   461|  }
   462|
   463|  tbody.innerHTML = customers.map(c => `
   464|    <tr>
   465|      <td><strong>${c.name || 'Unknown'}</strong></td>
   466|      <td>${c.email || '—'}</td>
   467|      <td>${c.orderCount || 0}</td>
   468|      <td>$${(c.totalSpent || 0).toFixed(2)}</td>
   469|      <td>${formatDate(c.lastOrder)}</td>
   470|    </tr>
   471|  `).join('');
   472|}
   473|
   474|// ===== SETTINGS =====
   475|function loadSettingsForm() {
   476|  document.getElementById('setStoreName').value = settings.storeName || 'Crystal Muse';
   477|  document.getElementById('setPaypalEmail').value = settings.paypalEmail || 'jingm1658@gmail.com';
   478|  document.getElementById('setCurrency').value = settings.currency || 'USD';
   479|  document.getElementById('setGithubToken').value = settings.githubToken || '';
   480|  document.getElementById('setGithubRepo').value = settings.githubRepo || '';
   481|  document.getElementById('setGithubBranch').value = settings.githubBranch || 'main';
   482|}
   483|
   484|function saveSettings() {
   485|  settings.storeName = document.getElementById('setStoreName').value.trim();
   486|  settings.paypalEmail = document.getElementById('setPaypalEmail').value.trim();
   487|  settings.currency = document.getElementById('setCurrency').value;
   488|
   489|  if (!settings.storeName || !settings.paypalEmail) {
   490|    showAlert('Store name and PayPal email are required');
   491|    return;
   492|  }
   493|
   494|  localStorage.setItem('crystalMuseSettings', JSON.stringify(settings));
   495|  showSettingsSuccess('Store settings saved!');
   496|}
   497|
   498|function changePassword() {
   499|  const current = document.getElementById('currentPassword').value;
   500|  const newPass = document.getElementById('newPassword').value;
   501|