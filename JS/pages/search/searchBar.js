import { apiMovie } from "../../api/apiMovie.js";
import { apiGenre } from "../../api/apiGenre.js";
import { apiSeries } from "../../api/apiSeries.js";

export const liveSearch = async ()  => 
{
    await new Promise(resolve => 
    {
        if (document.readyState === "complete" || document.readyState === "interactive") 
        {
            resolve();
        } else 
        {
            document.addEventListener('DOMContentLoaded', resolve);
        }
    });

    const genres = (await apiGenre()).genres;
    const totalPages = 32;
    let allMovies = [];
    let currentPage = 1;
    let isLoading = false;
    let allSeries = [];
    let currentSeriesPage = 1;

    const searchBar = document.querySelector('.search-container__search-bar');
    const resultContainer = document.querySelector('.grid-result');

    if (!searchBar || !resultContainer) 
    {
        console.error('Elementi della search bar o result non trovati.');
        return;
    }

    function createCard(item, type = "movie") 
    {
        const card = document.createElement('div');
        card.classList.add('card');

        const poster = document.createElement('div');
        poster.classList.add('poster');
        if (item.backdrop_path) 
        {
            const img = document.createElement('img');
            img.src = 'https://image.tmdb.org/t/p/w500' + item.backdrop_path;
            poster.appendChild(img);
        }

        const titleEl = document.createElement('h1');
        titleEl.textContent = type === "movie" ? item.title || "Titolo non disponibile" : item.name || "Titolo non disponibile";

        const cardInfo = document.createElement('div');
        cardInfo.classList.add('card__info');

        const pEta = document.createElement('p');
        pEta.classList.add('card__info--text');
        pEta.textContent = item.adult ? "18+" : "10+";

        const pAnno = document.createElement('p');
        pAnno.classList.add('card__info--text');
        const date = type === "movie" ? item.release_date : item.first_air_date;
        pAnno.textContent = date ? date.slice(0, 4) : "Anno non disponibile";

        const pGeneri = document.createElement('p');
        pGeneri.classList.add('card__info--text');
        if (item.genre_ids && item.genre_ids.length > 0) {
            const genreNames = item.genre_ids.map(id => {
                const foundGenre = genres.find(genre => genre.id === id);
                return foundGenre ? foundGenre.name : '';
            }).filter(name => name !== '');
            pGeneri.textContent = genreNames.length > 0 ? genreNames.join(', ') : "Genere non disponibile";
        } else {
            pGeneri.textContent = "Genere non disponibile";
        }

        cardInfo.appendChild(pEta);
        cardInfo.appendChild(pAnno);
        cardInfo.appendChild(pGeneri);

        card.appendChild(poster);
        card.appendChild(titleEl);
        card.appendChild(cardInfo);

        return card;
    }

    async function loadMoreMovies() {
        if (isLoading || currentPage > totalPages) return;
        isLoading = true;
        const data = await apiMovie(currentPage);
        allMovies.push(...data.results);
        data.results.forEach(movie => {
            const card = createCard(movie);
            resultContainer.appendChild(card);
        });
        currentPage++;
        isLoading = false;
    }

    async function loadMoreSeries() {
        if (isLoading || currentSeriesPage > totalPages) return;
        isLoading = true;
        const data = await apiSeries(currentSeriesPage);
        allSeries.push(...data.results);
        data.results.forEach(series => {
            const card = createCard(series, "series");
            resultContainer.appendChild(card);
        });
        currentSeriesPage++;
        isLoading = false;
    }

    while (currentPage <= totalPages) {
        await loadMoreMovies();
    }

    while (currentSeriesPage <= totalPages) {
        await loadMoreSeries();
    }

    function renderFilteredMovies(query) {
        const filteredMovies = allMovies.filter(movie => 
        {
            const titleMatch = movie.title.toLowerCase().includes(query);
            
            let genreMatch = false;
            if (movie.genre_ids && movie.genre_ids.length > 0) {
                const genreNames = movie.genre_ids.map(id => {
                    const foundGenre = genres.find(genre => genre.id === id);
                    return foundGenre ? foundGenre.name.toLowerCase() : '';
                });
                genreMatch = genreNames.some(name => name.includes(query));
            }
            
            return titleMatch || genreMatch;
        });

        resultContainer.innerHTML = '';
        filteredMovies.forEach(movie => 
        {
            const card = createCard(movie);
            resultContainer.appendChild(card);
        });
    }

    function renderFilteredSeries(query) {
        const filteredSeries = allSeries.filter(series => {
            const titleMatch = series.name.toLowerCase().includes(query);
            let genreMatch = false;
            if (series.genre_ids && series.genre_ids.length > 0) {
                const genreNames = series.genre_ids.map(id => {
                    const foundGenre = genres.find(genre => genre.id === id);
                    return foundGenre ? foundGenre.name.toLowerCase() : '';
                });
                genreMatch = genreNames.some(name => name.includes(query));
            }
            return titleMatch || genreMatch;
        });

        resultContainer.innerHTML = '';
        filteredSeries.forEach(series => {
            const card = createCard(series, "series");
            resultContainer.appendChild(card);
        });
    }

    searchBar.addEventListener('input', async () => 
    {
        const query = searchBar.value.toLowerCase();
        renderFilteredMovies(query);
        renderFilteredSeries(query);
    });

    searchBar.dispatchEvent(new Event('input'));
};