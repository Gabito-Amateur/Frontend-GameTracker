import { useState, useEffect } from "react";
import "./FormularioResena.css";

export default function FormularioResena({
    juegos,
    onSubmit,
    onCancel,
    resenaInicial = null,
    esEdicion = false
}) {
    const [formulario, setFormulario] = useState({
        juegoId: "",
        puntuacion: 5,
        textoResena: "",
        horasJugadas: 0,
        dificultad: "Normal",
        recomendaria: true
    });

    const [hoverStar, setHoverStar] = useState(0);

    useEffect(() => {
        if (resenaInicial && esEdicion) {
            setFormulario({
                juegoId: resenaInicial.juegoId,
                puntuacion: resenaInicial.puntuacion,
                textoResena: resenaInicial.textoResena,
                horasJugadas: resenaInicial.horasJugadas,
                dificultad: resenaInicial.dificultad,
                recomendaria: resenaInicial.recomendaria
            });
        }
    }, [resenaInicial, esEdicion]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormulario({
            ...formulario,
            [name]: type === "checkbox" ? checked : name === "horasJugadas" ? parseInt(value) : value,
        });
    };

    const handlePuntuacionClick = (valor) => {
        setFormulario({
            ...formulario,
            puntuacion: valor
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar datos
        if (!formulario.juegoId && !esEdicion) {
            alert("Por favor, selecciona un juego.");
            return;
        }

        if (!formulario.textoResena || !formulario.textoResena.trim()) {
            alert("Por favor, escribe una reseña.");
            return;
        }

        if (formulario.puntuacion < 1 || formulario.puntuacion > 5) {
            alert("La puntuación debe estar entre 1 y 5.");
            return;
        }

        if (formulario.horasJugadas < 0) {
            alert("Las horas jugadas no pueden ser negativas.");
            return;
        }

        onSubmit(formulario);
    };

    return (
        <div className="formulario-resena">
            <h3>{esEdicion ? "✏️ Editar reseña" : "✍️ Nueva reseña"}</h3>

            <form onSubmit={handleSubmit}>
                {!esEdicion && (
                    <div className="form-group">
                        <label>Juego:</label>
                        <select
                            name="juegoId"
                            value={formulario.juegoId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecciona un juego</option>
                            {juegos.map((juego) => (
                                <option key={juego._id} value={juego._id}>
                                    {juego.titulo}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="form-group">
                    <label>Puntuación:</label>
                    <div className="puntuacion-estrellas">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`star ${star <= (hoverStar || formulario.puntuacion) ? "active" : ""
                                    }`}
                                onClick={() => handlePuntuacionClick(star)}
                                onMouseEnter={() => setHoverStar(star)}
                                onMouseLeave={() => setHoverStar(0)}
                                title={`Calificar con ${star} estrella${star !== 1 ? "s" : ""}`}
                            >
                                ★
                            </button>
                        ))}
                        <span className="puntuacion-texto">
                            {formulario.puntuacion}/5
                        </span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Horas jugadas:</label>
                    <input
                        type="number"
                        name="horasJugadas"
                        min="0"
                        value={formulario.horasJugadas}
                        onChange={handleChange}
                        placeholder="0"
                    />
                </div>

                <div className="form-group">
                    <label>Dificultad:</label>
                    <select
                        name="dificultad"
                        value={formulario.dificultad}
                        onChange={handleChange}
                    >
                        <option>Fácil</option>
                        <option>Normal</option>
                        <option>Difícil</option>
                        <option>Muy Difícil</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Reseña:</label>
                    <textarea
                        name="textoResena"
                        value={formulario.textoResena}
                        onChange={handleChange}
                        placeholder="Escribe tu reseña aquí..."
                        required
                        rows="4"
                    />
                </div>

                <div className="form-group checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="recomendaria"
                            checked={formulario.recomendaria}
                            onChange={handleChange}
                        />
                        ¿Lo recomendarías?
                    </label>
                </div>

                <div className="form-acciones">
                    <button type="submit" className="btn-guardar">
                        {esEdicion ? "💾 Guardar cambios" : "💾 Guardar reseña"}
                    </button>
                    <button type="button" className="btn-cancelar" onClick={onCancel}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
