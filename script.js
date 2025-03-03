document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('blobCanvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas size to match parent (landing section)
  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Blob class
  class Blob {
    constructor() {
      this.radius = 150;
      this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
      this.y = Math.random() * (canvas.height - this.radius * 2) + this.radius;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.originalSpeed = {
        x: this.vx,
        y: this.vy
      };
    }

    draw() {
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.radius
      );
      gradient.addColorStop(0, 'rgba(0, 183, 255, 0.6)');
      gradient.addColorStop(1, 'rgba(0, 102, 204, 0.1)');

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    update() {
      // Update position
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off boundaries with margin
      const margin = 50;
      if (this.x - this.radius <= margin) {
        this.x = this.radius + margin;
        this.vx = Math.abs(this.vx);
        this.originalSpeed.x = Math.abs(this.originalSpeed.x);
      } else if (this.x + this.radius >= canvas.width - margin) {
        this.x = canvas.width - this.radius - margin;
        this.vx = -Math.abs(this.vx);
        this.originalSpeed.x = -Math.abs(this.originalSpeed.x);
      }

      if (this.y - this.radius <= margin) {
        this.y = this.radius + margin;
        this.vy = Math.abs(this.vy);
        this.originalSpeed.y = Math.abs(this.originalSpeed.y);
      } else if (this.y + this.radius >= canvas.height - margin) {
        this.y = canvas.height - this.radius - margin;
        this.vy = -Math.abs(this.vy);
        this.originalSpeed.y = -Math.abs(this.originalSpeed.y);
      }

      // Mouse repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const repulsionRadius = 200;
        
        if (distance < repulsionRadius) {
          const force = (1 - distance / repulsionRadius) * 0.8;
          const angle = Math.atan2(dy, dx);
          
          this.vx += Math.cos(angle) * force;
          this.vy += Math.sin(angle) * force;
          
          // Add slight randomness
          this.vx += (Math.random() - 0.5) * 0.2;
          this.vy += (Math.random() - 0.5) * 0.2;
        }
      }

      // Gradually return to original speed
      this.vx += (this.originalSpeed.x - this.vx) * 0.01;
      this.vy += (this.originalSpeed.y - this.vy) * 0.01;
    }
  }

  // Create blobs
  const blobs = Array(8).fill().map(() => new Blob());
  
  // Mouse tracking
  const mouse = { x: null, y: null };
  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  
  canvas.parentElement.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw blobs with blur effect
    ctx.filter = 'blur(50px)';
    blobs.forEach(blob => {
      blob.update();
      blob.draw();
    });
    ctx.filter = 'none';
    
    requestAnimationFrame(animate);
  }

  animate();

  // Smooth scroll for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Form submission prevention
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Form submission is currently disabled.');
    });
  }
});
