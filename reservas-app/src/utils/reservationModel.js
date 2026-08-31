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

/**
 * Retorna un objeto con la estructura de una reserva vacía.
 */
export function crearReservaVacia() {
  return {
    cliente: '',
    espacio: '',
    categoria: '',
    fecha: '',
    hora: '',
    notas: '',
    estado: 'pendiente'
  };
}

/**
 * Valida una reserva contra las reglas del negocio.
 * @param {Object} reserva - La reserva actual que se está validando.
 * @param {Array} reservasExistentes - La lista completa de reservas actuales.
 * @returns {Object} Un objeto con { isValid: boolean, errors: { [key]: string } }
 */
export function validarReserva(reserva, reservasExistentes) {
  const errors = {};

  // 1. Campos obligatorios
  if (!reserva.cliente?.trim() || !reserva.espacio?.trim() || !reserva.categoria || !reserva.fecha || !reserva.hora) {
    errors.general = 'Por favor completa todos los campos obligatorios.';
  }

  // 2. La fecha no puede ser anterior a hoy
  const hoy = new Date().toISOString().split('T')[0];
  if (reserva.fecha && reserva.fecha < hoy) {
    errors.fecha = 'La fecha no puede ser anterior a hoy.';
  }

  // 3. No permitir conflictos de horario (mismo espacio, fecha y hora en reservas activas)
  const hayConflicto = reservasExistentes.some(r =>
    r.id !== reserva.id &&
    r.espacio.trim().toLowerCase() === reserva.espacio.trim().toLowerCase() &&
    r.fecha === reserva.fecha &&
    r.hora === reserva.hora &&
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
