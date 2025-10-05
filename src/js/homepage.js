import { SetOfProducts } from './main.js';

const selectedProducts = SetOfProducts({
    productsContainer:  document.getElementById('product-cards'),
    productBlock: "Selected Products"
});

const newProductsArrival = SetOfProducts({
    productsContainer:  document.getElementById('new-product-cards'),
    productBlock: "New Products Arrival"
});

document.addEventListener('DOMContentLoaded', () => {
    const availableCardAmount = 4;
    const travelCards = document.querySelector('.travel-cards');
    const cards = travelCards.querySelectorAll('div');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentIndex = 0;
    travelCards.style.transition = 'transform 0.5s cubic-bezier(.4,0,.2,1)';

    function updateCarousel() {
        const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(travelCards).gap) || 0;
        travelCards.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        // Hide prev button if first card, next button if last card
        prevBtn.style.display = currentIndex === 0 ? 'none' : '';
        nextBtn.style.display = currentIndex === cards.length - availableCardAmount ? 'none' : '';
    }

    function goNext() {
        if (currentIndex < cards.length - availableCardAmount) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    }

    function goPrev() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = cards.length - availableCardAmount;
        }
        updateCarousel();
    }

    prevBtn.addEventListener('click', () => {  
        goPrev();
        resetAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
        goNext();
        resetAutoSlide();
    });

    window.addEventListener('resize', updateCarousel);

    // Auto-slide every 4 seconds
    let autoSlide = setInterval(goNext, 4000);

    function resetAutoSlide() {
        clearInterval(autoSlide);
        autoSlide = setInterval(goNext, 4000);
    }

    updateCarousel();
});

selectedProducts.init();
newProductsArrival.init();
