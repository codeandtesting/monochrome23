// Glass Morphism Interactive Effects

/**
 * Adds 3D tilt effect to glass cards on mouse move
 * @param {HTMLElement} card - The card element to add effect to
 * @param {number} intensity - Rotation intensity (default: 10)
 */
export const addTiltEffect = (card, intensity = 10) => {
  if (!card) return;

  const glow = card.querySelector('.glass-glow');

  const handleMouseMove = (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set CSS custom properties for glow position
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);

    // Calculate rotation based on mouse position
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * intensity;
    const rotateY = ((x - centerX) / centerX) * -intensity;

    // Apply 3D transform
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    // Update gradient angle based on rotation
    const angle = 135 + rotateX - rotateY;
    card.style.setProperty('--angle', `${angle}deg`);
  };

  const handleMouseLeave = () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    card.style.setProperty('--angle', `135deg`);
  };

  card.addEventListener('mousemove', handleMouseMove);
  card.addEventListener('mouseleave', handleMouseLeave);

  // Return cleanup function
  return () => {
    card.removeEventListener('mousemove', handleMouseMove);
    card.removeEventListener('mouseleave', handleMouseLeave);
  };
};

/**
 * Initialize tilt effects for all cards with specific class
 * @param {string} selector - CSS selector for cards
 * @param {number} intensity - Rotation intensity
 */
export const initializeGlassCards = (selector = '.glass-feature-card', intensity = 10) => {
  const cards = document.querySelectorAll(selector);
  const cleanupFunctions = [];

  cards.forEach(card => {
    const cleanup = addTiltEffect(card, intensity);
    if (cleanup) cleanupFunctions.push(cleanup);
  });

  // Return cleanup function for all cards
  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
};

/**
 * Add shimmer effect on hover
 * @param {HTMLElement} element - Element to add shimmer to
 */
export const addShimmerEffect = (element) => {
  if (!element) return;

  const shimmer = document.createElement('div');
  shimmer.className = 'glass-shimmer';
  element.style.position = 'relative';
  element.appendChild(shimmer);
};

/**
 * Parallax effect for floating elements
 * @param {string} selector - CSS selector for elements
 * @param {number} intensity - Movement intensity
 */
export const addParallaxEffect = (selector, intensity = 0.05) => {
  const elements = document.querySelectorAll(selector);

  const handleMouseMove = (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;

    elements.forEach((element, index) => {
      const speed = (index + 1) * intensity;
      const x = mouseX * speed * 100;
      const y = mouseY * speed * 100;

      element.style.transform = `translate(${x}px, ${y}px)`;
    });
  };

  window.addEventListener('mousemove', handleMouseMove);

  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
  };
};

/**
 * Magnetic button effect
 * @param {HTMLElement} button - Button element
 * @param {number} strength - Magnetic strength
 */
export const addMagneticEffect = (button, strength = 20) => {
  if (!button) return;

  const handleMouseMove = (e) => {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < 1.5) {
      const x = deltaX * strength;
      const y = deltaY * strength;
      button.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    }
  };

  const handleMouseLeave = () => {
    button.style.transform = `translate(0px, 0px) scale(1)`;
  };

  button.addEventListener('mousemove', handleMouseMove);
  button.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    button.removeEventListener('mousemove', handleMouseMove);
    button.removeEventListener('mouseleave', handleMouseLeave);
  };
};

/**
 * Smooth scroll reveal animation for glass cards
 * @param {string} selector - CSS selector for cards
 */
export const addScrollReveal = (selector = '.glass-card') => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  const elements = document.querySelectorAll(selector);
  elements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(element);
  });

  return () => {
    observer.disconnect();
  };
};
