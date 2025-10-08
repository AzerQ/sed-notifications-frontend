import React from 'react';
import { InAppNotificationData } from '../types';
import { getNotificationIcon, formatRelativeTime } from '../../utils/notificationUtils';

interface CompactNotificationProps {
  notification: InAppNotificationData;
  onRead: (id: number) => void;
}

export const CompactNotification: React.FC<CompactNotificationProps> = ({ 
  notification, 
  onRead 
}) => {
  const handleClick = () => {
    // Если есть ссылка, открываем её
    if (notification.cardUrl) {
      window.open(notification.cardUrl, '_blank');
    }
    
    // Помечаем как прочитанное
    onRead(notification.id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      className={`
        p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-150
        ${notification.cardUrl ? 'hover:bg-blue-50' : ''}
      `}
      data-testid="compact-notification"
      data-notification-id={notification.id}
      data-notification-type={notification.type}
      data-notification-subtype={notification.subtype}
    >
      <div className="flex items-start space-x-3">
        {/* Иконка типа */}
        <div className="mt-0.5" data-testid="compact-notification-icon">
          {getNotificationIcon(notification.type, notification.subtype, 'sm')}
        </div>
        
        {/* Содержимое */}
        <div className="flex-1 min-w-0" data-testid="compact-notification-content">
          <p className="text-sm font-medium text-gray-900 truncate" data-testid="compact-notification-title">
            {notification.title}
          </p>
          <p className="text-xs text-gray-600 line-clamp-2 mt-1" data-testid="compact-notification-description">
            {notification.description}
          </p>
          <div className="flex items-center justify-between mt-2" data-testid="compact-notification-footer">
            <span className="text-xs text-gray-500" data-testid="compact-notification-time">
              {formatRelativeTime(notification.date)}
            </span>
            {notification.cardUrl && (
              <span className="text-xs text-blue-600 font-medium" data-testid="compact-notification-link-indicator">
                Открыть →
              </span>
            )}
          </div>
        </div>
        
        {/* Индикатор непрочитанного */}
        {!notification.read && (
          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" data-testid="compact-notification-unread-indicator"></div>
        )}
      </div>
    </div>
  );
};