import { apiMovie } from "../../api/apiMovie.js";
import { apiGenre } from "../../api/apiGenreMovie.js";
import { apiMovieGenre } from "../../api/apiMovieGenre.js";

// Funzione di inizializzazione del filtro film
export async function initFilmFilter(): Promise<void>
{
    // Seleziona tutti i pulsanti di filtro
    const layoutButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.layout__btn'));
    // Contenitore dei risultati
    const gridResult = document.querySelector<HTMLElement>('.grid-result')!;
    let currentPage = 1;
    // Tenere traccia dell'indice del bottone attivo
    let activeButtonIndex = 0;

    // Preleva i generi da API
    const genreResponse = await apiGenre();
    const genres = genreResponse.genres as { id: number; name: string }[];

    // Funzione per rendere i poster orizzontali
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

    // Funzione per caricare film (tutti o per genere)
    async function loadMovies(genreId: number | null = null, page: number = 1)
    {
        const data = genreId === null
        ? await apiMovie(page)
        : await apiMovieGenre(genreId, page);

        gridResult.innerHTML = '';
        renderMovies(data.results);
    }

    // Imposta listener su ciascun pulsante
    layoutButtons.forEach((btn, index) =>
    {
        btn.addEventListener('click', async () =>
        {
            // Ripristina stile del vecchio bottone
            const prevButton = layoutButtons[activeButtonIndex];
            prevButton.style.background = 'rgb(45, 47, 53)';
            prevButton.style.color = 'white';

            // Applica stile al bottone appena premuto
            btn.style.background = 'white';
            btn.style.color = 'black';

            // Aggiorna indice attivo
            activeButtonIndex = index;

            currentPage = 1;
            gridResult.innerHTML = '';

            if (index === 0)
            {
                // Tutti i film
                await loadMovies(null, currentPage);
            }
            else
            {
                // Film per genere
                const genreName = btn.textContent?.trim() || '';
                const matched = genres.find(g => g.name.toLowerCase() === genreName.toLowerCase());
                await loadMovies(matched ? matched.id : null, currentPage);
            }
            });
    });

    // Inizializzazione: attiva il primo bottone e carica tutti i film
    if (layoutButtons.length > 0)
    {
        // Imposta stile iniziale sui bottoni
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

    // Infinite scroll setup
    const sentinel = document.querySelector<HTMLElement>('.sentinel')!;

    // Funzione per caricare pagine successive senza resettare la griglia
    async function loadMore()
    {
        currentPage++;
        const activeIndex = layoutButtons.findIndex(b => b.style.background === 'white');
        if (activeIndex === 0)
        {
            const data = await apiMovie(currentPage);
            renderMovies(data.results);
        }
        else
        {
            const genreName = layoutButtons[activeIndex].textContent?.trim() || '';
            const matched = genres.find(g => g.name.toLowerCase() === genreName.toLowerCase());
            const data = await apiMovieGenre(matched ? matched.id : null, currentPage);
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