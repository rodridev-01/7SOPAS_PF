const formAdminLogin = document.getElementById("formAdminLogin");
const mensajeAdminLogin = document.getElementById("mensajeAdminLogin");

function mostrarMensajeLogin(tipo, texto) {
  mensajeAdminLogin.innerHTML = `<div class="alert alert-${tipo} py-2">${texto}</div>`;
}

formAdminLogin.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("inputEmail").value.trim();
  const password = document.getElementById("inputPassword").value;

  if (!email || !password) {
    mostrarMensajeLogin("warning", "Completa el usuario y la contraseña.");
    return;
  }

  try {
    const respuesta = await fetch(`${API}/usuarios/admin-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensajeLogin("danger", data.mensaje || "Credenciales incorrectas.");
      return;
    }

    guardarSesionAdmin({ token: data.token, usuario: data.usuario });
    window.location.href = "/admin/dashboard.html";
  } catch (error) {
    mostrarMensajeLogin("danger", "No se pudo conectar con el servidor.");
  }
});
