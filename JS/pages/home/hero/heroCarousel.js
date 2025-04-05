import { apiPopular } from '../../../api/apiPopular.js';

const carousel = document.querySelector('.carosello');

export const filmHero = async () => {
    const data = await apiPopular();
    const films = data.results.slice(0, 5);

    // Ordine richiesto per carosello infinito
    const looped = [
        films[3], // 4°
        films[4], // 5°
        films[0], // 1°
        films[1], // 2°
        films[2], // 3°
        films[3], // 4°
        films[4], // 5°
        films[0], // 1°
        films[1], // 2°
    ];

    // Svuota il contenuto del carosello
    carousel.innerHTML = '';

    // Crea dinamicamente i banner
    looped.forEach((film) => {
        const banner = document.createElement('a');
        banner.classList.add('carosello__banner');
        banner.href = '#';
        banner.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w1920${film.backdrop_path}" alt="${film.title}">
            <div>
                <h2>${film.title}</h2>
                <p>voto medio: ${film.vote_average}</p>
            </div> 
        `;
        carousel.appendChild(banner);
    });
};