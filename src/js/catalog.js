import { SetOfProducts } from './main.js';

document.querySelectorAll('.custom-select').forEach(wrapper => {
  const display = wrapper.querySelector('.select-display');
  const options = wrapper.querySelectorAll('.select-options li');
  const hiddenSelect = wrapper.nextElementSibling; 

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      const value = opt.dataset.value;
      display.textContent = opt.textContent;
      hiddenSelect.value = value;
      hiddenSelect.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });

});

const catalogProducts = new SetOfProducts({
    productsContainer:  document.getElementById('catalog-products'),
    productBlock: "all",
    addToCartBtn: document.querySelector('.js--form'),
    productCountHolder: document.getElementById('productCount'),
});

catalogProducts.init();


const size = document.getElementById('size');
const color = document.getElementById('color');
const category = document.getElementById('category');
const sales = document.getElementById('sales');

size.addEventListener('change', (event) => {
  // console.log(event.target.value);
  catalogProducts.rerenderProducts({filterSize: event.target.value})
});

color.addEventListener('change', (event) => {
  // console.log(event.target.value);
  catalogProducts.rerenderProducts({filterColor: event.target.value})
});

category.addEventListener('change', (event) => {
  // console.log(event.target.value);
  catalogProducts.rerenderProducts({filterCategory: event.target.value})
});

sales.addEventListener('change', (event) => {
  catalogProducts.rerenderProducts({filterSales: event.target.checked})
})

document.addEventListener('DOMContentLoaded', () => {
  const pageButtons = document.querySelectorAll('.page-button');

  pageButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
          console.log(`Button with index ${index} was clicked`);
          catalogProducts.rerenderProducts({currentPage: index});
      });
  });
});