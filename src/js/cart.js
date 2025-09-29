document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || { cartItems: [] };
    const cartTableBody = document.querySelector('.cart-table tbody');

    // Clear existing rows
    cartTableBody.innerHTML = '';

    // Populate the table with cart items
    cart.cartItems.forEach((item) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td class="product-info">
                <img src="${item.imageUrl}" alt="${item.name}">
                <span class="product-name">${item.name}</span>
            </td>
            <td>$${item.price}</td>
            <td>
                <div class="quantity-controls">
                    <button class="qty-btn decrease" data-id="${item.id}">−</button>
                    <input type="number" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="qty-btn increase" data-id="${item.id}">+</button>
                </div>
            </td>
            <td>$${item.totalPrice}</td>
            <td>
                <button class="delete-btn" data-id="${item.id}" aria-label="Remove ${item.name}">🗑</button>
            </td>
        `;

        cartTableBody.appendChild(row);
    });

    // Add event listeners for quantity controls and delete buttons
    cartTableBody.addEventListener('click', (event) => {
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

    cartTableBody.addEventListener('input', (event) => {
        const target = event.target;
        if (target.type === 'number') {
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