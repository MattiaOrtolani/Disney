import { apiNews } from '../../../api/apiNews.js';

const filmCarosello: HTMLElement = document.querySelector('.continaer-slide') as HTMLElement;

export const filmSection = async (): Promise<void> =>
{
    const data: any = await apiNews();

    data.results.forEach((film: any) =>
    {
        const cardHtml: string = `
            <a class="poster" href="../../../pages/information.html?id=${film.id}&type=movie">
                <img src="https://image.tmdb.org/t/p/w500${film.backdrop_path}" alt="${film.title}">
            </a>
        `;
        filmCarosello.insertAdjacentHTML('beforeend', cardHtml);
    });
};