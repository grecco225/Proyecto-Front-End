import React, { useState } from 'react';
import ReservationItem from './ReservationItem';

const RESERVAS_POR_PAGINA = 5;

export default function ReservationList({
  reservas,
  totalReservasCount,
  onEditar,
  onEliminar,
  onCambiarEstado
}) {
  const [paginaActual, setPaginaActual] = useState(1);

  const mostrarMensajeVacio = reservas.length === 0;
  const totalPaginas = Math.ceil(reservas.length / RESERVAS_POR_PAGINA);

  // Recorta solo las reservas que van en la página actual
  const inicio = (paginaActual - 1) * RESERVAS_POR_PAGINA;
  const reservasPagina = reservas.slice(inicio, inicio + RESERVAS_POR_PAGINA);

  function irAPagina(numero) {
    setPaginaActual(numero);
  }

  return (
    <>
      <div className="table-responsive shadow-sm">
        <table id="reservacion-tabla" className="table table-hover table-bordered align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th scope="col">Cliente</th>
              <th scope="col">Espacio</th>
              <th scope="col">Categoría</th>
              <th scope="col">Fecha</th>
              <th scope="col">Hora inicio</th>
              <th scope="col">Duración</th>
              <th scope="col">Precio</th>
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
              reservasPagina.map((reserva) => (
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

      {totalPaginas > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
              <li key={numero} className={`page-item ${numero === paginaActual ? 'active' : ''}`}>
                <button className="page-link" onClick={() => irAPagina(numero)}>
                  {numero}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}