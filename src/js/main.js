import { addToCart } from './cartManager.js';

export function SetOfProducts(data) {
    const {
        productsContainer,
        productBlock,
        addToCartBtn,
        productCountHolder,
        paginationRequired = false,
        randomCount = 0 // NEW: number of random products to pick
    } = data;

    this.filterSize = '';
    this.filterColor = ''; 
    this.filterCategory = ''; 
    this.filterSales = false;
    this.sortOrder = '';
    this.searchTerm = '';
    this.productCounter = 0;
    this.pageCount = 0;
    this.currentPage = 0;
    this.randomCount = randomCount; // NEW

    this.init = async function () {
        const fragment = await this.loadProducts({ productBlock });
        productsContainer.replaceChildren(fragment);

        // Create initial page buttons
        if (paginationRequired) this.createPageButtons();
    };

    this.resetProducts = async function () {
        this.filterSize = '';
        this.filterColor = ''; 
        this.filterCategory = ''; 
        this.filterSales = false;
        this.currentPage = 0;

        const fragment = await this.loadProducts({ productBlock });
        productsContainer.replaceChildren(fragment);

        // Regenerate pagination buttons and update pagination state
        this.createPageButtons(); // Ensure buttons are recreated
        this.updatePaginationChange(this.currentPage); // Update pagination state
    }

    this.rerenderProducts = async function ({ productBlock = 'all', filterSize = '', filterColor = '', filterCategory = '', filterSales = false, sortOrder = '', searchTerm = '', currentPage = 0 } = {}) {
        const renderFragment = await this.loadProducts({ productBlock, filterSize, filterColor, filterCategory, filterSales, sortOrder, searchTerm, currentPage });
        productsContainer.replaceChildren(renderFragment);

        // Update pagination buttons and active page
        this.createPageButtons();
        this.updatePaginationChange(this.currentPage);
    };

    this.loadProducts = async function ({productBlock='all', filterSize='', filterColor='', filterCategory='', filterSales=false, sortOrder='', searchTerm='', currentPage=0}={}) {

        // Update filters only if they are provided in the input params
        if (filterSize !== '') this.filterSize = filterSize;
        if (filterColor !== '') this.filterColor = filterColor;
        if (filterCategory !== '') this.filterCategory = filterCategory;
        if (sortOrder !== '') this.sortOrder = sortOrder;
        if (currentPage !== 0) this.currentPage = currentPage;
        this.filterSales = filterSales;

        let filteredProducts = [];
        const fragment = document.createDocumentFragment();

        const getProductsResponse = await fetch('/dist/assets/data.json'); 
        if (!getProductsResponse.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await getProductsResponse.json(); 
        if (productBlock !== 'all') {
            filteredProducts = products.data.filter(product => product.blocks.includes(productBlock));
        }
        else {
            filteredProducts = products.data;
        }
        
        if (this.filterSize) {
            switch (this.filterSize) {
                case 'S-L':
                    const acceptedSizes = ["S", "M", "L"];
                    filteredProducts = filteredProducts.filter(product => acceptedSizes.includes(product.size));
                    break;

                case 'S, M, XL':                        
                    filteredProducts = filteredProducts.filter(product => product.size === this.filterSize);
                    break;
            
                default:
                    filteredProducts = filteredProducts.filter(product => product.size === this.filterSize);
            }
            
        }

        if (this.filterColor) {
            filteredProducts = filteredProducts.filter(product => product.color === this.filterColor);
        }

        if (this.filterCategory) {
            filteredProducts = filteredProducts.filter(product => product.category === this.filterCategory);
        }

        if (this.filterSales) {
            filteredProducts = filteredProducts.filter(product => product.salesStatus === true);
        }

        if (this.sortOrder) {
            switch (this.sortOrder) {
                case 'price-asc':
                    filteredProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    filteredProducts.sort((a, b) => b.price - a.price);
                    break;  
                case 'popularity':
                    filteredProducts.sort((a, b) => b.popularity - a.popularity);
                    break;
                case 'rating':
                    filteredProducts.sort((a, b) => b.rating - a.rating);
                    break;
                default:
                    // No sorting
                    break;
            }   
        }

        if (searchTerm) {
            filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // NEW: Pick random products if randomCount is set
        if (this.randomCount > 0 && filteredProducts.length > this.randomCount) {
            // Shuffle and pick randomCount products
            filteredProducts = filteredProducts
                .sort(() => Math.random() - 0.5)
                .slice(0, this.randomCount);
        }

        // If no products match the search term, show notification
        if (filteredProducts.length === 0) {
            this.showNotification('No products found for the entered search term.');

            // Hide pagination buttons explicitly
            const btnPrev = document.querySelector('.btn-prev');
            const btnNext = document.querySelector('.btn-next');
            if (btnPrev) btnPrev.style.visibility = 'hidden';
            if (btnNext) btnNext.style.visibility = 'hidden';

            return document.createDocumentFragment(); // Return an empty fragment
        }

        // Pagination and product count
        this.productCounter = filteredProducts.length;
        this.pageCount = Math.ceil(this.productCounter / 12);

        // Reset currentPage if it exceeds the new pageCoun
        if (this.currentPage >= this.pageCount) {
            this.currentPage = 0;
        }

        if (productCountHolder) {
            const start = this.currentPage * 12;
            const end = Math.min(this.productCounter, (this.currentPage + 1) * 12);
            productCountHolder.textContent = `Showing ${start}-${end} Of ${this.productCounter} Results`;
        }
        if (this.productCounter>12) {
            filteredProducts = filteredProducts.slice(this.currentPage * 12, (this.currentPage + 1) * 12);
        }


                
        const template = await this.loadCardTemplate();
        
        if (filteredProducts) {
            filteredProducts.forEach(({ id, imageUrl, name, price, salesStatus, rating }) => {
                const templateClone = template.content.cloneNode(true);
                const productCard = templateClone.querySelector('.product-card');
                productCard.setAttribute('data-id', id); // Set product ID
    
                templateClone.querySelector('.product-image').src = imageUrl;
                if (salesStatus !== true) {
                    templateClone.querySelector('.badge').classList.add('hidden');
                }
                templateClone.querySelector('.product-name').textContent = name;
                templateClone.querySelector('.product-price').textContent = `$${price}`;
    
                // Attach click event handler to the product card
                productCard.addEventListener('click', (event) => {
                    // Prevent redirection if the "Add to Cart" button is clicked
                    if (event.target.classList.contains('product-button')) {
                        addToCart({ id, name, price, imageUrl });
                        return;
                    }
    
                    // Redirect to product details page
                    const productData = { id, name, price, imageUrl, salesStatus, rating };
                    localStorage.setItem('selectedProduct', JSON.stringify(productData));
                    window.location.href = '/dist/pages/product-details-template.html';
                });
    
                fragment.appendChild(templateClone);
            });
        }

        return fragment;
        //productsContainer.replaceChildren(fragment);
    
    }

    this.loadCardTemplate = async function () {
        const templateResponse = await fetch('/dist/components/product-card.html');
        const template = await templateResponse.text();

        const cardWrapper = document.createElement('div');
        cardWrapper.innerHTML = template;
        return cardWrapper.querySelector('template');
    }

    this.updatePaginationChange = function (currentPage) {
        const btnPrev = document.querySelector('.btn-prev');
        const btnNext = document.querySelector('.btn-next');
        const pageButtons = document.querySelectorAll('.page-button');

        // Update visibility of .btn-prev
        if (currentPage === 0) {
            btnPrev.style.display = 'none';
        } else {
            btnPrev.style.display = 'inline-block';
        }

        // Update visibility of .btn-next
        if (currentPage === this.pageCount - 1) {
            btnNext.style.display = 'none';
        } else {
            btnNext.style.display = 'inline-block';
        }

        // Update active class for .page-button
        pageButtons.forEach((button, index) => {
            if (index === currentPage) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    };

    this.createPageButtons = function () {
        const paginationContainer = document.querySelector('.page-buttons');
        paginationContainer.innerHTML = ''; // Clear existing buttons
    
        for (let i = 0; i < this.pageCount; i++) {
            const button = document.createElement('button');
            button.classList.add('page-button');
            if (i === this.currentPage) {
                button.classList.add('active'); // Add 'active' class to the current page
            }
            button.textContent = i + 1; // Page numbers start from 1
            button.addEventListener('click', () => {
                this.currentPage = i; // Update the current page
                this.rerenderProducts({ currentPage: i }); // Rerender products for the selected page
            });
            paginationContainer.appendChild(button);
        }
    };

    this.showNotification = function (message) {
        const notification = document.createElement('div');
        notification.classList.add('notification-modal');
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        // Hide pagination buttons
        const btnPrev = document.querySelector('.btn-prev');
        const btnNext = document.querySelector('.btn-next');
        const pageButtonsContainer = document.querySelector('.page-buttons'); // Select the page buttons container

        if (btnPrev) btnPrev.style.visibility = 'hidden'; // Hide previous button
        if (btnNext) btnNext.style.visibility = 'hidden'; // Hide next button
        if (pageButtonsContainer) pageButtonsContainer.style.visibility = 'hidden'; // Hide page buttons container

        // Close the notification when the close button is clicked
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();

            // Show pagination buttons again
            if (btnPrev) btnPrev.style.visibility = 'visible';
            if (btnNext) btnNext.style.visibility = 'visible';
            if (pageButtonsContainer) pageButtonsContainer.style.visibility = 'visible'; // Show page buttons container

            // Reset search input
            const searchInput = document.querySelector('.search-form input[type="search"]');
            if (searchInput) searchInput.value = '';

            // Reset products to the initial state
            this.resetProducts();
        });
    };
    
    
}



