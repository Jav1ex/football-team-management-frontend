import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import GestionClubes from "./pages/gestionclubes.jsx";
import GestionPlantilla from "./pages/gestionplantilla.jsx";
import GestionPartidosYEstadisticas from "./pages/gestionpartidosyestadisticas.jsx";
import GestionTemporadas from "./pages/gestiontemporadas.jsx";
// import GestionTemporadas from "./pages/gestiontemporadas.jsx"; // Si la necesitas después

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gestion-clubes" element={<GestionClubes />} />
        <Route path="/gestion-plantilla" element={<GestionPlantilla />} />
        <Route path="/gestion-partidos" element={<GestionPartidosYEstadisticas />} />
        <Route path="/gestion-temporadas" element={<GestionTemporadas />} />
        {/* <Route path="/estadisticas" element={<Estadisticas />} /> */}
        {/* <Route path="/gestion-temporadas" element={<GestionTemporadas />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

