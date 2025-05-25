import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

const API_BASE = "http://127.0.0.1:8081";

const colors = {
  navy: "#1a2238",
  grass: "#21e6c1",
  offwhite: "#f5f6fa",
  charcoal: "#222831",
  softred: "#e94560"
};

const styles = {
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
    padding: "12px",
    textAlign: "center",
    minWidth: "120px"
  },
  td: {
    padding: "10px",
    borderBottom: `1px solid ${colors.navy}22`,
    textAlign: "center",
    minWidth: "120px"
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
  input: {
    border: `1px solid ${colors.navy}33`,
    borderRadius: "6px",
    padding: "10px 14px",
    fontSize: "1rem",
    marginBottom: "4px",
    outline: "none",
    background: "#fff",
    boxShadow: "0 1px 4px rgba(30,40,60,0.06)",
    transition: "border 0.2s, box-shadow 0.2s"
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

export default function GestionTemporadas() {
  const [temporadas, setTemporadas] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [equipoTemporada, setEquipoTemporada] = useState([]);
  const [formTemporada, setFormTemporada] = useState({ año_inicio: "", año_fin: "", nombre_temporada: "" });
  const [editTemporada, setEditTemporada] = useState(null);
  const [detalleTemporada, setDetalleTemporada] = useState(null); // temporada_id
  const [equiposInscritos, setEquiposInscritos] = useState([]); // ids de equipos inscritos

  useEffect(() => {
    fetch(`${API_BASE}/temporadas/`).then(r => r.json()).then(setTemporadas);
    fetch(`${API_BASE}/equipos/`).then(r => r.json()).then(setEquipos);
    fetch(`${API_BASE}/equipo_temporada/`).then(r => r.json()).then(setEquipoTemporada);
  }, []);

  // CRUD Temporada
  const crearTemporada = async () => {
    await fetch(`${API_BASE}/temporadas/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formTemporada)
    });
    setFormTemporada({ año_inicio: "", año_fin: "", nombre_temporada: "" });
    fetch(`${API_BASE}/temporadas/`).then(r => r.json()).then(setTemporadas);
  };

  const actualizarTemporada = async () => {
    await fetch(`${API_BASE}/temporadas/${editTemporada.temporada_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ año_inicio: editTemporada.año_inicio, año_fin: editTemporada.año_fin, nombre_temporada: editTemporada.nombre_temporada })
    });
    setEditTemporada(null);
    fetch(`${API_BASE}/temporadas/`).then(r => r.json()).then(setTemporadas);
  };

  const borrarTemporada = async id => {
    await fetch(`${API_BASE}/temporadas/${id}`, { method: "DELETE" });
    fetch(`${API_BASE}/temporadas/`).then(r => r.json()).then(setTemporadas);
  };

  // Detalle de temporada y gestión de equipos inscritos
  const abrirDetalleTemporada = (temporada_id) => {
    setDetalleTemporada(temporada_id);
    // Buscar equipos inscritos en esta temporada
    fetch(`${API_BASE}/equipo_temporada/`).then(r => r.json()).then(data => {
      setEquiposInscritos(data.filter(et => et.temporada_id === temporada_id).map(et => et.equipo_id));
    });
  };

  const cerrarDetalleTemporada = () => {
    setDetalleTemporada(null);
    setEquiposInscritos([]);
  };

  const toggleEquipoTemporada = async (equipo_id, checked) => {
    if (checked) {
      // Inscribir equipo
      await fetch(`${API_BASE}/equipo_temporada/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipo_id, temporada_id: detalleTemporada })
      });
    } else {
      // Quitar equipo
      await fetch(`${API_BASE}/equipo_temporada/${equipo_id}/${detalleTemporada}`, { method: "DELETE" });
    }
    // Actualizar lista
    fetch(`${API_BASE}/equipo_temporada/`).then(r => r.json()).then(data => {
      setEquiposInscritos(data.filter(et => et.temporada_id === detalleTemporada).map(et => et.equipo_id));
    });
  };

  return (
    <div>
      <Sidebar />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 24px 24px" }}>
        <h2 style={{ color: colors.grass, marginBottom: 32, letterSpacing: 2 }}>Gestión de Temporadas</h2>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Año inicio</th>
                <th style={styles.th}>Año fin</th>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {temporadas.map(t => (
                <tr key={t.temporada_id}>
                  <td style={styles.td}>{t.año_inicio}</td>
                  <td style={styles.td}>{t.año_fin}</td>
                  <td style={styles.td}>{t.nombre_temporada}</td>
                  <td style={styles.td}>
                    <button style={styles.btn} onClick={() => setEditTemporada(t)}>Editar</button>
                    <button style={{ ...styles.btn, ...styles.btnDanger }} onClick={() => borrarTemporada(t.temporada_id)}>Borrar</button>
                    <button style={styles.btn} onClick={() => abrirDetalleTemporada(t.temporada_id)}>Inscribir equipos</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ ...styles.card, marginTop: 24 }}>
          <h4 style={{ color: colors.navy, marginBottom: 16 }}>Nueva Temporada</h4>
          <div style={{ display: "grid", gap: 12 }}>
            <input style={styles.input} name="año_inicio" placeholder="Año inicio" value={formTemporada.año_inicio} onChange={e => setFormTemporada({ ...formTemporada, año_inicio: e.target.value })} />
            <input style={styles.input} name="año_fin" placeholder="Año fin" value={formTemporada.año_fin} onChange={e => setFormTemporada({ ...formTemporada, año_fin: e.target.value })} />
            <input style={styles.input} name="nombre_temporada" placeholder="Nombre de la temporada" value={formTemporada.nombre_temporada} onChange={e => setFormTemporada({ ...formTemporada, nombre_temporada: e.target.value })} />
            <button style={styles.btn} onClick={crearTemporada}>Guardar</button>
          </div>
        </div>
        {editTemporada && (
          <>
            <div style={styles.overlay} onClick={() => setEditTemporada(null)} />
            <div style={styles.modal}>
              <h4 style={{ color: colors.navy }}>Actualizar Temporada</h4>
              <input style={styles.input} name="año_inicio" value={editTemporada.año_inicio} onChange={e => setEditTemporada({ ...editTemporada, año_inicio: e.target.value })} />
              <input style={styles.input} name="año_fin" value={editTemporada.año_fin} onChange={e => setEditTemporada({ ...editTemporada, año_fin: e.target.value })} />
              <input style={styles.input} name="nombre_temporada" value={editTemporada.nombre_temporada} onChange={e => setEditTemporada({ ...editTemporada, nombre_temporada: e.target.value })} />
              <button style={styles.btn} onClick={actualizarTemporada}>Guardar</button>
              <button style={styles.btn} onClick={() => setEditTemporada(null)}>Cancelar</button>
            </div>
          </>
        )}
        {detalleTemporada && (
          <>
            <div style={styles.overlay} onClick={cerrarDetalleTemporada} />
            <div style={styles.modal}>
              <h4 style={{ color: colors.navy }}>Inscribir equipos en temporada</h4>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {equipos.map(eq => (
                  <li key={eq.equipo_id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={equiposInscritos.includes(eq.equipo_id)}
                        onChange={e => toggleEquipoTemporada(eq.equipo_id, e.target.checked)}
                      />
                      {eq.nombre}
                    </label>
                  </li>
                ))}
              </ul>
              <button style={styles.btn} onClick={cerrarDetalleTemporada}>Cerrar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
