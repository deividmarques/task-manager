import type { Task } from '../types/task';

export interface TaskItemProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

export function TaskItem({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
}: TaskItemProps) {
  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article
      className={`task-item ${task.status === 'completed' ? 'task-item-completed' : ''}`}
      aria-label={`Task: ${task.title}`}
    >
      <div className="task-item-header">
        <label className="task-checkbox-label">
          <input
            type="checkbox"
            className="task-checkbox"
            checked={task.status === 'completed'}
            onChange={onToggleStatus}
            aria-label={`Mark task "${task.title}" as ${task.status === 'completed' ? 'pending' : 'completed'}`}
          />
          <span className="task-checkbox-custom" aria-hidden="true">
            {task.status === 'completed' && '✓'}
          </span>
        </label>
        <h3 className="task-title">{task.title}</h3>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <span className="task-date" aria-label={`Created on ${formattedDate}`}>
          <span aria-hidden="true">📅</span> {formattedDate}
        </span>
        <span
          className={`task-status-badge ${task.status === 'completed' ? 'task-status-completed' : 'task-status-pending'}`}
          aria-label={`Status: ${task.status}`}
        >
          <span aria-hidden="true">
            {task.status === 'completed' ? '✓' : '○'}
          </span>
          {task.status === 'completed' ? 'Completed' : 'Pending'}
        </span>
      </div>

      <div className="task-actions">
        <button
          type="button"
          className="button button-icon button-edit"
          onClick={onEdit}
          aria-label={`Edit task "${task.title}"`}
        >
          <span aria-hidden="true">✏️</span>
          <span className="button-text">Edit</span>
        </button>
        <button
          type="button"
          className="button button-icon button-delete"
          onClick={onDelete}
          aria-label={`Delete task "${task.title}"`}
        >
          <span aria-hidden="true">🗑️</span>
          <span className="button-text">Delete</span>
        </button>
      </div>
    </article>
  );
}
