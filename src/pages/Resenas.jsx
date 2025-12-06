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
  const [mensaje, setMensaje] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [resenaAEliminar, setResenaAEliminar] = useState(null);

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
      setMensaje({ tipo: "error", texto: "❌ Error al cargar los datos." });
      setTimeout(() => setMensaje(null), 3000);
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
      setMensaje({ tipo: "success", texto: "✅ Reseña actualizada correctamente." });
      setTimeout(() => setMensaje(null), 3000);
    } catch (err) {
      console.error("Error al actualizar reseña:", err);
      setMensaje({ tipo: "error", texto: "❌ Error al actualizar la reseña." });
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  const crearNuevaResena = async (formulario) => {
    try {
      // Validar si ya existe una reseña para ese juego
      const resenaExistente = resenas.find(r => {
        const juegoId = typeof r.juegoId === 'object' ? r.juegoId._id : r.juegoId;
        return juegoId === formulario.juegoId;
      });

      if (resenaExistente) {
        setMensaje({ tipo: "warning", texto: "⚠️ Ya existe una reseña para este juego." });
        setTimeout(() => setMensaje(null), 3000);
        return;
      }

      const nuevaResena = await crearResena(formulario.juegoId, formulario);
      setResenas([...resenas, nuevaResena]);
      setMostrarFormulario(false);
      setMensaje({ tipo: "success", texto: "✅ Reseña creada correctamente." });
      setTimeout(() => setMensaje(null), 3000);
    } catch (err) {
      console.error("Error al crear reseña:", err);
      setMensaje({ tipo: "error", texto: "❌ Error al crear la reseña." });
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  const solicitarEliminarResena = (resena) => {
    setResenaAEliminar(resena);
    setMostrarConfirmacion(true);
  };

  const confirmarEliminarResena = async () => {
    if (!resenaAEliminar) return;

    try {
      await eliminarResena(resenaAEliminar._id);
      setResenas(resenas.filter(r => r._id !== resenaAEliminar._id));
      setMensaje({ tipo: "success", texto: "✅ Reseña eliminada correctamente." });
      setTimeout(() => setMensaje(null), 3000);
    } catch (err) {
      console.error("Error al eliminar reseña:", err);
      setMensaje({ tipo: "error", texto: "❌ Error al eliminar la reseña." });
      setTimeout(() => setMensaje(null), 3000);
    } finally {
      setMostrarConfirmacion(false);
      setResenaAEliminar(null);
    }
  };

  const cancelarEliminar = () => {
    setMostrarConfirmacion(false);
    setResenaAEliminar(null);
  };

  const obtenerTituloJuego = (juegoId) => {
    const juegoIdString = typeof juegoId === 'object' ? juegoId?._id : juegoId;

    if (typeof juegoId === 'object' && juegoId?.titulo) {
      return juegoId.titulo;
    }

    const juego = juegos.find(j => j._id === juegoIdString);
    return juego ? juego.titulo : "Juego desconocido";
  };

  if (cargando) {
    return (
      <section className="resenas-page">
        <div className="resenas-header">
          <h2>
            <span>📝</span>
            Reseñas
          </h2>
        </div>
        <p style={{ textAlign: 'center', color: '#888', fontSize: '1.1rem' }}>
          Cargando reseñas...
        </p>
      </section>
    );
  }

  return (
    <section className="resenas-page">
      <div className="resenas-header">
        <h2>
          <span>📝</span>
          Reseñas
        </h2>
        {juegos.length > 0 && (
          <button className="btn-agregar-resena" onClick={() => setMostrarFormulario(true)}>
            ➕ Agregar reseña
          </button>
        )}
      </div>

      {/* Mensaje temporal */}
      {mensaje && (
        <div className={`alerta ${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}

      {/* Formulario para crear reseña */}
      {mostrarFormulario && (
        <FormularioResena
          juegos={juegos}
          onSubmit={crearNuevaResena}
          onCancel={() => setMostrarFormulario(false)}
          esEdicion={false}
        />
      )}

      {resenas.length === 0 ? (
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
                    <button className="btn-eliminar" onClick={() => solicitarEliminarResena(r)}>Eliminar</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {mostrarConfirmacion && resenaAEliminar && (
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
                ¿Estás seguro de que deseas eliminar la reseña de{" "}
                <strong>"{obtenerTituloJuego(resenaAEliminar.juegoId)}"</strong>?
              </p>
              <p className="advertencia">
                ⚡ Esta acción no se puede deshacer y se perderá toda la información de esta reseña.
              </p>
            </div>
            <div className="modal-confirmacion-acciones">
              <button className="btn-cancelar" onClick={cancelarEliminar}>
                Cancelar
              </button>
              <button className="btn-confirmar" onClick={confirmarEliminarResena}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}