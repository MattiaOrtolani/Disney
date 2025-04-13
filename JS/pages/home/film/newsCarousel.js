import { apiNews } from '../../../api/apiNews.js';

const filmCarosello = document.querySelector('.continaer-slide');        

export const filmSection = async () =>
{
    const data = await apiNews();

    data.results.forEach(film =>
    {
        const cardHtml = `
            <a class="poster" href="../../../pages/information.html?id=${film.id}&type=movie">
                <img src="https://image.tmdb.org/t/p/w500${film.backdrop_path}" alt="${film.title}">
            </a>
        `;
        filmCarosello.insertAdjacentHTML('beforeend', cardHtml);
    });
};