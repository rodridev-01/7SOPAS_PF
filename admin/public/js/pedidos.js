    const API_URL = "/api/pedidos"; 
    let dataTable;

    $(document).ready(() => {
      listarPedidos();
    });

    async function listarPedidos() {
      try {
        const res = await fetch(API_URL);
        const pedidos = await res.json();
        
        if (dataTable) dataTable.destroy();

        let html = "";
        pedidos.forEach(p => {
          const fecha = new Date(p.fecha).toLocaleDateString('es-PE', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });

          const clienteNom = p.cliente ? p.cliente.nombre : `Usuario ID: ${p.usuarioId}`;
          
          const listaProds = p.productos.map(item => 
            `<div class="small">• ${item.cantidad}x ${item.nombre || 'Prod #'+item.productoId} (${item.tamaño})</div>`
          ).join("");

          html += `
            <tr>
              <td><span class="text-muted fw-bold">#${p.id}</span></td>
              <td class="small">${fecha}</td>
              <td>
                <div class="fw-bold">${clienteNom}</div>
                <div class="text-muted x-small">Sede ID: ${p.sedeId} | ${p.tipoEntrega || 'recojo'}</div>
              </td>
              <td>${listaProds}</td>
              <td class="fw-bold text-dark">S/ ${p.total?.toFixed(2) || (p.subtotal || 0).toFixed(2)}</td>
              <td>
                <span class="badge badge-${p.estado} border">
                  ${p.estado.toUpperCase()}
                </span>
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-light border" onclick="abrirModalEstado(${p.id}, '${p.estado}')">
                  <i class="bi bi-arrow-repeat text-primary"></i>
                </button>
                <button class="btn btn-sm btn-light border" onclick="eliminarPedido(${p.id})">
                  <i class="bi bi-trash text-danger"></i>
                </button>
              </td>
            </tr>`;
        });

        $('#cuerpoTabla').html(html);
        dataTable = $('#tablaPedidos').DataTable({
          language: { url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' },
          order: [[0, "desc"]] 
        });
      } catch (e) { console.error("Error cargando pedidos", e); }
    }

    function abrirModalEstado(id, estadoActual) {
      $('#pedido_id_status').val(id);
      $('#nuevo_estado_select').val(estadoActual);
      $('#modalEstado').modal('show');
    }

    async function confirmarCambioEstado() {
      const id = $('#pedido_id_status').val();
      const nuevoEstado = $('#nuevo_estado_select').val();

      const res = await fetch(`${API_URL}/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if(res.ok) {
        $('#modalEstado').modal('hide');
        listarPedidos();
      } else {
        alert("Error al actualizar estado");
      }
    }

    async function eliminarPedido(id) {
      if(confirm('¿Seguro que deseas eliminar este registro de pedido?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        listarPedidos();
      }
    }