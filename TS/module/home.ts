import { populatePopularFilmCarousel } from '../pages/home/film/Popular.js';
import { populatePopularSeriesCarousel } from '../pages/home/serie/Popular.js';
import { filmHero } from '../pages/home/hero/heroCarousel.js';
import { leftBtnSlide } from '../pages/home/hero/buttonSlide.js';
import { rightBtnSlide } from '../pages/home/hero/buttonSlide.js';
import { redirectIfMobile } from '../pages/mobile/mobile.js';
import { populateTopRatedFilmCarousel } from '../pages/home/film/topRated.js';
import { populateTopRatedSeriesCarousel } from '../pages/home/serie/topRated.js';
import { populateUpcomingFilmCarousel } from '../pages/home/film/Upcoming.js';
import { populateUpcomingSeriesCarousel } from '../pages/home/serie/Upcoming.js';
import { initCarouselControls } from '../pages/home/buttonScroll.js';

redirectIfMobile();
filmHero();
leftBtnSlide();
rightBtnSlide();
populatePopularFilmCarousel();
populatePopularSeriesCarousel();
populateTopRatedFilmCarousel();
populateTopRatedSeriesCarousel();
populateUpcomingFilmCarousel();
populateUpcomingSeriesCarousel();
initCarouselControls();