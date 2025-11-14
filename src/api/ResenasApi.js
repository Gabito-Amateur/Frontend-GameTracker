import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const RESENAS_URL = `${API_URL}/api/resenas`; // 👈 ojo: sin tilde

export const crearResena = async (juegoId, textoResena) => {
  try {
    const body = {
      juegoId,
      puntuacion: 5,            // ✅ valor por defecto
      textoResena,              // ✅ coincide con el modelo
      horasJugadas: 0,
      dificultad: "Normal",
      recomendaria: true
    };

    const response = await axios.post(RESENAS_URL, body);
    return response.data;
  } catch (error) {
    console.error("Error al crear reseña:", error);
    throw error;
  }
};

export const obtenerResenaPorJuego = async (juegoId) => {
  try {
    const response = await axios.get(`${RESENAS_URL}/juego/${juegoId}`);
    return response.data;
  } catch (error) {
    // Si es un error 404 o similar, simplemente devolvemos null
    if (error.response && (error.response.status === 404 || error.response.status === 500)) {
      console.log("No hay reseña para este juego o error en el servidor");
      return null;
    }
    console.error("Error al obtener reseña:", error);
    return null;
  }
};

export const actualizarResena = async (id, textoResena) => {
  try {
    const response = await axios.put(`${RESENAS_URL}/${id}`, { textoResena });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar reseña:", error);
    throw error;
  }
};

export const eliminarResena = async (id) => {
  try {
    const response = await axios.delete(`${RESENAS_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar reseña:", error);
    throw error;
  }
};

export const obtenerResenas = async () => {
  const res = await axios.get(RESENAS_URL);
  return res.data;
};
