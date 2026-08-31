import React from 'react';

export default function ReservationItem({ reserva, onEditar, onEliminar, onCambiarEstado }) {
  const esConfirmada = reserva.estado === 'confirmada';
  const esCancelada = reserva.estado === 'cancelada';

  // Traduce el estado a clases CSS de badges de Bootstrap 5
  const obtenerClaseEstado = (estado) => {
    const clases = {
      pendiente: 'text-bg-warning',
      confirmada: 'text-bg-success',
      cancelada: 'text-bg-danger'
    };
    return clases[estado] || 'text-bg-secondary';
  };

  return (
    <tr className="fade-in">
      <td>{reserva.cliente}</td>
      <td>{reserva.espacio}</td>
      <td>{reserva.categoria}</td>
      <td>{reserva.fecha}</td>
      <td>{reserva.hora}</td>
      <td>{reserva.notes || reserva.notas || ''}</td>
      <td>
        <span className={`badge ${obtenerClaseEstado(reserva.estado)}`}>
          {reserva.estado}
        </span>
      </td>
      <td>
        <div className="d-flex flex-wrap gap-2">
          <button
            className="btn btn-success btn-sm"
            onClick={() => onCambiarEstado(reserva.id, 'confirmada')}
            disabled={esConfirmada || esCancelada}
          >
            Confirmar
          </button>
          <button
            className="btn btn-warning btn-sm"
            onClick={() => onCambiarEstado(reserva.id, 'cancelada')}
            disabled={esCancelada}
          >
            Cancelar
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onEditar(reserva)}
            disabled={esCancelada}
          >
            Editar
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onEliminar(reserva.id)}
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}
