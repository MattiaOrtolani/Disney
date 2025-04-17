var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { apiMovie } from "../../api/apiMovie.js";
import { apiSeries } from "../../api/apiSeries.js";
import { apiGenre } from "../../api/apiGenre.js";
import { apiDetail } from "../../api/apiDetail.js";
export function initInformationPage() {
    return __awaiter(this, void 0, void 0, function* () {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        const type = params.get("type");
        const firstPage = yield apiMovie(1);
        const totalMoviePages = firstPage.total_pages;
        if (!id || !type) {
            console.error("ID o tipo non presente nell'URL");
            return;
        }
        const genres = (yield apiGenre()).genres;
        const data = yield apiDetail(type, id);
        if (!data) {
            console.error("Nessun film o serie trovato con questo ID");
            return;
        }
        const backgroundImg = document.querySelector(".background-container__img");
        if (backgroundImg && data.backdrop_path) {
            backgroundImg.src = `https://image.tmdb.org/t/p/original${data.backdrop_path}`;
        }
        const titleElement = document.querySelector(".information-box__title");
        if (titleElement) {
            titleElement.textContent = data.title || data.name || "Titolo non disponibile";
        }
        const descriptionElement = document.querySelector(".information-box__description");
        if (descriptionElement) {
            descriptionElement.textContent = data.overview || "Descrizione non disponibile.";
        }
        const featuresInfo = document.querySelectorAll(".features-info__text");
        if (featuresInfo.length >= 2) {
            const voto = data.vote_average ? data.vote_average.toFixed(1) : "N/A";
            const eta = data.adult ? ">18" : "<18";
            featuresInfo[0].textContent = voto;
            featuresInfo[1].textContent = eta;
        }
        const technicalInfo = document.querySelectorAll(".technical-info__text");
        if (technicalInfo.length >= 2) {
            const dataUscita = data.release_date || data.first_air_date || "";
            const anno = dataUscita.split("-")[0] || "Anno non disponibile";
            technicalInfo[0].textContent = anno;
            if (data.genres && genres.length > 0) {
                const genreNames = data.genres.map((g) => g.name);
                technicalInfo[1].textContent = genreNames.length > 0 ? genreNames.join(", ") : "Genere non disponibile";
            }
            else {
                technicalInfo[1].textContent = "Genere non disponibile";
            }
        }
        const grid = document.querySelector(".grid-result");
        if (grid && data.genres) {
            const targetGenres = data.genres.map((g) => g.id);
            function hasCommonGenres(itemGenres) {
                return itemGenres.some((id) => targetGenres.includes(id));
            }
            function createPosterCard(item, type) {
                if (!item.backdrop_path || item.id === data.id)
                    return null;
                const link = document.createElement("a");
                link.classList.add("poster");
                link.href = `../../../pages/information.html?id=${item.id}&type=${type}`;
                link.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${item.backdrop_path})`;
                link.style.backgroundSize = "cover";
                link.style.display = "block";
                return link;
            }
            const infoContainer = document.querySelector(".information-container");
            if (infoContainer) {
                const overlay = document.createElement("div");
                overlay.classList.add("information-overlay");
                overlay.style.position = "absolute";
                overlay.style.inset = "0";
                overlay.style.zIndex = "1";
                overlay.style.backgroundColor = "black";
                overlay.style.opacity = "0.15";
                infoContainer.appendChild(overlay);
                window.addEventListener("scroll", () => {
                    const scrollTop = window.scrollY || document.documentElement.scrollTop;
                    const scrollFraction = Math.min(scrollTop / window.innerHeight, 1);
                    overlay.style.opacity = `${0.1 + scrollFraction}`;
                });
            }
            const movieData = yield apiMovie(1);
            for (const item of movieData.results) {
                if (item.id !== data.id && item.genre_ids && hasCommonGenres(item.genre_ids)) {
                    const card = createPosterCard(item, "movie");
                    if (card)
                        grid.appendChild(card);
                }
            }
            const seriesData = yield apiSeries(1);
            for (const item of seriesData.results) {
                if (item.id !== data.id && item.genre_ids && hasCommonGenres(item.genre_ids)) {
                    const card = createPosterCard(item, "tv");
                    if (card)
                        grid.appendChild(card);
                }
            }
        }
    });
}
