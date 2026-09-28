const API_BASE = 'http://localhost:5000/api';

// ─── State ───
let restaurantData = null;
let cart = []; // { name, price, quantity }

// ─── DOM Elements ───
const bannerImage = document.getElementById('banner-image');
const detailTitle = document.getElementById('detail-title');
const detailMeta = document.getElementById('detail-meta');
const infoBar = document.getElementById('detail-info-bar');
const menuContent = document.getElementById('menu-content');
const floatingCartBtn = document.getElementById('floating-cart-btn');
const cartBadgeCount = document.getElementById('cart-badge-count');
const cartOverlay = document.getElementById('cart-overlay');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsList = document.getElementById('cart-items-list');
const cartTotalAmount = document.getElementById('cart-total-amount');
const checkoutModal = document.getElementById('checkout-modal');
const successModal = document.getElementById('success-modal');

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    detailTitle.textContent = 'Restaurant not found';
    return;
  }

  fetchRestaurant(id);
});

// ─── Fetch Single Restaurant ───
async function fetchRestaurant(id) {
  try {
    const res = await fetch(`${API_BASE}/restaurants/${id}`);
    if (!res.ok) throw new Error('Not found');
    restaurantData = await res.json();
    renderDetail(restaurantData);
  } catch (err) {
    console.error('Failed to fetch restaurant:', err);
    detailTitle.textContent = 'Restaurant not found';
    menuContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">😕</div>
        <h3>Could not load this restaurant</h3>
        <p>Please go back and try again.</p>
      </div>`;
  }
}

// ─── Render Detail Page ───
function renderDetail(r) {
  document.title = `${r.name} — Foodie`;
  bannerImage.src = r.image;
  bannerImage.alt = r.name;
  detailTitle.textContent = r.name;

  detailMeta.innerHTML = `
    <div class="detail-rating-badge">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
      ${r.rating.toFixed(1)}
    </div>
    <span class="detail-meta-item">${r.cuisine.join(' • ')}</span>
    <span class="detail-meta-item badge ${r.isOpen ? 'badge-open' : 'badge-closed'}">
      ${r.isOpen ? '● Open Now' : '● Closed'}
    </span>
  `;

  infoBar.innerHTML = `
    <div class="info-chip">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <div>
        <div class="label">Delivery Time</div>
        <div class="value">${r.deliveryTime} minutes</div>
      </div>
    </div>
    <div class="info-chip">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
      <div>
        <div class="label">Cost for Two</div>
        <div class="value">₹${r.priceForTwo}</div>
      </div>
    </div>
    <div class="info-chip">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
      <div>
        <div class="label">Location</div>
        <div class="value">${r.location}</div>
      </div>
    </div>
  `;

  // Menu
  if (!r.menu || r.menu.length === 0) {
    menuContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>Menu not available</h3>
        <p>This restaurant hasn't added their menu yet.</p>
      </div>`;
    return;
  }

  menuContent.innerHTML = r.menu
    .map(
      (cat, ci) => `
      <div class="menu-category animate-in" style="animation-delay: ${ci * 0.1}s">
        <h3 class="menu-category-title">${cat.category} (${cat.items.length})</h3>
        <div class="menu-items">
          ${cat.items
            .map(
              (item) => `
              <div class="menu-item" id="menu-item-${slugify(item.name)}">
                ${
                  item.image
                    ? `<img class="menu-item-image" src="${item.image}" alt="${item.name}" loading="lazy" />`
                    : ''
                }
                <div class="menu-item-info">
                  <div class="menu-item-name">${item.name}</div>
                  <div class="menu-item-desc">${item.desc}</div>
                </div>
                <div class="menu-item-price">₹${item.price}</div>
                <div class="menu-item-action" id="action-${slugify(item.name)}">
                  <button class="add-to-cart-btn" onclick="addToCart('${escapeStr(item.name)}', ${item.price})">
                    + ADD
                  </button>
                </div>
              </div>`
            )
            .join('')}
        </div>
      </div>`
    )
    .join('');
}

// ═══════════════════════════════════════════
// CART LOGIC
// ═══════════════════════════════════════════

function addToCart(name, price) {
  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCartUI();
  updateMenuActions();
}

function removeFromCart(name) {
  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.quantity--;
    if (existing.quantity <= 0) {
      cart = cart.filter((item) => item.name !== name);
    }
  }
  updateCartUI();
  updateMenuActions();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// ─── Update floating button + badge ───
function updateCartUI() {
  const count = getCartCount();
  const total = getCartTotal();

  // Floating button
  cartBadgeCount.textContent = count;
  if (count > 0) {
    floatingCartBtn.classList.add('visible');
  } else {
    floatingCartBtn.classList.remove('visible');
  }

  // Cart total
  cartTotalAmount.textContent = `₹${total}`;

  // Render cart items list
  if (cart.length === 0) {
    cartItemsList.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">🛒</div>
        <p>Your cart is empty.<br/>Add items from the menu!</p>
      </div>`;
  } else {
    cartItemsList.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price-line">₹${item.price} × ${item.quantity}</div>
          </div>
          <div class="qty-controls">
            <button class="qty-btn" onclick="removeFromCart('${escapeStr(item.name)}')">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" onclick="addToCart('${escapeStr(item.name)}', ${item.price})">+</button>
          </div>
          <div class="cart-item-subtotal">₹${item.price * item.quantity}</div>
        </div>`
      )
      .join('');
  }
}

// ─── Update "ADD" buttons on menu to show qty controls ───
function updateMenuActions() {
  cart.forEach((item) => {
    const el = document.getElementById(`action-${slugify(item.name)}`);
    if (el) {
      el.innerHTML = `
        <div class="qty-controls">
          <button class="qty-btn" onclick="removeFromCart('${escapeStr(item.name)}')">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" onclick="addToCart('${escapeStr(item.name)}', ${item.price})">+</button>
        </div>`;
    }
  });

  // Reset removed items back to "ADD" button
  if (restaurantData && restaurantData.menu) {
    restaurantData.menu.forEach((cat) => {
      cat.items.forEach((item) => {
        const inCart = cart.find((c) => c.name === item.name);
        if (!inCart) {
          const el = document.getElementById(`action-${slugify(item.name)}`);
          if (el) {
            el.innerHTML = `
              <button class="add-to-cart-btn" onclick="addToCart('${escapeStr(item.name)}', ${item.price})">
                + ADD
              </button>`;
          }
        }
      });
    });
  }
}

// ═══════════════════════════════════════════
// CART SIDEBAR
// ═══════════════════════════════════════════

function openCart() {
  cartOverlay.classList.add('open');
  cartSidebar.classList.add('open');
  document.body.style.overflow = 'hidden';
  updateCartUI();
}

function closeCart() {
  cartOverlay.classList.remove('open');
  cartSidebar.classList.remove('open');
  document.body.style.overflow = '';
}

// ═══════════════════════════════════════════
// CHECKOUT
// ═══════════════════════════════════════════

function openCheckout() {
  if (cart.length === 0) return;
  closeCart();
  checkoutModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  checkoutModal.classList.remove('open');
  document.body.style.overflow = '';
}

async function placeOrder(e) {
  e.preventDefault();

  const customerName = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const address = document.getElementById('customer-address').value.trim();

  if (!customerName || !phone || !address) return;

  const placeBtn = document.getElementById('place-order-btn');
  placeBtn.disabled = true;
  placeBtn.textContent = 'Placing Order...';

  try {
    const orderPayload = {
      customerName,
      phone,
      address,
      restaurantId: restaurantData._id,
      restaurantName: restaurantData.name,
      items: cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });

    if (!res.ok) throw new Error('Order failed');

    const order = await res.json();

    // Show success
    closeCheckout();
    document.getElementById('order-id-display').textContent = `Order #${order._id.slice(-8).toUpperCase()}`;
    successModal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Clear cart
    cart = [];
    updateCartUI();
    updateMenuActions();
    floatingCartBtn.classList.remove('visible');
  } catch (err) {
    console.error('Order error:', err);
    alert('Failed to place order. Please try again.');
  } finally {
    placeBtn.disabled = false;
    placeBtn.textContent = 'Place Order';
  }
}

// ═══════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function escapeStr(str) {
  return str.replace(/'/g, "\\'");
}
