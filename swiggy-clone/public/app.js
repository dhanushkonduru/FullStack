// Modern Swiggy Clone App
class SwiggyApp {
  constructor() {
    this.apiBase = '';
    this.authToken = localStorage.getItem('token') || '';
    this.currentUser = null;
    this.currentRestaurantId = null;
    this.cart = { items: [], total: 0 };
    
    this.init();
  }

  async init() {
    this.setupEventListeners();
    this.renderAuth();
    await this.loadCartCount();
    await this.route();
  }

  // Auth Management
  setAuth(token, user) {
    this.authToken = token || '';
    this.currentUser = user || null;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    this.renderAuth();
  }

  renderAuth() {
    const authSection = document.getElementById('auth-section');
    const userSection = document.getElementById('user-section');
    
    if (this.authToken) {
      authSection.classList.add('hidden');
      userSection.classList.remove('hidden');
      document.getElementById('user-name').textContent = this.currentUser?.name || 'User';
      document.getElementById('user-initial').textContent = (this.currentUser?.name || 'U')[0].toUpperCase();
    } else {
      authSection.classList.remove('hidden');
      userSection.classList.add('hidden');
    }
  }

  // API Helpers
  headers(json = true) {
    const h = {};
    if (json) h['Content-Type'] = 'application/json';
    if (this.authToken) h['Authorization'] = `Bearer ${this.authToken}`;
    return h;
  }

  async fetchJSON(path, options = {}) {
    try {
      this.showSpinner();
      const res = await fetch(this.apiBase + path, options);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || 'Request failed');
      return data;
    } finally {
      this.hideSpinner();
    }
  }

  // UI Helpers
  showSpinner() {
    document.getElementById('spinner').classList.remove('hidden');
  }

  hideSpinner() {
    document.getElementById('spinner').classList.add('hidden');
  }

  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  show(id) {
    document.getElementById(id).classList.remove('hidden');
  }

  hide(id) {
    document.getElementById(id).classList.add('hidden');
  }

  // Navigation
  navigateTo(hash) {
    if (location.hash !== hash) {
      location.hash = hash;
    } else {
      this.route();
    }
  }

  async route() {
    const hash = location.hash || '#home';
    
    // Hide all sections
    document.querySelectorAll('.section, #hero, #auth').forEach(el => {
      el.classList.add('hidden');
    });

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    if (hash.startsWith('#menu/')) {
      const id = hash.split('/')[1];
      await this.loadMenu(id);
      document.getElementById('nav-home').classList.add('active');
    } else if (hash === '#cart') {
      if (!this.authToken) {
        this.showAuth();
        return;
      }
      await this.showCart();
      document.getElementById('nav-cart').classList.add('active');
    } else if (hash === '#auth') {
      this.showAuth();
    } else {
      await this.loadRestaurants();
      document.getElementById('nav-home').classList.add('active');
    }
  }

  // Restaurant Management
  async loadRestaurants() {
    this.hide('menu');
    this.hide('cart');
    this.hide('auth');
    this.show('restaurants');
    this.show('hero');

    const grid = document.getElementById('restaurants-grid');
    grid.innerHTML = '';

    // Add skeleton loaders
    for (let i = 0; i < 6; i++) {
      const skeleton = document.createElement('div');
      skeleton.className = 'restaurant-card skeleton';
      skeleton.innerHTML = `
        <div class="card-image skeleton"></div>
        <div class="card-content">
          <div class="skeleton" style="height: 20px; margin-bottom: 10px;"></div>
          <div class="skeleton" style="height: 16px; width: 60%;"></div>
        </div>
      `;
      grid.appendChild(skeleton);
    }

    try {
      const restaurants = await this.fetchJSON('/api/restaurants');
      
      // Clear skeletons
      grid.innerHTML = '';
      
      if (restaurants.length === 0) {
        grid.innerHTML = `
          <div class="empty-state">
            <h3>No restaurants found</h3>
            <p>Check back later for new restaurants!</p>
          </div>
        `;
        return;
      }

      restaurants.forEach(restaurant => {
        const card = this.createRestaurantCard(restaurant);
        grid.appendChild(card);
      });
    } catch (error) {
      grid.innerHTML = `
        <div class="error-state">
          <h3>Failed to load restaurants</h3>
          <p>${error.message}</p>
          <button onclick="app.loadRestaurants()" class="btn-primary">Try Again</button>
        </div>
      `;
    }
  }

  createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    card.innerHTML = `
      <div class="card-image">
        <span>🍽️</span>
      </div>
      <div class="card-content">
        <h3 class="card-title">${restaurant.name}</h3>
        <div class="card-meta">
          <span>📍 ${restaurant.location || 'Location not specified'}</span>
          <div class="rating">
            <span class="stars">⭐⭐⭐⭐⭐</span>
            <span>${restaurant.rating || 0}</span>
          </div>
        </div>
        <div class="card-actions">
          <button class="btn-card btn-card-primary" data-id="${restaurant._id}">
            View Menu
          </button>
        </div>
      </div>
    `;

    card.querySelector('button').addEventListener('click', () => {
      this.navigateTo(`#menu/${restaurant._id}`);
    });

    return card;
  }

  // Menu Management
  async loadMenu(restaurantId) {
    this.hide('restaurants');
    this.hide('cart');
    this.hide('auth');
    this.hide('hero');
    this.show('menu');

    this.currentRestaurantId = restaurantId;
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '';

    // Add skeleton loaders
    for (let i = 0; i < 6; i++) {
      const skeleton = document.createElement('div');
      skeleton.className = 'menu-card skeleton';
      skeleton.innerHTML = `
        <div class="card-image skeleton"></div>
        <div class="card-content">
          <div class="skeleton" style="height: 20px; margin-bottom: 10px;"></div>
          <div class="skeleton" style="height: 16px; width: 40%;"></div>
        </div>
      `;
      grid.appendChild(skeleton);
    }

    try {
      const items = await this.fetchJSON(`/api/menu/${restaurantId}`);
      
      // Clear skeletons
      grid.innerHTML = '';
      
      if (items.length === 0) {
        grid.innerHTML = `
          <div class="empty-state">
            <h3>No menu items available</h3>
            <p>This restaurant hasn't added any items yet.</p>
          </div>
        `;
        return;
      }

      items.forEach(item => {
        const card = this.createMenuItemCard(item);
        grid.appendChild(card);
      });
    } catch (error) {
      grid.innerHTML = `
        <div class="error-state">
          <h3>Failed to load menu</h3>
          <p>${error.message}</p>
          <button onclick="app.loadMenu('${restaurantId}')" class="btn-primary">Try Again</button>
        </div>
      `;
    }
  }

  createMenuItemCard(item) {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.innerHTML = `
      <div class="card-image">
        <span>🍕</span>
      </div>
      <div class="card-content">
        <h3 class="card-title">${item.name}</h3>
        <div class="card-meta">
          <span class="item-price">₹${item.price}</span>
          ${item.description ? `<p>${item.description}</p>` : ''}
        </div>
        <div class="card-actions">
          <button class="btn-card btn-card-primary" data-id="${item._id}">
            Add to Cart
          </button>
        </div>
      </div>
    `;

    card.querySelector('button').addEventListener('click', () => {
      this.addToCart(item._id);
    });

    return card;
  }

  // Cart Management
  async addToCart(itemId) {
    if (!this.authToken) {
      this.showToast('Please login to add items to cart', 'error');
      this.navigateTo('#auth');
      return;
    }

    try {
      await this.fetchJSON('/api/cart/add', {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({ itemId, quantity: 1 })
      });
      
      this.showToast('Added to cart!', 'success');
      await this.loadCartCount();
    } catch (error) {
      this.showToast(error.message, 'error');
    }
  }

  async loadCartCount() {
    if (!this.authToken) {
      document.getElementById('cart-count').textContent = '0';
      return;
    }

    try {
      const cart = await this.fetchJSON('/api/cart', { headers: this.headers(false) });
      const count = cart.items?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;
      document.getElementById('cart-count').textContent = count.toString();
    } catch (error) {
      document.getElementById('cart-count').textContent = '0';
    }
  }

  async showCart() {
    this.hide('restaurants');
    this.hide('menu');
    this.hide('auth');
    this.hide('hero');
    this.show('cart');

    const container = document.getElementById('cart-items');
    container.innerHTML = '';

    try {
      const cart = await this.fetchJSON('/api/cart', { headers: this.headers(false) });
      
      if (!cart.items || cart.items.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <h3>Your cart is empty</h3>
            <p>Add some delicious items to get started!</p>
            <button onclick="app.navigateTo('#home')" class="btn-primary">Browse Restaurants</button>
          </div>
        `;
        document.getElementById('cart-total').textContent = '0';
        return;
      }

      cart.items.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <div class="item-info">
            <div class="item-details">
              <h4>${item.menuItemId?.name || 'Item'}</h4>
              <span class="item-price">₹${item.menuItemId?.price || 0}</span>
            </div>
          </div>
          <div class="quantity-controls">
            <button class="qty-btn" onclick="app.updateQuantity('${item._id}', -1)">-</button>
            <span>${item.quantity || 1}</span>
            <button class="qty-btn" onclick="app.updateQuantity('${item._id}', 1)">+</button>
          </div>
          <button class="remove-btn" onclick="app.removeFromCart('${item._id}')">
            Remove
          </button>
        `;
        container.appendChild(cartItem);
      });

      document.getElementById('cart-total').textContent = cart.total || 0;
    } catch (error) {
      container.innerHTML = `
        <div class="error-state">
          <h3>Failed to load cart</h3>
          <p>${error.message}</p>
        </div>
      `;
    }
  }

  async updateQuantity(itemId, change) {
    // This would need backend support for quantity updates
    this.showToast('Quantity update not implemented yet', 'warning');
  }

  async removeFromCart(itemId) {
    try {
      await this.fetchJSON(`/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: this.headers(false)
      });
      
      this.showToast('Item removed from cart', 'success');
      await this.showCart();
      await this.loadCartCount();
    } catch (error) {
      this.showToast(error.message, 'error');
    }
  }

  async placeOrder() {
    try {
      const order = await this.fetchJSON('/api/orders/place', {
        method: 'POST',
        headers: this.headers(false)
      });
      
      this.showToast('Order placed successfully!', 'success');
      document.getElementById('order-status').innerHTML = `
        <div class="success-message">
          <h3>Order Confirmed!</h3>
          <p>Order ID: ${order._id || 'Success'}</p>
          <p>We'll notify you when your order is ready.</p>
        </div>
      `;
      
      await this.loadCartCount();
    } catch (error) {
      this.showToast(error.message, 'error');
    }
  }

  // Auth Management
  showAuth() {
    this.hide('restaurants');
    this.hide('menu');
    this.hide('cart');
    this.hide('hero');
    this.show('auth');
  }

  async handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
      this.showToast('Please fill in all fields', 'error');
      return;
    }

    try {
      const data = await this.fetchJSON('/api/auth/login', {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({ email, password })
      });

      this.setAuth(data.token, { name: data.name, email: data.email });
      this.showToast('Welcome back!', 'success');
      await this.loadCartCount();
      this.navigateTo('#home');
    } catch (error) {
      document.getElementById('login-error').textContent = error.message;
      this.showToast(error.message, 'error');
    }
  }

  async handleRegister() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    if (!name || !email || !password) {
      this.showToast('Please fill in all fields', 'error');
      return;
    }

    try {
      const data = await this.fetchJSON('/api/auth/register', {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({ name, email, password })
      });

      this.setAuth(data.token, { name: data.name, email: data.email });
      this.showToast('Account created successfully!', 'success');
      await this.loadCartCount();
      this.navigateTo('#home');
    } catch (error) {
      document.getElementById('reg-error').textContent = error.message;
      this.showToast(error.message, 'error');
    }
  }

  logout() {
    this.setAuth('', null);
    this.showToast('Logged out successfully', 'success');
    this.navigateTo('#home');
  }

  // Event Listeners
  setupEventListeners() {
    // Navigation
    document.getElementById('nav-home').addEventListener('click', () => this.navigateTo('#home'));
    document.getElementById('nav-cart').addEventListener('click', () => this.navigateTo('#cart'));
    document.getElementById('back-to-restaurants').addEventListener('click', () => this.navigateTo('#home'));

    // Auth
    document.getElementById('btn-login').addEventListener('click', () => this.navigateTo('#auth'));
    document.getElementById('btn-register').addEventListener('click', () => this.navigateTo('#auth'));
    document.getElementById('login-submit').addEventListener('click', () => this.handleLogin());
    document.getElementById('reg-submit').addEventListener('click', () => this.handleRegister());
    document.getElementById('btn-logout').addEventListener('click', () => this.logout());

    // Hero buttons
    document.getElementById('hero-order-btn').addEventListener('click', () => this.navigateTo('#cart'));
    document.getElementById('hero-browse-btn').addEventListener('click', () => this.navigateTo('#home'));

    // Cart
    document.getElementById('btn-place-order').addEventListener('click', () => this.placeOrder());

    // Auth tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        
        // Update tab buttons
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        
        // Show/hide forms
        document.querySelectorAll('.auth-form').forEach(form => form.classList.add('hidden'));
        document.getElementById(`${tabName}-form`).classList.remove('hidden');
      });
    });

    // Hash routing
    window.addEventListener('hashchange', () => this.route());
  }
}

// Initialize app
const app = new SwiggyApp();