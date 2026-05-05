const DELIVERY_COSTO = 6;

const listaCarrito = document.getElementById("listaCarrito");
const mensajeCarrito = document.getElementById("mensajeCarrito");
const subtotalCarrito = document.getElementById("subtotalCarrito");
const deliveryCarrito = document.getElementById("deliveryCarrito");
const totalCarrito = document.getElementById("totalCarrito");
const formPedido = document.getElementById("formPedido");
const sedePedido = document.getElementById("sedePedido");
const tipoEntrega = document.getElementById("tipoEntrega");
const grupoDireccion = document.getElementById("grupoDireccion");
const direccionCliente = document.getElementById("direccionCliente");
const btnVaciarCarrito = document.getElementById("btnVaciarCarrito");
const btnConfirmarPedido = document.getElementById("btnConfirmarPedido");

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  window.dispatchEvent(new Event("carritoActualizado"));
}

function formatoSoles(valor) {
  return `S/ ${Number(valor).toFixed(2)}`;
}

function nombreTamaño(tamaño) {
  const nombres = {
    personal: "Personal",
    mediano: "Mediano",
    grande: "Grande"
  };

  return nombres[tamaño] || tamaño;
}

function calcularSubtotal(carrito) {
  return carrito.reduce((total, item) => total + Number(item.precioUnitario) * Number(item.cantidad), 0);
}

function renderCarrito() {
  const carrito = obtenerCarrito();

  if (carrito.length === 0) {
    listaCarrito.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-cart-x display-4 text-muted"></i>
        <h4 class="mt-3">Tu carrito está vacío</h4>
        <p class="text-muted">Agrega productos desde nuestra carta para registrar un pedido.</p>
        <a href="menu" class="btn btn-danger">Ver carta</a>
      </div>
    `;
    formPedido.classList.add("d-none");
    btnVaciarCarrito.classList.add("d-none");
    actualizarResumen();
    return;
  }

  formPedido.classList.remove("d-none");
  btnVaciarCarrito.classList.remove("d-none");

  listaCarrito.innerHTML = carrito
    .map((item, index) => `
      <div class="cart-item">
        <img src="${item.imagen}" alt="${item.nombre}" class="cart-item-img">
        <div class="cart-item-info">
          <h5 class="mb-1">${item.nombre}</h5>
          <p class="text-muted mb-2">${nombreTamaño(item.tamaño)} · ${formatoSoles(item.precioUnitario)} c/u</p>
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${index}, -1)">-</button>
            <span class="fw-bold cart-qty">${item.cantidad}</span>
            <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${index}, 1)">+</button>
            <button class="btn btn-sm btn-outline-danger ms-2" onclick="eliminarItem(${index})">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
        <strong class="cart-item-price">${formatoSoles(Number(item.precioUnitario) * Number(item.cantidad))}</strong>
      </div>
    `)
    .join("");

  actualizarResumen();
}

function actualizarResumen() {
  const carrito = obtenerCarrito();
  const subtotal = calcularSubtotal(carrito);
  const costoDelivery = carrito.length > 0 && tipoEntrega.value === "delivery" ? DELIVERY_COSTO : 0;
  const total = subtotal + costoDelivery;

  subtotalCarrito.textContent = formatoSoles(subtotal);
  deliveryCarrito.textContent = formatoSoles(costoDelivery);
  totalCarrito.textContent = formatoSoles(total);
}

function cambiarCantidad(index, cambio) {
  const carrito = obtenerCarrito();

  if (!carrito[index]) return;

  carrito[index].cantidad = Number(carrito[index].cantidad) + cambio;

  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  } else {
    carrito[index].subtotal = Number(carrito[index].precioUnitario) * Number(carrito[index].cantidad);
  }

  guardarCarrito(carrito);
  renderCarrito();
}

function eliminarItem(index) {
  const carrito = obtenerCarrito();
  carrito.splice(index, 1);
  guardarCarrito(carrito);
  renderCarrito();
}

function mostrarMensaje(tipo, texto) {
  mensajeCarrito.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${texto}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>
  `;
}


function validarPedidoFrontend(payload) {
  if (payload.cliente.nombre.length < 3) return "El nombre debe tener al menos 3 caracteres.";
  if (!/^9\d{8}$/.test(payload.cliente.telefono)) return "El teléfono debe tener 9 dígitos y empezar con 9.";
  if (payload.cliente.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.cliente.email)) return "El correo no tiene un formato válido.";
  if (!payload.sedeId) return "Selecciona una sede.";
  if (payload.tipoEntrega === "delivery" && !payload.direccion) return "Ingresa una dirección para delivery.";
  return null;
}

function cargarDatosUsuario() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) return;

  document.getElementById("nombreCliente").value = usuario.nombre || "";
  document.getElementById("emailCliente").value = usuario.email || "";
}

function cargarSedes() {
  fetch(API + "/sedes")
    .then((res) => res.json())
    .then((sedes) => {
      sedePedido.innerHTML = `<option value="">Selecciona una sede</option>`;

      sedes.forEach((sede) => {
        sedePedido.innerHTML += `<option value="${sede.id}">${sede.nombre}</option>`;
      });
    })
    .catch(() => {
      sedePedido.innerHTML = `<option value="">No se pudieron cargar las sedes</option>`;
    });
}

tipoEntrega.addEventListener("change", () => {
  const esDelivery = tipoEntrega.value === "delivery";
  grupoDireccion.classList.toggle("d-none", !esDelivery);
  direccionCliente.required = esDelivery;
  actualizarResumen();
});

btnVaciarCarrito.addEventListener("click", () => {
  if (!confirm("¿Seguro que deseas vaciar el carrito?")) return;

  guardarCarrito([]);
  renderCarrito();
});

formPedido.addEventListener("submit", (event) => {
  event.preventDefault();

  const carrito = obtenerCarrito();

  if (carrito.length === 0) {
    mostrarMensaje("warning", "Agrega al menos un producto para registrar el pedido.");
    return;
  }

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const payload = {
    usuarioId: usuario ? usuario.id : null,
    cliente: {
      nombre: document.getElementById("nombreCliente").value.trim(),
      telefono: document.getElementById("telefonoCliente").value.trim(),
      email: document.getElementById("emailCliente").value.trim()
    },
    sedeId: Number(sedePedido.value),
    tipoEntrega: tipoEntrega.value,
    direccion: direccionCliente.value.trim(),
    productos: carrito.map((item) => ({
      productoId: item.productoId,
      tamaño: item.tamaño,
      cantidad: Number(item.cantidad)
    }))
  };

  const error = validarPedidoFrontend(payload);
  if (error) {
    mostrarMensaje("warning", error);
    return;
  }

  btnConfirmarPedido.disabled = true;
  btnConfirmarPedido.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Registrando...`;

  fetch(API + "/pedidos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(async (res) => {
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.mensaje || "No se pudo registrar el pedido");
      }

      guardarCarrito([]);
      renderCarrito();
      formPedido.reset();
      grupoDireccion.classList.add("d-none");
      mostrarMensaje("success", `Pedido registrado correctamente. Total: ${formatoSoles(data.pedido.total)}.`);
    })
    .catch((error) => {
      mostrarMensaje("danger", error.message);
    })
    .finally(() => {
      btnConfirmarPedido.disabled = false;
      btnConfirmarPedido.innerHTML = `<i class="bi bi-check-circle"></i> Confirmar pedido`;
    });
});

cargarDatosUsuario();
cargarSedes();
renderCarrito();
