function SearchBar({ valor, onChange }) {
    return (
        <input
            type="text"
            id="buscador"
            className="form-control"
            placeholder="Buscar por cliente o espacio..."
            value={valor}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}

export default SearchBar;