const API_URL = "/api/reservas";
let dataTable;
$(document).ready(() => listarReservas());
async function listarReservas() {
    try {
        const res = await fetch(API_URL);
        const reservas = await res.json();
        if (dataTable) dataTable.destroy();
        let html = "";
        reservas.forEach(r => {
            const clienteNom = r.cliente ? r.cliente.nombre : `Usuario ID: ${r.usuarioId}`;
            html += `
            <tr>
                <td><span class="fw-bold text-muted">#${r.id}</span></td>
                <td>
                    <div class="fw-bold">${clienteNom}</div>
                    <div class="small text-muted">${r.cliente?.telefono || ""}</div>
                </td>
                <td><div class="fw-bold">${r.sedeNombre || "Sede #" + r.sedeId}</div></td>
                <td>${r.fecha}</td>
                <td>${r.hora}</td>
                <td>${r.personas} personas</td>
                <td><span class="badge badge-${r.estado} border">${r.estado.toUpperCase()}</span></td>
                <td class="text-end">
                    <button class="btn btn-sm btn-light border" onclick="abrirModalEstado(${r.id}, '${r.estado}')"><i class="bi bi-arrow-repeat text-primary"></i></button>
                    <button class="btn btn-sm btn-light border" onclick="eliminarReserva(${r.id})"><i class="bi bi-trash text-danger"></i></button>
                </td>
            </tr>`;
        });
        $('#cuerpoTabla').html(html);
        dataTable = $('#tablaReservas').DataTable({
            language: { url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' },
            order: [[0, "desc"]]
        });
    } catch (e) {
        console.error("Error cargando reservas", e);
    }
}
function abrirModalEstado(id, estadoActual) {
    $('#reserva_id_status').val(id);
    $('#nuevo_estado_select').val(estadoActual);
    $('#modalEstado').modal('show');
}
async function confirmarCambioEstado() {
    const id = $('#reserva_id_status').val();
    const nuevoEstado = $('#nuevo_estado_select').val();
    const res = await fetch(`${API_URL}/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
    });
    if (res.ok) {
        $('#modalEstado').modal('hide');
        listarReservas();
    } else {
        alert("Error al actualizar estado");
    }
}
async function eliminarReserva(id) {
    if (confirm('¿Seguro que deseas eliminar esta reserva?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        listarReservas();
    }
}