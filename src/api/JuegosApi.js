import axios from "axios";

// Base URL del backend 
const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const JUEGOS_URL = `${API_URL}/api/juegos`;

export const obtenerJuegos = async () => {
  try {
    const response = await axios.get(JUEGOS_URL);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los juegos:", error);
    throw error;
  }
};

export const agregarJuego = async (nuevoJuego) => {
  try {
    const response = await axios.post(JUEGOS_URL, nuevoJuego);
    return response.data;
  } catch (error) {
    console.error("Error al agregar juego:", error);
    throw error;
  }
};

export const eliminarJuego = async (id) => {
  try {
    const response = await axios.delete(`${JUEGOS_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar juego:", error);
    throw error;
  }
};

export const actualizarJuego = async (id, datos) => {
  try {
    const response = await axios.put(`${JUEGOS_URL}/${id}`, datos);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar juego:", error);
    throw error;
  }
};
