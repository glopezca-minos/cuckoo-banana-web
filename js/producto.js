
/* - Ficha de producto Cuckoo Banana - */

(() => {
  "use strict";

  // Los datos vienen de catalogo.js (y de la hoja de google sheets)
  const textoEntrega = {
    "disponible": "Entrega en 2 a 4 días",
    "lista-espera": "Lista de espera estimada de 2 a 5 meses",
    "reservada": "Reservada: esperando confirmación de pago",
    "vendida": "Esta pieza ya no se elabora"
  };

  const productos = {};

  catalogo.forEach((pieza) => {
    productos[pieza.id] = {
      ...pieza,
      estado: pieza.estado === "lista-espera" ? "espera" : pieza.estado,
      entrega: textoEntrega[pieza.estado],
      medidas: pieza.medidas || "Por confirmar",
      categoria: nombresCategoria[pieza.categoria] || pieza.categoria
    };
  });

  // Producto seleccionado en la dirección web

  const parametros = new URLSearchParams(window.location.search);
  const idSolicitado = parametros.get("id") || "colibri";
  const idActual = Object.hasOwn(productos, idSolicitado)
    ? idSolicitado
    : "colibri";

  const producto = productos[idActual];

  const formatoPrecio = (numero) => {
    return "₡" + String(numero).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const obtener = (id) => document.getElementById(id);

  // Información principal

  document.title = producto.nombre + " | Cuckoo Banana";

  obtener("ficha-breadcrumb-nombre").textContent = producto.nombre;
  obtener("ficha-nombre").textContent = producto.nombre;
  obtener("ficha-precio").textContent = formatoPrecio(producto.precio);
  obtener("ficha-entrega").textContent = producto.entrega;
  obtener("ficha-medidas").textContent = producto.medidas;
  obtener("ficha-categoria").textContent = producto.categoria;
  obtener("ficha-descripcion").textContent = producto.descripcion;

  const estado = obtener("ficha-estado");
  const botonCarrito = obtener("ficha-agregar-carrito");
  const botonLista = obtener("ficha-unirme-lista");
  const feedback = obtener("ficha-feedback");

  const estaEnEspera = producto.estado === "espera";

  estado.textContent = estaEnEspera ? "Lista de espera" : "Disponible";
  estado.classList.toggle("espera", estaEnEspera);

  botonCarrito.hidden = estaEnEspera;
  botonLista.hidden = !estaEnEspera;

  
  // Reservada o vendida: no se puede comprar
  if (producto.estado === "reservada" || producto.estado === "vendida") {
    estado.textContent = producto.estado === "reservada" ? "Reservada" : "Vendida";
    botonCarrito.disabled = true;
    botonCarrito.textContent = estado.textContent;
  }

  // WhatsApp personalizado por producto

  const mensajeConsulta =
    "Hola, quisiera consultar sobre " + producto.nombre + ".";

  obtener("ficha-whatsapp").href =
    "https://wa.me/50671291718?text=" +
    encodeURIComponent(mensajeConsulta);


  /* -Galería de fotos - */

  // Por ahora solamente tenemos la foto principal
  // confirmada de cada producto.
  // Las miniaturas restantes son placeholders.

  const galeria = [
    {
      texto: "Foto principal",
      imagen: producto.imagen,
      alt: producto.alt
    },
    {
      texto: "Detalle del vidrio",
      imagen: null
    },
    {
      texto: "Textura",
      imagen: null
    },
    {
      texto: "Con luz natural",
      imagen: null
    }
  ];

  const imagenPrincipal = obtener("ficha-imagen-principal");
  const placeholderPrincipal = obtener("ficha-placeholder-principal");
  const contenedorMiniaturas = obtener("ficha-miniaturas");

  function mostrarImagen(indice) {
    const foto = galeria[indice];

    imagenPrincipal.onload = null;
    imagenPrincipal.onerror = null;

    imagenPrincipal.hidden = true;
    placeholderPrincipal.hidden = false;
    placeholderPrincipal.textContent = foto.texto;

    if (foto.imagen) {
      imagenPrincipal.onload = () => {
        placeholderPrincipal.hidden = true;
        imagenPrincipal.hidden = false;
      };

      imagenPrincipal.onerror = () => {
        imagenPrincipal.hidden = true;
        placeholderPrincipal.hidden = false;
      };

      imagenPrincipal.alt = foto.alt || producto.nombre;
      imagenPrincipal.src = foto.imagen;
    } else {
      imagenPrincipal.removeAttribute("src");
    }

    contenedorMiniaturas
      .querySelectorAll(".cb-ficha-miniatura")
      .forEach((boton, posicion) => {
        const activa = posicion === indice;

        boton.classList.toggle("activa", activa);
        boton.setAttribute("aria-pressed", String(activa));
      });
  }

  galeria.forEach((foto, indice) => {
    const boton = document.createElement("button");

    boton.type = "button";
    boton.className = "cb-ficha-miniatura";
    boton.setAttribute("aria-label", foto.texto);
    boton.setAttribute("aria-pressed", "false");

    const texto = document.createElement("span");
    texto.textContent = foto.texto;
    boton.appendChild(texto);

    if (foto.imagen) {
      const imagen = document.createElement("img");
      imagen.alt = "";
      imagen.loading = "lazy";
      imagen.src = foto.imagen;

      imagen.addEventListener("error", () => {
        imagen.remove();
      });

      boton.appendChild(imagen);
    }

    boton.addEventListener("click", () => {
      mostrarImagen(indice);
    });

    contenedorMiniaturas.appendChild(boton);
  });

  mostrarImagen(0);


  /* - Botón de carrito - */

  function marcarEnCarrito(boton) {
    boton.disabled = true;
    boton.innerHTML = '<i class="bi bi-check2" aria-hidden="true"></i> En el carrito';
  }

  if (producto.estado === "disponible" && estaEnCarrito(idActual)) {
    marcarEnCarrito(botonCarrito);
  }

  botonCarrito.addEventListener("click", () => {
    agregarAlCarrito(idActual);
    marcarEnCarrito(botonCarrito);
  });


  /* - Productos similares - */

  // 4 piezas que se puedan comprar o pedir, sin repetir la actual
  const sugeridos = catalogo
    .filter((pieza) => pieza.id !== idActual)
    .filter((pieza) => pieza.estado === "disponible" || pieza.estado === "lista-espera")
    .slice(0, 4)
    .map((pieza) => pieza.id);

  const grid = obtener("ficha-relacionados-grid");

  sugeridos.forEach((id) => {
    const item = productos[id];
    const espera = item.estado === "espera";

    const tarjeta = document.createElement("article");
    tarjeta.className = "cb-ficha-relacionado";

    tarjeta.innerHTML = `
      <div class="cb-ficha-relacionado-foto">
        <span>Foto de la pieza a contraluz</span>
      </div>

      <div class="cb-ficha-relacionado-info">
        <h3>${item.nombre}</h3>

        <p class="cb-ficha-relacionado-precio">
          ${formatoPrecio(item.precio)}
        </p>

        <p class="cb-ficha-relacionado-descripcion">
          Vidrio de colores hecho a mano. Cada pieza es única.
        </p>

        <span class="cb-ficha-relacionado-estado ${espera ? "espera" : ""}">
          ${espera ? "Lista de espera" : "Disponible"}
        </span>

        <div class="cb-ficha-relacionado-acciones">
          <a class="cb-ficha-relacionado-boton"
             href="producto.html?id=${id}">
            Ver detalles
          </a>

          ${
            espera
              ? `<a class="cb-ficha-relacionado-boton"
                    href="producto.html?id=${id}&lista=1">
                   <i class="bi bi-envelope"></i>
                   Unirme a la lista
                 </a>`
              : `<button type="button"
                         class="cb-ficha-relacionado-boton principal"
                         data-agregar="${id}">
                   <i class="bi bi-cart3"></i>
                   Agregar al carrito
                 </button>`
          }

          <span class="cb-ficha-relacionado-mensaje"
                role="status"></span>
        </div>
      </div>
    `;

    const contenedorFoto = tarjeta.querySelector(
      ".cb-ficha-relacionado-foto"
    );

    if (item.imagen) {
      const imagen = document.createElement("img");

      imagen.alt = item.alt;
      imagen.loading = "lazy";

      imagen.addEventListener("error", () => {
        imagen.remove();
      });

      imagen.src = item.imagen;
      contenedorFoto.appendChild(imagen);
    }

    const agregar = tarjeta.querySelector("[data-agregar]");

    if (agregar) {
      if (estaEnCarrito(id)) marcarEnCarrito(agregar);

      agregar.addEventListener("click", () => {
        agregarAlCarrito(id);
        marcarEnCarrito(agregar);
      });
    }

    grid.appendChild(tarjeta);
  });


  /* - Ventana de lista de espera - */

  const modal = obtener("ficha-modal-lista");
  const cerrarModal = obtener("ficha-modal-cerrar");
  const formulario = obtener("ficha-form-lista");

  obtener("ficha-modal-producto-nombre").textContent =
    producto.nombre;

  obtener("ficha-modal-producto-precio").textContent =
    formatoPrecio(producto.precio);

  function abrirLista() {
    if (!modal.open) {
      modal.showModal();
    }
  }

  botonLista.addEventListener("click", abrirLista);

  cerrarModal.addEventListener("click", () => {
    modal.close();
  });

  // Cerrar haciendo clic fuera del contenido

  modal.addEventListener("click", (evento) => {
    if (evento.target === modal) {
      modal.close();
    }
  });

  // Abrir automáticamente al entrar desde
  // una tarjeta que dice "Unirme a la lista"

  if (estaEnEspera && parametros.get("lista") === "1") {
    abrirLista();
  }

  // Enviar solicitud por WhatsApp

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nombre = obtener("ficha-cliente-nombre").value.trim();
    const cantidad = obtener("ficha-cliente-cantidad").value;
    const comentarios = obtener("ficha-cliente-comentarios").value.trim();

    const partes = [
      "Hola, quisiera solicitar un lugar en la lista de espera de Cuckoo Banana.",
      "Producto: " + producto.nombre,
      "Cantidad: " + cantidad,
      "Nombre: " + nombre
    ];

    if (comentarios) {
      partes.push("Comentarios: " + comentarios);
    }

    const mensaje = partes.join("\n");
    const direccion =
      "https://wa.me/50671291718?text=" +
      encodeURIComponent(mensaje);

    // El usuario debe enviar el mensaje en WhatsApp.
    // Esto no guarda automáticamente una reserva.
    window.location.assign(direccion);
  });

})();
