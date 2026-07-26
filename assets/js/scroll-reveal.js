/**
 * Scroll Reveal Animation
 * Animates elements as they come into view
 */
class ScrollReveal {
  constructor() {
    this.elements = document.querySelectorAll('[data-animate]');
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.setupObserver();
    } else {
      // Fallback for older browsers
      this.animateAll();
    }
  }

  setupObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    this.elements.forEach((el) => observer.observe(el));
  }

  animateElement(element) {
    const animationType = element.getAttribute('data-animate');
    element.classList.add(`animate-${animationType}`);
  }

  animateAll() {
    this.elements.forEach((el) => this.animateElement(el));
  }
}

// Initialize scroll reveal
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ScrollReveal();
  });
} else {
  new ScrollReveal();
}
