import { apiMovie } from "../../api/apiMovie.js";
import { apiSeries } from "../../api/apiSeries.js";
import { apiGenre } from "../../api/apiGenre.js";

export async function initInformationPage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        console.error("ID non presente nell'URL");
        return;
    }

    const genres = (await apiGenre()).genres;

    let data = null;
    let type = 'movie';
    const totalPages = 32;

    // Cerca tra i film
    for (let page = 1; page <= totalPages; page++) {
        const pageData = await apiMovie(page);
        const found = pageData.results.find(item => item.id == id);
        if (found) {
            data = found;
            type = 'movie';
            break;
        }
    }

    // Se non trovato, cerca tra le serie
    if (!data) {
        for (let page = 1; page <= totalPages; page++) {
            const pageData = await apiSeries(page);
            const found = pageData.results.find(item => item.id == id);
            if (found) {
                data = found;
                type = 'series';
                break;
            }
        }
    }

    if (!data) {
        console.error("Nessun film o serie trovato con questo ID");
        return;
    }

    const container = document.querySelector('.information-container');
    if (container && data.backdrop_path) {
        container.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${data.backdrop_path})`;
    }

    // Popola il titolo
    const titleElement = document.querySelector('.information__title');
    if (titleElement) {
        titleElement.textContent = data.title || data.name || "Titolo non disponibile";
    }

    // Popola la descrizione
    const descriptionElement = document.querySelector('.information__description');
    if (descriptionElement) {
        descriptionElement.textContent = data.overview || "Descrizione non disponibile.";
    }

    // Popola features-info: voto medio e età
    const featuresInfo = document.querySelectorAll('.features-info__text');
    if (featuresInfo.length >= 2) {
        const voto = data.vote_average ? data.vote_average.toFixed(1) : "N/A";
        const eta = data.adult ? ">18" : "<18";
        featuresInfo[0].textContent = voto;
        featuresInfo[1].textContent = eta;
    }

    // Popola technical-info: anno e generi
    const technicalInfo = document.querySelectorAll('.technical-info__text');
    if (technicalInfo.length >= 2) {
        const dataUscita = data.release_date || data.first_air_date || "";
        const anno = dataUscita.split("-")[0] || "Anno non disponibile";
        technicalInfo[0].textContent = anno;

        if (data.genre_ids && genres.length > 0) {
            const genreNames = data.genre_ids.map(id => {
                const genre = genres.find(g => g.id === id);
                return genre ? genre.name : null;
            }).filter(Boolean);
            technicalInfo[1].textContent = genreNames.length > 0 ? genreNames.join(", ") : "Genere non disponibile";
        } else {
            technicalInfo[1].textContent = "Genere non disponibile";
        }
    }

    // Popola raccomandazioni nella grid-result
    const grid = document.querySelector('.grid-result');
    if (grid && data.genre_ids) {
        const targetGenres = data.genre_ids;
        const totalPages = 10;

        function hasCommonGenres(itemGenres) {
            return itemGenres.some(id => targetGenres.includes(id));
        }

        function createPosterCard(item) {
            if (!item.backdrop_path || item.id === data.id) return null;

            const link = document.createElement('a');
            link.classList.add('poster');
            link.href = `../../../pages/information.html?id=${item.id}`;
            link.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${item.backdrop_path})`;
            link.style.backgroundSize = 'cover';
            link.style.display = 'block';
            link.style.aspectRatio = '16/9';
            return link;
        }

        (async () => {
            for (let page = 1; page <= totalPages; page++) {
                const [movieData, seriesData] = await Promise.all([apiMovie(page), apiSeries(page)]);

                for (const item of movieData.results) {
                    if (item.id !== data.id && item.genre_ids && hasCommonGenres(item.genre_ids)) {
                        const card = createPosterCard(item);
                        if (card) grid.appendChild(card);
                    }
                }

                for (const item of seriesData.results) {
                    if (item.id !== data.id && item.genre_ids && hasCommonGenres(item.genre_ids)) {
                        const card = createPosterCard(item);
                        if (card) grid.appendChild(card);
                    }
                }
            }
        })();
    }

    // Gestione dinamica opacità overlay ::before
    const infoContainer = document.querySelector('.information-container');
    if (infoContainer) {
        // crea dinamicamente lo pseudo-elemento con overlay controllabile
        let overlay = document.createElement('div');
        overlay.classList.add('information-overlay');
        overlay.style.position = 'absolute';
        overlay.style.inset = 0;
        overlay.style.zIndex = 1;
        overlay.style.backgroundColor = 'black';
        overlay.style.opacity = '0.15';
        infoContainer.appendChild(overlay);

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollFraction = Math.min(scrollTop / window.innerHeight, 1);
            overlay.style.opacity = `${0.15 + (0.65 * scrollFraction)}`;
        });
    }
}
