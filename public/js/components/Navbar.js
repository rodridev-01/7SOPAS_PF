class Navbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <nav class="navbar navbar-expand-lg fixed-top custom-navbar bg-white">
            <div class="container">
            <a class="navbar-brand" href="/">
                <img src="../img/logo.png" class="logo" alt="7 Sopas Logo">
            </a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="mainNavbar">
                <ul class="navbar-nav mx-auto text-center">
                    <li class="nav-item"><a class="nav-link" href="/">INICIO</a></li>
                    <li class="nav-item"><a class="nav-link" href="menu">NUESTRA CARTA</a></li>
                    <li class="nav-item"><a class="nav-link" href="reservas">RESERVA</a></li>
                    <li class="nav-item"><a class="nav-link" href="sedes">SEDES</a></li>
                    <li class="nav-item"><a class="nav-link" href="about">ACERCA DE</a></li>
                </ul>

                <div class="d-flex flex-column flex-lg-row align-items-center gap-3 ms-lg-auto">

                    <!-- 🛒 CARRITO DESTACADO -->
                    <a href="cart" class="btn btn-danger position-relative fw-bold px-3">
                        <i class="bi bi-cart3"></i>
                        <span id="cartCount" class="cart-badge">0</span>
                    </a>

                    <div class="d-flex gap-3 social-links">
                        <a href="https://es-es.facebook.com/SieteSopas/" target="_blank" class="nav-icon"><i class="bi bi-facebook"></i></a>
                        <a href="https://www.instagram.com/sietesopas/?hl=es-la" target="_blank" class="nav-icon"><i class="bi bi-instagram"></i></a>
                        <a href="https://wa.me/51998310683?" target="_blank" class="nav-icon"><i class="bi bi-whatsapp"></i></a>
                    </div>

                    <a href="login" class="btn btn-sm btn-outline-danger" id="loginLink">Login</a>

                    <div class="user-session d-none" id="userSession">
                        <span class="small fw-bold" id="userGreeting"></span>
                        <button class="btn btn-sm btn-outline-secondary" id="logoutBtn">Salir</button>
                    </div>

                </div>
            </div>
            </div>
        </nav>`;

        const currentPath = window.location.pathname;
        const links = this.querySelectorAll('.nav-link');

        links.forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href === '#') {
                link.classList.remove('active');
                return;
            }
            const linkPath = new URL(link.href).pathname;
            link.classList.toggle('active', linkPath === currentPath);
        });

        this.actualizarContadorCarrito();
        this.actualizarSesionUsuario();
        window.addEventListener("carritoActualizado", () => this.actualizarContadorCarrito());
        window.addEventListener("storage", () => this.actualizarContadorCarrito());
    }

    actualizarSesionUsuario() {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        const loginLink = this.querySelector("#loginLink");
        const userSession = this.querySelector("#userSession");
        const userGreeting = this.querySelector("#userGreeting");
        const logoutBtn = this.querySelector("#logoutBtn");

        if (usuario) {
            loginLink?.classList.add("d-none");
            userSession?.classList.remove("d-none");
            if (userGreeting) userGreeting.textContent = `Hola, ${usuario.nombre}`;
            logoutBtn?.addEventListener("click", () => {
                localStorage.removeItem("usuario");
                window.location.href = "/";
            });
        } else {
            loginLink?.classList.remove("d-none");
            userSession?.classList.add("d-none");
        }
    }

    actualizarContadorCarrito() {
        const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const totalItems = carrito.reduce((total, item) => total + Number(item.cantidad || 0), 0);
        const badge = this.querySelector("#cartCount");

        if (!badge) return;

        badge.textContent = totalItems;
        badge.classList.toggle("d-none", totalItems === 0);
    }
}

customElements.define('main-navbar', Navbar);
