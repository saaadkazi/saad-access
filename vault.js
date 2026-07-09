document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     NAVBAR EFFECTS & DYNAMIC SCROLL
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTop = document.getElementById('back-to-top');

  // Change navbar background state on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
      if (backToTop) {
        backToTop.style.opacity = '1';
        backToTop.style.pointerEvents = 'auto';
      }
    } else {
      // Keep navbar unscrolled style on vault page unless scrolled
      // Because vault page uses .scrolled class by default to ensure navigation links are visible on dark background
      if (backToTop) {
        backToTop.style.opacity = '0';
        backToTop.style.pointerEvents = 'none';
      }
    }
  });

  // Mobile Hamburger Toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Close mobile menu on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navToggle && navMenu) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  });

  // Back to top click
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     SCROLL REVEAL EFFECT
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOnScroll = () => {
    revealElements.forEach(el => {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;
      const elementVisible = 100;

      if (elementTop < windowHeight - elementVisible) {
        el.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  // Trigger once initially
  setTimeout(revealOnScroll, 100);

  /* ==========================================================================
     DEDICATED SEARCH & CATEGORY FILTER SYSTEM
     ========================================================================== */
  const searchInput = document.getElementById('vault-search-input');
  const tabBtns = document.querySelectorAll('.vault-tab-pill');
  const modCards = document.querySelectorAll('.mod-card');
  const grid = document.getElementById('vault-grid');
  
  let currentFilter = 'all';
  let currentSearch = '';

  const filterAndSearch = () => {
    let visibleCount = 0;

    modCards.forEach(card => {
      const title = card.querySelector('.mod-card-title').innerText.toLowerCase();
      const desc = card.querySelector('.mod-card-desc').innerText.toLowerCase();
      const category = card.getAttribute('data-category');

      const matchesCategory = currentFilter === 'all' || category === currentFilter;
      const matchesSearch = title.includes(currentSearch) || desc.includes(currentSearch);

      if (matchesCategory && matchesSearch) {
        visibleCount++;
        card.style.display = 'flex';
        // Add subtle scale animation
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        card.style.display = 'none';
      }
    });

    // Handle Empty State
    let emptyState = document.getElementById('vault-empty-state');
    if (visibleCount === 0) {
      if (!emptyState && grid) {
        emptyState = document.createElement('div');
        emptyState.id = 'vault-empty-state';
        emptyState.className = 'vault-empty-state';
        emptyState.innerHTML = `
          <div class="vault-empty-icon">🔍</div>
          <h3 class="vault-empty-title">No Modifications Found</h3>
          <p class="vault-empty-text">We couldn't find any modifications matching "${currentSearch}". Try adjusting your filters or search keywords.</p>
        `;
        grid.appendChild(emptyState);
      }
    } else {
      if (emptyState) {
        emptyState.remove();
      }
    }
  };

  // Search Input Event
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      filterAndSearch();
    });
  }

  // Category Tab Clicks
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentFilter = btn.getAttribute('data-filter');
      filterAndSearch();
    });
  });

  /* ==========================================================================
     MAGNETIC BACK TO HOME BUTTON & FOOTER BUTTONS
     ========================================================================== */
  const backHomeBtn = document.getElementById('btn-back-home');
  if (backHomeBtn) {
    backHomeBtn.addEventListener('mousemove', (e) => {
      const rect = backHomeBtn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      backHomeBtn.style.transform = `scale(1.02) translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    
    backHomeBtn.addEventListener('mouseleave', () => {
      backHomeBtn.style.transform = '';
    });
  }

  // Magnetic hover for other luxury elements in the footer
  const footerMagneticElements = document.querySelectorAll('.btn-premium-cta, .footer-top-cta .btn-secondary, .social-glass-btn, .btn-back-to-top-premium');
  
  footerMagneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const isSocial = el.classList.contains('social-glass-btn');
      const isBackToTop = el.classList.contains('btn-back-to-top-premium');
      const multiplier = (isSocial || isBackToTop) ? 0.25 : 0.15;
      
      el.style.transform = `translate(${x * multiplier}px, ${y * multiplier}px) ${isSocial ? 'scale(1.05)' : 'scale(1.02)'}`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  /* ==========================================================================
     BACK TO TOP PROGRESS RING & SCROLL PROGRESS
     ========================================================================== */
  const footerBackToTop = document.querySelector('.btn-back-to-top-premium');
  const progressCircle = document.querySelector('.progress-ring-circle');
  
  if (progressCircle) {
    const radius = progressCircle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = circumference;
    
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const scrollPercent = (window.scrollY / scrollHeight) * 100;
        const offset = circumference - (scrollPercent / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
      }
      
      if (window.scrollY > 200) {
        if (footerBackToTop) footerBackToTop.classList.add('visible');
      } else {
        if (footerBackToTop) footerBackToTop.classList.remove('visible');
      }
    };
    
    window.addEventListener('scroll', updateProgress);
    updateProgress();
  }
  
  if (footerBackToTop) {
    footerBackToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }



});
