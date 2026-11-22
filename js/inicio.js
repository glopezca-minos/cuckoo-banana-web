/* =====================================================
   Inicio
   1. "Disponibles ahora": las piezas salen de catalogo.js (y de la hoja)
   2. Botones "Agregar al carrito"
   3. Carrusel del hero (menos movimiento)
   Necesita: carrito.js y catalogo.js cargados antes.
   ===================================================== */

const gridInicio = document.querySelector('.cb-home-products-grid');
const PIEZAS_EN_INICIO = 4;

// Cambia el botón a "En el carrito"
function marcarEnCarrito(boton) {
  boton.disabled = true;
  boton.innerHTML = '<i class="bi bi-check2" aria-hidden="true"></i> En el carrito';
}

// Arma el HTML de una tarjeta (igual a la que diseñó Eme)
function crearTarjetaInicio(pieza) {
  const foto = pieza.imagen
    ? `<img src="${pieza.imagen}" alt="${pieza.alt || pieza.nombre}" class="cb-home-photo" loading="lazy">`
    : `<span class="cb-foto-placeholder">Foto de la pieza a contraluz</span>`;

  return `
    <article class="cb-tarjeta">
      <a href="producto.html?id=${pieza.id}" class="cb-tarjeta-foto">
        ${foto}
      </a>
      <div class="cb-tarjeta-info">
        <h3 class="cb-tarjeta-nombre">${pieza.nombre}</h3>
        <p class="cb-tarjeta-precio">${formatoPrecio(pieza.precio)}</p>
        <p class="cb-tarjeta-desc">${pieza.descripcion || ''}</p>
        <span class="cb-estado cb-estado-disponible">Disponible</span>
        <div class="cb-tarjeta-botones">
          <a href="producto.html?id=${pieza.id}" class="cb-btn cb-btn-borde">Ver detalles</a>
          <button type="button" class="cb-btn cb-btn-principal" data-producto="${pieza.id}">
            <i class="bi bi-cart3" aria-hidden="true"></i>
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>`;
}

// Muestra las primeras piezas disponibles (primero las que tienen foto)
function mostrarDisponibles() {
  if (!gridInicio) return;

  const disponibles = catalogo
    .filter(pieza => pieza.estado === 'disponible')
    .sort((a, b) => Boolean(b.imagen) - Boolean(a.imagen))
    .slice(0, PIEZAS_EN_INICIO);

  gridInicio.innerHTML = disponibles.map(crearTarjetaInicio).join('');

  // Botones de carrito de las tarjetas nuevas
  gridInicio.querySelectorAll('[data-producto]').forEach(boton => {
    const id = boton.dataset.producto;
    if (estaEnCarrito(id)) marcarEnCarrito(boton);

    boton.addEventListener('click', () => {
      agregarAlCarrito(id);
      marcarEnCarrito(boton);
    });
  });

  // Animación de entrada (js/animaciones.js)
  if (typeof animarTarjetas === 'function') animarTarjetas();
}

mostrarDisponibles();                        // con lo que ya tenemos
cargarCatalogo().then(mostrarDisponibles);   // y se actualiza con la hoja

// Si la persona pidió menos movimiento, el carrusel no avanza solo
const heroCarrusel = document.getElementById('hero-carrusel');
if (heroCarrusel && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  bootstrap.Carousel.getOrCreateInstance(heroCarrusel, { ride: false, interval: false });
}
