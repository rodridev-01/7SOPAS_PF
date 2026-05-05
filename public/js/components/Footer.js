class Footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer class="footer bg-dark pt-5 pb-3">
            <div class="container text-white">
                <div class="row">
                <div class="col-md-4 mb-4">
                    <h5 class="fw-bold mb-3">7 Sopas</h5>
                    <p class="text-secondary">Tradición peruana en cada plato.</p>
                    <div class="d-flex gap-2 mt-4">
                    <a href="https://es-es.facebook.com/SieteSopas/" target="_blank" class="btn btn-outline-light btn-sm rounded-circle"><i class="bi bi-facebook"></i></a>
                    <a href="https://www.instagram.com/sietesopas/?hl=es-la" target="_blank" class="btn btn-outline-light btn-sm rounded-circle"><i class="bi bi-instagram"></i></a>
                    <a href="https://wa.me/51998310683" target="_blank" class="btn btn-outline-light btn-sm rounded-circle"><i class="bi bi-whatsapp"></i></a>
                    </div>
                </div>

                <div class="col-md-4 mb-4">
                    <h6 class="fw-bold mb-3">Enlaces</h6>
                    <ul class="list-unstyled">
                    <li class="mb-2"><a href="menu" class="text-secondary text-decoration-none footer-link">Menú</a></li>
                    <li class="mb-2"><a href="cart" class="text-secondary text-decoration-none footer-link">Carrito</a></li>
                    <li class="mb-2"><a href="reservas" class="text-secondary text-decoration-none footer-link">Reservas</a></li>
                    <li class="mb-2"><a href="sedes" class="text-secondary text-decoration-none footer-link">Sedes</a></li>
                    </ul>
                </div>

                <div class="col-md-4 mb-4">
                    <h6 class="fw-bold mb-3">Contacto</h6>
                    <address class="text-secondary small">
                    <p class="mb-1"><i class="bi bi-geo-alt me-2"></i>Lima, Perú</p>
                    <p class="mb-1"><i class="bi bi-telephone me-2"></i>+51 999 999 999</p>
                    <p><i class="bi bi-envelope me-2"></i>contacto@7sopas.com</p>
                    </address>
                </div>
                </div>

                <hr class="border-secondary my-4">
                <div class="text-center text-secondary">
                <small>© 2026 7 Sopas. Todos los derechos reservados.</small>
                </div>
            </div>
        </footer>`;
    }
}

customElements.define('main-footer', Footer);