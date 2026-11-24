/* =====================================================
   404: el vitral se quiebra y los pedacitos caen
   1. Se dibuja un vitral que tapa la página
   2. Recibe un golpe: aparecen las grietas
   3. Los pedacitos caen y se amontonan abajo
   ===================================================== */

const escena = document.querySelector('.cb-404');
const svg = document.querySelector('.cb-404-vidrio');
const NS = 'http://www.w3.org/2000/svg';
const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Colores de vidrio: los de la marca + tonos "joya" típicos de los vitrales
// Paleta de la marca, translúcida
const COLORES = ['#F27242', '#F3D5B8', '#D2774A', '#EAE4D2', '#99522F',
                 '#F3D5B8', '#D2774A', '#F27242', '#EAE4D2', '#99522F'];

// Aclara (+) u oscurece (-) un color hex
function tono(hex, cantidad) {
  const n = parseInt(hex.slice(1), 16);
  const canal = (v) => Math.round(cantidad > 0 ? v + (255 - v) * cantidad : v * (1 + cantidad));
  const r = canal(n >> 16), g = canal((n >> 8) & 255), b = canal(n & 255);
  return `rgb(${r}, ${g}, ${b})`;
}

// Un degradado por color: luz en una esquina, un reflejo en diagonal y sombra al otro lado
function crearDegradados() {
  const defs = document.createElementNS(NS, 'defs');
  COLORES.forEach((color, i) => {
    const degradado = document.createElementNS(NS, 'linearGradient');
    degradado.setAttribute('id', `cb-vidrio-${i}`);
    degradado.setAttribute('x1', '0');
    degradado.setAttribute('y1', '0');
    degradado.setAttribute('x2', '1');
    degradado.setAttribute('y2', '1');
    [
      [0, tono(color, 0.45)],
      [0.35, color],
      [0.44, tono(color, 0.35)],   // reflejo
      [0.5, color],
      [1, tono(color, -0.3)]
    ].forEach(([offset, valor]) => {
      const parada = document.createElementNS(NS, 'stop');
      parada.setAttribute('offset', offset);
      parada.setAttribute('stop-color', valor);
      degradado.appendChild(parada);
    });
    defs.appendChild(degradado);
  });
  svg.appendChild(defs);
}

// Número "al azar" pero siempre igual (así el dibujo no cambia cada vez)
let semilla = 7;
function azar() {
  semilla = (semilla * 9301 + 49297) % 233280;
  return semilla / 233280;
}

// Recorta un polígono para que no se salga del rectángulo
function recortar(puntos, ancho, alto) {
  const bordes = [
    p => p.x >= 0, p => p.x <= ancho, p => p.y >= 0, p => p.y <= alto
  ];
  const cruce = [
    (a, b) => ({ x: 0, y: a.y + (b.y - a.y) * (0 - a.x) / (b.x - a.x) }),
    (a, b) => ({ x: ancho, y: a.y + (b.y - a.y) * (ancho - a.x) / (b.x - a.x) }),
    (a, b) => ({ x: a.x + (b.x - a.x) * (0 - a.y) / (b.y - a.y), y: 0 }),
    (a, b) => ({ x: a.x + (b.x - a.x) * (alto - a.y) / (b.y - a.y), y: alto })
  ];
  let salida = puntos;
  bordes.forEach((adentro, i) => {
    const entrada = salida;
    salida = [];
    entrada.forEach((actual, j) => {
      const anterior = entrada[(j + entrada.length - 1) % entrada.length];
      if (adentro(actual)) {
        if (!adentro(anterior)) salida.push(cruce[i](anterior, actual));
        salida.push(actual);
      } else if (adentro(anterior)) {
        salida.push(cruce[i](anterior, actual));
      }
    });
  });
  return salida;
}

// Parte el rectángulo en pedazos, como vidrio golpeado en un punto
function crearPedazos(ancho, alto, golpe) {
  const rayos = 18;
  const maximo = Math.hypot(ancho, alto);
  const angulos = [];
  for (let i = 0; i < rayos; i++) {
    angulos.push((i + azar() * 0.6) / rayos * Math.PI * 2);
  }
  const anillos = [0, 45, 105, 180, 270, 380, 510, 670, maximo];

  // Cada anillo tiene un radio un poco distinto en cada rayo (pero compartido
  // entre pedazos vecinos, para que no queden huecos)
  const radios = anillos.map(r => angulos.map(() => r * (0.85 + azar() * 0.3)));

  const punto = (n, a) => ({
    x: golpe.x + Math.cos(angulos[a % rayos]) * radios[n][a % rayos],
    y: golpe.y + Math.sin(angulos[a % rayos]) * radios[n][a % rayos]
  });

  const pedazos = [];
  for (let n = 0; n < anillos.length - 1; n++) {
    for (let a = 0; a < rayos; a++) {
      const forma = n === 0
        ? [golpe, punto(1, a), punto(1, a + 1)]
        : [punto(n, a), punto(n + 1, a), punto(n + 1, a + 1), punto(n, a + 1)];
      const recortado = recortar(forma, ancho, alto);
      if (recortado.length >= 3) pedazos.push({ puntos: recortado, anillo: n });
    }
  }
  return pedazos;
}

function centro(puntos) {
  const x = puntos.reduce((s, p) => s + p.x, 0) / puntos.length;
  const y = puntos.reduce((s, p) => s + p.y, 0) / puntos.length;
  return { x, y };
}

function dibujar(animar) {
  semilla = 7;
  svg.innerHTML = '';
  const ancho = escena.clientWidth;
  const alto = escena.clientHeight;
  svg.setAttribute('viewBox', `0 0 ${ancho} ${alto}`);
  crearDegradados();

  const golpe = { x: ancho * 0.58, y: alto * 0.38 };
  const pedazos = crearPedazos(ancho, alto, golpe);

  // Montón de abajo: columnas que se van llenando
  const columnas = 40;
  const altura = new Array(columnas).fill(0);
  const piso = alto - 8;
  const tamanoMax = ancho < 700 ? 34 : 56;   // tamaño de cada pedazo en el montón
  const alturaMax = ancho < 700 ? 50 : 80;   // qué tan alto puede crecer el montón

  // Caen primero los pedazos cerca del golpe
  pedazos.sort((a, b) => a.anillo - b.anillo || azar() - 0.5);

  pedazos.forEach((pedazo, i) => {
    const c = centro(pedazo.puntos);
    const forma = document.createElementNS(NS, 'polygon');
    forma.setAttribute('points', pedazo.puntos.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '));
    forma.setAttribute('class', 'cb-404-pieza');
    forma.setAttribute('fill', `url(#cb-vidrio-${(i * 7) % COLORES.length})`);
    forma.style.transformBox = 'fill-box';
    forma.style.transformOrigin = 'center';
    svg.appendChild(forma);

    // Dónde termina: en el montón, cerca de donde estaba
    const caja = forma.getBBox();
    const escala = Math.min(0.45, tamanoMax / Math.max(caja.width, caja.height));
    // Cae más o menos debajo de donde estaba; si ahí ya hay mucho, rueda a la columna más baja
    let col = Math.floor((c.x / ancho * 0.6 + azar() * 0.4) * columnas);
    col = Math.max(0, Math.min(columnas - 1, col));
    if (altura[col] > alturaMax) col = altura.indexOf(Math.min(...altura));
    const alturaPieza = Math.min(caja.height, caja.width) * escala;
    const finalX = (col + 0.5) / columnas * ancho + (azar() - 0.5) * 20;
    const finalY = piso - altura[col] - alturaPieza / 2;
    altura[col] += alturaPieza * 0.55;
    const giro = (azar() - 0.5) * 300;

    const mover = `translate(${(finalX - c.x).toFixed(1)}px, ${(finalY - c.y).toFixed(1)}px) rotate(${giro.toFixed(0)}deg) scale(${escala})`;

    if (!animar) {
      forma.style.transform = mover;
      return;
    }

    // Caída con "gravedad" (empieza lento y acelera) y un rebotito al final
    forma.animate([
      { transform: 'none', offset: 0 },
      { transform: mover, offset: 0.85, easing: 'ease-out' },
      { transform: mover.replace(/scale\(([\d.]+)\)/, `scale($1) translateY(-14px)`), offset: 0.92, easing: 'ease-in' },
      { transform: mover, offset: 1 }
    ], {
      duration: 1300 + azar() * 500,
      delay: 900 + pedazo.anillo * 110 + azar() * 250,
      easing: 'cubic-bezier(0.55, 0, 0.9, 0.45)',
      fill: 'forwards'
    });
  });

  if (!animar) {
    escena.classList.add('cb-roto');
    return;
  }

  // Grietas: líneas blancas que salen del punto del golpe
  const grietas = document.createElementNS(NS, 'g');
  for (let i = 0; i < 9; i++) {
    const a = azar() * Math.PI * 2;
    const largo = 120 + azar() * 260;
    const linea = document.createElementNS(NS, 'path');
    const medio = { x: golpe.x + Math.cos(a + 0.2) * largo * 0.5, y: golpe.y + Math.sin(a + 0.2) * largo * 0.5 };
    linea.setAttribute('d', `M${golpe.x} ${golpe.y} L${medio.x} ${medio.y} L${golpe.x + Math.cos(a) * largo} ${golpe.y + Math.sin(a) * largo}`);
    linea.setAttribute('class', 'cb-404-grieta');
    grietas.appendChild(linea);
    const total = linea.getTotalLength();
    linea.style.strokeDasharray = total;
    linea.animate(
      [{ strokeDashoffset: total, opacity: 1 }, { strokeDashoffset: 0, opacity: 1, offset: 0.5 }, { strokeDashoffset: 0, opacity: 0 }],
      { duration: 1200, delay: 500, easing: 'ease-out', fill: 'both' }
    );
  }
  svg.appendChild(grietas);

  // El golpe: sacudida, y luego se muestra el contenido
  setTimeout(() => escena.classList.add('cb-golpe'), 500);
  setTimeout(() => escena.classList.add('cb-roto'), 1100);
}

// Arranca al cargar. Si alguien pidió menos movimiento: ya aparece quebrado
dibujar(!sinMovimiento);

// Si cambia el tamaño de la ventana, se redibuja el montón (sin animar)
let espera;
window.addEventListener('resize', () => {
  clearTimeout(espera);
  espera = setTimeout(() => dibujar(false), 200);
});
