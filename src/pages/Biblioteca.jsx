import { useEffect, useState } from "react";
import JuegoCard from "../components/JuegoCard/JuegoCard";
import { obtenerJuegos } from "../api/JuegosApi";

export default function Biblioteca() {
    const [juegos, setJuegos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarJuegos = async () => {
            try {
                const data = await obtenerJuegos();
                setJuegos(data);
            } catch (err) {
                setError("No se pudieron cargar los juegos.");
            } finally {
                setCargando(false);
            }
        };
        cargarJuegos();
    }, []);

    if (cargando) return <p>Cargando juegos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <section>
            <h2>📚 Tu biblioteca</h2>
            <div className="estante">
                {juegos.length === 0 ? (
                    <p>No hay juegos en tu biblioteca.</p>
                ) : (
                    juegos.map((juego) => (
                        <JuegoCard key={juego._id} juego={juego} />
                    ))
                )}
            </div>
        </section>
    );
}

