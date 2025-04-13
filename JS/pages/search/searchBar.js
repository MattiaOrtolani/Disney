import { apiMulti } from "../../api/apiMulti.js";

export function initSearchBar() 
{
    const searchInput = document.querySelector('.search-bar__text-box');
    const gridResult = document.querySelector('.grid-result');
    const clearButton = document.querySelector('.search-bar__cross');

    let isLoading = false;
    let currentPage = 1;
    let currentQuery = '';

    function createPosterElement(item) 
    {
        if (!item.backdrop_path) return null;

        const a = document.createElement('a');
        a.classList.add('poster');
        a.href = `../../../pages/information.html?id=${item.id}&type=${item.media_type}`;
        a.style.backgroundImage = `url(https://image.tmdb.org/t/p/w300${item.backdrop_path})`;
        a.style.backgroundSize = 'cover';
        a.style.backgroundPosition = 'center';

        return a;
    }

    function updateResultTitle(query) 
    {
        const resultTitle = document.querySelector('.result-container__title');
        resultTitle.textContent = query.length > 0 ? 'Risultati' : 'Esplora';
    }

    function clearDynamicPosters() 
    {
        const dynamicPosters = gridResult.querySelectorAll('a.poster');
        dynamicPosters.forEach(poster => poster.remove());
    }

    async function loadResults(query, page = 1) 
    {
        if (isLoading) return;
        isLoading = true;
        const data = await apiMulti(query, page);

        data.results.forEach(item => 
        {
            const el = createPosterElement(item);
            if (el) gridResult.appendChild(el);
        });

        isLoading = false;
    }

    let debounceTimer;
    searchInput.addEventListener('input', (e) => 
    {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => 
        {
            const query = e.target.value.trim();
            currentQuery = query;
            currentPage = 1;

            clearButton.style.display = query.length > 0 ? 'block' : 'none';

            updateResultTitle(query);
            clearDynamicPosters();

            const defaultSearchElements = gridResult.querySelectorAll('div.default-search');
            defaultSearchElements.forEach(el => el.style.display = query.length > 0 ? 'none' : 'block');

            if (query.length > 0) {
                loadResults(query, currentPage);
            }
        }, 500);
    });

    clearButton.addEventListener('click', () => 
    {
        searchInput.value = '';
        currentQuery = '';
        currentPage = 1;
        clearButton.style.display = 'none';

        updateResultTitle('');
        clearDynamicPosters();

        const defaultSearchElements = gridResult.querySelectorAll('div.default-search');
        defaultSearchElements.forEach(el => el.style.display = 'block');
    });

    const sentinel = document.querySelector('.sentinel');
    const observer = new IntersectionObserver(async (entries) => 
    {
        if (entries[0].isIntersecting && currentQuery)
        {
            currentPage++;
            loadResults(currentQuery, currentPage);
        }
    }, {
        rootMargin: '0px',
        threshold: 0
    });

    observer.observe(sentinel);
}