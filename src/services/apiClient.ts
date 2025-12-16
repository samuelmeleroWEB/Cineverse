import { useAuthStore } from "../store/auth.store";

export interface ApiClientOptions extends RequestInit {
  isFormData?: boolean;
}
// apiclient lo usamos cuando queremos llamar a servicios protegidos con un token(tipo mis reservas)
export async function apiClient(
  url: string,
  options: ApiClientOptions = {}
) {
  const { token, logout } = useAuthStore.getState();

  const { isFormData, headers: optionHeaders, ...restOptions } = options;

  // Construimos headers base
  const headers: HeadersInit = {
    ...(optionHeaders || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Solo ponemos Content-Type JSON si NO es FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const config: RequestInit = {
    ...restOptions,
    headers,
  };

  const response = await fetch(url, config);

  // Si la API devuelve 401 → token caducado
  if (response.status === 401) {
    logout();
    throw new Error("Sesión expirada. Inicia sesión de nuevo.");
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Error en la petición");
  }

  return response.json();
}
