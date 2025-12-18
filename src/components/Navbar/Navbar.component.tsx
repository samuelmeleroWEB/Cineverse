import { Link, useLocation } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import estilos from "./Navbar.module.css";
import { useAuthStore } from "../../store/auth.store";
import { useCartStore } from "../../store/cart.store";
import { CgShoppingCart } from "react-icons/cg";
import { FaUserCircle } from "react-icons/fa";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";

type AuthMode = "login" | "register";
type PanelMode = "nav" | "user" | null;
const NAV_LINKS = [
  { to: "/", label: "INICIO" },
  { to: "/billboard", label: "CARTELERA" },
  { to: "/promotions", label: "PROMOCIONES" },
  { to: "/menus", label: "MENUS" },
];

export default function Navbar() {
  const location = useLocation();

  const totalItems = useCartStore((s) => s.totalItems());
  const { user, token, login, register, logout, status, error } = useAuthStore();

  const [isScrolled, setIsScrolled] = useState(false);

  // Modal Auth unificado
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Panel lateral (nav o user)
  const [panelMode, setPanelMode] = useState<PanelMode>(null);

  const authenticated = !!token;

  // Usamos usememo para memorizar el nombre del usuario que es su correo antes del @. se vuelve a ejecutar cuando cambies el usuario
  const displayName = useMemo(() => {
    return user?.name?.split(" ")[0] || (user?.email ? user.email.split("@")[0] : "");
  }, [user]);

  const isAdmin = user?.role === "admin";
  // Scroll
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cerrar paneles al navegar
  useEffect(() => {
    setPanelMode(null);
  }, [location.pathname]);

  const resetAuthFields = useCallback(() => {
    setEmail("");
    setPassword("");
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthMode(null);
    resetAuthFields();
  }, [resetAuthFields]);

  const openAuthModal = useCallback((mode: AuthMode) => {
    setAuthMode(mode);
  }, []);

  const validateAuth = useCallback(() => {
    if (!email.trim()) {
      alert("El correo electrónico es obligatorio.");
      return false;
    }
    if (!password.trim()) {
      alert("La contraseña es obligatoria.");
      return false;
    }
    return true;
  }, [email, password]);

  const handleAuthSubmit = useCallback(async () => {
    if (!authMode) return;
    if (!validateAuth()) return;

    try {
      if (authMode === "login") await login(email, password);
      if (authMode === "register") await register(email, password);
      closeAuthModal();
    } catch {
      alert(authMode === "login" ? "Error al iniciar sesión" : "Error al registrarse");
    }
  }, [authMode, closeAuthModal, email, login, password, register, validateAuth]);

  const togglePanel = useCallback((mode: Exclude<PanelMode, null>) => {
    setPanelMode((prev) => (prev === mode ? null : mode));
  }, []);

  const closePanel = useCallback(() => setPanelMode(null), []);

  const handleLogout = useCallback(() => {
    logout();
    closePanel();
  }, [logout, closePanel]);

  const panelTitle = panelMode === "nav" ? "Menú" : "Tu cuenta";

  return (
    <>
      {/* NAVBAR */}
      <nav className={`${estilos.navbar} ${isScrolled ? estilos.navbarScrolled : ""}`}>
        <Link to="/" className={estilos.brand}>
          <h2 className={estilos.titulologo}>CINEVERSE</h2>
        </Link>

        {/* LINKS DESKTOP */}
        <div className={estilos.navLinks}>
          {NAV_LINKS.map((l) => (
            <Link key={l.to} className={estilos.enlaces} to={l.to}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* ZONA DERECHA */}
        <div className={estilos.right}>
          {/* CARRITO */}
          <Link to="/cart" className={estilos.cartLink} aria-label="Ir al carrito">
            <CgShoppingCart size={25} />
            {totalItems > 0 && <span className={estilos.cartBadge}>{totalItems}</span>}
          </Link>

          {/* AUTH / USER DESKTOP */}
          <div className={estilos.actions}>
            {authenticated ? (
              <button
                className={estilos.userButton}
                onClick={() => togglePanel("user")}
                type="button"
                aria-label="Abrir panel de usuario"
              >
                <FaUserCircle size={22} className={estilos.userIcon} />
                <span className={estilos.userName}>{displayName}</span>
              </button>
            ) : (
              <div className={estilos.authButtons}>
                <button className={estilos.login} onClick={() => openAuthModal("login")} type="button">
                  Iniciar sesión
                </button>
                <button className={estilos.login} onClick={() => openAuthModal("register")} type="button">
                  Registrarse
                </button>
              </div>
            )}
          </div>

          {/* MOBILE ICONS */}
          <div className={estilos.mobileActions}>
            {/* Usuario: icono */}
            {authenticated ? (
              <button
                className={estilos.iconBtn}
                onClick={() => togglePanel("user")}
                type="button"
                aria-label="Abrir panel de usuario"
              >
                <FaUserCircle size={24} />
              </button>
            ) : (
              <button
                className={estilos.iconBtn}
                onClick={() => openAuthModal("login")}
                type="button"
                aria-label="Iniciar sesión"
              >
                <FaUserCircle size={24} />
              </button>
            )}

            {/* Hamburguesa */}
            <button
              className={estilos.iconBtn}
              onClick={() => togglePanel("nav")}
              type="button"
              aria-label={panelMode === "nav" ? "Cerrar menú" : "Abrir menú"}
            >
              {panelMode === "nav" ? <HiOutlineX size={26} /> : <HiOutlineMenuAlt3 size={26} />}
            </button>
          </div>
        </div>
      </nav>

      {/* PANEL LATERAL (nav o user) */}
      {panelMode && (
        <div className={estilos.panelOverlay} onClick={closePanel}>
          <aside className={estilos.panel} onClick={(e) => e.stopPropagation()}>
            <div className={estilos.panelTop}>
              <p className={estilos.panelTitle}>{panelTitle}</p>
              <button className={estilos.panelClose} onClick={closePanel} type="button" aria-label="Cerrar panel">
                <HiOutlineX size={22} />
              </button>
            </div>

            {panelMode === "nav" && (
              <nav className={estilos.panelNav}>
                {NAV_LINKS.map((l) => (
                  <Link key={l.to} to={l.to} className={estilos.panelLink}>
                    {l.label}
                  </Link>
                ))}
              </nav>
            )}

            {panelMode === "user" && authenticated && (
              <>
                <header className={estilos.userMenuHeader}>
                  <FaUserCircle size={34} />
                  <div>
                    <p className={estilos.userMenuHello}>Hola,</p>
                    <p className={estilos.userMenuName}>{displayName}</p>
                  </div>
                </header>

                <nav className={estilos.panelNav}>
                  <Link to="/my-bookings" className={estilos.panelLink}>
                    Mis reservas
                  </Link>
                  <Link to="/my-data" className={estilos.panelLink}>
                    Mis datos
                  </Link>

                  {isAdmin && (
                    <Link to="/admin" className={estilos.panelLink}>
                      Panel de administración
                    </Link>
                  )}

                  <button className={estilos.logoutBtn} onClick={handleLogout} type="button">
                    Cerrar sesión
                  </button>
                </nav>
              </>
            )}
          </aside>
        </div>
      )}

      {/* MODAL AUTH (login/register) */}
      {authMode && (
        <div className={estilos.overlay} onClick={closeAuthModal}>
          <div className={estilos.modal} onClick={(e) => e.stopPropagation()}>
            <button className={estilos.closeBtn} onClick={closeAuthModal} type="button">
              ×
            </button>

            <h2 className={estilos.modalTitle}>
              {authMode === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </h2>

            <form
              className={estilos.form}
              onSubmit={(e) => {
                e.preventDefault();
                handleAuthSubmit();
              }}
            >
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button className={estilos.submitBtn} disabled={status === "loading"} type="submit">
                {status === "loading"
                  ? "Cargando..."
                  : authMode === "login"
                  ? "Entrar"
                  : "Registrarme"}
              </button>
            </form>

            {error && <p className={estilos.error}>{error}</p>}

            <div className={estilos.modalLinks}>
              {authMode === "login" ? (
                <p className={estilos.switchText}>
                  ¿No tienes cuenta?{" "}
                  <button className={estilos.switchBtn} onClick={() => setAuthMode("register")} type="button">
                    Regístrate
                  </button>
                </p>
              ) : (
                <p className={estilos.switchText}>
                  ¿Ya tienes cuenta?{" "}
                  <button className={estilos.switchBtn} onClick={() => setAuthMode("login")} type="button">
                    Inicia sesión
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
