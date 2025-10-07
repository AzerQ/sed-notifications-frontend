// Toast Notification Component
import React, {useEffect, useState} from "react";
import {AlertCircle, Bell, CheckCircle} from "lucide-react";

export const ToastNotification: React.FC<{
    id: number;
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    duration?: number;
    onClose: (id: number) => void;
}> = ({id, title, message, type = 'info', duration = 5000, onClose}) => {
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
                return <CheckCircle className="w-5 h-5"/>;
            case 'error':
                return <AlertCircle className="w-5 h-5"/>;
            case 'warning':
                return <AlertCircle className="w-5 h-5"/>;
            default:
                return <Bell className="w-5 h-5"/>;
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