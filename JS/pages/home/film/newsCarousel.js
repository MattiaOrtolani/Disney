import { apiNews } from '../../../api/apiNews.js';

const filmCarosello = document.querySelector('.film-carosello');        

export const filmSection = async () => {
    const data = await apiNews();
    data.results.forEach(film => {
        const cardHtml = `
            <div class="poster">
                <img src="https://image.tmdb.org/t/p/w500${film.backdrop_path}" alt="${film.title}">
            </div>
        `;
        filmCarosello.innerHTML += cardHtml;
    });
};