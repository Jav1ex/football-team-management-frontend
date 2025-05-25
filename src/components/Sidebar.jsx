import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/theme.css";

const menuItems = [
  { name: "Home", path: "/" },
  { name: "Gestión de Clubes", path: "/gestion-clubes" },
  { name: "Gestión de Plantilla", path: "/gestion-plantilla" },
  { name: "Gestión de Partidos y Estadísticas", path: "/gestion-partidos" },
  { name: "Gestión de Temporadas", path: "/gestion-temporadas" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Icono hamburguesa */}
      <button
        className="sidebar-hamburger"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
      >
        <span className="sidebar-bar" />
        <span className="sidebar-bar" />
        <span className="sidebar-bar" />
      </button>
      {/* Overlay */}
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}
      {/* Sidebar */}
      <nav className={`sidebar${open ? " open" : ""}`}>
        <button className="sidebar-close" onClick={() => setOpen(false)} aria-label="Cerrar menú">×</button>
        <ul>
          {menuItems.map(item => (
            <li key={item.name}>
              <Link 
                to={item.path} 
                onClick={() => handleNavigate(item.path)}
                style={{ textDecoration: 'none' }}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
} 