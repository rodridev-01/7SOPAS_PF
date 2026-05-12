const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const reservasPath = path.join(__dirname, "../data/reservas.json");
const sedesPath = path.join(__dirname, "../data/sedes.json");

function leerJSON(ruta) {
  return JSON.parse(fs.readFileSync(ruta, "utf-8"));
}

function guardarJSON(ruta, data) {
  fs.writeFileSync(ruta, JSON.stringify(data, null, 2));
}

function esEmailValido(email) {
  return !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function esTelefonoValido(telefono) {
  return /^9\d{8}$/.test(String(telefono || "").trim());
}

function fechaNoPasada(fecha) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const seleccionada = new Date(`${fecha}T00:00:00`);

  return seleccionada >= hoy;
}


router.get("/", (req, res) => {
  const reservas = leerJSON(reservasPath);
  res.json(reservas);
});


router.post("/", (req, res) => {

  const {
    usuarioId,
    cliente,
    sedeId,
    fecha,
    hora,
    personas,
    comentarios
  } = req.body;

  if (!cliente || !cliente.nombre || !cliente.telefono) {
    return res.status(400).json({
      mensaje: "Completa nombre y teléfono del cliente"
    });
  }

  if (!esTelefonoValido(cliente.telefono)) {
    return res.status(400).json({
      mensaje: "El teléfono debe tener 9 dígitos y empezar con 9"
    });
  }

  if (!esEmailValido(cliente.email)) {
    return res.status(400).json({
      mensaje: "Correo inválido"
    });
  }

  if (!sedeId || !fecha || !hora || !personas) {
    return res.status(400).json({
      mensaje: "Completa todos los campos"
    });
  }

  const cantidadPersonas = Number(personas);

  if (
    !Number.isInteger(cantidadPersonas) ||
    cantidadPersonas < 1 ||
    cantidadPersonas > 12
  ) {
    return res.status(400).json({
      mensaje: "La reserva debe ser entre 1 y 12 personas"
    });
  }

  if (!fechaNoPasada(fecha)) {
    return res.status(400).json({
      mensaje: "No puedes reservar fechas pasadas"
    });
  }

  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
    return res.status(400).json({
      mensaje: "Hora inválida"
    });
  }

  const sedes = leerJSON(sedesPath);

  const sede = sedes.find(
    s => Number(s.id) === Number(sedeId)
  );

  if (!sede) {
    return res.status(400).json({
      mensaje: "La sede no existe"
    });
  }

  const reservas = leerJSON(reservasPath);

  const reservasMismaSede = reservas.filter(r =>
    Number(r.sedeId) === Number(sedeId) &&
    r.fecha === fecha &&
    r.hora === hora &&
    r.estado !== "cancelada"
  );

  if (
    reservasMismaSede.length >=
    Number(sede.mesasDisponibles || 0)
  ) {
    return res.status(409).json({
      mensaje: "No hay mesas disponibles"
    });
  }

  const nuevaReserva = {
    id:
      reservas.length > 0
        ? Math.max(...reservas.map(r => Number(r.id) || 0)) + 1
        : 1,

    usuarioId: usuarioId || null,

    cliente: {
      nombre: cliente.nombre.trim(),
      telefono: cliente.telefono.trim(),
      email: cliente.email
        ? cliente.email.trim()
        : ""
    },

    sedeId: Number(sedeId),
    sedeNombre: sede.nombre,

    fecha,
    hora,

    personas: cantidadPersonas,

    comentarios: comentarios
      ? comentarios.trim()
      : "",

    estado: "confirmada",

    creadoEn: new Date().toISOString()
  };

  reservas.push(nuevaReserva);

  guardarJSON(reservasPath, reservas);

  res.status(201).json({
    mensaje: "Reserva registrada correctamente",
    reserva: nuevaReserva
  });

});


router.patch("/:id/estado", (req, res) => {

  const { estado } = req.body;

  const estadosPermitidos = [
    "confirmada",
    "pendiente",
    "cancelada",
    "atendida"
  ];

  if (!estadosPermitidos.includes(estado)) {
    return res.status(400).json({
      mensaje: "Estado inválido"
    });
  }

  const reservas = leerJSON(reservasPath);

  const reserva = reservas.find(
    r => Number(r.id) === Number(req.params.id)
  );

  if (!reserva) {
    return res.status(404).json({
      mensaje: "Reserva no encontrada"
    });
  }

  reserva.estado = estado;

  reserva.actualizadoEn =
    new Date().toISOString();

  guardarJSON(reservasPath, reservas);

  res.json({
    mensaje: "Estado actualizado",
    reserva
  });

});


router.delete("/:id", (req, res) => {

  const reservas = leerJSON(reservasPath);

  const nuevasReservas = reservas.filter(
    r => Number(r.id) !== Number(req.params.id)
  );

  if (nuevasReservas.length === reservas.length) {
    return res.status(404).json({
      mensaje: "Reserva no encontrada"
    });
  }

  guardarJSON(
    reservasPath,
    nuevasReservas
  );

  res.json({
    mensaje: "Reserva eliminada"
  });

});

module.exports = router;