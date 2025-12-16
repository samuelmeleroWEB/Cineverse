
import { getSessionsByDate, getMovies } from "./movies.services";
import { getRooms } from "./rooms.services"; // o como se llame tu servicio de salas

export interface DashboardStats {
  moviesActive: number;
  sessionsToday: number;
  ticketsSoldToday: number;
  avgOccupancy: number; // 0-100
}

export interface NextSession {
  time: string;
  movie: string;
  room: string;
  occupancy: number; // 0-100
}

export interface RoomOccupancy {
  room: string;
  percent: number; // 0-100
}

export interface DashboardData {
  stats: DashboardStats;
  nextSessions: NextSession[];
  occupancyByRoom: RoomOccupancy[];
}

function formatTodayISO(): string {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function getDashboardData(): Promise<DashboardData> {
  const today = formatTodayISO();

  // Llamadas reales
  const [movies, sessions, rooms] = await Promise.all([
    getMovies(),              // -> array de películas
    getSessionsByDate(today),    // -> array de sesiones de hoy
    getRooms(),               // -> array de salas
  ]);

  // --- CÁLCULOS ---
  const moviesActive = movies.length;
  const sessionsToday = sessions.length;

  // Ajusta este campo a cómo guardes las entradas vendidas
  const ticketsSoldToday = sessions.reduce((acc: number, s: any) => {
    // Ejemplos: s.ticketsSold || s.bookings.length || s.occupiedSeats.length...
    const sold = s.ticketsSold ?? s.occupiedSeats?.length ?? 0;
    return acc + sold;
  }, 0);

  // Ocupación media (assumiendo capacidad en s.room.capacity)
  let totalPercent = 0;
  let countWithCapacity = 0;

  sessions.forEach((s: any) => {
    const capacity = s.room?.capacity ?? 0;
    const occupied = s.ticketsSold ?? s.occupiedSeats?.length ?? 0;
    if (capacity > 0) {
      totalPercent += (occupied / capacity) * 100;
      countWithCapacity++;
    }
  });

  const avgOccupancy =
    countWithCapacity === 0 ? 0 : Math.round(totalPercent / countWithCapacity);

  // Próximas sesiones (ordenadas por hora, cogemos las 4 primeras)
  const now = new Date();

  const nextSessions = sessions
    .map((s: any) => ({
      date: new Date(s.startTime),
      movie: s.movie?.title ?? "Película",
      room: s.room?.name ?? "Sala",
      occupancy: (() => {
        const capacity = s.room?.capacity ?? 0;
        const occupied = s.ticketsSold ?? s.occupiedSeats?.length ?? 0;
        if (!capacity) return 0;
        return Math.round((occupied / capacity) * 100);
      })(),
    }))
    .filter((s:any) => s.date >= now)
    .sort((a:any, b:any) => a.date.getTime() - b.date.getTime())
    .slice(0, 4)
    .map((s:any) => ({
      time: s.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      movie: s.movie,
      room: s.room,
      occupancy: s.occupancy,
    }));

  // Ocupación por sala
  const occupancyByRoom = rooms.map((room: any) => {
    const roomSessions = sessions.filter(
      (s: any) => s.room?._id === room._id
    );

    if (roomSessions.length === 0) {
      return {
        room: room.name,
        percent: 0,
      };
    }

    let sum = 0;
    let count = 0;

    roomSessions.forEach((s: any) => {
      const capacity = room.capacity ?? 0;
      const occupied = s.ticketsSold ?? s.occupiedSeats?.length ?? 0;
      if (!capacity) return;
      sum += (occupied / capacity) * 100;
      count++;
    });

    const avg = count === 0 ? 0 : Math.round(sum / count);
    return {
      room: room.name,
      percent: avg,
    };
  });

  return {
    stats: {
      moviesActive,
      sessionsToday,
      ticketsSoldToday,
      avgOccupancy,
    },
    nextSessions,
    occupancyByRoom,
  };
}
