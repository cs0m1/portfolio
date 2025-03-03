// Blob Movement and Mouse Repulsion Logic
const blobs = document.querySelectorAll('.blob');
const velocities = Array.from(blobs).map(() => ({
  x: (Math.random() - 0.5) * 2,
  y: (Math.random() - 0.5) * 2
}));

const originalVelocities = velocities.map(velocity => ({ ...velocity }));
let mouseX = null;
let mouseY = null;

const effectRadius = 400;
const maxForce = 8;

function moveBlobs() {
  blobs.forEach((blob, index) => {
    const rect = blob.getBoundingClientRect();
    let left = rect.left + velocities[index].x;
    let top = rect.top + velocities[index].y;

    // Gradually return to original speed
    velocities[index].x += (originalVelocities[index].x - velocities[index].x) * 0.01;
    velocities[index].y += (originalVelocities[index].y - velocities[index].y) * 0.01;

    // Bounce off edges
    if (left <= 0) {
      left = 0;
      velocities[index].x *= -1;
      originalVelocities[index].x *= -1;
    } else if (left + rect.width >= window.innerWidth) {
      left = window.innerWidth - rect.width;
      velocities[index].x *= -1;
      originalVelocities[index].x *= -1;
    }

    if (top <= 0) {
      top = 0;
      velocities[index].y *= -1;
      originalVelocities[index].y *= -1;
    } else if (top + rect.height >= window.innerHeight) {
      top = window.innerHeight - rect.height;
      velocities[index].y *= -1;
      originalVelocities[index].y *= -1;
    }

    // Mouse repulsion
    if (mouseX !== null && mouseY !== null) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = centerX - mouseX;
      const distanceY = centerY - mouseY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      if (distance < effectRadius) {
        const force = Math.min(maxForce, effectRadius / (distance ** 2));
        velocities[index].x += (distanceX / distance) * force;
        velocities[index].y += (distanceY / distance) * force;
      }
    }

    blob.style.left = `${left}px`;
    blob.style.top = `${top}px`;
  });

  requestAnimationFrame(moveBlobs);
}

// Track mouse position
document.addEventListener('mousemove', function(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Initialize blobs
document.addEventListener('DOMContentLoaded', function() {
  // Set initial positions for blobs
  blobs.forEach(blob => {
    blob.style.position = 'absolute';
  });

  // Start blob animation
  moveBlobs();

  // Fade in blobs
  const blobsContainer = document.getElementById('blobs');
  blobsContainer.style.opacity = 0;
  setTimeout(() => {
    blobsContainer.style.transition = 'opacity 2s';
    blobsContainer.style.opacity = 1;
  }, 100);

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Form submission prevention (since we don't have a backend)
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Form submission is currently disabled.');
    });
  }
});
