import { apiTopRated } from '../../../api/apiTopRatedSeries.js';
import { apiGenre } from '../../../api/apiGenreMovie.js';

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
    first_air_date?: string;
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

export async function populateTopRatedSeriesCarousel(): Promise<void> 
{
    const { results: movies } = await apiTopRated();
    const { genres } = await apiGenre();
    const genreMap = new Map<number, string>(
        genres.map((g: Genre) => [g.id, g.name])
    );
    const carousels = document.querySelectorAll<HTMLElement>('.container-slide');
    const carousel = carousels[4];
    if (!carousel) 
    {
        return;
    }

    movies.forEach((movie: Movie, index: number) => 
    {
        const link = document.createElement('a');
        link.classList.add('vertical-poster');
        link.href = `../../../pages/information.html?id=${movie.id}&type=tv`;

        const picture = document.createElement('picture');
        picture.classList.add('background');
        const img = document.createElement('img');
        img.classList.add('background__img');
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        picture.appendChild(img);
        link.appendChild(picture);

        const topContainer = document.createElement('div');
        topContainer.classList.add('top-container');
        const number = document.createElement('p');
        number.classList.add('top-container__number');
        number.textContent = (index + 1).toString();
        topContainer.appendChild(number);
        link.appendChild(topContainer);

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
        yearText.textContent = (movie.release_date ?? movie.first_air_date ?? '').split('-')[0];
        technicalInfo.appendChild(yearText);
        technicalInfo.appendChild(document.createTextNode(' • '));
        const genresText = document.createElement('p');
        genresText.classList.add('technical-info__text');
        genresText.textContent = movie.genre_ids
            .map((id: number) => genreMap.get(id) || '')
            .join(', ');
        technicalInfo.appendChild(genresText);
        infoContainer.appendChild(technicalInfo);

        link.appendChild(infoContainer);
        carousel.appendChild(link);
    });
}