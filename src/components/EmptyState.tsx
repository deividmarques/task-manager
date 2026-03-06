interface EmptyStateProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

export function EmptyState({ hasFilters = false, onClearFilters }: EmptyStateProps) {
  if (hasFilters) {
    // No results match the current filters
    return (
      <div className="empty-state" role="status" aria-live="polite">
        <div className="empty-state-icon" aria-hidden="true">
          🔍
        </div>
        <h2 className="empty-state-title">Nenhuma tarefa encontrada</h2>
        <p className="empty-state-message">
          Nenhuma tarefa corresponde aos filtros aplicados.
        </p>
        {onClearFilters && (
          <button
            type="button"
            className="empty-state-button"
            onClick={onClearFilters}
          >
            Limpar filtros
          </button>
        )}
      </div>
    );
  }

  // No tasks in the system at all
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <div className="empty-state-icon" aria-hidden="true">
        📝
      </div>
      <h2 className="empty-state-title">Nenhuma tarefa ainda</h2>
      <p className="empty-state-message">
        Crie sua primeira tarefa para começar a organizar seu trabalho.
      </p>
    </div>
  );
}
