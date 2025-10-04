document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.contact-form-form');
    const thankYouMsg = document.querySelector('.contact-us-message');

    if (form && thankYouMsg) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Use built-in validation
            if (form.checkValidity()) {
                thankYouMsg.style.display = 'inline';
                setTimeout(() => {
                    thankYouMsg.style.display = 'none';
                }, 5000);
                form.reset();
            } else {
                // Show validation errors
                form.reportValidity();
            }
        });
    }
});