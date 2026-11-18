/* =====================================================
   Página del carrito
   Necesita: carrito.js y catalogo.js cargados antes.
   ===================================================== */

const listaCarrito = document.getElementById('lista-carrito');
const carritoLleno = document.getElementById('carrito-lleno');
const carritoVacio = document.getElementById('carrito-vacio');
const resumenCantidad = document.getElementById('resumen-cantidad');
const resumenSubtotal = document.getElementById('resumen-subtotal');
const resumenTotal = document.getElementById('resumen-total');
const barraTotal = document.getElementById('barra-total');

const nombresEstado = {
  'disponible': 'Disponible',
  'lista-espera': 'Lista de espera',
  'reservada': 'Reservada',
  'vendida': 'Vendida'
};


/* ===== Una pieza del carrito ===== */
function crearItem(pieza) {
  const foto = pieza.imagen
    ? `<img src="${pieza.imagen}" alt="${pieza.alt}">`
    : `<div class="cb-foto-placeholder">Foto</div>`;

  return `
    <article class="cb-item">
      <a href="producto.html?id=${pieza.id}" class="cb-item-foto">${foto}</a>

      <div class="cb-item-info">
        <h2 class="cb-item-nombre"><a href="producto.html?id=${pieza.id}">${pieza.nombre}</a></h2>
        <span class="cb-estado cb-estado-${pieza.estado}">${nombresEstado[pieza.estado]}</span>
        <p class="cb-item-detalle">Pieza única</p>
        <button class="cb-item-eliminar" type="button" data-quitar="${pieza.id}">× Eliminar</button>
      </div>

      <span class="cb-item-precio">${formatoPrecio(pieza.precio)}</span>
    </article>`;
}


/* ===== Mostrar el carrito ===== */
function mostrarCarrito() {
  // De la lista de id ["colibri", "lapa"], buscamos cada pieza en el catálogo
  const piezas = obtenerCarrito()
    .map(id => catalogo.find(pieza => pieza.id === id))
    .filter(pieza => pieza);              // descarta si alguna ya no existe

  // ¿Vacío o con piezas?
  carritoVacio.hidden = piezas.length > 0;
  carritoLleno.hidden = piezas.length === 0;
  if (piezas.length === 0) return;

  // Lista de piezas
  listaCarrito.innerHTML = piezas.map(crearItem).join('');

  // Totales: suma de los precios
  const subtotal = piezas.reduce((suma, pieza) => suma + pieza.precio, 0);
  resumenCantidad.textContent = piezas.length === 1 ? 'Subtotal (1 pieza)' : `Subtotal (${piezas.length} piezas)`;
  resumenSubtotal.textContent = formatoPrecio(subtotal);
  resumenTotal.textContent = formatoPrecio(subtotal);   // el envío se suma en el checkout
  barraTotal.textContent = formatoPrecio(subtotal);
}


/* ===== Eliminar una pieza ===== */
listaCarrito.addEventListener('click', evento => {
  const boton = evento.target.closest('[data-quitar]');
  if (!boton) return;

  quitarDelCarrito(boton.dataset.quitar);
  mostrarCarrito();
});

mostrarCarrito();
