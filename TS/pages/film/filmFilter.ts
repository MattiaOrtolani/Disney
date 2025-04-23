import { apiMovie } from "../../api/apiMovie.js";
import { apiMovieGenre } from "../../api/apiMovieGenre.js";

export async function initFilmFilter(): Promise<void>
{
    const layoutButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.layout__btn'));
    const gridResult = document.querySelector<HTMLElement>('.grid-result')!;
    let currentPage = 1;
    let activeButtonIndex = 0;

    function renderMovies(results: any[])
    {
        results.forEach(movie =>
        {
            const a = document.createElement('a');
            a.classList.add('horizontal-poster');
            a.href = `../../../pages/information.html?id=${movie.id}&type=movie`;
            a.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.backdrop_path})`;
            gridResult.appendChild(a);
        });
    }

    async function loadMovies(genreId: number | null = null, page: number = 1)
    {
        const data = genreId === null
        ? await apiMovie(page)
        : await apiMovieGenre(page, genreId);

        gridResult.innerHTML = '';
        renderMovies(data.results);
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
            await loadMovies(genreId, currentPage);
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
    await loadMovies(null, currentPage);

    const sentinel = document.querySelector<HTMLElement>('.sentinel')!;

    async function loadMore()
    {
        currentPage++;
        const activeBtn = layoutButtons[activeButtonIndex];
        const genreIdAttr = activeBtn.getAttribute('data-genre-id');
        const genreId = genreIdAttr ? Number(genreIdAttr) : null;
        if (genreId === null)
        {
            const data = await apiMovie(currentPage);
            renderMovies(data.results);
        }
        else
        {
            const data = await apiMovieGenre(currentPage, genreId);
            renderMovies(data.results);
        }
    }

    const observer = new IntersectionObserver(async entries =>
    {
        for (const entry of entries)
        {
        if (entry.isIntersecting)
        {
            observer.unobserve(sentinel);
            await loadMore();
            observer.observe(sentinel);
        }
        }
    }, { rootMargin: '200px' });

    observer.observe(sentinel);
}