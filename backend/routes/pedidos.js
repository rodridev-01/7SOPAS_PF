const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/pedidos.json");
const productosPath = path.join(__dirname, "../data/productos.json");
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


router.get("/", (req, res) => {
  const pedidos = leerJSON(filePath);
  res.json(pedidos);
});


router.post("/", (req, res) => {

  const {
    usuarioId,
    cliente,
    sedeId,
    tipoEntrega,
    direccion,
    productos
  } = req.body;

  if (
    !sedeId ||
    !productos ||
    !Array.isArray(productos) ||
    productos.length === 0
  ) {
    return res.status(400).json({
      mensaje: "El pedido debe tener sede y productos"
    });
  }

  if (
    !cliente ||
    !cliente.nombre ||
    !cliente.telefono
  ) {
    return res.status(400).json({
      mensaje: "Completa el nombre y teléfono del cliente"
    });
  }

  if (!esTelefonoValido(cliente.telefono)) {
    return res.status(400).json({
      mensaje: "El teléfono debe tener 9 dígitos y empezar con 9"
    });
  }

  if (!esEmailValido(cliente.email)) {
    return res.status(400).json({
      mensaje: "El correo no tiene un formato válido"
    });
  }

  if (
    !["recojo", "delivery"]
      .includes(tipoEntrega || "recojo")
  ) {
    return res.status(400).json({
      mensaje: "Tipo de entrega inválido"
    });
  }

  if (
    tipoEntrega === "delivery" &&
    !String(direccion || "").trim()
  ) {
    return res.status(400).json({
      mensaje: "Ingresa una dirección para delivery"
    });
  }

  const sedes = leerJSON(sedesPath);

  const sedeExiste = sedes.some(
    sede => Number(sede.id) === Number(sedeId)
  );

  if (!sedeExiste) {
    return res.status(400).json({
      mensaje: "La sede seleccionada no existe"
    });
  }

  const catalogo = leerJSON(productosPath);

  let productosValidados;

  try {

    productosValidados = productos.map(item => {

      const producto = catalogo.find(
        p => Number(p.id) === Number(item.productoId)
      );

      if (!producto) {
        throw new Error("Producto inválido");
      }

      if (!producto.precios[item.tamaño]) {
        throw new Error("Tamaño inválido");
      }

      const cantidad = Number(item.cantidad);

      if (
        !Number.isInteger(cantidad) ||
        cantidad < 1
      ) {
        throw new Error("Cantidad inválida");
      }

      const precioUnitario = Number(
        producto.precios[item.tamaño]
      );

      return {
        productoId: producto.id,
        nombre: producto.nombre,
        tamaño: item.tamaño,
        cantidad,
        precioUnitario,
        subtotal: precioUnitario * cantidad
      };

    });

  } catch (error) {

    return res.status(400).json({
      mensaje: error.message
    });

  }

  const total = productosValidados.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );

  const pedidos = leerJSON(filePath);

  const nuevoPedido = {

    id:
      pedidos.length > 0
        ? Math.max(
            ...pedidos.map(
              p => Number(p.id) || 0
            )
          ) + 1
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

    tipoEntrega: tipoEntrega || "recojo",

    direccion:
      tipoEntrega === "delivery"
        ? String(direccion || "").trim()
        : "",

    productos: productosValidados,

    subtotal: total,

    delivery:
      tipoEntrega === "delivery"
        ? 6
        : 0,

    total:
      total +
      (
        tipoEntrega === "delivery"
          ? 6
          : 0
      ),

    estado: "pendiente",

    fecha: new Date().toISOString()

  };

  pedidos.push(nuevoPedido);

  guardarJSON(filePath, pedidos);

  res.status(201).json({
    mensaje: "Pedido registrado correctamente",
    pedido: nuevoPedido
  });

});



router.patch("/:id/estado", (req, res) => {

  const { estado } = req.body;

  const estadosPermitidos = [
    "pendiente",
    "preparando",
    "entregado",
    "cancelado"
  ];

  if (!estadosPermitidos.includes(estado)) {

    return res.status(400).json({
      mensaje: "Estado de pedido inválido"
    });

  }

  const pedidos = leerJSON(filePath);

  const pedido = pedidos.find(
    item => Number(item.id) === Number(req.params.id)
  );

  if (!pedido) {

    return res.status(404).json({
      mensaje: "Pedido no encontrado"
    });

  }

  pedido.estado = estado;

  pedido.actualizadoEn =
    new Date().toISOString();

  guardarJSON(filePath, pedidos);

  res.json({
    mensaje: "Estado actualizado",
    pedido
  });

});


router.delete("/:id", (req, res) => {

  const pedidos = leerJSON(filePath);

  const nuevosPedidos = pedidos.filter(
    item => Number(item.id) !== Number(req.params.id)
  );

  if (nuevosPedidos.length === pedidos.length) {

    return res.status(404).json({
      mensaje: "Pedido no encontrado"
    });

  }

  guardarJSON(filePath, nuevosPedidos);

  res.json({
    mensaje: "Pedido eliminado"
  });

});

module.exports = router;