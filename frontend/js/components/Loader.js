class Loader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="loader-overlay d-flex flex-column justify-content-center align-items-center">
            
            <div class="spinner-border text-danger" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>

            <p class="mt-3 fw-semibold text-dark">Cargando...</p>

        </div>`;
    }

    show() {
        this.classList.remove("d-none");
    }

    hide() {
        this.classList.add("d-none");
    }
}

customElements.define("app-loader", Loader);