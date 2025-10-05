import { addToCart } from './cartManager.js';
import { showNotification } from './utilities/notificationManager.js';

// --- Pure helpers ---
function filterBySize(products, size) {
    if (!size) return products;
    switch (size) {
        case 'S-L':
            return products.filter(product => ["S", "M", "L"].includes(product.size));
        case 'S, M, XL':
            return products.filter(product => product.size === size);
        default:
            return products.filter(product => product.size === size);
    }
}
function filterByColor(products, color) {
    return color ? products.filter(product => product.color === color) : products;
}
function filterByCategory(products, category) {
    return category ? products.filter(product => product.category === category) : products;
}
function filterBySales(products, sales) {
    return sales ? products.filter(product => product.salesStatus === true) : products;
}
function sortProducts(products, sortOrder) {
    switch (sortOrder) {
        case 'price-asc':
            return [...products].sort((a, b) => a.price - b.price);
        case 'price-desc':
            return [...products].sort((a, b) => b.price - a.price);
        case 'popularity':
            return [...products].sort((a, b) => b.popularity - a.popularity);
        case 'rating':
            return [...products].sort((a, b) => b.rating - a.rating);
        default:
            return products;
    }
}
function pickRandom(products, count) {
    if (count > 0 && products.length > count) {
        return [...products].sort(() => Math.random() - 0.5).slice(0, count);
    }
    return products;
}

// --- Factory function ---
export function SetOfProducts(config) {
    // State
    const state = {
        filterSize: '',
        filterColor: '',
        filterCategory: '',
        filterSales: false,
        sortOrder: '',
        productCounter: 0,
        pageCount: 0,
        currentPage: 0,
        randomCount: config.randomCount || 0,
        _cardTemplate: null,
        ...config
    };

    // --- Methods ---

    // Extracted product card click handler
    function onProductCardClick(event, product) {
        if (event.target.classList.contains('product-button')) {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl
            });
            return;
        }
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
    }

    // Extracted page button click handler
    function onPageButtonClick(i) {
        state.currentPage = i;
        rerenderProducts({ currentPage: i });
    }

    async function loadCardTemplate() {
        if (state._cardTemplate) return state._cardTemplate;
        const templateResponse = await fetch('/dist/components/product-card.html');
        const template = await templateResponse.text();
        const cardWrapper = document.createElement('div');
        cardWrapper.innerHTML = template;
        state._cardTemplate = cardWrapper.querySelector('template');
        return state._cardTemplate;
    }

    function updateProductCountDisplay() {
        if (state.productCountHolder) {
            const start = state.currentPage * 12 + 1;
            const end = Math.min(state.productCounter, (state.currentPage + 1) * 12);
            state.productCountHolder.textContent = `Showing ${start}-${end} Of ${state.productCounter} Results`;
        }
    }

    async function loadProducts(params = {}) {
        // Update state with provided params
        Object.assign(state, params);

        let filteredProducts = [];
        const fragment = document.createDocumentFragment();

        let products;
        try {
            const getProductsResponse = await fetch('/dist/assets/data.json');
            if (!getProductsResponse.ok) throw new Error(`HTTP error! status: ${getProductsResponse.status}`);
            products = await getProductsResponse.json();
        } catch (error) {
            showNotification('Failed to load products. Please try again later.');
            console.error('Product fetch error:', error);
            return fragment; // Return empty fragment on error
        }

        filteredProducts = (state.productBlock && state.productBlock !== 'all')
            ? products.data.filter(product => product.blocks.includes(state.productBlock))
            : products.data;

        filteredProducts = filterBySize(filteredProducts, state.filterSize);
        filteredProducts = filterByColor(filteredProducts, state.filterColor);
        filteredProducts = filterByCategory(filteredProducts, state.filterCategory);
        filteredProducts = filterBySales(filteredProducts, state.filterSales);
        filteredProducts = sortProducts(filteredProducts, state.sortOrder);
        filteredProducts = pickRandom(filteredProducts, state.randomCount);

        if (filteredProducts.length === 0) {
            showNotification('No products found for the entered search term.', resetProducts);
            return document.createDocumentFragment();
        }

        // Pagination and product count
        state.productCounter = filteredProducts.length;
        state.pageCount = Math.ceil(state.productCounter / 12);

        if (state.currentPage >= state.pageCount) state.currentPage = 0;
        updateProductCountDisplay();

        if (state.productCounter > 12) {
            filteredProducts = filteredProducts.slice(state.currentPage * 12, (state.currentPage + 1) * 12);
        }

        const template = await loadCardTemplate();

        filteredProducts.forEach(({ id, imageUrl, name, price, salesStatus, rating }) => {
            const templateClone = template.content.cloneNode(true);
            const productCard = templateClone.querySelector('.product-card');
            productCard.setAttribute('data-id', id);

            templateClone.querySelector('.product-image').src = imageUrl;
            if (salesStatus !== true) {
                templateClone.querySelector('.badge').classList.add('hidden');
            }
            templateClone.querySelector('.product-name').textContent = name;
            templateClone.querySelector('.product-price').textContent = `$${price}`;

            // Use extracted handler
            productCard.addEventListener('click', (event) =>
                onProductCardClick(event, { id, name, price, imageUrl, salesStatus, rating })
            );

            fragment.appendChild(templateClone);
        });

        return fragment;
    }

    async function init() {
        const fragment = await loadProducts({ productBlock: state.productBlock });
        state.productsContainer.replaceChildren(fragment);
        if (state.paginationRequired) createPageButtons();
    }

    async function resetProducts() {
        state.filterSize = '';
        state.filterColor = '';
        state.filterCategory = '';
        state.filterSales = false;
        state.currentPage = 0;
        const fragment = await loadProducts({ productBlock: state.productBlock });
        state.productsContainer.replaceChildren(fragment);
        createPageButtons();
        updatePaginationChange(state.currentPage);
    }

    async function rerenderProducts(params = {}) {
        const renderFragment = await loadProducts(params);
        state.productsContainer.replaceChildren(renderFragment);
        createPageButtons();
        updatePaginationChange(state.currentPage);
    }

    function updatePaginationChange(currentPage) {
        const btnPrev = document.querySelector('.btn-prev');
        const btnNext = document.querySelector('.btn-next');
        const pageButtons = document.querySelectorAll('.page-button');
        if (btnPrev) btnPrev.style.display = currentPage === 0 ? 'none' : 'inline-block';
        if (btnNext) btnNext.style.display = currentPage === state.pageCount - 1 ? 'none' : 'inline-block';
        pageButtons.forEach((button, index) => {
            if (index === currentPage) button.classList.add('active');
            else button.classList.remove('active');
        });
    }

    function createPageButtons() {
        const paginationContainer = document.querySelector('.page-buttons');
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';
        for (let i = 0; i < state.pageCount; i++) {
            const button = document.createElement('button');
            button.classList.add('page-button');
            if (i === state.currentPage) button.classList.add('active');
            button.textContent = i + 1;
            // Use extracted handler
            button.addEventListener('click', () => onPageButtonClick(i));
            paginationContainer.appendChild(button);
        }
    }

    async function findProductByName(name) {
        const getProductsResponse = await fetch('/dist/assets/data.json');
        if (!getProductsResponse.ok) return null;
        const productsData = await getProductsResponse.json();
        const products = productsData.data || productsData;
        const trimmedName = name.trim().toLowerCase();
        return products.find(
            p => p.name && p.name.trim().toLowerCase() === trimmedName
        ) || null;
    }

    // --- API ---
    return {
        init,
        resetProducts,
        rerenderProducts,
        findProductByName,
        updateProductCountDisplay,
        get currentPage() { return state.currentPage; },
        set currentPage(val) { state.currentPage = val; },
        get pageCount() { return state.pageCount; },
        get productCounter() { return state.productCounter; }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.main-nav');
    const closeBtn = document.querySelector('.close-menu');
  
    burger.addEventListener('click', () => {
      nav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  
    closeBtn.addEventListener('click', () => {
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });

    // --- Show popup login form ---
    const loginToggle = document.querySelector('.header-login-toggle');
    const popup = document.querySelector('.popup');
    if (loginToggle && popup) {
        loginToggle.addEventListener('click', (e) => {
            e.preventDefault();
            popup.style.display = 'block';
            popup.classList.add('active');

            // Add outside click handler
            setTimeout(() => {
                document.addEventListener('mousedown', handleOutsideClick);
            }, 0);
        });

        function handleOutsideClick(event) {
            if (!popup.contains(event.target) && event.target !== loginToggle) {
                popup.style.display = 'none';
                popup.classList.remove('active');
                document.removeEventListener('mousedown', handleOutsideClick);
            }
        }
    }

    // --- Email validation for login form ---
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            const emailInput = loginForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                e.preventDefault();
                emailInput.classList.add('input-error');
                if (!loginForm.querySelector('.email-error')) {
                    const error = document.createElement('div');
                    error.className = 'email-error';
                    error.style.color = 'red';
                    error.style.fontSize = '0.9em';
                    error.textContent = 'Please enter a valid email address.';
                    emailInput.parentNode.appendChild(error);
                }
            } else {
                emailInput.classList.remove('input-error');
                const error = loginForm.querySelector('.email-error');
                if (error) error.remove();
            }
        });

        const emailInput = loginForm.querySelector('input[type="email"]');
        emailInput.addEventListener('input', function () {
            emailInput.classList.remove('input-error');
            const error = loginForm.querySelector('.email-error');
            if (error) error.remove();
        });
    }

    // --- Password show/hide toggle ---
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-button');
    if (passwordInput && toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleBtn.classList.add('shown');
            } else {
                passwordInput.type = 'password';
                toggleBtn.classList.remove('shown');
            }
        });
    }
});



