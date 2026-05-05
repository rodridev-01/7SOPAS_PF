const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { requerirAdmin } = require("../middleware/adminAuth");

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

router.get("/", requerirAdmin, (req, res) => {
  const reservas = leerJSON(reservasPath);
  res.json(reservas);
});

router.post("/", (req, res) => {
  const { usuarioId, cliente, sedeId, fecha, hora, personas, comentarios } = req.body;

  if (!cliente || !cliente.nombre || !cliente.telefono) {
    return res.status(400).json({ mensaje: "Completa nombre y teléfono del cliente" });
  }

  if (!esTelefonoValido(cliente.telefono)) {
    return res.status(400).json({ mensaje: "El teléfono debe tener 9 dígitos y empezar con 9" });
  }

  if (!esEmailValido(cliente.email)) {
    return res.status(400).json({ mensaje: "El correo no tiene un formato válido" });
  }

  if (!sedeId || !fecha || !hora || !personas) {
    return res.status(400).json({ mensaje: "Completa sede, fecha, hora y cantidad de personas" });
  }

  const cantidadPersonas = Number(personas);
  if (!Number.isInteger(cantidadPersonas) || cantidadPersonas < 1 || cantidadPersonas > 12) {
    return res.status(400).json({ mensaje: "La reserva debe ser para 1 a 12 personas" });
  }

  if (!fechaNoPasada(fecha)) {
    return res.status(400).json({ mensaje: "No puedes reservar en una fecha pasada" });
  }

  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
    return res.status(400).json({ mensaje: "La hora no tiene un formato válido" });
  }

  const sedes = leerJSON(sedesPath);
  const sede = sedes.find((item) => Number(item.id) === Number(sedeId));

  if (!sede) {
    return res.status(400).json({ mensaje: "La sede seleccionada no existe" });
  }

  const reservas = leerJSON(reservasPath);
  const reservasMismaSede = reservas.filter(
    (reserva) =>
      Number(reserva.sedeId) === Number(sedeId) &&
      reserva.fecha === fecha &&
      reserva.hora === hora &&
      reserva.estado !== "cancelada"
  );

  if (reservasMismaSede.length >= Number(sede.mesasDisponibles || 0)) {
    return res.status(409).json({ mensaje: "No hay mesas disponibles para ese horario" });
  }

  const nuevaReserva = {
    id: reservas.length > 0 ? Math.max(...reservas.map((r) => Number(r.id) || 0)) + 1 : 1,
    usuarioId: usuarioId || null,
    cliente: {
      nombre: cliente.nombre.trim(),
      telefono: cliente.telefono.trim(),
      email: cliente.email ? cliente.email.trim() : ""
    },
    sedeId: Number(sedeId),
    sedeNombre: sede.nombre,
    fecha,
    hora,
    personas: cantidadPersonas,
    comentarios: comentarios ? comentarios.trim() : "",
    estado: "confirmada",
    creadoEn: new Date().toISOString()
  };

  reservas.push(nuevaReserva);
  guardarJSON(reservasPath, reservas);

  res.status(201).json({ mensaje: "Reserva registrada correctamente", reserva: nuevaReserva });
});

router.patch("/:id/estado", requerirAdmin, (req, res) => {
  const { estado } = req.body;
  const estadosPermitidos = ["confirmada", "pendiente", "cancelada", "atendida"];

  if (!estadosPermitidos.includes(estado)) {
    return res.status(400).json({ mensaje: "Estado de reserva inválido" });
  }

  const reservas = leerJSON(reservasPath);
  const reserva = reservas.find((item) => Number(item.id) === Number(req.params.id));

  if (!reserva) {
    return res.status(404).json({ mensaje: "Reserva no encontrada" });
  }

  reserva.estado = estado;
  reserva.actualizadoEn = new Date().toISOString();
  guardarJSON(reservasPath, reservas);

  res.json({ mensaje: "Estado actualizado", reserva });
});

router.delete("/:id", requerirAdmin, (req, res) => {
  const reservas = leerJSON(reservasPath);
  const nuevasReservas = reservas.filter((item) => Number(item.id) !== Number(req.params.id));

  if (nuevasReservas.length === reservas.length) {
    return res.status(404).json({ mensaje: "Reserva no encontrada" });
  }

  guardarJSON(reservasPath, nuevasReservas);
  res.json({ mensaje: "Reserva eliminada" });
});

module.exports = router;
