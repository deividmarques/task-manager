import { useRef, useEffect } from 'react';
import type { TaskCounts } from '../../types/filter';

interface TaskCounterProps {
  total: number;
  pending: number;
  completed: number;
}

export function TaskCounter({ total, pending, completed }: TaskCounterProps) {
  const announcementRef = useRef<HTMLDivElement>(null);
  const prevCountsRef = useRef<TaskCounts>({ total, pending, completed });

  useEffect(() => {
    // Announce count changes to screen readers
    const prev = prevCountsRef.current;
    if (
      prev.total !== total ||
      prev.pending !== pending ||
      prev.completed !== completed
    ) {
      if (announcementRef.current) {
        announcementRef.current.textContent = `Total: ${total} tarefas, ${pending} pendentes, ${completed} concluídas`;
      }
      prevCountsRef.current = { total, pending, completed };
    }
  }, [total, pending, completed]);

  return (
    <div className="task-counter">
      <div className="task-counter__item">
        <span className="task-counter__label">Total:</span>
        <span className="task-counter__value">{total}</span>
      </div>
      <div className="task-counter__item">
        <span className="task-counter__label">Pendentes:</span>
        <span className="task-counter__value">{pending}</span>
      </div>
      <div className="task-counter__item">
        <span className="task-counter__label">Concluídas:</span>
        <span className="task-counter__value">{completed}</span>
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
