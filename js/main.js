// Portland Private Charters — Main JS

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Set active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// Scroll reveal
const revealSelector = '.reveal, .reveal-text, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger';
const revealElements = document.querySelectorAll(revealSelector);
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

// Parallax on hero background
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroHeight = document.querySelector('.hero')?.offsetHeight || 800;
    if (scrolled < heroHeight) {
      heroBg.style.transform = `translateY(${scrolled * 0.35}px)`;
    }
  }, { passive: true });
}

// Parallax on page hero
const pageHeroBg = document.querySelector('.page-hero .hero-bg');
if (pageHeroBg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroHeight = document.querySelector('.page-hero')?.offsetHeight || 500;
    if (scrolled < heroHeight) {
      pageHeroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  }, { passive: true });
}

// Parallax on full-width image bands
document.querySelectorAll('.image-band img').forEach(img => {
  const band = img.closest('.image-band');
  window.addEventListener('scroll', () => {
    const rect = band.getBoundingClientRect();
    const windowH = window.innerHeight;
    if (rect.top < windowH && rect.bottom > 0) {
      const progress = (windowH - rect.top) / (windowH + rect.height);
      img.style.transform = `translateY(${(progress - 0.5) * -60}px) scale(1.08)`;
    }
  }, { passive: true });
});

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    // Close all other items
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
    });
    // Toggle clicked item
    if (!isOpen) {
      item.classList.add('open');
    }
  });
});

// Booking form — AJAX submit + validation
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
  // Set min date to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  // Pre-select tour from URL param (?tour=sunset)
  const tourParam = new URLSearchParams(window.location.search).get('tour');
  if (tourParam) {
    const tourSelect = document.getElementById('tour');
    const tourMap = {
      sunset: 'Sunset Cheese & Wine (Draco) — $800',
      oyster: 'Oyster Farm (Draco) — $1,200'
    };
    const match = tourMap[tourParam];
    if (match) {
      for (const opt of tourSelect.options) {
        if (opt.value === match) { opt.selected = true; break; }
      }
    }
  }

  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const status = document.getElementById('form-status');
    const adults = parseInt(document.getElementById('adults').value) || 0;
    const children = parseInt(document.getElementById('children').value) || 0;

    if (adults + children > 6) {
      status.textContent = 'Maximum 6 guests total (adults + children). Please adjust your group size.';
      status.className = 'error';
      return;
    }
    if (adults < 1) {
      status.textContent = 'At least 1 adult is required.';
      status.className = 'error';
      return;
    }

    const btn = bookingForm.querySelector('.form-submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    fetch(bookingForm.action, {
      method: 'POST',
      body: new FormData(bookingForm),
      headers: { 'Accept': 'application/json' }
    })
    .then(function (r) {
      if (r.ok) {
        status.textContent = 'Thank you! Your booking request has been sent. We\'ll be in touch within 24 hours.';
        status.className = 'success';
        bookingForm.reset();
        if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(function () {
      status.textContent = 'Something went wrong. Please try again or email us directly.';
      status.className = 'error';
    })
    .finally(function () {
      btn.textContent = 'Send Booking Request';
      btn.disabled = false;
    });
  });
}

// Image zoom on scroll for split sections
document.querySelectorAll('.split-image img').forEach(img => {
  window.addEventListener('scroll', () => {
    const rect = img.getBoundingClientRect();
    const windowH = window.innerHeight;
    if (rect.top < windowH && rect.bottom > 0) {
      const progress = (windowH - rect.top) / (windowH + rect.height);
      const scale = 1 + progress * 0.05;
      img.style.transform = `scale(${scale})`;
    }
  }, { passive: true });
});
