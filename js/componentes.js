/* =====================================================
   Componentes globales header y footer 
   ===================================================== */

/* ===== 1. HTML del header ===== */
const headerHTML = `
<header class="cb-header">
  <div class="cb-header-container">

    <!-- Logo -->
    <a href="index.html" class="cb-header-logo">
      <img src="img/logo.svg" alt="Cuckoo Banana">
      <span class="cb-logo-subtitle">ARTE EN VIDRIO</span>
    </a>

    <!-- Menú principal -->
    <nav class="cb-navigation" id="menu-principal" aria-label="Navegación principal">
      <a href="tienda.html">Tienda</a>
      <a href="personalizados.html">Personalizados</a>
      <a href="talleres.html">Talleres</a>
      <a href="sobre-nosotras.html">Sobre nosotras</a>
      <a href="ayuda.html">Ayuda</a>
    </nav>

    <!-- Carrito -->
    <a href="carrito.html" class="cb-cart">
      <svg width="27" height="27" viewBox="0 0 24 24"
           fill="none" stroke="currentColor"
           stroke-width="1.5" stroke-linecap="round"
           stroke-linejoin="round" aria-hidden="true">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"></path>
      </svg>
      <span><span class="cb-cart-text">Carrito </span>(<span id="cart-count">0</span>)</span>
    </a>

    <!-- Botón de menú (solo en celular) -->
    <button class="cb-menu-btn" type="button" aria-label="Abrir menú"
            aria-expanded="false" aria-controls="menu-principal">
      <span></span>
      <span></span>
      <span></span>
    </button>

  </div>
</header>
`;

/* ===== 2. HTML del footer ===== */
const footerHTML = `
<footer class="cb-footer">

  <div class="cb-footer-container">

    <!-- Logo con ave integrada -->
    <div class="cb-footer-brand">
      <div class="cb-footer-logo">
        <img src="img/logoave.svg" alt="Cuckoo Banana">
        <span class="cb-footer-subtitle">ARTE EN VIDRIO</span>
      </div>
    </div>

    <!-- Contacto -->
    <div class="cb-footer-column">
      <h3>Contacto</h3>
      <a href="https://wa.me/50671291718" target="_blank" rel="noopener">
        <i class="bi bi-whatsapp" aria-hidden="true"></i> WhatsApp: 7129 1718
      </a>
      <p>Taller en las montañas de Heredia</p>
    </div>

    <!-- Redes sociales -->
    <div class="cb-footer-column">
      <h3>Redes</h3>
      <a href="https://www.instagram.com/cuckoobananacr" target="_blank" rel="noopener">
        <i class="bi bi-instagram" aria-hidden="true"></i> Instagram
      </a>
      <a href="https://www.tiktok.com/@cuckoobanana.cr" target="_blank" rel="noopener">
        <i class="bi bi-tiktok" aria-hidden="true"></i> TikTok
      </a>
      <a href="https://www.facebook.com/share/18eVVMNX1D/" target="_blank" rel="noopener">
        <i class="bi bi-facebook" aria-hidden="true"></i> Facebook
      </a>
    </div>

    <!-- Ayuda -->
    <div class="cb-footer-column">
      <h3>Ayuda</h3>
      <a href="ayuda.html">Envíos y preguntas frecuentes</a>
      <a href="ayuda.html">Lista de espera</a>
      <a href="personalizados.html">Pedidos personalizados</a>
    </div>

  </div>

  <!-- Enlaces legales -->
  <div class="cb-footer-bottom">
    <a href="privacidad.html">Aviso de privacidad</a>
    <span>-</span>
    <a href="terminos.html">Políticas de reserva y cambios</a>
    <span>-</span>
    <p>© 2026 Cuckoo Banana</p>
  </div>

</footer>
`;

/* ===== 3. Insertar header y footer en la página ===== */
document.getElementById('header').outerHTML = headerHTML;
document.getElementById('footer').outerHTML = footerHTML;

/* ===== 4. Marcar en el menú la página actual ===== */
// Ej.: en ".../tienda.html" (o ".../tienda") la página actual es "tienda"
const paginaActual = (location.pathname.split('/').pop() || 'index').replace('.html', '');

document.querySelectorAll('.cb-navigation a').forEach(enlace => {
  if (enlace.getAttribute('href').replace('.html', '') === paginaActual) {
    enlace.classList.add('cb-nav-highlight');
    enlace.setAttribute('aria-current', 'page');
  }
});

/* ===== 5. Menú hamburguesa en celular ===== */
const botonMenu = document.querySelector('.cb-menu-btn');
const menu = document.getElementById('menu-principal');

botonMenu.addEventListener('click', () => {
  const abierto = menu.classList.toggle('abierto');
  botonMenu.setAttribute('aria-expanded', abierto);
  botonMenu.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
});
