

import { useEffect, useState } from "react";
import { getDashboardData, type DashboardData } from "../../../services/dashboard.services";
import estilos from "./Dashboard.module.css";

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const respuesta = await getDashboardData();
        setData(respuesta);
      } catch (err) {
        console.error("Error cargando dashboard", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <div className={estilos.dashboard}>Cargando datos del cine...</div>;
  }

  if (!data) {
    return <div className={estilos.dashboard}>No se pudieron cargar los datos.</div>;
  }

  const { stats, nextSessions, occupancyByRoom } = data;

  return (
    <div className={estilos.dashboard}>
      {/* CABECERA */}
      <header className={estilos.header}>
        <div>
          <h1 className={estilos.title}>Panel de Administración</h1>
          <p className={estilos.subtitle}>
            Resumen de lo que está pasando hoy en tu cine.
          </p>
        </div>

       
      </header>

       {/* MÉTRICAS RÁPIDAS */}
      <section className={estilos.statsGrid}>
        <article className={estilos.statCard}>
          <p className={estilos.statLabel}>Películas activas</p>
          <p className={estilos.statValue}>{stats.moviesActive}</p>
          <span className={estilos.statChip}>Total en cartelera</span>
        </article>

        <article className={estilos.statCard}>
          <p className={estilos.statLabel}>Sesiones hoy</p>
          <p className={estilos.statValue}>{stats.sessionsToday}</p>
          <span className={estilos.statChip}>Incluye todas las salas</span>
        </article>

        <article className={estilos.statCard}>
          <p className={estilos.statLabel}>Entradas vendidas hoy</p>
          <p className={estilos.statValue}>{stats.ticketsSoldToday}</p>
          <span className={estilos.statChip}>Online + taquilla</span>
        </article>

        <article className={estilos.statCard}>
          <p className={estilos.statLabel}>Ocupación media</p>
          <p className={estilos.statValue}>{stats.avgOccupancy}%</p>
          <span className={estilos.statChip}>Objetivo 70%</span>
        </article>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <section className={estilos.contentGrid}>
        {/* Próximas sesiones */}
        <article className={estilos.card}>
          <header className={estilos.cardHeader}>
            <h2 className={estilos.cardTitle}>Próximas sesiones</h2>
            <span className={estilos.cardBadge}>Hoy</span>
          </header>

          <table className={estilos.table}>
            <thead>
              <tr>
                <th>Hora</th>
                <th>Película</th>
                <th>Sala</th>
                <th>Ocupación</th>
              </tr>
            </thead>
            <tbody>
              {nextSessions.map((s) => (
                <tr key={`${s.time}-${s.room}`}>
                  <td>{s.time}</td>
                  <td>{s.movie}</td>
                  <td>{s.room}</td>
                  <td>
                    <div className={estilos.progressWrapper}>
                      <div
                        className={estilos.progressBar}
                        style={{ width: `${s.occupancy}%` }}
                      />
                      <span className={estilos.progressLabel}>
                        {s.occupancy}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        {/* Ocupación por sala */}
        <article className={estilos.card}>
          <header className={estilos.cardHeader}>
            <h2 className={estilos.cardTitle}>Ocupación por sala (hoy)</h2>
          </header>

          <ul className={estilos.roomsList}>
            {occupancyByRoom.map((r) => (
              <li key={r.room} className={estilos.roomItem}>
                <div className={estilos.roomHeader}>
                  <span className={estilos.roomName}>{r.room}</span>
                  <span className={estilos.roomPercent}>{r.percent}%</span>
                </div>
                <div className={estilos.roomBarWrapper}>
                  <div
                    className={estilos.roomBar}
                    style={{ width: `${r.percent}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <p className={estilos.cardHint}>
            Usa estos datos para decidir en qué salas reforzar sesiones
            en horas punta.
          </p>
        </article>
      </section>
    </div>
  );
}
