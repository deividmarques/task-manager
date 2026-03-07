export type StatusFilterType = 'all' | 'pending' | 'completed';
export type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a';

export interface FilterState {
  searchText: string;
  statusFilter: StatusFilterType;
  sortOption: SortOption;
}

export interface TaskCounts {
  total: number;
  pending: number;
  completed: number;
}

export const DEFAULT_FILTER_STATE: FilterState = {
  searchText: '',
  statusFilter: 'all',
  sortOption: 'newest',
};
