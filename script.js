// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Typing Animation Function
function typeAnimation(element) {
  const phrases = JSON.parse(element.getAttribute('data-phrases'));
  const typeSpeed = parseInt(element.getAttribute('data-type-speed')) || 100;
  const deleteSpeed = parseInt(element.getAttribute('data-delete-speed')) || 50;
  const showCursor = element.getAttribute('data-cursor') === 'true';

  if (showCursor) {
    element.classList.add('typing-cursor');
  }

  let phraseIndex = 0;
  let letterIndex = 0;
  let isDeleting = false;

  function type() {
    const currentPhrase = phrases[phraseIndex];
    let displayedText = currentPhrase.substring(0, letterIndex);

    element.textContent = displayedText;

    if (!isDeleting) {
      if (letterIndex < currentPhrase.length) {
        letterIndex++;
        setTimeout(type, typeSpeed);
      } else {
        isDeleting = true;
        setTimeout(type, 2000); // Pause before deleting
      }
    } else {
      if (letterIndex > 0) {
        letterIndex--;
        setTimeout(type, deleteSpeed);
      } else {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 500); // Pause before typing next phrase
      }
    }
  }

  type();
}

// Initialize Typing Animation
document.addEventListener('DOMContentLoaded', function() {
  const typingElement = document.querySelector('.typing-animation');
  typeAnimation(typingElement);
});

// Blob Movement and Mouse Repulsion Logic
const blobs = document.querySelectorAll('.blob');
const velocities = Array.from(blobs).map(() => ({
  x: (Math.random() - 0.5) * 4,
  y: (Math.random() - 0.5) * 4
}));

const originalVelocities = velocities.map(velocity => ({ ...velocity }));
let mouseX = null;
let mouseY = null;

const effectRadius = 800; // Increased effect radius
const maxForce = 10; // Maximum force applied to blobs

function moveBlobs() {
  blobs.forEach((blob, index) => {
    const rect = blob.getBoundingClientRect();
    let left = rect.left + velocities[index].x;
    let top = rect.top + velocities[index].y;

    // Gradually slow down the blobs to their original speed
    velocities[index].x += (originalVelocities[index].x - velocities[index].x) * 0.01;
    velocities[index].y += (originalVelocities[index].y - velocities[index].y) * 0.01;

    // Bounce blobs off edges
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

    // Apply repulsion force if mouse is within range
    if (mouseX !== null && mouseY !== null) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = centerX - mouseX;
      const distanceY = centerY - mouseY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      if (distance < effectRadius) { // Effect radius
        let force = Math.min(maxForce, effectRadius / (distance ** 2)); // Cap the force
        if (distance < 1) distance = 1; // Avoid division by zero

        velocities[index].x += (distanceX / distance) * force;
        velocities[index].y += (distanceY / distance) * force;
      }
    }

    blob.style.left = `${left}px`;
    blob.style.top = `${top}px`;
  });

  requestAnimationFrame(moveBlobs);
}

// Update mouse position on mousemove
document.addEventListener('mousemove', function(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Set initial positions and styles for blobs
blobs.forEach(blob => {
  blob.style.position = 'absolute';
});

moveBlobs();


// Hide the div with id 'blobs' and then make it visible slowly after 2 seconds
const blobsContainer = document.getElementById('blobs');
blobsContainer.style.opacity = 0;

setTimeout(() => {
  blobsContainer.style.transition = 'opacity 2s';
  blobsContainer.style.opacity = 2;
}, 100);


