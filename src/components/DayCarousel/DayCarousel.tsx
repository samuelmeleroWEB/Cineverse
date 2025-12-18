
import React, { useState } from "react";
import styles from "./DayCarousel.module.css";

export interface DayItem {
  id: string;
  label: string;
}
// Propiedades del componente Daycarousel
interface DayCarouselProps {
  days: DayItem[];
  selectedDayId: string;
  onChange: (dayId: string) => void;
  visibleCount?: number; // cuántos días se ven a la vez (por defecto 5)
  loading?: boolean;     // opcional: desactivar botones mientras carga
}

const DayCarousel: React.FC<DayCarouselProps> = ({
  days,
  selectedDayId,
  onChange,
  visibleCount = 5,
  loading = false,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const currentIndex = days.findIndex((d) => d.id === selectedDayId); // buscamos el indice del día actual
  const endIndex = startIndex + visibleCount; // 
  const visibleDays = days.slice(startIndex, endIndex); // 
  const ensureVisibleWindow = (targetIndex: number, prevStart: number) => {
    let newStart = prevStart;

    if (targetIndex < prevStart) {
      newStart = targetIndex;
    } else if (targetIndex >= prevStart + visibleCount) {
      newStart = targetIndex - visibleCount + 1;
    }

    if (newStart < 0) newStart = 0;
    if (newStart > days.length - visibleCount) {
      newStart = Math.max(days.length - visibleCount, 0);
    }

    return newStart;
  };

  const handleNext = () => {
    if (loading) return;
    if (currentIndex === -1 || currentIndex >= days.length - 1) return;

    const newIndex = currentIndex + 1;
    onChange(days[newIndex].id);
    setStartIndex((prev) => ensureVisibleWindow(newIndex, prev));
  };

  const handlePrev = () => {
    if (loading) return;
    if (currentIndex <= 0) return;

    const newIndex = currentIndex - 1;
    onChange(days[newIndex].id);
    setStartIndex((prev) => ensureVisibleWindow(newIndex, prev));
  };

  const handleClickDay = (dayId: string) => {
    if (loading) return;
    const index = days.findIndex((d) => d.id === dayId);
    onChange(dayId);
    if (index === -1) return;
    setStartIndex((prev) => ensureVisibleWindow(index, prev));
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.arrow}
        onClick={handlePrev}
        disabled={loading || currentIndex <= 0}
      >
        ◀
      </button>

      <div className={styles.container}>
        {visibleDays.map((day) => {
          const isActive = day.id === selectedDayId;

          return (
            <button
              key={day.id}
              type="button"
              onClick={() => handleClickDay(day.id)}
              className={`${styles.dayButton} ${
                isActive ? styles.active : ""
              }`}
              disabled={loading}
            >
              {day.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className={styles.arrow}
        onClick={handleNext}
        disabled={loading || currentIndex === -1 || currentIndex >= days.length - 1}
      >
        ▶
      </button>
    </div>
  );
};

export default DayCarousel;
