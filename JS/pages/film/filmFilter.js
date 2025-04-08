import { apiMovie } from "../../api/apiMovie.js";
import { apiGenre } from "../../api/apiGenre.js";

export async function initFilmFilter() 
{
    const genreButtons = document.querySelectorAll(".layout__btn");
    const resultGrid = document.querySelector(".grid-result");
    const totalPages = 32;
    let allMovies = [];
    let genres = [];

    genres = (await apiGenre()).genres;

    for (let page = 1; page <= totalPages; page++) 
    {
        const data = await apiMovie(page);
        allMovies.push(...data.results);
    }

    function createCard(movie) {
        const card = document.createElement("div");
        card.classList.add("card");

        const poster = document.createElement("div");
        poster.classList.add("poster");

        if (movie.backdrop_path) {
            const img = document.createElement("img");
            img.src = "https://image.tmdb.org/t/p/w500" + movie.backdrop_path;
            poster.appendChild(img);
        }

        card.appendChild(poster);

        return card;
    }

    function renderMovies(movies) {
        resultGrid.innerHTML = "";
        movies.forEach((movie) => {
            const card = createCard(movie);
            resultGrid.appendChild(card);
        });
    }

    function filterByGenre(genreName) {
        if (genreName === "Tutti i film") {
            return allMovies;
        }

        const genreMatch = genres.find(
            (g) => g.name.toLowerCase() === genreName.toLowerCase()
        );
        if (!genreMatch) return [];

        return allMovies.filter((movie) => movie.genre_ids.includes(genreMatch.id));
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

    renderMovies(allMovies);
    updateButtonStyles(genreButtons[0]);
}
