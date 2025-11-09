import { BrowserRouter, Routes, Route } from "react-router-dom";
import Biblioteca from "../pages/Biblioteca";
import Resenas from "../pages/Resenas";
import Estadisticas from "../pages/Estadisticas";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Biblioteca />} />
                <Route path="/resenas" element={<Resenas />} />
                <Route path="/estadisticas" element={<Estadisticas />} />
            </Routes>
        </BrowserRouter>
    );
}