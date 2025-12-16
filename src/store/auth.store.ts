import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginUsuarios, registrarUsuarios } from "../services/auth.services";
import { jwtDecode } from "jwt-decode"; 

// === Tipos ===
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export type AuthStatus = "idle" | "loading" | "authenticated" | "error";

// NUEVO: tipo para el token decodificado
interface DecodedToken {
  exp: number; // expiry en segundos desde 1970
}

export interface AuthState {
  user: User | null;
  token: string | null;
  status: AuthStatus;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;

  //  NUEVO
  checkTokenExpiration: () => void;
}

// === Store ===
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      status: "idle",
      error: null,

      // --- LOGIN ---
      login: async (email: string, password: string) => {
        set({ status: "loading", error: null });

        try {
          const respuesta = await loginUsuarios(email, password);

          const { token, user } = respuesta;

          set({
            user,
            token,
            status: "authenticated",
            error: null,
          });
        } catch (err: any) {
          set({
            status: "error",
            error: err?.message ?? "Error al iniciar sesión",
          });
          throw err;
        }
      },

      // --- REGISTER ---
      register: async (email: string, password: string) => {
        set({ status: "loading", error: null });

        try {
          await registrarUsuarios(email, password);
          await get().login(email, password);
        } catch (err: any) {
          set({
            status: "error",
            error: err?.message ?? "Error al registrarse",
          });
          throw err;
        }
      },

      // --- LOGOUT ---
      logout: () => {
        set({
          user: null,
          token: null,
          status: "idle",
          error: null,
        });
      },

      // --- COMPROBAR SI EL TOKEN HA CADUCADO ---
      checkTokenExpiration: () => {
        const token = get().token;
        if (!token) return;

        try {
          const decoded = jwtDecode<DecodedToken>(token);
          const nowInSeconds = Date.now() / 1000;

          if (decoded.exp < nowInSeconds) {
            // Token caducado → cerramos sesión
            get().logout();
          }
        } catch (error) {
          // Si el token está corrupto o no es válido, también cerramos sesión
          get().logout();
        }
      },
    }),
    {
      name: "cineverse-auth", // clave en localStorage
    }
  )
);
