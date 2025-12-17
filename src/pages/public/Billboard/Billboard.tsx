
import { useEffect, useState, type FormEvent } from "react";
import styles from "./Billboard.module.css";
import { getMovies } from "../../../services/movies.services";
import { Link } from "react-router-dom";

interface Movie {
  _id: string;
  title: string;
  description: string;
  duration: number;
  genre: string;
  ageRating: string;
  posterUrl: string;
}

export default function Billboard() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔍 estados del buscador
  const [inputTerm, setInputTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getMovies();
        setMovies(data);
      } catch (err) {
        console.error("Error cargando películas:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 🔍 filtrar películas por texto (título, género, edad)
  const filteredMovies = movies.filter((m) => {
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();

    const title = m.title.toLowerCase();
    const genre = m.genre?.toLowerCase?.() ?? "";
    const ageRating = m.ageRating?.toLowerCase?.() ?? "";

    return (
      title.includes(term) ||
      genre.includes(term) ||
      ageRating.includes(term)
    );
  });

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSearchTerm(inputTerm);
  };

  const handleClearSearch = () => {
    setInputTerm("");
    setSearchTerm("");
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>TODAS LAS PELÍCULAS</h1>
      <p className={styles.subtitle}>
        Todas las películas disponibles actualmente en nuestro cine.
      </p>

      {loading ? (
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skelPoster} />
              <div className={styles.skelTitle} />
              <div className={styles.skelMeta} />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* 🔍 Barra de búsqueda */}
          <div className={styles.searchBarRow}>
            <form
              onSubmit={handleSearchSubmit}
              className={styles.searchForm}
            >
              <input
                type="text"
                placeholder="Buscar por título, género, edad..."
                value={inputTerm}
                onChange={(e) => setInputTerm(e.target.value)}
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchButton}>
                Buscar
              </button>
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className={styles.clearButton}
                >
                  X
                </button>
              )}
            </form>
          </div>

          {/* GRID DE PELÍCULAS */}
          <div className={styles.grid}>
            {filteredMovies.map((m) => (
              <Link
                key={m._id}
                to={`/billboard/${m._id}`}
                className={styles.card}
              >
                <div className={styles.posterWrapper}>
                  <img
                    src={m.posterUrl}
                    alt={m.title}
                    className={styles.poster}
                  />
                </div>
                <h2 className={styles.movieTitle}>{m.title}</h2>
              </Link>
            ))}

            {!filteredMovies.length && (
              <p className={styles.empty}>
                {movies.length === 0
                  ? "No hay películas en cartel ahora mismo."
                  : "No hay películas que coincidan con la búsqueda."}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
