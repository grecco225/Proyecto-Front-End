import { useState, useEffect } from 'react';
import { crearReservaVacia, validarReserva, calcularPrecioTotal, obtenerPrecioHora } from '../utils/reservationModel';

function ReservationForm({ onGuardar, reservaEditando, onCancelarEdicion, reservasExistentes }) {
    const [form, setForm] = useState(crearReservaVacia());
    const [errores, setErrores] = useState({});
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        if (reservaEditando) {
            setForm(reservaEditando);
        }
    }, [reservaEditando]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    function handleSubmit(e) {
        e.preventDefault();

        const { isValid, errors } = validarReserva(form, reservasExistentes);
        if (!isValid) {
            setErrores(errors);
            return;
        }

        setErrores({});
        setGuardando(true);

        // Simula un pequeño tiempo de guardado para dar feedback visual
        setTimeout(() => {
            onGuardar(form);
            setForm(crearReservaVacia());
            setGuardando(false);
        }, 600);
    }

    const precioHora = obtenerPrecioHora(form.categoria);
    const precioTotal = calcularPrecioTotal(form.categoria, form.duracionHoras);

    return (
        <form id="reservation-form" className="row g-3" onSubmit={handleSubmit}>

            <div className="form-grupo col-md-6">
                <label htmlFor="cliente" className="form-label">Cliente</label>
                <input
                    type="text" id="cliente" name="cliente"
                    className="form-control" placeholder="Nombre del cliente"
                    value={form.cliente} onChange={handleChange}
                />
            </div>

            <div className="form-grupo col-md-6">
                <label htmlFor="espacio" className="form-label">Espacio</label>
                <input
                    type="text" id="espacio" name="espacio"
                    className="form-control" placeholder="Ej: Sala A"
                    value={form.espacio} onChange={handleChange}
                />
            </div>

            <div className="form-grupo col-md-6">
                <label htmlFor="categoria" className="form-label">Categoría</label>
                <select
                    id="categoria" name="categoria" className="form-select"
                    value={form.categoria} onChange={handleChange}
                >
                    <option value="">Selecciona una categoría</option>
                    <option value="Sala de reuniones">Sala de reuniones</option>
                    <option value="Cancha deportiva">Cancha deportiva</option>
                    <option value="Consultorio">Consultorio</option>
                    <option value="Auditorio">Auditorio</option>
                    <option value="Espacio de coworking">Espacio de coworking</option>
                </select>
                {form.categoria && (
                    <div className="form-text">Precio por hora: ${precioHora}</div>
                )}
            </div>

            <div className="form-grupo col-md-6">
                <label htmlFor="fecha" className="form-label">Fecha</label>
                <input
                    type="date" id="fecha" name="fecha" className="form-control"
                    value={form.fecha} onChange={handleChange}
                />
                {errores.fecha && <span className="error-msg">{errores.fecha}</span>}
            </div>

            <div className="form-grupo col-md-6">
                <label htmlFor="horaInicio" className="form-label">Hora de inicio</label>
                <input
                    type="time" id="horaInicio" name="horaInicio" className="form-control"
                    value={form.horaInicio} onChange={handleChange}
                />
            </div>

            <div className="form-grupo col-md-6">
                <label htmlFor="duracionHoras" className="form-label">N° de horas</label>
                <input
                    type="number" id="duracionHoras" name="duracionHoras" min="1"
                    className="form-control"
                    value={form.duracionHoras} onChange={handleChange}
                />
                {errores.duracion && <span className="error-msg">{errores.duracion}</span>}
            </div>

            <div className="form-grupo col-12">
                <label htmlFor="notas" className="form-label">Notas</label>
                <textarea
                    id="notas" name="notas" rows="2" className="form-control"
                    placeholder="Detalles adicionales"
                    value={form.notas} onChange={handleChange}
                ></textarea>
            </div>

            {form.categoria && form.duracionHoras > 0 && (
                <div className="col-12">
                    <strong>Total estimado: ${precioTotal}</strong>
                </div>
            )}

            {errores.general && <div className="col-12"><span className="error-msg">{errores.general}</span></div>}
            {errores.conflicto && <span className="error-msg">{errores.conflicto}</span>}

            <div className="col-12">
                <button type="submit" id="submit-btn" className="btn btn-primary" disabled={guardando}>
                    {guardando ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Guardando...
                        </>
                    ) : (
                        reservaEditando ? 'Guardar cambios' : 'Crear reserva'
                    )}
                </button>
                {reservaEditando && (
                    <button type="button" className="btn btn-secondary ms-2" onClick={onCancelarEdicion} disabled={guardando}>
                        Cancelar
                    </button>
                )}
            </div>

        </form>
    );
}

export default ReservationForm;