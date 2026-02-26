import estilos from "./Menus.module.css";
import { useCartStore } from "../../../store/cart.store";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
const MENUS = [
  {
    id: "combo-familiar",
    name: "Combo Familiar",
    description:
      "4 bebidas + palomitas XL para compartir. Ideal para toda la familia.",
    price: 12.9,
    image: "/combofamiliar.png",
  },
  {
    id: "combo-clasico",
    name: "Combo Clásico",
    description: "Palomitas medianas + refresco grande. El clásico del cine.",
    price: 5.9,
    image: "/comboclasico.png",
  },
  {
    id: "combo-dulce",
    name: "Combo Dulce",
    description: "Bebida grande + palomitas pequeñas + chocolatina.",
    price: 7.9,
    image: "/combodulce.png",
  },
  {
    id: "combo-premium",
    name: "Combo Premium",
    description: "Bebida grande + palomitas grandes + hot dog.",
    price: 9.9,
    image: "/combopremium.png",
  },
];

export default function Menus() {
  // funcion para añadir productos
  const addItem = useCartStore((s) => s.addItem);

  const handleAddMenu = (menu: (typeof MENUS)[number]) => {
    addItem({
      type: "menu",
      menuId: menu.id,
      name: menu.name,
      price: menu.price,
      quantity: 1,
    } as any);

    toast.success(`"${menu.name}" añadido al carrito`);
  };

  return (
    <main className={estilos.menus}>
      {/* --- Sección principal (Hero) --- */}
      <section className={estilos.hero}>
        <h1 className={estilos.titulo}>Menús & Snacks Cineverse</h1>
        <p className={estilos.subtitulo}>
          Descubre nuestros combos exclusivos y disfruta de tu película con el
          mejor sabor.
        </p>
      </section>

      {/* --- Grid de Menús (Combos) --- */}
      <section className={estilos.gridMenus}>
        {MENUS.map((menu) => (
          <div key={menu.id} className={estilos.card}>
            <img src={menu.image} alt={menu.name} />
            <h3>{menu.name}</h3>
            <p>{menu.description}</p>
            <span className={estilos.precio}>
              {menu.price.toFixed(2).replace(".", ",")} €
            </span>

            <button
              type="button"
              className={estilos.addToCartButton}
              onClick={() => handleAddMenu(menu)}
            >
              Añadir al carrito
            </button>
          </div>
        ))}
      </section>

      {/* --- Beneficios de comprar combos --- */}
      <section className={estilos.beneficios}>
        <div className={estilos.beneficioItem}>
          <h3>🎟️ Ahorra con tus menús</h3>
          <p>
            Consigue más por menos. Los combos tienen hasta un 20% de descuento
            frente a comprar por separado.
          </p>
        </div>
        <div className={estilos.beneficioItem}>
          <h3>⚡ Evita colas</h3>
          <p>
            Compra tu combo junto a la entrada y recoge directamente en barra
            sin esperas.
          </p>
        </div>
        <div className={estilos.beneficioItem}>
          <h3>🌟 Experiencia total</h3>
          <p>
            Palomitas recién hechas, bebidas frías y snacks pensados para
            acompañar cada sesión.
          </p>
        </div>
      </section>

      {/* --- Elige tu plan (recomendaciones según con quién vienes) --- */}
      <section className={estilos.planes}>
        <h2 className={estilos.planesTitulo}>Elige tu plan</h2>
        <p className={estilos.planesTexto}>
          No es lo mismo venir solo que en familia. Te recomendamos el combo
          perfecto según tu plan de cine.
        </p>

        <div className={estilos.planesGrid}>
          <div className={estilos.planCard}>
            <span className={estilos.planTag}>Solo</span>
            <h3>Plan Individual</h3>
            <p>
              Si vienes a disfrutar tranquilamente, elige el{" "}
              <strong>Combo Clásico</strong>.
            </p>
          </div>

          <div className={estilos.planCard}>
            <span className={estilos.planTag}>Pareja</span>
            <h3>Plan Doble</h3>
            <p>
              Para compartir la peli, el <strong>Combo Premium</strong> es
              perfecto para dos.
            </p>
          </div>

          <div className={estilos.planCard}>
            <span className={estilos.planTag}>Familia</span>
            <h3>Plan Familiar</h3>
            <p>
              Ven con los peques y aprovechad el <strong>Combo Familiar</strong>{" "}
              para todos.
            </p>
          </div>
        </div>
      </section>

      {/* --- Relación con Club Cineverse --- */}
      <section className={estilos.club}>
        <div className={estilos.clubTexto}>
          <h2 className={estilos.clubTitulo}>💳 Menús y Club Cineverse</h2>
          <p>
            Si formas parte del <strong>Club Cineverse</strong>, acumulas puntos
            también con tus menús y snacks.
          </p>
          <ul>
            <li>1 punto por cada euro gastado en combos y snacks.</li>
            <li>Canjea puntos por entradas y descuentos en productos.</li>
            <li>Promos exclusivas solo para miembros del club.</li>
          </ul>
          <Link to="/promotions" className={estilos.clubLink}>
            Ver promociones disponibles
          </Link>
        </div>
      </section>

      {/* --- Información final --- */}
      <section className={estilos.info}>
        <p>
          Los productos y precios pueden variar según el cine. Consulta
          disponibilidad en tu sala Cineverse más cercana.
        </p>
      </section>
    </main>
  );
}
