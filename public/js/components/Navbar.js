class Navbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <nav class="navbar navbar-expand-lg fixed-top custom-navbar bg-white">
            <div class="container">
            <a class="navbar-brand" href="#">
                <img src="../img/logo.png" class="logo" alt="7 Sopas Logo">
            </a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="mainNavbar">
                <ul class="navbar-nav mx-auto text-center">
                <li class="nav-item"><a class="nav-link active" href="/">INICIO</a></li>
                <li class="nav-item"><a class="nav-link" href="#">SOPA DEL DIA</a></li>
                <li class="nav-item"><a class="nav-link" href="menu">NUESTRA CARTA</a></li>
                <li class="nav-item"><a class="nav-link" href="#">RESERVA</a></li>
                <li class="nav-item"><a class="nav-link" href="#">ACERCA DE</a></li>
                </ul>

                <div class="d-flex flex-column flex-lg-row align-items-center gap-3 d-none d-lg-flex">
                <div class="d-flex gap-3 social-links">
                    <a href="https://es-es.facebook.com/SieteSopas/" target="_blank" class="nav-icon"><i class="bi bi-facebook"></i></a>
                    <a href="https://www.instagram.com/sietesopas/?hl=es-la" target="_blank" class="nav-icon"><i class="bi bi-instagram"></i></a>
                    <a href="https://wa.me/51998310683?" target="_blank" class="nav-icon"><i class="bi bi-whatsapp"></i></a>
                </div>
                <div class="input-group search-group">
                    <span class="input-group-text bg-transparent border-end-0">
                        <i class="bi bi-search"></i>
                    </span>
                    <input type="text" class="form-control border-start-0" placeholder="Encuentra local">
                </div>
                </div>
            </div>
            </div>
        </nav>`;

        const links = this.querySelectorAll('.nav-link');

        links.forEach(link => {
            link.addEventListener('click', function () {
                links.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
}

customElements.define('main-navbar', Navbar);