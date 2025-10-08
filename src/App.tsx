import React from "react";
import { NotificationCenter } from "./NotificationsBar";
import { mockNotifications } from "./MockNotifications";

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header with notification bell */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">
                                Мое приложение
                            </h1>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <NotificationCenter notifications={mockNotifications} />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Добро пожаловать!
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Это основная страница вашего приложения. Нажмите на иконку колокольчика 
                        в правом верхнем углу, чтобы открыть центр уведомлений.
                    </p>
                    <p className="text-gray-600">
                        Иконка колокольчика показывает количество непрочитанных уведомлений.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default App;