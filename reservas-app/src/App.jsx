import { useState } from 'react';
import ReservationForm from './components/ReservationForm';

function App() {
    const [reservas, setReservas] = useState([]);

    function handleGuardar(nuevaReserva) {
        setReservas([...reservas, { ...nuevaReserva, id: Date.now(), estado: 'pendiente' }]);
        console.log('Reserva guardada:', nuevaReserva);
    }

    return (
        <ReservationForm
            onGuardar={handleGuardar}
            reservaEditando={null}
            onCancelarEdicion={() => {}}
            reservasExistentes={reservas}
        />
    );
}

export default App;