const leftBtn = document.querySelector('.btn-container-left__button');
const rightBtn = document.querySelector('.btn-container-right__button');
const carousel = document.querySelector('.carosello');
const carouselIndex = document.querySelectorAll('.carosello-index__dot');

let position = -181.25, index = 0;
let isSliding = false;
carousel.style.transform = `translateX(${position}vw)`;
carouselIndex[index].style.backgroundColor = 'white';

export function leftBtnSlide()
{
    leftBtn.addEventListener('click',  () =>
    {
        if (isSliding) return;
        isSliding = true;

        position += 92.5;
        carousel.style.transform = `translateX(${position}vw)`;

        if (position > -181.25)
        {
            position = -551.25;
            
            setTimeout(() =>
            {
                carousel.classList.add("no-transition");
                void carousel.offsetWidth;
                carousel.style.transform = `translateX(${position}vw)`;
                void carousel.offsetWidth;
                carousel.classList.remove("no-transition");
                isSliding = false;
            },600);

            carouselIndex[index].style.backgroundColor = 'rgb(150, 150, 150)';
            index = 4;
            carouselIndex[index].style.backgroundColor = 'white';
        }
        else
        {
            carouselIndex[index--].style.backgroundColor = 'rgb(150, 150, 150)';
            carouselIndex[index].style.backgroundColor = 'white';
            isSliding = false;
        }
    });
}

export function rightBtnSlide()
{
    rightBtn.addEventListener('click',  () =>
    {
        if (isSliding) return;
        isSliding = true;

        position -= 92.5;
        carousel.style.transform = `translateX(${position}vw)`;

        if (position < -642.75)
        {
            position = -181.25;

            setTimeout(() =>
            {
                carousel.classList.add("no-transition");
                void carousel.offsetWidth;
                carousel.style.transform = `translateX(${position}vw)`;
                void carousel.offsetWidth;
                carousel.classList.remove("no-transition");
                isSliding = false;
            },600);

            carouselIndex[index].style.backgroundColor = 'rgb(150, 150, 150)';
            index = 0;
            carouselIndex[index].style.backgroundColor = 'white';
        }
        else
        {
            carouselIndex[index++].style.backgroundColor = 'rgb(150, 150, 150)';
            carouselIndex[index].style.backgroundColor = 'white';
            isSliding = false;
        }
    });
}