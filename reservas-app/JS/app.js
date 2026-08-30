// ============================================
// PARTE 1 — Referencias al DOM + estado inicial
// ============================================

// Referencias a elementos del DOM
const form = document.getElementById('reservation-form');
const tbody = document.getElementById('reservacion-tbody');
const submitBtn = document.getElementById('submit-btn');

// Inputs del formulario
const inputCliente = document.getElementById('cliente');
const inputEspacio = document.getElementById('espacio');
const inputCategoria = document.getElementById('categoria');
const inputFecha = document.getElementById('fecha');
const inputHora = document.getElementById('hora');
const inputNotas = document.getElementById('notas');

// Mensajes de error cercanos a los campos (Módulo 5)
const errorFecha = document.getElementById('error-fecha');
const errorConflicto = document.getElementById('error-conflicto');

// Buscador y filtros (Módulos 2 y 3)
const inputBuscador = document.getElementById('buscador');
const selectFiltroCategoria = document.getElementById('filtro-categoria');
const selectFiltroEstado = document.getElementById('filtro-estado');

// Contenedor de estadísticas (Módulo 4)
const statsContenedor = document.getElementById('estadisticas-contenido');

// Estado de la app: array de reservas, cargado desde LocalStorage (o vacío si no hay nada)
let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

// Para saber si estamos editando una reserva existente (null = modo "crear")
let idEditando = null;

// Estado de los filtros (búsqueda, categoría, estado)
let textoBusqueda = '';
let filtroCategoria = 'todas';
let filtroEstado = 'todos';


// ============================================
// PARTE 2 — Utilidades: generar ID y guardar en LocalStorage
// ============================================

// Genera un ID único simple para cada reserva
function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Persiste el array actual de reservas en LocalStorage
function guardarEnLocalStorage() {
    localStorage.setItem('reservas', JSON.stringify(reservas));
}

// Traduce el estado de una reserva a una clase de color de Bootstrap
function obtenerClaseEstado(estado) {
    const clases = {
        pendiente: 'text-bg-warning',
        confirmada: 'text-bg-success',
        cancelada: 'text-bg-danger'
    };
    return clases[estado] || 'text-bg-secondary';
}


// ============================================
// PARTE 3 — Renderizar la tabla de reservas
// ============================================

function renderizarTabla(lista = reservas) {
    // Se limpia la tabla antes de volver a pintarla
    tbody.innerHTML = '';

    // Si la lista (ya filtrada) está vacía, se muestra un mensaje de texto
    if (lista.length === 0) {
        // El texto cambia según si no hay reservas en absoluto o si el filtro no encontró nada
        const mensaje = reservas.length === 0
            ? 'No hay reservas disponibles o registradas todavía.'
            : 'No hay reservas que coincidan con la búsqueda o los filtros.';

        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center; color: var(--color-text-light); padding: 1.5rem;">
                    ${mensaje}
                </td>
            </tr>
        `;
        return;
    }

    // Por cada reserva de la lista recibida, se crea una fila y se inserta en el tbody
    lista.forEach(reserva => {
        const fila = document.createElement('tr');
        fila.classList.add('fade-in');
        fila.dataset.id = reserva.id;
        fila.innerHTML = `
            <td>${reserva.cliente}</td>
            <td>${reserva.espacio}</td>
            <td>${reserva.categoria}</td>
            <td>${reserva.fecha}</td>
            <td>${reserva.hora}</td>
            <td>${reserva.notas || ''}</td>
            <td><span class="badge ${obtenerClaseEstado(reserva.estado)}">${reserva.estado}</span></td>
            <td>
                <div class="d-flex flex-wrap gap-2">
                    <button class="btn btn-success btn-sm" data-action="confirmar">Confirmar</button>
                    <button class="btn btn-warning btn-sm" data-action="cancelar">Cancelar</button>
                    <button class="btn btn-primary btn-sm" data-action="editar">Editar</button>
                    <button class="btn btn-danger btn-sm" data-action="eliminar">Eliminar</button>
                </div>
            </td>
        `;
        tbody.appendChild(fila);
    });
}


// ============================================
// PARTE 3.1 — Búsqueda + filtros combinados (Módulos 2 y 3)
// ============================================

function obtenerReservasFiltradas() {
    return reservas.filter(reserva => {
        const coincideTexto =
            reserva.cliente.toLowerCase().includes(textoBusqueda) ||
            reserva.espacio.toLowerCase().includes(textoBusqueda);

        const coincideCategoria = filtroCategoria === 'todas' || reserva.categoria === filtroCategoria;
        const coincideEstado = filtroEstado === 'todos' || reserva.estado === filtroEstado;

        return coincideTexto && coincideCategoria && coincideEstado;
    });
}


// ============================================
// PARTE 3.2 — Estadísticas (Módulo 4)
// ============================================

function calcularEstadisticas() {
    const total = reservas.length;
    const porEstado = { pendiente: 0, confirmada: 0, cancelada: 0 };
    const porCategoria = {};

    reservas.forEach(reserva => {
        porEstado[reserva.estado] = (porEstado[reserva.estado] || 0) + 1;
        porCategoria[reserva.categoria] = (porCategoria[reserva.categoria] || 0) + 1;
    });

    return { total, porEstado, porCategoria };
}

function crearTarjetaEstadistica(numero, etiqueta, colorTexto) {
    return `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
            <div class="card h-100 shadow-sm border-0 text-center">
                <div class="card-body">
                    <p class="display-6 fw-bold ${colorTexto} mb-1">${numero}</p>
                    <p class="card-text text-muted mb-0">${etiqueta}</p>
                </div>
            </div>
        </div>
    `;
}

function renderizarEstadisticas() {
    const { total, porEstado, porCategoria } = calcularEstadisticas();

    let tarjetasCategoria = '';
    for (const categoria in porCategoria) {
        tarjetasCategoria += crearTarjetaEstadistica(porCategoria[categoria], categoria, 'text-secondary');
    }

    statsContenedor.innerHTML = `
        ${crearTarjetaEstadistica(total, 'Total de reservas', 'text-primary')}
        ${crearTarjetaEstadistica(porEstado.pendiente, 'Pendientes', 'text-warning')}
        ${crearTarjetaEstadistica(porEstado.confirmada, 'Confirmadas', 'text-success')}
        ${crearTarjetaEstadistica(porEstado.cancelada, 'Canceladas', 'text-danger')}
        ${tarjetasCategoria}
    `;
}


// ============================================
// PARTE 3.3 — Refresca tabla (con filtros) y estadísticas juntas
// ============================================

function actualizarVista() {
    renderizarTabla(obtenerReservasFiltradas());
    renderizarEstadisticas();
}


// ============================================
// PARTE 4 — Evento submit del formulario (crear / editar reserva)
// ============================================

form.addEventListener('submit', function (evento) {
    evento.preventDefault(); // evita que la página se recargue

    // Se limpian los mensajes de error de un intento anterior
    errorFecha.textContent = '';
    errorConflicto.textContent = '';

    // Construimos el objeto reserva con los valores actuales del formulario
    const nuevaReserva = {
        id: idEditando || generarId(),
        cliente: inputCliente.value.trim(),
        espacio: inputEspacio.value.trim(),
        categoria: inputCategoria.value,
        fecha: inputFecha.value,
        hora: inputHora.value,
        estado: 'pendiente',
        notas: inputNotas.value.trim()
    };

    // Validación básica adicional (más allá de lo que ya hace HTML5 con "required")
    if (!nuevaReserva.cliente || !nuevaReserva.espacio || !nuevaReserva.categoria || !nuevaReserva.fecha || !nuevaReserva.hora) {
        alert('Por favor completa todos los campos obligatorios.');
        return;
    }

    // Módulo 5: la fecha no puede ser anterior a hoy
    const hoy = new Date().toISOString().split('T')[0];
    if (nuevaReserva.fecha < hoy) {
        errorFecha.textContent = 'La fecha no puede ser anterior a hoy.';
        return;
    }

    // Módulo 5: no permitir dos reservas activas para el mismo espacio, fecha y hora
    const hayConflicto = reservas.some(reserva =>
        reserva.id !== nuevaReserva.id &&
        reserva.espacio === nuevaReserva.espacio &&
        reserva.fecha === nuevaReserva.fecha &&
        reserva.hora === nuevaReserva.hora &&
        reserva.estado !== 'cancelada'
    );

    if (hayConflicto) {
        errorConflicto.textContent = 'Ya existe una reserva activa para ese espacio, fecha y hora.';
        return;
    }

    if (idEditando) {
        // Modo edición: buscamos la reserva existente y la reemplazamos
        // (se conserva el estado actual: editar no debe regresar una reserva confirmada a "pendiente")
        const indice = reservas.findIndex(r => r.id === idEditando);
        reservas[indice] = { ...reservas[indice], ...nuevaReserva, estado: reservas[indice].estado };
        idEditando = null;
        submitBtn.textContent = 'Crear reserva';
    } else {
        // Modo creación: agregamos la nueva reserva al array
        reservas.push(nuevaReserva);
    }

    guardarEnLocalStorage();
    actualizarVista();
    form.reset(); // limpia todos los campos del formulario
});


// ============================================
// PARTE 5 — Acciones sobre reservas existentes: editar, eliminar, confirmar, cancelar (Módulo 1)
// ============================================

// Un único listener sobre el tbody (delegación de eventos), en vez de uno por botón
tbody.addEventListener('click', function (evento) {
    const accion = evento.target.dataset.action;
    if (!accion) return; // el clic no fue sobre un botón de acción

    const fila = evento.target.closest('tr');
    const id = fila.dataset.id;

    if (accion === 'eliminar') {
        const confirmado = confirm('¿Seguro que deseas eliminar esta reserva?');
        if (!confirmado) return;

        reservas = reservas.filter(reserva => reserva.id !== id);
        guardarEnLocalStorage();
        actualizarVista();
        return;
    }

    if (accion === 'confirmar' || accion === 'cancelar') {
        const reserva = reservas.find(reserva => reserva.id === id);
        if (!reserva) return;

        reserva.estado = accion === 'confirmar' ? 'confirmada' : 'cancelada';
        guardarEnLocalStorage();
        actualizarVista();
        return;
    }

    if (accion === 'editar') {
        const reserva = reservas.find(reserva => reserva.id === id);
        if (!reserva) return;

        // Se cargan los valores de la reserva en el formulario
        inputCliente.value = reserva.cliente;
        inputEspacio.value = reserva.espacio;
        inputCategoria.value = reserva.categoria;
        inputFecha.value = reserva.fecha;
        inputHora.value = reserva.hora;
        inputNotas.value = reserva.notas;

        idEditando = reserva.id;
        submitBtn.textContent = 'Guardar cambios';
        form.scrollIntoView({ behavior: 'smooth' });
    }
});


// ============================================
// PARTE 6 — Escuchar búsqueda y filtros (Módulos 2 y 3)
// ============================================

inputBuscador.addEventListener('input', function () {
    textoBusqueda = inputBuscador.value.trim().toLowerCase();
    actualizarVista();
});

selectFiltroCategoria.addEventListener('change', function () {
    filtroCategoria = selectFiltroCategoria.value;
    actualizarVista();
});

selectFiltroEstado.addEventListener('change', function () {
    filtroEstado = selectFiltroEstado.value;
    actualizarVista();
});


// ============================================
// INICIALIZACIÓN
// ============================================

// Pinta la tabla y las estadísticas con lo que ya esté guardado en LocalStorage al cargar la página
actualizarVista();