function mostrarErrorLogin(texto) {
  alert(texto);
}

function login(email, password) {
  fetch(API + "/usuarios/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || "Usuario o contraseña incorrectas");
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      window.location.href = "/";
    })
    .catch((error) => mostrarErrorLogin(error.message));
}

document.getElementById("btnLogin").addEventListener("click", handleLogin);

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") handleLogin();
});

function handleLogin() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    mostrarErrorLogin("Completa todos los campos");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    mostrarErrorLogin("Ingresa un correo válido");
    return;
  }

  login(email, password);
}
