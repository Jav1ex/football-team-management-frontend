import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/theme.css";
import imgJugadores from "../assets/Jugadores.jpg";
import imgEntrenadores from "../assets/entrenadores.jpg";

const API_BASE = "https://football-team-management-personnel-service-production.up.railway.app";
const CLUBES_API = "https://football-team-management-club-season-service-production.up.railway.app";

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
  select: {
    border: `1px solid ${colors.navy}33`,
    borderRadius: "6px",
    padding: "10px 14px",
    fontSize: "1rem",
    marginBottom: "4px",
    outline: "none",
    background: "#fff",
    boxShadow: "0 1px 4px rgba(30,40,60,0.06)",
    transition: "border 0.2s, box-shadow 0.2s"
  }
};

export default function GestionPlantilla() {
  const [tab, setTab] = useState("jugadores");

  // Jugadores
  const [jugadores, setJugadores] = useState([]);
  const [formJugador, setFormJugador] = useState({ nombre: "", apellidos: "", fecha_nac: "", nacionalidad: "", posicion: "", salario: "" });
  const [editJugador, setEditJugador] = useState(null);
  const [modalAsignarJugador, setModalAsignarJugador] = useState(false);
  const [jugadorAsignarId, setJugadorAsignarId] = useState(null);

  // Entrenadores
  const [entrenadores, setEntrenadores] = useState([]);
  const [formEntrenador, setFormEntrenador] = useState({ nombre: "", apellidos: "", fecha_nac: "", nacionalidad: "", años_experiencia: "" });
  const [editEntrenador, setEditEntrenador] = useState(null);
  const [modalAsignarEntrenador, setModalAsignarEntrenador] = useState(false);
  const [entrenadorAsignarId, setEntrenadorAsignarId] = useState(null);

  // Juega_En y Entrena
  const [formJuegaEn, setFormJuegaEn] = useState({ equipo_id: "", temporada_id: "", fecha_inicio: "", fecha_fin: "" });
  const [formEntrena, setFormEntrena] = useState({ equipo_id: "", temporada_id: "", fecha_inicio: "", fecha_fin: "" });

  // Listas para selects (asumimos que existen endpoints)
  const [equipos, setEquipos] = useState([]);
  const [temporadas, setTemporadas] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/jugadores/`).then(r => r.json()).then(setJugadores);
    fetch(`${API_BASE}/entrenadores/`).then(r => r.json()).then(setEntrenadores);
    fetch(`${CLUBES_API}/equipos/`).then(r => r.json()).then(setEquipos);
    fetch(`${CLUBES_API}/temporadas/`).then(r => r.json()).then(setTemporadas);
  }, []);

  // Handlers generales
  const handleJugadorChange = e => setFormJugador({ ...formJugador, [e.target.name]: e.target.value });
  const handleEntrenadorChange = e => setFormEntrenador({ ...formEntrenador, [e.target.name]: e.target.value });

  // CRUD Jugador
  const crearJugador = async () => {
    await fetch(`${API_BASE}/jugadores/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formJugador)
    });
    setFormJugador({ nombre: "", apellidos: "", fecha_nac: "", nacionalidad: "", posicion: "", salario: "" });
    fetch(`${API_BASE}/jugadores/`).then(r => r.json()).then(setJugadores);
  };

  const actualizarJugador = async () => {
    await fetch(`${API_BASE}/jugadores/${editJugador.jugador_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editJugador)
    });
    setEditJugador(null);
    fetch(`${API_BASE}/jugadores/`).then(r => r.json()).then(setJugadores);
  };

  const borrarJugador = async id => {
    await fetch(`${API_BASE}/jugadores/${id}`, { method: "DELETE" });
    fetch(`${API_BASE}/jugadores/`).then(r => r.json()).then(setJugadores);
  };

  // CRUD Entrenador
  const crearEntrenador = async () => {
    await fetch(`${API_BASE}/entrenadores/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formEntrenador)
    });
    setFormEntrenador({ nombre: "", apellidos: "", fecha_nac: "", nacionalidad: "", años_experiencia: "" });
    fetch(`${API_BASE}/entrenadores/`).then(r => r.json()).then(setEntrenadores);
  };

  const actualizarEntrenador = async () => {
    await fetch(`${API_BASE}/entrenadores/${editEntrenador.entrenador_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editEntrenador)
    });
    setEditEntrenador(null);
    fetch(`${API_BASE}/entrenadores/`).then(r => r.json()).then(setEntrenadores);
  };

  const borrarEntrenador = async id => {
    await fetch(`${API_BASE}/entrenadores/${id}`, { method: "DELETE" });
    fetch(`${API_BASE}/entrenadores/`).then(r => r.json()).then(setEntrenadores);
  };

  // Asignar jugador a equipo/temporada
  const abrirModalAsignarJugador = (jugador_id) => {
    setJugadorAsignarId(jugador_id);
    setFormJuegaEn({ equipo_id: "", temporada_id: "", fecha_inicio: "", fecha_fin: "" });
    setModalAsignarJugador(true);
  };
  const guardarAsignacionJugador = async () => {
    await fetch(`${API_BASE}/juega_en/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formJuegaEn, jugador_id: jugadorAsignarId })
    });
    setModalAsignarJugador(false);
  };

  // Asignar entrenador a equipo/temporada
  const abrirModalAsignarEntrenador = (entrenador_id) => {
    setEntrenadorAsignarId(entrenador_id);
    setFormEntrena({ equipo_id: "", temporada_id: "", fecha_inicio: "", fecha_fin: "" });
    setModalAsignarEntrenador(true);
  };
  const guardarAsignacionEntrenador = async () => {
    await fetch(`${API_BASE}/entrena/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formEntrena, entrenador_id: entrenadorAsignarId })
    });
    setModalAsignarEntrenador(false);
  };

  return (
    <div>
      <Sidebar />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 24px 24px" }}>
        <h2 style={{ color: colors.grass, marginBottom: 32, letterSpacing: 2 }}>Gestión de Plantilla</h2>
        <div style={{ marginBottom: 24 }}>
          <button 
            style={{ ...styles.btn, ...(tab === "jugadores" ? styles.btnSecondary : {}) }}
            onClick={() => setTab("jugadores")}
          >Jugadores</button>
          <button 
            style={{ ...styles.btn, ...(tab === "entrenadores" ? styles.btnSecondary : {}) }}
            onClick={() => setTab("entrenadores")}
            >Entrenadores</button>
        </div>
        {/* Pestaña Jugadores */}
        {tab === "jugadores" && (
          <div style={styles.card}>
            <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 12 }}>
              <img src={imgJugadores} alt="Jugadores" style={{ height: 80, borderRadius: 6 }} />
              <h3 style={{ color: colors.navy, margin: 0 }}>Jugadores</h3>
            </div>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nombre</th>
                  <th style={styles.th}>Apellidos</th>
                  <th style={styles.th}>Nacionalidad</th>
                  <th style={styles.th}>Posición</th>
                  <th style={styles.th}>Salario</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {jugadores.map(j => (
                  <tr key={j.jugador_id}>
                    <td style={styles.td}>{j.nombre}</td>
                    <td style={styles.td}>{j.apellidos}</td>
                    <td style={styles.td}>{j.nacionalidad}</td>
                    <td style={styles.td}>{j.posicion}</td>
                    <td style={styles.td}>{j.salario}</td>
                    <td style={styles.td}>
                      <button style={styles.btn} onClick={() => setEditJugador(j)}>Editar</button>
                      <button style={{ ...styles.btn, ...styles.btnDanger }} onClick={() => borrarJugador(j.jugador_id)}>Borrar</button>
                      <button style={styles.btn} onClick={() => abrirModalAsignarJugador(j.jugador_id)}>Asignar a equipo</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ ...styles.card, marginTop: 24 }}>
              <h4 style={{ color: colors.navy, marginBottom: 16 }}>Nuevo / Editar Jugador</h4>
              <div style={{ display: "grid", gap: 12 }}>
                <input style={styles.input} name="nombre" placeholder="Nombre" value={formJugador.nombre} onChange={handleJugadorChange} />
                <input style={styles.input} name="apellidos" placeholder="Apellidos" value={formJugador.apellidos} onChange={handleJugadorChange} />
                <input style={styles.input} name="fecha_nac" type="date" placeholder="Fecha Nac (YYYY-MM-DD)" value={formJugador.fecha_nac} onChange={handleJugadorChange} />
                <input style={styles.input} name="nacionalidad" placeholder="Nacionalidad" value={formJugador.nacionalidad} onChange={handleJugadorChange} />
                <select style={styles.select} name="posicion" value={formJugador.posicion} onChange={handleJugadorChange}>
                  <option value="">Selecciona posición</option>
                  <option value="Portero">Portero</option>
                  <option value="Defensa">Defensa</option>
                  <option value="Mediocampista">Mediocampista</option>
                  <option value="Delantero">Delantero</option>
                </select>
                <input style={styles.input} name="salario" placeholder="Salario" value={formJugador.salario} onChange={handleJugadorChange} />
                <button style={styles.btn} onClick={crearJugador}>Guardar</button>
              </div>
            </div>
            {/* Modal de actualización */}
            {editJugador && (
              <div style={styles.overlay} onClick={() => setEditJugador(null)} />,
              <div style={styles.modal}>
                <h4 style={{ color: colors.navy }}>Actualizar Jugador</h4>
                <input style={styles.input} name="nombre" value={editJugador.nombre} onChange={e => setEditJugador({...editJugador, nombre: e.target.value})} />
                <input style={styles.input} name="apellidos" value={editJugador.apellidos} onChange={e => setEditJugador({...editJugador, apellidos: e.target.value})} />
                <input style={styles.input} name="nacionalidad" value={editJugador.nacionalidad} onChange={e => setEditJugador({...editJugador, nacionalidad: e.target.value})} />
                <select style={styles.select} name="posicion" value={editJugador.posicion} onChange={e => setEditJugador({...editJugador, posicion: e.target.value})}>
                  <option value="">Selecciona posición</option>
                  <option value="Portero">Portero</option>
                  <option value="Defensa">Defensa</option>
                  <option value="Mediocampista">Mediocampista</option>
                  <option value="Delantero">Delantero</option>
                </select>
                <input style={styles.input} name="salario" value={editJugador.salario} onChange={e => setEditJugador({...editJugador, salario: e.target.value})} />
                <button style={styles.btn} onClick={actualizarJugador}>Guardar</button>
                <button style={styles.btn} onClick={() => setEditJugador(null)}>Cancelar</button>
              </div>
            )}
            {/* Modal asignar a equipo */}
            {modalAsignarJugador && (
              <>
                <div style={styles.overlay} onClick={() => setModalAsignarJugador(false)} />
                <div style={styles.modal}>
                  <h4 style={{ color: colors.navy }}>Asignar a equipo</h4>
                  <select style={styles.select} name="equipo_id" value={formJuegaEn.equipo_id} onChange={e => setFormJuegaEn({ ...formJuegaEn, equipo_id: e.target.value })}>
                    <option value="">Selecciona equipo</option>
                    {equipos.map(eq => <option key={eq.equipo_id} value={eq.equipo_id}>{eq.nombre}</option>)}
                  </select>
                  <select style={styles.select} name="temporada_id" value={formJuegaEn.temporada_id} onChange={e => setFormJuegaEn({ ...formJuegaEn, temporada_id: e.target.value })}>
                    <option value="">Selecciona temporada</option>
                    {temporadas.map(t => <option key={t.temporada_id} value={t.temporada_id}>{t.nombre}</option>)}
                  </select>
                  <input style={styles.input} name="fecha_inicio" type="date" placeholder="Fecha inicio (YYYY-MM-DD)" value={formJuegaEn.fecha_inicio} onChange={e => setFormJuegaEn({ ...formJuegaEn, fecha_inicio: e.target.value })} />
                  <input style={styles.input} name="fecha_fin" type="date" placeholder="Fecha fin (YYYY-MM-DD)" value={formJuegaEn.fecha_fin} onChange={e => setFormJuegaEn({ ...formJuegaEn, fecha_fin: e.target.value })} />
                  <button style={styles.btn} onClick={guardarAsignacionJugador}>Guardar</button>
                  <button style={styles.btn} onClick={() => setModalAsignarJugador(false)}>Cancelar</button>
                </div>
              </>
            )}
          </div>
        )}
        {/* Pestaña Entrenadores */}
        {tab === "entrenadores" && (
          <div style={styles.card}>
            <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 12 }}>
              <img src={imgEntrenadores} alt="Entrenadores" style={{ height: 80, borderRadius: 6 }} />
              <h3 style={{ color: colors.navy, margin: 0 }}>Entrenadores</h3>
            </div>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nombre</th>
                  <th style={styles.th}>Apellidos</th>
                  <th style={styles.th}>Nacionalidad</th>
                  <th style={styles.th}>Años de experiencia</th>
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {entrenadores.map(e => (
                  <tr key={e.entrenador_id}>
                    <td style={styles.td}>{e.nombre}</td>
                    <td style={styles.td}>{e.apellidos}</td>
                    <td style={styles.td}>{e.nacionalidad}</td>
                    <td style={styles.td}>{e.años_experiencia}</td>
                    <td style={styles.td}>
                      <button style={styles.btn} onClick={() => setEditEntrenador(e)}>Editar</button>
                      <button style={{ ...styles.btn, ...styles.btnDanger }} onClick={() => borrarEntrenador(e.entrenador_id)}>Borrar</button>
                      <button style={styles.btn} onClick={() => abrirModalAsignarEntrenador(e.entrenador_id)}>Asignar a equipo</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ ...styles.card, marginTop: 24 }}>
              <h4 style={{ color: colors.navy, marginBottom: 16 }}>Nuevo / Editar Entrenador</h4>
              <div style={{ display: "grid", gap: 12 }}>
                <input style={styles.input} name="nombre" placeholder="Nombre" value={formEntrenador.nombre} onChange={handleEntrenadorChange} />
                <input style={styles.input} name="apellidos" placeholder="Apellidos" value={formEntrenador.apellidos} onChange={handleEntrenadorChange} />
                <input style={styles.input} name="fecha_nac" type="date" placeholder="Fecha Nac (YYYY-MM-DD)" value={formEntrenador.fecha_nac} onChange={handleEntrenadorChange} />
                <input style={styles.input} name="nacionalidad" placeholder="Nacionalidad" value={formEntrenador.nacionalidad} onChange={handleEntrenadorChange} />
                <input style={styles.input} name="años_experiencia" placeholder="Años de experiencia" value={formEntrenador.años_experiencia} onChange={handleEntrenadorChange} />
                <button style={styles.btn} onClick={crearEntrenador}>Guardar</button>
              </div>
            </div>
            {/* Modal de actualización */}
            {editEntrenador && (
              <div style={styles.overlay} onClick={() => setEditEntrenador(null)} />,
              <div style={styles.modal}>
                <h4 style={{ color: colors.navy }}>Actualizar Entrenador</h4>
                <input style={styles.input} name="nombre" value={editEntrenador.nombre} onChange={e => setEditEntrenador({...editEntrenador, nombre: e.target.value})} />
                <input style={styles.input} name="apellidos" value={editEntrenador.apellidos} onChange={e => setEditEntrenador({...editEntrenador, apellidos: e.target.value})} />
                <input style={styles.input} name="nacionalidad" value={editEntrenador.nacionalidad} onChange={e => setEditEntrenador({...editEntrenador, nacionalidad: e.target.value})} />
                <input style={styles.input} name="años_experiencia" value={editEntrenador.años_experiencia} onChange={e => setEditEntrenador({...editEntrenador, años_experiencia: e.target.value})} />
                <button style={styles.btn} onClick={actualizarEntrenador}>Guardar</button>
                <button style={styles.btn} onClick={() => setEditEntrenador(null)}>Cancelar</button>
              </div>
            )}
            {/* Modal asignar a equipo */}
            {modalAsignarEntrenador && (
              <>
                <div style={styles.overlay} onClick={() => setModalAsignarEntrenador(false)} />
                <div style={styles.modal}>
                  <h4 style={{ color: colors.navy }}>Asignar a equipo</h4>
                  <select style={styles.select} name="equipo_id" value={formEntrena.equipo_id} onChange={e => setFormEntrena({ ...formEntrena, equipo_id: e.target.value })}>
                    <option value="">Selecciona equipo</option>
                    {equipos.map(eq => <option key={eq.equipo_id} value={eq.equipo_id}>{eq.nombre}</option>)}
                  </select>
                  <select style={styles.select} name="temporada_id" value={formEntrena.temporada_id} onChange={e => setFormEntrena({ ...formEntrena, temporada_id: e.target.value })}>
                    <option value="">Selecciona temporada</option>
                    {temporadas.map(t => <option key={t.temporada_id} value={t.temporada_id}>{t.nombre}</option>)}
                  </select>
                  <input style={styles.input} name="fecha_inicio" type="date" placeholder="Fecha inicio (YYYY-MM-DD)" value={formEntrena.fecha_inicio} onChange={e => setFormEntrena({ ...formEntrena, fecha_inicio: e.target.value })} />
                  <input style={styles.input} name="fecha_fin" type="date" placeholder="Fecha fin (YYYY-MM-DD)" value={formEntrena.fecha_fin} onChange={e => setFormEntrena({ ...formEntrena, fecha_fin: e.target.value })} />
                  <button style={styles.btn} onClick={guardarAsignacionEntrenador}>Guardar</button>
                  <button style={styles.btn} onClick={() => setModalAsignarEntrenador(false)}>Cancelar</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}