const formReserva = document.getElementById("formReserva");
const mensajeReserva = document.getElementById("mensajeReserva");
const sedeReserva = document.getElementById("sedeReserva");
const fechaReserva = document.getElementById("fechaReserva");
const btnReserva = document.getElementById("btnReserva");

function mostrarMensajeReserva(tipo, texto) {
  mensajeReserva.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${texto}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>
  `;
}

function hoyISO() {
  const hoy = new Date();
  return hoy.toISOString().split("T")[0];
}

function cargarUsuarioReserva() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) return;

  document.getElementById("nombreReserva").value = usuario.nombre || "";
  document.getElementById("emailReserva").value = usuario.email || "";
}

function cargarSedesReserva() {
  fetch(API + "/sedes")
    .then((res) => res.json())
    .then((sedes) => {
      sedeReserva.innerHTML = `<option value="">Selecciona una sede</option>`;

      sedes.forEach((sede) => {
        sedeReserva.innerHTML += `<option value="${sede.id}">${sede.nombre} - ${sede.distrito}</option>`;
      });

      const params = new URLSearchParams(window.location.search);
      const sedeParam = params.get("sede");
      if (sedeParam) sedeReserva.value = sedeParam;
    })
    .catch(() => {
      sedeReserva.innerHTML = `<option value="">No se pudieron cargar las sedes</option>`;
    });
}

function validarReservaFrontend(payload) {
  if (payload.cliente.nombre.length < 3) return "El nombre debe tener al menos 3 caracteres.";
  if (!/^9\d{8}$/.test(payload.cliente.telefono)) return "El teléfono debe tener 9 dígitos y empezar con 9.";
  if (payload.cliente.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.cliente.email)) return "El correo no tiene un formato válido.";
  if (!payload.sedeId) return "Selecciona una sede.";
  if (!payload.fecha || payload.fecha < hoyISO()) return "Selecciona una fecha válida desde hoy.";
  if (!payload.hora) return "Selecciona una hora.";
  if (payload.personas < 1 || payload.personas > 12) return "La reserva debe ser para 1 a 12 personas.";
  return null;
}

formReserva.addEventListener("submit", (event) => {
  event.preventDefault();

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const payload = {
    usuarioId: usuario ? usuario.id : null,
    cliente: {
      nombre: document.getElementById("nombreReserva").value.trim(),
      telefono: document.getElementById("telefonoReserva").value.trim(),
      email: document.getElementById("emailReserva").value.trim()
    },
    sedeId: Number(sedeReserva.value),
    fecha: fechaReserva.value,
    hora: document.getElementById("horaReserva").value,
    personas: Number(document.getElementById("personasReserva").value),
    comentarios: document.getElementById("comentariosReserva").value.trim()
  };

  const error = validarReservaFrontend(payload);
  if (error) {
    mostrarMensajeReserva("warning", error);
    return;
  }

  btnReserva.disabled = true;
  btnReserva.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Registrando...`;

  fetch(API + "/reservas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || "No se pudo registrar la reserva");

      formReserva.reset();
      fechaReserva.min = hoyISO();
      mostrarMensajeReserva("success", `Reserva registrada correctamente para el ${data.reserva.fecha} a las ${data.reserva.hora}.`);
      cargarUsuarioReserva();
    })
    .catch((error) => mostrarMensajeReserva("danger", error.message))
    .finally(() => {
      btnReserva.disabled = false;
      btnReserva.innerHTML = `<i class="bi bi-calendar-check"></i> Confirmar reserva`;
    });
});

fechaReserva.min = hoyISO();
cargarUsuarioReserva();
cargarSedesReserva();
