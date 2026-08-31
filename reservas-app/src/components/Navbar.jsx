function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
            <div className="container-fluid justify-content-center">
                <ul className="navbar-nav">
                    <li className="nav-item"><a className="nav-link" href="#form-section">Nueva Reserva</a></li>
                    <li className="nav-item"><a className="nav-link" href="#reservas-seccion">Reservas</a></li>
                    <li className="nav-item"><a className="nav-link" href="#estado-seccion">Estadísticas</a></li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;