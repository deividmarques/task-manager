import { useRef, useEffect } from 'react';
import type { SortOption } from '../../types/filter';

interface SortControlsProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Mais Recentes' },
  { value: 'oldest', label: 'Mais Antigas' },
  { value: 'a-z', label: 'A-Z' },
  { value: 'z-a', label: 'Z-A' },
];

export function SortControls({ value, onChange }: SortControlsProps) {
  const announcementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Announce sort change to screen readers
    if (announcementRef.current) {
      const selectedLabel =
        SORT_OPTIONS.find((opt) => opt.value === value)?.label || '';
      announcementRef.current.textContent = `Ordenação alterada para: ${selectedLabel}`;
    }
  }, [value]);

  return (
    <div className="sort-controls">
      <label htmlFor="sort-select" className="sort-controls__label">
        Ordenar por:
      </label>
      <select
        id="sort-select"
        className="sort-controls__select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        aria-label="Ordenar tarefas"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div
        ref={announcementRef}
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />
    </div>
  );
}
