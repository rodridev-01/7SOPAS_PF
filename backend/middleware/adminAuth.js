const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const usuariosPath = path.join(__dirname, "../data/usuarios.json");
const sesionesAdmin = new Map();

function leerUsuarios() {
  return JSON.parse(fs.readFileSync(usuariosPath, "utf-8"));
}

function crearTokenAdmin(usuario) {
  const token = `admin-${crypto.randomBytes(24).toString("hex")}`;
  sesionesAdmin.set(token, {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
    creadoEn: Date.now()
  });
  return token;
}

function validarTokenAdmin(token) {
  if (!token || !sesionesAdmin.has(token)) return null;

  const sesion = sesionesAdmin.get(token);
  const ochoHoras = 8 * 60 * 60 * 1000;

  if (Date.now() - sesion.creadoEn > ochoHoras) {
    sesionesAdmin.delete(token);
    return null;
  }

  const usuarios = leerUsuarios();
  const usuario = usuarios.find((u) => Number(u.id) === Number(sesion.id));

  if (!usuario || usuario.rol !== "admin") {
    sesionesAdmin.delete(token);
    return null;
  }

  return sesion;
}

function requerirAdmin(req, res, next) {
  const token = req.headers["x-admin-token"];
  const sesion = validarTokenAdmin(token);

  if (!sesion) {
    return res.status(401).json({ mensaje: "Acceso denegado. Inicia sesión como administrador." });
  }

  req.admin = sesion;
  next();
}

module.exports = {
  crearTokenAdmin,
  validarTokenAdmin,
  requerirAdmin
};
