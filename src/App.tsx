import { useState, useRef, useEffect } from 'react';
import type { Task } from './types/task';
import { useTasks } from './hooks/useTasks';
import { useToast } from './hooks/useToast';
import { useFilters } from './hooks/useFilters';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { ConfirmDialog } from './components/ConfirmDialog';
import { FilterBar } from './components/filters/FilterBar';
import './App.css';

function App() {
  const { tasks, error: storageError, createTask, updateTask, deleteTask, toggleTaskStatus } = useTasks();
  const { toasts, showToast, dismissToast } = useToast();
  const {
    filterState,
    setSearchText,
    setStatusFilter,
    setSortOption,
    clearFilters,
    hasActiveFilters,
    filteredTasks,
    taskCounts,
  } = useFilters(tasks);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  // Announcement for filtered results
  const resultsAnnouncementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resultsAnnouncementRef.current) {
      const count = filteredTasks.length;
      resultsAnnouncementRef.current.textContent = 
        count === 1 ? '1 tarefa encontrada' : `${count} tarefas encontradas`;
    }
  }, [filteredTasks.length]);

  const handleCreateTask = (data: { title: string; description: string }) => {
    const result = createTask(data);
    if (result.success) {
      setIsFormOpen(false);
      showToast('Task created successfully', 'success');
    } else {
      showToast(result.error || 'Failed to create task', 'error');
    }
  };

  const handleUpdateTask = (data: { title: string; description: string }) => {
    if (!editingTask) return;
    
    const result = updateTask(editingTask.id, data);
    if (result.success) {
      setEditingTask(null);
      showToast('Task updated successfully', 'success');
    } else {
      showToast(result.error || 'Failed to update task', 'error');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletingTaskId) return;
    
    deleteTask(deletingTaskId);
    setDeletingTaskId(null);
    showToast('Task deleted successfully', 'success');
  };

  const handleToggleStatus = (taskId: string) => {
    toggleTaskStatus(taskId);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newStatus = task.status === 'pending' ? 'completed' : 'pending';
      showToast(`Task marked as ${newStatus}`, 'success');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(false);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Task Manager</h1>
        {!isFormOpen && !editingTask && (
          <button
            type="button"
            className="button button-primary"
            onClick={() => setIsFormOpen(true)}
            aria-label="Add new task"
          >
            <span aria-hidden="true">➕</span> Add Task
          </button>
        )}
      </header>

      {storageError && (
        <div className="alert alert-warning" role="alert">
          <strong>Warning:</strong> {storageError}
        </div>
      )}

      <main className="app-main">
        {(isFormOpen || editingTask) && (
          <TaskForm
            task={editingTask || undefined}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={handleCancelForm}
          />
        )}

        {!isFormOpen && !editingTask && (
          <>
            <FilterBar
              searchText={filterState.searchText}
              statusFilter={filterState.statusFilter}
              sortOption={filterState.sortOption}
              onSearchChange={setSearchText}
              onStatusFilterChange={setStatusFilter}
              onSortChange={setSortOption}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
              taskCounts={taskCounts}
            />
            <div
              ref={resultsAnnouncementRef}
              className="sr-only"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            />
            <TaskList
              tasks={filteredTasks}
              onEdit={handleEdit}
              onDelete={(taskId) => setDeletingTaskId(taskId)}
              onToggleStatus={handleToggleStatus}
              hasFilters={hasActiveFilters}
              onClearFilters={clearFilters}
            />
          </>
        )}
      </main>

      <ConfirmDialog
        isOpen={deletingTaskId !== null}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingTaskId(null)}
      />

      {toasts.length > 0 && (
        <div className="toast-container" aria-live="polite" aria-atomic="true">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`toast toast-${toast.type}`}
              role="status"
            >
              <span className="toast-message">{toast.message}</span>
              <button
                type="button"
                className="toast-close"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
