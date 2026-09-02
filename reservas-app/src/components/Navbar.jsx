function Navbar({ vistaActual, onCambiarVista }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
            <div className="container-fluid justify-content-center">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <button
                            className={`nav-link btn btn-link ${vistaActual === 'inicio' ? 'fw-bold' : ''}`}
                            onClick={() => onCambiarVista('inicio')}
                        >
                            Inicio
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link btn btn-link ${vistaActual === 'nueva' ? 'fw-bold' : ''}`}
                            onClick={() => onCambiarVista('nueva')}
                        >
                            Nueva Reserva
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link btn btn-link ${vistaActual === 'reservas' ? 'fw-bold' : ''}`}
                            onClick={() => onCambiarVista('reservas')}
                        >
                            Reservas
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;