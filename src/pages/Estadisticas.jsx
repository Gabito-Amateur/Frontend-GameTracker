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
    const [error, setError] = useState(null);

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

            // Filtrar reseñas válidas (que tengan juegoId no nulo)
            const resenasValidas = resenas.filter(resena => {
                if (!resena.juegoId) return false;
                
                const juegoId = typeof resena.juegoId === 'object' ? resena.juegoId?._id : resena.juegoId;
                if (!juegoId) return false;
                
                // Verificar que el juego aún existe
                const juegoExiste = juegos.find(j => j._id === juegoId);
                return !!juegoExiste;
            });

            // Calcular horas por juego
            const horasPorJuego = {};
            resenasValidas.forEach(resena => {
                const juegoId = typeof resena.juegoId === 'object' ? resena.juegoId._id : resena.juegoId;
                
                if (!horasPorJuego[juegoId]) {
                    horasPorJuego[juegoId] = 0;
                }
                horasPorJuego[juegoId] += resena.horasJugadas || 0;
            });

            // Total de horas jugadas
            const totalHoras = Object.values(horasPorJuego).reduce((sum, horas) => sum + horas, 0);

            // Promedio de horas por juego (solo juegos con reseñas)
            const juegosConResenas = Object.keys(horasPorJuego).length;
            const promedioHoras = juegosConResenas > 0 ? (totalHoras / juegosConResenas).toFixed(2) : 0;

            // Juego con más horas
            let juegoMasHoras = null;
            let maxHoras = 0;
            Object.entries(horasPorJuego).forEach(([juegoId, horas]) => {
                if (horas > maxHoras) {
                    maxHoras = horas;
                    const juego = juegos.find(j => j._id === juegoId);
                    if (juego) {
                        juegoMasHoras = { juego, horas };
                    }
                }
            });

            // Juego con menos horas (solo si hay más de un juego con reseña)
            let juegoMenosHoras = null;
            if (Object.keys(horasPorJuego).length > 1) {
                let minHoras = Infinity;
                Object.entries(horasPorJuego).forEach(([juegoId, horas]) => {
                    if (horas < minHoras && horas > 0) {
                        minHoras = horas;
                        const juego = juegos.find(j => j._id === juegoId);
                        if (juego) {
                            juegoMenosHoras = { juego, horas };
                        }
                    }
                });
            }

            setEstadisticas({
                totalJuegos,
                totalCompletados,
                totalHoras,
                promedioHoras,
                juegoMasHoras,
                juegoMenosHoras,
            });
            setError(null);
        } catch (err) {
            console.error("Error al cargar estadísticas:", err);
            setError("No se pudieron cargar las estadísticas.");
        } finally {
            setCargando(false);
        }
    };

    if (cargando) {
        return (
            <section className="estadisticas-page">
                <h2>
                    <span>📊</span>
                    Estadísticas Personales
                </h2>
                <p>Cargando estadísticas...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="estadisticas-page">
                <h2>
                    <span>📊</span>
                    Estadísticas Personales
                </h2>
                <div className="sin-datos">
                    <p>{error}</p>
                    <p>Por favor, intenta recargar la página.</p>
                </div>
            </section>
        );
    }

    const hayDatos = estadisticas.juegoMasHoras || estadisticas.juegoMenosHoras;

    return (
        <section className="estadisticas-page">
            <h2>
                <span>📊</span>
                Estadísticas Personales
            </h2>

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
                    <div className="stat-icon">✅</div>
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

            {/* Juegos destacados */}
            {hayDatos ? (
                <div className="juegos-destacados">
                    {/* Juego con más horas */}
                    {estadisticas.juegoMasHoras && (
                        <div className="juego-destacado mas-horas">
                            <span className="juego-icon">👑</span>
                            <p className="juego-categoria">Juego con más horas</p>
                            <h3 className="juego-titulo">{estadisticas.juegoMasHoras.juego.titulo}</h3>
                            <p className="juego-horas">{estadisticas.juegoMasHoras.horas.toFixed(1)}h</p>
                        </div>
                    )}

                    {/* Juego con menos horas */}
                    {estadisticas.juegoMenosHoras && (
                        <div className="juego-destacado menos-horas">
                            <span className="juego-icon">🎯</span>
                            <p className="juego-categoria">Juego con menos horas</p>
                            <h3 className="juego-titulo">{estadisticas.juegoMenosHoras.juego.titulo}</h3>
                            <p className="juego-horas">{estadisticas.juegoMenosHoras.horas.toFixed(1)}h</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="sin-datos">
                    <p>No hay suficientes datos para mostrar juegos destacados.</p>
                    <p>Crea reseñas con horas jugadas para ver estadísticas más detalladas.</p>
                </div>
            )}
        </section>
    );
}