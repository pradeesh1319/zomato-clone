const API_BASE = 'http://localhost:5000/api';

// ─── State ───
let allRestaurants = [];
let activeFilter = 'all';
let searchTimeout = null;

// ─── DOM Elements ───
const grid = document.getElementById('restaurant-grid');
const countEl = document.getElementById('restaurant-count');
const searchInput = document.getElementById('search-input');
const filterPills = document.getElementById('filter-pills');

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
  showSkeletons();
  fetchRestaurants();
  setupSearch();
  setupFilters();
});

// ─── Show Loading Skeletons ───
function showSkeletons() {
  let html = '';
  for (let i = 0; i < 6; i++) {
    html += `
      <div class="skeleton-card">
        <div class="skeleton-image"></div>
        <div class="skeleton-body">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
          <div class="skeleton-line tiny"></div>
        </div>
      </div>`;
  }
  grid.innerHTML = html;
}

// ─── Fetch All Restaurants ───
async function fetchRestaurants(query = '') {
  try {
    const url = query
      ? `${API_BASE}/restaurants/search?q=${encodeURIComponent(query)}`
      : `${API_BASE}/restaurants`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();

    allRestaurants = data;
    applyFilterAndRender();
  } catch (err) {
    console.error('Failed to fetch restaurants:', err);
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <h3>Couldn't load restaurants</h3>
        <p>Make sure the backend server is running on port 5000 and MongoDB is connected.</p>
      </div>`;
    countEl.textContent = '';
  }
}

// ─── Apply Filter + Render ───
function applyFilterAndRender() {
  let filtered = allRestaurants;

  if (activeFilter !== 'all') {
    filtered = allRestaurants.filter((r) =>
      r.cuisine.some((c) => c.toLowerCase().includes(activeFilter))
    );
  }

  renderCards(filtered);
}

// ─── Render Restaurant Cards ───
function renderCards(restaurants) {
  if (!restaurants.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>No restaurants found</h3>
        <p>Try a different search term or clear your filters.</p>
      </div>`;
    countEl.textContent = '0 places';
    return;
  }

  countEl.textContent = `${restaurants.length} place${restaurants.length !== 1 ? 's' : ''}`;

  grid.innerHTML = restaurants
    .map(
      (r, i) => `
      <div class="restaurant-card animate-in" style="animation-delay: ${i * 0.07}s" onclick="goToDetail('${r._id}')">
        <div class="card-image-wrapper">
          <img src="${r.image}" alt="${r.name}" loading="lazy" />
          <div class="card-image-overlay"></div>
          <div class="card-badge">
            <span class="badge ${r.isOpen ? 'badge-open' : 'badge-closed'}">
              ${r.isOpen ? '● Open' : '● Closed'}
            </span>
          </div>
          <div class="card-delivery-time">
            🕐 ${r.deliveryTime} min
          </div>
        </div>
        <div class="card-body">
          <div class="card-title-row">
            <div class="card-title">${r.name}</div>
            <div class="card-rating">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              ${r.rating.toFixed(1)}
            </div>
          </div>
          <div class="card-cuisines">${r.cuisine.join(', ')}</div>
          <div class="card-footer">
            <div class="card-price">₹<span>${r.priceForTwo}</span> for two</div>
            <div class="card-location">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              ${r.location.split(',')[0]}
            </div>
          </div>
        </div>
      </div>`
    )
    .join('');
}

// ─── Search ───
function setupSearch() {
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();

    searchTimeout = setTimeout(() => {
      // Reset filter to 'all' when searching
      if (query) {
        setActiveFilter('all');
      }
      fetchRestaurants(query);
    }, 350);
  });
}

// ─── Cuisine Filters ───
function setupFilters() {
  filterPills.addEventListener('click', (e) => {
    const pill = e.target.closest('.filter-pill');
    if (!pill) return;

    const filter = pill.dataset.filter;
    setActiveFilter(filter);

    // Clear search when filtering
    searchInput.value = '';
    fetchRestaurants();
  });
}

function setActiveFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll('.filter-pill').forEach((p) => {
    p.classList.toggle('active', p.dataset.filter === filter);
  });
}

// ─── Navigate to Detail ───
function goToDetail(id) {
  window.location.href = `restaurant.html?id=${id}`;
}
