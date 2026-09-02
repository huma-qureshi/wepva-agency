/* ==========================================
   WEPVA AGENCY - INTERACTIVE SCRIPT
   Author: WEPVA Development Team
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCleanUrl();
  initStickyHeader();
  initMobileMenu();
  initPortfolioFilters();
  initReviewFilters();
  initReviewModal();
  initContactForm();
  prefillContactService();
  scrollToServiceSection();
  initScrollAnimations();
  initStatsCounter();
  // initCustomCursor();
  initMagneticButtons();
});

/**
 * Clean URL: Automatically remove .html and trailing index.html from address bar
 */
function initCleanUrl() {
  const path = window.location.pathname;
  if (path.endsWith('.html')) {
    let clean = path.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
    if (!clean) clean = '/';
    window.history.replaceState(null, '', clean + window.location.search + window.location.hash);
  }
}

/**
 * Sticky Header Transition
 */
function initStickyHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Run on load and scroll
  checkScroll();
  window.addEventListener('scroll', checkScroll);
}

/**
 * Mobile Navigation Drawer Toggle
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  
  if (!menuToggle || !nav) return;

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
    
    // Accessibility: toggle aria-expanded
    const isExpanded = menuToggle.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', isExpanded);
    document.body.classList.toggle('nav-open', isExpanded);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('active') && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    }
  });

  // Close menu when clicking navigation link
  const navLinks = nav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    });
  });
}

/**
 * Portfolio Filtering Logic
 */
function initPortfolioFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.portfolio-grid-page .portfolio-card');
  
  if (filterButtons.length === 0 || projectCards.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 1. Set active class on button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      // 2. Filter projects with clean transition
      projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.classList.remove('hidden');
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
              // Clear inline styles so CSS hover remains smooth
              setTimeout(() => {
                card.style.opacity = '';
                card.style.transform = '';
              }, 300);
            }, 50);
          } else {
            card.classList.add('hidden');
          }
        }, 300);
      });
    });
  });
}

/**
 * Reviews Category Filtering Logic
 */
function initReviewFilters() {
  const filterButtons = document.querySelectorAll('.review-filter-btn');
  const reviewCards = document.querySelectorAll('.reviews-grid .review-card');
  
  if (filterButtons.length === 0 || reviewCards.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 1. Set active class on button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      // 2. Filter reviews with smooth animation
      reviewCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px) scale(0.96)';
        
        setTimeout(() => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.classList.remove('hidden');
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
              // Clear inline styles so CSS hover remains smooth
              setTimeout(() => {
                card.style.opacity = '';
                card.style.transform = '';
              }, 300);
            }, 50);
          } else {
            card.classList.add('hidden');
          }
        }, 250);
      });
    });
  });
}

/**
 * Review Submission Modal & Rating Picker Logic
 */
function initReviewModal() {
  const modal = document.getElementById('review-modal');
  const openButtons = document.querySelectorAll('.open-review-modal-trigger, #open-review-modal-btn');
  const closeBtn = document.getElementById('close-review-modal-btn');
  const form = document.getElementById('wepva-review-form');
  const starBtns = document.querySelectorAll('.star-btn');
  const ratingInput = document.getElementById('review-rating');
  const ratingLabel = document.getElementById('rating-label');

  if (!modal) return;

  const ratingDescriptions = {
    1: '1.0 / 5.0 (Poor)',
    2: '2.0 / 5.0 (Fair)',
    3: '3.0 / 5.0 (Good)',
    4: '4.0 / 5.0 (Very Good)',
    5: '5.0 / 5.0 (Excellent)'
  };

  const openModal = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  // Star Rating Interaction
  let updateStars = null;
  if (starBtns.length > 0) {
    updateStars = (rating) => {
      starBtns.forEach(btn => {
        const starVal = parseInt(btn.getAttribute('data-star'));
        if (starVal <= rating) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      if (ratingInput) ratingInput.value = rating;
      if (ratingLabel && ratingDescriptions[rating]) {
        ratingLabel.innerText = ratingDescriptions[rating];
      }
    };

    starBtns.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        const hoverVal = parseInt(btn.getAttribute('data-star'));
        starBtns.forEach(b => {
          const v = parseInt(b.getAttribute('data-star'));
          if (v <= hoverVal) b.classList.add('hover');
          else b.classList.remove('hover');
        });
      });

      btn.addEventListener('mouseleave', () => {
        starBtns.forEach(b => b.classList.remove('hover'));
      });

      btn.addEventListener('click', () => {
        const val = parseInt(btn.getAttribute('data-star'));
        updateStars(val);
      });
    });
  }

  // Handle Review Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('review-author-name').value.trim();
      const role = document.getElementById('review-author-role').value.trim();
      const category = document.getElementById('review-category').value;
      const headline = document.getElementById('review-headline').value.trim();
      const reviewText = document.getElementById('review-text').value.trim();
      const rating = parseInt(ratingInput ? ratingInput.value : '5') || 5;

      if (!name || !role || !headline || !reviewText) {
        alert('Please fill out all required fields.');
        return;
      }

      const submitBtn = form.querySelector('.review-submit-btn');
      const origBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerText = 'Publishing Review...';

      // Build Initials
      const nameParts = name.split(' ');
      const initials = nameParts.length > 1
        ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
        : name.slice(0, 2).toUpperCase();

      // Category label & badge class mapping
      const catMap = {
        'wordpress': { name: 'WordPress Dev', cls: '' },
        'shopify': { name: 'Shopify Store', cls: 'shopify' },
        'metaads': { name: 'Meta Ads', cls: 'metaads' },
        'management': { name: 'Website VA & Support', cls: 'management' },
        'design': { name: 'Brand & Graphics', cls: 'design' }
      };
      const catInfo = catMap[category] || { name: 'Client Feedback', cls: '' };

      // Generate Star SVGs
      let starsHTML = '';
      for (let i = 0; i < rating; i++) {
        starsHTML += `<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
      }

      // Create new review card element
      const newCard = document.createElement('div');
      newCard.className = 'review-card reveal revealed';
      newCard.setAttribute('data-category', category);
      newCard.style.border = '2px solid var(--color-primary)';
      newCard.style.animation = 'fadeIn 0.6s ease';

      newCard.innerHTML = `
        <div>
          <div class="review-card-header">
            <div class="review-stars" aria-label="${rating} out of 5 stars">
              ${starsHTML}
            </div>
            <span class="review-category-badge ${catInfo.cls}">${catInfo.name}</span>
          </div>
          <div class="review-body">
            <h3 class="review-headline">"${headline}"</h3>
            <p class="review-text">"${reviewText}"</p>
          </div>
        </div>
        <div class="review-author">
          <div class="author-avatar av-1">${initials}</div>
          <div class="author-details">
            <span class="author-name">${name}</span>
            <span class="author-title">${role}</span>
            <span class="verified-badge">
              <svg viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
              Verified Client
            </span>
          </div>
        </div>
      `;

      // Prepend to reviews grid
      const reviewsGrid = document.getElementById('reviews-grid-container') || document.querySelector('.reviews-grid');
      if (reviewsGrid) {
        reviewsGrid.prepend(newCard);
      }

      // Send to FormSubmit backend asynchronously
      fetch("https://formsubmit.co/ajax/wepva@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          type: "Client Testimonial Submission",
          client_name: name,
          client_role: role,
          service_category: category,
          rating: rating + "/5",
          headline: headline,
          review_feedback: reviewText,
          _subject: `New Client Review from ${name} (${rating} Stars)`
        })
      }).catch(err => console.log('Feedback logged:', err));

      setTimeout(() => {
        alert('Thank you! Your review has been submitted and posted.');
        form.reset();
        if (updateStars) updateStars(5);
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnHTML;
        closeModal();

        // Scroll smoothly to reviews section
        const reviewsSec = document.getElementById('reviews');
        if (reviewsSec) {
          reviewsSec.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    });
  }
}

/**
 * Contact Form Simulation with validation and spinner
 */
function initContactForm() {
  const form = document.getElementById('wepva-contact-form');
  const formContainer = document.querySelector('.contact-form-wrapper');
  
  if (!form || !formContainer) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Basic validation check
    const name = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const website = document.getElementById('website') ? document.getElementById('website').value.trim() : '';
    const service = document.getElementById('service').value;
    const budget = document.getElementById('budget') ? document.getElementById('budget').value : '';
    const issues = document.getElementById('issues') ? document.getElementById('issues').value.trim() : '';
    const expectations = document.getElementById('expectations') ? document.getElementById('expectations').value.trim() : '';
    const taskVideo = document.getElementById('task-video') ? document.getElementById('task-video').value : '';
    const discovery = document.getElementById('discovery') ? document.getElementById('discovery').value : '';

    if (!name || !email || !service || !issues || !expectations || !discovery) {
      alert('Please fill out all required fields marked with *.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // 2. Form submission UI state (loading spinner)
    const submitBtn = form.querySelector('.form-submit-btn');
    const originalBtnHTML = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.8';
    submitBtn.innerHTML = `
      <svg class="btn-icon animate-spin" viewBox="0 0 24 24" fill="none" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" style="opacity: 0.25;"></circle>
        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Sending Inquiry...
    `;

    // Add inline keyframe for spin if it doesn't exist
    if (!document.getElementById('spin-style')) {
      const style = document.createElement('style');
      style.id = 'spin-style';
      style.innerHTML = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
      document.head.appendChild(style);
    }

    // 3. Post to FormSubmit API
    fetch("https://formsubmit.co/ajax/wepva@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: name,
        email: email,
        website_url: website,
        service: service,
        budget: budget,
        website_issues: issues,
        what_to_achieve: expectations,
        share_task_video: taskVideo,
        how_did_you_find_me: discovery,
        _subject: `New WEPVA Inquiry from ${name}`
      })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to send email.');
      }
    })
    .then(data => {
      formContainer.innerHTML = `
        <div class="form-success-box">
          <div class="form-success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3>Inquiry Sent Successfully!</h3>
          <p>Thank you for reaching out, <strong>${name}</strong>. Huma Qureshi or a WEPVA specialist will review your request and contact you via email (${email}) or WhatsApp within 12-24 hours.</p>
          <button onclick="window.location.reload();" class="btn btn-primary" style="margin-top: 30px; font-size: 14px; padding: 10px 24px;">
            Submit Another Inquiry
          </button>
        </div>
      `;
    })
    .catch(error => {
      console.error('Error submitting contact form:', error);
      alert('There was a problem sending your inquiry. Please try again or email us directly at wepva@gmail.com.');
      // Restore submit button state
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.innerHTML = originalBtnHTML;
    });
  });
}

/**
 * Pre-fill Contact form dropdown based on URL parameters
 * Example: contact.html?service=shopify
 */
function prefillContactService() {
  const serviceSelect = document.getElementById('service');
  if (!serviceSelect) return;

  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  
  if (serviceParam) {
    // Map URL values to option values
    const serviceMap = {
      'wordpress': 'wordpress',
      'shopify': 'shopify',
      'metaads': 'metaads',
      'graphics': 'graphics',
      'logo': 'logo',
      'management': 'management',
      'ecommerce': 'ecommerce',
      'general': 'general'
    };

    if (serviceMap[serviceParam]) {
      serviceSelect.value = serviceMap[serviceParam];
    }
  }
}

/**
 * Smooth scroll to service section on services.html
 * Example: services.html?service=wordpress or services.html?service=logo
 */
function scrollToServiceSection() {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  if (!serviceParam) return;

  const targetId = serviceParam === 'logo' ? 'logo' : serviceParam;
  const targetElement = document.getElementById(targetId) || document.getElementById('logo-design');
  
  if (targetElement) {
    setTimeout(() => {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }
}

/**
 * Scroll Animations using Intersection Observer (Fades/Slides elements in as you scroll)
 */
function initScrollAnimations() {
  // Apply inline stagger animation delays for grid layouts
  const grids = document.querySelectorAll('.services-grid, .portfolio-grid, .why-grid, .process-grid, .reviews-grid, .about-hero-stats');
  grids.forEach(grid => {
    const items = grid.children;
    Array.from(items).forEach((item, index) => {
      // stagger by 120ms
      item.style.setProperty('--stagger-delay', `${index * 0.12}s`);
    });
  });

  // Setup observer
  const reveals = document.querySelectorAll('.service-card, .portfolio-card, .why-card, .process-step, .review-card, .reviews-stats-banner, .reviews-cta-box, .founder-img-wrapper, .founder-bio, .contact-details-box, .contact-form-wrapper');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Animates once
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  } else {
    // Fallback: reveal immediately for older browsers
    reveals.forEach(el => el.classList.add('revealed'));
  }
}

/**
 * Animate numbers when they scroll into view
 */
function initStatsCounter() {
  const statsElements = document.querySelectorAll('.about-hero-stats > div > div:first-child');
  if (statsElements.length === 0) return;
  
  const animate = (el) => {
    const text = el.innerText;
    // Extract numeric parts (including decimals)
    const match = text.match(/([0-9.]+)/);
    if (!match) return;
    
    const target = parseFloat(match[1]);
    const isDecimal = match[1].includes('.');
    const suffix = text.replace(match[1], ''); // e.g. "+", "%", "x"
    
    const duration = 1600; // 1.6 seconds
    const startTime = performance.now();
    
    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const current = target * easeProgress;
      
      if (isDecimal) {
        el.innerText = current.toFixed(1) + suffix;
      } else {
        el.innerText = Math.floor(current) + suffix;
      }
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.innerText = text; // Ensure precise final string
      }
    };
    
    requestAnimationFrame(update);
  };
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    statsElements.forEach(el => observer.observe(el));
  } else {
    statsElements.forEach(el => animate(el));
  }
}

/**
 * Custom Mouse Follower Cursor Effect
 */
function initCustomCursor() {
  // Check if user prefers reduced motion or is on touch device
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
  
  // Create cursor element (Only dot, no lagging circle outline!)
  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';
  document.body.appendChild(dot);
  
  // Update cursor position instantly using high-performance translate3d
  window.addEventListener('mousemove', (e) => {
    dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    if (!document.body.classList.contains('cursor-active')) {
      document.body.classList.add('cursor-active');
    }
  });
  
  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-active');
  });
  
  // Hover expansion bindings for interactive elements
  const updateHoverListeners = () => {
    const hoverables = document.querySelectorAll('a, button, .btn, .portfolio-card, .service-card, .filter-btn, .menu-toggle, .social-link');
    
    hoverables.forEach(el => {
      // Remove any existing listeners to prevent duplicates if function runs again
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
      
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });
  };
  
  const onMouseEnter = () => {
    dot.classList.add('hovered');
  };
  
  const onMouseLeave = () => {
    dot.classList.remove('hovered');
  };
  
  updateHoverListeners();
  
  // Re-run listener attachment if portfolio filters change elements
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Wait for DOM changes from category display toggles
      setTimeout(updateHoverListeners, 400);
    });
  });
}

/**
 * Magnetic Button Interactions
 */
function initMagneticButtons() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const buttons = document.querySelectorAll('.btn, .social-link, .menu-toggle, .filter-btn, .review-filter-btn');
  
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Pull towards cursor slightly (30% force)
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      
      const icon = btn.querySelector('.btn-icon, svg');
      if (icon) {
        icon.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
      }
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
      const icon = btn.querySelector('.btn-icon, svg');
      if (icon) {
        icon.style.transform = 'translate(0px, 0px)';
      }
    });
  });
}
