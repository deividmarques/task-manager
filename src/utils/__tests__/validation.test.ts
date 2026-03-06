import { describe, it, expect } from 'vitest';
import { validateTitle, validateDescription, validateTaskFormData } from '../validation';

describe('validateTitle', () => {
  it('returns error for empty title', () => {
    expect(validateTitle('')).toBe('Title is required');
    expect(validateTitle('   ')).toBe('Title is required');
  });

  it('returns error for title exceeding 200 characters', () => {
    const longTitle = 'a'.repeat(201);
    expect(validateTitle(longTitle)).toBe('Title must be 200 characters or less');
  });

  it('returns null for valid title', () => {
    expect(validateTitle('Valid Title')).toBeNull();
    expect(validateTitle('a'.repeat(200))).toBeNull();
  });
});

describe('validateDescription', () => {
  it('returns error for description exceeding 1000 characters', () => {
    const longDescription = 'a'.repeat(1001);
    expect(validateDescription(longDescription)).toBe('Description must be 1000 characters or less');
  });

  it('returns null for valid description', () => {
    expect(validateDescription('')).toBeNull();
    expect(validateDescription('Valid description')).toBeNull();
    expect(validateDescription('a'.repeat(1000))).toBeNull();
  });
});

describe('validateTaskFormData', () => {
  it('returns errors for invalid data', () => {
    const errors = validateTaskFormData({
      title: '',
      description: 'a'.repeat(1001),
    });

    expect(errors.title).toBe('Title is required');
    expect(errors.description).toBe('Description must be 1000 characters or less');
  });

  it('returns empty object for valid data', () => {
    const errors = validateTaskFormData({
      title: 'Valid Title',
      description: 'Valid description',
    });

    expect(errors).toEqual({});
  });
});
