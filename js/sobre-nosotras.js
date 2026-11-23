
document.addEventListener("DOMContentLoaded", () => {
  const fotos = document.querySelectorAll(".cb-sobre-foto-boton");
  const visor = document.getElementById("cb-sobre-lightbox");
  const imagenGrande = document.getElementById("cb-sobre-lightbox-imagen");
  const cerrar = document.querySelector(".cb-sobre-lightbox-cerrar");

  if (!visor || !imagenGrande || !cerrar) {
    return;
  }

  let fotoAnterior = null;

  fotos.forEach((boton) => {
    boton.addEventListener("click", () => {
      const imagen = boton.querySelector("img");

      if (!imagen) {
        return;
      }

      fotoAnterior = boton;

      imagenGrande.src = imagen.currentSrc || imagen.src;
      imagenGrande.alt = imagen.alt;

      if (!visor.open) {
        visor.showModal();
      }

      cerrar.focus();
    });
  });

  cerrar.addEventListener("click", () => {
    visor.close();
  });

  visor.addEventListener("click", (evento) => {
    if (evento.target === visor) {
      visor.close();
    }
  });

  visor.addEventListener("close", () => {
    imagenGrande.removeAttribute("src");

    if (fotoAnterior) {
      fotoAnterior.focus();
    }
  });
});

/* =====================================================
   ASÍ NACE CADA PIEZA (GSAP)
   ===================================================== */
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  const animaciones = gsap.matchMedia();

  /* ----- 5. Proceso en ESCRITORIO: se queda fijo y los pasos pasan de lado ----- */
  animaciones.add('(min-width: 801px) and (prefers-reduced-motion: no-preference)', () => {
    const seccion = document.querySelector('.cb-sn-proceso');
    const pista = document.querySelector('.cb-sn-proceso-pista');
    const recorrido = () => pista.scrollWidth - window.innerWidth;

    gsap.timeline({
      scrollTrigger: {
        trigger: seccion,
        start: 'top top',
        end: () => '+=' + recorrido(),
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true
      }
    })
      .to(pista, { x: () => -recorrido(), ease: 'none' }, 0)
      .to('.cb-sn-proceso-barra span', { scaleX: 1, ease: 'none' }, 0);
  });


  /* ----- 5. Proceso en CELULAR: cada paso sube al aparecer ----- */
  animaciones.add('(max-width: 800px) and (prefers-reduced-motion: no-preference)', () => {
    document.querySelectorAll('.cb-sn-paso').forEach(paso => {
      gsap.from(paso, {
        y: 60,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: paso, start: 'top 85%' }
      });
    });
  });

  // Cuando cargan todas las fotos, se recalculan las posiciones
  window.addEventListener('load', () => ScrollTrigger.refresh());
}


/* El botón de WhatsApp se vuelve claro mientras está encima de la sección arcilla */
function revisarBotonWhatsapp() {
  const boton = document.querySelector('.cb-whatsapp');
  const seccion = document.querySelector('.cb-sn-proceso');
  if (!boton || !seccion) return;

  const b = boton.getBoundingClientRect();
  const s = seccion.getBoundingClientRect();
  const centroBoton = b.top + b.height / 2;

  boton.classList.toggle('cb-whatsapp-claro', centroBoton > s.top && centroBoton < s.bottom);
}

window.addEventListener('scroll', revisarBotonWhatsapp, { passive: true });
window.addEventListener('resize', revisarBotonWhatsapp);
revisarBotonWhatsapp();
