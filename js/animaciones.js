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


animarHero();
animarTarjetas();
