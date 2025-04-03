const leftBtn = document.querySelector('.btn-container-left__button');
const rightBtn = document.querySelector('.btn-container-right__button');
const carousel = document.querySelector('.carosello');
const carouselIndex = document.querySelectorAll('.carosello-index__dot');

let position = -181.25, index = 0;
carousel.style.transform = `translateX(${position}vw)`;
carouselIndex[index].style.backgroundColor = 'white';

export function leftBtnSlide()
{
    leftBtn.addEventListener('click',  () =>
    {
        position += 92.5;
        carousel.style.transform = `translateX(${position}vw)`;
        carouselIndex[index--].style.backgroundColor = 'rgb(150, 150, 150)';
        carouselIndex[index].style.backgroundColor = 'white';
    });
}

export function rightBtnSlide()
{
    rightBtn.addEventListener('click',  () =>
    {
        position -= 92.5;
        carousel.style.transform = `translateX(${position}vw)`;
        carouselIndex[index++].style.backgroundColor = 'rgb(150, 150, 150)';
        carouselIndex[index].style.backgroundColor = 'white';
    });
}