import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('renders empty state message', () => {
    render(<EmptyState />);
    
    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    expect(screen.getByText(/Create your first task/i)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<EmptyState />);
    
    const container = screen.getByRole('status');
    expect(container).toHaveAttribute('aria-live', 'polite');
  });

  it('renders icon with aria-hidden', () => {
    const { container } = render(<EmptyState />);
    
    const icon = container.querySelector('.empty-state-icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});
