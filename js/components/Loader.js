class Loader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div id="loader-container" class="loader-overlay d-flex flex-column justify-content-center align-items-center">
            <div class="sopa-container">
                <div class="bowl">
                    <div class="liquid"></div>
                </div>
            </div>
            <p class="mt-3 fw-bold text-dark text-uppercase">Cocinando tu pedido...</p>
        </div>`;

        setTimeout(() => this.hide(), 1000);
    }

    show() {
        const container = this.querySelector('#loader-container');
        container.classList.remove("hidden");
    }

    hide() {
        const container = this.querySelector('#loader-container');
        container.classList.add("hidden");
        
        setTimeout(() => this.remove(), 500); 
    }
}

customElements.define("app-loader", Loader);