import { apiPopular } from '../../../api/apiPopular.js';

const carousel = document.querySelector('.carosello');

export const filmHero = async () => 
{
    const data = await apiPopular();
    const films = data.results.slice(0, 5);

    const looped = 
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

    looped.forEach((film) => 
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