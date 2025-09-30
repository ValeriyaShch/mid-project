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

selectedProducts.init();
newProductsArrival.init();