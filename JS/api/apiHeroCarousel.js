export const apiHeroCarousel = async () => {
    
    const result = await fetch("https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1", {
        headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2N2VlOThlZTllYzY0NTgwMzJlNTljMTJmNDIwNTg2NyIsIm5iZiI6MTc0MjI4NzI5My4xMDQsInN1YiI6IjY3ZDkzMWJkZTFlM2NkY2JmOWM2YTk3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4N4ldHL_uY61GWgmwUxnCMDZq455FQqk9OAx5yW1X50',
            accept: 'application/json'
        }
    });

    const data = await result.json();
    console.log(data);

    const HeroCarousel = document.querySelector('.carosello');
    const carouselBanner = document.querySelectorAll('.carosello__banner');

    data.results.slice(0, 5).forEach((film, index) =>
    {
        const cardHtml = `
        <img src="https://image.tmdb.org/t/p/w1920${film.backdrop_path}" alt="${film.title}">
        <div>
            <h2>${film.title}</h2>
            <p>voto medio: ${film.vote_average}</p>
        </div>
        `;
        carouselBanner[index].innerHTML = cardHtml;
    });
}

apiHeroCarousel();