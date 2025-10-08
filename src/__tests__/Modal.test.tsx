import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../NotificationsBar/Modal';

describe('Modal', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    children: <div>Modal Content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Очищаем стили body после каждого теста
    document.body.style.overflow = 'unset';
  });

  it('должен отображаться когда isOpen = true', () => {
    render(<Modal {...defaultProps} />);
    
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('не должен отображаться когда isOpen = false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('должен отображать заголовок если он предоставлен', () => {
    render(<Modal {...defaultProps} title="Test Title" />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Закрыть модальное окно')).toBeInTheDocument();
  });

  it('не должен отображать заголовок если он не предоставлен', () => {
    render(<Modal {...defaultProps} />);
    
    expect(screen.queryByLabelText('Закрыть модальное окно')).not.toBeInTheDocument();
  });

  it('должен закрываться при клике на кнопку X в заголовке', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} title="Test Title" />);
    
    const closeButton = screen.getByLabelText('Закрыть модальное окно');
    await user.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('должен закрываться при клике на backdrop', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);
    
    const backdrop = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
    expect(backdrop).toBeInTheDocument();
    
    await user.click(backdrop as Element);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('не должен закрываться при клике на само модальное окно', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);
    
    const modalContent = screen.getByText('Modal Content');
    await user.click(modalContent);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('должен закрываться при нажатии Escape', async () => {
    render(<Modal {...defaultProps} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('должен иметь правильную структуру для accessibility', () => {
    render(<Modal {...defaultProps} title="Test Modal" />);
    
    // Проверяем основные ARIA атрибуты
    const modalElement = screen.getByRole('dialog');
    expect(modalElement).toBeInTheDocument();
    
    // Проверяем, что заголовок корректно связан с модальным окном
    expect(modalElement).toHaveAttribute('aria-labelledby', 'modal-title');
    expect(modalElement).toHaveAttribute('aria-modal', 'true');
    
    // Проверяем наличие заголовка с правильным id
    expect(screen.getByRole('heading', { name: 'Test Modal' })).toHaveAttribute('id', 'modal-title');
  });
});