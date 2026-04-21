const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/productos", require("./routes/productos"));
app.use("/api/sedes", require("./routes/sedes"));

app.listen(3000, "0.0.0.0", () => {
  console.log("Servidor en http://0.0.0.0:3000");
});