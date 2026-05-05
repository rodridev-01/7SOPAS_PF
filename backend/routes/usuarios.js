const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { crearTokenAdmin, validarTokenAdmin, requerirAdmin } = require("../middleware/adminAuth");

const filePath = path.join(__dirname, "../data/usuarios.json");

function leerUsuarios() {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function guardarUsuarios(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function crearHashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return { salt, hash };
}

function passwordCoincide(usuario, password) {
  if (usuario.passwordHash && usuario.passwordSalt) {
    const { hash } = crearHashPassword(password, usuario.passwordSalt);
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(usuario.passwordHash));
  }

  // Compatibilidad con usuarios antiguos guardados en texto plano.
  return usuario.password === password;
}

function limpiarUsuario(usuario) {
  const { password, passwordHash, passwordSalt, ...usuarioSeguro } = usuario;
  return usuarioSeguro;
}

router.get("/", requerirAdmin, (req, res) => {
  const usuarios = leerUsuarios().map(limpiarUsuario);
  res.json(usuarios);
});

router.post("/admin-login", (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!email || !password) {
    return res.status(400).json({ mensaje: "Completa usuario y contraseña" });
  }

  const usuarios = leerUsuarios();
  const usuario = usuarios.find((u) => String(u.email || "").toLowerCase() === email);

  if (!usuario || usuario.rol !== "admin" || !passwordCoincide(usuario, password)) {
    return res.status(401).json({ mensaje: "Usuario o contraseña de administrador incorrectos" });
  }

  const token = crearTokenAdmin(usuario);

  res.json({
    mensaje: "Acceso de administrador concedido",
    token,
    usuario: limpiarUsuario(usuario)
  });
});

router.get("/admin-verificar", (req, res) => {
  const sesion = validarTokenAdmin(req.headers["x-admin-token"]);

  if (!sesion) {
    return res.status(401).json({ mensaje: "Sesión de administrador no válida" });
  }

  res.json({ mensaje: "Sesión válida", usuario: sesion });
});

router.post("/login", (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!email || !password) {
    return res.status(400).json({ mensaje: "Completa correo y contraseña" });
  }

  if (!esEmailValido(email)) {
    return res.status(400).json({ mensaje: "Correo inválido" });
  }

  const usuarios = leerUsuarios();
  const usuario = usuarios.find((u) => String(u.email || "").toLowerCase() === email);

  if (!usuario || !passwordCoincide(usuario, password)) {
    return res.status(401).json({ mensaje: "Credenciales incorrectas" });
  }

  // Si el usuario era antiguo y tenía contraseña en texto plano, se migra a hash.
  if (!usuario.passwordHash || !usuario.passwordSalt) {
    const { salt, hash } = crearHashPassword(password);
    usuario.passwordSalt = salt;
    usuario.passwordHash = hash;
    delete usuario.password;
    guardarUsuarios(usuarios);
  }

  res.json({
    mensaje: "Login exitoso",
    usuario: limpiarUsuario(usuario)
  });
});

router.post("/registro", (req, res) => {
  const nombre = String(req.body.nombre || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: "Completa todos los campos" });
  }

  if (nombre.length < 3 || nombre.length > 60) {
    return res.status(400).json({ mensaje: "El nombre debe tener entre 3 y 60 caracteres" });
  }

  if (!esEmailValido(email)) {
    return res.status(400).json({ mensaje: "El correo no tiene un formato válido" });
  }

  if (password.length < 6) {
    return res.status(400).json({ mensaje: "La contraseña debe tener al menos 6 caracteres" });
  }

  const usuarios = leerUsuarios();
  const existe = usuarios.find((u) => String(u.email || "").toLowerCase() === email);

  if (existe) {
    return res.status(400).json({ mensaje: "El usuario ya existe" });
  }

  const { salt, hash } = crearHashPassword(password);
  const nuevoUsuario = {
    id: usuarios.length > 0 ? Math.max(...usuarios.map((u) => Number(u.id) || 0)) + 1 : 1,
    nombre,
    email,
    passwordSalt: salt,
    passwordHash: hash,
    restricciones: [],
    historial: [],
    rol: "cliente",
    creadoEn: new Date().toISOString()
  };

  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);

  res.status(201).json({
    mensaje: "Usuario creado",
    usuario: limpiarUsuario(nuevoUsuario)
  });
});

module.exports = router;
