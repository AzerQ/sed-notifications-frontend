import React, { useState } from "react";
import { NotificationCenter } from "./NotificationsBar";
import { mockNotifications } from "./MockNotifications";
import { InAppNotificationData } from "./NotificationsBar/types";

const App: React.FC = () => {
    const [notifications, setNotifications] = useState<InAppNotificationData[]>(mockNotifications);

    const handleNotificationUpdate = (updatedNotifications: InAppNotificationData[]) => {
        setNotifications(updatedNotifications);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header with notification bell */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">
                                Система документооборота
                            </h1>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <NotificationCenter 
                                notifications={notifications} 
                                onNotificationUpdate={handleNotificationUpdate}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Добро пожаловать в систему!
                    </h2>
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            Нажмите на иконку колокольчика в правом верхнем углу, чтобы открыть 
                            боковое меню с новыми уведомлениями.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-900 mb-2">Функции системы уведомлений:</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Компактное боковое меню с непрочитанными уведомлениями</li>
                                <li>• Клик по уведомлению для перехода по ссылке и пометки как прочитанное</li>
                                <li>• Кнопка "Вся история уведомлений" для открытия полного модального окна</li>
                                <li>• Автообновление счетчика после прочтения уведомлений</li>
                                <li>• Полная история с фильтрами, сортировкой и поиском</li>
                            </ul>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">Статистика уведомлений:</h4>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {notifications.length}
                                    </div>
                                    <div className="text-sm text-gray-600">Всего</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-red-600">
                                        {notifications.filter(n => !n.read).length}
                                    </div>
                                    <div className="text-sm text-gray-600">Непрочитанных</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {notifications.filter(n => n.starred).length}
                                    </div>
                                    <div className="text-sm text-gray-600">Избранных</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;