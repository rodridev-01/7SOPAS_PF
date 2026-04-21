const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/usuarios.json");

function leerUsuarios() {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function guardarUsuarios(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const usuarios = leerUsuarios();

  const usuario = usuarios.find(
    (u) => u.email === email && u.password === password
  );

  if (!usuario) {
    return res.status(401).json({ mensaje: "Credenciales incorrectas" });
  }

  res.json({
    mensaje: "Login exitoso",
    usuario
  });
});


router.post("/registro", (req, res) => {
  const { nombre, email, password } = req.body;

  const usuarios = leerUsuarios();

  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: "Faltan datos" });
  }

  const existe = usuarios.find((u) => u.email === email);
  if (existe) {
    return res.status(400).json({ mensaje: "El usuario ya existe" });
  }

  const nuevoUsuario = {
    id: usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1,
    nombre,
    email,
    password,
    restricciones: [],
    historial: []
  };

  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);

  res.json({
    mensaje: "Usuario creado",
    usuario: nuevoUsuario
  });
});

module.exports = router;