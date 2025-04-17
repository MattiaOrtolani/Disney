import { filmSection } from '../pages/home/film/newsCarousel.js';
import { filmHero } from '../pages/home/hero/heroCarousel.js';
import { leftBtnSlide } from '../pages/home/hero/buttonSlide.js';
import { rightBtnSlide } from '../pages/home/hero/buttonSlide.js';
import { redirectIfMobile } from '../pages/mobile/mobile.js';

redirectIfMobile();
filmHero();
filmSection();
leftBtnSlide();
rightBtnSlide();