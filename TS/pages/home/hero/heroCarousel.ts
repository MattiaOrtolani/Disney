import { apiPopular } from '../../../api/apiPopular.js';

const carousel: HTMLElement = document.querySelector('.carosello') as HTMLElement;

export const filmHero = async (): Promise<void> => 
{
    const data: any = await apiPopular();
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
        banner.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w1920${film.backdrop_path}" alt="${film.title}">
            <h1>${film.title}</h1>
        `;
        carousel.appendChild(banner);
    });
};