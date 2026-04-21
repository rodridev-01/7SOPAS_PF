function registrar(nombre, email, password) {
  fetch(API + "/usuarios/registro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nombre, email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.mensaje !== "Usuario creado") {
        alert(data.mensaje);
        return;
      }

      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      alert("Usuario registrado correctamente");

      window.location.href = "index.html";
    })
    .catch(() => {
      alert("Error al registrar");
    });
}

document.getElementById("btnRegistro").addEventListener("click", () => {
  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!nombre || !email || !password) {
    alert("Completa todos los campos");
    return;
  }

  registrar(nombre, email, password);
});