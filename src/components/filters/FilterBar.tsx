import type { StatusFilterType, SortOption, TaskCounts } from '../../types/filter';
import { SearchBar } from './SearchBar';
import { StatusFilter } from './StatusFilter';
import { SortControls } from './SortControls';
import { TaskCounter } from './TaskCounter';
import { ClearFiltersButton } from './ClearFiltersButton';

interface FilterBarProps {
  searchText: string;
  statusFilter: StatusFilterType;
  sortOption: SortOption;
  onSearchChange: (text: string) => void;
  onStatusFilterChange: (filter: StatusFilterType) => void;
  onSortChange: (option: SortOption) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  taskCounts: TaskCounts;
}

export function FilterBar({
  searchText,
  statusFilter,
  sortOption,
  onSearchChange,
  onStatusFilterChange,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
  taskCounts,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__top">
        <TaskCounter
          total={taskCounts.total}
          pending={taskCounts.pending}
          completed={taskCounts.completed}
        />
        <ClearFiltersButton
          onClick={onClearFilters}
          visible={hasActiveFilters}
        />
      </div>

      <div className="filter-bar__controls">
        <SearchBar
          value={searchText}
          onChange={onSearchChange}
          ariaLabel="Buscar tarefas por título ou descrição"
        />

        <div className="filter-bar__filters">
          <StatusFilter value={statusFilter} onChange={onStatusFilterChange} />
          <SortControls value={sortOption} onChange={onSortChange} />
        </div>
      </div>
    </div>
  );
}
