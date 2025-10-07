import {Notification} from './NotificationsBar/types'
import {registerActionHandler} from "./NotificationsBar/notificationsActions";

// Mock data with actions
export const mockNotifications: Notification[] = [
    {
        id: 1,
        title: 'Новый входящий документ',
        type: 'document',
        subtype: 'Входящий документ',
        description: 'Поступил новый входящий документ от ООО "ТехноСервис"',
        author: 'Иван Петров',
        date: '2024-01-15T10:30:00',
        read: false,
        starred: false,
        cardUrl: '/documents/12345',
        delegate: false,
        actions: [
            {
                name: 'approve',
                label: 'Согласовать',
                url: 'appactions://approveDocument?docId=12345&userId=764'
            },
            {
                name: 'reject',
                label: 'Отклонить',
                url: 'appactions://rejectDocument?docId=12345&userId=764'
            }
        ]
    },
    {
        id: 2,
        title: 'Задание на согласование',
        type: 'task',
        subtype: 'Задание на согласование',
        description: 'Требуется ваше согласование по проекту приказа №45',
        author: 'Мария Сидорова',
        date: '2024-01-15T09:15:00',
        read: true,
        starred: true,
        cardUrl: '/tasks/67890',
        delegate: true,
        actions: [
            {
                name: 'completeTask',
                label: 'Выполнить задание',
                url: 'appactions://completeTask?taskId=67890&status=approved'
            }
        ]
    },
    {
        id: 3,
        title: 'Системное обновление',
        type: 'system',
        subtype: 'Системное уведомление',
        description: 'Планируется техническое обслуживание системы 16.01.2024 с 22:00 до 02:00',
        author: 'Система',
        date: '2024-01-14T18:00:00',
        read: false,
        starred: false,
        delegate: false,
        actions: []
    },
    {
        id: 4,
        title: 'Служебная записка',
        type: 'document',
        subtype: 'Служебная записка',
        description: 'Подана служебная записка на командировку в Москву',
        author: 'Алексей Козлов',
        date: '2024-01-14T16:45:00',
        read: false,
        starred: false,
        cardUrl: '/documents/54321',
        delegate: false,
        actions: [
            {
                name: 'signDocument',
                label: 'Подписать',
                url: 'appactions://signDocument?docId=54321&type=travel'
            },
            {
                name: 'requestInfo',
                label: 'Запросить информацию',
                url: 'appactions://requestAdditionalInfo?docId=54321'
            }
        ]
    }
];


// Register some example action handlers
registerActionHandler('approveDocument', (params) => {
    console.log(`Document ${params.docId} approved by user ${params.userId}`);
});

registerActionHandler('rejectDocument', (params) => {
    console.log(`Document ${params.docId} rejected by user ${params.userId}`);
});

registerActionHandler('completeTask', (params) => {
    console.log(`Task ${params.taskId} completed with status: ${params.status}`);
});

registerActionHandler('signDocument', (params) => {
    console.log(`Document ${params.docId} signed (type: ${params.type})`);
});

registerActionHandler('requestAdditionalInfo', (params) => {
    console.log(`Additional info requested for document ${params.docId}`);
});