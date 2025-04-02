import { apiFilmHero } from '../../services/apiFilmHero.js';

const carouselBanner = document.querySelectorAll('.carosello__banner');

export const filmHero = async () => 
{
    const data = await apiFilmHero();
    data.results.slice(0, 5).forEach((film, index) =>
    {
        const cardHtml = `
        <img src="https://image.tmdb.org/t/p/w1920${film.backdrop_path}" alt="${film.title}">
        <div>
            <h2>${film.title}</h2>
            <p>voto medio: ${film.vote_average}</p>
        </div>
        `;
        carouselBanner[index].innerHTML = cardHtml;
    })
};