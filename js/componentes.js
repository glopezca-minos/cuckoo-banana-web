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

/* Botón de WhatsApp */

const whatsappHTML = `
<a
  href="https://wa.me/50671291718"
  class="cb-whatsapp"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Contactar a Cuckoo Banana por WhatsApp"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="34"
    height="34"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.966-.273-.099-.471-.148-.67.149-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.058-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.496.1-.198.05-.372-.025-.52-.074-.149-.669-1.612-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.064 2.875 1.213 3.073c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.005-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.866 9.866 0 0 1-5.031-1.378l-.361-.214-3.74.981.998-3.646-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.445 4.434-9.875 9.881-9.875a9.81 9.81 0 0 1 6.988 2.894 9.81 9.81 0 0 1 2.89 6.993c-.002 5.445-4.434 9.875-9.876 9.875m8.406-18.288A11.815 11.815 0 0 0 12.053 0C5.495 0 .157 5.337.155 11.893c0 2.096.547 4.142 1.588 5.945L.057 24l6.3-1.652a11.9 11.9 0 0 0 5.693 1.45h.005c6.557 0 11.895-5.337 11.898-11.893a11.82 11.82 0 0 0-3.496-8.408z"/>
  </svg>
</a>
`;

if (!document.querySelector('.cb-whatsapp')) {
  document.body.insertAdjacentHTML('beforeend', whatsappHTML);
}


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
