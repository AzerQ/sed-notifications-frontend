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

