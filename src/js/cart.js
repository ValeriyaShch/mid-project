document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || { cartItems: [] };
    const cartItemsContainer = document.querySelector('.cart-items');

    // Clear existing items
    cartItemsContainer.innerHTML = '';

    // Populate the cart with items
    cart.cartItems.forEach((item) => {
        const cartRow = document.createElement('div');
        cartRow.classList.add('cart-item', 'row');

        cartRow.innerHTML = `
            <div class="cart-cell product-info">
                <img src="${item.imageUrl}" alt="${item.name}" class="product-image">
                <span class="product-name">${item.name}</span>
            </div>
            <div class="cart-cell product-price">$${item.price}</div>
            <div class="cart-cell quantity-controls">
                <button class="qty-btn decrease" data-id="${item.id}">−</button>
                <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                <button class="qty-btn increase" data-id="${item.id}">+</button>
            </div>
            <div class="cart-cell product-total">$${item.totalPrice}</div>
            <div class="cart-cell">
                <button class="delete-btn" data-id="${item.id}" aria-label="Remove ${item.name}">🗑</button>
            </div>
        `;

        cartItemsContainer.appendChild(cartRow);
    });

    // Add event listeners for quantity controls and delete buttons
    cartItemsContainer.addEventListener('click', (event) => {
        const target = event.target;
        const productId = target.dataset.id;

        if (target.classList.contains('decrease')) {
            updateQuantity(productId, -1);
        } else if (target.classList.contains('increase')) {
            updateQuantity(productId, 1);
        } else if (target.classList.contains('delete-btn')) {
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
            location.reload(); // Refresh the page to update the cart
        }
    }

    function removeFromCart(productId) {
        const cart = JSON.parse(localStorage.getItem('cart')) || { cartItems: [] };
        cart.cartItems = cart.cartItems.filter((item) => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        location.reload(); // Refresh the page to update the cart
    }

    function getCartItem(productId) {
        const cart = JSON.parse(localStorage.getItem('cart')) || { cartItems: [] };
        return cart.cartItems.find((item) => item.id === productId);
    }
});