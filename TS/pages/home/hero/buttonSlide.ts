const leftBtn: HTMLButtonElement = document.querySelector('.btn-container-left__button') as HTMLButtonElement;
const rightBtn: HTMLButtonElement = document.querySelector('.btn-container-right__button') as HTMLButtonElement;
const carousel: HTMLElement = document.querySelector('.carosello') as HTMLElement;
const carouselIndex: NodeListOf<HTMLElement> = document.querySelectorAll('.carosello-index__dot') as NodeListOf<HTMLElement>;

let position: number = 0;
let index: number = 0;
let canClick: boolean = true;
carousel.style.transform = `translateX(${position}vw)`;
carouselIndex[index].style.backgroundColor = 'white';

function setInitialPosition(): void
{
    if (window.innerWidth <= 480)
    {
        position = -156;
    }
    else
    {
        position = -181.25;
    }
    carousel.style.transform = `translateX(${position}vw)`;
    carouselIndex[index].style.backgroundColor = 'rgb(150, 150, 150)';
    index=0;
    carouselIndex[0].style.backgroundColor = 'white';
}

// Imposta la posizione iniziale
setInitialPosition();

// Aggiorna posizione al resize
window.addEventListener('resize', setInitialPosition);

export function leftBtnSlide(): void
{
    leftBtn.addEventListener('click', () =>
    {
        if (!canClick) return;
        canClick = false;
        if(window.innerWidth <= 480)
            position += 82.5;
        else
            position += 92.5;

        carousel.style.transform = `translateX(${position}vw)`;

        if (window.innerWidth <= 480)
        {
            if (position > -156)
            {
                position = -486;
                index = 4;
                resetCarousel(0);
            }
            else
            {
                index--;
                updateIndex(index, index+1);
            }
        }
        else
        {
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
        }

    });
}

export function rightBtnSlide(): void
{
    rightBtn.addEventListener('click', () =>
    {
        if (!canClick) return;
        canClick = false;

        if(window.innerWidth <= 480)
            position -= 82.5;
        else
            position -= 92.5;

        carousel.style.transform = `translateX(${position}vw)`;

        if(window.innerWidth <= 480)
        {
            if( position < -551.25)
            {
                position = -156;
                index = 0;
                resetCarousel(4);
            }
            else
            {
                index++;
                updateIndex(index, index-1);
            }
        }
        else
        {
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
        }

    });
}

function resetCarousel(lastIndex: number): void
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

function updateIndex(newIndex: number, prevIndex: number): void
{
    carouselIndex[prevIndex].style.backgroundColor = 'rgb(150, 150, 150)';
    carouselIndex[newIndex].style.backgroundColor = 'white';
    index = newIndex;
    setTimeout(() => {
        canClick = true;
    }, 600);
}