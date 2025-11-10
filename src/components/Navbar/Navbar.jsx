import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">🎮 GameTracker</Link>
            </div>

            <ul className="navbar-links">
                <li>
                    <NavLink to="/" end>
                        Biblioteca
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/resenas">Reseñas</NavLink>
                </li>
                <li>
                    <NavLink to="/estadisticas">Estadísticas</NavLink>
                </li>
            </ul>

            <div className="navbar-theme">
                <button id="theme-toggle">🌙</button>
            </div>
        </nav>
    );
}
