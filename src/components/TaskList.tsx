import type { Task } from '../types/task';
import { TaskItem } from './TaskItem';
import { EmptyState } from './EmptyState';

export interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleStatus: (taskId: string) => void;
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

export function TaskList({
  tasks,
  onEdit,
  onDelete,
  onToggleStatus,
  hasFilters = false,
  onClearFilters,
}: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState hasFilters={hasFilters} onClearFilters={onClearFilters} />;
  }

  // Tasks are already sorted by the filter hook, no need to sort again
  return (
    <div className="task-list" role="list">
      {tasks.map((task) => (
        <div key={task.id} role="listitem">
          <TaskItem
            task={task}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task.id)}
            onToggleStatus={() => onToggleStatus(task.id)}
          />
        </div>
      ))}
    </div>
  );
}
