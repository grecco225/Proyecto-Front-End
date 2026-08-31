function Filter({ categoria, onCategoriaChange, estado, onEstadoChange }) {
    return (
        <>
            <select
                id="filtro-categoria"
                className="form-select"
                value={categoria}
                onChange={(e) => onCategoriaChange(e.target.value)}
            >
                <option value="todas">Todas las categorías</option>
                <option value="Sala de reuniones">Sala de reuniones</option>
                <option value="Cancha deportiva">Cancha deportiva</option>
                <option value="Consultorio">Consultorio</option>
                <option value="Auditorio">Auditorio</option>
                <option value="Espacio de coworking">Espacio de coworking</option>
            </select>

            <select
                id="filtro-estado"
                className="form-select"
                value={estado}
                onChange={(e) => onEstadoChange(e.target.value)}
            >
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
            </select>
        </>
    );
}

export default Filter;