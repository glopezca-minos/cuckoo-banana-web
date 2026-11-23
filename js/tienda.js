/* =====================================================
   Tienda: crea tarjetas a partir de catalogo.js
   ===================================================== */

const grid = document.getElementById('grid-productos');
const contadorPiezas = document.getElementById('contador-piezas');

// Texto de la etiqueta según el estado
const textoEstado = {
  'disponible': 'Disponible',
  'lista-espera': 'Lista de espera',
  'reservada': 'Reservada',
  'vendida': 'Vendida'
};


/* ===== El botón cambia según el estado ===== */
function crearBoton(pieza) {
  if (pieza.estado === 'disponible' && estaEnCarrito(pieza.id)) {
    return `
      <button class="cb-btn cb-btn-principal" type="button" disabled>
        <i class="bi bi-check2" aria-hidden="true"></i> En el carrito
      </button>`;
  }

  if (pieza.estado === 'disponible') {
    return `
      <button class="cb-btn cb-btn-principal" type="button" data-id="${pieza.id}">
        <i class="bi bi-cart3" aria-hidden="true"></i> Agregar al carrito
      </button>`;
  }

  if (pieza.estado === 'lista-espera') {
    return `
      <a href="producto.html?id=${pieza.id}&lista=1" class="cb-btn cb-btn-borde">
        <i class="bi bi-envelope" aria-hidden="true"></i> Unirme a la lista
      </a>`;
  }

  // Reservada o vendida: botón desactivado
  const icono = pieza.estado === 'reservada' ? '<i class="bi bi-lock" aria-hidden="true"></i> ' : '';
  return `<button class="cb-btn" type="button" disabled>${icono}${textoEstado[pieza.estado]}</button>`;
}


/* ===== Una tarjeta ===== */
function crearTarjeta(pieza) {
  // Foto real o recuadro rayado si todavía no hay foto
  const foto = pieza.imagen
    ? `<img src="${pieza.imagen}" alt="${pieza.alt}" loading="lazy"
         onerror="this.outerHTML='<div class=&quot;cb-foto-placeholder&quot;>Foto de la pieza a contraluz</div>'">`
    : `<div class="cb-foto-placeholder">Foto de la pieza a contraluz</div>`;
  return `
    <article class="cb-tarjeta">
      <a href="producto.html?id=${pieza.id}" class="cb-tarjeta-foto">
        ${foto}
      </a>

      <div class="cb-tarjeta-info">
        <h2 class="cb-tarjeta-nombre">${pieza.nombre}</h2>
        <p class="cb-tarjeta-precio">${formatoPrecio(pieza.precio)}</p>
        <p class="cb-tarjeta-desc">${pieza.descripcion}</p>
        <span class="cb-estado cb-estado-${pieza.estado}">${textoEstado[pieza.estado]}</span>

        <div class="cb-tarjeta-botones">
          <a href="producto.html?id=${pieza.id}" class="cb-btn cb-btn-borde cb-btn-detalles">Ver detalles</a>
          ${crearBoton(pieza)}
        </div>
      </div>
    </article>`;
}


/* ===== Mostrar todas las tarjetas ===== */
function mostrarPiezas(lista) {
  grid.innerHTML = lista.map(crearTarjeta).join('');

  // Animación de entrada (js/animaciones.js)
  if (typeof animarTarjetas === 'function') animarTarjetas();
}

/* =====================================================
   Paso 8: filtros y ordenar
   ===================================================== */

const botonesDisponibilidad = document.querySelectorAll('.cb-segmento');
const casillasCategoria = document.querySelectorAll('.cb-categorias input');
const selectOrdenar = document.getElementById('ordenar');
const mensajeVacio = document.getElementById('mensaje-vacio');

// Lo que la persona eligió
let disponibilidadElegida = 'todas';

// Cargar más: cuántas tarjetas se ven a la vez
const PIEZAS_POR_TANDA = 8;
let cantidadVisible = PIEZAS_POR_TANDA;

const bloqueCargarMas = document.getElementById('cargar-mas');
const textoMostrando = document.getElementById('texto-mostrando');
const botonCargarMas = document.getElementById('boton-cargar-mas');
const botonVerResultados = document.getElementById('ver-resultados');

function aplicarFiltros() {
  // Categorías marcadas
  const categoriasMarcadas = [...casillasCategoria]
    .filter(casilla => casilla.checked)
    .map(casilla => casilla.value);

  // Filtrar el catálogo
  let resultado = catalogo.filter(pieza => {
    const pasaDisponibilidad =
      disponibilidadElegida === 'todas' || pieza.estado === disponibilidadElegida;

    const pasaCategoria =
      categoriasMarcadas.length === 0 || categoriasMarcadas.includes(pieza.categoria);

    return pasaDisponibilidad && pasaCategoria;
  });

  // Ordenar 
  if (selectOrdenar.value === 'precio-asc') {
    resultado = [...resultado].sort((a, b) => a.precio - b.precio);
  } else if (selectOrdenar.value === 'precio-desc') {
    resultado = [...resultado].sort((a, b) => b.precio - a.precio);
  }

  // Mostrar solo las primeras
  const total = resultado.length;
  const visibles = resultado.slice(0, cantidadVisible);
  mostrarPiezas(visibles);

  contadorPiezas.textContent = total === 1 ? '1 pieza' : `${total} piezas`;
  mensajeVacio.hidden = total > 0;

  // "Mostrando 8 de 10" y botón Cargar más
  textoMostrando.textContent = `Mostrando ${visibles.length} de ${total} piezas`;
  bloqueCargarMas.hidden = total === 0;
  botonCargarMas.hidden = visibles.length >= total;
  
  // Botón del panel de filtros en celular
  botonVerResultados.textContent = total === 1 ? 'Ver 1 pieza' : `Ver ${total} piezas`;
}

// cambia un filtro 
function filtrarDesdeElInicio() {
  cantidadVisible = PIEZAS_POR_TANDA;
  aplicarFiltros();
}

/* ===== Botones Todas / Entrega inmediata / Lista de espera ===== */
botonesDisponibilidad.forEach(boton => {
  boton.addEventListener('click', () => {
    botonesDisponibilidad.forEach(b => b.classList.remove('activo'));
    boton.classList.add('activo');
    disponibilidadElegida = boton.dataset.disponibilidad;
    filtrarDesdeElInicio();
  });
});

/* ===== Casillas de categoría ===== */
casillasCategoria.forEach(casilla => {
  casilla.addEventListener('change', filtrarDesdeElInicio);
});

/* ===== Ordenar ===== */
selectOrdenar.addEventListener('change', filtrarDesdeElInicio);

/* ===== Cargar más ===== */
botonCargarMas.addEventListener('click', () => {
  cantidadVisible += PIEZAS_POR_TANDA;
  aplicarFiltros();
});


/* =====================================================
   Paso 9: agregar al carrito
   ===================================================== */
grid.addEventListener('click', evento => {
  const boton = evento.target.closest('[data-id]');
  if (!boton) return;

  agregarAlCarrito(boton.dataset.id);
  boton.disabled = true;
  boton.innerHTML = '<i class="bi bi-check2" aria-hidden="true"></i> En el carrito';
});

/* =====================================================
   Paso 10: panel de filtros en celular
   ===================================================== */
const panelFiltros = document.getElementById('panel-filtros');
const botonFiltrar = document.querySelector('.cb-btn-filtrar');
const botonCerrarFiltros = document.getElementById('cerrar-filtros');

function abrirFiltros() {
  panelFiltros.classList.add('abierto');
  botonFiltrar.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function cerrarFiltros() {
  panelFiltros.classList.remove('abierto');
  botonFiltrar.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

botonFiltrar.addEventListener('click', abrirFiltros);
botonCerrarFiltros.addEventListener('click', cerrarFiltros);
botonVerResultados.addEventListener('click', cerrarFiltros);

// Cerrar con la tecla Escape
document.addEventListener('keydown', evento => {
  if (evento.key === 'Escape') cerrarFiltros();
});

/* ===== Filtros que vienen en el enlace =====*/
const parametros = new URLSearchParams(location.search);

const categoriaEnlace = parametros.get('categoria');
if (categoriaEnlace) {
  casillasCategoria.forEach(casilla => {
    if (casilla.value === categoriaEnlace) casilla.checked = true;
  });
}

const disponibilidadEnlace = parametros.get('disponibilidad');
if (disponibilidadEnlace) {
  botonesDisponibilidad.forEach(boton => {
    if (boton.dataset.disponibilidad === disponibilidadEnlace) boton.click();
  });
}

aplicarFiltros();
cargarCatalogo().then(aplicarFiltros);
