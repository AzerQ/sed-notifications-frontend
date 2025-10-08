import React, { useState } from 'react';
import { NotificationBell } from './NotificationBell';
import { Modal } from './Modal';
import { NotificationsBar } from './NotificationsBar';
import { InAppNotificationData } from './types';

interface NotificationCenterProps {
  notifications: InAppNotificationData[];
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <NotificationBell 
        unreadCount={unreadCount} 
        onClick={openModal} 
      />
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title="Центр уведомлений"
        size="full"
      >
        <NotificationsBar notifications={notifications} />
      </Modal>
    </>
  );
};