export function SetOfProducts(data) {
    const {productsContainer, productBlock, addToCartBtn, productCountHolder} = data;

    // this.productBlock=productBlock;
    this.filterSize='';
    this.filterColor=''; 
    this.filterCategory=''; 
    this.filterSales=false;
    this.sortOrder='';
    this.searchTerm='';
    this.productCounter=0;
    this.pageCount=0;
    this.currentPage=0;

    // Todo: implement localstorage
    //const LocalStorageKey = 'tasks';

    this.init = async function () {        
        const fragment = await this.loadProducts({productBlock});
        productsContainer.replaceChildren(fragment);


        // addToCartBtn.addEventListener('submit', (event) => {
        //     event.preventDefault();
        //     this.addTask({
        //         id: Math.floor(Math.random() * 100),
        //         // text: form.elements['value'].value,
        //         isDone: false
        //     })
        // })

    }


    this.addTask = function (task) {
        const tasks = JSON.parse(localStorage.getItem(LocalStorageKey));
        this.template(task);
        // form.reset();
        localStorage.setItem(LocalStorageKey, JSON.stringify(
            tasks
                ? [...tasks, task]
                : [task]
        ))
    }

    this.resetProducts = async function () {
        this.filterSize='';
        this.filterColor=''; 
        this.filterCategory=''; 
        this.filterSales=false;
        this.currentPage=0;
        const fragment = await this.loadProducts({productBlock});
        productsContainer.replaceChildren(fragment);
    }

    this.rerenderProducts = async function ({productBlock = 'all', filterSize = '', filterColor = '', filterCategory = '', filterSales = false, sortOrder = '', searchTerm = '', currentPage = 0} = {}) {
        const renderFragment = await this.loadProducts({productBlock, filterSize, filterColor, filterCategory, filterSales, sortOrder, searchTerm, currentPage});
        productsContainer.replaceChildren(renderFragment);

        // Update pagination buttons and active page
        this.updatePaginationChange(this.currentPage);
    };

    this.loadProducts = async function ({productBlock='all', filterSize='', filterColor='', filterCategory='', filterSales=false, sortOrder='', searchTerm='', currentPage=0}={}) {
        //const tasks = JSON.parse(localStorage.getItem(LocalStorageKey));

        // Update filters only if they are provided in the input params
        if (filterSize !== '') this.filterSize = filterSize;
        if (filterColor !== '') this.filterColor = filterColor;
        if (filterCategory !== '') this.filterCategory = filterCategory;
        if (sortOrder !== '') this.sortOrder = sortOrder;
        if (currentPage !== 0) this.currentPage = currentPage;
        this.filterSales = filterSales;

        let filteredProducts = [];
        const fragment = document.createDocumentFragment();

        const getProductsResponse = await fetch('/src/assets/data.json'); 
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

        // Pagination and product count
        this.productCounter = filteredProducts.length;
        if (productCountHolder) {
            this.pageCount = Math.ceil(this.productCounter / 12);
            const start = this.currentPage * 12;
            const end = Math.min(this.productCounter, (this.currentPage + 1) * 12);
            productCountHolder.textContent = `Showing ${start}-${end} Of ${this.productCounter} Results`;
        }
        if (this.productCounter>12) {
            filteredProducts = filteredProducts.slice(this.currentPage * 12, (this.currentPage + 1) * 12);
        }


                
        const template = await this.loadCardTemplate();
        
        if (filteredProducts) {
            filteredProducts.forEach(({imageUrl, name, price, salesStatus}) => {
                const templateClone = template.content.cloneNode(true)
                templateClone.querySelector('.product-image').src = imageUrl;
                if (salesStatus!==true) {
                    templateClone.querySelector('.badge').classList.add('hidden');
                }
                templateClone.querySelector('.product-name').textContent = name;
                templateClone.querySelector('.product-price').textContent = `$${price}`;
                
                fragment.appendChild(templateClone);
            })
        }

        return fragment;
        //productsContainer.replaceChildren(fragment);
    
    }

    this.loadCardTemplate = async function () {
        const templateResponse = await fetch('/src/components/product-card.html');
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
}



