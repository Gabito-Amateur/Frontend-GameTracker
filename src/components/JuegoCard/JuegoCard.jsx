import { useState } from "react";
import "./JuegoCard.css";

// Imagen por defecto si la portada no carga
const IMAGEN_DEFECTO = "https://www.format.com/wp-content/uploads/empty-game-11.jpg";

export default function JuegoCard({ juego, onEditar, onEliminar }) {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [imagenError, setImagenError] = useState(false);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

    // Obtener URL de imagen válida
    const obtenerImagenPortada = () => {
        if (!juego.imagenPortada || juego.imagenPortada.trim() === "") {
            return IMAGEN_DEFECTO;
        }
        return imagenError ? IMAGEN_DEFECTO : juego.imagenPortada;
    };

    const manejarErrorImagen = () => {
        setImagenError(true);
    };

    // Abrir/cerrar modal
    const abrirModal = () => {
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setMostrarModal(false);
    };

    const handleEliminar = () => {
        setMostrarConfirmacion(true);
    };

    const confirmarEliminar = () => {
        onEliminar(juego._id);
        setMostrarConfirmacion(false);
        cerrarModal();
    };

    const cancelarEliminar = () => {
        setMostrarConfirmacion(false);
    };

    const handleEditar = () => {
        if (onEditar) {
            onEditar(juego);
            cerrarModal();
        }
    };

    return (
        <>
            {/* Tarjeta principal */}
            <div className="juego-card" onClick={abrirModal}>
                <img
                    src={obtenerImagenPortada()}
                    alt={juego.titulo}
                    className="juego-img"
                    onError={manejarErrorImagen}
                />
                <div className="juego-info">
                    {juego.nuevo && <span className="juego-nuevo">NEW</span>}
                    <h3>{juego.titulo}</h3>
                </div>
            </div>

            {/* Modal de detalles */}
            {mostrarModal && (
                <div className="modal-overlay" onClick={cerrarModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{juego.titulo}</h2>
                            <button onClick={cerrarModal} aria-label="Cerrar modal">✖</button>
                        </div>
                        <div className="modal-body">
                            <img
                                src={obtenerImagenPortada()}
                                alt={juego.titulo}
                                className="modal-img"
                                onError={manejarErrorImagen}
                            />
                            <div className="modal-details">
                                <p>
                                    <strong>🎮 Género:</strong>
                                    {juego.genero}
                                </p>
                                <p>
                                    <strong>🕹️ Plataforma:</strong>
                                    {juego.plataforma}
                                </p>
                                <p>
                                    <strong>📅 Año de lanzamiento:</strong>
                                    {juego.anoLanzamiento}
                                </p>
                                <p>
                                    <strong>👨‍💻 Desarrollador:</strong>
                                    {juego.desarrollador}
                                </p>
                                <p>
                                    <strong>📝 Descripción:</strong>
                                    {juego.descripcion}
                                </p>
                                <p>
                                    <strong>✅ Estado:</strong>
                                    {juego.completado ? (
                                        <span style={{ color: '#00c851' }}>✓ Completado</span>
                                    ) : (
                                        <span style={{ color: '#ff8800' }}>⏳ En progreso</span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="modal-acciones">
                            <button className="btn-editar" onClick={handleEditar}>
                                Editar
                            </button>
                            <button className="btn-eliminar" onClick={handleEliminar}>
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmación de eliminación */}
            {mostrarConfirmacion && (
                <div className="modal-confirmacion-overlay" onClick={cancelarEliminar}>
                    <div className="modal-confirmacion" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-confirmacion-header">
                            <h3>
                                <span>⚠️</span>
                                Confirmar eliminación
                            </h3>
                        </div>
                        <div className="modal-confirmacion-body">
                            <p>
                                ¿Estás seguro de que deseas eliminar{" "}
                                <strong>"{juego.titulo}"</strong>?
                            </p>
                            <p className="advertencia">
                                ⚡ Esta acción no se puede deshacer y se perderá toda la información relacionada.
                            </p>
                        </div>
                        <div className="modal-confirmacion-acciones">
                            <button className="btn-cancelar" onClick={cancelarEliminar}>
                                Cancelar
                            </button>
                            <button className="btn-confirmar" onClick={confirmarEliminar}>
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}