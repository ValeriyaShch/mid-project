import { updateHeaderCartCounter } from './cartManager.js';

document.addEventListener('DOMContentLoaded', () => {
  updateHeaderCartCounter();
  const form = document.querySelector('.contact-form-form');
  const thankYouMsg = document.querySelector('.contact-us-message');

  if (form && thankYouMsg) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (form.checkValidity()) {
        thankYouMsg.style.display = 'inline';
        setTimeout(() => {
          thankYouMsg.style.display = 'none';
        }, 5000);
        form.reset();
      } else {
        form.reportValidity();
      }
    });
  }
});
