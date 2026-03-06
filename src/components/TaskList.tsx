import type { Task } from '../types/task';
import { TaskItem } from './TaskItem';
import { EmptyState } from './EmptyState';

export interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleStatus: (taskId: string) => void;
}

export function TaskList({
  tasks,
  onEdit,
  onDelete,
  onToggleStatus,
}: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState />;
  }

  // Sort tasks by createdAt (most recent first)
  const sortedTasks = [...tasks].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="task-list" role="list">
      {sortedTasks.map((task) => (
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
