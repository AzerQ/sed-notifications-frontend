// Типы данных
export type NotificationType = 'document' | 'task' | 'system' | 'other';
export type NotificationSubtype = string;

export interface ToastConfig {
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    duration?: number;
    actionUrl?: string;
}

export interface Toast extends ToastConfig {
    id: number;
}

export interface Filters {
    type: string;
    subtype: string;
    status: string;
    author: string;
}

export interface Preset {
    name: string;
    filters: Filters & { search: string };
}

export interface SortOption {
    field: 'date' | 'title' | 'author' | 'type';
    order: 'asc' | 'desc';
}

export interface NotificationAction {
    name: string;
    label: string;
    url: string;
}


export interface InAppNotificationData {
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

// Типы для настроек уведомлений
export type NotificationChannel = 'email' | 'sms' | 'push' | 'inApp';
export type NotificationSettingGroup = 'personal' | 'substitute';

export interface ChannelSetting {
    channel: NotificationChannel;
    enabled: boolean;
}

export interface NotificationEventSetting {
    eventId: string; // Текстовый идентификатор события
    eventName: string; // Человекопонятное наименование
    eventDescription?: string; // Описание события
    personalSettings: ChannelSetting[]; // Настройки для себя
    substituteSettings: ChannelSetting[]; // Настройки по замещению
}

export interface UserNotificationSettings {
    userId: string;
    eventSettings: NotificationEventSetting[];
    lastUpdated: string;
}

// Типы для настроек всплывающих уведомлений (тостов)
export type ToastSize = 'small' | 'medium' | 'large';
export type ToastPosition = 'top' | 'bottom';

export interface ToastSettings {
    size: ToastSize;
    duration: number; // в секундах
    position: ToastPosition;
}

export const DEFAULT_TOAST_SETTINGS: ToastSettings = {
    size: 'medium',
    duration: 4,
    position: 'bottom'
};

