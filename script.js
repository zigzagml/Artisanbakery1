/**
 * Crust & Hearth Artisan Bakery
 * Interactive Scripts for Navigation, Scroll Effects & Contact Form
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const contactForm = document.getElementById('contactForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');
  const submitBtn = document.getElementById('submitBtn');

  /* -------------------------------------------------------------------------
     1. STICKY HEADER SCROLL EFFECT
     ------------------------------------------------------------------------- */
  const handleHeaderScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Run on initial load

  /* -------------------------------------------------------------------------
     2. MOBILE MENU TOGGLE
     ------------------------------------------------------------------------- */
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      mobileToggle.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !mobileToggle.contains(e.target) && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* -------------------------------------------------------------------------
     3. SMOOTH SCROLLING & AUTO CLOSE MOBILE MENU
     ------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        // Close mobile drawer if open
        if (mainNav && mainNav.classList.contains('open')) {
          mainNav.classList.remove('open');
          mobileToggle.classList.remove('active');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }

        // Calculate offset position accounting for sticky header
        const headerHeight = header.offsetHeight;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - (headerHeight - 8);

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* -------------------------------------------------------------------------
     4. ACTIVE NAVIGATION LINK HIGHLIGHTING VIA SCROLL OBSERVER
     ------------------------------------------------------------------------- */
  const sectionsToWatch = [
    document.getElementById('our-story'),
    document.getElementById('contact-us')
  ].filter(Boolean);

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sectionsToWatch.forEach((section) => navObserver.observe(section));

  // Clear active state when scrolled back to hero
  window.addEventListener('scroll', () => {
    if (window.scrollY < 200) {
      navLinks.forEach((link) => link.classList.remove('active'));
    }
  }, { passive: true });

  /* -------------------------------------------------------------------------
     5. CONTACT FORM VALIDATION & SUBMISSION HANDLER
     ------------------------------------------------------------------------- */
  if (contactForm) {
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('emailAddress');
    const messageInput = document.getElementById('messageText');

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const setFieldError = (input, isValid, errorElementId) => {
      const formGroup = input.closest('.form-group');
      if (!isValid) {
        formGroup.classList.add('has-error');
      } else {
        formGroup.classList.remove('has-error');
      }
      return isValid;
    };

    // Real-time error clearance
    [fullNameInput, emailInput, messageInput].forEach((input) => {
      if (!input) return;
      input.addEventListener('input', () => {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('has-error');
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = setFieldError(fullNameInput, fullNameInput.value.trim().length > 1, 'nameError');
      const isEmailValid = setFieldError(emailInput, validateEmail(emailInput.value.trim()), 'emailError');
      const isMessageValid = setFieldError(messageInput, messageInput.value.trim().length > 3, 'messageError');

      if (isNameValid && isEmailValid && isMessageValid) {
        // Simulate sending process
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <i class="fa-solid fa-circle-notch fa-spin"></i>
          <span>Sending to Hearth...</span>
        `;

        setTimeout(() => {
          // Success State
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnContent;

          if (formSuccessAlert) {
            formSuccessAlert.classList.add('show');
            formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }

          contactForm.reset();

          // Hide success alert after 7 seconds
          setTimeout(() => {
            if (formSuccessAlert) {
              formSuccessAlert.classList.remove('show');
            }
          }, 7000);
        }, 1100);
      }
    });
  }
});
