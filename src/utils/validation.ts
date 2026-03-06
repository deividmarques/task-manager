import type { TaskFormData, TaskFormErrors } from '../types/task';

export function validateTitle(title: string): string | null {
  const trimmed = title.trim();
  
  if (trimmed.length === 0) {
    return 'Title is required';
  }
  
  if (trimmed.length > 200) {
    return 'Title must be 200 characters or less';
  }
  
  return null;
}

export function validateDescription(description: string): string | null {
  const trimmed = description.trim();
  
  if (trimmed.length > 1000) {
    return 'Description must be 1000 characters or less';
  }
  
  return null;
}

export function validateTaskFormData(data: TaskFormData): TaskFormErrors {
  const errors: TaskFormErrors = {};
  
  const titleError = validateTitle(data.title);
  if (titleError) {
    errors.title = titleError;
  }
  
  const descriptionError = validateDescription(data.description);
  if (descriptionError) {
    errors.description = descriptionError;
  }
  
  return errors;
}
