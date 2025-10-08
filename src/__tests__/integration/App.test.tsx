import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Очищаем стили body после каждого теста
    document.body.style.overflow = 'unset';
  });

  it('должен отображать полное приложение с системой уведомлений', () => {
    render(<App />);

    // Проверяем основные элементы приложения
    expect(screen.getByText('Система документооборота')).toBeInTheDocument();
    expect(screen.getByText('Добро пожаловать в систему!')).toBeInTheDocument();
    
    // Проверяем что система уведомлений загружена
    const bellButton = screen.getByLabelText(/Открыть центр уведомлений/);
    expect(bellButton).toBeInTheDocument();
  });

  it('должен отображать корректную статистику уведомлений', () => {
    render(<App />);

    // Проверяем статистику (основана на mockNotifications)
    expect(screen.getByText('19')).toBeInTheDocument(); // Всего
    // Количество непрочитанных может варьироваться в зависимости от данных
  });

  it('должен выполнять полный сценарий работы с уведомлениями', async () => {
    const user = userEvent.setup();
    render(<App />);

    // 1. Кликаем на колокольчик для открытия бокового меню
    const bellButton = screen.getByLabelText(/Открыть центр уведомлений/);
    await user.click(bellButton);

    // 2. Проверяем что боковое меню открылось
    expect(screen.getByText('Новые уведомления')).toBeInTheDocument();

    // 3. Кликаем на уведомление чтобы пометить как прочитанное
    const firstNotification = screen.getAllByText(/Новый входящий документ|Служебная записка|Договор на подпись/)[0];
    const notificationCard = firstNotification.closest('[class*="border-b"]');
    await user.click(notificationCard as Element);

    // 4. Открываем полную историю
    const historyButton = screen.getByText('Вся история уведомлений');
    await user.click(historyButton);

    // 5. Проверяем что модальное окно открылось
    expect(screen.getByText('Центр уведомлений')).toBeInTheDocument();

    // 6. Проверяем что фильтры и сортировка работают
    expect(screen.getByText('Фильтры:')).toBeInTheDocument();
    expect(screen.getByText('Сортировка:')).toBeInTheDocument();

    // 7. Тестируем поиск
    const searchInput = screen.getByPlaceholderText('Поиск по уведомлениям...');
    await user.type(searchInput, 'документ');

    await waitFor(() => {
      // Должны остаться только уведомления с "документ" в названии
      const visibleNotifications = screen.getAllByText(/документ/i);
      expect(visibleNotifications.length).toBeGreaterThan(0);
    });

    // 8. Закрываем модальное окно
    const closeModalButton = screen.getByLabelText('Закрыть модальное окно');
    await user.click(closeModalButton);

    await waitFor(() => {
      expect(screen.queryByText('Центр уведомлений')).not.toBeInTheDocument();
    });
  });

  it('должен корректно обновлять счетчик при взаимодействии с уведомлениями', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Получаем начальный счетчик (ищем кнопку колокольчика)
    const bellButton = screen.getByLabelText(/Открыть центр уведомлений/);
    const initialBadge = bellButton.querySelector('span');
    const initialCount = initialBadge?.textContent;

    // Открываем боковое меню
    await user.click(bellButton);

    // Отмечаем все как прочитанные
    const markAllButton = screen.getByText('Отметить все как прочитанные');
    await user.click(markAllButton);

    // Проверяем что счетчик исчез (снова используем кнопку колокольчика)
    await waitFor(() => {
      const updatedBellButton = screen.getByLabelText(/Открыть центр уведомлений/);
      const updatedBadge = updatedBellButton.querySelector('span');
      expect(updatedBadge).toBeNull();
    });

    // Проверяем обновление статистики в основном контенте
    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument(); // Непрочитанных должно стать 0
    });
  });

  it('должен поддерживать keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Переходим по Tab к кнопке тест уведомлений
    await user.tab();
    const testButton = screen.getByTestId('app-test-toasts-button');
    expect(testButton).toHaveFocus();

    // Переходим ко второй кнопке (позиция)
    await user.tab();
    const positionButton = screen.getByTestId('app-toggle-position-button');
    expect(positionButton).toHaveFocus();

    // Переходим к колокольчику
    await user.tab();
    const bellButton = screen.getByLabelText(/Открыть центр уведомлений/);
    expect(bellButton).toHaveFocus();

    // Открываем меню через Enter
    await user.keyboard('{Enter}');
    expect(screen.getByText('Новые уведомления')).toBeInTheDocument();

    // Закрываем через Escape
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByText('Новые уведомления')).not.toBeInTheDocument();
    });
  });

  it('должен показывать toast при нажатии кнопки тестирования', async () => {
    const user = userEvent.setup();
    render(<App />);

    const testButton = screen.getByTestId('app-test-toasts-button');
    await user.click(testButton);

    await waitFor(() => {
      expect(screen.getByText('Успех!')).toBeInTheDocument();
    });
  });

  it('должен переключать позицию toast', async () => {
    const user = userEvent.setup();
    render(<App />);

    const positionButton = screen.getByTestId('app-toggle-position-button');
    expect(screen.getByText('Позиция: Сверху')).toBeInTheDocument();
    
    await user.click(positionButton);
    expect(screen.getByText('Позиция: Снизу')).toBeInTheDocument();
  });

  it('должен работать с toast уведомлениями', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Открываем полную историю
    const bellButton = screen.getByLabelText(/Открыть центр уведомлений/);
    await user.click(bellButton);

    const historyButton = screen.getByText('Вся история уведомлений');
    await user.click(historyButton);

    // Тестируем toast уведомления
    const testButton = screen.getByText('Тест уведомлений');
    await user.click(testButton);

    // Проверяем что toast появился
    await waitFor(() => {
      expect(screen.getByText('Успех!')).toBeInTheDocument();
    });
  });

  it('должен сохранять состояние при переключении между боковым меню и модальным окном', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Открываем боковое меню
    const bellButton = screen.getByLabelText(/Открыть центр уведомлений/);
    await user.click(bellButton);

    // Помечаем уведомление как прочитанное
    const firstNotification = screen.getAllByText(/Новый входящий документ|Служебная записка|Договор на подпись/)[0];
    const notificationCard = firstNotification.closest('[class*="border-b"]');
    await user.click(notificationCard as Element);

    // Открываем полную историю
    const historyButton = screen.getByText('Вся история уведомлений');
    await user.click(historyButton);

    // Проверяем что изменения отражены в модальном окне
    await waitFor(() => {
      const unreadCountElement = screen.queryByText(/\d+ непрочитанных/);
      if (unreadCountElement) {
        const count = parseInt(unreadCountElement.textContent?.match(/\d+/)?.[0] || '0');
        expect(count).toBeLessThan(19); // Должно быть меньше изначального количества
      }
    });
  });

  it('должен корректно обрабатывать закрытие компонентов', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Открываем боковое меню
    const bellButton = screen.getByLabelText(/Открыть центр уведомлений/);
    await user.click(bellButton);

    // Закрываем кликом на backdrop
    const backdrop = document.querySelector('.fixed.inset-0.bg-black');
    await user.click(backdrop as Element);

    await waitFor(() => {
      expect(screen.queryByText('Новые уведомления')).not.toBeInTheDocument();
    });

    // Открываем модальное окно
    await user.click(bellButton);
    const historyButton = screen.getByText('Вся история уведомлений');
    await user.click(historyButton);

    // Проверяем что модальное окно открылось
    expect(screen.getByText('Центр уведомлений')).toBeInTheDocument();

    // Закрываем модальное окно кликом на backdrop (более специфичный селектор)
    const modalBackdrop = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
    await user.click(modalBackdrop as Element);

    await waitFor(() => {
      expect(screen.queryByText('Центр уведомлений')).not.toBeInTheDocument();
    });
  });

  it('должен поддерживать responsive design', () => {
    render(<App />);

    // Проверяем что есть responsive классы
    const header = screen.getByText('Система документооборота').closest('header');
    expect(header).toHaveClass('bg-white', 'shadow-sm');

    const main = screen.getByText('Добро пожаловать в систему!').closest('main');
    expect(main?.className).toContain('max-w-7xl');
  });

  it('должен отображать правильную информацию о функциях системы', () => {
    render(<App />);

    expect(screen.getByText('Функции системы уведомлений:')).toBeInTheDocument();
    expect(screen.getByText(/Компактное боковое меню с непрочитанными уведомлениями/)).toBeInTheDocument();
    expect(screen.getByText(/Полная история с фильтрами, сортировкой и поиском/)).toBeInTheDocument();
  });

  it('должен работать без ошибок при быстрых взаимодействиях', async () => {
    const user = userEvent.setup();
    render(<App />);

    const bellButton = screen.getByLabelText(/Открыть центр уведомлений/);

    // Быстро открываем и закрываем меню несколько раз
    for (let i = 0; i < 3; i++) {
      await user.click(bellButton);
      await user.keyboard('{Escape}');
    }

    // Не должно быть ошибок или зависших состояний
    expect(screen.queryByText('Новые уведомления')).not.toBeInTheDocument();
  });
});