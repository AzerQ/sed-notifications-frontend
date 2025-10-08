import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationBell } from '../NotificationsBar/NotificationBell';

describe('NotificationBell', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен отображаться корректно без непрочитанных уведомлений', () => {
    render(<NotificationBell unreadCount={0} onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Открыть центр уведомлений');
    
    // Счетчик не должен отображаться при 0 непрочитанных
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('должен отображать счетчик непрочитанных уведомлений', () => {
    render(<NotificationBell unreadCount={5} onClick={mockOnClick} />);
    
    const badge = screen.getByText('5');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-600', 'text-white');
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Открыть центр уведомлений (5 непрочитанных)');
  });

  it('должен отображать "99+" для большого количества уведомлений', () => {
    render(<NotificationBell unreadCount={150} onClick={mockOnClick} />);
    
    const badge = screen.getByText('99+');
    expect(badge).toBeInTheDocument();
  });

  it('должен вызывать onClick при клике', async () => {
    const user = userEvent.setup();
    render(<NotificationBell unreadCount={3} onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('должен иметь правильные CSS классы для стилизации', () => {
    render(<NotificationBell unreadCount={1} onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'relative',
      'p-2',
      'rounded-full',
      'bg-gray-100',
      'hover:bg-gray-200',
      'transition-colors'
    );
  });

  it('должен поддерживать фокус для accessibility', async () => {
    const user = userEvent.setup();
    render(<NotificationBell unreadCount={1} onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    await user.tab();
    
    expect(button).toHaveFocus();
    expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500');
  });

  it('должен корректно обрабатывать события клавиатуры', async () => {
    const user = userEvent.setup();
    render(<NotificationBell unreadCount={1} onClick={mockOnClick} />);
    
    const button = screen.getByRole('button');
    button.focus();
    
    await user.keyboard('{Enter}');
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    
    await user.keyboard(' '); // Space
    expect(mockOnClick).toHaveBeenCalledTimes(2);
  });
});