import type { Task } from '../types/task';

const STORAGE_KEY = 'task-manager-tasks';

export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

export function saveTasks(tasks: Task[]): { success: boolean; error?: string } {
  if (!isStorageAvailable()) {
    return { success: false, error: 'LocalStorage is not available' };
  }

  try {
    const serialized = JSON.stringify(tasks);
    localStorage.setItem(STORAGE_KEY, serialized);
    return { success: true };
  } catch (e) {
    if (e instanceof Error && e.name === 'QuotaExceededError') {
      return { success: false, error: 'Storage quota exceeded' };
    }
    return { success: false, error: 'Failed to save tasks' };
  }
}

export function loadTasks(): { tasks: Task[]; error?: string } {
  if (!isStorageAvailable()) {
    return { tasks: [], error: 'LocalStorage is not available' };
  }

  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    
    if (!serialized) {
      return { tasks: [] };
    }

    const parsed = JSON.parse(serialized);
    
    if (!Array.isArray(parsed)) {
      return { tasks: [], error: 'Invalid data format' };
    }

    // Validate task structure
    const validTasks = parsed.filter((task): task is Task => {
      return (
        typeof task === 'object' &&
        task !== null &&
        typeof task.id === 'string' &&
        typeof task.title === 'string' &&
        typeof task.description === 'string' &&
        (task.status === 'pending' || task.status === 'completed') &&
        typeof task.createdAt === 'string' &&
        typeof task.updatedAt === 'string'
      );
    });

    if (validTasks.length !== parsed.length) {
      return {
        tasks: validTasks,
        error: 'Some tasks were corrupted and could not be loaded',
      };
    }

    return { tasks: validTasks };
  } catch {
    return { tasks: [], error: 'Failed to load tasks' };
  }
}
