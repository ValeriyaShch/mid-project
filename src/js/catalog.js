import { SetOfProducts } from './main.js';
import { showNotification } from './utilities/notificationManager.js';
import { renderProductCard } from './utilities/renderProductCard.js';

document.querySelectorAll('.custom-select').forEach((wrapper) => {
  const display = wrapper.querySelector('.select-display');
  const options = wrapper.querySelectorAll('.select-options li');
  const hiddenSelect = wrapper.nextElementSibling;

  options.forEach((opt) => {
    opt.addEventListener('click', () => {
      const value = opt.dataset.value;
      display.textContent = opt.textContent;
      hiddenSelect.value = value;
      hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });
});

const catalogProducts = SetOfProducts({
  productsContainer: document.getElementById('catalog-products'),
  productBlock: 'all',
  productCountHolder: document.getElementById('productCount'),
  paginationRequired: true,
});

catalogProducts.init();

const size = document.getElementById('size');
const color = document.getElementById('color');
const category = document.getElementById('category');
const sales = document.getElementById('sales');

size.addEventListener('change', (event) => {
  // console.log(event.target.value);
  catalogProducts.rerenderProducts({ filterSize: event.target.value });
});

color.addEventListener('change', (event) => {
  // console.log(event.target.value);
  catalogProducts.rerenderProducts({ filterColor: event.target.value });
});

category.addEventListener('change', (event) => {
  // console.log(event.target.value);
  catalogProducts.rerenderProducts({ filterCategory: event.target.value });
});

sales.addEventListener('change', (event) => {
  catalogProducts.rerenderProducts({ filterSales: event.target.checked });
});

// Filter Buttons
document.querySelector('.btn-clear').addEventListener('click', () => {
  document.querySelectorAll('.select-display').forEach((display) => {
    display.textContent = 'Choose option';
  });
  // Reset hidden select elements
  document.querySelectorAll('.filter-select').forEach((select) => {
    select.value = '';
  });
  // Reset checkboxes
  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = false;
  });

  // Reset products and update pagination
  catalogProducts.resetProducts();
  catalogProducts.createPageButtons(); // Regenerate pagination buttons
  catalogProducts.updatePaginationChange(catalogProducts.currentPage); // Update pagination state
});

document.getElementById('sort').addEventListener('change', (event) => {
  catalogProducts.rerenderProducts({ sortOrder: event.target.value });
});

document
  .querySelector('.search-form')
  .addEventListener('submit', async (event) => {
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
      } else {
        showNotification('No products found for the entered search term.');
      }
    }
  });

document.addEventListener('DOMContentLoaded', () => {
  const pageButtons = document.querySelectorAll('.page-button');

  pageButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      catalogProducts.currentPage = index; // Set the current page
      catalogProducts.rerenderProducts({ currentPage: index });
    });
  });

  bestSets();
});

document.querySelector('.btn-prev').addEventListener('click', () => {
  if (catalogProducts.currentPage > 0) {
    catalogProducts.currentPage -= 1; // Move to the previous page
    catalogProducts.rerenderProducts({
      currentPage: catalogProducts.currentPage,
    });
  }
});

document.querySelector('.btn-next').addEventListener('click', () => {
  if (catalogProducts.currentPage < catalogProducts.pageCount - 1) {
    catalogProducts.currentPage += 1; // Move to the next page
    catalogProducts.rerenderProducts({
      currentPage: catalogProducts.currentPage,
    });
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

function renderTopSetCard(product) {
  const { imageUrl, name, price, rating } = product;
  const card = document.createElement('div');
  card.className = 'top-set-card';

  card.innerHTML = `
        <div class="top-set-image">
            <img src="${imageUrl}" alt="${name}" class="top-set-photo" width="87" height="87">
        </div>
        <div class="top-set-info">
            <div class="top-set-desc">${name}</div>
            <div class="top-set-rating">
                ${[...Array(Math.floor(rating || 0))]
                  .map(
                    () =>
                      `<svg class="star-icon" width="12" height="12"><use href="#star"></use></svg>`,
                  )
                  .join('')}
            </div>
            <div class="top-set-price">$${price}</div>
        </div>
    `;
  // Optional: click handler to go to product details
  card.addEventListener('click', () => {
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    window.location.href = '/dist/pages/product-details-template.html';
  });
  return card;
}

export function bestSets() {
  fetch('/dist/assets/data.json')
    .then((response) => {
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then((products) => {
      const luggageSets = products.data.filter(
        (product) => product.category === 'luggage sets',
      );
      const selectedSets = luggageSets
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);

      const topSetsSection = document.querySelector('.top-sets');
      topSetsSection.innerHTML = '';
      for (const product of selectedSets) {
        const card = renderTopSetCard(product);
        topSetsSection.appendChild(card);
      }
    })
    .catch((error) => {
      showNotification('Failed to load top sets. Please try again later.');
      console.error('Top sets fetch error:', error);
    });
}
