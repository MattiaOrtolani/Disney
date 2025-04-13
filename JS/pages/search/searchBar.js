import { apiMulti } from "../../api/apiMulti.js";

export function initSearchBar() 
{
    const searchInput = document.querySelector('.search-container__search-bar');
    const gridResult = document.querySelector('.grid-result');

    let currentPage = 1;
    let currentQuery = '';
    let totalPages = 1;
    let isLoading = false;
    let observer;

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

    async function loadResults(query, page = 1) 
    {
        if (isLoading || (page > totalPages)) return;
        isLoading = true;
        const data = await apiMulti(query, page);

        currentPage = data.page;
        totalPages = data.total_pages;

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
            gridResult.innerHTML = '';
            currentPage = 1;
            currentQuery = query;
            if (query.length > 0) 
            {
                loadResults(query, 1);
            }
        }, 500);
    });

    function createObserver() 
    {
        if (observer) observer.disconnect();

        observer = new IntersectionObserver(entries => 
        {
            entries.forEach(entry => 
            {
                if (entry.isIntersecting && currentQuery && currentPage < totalPages) 
                {
                    const { scrollHeight, scrollTop, clientHeight } = gridResult;
                    if (scrollHeight - scrollTop - clientHeight < 200) 
                    {
                        loadResults(currentQuery, currentPage + 1);
                    }
                }
            });
        }, 
        {
            root: null,
            rootMargin: '200px',
            threshold: 0
        });

        observer.observe(gridResult);
    }

    createObserver();
}