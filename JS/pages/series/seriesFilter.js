import { apiSeries } from "../../api/apiSeries.js";
import { apiGenre } from "../../api/apiGenre.js";

export async function initSeriesFilter() 
{
    const genreButtons = document.querySelectorAll(".layout__btn");
    const resultGrid = document.querySelector(".grid-result");
    const totalPages = 32;
    let allSeries = [];
    let genres = [];

    genres = (await apiGenre()).genres;

    for (let page = 1; page <= totalPages; page++) 
    {
        const data = await apiSeries(page);
        allSeries.push(...data.results);
    }

    function createCard(series) {
        const card = document.createElement("div");
        card.classList.add("card");

        const poster = document.createElement("div");
        poster.classList.add("poster");

        if (series.backdrop_path) {
            const img = document.createElement("img");
            img.src = "https://image.tmdb.org/t/p/w500" + series.backdrop_path;
            poster.appendChild(img);
        }

        card.appendChild(poster);

        return card;
    }

    function renderMovies(seriess) {
        resultGrid.innerHTML = "";
        seriess.forEach((series) => {
            const card = createCard(series);
            resultGrid.appendChild(card);
        });
    }

    function filterByGenre(genreName) {
        if (genreName === "Tutti le serie") {
            return allSeries;
        }

        const genreMatch = genres.find(
            (g) => g.name.toLowerCase() === genreName.toLowerCase()
        );
        if (!genreMatch) return [];

        return allSeries.filter((series) => series.genre_ids.includes(genreMatch.id));
    }

    function updateButtonStyles(activeButton) {
        genreButtons.forEach((btn) => {
            btn.style.backgroundColor = "rgb(45, 47, 53)";
            btn.style.color = "white";
        });
        activeButton.style.backgroundColor = "white";
        activeButton.style.color = "black";
    }

    genreButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const genre = button.textContent.trim();
            const filteredMovies = filterByGenre(genre);
            renderMovies(filteredMovies);
            updateButtonStyles(button);
        });
    });

    renderMovies(allSeries);
    updateButtonStyles(genreButtons[0]);
}
