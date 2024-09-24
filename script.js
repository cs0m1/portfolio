// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  
  // Typing Animation
  const typedText = document.querySelector('.typing-animation');
  const phrases = [
    'I like coding.',
    'I love gaming.',
    'I love cats.',
    'I am a rock climber, especially bouldering.',
    'I also love hiking.'
  ];
  let phraseIndex = 0;
  let letterIndex = 0;
  let currentPhrase = '';
  let isDeleting = false;
  let isEnd = false;
  
  function typeAnimation() {
    if (phraseIndex < phrases.length) {
      if (!isDeleting && letterIndex <= phrases[phraseIndex].length) {
        currentPhrase = phrases[phraseIndex].substring(0, letterIndex++);
        typedText.textContent = currentPhrase;
      }
  
      if (isDeleting && letterIndex <= phrases[phraseIndex].length) {
        currentPhrase = phrases[phraseIndex].substring(0, letterIndex--);
        typedText.textContent = currentPhrase;
      }
  
      if (letterIndex === phrases[phraseIndex].length) {
        isEnd = true;
        isDeleting = true;
      }
  
      if (isDeleting && letterIndex === 0) {
        currentPhrase = '';
        isDeleting = false;
        isEnd = false;
        phraseIndex++;
        if (phraseIndex === phrases.length) {
          phraseIndex = 0;
        }
      }
    }
    const speed = isEnd ? 2000 : isDeleting ? 50 : 100;
    setTimeout(typeAnimation, speed);
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    typeAnimation();
  });
  