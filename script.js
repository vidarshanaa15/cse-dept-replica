// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
  // Initialize all functionality
  initMobileMenu();
  initFacultySearch();
  initContactForm();
  initStatsAnimation();
  initActiveNavigation();
});

// Dark Mode Toggle
const toggleBtn = document.getElementById("darkModeToggle");

// Load saved theme from localStorage
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    toggleBtn.textContent = "☀️"; // show sun when dark mode is active
    // document.getClassName("logo-img").src = "images/logodark.png";
    
    
} else {
    toggleBtn.textContent = "🌙"; // show moon when light mode is active
}

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        toggleBtn.textContent = "☀️"; 
        localStorage.setItem("theme", "dark");
    } else {
        toggleBtn.textContent = "🌙"; 
        localStorage.setItem("theme", "light");
    }
});


// Mobile Navigation Menu Toggle
function initMobileMenu() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    // Close menu when clicking on nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
  }
}

// Faculty Search and Filter Functionality
function initFacultySearch() {
  const searchInput = document.getElementById('facultySearch');
  const filterSelect = document.getElementById('facultyFilter');
  const facultyGrid = document.getElementById('facultyGrid');
  const noResults = document.getElementById('noResults');

  if (!searchInput || !filterSelect || !facultyGrid) return;

  const facultyCards = facultyGrid.querySelectorAll('.faculty-card');

  function filterFaculty() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;
    let visibleCount = 0;

    facultyCards.forEach(card => {
      const name = card.querySelector('h3').textContent.toLowerCase();
      const specialization = card.querySelector('.faculty-specialization').textContent.toLowerCase();
      const position = card.querySelector('.faculty-position').textContent.toLowerCase();
      const cardSpecialization = card.dataset.specialization;

      const matchesSearch = name.includes(searchTerm) ||
        specialization.includes(searchTerm) ||
        position.includes(searchTerm);

      const matchesFilter = filterValue === 'all' || cardSpecialization === filterValue;

      if (matchesSearch && matchesFilter) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Show/hide no results message
    if (visibleCount === 0) {
      noResults.style.display = 'block';
    } else {
      noResults.style.display = 'none';
    }
  }

  searchInput.addEventListener('input', filterFaculty);
  filterSelect.addEventListener('change', filterFaculty);
}

// Contact Form Validation
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (!contactForm) return;

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (validateForm()) {
      // Simulate form submission
      contactForm.style.display = 'none';
      formSuccess.style.display = 'block';

      // Reset form after 5 seconds
      setTimeout(() => {
        contactForm.reset();
        contactForm.style.display = 'block';
        formSuccess.style.display = 'none';
        clearFormErrors();
      }, 5000);
    }
  });

  function validateForm() {
    let isValid = true;
    clearFormErrors();

    // Validate name
    const name = document.getElementById('name');
    if (!name.value.trim()) {
      showFieldError(name, 'Name is required');
      isValid = false;
    } else if (name.value.trim().length < 2) {
      showFieldError(name, 'Name must be at least 2 characters');
      isValid = false;
    }

    // Validate email
    const email = document.getElementById('email');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      showFieldError(email, 'Email is required');
      isValid = false;
    } else if (!emailPattern.test(email.value)) {
      showFieldError(email, 'Please enter a valid email address');
      isValid = false;
    }

    // Validate phone (optional but format check if provided)
    const phone = document.getElementById('phone');
    if (phone.value.trim()) {
      const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phonePattern.test(phone.value.replace(/[\s\-\(\)]/g, ''))) {
        showFieldError(phone, 'Please enter a valid phone number');
        isValid = false;
      }
    }

    // Validate subject
    const subject = document.getElementById('subject');
    if (!subject.value) {
      showFieldError(subject, 'Please select a subject');
      isValid = false;
    }

    // Validate message
    const message = document.getElementById('message');
    if (!message.value.trim()) {
      showFieldError(message, 'Message is required');
      isValid = false;
    } else if (message.value.trim().length < 10) {
      showFieldError(message, 'Message must be at least 10 characters');
      isValid = false;
    }

    return isValid;
  }

  function showFieldError(field, errorMessage) {
    field.classList.add('error');
    const errorSpan = field.parentNode.querySelector('.error-message');
    if (errorSpan) {
      errorSpan.textContent = errorMessage;
    }
  }

  function clearFormErrors() {
    const errorFields = contactForm.querySelectorAll('.error');
    errorFields.forEach(field => {
      field.classList.remove('error');
      field.classList.remove('success');
    });

    const errorMessages = contactForm.querySelectorAll('.error-message');
    errorMessages.forEach(msg => {
      msg.textContent = '';
    });
  }

  // Real-time validation
  const formFields = contactForm.querySelectorAll('input, select, textarea');
  formFields.forEach(field => {
    field.addEventListener('blur', function () {
      validateField(this);
    });

    field.addEventListener('input', function () {
      if (this.classList.contains('error')) {
        validateField(this);
      }
    });
  });

  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (field.id) {
      case 'name':
        if (!value) {
          errorMessage = 'Name is required';
          isValid = false;
        } else if (value.length < 2) {
          errorMessage = 'Name must be at least 2 characters';
          isValid = false;
        }
        break;
      case 'email':
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          errorMessage = 'Email is required';
          isValid = false;
        } else if (!emailPattern.test(value)) {
          errorMessage = 'Please enter a valid email address';
          isValid = false;
        }
        break;
      case 'phone':
        if (value) {
          const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
          if (!phonePattern.test(value.replace(/[\s\-\(\)]/g, ''))) {
            errorMessage = 'Please enter a valid phone number';
            isValid = false;
          }
        }
        break;
      case 'subject':
        if (!value) {
          errorMessage = 'Please select a subject';
          isValid = false;
        }
        break;
      case 'message':
        if (!value) {
          errorMessage = 'Message is required';
          isValid = false;
        } else if (value.length < 10) {
          errorMessage = 'Message must be at least 10 characters';
          isValid = false;
        }
        break;
    }

    if (isValid) {
      field.classList.remove('error');
      field.classList.add('success');
      const errorSpan = field.parentNode.querySelector('.error-message');
      if (errorSpan) {
        errorSpan.textContent = '';
      }
    } else {
      showFieldError(field, errorMessage);
    }

    return isValid;
  }
}

// Animated Statistics Counter
function initStatsAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length === 0) return;

  const animateCounter = (element, target) => {
    const increment = target / 100;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 20);
  };

  // Intersection Observer for triggering animation when stats come into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => {
    observer.observe(stat);
  });
}

// Active Navigation Highlighting
function initActiveNavigation() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Smooth scrolling for anchor links
document.addEventListener('click', function (e) {
  if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
});

// Form field focus effects
document.addEventListener('DOMContentLoaded', function () {
  const formFields = document.querySelectorAll('input, textarea, select');

  formFields.forEach(field => {
    field.addEventListener('focus', function () {
      this.parentNode.classList.add('focused');
    });

    field.addEventListener('blur', function () {
      this.parentNode.classList.remove('focused');
    });
  });
});

// Loading animation for cards
function initLoadingAnimation() {
  const cards = document.querySelectorAll('.highlight-card, .faculty-card, .research-card, .alumni-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
}

// Initialize loading animations
document.addEventListener('DOMContentLoaded', initLoadingAnimation);

// Enhanced search functionality with debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debouncing to faculty search
document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('facultySearch');
  if (searchInput) {
    const debouncedSearch = debounce(function () {
      // Re-trigger the faculty filter function
      const event = new Event('input');
      searchInput.dispatchEvent(event);
    }, 300);

    searchInput.addEventListener('input', debouncedSearch);
  }
});