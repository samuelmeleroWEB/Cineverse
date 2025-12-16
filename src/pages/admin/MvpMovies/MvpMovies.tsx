import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import estilos from "./MvpMovies.module.css";
import {
  getMvpMovies,
  updateMvpMovies,
  getMovies,
} from "../../../services/movies.services";

type Movie = {
  _id: string;
  title: string;
  posterUrl?: string;
  mvpImageUrl?: string; //
};

export function MvpMovies() {
  const navigate = useNavigate();

  // real  de editar película
  const EDIT_MOVIE_ROUTE = "/admin/movies/edit";

  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const movies = await getMovies();

        let mvp: Movie[] = [];
        try {
          mvp = await getMvpMovies();
        } catch (err) {
          console.warn("Aún no hay endpoint /movies/mvp o ha fallado", err);
        }

        setAllMovies(movies);
        setSelectedIds(mvp.map((m) => m._id));
      } catch (err) {
        console.error("Error cargando MVP pelis", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const toggleMovie = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const goEditBanner = (movie: Movie) => {
    navigate("/admin/movies/edit", { state: { movie } });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateMvpMovies(selectedIds);
    } catch (err) {
      console.error("Error guardando MVP", err);
    } finally {
      setSaving(false);
    }
  };

  //  Calculamos SIN hooks (así no rompe el orden)
  const currentMvp = allMovies.filter((m) => selectedIds.includes(m._id));
  const otherMovies = allMovies.filter((m) => !selectedIds.includes(m._id));

  if (loading) {
    return <div className={estilos.wrapper}>Cargando películas...</div>;
  }

  return (
    <div className={estilos.wrapper}>
      <header className={estilos.header}>
        <div>
          <h1 className={estilos.title}>MVP PELÍCULAS</h1>
          <p className={estilos.subtitle}>
            Elige qué películas aparecerán en el carrusel principal de la home.
          </p>
          <p className={estilos.hint}>
            Solo podrás seleccionar películas que tengan{" "}
            <strong>imagen ancha</strong> (banner MVP).
          </p>
        </div>

        <button
          className={estilos.saveButton}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </header>

      {/* SECCIÓN 1: MVP ACTUALES */}
      <section className={estilos.section}>
        <div className={estilos.sectionHeader}>
          <h2 className={estilos.sectionTitle}>
            MVP del mes ({currentMvp.length})
          </h2>
          <p className={estilos.sectionSubtitle}>
            Haz clic en una tarjeta para <strong>quitarla</strong> de las MVP.
          </p>
        </div>

        {currentMvp.length === 0 ? (
          <p className={estilos.emptyText}>
            Todavía no hay películas marcadas como MVP. Selecciona algunas
            abajo.
          </p>
        ) : (
          <div className={estilos.grid}>
            {currentMvp.map((movie) => {
              const hasBanner = !!movie.mvpImageUrl;

              return (
                <div key={movie._id} className={estilos.movieCardWrap}>
                  <button
                    type="button"
                    className={`${estilos.movieCard} ${estilos.movieCardSelected}`}
                    onClick={() => toggleMovie(movie._id)}
                  >
                    <div className={estilos.posterWrapper}>
                      {movie.posterUrl ? (
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className={estilos.poster}
                        />
                      ) : (
                        <div className={estilos.posterPlaceholder}>
                          Sin póster
                        </div>
                      )}
                    </div>

                    <div className={estilos.movieInfo}>
                      <h3 className={estilos.movieTitle}>{movie.title}</h3>
                      <span className={estilos.badge}>MVP</span>

                      {!hasBanner && (
                        <span className={estilos.missingBadge}>
                          Falta imagen ancha
                        </span>
                      )}
                    </div>

                    <span className={estilos.removeHint}>
                      Click para quitar
                    </span>
                  </button>

                  {!hasBanner && (
                    <button
                      type="button"
                      className={estilos.addBannerBtn}
                      onClick={() => goEditBanner(movie)}
                    >
                      Añadir banner
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SECCIÓN 2: OTRAS PELÍCULAS */}
      <section className={estilos.section}>
        <div className={estilos.sectionHeader}>
          <h2 className={estilos.sectionTitle}>Otras películas</h2>
          <p className={estilos.sectionSubtitle}>
            Haz clic en una tarjeta para <strong>añadirla</strong> a MVP (solo
            si tiene banner).
          </p>
        </div>

        {otherMovies.length === 0 ? (
          <p className={estilos.emptyText}>
            No hay más películas disponibles. Crea nuevas películas en
            “Películas”.
          </p>
        ) : (
          <div className={estilos.grid}>
            {otherMovies.map((movie) => {
              const hasBanner = !!movie.mvpImageUrl;
              const isDisabled = !hasBanner;

              return (
                <div
                  key={movie._id}
                  className={`${estilos.movieCardWrap} ${
                    isDisabled ? estilos.movieCardWrapDisabled : ""
                  }`}
                >
                  <button
                    type="button"
                    className={`${estilos.movieCard} ${
                      isDisabled ? estilos.movieCardDisabled : ""
                    }`}
                    onClick={() => toggleMovie(movie._id)}
                    disabled={isDisabled}
                    title={
                      isDisabled
                        ? "Falta imagen ancha (banner MVP)"
                        : "Añadir a MVP"
                    }
                  >
                    <div className={estilos.posterWrapper}>
                      {movie.posterUrl ? (
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className={estilos.poster}
                        />
                      ) : (
                        <div className={estilos.posterPlaceholder}>
                          Sin póster
                        </div>
                      )}
                    </div>

                    <div className={estilos.movieInfo}>
                      <h3 className={estilos.movieTitle}>{movie.title}</h3>

                      {isDisabled && (
                        <span className={estilos.missingBadge}>
                          Falta imagen ancha
                        </span>
                      )}
                    </div>
                  </button>

                  {isDisabled && (
                    <button
                      type="button"
                      className={estilos.addBannerBtn}
                      onClick={() => goEditBanner(movie)}
                    >
                      Añadir banner
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
