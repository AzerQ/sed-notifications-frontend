import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { NotificationBell } from './NotificationBell';
import { Modal } from './Modal';
import { NotificationSidebar } from './NotificationSidebar';
import { NotificationsBar } from './NotificationsBar';
import { NotificationSettings } from './NotificationSettings';
import { useNotificationStore } from '../store/NotificationStoreContext';
import { InAppNotificationData } from './types';

interface NotificationCenterProps {
  // Для обратной совместимости
  notifications?: InAppNotificationData[];
  onNotificationUpdate?: (notifications: InAppNotificationData[]) => void;
}

export const NotificationCenterWithStore: React.FC<NotificationCenterProps> = observer(({ 
  notifications: legacyNotifications,
  onNotificationUpdate 
}) => {
  const store = useNotificationStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Инициализация при первом рендере
  useEffect(() => {
    // Загружаем непрочитанные уведомления для боковой панели
    store.loadUnreadNotifications();
  }, [store]);

  // Синхронизация с legacy props (для обратной совместимости)
  useEffect(() => {
    if (legacyNotifications && onNotificationUpdate) {
      // Если используются legacy props, обновляем внешнее состояние при изменениях в store
      const allNotifications = [...store.unreadNotifications, ...store.notifications];
      const uniqueNotifications = allNotifications.filter((notification, index, self) => 
        index === self.findIndex(n => n.id === notification.id)
      );
      onNotificationUpdate(uniqueNotifications);
    }
  }, [store.notifications, store.unreadNotifications, legacyNotifications, onNotificationUpdate]);

  const handleBellClick = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleOpenFullHistory = () => {
    setIsSidebarOpen(false);
    setIsModalOpen(true);
    // Загружаем все уведомления при открытии полной истории
    store.loadAllNotifications();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setIsSettingsOpen(false);
  };

  const handleNotificationRead = async (id: number) => {
    await store.markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await store.markAllAsRead();
  };

  const handleNotificationUpdate = (updatedNotifications: InAppNotificationData[]) => {
    // Обновляем store (для обратной совместимости с NotificationsBar)
    // В реальном приложении это будет делаться через API
    onNotificationUpdate?.(updatedNotifications);
  };

  return (
    <>
      {/* Колокольчик */}
      <NotificationBell 
        unreadCount={store.unreadCount} 
        onClick={handleBellClick}
      />

      {/* Боковая панель с компактными уведомлениями */}
      <NotificationSidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        notifications={store.unreadNotifications}
        onNotificationRead={handleNotificationRead}
        onOpenFullHistory={handleOpenFullHistory}
        onOpenSettings={handleOpenSettings}
        markAllAsRead={handleMarkAllAsRead}
        isLoading={store.isLoadingUnread}
      />

      {/* Модальное окно с полной историей */}
      <Modal size='full' isOpen={isModalOpen} onClose={handleModalClose}>
        <NotificationsBar
          notifications={store.notifications}
          onNotificationUpdate={handleNotificationUpdate}
          showFilters={true}
          showSearch={true}
          showPagination={true}
          currentPage={store.currentPage}
          totalPages={store.totalPages}
          pageSize={store.pageSize}
          onPageChange={store.setPage.bind(store)}
          onPageSizeChange={store.setPageSize.bind(store)}
          isLoading={store.isLoading}
        />
      </Modal>

      {/* Модальное окно с настройками уведомлений */}
      <NotificationSettings
        isOpen={isSettingsOpen}
        onClose={handleSettingsClose}
        getUserSettings={store.getUserNotificationSettings.bind(store)}
        saveUserSettings={store.saveUserNotificationSettings.bind(store)}
      />

      {/* Индикатор состояния SignalR (для разработки) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-50">
          <div className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${store.isSignalRConnected 
              ? 'bg-green-100 text-green-800' 
              : store.isConnectingSignalR 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
            }
          `}>
            SignalR: {
              store.isSignalRConnected 
                ? 'Подключен' 
                : store.isConnectingSignalR 
                  ? 'Подключение...' 
                  : 'Отключен'
            }
          </div>
        </div>
      )}
    </>
  );
});