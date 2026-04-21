fetch(API + "/pedidos")
  .then(res => res.json())
  .then(data => {
    const lista = document.getElementById("pedidos");

    data.forEach(p => {
      lista.innerHTML += `
        <li>
          Pedido ${p.id} - Estado: ${p.estado}
        </li>
      `;
    });
  });