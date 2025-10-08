import React from 'react';
import { observer } from 'mobx-react-lite';
import { CompactNotificationData } from '../../services/contracts/ISignalRNotificationService';
import { getNotificationIcon, formatRelativeTime } from '../../utils/notificationUtils';

interface SignalRCompactNotificationProps {
  notification: CompactNotificationData;
  onRead: (id: number) => void;
  onClick?: (id: number) => void;
}

export const SignalRCompactNotification: React.FC<SignalRCompactNotificationProps> = observer(({
  notification,
  onRead,
  onClick
}) => {
  const handleClick = () => {
    if (!notification.read) {
      onRead(notification.id);
    }
    onClick?.(notification.id);
  };

  const handleReadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRead(notification.id);
  };

  return (
    <div
      className={`
        flex items-start space-x-3 p-3 border-b border-gray-100 hover:bg-gray-50 
        transition-colors duration-150 cursor-pointer
        ${!notification.read ? 'bg-blue-50' : 'bg-white'}
      `}
      onClick={handleClick}
      data-testid="signalr-compact-notification"
      data-notification-id={notification.id}
    >
      {/* Иконка */}
      <div className="flex-shrink-0 mt-1">
        {getNotificationIcon(notification.type, notification.subtype, 'sm')}
      </div>

      {/* Контент */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${
              !notification.read ? 'text-gray-900' : 'text-gray-700'
            }`}>
              {notification.title}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {notification.author}
            </p>
          </div>
          
          {/* Время и кнопка прочтения */}
          <div className="flex items-center space-x-2 ml-2">
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {formatRelativeTime(notification.date)}
            </span>
            
            {!notification.read && (
              <button
                onClick={handleReadClick}
                className="w-2 h-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
                aria-label="Отметить как прочитанное"
                data-testid="mark-as-read-button"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});