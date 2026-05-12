const API_URL = "/api/sedes";
let dataTable;

$(document).ready(() => {
    listarSedes();
    $('#formSede').on('submit', (e) => {
        e.preventDefault();
        guardarSede();
    });
});

async function listarSedes() {
    const res = await fetch(API_URL);
    const sedes = await res.json();

    if (dataTable) dataTable.destroy();

    let html = "";
    sedes.forEach(s => {
        const numMesas = s.mesas !== undefined ? s.mesas : (s.capacidad || 0);
        const esActivo = s.activo !== undefined ? s.activo : (s.estado === 'abierto');

        html += `
        <tr>
          <td class="fw-bold text-dark">${s.nombre}</td>
          <td>${s.distrito}</td>
          <td class="text-muted small">${s.direccion}</td>
          <td><span class="badge bg-light text-dark border">${numMesas} mesas</span></td>
          <td>
            <span class="badge ${esActivo ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}">
              ${esActivo ? 'Operativo' : 'Cerrado'}
            </span>
          </td>
          <td class="text-end">
            <button class="btn btn-sm btn-light border" onclick='editarSede(${JSON.stringify(s)})'>
              <i class="bi bi-pencil text-primary"></i>
            </button>
            <button class="btn btn-sm btn-light border" onclick="eliminarSede(${s.id})">
              <i class="bi bi-trash text-danger"></i>
            </button>
          </td>
        </tr>`;
    });

    $('#cuerpoTabla').html(html);
    dataTable = $('#tablaSedes').DataTable({
        language: { url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' },
        pageLength: 10
    });
}

function nuevaSede() {
    $('#formSede')[0].reset();
    $('#sede_id').val('');
    $('#modalTitulo').text('Agregar Nueva Sede');
    $('#modalSede').modal('show');
}

function editarSede(s) {
    $('#modalTitulo').text('Editar Sede');
    $('#sede_id').val(s.id);
    $('#sede_nombre').val(s.nombre);
    $('#sede_distrito').val(s.distrito);
    $('#sede_direccion').val(s.direccion);

    $('#sede_mesas').val(s.mesas !== undefined ? s.mesas : s.capacidad);

    const esActivo = s.activo !== undefined ? s.activo : (s.estado === 'abierto');
    $('#sede_estado').val(esActivo.toString());

    $('#modalSede').modal('show');
}

async function guardarSede() {
    const id = $('#sede_id').val();

    const body = {
        nombre: $('#sede_nombre').val(),
        distrito: $('#sede_distrito').val(),
        direccion: $('#sede_direccion').val(),
        mesas: Number($('#sede_mesas').val()),
        activo: $('#sede_estado').val() === "true",
        capacidad: Number($('#sede_mesas').val()),
        estado: $('#sede_estado').val() === "true" ? "abierto" : "cerrado"
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (res.ok) {
        $('#modalSede').modal('hide');
        listarSedes();
    }
}

async function eliminarSede(id) {
    if (confirm('¿Deseas eliminar esta sede permanentemente?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        listarSedes();
    }
}