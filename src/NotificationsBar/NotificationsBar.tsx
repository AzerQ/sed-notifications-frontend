import React, {useMemo, useState} from 'react';
import { Plus, Search} from 'lucide-react';
import {NotificationFilters} from "./NotificationFilters";
import {NotificationSort} from "./NotificationSort";
import {Filters, Preset, ToastConfig, SortOption} from "./types";
import {ToastProvider} from "./Toast/ToastProvider";
import {InAppNotificationData} from './types';
import {NotificationCard} from "./NotificationCard/NotificationCard";

export const NotificationsBar: React.FC<{notifications: InAppNotificationData[]}> = ({notifications}) => {
  return (
    <ToastProvider>
      {({ showToast, testToasts, togglePosition, position }) => (
        <NotificationsBarContent
          showToast={showToast} 
          testToasts={testToasts}
          togglePosition={togglePosition}
          position={position}
          appNotifications={notifications}
        />
      )}
    </ToastProvider>
  );
};

const NotificationsBarContent: React.FC<{
  showToast: (toast: ToastConfig) => void;
  testToasts: () => void;
  togglePosition: () => void;
  position: 'top' | 'bottom';
  appNotifications: InAppNotificationData[];
}> = ({ showToast, testToasts, togglePosition, position, appNotifications }) => {
  const [notifications, setnotifications] = useState<InAppNotificationData[]>(appNotifications);
  const [filters, setFilters] = useState<Filters>({
    type: '',
    subtype: '',
    status: '',
    author: ''
  });
  const [sortOption, setSortOption] = useState<SortOption>({
    field: 'date',
    order: 'desc'
  });
  const [presets, setPresets] = useState<Preset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleRead = (id: number) => {
    setnotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: !notif.read } : notif
    ));
  };

  const toggleStar = (id: number) => {
    setnotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, starred: !notif.starred } : notif
    ));
  };

  // New function to mark notification as read after action
  const markNotificationAsRead = (id: number) => {
    setnotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSortChange = (newSortOption: SortOption) => {
    setSortOption(newSortOption);
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
    // Apply filters
    const filtered = notifications.filter(notification => {
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
      
      // Apply author filter
      if (filters.author && notification.author !== filters.author) {
        return false;
      }
      
      return true;
    });

    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortOption.field) {
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'author':
          aValue = a.author.toLowerCase();
          bValue = b.author.toLowerCase();
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        default:
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
      }

      if (sortOption.order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [notifications, filters, searchTerm, sortOption]);

  // Separate starred and regular notifications
  const starredNotifications = filteredNotifications.filter(notification => notification.starred);
  const regularNotifications = filteredNotifications.filter(notification => !notification.starred);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Component for rendering notifications list
  const NotificationsList: React.FC<{
    notifications: InAppNotificationData[];
    title?: string;
    emptyMessage?: string;
  }> = ({ notifications, title, emptyMessage }) => (
    <div className="mb-8">
      {title && (
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          {title}
          <span className="ml-2 bg-gray-100 text-gray-600 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {notifications.length}
          </span>
        </h2>
      )}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {notifications.length === 0 ? (
          emptyMessage && (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">{emptyMessage}</p>
            </div>
          )
        ) : (
          notifications.map(notification => (
            <div key={notification.id} className="h-full">
              <NotificationCard
                notification={notification}
                onToggleRead={toggleRead}
                onToggleStar={toggleStar}
                onActionComplete={markNotificationAsRead}
                showToast={showToast}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Controls Section */}
      <div className="p-6 border-b border-gray-200 bg-white flex-shrink-0">
        {/* Search Bar */}
        <div className="mb-4">
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

        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-2">
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

      {/* Filters Section */}
      <div className="p-6 border-b border-gray-200 bg-white flex-shrink-0">
        <NotificationFilters
          notifications={notifications}
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

        <NotificationSort
          sortOption={sortOption}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Notifications Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {starredNotifications.length === 0 && regularNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Уведомления не найдены</h3>
            <p className="text-gray-500">Попробуйте изменить фильтры или выполнить поиск</p>
          </div>
        ) : (
          <>
            {/* Starred Notifications Section */}
            {starredNotifications.length > 0 && (
              <NotificationsList
                notifications={starredNotifications}
                title="⭐ Избранные уведомления"
              />
            )}

            {/* Regular Notifications Section */}
            {regularNotifications.length > 0 && (
              <>
                {starredNotifications.length > 0 && (
                  <hr className="border-gray-200 my-8" />
                )}
                <NotificationsList
                  notifications={regularNotifications}
                  title="📋 Все уведомления"
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

