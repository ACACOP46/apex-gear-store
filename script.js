/* ===== APEX GEAR — SCRIPT v3.0 ===== */
/* Shopping Cart, Countdown, Notifications, Animations */

document.addEventListener('DOMContentLoaded', () => {

  // ===================== NAVBAR =====================
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.querySelector('.nav-links');

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 50);
    // hide announcement bar on scroll
    if (y > 200) navbar.classList.add('hide-bar');
    else navbar.classList.remove('hide-bar');
    lastScroll = y;
  });

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // ===================== COUNTDOWN TIMER =====================
  function updateCountdown() {
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const diff = end - now;
    if (diff <= 0) return;

    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    const str = `${h}:${m}:${s}`;

    document.querySelectorAll('.countdown-inline, #countdown-timer').forEach(el => {
      el.textContent = str;
    });
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ===================== COUNTER ANIMATION =====================
  const counters = document.querySelectorAll('.stat-num');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const isFloat = String(target).includes('.');
        const dur = 2000;
        const start = performance.now();

        const animate = (now) => {
          const prog = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - prog, 3);
          const val = ease * target;
          el.textContent = isFloat ? val.toFixed(1) : Math.floor(val).toLocaleString();
          if (prog < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObs.observe(c));

  // ===================== SCROLL REVEAL =====================
  const revealEls = document.querySelectorAll('.product-card, .feature-card, .review-card, .about-grid, .newsletter-box, .trust-bar, .social-proof');
  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  // ===================== SHOPPING CART =====================
  const PRODUCTS = {
    'infraheat-pro': { name: 'InfraHeat Pro Sauna Blanket', price: 199.99, img: 'https://sc02.alicdn.com/kf/A346a28b642e842ebb2ce6dc36ea4cccaS.png', url: 'product-sauna-blanket.html' },
    'vision-x': { name: 'Vision X Smart Glasses', price: 149.99, img: 'https://sc02.alicdn.com/kf/Ac6aec6fd36ea410fabf33a761a47ac67T.png', url: 'product-smart-glasses.html' },
    'cinebeam': { name: 'CineBeam Portable Projector', price: 129.99, img: 'https://sc02.alicdn.com/kf/A1f3ac4dff9bf43198fb6e588610bf547G.png', url: 'product-projector.html' },
    'snapcut-pro': { name: 'SnapCut Pro Precision Cutter', price: 79.95, img: 'https://sc02.alicdn.com/kf/Af15490ca72ab482daaf126c504c5fa73o.png', url: 'product-cutter.html' },
    'sweetbrush': { name: 'SweetBrush Dessert Toothpaste Set', price: 24.99, img: 'https://sc02.alicdn.com/kf/A81e60639baf1490dbfc496d08d420799t.png', url: 'product-toothpaste.html' },
    'mushglow': { name: 'MushGlow Smart Mushroom Lamp', price: 89.99, img: 'https://sc02.alicdn.com/kf/Ae21afece463e46499feec997153d4d39H.png', url: 'product-mushroom-lamp.html' },
    'pureclump': { name: 'PureClump Tofu Cat Litter', price: 14.99, img: 'https://sc02.alicdn.com/kf/Aae4abbcf589f4464ab577842c099f3c1U.png', url: 'product-cat-litter.html' },
    'pawperfect': { name: 'PawPerfect Smart Grooming Kit', price: 49.99, img: 'https://sc02.alicdn.com/kf/A7458fb5f5edd4fec87a37211edcfd31fl.png', url: 'product-pet-grooming.html' },
    'warmbuddy': { name: 'WarmBuddy USB Bottle Warmer', price: 39.99, img: 'https://sc02.alicdn.com/kf/A62132a71d2814be8b32c940a58f34749P.png', url: 'product-bottle-warmer.html' }
  };

  let cart = JSON.parse(localStorage.getItem('apexCart') || '[]');

  const cartBtn = document.getElementById('cartBtn');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartItemCount = document.getElementById('cartItemCount');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartFooter = document.getElementById('cartFooter');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const continueShopping = document.getElementById('continueShopping');

  function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (continueShopping) continueShopping.addEventListener('click', (e) => { e.preventDefault(); closeCart(); });

  function saveCart() {
    localStorage.setItem('apexCart', JSON.stringify(cart));
  }

  function renderCart() {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

    if (cartCount) cartCount.textContent = count;
    if (cartItemCount) cartItemCount.textContent = count;
    if (cartSubtotal) cartSubtotal.textContent = '$' + subtotal.toFixed(2);

    if (cart.length === 0) {
      if (cartItems) cartItems.innerHTML = '<div class="cart-empty"><p>Your cart is empty</p><a href="#products" class="btn btn-primary" onclick="document.getElementById(\'cartSidebar\').classList.remove(\'open\');document.getElementById(\'cartOverlay\').classList.remove(\'open\');document.body.style.overflow=\'\';">Continue Shopping</a></div>';
      if (cartFooter) cartFooter.style.display = 'none';
    } else {
      if (cartFooter) cartFooter.style.display = 'block';
      if (cartItems) {
        cartItems.innerHTML = cart.map((item, idx) => `
          <div class="cart-item">
            <div class="cart-item-img"><img src="${item.img}" alt="${item.name}"></div>
            <div class="cart-item-info">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-price">$${item.price.toFixed(2)}</div>
              <div class="cart-item-qty">
                <button onclick="updateQty(${idx},-1)">−</button>
                <span>${item.qty}</span>
                <button onclick="updateQty(${idx},1)">+</button>
              </div>
            </div>
            <button class="cart-item-remove" onclick="removeItem(${idx})">✕</button>
          </div>
        `).join('');
      }
    }
  }

  window.addToCart = function(productId) {
    const product = PRODUCTS[productId];
    if (!product) return;

    const existing = cart.find(i => i.id === productId);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ id: productId, name: product.name, price: product.price, img: product.img, qty: 1 });
    }
    saveCart();
    renderCart();
    openCart();

    // Animate cart button
    if (cartBtn) {
      cartBtn.style.transform = 'scale(1.3)';
      setTimeout(() => cartBtn.style.transform = '', 300);
    }
  };

  window.updateQty = function(idx, delta) {
    if (cart[idx]) {
      cart[idx].qty += delta;
      if (cart[idx].qty <= 0) cart.splice(idx, 1);
      saveCart();
      renderCart();
    }
  };

  window.removeItem = function(idx) {
    cart.splice(idx, 1);
    saveCart();
    renderCart();
  };

  // Checkout
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      alert('🛒 Checkout coming soon!\n\nStripe integration is in progress.\nTotal: $' + cart.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2));
    });
  }

  renderCart();

  // ===================== LIVE PURCHASE NOTIFICATIONS =====================
  const notifEl = document.getElementById('liveNotification');
  const notifNames = ['Sarah L.', 'Mike D.', 'Anna K.', 'James T.', 'Lisa M.', 'Chris R.', 'Emily S.', 'Ryan P.', 'Sophie W.', 'Tom B.', 'Maria G.', 'Kevin H.', 'Rachel F.', 'Daniel C.'];
  const notifLocations = ['New York', 'Los Angeles', 'London', 'Toronto', 'Sydney', 'Berlin', 'Tokyo', 'Paris', 'Dubai', 'Singapore', 'Miami', 'Chicago', 'Seattle', 'Austin'];
  const notifProducts = Object.values(PRODUCTS).map(p => p.name);
  const notifTimes = ['just now', '1 min ago', '2 min ago', '3 min ago', '5 min ago'];

  function showNotification() {
    if (!notifEl) return;
    const nameEl = document.getElementById('notifName');
    const locEl = document.getElementById('notifLocation');
    const prodEl = document.getElementById('notifProduct');
    const timeEl = document.getElementById('notifTime');

    nameEl.textContent = notifNames[Math.floor(Math.random() * notifNames.length)];
    locEl.textContent = notifLocations[Math.floor(Math.random() * notifLocations.length)];
    prodEl.textContent = notifProducts[Math.floor(Math.random() * notifProducts.length)];
    timeEl.textContent = notifTimes[Math.floor(Math.random() * notifTimes.length)];

    notifEl.classList.add('show');
    setTimeout(() => notifEl.classList.remove('show'), 5000);
  }

  // Show first notification after 8 seconds, then every 15-30 seconds
  setTimeout(() => {
    showNotification();
    setInterval(() => showNotification(), 15000 + Math.random() * 15000);
  }, 8000);

  // ===================== PRODUCT PAGE ADD TO CART =====================
  // For product detail pages — attach event to any .btn-add-cart-action
  document.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = btn.dataset.addCart;
      addToCart(productId);
    });
  });

});
