import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Router from "./routes/Router";
import "./index.css";

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Router />
      </main>
      <Footer />
    </div>
  );
}

