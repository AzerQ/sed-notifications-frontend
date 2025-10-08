import React from 'react';
import { InAppNotificationData } from '../types';
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  XCircle, 
  Bell,
  User,
  Settings,
  Mail,
  Calendar,
  FileText,
  Shield,
  Zap
} from 'lucide-react';

interface CompactNotificationProps {
  notification: InAppNotificationData;
  onRead: (id: number) => void;
}

export const CompactNotification: React.FC<CompactNotificationProps> = ({ 
  notification, 
  onRead 
}) => {
  const getTypeIcon = (type: string, subtype?: string) => {
    const iconClass = "w-4 h-4 flex-shrink-0";
    
    switch (type) {
      case 'system':
        if (subtype === 'update') return <Zap className={`${iconClass} text-blue-500`} />;
        if (subtype === 'maintenance') return <Settings className={`${iconClass} text-orange-500`} />;
        if (subtype === 'security') return <Shield className={`${iconClass} text-red-500`} />;
        return <Settings className={`${iconClass} text-gray-500`} />;
      
      case 'task':
        if (subtype === 'deadline') return <Calendar className={`${iconClass} text-red-500`} />;
        if (subtype === 'assignment') return <FileText className={`${iconClass} text-blue-500`} />;
        if (subtype === 'approval') return <CheckCircle className={`${iconClass} text-green-500`} />;
        return <FileText className={`${iconClass} text-blue-500`} />;
      
      case 'message':
        if (subtype === 'direct') return <User className={`${iconClass} text-purple-500`} />;
        if (subtype === 'group') return <Mail className={`${iconClass} text-blue-500`} />;
        return <Mail className={`${iconClass} text-blue-500`} />;
      
      case 'alert':
        if (subtype === 'warning') return <AlertCircle className={`${iconClass} text-yellow-500`} />;
        if (subtype === 'error') return <XCircle className={`${iconClass} text-red-500`} />;
        if (subtype === 'success') return <CheckCircle className={`${iconClass} text-green-500`} />;
        return <AlertCircle className={`${iconClass} text-yellow-500`} />;
      
      default:
        return <Bell className={`${iconClass} text-gray-500`} />;
    }
  };

  const handleClick = () => {
    // Если есть ссылка, открываем её
    if (notification.cardUrl) {
      window.open(notification.cardUrl, '_blank');
    }
    
    // Помечаем как прочитанное
    onRead(notification.id);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? 'только что' : `${diffInMinutes} мин назад`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ч назад`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} д назад`;
    }
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
          {getTypeIcon(notification.type, notification.subtype)}
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
              {formatTime(notification.date)}
            </span>
            {notification.cardUrl && (
              <span className="text-xs text-blue-600 font-medium" data-testid="compact-notification-link-indicator">
                Открыть →
              </span>
            )}
          </div>
        </div>
        
        {/* Индикатор непрочитанного */}
        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" data-testid="compact-notification-unread-indicator"></div>
      </div>
    </div>
  );
};