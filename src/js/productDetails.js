import { addToCart } from './cartManager.js';
import { SetOfProducts } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
  const productData = JSON.parse(localStorage.getItem('selectedProduct'));

  if (!productData) {
      console.error('No product data found in localStorage');
      return;
  }

  // Quantity controls logic
  const quantityInput = document.getElementById('quantity');
  const qtyBtns = document.querySelectorAll('.quantity-controls .qty-btn');

  qtyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      let current = parseInt(quantityInput.value, 10) || 1;
      if (btn.textContent.trim() === '+') {
        quantityInput.value = current + 1;
      } else if (btn.textContent.trim() === '−' || btn.textContent.trim() === '-') {
        if (current > 1) quantityInput.value = current - 1;
      }
    });
  });

  // Add to cart with quantity
  document.querySelector('.add-to-cart').addEventListener('click', () => {
    const quantity = parseInt(quantityInput.value, 10) || 1;
    addToCart({ ...productData, quantity });
  });

  // Populate product details
  document.querySelector('#product-photo').src = productData.imageUrl;
  document.querySelector('.product-details-title').textContent = productData.name;
  document.querySelector('.product-details-price').textContent = `$${productData.price}`;

  // Generate rating stars
  const ratingContainer = document.querySelector('.card-details-rating');
  ratingContainer.innerHTML = ''; // Clear existing stars
  const fullStars = Math.floor(productData.rating || 0); // Default to 0 stars if no rating is provided
  for (let i = 0; i < fullStars; i++) {
      const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      star.classList.add('star-icon');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', '#star');
      star.appendChild(use);
      ratingContainer.appendChild(star);
  }

  const tabs = document.querySelectorAll('.tab');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
          tabs.forEach((t) => t.classList.remove('active'));
          tabPanels.forEach((panel) => panel.classList.remove('active'));

          tab.classList.add('active');
          
          const targetPanel = document.querySelector(`#${tab.textContent.toLowerCase().replace(' ', '-')}`);
          if (targetPanel) {
              targetPanel.classList.add('active');
          }
      });
  });

  // --- Render 4 random products in .product-container ---
  const container = document.querySelector('.may-like-products .product-container');
  if (container) {
    const randomProducts = SetOfProducts({
      productsContainer: container,
      productBlock: 'all',
      randomCount: 4
    });
    randomProducts.init();
  }
});
