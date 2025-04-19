import { apiMovie } from "../../api/apiMovie.js";
import { apiSeries } from "../../api/apiSeries.js";
import { apiGenre } from "../../api/apiGenre.js";
import { apiDetail } from "../../api/apiDetail.js";

export async function initInformationPage(): Promise<void>
{
    const params: URLSearchParams = new URLSearchParams(window.location.search);
    const id: string | null = params.get("id");
    const type: string | null = params.get("type");
    const firstPage: any = await apiMovie(1);
    const totalMoviePages: number = firstPage.total_pages;

    if (!id || !type)
    {
        console.error("ID o tipo non presente nell'URL");
        return;
    }

    const genres: { id: number; name: string; }[] = (await apiGenre()).genres;
    const data: any = await apiDetail(type!, id!);

    if (!data)
    {
        console.error("Nessun film o serie trovato con questo ID");
        return;
    }

    const backgroundImg: HTMLImageElement | null = document.querySelector(".background-container__img") as HTMLImageElement | null;
    if (backgroundImg && data.backdrop_path)
    {
        backgroundImg.src = `https://image.tmdb.org/t/p/w1920${data.backdrop_path}`;
    }

    const titleElement: HTMLElement | null = document.querySelector(".information-box__title") as HTMLElement | null;
    if (titleElement)
    {
        titleElement.textContent = data.title || data.name || "Titolo non disponibile";
    }

    const descriptionElement: HTMLElement | null = document.querySelector(".information-box__description") as HTMLElement | null;
    if (descriptionElement)
    {
        descriptionElement.textContent = data.overview || "Descrizione non disponibile.";
    }

    const featuresInfo: NodeListOf<HTMLElement> = document.querySelectorAll(".features-info__text") as NodeListOf<HTMLElement>;
    if (featuresInfo.length >= 2)
    {
        const voto: string = data.vote_average ? data.vote_average.toFixed(1) : "N/A";
        const eta: string = data.adult ? ">18" : "<18";
        featuresInfo[0].textContent = voto;
        featuresInfo[1].textContent = eta;
    }

    const technicalInfo: NodeListOf<HTMLElement> = document.querySelectorAll(".technical-info__text") as NodeListOf<HTMLElement>;
    if (technicalInfo.length >= 2)
    {
        const dataUscita: string = data.release_date || data.first_air_date || "";
        const anno: string = dataUscita.split("-")[0] || "Anno non disponibile";
        technicalInfo[0].textContent = anno;

        if (data.genres && genres.length > 0)
        {
            const genreNames: string[] = (data.genres as { name: string; }[]).map((g) => g.name);
            technicalInfo[1].textContent = genreNames.length > 0 ? genreNames.join(", ") : "Genere non disponibile";
        }
        else
        {
            technicalInfo[1].textContent = "Genere non disponibile";
        }
    }

    const grid: HTMLElement | null = document.querySelector(".grid-result") as HTMLElement | null;
    if (grid && data.genres)
    {
        const targetGenres: number[] = (data.genres as { id: number; }[]).map((g) => g.id);

        function hasCommonGenres(itemGenres: number[]): boolean
        {
            return itemGenres.some((id) => targetGenres.includes(id));
        }

        function createhorizontalPosterCard(item: any, type: string): HTMLAnchorElement | null
        {
            if (!item.backdrop_path || item.id === data.id) return null;

            const link: HTMLAnchorElement = document.createElement("a");
            link.classList.add("horizontal-poster");
            link.href = `../../../pages/information.html?id=${item.id}&type=${type}`;
            link.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${item.backdrop_path})`;
            link.style.backgroundSize = "cover";
            link.style.display = "block";
            return link;
        }

        const infoContainer: HTMLElement | null = document.querySelector(".information-container") as HTMLElement | null;
        if (infoContainer)
        {
            const overlay: HTMLDivElement = document.createElement("div");
            overlay.classList.add("information-overlay");
            overlay.style.position = "absolute";
            overlay.style.inset = "0";
            overlay.style.zIndex = "1";
            overlay.style.backgroundColor = "black";
            overlay.style.opacity = "0.15";
            infoContainer.appendChild(overlay);

            window.addEventListener("scroll", (): void =>
            {
                const scrollTop: number = window.scrollY || document.documentElement.scrollTop;
                const scrollFraction: number = Math.min(scrollTop / window.innerHeight, 1);
                overlay.style.opacity = `${0.1 + scrollFraction}`;
            });
        }

        const movieData: any = await apiMovie(1);
        for (const item of movieData.results as any[])
        {
            if (item.id !== data.id && item.genre_ids && hasCommonGenres(item.genre_ids as number[]))
            {
                const card: HTMLAnchorElement | null = createhorizontalPosterCard(item, "movie");
                if (card) grid.appendChild(card);
            }
        }

        const seriesData: any = await apiSeries(1);
        for (const item of seriesData.results as any[])
        {
            if (item.id !== data.id && item.genre_ids && hasCommonGenres(item.genre_ids as number[]))
            {
                const card: HTMLAnchorElement | null = createhorizontalPosterCard(item, "tv");
                if (card) grid.appendChild(card);
            }
        }
    }
}