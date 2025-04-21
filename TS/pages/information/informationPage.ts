import { apiMovie } from "../../api/apiMovie.js";
import { apiSeries } from "../../api/apiSeries.js";
import { apiGenreMovie } from "../../api/apiGenreMovie.js";
import { apiGenreSeries } from "../../api/apiGenreSeries.js";
import { apiDetail } from "../../api/apiDetail.js";

export async function initInformationPage(): Promise<void>
{
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const type = params.get("type");

    if (!id || !type)
    {
        console.error("ID o tipo non presente nell'URL");
        return;
    }

    let genreList;
    if (type === "movie")
    {
        genreList = await apiGenreMovie();
    }
    else
    {
        genreList = await apiGenreSeries();
    }
    const genres = genreList.genres as { id: number; name: string }[];
    const data = await apiDetail(type, id);

    if (!data)
    {
        console.error("Nessun film o serie trovato con questo ID");
        return;
    }

    const backgroundImg = document.querySelector(".background-container__img") as HTMLImageElement | null;
    if (backgroundImg && data.backdrop_path)
    {
        backgroundImg.src = `https://image.tmdb.org/t/p/w1920${data.backdrop_path}`;
    }

    const titleElement = document.querySelector(".information-box__title") as HTMLElement | null;
    if (titleElement)
    {
        titleElement.textContent = data.title || data.name || "Titolo non disponibile";
    }

    const descriptionElement = document.querySelector(".information-box__description") as HTMLElement | null;
    if (descriptionElement)
    {
        descriptionElement.textContent = data.overview || "Descrizione non disponibile.";
    }

    const featuresInfo = document.querySelectorAll<HTMLElement>(".features-info__text");
    if (featuresInfo.length >= 2)
    {
        const voto = data.vote_average ? data.vote_average.toFixed(1) : "N/A";
        const eta = data.adult ? "18+" : "16+";
        featuresInfo[0].textContent = voto;
        featuresInfo[1].textContent = eta;
    }

    const technicalInfo = document.querySelectorAll<HTMLElement>(".technical-info__text");
    if (technicalInfo.length >= 2)
    {
        const dataUscita = data.release_date || data.first_air_date || "";
        const anno = dataUscita.split("-")[0] || "Anno non disponibile";
        technicalInfo[0].textContent = anno;

        if (data.genres && genres.length > 0)
        {
            const genreNames = (data.genres as { name: string }[]).map((g) => g.name);
            technicalInfo[1].textContent = genreNames.length > 0
                ? genreNames.join(", ")
                : "Genere non disponibile";
        }
        else
        {
            technicalInfo[1].textContent = "Genere non disponibile";
        }
    }

    const grid = document.querySelector(".grid-result") as HTMLElement | null;
    if (grid && data.genres)
    {
        const targetGenres = (data.genres as { id: number }[]).map((g) => g.id);

        function hasCommonGenres(itemGenres: number[]): boolean
        {
            return itemGenres.some((id) => targetGenres.includes(id));
        }

        const suggestions: HTMLAnchorElement[] = [];

        async function loadTypeItems(type: "movie" | "tv", apiFn: (page: number) => Promise<any>)
        {
            let page = 1;
            let total = Infinity;

            while (page <= total)
            {
                const pageData = await apiFn(page);
                total = pageData.total_pages;

                for (const item of pageData.results as any[])
                {
                    if (item.id !== data.id && hasCommonGenres(item.genre_ids as number[]))
                    {
                        const card = createhorizontalPosterCard(item, type);
                        if (card)
                        {
                            suggestions.push(card);
                        }
                    }
                }

                if (suggestions.length >= 8)
                {
                    break;
                }

                page++;
            }
        }

        await loadTypeItems("movie", apiMovie);
        if (suggestions.length < 6)
        {
            await loadTypeItems("tv", apiSeries);
        }

        suggestions.slice(0, 8).forEach((card) =>
        {
            grid.appendChild(card);
        });

        function createhorizontalPosterCard(item: any, type: string): HTMLAnchorElement | null
        {
            if (!item.backdrop_path || item.id === data.id)
            {
                return null;
            }

            const link = document.createElement("a");
            link.classList.add("horizontal-poster");
            link.href = `../../../pages/information.html?id=${item.id}&type=${type}`;
            link.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${item.backdrop_path})`;
            link.style.backgroundSize = "cover";
            link.style.display = "block";
            return link;
        }

        const infoContainer = document.querySelector(".information-container") as HTMLElement | null;
        if (infoContainer)
        {
            const overlay = document.createElement("div");
            overlay.classList.add("information-overlay");
            overlay.style.position = "absolute";
            overlay.style.inset = "0";
            overlay.style.zIndex = "1";
            overlay.style.backgroundColor = "black";
            overlay.style.opacity = "0.15";
            infoContainer.appendChild(overlay);

            window.addEventListener("scroll", (): void =>
            {
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const scrollFraction = Math.min(scrollTop / window.innerHeight, 1);
                overlay.style.opacity = `${0.1 + scrollFraction}`;
            });
        }
    }
}