import { useEffect, useState } from "react";
import { obtenerResenas, eliminarResena, actualizarResena } from "../api/ResenasApi";
import "./Resenas.css";

export default function Resenas() {
  const [resenas, setResenas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [textoTemporal, setTextoTemporal] = useState("");

  useEffect(() => {
    cargarResenas();
  }, []);

  const cargarResenas = async () => {
    try {
      const data = await obtenerResenas();
      setResenas(data);
    } catch (err) {
      console.error("Error al cargar reseñas:", err);
    }
  };

  const iniciarEdicion = (resena) => {
    setEditandoId(resena._id);
    setTextoTemporal(resena.textoResena);
  };

  const guardarEdicion = async (id) => {
    try {
      const actualizada = await actualizarResena(id, textoTemporal);
      setResenas(resenas.map(r => {
        if (r._id === id) {
          return {
            ...actualizada,
            juegoId: r.juegoId // 👈 conservar título del juego
          };
        }
        return r;
      }));
      setEditandoId(null);
      setTextoTemporal("");
    } catch (err) {
      console.error("Error al actualizar reseña:", err);
    }
  };

  const borrarResena = async (id) => {
    try {
      await eliminarResena(id);
      setResenas(resenas.filter(r => r._id !== id));
    } catch (err) {
      console.error("Error al eliminar reseña:", err);
    }
  };

  return (
    <section className="resenas-page">
      <h2>📝 Reseñas</h2>

      {resenas.length === 0 ? (
        <p>No hay reseñas registradas.</p>
      ) : (
        <div className="resenas-list">
          {resenas.map((r) => (
            <div key={r._id} className="resena-card">
              <h3>{r.juegoId?.titulo || "Juego desconocido"}</h3>

              {/* Reseña */}
              {editandoId === r._id ? (
                <textarea
                  value={textoTemporal}
                  onChange={(e) => setTextoTemporal(e.target.value)}
                />
              ) : (
                <p className="texto">“{r.textoResena}”</p>
              )}

              {/* Fechas */}
              <p className="fecha">
                Creada: {new Date(r.fechaCreacion).toLocaleString()}
              </p>
              <p className="fecha">
                Última modificación: {new Date(r.fechaActualizacion).toLocaleString()}
              </p>

              {/* Botones */}
              <div className="acciones">
                {editandoId === r._id ? (
                  <>
                    <button onClick={() => guardarEdicion(r._id)}>Guardar</button>
                    <button onClick={() => setEditandoId(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => iniciarEdicion(r)}>Editar</button>
                    <button onClick={() => borrarResena(r._id)}>Eliminar</button>
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

