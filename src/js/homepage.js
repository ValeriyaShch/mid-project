import { SetOfProducts } from './main.js';

// todo: Refactor to avoid addtocartbtn being null
const selectedProducts = new SetOfProducts({
    productsContainer:  document.getElementById('product-cards'),
    productBlock: "Selected Products",
    addToCartBtn: document.querySelector('.js--form')
});

const newProductsArrival = new SetOfProducts({
    productsContainer:  document.getElementById('new-product-cards'),
    productBlock: "New Products Arrival",
    addToCartBtn: document.querySelector('.js--form')
});

document.addEventListener('DOMContentLoaded', () => {
    const availableCardAmount = 4;
  const travelCards = document.querySelector('.travel-cards');
  const cards = travelCards.querySelectorAll('div');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  let currentIndex = 0;

  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(travelCards).gap) || 0;
    travelCards.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    // Hide prev button if first card, next button if last card
    prevBtn.style.display = currentIndex === 0 ? 'none' : '';
    nextBtn.style.display = currentIndex === cards.length - availableCardAmount ? 'none' : '';
  }

  prevBtn.addEventListener('click', () => {  
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < cards.length - availableCardAmount) {
      currentIndex++;
      updateCarousel();
    }
  });

  window.addEventListener('resize', updateCarousel);

  updateCarousel();
});

selectedProducts.init();
newProductsArrival.init();
