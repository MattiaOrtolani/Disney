import { apiNews } from '../../../api/apiNews.js';

const filmCarosello: HTMLElement = document.querySelector('.container-slide') as HTMLElement;

export const filmSection = async (): Promise<void> =>
{
    const data: any = await apiNews();

    data.results.forEach((film: any) =>
    {
        const poster = document.createElement('a');
        poster.classList.add('poster');
        poster.href = `../../../pages/information.html?id=${film.id}&type=movie`;
        poster.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${film.backdrop_path}')`;
        poster.style.backgroundSize = 'cover';
        poster.style.backgroundPosition = 'center';

        filmCarosello.appendChild(poster);
    });
};