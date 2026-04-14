const express = require("express");
const router = express.Router();
const sedes = require("../data/sedes.json");

// Obtener sedes
router.get("/", (req, res) => {
  res.json(sedes);
});

module.exports = router;