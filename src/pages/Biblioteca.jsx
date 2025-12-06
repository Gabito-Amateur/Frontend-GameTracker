import { useEffect, useState } from "react";
import JuegoCard from "../components/JuegoCard/JuegoCard";
import FormularioJuego from "../components/FormularioJuego/FormularioJuego";
import { obtenerJuegos, agregarJuego, eliminarJuego, actualizarJuego } from "../api/JuegosApi";
import { obtenerResenaPorJuego, eliminarResena } from "../api/ResenasApi";
import "./Biblioteca.css";

export default function Biblioteca() {
    const [juegos, setJuegos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [juegoEnEdicion, setJuegoEnEdicion] = useState(null);
    const [error, setError] = useState(null);
    const [mensaje, setMensaje] = useState(null);

    // Configuración de estanterías (juegos por fila)
    const JUEGOS_POR_ESTANTERIA = 4;

    useEffect(() => {
        const cargarJuegos = async () => {
            try {
                const data = await obtenerJuegos();

                // Cargar reseña para cada juego
                const juegosConResena = await Promise.all(
                    data.map(async (juego) => {
                        try {
                            const resenaCargada = await obtenerResenaPorJuego(juego._id);
                            let reseña = resenaCargada;
                            if (Array.isArray(resenaCargada) && resenaCargada.length > 0) {
                                reseña = resenaCargada[0];
                            }
                            return {
                                ...juego,
                                resena: reseña ? reseña.textoResena : null,
                                resenaId: reseña ? reseña._id : null
                            };
                        } catch (err) {
                            console.error(`Error al cargar reseña del juego ${juego._id}:`, err);
                            return juego;
                        }
                    })
                );

                setJuegos(juegosConResena);
            } catch (err) {
                setError("No se pudieron cargar los juegos.");
            } finally {
                setCargando(false);
            }
        };
        cargarJuegos();
    }, []);

    const handleAgregarJuego = async (nuevoJuego) => {
        // Validar duplicado por título
        const tituloExiste = juegos.some(
            (j) => j.titulo.trim().toLowerCase() === nuevoJuego.titulo.trim().toLowerCase()
        );

        if (tituloExiste) {
            setMensaje({ tipo: "warning", texto: "⚠️ Ya existe un juego con ese título en tu biblioteca." });
            setTimeout(() => setMensaje(null), 3000);
            return;
        }

        try {
            const juegoCreado = await agregarJuego(nuevoJuego);
            setJuegos([...juegos, juegoCreado]);
            setMensaje({ tipo: "success", texto: "✅ Juego agregado correctamente." });
            setTimeout(() => setMensaje(null), 3000);
        } catch (err) {
            console.error("Error al agregar el juego:", err);
            setMensaje({ tipo: "error", texto: "❌ Ocurrió un error al agregar el juego." });
            setTimeout(() => setMensaje(null), 3000);
        }
    };

    const handleActualizarJuego = (juegoActualizado) => {
        setJuegos(juegos.map((j) =>
            j._id === juegoActualizado._id
                ? {
                    ...j,
                    resena: juegoActualizado.resena,
                    resenaId: juegoActualizado.resenaId
                }
                : j
        ));
    };

    const handleEliminarJuego = async (id) => {
        try {
            // Buscar si el juego tiene reseñas asociadas
            const juego = juegos.find(j => j._id === id);
            let resenasEliminadas = 0;

            if (juego && juego.resenaId) {
                try {
                    // Eliminar la reseña asociada
                    await eliminarResena(juego.resenaId);
                    resenasEliminadas = 1;
                    console.log(`Reseña ${juego.resenaId} eliminada automáticamente`);
                } catch (errResena) {
                    console.error("Error al eliminar reseña asociada:", errResena);
                    // Continuar con la eliminación del juego aunque falle la reseña
                }
            }

            // Eliminar el juego
            await eliminarJuego(id);
            
            // Actualizar la lista
            setJuegos(juegos.filter((j) => j._id !== id));
            
            // Mostrar mensaje apropiado
            if (resenasEliminadas > 0) {
                setMensaje({ 
                    tipo: "success", 
                    texto: `✅ Juego y su reseña asociada eliminados correctamente.` 
                });
            } else {
                setMensaje({ 
                    tipo: "success", 
                    texto: "✅ Juego eliminado correctamente." 
                });
            }
            
            setTimeout(() => setMensaje(null), 4000);
        } catch (err) {
            console.error("Error al eliminar el juego:", err);
            setMensaje({ tipo: "error", texto: "❌ Ocurrió un error al eliminar el juego." });
            setTimeout(() => setMensaje(null), 3000);
        }
    };

    const handleEditarJuego = (juego) => {
        setJuegoEnEdicion(juego);
        setMostrarModal(true);
    };

    const handleActualizarFormulario = async (juegoActualizado) => {
        try {
            const resultado = await actualizarJuego(juegoEnEdicion._id, juegoActualizado);
            setJuegos(juegos.map((j) => (j._id === resultado._id ? resultado : j)));
            setJuegoEnEdicion(null);
            setMostrarModal(false);
            setMensaje({ tipo: "success", texto: "✅ Juego actualizado correctamente." });
            setTimeout(() => setMensaje(null), 3000);
        } catch (err) {
            console.error("Error al actualizar el juego:", err);
            setMensaje({ tipo: "error", texto: "❌ Ocurrió un error al actualizar el juego." });
            setTimeout(() => setMensaje(null), 3000);
        }
    };

    // Dividir juegos en estanterías
    const dividirEnEstanterias = (juegos) => {
        const estanterias = [];
        for (let i = 0; i < juegos.length; i += JUEGOS_POR_ESTANTERIA) {
            estanterias.push(juegos.slice(i, i + JUEGOS_POR_ESTANTERIA));
        }
        return estanterias;
    };

    const estanterias = dividirEnEstanterias(juegos);

    if (cargando) {
        return (
            <section className="biblioteca">
                <div className="biblioteca-header">
                    <h2>📚 Tu biblioteca</h2>
                </div>
                <p style={{ textAlign: 'center', color: '#888', fontSize: '1.1rem' }}>
                    Cargando juegos...
                </p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="biblioteca">
                <div className="biblioteca-header">
                    <h2>📚 Tu biblioteca</h2>
                </div>
                <div className="alerta error">{error}</div>
            </section>
        );
    }

    return (
        <section className="biblioteca">
            <div className="biblioteca-header">
                <h2>
                    <span>📚</span>
                    Tu biblioteca
                </h2>
                <button
                    className="btn-agregar"
                    onClick={() => setMostrarModal(true)}
                    aria-label="Agregar nuevo juego"
                >
                    <span>➕</span>
                    Agregar juego
                </button>
            </div>

            {/* Mensaje temporal */}
            {mensaje && (
                <div className={`alerta ${mensaje.tipo}`}>
                    {mensaje.texto}
                </div>
            )}

            {/* Estanterías con juegos */}
            {juegos.length === 0 ? (
                <div className="biblioteca-vacia">
                    <div className="biblioteca-vacia-icon">📚</div>
                    <p>Tu biblioteca está vacía</p>
                    <p>Agrega tu primer juego haciendo clic en el botón "Agregar juego"</p>
                </div>
            ) : (
                <div className="estanterias-container">
                    {estanterias.map((estanteria, index) => (
                        <div key={index} className="estanteria">
                            {/* Soportes de madera */}
                            <div className="estanteria-soporte left"></div>
                            <div className="estanteria-soporte right"></div>

                            {/* Juegos en la estantería */}
                            {estanteria.map((juego) => (
                                <JuegoCard
                                    key={juego._id}
                                    juego={juego}
                                    onActualizar={handleActualizarJuego}
                                    onEditar={handleEditarJuego}
                                    onEliminar={handleEliminarJuego}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal del formulario */}
            {mostrarModal && (
                <FormularioJuego
                    onClose={() => {
                        setMostrarModal(false);
                        setJuegoEnEdicion(null);
                    }}
                    onSubmit={juegoEnEdicion ? handleActualizarFormulario : handleAgregarJuego}
                    juegoInicial={juegoEnEdicion}
                />
            )}
        </section>
    );
}