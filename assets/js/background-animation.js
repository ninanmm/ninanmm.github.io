/**
 * Background Animations
 * Creates floating particles, network nodes, and other animated effects
 */
class BackgroundAnimation {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationId = null;
    this.init();
  }

  init() {
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'background-animation';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
    `;

    // Insert after body but before main content
    document.body.insertBefore(this.canvas, document.body.firstChild);

    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.createParticles();
    this.animate();

    // Handle resize
    window.addEventListener('resize', () => this.resize());
    // Pause animation if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.pause();
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    const particleCount = Math.min(50, Math.max(20, Math.floor(window.innerWidth / 50)));

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        type: Math.random() > 0.5 ? 'node' : 'dot'
      });
    }
  }

  animate() {
    this.clear();
    this.updateParticles();
    this.drawParticles();
    this.drawConnections();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  clear() {
    this.ctx.fillStyle = 'transparent';
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

      // Keep in bounds
      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
    });
  }

  drawParticles() {
    this.particles.forEach((particle) => {
      this.ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  drawConnections() {
    const connectionDistance = 150;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.3;
          this.ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  pause() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  resume() {
    this.animate();
  }
}

// Initialize background animation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.backgroundAnimation = new BackgroundAnimation();
  });
} else {
  window.backgroundAnimation = new BackgroundAnimation();
}
