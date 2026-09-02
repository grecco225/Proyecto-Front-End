import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ReservationForm from './components/ReservationForm';
import ReservationList from './components/ReservationList';
import Statistics from './components/Statistics';
import SearchBar from './components/SearchBar';
import Filter from './components/Filter';
import useLocalStorage from './hooks/useLocalStorage';

function App() {
    // Estado principal: aquí vive la lista de reservas.
    // Todo el resto de la app reacciona a este estado.
    const [reservas, setReservas] = useLocalStorage('reservasApp', []);

    // Vistas de navegación: inicio, nueva reserva y reservas.
    const [vista, setVista] = useState('inicio');

    // Filtros y búsqueda para la lista.
    const [busqueda, setBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('todas');
    const [filtroEstado, setFiltroEstado] = useState('todos');

    // Mensaje de éxito para feedback visual.
    const [mensaje, setMensaje] = useState('');

    // Reserva que se está editando actualmente.
    const [reservaEditando, setReservaEditando] = useState(null);

    // Muestra un mensaje temporal en la parte superior.
    function mostrarMensaje(texto) {
        setMensaje(texto);
        setTimeout(() => setMensaje(''), 3000);
    }

    // Guarda una reserva nueva o actualiza una existente.
    function handleGuardar(reserva) {
        const reservaCompleta = {
            ...reserva,
            estado: reserva.estado || 'pendiente'
        };

        if (reservaEditando && reservaEditando.id) {
            // Actualiza la reserva cuando ya existe.
            setReservas(prev => prev.map(r => r.id === reservaEditando.id ? { ...r, ...reservaCompleta } : r));
            mostrarMensaje('Reserva actualizada con éxito.');
        } else {
            // Crea una nueva reserva con un id único basado en la fecha actual.
            setReservas(prev => [...prev, { ...reservaCompleta, id: Date.now() }]);
            mostrarMensaje('Reserva creada con éxito.');
        }

        setReservaEditando(null);
        setVista('reservas');
    }

    function handleEditar(reserva) {
        // Carga la reserva seleccionada para editarla en el formulario.
        setReservaEditando(reserva);
        setVista('nueva');
    }

    function handleCancelarEdicion() {
        // Limpia el estado de edición y vuelve a la lista.
        setReservaEditando(null);
        setVista('reservas');
    }

    function handleEliminar(id) {
        // Elimina la reserva solo si el usuario confirma la acción.
        const confirmar = window.confirm('¿Seguro que quieres eliminar esta reserva?');
        if (confirmar) {
            setReservas(prev => prev.filter(r => r.id !== id));
            mostrarMensaje('Reserva eliminada.');
        }
    }

    function handleCambiarEstado(id, nuevoEstado) {
        // Cambia el estado de una reserva sin tocar el resto de la lista.
        setReservas(prev => prev.map(r => r.id === id ? { ...r, estado: nuevoEstado } : r));
    }

    // Filtra la lista según búsqueda, categoría y estado.
    const reservasFiltradas = reservas.filter((r) => {
        const coincideBusqueda =
            r.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
            r.espacio.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria = filtroCategoria === 'todas' || r.categoria === filtroCategoria;
        const coincideEstado = filtroEstado === 'todos' || r.estado === filtroEstado;
        return coincideBusqueda && coincideCategoria && coincideEstado;
    });

    return (
        <>
            <Navbar vistaActual={vista} onCambiarVista={setVista} />

            {mensaje && (
                <div className="alert alert-success text-center mb-0 rounded-0" role="alert">
                    {mensaje}
                </div>
            )}

            <div className="container py-4">
                {vista === 'inicio' && (
                    <>
                        <div className="text-center mb-4">
                            <h1>Sistema de Gestión de Reservas</h1>
                            <p className="text-muted">
                                Aquí puedes reservar espacios y servicios, consultar su disponibilidad,
                                modificar tus reservas existentes y cancelarlas cuando lo necesites.
                                Usa el menú de arriba para crear una nueva reserva o revisar las reservas registradas.
                            </p>
                        </div>
                        <Statistics reservas={reservas} />
                    </>
                )}

                {vista === 'nueva' && (
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <h2 className="mb-4">{reservaEditando ? 'Editar reserva' : 'Nueva reserva'}</h2>
                            <ReservationForm
                                onGuardar={handleGuardar}
                                reservaEditando={reservaEditando}
                                onCancelarEdicion={handleCancelarEdicion}
                                reservasExistentes={reservas}
                            />
                        </div>
                    </div>
                )}

                {vista === 'reservas' && (
                    <>
                        <div className="row g-2 mb-3">
                            <div className="col-md-6">
                                <SearchBar valor={busqueda} onChange={setBusqueda} />
                            </div>
                            <div className="col-md-3">
                                <Filter
                                    categoria={filtroCategoria}
                                    onCategoriaChange={setFiltroCategoria}
                                    estado={filtroEstado}
                                    onEstadoChange={setFiltroEstado}
                                />
                            </div>
                        </div>

                        <ReservationList
                            reservas={reservasFiltradas}
                            totalReservasCount={reservas.length}
                            onEditar={handleEditar}
                            onEliminar={handleEliminar}
                            onCambiarEstado={handleCambiarEstado}
                        />
                    </>
                )}
            </div>

            <Footer />
        </>
    );
}

export default App;