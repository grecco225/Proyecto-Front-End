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
    const [reservas, setReservas] = useLocalStorage('reservasApp', []);
    const [vista, setVista] = useState('inicio');
    const [busqueda, setBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('todas');
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [mensaje, setMensaje] = useState('');
    const [reservaEditando, setReservaEditando] = useState(null);

    function mostrarMensaje(texto) {
        setMensaje(texto);
        setTimeout(() => setMensaje(''), 3000);
    }

    function handleGuardar(reserva) {
        const reservaCompleta = {
            ...reserva,
            estado: reserva.estado || 'pendiente'
        };

        if (reservaEditando && reservaEditando.id) {
            setReservas(prev => prev.map(r => r.id === reservaEditando.id ? { ...r, ...reservaCompleta } : r));
            mostrarMensaje('Reserva actualizada con éxito.');
        } else {
            setReservas(prev => [...prev, { ...reservaCompleta, id: Date.now() }]);
            mostrarMensaje('Reserva creada con éxito.');
        }

        setReservaEditando(null);
        setVista('reservas');
    }

    function handleEditar(reserva) {
        setReservaEditando(reserva);
        setVista('nueva');
    }

    function handleCancelarEdicion() {
        setReservaEditando(null);
        setVista('reservas');
    }

    function handleEliminar(id) {
        const confirmar = window.confirm('¿Seguro que quieres eliminar esta reserva?');
        if (confirmar) {
            setReservas(prev => prev.filter(r => r.id !== id));
            mostrarMensaje('Reserva eliminada.');
        }
    }

    function handleCambiarEstado(id, nuevoEstado) {
        setReservas(prev => prev.map(r => r.id === id ? { ...r, estado: nuevoEstado } : r));
    }

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