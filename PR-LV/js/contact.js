document.addEventListener('DOMContentLoaded', () => {
    const contactContainer = document.getElementById('contact-container');
    const startButton = document.getElementById('start-consultation');
    const closeButton = document.getElementById('close-form');

    // Manejo de la visibilidad del formulario
    if (startButton) {
        startButton.addEventListener('click', () => {
            contactContainer.classList.add('form-active');
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            contactContainer.classList.remove('form-active');
        });
    }
});