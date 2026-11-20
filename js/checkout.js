/* =====================================================
   Checkout
   Necesita: carrito.js y catalogo.js cargados antes.
   ===================================================== */

/* ===== Configuración ===== */
const COSTO_ENVIO = {
  'gam': 3000,
  'fuera-gam': 4000
};

const NOMBRE_ZONA = {
  'gam': 'GAM',
  'fuera-gam': 'Fuera del GAM'
};

/* ===== Provincias y cantones de Costa Rica ===== */
const cantonesPorProvincia = {
  'San José': ['San José', 'Escazú', 'Desamparados', 'Puriscal', 'Tarrazú', 'Aserrí', 'Mora', 'Goicoechea', 'Santa Ana', 'Alajuelita', 'Vázquez de Coronado', 'Acosta', 'Tibás', 'Moravia', 'Montes de Oca', 'Turrubares', 'Dota', 'Curridabat', 'Pérez Zeledón', 'León Cortés'],
  'Alajuela': ['Alajuela', 'San Ramón', 'Grecia', 'San Mateo', 'Atenas', 'Naranjo', 'Palmares', 'Poás', 'Orotina', 'San Carlos', 'Zarcero', 'Sarchí', 'Upala', 'Los Chiles', 'Guatuso', 'Río Cuarto'],
  'Cartago': ['Cartago', 'Paraíso', 'La Unión', 'Jiménez', 'Turrialba', 'Alvarado', 'Oreamuno', 'El Guarco'],
  'Heredia': ['Heredia', 'Barva', 'Santo Domingo', 'Santa Bárbara', 'San Rafael', 'San Isidro', 'Belén', 'Flores', 'San Pablo', 'Sarapiquí'],
  'Guanacaste': ['Liberia', 'Nicoya', 'Santa Cruz', 'Bagaces', 'Carrillo', 'Cañas', 'Abangares', 'Tilarán', 'Nandayure', 'La Cruz', 'Hojancha'],
  'Puntarenas': ['Puntarenas', 'Esparza', 'Buenos Aires', 'Montes de Oro', 'Osa', 'Quepos', 'Golfito', 'Coto Brus', 'Parrita', 'Corredores', 'Garabito', 'Monteverde', 'Puerto Jiménez'],
  'Limón': ['Limón', 'Pococí', 'Siquirres', 'Talamanca', 'Matina', 'Guácimo']
};


/* ===== Elementos ===== */
const formulario = document.getElementById('form-checkout');
const selectProvincia = document.getElementById('provincia');
const selectCanton = document.getElementById('canton');
const casillaRecordar = document.getElementById('recordar');


/* ===== 1. Piezas del carrito ===== */
const piezas = obtenerCarrito()
  .map(id => catalogo.find(pieza => pieza.id === id))
  .filter(pieza => pieza);

// Si el carrito está vacío, no hay nada que pagar: vuelve al carrito
if (piezas.length === 0) {
  location.href = 'carrito.html';
}

const subtotal = piezas.reduce((suma, pieza) => suma + pieza.precio, 0);


/* ===== 2. Resumen del pedido ===== */
document.getElementById('mini-lista').innerHTML = piezas.map(pieza => {
  const foto = pieza.imagen
    ? `<img src="${pieza.imagen}" alt="">`
    : `<div class="cb-foto-placeholder">Foto</div>`;
  return `
    <li class="cb-mini-item">
      <div class="cb-mini-foto">${foto}</div>
      <span>${pieza.nombre}</span>
      <span class="cb-mini-precio">${formatoPrecio(pieza.precio)}</span>
    </li>`;
}).join('');

// Zona de envío elegida: "gam" o "fuera-gam"
function zonaElegida() {
  return formulario.querySelector('input[name="zona"]:checked').value;
}

function actualizarTotales() {
  const zona = zonaElegida();
  const envio = COSTO_ENVIO[zona];
  const total = subtotal + envio;

  document.getElementById('checkout-subtotal').textContent = formatoPrecio(subtotal);
  document.getElementById('checkout-envio-etiqueta').textContent = `Envío (${NOMBRE_ZONA[zona]})`;
  document.getElementById('checkout-envio').textContent = formatoPrecio(envio);
  document.getElementById('checkout-total').textContent = formatoPrecio(total);
  document.getElementById('ver-resumen-total').textContent = formatoPrecio(total);
}

// Precios en las opciones de envío
document.getElementById('precio-gam').textContent = formatoPrecio(COSTO_ENVIO['gam']);
document.getElementById('precio-fuera-gam').textContent = formatoPrecio(COSTO_ENVIO['fuera-gam']);

formulario.querySelectorAll('input[name="zona"]').forEach(opcion => {
  opcion.addEventListener('change', actualizarTotales);
});

actualizarTotales();


/* ===== 3. Provincia → Cantón ===== */
selectProvincia.innerHTML += Object.keys(cantonesPorProvincia)
  .map(provincia => `<option>${provincia}</option>`).join('');

function llenarCantones() {
  const cantones = cantonesPorProvincia[selectProvincia.value] || [];
  selectCanton.innerHTML = '<option value="">Seleccionar</option>' +
    cantones.map(canton => `<option>${canton}</option>`).join('');
  selectCanton.disabled = cantones.length === 0;
}

selectProvincia.addEventListener('change', llenarCantones);


/* ===== 4. Recordar mis datos ===== */
const camposRecordables = ['nombre', 'telefono', 'correo', 'provincia', 'canton', 'distrito', 'direccion'];

function cargarDatosGuardados() {
  let datos;
  try { datos = JSON.parse(localStorage.getItem('datosCliente')); } catch { datos = null; }
  if (!datos) return;

  camposRecordables.forEach(campo => {
    if (campo === 'canton') return;                   // el cantón va después de la provincia
    if (datos[campo]) document.getElementById(campo).value = datos[campo];
  });
  llenarCantones();
  if (datos.canton) selectCanton.value = datos.canton;
}

cargarDatosGuardados();


/* ===== 5. Validación ===== */

// Teléfono: deja solo números y pone el guion: 88888888 → 8888-8888
const campoTelefono = document.getElementById('telefono');
campoTelefono.addEventListener('input', () => {
  const numeros = campoTelefono.value.replace(/\D/g, '').slice(0, 8);
  campoTelefono.value = numeros.length > 4 ? numeros.slice(0, 4) + '-' + numeros.slice(4) : numeros;
});

function campoValido(campo) {
  if (campo.id === 'telefono') {
    return campo.value.replace(/\D/g, '').length === 8;
  }
  return campo.checkValidity();
}

function marcarCampo(campo) {
  const valido = campoValido(campo);
  campo.closest('.cb-campo').classList.toggle('con-error', !valido);
  return valido;
}

// Al salir de un campo con error, se revisa otra vez para quitar el mensaje
formulario.querySelectorAll('.cb-campo input, .cb-campo select, .cb-campo textarea').forEach(campo => {
  campo.addEventListener('blur', () => {
    if (campo.closest('.cb-campo').classList.contains('con-error')) marcarCampo(campo);
  });
});


/* ===== 6. Confirmar pedido ===== */
function generarCodigo() {
  const numero = Math.floor(Math.random() * 10000);    // 0 a 9999
  return 'CB-' + String(numero).padStart(4, '0');       // 42 → "CB-0042"
}

formulario.addEventListener('submit', evento => {
  evento.preventDefault();                              // que no recargue la página

  // Revisar todos los campos y marcar los que tengan error
  const campos = [...formulario.querySelectorAll('.cb-campo input, .cb-campo select, .cb-campo textarea')];
  const resultados = campos.map(marcarCampo);
  if (resultados.includes(false)) {
    formulario.querySelector('.con-error input, .con-error select, .con-error textarea').focus();
    return;
  }

  // Datos del cliente
  const cliente = {};
  camposRecordables.forEach(campo => {
    cliente[campo] = document.getElementById(campo).value.trim();
  });

  // Recordar mis datos
  if (casillaRecordar.checked) {
    localStorage.setItem('datosCliente', JSON.stringify(cliente));
  } else {
    localStorage.removeItem('datosCliente');
  }

  // El pedido completo
  const zona = zonaElegida();
  const pedido = {
    codigo: generarCodigo(),
    fecha: new Date().toISOString(),
    piezas: piezas.map(p => ({ id: p.id, nombre: p.nombre, precio: p.precio, imagen: p.imagen })),
    subtotal: subtotal,
    zona: NOMBRE_ZONA[zona],
    envio: COSTO_ENVIO[zona],
    total: subtotal + COSTO_ENVIO[zona],
    cliente: cliente
  };

  // Guardar el pedido para la página de confirmación y vaciar el carrito
  localStorage.setItem('ultimoPedido', JSON.stringify(pedido));
  guardarCarrito([]);

  location.href = 'confirmacion.html';
});


/* ===== 7. "Ver resumen" en celular ===== */
const botonVerResumen = document.getElementById('boton-ver-resumen');
const resumenPedido = document.getElementById('resumen-pedido');

botonVerResumen.addEventListener('click', () => {
  const abierto = resumenPedido.classList.toggle('abierto');
  botonVerResumen.setAttribute('aria-expanded', abierto);
});
