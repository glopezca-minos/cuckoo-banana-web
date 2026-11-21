
document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("form-personalizados");

  if (formulario) {
    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();

      if (!formulario.reportValidity()) return;

      const categoria = document.getElementById("pers-categoria").value;
      const colores = document.getElementById("pers-colores").value.trim();
      const medidas = document.getElementById("pers-medidas").value.trim();
      const fecha = document.getElementById("pers-fecha").value;
      const ocasion = document.getElementById("pers-ocasion").value;
      const comentarios = document.getElementById("pers-comentarios").value.trim();

      let fechaFormateada = "No especificada";

      if (fecha) {
        const [anio, mes, dia] = fecha.split("-");
        fechaFormateada = `${dia}/${mes}/${anio}`;
      }

      const mensaje = [
        "Hola, Cuckoo Banana.",
        "Quisiera solicitar una cotización para un vitral personalizado.",
        "",
        "Categoría: " + categoria,
        "Colores: " + (colores || "Por definir"),
        "Medidas aproximadas: " + (medidas || "Por definir"),
        "Fecha deseada: " + fechaFormateada,
        "Ocasión: " + (ocasion || "No especificada"),
        "Comentarios: " + (comentarios || "Sin comentarios adicionales")
      ].join("\n");

      const numero = "50671291718";

      const url =
        "https://wa.me/" +
        numero +
        "?text=" +
        encodeURIComponent(mensaje);

      window.location.href = url;
    });
  }

  const fotos = document.querySelectorAll(".cb-pers-ejemplo");
  const visor = document.getElementById("cb-pers-lightbox");
  const imagenGrande = document.getElementById("cb-pers-lightbox-imagen");
  const cerrar = document.querySelector(".cb-pers-lightbox-cerrar");

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
