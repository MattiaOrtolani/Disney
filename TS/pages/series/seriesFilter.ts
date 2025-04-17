import { apiSeries } from "../../api/apiSeries.js";
import { apiGenre } from "../../api/apiGenre.js";

export async function initSeriesFilter(): Promise<void>
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

        const data: any = await apiSeries(page);
        totalPages = data.total_pages;

        data.results.forEach((series: any) =>
        {
            const card: HTMLAnchorElement = createCard(series);
            resultGrid.appendChild(card);
        });

        isLoading = false;
    }

    function createCard(series: any): HTMLAnchorElement
    {
        const poster: HTMLAnchorElement = document.createElement("a");
        poster.href = `../../../pages/information.html?id=${series.id}&type=tv`;
        poster.classList.add("poster");
        poster.setAttribute("data-id", series.id.toString());

        let genreText: string = "";
        if (series.genre_ids && series.genre_ids.length > 0)
        {
            const genreNames: string[] = series.genre_ids.map((id: number) =>
            {
                const found = genres.find((g) => g.id === id);
                return found ? found.name.toLowerCase() : "";
            }).filter(Boolean);
            genreText = genreNames.join(" ");
        }
        poster.setAttribute("data-genres", genreText);

        if (series.backdrop_path)
        {
            poster.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${series.backdrop_path})`;
            poster.style.backgroundSize = "cover";
        }

        return poster;
    }

    genreButtons.forEach((button: HTMLButtonElement) =>
    {
        button.addEventListener("click", () =>
        {
            const genre: string = button.textContent?.trim().toLowerCase() ?? "";
            const cards: NodeListOf<HTMLElement> = resultGrid.querySelectorAll(".poster") as NodeListOf<HTMLElement>;
            cards.forEach((card: HTMLElement) =>
            {
                const genresAttr: string | null = card.getAttribute("data-genres");
                card.style.display = (genre === "tutti le serie" || (genresAttr && genresAttr.includes(genre))) ? "block" : "none";
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