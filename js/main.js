/* ==========================================
   WEPVA AGENCY - INTERACTIVE SCRIPT
   Author: WEPVA Development Team
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initPortfolioFilters();
  initContactForm();
  prefillContactService();
  initScrollAnimations();
});

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
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('active') && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close menu when clicking navigation link
  const navLinks = nav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
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

      // 2. Filter projects with simple animation
      projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.classList.remove('hidden');
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
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
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !service || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    // 2. Mock submission UI state (loading spinner)
    const submitBtn = form.querySelector('.form-submit-btn');
    const originalBtnHTML = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.8';
    submitBtn.innerHTML = `
      <svg class="btn-icon animate-spin" viewBox="0 0 24 24" fill="none" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" style="opacity: 0.25;"></circle>
        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Processing Inquiry...
    `;

    // Add inline keyframe for spin if it doesn't exist
    if (!document.getElementById('spin-style')) {
      const style = document.createElement('style');
      style.id = 'spin-style';
      style.innerHTML = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
      document.head.appendChild(style);
    }

    // 3. Emulate network delay of 1.5 seconds, then show success card
    setTimeout(() => {
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
    }, 1500);
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
      'management': 'management',
      'ecommerce': 'ecommerce'
    };

    if (serviceMap[serviceParam]) {
      serviceSelect.value = serviceMap[serviceParam];
    }
  }
}

/**
 * Scroll Animations using Intersection Observer (Fades/Slides elements in as you scroll)
 */
function initScrollAnimations() {
  // Add animation styles dynamically to keep clean CSS files
  if (!document.getElementById('reveal-style')) {
    const style = document.createElement('style');
    style.id = 'reveal-style';
    style.innerHTML = `
      .reveal {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .reveal.revealed {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
  }

  // Setup observer
  const reveals = document.querySelectorAll('.service-card, .portfolio-card, .why-card, .process-step, .founder-img-wrapper, .founder-bio, .contact-details-box, .contact-form-wrapper');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Animates once
        }
      });
    }, {
      threshold: 0.1,
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
