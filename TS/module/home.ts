import { populatePopularCarousel } from '../pages/home/film/Popular.js';
import { filmHero } from '../pages/home/hero/heroCarousel.js';
import { leftBtnSlide } from '../pages/home/hero/buttonSlide.js';
import { rightBtnSlide } from '../pages/home/hero/buttonSlide.js';
import { redirectIfMobile } from '../pages/mobile/mobile.js';
import { populateTopRatedCarousel } from '../pages/home/film/topRated.js';

redirectIfMobile();
filmHero();
populatePopularCarousel();
leftBtnSlide();
rightBtnSlide();
populateTopRatedCarousel();