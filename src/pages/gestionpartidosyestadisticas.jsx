import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import imgPartidos from "../assets/partido.jpg";

const API_BASE = "https://football-team-management-match-stats-service-production.up.railway.app/";
const CLUBES_API = "https://football-team-management-club-season-service-production.up.railway.app";
const PERSONAL_API = "https://football-team-management-personnel-service-production.up.railway.app";

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
    minWidth: "600px",
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

export default function GestionPartidosYEstadisticas() {
  const [partidos, setPartidos] = useState([]);
  const [formPartido, setFormPartido] = useState({ temporada_id: "", fecha: "", hora: "", estadio_id: "", equipo_local: "", equipo_visitante: "" });
  const [editPartido, setEditPartido] = useState(null);
  const [detallePartido, setDetallePartido] = useState(null); // partido_id

  // Para selects
  const [estadios, setEstadios] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [temporadas, setTemporadas] = useState([]);

  // Detalle partido
  const [jugadores, setJugadores] = useState([]);
  const [alineacion, setAlineacion] = useState([]); // ids
  const [goles, setGoles] = useState([]);
  const [amonestaciones, setAmonestaciones] = useState([]);
  const [nuevoGol, setNuevoGol] = useState({ jugador_id: "", minuto: "" });
  const [nuevaAmonestacion, setNuevaAmonestacion] = useState({ jugador_id: "", minuto: "", tipo: "" });
  const [editGoles, setEditGoles] = useState({ goles_local: 0, goles_visitante: 0 });

  useEffect(() => {
    fetch(`${API_BASE}/partidos/`).then(r => r.json()).then(setPartidos);
    fetch(`${CLUBES_API}/estadios/`).then(r => r.json()).then(setEstadios);
    fetch(`${CLUBES_API}/equipos/`).then(r => r.json()).then(setEquipos);
    fetch(`${CLUBES_API}/temporadas/`).then(r => r.json()).then(setTemporadas);
    fetch(`${PERSONAL_API}/jugadores/`).then(r => r.json()).then(setJugadores);
  }, []);

  // CRUD Partido
  const crearPartido = async () => {
    let hora = formPartido.hora;
    // Si la hora es HH:MM, agregar :00 para que sea HH:MM:SS
    if (hora && hora.length === 5) {
      hora = hora + ':00';
    }
    await fetch(`${API_BASE}/partidos/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formPartido, hora })
    });
    setFormPartido({ temporada_id: "", fecha: "", hora: "", estadio_id: "", equipo_local: "", equipo_visitante: "" });
    fetch(`${API_BASE}/partidos/`).then(r => r.json()).then(setPartidos);
  };

  const borrarPartido = async id => {
    await fetch(`${API_BASE}/partidos/${id}`, { method: "DELETE" });
    fetch(`${API_BASE}/partidos/`).then(r => r.json()).then(setPartidos);
  };

  // Detalle partido
  const abrirDetallePartido = (partido) => {
    setDetallePartido(partido);
    setEditGoles({ goles_local: partido.goles_local, goles_visitante: partido.goles_visitante });
    fetch(`${API_BASE}/participa/`).then(r => r.json()).then(data => {
      setAlineacion(data.filter(p => p.partido_id === partido.partido_id).map(p => p.jugador_id));
    });
    fetch(`${API_BASE}/goles/`).then(r => r.json()).then(data => {
      setGoles(data.filter(g => g.partido_id === partido.partido_id));
    });
    fetch(`${API_BASE}/amonestaciones/`).then(r => r.json()).then(data => {
      setAmonestaciones(data.filter(a => a.partido_id === partido.partido_id));
    });
  };
  const cerrarDetallePartido = () => {
    setDetallePartido(null);
    setAlineacion([]);
    setGoles([]);
    setAmonestaciones([]);
  };

  // Alineación
  const toggleJugadorAlineacion = async (jugador_id, checked) => {
    if (checked) {
      await fetch(`${API_BASE}/participa/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partido_id: detallePartido.partido_id, jugador_id })
      });
    } else {
      await fetch(`${API_BASE}/participa/${detallePartido.partido_id}/${jugador_id}`, { method: "DELETE" });
    }
    fetch(`${API_BASE}/participa/`).then(r => r.json()).then(data => {
      setAlineacion(data.filter(p => p.partido_id === detallePartido.partido_id).map(p => p.jugador_id));
    });
  };

  // Goles
  const guardarGol = async () => {
    await fetch(`${API_BASE}/goles/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...nuevoGol, partido_id: detallePartido.partido_id })
    });
    setNuevoGol({ jugador_id: "", minuto: "" });
    fetch(`${API_BASE}/goles/`).then(r => r.json()).then(data => {
      setGoles(data.filter(g => g.partido_id === detallePartido.partido_id));
    });
  };

  // Amonestaciones
  const guardarAmonestacion = async () => {
    await fetch(`${API_BASE}/amonestaciones/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...nuevaAmonestacion, partido_id: detallePartido.partido_id })
    });
    setNuevaAmonestacion({ jugador_id: "", minuto: "", tipo: "" });
    fetch(`${API_BASE}/amonestaciones/`).then(r => r.json()).then(data => {
      setAmonestaciones(data.filter(a => a.partido_id === detallePartido.partido_id));
    });
  };

  const guardarGoles = async () => {
    await fetch(`${API_BASE}/partidos/${detallePartido.partido_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editGoles)
    });
    // Refrescar datos del partido y lista
    fetch(`${API_BASE}/partidos/`).then(r => r.json()).then(setPartidos);
    // Actualizar detallePartido localmente
    setDetallePartido({ ...detallePartido, ...editGoles });
  };

  return (
    <div>
      <Sidebar />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 24px 24px" }}>
        <h2 style={{ color: colors.grass, marginBottom: 32, letterSpacing: 2 }}>Gestión de Partidos y Estadísticas</h2>
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Fecha</th>
                <th style={styles.th}>Hora</th>
                <th style={styles.th}>Estadio</th>
                <th style={styles.th}>Local</th>
                <th style={styles.th}>Visitante</th>
                <th style={styles.th}>Marcador</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {partidos.map(p => (
                <tr key={p.partido_id}>
                  <td style={styles.td}>{p.fecha}</td>
                  <td style={styles.td}>{p.hora}</td>
                  <td style={styles.td}>{estadios.find(e => e.estadio_id === p.estadio_id)?.nombre || ""}</td>
                  <td style={styles.td}>{equipos.find(e => e.equipo_id === p.equipo_local)?.nombre || ""}</td>
                  <td style={styles.td}>{equipos.find(e => e.equipo_id === p.equipo_visitante)?.nombre || ""}</td>
                  <td style={styles.td}>{p.goles_local} - {p.goles_visitante}</td>
                  <td style={styles.td}>
                    <button style={styles.btn} onClick={() => abrirDetallePartido(p)}>Detalle</button>
                    <button style={{ ...styles.btn, ...styles.btnDanger }} onClick={() => borrarPartido(p.partido_id)}>Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ ...styles.card, marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 12 }}>
            <img src={imgPartidos} alt="Partidos" style={{ height: 80, borderRadius: 6 }} />
            <h4 style={{ color: colors.navy, margin: 0 }}>Nuevo Partido</h4>
          </div>
          <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
            <select style={styles.select} name="temporada_id" value={formPartido.temporada_id} onChange={e => setFormPartido({ ...formPartido, temporada_id: e.target.value })}>
              <option value="">Selecciona temporada</option>
              {temporadas.map(t => <option key={t.temporada_id} value={t.temporada_id}>{t.nombre_temporada}</option>)}
            </select>
            <input style={styles.input} name="fecha" type="date" placeholder="Fecha (YYYY-MM-DD)" value={formPartido.fecha} onChange={e => setFormPartido({ ...formPartido, fecha: e.target.value })} />
            <input style={styles.input} name="hora" type="time" placeholder="Hora (HH:MM:SS)" value={formPartido.hora} onChange={e => setFormPartido({ ...formPartido, hora: e.target.value })} />
            <select style={styles.select} name="estadio_id" value={formPartido.estadio_id} onChange={e => setFormPartido({ ...formPartido, estadio_id: e.target.value })}>
              <option value="">Selecciona estadio</option>
              {estadios.map(e => <option key={e.estadio_id} value={e.estadio_id}>{e.nombre}</option>)}
            </select>
            <select style={styles.select} name="equipo_local" value={formPartido.equipo_local} onChange={e => setFormPartido({ ...formPartido, equipo_local: e.target.value })}>
              <option value="">Selecciona local</option>
              {equipos.map(e => <option key={e.equipo_id} value={e.equipo_id}>{e.nombre}</option>)}
            </select>
            <select style={styles.select} name="equipo_visitante" value={formPartido.equipo_visitante} onChange={e => setFormPartido({ ...formPartido, equipo_visitante: e.target.value })}>
              <option value="">Selecciona visitante</option>
              {equipos.map(e => <option key={e.equipo_id} value={e.equipo_id}>{e.nombre}</option>)}
            </select>
            <button style={styles.btn} onClick={crearPartido}>Guardar</button>
          </div>
        </div>
        {detallePartido && (
          <>
            <div style={styles.overlay} onClick={cerrarDetallePartido} />
            <div style={styles.modal}>
              <h4 style={{ color: colors.navy }}>Detalle del Partido</h4>
              <div>
                <strong>Fecha:</strong> {detallePartido.fecha} <strong>Hora:</strong> {detallePartido.hora}<br />
                <strong>Estadio:</strong> {estadios.find(e => e.estadio_id === detallePartido.estadio_id)?.nombre || ""}<br />
                <strong>Local:</strong> {equipos.find(e => e.equipo_id === detallePartido.equipo_local)?.nombre || ""} <strong>vs</strong> {equipos.find(e => e.equipo_id === detallePartido.equipo_visitante)?.nombre || ""}<br />
                <strong>Marcador:</strong> {detallePartido.goles_local} - {detallePartido.goles_visitante}
                <div style={{ margin: '8px 0' }}>
                  <input
                    type="number"
                    min="0"
                    value={editGoles.goles_local}
                    onChange={e => setEditGoles({ ...editGoles, goles_local: parseInt(e.target.value) })}
                    style={{ ...styles.input, width: 60, marginRight: 8 }}
                    placeholder="Goles local"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    min="0"
                    value={editGoles.goles_visitante}
                    onChange={e => setEditGoles({ ...editGoles, goles_visitante: parseInt(e.target.value) })}
                    style={{ ...styles.input, width: 60, marginLeft: 8 }}
                    placeholder="Goles visitante"
                  />
                  <button style={{ ...styles.btn, marginLeft: 12 }} onClick={guardarGoles}>Guardar goles</button>
                </div>
              </div>
              <hr />
              <div>
                <h5>Alineación</h5>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {jugadores.map(j => (
                    <li key={j.jugador_id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={alineacion.includes(j.jugador_id)}
                          onChange={e => toggleJugadorAlineacion(j.jugador_id, e.target.checked)}
                        />
                        {j.nombre} {j.apellidos}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5>Goles</h5>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Jugador</th>
                      <th style={styles.th}>Minuto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {goles.map(g => (
                      <tr key={g.gol_id}>
                        <td style={styles.td}>{jugadores.find(j => j.jugador_id === g.jugador_id)?.nombre || ""}</td>
                        <td style={styles.td}>{g.minuto}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <select style={styles.select} name="jugador_id" value={nuevoGol.jugador_id} onChange={e => setNuevoGol({ ...nuevoGol, jugador_id: e.target.value })}>
                  <option value="">Jugador</option>
                  {alineacion.map(jid => {
                    const jug = jugadores.find(j => j.jugador_id === jid);
                    return <option key={jid} value={jid}>{jug?.nombre} {jug?.apellidos}</option>;
                  })}
                </select>
                <input style={styles.input} name="minuto" placeholder="Minuto" value={nuevoGol.minuto} onChange={e => setNuevoGol({ ...nuevoGol, minuto: e.target.value })} />
                <button style={styles.btn} onClick={guardarGol}>Añadir gol</button>
              </div>
              <div>
                <h5>Amonestaciones</h5>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Jugador</th>
                      <th style={styles.th}>Minuto</th>
                      <th style={styles.th}>Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amonestaciones.map(a => (
                      <tr key={a.amonest_id}>
                        <td style={styles.td}>{jugadores.find(j => j.jugador_id === a.jugador_id)?.nombre || ""}</td>
                        <td style={styles.td}>{a.minuto}</td>
                        <td style={styles.td}>{a.tipo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <select style={styles.select} name="jugador_id" value={nuevaAmonestacion.jugador_id} onChange={e => setNuevaAmonestacion({ ...nuevaAmonestacion, jugador_id: e.target.value })}>
                  <option value="">Jugador</option>
                  {alineacion.map(jid => {
                    const jug = jugadores.find(j => j.jugador_id === jid);
                    return <option key={jid} value={jid}>{jug?.nombre} {jug?.apellidos}</option>;
                  })}
                </select>
                <input style={styles.input} name="minuto" placeholder="Minuto" value={nuevaAmonestacion.minuto} onChange={e => setNuevaAmonestacion({ ...nuevaAmonestacion, minuto: e.target.value })} />
                <select style={styles.select} name="tipo" value={nuevaAmonestacion.tipo} onChange={e => setNuevaAmonestacion({ ...nuevaAmonestacion, tipo: e.target.value })}>
                  <option value="">Tipo</option>
                  <option value="Amarilla">Amarilla</option>
                  <option value="Roja">Roja</option>
                </select>
                <button style={styles.btn} onClick={guardarAmonestacion}>Añadir amonestación</button>
              </div>
              <button style={styles.btn} onClick={cerrarDetallePartido}>Cerrar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
