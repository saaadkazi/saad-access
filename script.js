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
  if (heroSection && heroContent) {
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

});
