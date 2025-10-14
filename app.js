// Estado de la aplicación
let cart = JSON.parse(localStorage.getItem('terracart_cart')) || [];
let favorites = JSON.parse(localStorage.getItem('terracart_favorites')) || [];
let currentFilter = 'all';
let currentSort = 'name';
let currentSearch = '';
let currentPage = 1;
let totalImpact = JSON.parse(localStorage.getItem('terracart_total_impact')) || {
    waterSaved: 0,
    plasticFreeCount: 0,
    localProducersCount: 0,
    co2Saved: 0,
    totalSpent: 0
};

// Nuevas variables globales
let user = JSON.parse(localStorage.getItem('terracart_user')) || null;
let purchaseHistory = JSON.parse(localStorage.getItem('terracart_purchase_history')) || [];
let offerTimer = null;

// Elementos del DOM
const productsGrid = document.getElementById('productsGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartIcon = document.getElementById('cartIcon');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const waterSaved = document.getElementById('waterSaved');
const plasticFreeCount = document.getElementById('plasticFreeCount');
const localProducersCount = document.getElementById('localProducersCount');
const co2Saved = document.getElementById('co2Saved');
const cartSubtotal = document.getElementById('cartSubtotal');
const shippingCost = document.getElementById('shippingCost');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const treesEquivalent = document.getElementById('treesEquivalent');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const pagination = document.getElementById('pagination');
const toastContainer = document.getElementById('toastContainer');
const loadingOverlay = document.getElementById('loadingOverlay');
const totalWaterSaved = document.getElementById('totalWaterSaved');
const totalPlasticSaved = document.getElementById('totalPlasticSaved');
const totalLocalSupported = document.getElementById('totalLocalSupported');
const darkModeToggle = document.getElementById('darkModeToggle');

// Inicializar la aplicación
function init() {
    renderProducts();
    updateCartUI();
    updateFavoritesUI();
    updateTotalImpactUI();
    setupEventListeners();
    updateUserUI();
    setupOfferPopup();
    showToast('Bienvenido a TerraCart! 🌱', 'success');
}

// Configurar event listeners
function setupEventListeners() {
    cartIcon.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    checkoutBtn.addEventListener('click', checkout);

    // Event listeners para favoritos
    const favoritesIcon = document.querySelector('.favorites-icon');
    const favoritesSidebar = document.querySelector('.favorites-sidebar');
    
    if (favoritesIcon) {
        favoritesIcon.addEventListener('click', toggleFavorites);
    }
    
    const closeFav = document.getElementById('closeFav');
    if (closeFav) {
        closeFav.addEventListener('click', toggleFavorites);
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            setFilter(filter);
        });
    });

    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase();
        currentPage = 1;
        renderProducts();
    });

    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        currentPage = 1;
        renderProducts();
    });

    document.addEventListener('click', (e) => {
        if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target) && cartSidebar.classList.contains('active')) {
            toggleCart();
        }
        
        const favoritesSidebar = document.querySelector('.favorites-sidebar');
        const favoritesIcon = document.querySelector('.favorites-icon');
        if (favoritesSidebar && favoritesIcon && 
            !favoritesSidebar.contains(e.target) && 
            !favoritesIcon.contains(e.target) && 
            favoritesSidebar.classList.contains('active')) {
            toggleFavorites();
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    cartSidebar.addEventListener('transitionend', () => {
        if (!cartSidebar.classList.contains('active')) {
            updateTotalImpactUI();
        }
    });

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('terracart_darkMode', document.body.classList.contains('dark-mode'));
    });

    // Nuevos event listeners - CON VERIFICACIÓN DE ELEMENTOS
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const purchaseHistoryBtn = document.getElementById('purchaseHistoryBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const mobileRegisterBtn = document.getElementById('mobileRegisterBtn');
    const mobileHistoryBtn = document.getElementById('mobileHistoryBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    const closePreviewModal = document.getElementById('closePreviewModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeRegisterModal = document.getElementById('closeRegisterModal');
    const closeHistoryModal = document.getElementById('closeHistoryModal');
    
    const closeOfferPopup = document.getElementById('closeOfferPopup');
    const closeOffer = document.getElementById('closeOffer');
    const addOfferToCart = document.getElementById('addOfferToCart');
    
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    
    // Asignar event listeners solo si los elementos existen
    if (loginBtn) loginBtn.addEventListener('click', showLoginModal);
    if (registerBtn) registerBtn.addEventListener('click', showRegisterModal);
    if (purchaseHistoryBtn) purchaseHistoryBtn.addEventListener('click', showPurchaseHistory);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    
    if (mobileLoginBtn) mobileLoginBtn.addEventListener('click', showLoginModal);
    if (mobileRegisterBtn) mobileRegisterBtn.addEventListener('click', showRegisterModal);
    if (mobileHistoryBtn) mobileHistoryBtn.addEventListener('click', showPurchaseHistory);
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', logout);
    
    if (showRegister) showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        hideLoginModal();
        showRegisterModal();
    });
    
    if (showLogin) showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        hideRegisterModal();
        showLoginModal();
    });
    
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    
    if (closePreviewModal) closePreviewModal.addEventListener('click', hideProductPreview);
    if (closeLoginModal) closeLoginModal.addEventListener('click', hideLoginModal);
    if (closeRegisterModal) closeRegisterModal.addEventListener('click', hideRegisterModal);
    if (closeHistoryModal) closeHistoryModal.addEventListener('click', hidePurchaseHistory);
    
    if (closeOfferPopup) closeOfferPopup.addEventListener('click', hideOfferPopup);
    if (closeOffer) closeOffer.addEventListener('click', hideOfferPopup);
    if (addOfferToCart) addOfferToCart.addEventListener('click', addOfferToCart);
    
    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', showMobileMenu);
    if (closeMobileMenu) closeMobileMenu.addEventListener('click', hideMobileMenu);
    
    // Cerrar modales al hacer clic fuera
    document.addEventListener('click', (e) => {
        const productPreviewModal = document.getElementById('productPreviewModal');
        const loginModal = document.getElementById('loginModal');
        const registerModal = document.getElementById('registerModal');
        const historyModal = document.getElementById('historyModal');
        const offerPopup = document.getElementById('offerPopup');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (productPreviewModal && e.target === productPreviewModal) {
            hideProductPreview();
        }
        if (loginModal && e.target === loginModal) {
            hideLoginModal();
        }
        if (registerModal && e.target === registerModal) {
            hideRegisterModal();
        }
        if (historyModal && e.target === historyModal) {
            hidePurchaseHistory();
        }
        if (offerPopup && e.target === offerPopup) {
            hideOfferPopup();
        }
        if (mobileMenu && e.target === mobileMenu) {
            hideMobileMenu();
        }
    });
}

// Funcionalidad de favoritos
function toggleFavorites() {
    const favoritesSidebar = document.querySelector('.favorites-sidebar');
    if (favoritesSidebar) {
        favoritesSidebar.classList.toggle('active');
        document.body.style.overflow = favoritesSidebar.classList.contains('active') ? 'hidden' : '';
    }
}

function addToFavorites(productId) {
    if (!favorites.includes(productId)) {
        favorites.push(productId);
        saveFavorites();
        updateFavoritesUI();
        showToast('Producto añadido a favoritos! ❤️', 'success');
    } else {
        removeFromFavorites(productId);
    }
}

function removeFromFavorites(productId) {
    favorites = favorites.filter(id => id !== productId);
    saveFavorites();
    updateFavoritesUI();
    
    // ACTUALIZAR EL CORAZÓN EN LA GRILLA DE PRODUCTOS
    const favoriteBtn = document.querySelector(`.favorite-btn[data-id="${productId}"]`);
    if (favoriteBtn) {
        favoriteBtn.classList.remove('active');
    }
    
    showToast('Producto eliminado de favoritos', 'error');
}

function saveFavorites() {
    localStorage.setItem('terracart_favorites', JSON.stringify(favorites));
}

function updateFavoritesUI() {
    const favContent = document.getElementById('favContent');
    const favCount = document.getElementById('favCount');
    
    if (!favContent || !favCount) return;
    
    favCount.textContent = favorites.length;
    
    if (favorites.length === 0) {
        favContent.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-heart"></i>
                <h3>No tienes favoritos</h3>
                <p>Agrega productos a favoritos haciendo clic en el corazón</p>
            </div>
        `;
    } else {
        favContent.innerHTML = '';
        favorites.forEach(productId => {
            const product = products.find(p => p.id === productId);
            if (product) {
                const favItem = document.createElement('div');
                favItem.className = 'fav-item';
                favItem.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="fav-item-image">
                    <div class="fav-item-details">
                        <div class="fav-item-name">${product.name}</div>
                        <div class="fav-item-price">$${product.price.toFixed(2)}</div>
                        <div class="cart-item-badges">
                            ${product.impact.isOrganic ? '<span class="badge badge-organic">Orgánico</span>' : ''}
                            ${product.impact.isLocal ? '<span class="badge badge-local">Local</span>' : ''}
                            ${product.impact.isPlasticFree ? '<span class="badge badge-plasticfree">Sin Plástico</span>' : ''}
                        </div>
                        <div class="fav-actions">
                            <button class="add-to-cart" data-id="${product.id}">
                                <i class="fas fa-cart-plus"></i>
                                Añadir
                            </button>
                            <button class="remove-fav" data-id="${product.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                favContent.appendChild(favItem);
            }
        });

        // Event listeners para los botones de favoritos
        document.querySelectorAll('.fav-actions .add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('button').dataset.id);
                addToCart(productId);
                showToast('Producto añadido al carrito!', 'success');
            });
        });

        document.querySelectorAll('.remove-fav').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('button').dataset.id);
                removeFromFavorites(productId);
            });
        });
    }
}

// Renderizar productos en el catálogo
function renderProducts() {
    showLoading(true);

    setTimeout(() => {
        let filteredProducts = filterProducts();
        filteredProducts = sortProducts(filteredProducts);

        const totalPages = Math.ceil(filteredProducts.length / APP_CONFIG.itemsPerPage);
        const startIndex = (currentPage - 1) * APP_CONFIG.itemsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + APP_CONFIG.itemsPerPage);

        if (productsGrid) {
            productsGrid.innerHTML = '';

            if (paginatedProducts.length === 0) {
                productsGrid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                        <i class="fas fa-search" style="font-size: 50px; color: var(--gray-light); margin-bottom: 15px;"></i>
                        <h3>No se encontraron productos</h3>
                        <p>Intenta con otros filtros o términos de búsqueda</p>
                    </div>
                `;
            } else {
                paginatedProducts.forEach(product => {
                    const productCard = createProductCard(product);
                    productsGrid.appendChild(productCard);
                });
            }

            renderPagination(totalPages);
        }
        showLoading(false);
    }, 500);
}

function filterProducts() {
    return products.filter(product => {
        if (currentFilter !== 'all') {
            if (currentFilter === 'plasticFree' && !product.impact.isPlasticFree) return false;
            if (currentFilter === 'local' && !product.impact.isLocal) return false;
            if (currentFilter === 'organic' && !product.impact.isOrganic) return false;
        }
        if (currentSearch && !product.name.toLowerCase().includes(currentSearch) && 
            !product.description.toLowerCase().includes(currentSearch)) {
            return false;
        }
        return true;
    });
}

function sortProducts(products) {
    return [...products].sort((a, b) => {
        switch (currentSort) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'impact':
                return (b.impact.waterSaved + b.impact.co2Saved * 10) - (a.impact.waterSaved + a.impact.co2Saved * 10);
            default:
                return 0;
        }
    });
}

// Crear tarjeta de producto con badges ecológicos claros y botón de favoritos
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    const isFavorite = favorites.includes(product.id);
    
    let badges = '';
    if (product.impact.isOrganic) badges += '<span class="badge badge-organic">Orgánico</span>';
    if (product.impact.isLocal) badges += '<span class="badge badge-local">Local</span>';
    if (product.impact.isPlasticFree) badges += '<span class="badge badge-plasticfree">Sin Plástico</span>';
    
    productCard.innerHTML = `
        <div class="product-badges">${badges}</div>
        <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${product.id}">
            <i class="fas fa-heart"></i>
        </button>
        <div class="product-image-container" onclick="showProductPreview(${product.id})" style="cursor: pointer;">
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="handleImageError(this)">
        </div>
        <div class="product-info">
            <div class="product-name" onclick="showProductPreview(${product.id})" style="cursor: pointer;">${product.name}</div>
            <div class="product-description">${product.description}</div>
            <div class="product-impact">
                <div class="impact-tag">
                    <i class="fas fa-tint"></i>
                    <span>${product.impact.waterSaved}L agua</span>
                </div>
                <div class="impact-tag">
                    <i class="fas fa-leaf"></i>
                    <span>${product.impact.co2Saved}kg CO₂</span>
                </div>
            </div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="add-to-cart" data-id="${product.id}">
                <i class="fas fa-cart-plus"></i>
                Añadir al Carrito
            </button>
        </div>
    `;

    // Event listener para favoritos
    const favoriteBtn = productCard.querySelector('.favorite-btn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(e.target.closest('button').dataset.id);
            addToFavorites(productId);
            e.target.closest('.favorite-btn').classList.toggle('active');
        });
    }

    // Event listener para carrito
    const addToCartBtn = productCard.querySelector('.add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', (e) => {
            addToCart(product.id);
            e.target.classList.add('added');
            e.target.innerHTML = '<i class="fas fa-check"></i> Añadido';
            setTimeout(() => {
                e.target.classList.remove('added');
                e.target.innerHTML = '<i class="fas fa-cart-plus"></i> Añadir al Carrito';
            }, 2000);
        });
    }

    return productCard;
}

// Función de respaldo para imágenes
function handleImageError(img) {
    img.onerror = null;
    // Crear un placeholder con el nombre del producto
    const productName = img.alt || 'Producto';
    const words = productName.split(' ');
    const initials = words.map(word => word[0]).join('').toUpperCase();
    
    // Crear un SVG como placeholder
    const svg = `
        <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f8f9fa"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
                  font-family="Arial, sans-serif" font-size="24" fill="#6c757d">
                ${initials}
            </text>
            <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" 
                  font-family="Arial, sans-serif" font-size="12" fill="#6c757d">
                Imagen no disponible
            </text>
        </svg>
    `;
    
    // Convertir SVG a data URL
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    img.src = URL.createObjectURL(blob);
}

function renderPagination(totalPages) {
    if (!pagination) return;
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    let paginationHTML = '';
    if (currentPage > 1) {
        paginationHTML += `<button class="pagination-btn" data-page="${currentPage - 1}">
            <i class="fas fa-chevron-left"></i>
        </button>`;
    }
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
    }
    if (currentPage < totalPages) {
        paginationHTML += `<button class="pagination-btn" data-page="${currentPage + 1}">
            <i class="fas fa-chevron-right"></i>
        </button>`;
    }
    pagination.innerHTML = paginationHTML;
    pagination.querySelectorAll('.pagination-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            currentPage = parseInt(e.target.dataset.page);
            renderProducts();
            const productsSection = document.getElementById('products');
            if (productsSection) {
                productsSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

function setFilter(filter) {
    currentFilter = filter;
    currentPage = 1;
    filterButtons.forEach(button => {
        if (button.dataset.filter === filter) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    renderProducts();
}

function toggleCart() {
    cartSidebar.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
}

// Añadir producto al carrito
function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }
    saveCart();
    updateCartUI();
    showToast('Producto añadido al carrito!', 'success');
    if (window.innerWidth < 768) {
        cartSidebar.classList.add('active');
    }
}

// Eliminar producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showToast('Producto eliminado del carrito', 'error');
}

// Actualizar cantidad de un producto en el carrito
function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    // Marcar que hay una actualización en curso
    cartSidebar.classList.add('updating');
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartUI();
    }
    
    // Quitar la marca de actualización después de un breve tiempo
    setTimeout(() => {
        cartSidebar.classList.remove('updating');
    }, 100);
}

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('terracart_cart', JSON.stringify(cart));
}

// Actualizar la interfaz del carrito (modificado para mantener el carrito abierto)
function updateCartUI() {
    // Guardar el estado actual del carrito (si está abierto o cerrado)
    const wasCartOpen = cartSidebar.classList.contains('active');
    
    // Actualizar contador del carrito
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    
    // Guardar posición actual del scroll
    const currentScroll = cartSidebar.scrollTop;
    
    if (cartItems) {
        cartItems.innerHTML = '';
        if (cart.length === 0) {
            cartItems.innerHTML = `<div class="empty-cart"><i class="fas fa-shopping-cart"></i><h3>Tu carrito está vacío</h3></div>`;
        } else {
            cart.forEach(item => {
                const product = products.find(p => p.id === item.id);
                if (product) {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <div class="cart-item-name">${product.name}</div>
                            <div class="cart-item-price">$${product.price.toFixed(2)}</div>
                            <div class="cart-item-impact">
                                <span><i class="fas fa-tint"></i> ${product.impact.waterSaved * item.quantity}L</span>
                                <span><i class="fas fa-leaf"></i> ${product.impact.co2Saved * item.quantity}kg</span>
                            </div>
                            <div class="cart-item-badges">
                                ${product.impact.isOrganic ? '<span class="badge badge-organic">Orgánico</span>' : ''}
                                ${product.impact.isLocal ? '<span class="badge badge-local">Local</span>' : ''}
                                ${product.impact.isPlasticFree ? '<span class="badge badge-plasticfree">Sin Plástico</span>' : ''}
                            </div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn minus" data-id="${product.id}" type="button">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${product.id}">
                                <button class="quantity-btn plus" data-id="${product.id}" type="button">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <button class="remove-item" data-id="${product.id}" type="button">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </div>
                    `;
                    cartItems.appendChild(cartItem);
                }
            });

            // Configurar event listeners para los botones de cantidad
            document.querySelectorAll('.quantity-btn.minus').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const productId = parseInt(e.target.closest('button').dataset.id);
                    const item = cart.find(item => item.id === productId);
                    if (item) updateQuantity(productId, item.quantity - 1);
                });
            });

            document.querySelectorAll('.quantity-btn.plus').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const productId = parseInt(e.target.closest('button').dataset.id);
                    const item = cart.find(item => item.id === productId);
                    if (item) updateQuantity(productId, item.quantity + 1);
                });
            });

            document.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const productId = parseInt(e.target.dataset.id);
                    const newQuantity = parseInt(e.target.value);
                    if (!isNaN(newQuantity) && newQuantity > 0) {
                        updateQuantity(productId, newQuantity);
                    } else {
                        e.target.value = cart.find(item => item.id === productId).quantity;
                    }
                });

                // Prevenir que el input pierda el foco
                input.addEventListener('blur', (e) => {
                    // Forzar el foco de vuelta si el carrito está abierto
                    if (cartSidebar.classList.contains('active')) {
                        setTimeout(() => {
                            if (cartSidebar.classList.contains('active')) {
                                e.target.focus();
                            }
                        }, 10);
                    }
                });
            });

            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const productId = parseInt(e.target.closest('button').dataset.id);
                    removeFromCart(productId);
                });
            });
        }
    }

    // Calcular y mostrar impacto SOLO de productos en el carrito
    const impact = calculateImpact();
    if (waterSaved) waterSaved.textContent = impact.waterSaved;
    if (plasticFreeCount) plasticFreeCount.textContent = impact.plasticFreeCount;
    if (localProducersCount) localProducersCount.textContent = impact.localProducersCount;
    if (co2Saved) co2Saved.textContent = impact.co2Saved.toFixed(1);
    
    const subtotal = impact.total;
    const shipping = subtotal >= APP_CONFIG.shippingThreshold ? 0 : APP_CONFIG.shippingCost;
    const total = subtotal + shipping;
    
    if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingCost) shippingCost.textContent = shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`;
    if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
    if (treesEquivalent) treesEquivalent.textContent = Math.round(total * APP_CONFIG.treesPerEuro);
    
    // Mantener el carrito abierto si estaba abierto antes de la actualización
    if (wasCartOpen) {
        cartSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Restaurar posición del scroll después de actualizar
    setTimeout(() => {
        cartSidebar.scrollTop = currentScroll;
    }, 0);
}

// Calcular el impacto ambiental del carrito
function calculateImpact() {
    return cart.reduce((totals, cartItem) => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            totals.waterSaved += product.impact.waterSaved * cartItem.quantity;
            totals.plasticFreeCount += product.impact.isPlasticFree ? cartItem.quantity : 0;
            totals.localProducersCount += product.impact.isLocal ? cartItem.quantity : 0;
            totals.co2Saved += product.impact.co2Saved * cartItem.quantity;
            totals.total += product.price * cartItem.quantity;
        }
        return totals;
    }, {
        waterSaved: 0,
        plasticFreeCount: 0,
        localProducersCount: 0,
        co2Saved: 0,
        total: 0
    });
}

// Nueva función para actualizar la UI del impacto total acumulado
function updateTotalImpactUI() {
    if (totalWaterSaved) totalWaterSaved.textContent = totalImpact.waterSaved;
    if (totalPlasticSaved) totalPlasticSaved.textContent = totalImpact.plasticFreeCount;
    if (totalLocalSupported) totalLocalSupported.textContent = totalImpact.localProducersCount;
}

// Finalizar compra - MODIFICADA para mantener contadores
function checkout() {
    if (cart.length === 0) {
        showToast('Tu carrito está vacío', 'error');
        return;
    }
    
    const impact = calculateImpact();
    const shipping = impact.total >= APP_CONFIG.shippingThreshold ? 0 : APP_CONFIG.shippingCost;
    const total = impact.total + shipping;
    
    showLoading(true);
    
    setTimeout(() => {
        showLoading(false);
        
        // ACTUALIZAR CONTADORES ACUMULATIVOS antes de limpiar el carrito
        totalImpact.waterSaved += impact.waterSaved;
        totalImpact.plasticFreeCount += impact.plasticFreeCount;
        totalImpact.localProducersCount += impact.localProducersCount;
        totalImpact.co2Saved += impact.co2Saved;
        totalImpact.totalSpent += impact.total;
        
        // Guardar el impacto acumulado
        localStorage.setItem('terracart_total_impact', JSON.stringify(totalImpact));
        
        // Guardar en el historial de compras si el usuario está logueado
        if (user) {
            const order = {
                id: Date.now(),
                date: new Date().toISOString(),
                items: [...cart],
                total: total,
                impact: impact
            };
            
            purchaseHistory.unshift(order);
            localStorage.setItem('terracart_purchase_history', JSON.stringify(purchaseHistory));
        }
        
        const modalHTML = `
            <div class="checkout-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2><i class="fas fa-check-circle"></i> ¡Compra Exitosa!</h2>
                    </div>
                    <div class="modal-body">
                        <p>Gracias por tu compra en TerraCart. Tu pedido ha sido procesado correctamente.</p>
                        <div class="order-summary">
                            <h3>Resumen de tu Pedido</h3>
                            <div class="summary-item">
                                <span>Productos:</span>
                                <span>$${impact.total.toFixed(2)}</span>
                            </div>
                            <div class="summary-item">
                                <span>Envío:</span>
                                <span>${shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`}</span>
                            </div>
                            <div class="summary-item total">
                                <span>Total:</span>
                                <span>$${total.toFixed(2)}</span>
                            </div>
                        </div>
                        <div class="impact-summary">
                            <h3>Tu Impacto Positivo</h3>
                            <div class="impact-grid">
                                <div class="impact-item">
                                    <i class="fas fa-tint"></i>
                                    <span>${impact.waterSaved}L</span>
                                    <small>Agua ahorrada</small>
                                </div>
                                <div class="impact-item">
                                    <i class="fas fa-ban"></i>
                                    <span>${impact.plasticFreeCount}</span>
                                    <small>Productos sin plástico</small>
                                </div>
                                <div class="impact-item">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <span>${impact.localProducersCount}</span>
                                    <small>Productores locales</small>
                                </div>
                                <div class="impact-item">
                                    <i class="fas fa-leaf"></i>
                                    <span>${impact.co2Saved.toFixed(1)}kg</span>
                                    <small>CO₂ ahorrado</small>
                                </div>
                            </div>
                        </div>
                        <p class="eco-message">
                            <i class="fas fa-seedling"></i>
                            Tu compra equivale a plantar <strong>${Math.round(total * APP_CONFIG.treesPerEuro)}</strong> árboles
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" id="continueShopping">Seguir Comprando</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const style = document.createElement('style');
        style.textContent = `
            .checkout-modal { 
                position: fixed; 
                top: 0; 
                left: 0; 
                width: 100%; 
                height: 100%; 
                background: rgba(0,0,0,0.5); 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                z-index: 2000; 
                animation: fadeIn .3s ease;
            }
            .modal-content { 
                background: white; 
                border-radius: 12px; 
                padding: 30px; 
                max-width: 500px; 
                width: 90%; 
                max-height: 90vh; 
                overflow-y: auto; 
                animation: slideUp .3s ease;
            }
            .modal-header h2 { 
                color: #2e7d32; 
                display: flex; 
                align-items: center; 
                gap: 10px; 
                margin-bottom: 20px;
            }
            .modal-header h2 i { 
                color: #ffb300;
            }
            .order-summary, .impact-summary { 
                margin: 20px 0; 
                padding: 20px; 
                background: #f8f9fa; 
                border-radius: 12px;
            }
            .summary-item { 
                display: flex; 
                justify-content: space-between; 
                margin-bottom: 10px;
            }
            .summary-item.total { 
                font-weight: bold; 
                font-size: 1.1rem; 
                border-top: 1px solid #e9ecef; 
                padding-top: 10px; 
                margin-top: 10px;
            }
            .impact-grid { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 15px; 
                margin-top: 15px;
            }
            .impact-item { 
                text-align: center; 
                padding: 15px; 
                background: white; 
                border-radius: 12px;
            }
            .impact-item i { 
                font-size: 24px; 
                color: #2e7d32; 
                margin-bottom: 5px;
            }
            .impact-item span { 
                display: block; 
                font-weight: bold; 
                font-size: 1.2rem; 
                color: #005005;
            }
            .impact-item small { 
                color: #666; 
                font-size: .8rem;
            }
            .eco-message { 
                text-align: center; 
                padding: 15px; 
                background: rgba(46,125,50,.1); 
                border-radius: 12px; 
                margin: 20px 0;
            }
            .modal-footer { 
                text-align: center;
            }
            @keyframes fadeIn { 
                from{opacity:0;} 
                to{opacity:1;} 
            }
            @keyframes slideUp { 
                from{transform:translateY(50px);opacity:0;} 
                to{transform:translateY(0);opacity:1;} 
            }
            
            /* Modo oscuro para el modal */
            body.dark-mode .modal-content {
                background: #2d2d2d !important;
                color: #e5e5e5 !important;
            }
            body.dark-mode .order-summary,
            body.dark-mode .impact-summary {
                background: #3d3d3d !important;
                color: #e5e5e5 !important;
            }
            body.dark-mode .impact-item {
                background: #2d2d2d !important;
                color: #e5e5e5 !important;
            }
            body.dark-mode .impact-item span {
                color: #ffb300 !important;
            }
            body.dark-mode .impact-item small {
                color: #b0b0b0 !important;
            }
            body.dark-mode .eco-message {
                background: rgba(255, 179, 0, 0.1) !important;
                color: #e5e5e5 !important;
            }
        `;
        document.head.appendChild(style);

        const continueShoppingBtn = document.getElementById('continueShopping');
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', () => {
                const checkoutModal = document.querySelector('.checkout-modal');
                if (checkoutModal) checkoutModal.remove();
                if (style) style.remove();
                
                // Limpiar solo el carrito actual, mantener los contadores acumulados
                cart = [];
                saveCart();
                updateCartUI();
                toggleCart();
                
                // Actualizar la UI con los nuevos contadores acumulados
                updateTotalImpactUI();
                
                showToast('¡Gracias por tu compra ecológica! 🌍', 'success');
            });
        }
    }, 2000);
}

// Mostrar notificaciones toast
function showToast(message, type = 'success') {
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i>
        <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode === toastContainer) {
                toast.remove();
            }
        }, 300);
    }, 3000);
}

// Mostrar/ocultar loading
function showLoading(show) {
    if (!loadingOverlay) return;
    
    if (show) {
        loadingOverlay.classList.add('active');
    } else {
        loadingOverlay.classList.remove('active');
    }
}

// Sistema de autenticación
function showLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        hideMobileMenu();
    }
}

function hideLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function showRegisterModal() {
    const registerModal = document.getElementById('registerModal');
    if (registerModal) {
        registerModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        hideMobileMenu();
    }
}

function hideRegisterModal() {
    const registerModal = document.getElementById('registerModal');
    if (registerModal) {
        registerModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simulación de autenticación
    const users = JSON.parse(localStorage.getItem('terracart_users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('terracart_user', JSON.stringify(user));
        updateUserUI();
        hideLoginModal();
        showToast(`¡Bienvenido de nuevo, ${user.name}!`, 'success');
    } else {
        showToast('Credenciales incorrectas. Inténtalo de nuevo.', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showToast('Las contraseñas no coinciden.', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('terracart_users')) || [];
    
    if (users.find(u => u.email === email)) {
        showToast('Este correo electrónico ya está registrado.', 'error');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        joinDate: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('terracart_users', JSON.stringify(users));
    localStorage.setItem('terracart_user', JSON.stringify(newUser));
    
    updateUserUI();
    hideRegisterModal();
    showToast(`¡Cuenta creada exitosamente! Bienvenido a TerraCart, ${name}.`, 'success');
}

function logout() {
    localStorage.removeItem('terracart_user');
    user = null;
    updateUserUI();
    showToast('Sesión cerrada correctamente.', 'success');
    hideMobileMenu();
}

function updateUserUI() {
    user = JSON.parse(localStorage.getItem('terracart_user')) || null;
    const userName = document.getElementById('userName');
    const purchaseHistoryBtn = document.getElementById('purchaseHistoryBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    const mobileHistoryBtn = document.getElementById('mobileHistoryBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const mobileRegisterBtn = document.getElementById('mobileRegisterBtn');
    
    if (user) {
        if (userName) userName.textContent = user.name;
        if (purchaseHistoryBtn) purchaseHistoryBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        
        if (mobileHistoryBtn) mobileHistoryBtn.style.display = 'block';
        if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'block';
        if (mobileLoginBtn) mobileLoginBtn.style.display = 'none';
        if (mobileRegisterBtn) mobileRegisterBtn.style.display = 'none';
    } else {
        if (userName) userName.textContent = 'Mi Cuenta';
        if (purchaseHistoryBtn) purchaseHistoryBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'block';
        if (registerBtn) registerBtn.style.display = 'block';
        
        if (mobileHistoryBtn) mobileHistoryBtn.style.display = 'none';
        if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'none';
        if (mobileLoginBtn) mobileLoginBtn.style.display = 'block';
        if (mobileRegisterBtn) mobileRegisterBtn.style.display = 'block';
    }
}

// Vista previa de productos
function showProductPreview(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modalBody = document.getElementById('previewModalBody');
    if (!modalBody) return;
    
    let badges = '';
    if (product.impact.isOrganic) badges += '<span class="badge badge-organic">Orgánico</span>';
    if (product.impact.isLocal) badges += '<span class="badge badge-local">Local</span>';
    if (product.impact.isPlasticFree) badges += '<span class="badge badge-plasticfree">Sin Plástico</span>';
    
    modalBody.innerHTML = `
        <div class="product-preview">
            <div class="preview-image-container">
                <img src="${product.image}" alt="${product.name}" class="preview-image" onerror="handleImageError(this)">
                <div class="preview-badges">${badges}</div>
            </div>
            <div class="preview-details">
                <h1 class="preview-name">${product.name}</h1>
                <p class="preview-description">${product.description}</p>
                <div class="preview-price">$${product.price.toFixed(2)}</div>
                
                <div class="preview-impact">
                    <div class="impact-item">
                        <i class="fas fa-tint"></i>
                        <div class="impact-info">
                            <h4>Ahorro de Agua</h4>
                            <p>${product.impact.waterSaved} litros</p>
                        </div>
                    </div>
                    <div class="impact-item">
                        <i class="fas fa-leaf"></i>
                        <div class="impact-info">
                            <h4>Reducción CO₂</h4>
                            <p>${product.impact.co2Saved} kg</p>
                        </div>
                    </div>
                    <div class="impact-item">
                        <i class="fas fa-ban"></i>
                        <div class="impact-info">
                            <h4>Sin Plástico</h4>
                            <p>${product.impact.isPlasticFree ? 'Sí' : 'No'}</p>
                        </div>
                    </div>
                    <div class="impact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div class="impact-info">
                            <h4>Producto Local</h4>
                            <p>${product.impact.isLocal ? 'Sí' : 'No'}</p>
                        </div>
                    </div>
                </div>
                
                <div class="preview-actions">
                    <button class="btn btn-primary btn-full" onclick="addToCart(${product.id}); hideProductPreview();">
                        <i class="fas fa-cart-plus"></i>
                        Añadir al Carrito
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const productPreviewModal = document.getElementById('productPreviewModal');
    if (productPreviewModal) {
        productPreviewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideProductPreview() {
    const productPreviewModal = document.getElementById('productPreviewModal');
    if (productPreviewModal) {
        productPreviewModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Historial de compras
function showPurchaseHistory() {
    if (!user) {
        showToast('Debes iniciar sesión para ver tu historial de compras.', 'error');
        return;
    }
    
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    if (purchaseHistory.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 40px;">
                <i class="fas fa-shopping-bag" style="font-size: 50px; color: var(--gray-light); margin-bottom: 15px;"></i>
                <h3>No hay compras anteriores</h3>
                <p>Realiza tu primera compra para verla aquí</p>
            </div>
        `;
    } else {
        historyList.innerHTML = purchaseHistory.map(order => `
            <div class="history-item">
                <div class="history-header">
                    <div class="history-date">${new Date(order.date).toLocaleDateString('es-ES')}</div>
                    <div class="history-total">$${order.total.toFixed(2)}</div>
                    <div class="history-status status-completed">Completado</div>
                </div>
                <div class="history-products">
                    ${order.items.map(item => {
                        const product = products.find(p => p.id === item.id);
                        return product ? `
                            <div class="history-product">
                                <img src="${product.image}" alt="${product.name}">
                                <div class="history-product-info">
                                    <div class="history-product-name">${product.name}</div>
                                    <div class="history-product-quantity">Cantidad: ${item.quantity}</div>
                                </div>
                            </div>
                        ` : '';
                    }).join('')}
                </div>
            </div>
        `).join('');
    }
    
    const historyModal = document.getElementById('historyModal');
    if (historyModal) {
        historyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        hideMobileMenu();
    }
}

function hidePurchaseHistory() {
    const historyModal = document.getElementById('historyModal');
    if (historyModal) {
        historyModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Menú móvil
function showMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Pop-up de ofertas
function setupOfferPopup() {
    // Mostrar pop-up cada 2 minutos (120000 ms) - para testing usar 30000 (30 segundos)
    setInterval(() => {
        const offerPopup = document.getElementById('offerPopup');
        if (offerPopup && !offerPopup.classList.contains('active')) {
            showOfferPopup();
        }
    }, 120000);
    
    // Iniciar timer
    startOfferTimer();
}

function showOfferPopup() {
    const offerPopup = document.getElementById('offerPopup');
    if (offerPopup) {
        offerPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideOfferPopup() {
    const offerPopup = document.getElementById('offerPopup');
    if (offerPopup) {
        offerPopup.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function addOfferToCart() {
    // Añadir el producto de oferta (shampoo sólido) al carrito
    addToCart(3); // ID del shampoo sólido
    hideOfferPopup();
    showToast('¡Oferta añadida al carrito!', 'success');
}

function startOfferTimer() {
    // Configurar timer para 15 minutos (900 segundos)
    let timeLeft = 900;
    
    offerTimer = setInterval(() => {
        timeLeft--;
        
        if (timeLeft <= 0) {
            clearInterval(offerTimer);
            hideOfferPopup();
            return;
        }
        
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
        if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
        if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
    }, 1000);
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    init();
    if (localStorage.getItem('terracart_darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
});

