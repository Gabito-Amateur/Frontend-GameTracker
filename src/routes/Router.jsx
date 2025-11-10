import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Biblioteca from "../pages/Biblioteca";
import Resenas from "../pages/Resenas";
import Estadisticas from "../pages/Estadisticas";

export default function Router() {
    return (
        <BrowserRouter basename="/Frontend-GameTracker/">
            <Routes>
                <Route path="/biblioteca" element={<Biblioteca />} />
                <Route path="/resenas" element={<Resenas />} />
                <Route path="/estadisticas" element={<Estadisticas />} />
                <Route path="/" element={<Navigate to="/biblioteca" replace />} />
            </Routes>
        </BrowserRouter>

    );
}
