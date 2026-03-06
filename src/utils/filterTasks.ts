import type { Task } from '../types/task';
import type { StatusFilterType, TaskCounts } from '../types/filter';

/**
 * Filters tasks based on search text and status filter
 * @param tasks - Array of tasks to filter
 * @param searchText - Text to search in title and description (case-insensitive)
 * @param statusFilter - Status filter: 'all', 'pending', or 'completed'
 * @returns Filtered array of tasks (does not modify original)
 */
export function filterTasks(
  tasks: Task[],
  searchText: string,
  statusFilter: StatusFilterType
): Task[] {
  let filtered = tasks;

  // Apply status filter
  if (statusFilter !== 'all') {
    filtered = filtered.filter((task) => task.status === statusFilter);
  }

  // Apply search filter
  if (searchText.trim() !== '') {
    const searchLower = searchText.toLowerCase();
    filtered = filtered.filter(
      (task) =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}

/**
 * Calculates task counts (total, pending, completed)
 * @param tasks - Array of tasks to count
 * @returns Object with total, pending, and completed counts
 */
export function calculateTaskCounts(tasks: Task[]): TaskCounts {
  const pending = tasks.filter((task) => task.status === 'pending').length;
  const completed = tasks.filter((task) => task.status === 'completed').length;

  return {
    total: tasks.length,
    pending,
    completed,
  };
}
