import { movies } from '../arrayFilm/arrayFilm.js';

export function createFilmCards() 
{
    // Seleziona tutte le card con la classe .film-carosello__container
    const containers = document.querySelectorAll('.film-carosello__container');

    // Itera su ogni container e, se esiste un film corrispondente, crea e inserisci gli elementi
    containers.forEach((container, index) => {
        if (movies[index]) {
        const movie = movies[index];
        
        // Crea l'elemento h2 per il titolo
        const titleEl = document.createElement('h2');
        titleEl.textContent = movie.title;
        
        // Crea un elemento p per l'anno
        const yearEl = document.createElement('p');
        yearEl.textContent = `Anno: ${movie.year}`;
        
        // Crea un altro elemento p per il direttore
        const directorEl = document.createElement('p');
        directorEl.textContent = `Direttore: ${movie.director}`;
        
        // Aggiungi gli elementi creati al container
        container.appendChild(titleEl);
        container.appendChild(yearEl);
        container.appendChild(directorEl);
        }
    });

    // Avvia la funzione al caricamento del DOM
    // document.addEventListener('DOMContentLoaded', createFilmCards);
}
