export async function renderProductCard(product, template = null) {
    // If no template provided, fetch and cache it
    if (!template) {
        if (!renderProductCard._cardTemplate) {
            const templateResponse = await fetch('/dist/components/product-card.html');
            const templateText = await templateResponse.text();
            const cardWrapper = document.createElement('div');
            cardWrapper.innerHTML = templateText;
            renderProductCard._cardTemplate = cardWrapper.querySelector('template');
        }
        template = renderProductCard._cardTemplate;
    }

    const { id, imageUrl, name, price, salesStatus, rating } = product;
    const templateClone = template.content.cloneNode(true);
    const productCard = templateClone.querySelector('.product-card');
    productCard.setAttribute('data-id', id);

    templateClone.querySelector('.product-image').src = imageUrl;
    if (salesStatus !== true) {
        templateClone.querySelector('.badge').classList.add('hidden');
    }
    templateClone.querySelector('.product-name').textContent = name;
    templateClone.querySelector('.product-price').textContent = `$${price}`;

    // Attach click handler for navigation
    productCard.addEventListener('click', () => {
        const productData = { id, name, price, imageUrl, salesStatus, rating };
        localStorage.setItem('selectedProduct', JSON.stringify(productData));
        window.location.href = '/dist/pages/product-details-template.html';
    });

    return templateClone;
}