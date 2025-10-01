document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items');


    function renderCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || { cartItems: [] };
        cartItemsContainer.innerHTML = '';

        // Populate the cart with items
        cart.cartItems.forEach((item) => {
            const cartRow = document.createElement('div');
            cartRow.classList.add('cart-item', 'row');

            cartRow.innerHTML = `
                <div class="cart-cell product-info">
                    <img src="${item.imageUrl}" alt="${item.name}" class="product-image" width="120" height="120">
                </div>
                <div class="cart-cell product-name">${item.name}</div>
                <div class="cart-cell product-price">$${item.price}</div>
                <div class="cart-cell quantity-controls">
                    <button class="qty-btn decrease" data-id="${item.id}">−</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                    <button class="qty-btn increase" data-id="${item.id}">+</button>
                </div>
                <div class="cart-cell product-total">$${item.totalPrice}</div>
                <div class="cart-cell">
                    <button class="delete-btn" data-id="${item.id}" aria-label="Remove ${item.name}">
                            <svg class="search-icon" width="18" height="20">
                                <use href="#bin"></use>
                            </svg>
                    </button>
                </div>
            `;

            cartItemsContainer.appendChild(cartRow);
        });
        updateCartSummary(cart);
    }

    

    // --- Cart Summary Calculation ---
    function updateCartSummary() {
        const cart = JSON.parse(localStorage.getItem('cart')) || { cartItems: [] };

        const subtotal = cart.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const itemCount = cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const shipping = itemCount * 10;
        const discount = subtotal > 3000 ? subtotal * 0.1 : 0;
        const total = subtotal + shipping - discount;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
        document.getElementById('discount').textContent = `$${discount.toFixed(2)}`;

        const discountRow = document.getElementById('summary-discount');
        if (discount > 0) {
            discountRow.style.display = '';
        } else {
            discountRow.style.display = 'none';
        }
    }

    // Add event listeners for quantity controls and delete buttons
    cartItemsContainer.addEventListener('click', (event) => {
        const target = event.target;
        const deleteBtn = target.closest('.delete-btn');
        const productId = (deleteBtn && deleteBtn.dataset.id) || target.dataset.id;

        if (target.classList.contains('decrease')) {
            updateQuantity(productId, -1);
        } else if (target.classList.contains('increase')) {
            updateQuantity(productId, 1);
        } else if (deleteBtn) {
            removeFromCart(productId);
        }
    });

    cartItemsContainer.addEventListener('input', (event) => {
        const target = event.target;
        if (target.classList.contains('quantity-input')) {
            const productId = target.dataset.id;
            const newQuantity = parseInt(target.value, 10);
            updateQuantity(productId, newQuantity - getCartItem(productId).quantity);
        }
    });

    function updateQuantity(productId, change) {
        const cart = JSON.parse(localStorage.getItem('cart')) || { cartItems: [] };
        const item = cart.cartItems.find((item) => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(productId);
                return;
            }
            item.totalPrice = item.quantity * item.price;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
    }

    function removeFromCart(productId) {
        const cart = JSON.parse(localStorage.getItem('cart')) || { cartItems: [] };
        cart.cartItems = cart.cartItems.filter((item) => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    function getCartItem(productId) {
        const cart = JSON.parse(localStorage.getItem('cart')) || { cartItems: [] };
        return cart.cartItems.find((item) => item.id === productId);
    }

    const clearCartBtn = document.querySelector('.clear-shopping-btn');
    clearCartBtn.addEventListener('click', () => {
        localStorage.removeItem('cart');
        renderCart();
    });

    renderCart();
});