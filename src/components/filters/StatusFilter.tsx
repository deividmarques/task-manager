import { useRef, useEffect } from 'react';
import type { StatusFilterType } from '../../types/filter';

interface StatusFilterProps {
  value: StatusFilterType;
  onChange: (filter: StatusFilterType) => void;
}

const STATUS_OPTIONS: { value: StatusFilterType; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'completed', label: 'Concluídas' },
];

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const announcementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Announce filter change to screen readers
    if (announcementRef.current) {
      const selectedLabel =
        STATUS_OPTIONS.find((opt) => opt.value === value)?.label || '';
      announcementRef.current.textContent = `Filtro alterado para: ${selectedLabel}`;
    }
  }, [value]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    let newIndex = index;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      newIndex = index > 0 ? index - 1 : STATUS_OPTIONS.length - 1;
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      newIndex = index < STATUS_OPTIONS.length - 1 ? index + 1 : 0;
    } else {
      return;
    }

    buttonRefs.current[newIndex]?.focus();
    onChange(STATUS_OPTIONS[newIndex].value);
  };

  return (
    <div className="status-filter" role="group" aria-label="Filtrar por status">
      <div className="status-filter__buttons">
        {STATUS_OPTIONS.map((option, index) => (
          <button
            key={option.value}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            type="button"
            className={`status-filter__button ${
              value === option.value ? 'status-filter__button--active' : ''
            }`}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            aria-pressed={value === option.value}
            aria-label={`Filtrar por ${option.label.toLowerCase()}`}
          >
            {option.label}
          </button>
        ))}
      </div>
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
