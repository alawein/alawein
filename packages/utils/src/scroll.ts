// Smooth scroll utilities for anchor links and programmatic scrolling

/**
 * Initialize smooth scrolling behavior for anchor links
 */
export const initSmoothScroll = () => {
  // Add smooth scrolling behavior to anchor links
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a[href^="#"]') as HTMLAnchorElement;

    if (!link) return;

    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    e.preventDefault();

    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    // Update URL without triggering navigation
    if (history.pushState) {
      history.pushState(null, '', targetId);
    }

    // Focus the target element for accessibility
    const focusableElement = targetElement as HTMLElement;
    if (focusableElement.focus) {
      focusableElement.focus();
    }
  });
};

/**
 * Scroll to element with smooth animation
 */
export const scrollToElement = (elementId: string, offset: number = 0) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const elementPosition = element.offsetTop - offset;

  window.scrollTo({
    top: elementPosition,
    behavior: 'smooth'
  });
};

/**
 * Scroll to top of page
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};
