import "./Footer.css";

export default function Footer() {
    const volverArriba = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Columna 1: Logo y descripción */}
                <div className="footer-logo">
                    <h2>
                        GameTracker
                    </h2>
                    <p>
                        Tu plataforma personal para organizar, reseñar y seguir tu colección de videojuegos favoritos.
                    </p>
                </div>

                {/* Columna 2: Enlaces rápidos */}
                <div className="footer-links">
                    <h3>Enlaces</h3>
                    <ul>
                        <li><a href="#/biblioteca">📚 Biblioteca</a></li>
                        <li><a href="#/resenas">📝 Reseñas</a></li>
                        <li><a href="#/estadisticas">📊 Estadísticas</a></li>
                    </ul>
                </div>

                {/* Columna 3: Contacto */}
                <div className="footer-info">
                    <h3>Contacto</h3>
                    <p>
                        <span>📧</span>
                        gametracker@enterprise.com
                    </p>
                    <p>
                        <span>📍</span>
                        Cali, Colombia
                    </p>
                </div>

                {/* Columna 4: Redes sociales */}
                <div className="footer-social">
                    <h3>Síguenos</h3>
                    <div className="social-icons">
                        <a
                            href="https://www.instagram.com/gabbo_sc/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            title="Síguenos en Instagram"
                        >
                            📸
                        </a>
                        <a
                            href="https://github.com/Gabito-Amateur"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            title="Visita nuestro GitHub"
                        >
                            💻
                        </a>
                        <a
                            href="#"
                            aria-label="YouTube"
                            title="Suscríbete en YouTube"
                        /*No tengo... o tal vez si? Jeje*/
                        >
                            🔴
                        </a>
                    </div>
                </div>
            </div>

            {/* Botón volver arriba */}
            <div className="footer-top">
                <button onClick={volverArriba} aria-label="Volver arriba">
                    <span>⬆</span>
                    Volver arriba
                </button>
            </div>

            {/* Copyright */}
            <div className="footer-bottom">
                <p>
                    © {new Date().getFullYear()} GameTracker — Hecho con ❤️ para gamers
                </p>
            </div>
        </footer>
    );
}