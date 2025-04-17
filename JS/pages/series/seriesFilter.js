var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { apiSeries } from "../../api/apiSeries.js";
import { apiGenre } from "../../api/apiGenre.js";
export function initSeriesFilter() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const genreButtons = document.querySelectorAll(".layout__btn");
        const resultGrid = document.querySelector(".grid-result");
        let currentPage = 1;
        let totalPages = 1;
        let isLoading = false;
        const genres = (yield apiGenre()).genres;
        yield loadPage(currentPage);
        function loadPage(page) {
            return __awaiter(this, void 0, void 0, function* () {
                if (isLoading || page > totalPages)
                    return;
                isLoading = true;
                const data = yield apiSeries(page);
                totalPages = data.total_pages;
                data.results.forEach((series) => {
                    const card = createCard(series);
                    resultGrid.appendChild(card);
                });
                isLoading = false;
            });
        }
        function createCard(series) {
            const poster = document.createElement("a");
            poster.href = `../../../pages/information.html?id=${series.id}&type=tv`;
            poster.classList.add("poster");
            poster.setAttribute("data-id", series.id.toString());
            let genreText = "";
            if (series.genre_ids && series.genre_ids.length > 0) {
                const genreNames = series.genre_ids.map((id) => {
                    const found = genres.find((g) => g.id === id);
                    return found ? found.name.toLowerCase() : "";
                }).filter(Boolean);
                genreText = genreNames.join(" ");
            }
            poster.setAttribute("data-genres", genreText);
            if (series.backdrop_path) {
                poster.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${series.backdrop_path})`;
                poster.style.backgroundSize = "cover";
            }
            return poster;
        }
        genreButtons.forEach((button) => {
            button.addEventListener("click", () => {
                var _a, _b;
                const genre = (_b = (_a = button.textContent) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) !== null && _b !== void 0 ? _b : "";
                const cards = resultGrid.querySelectorAll(".poster");
                cards.forEach((card) => {
                    const genresAttr = card.getAttribute("data-genres");
                    card.style.display = (genre === "tutti le serie" || (genresAttr && genresAttr.includes(genre))) ? "block" : "none";
                });
                genreButtons.forEach((btn) => {
                    btn.style.backgroundColor = "rgb(45, 47, 53)";
                    btn.style.color = "white";
                });
                button.style.backgroundColor = "white";
                button.style.color = "black";
            });
        });
        (_a = genreButtons[0]) === null || _a === void 0 ? void 0 : _a.click();
        const sentinel = document.querySelector(".sentinel");
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                currentPage++;
                loadPage(currentPage);
            }
        }, {
            rootMargin: "0px",
            threshold: 0
        });
        observer.observe(sentinel);
    });
}
