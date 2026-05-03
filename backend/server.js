const express = require("express");
const cors = require("cors");

const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, '.')))
app.use(express.static(path.join(__dirname, '../public')));

app.use(cors());
app.use(express.json());

app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/productos", require("./routes/productos"));
app.use("/api/sedes", require("./routes/sedes"));

app.listen(3000, "127.0.0.1", () => {
  console.log("Servidor en http://127.0.0.1:3000");
});
app.get('/', (req, res) => {
  console.log(__dirname);
    res.sendFile(path.join(__dirname, '../index.html'));
});
app.get('/menu', (req, res) => {
  console.log(__dirname);
    res.sendFile(path.join(__dirname, '../menu.html'));
}); 
app.get('/login', (req, res) => {
  console.log(__dirname);
    res.sendFile(path.join(__dirname, '../login.html'));
}); 
app.get('/register', (req, res) => {
  console.log(__dirname);
    res.sendFile(path.join(__dirname, '../register.html'));
}); 