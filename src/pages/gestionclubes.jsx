import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/theme.css";
import imgEstadios from "../assets/estadios.jpg";
import imgClubes from "../assets/clubes.jpg";

const API_BASE = "http://127.0.0.1:8081";

// Paleta de colores
const colors = {
  navy: "#1a2238",
  grass: "#21e6c1",
  offwhite: "#f5f6fa",
  charcoal: "#222831",
  softred: "#e94560"
};

const styles = {
  page: {
    background: `linear-gradient(135deg, ${colors.navy} 60%, ${colors.charcoal} 100%)`,
    minHeight: "100vh",
    color: colors.offwhite,
    fontFamily: "Segoe UI, Arial, sans-serif",
    padding: "32px"
  },
  card: {
    background: colors.offwhite,
    color: colors.charcoal,
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(30,40,60,0.10)",
    padding: "24px",
    marginBottom: "32px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "16px",
    background: colors.offwhite,
    borderRadius: "8px",
    overflow: "hidden"
  },
  th: {
    background: colors.navy,
    color: colors.offwhite,
    padding: "12px"
  },
  td: {
    padding: "10px",
    borderBottom: `1px solid ${colors.navy}22`
  },
  btn: {
    background: colors.grass,
    color: colors.charcoal,
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    margin: "0 4px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.2s"
  },
  btnDanger: {
    background: colors.softred,
    color: "#fff"
  },
  btnSecondary: {
    background: colors.navy,
    color: colors.offwhite
  },
  modal: {
    background: colors.offwhite,
    color: colors.charcoal,
    borderRadius: "10px",
    boxShadow: "0 2px 16px rgba(30,40,60,0.18)",
    padding: "32px",
    position: "fixed",
    top: "50%",
    left: "50%",
    minWidth: "320px",
    transform: "translate(-50%, -50%)",
    zIndex: 1000
  },
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "#0008",
    zIndex: 999
  }
};

export default function GestionClubes() {
  const [estadios, setEstadios] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [modalEstadio, setModalEstadio] = useState(false);
  const [modalEquipo, setModalEquipo] = useState(false);
  const [formEstadio, setFormEstadio] = useState({ nombre: "", ciudad: "", pais: "", capacidad: "" });
  const [formEquipo, setFormEquipo] = useState({ nombre: "", estadio_id: "", fecha_fundacion: "", presupuesto: "" });
  // Para actualizar
  const [editEstadio, setEditEstadio] = useState(null);
  const [editEquipo, setEditEquipo] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/estadios/`).then(r => r.json()).then(setEstadios);
    fetch(`${API_BASE}/equipos/`).then(r => r.json()).then(setEquipos);
  }, []);

  const handleEstadioChange = e => setFormEstadio({ ...formEstadio, [e.target.name]: e.target.value });
  const handleEquipoChange = e => setFormEquipo({ ...formEquipo, [e.target.name]: e.target.value });

  // Para actualizar estadio
  const handleEditEstadioChange = e => setEditEstadio({ ...editEstadio, [e.target.name]: e.target.value });
  // Para actualizar equipo
  const handleEditEquipoChange = e => setEditEquipo({ ...editEquipo, [e.target.name]: e.target.value });

  const crearEstadio = async () => {
    await fetch(`${API_BASE}/estadios/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formEstadio)
    });
    setModalEstadio(false);
    fetch(`${API_BASE}/estadios/`).then(r => r.json()).then(setEstadios);
  };

  const crearEquipo = async () => {
    // Validación de campos obligatorios
    if (!formEquipo.nombre || !formEquipo.estadio_id || !formEquipo.fecha_fundacion || !formEquipo.presupuesto) {
      alert("Todos los campos son obligatorios");
      return;
    }
    // Validar formato de fecha (YYYY-MM-DD)
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(formEquipo.fecha_fundacion)) {
      alert("La fecha de fundación debe tener el formato YYYY-MM-DD");
      return;
    }
    // Validar que estadio_id y presupuesto sean números válidos
    if (isNaN(Number(formEquipo.estadio_id)) || isNaN(Number(formEquipo.presupuesto))) {
      alert("Estadio y presupuesto deben ser números válidos");
      return;
    }
    await fetch(`${API_BASE}/equipos/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: formEquipo.nombre,
        estadio_id: Number(formEquipo.estadio_id),
        fecha_fundacion: String(formEquipo.fecha_fundacion),
        presupuesto: Number(formEquipo.presupuesto)
      })
    });
    setModalEquipo(false);
    fetch(`${API_BASE}/equipos/`).then(r => r.json()).then(setEquipos);
  };

  const borrarEstadio = async id => {
    await fetch(`${API_BASE}/estadios/${id}`, { method: "DELETE" });
    fetch(`${API_BASE}/estadios/`).then(r => r.json()).then(setEstadios);
  };

  const borrarEquipo = async id => {
    await fetch(`${API_BASE}/equipos/${id}`, { method: "DELETE" });
    fetch(`${API_BASE}/equipos/`).then(r => r.json()).then(setEquipos);
  };

  // Actualizar estadio
  const actualizarEstadio = async () => {
    await fetch(`${API_BASE}/estadios/${editEstadio.estadio_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: editEstadio.nombre,
        ciudad: editEstadio.ciudad,
        pais: editEstadio.pais,
        capacidad: editEstadio.capacidad
      })
    });
    setEditEstadio(null);
    fetch(`${API_BASE}/estadios/`).then(r => r.json()).then(setEstadios);
  };

  // Actualizar equipo
  const actualizarEquipo = async () => {
    await fetch(`${API_BASE}/equipos/${editEquipo.equipo_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: editEquipo.nombre,
        estadio_id: Number(editEquipo.estadio_id),
        fecha_fundacion: editEquipo.fecha_fundacion,
        presupuesto: Number(editEquipo.presupuesto)
      })
    });
    setEditEquipo(null);
    fetch(`${API_BASE}/equipos/`).then(r => r.json()).then(setEquipos);
  };

  // Navegación (puedes conectar con React Router si lo deseas)
  const handleNavigate = (path) => {
    // Aquí puedes usar React Router para navegar
    // Por ahora solo cierra el sidebar
  };

  return (
    <div>
      <Sidebar onNavigate={handleNavigate} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 24px 24px" }}>
        <h2 style={{ color: "var(--color-grass)", marginBottom: 32, letterSpacing: 2 }}>Gestión de Clubes</h2>

        {/* Estadios */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 12 }}>
            <img src={imgEstadios} alt="Estadio" style={{ height: 80, borderRadius: 6 }} />
            <h3 style={{ color: "var(--color-navy)", margin: 0 }}>Estadios</h3>
            <button className="btn" style={{ marginLeft: "auto" }} onClick={() => setModalEstadio(true)}>+ Nuevo estadio</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Ciudad</th>
                <th>País</th>
                <th>Capacidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {estadios.map(e => (
                <tr key={e.estadio_id}>
                  <td>{e.nombre}</td>
                  <td>{e.ciudad}</td>
                  <td>{e.pais}</td>
                  <td>{e.capacidad}</td>
                  <td>
                    <button className="btn" onClick={() => setEditEstadio(e)}>Actualizar</button>
                    <button className="btn btn-danger" onClick={() => borrarEstadio(e.estadio_id)}>Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal para crear estadio */}
        {modalEstadio && (
          <>
            <div className="overlay" onClick={() => setModalEstadio(false)} />
            <div className="modal">
              <h4 style={{ color: "var(--color-navy)" }}>Nuevo Estadio</h4>
              <input name="nombre" placeholder="Nombre" onChange={handleEstadioChange} style={{ margin: 4, width: "100%" }} /><br />
              <input name="ciudad" placeholder="Ciudad" onChange={handleEstadioChange} style={{ margin: 4, width: "100%" }} /><br />
              <input name="pais" placeholder="País" onChange={handleEstadioChange} style={{ margin: 4, width: "100%" }} /><br />
              <input name="capacidad" placeholder="Capacidad" type="number" onChange={handleEstadioChange} style={{ margin: 4, width: "100%" }} /><br />
              <button className="btn" onClick={crearEstadio}>Guardar</button>
              <button className="btn btn-secondary" onClick={() => setModalEstadio(false)}>Cancelar</button>
            </div>
          </>
        )}

        {/* Modal para actualizar estadio */}
        {editEstadio && (
          <>
            <div className="overlay" onClick={() => setEditEstadio(null)} />
            <div className="modal">
              <h4 style={{ color: "var(--color-navy)" }}>Actualizar Estadio</h4>
              <input name="nombre" value={editEstadio.nombre} placeholder="Nombre" onChange={handleEditEstadioChange} style={{ margin: 4, width: "100%" }} /><br />
              <input name="ciudad" value={editEstadio.ciudad} placeholder="Ciudad" onChange={handleEditEstadioChange} style={{ margin: 4, width: "100%" }} /><br />
              <input name="pais" value={editEstadio.pais} placeholder="País" onChange={handleEditEstadioChange} style={{ margin: 4, width: "100%" }} /><br />
              <input name="capacidad" value={editEstadio.capacidad} placeholder="Capacidad" type="number" onChange={handleEditEstadioChange} style={{ margin: 4, width: "100%" }} /><br />
              <button className="btn" onClick={actualizarEstadio}>Guardar</button>
              <button className="btn btn-secondary" onClick={() => setEditEstadio(null)}>Cancelar</button>
            </div>
          </>
        )}

        {/* Equipos */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 12 }}>
            <img src={imgClubes} alt="Clubes" style={{ height: 80, borderRadius: 6 }} />
            <h3 style={{ color: "var(--color-navy)", margin: 0 }}>Equipos</h3>
            <button className="btn" style={{ marginLeft: "auto" }} onClick={() => setModalEquipo(true)}>+ Nuevo equipo</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Estadio local</th>
                <th>Fecha de fundación</th>
                <th>Presupuesto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {equipos.map(eq => (
                <tr key={eq.equipo_id}>
                  <td>{eq.nombre}</td>
                  <td>{estadios.find(e => e.estadio_id === eq.estadio_id)?.nombre || "Sin estadio"}</td>
                  <td>{eq.fecha_fundacion}</td>
                  <td>{eq.presupuesto}</td>
                  <td>
                    <button className="btn" onClick={() => setEditEquipo(eq)}>Actualizar</button>
                    <button className="btn btn-danger" onClick={() => borrarEquipo(eq.equipo_id)}>Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal para crear equipo */}
        {modalEquipo && (
          <>
            <div className="overlay" onClick={() => setModalEquipo(false)} />
            <div className="modal">
              <h4 style={{ color: "var(--color-navy)" }}>Nuevo Equipo</h4>
              <input name="nombre" placeholder="Nombre" onChange={handleEquipoChange} style={{ margin: 4, width: "100%" }} /><br />
              <select name="estadio_id" onChange={handleEquipoChange} style={{ margin: 4, width: "100%" }}>
                <option value="">Selecciona estadio</option>
                {estadios.map(e => (
                  <option key={e.estadio_id} value={e.estadio_id}>{e.nombre}</option>
                ))}
              </select><br />
              <input name="fecha_fundacion" type="date" onChange={handleEquipoChange} style={{ margin: 4, width: "100%" }} /><br />
              <input name="presupuesto" placeholder="Presupuesto" type="number" onChange={handleEquipoChange} style={{ margin: 4, width: "100%" }} /><br />
              <button className="btn" onClick={crearEquipo}>Guardar</button>
              <button className="btn btn-secondary" onClick={() => setModalEquipo(false)}>Cancelar</button>
            </div>
          </>
        )}

        {/* Modal para actualizar equipo */}
        {editEquipo && (
          <>
            <div className="overlay" onClick={() => setEditEquipo(null)} />
            <div className="modal">
              <h4 style={{ color: "var(--color-navy)" }}>Actualizar Equipo</h4>
              <input name="nombre" value={editEquipo.nombre} placeholder="Nombre" onChange={handleEditEquipoChange} style={{ margin: 4, width: "100%" }} /><br />
              <input
                name="fecha_fundacion"
                type="date"
                value={editEquipo.fecha_fundacion}
                onChange={handleEditEquipoChange}
                style={{ margin: 4, width: "100%" }}
              /><br />
              <input name="presupuesto" value={editEquipo.presupuesto} placeholder="Presupuesto" type="number" onChange={handleEditEquipoChange} style={{ margin: 4, width: "100%" }} /><br />
              <button className="btn" onClick={actualizarEquipo}>Guardar</button>
              <button className="btn btn-secondary" onClick={() => setEditEquipo(null)}>Cancelar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}