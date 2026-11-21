
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
