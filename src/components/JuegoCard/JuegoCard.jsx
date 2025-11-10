import { useState } from "react";
import "./JuegoCard.css";

export default function JuegoCard({ juego }) {
    const [mostrarModal, setMostrarModal] = useState(false);

    const abrirModal = () => setMostrarModal(true);
    const cerrarModal = () => setMostrarModal(false);

    return (
        <>
            {/* Tarjeta */}
            <div className="juego-card" onClick={abrirModal}>
                <img src={juego.imagenPortada} alt={juego.titulo} className="juego-img" />
                <div className="juego-info">
                    <h3>{juego.titulo}</h3>
                </div>
            </div>

            {/* Modal */}
            {mostrarModal && (
                <div className="modal-overlay" onClick={cerrarModal}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()} // evita cerrar al hacer clic dentro
                    >
                        <div className="modal-header">
                            <h2>{juego.titulo}</h2>
                            <button onClick={cerrarModal}>✖</button>
                        </div>
                        <div className="modal-body">
                            <img src={juego.imagenPortada} alt={juego.titulo} className="modal-img" />
                            <div className="modal-details">
                                <p><strong>🎮 Género:</strong> {juego.genero}</p>
                                <p><strong>💻 Plataforma:</strong> {juego.plataforma}</p>
                                <p><strong>⏱️ Horas jugadas:</strong> {juego.horas} h</p>
                                <p><strong>⭐ Reseña:</strong> {juego.reseña}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
