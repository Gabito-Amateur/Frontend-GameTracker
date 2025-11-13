import { useEffect, useState } from "react";
import JuegoCard from "../components/JuegoCard/JuegoCard";
import FormularioJuego from "../components/FormularioJuego/FormularioJuego";
import { obtenerJuegos, agregarJuego } from "../api/JuegosApi";
import { obtenerResenaPorJuego } from "../api/ResenasApi";
import "./Biblioteca.css";

export default function Biblioteca() {
    const [juegos, setJuegos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [error, setError] = useState(null);
    const [mensaje, setMensaje] = useState(null); // para mostrar alertas

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
        // 🔍 Validar duplicado por título (sin importar mayúsculas/minúsculas)
        const tituloExiste = juegos.some(
            (j) => j.titulo.trim().toLowerCase() === nuevoJuego.titulo.trim().toLowerCase()
        );

        if (tituloExiste) {
            setMensaje("⚠️ Ya existe un juego con ese título en tu biblioteca.");
            setTimeout(() => setMensaje(null), 3000);
            return; // 🚫 No continuar con el POST
        }

        try {
            const juegoCreado = await agregarJuego(nuevoJuego);
            setJuegos([...juegos, juegoCreado]);
            setMensaje("✅ Juego agregado correctamente.");
            setTimeout(() => setMensaje(null), 3000);
        } catch (err) {
            console.error("Error al agregar el juego:", err);
            setMensaje("❌ Ocurrió un error al agregar el juego.");
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

    if (cargando) return <p>Cargando juegos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section className="biblioteca">
            <div className="biblioteca-header">
                <h2>📚 Tu biblioteca</h2>
                <button className="btn-agregar" onClick={() => setMostrarModal(true)}>
                    ➕ Agregar juego
                </button>
            </div>

            {/* Mensaje temporal */}
            {mensaje && <p className="alerta">{mensaje}</p>}

            <div className="estante">
                {juegos.length === 0 ? (
                    <p>No hay juegos en tu biblioteca.</p>
                ) : (
                    juegos.map((juego) => <JuegoCard key={juego._id} juego={juego} onActualizar={handleActualizarJuego} />)
                )}
            </div>

            {mostrarModal && (
                <FormularioJuego
                    onClose={() => setMostrarModal(false)}
                    onSubmit={handleAgregarJuego}
                />
            )}
        </section>
    );
}
