document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('blobCanvas');
  const ctx = canvas.getContext('2d');
  
  // Performance optimization
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Initialize blobs array
  let blobs = [];
  
  // Define colors with adjusted opacity for mobile
  const blobColors = [
    ['rgba(0, 183, 255, 0.5)', 'rgba(0, 140, 255, 0.25)', 'rgba(0, 102, 204, 0.02)'],
    ['rgba(0, 191, 255, 0.5)', 'rgba(0, 150, 255, 0.25)', 'rgba(0, 112, 224, 0.02)'],
    ['rgba(0, 170, 255, 0.5)', 'rgba(0, 130, 255, 0.25)', 'rgba(0, 92, 184, 0.02)'],
    ['rgba(0, 160, 255, 0.5)', 'rgba(0, 120, 255, 0.25)', 'rgba(0, 82, 164, 0.02)'],
    ['rgba(0, 150, 255, 0.5)', 'rgba(0, 110, 255, 0.25)', 'rgba(0, 72, 144, 0.02)']
  ];

  // Throttle helper
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  // Blob class
  class Blob {
    constructor(colors, width, height) {
      this.radius = 300;
      this.colors = colors;
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 1.2;
      this.vy = (Math.random() - 0.5) * 1.2;
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
      gradient.addColorStop(0, this.colors[0]);
      gradient.addColorStop(0.4, this.colors[1]);
      gradient.addColorStop(1, this.colors[2]);

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    update(canvasWidth, canvasHeight) {
      // Update position with smoother movement
      this.x += this.vx * 0.8;
      this.y += this.vy * 0.8;

      // Gentle boundary handling
      const margin = -this.radius * 0.5;
      if (this.x - this.radius <= margin) {
        this.x = this.radius + margin;
        this.vx = Math.abs(this.vx) * 0.8;
        this.originalSpeed.x = Math.abs(this.originalSpeed.x) * 0.8;
      } else if (this.x + this.radius >= canvasWidth - margin) {
        this.x = canvasWidth - this.radius - margin;
        this.vx = -Math.abs(this.vx) * 0.8;
        this.originalSpeed.x = -Math.abs(this.originalSpeed.x) * 0.8;
      }

      if (this.y - this.radius <= margin) {
        this.y = this.radius + margin;
        this.vy = Math.abs(this.vy) * 0.8;
        this.originalSpeed.y = Math.abs(this.originalSpeed.y) * 0.8;
      } else if (this.y + this.radius >= canvasHeight - margin) {
        this.y = canvasHeight - this.radius - margin;
        this.vy = -Math.abs(this.vy) * 0.8;
        this.originalSpeed.y = -Math.abs(this.originalSpeed.y) * 0.8;
      }

      // Gentle mouse repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const repulsionRadius = 250;
        
        if (distance < repulsionRadius) {
          const force = (1 - distance / repulsionRadius) * 0.6;
          const angle = Math.atan2(dy, dx);
          
          this.vx += Math.cos(angle) * force;
          this.vy += Math.sin(angle) * force;
          
          // Subtle randomness
          this.vx += (Math.random() - 0.5) * 0.05;
          this.vy += (Math.random() - 0.5) * 0.05;
        }
      }

      // Very gradual return to original speed
      this.vx += (this.originalSpeed.x - this.vx) * 0.003;
      this.vy += (this.originalSpeed.y - this.vy) * 0.003;
    }
  }

  function initializeBlobs() {
    const count = isMobile ? 3 : 5;
    const baseSize = isMobile ? 200 : 300;
    const sizeIncrement = isMobile ? 30 : 40;
    const baseSpeedFactor = isMobile ? 0.3 : 0.4;
    const speedDecrement = isMobile ? 0.05 : 0.04;

    blobs = Array(count).fill().map((_, i) => {
      const blob = new Blob(blobColors[i], canvas.width, canvas.height);
      blob.radius = baseSize + (i * sizeIncrement);
      const speedFactor = baseSpeedFactor - (i * speedDecrement);
      blob.vx *= speedFactor;
      blob.vy *= speedFactor;
      blob.originalSpeed.x = blob.vx;
      blob.originalSpeed.y = blob.vy;
      return blob;
    }).reverse();
  }

  // Throttled resize handler
  const resizeCanvas = throttle(function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeBlobs();
  }, isMobile ? 500 : 200); // Longer throttle on mobile

  // Mouse tracking with throttling
  const mouse = { x: null, y: null };
  document.addEventListener('mousemove', throttle((e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, 16)); // ~60fps
  
  document.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Animation loop with performance adjustments and device-specific settings
  let lastTime = 0;
  function animate(currentTime) {
    if (!lastTime) lastTime = currentTime;
    const deltaTime = currentTime - lastTime;
    
    // Limit updates on mobile or skip frames if performance drops
    if (!isMobile || deltaTime > 16.67) { // ~60fps or slower on mobile
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Adjust blur based on device
      ctx.filter = `blur(${isMobile ? '100px' : '140px'})`;
      blobs.forEach(blob => {
        blob.update(canvas.width, canvas.height);
        blob.draw();
      });
      ctx.filter = 'none';
      
      lastTime = currentTime;
    }
    
    requestAnimationFrame(animate);
  }

  // Initialize blobs and start animation
  resizeCanvas();
  requestAnimationFrame(animate);
  
  // Add loaded class after initial frame is drawn
  requestAnimationFrame(() => {
    setTimeout(() => {
      canvas.classList.add('loaded');
    }, 300); // Delay to ensure smooth transition
  });
  
  window.addEventListener('resize', resizeCanvas);

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
