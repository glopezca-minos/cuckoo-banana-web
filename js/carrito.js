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

// Número del header: "Carrito (2)"
function actualizarContador() {
  const contador = document.getElementById('cart-count');
  if (contador) contador.textContent = obtenerCarrito().length;
}

// Pequeño rebote del número al agregar
function animarContador() {
  const contador = document.getElementById('cart-count');
  if (!contador) return;
  contador.classList.remove('cb-rebote');
  void contador.offsetWidth;
  contador.classList.add('cb-rebote');
}

actualizarContador();
