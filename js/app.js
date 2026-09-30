/* ============================================
   TAARAVI 🪷 — Main Application Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  renderCatalog(sareeData);
  initFilters();
  initSearch();
  initModal();
  initScrollAnimations();
  initSmoothScroll();
  initReelsCarousel();
});

/* ---------- SVG Icons ---------- */
const whatsappSVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

const eyeSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;

/* ---------- Navbar ---------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const overlay = document.querySelector('.nav-overlay');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (toggle) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      overlay.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ---------- Catalog Rendering ---------- */
function renderCatalog(sarees) {
  const grid = document.getElementById('saree-grid');
  const countEl = document.getElementById('catalog-count');

  if (countEl) {
    countEl.textContent = sarees.length === 1 ? 'Showing 1 saree' : `Showing ${sarees.length} sarees`;
  }

  if (!grid) return;

  if (sarees.length === 0) {
    grid.innerHTML = `
      <div class="no-results" style="grid-column: 1 / -1;">
        <div class="emoji">🧵</div>
        <h3>No matching sarees found</h3>
        <p>Try searching for a different fabric, color, or clearing your filters.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = sarees.map((saree, index) => `
    <article class="saree-card ${!saree.inStock ? 'out-of-stock' : ''}" style="transition-delay: ${index * 0.04}s;">
      <div class="saree-card-image" onclick="openQuickView('${saree.id}')">
        <img src="${saree.image}" alt="${saree.name}" loading="lazy">
        <div class="saree-tags">
          ${saree.tags.includes('bestseller') ? '<span class="saree-tag bestseller">Bestseller</span>' : ''}
          ${saree.tags.includes('new') ? '<span class="saree-tag new">New</span>' : ''}
          ${saree.tags.includes('wedding') ? '<span class="saree-tag wedding">Wedding</span>' : ''}
          ${saree.originalPrice ? '<span class="saree-tag sale">Sale</span>' : ''}
        </div>
        <div class="quick-view-overlay">
          <span>${eyeSVG} Quick View</span>
        </div>
      </div>
      <div class="saree-card-body">
        <div class="saree-card-rating">
          <span class="star">★ 4.9</span>
          <span class="rating-sep">|</span>
          <span class="rating-label">${saree.fabric}</span>
        </div>
        <h3 class="saree-card-name" onclick="openQuickView('${saree.id}')">${saree.name}</h3>
        <div class="saree-card-color">${saree.color}</div>
        <div class="saree-card-price">
          <span class="current">₹${saree.price.toLocaleString('en-IN')}</span>
          ${saree.originalPrice ? `<span class="original">₹${saree.originalPrice.toLocaleString('en-IN')}</span>` : ''}
        </div>
        <button class="saree-card-btn" onclick="event.stopPropagation(); orderOnWhatsApp('${saree.id}')" ${!saree.inStock ? 'disabled' : ''}>
          ${whatsappSVG}
          <span>${saree.inStock ? 'Order on WhatsApp' : 'Sold Out'}</span>
        </button>
      </div>
    </article>
  `).join('');

  requestAnimationFrame(() => {
    document.querySelectorAll('.saree-card').forEach((card, i) => {
      setTimeout(() => card.classList.add('visible'), i * 60);
    });
  });
}

/* ---------- Search ---------- */
function initSearch() {
  const searchInput = document.getElementById('saree-search');
  const clearBtn = document.getElementById('search-clear');

  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (clearBtn) {
      clearBtn.style.display = val ? 'block' : 'none';
    }
    applyFilters();
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.style.display = 'none';
      applyFilters();
      searchInput.focus();
    });
  }
}

/* ---------- Filters ---------- */
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-pill');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });
}

function applyFilters() {
  const activePill = document.querySelector('.filter-pill.active');
  const searchVal = (document.getElementById('saree-search')?.value || '').toLowerCase().trim();

  const filter = activePill ? activePill.dataset.filter : 'all';

  let filtered = [...sareeData];

  // Category & Tag Filter
  if (filter !== 'all') {
    filtered = filtered.filter(s => {
      if (filter === 'wedding') {
        return s.tags.includes('wedding') || s.tags.includes('festive');
      }
      return s.category === filter || s.tags.includes(filter);
    });
  }

  // Text Search Filter
  if (searchVal) {
    filtered = filtered.filter(s => 
      s.name.toLowerCase().includes(searchVal) ||
      s.fabric.toLowerCase().includes(searchVal) ||
      s.color.toLowerCase().includes(searchVal) ||
      s.description.toLowerCase().includes(searchVal) ||
      s.id.toLowerCase().includes(searchVal)
    );
  }

  renderCatalog(filtered);
}

/* ---------- Quick View Modal ---------- */
function initModal() {
  const modal = document.getElementById('saree-modal');
  const overlay = document.getElementById('saree-modal-overlay');
  const closeBtn = document.getElementById('saree-modal-close');

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (overlay) overlay.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

function openQuickView(sareeId) {
  const saree = sareeData.find(s => s.id === sareeId);
  if (!saree) return;

  const modal = document.getElementById('saree-modal');
  const body = document.getElementById('saree-modal-body');

  body.innerHTML = `
    <div class="modal-gallery">
      <img src="${saree.image}" alt="${saree.name}">
      <div class="modal-badge-row">
        <span class="modal-code">Code: ${saree.id}</span>
        ${saree.inStock ? '<span class="modal-stock in">Available</span>' : '<span class="modal-stock out">Sold Out</span>'}
      </div>
    </div>
    <div class="modal-details">
      <span class="modal-fabric">${saree.fabric}</span>
      <h2>${saree.name}</h2>
      <div class="modal-color"><strong>Color:</strong> ${saree.color}</div>
      <div class="modal-price">
        <span class="price-current">₹${saree.price.toLocaleString('en-IN')}</span>
        ${saree.originalPrice ? `<span class="price-original">₹${saree.originalPrice.toLocaleString('en-IN')}</span>` : ''}
      </div>
      <p class="modal-desc">${saree.description}</p>

      <div class="modal-specs">
        <div class="spec-item">
          <span class="spec-label">Craft Origin</span>
          <span class="spec-val">Authentic Handloom</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Ordering Method</span>
          <span class="spec-val">Direct WhatsApp Inquiry</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Shipping</span>
          <span class="spec-val">Worldwide Delivery Available</span>
        </div>
      </div>

      <button class="modal-cta-btn" onclick="orderOnWhatsApp('${saree.id}')" ${!saree.inStock ? 'disabled' : ''}>
        ${whatsappSVG}
        Order on WhatsApp (Code: ${saree.id})
      </button>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/* ---------- WhatsApp Ordering ---------- */
function orderOnWhatsApp(sareeId) {
  const saree = sareeData.find(s => s.id === sareeId);
  if (!saree) return;

  const message = encodeURIComponent(
    `Hi Taaravi! 🪷\n\n` +
    `I'd like to order:\n` +
    `🧵 *${saree.name}*\n` +
    `📋 Code: ${saree.id}\n` +
    `💰 Price: ₹${saree.price.toLocaleString('en-IN')}\n\n` +
    `Please share payment and delivery details.`
  );

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
}

function openWhatsAppSupport() {
  const message = encodeURIComponent(
    `Hi Taaravi! 👋\nI have a question about your saree collection.`
  );
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
}

/* ---------- Scroll Animations ---------- */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* ---------- Smooth Scroll ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#' || href.length <= 1) return;
      
      try {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (err) {
        // Ignore invalid selectors
      }
    });
  });
}

/* ---------- Instagram Reels Video Carousel ---------- */
let currentReelIndex = 0;

function getSlidesPerView() {
  const w = window.innerWidth;
  if (w <= 576) return 1;
  if (w <= 992) return 2;
  return 3;
}

function initReelsCarousel() {
  const track = document.getElementById('reels-track');
  const dotsContainer = document.getElementById('carousel-dots');
  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;
  if (totalSlides === 0) return;

  // Render indicator dots
  if (dotsContainer) {
    const slidesPerView = getSlidesPerView();
    const maxDots = Math.max(1, totalSlides - slidesPerView + 1);
    dotsContainer.innerHTML = '';
    for (let i = 0; i < maxDots; i++) {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.onclick = () => goToReelSlide(i);
      dotsContainer.appendChild(dot);
    }
  }

  updateReelsCarousel();

  // Touch Swipe Support
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    const diffX = startX - currentX;
    if (Math.abs(diffX) > 40 && currentX !== 0) {
      if (diffX > 0) {
        moveCarousel(1);
      } else {
        moveCarousel(-1);
      }
    }
    startX = 0;
    currentX = 0;
  });

  // Handle Resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initReelsCarousel();
    }, 150);
  });
}

function moveCarousel(direction) {
  const track = document.getElementById('reels-track');
  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;
  const slidesPerView = getSlidesPerView();
  const maxIndex = Math.max(0, totalSlides - slidesPerView);

  currentReelIndex += direction;
  if (currentReelIndex < 0) currentReelIndex = 0;
  if (currentReelIndex > maxIndex) currentReelIndex = maxIndex;

  updateReelsCarousel();
}

function goToReelSlide(index) {
  currentReelIndex = index;
  updateReelsCarousel();
}

function updateReelsCarousel() {
  const track = document.getElementById('reels-track');
  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const totalSlides = slides.length;
  if (totalSlides === 0) return;

  const slidesPerView = getSlidesPerView();
  const slideWidth = slides[0].getBoundingClientRect().width;
  const gap = 24; // gap between slides in px

  const offset = currentReelIndex * (slideWidth + gap);
  track.style.transform = `translateX(-${offset}px)`;

  // Update navigation buttons
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const maxIndex = Math.max(0, totalSlides - slidesPerView);

  if (prevBtn) prevBtn.disabled = (currentReelIndex <= 0);
  if (nextBtn) nextBtn.disabled = (currentReelIndex >= maxIndex);

  // Update active dot
  const dots = document.querySelectorAll('.carousel-dot');
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentReelIndex);
  });
}

