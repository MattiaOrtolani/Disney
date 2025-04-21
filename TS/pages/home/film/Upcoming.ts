import { apiUpcoming } from '../../../api/apiUpcomingFilm.js';
import { apiGenreMovie } from '../../../api/apiGenreMovie.js';

let genreMapGlobal: Map<number, string>;

interface Movie
{
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

interface Genre
{
    id: number;
    name: string;
}

export async function populateUpcomingFilmCarousel(): Promise<void>
{
    const { results: movies } = await apiUpcoming();
    const { genres } = await apiGenreMovie();
    const genreMap = new Map<number, string>(genres.map((g: Genre) => [g.id, g.name]));
    genreMapGlobal = genreMap;
    const carousels = document.querySelectorAll<HTMLElement>('.container-slide');
    const carousel = carousels[0];
    if (!carousel)
    {
        return;
    }

    movies.forEach((movie: Movie, index: number) =>
    {
        const link = createMovieLink(movie);
        const info = createMovieInfo(movie);
        carousel.appendChild(link);
        link.appendChild(info);
    });
}

function createMovieLink(movie: Movie): HTMLAnchorElement
{
    const link = document.createElement('a');
    link.classList.add('vertical-poster');
    link.href = `../../../pages/information.html?id=${movie.id}&type=movie`;

    const picture = document.createElement('picture');
    picture.classList.add('background');
    const img = document.createElement('img');
    img.classList.add('background__img');
    img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    picture.appendChild(img);
    link.appendChild(picture);

    return link;
}

function createMovieInfo(movie: Movie): HTMLDivElement
{
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('info-container');

    const featuresInfo = document.createElement('div');
    featuresInfo.classList.add('features-info');
    const featuresText = document.createElement('p');
    featuresText.classList.add('features-info__text');
    featuresText.textContent = movie.adult ? '18+' : '16+';
    featuresInfo.appendChild(featuresText);
    infoContainer.appendChild(featuresInfo);

    const technicalInfo = document.createElement('div');
    technicalInfo.classList.add('technical-info');
    const yearText = document.createElement('p');
    yearText.classList.add('technical-info__text');
    yearText.textContent = movie.release_date.split('-')[0];
    technicalInfo.appendChild(yearText);
    technicalInfo.appendChild(document.createTextNode(' • '));
    const genresText = document.createElement('p');
    genresText.classList.add('technical-info__text');
    genresText.textContent = movie.genre_ids
        .map(id => genreMapGlobal.get(id) || '')
        .join(', ');
    technicalInfo.appendChild(genresText);
    infoContainer.appendChild(technicalInfo);

    return infoContainer;
}