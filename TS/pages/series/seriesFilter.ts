import { apiSeries } from "../../api/apiSeries.js";
import { apiGenre } from "../../api/apiGenre.js";

interface Series
{
    id: number;
    genre_ids: number[];
    backdrop_path: string | null;
}

interface Genre
{
    id: number;
    name: string;
}

export async function initSeriesFilter(): Promise<void>
{
    const genreButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.layout__btn'));
    const resultGrid = document.querySelector<HTMLElement>('.grid-result')!;
    let currentPage = 1;
    let totalPages = 1;
    let isLoading = false;
    let loadedSeries: Series[] = [];
    let currentFilterId = -1;
    const genres: Genre[] = (await apiGenre()).genres;

    await loadPage(currentPage);

    async function loadPage(page: number): Promise<void>
    {
        if (isLoading || page > totalPages)
        {
            return;
        }

        isLoading = true;

        const data = await apiSeries(page);
        totalPages = data.total_pages;

        for (const seriesItem of data.results as Series[])
        {
            loadedSeries.push(seriesItem);
        }

        renderSeries();
        isLoading = false;
    }
    function createCard(seriesItem: Series): HTMLAnchorElement
    {
        const link = document.createElement('a');
        link.classList.add('horizontal-poster');
        link.href = `../../../pages/information.html?id=${seriesItem.id}&type=tv`;
        link.dataset.genreIds = JSON.stringify(seriesItem.genre_ids);

        if (seriesItem.backdrop_path)
        {
            link.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${seriesItem.backdrop_path})`;
            link.style.backgroundSize = 'cover';
        }

        return link;
    }

    for (const button of genreButtons)
    {
        button.addEventListener('click', () =>
        {
            const genreName = button.textContent?.trim().toLowerCase() ?? '';
            const selected = genres.find((g: Genre) => g.name.toLowerCase() === genreName);
            currentFilterId = selected?.id ?? -1;
            renderSeries();

            for (const btn of genreButtons)
            {
                btn.style.backgroundColor = 'rgb(45, 47, 53)';
                btn.style.color = 'white';
            }

            button.style.backgroundColor = 'white';
            button.style.color = 'black';
        });
    }
    function renderSeries(): void
    {
        resultGrid.innerHTML = '';
        for (const series of loadedSeries)
        {
            if (currentFilterId === -1 || series.genre_ids.includes(currentFilterId))
            {
                const card = createCard(series);
                resultGrid.appendChild(card);
            }
        }
    }

    await loadPage(currentPage);
    genreButtons[0]?.click();
    
    const sentinel = document.querySelector<Element>('.sentinel');
    
    if (sentinel)
    {
        const observer = new IntersectionObserver(entries =>
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
}