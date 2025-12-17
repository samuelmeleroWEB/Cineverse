import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./MovieDetail.module.css";
import { getMovieById } from "../../../services/movies.services";
import { getSessionsByMovie } from "../../../services/sessions.services";
import DayCarousel from "../../../components/DayCarousel/DayCarousel";

// genera N días a partir de hoy 
function generateDays(count: number = 10) {
  const today = new Date();
  const days: any[] = [];

  const weekdayNames = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
  const monthNames = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ];

  for (let i = 0; i < count; i++) {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + i
    );

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const isoDate = `${year}-${month}-${day}`;

    const weekday = weekdayNames[date.getDay()];
    const monthLabel = monthNames[date.getMonth()];

    const label = i === 0 ? "Hoy" : `${weekday} ${day} ${monthLabel}`;

    days.push({
      id: `d${i + 1}`,
      label,
      date: isoDate,
    });
  }

  return days;
}

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [days] = useState(() => generateDays(10));
  const [selectedDayId, setSelectedDayId] = useState("d1");

  useEffect(() => {
    async function load() {
      try {
        if (!id) return;
        setLoading(true);
        const [movieData, sessionData] = await Promise.all([
          getMovieById(id),
          getSessionsByMovie(id),
        ]);

        const now = new Date();

        const upcomingSessions = sessionData
          // solo sesiones cuya hora de inicio sea >= ahora
          .filter((s: any) => new Date(s.startTime).getTime() >= now.getTime())
          // ordenadas por fecha/hora ascendente
          .sort(
            (a: any, b: any) =>
              new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          );

        setMovie(movieData);
        setSessions(upcomingSessions);
      } catch (err) {
        console.error("Error al cargar película:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // --- sesiones filtradas por día seleccionado ---
  const selectedDay = days.find((d) => d.id === selectedDayId);

  const sessionsForDay = selectedDay
    ? sessions.filter((s: any) => {
        const d = new Date(s.startTime);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const iso = `${year}-${month}-${day}`;
        return iso === selectedDay.date;
      })
    : sessions;

  // -----------------------------------------------

  if (loading)
    return (
      <div className={styles.page}>
        <div className={styles.loaderWrapper}>
          <div className={styles.loaderGlow} />
          <div className={styles.loader}>
            <span className={styles.loaderDot}></span>
            <span className={styles.loaderDot}></span>
            <span className={styles.loaderDot}></span>
          </div>
          <p className={styles.loaderText}>Cargando película...</p>
        </div>
      </div>
    );

  if (!movie)
    return <div className={styles.notFound}>Película no encontrada</div>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Columna izquierda: póster + botones */}
        <div className={styles.leftCol}>
          <div className={styles.posterWrapper}>
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className={styles.poster}
            />
          </div>

          <button className={styles.primaryBtn}>Comprar entradas</button>
          <button className={styles.secondaryBtn}>Ver tráiler</button>
        </div>

        {/* Columna derecha: info */}
        <div className={styles.rightCol}>
          <div className={styles.header}>
            <h1 className={styles.title}>{movie.title}</h1>
            <span className={styles.ageBadge}>{movie.ageRating}</span>
          </div>

          <div className={styles.metaGrid}>
            <div>
              <h3 className={styles.metaLabel}>DURACIÓN</h3>
              <p className={styles.metaValue}>{movie.duration} min</p>
            </div>
            <div>
              <h3 className={styles.metaLabel}>ESTRENO</h3>
              <p className={styles.metaValue}>
                {movie.releaseDate
                  ? new Date(movie.releaseDate).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "Próximamente"}
              </p>
            </div>
            <div>
              <h3 className={styles.metaLabel}>GÉNERO</h3>
              <div className={styles.genres}>
                {movie.genre?.split(",").map((g: string) => (
                  <span key={g} className={styles.genreChip}>
                    {g.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>SINOPSIS</h3>
            <p className={styles.description}>{movie.description}</p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Sesiones</h3>

            {/* Carrusel de días compacto */}
            <div className={styles.dayCarouselWrapper}>
              <DayCarousel
                days={days}
                selectedDayId={selectedDayId}
                onChange={setSelectedDayId}
                visibleCount={4} // más pequeño que en home
                loading={false}
              />
            </div>

            {/* Mensajes y lista de sesiones filtradas */}
            {sessions.length === 0 ? (
              <p className={styles.noSessions}>No hay sesiones programadas.</p>
            ) : sessionsForDay.length === 0 ? (
              <p className={styles.noSessions}>
                No hay sesiones para este día.
              </p>
            ) : (
              <div className={styles.sessionsList}>
  {sessionsForDay.map((s: any) => (
    <button
      key={s._id}
      className={styles.sessionBtn}
      onClick={() => navigate(`/sessions/${s._id}`)}
    >
      <span className={styles.sessionTime}>
        {new Date(s.startTime).toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
      <span className={styles.sessionRoom}>{s.room?.name}</span>
    </button>
  ))}
</div>

            )}
          </section>
        </div>
      </div>
    </div>
  );
}
