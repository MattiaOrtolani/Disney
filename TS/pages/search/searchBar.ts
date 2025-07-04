import { apiMulti } from "../../api/apiMulti.js";

export function initSearchBar(): void
{
    const searchInput: HTMLInputElement = document.querySelector(".search-bar__text-box") as HTMLInputElement;
    const gridResult: HTMLElement = document.querySelector(".grid-result") as HTMLElement;
    const clearButton: HTMLElement = document.querySelector(".search-bar__cross") as HTMLElement;

    let isLoading: boolean = false;
    let currentPage: number = 1;
    let currentQuery: string = "";

    function createhorizontalPosterElement(item: any): HTMLAnchorElement | null
    {
        if (!item.backdrop_path) return null;

        const a: HTMLAnchorElement = document.createElement("a");
        a.classList.add("horizontal-poster");
        a.href = `../../../pages/information.html?id=${item.id}&type=${item.media_type}`;
        a.style.backgroundImage = `url(https://image.tmdb.org/t/p/w300${item.backdrop_path})`;
        a.style.backgroundSize = "cover";
        a.style.backgroundPosition = "center";

        return a;
    }

    function updateResultTitle(query: string): void
    {
        const resultTitle: HTMLElement | null = document.querySelector(".layout-container__title") as HTMLElement | null;
        if (resultTitle)
        {
            resultTitle.textContent = query.length > 0 ? "Risultati" : "Esplora";
        }
    }

    function clearDynamichorizontalPosters(): void
    {
    const dynamicPosters: NodeListOf<HTMLElement> = gridResult.querySelectorAll("a.horizontal-poster");
    dynamicPosters.forEach(poster => poster.remove());
    observer.disconnect();
    observer.observe(sentinel);
    }

    async function loadResults(query: string, page: number = 1): Promise<void>
    {
        if (isLoading) return;
        isLoading = true;
        const data: any = await apiMulti(query, page);

        data.results.forEach((item: any) =>
        {
            const el: HTMLAnchorElement | null = createhorizontalPosterElement(item);
            if (el) gridResult.appendChild(el);
        });

        isLoading = false;
    }

    let debounceTimer: number;
    searchInput.addEventListener("input", (e: Event) =>
    {
        clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(() =>
        {
            const target = e.target as HTMLInputElement;
            const query: string = target.value.trim();
            currentQuery = query;
            currentPage = 1;

            clearButton.style.display = query.length > 0 ? "block" : "none";

            updateResultTitle(query);
            clearDynamichorizontalPosters();

            const defaultSearchElements: NodeListOf<HTMLElement> = gridResult.querySelectorAll("div.default-search") as NodeListOf<HTMLElement>;
            defaultSearchElements.forEach((el: HTMLElement) =>
            {
                el.style.display = query.length > 0 ? "none" : "block";
            });

            if (query.length > 0)
            {
                loadResults(query, currentPage);
            }
        }, 500);
    });

    clearButton.addEventListener("click", (): void =>
    {
        searchInput.value = "";
        currentQuery = "";
        currentPage = 1;
        clearButton.style.display = "none";

        updateResultTitle("");
        clearDynamichorizontalPosters();

        const defaultSearchElements: NodeListOf<HTMLElement> = gridResult.querySelectorAll("div.default-search") as NodeListOf<HTMLElement>;
        defaultSearchElements.forEach((el: HTMLElement) =>
        {
            el.style.display = "block";
        });
    });

    const sentinel: Element = document.querySelector(".sentinel") as Element;
    const observer: IntersectionObserver = new IntersectionObserver(async (entries: IntersectionObserverEntry[]) =>
    {
        if (entries[0].isIntersecting && currentQuery)
        {
            currentPage++;
            await loadResults(currentQuery, currentPage);
        }
    },
    {
        rootMargin: "0px",
        threshold: 0
    });

    observer.observe(sentinel);
}