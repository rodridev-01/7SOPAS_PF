const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   ARCHIVOS ESTÁTICOS
========================= */

app.use(express.static(path.join(__dirname, "../public")));
app.use("/admin/assets", express.static(path.join(__dirname, "../admin")));

/* =========================
   API
========================= */

app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/productos", require("./routes/productos"));
app.use("/api/sedes", require("./routes/sedes"));
app.use("/api/pedidos", require("./routes/pedidos"));
app.use("/api/reservas", require("./routes/reservas"));

/* =========================
   FRONTEND PÚBLICO
========================= */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

app.get("/:page", (req, res, next) => {
  const filePath = path.join(
    __dirname,
    "../public",
    req.params.page + ".html"
  );

  res.sendFile(filePath, (err) => {
    if (err) next();
  });
});

/* =========================
   FRONTEND ADMIN
========================= */

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../admin/login.html"));
});

app.get("/admin/:page", (req, res, next) => {
  const filePath = path.join(
    __dirname,
    "../admin",
    req.params.page + ".html"
  );

  res.sendFile(filePath, (err) => {
    if (err) next();
  });
});

/* =========================
   404
========================= */

app.use((req, res) => {
  res.status(404).send("Página no encontrada");
});

/* =========================
   SERVIDOR
========================= */

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});