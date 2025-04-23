export const apiMulti = async (query: string, page: number = 1): Promise<any> =>
{
    const url: string = `https://api.themoviedb.org/3/search/multi?language=it-IT&page=${page}&query=${encodeURIComponent(query)}`;
    const headers: { Authorization: string } =
    {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2N2VlOThlZTllYzY0NTgwMzJlNTljMTJmNDIwNTg2NyIsIm5iZiI6MTc0MjI4NzI5My4xMDQsInN1YiI6IjY3ZDkzMWJkZTFlM2NkY2JmOWM2YTk3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4N4ldHL_uY61GWgmwUxnCMDZq455FQqk9OAx5yW1X50'
    };

    const result = await fetch(url, { headers });
    const data = await result.json();
    return data;
};