import estilos from "./promotion.module.css";
import  { useState } from "react";

export function Promotion() {
  const [promoActiva, setPromoActiva] = useState<string | null>(null);

  return (
    <main className={estilos.promotions}>
      {/* CABECERA DE LA PÁGINA */}
      <section className={estilos.headerSection}>
        <h1 className={estilos.titulo}> Promociones Cineverse</h1>
        <p className={estilos.subtitulo}>
          Ofertas exclusivas para que disfrutes del mejor cine al mejor precio.
        </p>
      </section>

      {/* PROMOS DESTACADAS */}
      <section className={estilos.section}>
        <h2 className={estilos.sectionTitle}> Promos destacadas</h2>
        <p className={estilos.sectionText}>
          Promociones activas que puedes aprovechar ahora mismo en nuestros
          cines.
        </p>

        <div className={estilos.grid}>
          {/* --- PROMO 1 --- */}
          <div className={estilos.card}>
            <img
              src="/2x1entradas.png"
              alt="2x1 en entradas los miércoles"
              className={estilos.img}
            />
            <h3>2x1 en entradas los miércoles</h3>
            <p>
              Compra una entrada y llévate otra gratis. Válido en cualquier
              sesión los miércoles.
            </p>
            <button
              className={estilos.btn}   
              onClick={() => setPromoActiva("promo-2x1")}
            >
              MÁS INFORMACIÓN
            </button>
          </div>

          {/* --- PROMO 2 --- */}
          <div className={estilos.card}>
            <img
              src="/entradasdescuento.png"
              alt="Entradas anticipadas con descuento"
              className={estilos.img}
            />
            <h3>Entradas anticipadas con descuento</h3>
            <p>
              Compra tus entradas para los próximos estrenos con hasta un 20 %
              de descuento reservando con antelación.
            </p>
            <button
              className={estilos.btn}
              onClick={() => setPromoActiva("promo-anticipadas")}
            >
              Comprar anticipadas
            </button>
          </div>

          {/* --- PROMO 3 --- */}
          <div className={estilos.card}>
            <img
              src="/diafamilia.png"
              alt="Día familiar en Cineverse"
              className={estilos.img}
            />
            <h3>Día familiar</h3>
            <p>
              Domingos especiales para familias: precios reducidos en entradas
              infantiles y packs familiares en sesiones seleccionadas.
            </p>
            <button
              className={estilos.btn}
              onClick={() => setPromoActiva("promo-familia")}
            >
              Ver detalles
            </button>
          </div>
        </div>
      </section>

      {/* CLUB CINEVERSE */}
      <section className={`${estilos.section} ${estilos.club}`}>
        <div className={estilos.clubContent}>
          {/* COLUMNA IZQUIERDA: texto + stats */}
          <div className={estilos.clubLeft}>
            <span className={estilos.clubTag}>Nuevo</span>
            <h2 className={estilos.sectionTitle}> Club Cineverse</h2>
            <p className={estilos.sectionText}>
              Regístrate gratis y acumula puntos cada vez que compres entradas.
              Canjéalos por descuentos, invitaciones y experiencias exclusivas.
            </p>

            <ul className={estilos.clubList}>
              <li>1 punto por cada euro gastado en entradas.</li>
              <li>Canjea puntos por entradas gratis o upgrades de sala.</li>
              <li>Acceso anticipado a estrenos y eventos especiales.</li>
            </ul>

            <button className={estilos.btnPrimary}>
              Unirme al Club Cineverse
            </button>
            <p className={estilos.smallText}>
              Registro gratuito. Solo necesitas un correo electrónico.
            </p>

            <div className={estilos.clubStats}>
              <div className={estilos.clubStat}>
                <span className={estilos.clubStatNumber}>+5.000</span>
                <span className={estilos.clubStatLabel}>Miembros activos</span>
              </div>
              <div className={estilos.clubStat}>
                <span className={estilos.clubStatNumber}>120K</span>
                <span className={estilos.clubStatLabel}>
                  Entradas con descuento
                </span>
              </div>
              <div className={estilos.clubStat}>
                <span className={estilos.clubStatNumber}>4.8★</span>
                <span className={estilos.clubStatLabel}>
                  Valoración media
                </span>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: tarjeta */}
          <div className={estilos.clubRight}>
            <div className={estilos.cardWrapper}>
              <img
                src="/tarjetaclub.png"
                alt="Tarjeta Club Cineverse"
                className={estilos.clubCard}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SUSCRIPCIÓN A OFERTAS */}
      <section
        className={`${estilos.section} ${estilos.subscribe} ${estilos.club}`}
      >
        <h2 className={estilos.sectionTitle}> No te pierdas ninguna oferta</h2>
        <p className={estilos.sectionText}>
          Suscríbete y recibe en tu correo promociones exclusivas, preestrenos y
          eventos especiales de Cineverse.
        </p>

        <form
          className={estilos.subscribeForm}
          onSubmit={(e) => {
            e.preventDefault();
          
          }}
        >
          <input
            type="email"
            required
            placeholder="Tu correo electrónico"
            className={estilos.subscribeInput}
          />
          <button type="submit" className={estilos.btnPrimary}>
            Suscribirme
          </button>
        </form>

        <p className={estilos.smallText}>
          Tranquilo, no hacemos spam. Solo las mejores promos y novedades de
          Cineverse.
        </p>
      </section>

      {/* MODALES DE PROMOS */}
      {promoActiva === "promo-2x1" && (
        <div
          className={estilos.overlayPromo}
          onClick={() => setPromoActiva(null)}
        >
          <div
            className={estilos.modalPromo}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={estilos.closeBtnPromo}
              onClick={() => setPromoActiva(null)}
            >
              ×
            </button>

            <h2>2x1 en entradas los miércoles</h2>
            <p>
              Todos los miércoles, compra una entrada y llévate otra gratis en
              cualquier sesión estándar. Promoción válida para compras online y
              en taquilla. No acumulable a otras ofertas.
            </p>
            <ul>
              <li>Válido solo los miércoles.</li>
              <li>Aplicable a entradas de precio general.</li>
              <li>No incluye salas especiales (4DX, ScreenX, etc.).</li>
            </ul>
          </div>
        </div>
      )}

      {promoActiva === "promo-anticipadas" && (
        <div
          className={estilos.overlayPromo}
          onClick={() => setPromoActiva(null)}
        >
          <div
            className={estilos.modalPromo}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={estilos.closeBtnPromo}
              onClick={() => setPromoActiva(null)}
            >
              ×
            </button>

            <h2>Entradas anticipadas con descuento</h2>
            <p>
              Consigue hasta un 20% de descuento comprando tus entradas con
              antelación para los estrenos del mes. Cuanto antes compres, más
              ahorras.
            </p>
            <ul>
              <li>Válido para estrenos seleccionados.</li>
              <li>Descuento aplicado directamente en el precio.</li>
              <li>Plazas limitadas por sesión.</li>
            </ul>
          </div>
        </div>
      )}

      {promoActiva === "promo-familia" && (
        <div
          className={estilos.overlayPromo}
          onClick={() => setPromoActiva(null)}
        >
          <div
            className={estilos.modalPromo}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={estilos.closeBtnPromo}
              onClick={() => setPromoActiva(null)}
            >
              ×
            </button>

            <h2>Cine en familia - Día especial</h2>
            <p>
              Domingos familiares con precios reducidos en entradas infantiles,
              packs de palomitas y bebidas, y programación especial para todos
              los públicos.
            </p>
            <ul>
              <li>Promoción válida solo en sesiones familiares.</li>
              <li>Consulta horarios y películas disponibles.</li>
              <li>Descuento en combos familiares en barra.</li>
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
