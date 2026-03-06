import { useState, FormEvent, useEffect } from 'react';
import type { Task, TaskFormData, TaskFormErrors } from '../types/task';
import { validateTaskFormData } from '../utils/validation';

export interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [errors, setErrors] = useState<TaskFormErrors>({});

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    }
  }, [task]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData: TaskFormData = { title, description };
    const validationErrors = validateTaskFormData(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onSubmit(formData);
    
    if (!task) {
      setTitle('');
      setDescription('');
    }
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: undefined }));
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2 className="task-form-title">
        {task ? 'Edit Task' : 'Create New Task'}
      </h2>

      <div className="form-field">
        <label htmlFor="task-title" className="form-label">
          Title <span aria-label="required">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          className={`form-input ${errors.title ? 'form-input-error' : ''}`}
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          aria-required="true"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
          maxLength={200}
        />
        {errors.title && (
          <p id="title-error" className="form-error" role="alert">
            {errors.title}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="task-description" className="form-label">
          Description
        </label>
        <textarea
          id="task-description"
          className={`form-textarea ${errors.description ? 'form-input-error' : ''}`}
          value={description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? 'description-error' : undefined}
          maxLength={1000}
          rows={4}
        />
        {errors.description && (
          <p id="description-error" className="form-error" role="alert">
            {errors.description}
          </p>
        )}
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="button button-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className="button button-primary">
          {task ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
