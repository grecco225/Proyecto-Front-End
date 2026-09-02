import React from 'react';

export default function Statistics({ reservas }) {
  // Este componente calcula los indicadores del dashboard a partir del estado actual de reservas.
  // La clave es que no guarda números manualmente; los recalcula cada vez que cambia la lista.

  // 1. Inicialización de contadores.
  const total = reservas.length;
  const porEstado = { pendiente: 0, confirmada: 0, cancelada: 0 };
  const porCategoria = {};

  // 2. Acumulación de totales: recorre la lista completa y cuenta por estado y categoría.
  reservas.forEach((reserva) => {
    if (reserva.estado in porEstado) {
      porEstado[reserva.estado]++;
    }
    if (reserva.categoria) {
      porCategoria[reserva.categoria] = (porCategoria[reserva.categoria] || 0) + 1;
    }
  });

  // Función auxiliar para renderizar cada tarjeta del dashboard.
  const renderCard = (numero, etiqueta, colorTexto) => (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={etiqueta}>
      <div className="card h-100 shadow-sm border-0 text-center">
        <div className="card-body">
          <p className={`display-6 fw-bold ${colorTexto} mb-1`}>{numero}</p>
          <p className="card-text text-muted mb-0">{etiqueta}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="row g-3">
      {renderCard(total, 'Total de reservas', 'text-primary')}
      {renderCard(porEstado.pendiente, 'Pendientes', 'text-warning')}
      {renderCard(porEstado.confirmada, 'Confirmadas', 'text-success')}
      {renderCard(porEstado.cancelada, 'Canceladas', 'text-danger')}
      
      {/* Tarjetas dinámicas para cada categoría */}
      {Object.entries(porCategoria).map(([categoria, cantidad]) => 
        renderCard(cantidad, categoria, 'text-secondary')
      )}
    </div>
  );
}
