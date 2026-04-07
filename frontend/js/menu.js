fetch(API + "/productos")
  .then(res => res.json())
  .then(data => {
    const contenedor = document.getElementById("productos");

    data.forEach(p => {
      contenedor.innerHTML += `
        <div class="col-md-4">
          <div class="card mb-3">
            <div class="card-body">
              <h5>${p.nombre}</h5>
              <p>S/ ${p.precio}</p>
              <button onclick="agregar(${p.id})" class="btn btn-success">
                Agregar
              </button>
            </div>
          </div>
        </div>
      `;
    });
  });

function agregar(id) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.push(id);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert("Agregado al carrito");
}