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
    paginationRequired : true
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

  // Reset products and update pagination
  catalogProducts.resetProducts();
  catalogProducts.createPageButtons(); // Regenerate pagination buttons
  catalogProducts.updatePaginationChange(catalogProducts.currentPage); // Update pagination state
});

document.getElementById('sort').addEventListener('change', (event) => {
  catalogProducts.rerenderProducts({sortOrder: event.target.value})
})

document.querySelector('.search-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const searchInput = event.target.querySelector('input[type="search"]');
    const searchTerm = searchInput.value.trim();

    if (searchTerm) {
        // Use SetOfProducts to find product by name
        const foundProduct = await catalogProducts.findProductByName(searchTerm);
        if (foundProduct) {
            localStorage.setItem('selectedProduct', JSON.stringify(foundProduct));
            window.location.href = '/dist/pages/product-details-template.html';
            return;
        }
        else  {
            catalogProducts.showNotification('No products found for the entered search term.');
        }
              
    }
});

document.addEventListener('DOMContentLoaded', () => {
  const pageButtons = document.querySelectorAll('.page-button');

  pageButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
          catalogProducts.currentPage = index; // Set the current page
          catalogProducts.rerenderProducts({currentPage: index});
      });
  });

  bestSets();
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

document.querySelector('.btn-hide').addEventListener('click', () => {
    const filtersForm = document.querySelector('.filters');
    const showFiltersButton = document.createElement('button');

    // Приховати форму фільтрації
    filtersForm.style.display = 'none';

    // Створити кнопку "Show filters"
    showFiltersButton.textContent = 'Show filters';
    showFiltersButton.classList.add('main-button', 'btn-show');
    filtersForm.parentNode.insertBefore(showFiltersButton, filtersForm);

    // Додати обробник для кнопки "Show filters"
    showFiltersButton.addEventListener('click', () => {
        // Показати форму фільтрації
        filtersForm.style.display = 'block';

        // Видалити кнопку "Show filters"
        showFiltersButton.remove();
    });
});

export function bestSets() {
  // Fetch products from data.json
  fetch('/dist/assets/data.json')
      .then(response => response.json())
      .then(products => {
        
          const luggageSets = products.data.filter(product => product.category === 'luggage sets');

          // Randomly pick up to 5 products
          const selectedSets = luggageSets.sort(() => 0.5 - Math.random()).slice(0, 5);

          // Generate and insert markup for each product
          const topSetsSection = document.querySelector('.top-sets');
          selectedSets.forEach(product => {
              const productFragment = createProductFragment(product);
              topSetsSection.appendChild(productFragment);
          });
      })
      .catch(error => console.error('Error fetching products:', error));

  // Inner function to create a product fragment
  function createProductFragment(product) {
      const fragment = document.createDocumentFragment();

      // Create the top-set-card container
      const card = document.createElement('article');
      card.classList.add('top-set-card');

      // Image block
      const imageWrapper = document.createElement('div');
      imageWrapper.classList.add('top-set-image');
      const image = document.createElement('img');
      image.src = `${product.imageUrl}`;
      image.alt = product.name;
      image.width = 87;
      image.height = 87;
      image.classList.add('top-set-photo');
      imageWrapper.appendChild(image);

      // Info block
      const infoWrapper = document.createElement('div');
      infoWrapper.classList.add('top-set-info');

      // Product description
      const description = document.createElement('p');
      description.classList.add('top-set-desc');
      description.textContent = product.name;
      infoWrapper.appendChild(description);

      // Rating block
      const ratingWrapper = document.createElement('div');
      ratingWrapper.classList.add('top-set-rating');
      const rating = Math.floor(product.rating); // Use the integer part of the rating
      for (let i = 0; i < rating; i++) {
          const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          star.classList.add('star-icon');
          const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
          use.setAttribute('href', '#star');
          star.appendChild(use);
          ratingWrapper.appendChild(star);
      }
      infoWrapper.appendChild(ratingWrapper);

      // Product price
      const price = document.createElement('p');
      price.classList.add('top-set-price');
      price.textContent = `$${product.price}`;
      infoWrapper.appendChild(price);

      // Append image and info blocks to the card
      card.appendChild(imageWrapper);
      card.appendChild(infoWrapper);

      // Attach click event handler for redirect and localStorage (like product card)
      card.addEventListener('click', () => {
          const productData = {
              id: product.id,
              name: product.name,
              price: product.price,
              imageUrl: product.imageUrl,
              salesStatus: product.salesStatus,
              rating: product.rating
          };
          localStorage.setItem('selectedProduct', JSON.stringify(productData));
          window.location.href = '/dist/pages/product-details-template.html';
      });

      // Append the card to the fragment
      fragment.appendChild(card);

      return fragment;
  }
}