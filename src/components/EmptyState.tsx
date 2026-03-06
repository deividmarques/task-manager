export function EmptyState() {
  return (
    <div
      className="empty-state"
      role="status"
      aria-label="No tasks available"
    >
      <svg
        className="empty-state-icon"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
      <h2 className="empty-state-title">No tasks yet</h2>
      <p className="empty-state-message">
        Create your first task to get started organizing your work.
      </p>
    </div>
  );
}
