import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCartStore } from "../../../store/cart.store";
import styles from "./SessionDetails.module.css";
import toast from "react-hot-toast";
import { getSessionById } from "../../../services/sessions.services";

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H","I", "J"]; // ajusta según la capacidad de nuestras salas
const SEATS_PER_ROW = 10;

type SessionData = {
  _id: string;
  movie: { _id: string; title: string };
  room: { _id: string; name: string };
  startTime: string;
  basePrice: number;
  occupiedSeats: string[];
};

export default function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();
// usamos useeffect, para traernos la información de la sesión
  useEffect(() => {
    async function load() {
      try {
        if (!id) return;
        setLoading(true);
        const data = await getSessionById(id);
        setSession(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

 if (loading)
  return (
    <div className={styles.loadingPage}>
      <div className={styles.loaderWrapper}>
        <div className={styles.loaderGlow} />
        <div className={styles.loader}>
          <span className={styles.loaderDot}></span>
          <span className={styles.loaderDot}></span>
          <span className={styles.loaderDot}></span>
        </div>
        <p className={styles.loaderText}>Cargando sesión...</p>
      </div>
    </div>
  );

  if (!session) return <div className={styles.error}>Sesión no encontrada</div>;

  const isOccupied = (seatCode: string) =>
    session.occupiedSeats?.includes(seatCode);

  const toggleSeat = (seatCode: string) => {
    if (isOccupied(seatCode)) return; // no se pueden tocar ocupadas

    setSelectedSeats((prev) =>
      prev.includes(seatCode)
        ? prev.filter((s) => s !== seatCode)
        : [...prev, seatCode]
    );
  };

  const handleAddToCart = () => {
    if (selectedSeats.length === 0) {
      toast.error("Selecciona al menos una butaca");
      return;
    }

    addItem({
      type: "ticket",
      movieId: session.movie._id,
      movieTitle: session.movie.title,
      sessionId: session._id,
      sessionDateTime: session.startTime,
      roomName: session.room.name,
      seats: selectedSeats,
      pricePerSeat: session.basePrice,
    } as any);

    toast.success("Entradas añadidas al carrito");
    navigate("/cart");
  };

return (
  <div className={styles.page}>
    <div className={styles.wrapper}>
      {/* CABECERA */}
      <header className={styles.headerCard}>
        <h1 className={styles.title}>{session.movie.title}</h1>
        <div className={styles.headerMeta}>
          <span>
            {" "}
            {new Date(session.startTime).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span>
            🕒{" "}
            {new Date(session.startTime).toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span>🎞 {session.room.name}</span>
        </div>
      </header>

      {/* PANTALLA */}
      <div className={styles.screenWrapper}>
        <div className={styles.screen}>SCREEN</div>
      </div>

      {/* GRID DE BUTACAS */}
      <div className={styles.seatsCard}>
        <div className={styles.seatsGrid}>
          {ROWS.map((row) => (
            <div key={row} className={styles.row}>
              <span className={styles.rowLabel}>{row}</span>
              {Array.from({ length: SEATS_PER_ROW }).map((_, idx) => {
                const seatNumber = idx + 1;
                const seatCode = `${row}${seatNumber}`;
                const occupied = isOccupied(seatCode);
                const selected = selectedSeats.includes(seatCode);

                return (
                  <button
                    key={seatCode}
                    type="button"
                    className={`${styles.seat} ${
                      occupied ? styles.seatOccupied : ""
                    } ${selected ? styles.seatSelected : ""}`}
                    onClick={() => toggleSeat(seatCode)}
                    disabled={occupied}
                  >
                    {seatCode}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* LEYENDA */}
        <div className={styles.legend}>
          <span>
            <span className={`${styles.legendDot} ${styles.free}`} /> Available
          </span>
          <span>
            <span
              className={`${styles.legendDot} ${styles.selectedDot}`}
            />{" "}
            Selected
          </span>
          <span>
            <span
              className={`${styles.legendDot} ${styles.occupiedDot}`}
            />{" "}
            Occupied
          </span>
        </div>
      </div>

      {/* BARRA INFERIOR */}
      <div className={styles.bottomBar}>
        <div className={styles.selectedInfo}>
          <span className={styles.selectedLabel}>Selected Seats</span>
          <span className={styles.selectedSeats}>
            {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Ninguna"}
          </span>
        </div>

        <div className={styles.totalInfo}>
          <span className={styles.totalLabel}>Total Price</span>
          <span className={styles.totalValue}>
            {(selectedSeats.length * session.basePrice).toFixed(2)} €
          </span>
        </div>

        <button className={styles.confirmBtn} onClick={handleAddToCart}>
          Confirm Booking
        </button>
      </div>
    </div>
  </div>
);

}
