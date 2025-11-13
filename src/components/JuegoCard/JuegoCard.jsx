import { useState } from "react";
import "./JuegoCard.css";
import { crearResena, actualizarResena, eliminarResena, obtenerResenaPorJuego } from "../../api/ResenasApi";

export default function JuegoCard({ juego, onActualizar }) {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [resena, setResena] = useState(null);
    const [resenaId, setResenaId] = useState(null);
    const [editando, setEditando] = useState(false);
    const [textoTemporal, setTextoTemporal] = useState("");
    const [cargandoResena, setCargandoResena] = useState(false);

    // Abrir/cerrar modal
    const abrirModal = async () => {
        setMostrarModal(true);
        setCargandoResena(true);
        try {
            const resenaCargada = await obtenerResenaPorJuego(juego._id);
            console.log("Reseña cargada:", resenaCargada);

            // Manejo de array o objeto
            let reseña = resenaCargada;
            if (Array.isArray(resenaCargada) && resenaCargada.length > 0) {
                reseña = resenaCargada[0];
            }

            if (reseña && reseña.textoResena) {
                setResena(reseña.textoResena);
                setResenaId(reseña._id);
                setTextoTemporal(reseña.textoResena);
            } else {
                setResena(null);
                setResenaId(null);
                setTextoTemporal("");
            }
        } catch (error) {
            console.error("Error al cargar reseña:", error);
            setResena(null);
            setResenaId(null);
            setTextoTemporal("");
        } finally {
            setCargandoResena(false);
        }
    };

    const cerrarModal = () => {
        setMostrarModal(false);
        setEditando(false);
        setTextoTemporal("");
    };

    // Guardar o publicar resena
    const handlePublicar = async () => {
        try {
            if (!resena) {
                const nueva = await crearResena(juego._id, textoTemporal);
                setResena(nueva.textoResena);
                setResenaId(nueva._id);
                const juegoActualizado = { ...juego, resena: nueva.textoResena, resenaId: nueva._id };
                onActualizar(juegoActualizado);
            } else if (editando) {
                const actualizada = await actualizarResena(resenaId, textoTemporal);
                setResena(actualizada.textoResena);
                setEditando(false);
                const juegoActualizado = { ...juego, resena: actualizada.textoResena };
                onActualizar(juegoActualizado);
            }
            setTextoTemporal("");
        } catch (error) {
            console.error("Error al guardar reseña:", error);
        }
    };

    // Eliminar reseña
    const handleEliminar = async () => {
        try {
            await eliminarResena(resenaId);
            setResena(null);
            setResenaId(null);
            setTextoTemporal("");
            setEditando(false);
            const juegoActualizado = { ...juego, resena: null, resenaId: null };
            onActualizar(juegoActualizado);
        } catch (error) {
            console.error("Error al eliminar reseña:", error);
        }
    };

    return (
        <>
            {/* Tarjeta principal */}
            <div className="juego-card" onClick={abrirModal}>
                <img src={juego.portada} alt={juego.titulo} className="juego-img" />
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
                            <button onClick={cerrarModal}>✖</button>
                        </div>
                        <div className="modal-body">
                            <img src={juego.portada} alt={juego.titulo} className="modal-img" />
                            <div className="modal-details">
                                <p><strong>🎮 Género:</strong> {juego.genero}</p>
                                <p><strong>💻 Plataforma:</strong> {juego.plataforma}</p>
                                <p><strong>⏱️ Horas jugadas:</strong> {juego.horas} h</p>
                            </div>

                            {/* 📝 Sección de reseña */}
                            <div className="resena-container">
                                <h3>📝 Reseña</h3>
                                {cargandoResena ? (
                                    <p>Cargando reseña...</p>
                                ) : !resena ? (
                                    <>
                                        <textarea
                                            placeholder="Escribe tu reseña aquí..."
                                            value={textoTemporal}
                                            onChange={(e) => setTextoTemporal(e.target.value)}
                                        />
                                        <button
                                            onClick={handlePublicar}
                                            disabled={!textoTemporal.trim()}
                                        >
                                            Publicar
                                        </button>
                                    </>
                                ) : editando ? (
                                    <>
                                        <textarea
                                            value={textoTemporal}
                                            onChange={(e) => setTextoTemporal(e.target.value)}
                                        />
                                        <button onClick={handlePublicar}>Guardar cambios</button>
                                        <button onClick={() => setEditando(false)}>Cancelar</button>
                                    </>
                                ) : (
                                    <>
                                        <p className="resena-texto">{resena}</p>
                                        <div className="resena-botones">
                                            <button onClick={() => setEditando(true)}>Editar</button>
                                            <button onClick={handleEliminar}>Eliminar</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
