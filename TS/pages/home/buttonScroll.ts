export function initCarouselControls(): void {
  const breakpoint = window.innerWidth * 0.05; // 5vw
  const scrollAmount = window.innerWidth * 0.95; // 95vw

  // Initialize left button per carousel
  document.querySelectorAll<HTMLElement>('.btn-container-left').forEach(leftContainer => {
    const btn = leftContainer.querySelector<HTMLButtonElement>('.btn-container-left__button');
    // assume .container-slide is sibling of button container
    const carousel = leftContainer.parentElement?.querySelector<HTMLElement>('.container-slide');
    if (!btn || !carousel) return;

    // Update visibility on scroll
    carousel.addEventListener('scroll', () => {
      leftContainer.style.display = carousel.scrollLeft > breakpoint ? 'flex' : 'none';
    });
    // Initial check
    leftContainer.style.display = carousel.scrollLeft > breakpoint ? 'flex' : 'none';

    // Scroll to start on click
    btn.addEventListener('click', () => {
      carousel.scrollTo({ left: 0, behavior: 'smooth' });
    });
  });

  // Initialize right button per carousel
  document.querySelectorAll<HTMLElement>('.btn-container-right').forEach(rightContainer => {
    const btn = rightContainer.querySelector<HTMLButtonElement>('.btn-container-right__button');
    const carousel = rightContainer.parentElement?.querySelector<HTMLElement>('.container-slide');
    if (!btn || !carousel) return;

    btn.addEventListener('click', () => {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  });

  // Update on resize
  window.addEventListener('resize', () => {
    const newBreakpoint = window.innerWidth * 0.05;
    const newScrollAmt = window.innerWidth * 0.95;
    document.querySelectorAll<HTMLElement>('.btn-container-left').forEach(leftContainer => {
      const carousel = leftContainer.parentElement?.querySelector<HTMLElement>('.container-slide');
      if (carousel) {
        leftContainer.style.display = carousel.scrollLeft > newBreakpoint ? 'flex' : 'none';
      }
    });
    // Update scrollAmount variable in closures if needed
  });
}

// Auto init
document.addEventListener('DOMContentLoaded', initCarouselControls);