// Компоненты
import React from "react";
import {InAppNotificationData, ToastConfig} from "../types";
import {Bookmark, BookmarkCheck, Calendar, Eye, EyeOff, User} from "lucide-react";
import {NotificationActionsDropdown} from "./NotificationActionsDropdown";
import {ActionButton} from "./ActionButton";
import {formatDate, getTypeColorClass, getTypeIcon} from "../Common";

export const NotificationCard: React.FC<{
    notification: InAppNotificationData;
    onToggleRead: (id: number) => void;
    onToggleStar: (id: number) => void;
    onActionComplete: (id: number) => void;
    showToast: (toast: ToastConfig) => void;
    onNotificationClick?: (id: number) => void;
}> = ({notification, onToggleRead, onToggleStar, onActionComplete, showToast, onNotificationClick}) => {
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
            onNotificationClick?.call(null,notification.id);
        }
    };

    const hasPrimaryAction = notification.cardUrl && notification.type !== 'system';
    const hasAdditionalActions = notification.actions && notification.actions.length > 0;

    return (
        <div
            className={`border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer ${
                notification.read ? 'bg-white border-gray-200' : 'bg-blue-100 border-blue-300'
            }`}
            onClick={handleNotificationClick}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                    <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${getTypeColorClass(notification.type)}`}>
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
                    По замещению
                  </span>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleStar(notification.id);
                                    }}
                                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                                    aria-label={notification.starred ? "Убрать из избранного" : "Добавить в избранное"}
                                >
                                    {notification.starred ? (
                                        <BookmarkCheck className="w-4 h-4 text-yellow-500"/>
                                    ) : (
                                        <Bookmark className="w-4 h-4"/>
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
              <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColorClass(notification.type)}`}>
                {notification.subtype}
              </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {notification.description}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                    <User className="w-3 h-3"/>
                                    <span>{notification.author}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3"/>
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
                                    <button
                                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
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
                        {notification.read ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
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