import { SetOfProducts } from './main.js';

// Todo: Insert classes for  buttons
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

selectedProducts.init();
newProductsArrival.init();