import React, { useRef, useState, useCallback, useEffect } from 'react';
import { CompactNotificationData } from '../../services/contracts/ISignalRNotificationService';
import { CompactNotification } from '../NotificationCard/CompactNotification';
import { InAppNotificationData, ToastSettings, ToastSize, ToastPosition } from '../types';

interface CompactToast extends CompactNotificationData {
  toastId: number;
  isVisible: boolean;
}

interface CompactToastProviderProps {
  children: (props: {
    showCompactToast: (notification: CompactNotificationData) => void;
    position: ToastPosition;
  }) => React.ReactNode;
  settings?: ToastSettings;
  shouldShowToasts?: boolean;
}

export const CompactToastProvider: React.FC<CompactToastProviderProps> = ({ 
  children, 
  settings,
  shouldShowToasts = true 
}) => {
  const [toasts, setToasts] = useState<CompactToast[]>([]);
  const toastIdRef = useRef(0);
  
  // Используем настройки из пропсов или значения по умолчанию
  const toastSettings = settings || { size: 'medium' as ToastSize, duration: 4, position: 'bottom' as ToastPosition };
  const { size, duration, position } = toastSettings;

  const showCompactToast = useCallback((notification: CompactNotificationData) => {
    // Не показываем тосты, если shouldShowToasts = false
    if (!shouldShowToasts) {
      return;
    }
    
    const toastId = toastIdRef.current++;
    setToasts(prev => [...prev, { ...notification, toastId, isVisible: true }]);
  }, [shouldShowToasts]);

  const removeToast = useCallback((toastId: number) => {
    setToasts(prev => prev.filter(toast => toast.toastId !== toastId));
  }, []);

  const handleNotificationRead = useCallback((notificationId: number) => {
    // Обновляем статус прочтения для соответствующего уведомления
    setToasts(prev => prev.map(toast => 
      toast.id === notificationId 
        ? { ...toast, read: true }
        : toast
    ));
  }, []);

  // Компонент обертки для отдельного toast с логикой закрытия
  const ToastWrapper: React.FC<{ toast: CompactToast; onClose: (id: number) => void; onRead: (id: number) => void; size: ToastSize; duration: number }> = ({ 
    toast, 
    onClose, 
    onRead,
    size,
    duration
  }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(toast.toastId), 300);
      }, duration * 1000); // Конвертируем секунды в миллисекунды

      return () => clearTimeout(timer);
    }, [toast.toastId, onClose, duration]);

    const handleClose = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      setIsVisible(false);
      setTimeout(() => onClose(toast.toastId), 300);
    }, [toast.toastId, onClose]);

    // Преобразуем CompactNotificationData в InAppNotificationData для совместимости
    const adaptedNotification: InAppNotificationData = {
      id: toast.id,
      title: toast.title,
      type: toast.type as any,
      subtype: toast.subtype || '',
      description: `От: ${toast.author}`,
      author: toast.author,
      date: toast.date,
      read: toast.read,
      starred: false,
      delegate: false,
      actions: []
    };

    // Определяем классы размера
    const sizeClasses = {
      small: 'max-w-xs text-sm',
      medium: 'max-w-sm text-base',
      large: 'max-w-md text-lg'
    };

    return (
      <div
        className={`${sizeClasses[size]} w-full rounded-lg shadow-lg transform transition-all duration-300 mb-2 bg-white border border-gray-200 ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
        data-testid="compact-toast-notification"
        data-toast-id={toast.toastId}
        data-notification-id={toast.id}
        data-size={size}
      >
        <div className="relative">
          {/* Кнопка закрытия */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-2 right-2 z-10 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-1 shadow-sm"
            data-testid="compact-toast-close-button"
            aria-label="Закрыть уведомление"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Компактное уведомление */}
          <CompactNotification
            notification={adaptedNotification}
            onRead={onRead}
            size={size}
          />
        </div>
      </div>
    );
  };

  const containerClasses = position === 'top'
    ? 'fixed top-4 right-4 z-50'
    : 'fixed bottom-4 right-4 z-50';

  return (
    <div className="relative">
      {children({ showCompactToast, position })}
      
      {toasts.length > 0 && (
        <div className={containerClasses} data-testid="compact-toast-container" data-position={position}>
          {toasts.map(toast => (
            <ToastWrapper
              key={toast.toastId}
              toast={toast}
              onClose={removeToast}
              onRead={handleNotificationRead}
              size={size}
              duration={duration}
            />
          ))}
        </div>
      )}
    </div>
  );
};