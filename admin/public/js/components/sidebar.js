class AdminSidebar extends HTMLElement {

  connectedCallback() {

    this.innerHTML = `
    
      <aside class="sidebar p-3" id="sidebar">

<div class="d-flex justify-content-between align-items-center mb-4">

  <div class="d-flex align-items-center gap-2">

          <img 
            src="/img/logo.ico" 
            alt="7 Sopas"
            style="
              width: 42px;
              height: 42px;
              object-fit: cover;
              border-radius: 10px;
            "
          >

          <div>
            <h5 class="text-white fw-bold mb-0">
              Panel Admin
            </h5>

            <small class="text-light opacity-75">
              7 Sopas
            </small>
          </div>

        </div>

        <button class="btn btn-light btn-sm d-lg-none" id="btnCloseSidebar">
          <i class="bi bi-x-lg"></i>
        </button>

      </div>

        <ul class="nav flex-column">

          <li class="nav-item">
            <a class="nav-link" href="/admin/dashboard">
              <i class="bi bi-speedometer2 me-2"></i>
              Dashboard
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link" href="/admin/productos">
              <i class="bi bi-cup-hot me-2"></i>
              Productos
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link" href="/admin/pedidos">
              <i class="bi bi-receipt me-2"></i>
              Pedidos
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link" href="/admin/reservas">
              <i class="bi bi-calendar-check me-2"></i>
              Reservas
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link" href="/admin/sedes">
              <i class="bi bi-geo-alt me-2"></i>
              Sedes
            </a>
          </li>

        </ul>

        <hr class="border-light">

        <div class="text-white small mb-3">
          Sesión iniciada como:
          <strong id="adminNombre">Administrador</strong>
        </div>

        <div class="d-grid gap-2">

          <button class="btn btn-light btn-sm" id="btnRecargar">
            Actualizar datos
          </button>

          <button class="btn btn-outline-light btn-sm" id="btnCerrarAdmin">
            Cerrar sesión
          </button>

        </div>

      </aside>
    
    `;

    this.inicializarSidebar();
  }

  inicializarSidebar() {

    const sidebar = this.querySelector("#sidebar");
    const btnClose = this.querySelector("#btnCloseSidebar");
    const btnCerrarAdmin = this.querySelector("#btnCerrarAdmin");
    const btnRecargar = this.querySelector("#btnRecargar");

    // ABRIR SIDEBAR
    const btnOpen = document.getElementById("btnOpenSidebar");

    if (btnOpen) {
      btnOpen.addEventListener("click", () => {
        sidebar.classList.add("show");
      });
    }

    // CERRAR SIDEBAR
    if (btnClose) {
      btnClose.addEventListener("click", () => {
        sidebar.classList.remove("show");
      });
    }

    // LINK ACTIVO
    const current = window.location.pathname;

    this.querySelectorAll(".nav-link").forEach(link => {
      const href = link.getAttribute("href");

      if (current.startsWith(href)) {
        link.classList.add("active");
      }
    });

    // RECARGAR
    if (btnRecargar) {
      btnRecargar.addEventListener("click", () => {
        location.reload();
      });
    }

    // CERRAR SESIÓN
    if (btnCerrarAdmin) {

      btnCerrarAdmin.addEventListener("click", () => {

        const confirmar = confirm("¿Deseas cerrar sesión?");

        if (!confirmar) return;
        localStorage.removeItem("admin");
        localStorage.removeItem("token");
        sessionStorage.clear();

        window.location.href = "/admin/login";

      });

    }

  }

}


customElements.define("admin-sidebar", AdminSidebar);