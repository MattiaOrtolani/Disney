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
import { apiGenre } from "../../api/apiGenre.js";
export function initFilmFilter() {
    return __awaiter(this, void 0, void 0, function* () {
        const genreButtons = document.querySelectorAll(".layout__btn");
        const resultGrid = document.querySelector(".grid-result");
        let currentPage = 1;
        let totalPages = 0;
        let genres = [];
        function createCard(movie) {
            const poster = document.createElement("a");
            poster.href = `../../../pages/information.html?id=${movie.id}&type=movie`;
            poster.classList.add("poster");
            poster.setAttribute("data-id", movie.id.toString());
            poster.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.backdrop_path})`;
            poster.style.backgroundSize = "cover";
            const titleText = (movie.title || "Titolo non disponibile").toLowerCase();
            poster.setAttribute("data-title", titleText);
            const genreText = (movie.genre_ids || []).map((id) => {
                const foundGenre = genres.find((g) => g.id === id);
                return foundGenre ? foundGenre.name.toLowerCase() : "";
            }).filter(Boolean).join(" ");
            poster.setAttribute("data-genres", genreText);
            return poster;
        }
        function updateButtonStyles(activeButton) {
            genreButtons.forEach((btn) => {
                btn.style.backgroundColor = "rgb(45, 47, 53)";
                btn.style.color = "white";
            });
            activeButton.style.backgroundColor = "white";
            activeButton.style.color = "black";
        }
        function loadPage(page) {
            return __awaiter(this, void 0, void 0, function* () {
                const data = yield apiMovie(page);
                const seenIds = new Set();
                data.results.forEach((movie) => {
                    if (!seenIds.has(movie.id)) {
                        seenIds.add(movie.id);
                        const card = createCard(movie);
                        resultGrid.appendChild(card);
                    }
                });
            });
        }
        genres = (yield apiGenre()).genres;
        const initialData = yield apiMovie(currentPage);
        totalPages = initialData.total_pages;
        yield loadPage(currentPage);
        genreButtons.forEach((button) => {
            button.addEventListener("click", () => {
                var _a, _b;
                const genre = (_b = (_a = button.textContent) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) !== null && _b !== void 0 ? _b : "";
                const cards = resultGrid.querySelectorAll(".poster");
                cards.forEach((card) => {
                    const genresAttr = card.getAttribute("data-genres");
                    card.style.display = (genre === "tutti i film" || (genresAttr && genresAttr.includes(genre))) ? "block" : "none";
                });
                updateButtonStyles(button);
            });
        });
        updateButtonStyles(genreButtons[0]);
        const observerTarget = document.querySelector(".sentinel");
        const observer = new IntersectionObserver((entries) => __awaiter(this, void 0, void 0, function* () {
            if (entries[0].isIntersecting && currentPage < totalPages) {
                currentPage++;
                yield loadPage(currentPage);
            }
        }), {
            rootMargin: "0px",
            threshold: 0
        });
        observer.observe(observerTarget);
    });
}
