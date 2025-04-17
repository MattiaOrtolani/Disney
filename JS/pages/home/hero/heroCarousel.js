var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { apiPopular } from '../../../api/apiPopular.js';
const carousel = document.querySelector('.carosello');
export const filmHero = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield apiPopular();
    const films = data.results.slice(0, 5);
    const looped = [
        films[3],
        films[4],
        films[0],
        films[1],
        films[2],
        films[3],
        films[4],
        films[0],
        films[1],
    ];
    carousel.innerHTML = '';
    looped.forEach((film) => {
        const banner = document.createElement('a');
        banner.classList.add('carosello__banner');
        banner.href = `../../../pages/information.html?id=${film.id}&type=movie`;
        banner.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w1920${film.backdrop_path}" alt="${film.title}">
            <h1>${film.title}</h1>
        `;
        carousel.appendChild(banner);
    });
});
