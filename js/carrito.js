/* ============================
   Carrito
   ============================*/
function obtenerCarrito() {
  try {
    return JSON.parse(localStorage.getItem('carrito')) || [];
  } catch {
    return [];
  }
}

// Guarda el carrito y actualiza el número del header
function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContador();
}

function estaEnCarrito(id) {
  return obtenerCarrito().includes(id);
}

function agregarAlCarrito(id) {
  const carrito = obtenerCarrito();
  if (carrito.includes(id)) return;
  carrito.push(id);
  guardarCarrito(carrito);
  animarContador();
}

function quitarDelCarrito(id) {
  guardarCarrito(obtenerCarrito().filter(x => x !== id));
}

// Número del header
function actualizarContador() {
  const contador = document.getElementById('cart-count');
  if (!contador) return;
  const cantidad = obtenerCarrito().length;
  contador.textContent = cantidad;
  contador.hidden = cantidad === 0;
}

// Al agregar: el carrito se sacude y el circulito salta
function animarContador() {
  const carrito = document.querySelector('.cb-cart');
  if (!carrito) return;
  carrito.classList.remove('cb-agregado');
  void carrito.offsetWidth;            // reinicia la animación
  carrito.classList.add('cb-agregado');
}

actualizarContador();
