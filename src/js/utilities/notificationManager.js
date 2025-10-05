export function showNotification(message, onClose) {
    const notification = document.createElement('div');
    notification.classList.add('notification-modal');
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;
    document.body.appendChild(notification);

    // Hide pagination controls if present
    const btnPrev = document.querySelector('.btn-prev');
    const btnNext = document.querySelector('.btn-next');
    const pageButtonsContainer = document.querySelector('.page-buttons');
    if (btnPrev) btnPrev.style.visibility = 'hidden';
    if (btnNext) btnNext.style.visibility = 'hidden';
    if (pageButtonsContainer) pageButtonsContainer.style.visibility = 'hidden';

    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
        if (btnPrev) btnPrev.style.visibility = 'visible';
        if (btnNext) btnNext.style.visibility = 'visible';
        if (pageButtonsContainer) pageButtonsContainer.style.visibility = 'visible';
        if (typeof onClose === 'function') onClose();
    });
}