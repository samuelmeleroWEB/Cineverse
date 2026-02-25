import React, { useState, useEffect } from "react";
import styles from "./DayCarousel.module.css";

export interface DayItem {
  id: string;
  label: string;
}

interface DayCarouselProps {
  days: DayItem[];
  selectedDayId: string;
  onChange: (dayId: string) => void;
  visibleCount?: number;
  loading?: boolean;
}

const DayCarousel: React.FC<DayCarouselProps> = ({
  days,
  selectedDayId,
  onChange,
  visibleCount: visibleCountProp,
  loading = false,
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleCount = visibleCountProp ?? (windowWidth < 768 ? 3 : 5);
  

  const [startIndex, setStartIndex] = useState(0);
  const currentIndex = days.findIndex((d) => d.id === selectedDayId);

  const endIndex = startIndex + visibleCount;
  const visibleDays = days.slice(startIndex, endIndex);

  const ensureVisibleWindow = (targetIndex: number) => {
    const half = Math.floor(visibleCount / 2);
    let newStart = targetIndex - half;
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
    setStartIndex(ensureVisibleWindow(newIndex));
  };

  const handlePrev = () => {
    if (loading) return;
    if (currentIndex <= 0) return;
    const newIndex = currentIndex - 1;
    onChange(days[newIndex].id);
    setStartIndex(ensureVisibleWindow(newIndex));
  };

  const handleClickDay = (dayId: string) => {
    if (loading) return;
    const index = days.findIndex((d) => d.id === dayId);
    onChange(dayId);
    if (index === -1) return;
    setStartIndex(ensureVisibleWindow(index));
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
              className={`${styles.dayButton} ${isActive ? styles.active : ""}`}
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
        disabled={
          loading || currentIndex === -1 || currentIndex >= days.length - 1
        }
      >
        ▶
      </button>
    </div>
  );
};

export default DayCarousel;
