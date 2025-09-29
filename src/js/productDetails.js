document.addEventListener('DOMContentLoaded', () => {
  const productData = JSON.parse(localStorage.getItem('selectedProduct'));

  if (!productData) {
      console.error('No product data found in localStorage');
      return;
  }

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

  // Show sales status
//   const salesBadge = document.createElement('p');
//   salesBadge.textContent = productData.salesStatus ? 'On Sale!' : 'Regular Price';
//   salesBadge.classList.add(productData.salesStatus ? 'on-sale' : 'regular-price');
//   document.querySelector('.product-details-info').appendChild(salesBadge);

  // Add event listener for "Add to Cart" button
  document.querySelector('.add-to-cart').addEventListener('click', () => {
      console.log(`Product added to cart: ${productData.id}`);
  });

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
});
