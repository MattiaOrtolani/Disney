import { apiPopular } from '../../../api/apiPopularFilm.js';

interface Movie 
{
    id: number;
    backdrop_path: string;
}

// Popola dinamicamente le card del primo carosello
export async function populatePopularFilmCarousel(): Promise<void> 
{
    const { results: movies } = await apiPopular();
    const carousels = document.querySelectorAll<HTMLElement>('.container-slide');
    const carousel = carousels[2];
    if (!carousel) return;

    movies.forEach((movie: Movie, index: number) => 
    {
        const horizontalPoster = document.createElement('a');
        horizontalPoster.classList.add('horizontal-poster');
        horizontalPoster.href = `../../../pages/information.html?id=${movie.id}&type=movie`;
        horizontalPoster.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${movie.backdrop_path}')`;
        horizontalPoster.style.backgroundSize = 'cover';
        horizontalPoster.style.backgroundPosition = 'center';

        carousel.appendChild(horizontalPoster);
    });
}