document.addEventListener('DOMContentLoaded', () => {

    const loadHTML = async (url, elementId) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            const html = await response.text();
            const placeholder = document.getElementById(elementId);
            if (placeholder) placeholder.innerHTML = html;
        } catch (error) {
            console.error(`Error al cargar el componente desde ${url}:`, error);
        }
    };

    const setActiveNavLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('#navbar-placeholder .nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    };

    const updateFooterYear = () => {
        const yearSpan = document.getElementById('year');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    };

    const initParticles = () => {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return; 

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let particlesArray;

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.color = color;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = 'rgba(170, 102, 255, 0.5)';
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
        }

        window.addEventListener('resize', () => {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            init();
        });

        init();
        animate();
    };

    loadHTML('partials/navbar.html', 'navbar-placeholder').then(setActiveNavLink);
    loadHTML('partials/footer.html', 'footer-placeholder').then(updateFooterYear);
    initParticles();
});