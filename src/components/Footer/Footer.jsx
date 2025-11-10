import "./Footer.css";

export default function Footer() {
    const volverArriba = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Columna 1: Logo */}
                <div className="footer-logo">
                    <h2>🎮 GameTracker</h2>
                    <p>Organiza y reseña tus videojuegos favoritos</p>
                </div>

                {/* Columna 2: Contacto */}
                <div className="footer-info">
                    <h3>Contacto</h3>
                    <p>📧 gabrielsuarezcifuentes1221@gmail.com</p>
                    <p>📍 Cali, Colombia</p>
                </div>

                {/* Columna 3: Redes */}
                <div className="footer-social">
                    <h3>Síguenos</h3>
                    <div className="social-icons">
                        <a href="#https://www.instagram.com/gabbo_sc/" aria-label="Instagram">📸</a>
                        <a href="#" aria-label="YouTube">🔴</a>
                    </div>
                </div>

                {/* Columna 4: Botón */}
                <div className="footer-top">
                    <button onClick={volverArriba}>⬆️ Volver arriba</button>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} GameTracker — Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}
