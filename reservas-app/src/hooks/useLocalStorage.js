import { useState } from 'react';

// Hook personalizado para leer y guardar datos en localStorage.
// Esto permite que la app recuerde las reservas aunque se recargue la página.
function useLocalStorage(key, initialValue) {
    // Se ejecuta solo al iniciar el componente.
    // Intenta leer el valor guardado; si no existe, usa el valor inicial.
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error al leer localStorage:', error);
            return initialValue;
        }
    });

    // Guarda el valor actualizado en localStorage.
    // value instanceof Function permite pasar una función como setState.
    const setValue = (value) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;

            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    };

    return [storedValue, setValue];
}

export default useLocalStorage;