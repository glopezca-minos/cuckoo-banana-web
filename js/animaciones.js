/* =====================================================
   Animaciones con GSAP
   1. Hero de Inicio
   2. Tarjetas
   ===================================================== */

const hayGSAP = typeof gsap !== 'undefined';
const sinMovimientoGSAP = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (hayGSAP) {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

// Todo lo que aparece al bajar, en cualquier página del sitio
const ELEMENTOS_QUE_APARECEN = [
  '.cb-tarjeta',
  '.cb-home-option-card',
  '.cb-ayuda-tarjeta',
  '.cb-pregunta',
  '.cb-pers-ejemplo',
  '.cb-talleres-tarjeta',
  '.cb-talleres-galeria-foto',
  '.cb-sobre-historia-card',
  '.cb-sobre-persona',
  '.cb-sobre-proceso-item'
].join(', ');


/* ===== 2. Tarjetas que aparecen al bajar ===== */
function animarTarjetas() {
  if (!hayGSAP || sinMovimientoGSAP) return;

  // Solo las que todavía no se han animado
  const nuevas = [...document.querySelectorAll(ELEMENTOS_QUE_APARECEN)]
    .filter(elemento => !elemento.dataset.animado);

  if (nuevas.length === 0) return;
  nuevas.forEach(elemento => { elemento.dataset.animado = 'si'; });

  // Empiezan invisibles y un poco más abajo…
  gsap.set(nuevas, { autoAlpha: 0, y: 32 });

  ScrollTrigger.batch(nuevas, {
    start: 'top 92%',
    once: true,
    onEnter: (grupo) => gsap.to(grupo, {
      autoAlpha: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.1,
      overwrite: true
    })
  });
}


/* ===== 1. Hero de Inicio ===== */
function animarHero() {
  const texto = document.querySelector('.cb-hero-texto');
  const titulo = document.querySelector('.cb-hero-titulo');
  if (!hayGSAP || sinMovimientoGSAP || !texto || !titulo) return;

  gsap.set(texto, { autoAlpha: 0 });

  const empezar = () => {

    const partes = SplitText.create(titulo, { type: 'words', mask: 'words' });

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .set(texto, { autoAlpha: 1 })
      .from('.cb-hero-eyebrow', { autoAlpha: 0, y: 12, duration: 0.5 })
      .from(partes.words, { yPercent: 110, duration: 0.8, stagger: 0.06 }, '-=0.2')
      .from('.cb-hero-descripcion', { autoAlpha: 0, y: 16, duration: 0.6 }, '-=0.4')
      .from('.cb-hero-botones > *', { autoAlpha: 0, y: 16, duration: 0.5, stagger: 0.1 }, '-=0.3');
  };

  // Espera las fuentes, pero máximo 1 segundo
  Promise.race([
    document.fonts.ready,
    new Promise(resolver => setTimeout(resolver, 1000))
  ]).then(empezar);
}


/* ===== 3. Parallax: la foto se mueve más lento que la página ===== */
function animarParallax() {
  if (!hayGSAP || sinMovimientoGSAP) return;

  document.querySelectorAll('[data-parallax]').forEach(foto => {
    gsap.set(foto, { scale: 1.18 });   // más grande que su marco, para tener espacio al moverse
    gsap.fromTo(foto,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: foto.parentElement,
          start: 'top bottom',   // empieza cuando el marco asoma abajo
          end: 'bottom top',     // termina cuando sale por arriba
          scrub: true            // va pegado al scroll
        }
      }
    );
  });
}


/* ===== 4. Sobre nosotras: la línea del proceso se dibuja al bajar ===== */
function animarProceso() {
  const grid = document.querySelector('.cb-sobre-proceso-grid');
  if (!hayGSAP || sinMovimientoGSAP || !grid) return;

  const linea = grid.querySelector('.cb-sobre-proceso-linea span');
  const pasos = [...grid.querySelectorAll('.cb-sobre-paso')];

  // Cada número se enciende cuando la línea llega a su posición (0, 1/3, 2/3 y 1)
  const encender = (progreso) => {
    pasos.forEach((paso, i) => {
      const posicion = i / (pasos.length - 1);
      paso.classList.toggle('cb-activo', progreso >= posicion - 0.02);
    });
  };

  gsap.to(linea, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: grid,
      start: 'top 75%',
      end: 'bottom 70%',
      scrub: 0.6,
      onUpdate: (st) => encender(st.progress)
    }
  });
}


/* ===== 5. Carrete: al pasar el mouse, las fotos de la tarjeta se turnan ===== */
const TIEMPO_POR_FOTO = 1100;   // milisegundos

function activarCarretes() {
  document.querySelectorAll('.cb-tarjeta').forEach(tarjeta => {
    if (tarjeta.dataset.carrete) return;          // ya está activado
    tarjeta.dataset.carrete = 'si';

    let reloj = null;
    let actual = 0;

    const fotos = () => [...tarjeta.querySelectorAll('.cb-carrete-foto')];
    const puntos = () => [...tarjeta.querySelectorAll('.cb-carrete-puntos span')];

    const mostrar = (indice) => {
      actual = indice;
      fotos().forEach((foto, i) => foto.classList.toggle('activa', i === indice));
      puntos().forEach((punto, i) => punto.classList.toggle('activa', i === indice));
    };

    tarjeta.addEventListener('mouseenter', () => {
      if (fotos().length < 2 || sinMovimientoGSAP) return;
      mostrar((actual + 1) % fotos().length);      // cambia de una vez, sin esperar
      reloj = setInterval(() => mostrar((actual + 1) % fotos().length), TIEMPO_POR_FOTO);
    });

    tarjeta.addEventListener('mouseleave', () => {
      clearInterval(reloj);
      if (fotos().length > 1) mostrar(0);          // vuelve a la foto principal
    });
  });
}


animarHero();
animarTarjetas();
activarCarretes();
animarParallax();
animarProceso();
