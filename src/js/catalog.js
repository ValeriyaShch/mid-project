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

// Filter Buttons
document.querySelector('.btn-clear').addEventListener('click', () => {
  document.querySelectorAll('.select-display').forEach(display => {
    display.textContent = 'Choose option';
  });
  // Reset hidden select elements
  document.querySelectorAll('.filter-select').forEach(select => {
    select.value = '';
  });
  // Reset checkboxes
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = false;
  });

  catalogProducts.resetProducts();
}) 

document.getElementById('sort').addEventListener('change', (event) => {
  catalogProducts.rerenderProducts({sortOrder: event.target.value})
})

// document.querySelector('.search-form').addEventListener('submit', (event) => {
//   event.preventDefault();
//   const searchInput = document.getElementById('search-input');
//   catalogProducts.rerenderProducts({searchTerm: searchInput.value})
// })

document.addEventListener('DOMContentLoaded', () => {
  const pageButtons = document.querySelectorAll('.page-button');

  pageButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
          catalogProducts.currentPage = index; // Set the current page
          catalogProducts.rerenderProducts({currentPage: index});
      });
  });
});

document.querySelector('.btn-prev').addEventListener('click', () => {
    if (catalogProducts.currentPage > 0) {
        catalogProducts.currentPage -= 1; // Move to the previous page
        catalogProducts.rerenderProducts({currentPage: catalogProducts.currentPage});
    }
});

document.querySelector('.btn-next').addEventListener('click', () => {
    if (catalogProducts.currentPage < catalogProducts.pageCount - 1) {
        catalogProducts.currentPage += 1; // Move to the next page
        catalogProducts.rerenderProducts({currentPage: catalogProducts.currentPage});
    }
});