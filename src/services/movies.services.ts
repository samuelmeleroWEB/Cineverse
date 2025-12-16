import { apiClient } from "./apiClient";

const BASE_URL = "http://localhost:4000";

export async function getSessionsByDate(date: string) {
  const res = await fetch(`${BASE_URL}/sessions/by-date?date=${date}`);
  if (!res.ok) throw new Error("Error al cargar sesiones");
  return res.json();
}

export async function getMovies() {
  const res = await fetch(`${BASE_URL}/movies`);
  if (!res.ok) throw new Error("Error al obtener películas");
  return res.json();
}

//  Tipo común de película que enviamos al backend
type MoviePayload = {
  title: string;
  description: string;
  duration: number;
  genre: string;
  ageRating: string;
  posterUrl: string;
  releaseDate: string;
  mvpImageUrl?: string; 
};

export async function createMovie(movie: MoviePayload) {
  return apiClient(`${BASE_URL}/movies`, {
    method: "POST",
    body: JSON.stringify(movie),
  });
}

export async function deleteMovie(id: string) {
  return apiClient(`${BASE_URL}/movies/${id}`, {
    method: "DELETE",
  });
}

export async function getMovieById(id: string) {
  const res = await fetch(`${BASE_URL}/movies/${id}`);
  if (!res.ok) throw new Error("Error al obtener película");
  return res.json();
}

export async function updateMovie(id: string, movie: MoviePayload) {
  return apiClient(`${BASE_URL}/movies/${id}`, {
    method: "PUT",
    body: JSON.stringify(movie),
  });
}

/* ==== MVP PELÍCULAS ==== */

export async function getMvpMovies() {
  const res = await fetch(`${BASE_URL}/movies/mvp`);
  if (!res.ok) throw new Error("Error al obtener películas MVP");
  return res.json();
}

export async function updateMvpMovies(movieIds: string[]) {
  return apiClient(`${BASE_URL}/movies/mvp`, {
    method: "PUT",
    body: JSON.stringify({ movieIds }),
  });
}
