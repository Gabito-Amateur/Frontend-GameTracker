import { useState, useEffect } from "react";
import "./FormularioJuego.css";

export default function FormularioJuego({ onClose, onSubmit, juegoInicial }) {
    const [formData, setFormData] = useState({
        titulo: "",
        imagenPortada: "",
        genero: "",
        plataforma: "",
        anoLanzamiento: new Date().getFullYear(),
        desarrollador: "",
        descripcion: "",
        completado: false,
    });

    const esEdicion = !!juegoInicial;

    useEffect(() => {
        if (juegoInicial) {
            setFormData({
                titulo: juegoInicial.titulo || "",
                imagenPortada: juegoInicial.imagenPortada || "",
                genero: juegoInicial.genero || "",
                plataforma: juegoInicial.plataforma || "",
                anoLanzamiento: juegoInicial.anoLanzamiento || new Date().getFullYear(),
                desarrollador: juegoInicial.desarrollador || "",
                descripcion: juegoInicial.descripcion || "",
                completado: juegoInicial.completado || false,
            });
        }
    }, [juegoInicial]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : name === "anoLanzamiento" ? parseInt(value) : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{esEdicion ? "✏️ Editar juego" : "➕ Agregar nuevo juego"}</h2>
                    <button onClick={onClose}>✖</button>
                </div>
                <form className="form-juego" onSubmit={handleSubmit}>
                    <label>
                        Título:
                        <input
                            type="text"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        URL de portada:
                        <input
                            type="text"
                            name="imagenPortada"
                            value={formData.imagenPortada}
                            onChange={handleChange}
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                    </label>

                    <label>
                        Género:
                        <select
                            name="genero"
                            value={formData.genero}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecciona un género</option>
                            {["Acción", "RPG", "Estrategia", "Aventura", "Deportes", "Puzzle", "Carreras", "Simulación", "Terror", "Plataformas", "Shooter", "MMORPG", "Otro"].map((g) => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Plataforma:
                        <select
                            name="plataforma"
                            value={formData.plataforma}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecciona una plataforma</option>
                            {["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile", "Multi-plataforma"].map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Año de lanzamiento:
                        <input
                            type="number"
                            name="anoLanzamiento"
                            value={formData.anoLanzamiento}
                            onChange={handleChange}
                            min="1970"
                            max={new Date().getFullYear() + 2}
                            required
                        />
                    </label>

                    <label>
                        Desarrollador:
                        <input
                            type="text"
                            name="desarrollador"
                            value={formData.desarrollador}
                            onChange={handleChange}
                            placeholder="Ej: Nintendo"
                            required
                        />
                    </label>

                    <label>
                        Descripción:
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Escribe una breve descripción del juego..."
                            required
                            rows="4"
                        />
                    </label>

                    <label className="checkbox">
                        <input
                            type="checkbox"
                            name="completado"
                            checked={formData.completado}
                            onChange={handleChange}
                        />
                        Marcar como completado
                    </label>

                    <button type="submit" className="btn-guardar">
                        {esEdicion ? "💾 Guardar cambios" : "💾 Guardar juego"}
                    </button>
                </form>
            </div>
        </div>
    );
}
