# Рефакторинг системы уведомлений

## Обзор изменений

Этот рефакторинг значительно улучшает архитектуру системы уведомлений, добавляя новые возможности и устраняя дублирование кода.

## Основные изменения

### 1. Создание сервисного слоя

#### Контракты сервисов
- **`INotificationService`** - интерфейс для работы с уведомлениями
  - `getUnreadNotifications()` - получение непрочитанных уведомлений с пагинацией
  - `getAllNotifications()` - получение всех уведомлений с пагинацией  
  - `markAsRead()` - отметка уведомления как прочитанного
  - `markMultipleAsRead()` - отметка нескольких уведомлений как прочитанных
  - `getUnreadCount()` - получение количества непрочитанных

- **`ISignalRNotificationService`** - интерфейс для real-time уведомлений
  - `startConnection()` - установка соединения с SignalR хабом
  - `stopConnection()` - разрыв соединения
  - `onNewNotification()` - подписка на новые уведомления
  - `onNotificationStatusUpdate()` - подписка на обновления статуса

#### Mock-реализации
- **`MockNotificationService`** - имитация API сервера с задержками
- **`MockSignalRNotificationService`** - имитация SignalR с периодической генерацией уведомлений

### 2. Внедрение MobX Store

**`NotificationStore`** - централизованное управление состоянием:
- Реактивное состояние с автоматическими обновлениями UI
- Интеграция с сервисами
- Обработка загрузки и ошибок
- Пагинация и фильтрация
- SignalR подключение

Основные свойства:
```typescript
- notifications: InAppNotificationData[]     // Все уведомления
- unreadNotifications: InAppNotificationData[] // Непрочитанные
- isLoading: boolean                         // Состояние загрузки
- currentPage: number                        // Текущая страница
- pageSize: number                          // Размер страницы
- filters: NotificationFilters              // Активные фильтры
- isSignalRConnected: boolean               // Статус SignalR
```

### 3. Универсализация утилит

**`notificationUtils.ts`** - единая библиотека для работы с уведомлениями:

#### Иконки (устранение дублирования)
```typescript
getNotificationIcon(type, subtype?, size?) // Универсальная функция иконок
```

Поддерживает:
- Различные размеры (sm, md, lg)
- Настройка по типу и подтипу
- Конфигурируемые цвета
- Fallback для неизвестных типов

#### Цветовые схемы
```typescript
getNotificationTypeColorClass(type) // Цветовые классы по типу
```

#### Форматирование времени
```typescript
formatNotificationDate(date)  // Абсолютное время
formatRelativeTime(date)      // Относительное время ("2 часа назад")
```

### 4. Новые компоненты

#### Пагинация
**`Pagination.tsx`** - полнофункциональный компонент пагинации:
- Настройка размера страницы из пресетов (10, 20, 50, 100)
- Умная навигация по страницам
- Responsive дизайн
- Индикаторы загрузки

#### SignalR уведомления
**`SignalRCompactNotification.tsx`** - компактные уведомления из SignalR:
- Оптимизированный под real-time обновления
- Минимальная информация для быстрого отображения
- Совместимость с основной системой

### 5. Улучшенная архитектура

#### Разделение ответственности
- **Презентационные компоненты** - только отображение
- **Store** - управление состоянием
- **Сервисы** - логика работы с данными
- **Утилиты** - вспомогательные функции

#### Улучшенная типизация
Все новые компоненты полностью типизированы с TypeScript, включая:
- Строгие интерфейсы сервисов
- Типизированные события SignalR
- Валидация параметров пагинации

## Настройка размеров страниц

Система поддерживает предустановленные размеры страниц:

```typescript
export const PAGE_SIZE_PRESETS: PageSizePreset[] = [
  { label: '10 на странице', value: 10 },
  { label: '20 на странице', value: 20 },
  { label: '50 на странице', value: 50 },
  { label: '100 на странице', value: 100 }
];
```

## Использование

### Базовое использование (legacy)
```tsx
<NotificationCenter 
  notifications={notifications} 
  onNotificationUpdate={handleUpdate}
/>
```

### Новое использование с MobX
```tsx
<NotificationStoreProvider>
  <NotificationCenterWithStore />
</NotificationStoreProvider>
```

### Программное управление store
```tsx
const store = useNotificationStore();

// Загрузка данных
await store.loadUnreadNotifications();
await store.loadAllNotifications({ page: 1, pageSize: 20 });

// Управление уведомлениями
await store.markAsRead(notificationId);
await store.markAllAsRead();

// Пагинация
store.setPage(2);
store.setPageSize(50);

// Фильтрация
store.setFilters({ type: 'document', author: 'Петров' });
```

## Имитация SignalR

MockSignalRService автоматически генерирует новые уведомления каждые 10-30 секунд с 30% вероятностью. Типы генерируемых уведомлений:

- Документы на согласование
- Напоминания о встречах  
- Системные обновления
- Новые задачи
- Требования подписи

## Переключение между версиями

Приложение поддерживает переключение между старой и новой архитектурой через checkbox "MobX + SignalR" в интерфейсе.

## Производительность

### Оптимизации MobX
- Автоматическое отслеживание изменений
- Минимальные ре-рендеры компонентов
- Ленивые вычисления для геттеров

### Эффективная пагинация
- Загрузка только необходимых данных
- Кэширование результатов
- Debounced поиск и фильтрация

## Обратная совместимость

Все изменения реализованы с сохранением обратной совместимости:
- Старые компоненты продолжают работать
- API не изменился для существующих компонентов
- Постепенная миграция возможна

## Мониторинг SignalR

В режиме разработки отображается индикатор состояния SignalR соединения в левом нижнем углу:
- 🟢 Подключен
- 🟡 Подключение...  
- 🔴 Отключен

## Структура файлов

```
src/
├── services/
│   ├── contracts/
│   │   ├── INotificationService.ts
│   │   └── ISignalRNotificationService.ts
│   ├── mocks/
│   │   ├── MockNotificationService.ts
│   │   └── MockSignalRNotificationService.ts
│   └── index.ts
├── store/
│   ├── NotificationStore.ts
│   ├── NotificationStoreContext.tsx
│   └── index.ts
├── utils/
│   ├── notificationUtils.ts
│   └── index.ts
└── NotificationsBar/
    ├── NotificationCenterWithStore.tsx
    ├── Pagination.tsx
    └── NotificationCard/
        └── SignalRCompactNotification.tsx
```

## Дальнейшее развитие

### Возможные улучшения
1. **Реальный SignalR** - замена mock-сервиса на реальную интеграцию
2. **Кэширование** - добавление локального кэша для офлайн работы  
3. **Push-уведомления** - интеграция с браузерными уведомлениями
4. **Метрики** - добавление аналитики взаимодействий
5. **A/B тестирование** - возможность тестировать разные варианты UI

### Масштабирование
- Легкое добавление новых типов уведомлений
- Простое расширение фильтров и сортировок
- Модульная архитектура для больших команд