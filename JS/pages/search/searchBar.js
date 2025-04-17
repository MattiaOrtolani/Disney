var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { apiMulti } from "../../api/apiMulti.js";
export function initSearchBar() {
    const searchInput = document.querySelector(".search-bar__text-box");
    const gridResult = document.querySelector(".grid-result");
    const clearButton = document.querySelector(".search-bar__cross");
    let isLoading = false;
    let currentPage = 1;
    let currentQuery = "";
    function createPosterElement(item) {
        if (!item.backdrop_path)
            return null;
        const a = document.createElement("a");
        a.classList.add("poster");
        a.href = `../../../pages/information.html?id=${item.id}&type=${item.media_type}`;
        a.style.backgroundImage = `url(https://image.tmdb.org/t/p/w300${item.backdrop_path})`;
        a.style.backgroundSize = "cover";
        a.style.backgroundPosition = "center";
        return a;
    }
    function updateResultTitle(query) {
        const resultTitle = document.querySelector(".result-container__title");
        if (resultTitle) {
            resultTitle.textContent = query.length > 0 ? "Risultati" : "Esplora";
        }
    }
    function clearDynamicPosters() {
        const dynamicPosters = gridResult.querySelectorAll("a.poster");
        dynamicPosters.forEach((poster) => {
            poster.remove();
        });
    }
    function loadResults(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, page = 1) {
            if (isLoading)
                return;
            isLoading = true;
            const data = yield apiMulti(query, page);
            data.results.forEach((item) => {
                const el = createPosterElement(item);
                if (el)
                    gridResult.appendChild(el);
            });
            isLoading = false;
        });
    }
    let debounceTimer;
    searchInput.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(() => {
            const target = e.target;
            const query = target.value.trim();
            currentQuery = query;
            currentPage = 1;
            clearButton.style.display = query.length > 0 ? "block" : "none";
            updateResultTitle(query);
            clearDynamicPosters();
            const defaultSearchElements = gridResult.querySelectorAll("div.default-search");
            defaultSearchElements.forEach((el) => {
                el.style.display = query.length > 0 ? "none" : "block";
            });
            if (query.length > 0) {
                loadResults(query, currentPage);
            }
        }, 500);
    });
    clearButton.addEventListener("click", () => {
        searchInput.value = "";
        currentQuery = "";
        currentPage = 1;
        clearButton.style.display = "none";
        updateResultTitle("");
        clearDynamicPosters();
        const defaultSearchElements = gridResult.querySelectorAll("div.default-search");
        defaultSearchElements.forEach((el) => {
            el.style.display = "block";
        });
    });
    const sentinel = document.querySelector(".sentinel");
    const observer = new IntersectionObserver((entries) => __awaiter(this, void 0, void 0, function* () {
        if (entries[0].isIntersecting && currentQuery) {
            currentPage++;
            yield loadResults(currentQuery, currentPage);
        }
    }), {
        rootMargin: "0px",
        threshold: 0
    });
    observer.observe(sentinel);
}
