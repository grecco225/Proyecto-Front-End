import React from 'react';
import ReservationItem from './ReservationItem';

export default function ReservationList({
  reservas,
  totalReservasCount,
  onEditar,
  onEliminar,
  onCambiarEstado
}) {
  const mostrarMensajeVacio = reservas.length === 0;

  return (
    <div className="table-responsive shadow-sm">
      <table className="table table-hover table-bordered align-middle mb-0">
        <thead className="table-dark">
          <tr>
            <th scope="col">Cliente</th>
            <th scope="col">Espacio</th>
            <th scope="col">Categoría</th>
            <th scope="col">Fecha</th>
            <th scope="col">Hora</th>
            <th scope="col">Notas</th>
            <th scope="col">Estado</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mostrarMensajeVacio ? (
            <tr>
              <td colSpan="8" className="text-center py-4 text-muted">
                {totalReservasCount === 0
                  ? 'No hay reservas disponibles o registradas todavía.'
                  : 'No hay reservas que coincidan con la búsqueda o los filtros.'}
              </td>
            </tr>
          ) : (
            reservas.map((reserva) => (
              <ReservationItem
                key={reserva.id}
                reserva={reserva}
                onEditar={onEditar}
                onEliminar={onEliminar}
                onCambiarEstado={onCambiarEstado}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
