import { apiMovie } from "../../api/apiMovie.js";
import { apiGenre } from "../../api/apiGenre.js";

export async function initFilmFilter() 
{
    const genreButtons = document.querySelectorAll(".layout__btn");
    const resultGrid = document.querySelector(".grid-result");
    let currentPage = 1;
    let totalPages = 0;

    const genres = (await apiGenre()).genres;

    const initialData = await apiMovie(currentPage);
    totalPages = initialData.total_pages;
    loadPage(currentPage);

    async function loadPage(page) 
    {
        const data = await apiMovie(page);
        const seenIds = new Set();

        data.results.forEach(movie => 
        {
            if (!seenIds.has(movie.id)) 
            {
                seenIds.add(movie.id);
                const card = createCard(movie);
                resultGrid.appendChild(card);
            }
        });
    }

    function createCard(movie) 
    {
        const card = document.createElement("a");
        card.href  = `../../../pages/information.html?id=${movie.id}&type=movie`;
        card.classList.add("card");
        card.setAttribute("data-id", movie.id);

        const titleText = (movie.title || "Titolo non disponibile").toLowerCase();
        card.setAttribute("data-title", titleText);
        const genreText = (movie.genre_ids || []).map(id => 
        {
            const foundGenre = genres.find(genre => genre.id === id);
            return foundGenre ? foundGenre.name.toLowerCase() : '';
        }).filter(Boolean).join(' ');
        
        card.setAttribute("data-genres", genreText);

        const poster = document.createElement("div");
        poster.classList.add("poster");

        if (movie.backdrop_path) 
        {
            const img = document.createElement("img");
            img.src = "https://image.tmdb.org/t/p/w500" + movie.backdrop_path;
            poster.appendChild(img);
        }

        card.appendChild(poster);

        return card;
    }

    function updateButtonStyles(activeButton) 
    {
        genreButtons.forEach((btn) => 
        {
            btn.style.backgroundColor = "rgb(45, 47, 53)";
            btn.style.color = "white";
        });
        activeButton.style.backgroundColor = "white";
        activeButton.style.color = "black";
    }

    genreButtons.forEach((button) => 
    {
        button.addEventListener("click", () => 
        {
            const genre = button.textContent.trim().toLowerCase();
            const cards = resultGrid.querySelectorAll(".card");
            cards.forEach(card => 
            {
                const genres = card.getAttribute("data-genres");
                card.style.display = (genre === "tutti i film" || (genres && genres.includes(genre))) ? "block" : "none";
            });
            updateButtonStyles(button);
        });
    });

    updateButtonStyles(genreButtons[0]);

    const observerTarget = document.querySelector('.sentinel');
    const observer = new IntersectionObserver(async (entries) => 
    {
        if (entries[0].isIntersecting && currentPage < totalPages) 
        {
            currentPage++;
            await loadPage(currentPage);
        }
    }, 
    {
        rootMargin: "-100px",
        threshold: 0
    });

    observer.observe(observerTarget);
}