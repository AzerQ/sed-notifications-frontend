// App.tsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Bell, FileText, CheckCircle, AlertCircle, Search, Filter, Calendar, User, Eye, EyeOff, ChevronDown, Bookmark, BookmarkCheck, MoreHorizontal, Plus, X } from 'lucide-react';


// Типы данных
type NotificationType = 'document' | 'task' | 'system';
type NotificationSubtype = 
  | 'Входящий документ'
  | 'Служебная записка'
  | 'Приказ'
  | 'Задание на согласование'
  | 'Задание на подписание'
  | 'Системное уведомление';

interface NotificationAction {
  name: string;
  label: string;
  url: string;
}

interface Notification {
  id: number;
  title: string;
  type: NotificationType;
  subtype: NotificationSubtype;
  description: string;
  author: string;
  date: string;
  read: boolean;
  starred: boolean;
  cardUrl?: string;
  delegate: boolean;
  actions: NotificationAction[];
}

interface ToastConfig {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

interface Toast extends ToastConfig {
  id: number;
}

interface Filters {
  type: string;
  subtype: string;
  status: string;
  starred: string;
}

interface Preset {
  name: string;
  filters: Filters & { search: string };
}

// Mock data with actions
const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'Новый входящий документ',
    type: 'document',
    subtype: 'Входящий документ',
    description: 'Поступил новый входящий документ от ООО "ТехноСервис"',
    author: 'Иван Петров',
    date: '2024-01-15T10:30:00',
    read: false,
    starred: false,
    cardUrl: '/documents/12345',
    delegate: false,
    actions: [
      {
        name: 'approve',
        label: 'Согласовать',
        url: 'appactions://approveDocument?docId=12345&userId=764'
      },
      {
        name: 'reject',
        label: 'Отклонить',
        url: 'appactions://rejectDocument?docId=12345&userId=764'
      }
    ]
  },
  {
    id: 2,
    title: 'Задание на согласование',
    type: 'task',
    subtype: 'Задание на согласование',
    description: 'Требуется ваше согласование по проекту приказа №45',
    author: 'Мария Сидорова',
    date: '2024-01-15T09:15:00',
    read: true,
    starred: true,
    cardUrl: '/tasks/67890',
    delegate: true,
    actions: [
      {
        name: 'completeTask',
        label: 'Выполнить задание',
        url: 'appactions://completeTask?taskId=67890&status=approved'
      }
    ]
  },
  {
    id: 3,
    title: 'Системное обновление',
    type: 'system',
    subtype: 'Системное уведомление',
    description: 'Планируется техническое обслуживание системы 16.01.2024 с 22:00 до 02:00',
    author: 'Система',
    date: '2024-01-14T18:00:00',
    read: false,
    starred: false,
    delegate: false,
    actions: []
  },
  {
    id: 4,
    title: 'Служебная записка',
    type: 'document',
    subtype: 'Служебная записка',
    description: 'Подана служебная записка на командировку в Москву',
    author: 'Алексей Козлов',
    date: '2024-01-14T16:45:00',
    read: false,
    starred: false,
    cardUrl: '/documents/54321',
    delegate: false,
    actions: [
      {
        name: 'signDocument',
        label: 'Подписать',
        url: 'appactions://signDocument?docId=54321&type=travel'
      },
      {
        name: 'requestInfo',
        label: 'Запросить информацию',
        url: 'appactions://requestAdditionalInfo?docId=54321'
      }
    ]
  }
];

// Toast Notification Component
const ToastNotification: React.FC<{
  id: number;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose: (id: number) => void;
}> = ({ id, title, message, type = 'info', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  return (
    <div 
      className={`max-w-sm w-full p-4 border rounded-lg shadow-lg transform transition-all duration-300 mb-2 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${getTypeStyles()}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm mt-1">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(id), 300);
          }}
          className="ml-4 text-current hover:opacity-75"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// Toast Container Component - single fixed container with stacked toasts
const ToastContainer: React.FC<{
  toasts: Toast[];
  position: 'top' | 'bottom';
  onClose: (id: number) => void;
}> = ({ toasts, position, onClose }) => {
  if (toasts.length === 0) return null;

  const containerClasses = position === 'top'
    ? 'fixed top-4 right-4 z-50'
    : 'fixed bottom-4 right-4 z-50';

  return (
    <div className={containerClasses}>
      {toasts.map(toast => (
        <ToastNotification
          key={toast.id}
          {...toast}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

// Modal Input Component
const ModalInput: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  title?: string;
}> = ({ isOpen, onClose, onSave, title = "Введите название" }) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValue('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSave(value.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Название фильтра..."
          />
          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!value.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Toast Provider Component
const ToastProvider: React.FC<{ children: (props: {
  showToast: (toast: ToastConfig) => void;
  testToasts: () => void;
  togglePosition: () => void;
  position: 'top' | 'bottom';
}) => React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');

  const showToast = (toastConfig: ToastConfig) => {
    const id = toastIdRef.current++;
    setToasts(prev => [...prev, { ...toastConfig, id }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const testToasts = () => {
    showToast({
      title: 'Успех!',
      message: 'Документ успешно согласован',
      type: 'success'
    });
    
    setTimeout(() => {
      showToast({
        title: 'Предупреждение',
        message: 'Срок выполнения задания истекает через 2 часа',
        type: 'warning'
      });
    }, 1000);
    
    setTimeout(() => {
      showToast({
        title: 'Ошибка',
        message: 'Не удалось подключиться к серверу',
        type: 'error'
      });
    }, 2000);
    
    setTimeout(() => {
      showToast({
        title: 'Информация',
        message: 'Новое системное обновление доступно',
        type: 'info'
      });
    }, 3000);
  };

  const togglePosition = () => {
    setPosition(prev => prev === 'top' ? 'bottom' : 'top');
  };

  return (
    <div className="relative">
      {children({ showToast, testToasts, togglePosition, position })}
      <ToastContainer 
        toasts={toasts} 
        position={position}
        onClose={removeToast}
      />
    </div>
  );
};

// Action handlers registry
const actionHandlers = new Map<string, (params: Record<string, string>) => void>();

// Register default action handlers
const registerActionHandler = (actionName: string, handler: (params: Record<string, string>) => void) => {
  actionHandlers.set(actionName, handler);
};

// Execute action with automatic read marking
const executeAction = (
  url: string, 
  notificationId: number, 
  markAsRead: boolean, 
  onActionComplete: (id: number) => void, 
  showToast: (toast: ToastConfig) => void
) => {
  try {
    if (!url.startsWith('appactions://')) {
      throw new Error('Invalid action URL format');
    }

    const urlWithoutProtocol = url.replace('appactions://', '');
    const [actionName, paramsString] = urlWithoutProtocol.split('?');
    
    if (!actionHandlers.has(actionName)) {
      showToast({
        title: 'Ошибка',
        message: 'Действие не найдено!',
        type: 'error'
      });
      return;
    }

    const params: Record<string, string> = {};
    if (paramsString) {
      paramsString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      });
    }

    const handler = actionHandlers.get(actionName)!;
    handler(params);
    
    // Show success toast
    showToast({
      title: 'Успех',
      message: `Действие "${actionName}" выполнено успешно`,
      type: 'success'
    });
    
    // Mark notification as read after successful action execution
    if (markAsRead && onActionComplete) {
      onActionComplete(notificationId);
    }
  } catch (error) {
    console.error('Error executing action:', error);
    showToast({
      title: 'Ошибка',
      message: 'Ошибка при выполнении действия!',
      type: 'error'
    });
  }
};

// Register some example action handlers
registerActionHandler('approveDocument', (params) => {
  console.log(`Document ${params.docId} approved by user ${params.userId}`);
});

registerActionHandler('rejectDocument', (params) => {
  console.log(`Document ${params.docId} rejected by user ${params.userId}`);
});

registerActionHandler('completeTask', (params) => {
  console.log(`Task ${params.taskId} completed with status: ${params.status}`);
});

registerActionHandler('signDocument', (params) => {
  console.log(`Document ${params.docId} signed (type: ${params.type})`);
});

registerActionHandler('requestAdditionalInfo', (params) => {
  console.log(`Additional info requested for document ${params.docId}`);
});

// Custom Select Component
const CustomSelect: React.FC<{
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}> = ({ options, value, onChange, placeholder = "Выберите...", className = "", disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value) || null;

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <div
        className={`flex items-center justify-between px-3 py-2 border rounded-md cursor-pointer transition-colors ${
          disabled 
            ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed' 
            : 'bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500'
        }`}
        onClick={toggleDropdown}
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''} ${
            disabled ? 'text-gray-400' : 'text-gray-500'
          }`} 
        />
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors ${
                option.value === value ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
              }`}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Action Button Component
const ActionButton: React.FC<{
  action: NotificationAction;
  variant?: 'primary' | 'secondary';
  notificationId: number;
  onActionComplete: (id: number) => void;
  showToast: (toast: ToastConfig) => void;
}> = ({ action, variant = 'secondary', notificationId, onActionComplete, showToast }) => {
  const handleClick = () => {
    executeAction(action.url, notificationId, true, onActionComplete, showToast);
  };

  const baseClasses = "px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200";
  
  const variantClasses = variant === 'primary' 
    ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2";

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses}`}
    >
      {action.label}
    </button>
  );
};

// Notification Actions Dropdown
const NotificationActionsDropdown: React.FC<{
  actions: NotificationAction[];
  notificationId: number;
  onActionComplete: (id: number) => void;
  showToast: (toast: ToastConfig) => void;
}> = ({ actions, notificationId, onActionComplete, showToast }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (actions.length === 0) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        title="Дополнительные действия"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="py-1">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  executeAction(action.url, notificationId, true, onActionComplete, showToast);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Вспомогательные функции
const getTypeIcon = (type: NotificationType) => {
  switch (type) {
    case 'document':
      return <FileText className="w-5 h-5" />;
    case 'task':
      return <CheckCircle className="w-5 h-5" />;
    case 'system':
      return <AlertCircle className="w-5 h-5" />;
    default:
      return <Bell className="w-5 h-5" />;
  }
};

const getTypeColorClass = (type: NotificationType): string => {
  switch (type) {
    case 'document':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'task':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'system':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Компоненты
const NotificationCard: React.FC<{
  notification: Notification;
  onToggleRead: (id: number) => void;
  onToggleStar: (id: number) => void;
  onActionComplete: (id: number) => void;
  showToast: (toast: ToastConfig) => void;
  onNotificationClick: (id: number) => void;
}> = ({ notification, onToggleRead, onToggleStar, onActionComplete, showToast, onNotificationClick }) => {
  const handleOpenCard = () => {
    if (notification.cardUrl) {
      // Mark as read when opening card
      if (!notification.read) {
        onActionComplete(notification.id);
      }
      // In a real app, this would navigate to the card
      showToast({
        title: 'Информация',
        message: `Открытие карточки: ${notification.cardUrl}`,
        type: 'info'
      });
    }
  };

  const handleNotificationClick = () => {
    if (!notification.read) {
      onNotificationClick(notification.id);
    }
  };

  const hasPrimaryAction = notification.cardUrl && notification.type !== 'system';
  const hasAdditionalActions = notification.actions && notification.actions.length > 0;

  return (
    <div 
      className={`border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer ${
        notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-300'
      }`}
      onClick={handleNotificationClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${getTypeColorClass(notification.type)}`}>
            {getTypeIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-semibold text-gray-900 ${!notification.read ? 'font-bold' : ''}`}>
                {notification.title}
              </h3>
              <div className="flex items-center space-x-2">
                {notification.delegate && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    За заместителя
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar(notification.id);
                  }}
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  {notification.starred ? (
                    <BookmarkCheck className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
                {hasAdditionalActions && (
                  <NotificationActionsDropdown 
                    actions={notification.actions} 
                    notificationId={notification.id}
                    onActionComplete={onActionComplete}
                    showToast={showToast}
                  />
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mb-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColorClass(notification.type)}`}>
                {notification.subtype}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {notification.description}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{notification.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(notification.date)}</span>
                </div>
              </div>
              
              {hasPrimaryAction && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenCard();
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Открыть карточку
                </button>
              )}
            </div>
            
            {/* Additional action buttons for mobile/small screens */}
            {hasAdditionalActions && (
              <div className="mt-3 flex flex-wrap gap-2 md:hidden">
                {notification.actions.slice(0, 2).map((action, index) => (
                  <ActionButton 
                    key={index} 
                    action={action} 
                    variant="secondary" 
                    notificationId={notification.id}
                    onActionComplete={onActionComplete}
                    showToast={showToast}
                  />
                ))}
                {notification.actions.length > 2 && (
                  <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                    +{notification.actions.length - 2}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 ml-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleRead(notification.id);
            }}
            className="text-gray-400 hover:text-gray-600 p-1"
            title={notification.read ? 'Отметить как непрочитанное' : 'Отметить как прочитанное'}
          >
            {notification.read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {/* Additional action buttons for desktop */}
      {hasAdditionalActions && (
        <div className="mt-4 hidden md:flex flex-wrap gap-2">
          {notification.actions.map((action, index) => (
            <ActionButton 
              key={index} 
              action={action} 
              variant="secondary" 
              notificationId={notification.id}
              onActionComplete={onActionComplete}
              showToast={showToast}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const NotificationFilters: React.FC<{
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
  onSavePreset: () => void;
  presets: Preset[];
  onApplyPreset: (preset: Preset) => void;
  isModalOpen: boolean;
  onModalOpen: () => void;
  onModalClose: () => void;
  onModalSave: (name: string) => void;
}> = ({ filters, onFilterChange, onSavePreset, presets, onApplyPreset, isModalOpen, onModalOpen, onModalClose, onModalSave }) => {
  const [showPresets, setShowPresets] = useState(false);
  
  // Options for selects
  const typeOptions = [
    { value: '', label: 'Все типы' },
    { value: 'document', label: 'Документы' },
    { value: 'task', label: 'Задания' },
    { value: 'system', label: 'Системные' }
  ];

  const subtypeOptions = [
    { value: '', label: 'Все подвиды' },
    { value: 'Входящий документ', label: 'Входящий документ' },
    { value: 'Служебная записка', label: 'Служебная записка' },
    { value: 'Приказ', label: 'Приказ' },
    { value: 'Задание на согласование', label: 'Задание на согласование' },
    { value: 'Задание на подписание', label: 'Задание на подписание' },
    { value: 'Системное уведомление', label: 'Системное уведомление' }
  ];

  const statusOptions = [
    { value: '', label: 'Все статусы' },
    { value: 'unread', label: 'Непрочитанные' },
    { value: 'read', label: 'Прочитанные' }
  ];

  const starredOptions = [
    { value: '', label: 'Все' },
    { value: 'true', label: 'Избранные' }
  ];

  return (
    <>
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-700">Фильтры:</span>
          </div>
          
          <CustomSelect
            options={typeOptions}
            value={filters.type}
            onChange={(value) => onFilterChange('type', value)}
            className="min-w-[150px]"
          />
          
          <CustomSelect
            options={subtypeOptions}
            value={filters.subtype}
            onChange={(value) => onFilterChange('subtype', value)}
            className="min-w-[180px]"
          />
          
          <CustomSelect
            options={statusOptions}
            value={filters.status}
            onChange={(value) => onFilterChange('status', value)}
            className="min-w-[150px]"
          />
          
          <CustomSelect
            options={starredOptions}
            value={filters.starred}
            onChange={(value) => onFilterChange('starred', value)}
            className="min-w-[120px]"
          />
          
          <div className="relative">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <span>Пресеты</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showPresets ? 'rotate-180' : ''}`} />
            </button>
            
            {showPresets && (
              <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg z-10 min-w-48">
                <div className="p-2">
                  <button
                    onClick={() => {
                      onModalOpen();
                      setShowPresets(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    Сохранить текущий фильтр
                  </button>
                  {presets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        onApplyPreset(preset);
                        setShowPresets(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <ModalInput
        isOpen={isModalOpen}
        onClose={onModalClose}
        onSave={onModalSave}
        title="Сохранить пресет фильтра"
      />
    </>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      {({ showToast, testToasts, togglePosition, position }) => (
        <AppContent 
          showToast={showToast} 
          testToasts={testToasts}
          togglePosition={togglePosition}
          position={position}
        />
      )}
    </ToastProvider>
  );
};

const AppContent: React.FC<{
  showToast: (toast: ToastConfig) => void;
  testToasts: () => void;
  togglePosition: () => void;
  position: 'top' | 'bottom';
}> = ({ showToast, testToasts, togglePosition, position }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filters, setFilters] = useState<Filters>({
    type: '',
    subtype: '',
    status: '',
    starred: ''
  });
  const [presets, setPresets] = useState<Preset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: !notif.read } : notif
    ));
  };

  const toggleStar = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, starred: !notif.starred } : notif
    ));
  };

  // New function to mark notification as read after action
  const markNotificationAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const savePreset = (presetName: string) => {
    const newPreset: Preset = { name: presetName, filters: { ...filters, search: searchTerm } };
    setPresets(prev => [...prev, newPreset]);
    showToast({
      title: 'Успех',
      message: `Пресет "${presetName}" сохранен`,
      type: 'success'
    });
  };

  const applyPreset = (preset: Preset) => {
    setFilters(preset.filters);
    setSearchTerm(preset.filters.search || '');
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      // Apply search filter
      if (searchTerm && !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !notification.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Apply type filter
      if (filters.type && notification.type !== filters.type) {
        return false;
      }
      
      // Apply subtype filter
      if (filters.subtype && notification.subtype !== filters.subtype) {
        return false;
      }
      
      // Apply status filter
      if (filters.status === 'unread' && notification.read) {
        return false;
      }
      if (filters.status === 'read' && !notification.read) {
        return false;
      }
      
      // Apply starred filter
      if (filters.starred === 'true' && !notification.starred) {
        return false;
      }
      
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [notifications, filters, searchTerm]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Bell className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Система уведомлений</h1>
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {unreadCount} непрочитанных
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={togglePosition}
                className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Позиция: {position === 'top' ? 'Сверху' : 'Снизу'}
              </button>
              <button
                onClick={testToasts}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Тест уведомлений</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Поиск по уведомлениям..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <NotificationFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSavePreset={openModal}
          presets={presets}
          onApplyPreset={applyPreset}
          isModalOpen={isModalOpen}
          onModalOpen={openModal}
          onModalClose={closeModal}
          onModalSave={savePreset}
        />

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Уведомления не найдены</h3>
              <p className="text-gray-500">Попробуйте изменить фильтры или выполнить поиск</p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onToggleRead={toggleRead}
                onToggleStar={toggleStar}
                onActionComplete={markNotificationAsRead}
                showToast={showToast}
                onNotificationClick={markNotificationAsRead}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default App;