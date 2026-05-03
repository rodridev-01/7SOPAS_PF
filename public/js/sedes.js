fetch("/api/sedes")
  .then(res => res.json())
  .then(data => {

    const lista = document.getElementById("lista-sedes");
    const detalle = document.getElementById("detalle-sede");
    const select = document.getElementById("select-sedes");

    function mostrarDetalle(sede) {
      detalle.innerHTML = `
        <div class="card-body">
          <div class="mb-3">
          <img src="${sede.imagen}" 
              alt="${sede.nombre}" 
              class="w-100 rounded"
              style="height: 220px; object-fit: cover;">
        </div>
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

          <div class="mt-3">
            <a href="/reservas?sede=${sede.id}" class="btn btn-primary w-100 fw-bold">
              <i class="bi bi-calendar-check me-1"></i>
              Reservar aquí
            </a>
          </div>

        </div>
      `;
    }

    data.forEach((sede, index) => {

      // ===== LISTA DESKTOP =====
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
        mostrarDetalle(sede);
        select.value = sede.id;
      });

      lista.appendChild(item);

      // ===== SELECT MOBILE =====
      const option = document.createElement("option");
      option.value = sede.id;
      option.textContent = `${sede.nombre} - ${sede.distrito}`;
      select.appendChild(option);
    });

    // Evento select (mobile)
    select.addEventListener("change", (e) => {
      const sede = data.find(s => s.id == e.target.value);
      if (sede) mostrarDetalle(sede);
    });

    // Mostrar primera sede por defecto
    if (data.length > 0) {
      mostrarDetalle(data[0]);
      select.value = data[0].id;
    }

  })
  .catch(err => console.error(err));