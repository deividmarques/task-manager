import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Task } from '../types/task';
import type {
  FilterState,
  StatusFilterType,
  SortOption,
  TaskCounts,
} from '../types/filter';
import { DEFAULT_FILTER_STATE } from '../types/filter';
import { filterTasks, calculateTaskCounts } from '../utils/filterTasks';
import { sortTasks } from '../utils/sortTasks';

const FILTER_STORAGE_KEY = 'task-manager-filters';

/**
 * Type guard to validate filter state structure
 */
function isValidFilterState(value: unknown): value is FilterState {
  if (!value || typeof value !== 'object') return false;

  const state = value as Record<string, unknown>;

  return (
    typeof state.searchText === 'string' &&
    (state.statusFilter === 'all' ||
      state.statusFilter === 'pending' ||
      state.statusFilter === 'completed') &&
    (state.sortOption === 'newest' ||
      state.sortOption === 'oldest' ||
      state.sortOption === 'a-z' ||
      state.sortOption === 'z-a')
  );
}

/**
 * Load filter state from LocalStorage
 */
function loadFilterState(): FilterState {
  try {
    const saved = localStorage.getItem(FILTER_STORAGE_KEY);
    if (!saved) return DEFAULT_FILTER_STATE;

    const parsed = JSON.parse(saved);

    if (!isValidFilterState(parsed)) {
      console.warn('Invalid filter state in storage, using defaults');
      return DEFAULT_FILTER_STATE;
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load filter state:', error);
    return DEFAULT_FILTER_STATE;
  }
}

/**
 * Save filter state to LocalStorage
 */
function saveFilterState(state: FilterState): void {
  try {
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save filter state:', error);
  }
}

export interface UseFiltersReturn {
  filterState: FilterState;
  setSearchText: (text: string) => void;
  setStatusFilter: (filter: StatusFilterType) => void;
  setSortOption: (option: SortOption) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  filteredTasks: Task[];
  taskCounts: TaskCounts;
}

/**
 * Custom hook for managing filter state and computing filtered tasks
 * @param tasks - Array of all tasks
 * @returns Filter state, setters, and computed values
 */
export function useFilters(tasks: Task[]): UseFiltersReturn {
  // Initialize state from LocalStorage
  const [filterState, setFilterState] = useState<FilterState>(() =>
    loadFilterState()
  );

  // Save to LocalStorage whenever filter state changes (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveFilterState(filterState);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filterState]);

  // Setter functions
  const setSearchText = useCallback((text: string) => {
    setFilterState((prev) => ({ ...prev, searchText: text }));
  }, []);

  const setStatusFilter = useCallback((filter: StatusFilterType) => {
    setFilterState((prev) => ({ ...prev, statusFilter: filter }));
  }, []);

  const setSortOption = useCallback((option: SortOption) => {
    setFilterState((prev) => ({ ...prev, sortOption: option }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilterState(DEFAULT_FILTER_STATE);
  }, []);

  // Check if any filters are active (differ from defaults)
  const hasActiveFilters = useMemo(() => {
    return (
      filterState.searchText !== DEFAULT_FILTER_STATE.searchText ||
      filterState.statusFilter !== DEFAULT_FILTER_STATE.statusFilter ||
      filterState.sortOption !== DEFAULT_FILTER_STATE.sortOption
    );
  }, [filterState]);

  // Compute filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    const filtered = filterTasks(
      tasks,
      filterState.searchText,
      filterState.statusFilter
    );
    return sortTasks(filtered, filterState.sortOption);
  }, [tasks, filterState.searchText, filterState.statusFilter, filterState.sortOption]);

  // Compute task counts (always based on all tasks, not filtered)
  const taskCounts = useMemo(() => {
    return calculateTaskCounts(tasks);
  }, [tasks]);

  return {
    filterState,
    setSearchText,
    setStatusFilter,
    setSortOption,
    clearFilters,
    hasActiveFilters,
    filteredTasks,
    taskCounts,
  };
}
