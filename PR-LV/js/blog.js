document.addEventListener('DOMContentLoaded', () => {
    const postsListView = document.getElementById('posts-list-view');
    const singlePostView = document.getElementById('single-post-view');
    const allPostCards = document.querySelectorAll('.post-card');
    
    const categoryList = document.querySelector('.category-list');
    const recentPostsList = document.querySelector('.recent-posts-list');

    /**
     * FUNCIÓN 1: Generar Contenido Dinámico para la Barra Lateral
     * - Crea la lista de categorías y artículos recientes automáticamente.
     */
    const generateSidebarContent = () => {
        const categories = new Set();
        const recentPosts = [];

        allPostCards.forEach(card => {
            // Generar categorías únicas
            const category = card.dataset.category;
            if (category) {
                categories.add(category);
            }
            // Generar lista de artículos recientes
            recentPosts.push({
                title: card.querySelector('.post-title').textContent,
                card: card
            });
        });

        // Limpiar listas antes de llenarlas
        categoryList.innerHTML = '<li><a href="#" class="category-filter active" data-category="all">Mostrar Todas</a></li>';
        recentPostsList.innerHTML = '';
        
        // Poblar lista de categorías
        categories.forEach(category => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" class="category-filter" data-category="${category}">${category}</a>`;
            categoryList.appendChild(li);
        });

        // Poblar lista de artículos recientes
        recentPosts.slice(0, 5).forEach(post => { // Mostrar los 5 más recientes
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = post.title;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showSinglePost(post.card);
            });
            li.appendChild(link);
            recentPostsList.appendChild(li);
        });
    };
    
    /**
     * FUNCIÓN 2: Mostrar la vista de un solo artículo
     * - Oculta la lista de posts y muestra el contenido completo del artículo seleccionado.
     */
    const showSinglePost = (postCard) => {
        const imageSrc = postCard.querySelector('.post-image').src;
        const title = postCard.querySelector('.post-title').innerHTML;
        const meta = postCard.querySelector('.post-meta').innerHTML;
        const fullContent = postCard.querySelector('.post-full-content').innerHTML;

        singlePostView.innerHTML = `
            <div class="single-post-header">
                <h1 class="page-title">${title}</h1>
                <div class="post-meta">${meta}</div>
            </div>
            <img src="${imageSrc}" alt="Imagen del artículo" class="single-post-image">
            <div class="single-post-body">${fullContent}</div>
            <a href="#" class="back-to-blog"><i class="fas fa-arrow-left"></i> Volver al Blog</a>
        `;

        // Transición suave entre vistas
        postsListView.style.opacity = '0';
        setTimeout(() => {
            postsListView.style.display = 'none';
            singlePostView.style.display = 'block';
            singlePostView.style.opacity = '1';
            window.scrollTo(0, 0); // Ir al inicio de la página

            // Añadir evento al botón de "volver"
            document.querySelector('.back-to-blog').addEventListener('click', (e) => {
                e.preventDefault();
                showListView();
            });
        }, 300);
    };

    /**
     * FUNCIÓN 3: Mostrar la vista de lista de artículos
     * - Oculta el artículo individual y muestra la lista principal.
     */
    const showListView = () => {
        singlePostView.style.opacity = '0';
        setTimeout(() => {
            singlePostView.style.display = 'none';
            postsListView.style.display = 'grid'; // O el display original que uses
            postsListView.style.opacity = '1';
            singlePostView.innerHTML = ''; // Limpiar contenido
        }, 300);
    };

    /**
     * FUNCIÓN 4: Filtrar artículos por categoría
     */
    const filterPosts = (category) => {
        allPostCards.forEach(card => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            const postCategory = card.dataset.category;
            
            const shouldShow = (category === 'all' || postCategory === category);
            
            card.style.opacity = shouldShow ? '1' : '0';
            card.style.transform = shouldShow ? 'translateY(0)' : 'translateY(20px)';
            
            setTimeout(() => {
                card.style.display = shouldShow ? 'block' : 'none';
            }, 400);
        });
    };

    /**
     * FUNCIÓN 5: Animación de entrada al hacer scroll
     * - Usa IntersectionObserver para que los posts aparezcan al entrar en la pantalla.
     */
    const createScrollObserver = () => {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        allPostCards.forEach(card => {
            observer.observe(card);
        });
    };

    // --- INICIALIZACIÓN Y ASIGNACIÓN DE EVENTOS ---

    // 1. Generar la barra lateral
    generateSidebarContent();

    // 2. Asignar eventos a los enlaces "Leer más"
    document.querySelectorAll('.post-read-more').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const postCard = link.closest('.post-card');
            showSinglePost(postCard);
        });
    });

    // 3. Asignar eventos a los filtros de categoría
    document.querySelectorAll('.category-filter').forEach(filterLink => {
        filterLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.category-filter.active').classList.remove('active');
            filterLink.classList.add('active');
            const category = filterLink.dataset.category;
            filterPosts(category);
        });
    });

    // 4. Activar la animación de scroll
    createScrollObserver();
});