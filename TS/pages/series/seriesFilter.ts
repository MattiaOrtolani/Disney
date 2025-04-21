import { apiSeries } from "../../api/apiSeries.js";
import { apiSeriesGenre } from "../../api/apiSeriesGenre.js";

export async function initSeriesFilter(): Promise<void>
{
    const layoutButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.layout__btn'));
    const gridResult = document.querySelector<HTMLElement>('.grid-result')!;
    let currentPage = 1;
    let activeButtonIndex = 0;

    function renderSeries(results: any[])
    {
        results.forEach(series =>
        {
            const a = document.createElement('a');
            a.classList.add('horizontal-poster');
            a.href = `../../../pages/information.html?id=${series.id}&type=tv`;
            a.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${series.backdrop_path})`;
            gridResult.appendChild(a);
        });
    }

    async function loadSeries(genreId: number | null = null, page: number = 1)
    {
        const data = genreId === null
        ? await apiSeries(page)
        : await apiSeriesGenre(page, genreId);

        gridResult.innerHTML = '';
        renderSeries(data.results);
    }

    layoutButtons.forEach((btn, index) =>
    {
        btn.addEventListener('click', async () =>
        {
            const prevButton = layoutButtons[activeButtonIndex];
            prevButton.style.background = 'rgb(45, 47, 53)';
            prevButton.style.color = 'white';

            btn.style.background = 'white';
            btn.style.color = 'black';

            activeButtonIndex = index;

            currentPage = 1;
            gridResult.innerHTML = '';

            const genreIdAttr = btn.getAttribute('data-genre-id');
            const genreId = genreIdAttr ? Number(genreIdAttr) : null;
            await loadSeries(genreId, currentPage);
        });
    });

    if (layoutButtons.length > 0)
    {
        layoutButtons.forEach((b, i) =>
        {
        if (i === activeButtonIndex)
        {
            b.style.background = 'white';
            b.style.color = 'black';
        }
        else
        {
            b.style.background = 'rgb(45, 47, 53)';
            b.style.color = 'white';
        }
        });
    }
    await loadSeries(null, currentPage);

    const sentinel = document.querySelector<HTMLElement>('.sentinel')!;

    async function loadMoreSeries()
    {
        currentPage++;
        const activeBtn = layoutButtons[activeButtonIndex];
        const genreIdAttr = activeBtn.getAttribute('data-genre-id');
        const genreId = genreIdAttr ? Number(genreIdAttr) : null;
        let data;
        if (genreId === null)
        {
            data = await apiSeries(currentPage);
        }
        else
        {
            data = await apiSeriesGenre(currentPage, genreId);
        }
        renderSeries(data.results);
    }

    const observer = new IntersectionObserver(async entries =>
    {
        for (const entry of entries)
        {
        if (entry.isIntersecting)
        {
            observer.unobserve(sentinel);
            await loadMoreSeries();
            observer.observe(sentinel);
        }
        }
    }, { rootMargin: '200px' });

    observer.observe(sentinel);
}