document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     NAVBAR EFFECTS & DYNAMIC SCROLL
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const backToTop = document.getElementById('back-to-top');

  // Change nav background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
      backToTop.style.opacity = '1';
      backToTop.style.pointerEvents = 'auto';
    } else {
      navbar.classList.remove('scrolled');
      backToTop.style.opacity = '0';
      backToTop.style.pointerEvents = 'none';
    }

    // Scroll spy for active navbar section
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 250)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });

  });

  // Mobile Hamburger Toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Close mobile menu on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
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
      const elementVisible = 150;

      if (elementTop < windowHeight - elementVisible) {
        el.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  // Trigger once initially
  revealOnScroll();

  /* ==========================================================================
     STATS COUNTER ANIMATION
     ========================================================================== */
  const statsSection = document.getElementById('build');
  const statNumbers = document.querySelectorAll('.sec-stat-number');
  let statsAnimated = false;

  const countUpStats = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'));
      const suffix = stat.getAttribute('data-suffix') || '';
      const prefix = stat.getAttribute('data-prefix') || '';
      let count = 0;
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // ~60fps

      const updateCount = () => {
        count += increment;
        if (count < target) {
          if (target > 1000) {
            stat.innerText = prefix + Math.floor(count).toLocaleString('en-IN') + suffix;
          } else {
            stat.innerText = prefix + Math.floor(count) + suffix;
          }
          requestAnimationFrame(updateCount);
        } else {
          if (target > 1000) {
            stat.innerText = prefix + target.toLocaleString('en-IN') + suffix;
          } else {
            stat.innerText = prefix + target + suffix;
          }
        }
      };
      updateCount();
    });
  };

  // Intersection Observer for Stats Counter
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        countUpStats();
        statsAnimated = true;
      }
    });
  }, { threshold: 0.2 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // Scroll-driven Odometer build value counter removed (value is now displayed as a static hero element)

  /* ==========================================================================
     BEFORE VS AFTER SLIDER
     ========================================================================== */
  const sliderContainer = document.querySelector('.before-after-container');
  const afterImage = document.querySelector('.after-image');
  const sliderHandle = document.querySelector('.slider-handle');
  const afterImgEl = document.querySelector('.after-image img');

  if (sliderContainer && afterImage && sliderHandle) {
    let isDragging = false;

    // Set matching width for the absolute img child to preserve scaling
    const setAfterImgWidth = () => {
      const containerWidth = sliderContainer.offsetWidth;
      if (afterImgEl) {
        afterImgEl.style.width = `${containerWidth}px`;
      }
    };
    
    setAfterImgWidth();
    window.addEventListener('resize', setAfterImgWidth);

    const updateEvolutionStats = (percentage) => {
      const modsValEl = document.querySelector('#evo-stat-mods .evo-stat-val');
      const investmentValEl = document.querySelector('#evo-stat-investment .evo-stat-val');
      const statusValEl = document.querySelector('#evo-stat-status .evo-stat-val');

      if (!modsValEl || !investmentValEl || !statusValEl) return;

      // 1. Calculate mods (piecewise linear interpolation)
      let mods;
      if (percentage >= 100) {
        mods = "50+";
      } else if (percentage <= 25) {
        mods = Math.round(0 + (percentage / 25) * 12);
      } else if (percentage <= 50) {
        mods = Math.round(12 + ((percentage - 25) / 25) * 13);
      } else if (percentage <= 75) {
        mods = Math.round(25 + ((percentage - 50) / 25) * 15);
      } else {
        mods = Math.round(40 + ((percentage - 75) / 25) * 10);
      }

      // 2. Calculate investment (linear interpolation)
      const investment = Math.round(percentage * 600);
      const investmentFormatted = "₹" + investment.toLocaleString('en-IN');

      // 3. Determine status text based on ranges
      let status = "STOCK ACCESS";
      if (percentage >= 87.5) {
        status = "BUILD 7446";
      } else if (percentage >= 62.5) {
        status = "ADVANCED BUILD";
      } else if (percentage >= 37.5) {
        status = "BUILD IN PROGRESS";
      } else if (percentage >= 12.5) {
        status = "EARLY BUILD";
      }

      // Update mods and investment text content instantly
      modsValEl.innerText = mods;
      investmentValEl.innerText = investmentFormatted;

      // Update status text with a premium slide/fade transition if it changed
      if (statusValEl.innerText !== status) {
        statusValEl.style.opacity = '0';
        statusValEl.style.transform = 'translateY(-5px)';
        setTimeout(() => {
          statusValEl.innerText = status;
          statusValEl.style.opacity = '1';
          statusValEl.style.transform = 'translateY(0)';
        }, 120);
      }
    };

    // Initialize stats at 50% slider position
    updateEvolutionStats(50);

    const updateSlider = (clientX) => {
      const rect = sliderContainer.getBoundingClientRect();
      const x = clientX - rect.left;
      let percentage = (x / rect.width) * 100;
      
      // Boundaries
      percentage = Math.max(0, Math.min(100, percentage));
      
      afterImage.style.width = `${percentage}%`;
      sliderHandle.style.left = `${percentage}%`;

      // Update evolution stats dynamically!
      updateEvolutionStats(percentage);
    };

    // Mouse events
    sliderHandle.addEventListener('mousedown', () => { 
      isDragging = true; 
      sliderContainer.classList.add('dragging');
    });
    window.addEventListener('mouseup', () => { 
      isDragging = false; 
      sliderContainer.classList.remove('dragging');
    });
    
    sliderContainer.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX);
    });

    // Touch events for mobile
    sliderHandle.addEventListener('touchstart', () => { 
      isDragging = true; 
      sliderContainer.classList.add('dragging');
    });
    window.addEventListener('touchend', () => { 
      isDragging = false; 
      sliderContainer.classList.remove('dragging');
    });
    
    sliderContainer.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches.length > 0) {
        updateSlider(e.touches[0].clientX);
      }
    });

    // Support clicking container to jump
    sliderContainer.addEventListener('click', (e) => {
      if (e.target !== sliderHandle && !sliderHandle.contains(e.target)) {
        updateSlider(e.clientX);
      }
    });
  }

  /* ==========================================================================
     MODIFICATION VAULT FILTER SYSTEM
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const modCards = document.querySelectorAll('.mod-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      modCards.forEach(card => {
        // Fade out
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.style.display = 'flex';
            // Fade in
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        }, 300);
      });
    });
  });

  /* ==========================================================================
     360 DEGREE SHOWCASE VIEWER
     ========================================================================== */
  const viewerBtns = document.querySelectorAll('.viewer-btn');
  const viewerImages = document.querySelectorAll('.viewer-image');

  viewerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewerBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const viewTarget = btn.getAttribute('data-view');

      viewerImages.forEach(img => {
        img.classList.remove('active');
        if (img.getAttribute('id') === `view-${viewTarget}`) {
          img.classList.add('active');
        }
      });
    });
  });

  /* ==========================================================================
     GALLERY LIGHTBOX
     ========================================================================== */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxTag = document.getElementById('lightbox-tag');
  const lightboxTitle = document.getElementById('lightbox-title');

  if (galleryItems.length > 0 && lightbox) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgEl = item.querySelector('img');
        const tagText = item.querySelector('.gallery-item-tag').innerText;
        const titleText = item.querySelector('.gallery-item-title').innerText;

        lightboxImg.src = imgEl.src;
        lightboxTag.innerText = tagText;
        lightboxTitle.innerText = titleText;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scrolling
      });
    });

    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto'; // Restore scroll
    });

    // Close on click outside image
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

  /* ==========================================================================
     YOUTUBE VIDEO PLAYER INTERACTIVITY
     ========================================================================== */
  const youtubeCards = document.querySelectorAll('.video-card-youtube');

  youtubeCards.forEach(card => {
    const overlay = card.querySelector('.video-thumbnail-overlay');
    const playerWrapper = card.querySelector('.video-player-wrapper');
    const videoId = card.getAttribute('data-video-id');

    if (overlay && playerWrapper && videoId) {
      overlay.addEventListener('click', (e) => {
        e.stopPropagation();
        // Insert actual YouTube iframe embed to start playing
        playerWrapper.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      });
    }
  });

  /* ==========================================================================
     REELS INTERACTIVITY (LOCAL VIDEO PREVIEWS & MODAL)
     ========================================================================== */
  const reelFrames = document.querySelectorAll('.reel-phone-frame');
  const reelModal = document.getElementById('reel-modal');
  const reelModalVideo = document.getElementById('reel-modal-video');
  const reelModalTitle = document.getElementById('reel-modal-title');
  const reelModalSubtitle = document.getElementById('reel-modal-subtitle');
  const reelModalClose = document.getElementById('reel-modal-close');

  reelFrames.forEach(frame => {
    const video = frame.querySelector('.reel-video');
    
    if (video) {
      const title = frame.querySelector('.reel-title').innerText;
      const subtitle = frame.querySelector('.reel-subtitle').innerText;
      const videoSrc = frame.getAttribute('data-video-src');

      // Hover Play/Pause
      frame.addEventListener('mouseenter', () => {
        video.play().catch(err => console.log('Autoplay preview blocked:', err));
      });

      frame.addEventListener('mouseleave', () => {
        video.pause();
      });

      // Click to open fullscreen modal
      frame.addEventListener('click', () => {
        if (reelModal && reelModalVideo) {
          reelModalVideo.src = video.src || videoSrc;
          reelModalVideo.muted = false; // Enable sound in modal

          if (reelModalTitle) reelModalTitle.innerText = title;
          if (reelModalSubtitle) reelModalSubtitle.innerText = subtitle;

          reelModal.classList.add('active');
          document.body.style.overflow = 'hidden'; // Lock page scroll

          // Attempt playing the modal video
          reelModalVideo.play().catch(err => {
            console.log('Unmuted play blocked by browser, trying muted...', err);
            reelModalVideo.muted = true;
            reelModalVideo.play().catch(e => console.error('Play failed completely:', e));
          });
        }
      });
    }
  });

  // Modal closing logic
  if (reelModal && reelModalVideo && reelModalClose) {
    const closeModal = () => {
      reelModalVideo.pause();
      reelModalVideo.src = '';
      reelModal.classList.remove('active');
      document.body.style.overflow = 'auto'; // Restore scroll
    };

    reelModalClose.addEventListener('click', closeModal);

    // Close on click outside modal content
    reelModal.addEventListener('click', (e) => {
      if (e.target === reelModal) {
        closeModal();
      }
    });
  }

  /* ==========================================================================
     HERO MOUSE PARALLAX EFFECT
     ========================================================================== */
  const heroSection = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');
  // Detect mobile to disable parallax calculations and loop (saves mobile CPU/GPU rendering overhead)
  const isMobileDevice = window.innerWidth <= 768 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  
  if (heroSection && heroContent && !isMobileDevice) {
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    const lerpFactor = 0.08;
    
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      targetX = x;
      targetY = y;
    });
    
    heroSection.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });
    
    function updateParallax() {
      currentX += (targetX - currentX) * lerpFactor;
      currentY += (targetY - currentY) * lerpFactor;
      
      heroContent.style.setProperty('--parallax-x', currentX.toFixed(4));
      heroContent.style.setProperty('--parallax-y', currentY.toFixed(4));
      
      requestAnimationFrame(updateParallax);
    }
    
    updateParallax();
  }

  /* ==========================================================================
     HERO VIDEO FADE IN ON LOAD
     ========================================================================== */
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    const handleVideoLoad = () => {
      heroVideo.classList.add('video-loaded');
    };

    // If the video is already playing or ready (cached/fast load)
    if (heroVideo.readyState >= 3) {
      handleVideoLoad();
    } else {
      // Listen to both canplay and playing to cover different browser implementations
      heroVideo.addEventListener('canplay', handleVideoLoad);
      heroVideo.addEventListener('playing', handleVideoLoad);
    }
  }

  /* ==========================================================================
     SIGNATURE INNOVATIONS STAT COUNTER ANIMATION
     ========================================================================== */
  const counterElements = document.querySelectorAll('.stat-counter');
  
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * target);
      
      if (target >= 1000) {
        el.innerText = currentValue.toLocaleString('en-IN');
      } else {
        el.innerText = currentValue;
      }
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (target >= 1000) {
          el.innerText = target.toLocaleString('en-IN');
        } else {
          el.innerText = target;
        }
      }
    };
    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (!el.classList.contains('animated')) {
          el.classList.add('animated');
          animateCounter(el);
        }
      }
    });
  }, { threshold: 0.1 });

  counterElements.forEach(el => counterObserver.observe(el));

  /* ==========================================================================
     SIGNATURE INNOVATIONS LUXURY SHOWCASE CONTROLLER
     ========================================================================== */
  // 1. Scroll Active State Observer for Cards
  const highlightRows = document.querySelectorAll('.highlight-row');
  
  if (highlightRows.length > 0) {
    const cardObserverOptions = {
      root: null,
      rootMargin: '-30% 0px -30% 0px', // Trigger when card occupies the middle 40% of the screen
      threshold: 0.1
    };
    
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          highlightRows.forEach(row => {
            if (row === entry.target) {
              row.classList.add('active-card');
              row.classList.remove('inactive-card');
            } else {
              row.classList.remove('active-card');
              row.classList.add('inactive-card');
            }
          });
        }
      });
    }, cardObserverOptions);
    
    highlightRows.forEach(row => cardObserver.observe(row));
  }

  // 2. Subtle Parallax Effect for Showcase Images
  const showcaseImages = document.querySelectorAll('.highlight-media img');
  
  if (showcaseImages.length > 0) {
    const handleShowcaseParallax = () => {
      const viewHeight = window.innerHeight;
      const viewCenter = viewHeight / 2;
      
      showcaseImages.forEach(img => {
        const rect = img.getBoundingClientRect();
        // Check if image is within the viewport to save calculations
        if (rect.bottom < 0 || rect.top > viewHeight) return;
        
        const imgCenter = rect.top + rect.height / 2;
        const distanceFromCenter = imgCenter - viewCenter;
        
        // Map to a premium, subtle offset of max 8px
        const maxParallax = 8;
        const travel = (distanceFromCenter / viewHeight) * maxParallax;
        const clampedTravel = Math.max(-maxParallax, Math.min(maxParallax, travel));
        
        img.style.setProperty('--parallax-y', `${clampedTravel}px`);
      });
    };
    
    window.addEventListener('scroll', handleShowcaseParallax, { passive: true });
    window.addEventListener('resize', handleShowcaseParallax, { passive: true });
    // Initial run
    setTimeout(handleShowcaseParallax, 200);
  }

  /* ==========================================================================
     ADMIN PORTAL OVERLAY UI CONTROLLER
     ========================================================================== */
  const navProfileBtn = document.getElementById('nav-profile-btn');
  const navProfileBtnMobile = document.getElementById('nav-profile-btn-mobile');
  const loginModal = document.getElementById('landing-login-modal');
  const loginClose = document.getElementById('landing-login-close');
  
  const tabBtnEmail = document.getElementById('tab-btn-email');
  const tabBtnOauth = document.getElementById('tab-btn-oauth');
  const emailForm = document.getElementById('email-login-form');
  const oauthPanel = document.getElementById('oauth-login-panel');
  const loginError = document.getElementById('landing-login-error');
  
  const adminOverlay = document.getElementById('admin-overlay');
  const logoutBtn = document.getElementById('admin-logout-btn');
  
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const workspacePanels = document.querySelectorAll('.workspace-panel');
  const workspaceTitle = document.getElementById('admin-workspace-title');

  const openLoginModal = () => {
    if (loginModal) {
      loginModal.classList.add('active');
      if (loginError) loginError.style.display = 'none';
    }
  };

  const closeLoginModal = () => {
    if (loginModal) {
      loginModal.classList.remove('active');
    }
  };

  const showAdminOverlay = () => {
    if (adminOverlay) {
      adminOverlay.classList.add('active');
      document.body.classList.add('admin-mode-active');
      if (navProfileBtn) navProfileBtn.classList.add('active-glow');
      if (navProfileBtnMobile) navProfileBtnMobile.classList.add('active-glow');
    }
  };

  const hideAdminOverlay = () => {
    if (adminOverlay) {
      adminOverlay.classList.remove('active');
      document.body.classList.remove('admin-mode-active');
      if (navProfileBtn) navProfileBtn.classList.remove('active-glow');
      if (navProfileBtnMobile) navProfileBtnMobile.classList.remove('active-glow');
    }
  };

  // Login Modal tab swapping
  if (tabBtnEmail && tabBtnOauth && emailForm && oauthPanel) {
    tabBtnEmail.addEventListener('click', () => {
      tabBtnEmail.classList.add('active');
      tabBtnOauth.classList.remove('active');
      emailForm.style.display = 'flex';
      oauthPanel.style.display = 'none';
    });
    
    tabBtnOauth.addEventListener('click', () => {
      tabBtnOauth.classList.add('active');
      tabBtnEmail.classList.remove('active');
      oauthPanel.style.display = 'flex';
      emailForm.style.display = 'none';
    });
  }

  // Email form login submission (Mock Validation)
  if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('login-email');
      const passInput = document.getElementById('login-password');
      const email = emailInput ? emailInput.value : '';
      const pass = passInput ? passInput.value : '';
      
      // Admin verification logic
      if (email.trim() === 'saadkazi0901@gmail.com' && pass.trim() !== '') {
        closeLoginModal();
        showAdminOverlay();
        showToast('Terminal connection established successfully.', 'success');
      } else {
        if (loginError) {
          loginError.style.display = 'flex';
          const msg = document.getElementById('landing-login-error-msg');
          if (msg) msg.innerText = "Unauthorized Access: Administrator email only.";
        }
      }
    });
  }

  // Google OAuth continue button
  const googleBtn = document.getElementById('btn-google-login');
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      closeLoginModal();
      showAdminOverlay();
      showToast('OAuth session verified successfully.', 'success');
    });
  }

  // Toggle active sidebar panels
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      if (!targetId) return;
      
      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      workspacePanels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
      
      if (workspaceTitle) {
        const textElement = link.querySelector('span');
        const text = textElement ? textElement.innerText : link.innerText;
        workspaceTitle.innerText = `// TERMINAL CORE // ${text.toUpperCase()}`;
      }
    });
  });

  // Modal event triggers
  const toHomeBtn = document.getElementById('admin-to-home-btn');
  if (toHomeBtn) {
    toHomeBtn.addEventListener('click', () => {
      hideAdminOverlay();
      if (window.location.pathname.includes('admin')) {
        window.location.href = '/';
      } else {
        const homeSection = document.getElementById('home');
        if (homeSection) {
          homeSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  if (navProfileBtn) navProfileBtn.addEventListener('click', openLoginModal);
  if (navProfileBtnMobile) navProfileBtnMobile.addEventListener('click', openLoginModal);
  if (loginClose) loginClose.addEventListener('click', closeLoginModal);
  if (logoutBtn) logoutBtn.addEventListener('click', hideAdminOverlay);

  window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      closeLoginModal();
    }
  });

  // Quick Utilities click triggers
  const backupBtn = document.getElementById('btn-quick-backup');
  const syncBtn = document.getElementById('btn-quick-sync');
  const clearTrashBtn = document.getElementById('btn-quick-clear-trash');
  
  if (backupBtn) {
    backupBtn.addEventListener('click', () => {
      showToast('Backup compiled and synchronized successfully.', 'success');
      const backupList = document.getElementById('db-backup-list');
      if (backupList) {
        const row = document.createElement('div');
        row.className = 'backup-row';
        row.innerHTML = `
          <div class="backup-info">
            <span class="backup-name">Manual Backup #${Math.floor(Math.random() * 900 + 100)}</span>
            <span class="backup-time">${new Date().toLocaleString()}</span>
          </div>
          <span class="badge-status green">Synchronized</span>
        `;
        backupList.insertBefore(row, backupList.firstChild);
      }
    });
  }
  
  if (syncBtn) {
    syncBtn.addEventListener('click', () => {
      showToast('Live state synchronized successfully.', 'success');
    });
  }
  
  if (clearTrashBtn) {
    clearTrashBtn.addEventListener('click', () => {
      showToast('Trash bin purged.', 'success');
    });
  }
  
  // Header Action Triggers
  const adminSaveDraft = document.getElementById('admin-save-draft-btn');
  const adminPublish = document.getElementById('admin-publish-btn');
  
  if (adminSaveDraft) {
    adminSaveDraft.addEventListener('click', () => {
      showToast('Draft version saved.', 'success');
    });
  }
  
  if (adminPublish) {
    adminPublish.addEventListener('click', () => {
      showToast('Draft version published live.', 'success');
      const draftBadge = document.getElementById('admin-draft-status');
      if (draftBadge) {
        draftBadge.className = 'badge-status green';
        draftBadge.innerText = 'Live // Sync';
      }
    });
  }

  // Build Stats live previews
  const formStatsVal = document.getElementById('form-stats-value');
  const formStatsTime = document.getElementById('form-stats-time');
  const formStatsParts = document.getElementById('form-stats-parts');
  
  const previewValDisplay = document.getElementById('preview-val-display');
  const previewTimeDisplay = document.getElementById('preview-time-display');
  const previewPartsDisplay = document.getElementById('preview-parts-display');
  
  if (formStatsVal && previewValDisplay) {
    formStatsVal.addEventListener('input', (e) => {
      previewValDisplay.innerText = e.target.value;
    });
  }
  if (formStatsTime && previewTimeDisplay) {
    formStatsTime.addEventListener('input', (e) => {
      previewTimeDisplay.innerText = e.target.value.toUpperCase();
    });
  }
  if (formStatsParts && previewPartsDisplay) {
    formStatsParts.addEventListener('input', (e) => {
      previewPartsDisplay.innerText = e.target.value;
    });
  }
  
  const statsForm = document.getElementById('stats-tab-form');
  if (statsForm) {
    statsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Build metrics saved to draft.', 'success');
      const draftBadge = document.getElementById('admin-draft-status');
      if (draftBadge) {
        draftBadge.className = 'badge-status yellow';
        draftBadge.innerText = 'Unsaved Draft';
      }
    });
  }

  // Footer configurations live previews
  const formFooterIg = document.getElementById('form-footer-instagram');
  const formFooterEmail = document.getElementById('form-footer-email');
  const formFooterPhone = document.getElementById('form-footer-phone');
  const formFooterCopyright = document.getElementById('form-footer-copyright');
  
  const previewFooterIg = document.getElementById('preview-footer-ig');
  const previewFooterEmail = document.getElementById('preview-footer-email');
  const previewFooterPhone = document.getElementById('preview-footer-phone');
  const previewFooterCopyright = document.getElementById('preview-footer-copyright');
  
  if (formFooterIg && previewFooterIg) {
    formFooterIg.addEventListener('input', (e) => {
      const parts = e.target.value.split('/');
      const handle = parts[parts.length - 1] || parts[parts.length - 2] || 'saad_kazi0001';
      previewFooterIg.innerText = handle.startsWith('@') ? handle : '@' + handle;
    });
  }
  if (formFooterEmail && previewFooterEmail) {
    formFooterEmail.addEventListener('input', (e) => {
      previewFooterEmail.innerText = e.target.value;
    });
  }
  if (formFooterPhone && previewFooterPhone) {
    formFooterPhone.addEventListener('input', (e) => {
      previewFooterPhone.innerText = e.target.value;
    });
  }
  if (formFooterCopyright && previewFooterCopyright) {
    formFooterCopyright.addEventListener('input', (e) => {
      previewFooterCopyright.innerText = e.target.value;
    });
  }
  
  const footerForm = document.getElementById('footer-tab-form');
  if (footerForm) {
    footerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Footer settings saved to draft.', 'success');
      const draftBadge = document.getElementById('admin-draft-status');
      if (draftBadge) {
        draftBadge.className = 'badge-status yellow';
        draftBadge.innerText = 'Unsaved Draft';
      }
    });
  }

  // Vault cards category filtering
  const filterPills = document.querySelectorAll('#vault-pills-container .filter-pill-btn');
  const adminModCards = document.querySelectorAll('#vault-mods-grid .admin-mod-card');
  
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      
      const filter = pill.getAttribute('data-filter');
      adminModCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Gallery Dropzone drag-drop mock triggers
  const galleryDropzone = document.getElementById('gallery-dropzone');
  if (galleryDropzone) {
    galleryDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      galleryDropzone.style.borderColor = 'var(--neon-blue)';
      galleryDropzone.style.background = 'rgba(77, 166, 255, 0.05)';
    });
    
    galleryDropzone.addEventListener('dragleave', () => {
      galleryDropzone.style.borderColor = 'rgba(192, 192, 192, 0.2)';
      galleryDropzone.style.background = 'rgba(17, 17, 17, 0.4)';
    });
    
    galleryDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      galleryDropzone.style.borderColor = 'rgba(192, 192, 192, 0.2)';
      galleryDropzone.style.background = 'rgba(17, 17, 17, 0.4)';
      showToast('Image uploaded and optimized to WebP.', 'success');
      
      const manageGrid = document.getElementById('gallery-manage-grid');
      if (manageGrid) {
        const item = document.createElement('div');
        item.className = 'gallery-card-item';
        item.innerHTML = `
          <img src="modified.png">
          <div class="gallery-card-overlay">
            <button class="action-btn-sm">Edit</button>
            <button class="action-btn-sm danger">Del</button>
          </div>
        `;
        manageGrid.insertBefore(item, manageGrid.firstChild);
      }
    });
    
    galleryDropzone.addEventListener('click', () => {
      showToast('Image optimized to WebP and added to grid.', 'success');
      const manageGrid = document.getElementById('gallery-manage-grid');
      if (manageGrid) {
        const item = document.createElement('div');
        item.className = 'gallery-card-item';
        item.innerHTML = `
          <img src="modified.png">
          <div class="gallery-card-overlay">
            <button class="action-btn-sm">Edit</button>
            <button class="action-btn-sm danger">Del</button>
          </div>
        `;
        manageGrid.insertBefore(item, manageGrid.firstChild);
      }
    });
  }

  // Helper for UI Toast notifications
  const showToast = (message, type = 'success') => {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.position = 'fixed';
      container.style.bottom = '20px';
      container.style.right = '20px';
      container.style.zIndex = '99999';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '10px';
      document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.style.background = 'rgba(17,17,17,0.95)';
    toast.style.border = '1px solid ' + (type === 'success' ? '#4DA6FF' : '#FF5555');
    toast.style.boxShadow = '0 5px 15px rgba(0,0,0,0.5), 0 0 10px ' + (type === 'success' ? 'rgba(77,166,255,0.2)' : 'rgba(255,85,85,0.2)');
    toast.style.color = '#FFFFFF';
    toast.style.padding = '12px 24px';
    toast.style.fontSize = '0.72rem';
    toast.style.fontFamily = 'var(--font-display)';
    toast.style.fontWeight = '700';
    toast.style.letterSpacing = '1px';
    toast.style.textTransform = 'uppercase';
    toast.style.borderRadius = '4px';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    toast.innerText = message;
    
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 10);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  };

  /* ==========================================================================
     MAGNETIC HOVER EFFECTS
     ========================================================================== */
  const magneticElements = document.querySelectorAll('.btn-premium-cta, .footer-top-cta .btn-secondary, .social-glass-btn, .btn-back-to-top-premium');
  
  magneticElements.forEach(el => {
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

