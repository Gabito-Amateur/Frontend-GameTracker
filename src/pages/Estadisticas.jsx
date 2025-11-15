import { useEffect, useState } from "react";
import { obtenerJuegos } from "../api/JuegosApi";
import { obtenerResenas } from "../api/ResenasApi";
import "./Estadisticas.css";

export default function Estadisticas() {
    const [estadisticas, setEstadisticas] = useState({
        totalJuegos: 0,
        totalCompletados: 0,
        totalHoras: 0,
        promedioHoras: 0,
        juegoMasHoras: null,
        juegoMenosHoras: null,
    });
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarEstadisticas();
    }, []);

    const cargarEstadisticas = async () => {
        try {
            const [juegos, resenas] = await Promise.all([
                obtenerJuegos(),
                obtenerResenas()
            ]);

            // Total de juegos registrados
            const totalJuegos = juegos.length;

            // Total de juegos completados
            const totalCompletados = juegos.filter(juego => juego.completado).length;

            // Calcular horas por juego
            const horasPorJuego = {};
            resenas.forEach(resena => {
                const juegoId = typeof resena.juegoId === 'object' ? resena.juegoId._id : resena.juegoId;
                if (!horasPorJuego[juegoId]) {
                    horasPorJuego[juegoId] = 0;
                }
                horasPorJuego[juegoId] += resena.horasJugadas;
            });

            // Total de horas jugadas
            const totalHoras = Object.values(horasPorJuego).reduce((sum, horas) => sum + horas, 0);

            // Promedio de horas por juego
            const promedioHoras = totalCompletados > 0 ? (totalHoras / totalCompletados).toFixed(2) : 0;

            // Juego con más horas
            let juegoMasHoras = null;
            let maxHoras = 0;
            Object.entries(horasPorJuego).forEach(([juegoId, horas]) => {
                if (horas > maxHoras) {
                    maxHoras = horas;
                    const juego = juegos.find(j => j._id === juegoId);
                    juegoMasHoras = { juego, horas };
                }
            });

            // Juego con menos horas
            let juegoMenosHoras = null;
            let minHoras = Infinity;
            Object.entries(horasPorJuego).forEach(([juegoId, horas]) => {
                if (horas < minHoras) {
                    minHoras = horas;
                    const juego = juegos.find(j => j._id === juegoId);
                    juegoMenosHoras = { juego, horas };
                }
            });

            setEstadisticas({
                totalJuegos,
                totalCompletados,
                totalHoras,
                promedioHoras,
                juegoMasHoras,
                juegoMenosHoras,
            });
        } catch (err) {
            console.error("Error al cargar estadísticas:", err);
        } finally {
            setCargando(false);
        }
    };

    if (cargando) {
        return <section className="estadisticas-page"><p>Cargando estadísticas...</p></section>;
    }

    return (
        <section className="estadisticas-page">
            <h2>📊 Estadísticas Personales</h2>

            <div className="estadisticas-grid">
                {/* Total de juegos registrados */}
                <div className="stat-card">
                    <div className="stat-icon">🎮</div>
                    <div className="stat-content">
                        <h3>Total de Juegos</h3>
                        <p className="stat-value">{estadisticas.totalJuegos}</p>
                    </div>
                </div>

                {/* Total de juegos completados */}
                <div className="stat-card">
                    <div className="stat-icon">▶️</div>
                    <div className="stat-content">
                        <h3>Juegos Completados</h3>
                        <p className="stat-value">{estadisticas.totalCompletados}</p>
                    </div>
                </div>

                {/* Total de horas jugadas */}
                <div className="stat-card">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-content">
                        <h3>Total de Horas</h3>
                        <p className="stat-value">{estadisticas.totalHoras.toFixed(1)}h</p>
                    </div>
                </div>

                {/* Promedio de horas por juego */}
                <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                        <h3>Promedio de Horas</h3>
                        <p className="stat-value">{estadisticas.promedioHoras}h</p>
                        <p className="stat-label">por juego</p>
                    </div>
                </div>
            </div>

            {/* Juego con más horas */}
            {estadisticas.juegoMasHoras && (
                <div className="juego-destacado mas-horas">
                    <div className="juego-icon">👑</div>
                    <div className="juego-info">
                        <h3>Juego con Más Horas</h3>
                        <p className="juego-titulo">{estadisticas.juegoMasHoras.juego.titulo}</p>
                        <p className="juego-horas">{estadisticas.juegoMasHoras.horas.toFixed(1)}h</p>
                    </div>
                </div>
            )}

            {/* Juego con menos horas */}
            {estadisticas.juegoMenosHoras && (
                <div className="juego-destacado menos-horas">
                    <div className="juego-icon">🎯</div>
                    <div className="juego-info">
                        <h3>Juego con Menos Horas</h3>
                        <p className="juego-titulo">{estadisticas.juegoMenosHoras.juego.titulo}</p>
                        <p className="juego-horas">{estadisticas.juegoMenosHoras.horas.toFixed(1)}h</p>
                    </div>
                </div>
            )}

            {estadisticas.totalJugados === 0 && (
                <div className="sin-datos">
                    <p>No hay datos suficientes para mostrar estadísticas. Crea reseñas de tus juegos.</p>
                </div>
            )}
        </section>
    );
}
