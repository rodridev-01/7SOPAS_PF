fetch("/api/sedes")
  .then(res => res.json())
  .then(data => {
    const lista = document.getElementById("lista-sedes");
    const detalle = document.getElementById("detalle-sede");

    data.forEach(sede => {

      const item = document.createElement("button");
      item.className = "list-group-item list-group-item-action";

      item.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h6 class="mb-1">${sede.nombre}</h6>
            <small class="text-muted">${sede.distrito}</small>
          </div>
          <span class="badge bg-success">${sede.estado}</span>
        </div>
      `;

      item.addEventListener("click", () => {

        detalle.innerHTML = `
          <div class="card-body">

            <h3 class="mb-3">${sede.nombre}</h3>

            <p><i class="bi bi-geo-alt"></i> ${sede.direccion}</p>
            <p><i class="bi bi-telephone"></i> ${sede.telefono}</p>

            <hr>

            <div class="row text-center mb-3">
              <div class="col">
                <div class="p-2 border rounded">
                  <strong>${sede.capacidad}</strong><br>
                  <small>Capacidad</small>
                </div>
              </div>
              <div class="col">
                <div class="p-2 border rounded">
                  <strong>${sede.mesasDisponibles}</strong><br>
                  <small>Mesas</small>
                </div>
              </div>
            </div>

            <p>
              <strong>Horario:</strong><br>
              ${sede.horario.apertura} - ${sede.horario.cierre}
            </p>

            ${sede.horario.nota ? `<p class="text-muted">${sede.horario.nota}</p>` : ""}

            <hr>

            <p>
              <strong>Servicios:</strong><br>
              ${sede.servicios.map(s =>
                `<span class="badge bg-primary me-1">${s}</span>`
              ).join("")}
            </p>

            <p class="text-muted">
              <i class="bi bi-geo"></i>
              ${sede.lat}, ${sede.lng}
            </p>

          </div>
        `;
      });

      lista.appendChild(item);
    });
  })
  .catch(err => console.error(err));