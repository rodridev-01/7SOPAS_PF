const mensajeRegistro = document.getElementById("mensajeRegistro");

function mostrarMensajeRegistro(tipo, texto) {
  if (!mensajeRegistro) {
    alert(texto);
    return;
  }

  mensajeRegistro.innerHTML = `<div class="alert alert-${tipo} py-2">${texto}</div>`;
}

function registrar(nombre, email, password) {
  fetch(API + "/usuarios/registro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, password })
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || "No se pudo registrar");

      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      mostrarMensajeRegistro("success", "Usuario registrado correctamente");
      setTimeout(() => { window.location.href = "/"; }, 600);
    })
    .catch((error) => mostrarMensajeRegistro("danger", error.message));
}

document.getElementById("btnRegistro").addEventListener("click", () => {
  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (nombre.length < 3) {
    mostrarMensajeRegistro("warning", "El nombre debe tener al menos 3 caracteres");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    mostrarMensajeRegistro("warning", "Ingresa un correo válido");
    return;
  }

  if (password.length < 6) {
    mostrarMensajeRegistro("warning", "La contraseña debe tener al menos 6 caracteres");
    return;
  }

  registrar(nombre, email, password);
});
