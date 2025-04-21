import { apiMovie } from "../../api/apiMovie.js";
import { apiGenre } from "../../api/apiGenre.js";

interface Movie
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

export async function initFilmFilter(): Promise<void>
{
    const genreButtons = document.querySelectorAll<HTMLButtonElement>('.layout__btn');
    const resultGrid = document.querySelector<HTMLElement>('.grid-result')!;

    let currentPage = 1;
    let totalPages = 1;
    let isLoading = false;
    let loadedMovies: Movie[] = [];
    let currentFilterId: number = -1;

    const { genres: genresArray } = (await apiGenre()) as { genres: Genre[] };
    const genresMap = new Map<number, string>(
        genresArray.map(g => [g.id, g.name.toLowerCase()])
    );

    function renderMovies(): void
    {
        resultGrid.innerHTML = '';
        for (const movie of loadedMovies)
        {
            if (currentFilterId === -1 || movie.genre_ids.includes(currentFilterId))
            {
                const card = createCard(movie);
                resultGrid.appendChild(card);
            }
        }
    }

    await loadPage(currentPage);

    async function loadPage(page: number): Promise<void>
    {
        if (isLoading || page > totalPages)
        {
            return;
        }

        isLoading = true;

        const data = await apiMovie(page);
        totalPages = data.total_pages;

        for (const movie of data.results as Movie[])
        {
            loadedMovies.push(movie);
        }
        renderMovies();

        isLoading = false;
    }

    function createCard(movie: Movie): HTMLAnchorElement
    {
        const link = document.createElement('a');
        link.classList.add('horizontal-poster');
        link.href = `../../../pages/information.html?id=${movie.id}&type=movie`;
        link.dataset.genreIds = JSON.stringify(movie.genre_ids);

        if (movie.backdrop_path)
        {
            link.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.backdrop_path})`;
            link.style.backgroundSize = 'cover';
        }

        return link;
    }

    for (const button of Array.from(genreButtons))
    {
        button.addEventListener('click', () =>
        {
            const genreName = button.textContent?.trim().toLowerCase() ?? '';
            const selected = Array.from(genresMap.entries())
                .find(([, name]) => name === genreName);

            currentFilterId = selected?.[0] ?? -1;
            renderMovies();

            for (const btn of Array.from(genreButtons))
            {
                btn.style.backgroundColor = 'rgb(45, 47, 53)';
                btn.style.color = 'white';
            }

            button.style.backgroundColor = 'white';
            button.style.color = 'black';
        });
    }

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