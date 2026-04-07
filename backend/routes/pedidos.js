const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/pedidos.json");

// Leer pedidos
const leerPedidos = () => {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

// Guardar pedidos
const guardarPedidos = (pedidos) => {
  fs.writeFileSync(filePath, JSON.stringify(pedidos, null, 2));
};

// POST crear pedido
router.post("/", (req, res) => {
  const pedidos = leerPedidos();

  const nuevoPedido = {
    id: Date.now(),
    ...req.body,
    estado: "pendiente"
  };

  pedidos.push(nuevoPedido);

  guardarPedidos(pedidos);

  res.json({
    mensaje: "Pedido guardado en JSON ✅",
    pedido: nuevoPedido
  });
});

// GET pedidos
router.get("/", (req, res) => {
  const pedidos = leerPedidos();
  res.json(pedidos);
});

module.exports = router;