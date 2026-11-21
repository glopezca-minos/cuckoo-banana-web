
/* ==========================================
   CUCKOO BANANA — TALLERES
   WhatsApp + galería interactiva
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ======================================
     CONSULTAS POR WHATSAPP
     ====================================== */

  const enlaces = document.querySelectorAll(
    "[data-taller-fecha]"
  );

  const numero = "50671291718";

  enlaces.forEach((enlace) => {

    const fecha = enlace.dataset.tallerFecha;

    const mensaje = [
      "Hola, Cuckoo Banana.",
      `Quisiera consultar si hay disponibilidad para el taller de vitral del ${fecha}.`,
      "¿Me podrían confirmar el horario, el precio y los cupos?",
      "¡Muchas gracias!"
    ].join("\n");

    enlace.href =
      `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  });


  /* ======================================
     GALERÍA DE FOTOGRAFÍAS
     ====================================== */

  const botonesFotos = document.querySelectorAll(
    ".cb-talleres-foto-boton"
  );

  const lightbox = document.getElementById(
    "cb-talleres-lightbox"
  );

  const imagenGrande = document.getElementById(
    "cb-talleres-lightbox-imagen"
  );

  const botonCerrar = document.querySelector(
    ".cb-talleres-lightbox-cerrar"
  );

  // Recordamos cuál foto abrió el visor.
  let ultimoBoton = null;

  if (
    lightbox &&
    imagenGrande &&
    botonCerrar
  ) {

    /* ABRIR FOTOGRAFÍA */

    botonesFotos.forEach((boton) => {

      boton.addEventListener("click", () => {

        const imagenOriginal = boton.querySelector("img");

        if (!imagenOriginal) {
          return;
        }

        ultimoBoton = boton;

        // Usamos la misma imagen original,
        // sin recortarla en el visor.

        imagenGrande.src = imagenOriginal.src;
        imagenGrande.alt = imagenOriginal.alt;

        lightbox.showModal();

        // El usuario puede cerrar desde
        // el botón visible.

        botonCerrar.focus();

      });

    });


    /* CERRAR CON LA X */

    botonCerrar.addEventListener("click", () => {
      lightbox.close();
    });


    /* CERRAR AL HACER CLIC FUERA DE LA FOTO */

    lightbox.addEventListener("click", (evento) => {

      if (evento.target === lightbox) {
        lightbox.close();
      }

    });


    /* RESTAURAR EL FOCO AL CERRAR */

    lightbox.addEventListener("close", () => {

      if (ultimoBoton) {
        ultimoBoton.focus();
      }

    });

    // La tecla Escape también cierra
    // automáticamente los dialog nativos.

  }

});
