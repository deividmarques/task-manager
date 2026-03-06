import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskFormData, TaskStatus } from '../types/task';
import { validateTaskFormData } from '../utils/validation';
import { loadTasks, saveTasks, isStorageAvailable } from '../utils/storage';

export interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (data: TaskFormData) => { success: boolean; error?: string };
  updateTask: (
    id: string,
    data: TaskFormData
  ) => { success: boolean; error?: string };
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks on mount
  useEffect(() => {
    const { tasks: loadedTasks, error: loadError } = loadTasks();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTasks(loadedTasks);
    setLoading(false);

    if (loadError) {
      setError(loadError);
    }

    // Check if storage is available
    if (!isStorageAvailable()) {
      setError('LocalStorage is not available. Tasks will not be saved.');
    }
  }, []);

  // Persist tasks whenever they change (after initial load)
  useEffect(() => {
    if (!loading) {
      const { error: saveError } = saveTasks(tasks);
      if (saveError) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setError(saveError);
      }
    }
  }, [tasks, loading]);

  const createTask = useCallback(
    (data: TaskFormData): { success: boolean; error?: string } => {
      const errors = validateTaskFormData(data);
      if (Object.keys(errors).length > 0) {
        return { success: false, error: errors.title || errors.description };
      }

      const now = new Date().toISOString();
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: data.title.trim(),
        description: data.description.trim(),
        status: 'pending' as TaskStatus,
        createdAt: now,
        updatedAt: now,
      };

      setTasks((prev) => [newTask, ...prev]);
      return { success: true };
    },
    []
  );

  const updateTask = useCallback(
    (
      id: string,
      data: TaskFormData
    ): { success: boolean; error?: string } => {
      const errors = validateTaskFormData(data);
      if (Object.keys(errors).length > 0) {
        return { success: false, error: errors.title || errors.description };
      }

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                title: data.title.trim(),
                description: data.description.trim(),
                updatedAt: new Date().toISOString(),
              }
            : task
        )
      );

      return { success: true };
    },
    []
  );

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const toggleTaskStatus = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: (task.status === 'pending'
                ? 'completed'
                : 'pending') as TaskStatus,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  }, []);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  };
}
