function obtenerSesionAdmin() {
  try {
    return JSON.parse(localStorage.getItem("adminSesion7Sopas")) || null;
  } catch (error) {
    localStorage.removeItem("adminSesion7Sopas");
    return null;
  }
}

function guardarSesionAdmin(sesion) {
  localStorage.setItem("adminSesion7Sopas", JSON.stringify(sesion));
}

function cerrarSesionAdmin() {
  localStorage.removeItem("adminSesion7Sopas");
  window.location.href = "/admin/login";
}

async function verificarAdmin() {
  const sesion = obtenerSesionAdmin();

  if (!sesion || !sesion.token || sesion.usuario?.rol !== "admin") {
    window.location.href = "/admin/login";
    return null;
  }

  try {
    const respuesta = await fetch(`${API}/usuarios/admin-verificar`, {
      headers: { "x-admin-token": sesion.token }
    });

    if (!respuesta.ok) {
      localStorage.removeItem("adminSesion7Sopas");
      window.location.href = "/admin/login";
      return null;
    }

    return sesion;
  } catch (error) {
    localStorage.removeItem("adminSesion7Sopas");
    window.location.href = "/admin/login";
    return null;
  }
}

function adminHeaders(extraHeaders = {}) {
  const sesion = obtenerSesionAdmin();
  return {
    ...extraHeaders,
    "x-admin-token": sesion?.token || ""
  };
}
