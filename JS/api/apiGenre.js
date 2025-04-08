export const apiGenre = async () => 
{
    const result = await fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=YOUR_API_KEY&language=it-IT", {
        headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2N2VlOThlZTllYzY0NTgwMzJlNTljMTJmNDIwNTg2NyIsIm5iZiI6MTc0MjI4NzI5My4xMDQsInN1YiI6IjY3ZDkzMWJkZTFlM2NkY2JmOWM2YTk3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4N4ldHL_uY61GWgmwUxnCMDZq455FQqk9OAx5yW1X50'
        }
    });
    
    const data = await result.json();
    return data;
};

console.log(await apiGenre());