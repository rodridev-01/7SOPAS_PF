function login(email, password) {
  fetch(API + "/usuarios/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.mensaje !== "Login exitoso") {
        alert("Usuario o contraseña incorrectas");
        return;
      }

      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      window.location.href = "index.html";
    })
    .catch(() => {
      alert("Error de conexión");
    });
}

document.getElementById("btnLogin").addEventListener("click", handleLogin);

function handleLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Completa todos los campos");
    return;
  }

  login(email, password);
}