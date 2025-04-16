import { apiSeries } from "../../api/apiSeries.js";
import { apiGenre } from "../../api/apiGenre.js";

let currentPage = 1;
let totalPages = 1;
let isLoading = false;

export async function initSeriesFilter() 
{
    const genreButtons = document.querySelectorAll(".layout__btn");
    const resultGrid = document.querySelector(".grid-result");
    const genres = (await apiGenre()).genres;

    await loadPage(currentPage);

    async function loadPage(page) 
    {
        if (isLoading || page > totalPages) return;
        isLoading = true;

        const data = await apiSeries(page);
        totalPages = data.total_pages;
        data.results.forEach(series => 
        {
            const card = createCard(series);
            resultGrid.appendChild(card);
        });
        isLoading = false;
    }

    function createCard(series) 
    {
        const poster = document.createElement("a");
        poster.href  = `../../../pages/information.html?id=${series.id}&type=tv`;
        poster.classList.add("poster");
        poster.setAttribute("data-id", series.id);

        let genreText = "";
        if (series.genre_ids && series.genre_ids.length > 0) 
        {
            const genreNames = series.genre_ids.map(id => 
            {
                const foundGenre = genres.find(genre => genre.id === id);
                return foundGenre ? foundGenre.name.toLowerCase() : '';
            }).filter(Boolean);
            genreText = genreNames.join(' ');
        }
        poster.setAttribute("data-genres", genreText);

        if (series.backdrop_path) 
        {
            poster.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${series.backdrop_path})`;
            poster.style.backgroundSize = "cover";
        }

        return poster;
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
                card.style.display = genre === "tutti le serie" || (genres && genres.includes(genre)) ? "block" : "none";
            });
            genreButtons.forEach((btn) => 
            {
                btn.style.backgroundColor = "rgb(45, 47, 53)";
                btn.style.color = "white";
            });
            button.style.backgroundColor = "white";
            button.style.color = "black";
        });
    });

    genreButtons[0].click();

    const sentinel = document.querySelector('.sentinel');
    const observer = new IntersectionObserver((entries) => 
    {
        if (entries[0].isIntersecting) 
        {
            currentPage++;
            loadPage(currentPage);
        }
    }, 
    {
        rootMargin: '0px',
        threshold: 0
    });

    observer.observe(sentinel);
}