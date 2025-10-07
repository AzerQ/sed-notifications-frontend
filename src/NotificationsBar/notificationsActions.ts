// Action handlers registry
import {ToastConfig} from "./types";

const actionHandlers = new Map<string, (params: Record<string, string>) => void>();

// Register default action handlers
export const registerActionHandler = (actionName: string, handler: (params: Record<string, string>) => void) => {
    actionHandlers.set(actionName, handler);
};

// Execute action with automatic read marking
export const executeNotificationAction = (
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