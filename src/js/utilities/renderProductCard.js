export async function renderProductCard(
  product,
  template = null,
  onProductCardClick = null,
) {
  if (!template) {
    if (!renderProductCard._cardTemplate) {
      const templateResponse = await fetch(
        '/dist/components/product-card.html',
      );
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
  productCard.dataset.id = id;

  templateClone.querySelector('.product-image').src = imageUrl;
  if (salesStatus !== true) {
    templateClone.querySelector('.badge').classList.add('hidden');
  }
  templateClone.querySelector('.product-name').textContent = name;
  templateClone.querySelector('.product-price').textContent = `$${price}`;

  const addToCartBtn = templateClone.querySelector('.product-button');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      if (onProductCardClick) {
        onProductCardClick(event, product);
      }
    });
  }

  productCard.addEventListener('click', (event) => {
    if (onProductCardClick) {
      onProductCardClick(event, product);
    }
  });

  return templateClone;
}
