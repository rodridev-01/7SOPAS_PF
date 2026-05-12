    const API_URL = "/api/productos"; 
    let dataTable;

    $(document).ready(() => {
      listarProductos();

      $('#formProd').on('submit', function(e) {
        e.preventDefault();
        guardarProducto();
      });
    });

    async function listarProductos() {
      const res = await fetch(API_URL);
      const productos = await res.json();
      
      if (dataTable) dataTable.destroy();
      $('#totalCuentas').text(productos.length);

      let html = "";
      productos.forEach(p => {
        html += `
          <tr>
            <td>
              <div class="d-flex align-items-center">
                <img src="${p.imagen}" class="product-img me-3" onerror="this.src='https://placehold.co/100x100?text=Sopa'">
                <div class="fw-bold text-dark">${p.nombre}</div>
              </div>
            </td>
            <td><span class="text-muted small">${p.categoria.toUpperCase()}</span></td>
            <td>
              <span class="price-tag">${p.precios.personal}</span>
              <span class="price-tag">${p.precios.mediano}</span>
              <span class="price-tag">${p.precios.grande}</span>
            </td>
            <td>
              <span class="badge ${p.disponible ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}">
                ${p.disponible ? 'Disponible' : 'Agotado'}
              </span>
            </td>
            <td class="text-end">
              <button class="btn btn-sm btn-light border" onclick='editarProducto(${JSON.stringify(p)})'>
                <i class="bi bi-pencil text-primary"></i>
              </button>
              <button class="btn btn-sm btn-light border" onclick="eliminarProducto(${p.id})">
                <i class="bi bi-trash text-danger"></i>
              </button>
            </td>
          </tr>`;
      });

      $('#cuerpoTabla').html(html);
      dataTable = $('#tablaProductos').DataTable({
        language: { url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' },
        pageLength: 8,
        lengthChange: false
      });
    }

    // Lógica del Formulario
    function nuevoProducto() {
      $('#formProd')[0].reset();
      $('#prod_id').val('');
      $('#modalTitulo').text('Agregar Sopa');
      $('#modalProd').modal('show');
    }

    function editarProducto(p) {
      $('#modalTitulo').text('Editar Producto');
      $('#prod_id').val(p.id);
      $('#prod_nombre').val(p.nombre);
      $('#prod_cat').val(p.categoria);
      $('#prod_disp').val(p.disponible.toString());
      $('#p_1').val(p.precios.personal);
      $('#p_2').val(p.precios.mediano);
      $('#p_3').val(p.precios.grande);
      $('#modalProd').modal('show');
    }

    async function guardarProducto() {
      const id = $('#prod_id').val();
      const body = {
        nombre: $('#prod_nombre').val(),
        categoria: $('#prod_cat').val(),
        disponible: $('#prod_disp').val() === "true",
        precios: {
          personal: Number($('#p_1').val()),
          mediano: Number($('#p_2').val()),
          grande: Number($('#p_3').val())
        },
        imagen: "../img/sopas/1.jpg" 
      };

      const method = id ? 'PUT' : 'POST';
      const url = id ? `${API_URL}/${id}` : API_URL;

      await fetch(url, {
        method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      });

      $('#modalProd').modal('hide');
      listarProductos();
    }

    async function eliminarProducto(id) {
      if(confirm('¿Seguro de eliminar este producto?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        listarProductos();
      }
    }