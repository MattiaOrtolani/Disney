import { apiSeries } from "../../api/apiSeries.js";
import { apiGenre } from "../../api/apiGenreSeries.js";
import { apiSeriesGenre } from "../../api/apiSeriesGenre.js";

// Funzione di inizializzazione del filtro serie
export async function initSeriesFilter(): Promise<void>
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

  // Funzione per caricare serie (tutte o per genere)
  async function loadSeries(genreId: number | null = null, page: number = 1)
  {
    const data = genreId === null
      ? await apiSeries(page)
      : await apiSeriesGenre(page, genreId);

    gridResult.innerHTML = '';
    renderSeries(data.results);
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
        // Tutte le serie
        await loadSeries(null, currentPage);
      }
      else
      {
        // Serie per genere
        const genreName = btn.textContent?.trim() || '';
        const matched = genres.find(g => g.name.toLowerCase() === genreName.toLowerCase());
          await loadSeries(matched ? matched.id : null, currentPage);
      }
    });
  });

  // Inizializzazione: stile iniziale sui bottoni e carica tutte le serie
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

  // Infinite scroll setup
  const sentinel = document.querySelector<HTMLElement>('.sentinel')!;

  // Funzione per caricare pagine successive senza resettare la griglia
  async function loadMoreSeries()
  {
    currentPage++;
    const activeIndex = layoutButtons.findIndex(b => b.style.background === 'white');
    if (activeIndex === 0)
    {
      const data = await apiSeries(currentPage);
      renderSeries(data.results);
    }
    else
    {
      const genreName = layoutButtons[activeIndex].textContent?.trim() || '';
      const matched = genres.find(g => g.name.toLowerCase() === genreName.toLowerCase());
      let data;
      if (matched) {
        data = await apiSeriesGenre(currentPage, matched.id);
      } else {
        data = await apiSeries(currentPage);
      }
      renderSeries(data.results);
    }
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
