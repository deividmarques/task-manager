import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('renders empty state message without filters', () => {
    render(<EmptyState />);
    
    expect(screen.getByText('Nenhuma tarefa ainda')).toBeInTheDocument();
    expect(screen.getByText(/Crie sua primeira tarefa/i)).toBeInTheDocument();
  });

  it('renders empty state message with filters', () => {
    const mockClearFilters = vi.fn();
    render(<EmptyState hasFilters={true} onClearFilters={mockClearFilters} />);
    
    expect(screen.getByText('Nenhuma tarefa encontrada')).toBeInTheDocument();
    expect(screen.getByText(/Nenhuma tarefa corresponde aos filtros/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /limpar filtros/i })).toBeInTheDocument();
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
