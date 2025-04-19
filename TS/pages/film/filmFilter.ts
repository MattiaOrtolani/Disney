import { apiMovie } from "../../api/apiMovie.js";
import { apiGenre } from "../../api/apiGenre.js";

export async function initFilmFilter(): Promise<void>
{
    const genreButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".layout__btn") as NodeListOf<HTMLButtonElement>;
    const resultGrid: HTMLElement = document.querySelector(".grid-result") as HTMLElement;
    let currentPage: number = 1;
    let totalPages: number = 0;
    let genres: { id: number; name: string; }[] = [];

    function createCard(movie: any): HTMLAnchorElement
    {
        const horizontalPoster: HTMLAnchorElement = document.createElement("a");
        horizontalPoster.href = `../../../pages/information.html?id=${movie.id}&type=movie`;
        horizontalPoster.classList.add("horizontal-poster");
        horizontalPoster.setAttribute("data-id", movie.id.toString());
        horizontalPoster.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.backdrop_path})`;
        horizontalPoster.style.backgroundSize = "cover";

        const titleText: string = (movie.title || "Titolo non disponibile").toLowerCase();
        horizontalPoster.setAttribute("data-title", titleText);

        const genreText: string = (movie.genre_ids || []).map((id: number) =>
        {
            const foundGenre = genres.find((g) => g.id === id);
            return foundGenre ? foundGenre.name.toLowerCase() : "";
        }).filter(Boolean).join(" ");
        horizontalPoster.setAttribute("data-genres", genreText);

        return horizontalPoster;
    }

    function updateButtonStyles(activeButton: HTMLButtonElement): void
    {
        genreButtons.forEach((btn) =>
        {
            btn.style.backgroundColor = "rgb(45, 47, 53)";
            btn.style.color = "white";
        });
        activeButton.style.backgroundColor = "white";
        activeButton.style.color = "black";
    }

    async function loadPage(page: number): Promise<void>
    {
        const data: any = await apiMovie(page);
        const seenIds: Set<number> = new Set<number>();

        data.results.forEach((movie: any) =>
        {
            if (!seenIds.has(movie.id))
            {
                seenIds.add(movie.id);
                const card = createCard(movie);
                resultGrid.appendChild(card);
            }
        });
    }

    genres = (await apiGenre()).genres;
    const initialData: any = await apiMovie(currentPage);
    totalPages = initialData.total_pages;
    await loadPage(currentPage);

    genreButtons.forEach((button) =>
    {
        button.addEventListener("click", () =>
        {
            const genre: string = button.textContent?.trim().toLowerCase() ?? "";
            const cards: NodeListOf<HTMLElement> = resultGrid.querySelectorAll(".horizontalPoster") as NodeListOf<HTMLElement>;
            cards.forEach((card: HTMLElement) =>
            {
                const genresAttr: string | null = card.getAttribute("data-genres");
                card.style.display = (genre === "tutti i film" || (genresAttr && genresAttr.includes(genre))) ? "block" : "none";
            });
            updateButtonStyles(button);
        });
    });

    updateButtonStyles(genreButtons[0]);

    const observerTarget: Element = document.querySelector(".sentinel") as Element;
    const observer: IntersectionObserver = new IntersectionObserver(async (entries) =>
    {
        if (entries[0].isIntersecting && currentPage < totalPages)
        {
            currentPage++;
            await loadPage(currentPage);
        }
    },
    {
        rootMargin: "0px",
        threshold: 0
    });

    observer.observe(observerTarget);
}