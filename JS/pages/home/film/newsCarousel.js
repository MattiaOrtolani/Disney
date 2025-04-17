var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { apiNews } from '../../../api/apiNews.js';
const filmCarosello = document.querySelector('.continaer-slide');
export const filmSection = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield apiNews();
    data.results.forEach((film) => {
        const cardHtml = `
            <a class="poster" href="../../../pages/information.html?id=${film.id}&type=movie">
                <img src="https://image.tmdb.org/t/p/w500${film.backdrop_path}" alt="${film.title}">
            </a>
        `;
        filmCarosello.insertAdjacentHTML('beforeend', cardHtml);
    });
});
