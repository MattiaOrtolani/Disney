import { apiMovie } from "../../api/apiMovie.js";



export const liveSearch = async ()  => 
{
    
    await new Promise(resolve => 
    {
        if (document.readyState === "complete" || document.readyState === "interactive") 
        {
            resolve();
        } else 
        {
            document.addEventListener('DOMContentLoaded', resolve);
        }
    });


    const data = (await apiMovie()).results;
    
    const searchBar = document.querySelector('.search-container__search-bar');
    const resultContainer = document.querySelector('.result');

    
    if (!searchBar || !resultContainer) 
    {
        console.error('Elementi della search bar o result non trovati.');
        return;
    }

    
    function createCard(movie) 
    {
        
        const card = document.createElement('div');
        card.classList.add('card');

        
        const poster = document.createElement('div');
        poster.classList.add('poster');
        if (movie.backdrop_path) 
        {
            const img = document.createElement('img');
            img.src = 'https://image.tmdb.org/t/p/w500' + movie.backdrop_path;
            poster.appendChild(img);
        }


        const titleEl = document.createElement('h1');
        titleEl.textContent = movie.title || "Titolo non disponibile";

        
        const cardInfo = document.createElement('div');
        cardInfo.classList.add('card_info');

        
        const pEta = document.createElement('p');
        pEta.classList.add('card_info--text');
        pEta.textContent = movie.adult ? "18+" : "10+";

        
        const pAnno = document.createElement('p');
        pAnno.classList.add('card_info--text');
        pAnno.textContent = movie.release_date ? movie.release_date.slice(0, 4) : "Anno non disponibile";

        
        const pGeneri = document.createElement('p');
        pGeneri.classList.add('card_info--text');
        pGeneri.textContent = (movie.genre_ids && movie.genre_ids.length > 0) ? movie.genre_ids.join(', ') : "Genere non disponibile";

        
        cardInfo.appendChild(pEta);
        cardInfo.appendChild(pAnno);
        cardInfo.appendChild(pGeneri);

        card.appendChild(poster);
        card.appendChild(titleEl);
        card.appendChild(cardInfo);

        return card;
    }

    
    searchBar.addEventListener('input', () => 
    {
        const query = searchBar.value.toLowerCase();
        // Filtra i film in base al titolo o all'overview
        const filteredMovies = data.filter(movie => 
        
            movie.title.toLowerCase().includes(query) ||
            movie.overview.toLowerCase().includes(query)
        );

        
        resultContainer.innerHTML = '';

        
        filteredMovies.forEach(movie => 
        {
            const card = createCard(movie);
            resultContainer.appendChild(card);
        });
    });
};