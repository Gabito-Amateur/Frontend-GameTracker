import { useState } from "react";
import "./FormularioJuego.css";

export default function FormularioJuego({ onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        titulo: "",
        portada: "",
        genero: "",
        plataforma: "",
        horas: 0,
        reseña: "",
        nuevo: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
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
                    <h2>Agregar nuevo juego</h2>
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
                            name="portada"
                            value={formData.portada}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Género:
                        <input
                            type="text"
                            name="genero"
                            value={formData.genero}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Plataforma:
                        <input
                            type="text"
                            name="plataforma"
                            value={formData.plataforma}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        Horas jugadas:
                        <input
                            type="number"
                            name="horas"
                            value={formData.horas}
                            onChange={handleChange}
                            min="0"
                        />
                    </label>

                    <label>
                        Reseña:
                        <textarea
                            name="reseña"
                            value={formData.reseña}
                            onChange={handleChange}
                            rows="3"
                        />
                    </label>

                    <label className="checkbox">
                        <input
                            type="checkbox"
                            name="nuevo"
                            checked={formData.nuevo}
                            onChange={handleChange}
                        />
                        Marcar como “nuevo”
                    </label>

                    <button type="submit" className="btn-guardar">
                        💾 Guardar juego
                    </button>
                </form>
            </div>
        </div>
    );
}
