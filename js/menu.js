fetch(API + "/productos")
  .then(res => res.json())
  .then(data => {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    data.forEach(p => {
      contenedor.innerHTML += `
        <div class="col-md-4">
          <div class="card mb-3">

            <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}">

            <div class="card-body">
              <h5>${p.nombre}</h5>

              <select id="size-${p.id}" class="form-select mb-2">
                <option value="personal">Personal - S/ ${p.precios.personal}</option>
                <option value="mediano">Mediano - S/ ${p.precios.mediano}</option>
                <option value="grande">Grande - S/ ${p.precios.grande}</option>
              </select>

              <button onclick="agregar(${p.id})" class="btn btn-success w-100">
                Agregar
              </button>
            </div>
          </div>
        </div>
      `;
    });
  });
