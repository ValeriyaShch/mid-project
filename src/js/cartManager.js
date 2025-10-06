export function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem('cart')) || { cartItems: [] };
  const existingItem = cart.cartItems.find((item) => item.id === product.id);
  const addQty = product.quantity ? parseInt(product.quantity, 10) : 1;

  if (existingItem) {
    existingItem.quantity += addQty;
    existingItem.totalPrice = existingItem.quantity * existingItem.price;
  } else {
    cart.cartItems.push({
      ...product,
      quantity: addQty,
      totalPrice: addQty * product.price,
    });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateHeaderCartCounter();
}

export function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || { cartItems: [] };
}

export function clearCart() {
  localStorage.removeItem('cart');
  updateHeaderCartCounter();
}

export function updateHeaderCartCounter() {
  const cart = getCart();
  const count = cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.header-cart-counter').forEach((el) => {
    el.textContent = count;
    if (count > 0) {
      el.style.display = '';
    } else {
      el.style.display = 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateHeaderCartCounter();
});
