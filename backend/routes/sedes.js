const express = require("express");
const router = express.Router();

let sedes = require("../data/sedes.json");

const fs = require("fs");
const path = require("path");

const sedesPath = path.join(
  __dirname,
  "../data/sedes.json"
);


router.get("/", (req, res) => {
  res.json(sedes);
});


router.post("/", (req, res) => {

  const nuevaSede = {
    id: Date.now(),
    ...req.body
  };

  sedes.push(nuevaSede);

  fs.writeFileSync(
    sedesPath,
    JSON.stringify(sedes, null, 2)
  );

  res.status(201).json({
    mensaje: "Sede creada",
    sede: nuevaSede
  });

});


router.put("/:id", (req, res) => {

  const id = Number(req.params.id);

  const index = sedes.findIndex(
    s => s.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      mensaje: "Sede no encontrada"
    });
  }

  sedes[index] = {
    ...sedes[index],
    ...req.body
  };

  fs.writeFileSync(
    sedesPath,
    JSON.stringify(sedes, null, 2)
  );

  res.json({
    mensaje: "Sede actualizada",
    sede: sedes[index]
  });

});


router.delete("/:id", (req, res) => {

  const id = Number(req.params.id);

  const existe = sedes.some(
    s => s.id === id
  );

  if (!existe) {
    return res.status(404).json({
      mensaje: "Sede no encontrada"
    });
  }

  sedes = sedes.filter(
    s => s.id !== id
  );

  fs.writeFileSync(
    sedesPath,
    JSON.stringify(sedes, null, 2)
  );

  res.json({
    mensaje: "Sede eliminada"
  });

});

module.exports = router;