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

    const [charCount, setCharCount] = useState(0);
    const maxChars = 500;

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
            setCharCount((juegoInicial.descripcion || "").length);
        }
    }, [juegoInicial]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Actualizar contador de caracteres para descripción
        if (name === "descripcion") {
            setCharCount(value.length);
        }

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

    const getCharCounterClass = () => {
        if (charCount > maxChars) return "char-counter error";
        if (charCount > maxChars * 0.8) return "char-counter warning";
        return "char-counter";
    };

    return (
        <div className="modal-overlay-form" onClick={onClose}>
            <div className="modal-content-form" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-form">
                    <h2>
                        <span>{esEdicion ? "✏️" : "➕"}</span>
                        {esEdicion ? "Editar juego" : "Agregar nuevo juego"}
                    </h2>
                    <button onClick={onClose} aria-label="Cerrar">✖</button>
                </div>

                <form className="form-juego" onSubmit={handleSubmit}>
                    {/* Título */}
                    <label>
                        <span>
                            🎮 Título del juego
                            <span className="required-indicator">*</span>
                        </span>
                        <input
                            type="text"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            placeholder="Ej: The Legend of Zelda"
                            required
                            autoFocus
                        />
                    </label>

                    {/* URL de portada */}
                    <label>
                        <span>🖼️ URL de la portada</span>
                        <input
                            type="url"
                            name="imagenPortada"
                            value={formData.imagenPortada}
                            onChange={handleChange}
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                        <span className="input-hint info">
                            💡 Opcional: Si no agregas una imagen, se mostrará una por defecto
                        </span>
                    </label>

                    {/* Género y Plataforma en fila */}
                    <div className="form-group-row">
                        <label>
                            <span>
                                🎯 Género
                                <span className="required-indicator">*</span>
                            </span>
                            <select
                                name="genero"
                                value={formData.genero}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecciona un género</option>
                                {["Acción", "RPG", "Estrategia", "Aventura", "Deportes", "Puzzle", "Carreras", "Simulación", "Terror", "Plataformas", "Shooter", "MMORPG", "Battle Royale", "Otro"].map((g) => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            <span>
                                🕹️ Plataforma
                                <span className="required-indicator">*</span>
                            </span>
                            <select
                                name="plataforma"
                                value={formData.plataforma}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecciona una plataforma</option>
                                {["PC", "PlayStation 5", "PlayStation 4", "Xbox Series X/S", "Xbox One", "Nintendo Switch", "Mobile (iOS/Android)", "Multi-plataforma"].map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {/* Año y Desarrollador en fila */}
                    <div className="form-group-row">
                        <label>
                            <span>
                                📅 Año de lanzamiento
                                <span className="required-indicator">*</span>
                            </span>
                            <input
                                type="number"
                                name="anoLanzamiento"
                                value={formData.anoLanzamiento}
                                onChange={handleChange}
                                min="1970"
                                max={new Date().getFullYear() + 3}
                                required
                            />
                        </label>

                        <label>
                            <span>
                                👨‍💻 Desarrollador
                                <span className="required-indicator">*</span>
                            </span>
                            <input
                                type="text"
                                name="desarrollador"
                                value={formData.desarrollador}
                                onChange={handleChange}
                                placeholder="Ej: Nintendo"
                                required
                            />
                        </label>
                    </div>

                    {/* Descripción */}
                    <label>
                        <span>
                            📝 Descripción
                            <span className="required-indicator">*</span>
                        </span>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Escribe una breve descripción del juego..."
                            required
                            rows="5"
                            maxLength={maxChars}
                        />
                        <span className={getCharCounterClass()}>
                            {charCount} / {maxChars} caracteres
                        </span>
                    </label>

                    {/* Checkbox completado */}
                    <label className="checkbox">
                        <input
                            type="checkbox"
                            name="completado"
                            checked={formData.completado}
                            onChange={handleChange}
                        />
                        <span>✅ Marcar como completado</span>
                    </label>

                    {/* Botón enviar */}
                    <button type="submit" className="btn-guardar" data-component="formulario-juego">
                        <span>{esEdicion ? "💾" : "➕"}</span>
                        {esEdicion ? "Guardar cambios" : "Agregar juego"}
                    </button>
                </form>
            </div>
        </div>
    );
}