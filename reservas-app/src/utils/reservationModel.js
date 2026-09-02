export const CATEGORIAS = [
  'Sala de reuniones',
  'Cancha deportiva',
  'Consultorio',
  'Auditorio',
  'Espacio de coworking'
];

export const ESTADOS = [
  'pendiente',
  'confirmada',
  'cancelada'
];

// Precio fijo por hora según la categoría
export const PRECIOS_POR_HORA = {
  'Sala de reuniones': 8,
  'Cancha deportiva': 15,
  'Consultorio': 12,
  'Auditorio': 25,
  'Espacio de coworking': 5
};

export function obtenerPrecioHora(categoria) {
  return PRECIOS_POR_HORA[categoria] || 0;
}

export function calcularPrecioTotal(categoria, horas) {
  const precioHora = obtenerPrecioHora(categoria);
  return precioHora * (Number(horas) || 0);
}

/**
 * Retorna un objeto con la estructura de una reserva vacía.
 */
export function crearReservaVacia() {
  return {
    cliente: '',
    espacio: '',
    categoria: '',
    fecha: '',
    horaInicio: '',
    duracionHoras: 1,
    notas: '',
    estado: 'pendiente'
  };
}

/**
 * Valida una reserva contra las reglas del negocio.
 */
export function validarReserva(reserva, reservasExistentes) {
  const errors = {};

  if (!reserva.cliente?.trim() || !reserva.espacio?.trim() || !reserva.categoria || !reserva.fecha || !reserva.horaInicio) {
    errors.general = 'Por favor completa todos los campos obligatorios.';
  }

  if (!reserva.duracionHoras || reserva.duracionHoras < 1) {
    errors.duracion = 'La duración debe ser de al menos 1 hora.';
  }

  const hoy = new Date().toISOString().split('T')[0];
  if (reserva.fecha && reserva.fecha < hoy) {
    errors.fecha = 'La fecha no puede ser anterior a hoy.';
  }

  const hayConflicto = reservasExistentes.some(r =>
    r.id !== reserva.id &&
    r.espacio.trim().toLowerCase() === reserva.espacio.trim().toLowerCase() &&
    r.fecha === reserva.fecha &&
    r.horaInicio === reserva.horaInicio &&
    r.estado !== 'cancelada'
  );

  if (hayConflicto) {
    errors.conflicto = 'Ya existe una reserva activa para ese espacio, fecha y hora.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}