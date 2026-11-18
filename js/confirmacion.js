/* =====================================================
   Confirmación de pedido
   ===================================================== */

/* ===== Configuración ===== */
const NUMERO_SINPE = '71291718';
const NUMERO_WHATSAPP = '50671291718';


/* ===== 1. Leer el pedido ===== */
let pedido;
try {
  pedido = JSON.parse(localStorage.getItem('ultimoPedido'));
} catch {
  pedido = null;
}

// Si alguien entra a esta página sin haber hecho un pedido, lo mandamos a la tienda.
// Si sí hay pedido, lo mostramos.
if (!pedido) {
  location.href = 'tienda.html';
} else {
  mostrarConfirmacion(pedido);
}

/* =====================================================
   Todo lo que se muestra en la página
   ===================================================== */
function mostrarConfirmacion(pedido) {

  /* ===== 2. Código, pasos y total ===== */
  document.getElementById('codigo-pedido').textContent = pedido.codigo;
  document.getElementById('paso-codigo').textContent = pedido.codigo;
  document.getElementById('paso-total').textContent = formatoPrecio(pedido.total);
  document.getElementById('numero-sinpe').textContent = NUMERO_SINPE;


  /* ===== 3. Resumen ===== */
  document.getElementById('mini-lista').innerHTML = pedido.piezas.map(pieza => {
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

  document.getElementById('conf-subtotal').textContent = formatoPrecio(pedido.subtotal);
  document.getElementById('conf-envio-etiqueta').textContent = `Envío (${pedido.zona})`;
  document.getElementById('conf-envio').textContent = formatoPrecio(pedido.envio);
  document.getElementById('conf-total').textContent = formatoPrecio(pedido.total);
  document.getElementById('envio-a').textContent =
    `Envío a: ${pedido.cliente.canton}, ${pedido.cliente.provincia} · Correos de Costa Rica`;


  /* ===== 4. Botón Copiar ===== */
  const botonCopiar = document.getElementById('boton-copiar');
  const textoBotonCopiar = botonCopiar.querySelector('span');

  botonCopiar.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pedido.codigo);
      textoBotonCopiar.textContent = '¡Copiado!';
    } catch {
      textoBotonCopiar.textContent = 'No se pudo copiar';
    }
    // Después de 2 segundos vuelve a decir "Copiar"
    setTimeout(() => { textoBotonCopiar.textContent = 'Copiar'; }, 2000);
  });


  /* ===== 5. Mensaje de WhatsApp con todo el pedido ===== */
  const c = pedido.cliente;

  const lineas = [
    '¡Hola! Acabo de hacer un pedido en el sitio web de Cuckoo Banana.',
    '',
    `Código: ${pedido.codigo}`,
    '',
    'Piezas:',
    ...pedido.piezas.map(p => `- ${p.nombre} (${formatoPrecio(p.precio)})`),
    '',
    `Envío (${pedido.zona}): ${formatoPrecio(pedido.envio)}`,
    `Total: ${formatoPrecio(pedido.total)}`,
    '',
    `Nombre: ${c.nombre}`,
    `Teléfono: ${c.telefono}`,
    `Dirección: ${c.distrito}, ${c.canton}, ${c.provincia}. ${c.direccion}`,
    '',
    'Adjunto el comprobante del SINPE.'
  ];

  document.getElementById('boton-whatsapp').href =
    `https://wa.me/${NUMERO_WHATSAPP}?text=` + encodeURIComponent(lineas.join('\n'));

}
