let sesionAdminActual = null;

async function iniciarPanelAdmin() {
  sesionAdminActual = await verificarAdmin();
  if (!sesionAdminActual) return;

  const nombreAdmin = document.getElementById("adminNombre");
  const btnCerrarAdmin = document.getElementById("btnCerrarAdmin");

  if (nombreAdmin) {
    nombreAdmin.textContent = `Hola, ${sesionAdminActual.usuario?.nombre || "Admin"}`;
  }

  if (btnCerrarAdmin) {
    btnCerrarAdmin.addEventListener("click", cerrarSesionAdmin);
  }

  btnRecargar.addEventListener("click", cargarDashboard);
  cargarDashboard();
}

const mensajeAdmin = document.getElementById("mensajeAdmin");
const btnRecargar = document.getElementById("btnRecargar");

function formatoSoles(valor) {
  return `S/ ${Number(valor || 0).toFixed(2)}`;
}

function fechaCorta(fecha) {
  if (!fecha) return "-";
  return new Date(fecha).toLocaleString("es-PE", { dateStyle: "short", timeStyle: "short" });
}

function mostrarMensaje(tipo, texto) {
  mensajeAdmin.innerHTML = `<div class="alert alert-${tipo}">${texto}</div>`;
}

function estadoBadge(estado) {
  const clases = {
    pendiente: "warning",
    preparando: "info",
    entregado: "success",
    cancelado: "danger",
    confirmada: "success",
    cancelada: "danger",
    atendida: "primary"
  };
  return `<span class="badge text-bg-${clases[estado] || "secondary"}">${estado || "sin estado"}</span>`;
}

async function obtenerDatos() {
  const endpoints = ["productos", "sedes", "pedidos", "reservas", "usuarios"];
  const respuestas = await Promise.all(endpoints.map((endpoint) => {
    const opciones = ["pedidos", "reservas", "usuarios"].includes(endpoint)
      ? { headers: adminHeaders() }
      : {};
    return fetch(`${API}/${endpoint}`, opciones);
  }));

  for (const res of respuestas) {
    if (!res.ok) throw new Error("No se pudieron cargar todos los datos del backend");
  }

  const [productos, sedes, pedidos, reservas, usuarios] = await Promise.all(respuestas.map((res) => res.json()));
  return { productos, sedes, pedidos, reservas, usuarios };
}

function renderStats({ productos, sedes, pedidos, reservas }) {
  document.getElementById("statProductos").textContent = productos.length;
  document.getElementById("statSedes").textContent = sedes.length;
  document.getElementById("statPedidos").textContent = pedidos.length;
  document.getElementById("statReservas").textContent = reservas.length;
  document.getElementById("badgePedidosPendientes").textContent = `${pedidos.filter((p) => p.estado === "pendiente").length} pendientes`;
  document.getElementById("badgeReservasConfirmadas").textContent = `${reservas.filter((r) => r.estado === "confirmada").length} confirmadas`;
}

function renderPedidos(pedidos) {
  const tabla = document.getElementById("tablaPedidos");
  if (!pedidos.length) {
    tabla.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No hay pedidos registrados.</td></tr>`;
    return;
  }

  tabla.innerHTML = pedidos.slice().reverse().map((pedido) => {
    const cliente = pedido.cliente?.nombre || `Usuario #${pedido.usuarioId || "-"}`;
    return `
      <tr>
        <td>#${pedido.id}</td>
        <td>
          <strong>${cliente}</strong><br>
          <small class="text-muted">${fechaCorta(pedido.fecha)}</small>
        </td>
        <td>${formatoSoles(pedido.total || 0)}</td>
        <td>${estadoBadge(pedido.estado)}</td>
        <td>
          <select class="form-select form-select-sm" onchange="actualizarEstadoPedido(${pedido.id}, this.value)">
            ${["pendiente", "preparando", "entregado", "cancelado"].map((estado) => `<option value="${estado}" ${pedido.estado === estado ? "selected" : ""}>${estado}</option>`).join("")}
          </select>
        </td>
      </tr>
    `;
  }).join("");
}

function renderReservas(reservas) {
  const tabla = document.getElementById("tablaReservas");
  if (!reservas.length) {
    tabla.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No hay reservas registradas.</td></tr>`;
    return;
  }

  tabla.innerHTML = reservas.slice().reverse().map((reserva) => {
    const cliente = reserva.cliente?.nombre || `Usuario #${reserva.usuarioId || "-"}`;
    return `
      <tr>
        <td>#${reserva.id}</td>
        <td><strong>${cliente}</strong><br><small class="text-muted">${reserva.personas || "-"} persona(s)</small></td>
        <td>${reserva.fecha || "-"}<br><small class="text-muted">${reserva.hora || ""}</small></td>
        <td>${estadoBadge(reserva.estado)}</td>
        <td>
          <select class="form-select form-select-sm" onchange="actualizarEstadoReserva(${reserva.id}, this.value)">
            ${["confirmada", "pendiente", "atendida", "cancelada"].map((estado) => `<option value="${estado}" ${reserva.estado === estado ? "selected" : ""}>${estado}</option>`).join("")}
          </select>
        </td>
      </tr>
    `;
  }).join("");
}

function renderProductos(productos) {
  document.getElementById("tablaProductos").innerHTML = productos.map((producto) => `
    <tr>
      <td>${producto.nombre}</td>
      <td>${producto.categoria || "-"}</td>
      <td>${formatoSoles(producto.precios?.personal || 0)}</td>
      <td>${producto.disponible ? '<span class="badge text-bg-success">disponible</span>' : '<span class="badge text-bg-secondary">agotado</span>'}</td>
    </tr>
  `).join("");
}

function renderSedes(sedes) {
  document.getElementById("tablaSedes").innerHTML = sedes.map((sede) => `
    <tr>
      <td>${sede.nombre}</td>
      <td>${sede.distrito}</td>
      <td>${sede.mesasDisponibles || 0}</td>
      <td>${estadoBadge(sede.estado)}</td>
    </tr>
  `).join("");
}

async function cargarDashboard() {
  try {
    mensajeAdmin.innerHTML = "";
    const datos = await obtenerDatos();
    renderStats(datos);
    renderPedidos(datos.pedidos);
    renderReservas(datos.reservas);
    renderProductos(datos.productos);
    renderSedes(datos.sedes);
    document.getElementById("ultimaActualizacion").textContent = `Actualizado: ${new Date().toLocaleTimeString("es-PE")}`;
  } catch (error) {
    mostrarMensaje("danger", error.message);
  }
}

async function actualizarEstadoPedido(id, estado) {
  await fetch(`${API}/pedidos/${id}/estado`, {
    method: "PATCH",
    headers: adminHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ estado })
  });
  cargarDashboard();
}

async function actualizarEstadoReserva(id, estado) {
  await fetch(`${API}/reservas/${id}/estado`, {
    method: "PATCH",
    headers: adminHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ estado })
  });
  cargarDashboard();
}

window.actualizarEstadoPedido = actualizarEstadoPedido;
window.actualizarEstadoReserva = actualizarEstadoReserva;
iniciarPanelAdmin();

    // SIDEBAR
    const sidebar = document.getElementById("sidebar");

    document.getElementById("btnOpenSidebar")
      .addEventListener("click", () => {
        sidebar.classList.add("show");
      });

    document.getElementById("btnCloseSidebar")
      .addEventListener("click", () => {
        sidebar.classList.remove("show");
      });

    // CHARTS
    new Chart(document.getElementById("chartPedidos"), {
      type: "bar",
      data: {
        labels: ["Pendientes", "Preparando", "Entregados"],
        datasets: [{
          label: "Pedidos",
          data: [12, 8, 20],
          borderWidth: 1
        }]
      }
    });

    new Chart(document.getElementById("chartReservas"), {
      type: "doughnut",
      data: {
        labels: ["Confirmadas", "Pendientes"],
        datasets: [{
          data: [18, 6]
        }]
      }
    });