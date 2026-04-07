let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

fetch(API + "/productos")
  .then(res => res.json())
  .then(productos => {
    const lista = document.getElementById("lista");

    carrito.forEach(id => {
      const p = productos.find(x => x.id === id);

      lista.innerHTML += `<li>${p.nombre} - S/ ${p.precio}</li>`;
    });
  });

function enviarPedido() {
  fetch(API + "/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cliente: "Cliente Web",
      productos: carrito
    })
  })
  .then(res => res.json())
  .then(() => {
    alert("Pedido enviado");
    localStorage.removeItem("carrito");
  });
}