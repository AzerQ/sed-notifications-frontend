import React, { useEffect } from 'react';
import { X, Bell, Archive } from 'lucide-react';
import { InAppNotificationData } from './types';
import { CompactNotification } from './NotificationCard/CompactNotification';

interface NotificationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: InAppNotificationData[];
  onNotificationRead: (id: number) => void;
  onOpenFullHistory: () => void;
  markAllAsRead: () => void; // Добавляем пропс для отметки всех как прочитанных
}

export const NotificationSidebar: React.FC<NotificationSidebarProps> = ({
  isOpen,
  onClose,
  notifications,
  onNotificationRead,
  onOpenFullHistory,
  markAllAsRead
}) => {
  const unreadNotifications = notifications.filter(n => !n.read);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleFullHistoryClick = () => {
    onClose(); // Закрываем боковое меню
    onOpenFullHistory(); // Открываем полную историю
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">
              Новые уведомления
            </h2>
            {unreadNotifications.length > 0 && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                {unreadNotifications.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Закрыть панель уведомлений"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Full History Button */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <button
            onClick={handleFullHistoryClick}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Archive className="w-4 h-4" />
            <span>Вся история уведомлений</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin">
          {unreadNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Все прочитано!
              </h3>
              <p className="text-gray-500 text-sm">
                У вас нет новых уведомлений. Проверьте полную историю для просмотра всех уведомлений.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {unreadNotifications.map(notification => (
                <CompactNotification
                  key={notification.id}
                  notification={notification}
                  onRead={onNotificationRead}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {unreadNotifications.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              onClick={() => {
                markAllAsRead();
              }}
              className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Отметить все как прочитанные
            </button>
          </div>
        )}
      </div>
    </div>
  );
};