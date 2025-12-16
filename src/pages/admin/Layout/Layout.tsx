import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/auth.store";
import styles from "./Layout.module.css";
import { FaArrowLeft } from "react-icons/fa";

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleBackToWeb = () => {
    navigate("/");
  };

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandText}>CINEVERSE</span>
        </div>

        <nav className={styles.nav}>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? styles.navLinkActive : styles.navLink
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/movies"
            className={({ isActive }) =>
              isActive ? styles.navLinkActive : styles.navLink
            }
          >
            Películas
          </NavLink>

          <NavLink
            to="/admin/rooms"
            className={({ isActive }) =>
              isActive ? styles.navLinkActive : styles.navLink
            }
          >
            Salas
          </NavLink>

          <NavLink
            to="/admin/sessions"
            className={({ isActive }) =>
              isActive ? styles.navLinkActive : styles.navLink
            }
          >
            Sesiones
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive ? styles.navLinkActive : styles.navLink
            }
          >
            Usuarios
          </NavLink>

          <NavLink
            to="/admin/mvp-movies"
            className={({ isActive }) =>
              isActive ? styles.navLinkActive : styles.navLink
            }
          >
            MVP Películas
          </NavLink>
        </nav>
      </aside>

      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button
              className={styles.backBtn}
              onClick={handleBackToWeb}
              title="Volver a la web"
              aria-label="Volver a la web"
            >
              <FaArrowLeft />
              <span>Volver a la web</span>
            </button>

            <div>
              <h1 className={styles.title}>Panel de administración</h1>
              <p className={styles.subtitle}>Gestiona tu cine desde aquí</p>
            </div>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.userBox}>
              <span className={styles.userName}>{user?.name || user?.email}</span>
              <span className={styles.userRole}>Admin</span>
            </div>

            <button className={styles.logoutBtn} onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
