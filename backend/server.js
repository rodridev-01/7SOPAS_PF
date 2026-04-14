const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/productos", require("./routes/productos"));
app.use("/api/pedidos", require("./routes/pedidos"));
app.use("/api/sedes", require("./routes/sedes"));

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});