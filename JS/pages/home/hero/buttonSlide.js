const leftBtn = document.querySelector('.btn-container-left__button');
const rightBtn = document.querySelector('.btn-container-right__button');
const carousel = document.querySelector('.carosello');
const carouselIndex = document.querySelectorAll('.carosello-index__dot');

let position = -181.25, index = 0;
let canClick = true;
carousel.style.transform = `translateX(${position}vw)`;
carouselIndex[index].style.backgroundColor = 'white';

export function leftBtnSlide()
{
    leftBtn.addEventListener('click', () =>
    {
        if (!canClick) return;
        canClick = false;

        position += 92.5;
        carousel.style.transform = `translateX(${position}vw)`;

        if (position > -181.25)
        {
            position = -551.25;
            index = 4;
            resetCarousel(0);
        }
        else
        {
            index--;
            updateIndex(index, index+1);
        }
    });
}

export function rightBtnSlide()
{
    rightBtn.addEventListener('click', () =>
    {
        if (!canClick) return;
        canClick = false;

        position -= 92.5;
        carousel.style.transform = `translateX(${position}vw)`;

        if (position < -642.75)
        {
            position = -181.25;
            index = 0;
            resetCarousel(4);
        }
        else
        {
            index++;
            updateIndex(index, index-1);
        }
    });
}

function resetCarousel(lastIndex)
{
    setTimeout(() =>
    {
        carousel.classList.add("no-transition");
        void carousel.offsetWidth;
        carousel.style.transform = `translateX(${position}vw)`;
        void carousel.offsetWidth;
        carousel.classList.remove("no-transition");
        canClick = true;
    }, 600);
    carouselIndex[lastIndex].style.backgroundColor = 'rgb(150, 150, 150)';
    carouselIndex[index].style.backgroundColor = 'white';
}

function updateIndex(newIndex, prevIndex)
{
    carouselIndex[prevIndex].style.backgroundColor = 'rgb(150, 150, 150)';
    carouselIndex[newIndex].style.backgroundColor = 'white';
    index = newIndex;
    setTimeout(() => {
        canClick = true;
    }, 600);
}