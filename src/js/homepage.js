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


function loadHeader() {
    fetch('/dist/components/header.html')
    .then(r => r.text())
    .then(html => {
        //debugger;
      document.getElementById('header-include').innerHTML = html;
      // If you need to run header-related JS, do it here
    });
}

document.addEventListener('DOMContentLoaded', () => {
    
});


selectedProducts.init();
newProductsArrival.init();
// loadHeader();