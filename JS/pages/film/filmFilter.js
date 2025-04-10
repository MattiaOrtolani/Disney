import { apiMovie } from "../../api/apiMovie.js";
import { apiGenre } from "../../api/apiGenre.js";

export async function initFilmFilter() 
{
    const genreButtons = document.querySelectorAll(".layout__btn");
    const resultGrid = document.querySelector(".grid-result");
    const totalPages = 32;
    let genres = [];

    genres = (await apiGenre()).genres;

    const data = await apiMovie(1);
    const uniqueMovies = [];
    const seenIds = new Set();

    for (let page = 1; page <= totalPages; page++) {
        const data = await apiMovie(page);
        data.results.forEach(movie => {
            if (!seenIds.has(movie.id)) {
                seenIds.add(movie.id);
                const card = createCard(movie);
                resultGrid.appendChild(card);
            }
        });
    }

    function createCard(movie) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-id", movie.id);

        const titleText = (movie.title || "Titolo non disponibile").toLowerCase();
        card.setAttribute("data-title", titleText);
        let genreText = "";
        if (movie.genre_ids && movie.genre_ids.length > 0) {
            const genreNames = movie.genre_ids.map(id => {
                const foundGenre = genres.find(genre => genre.id === id);
                return foundGenre ? foundGenre.name.toLowerCase() : '';
            }).filter(Boolean);
            genreText = genreNames.join(' ');
        }
        card.setAttribute("data-genres", genreText);

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
            const genre = button.textContent.trim().toLowerCase();
            const cards = resultGrid.querySelectorAll(".card");
            cards.forEach(card => {
                const genres = card.getAttribute("data-genres");
                if (genre === "tutti i film" || (genres && genres.includes(genre))) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
            updateButtonStyles(button);
        });
    });

    updateButtonStyles(genreButtons[0]);
}
