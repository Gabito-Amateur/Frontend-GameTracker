import { useState } from "react";
import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
    const [menuAbierto, setMenuAbierto] = useState(false);

    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto);
    };

    const cerrarMenu = () => {
        setMenuAbierto(false);
    };

    return (
        <nav className="navbar">
            {/* Logo con imagen */}
            <div className="navbar-logo">
                <Link to="/" onClick={cerrarMenu}>
                    <img
                        src="../../../public/logo.png"
                        alt="GameTracker Logo"
                        className="navbar-logo-img"
                        onError={(e) => {
                            // Si el logo no carga, oculta la imagen
                            e.target.style.display = 'none';
                        }}
                    />
                    <span>GameTracker</span>
                </Link>
            </div>

            {/* Botón hamburguesa (solo visible en móvil) */}
            <button
                className={`navbar-hamburger ${menuAbierto ? 'active' : ''}`}
                onClick={toggleMenu}
                aria-label="Menú de navegación"
                aria-expanded={menuAbierto}
            >
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
            </button>

            {/* Enlaces de navegación */}
            <ul className={`navbar-links ${menuAbierto ? 'active' : ''}`}>
                <li>
                    <NavLink
                        to="/biblioteca"
                        onClick={cerrarMenu}
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        <span>📚</span>
                        Biblioteca
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/resenas"
                        onClick={cerrarMenu}
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        <span>📝</span>
                        Reseñas
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/estadisticas"
                        onClick={cerrarMenu}
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        <span>📊</span>
                        Estadísticas
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}