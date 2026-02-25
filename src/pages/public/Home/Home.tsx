import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import estilos from "./Home.module.css";
import DayCarousel from "../../../components/DayCarousel/DayCarousel";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { SwiperNavButtons } from "../../../components/SwiperNavButtons/SwiperNavButtons";
import {
  getSessionsByDate,
  getMvpMovies,
} from "../../../services/movies.services";

/*
 Agrupa una lista de sesiones por película, devolviendo un array donde cada elemento contiene:
- la película
- todas sus sesiones asociadas
*/
function groupSessionsByMovie(sessions: any[]) {
  const map: Record<
    string,
    {
      movie: any;
      sessions: any[];
    }
  > = {};

  for (const session of sessions) {
    const movieId = session.movie._id;

    if (!map[movieId]) {
      map[movieId] = {
        movie: session.movie,
        sessions: [],
      };
    }

    map[movieId].sessions.push(session);
  }

  return Object.values(map); // [ { movie, sessions: [...] }, ... ]
}

// genera N días a partir de hoy, esta función la usamos para generar los días en el carrusel
function generateDays(count: number = 10): any[] {
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
    const month = String(date.getMonth() + 1).padStart(2, "0"); //sumamos 1 para que el mes este correcto
    const day = String(date.getDate()).padStart(2, "0");
    const isoDate = `${year}-${month}-${day}`; // para el backend
    const weekday = weekdayNames[date.getDay()]; // aqui nos da el día de la semana
    const monthLabel = monthNames[date.getMonth()]; // aqui nos da el nombre mes exacto

    const label = i === 0 ? "Hoy" : `${weekday} ${day} ${monthLabel}`; // si i es igual a cero pondrá hoy 

    days.push({
      id: `d${i + 1}`,
      label,
      date: isoDate,
    });
  }

  return days;
}

export function Home() {
  const navigate = useNavigate();
  const [days] = useState(() => generateDays(20)); // 20 días a partir de hoy
  const [selectedDayId, setSelectedDayId] = useState("d1");
  const [sessions, setSessions] = useState([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  // pelis MVP para el carrusel principal
  const [mvpMovies, setMvpMovies] = useState<any[]>([]);
  const [loadingMvp, setLoadingMvp] = useState(true);

  useEffect(() => {
    async function loadMvp() {
      try {
        setLoadingMvp(true);
        const respuesta = await getMvpMovies();
        setMvpMovies(respuesta);
      } catch (err) {
        console.error("Error cargando MVP pelis", err);
        setMvpMovies([]);
      } finally {
        setLoadingMvp(false);
      }
    }

    loadMvp();
  }, []);

  async function getSessions() {
    const selectedDay = days.find((d) => d.id === selectedDayId);
    if (!selectedDay) return;

    try {
      setIsLoadingSessions(true);
      const respuesta = await getSessionsByDate(selectedDay.date);
      setSessions(respuesta);
    } catch (err) {
      console.error(err);
      setSessions([]);
    } finally {
      setIsLoadingSessions(false);
    }
  }
  useEffect(() => {
    getSessions();
  }, [selectedDayId, days]);

  const grouped = groupSessionsByMovie(sessions as any);

  return (
    <div className={estilos.homePage}>
      {/* MVP  PELÍCULAS DEL MES */}
      {loadingMvp ? (
        // Esqueleto de carga
        <div className={`${estilos.mySwiper} ${estilos.mvpSkeleton}`}>
          <div className={estilos.skeletonHeroWrapper}>
            <div className={estilos.skeletonHero} />
          </div>
        </div>
      ) : mvpMovies.length === 0 ? (
        // Mensaje cuando no hay MVP configuradas
        <div className={`${estilos.mySwiper} ${estilos.mvpEmptySlide}`}>
          <h2 className={estilos.tittleImg}>Sin películas destacadas</h2>
          <p>
            Configura las películas MVP en el panel de administración para
            mostrarlas aquí.
          </p>
        </div>
      ) : (
        // Swiper normal con las películas MVP
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          centeredSlides={true}
          loop={mvpMovies.length > 1}
          autoplay={
            mvpMovies.length > 1
              ? {
                  delay: 7500,
                  disableOnInteraction: false,
                }
              : false
          }
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className={estilos.mySwiper}
        >
          {mvpMovies.map((movie: any) => {
            const heroSrc = movie.mvpImageUrl || movie.posterUrl;

            return (
              <SwiperSlide key={movie._id} className={estilos.heroSlide}>
                {/* TEXTO + BOTÓN (CAPA SUPERIOR) */}
                <div className={estilos.heroContent}>
                  <h2 className={estilos.tittleImg}>{movie.title}</h2>
                  <button
                    className={estilos.botonImg}
                    onClick={() => navigate(`/billboard/${movie._id}`)}
                  >
                    Ver detalles
                  </button>
                </div>

                {/* IMAGEN CON LATERALES OSCUROS */}
                <div className={estilos.heroImageWrapper}>
                  <img
                    className={estilos.heroImage}
                    src={heroSrc}
                    alt={movie.title}
                  />
                </div>
              </SwiperSlide>
            );
          })}

          {/* BOTONES PERSONALIZADOS DEL SWIPER */}
          <SwiperNavButtons />
        </Swiper>
      )}

      {/* CARRUSEL DE DÍAS */}
      <DayCarousel
        days={days}
        selectedDayId={selectedDayId}
        onChange={setSelectedDayId}
        loading={isLoadingSessions}
      />

      {/* CARTELERA DEL DÍA (AGRUPADA POR PELÍCULA) */}
      <section className={estilos.dailySchedule}>
        <header className={estilos.dailyScheduleHeader}>
          <h2 className={estilos.dailyScheduleTitle}>Cartelera del día</h2>
          <p className={estilos.dailyScheduleSubtitle}>
            Elige tu sesión para el día seleccionado.
          </p>
        </header>

        {/* Loader justo debajo del título */}
        {isLoadingSessions && (
          <div className={estilos.loaderWrapper}>
            <div className={estilos.loader}></div>
            <p className={estilos.loaderText}>
              Cargando sesiones de cine...
            </p>
          </div>
        )}

        {/* Solo mensaje vacío si NO está cargando */}
        {!isLoadingSessions && grouped.length === 0 && (
          <p className={estilos.emptyState}>No hay sesiones para este día.</p>
        )}

        {/* Pelis solo cuando NO está cargando */}
        {!isLoadingSessions && (
          <div className={estilos.moviesGrid}>
            {grouped.map(({ movie, sessions }) => (
              <article key={movie._id} className={estilos.movieCard}>
                {/* POSTER → MovieDetail */}
                <div
                  className={estilos.moviePoster}
                  onClick={() => navigate(`/billboard/${movie._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className={estilos.moviePosterImg}
                  />
                </div>

                {/* INFO + HORARIOS */}
                <div className={estilos.movieInfo}>
                  <div
                    className={estilos.movieInfoHeader}
                    onClick={() => navigate(`/billboard/${movie._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <h3 className={estilos.movieTitle}>{movie.title}</h3>
                  </div>

                  <p className={estilos.movieDescription}>
                    {movie.description}
                  </p>

                  <div className={estilos.sessionsHeader}>
                    <span className={estilos.sessionsLabel}>
                      Sesiones disponibles
                    </span>
                    <span className={estilos.sessionsHint}>
                      Toca un horario para continuar con la compra
                    </span>
                  </div>

                  <div className={estilos.sessionsGrid}>
                    {sessions.map((s: any) => (
                      <button
                        key={s._id}
                        className={estilos.sessionButton}
                        onClick={() => navigate(`/sessions/${s._id}`)}
                      >
                        <span className={estilos.sessionTime}>
                          {new Date(s.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className={estilos.sessionRoom}>
                          {s.room?.name ?? "Sala"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
