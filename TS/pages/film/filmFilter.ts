import { apiMovie } from "../../api/apiMovie.js";
import { apiGenre } from "../../api/apiGenre.js";

export async function initFilmFilter(): Promise<void>
{
    const genreButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".layout__btn") as NodeListOf<HTMLButtonElement>;
    const resultGrid: HTMLElement = document.querySelector(".grid-result") as HTMLElement;
    let currentPage: number = 1;
    let totalPages: number = 1;
    let isLoading: boolean = false;
    const genres: { id: number; name: string; }[] = (await apiGenre()).genres;

    await loadPage(currentPage);

    async function loadPage(page: number): Promise<void>
    {
        if (isLoading || page > totalPages) return;
        isLoading = true;

        const data: any = await apiMovie(page);
        totalPages = data.total_pages;

        data.results.forEach((movie: any) =>
        {
            const card: HTMLAnchorElement = createCard(movie);
            resultGrid.appendChild(card);
        });

        isLoading = false;
    }

    function createCard(movie: any): HTMLAnchorElement
    {
        const horizontalPoster: HTMLAnchorElement = document.createElement("a");
        horizontalPoster.href = `../../../pages/information.html?id=${movie.id}&type=movie`;
        horizontalPoster.classList.add("horizontal-poster");
        horizontalPoster.setAttribute("data-id", movie.id.toString());

        let genreText: string = "";
        if (movie.genre_ids && movie.genre_ids.length > 0)
        {
            const genreNames: string[] = movie.genre_ids.map((id: number) =>
            {
                const found = genres.find((g) => g.id === id);
                return found ? found.name.toLowerCase() : "";
            }).filter(Boolean);
            genreText = genreNames.join(" ");
        }
        horizontalPoster.setAttribute("data-genres", genreText);

        if (movie.backdrop_path)
        {
            horizontalPoster.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.backdrop_path})`;
            horizontalPoster.style.backgroundSize = "cover";
        }

        return horizontalPoster;
    }

    genreButtons.forEach((button: HTMLButtonElement) =>
    {
        button.addEventListener("click", () =>
        {
            const genre: string = button.textContent?.trim().toLowerCase() ?? "";
            const cards: NodeListOf<HTMLElement> = resultGrid.querySelectorAll(".horizontal-poster") as NodeListOf<HTMLElement>;
            cards.forEach((card: HTMLElement) =>
            {
                const genresAttr: string | null = card.getAttribute("data-genres");
                card.style.display = (genre === "tutti i film" || (genresAttr && genresAttr.includes(genre))) ? "block" : "none";
            });

            genreButtons.forEach((btn: HTMLButtonElement) =>
            {
                btn.style.backgroundColor = "rgb(45, 47, 53)";
                btn.style.color = "white";
            });

            button.style.backgroundColor = "white";
            button.style.color = "black";
        });
    });

    genreButtons[0]?.click();

    const sentinel: Element = document.querySelector(".sentinel") as Element;
    const observer: IntersectionObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]) =>
    {
        if (entries[0].isIntersecting)
        {
            currentPage++;
            loadPage(currentPage);
        }
    },
    {
        rootMargin: "0px",
        threshold: 0
    });

    observer.observe(sentinel);
}