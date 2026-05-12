let productosDisponibles = [];

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  window.dispatchEvent(new Event("carritoActualizado"));
}

function normalizarTamaño(tamaño) {
  const nombres = {
    personal: "Personal",
    mediano: "Mediano",
    grande: "Grande"
  };

  return nombres[tamaño] || tamaño;
}

function agregar(idProducto) {
  const producto = productosDisponibles.find((p) => Number(p.id) === Number(idProducto));

  if (!producto) {
    alert("No se pudo encontrar el producto seleccionado.");
    return;
  }

  const select = document.getElementById(`size-${idProducto}`);
  const tamaño = select.value;
  const precio = Number(producto.precios[tamaño]);
  const carrito = obtenerCarrito();

  const itemExistente = carrito.find(
    (item) => Number(item.productoId) === Number(idProducto) && item.tamaño === tamaño
  );

  if (itemExistente) {
    itemExistente.cantidad += 1;
    itemExistente.subtotal = itemExistente.cantidad * itemExistente.precioUnitario;
  } else {
    carrito.push({
      productoId: producto.id,
      nombre: producto.nombre,
      imagen: producto.imagen,
      tamaño,
      precioUnitario: precio,
      cantidad: 1,
      subtotal: precio
    });
  }

  guardarCarrito(carrito);
  alert(`${producto.nombre} (${normalizarTamaño(tamaño)}) agregado al carrito.`);
}

fetch(API + "/productos")
  .then((res) => res.json())
  .then((data) => {
    productosDisponibles = data.filter((p) => p.disponible);
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    productosDisponibles.forEach((p) => {
      contenedor.innerHTML += `
        <div class="col-md-4">
          <div class="card mb-3 h-100 product-card">
            <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}">
            <div class="card-body d-flex flex-column">
              <h5>${p.nombre}</h5>
              <p class="text-muted small mb-3">Elige el tamaño y agrégalo a tu pedido.</p>

              <select id="size-${p.id}" class="form-select mb-3">
                <option value="personal">Personal - S/ ${Number(p.precios.personal).toFixed(2)}</option>
                <option value="mediano">Mediano - S/ ${Number(p.precios.mediano).toFixed(2)}</option>
                <option value="grande">Grande - S/ ${Number(p.precios.grande).toFixed(2)}</option>
              </select>

              <button onclick="agregar(${p.id})" class="btn btn-success w-100 mt-auto">
                <i class="bi bi-cart-plus"></i> Agregar
              </button>
            </div>
          </div>
        </div>
      `;
    });
  })
  .catch(() => {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = `
      <div class="col-12">
        <div class="alert alert-danger">
          No se pudo cargar la carta. Verifica que el servidor esté activo.
        </div>
      </div>
    `;
  });