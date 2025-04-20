import { apiTopRated } from '../../../api/apiTopRatedFilm.js';

const carousel: HTMLElement = document.querySelector('.carosello') as HTMLElement;

export const filmHero = async (): Promise<void> => 
{
    const data: any = await apiTopRated();
    const films: any[] = data.results.slice(0, 5);
    const looped: any[] = 
    [
        films[3],
        films[4],
        films[0],
        films[1],
        films[2],
        films[3],
        films[4],
        films[0],
        films[1],
    ];

    carousel.innerHTML = '';

    looped.forEach((film: any) => 
    {
        const banner = document.createElement('a');
        banner.classList.add('carosello__banner');
        banner.href = `../../../pages/information.html?id=${film.id}&type=movie`;

        const img = document.createElement('img');
        const isMobile = window.innerWidth <= 480;
        img.src = isMobile
            ? `https://image.tmdb.org/t/p/w500${film.poster_path}`
            : `https://image.tmdb.org/t/p/w1920${film.backdrop_path}`;
        img.alt = film.title;

        banner.appendChild(img);
        carousel.appendChild(banner);
    });
};

// Re-run the hero setup when crossing the mobile breakpoint
let _lastIsMobile = window.innerWidth <= 480;

window.addEventListener('resize', () => {
  const isMobile = window.innerWidth <= 480;
  if (isMobile !== _lastIsMobile) {
    _lastIsMobile = isMobile;
    filmHero().catch(console.error);
  }
});