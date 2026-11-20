/* =====================================================
   Inicio: botones "Agregar al carrito"
   ===================================================== */

// Cambia el botón a "En el carrito"
function marcarEnCarrito(boton) {
  boton.disabled = true;
  boton.innerHTML = '<i class="bi bi-check2" aria-hidden="true"></i> En el carrito';
}

document.querySelectorAll('[data-producto]').forEach(boton => {
  const id = boton.dataset.producto;

  // Si ya estaba en el carrito, lo va a mostrar marcado
  if (estaEnCarrito(id)) marcarEnCarrito(boton);

  boton.addEventListener('click', () => {
    agregarAlCarrito(id);
    marcarEnCarrito(boton);
  });
});

//menos movimiento, el carrusel no avanza solo
const heroCarrusel = document.getElementById('hero-carrusel');
if (heroCarrusel && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  bootstrap.Carousel.getOrCreateInstance(heroCarrusel, { ride: false, interval: false });
}