import { useEffect, useState } from "react";
import { obtenerResenas, eliminarResena, actualizarResena, crearResena } from "../api/ResenasApi";
import { obtenerJuegos } from "../api/JuegosApi";
import FormularioResena from "../components/FormularioResena/FormularioResena";
import "./Resenas.css";

export default function Resenas() {
  const [resenas, setResenas] = useState([]);
  const [juegos, setJuegos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [datosResenas, datosJuegos] = await Promise.all([
        obtenerResenas(),
        obtenerJuegos()
      ]);
      setResenas(datosResenas);
      setJuegos(datosJuegos);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    } finally {
      setCargando(false);
    }
  };

  const iniciarEdicion = (resena) => {
    setEditandoId(resena._id);
  };

  const guardarEdicion = async (formulario) => {
    try {
      const actualizada = await actualizarResena(editandoId, {
        puntuacion: Number(formulario.puntuacion),
        textoResena: formulario.textoResena,
        horasJugadas: Number(formulario.horasJugadas) || 0,
        dificultad: formulario.dificultad,
        recomendaria: Boolean(formulario.recomendaria)
      });
      setResenas(resenas.map(r => (r._id === editandoId ? actualizada : r)));
      setEditandoId(null);
      alert("Reseña actualizada correctamente.");
    } catch (err) {
      console.error("Error al actualizar reseña:", err);
      alert("Error: " + (err.response?.data?.mensaje || err.message || "No se pudo actualizar la reseña"));
    }
  };

  const crearNuevaResena = async (formulario) => {
    try {
      const nuevaResena = await crearResena(formulario.juegoId, formulario);
      setResenas([...resenas, nuevaResena]);
      setMostrarFormulario(false);
      alert("Reseña creada correctamente.");
    } catch (err) {
      console.error("Error al crear reseña:", err);
      alert("Error: " + (err.response?.data?.mensaje || err.message || "No se pudo crear la reseña"));
    }
  };

  const borrarResena = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta reseña?")) {
      try {
        await eliminarResena(id);
        setResenas(resenas.filter(r => r._id !== id));
        alert("Reseña eliminada correctamente.");
      } catch (err) {
        console.error("Error al eliminar reseña:", err);
        alert("Error al eliminar la reseña.");
      }
    }
  };

  const obtenerTituloJuego = (juegoId) => {
    // juegoId puede ser un string o un objeto (si viene poblado del backend)
    const juegoIdString = typeof juegoId === 'object' ? juegoId?._id : juegoId;

    if (typeof juegoId === 'object' && juegoId?.titulo) {
      return juegoId.titulo;
    }

    const juego = juegos.find(j => j._id === juegoIdString);
    return juego ? juego.titulo : "Juego desconocido";
  };

  return (
    <section className="resenas-page">
      <div className="resenas-header">
        <h2>📝 Reseñas</h2>
        {juegos.length > 0 && (
          <button className="btn-agregar-resena" onClick={() => setMostrarFormulario(true)}>
            ➕ Agregar reseña
          </button>
        )}
      </div>

      {/* Formulario para crear reseña */}
      {mostrarFormulario && (
        <FormularioResena
          juegos={juegos}
          onSubmit={crearNuevaResena}
          onCancel={() => setMostrarFormulario(false)}
          esEdicion={false}
        />
      )}

      {cargando ? (
        <p>Cargando reseñas...</p>
      ) : resenas.length === 0 ? (
        <p>No hay reseñas registradas.</p>
      ) : (
        <div className="resenas-list">
          {resenas.map((r) => (
            <div key={r._id} className="resena-card">
              <h3>{obtenerTituloJuego(r.juegoId)}</h3>

              {editandoId === r._id ? (
                <FormularioResena
                  juegos={juegos}
                  onSubmit={guardarEdicion}
                  onCancel={() => setEditandoId(null)}
                  resenaInicial={r}
                  esEdicion={true}
                />
              ) : (
                <div className="resena-detalles">
                  <p className="puntuacion">⭐ Puntuación: <strong>{r.puntuacion}/5</strong></p>
                  <p className="horas">⏱️ Horas jugadas: <strong>{r.horasJugadas}h</strong></p>
                  <p className="dificultad">📊 Dificultad: <strong>{r.dificultad}</strong></p>
                  <p className="recomendacion">👍 Recomendación: <strong>{r.recomendaria ? "✅ Sí" : "❌ No"}</strong></p>
                  <p className="texto">"{r.textoResena}"</p>
                </div>
              )}

              {/* Fechas */}
              <p className="fecha">
                Creada: {new Date(r.fechaCreacion).toLocaleString()}
              </p>
              {r.fechaActualizacion && (
                <p className="fecha">
                  Última modificación: {new Date(r.fechaActualizacion).toLocaleString()}
                </p>
              )}

              {/* Botones */}
              <div className="acciones">
                {editandoId === r._id ? null : (
                  <>
                    <button className="btn-editar" onClick={() => iniciarEdicion(r)}>Editar</button>
                    <button className="btn-eliminar" onClick={() => borrarResena(r._id)}>Eliminar</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}


