import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ReservationForm from './components/ReservationForm';
import ReservationList from './components/ReservationList';
import Statistics from './components/Statistics';
import SearchBar from './components/SearchBar';
import Filter from './components/Filter';

function App() {
    const [reservas, setReservas] = useState([]);
    const [vista, setVista] = useState('inicio');
    const [busqueda, setBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('todas');
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [mensaje, setMensaje] = useState('');

    function mostrarMensaje(texto) {
        setMensaje(texto);
        setTimeout(() => setMensaje(''), 3000); // desaparece solo a los 3 segundos
    }

    function handleGuardar(nuevaReserva) {
        setReservas([...reservas, { ...nuevaReserva, id: Date.now(), estado: 'pendiente' }]);
        setVista('reservas');
        mostrarMensaje('Reserva creada con éxito.');
    }

    function handleEliminar(id) {
        const confirmar = window.confirm('¿Seguro que quieres eliminar esta reserva?');
        if (confirmar) {
            setReservas(reservas.filter(r => r.id !== id));
            mostrarMensaje('Reserva eliminada.');
        }
    }

    function handleCambiarEstado(id, nuevoEstado) {
        setReservas(reservas.map(r => r.id === id ? { ...r, estado: nuevoEstado } : r));
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
                            onEditar={() => { }}
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