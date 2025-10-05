import { updateHeaderCartCounter } from './cartManager.js';

document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.querySelector('.cart-items');
  const clearCartBtn = document.querySelector('.clear-shopping-btn');
  const checkoutBtn = document.querySelector('.checkout-btn');

  function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || { cartItems: [] };
    cartItemsContainer.innerHTML = '';

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

    // Show/hide empty cart message
    const emptyCartMsg = document.querySelector('.empty-cart-message');
    if (cart.cartItems.length === 0) {
      emptyCartMsg.style.display = 'block';
      checkoutBtn.disabled = true;
    } else {
      emptyCartMsg.style.display = 'none';
      checkoutBtn.disabled = false;
    }

    updateCartSummary(cart);
  }

  function updateCartSummary(cart) {
    const subtotal = cart.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const itemCount = cart.cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
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
        updateHeaderCartCounter();
        return;
      }
      item.totalPrice = item.quantity * item.price;
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
      updateHeaderCartCounter();
    }
  }

  function removeFromCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || { cartItems: [] };
    cart.cartItems = cart.cartItems.filter((item) => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateHeaderCartCounter();
  }

  function getCartItem(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || { cartItems: [] };
    return cart.cartItems.find((item) => item.id === productId);
  }

  clearCartBtn.addEventListener('click', () => {
    localStorage.removeItem('cart');
    renderCart();
    updateHeaderCartCounter();
  });

  function showCheckoutPopup() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.4)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 1000;

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'main-color';
    popup.style.background = 'var(--main-color, #B92770)';
    popup.style.color = '#fff';
    popup.style.width = '250px';
    popup.style.height = '100px';
    popup.style.borderRadius = '16px';
    popup.style.position = 'relative';
    popup.style.display = 'flex';
    popup.style.flexDirection = 'column';
    popup.style.justifyContent = 'center';
    popup.style.alignItems = 'center';
    popup.style.boxShadow = '0 4px 32px rgba(0,0,0,0.15)';
    popup.style.textAlign = 'center';

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '10px';
    closeBtn.style.right = '16px';
    closeBtn.style.background = 'transparent';
    closeBtn.style.border = 'none';
    closeBtn.style.color = '#fff';
    closeBtn.style.fontSize = '2rem';
    closeBtn.style.cursor = 'pointer';

    closeBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    // Message
    const msg = document.createElement('div');
    msg.textContent = 'Thank you for your purchase.';
    msg.style.fontSize = '1.1rem';
    msg.style.fontWeight = 'bold';
    msg.style.marginTop = '10px';

    popup.appendChild(closeBtn);
    popup.appendChild(msg);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  }

  checkoutBtn.addEventListener('click', () => {
    localStorage.removeItem('cart');
    renderCart();
    showCheckoutPopup();
    updateHeaderCartCounter();
  });

  renderCart();
});
