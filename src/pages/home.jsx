import React from "react";
import { useNavigate } from "react-router-dom";
import imgHome from "../assets/home.jpg";

const colors = {
  navy: "#1a2238",
  grass: "#21e6c1",
  offwhite: "#f5f6fa",
  charcoal: "#222831",
  softred: "#e94560"
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundImage: `url(${imgHome})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(26, 34, 56, 0.85)",
    zIndex: 1
  },
  content: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    padding: "2rem",
    maxWidth: "800px"
  },
  title: {
    color: colors.offwhite,
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "3rem",
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
  },
  buttonContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "2rem",
    marginTop: "2rem"
  },
  button: {
    background: colors.grass,
    color: colors.charcoal,
    border: "none",
    borderRadius: "8px",
    padding: "1rem 2rem",
    fontSize: "1.2rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 8px rgba(0,0,0,0.2)"
    }
  }
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />
      <div style={styles.content}>
        <h1 style={styles.title}>
          Bienvenido al Sistema de Gestión de Equipos de Fútbol
        </h1>
        <div style={styles.buttonContainer}>
          <button 
            style={styles.button} 
            onClick={() => navigate("/gestion-clubes")}
          >
            Gestión de Clubes
          </button>
          <button 
            style={styles.button} 
            onClick={() => navigate("/gestion-plantilla")}
          >
            Gestión de Plantilla
          </button>
          <button 
            style={styles.button} 
            onClick={() => navigate("/gestion-partidos")}
          >
            Gestión de Partidos
          </button>
          <button 
            style={styles.button} 
            onClick={() => navigate("/gestion-temporadas")}
          >
            Gestión de Temporadas
          </button>
        </div>
      </div>
    </div>
  );
}
