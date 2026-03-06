export function EmptyState() {
  return (
    <div
      className="empty-state"
      role="status"
      aria-live="polite"
    >
      <div className="empty-state-icon" aria-hidden="true">
        📝
      </div>
      <h2 className="empty-state-title">No tasks yet</h2>
      <p className="empty-state-message">
        Create your first task to get started organizing your work.
      </p>
    </div>
  );
}
