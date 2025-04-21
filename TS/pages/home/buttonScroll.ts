export function initCarouselControls(): void
{
    const breakpoint = window.innerWidth * 0.05;
    const scrollAmount = window.innerWidth * 0.95;

    document.querySelectorAll<HTMLElement>('.btn-container-left')
    .forEach(leftContainer =>
    {
        const btn = leftContainer.querySelector<HTMLButtonElement>('.btn-container-left__button');
        const carousel = leftContainer.parentElement?.querySelector<HTMLElement>('.container-slide');
        if (!btn || !carousel)
        {
            return;
        }
        carousel.addEventListener('scroll', () =>
        {
            leftContainer.style.display = carousel.scrollLeft > breakpoint ? 'flex' : 'none';
        });
        leftContainer.style.display = carousel.scrollLeft > breakpoint ? 'flex' : 'none';
        btn.addEventListener('click', () =>
        {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
        });
    });

    document.querySelectorAll<HTMLElement>('.btn-container-right')
    .forEach(rightContainer =>
    {
        const btn = rightContainer.querySelector<HTMLButtonElement>('.btn-container-right__button');
        const carousel = rightContainer.parentElement?.querySelector<HTMLElement>('.container-slide');
        if (!btn || !carousel)
        {
            return;
        }
        btn.addEventListener('click', () =>
        {
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    });

    window.addEventListener('resize', () =>
    {
        const newBreakpoint = window.innerWidth * 0.05;
        document.querySelectorAll<HTMLElement>('.btn-container-left')
        .forEach(leftContainer =>
        {
            const carousel = leftContainer.parentElement?.querySelector<HTMLElement>('.container-slide');
            if (carousel)
            {
            leftContainer.style.display = carousel.scrollLeft > newBreakpoint ? 'flex' : 'none';
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initCarouselControls);