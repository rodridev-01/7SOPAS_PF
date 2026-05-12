const express = require("express");
const router = express.Router();

let productos = require("../data/productos.json");

const fs = require("fs");
const path = require("path");

const productosPath = path.join(__dirname, "../data/productos.json");


router.get("/", (req, res) => {
  res.json(productos);
});


router.post("/", (req, res) => {

  const nuevoProducto = {
    id: Date.now(),
    ...req.body
  };

  productos.push(nuevoProducto);

  fs.writeFileSync(
    productosPath,
    JSON.stringify(productos, null, 2)
  );

  res.status(201).json({
    mensaje: "Producto creado",
    producto: nuevoProducto
  });

});


router.put("/:id", (req, res) => {

  const id = Number(req.params.id);

  const index = productos.findIndex(
    p => p.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      mensaje: "Producto no encontrado"
    });
  }

  productos[index] = {
    ...productos[index],
    ...req.body
  };

  fs.writeFileSync(
    productosPath,
    JSON.stringify(productos, null, 2)
  );

  res.json({
    mensaje: "Producto actualizado",
    producto: productos[index]
  });

});


router.delete("/:id", (req, res) => {

  const id = Number(req.params.id);

  const existe = productos.some(
    p => p.id === id
  );

  if (!existe) {
    return res.status(404).json({
      mensaje: "Producto no encontrado"
    });
  }

  productos = productos.filter(
    p => p.id !== id
  );

  fs.writeFileSync(
    productosPath,
    JSON.stringify(productos, null, 2)
  );

  res.json({
    mensaje: "Producto eliminado"
  });

});

module.exports = router;