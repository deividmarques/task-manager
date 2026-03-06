import type { Task } from '../types/task';
import type { SortOption } from '../types/filter';

/**
 * Sorts tasks based on the selected sort option
 * @param tasks - Array of tasks to sort
 * @param sortOption - Sort option: 'newest', 'oldest', 'a-z', or 'z-a'
 * @returns New sorted array (does not modify original)
 */
export function sortTasks(tasks: Task[], sortOption: SortOption): Task[] {
  // Create a copy to avoid mutating the original array
  const sorted = [...tasks];

  switch (sortOption) {
    case 'newest':
      // Sort by createdAt descending (newest first)
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    case 'oldest':
      // Sort by createdAt ascending (oldest first)
      return sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    case 'a-z':
      // Sort alphabetically by title ascending (case-insensitive)
      return sorted.sort((a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase())
      );

    case 'z-a':
      // Sort alphabetically by title descending (case-insensitive)
      return sorted.sort((a, b) =>
        b.title.toLowerCase().localeCompare(a.title.toLowerCase())
      );

    default:
      return sorted;
  }
}
