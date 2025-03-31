// Funzione per effettuare la chiamata API e popolare dinamicamente le card
export const api = async () => {
    try {
        const result = await fetch("https://api.themoviedb.org/3/movie/popular", {
            headers: {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2N2VlOThlZTllYzY0NTgwMzJlNTljMTJmNDIwNTg2NyIsIm5iZiI6MTc0MjI4NzI5My4xMDQsInN1YiI6IjY3ZDkzMWJkZTFlM2NkY2JmOWM2YTk3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4N4ldHL_uY61GWgmwUxnCMDZq455FQqk9OAx5yW1X50'
            }
        });
        
        const data = await result.json();
        console.log(data);
        
        // Seleziona l'elemento in cui inserire le card
        const filmCarosello = document.querySelector('.film-carosello');
        
        // Per ogni film nei risultati, crea una card e aggiungi i dati
        data.results.forEach(film => {
            const cardHtml = `
                <div class="film-carosello__container">
                    <img src="https://image.tmdb.org/t/p/w500${film.backdrop_path}" alt="${film.title}">
                    <h3>${film.title}</h3>
                    <p>Rating: ${film.vote_average}</p>
                </div>
            `;
            filmCarosello.innerHTML += cardHtml;
        });
    } catch (error) {
        console.error('Errore nel recupero dei dati:', error);
    }
};

// Assicurati che il DOM sia caricato prima di eseguire la funzione
document.addEventListener('DOMContentLoaded', () => {
    api();
});

