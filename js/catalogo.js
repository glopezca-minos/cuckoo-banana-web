/* =====================================================
   Catálogo
   Tienda, el Inicio, Ficha de producto. 
   estado: "disponible" | "lista-espera" | "reservada" | "vendida"
   ===================================================== */

let catalogo = [
  {
    id: "colibri",
    nombre: "Vitral colibrí",
    categoria: "aves",
    precio: 18000,
    estado: "disponible",
    medidas: "Por confirmar",
    descripcion: "Colibrí en vidrio de colores, elaborado a mano en el taller de Heredia.",
    imagen: "img/vitral-colibri-verde.jpeg",
    alt: "Vitral artesanal de colibrí verde a contraluz"
  },
  {
    id: "tucan",
    nombre: "Vitral tucán",
    categoria: "aves",
    precio: 22500,
    estado: "lista-espera",
    medidas: "Por confirmar",
    descripcion: "Tucán elaborado a mano con diferentes colores y texturas de vidrio.",
    imagen: "img/vitral-tucan.jpeg",
    alt: "Vitral artesanal de tucán"
  },
  {
    id: "lapa",
    nombre: "Vitral lapa",
    categoria: "aves",
    precio: 22500,
    estado: "disponible",
    medidas: "Por confirmar",
    descripcion: "Lapa en vidrio de colores, elaborada a mano en el taller de Heredia.",
    imagen: "img/vitral-lapa.jpg",
    alt: "Vitral artesanal de lapa"
  },
  {
    id: "buho",
    nombre: "Vitral búho",
    categoria: "aves",
    precio: 28000,
    estado: "disponible",
    medidas: "Por confirmar",
    descripcion: "Búho de vidrio de colores, elaborado a mano. Cada pieza es única.",
    imagen: "img/vitral-buho.jpeg",
    alt: "Vitral artesanal de búho"
  },
  {
    id: "orquidea",
    nombre: "Orquídea",
    categoria: "flores",
    precio: 15000,
    estado: "disponible",
    medidas: "Por confirmar",
    descripcion: "Pieza floral de vidrio de colores, hecha a mano en Heredia.",
    imagen: "img/vitral-orquidea.jpeg",
    alt: "Vitral artesanal de flor"
  },

  /* ===== Piezas de prueba (sin foto todavía) ===== */
  {
    id: "mariposa",
    nombre: "Mariposa morpho",
    categoria: "insectos",
    precio: 28000,
    estado: "reservada",
    medidas: "Por confirmar",
    descripcion: "Vidrio de colores hecho a mano. Cada pieza es única.",
    imagen: "",
    alt: ""
  },
  {
    id: "banano",
    nombre: "Racimo de banano",
    categoria: "frutas",
    precio: 15000,
    estado: "vendida",
    medidas: "Por confirmar",
    descripcion: "Vidrio de colores hecho a mano. Cada pieza es única.",
    imagen: "",
    alt: ""
  },
  {
    id: "corazon-rojo",
    nombre: "Corazón rojo",
    categoria: "corazon",
    precio: 12000,
    estado: "disponible",
    medidas: "Por confirmar",
    descripcion: "Vidrio de colores hecho a mano. Cada pieza es única.",
    imagen: "",
    alt: ""
  },
  {
    id: "gatito",
    nombre: "Gatito",
    categoria: "mascotas",
    precio: 20000,
    estado: "lista-espera",
    medidas: "Por confirmar",
    descripcion: "Vidrio de colores hecho a mano. Cada pieza es única.",
    imagen: "",
    alt: ""
  },
  {
    id: "estrella",
    nombre: "Estrella navideña",
    categoria: "navidenos",
    precio: 10000,
    estado: "disponible",
    medidas: "Por confirmar",
    descripcion: "Vidrio de colores hecho a mano. Cada pieza es única.",
    imagen: "",
    alt: ""
  }
];

// Nombre que se muestra de cada categoría
const nombresCategoria = {
  'insectos': 'Insectos',
  'aves': 'Aves',
  'mascotas': 'Mascotas',
  'corazon': 'Corazón',
  'flores': 'Flores',
  'frutas': 'Frutas',
  'bohemios': 'Bohemios',
  'navidenos': 'Navideños',
  'pinturas-en-madera': 'Pinturas en madera'
};

// 18000 → "₡18.000"
function formatoPrecio(numero) {
  return '₡' + numero.toLocaleString('de-DE');
}

/* =====================================================
   Google Sheets: catalogo viene de la hoja que maneja Amanda.
   ===================================================== */
const URL_CATALOGO = 'https://script.google.com/macros/s/AKfycbzTnVdlsNQp9mJMLtHgtMo5Ly51ui7aP5VGfX1gQbdpIXm691u7M4HysLEwLP1pzSuAIQ/exec';

// 1. Si ya hay una copia guardada de la hoja, usarla de una vez
try {
  const copiaGuardada = localStorage.getItem('catalogoHoja');
  if (copiaGuardada) catalogo = JSON.parse(copiaGuardada);
} catch (error) {
}

// 2. Ordenar los datos que vienen de la hoja

// Decide el estado según stock, reservada y se_repite
function calcularEstado(fila) {
  const stock = Number(fila.stock) || 0;
  const reservada = ['si', 'sí'].includes(String(fila.reservada).trim().toLowerCase());
  const noSeRepite = String(fila.se_repite).trim().toLowerCase() === 'no';

  if (reservada) return 'reservada';
  if (stock > 0) return 'disponible';
  if (noSeRepite) return 'vendida';
  return 'lista-espera';
}

function limpiarPieza(fila) {
  return {
    id: String(fila.id).trim(),
    nombre: fila.nombre,
    categoria: String(fila.categoria).trim().toLowerCase(),
    precio: Number(fila.precio),
    estado: calcularEstado(fila),
    stock: Number(fila.stock) || 0,
    medidas: fila.medidas,
    descripcion: fila.descripcion,
    imagen: fila.imagen,
    alt: fila.alt
  };
}

// 3. Pedir la versión más nueva a la hoja y guardarla
function cargarCatalogo() {
  return fetch(URL_CATALOGO)
    .then(respuesta => respuesta.json())
    .then(datos => {
      catalogo = datos.map(limpiarPieza);
      localStorage.setItem('catalogoHoja', JSON.stringify(catalogo));
    })
    .catch(() => {
      console.warn('No se pudo leer la hoja; se usa el catálogo guardado.');
    });
}