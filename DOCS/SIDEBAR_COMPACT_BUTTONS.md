# Компактные кнопки в сайдбаре уведомлений

## Обзор изменений

Кнопки действий в боковой панели уведомлений (`NotificationSidebar`) были переработаны для более компактного отображения. Теперь кнопки представляют собой иконки с всплывающими подсказками (tooltips) при наведении и расположены в одну горизонтальную линию.

## Дата изменения
10 октября 2025

---

## Что изменилось

### До изменений:
- ✗ Три полноразмерные кнопки с текстом и иконками
- ✗ Кнопки занимали всю ширину сайдбара
- ✗ Вертикальное расположение (одна под другой)
- ✗ Занимали много вертикального пространства

### После изменений:
- ✓ Компактные кнопки-иконки
- ✓ Текст отображается как tooltip при наведении
- ✓ Горизонтальное расположение (в одну линию)
- ✓ Экономия вертикального пространства
- ✓ Адаптивные размеры в зависимости от настроек toast

---

## Структура кнопок

### 1. Вся история уведомлений
- **Иконка:** `History` (Lucide React) - журнал с часами
- **Цвет:** Синий (`bg-blue-600`, hover: `bg-blue-700`)
- **Tooltip:** "Вся история уведомлений"
- **Действие:** Открывает модальное окно с полной историей уведомлений
- **data-testid:** `notification-sidebar-full-history-button`

### 2. Настройки уведомлений
- **Иконка:** `Settings` (Lucide React)
- **Цвет:** Серый (`bg-gray-600`, hover: `bg-gray-700`)
- **Tooltip:** "Настройки уведомлений"
- **Действие:** Открывает модальное окно с настройками уведомлений
- **data-testid:** `notification-sidebar-settings-button`

### 3. Настройки всплывающих уведомлений
- **Иконка:** `Bell` (Lucide React)
- **Цвет:** Фиолетовый (`bg-purple-600`, hover: `bg-purple-700`)
- **Tooltip:** "Настройки всплывающих"
- **Действие:** Открывает модальное окно с настройками toast-уведомлений
- **data-testid:** `notification-sidebar-toast-settings-button`
- **Условие:** Отображается только если передан prop `onOpenToastSettings`

---

## Технические детали

### Адаптивные размеры

Размеры кнопок автоматически адаптируются в зависимости от настройки `toastSize`:

| Размер | Padding | Иконка |
|--------|---------|--------|
| Small | `p-2` | `w-4 h-4` |
| Medium | `p-2.5` | `w-5 h-5` |
| Large | `p-3` | `w-6 h-6` |

### Структура tooltip

```tsx
<div className="relative group">
  <button>
    <Icon />
  </button>
  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
    Текст подсказки
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
      <div className="border-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>
</div>
```

### Особенности tooltip:
- **Позиционирование:** Сверху от кнопки (`bottom-full`)
- **Центрирование:** По центру кнопки (`left-1/2 transform -translate-x-1/2`)
- **Анимация:** Плавное появление через opacity (`opacity-0 group-hover:opacity-100`)
- **Стрелка:** Треугольник снизу для визуальной связи с кнопкой
- **z-index:** `z-10` для отображения поверх других элементов
- **pointer-events:** `none` чтобы tooltip не мешал взаимодействию

---

## Код изменений

### Расположение кнопок
```tsx
<div className="flex items-center justify-center gap-2">
  {/* Кнопки расположены горизонтально с промежутком gap-2 */}
</div>
```

### Структура одной кнопки
```tsx
<div className="relative group">
  <button
    onClick={handleClick}
    className={`${styles.buttonPadding} bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors`}
    data-testid="button-testid"
    aria-label="Описание кнопки"
  >
    <Icon className={styles.buttonIcon} />
  </button>
  
  {/* Tooltip */}
  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
    Текст подсказки
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
      <div className="border-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>
</div>
```

---

## Преимущества

### 1. Экономия пространства
- Вертикальная высота секции кнопок уменьшена ~3 раза
- Больше места для списка уведомлений
- Компактный UI не перегружает интерфейс

### 2. Современный UX
- Знакомый паттерн кнопок-иконок с tooltips
- Используется во многих современных приложениях
- Интуитивно понятные иконки

### 3. Адаптивность
- Размеры автоматически подстраиваются под настройки
- Согласованность с остальным UI
- Пропорциональное масштабирование

### 4. Доступность (Accessibility)
- `aria-label` для каждой кнопки
- Четкие визуальные состояния (hover)
- Tooltips для пояснения действий
- Сохранены все `data-testid` для тестирования

### 5. Производительность
- CSS-only tooltips (без JavaScript)
- Плавные переходы через `transition-opacity`
- Минимальная нагрузка на рендеринг

---

## Тестирование

Все существующие тестовые ID сохранены:
- ✅ `notification-sidebar-actions-section` - контейнер секции
- ✅ `notification-sidebar-full-history-button` - кнопка истории
- ✅ `notification-sidebar-settings-button` - кнопка настроек
- ✅ `notification-sidebar-toast-settings-button` - кнопка настроек toast

### Пример теста
```tsx
it('should show tooltip on hover', async () => {
  render(<NotificationSidebar {...props} />);
  
  const button = screen.getByTestId('notification-sidebar-full-history-button');
  
  // Наведение мыши
  fireEvent.mouseEnter(button);
  
  // Tooltip должен появиться
  await waitFor(() => {
    expect(screen.getByText('Вся история уведомлений')).toBeVisible();
  });
});
```

---

## Визуальное сравнение

### Старая версия (вертикальные кнопки)
```
┌─────────────────────────────┐
│ [� Вся история уведомлений] │ ← Занимает ~40px высоты
│ [⚙️ Настройки уведомлений]   │ ← Занимает ~40px высоты
│ [🔔 Настройки всплывающих]   │ ← Занимает ~40px высоты
└─────────────────────────────┘
Всего: ~120px + gap + padding ≈ 140px
```

### Новая версия (горизонтальные иконки)
```
┌─────────────────────────────┐
│       [�] [⚙️] [🔔]         │ ← Занимает ~40px высоты
└─────────────────────────────┘
Всего: ~40px + padding ≈ 50px

Экономия: ~90px вертикального пространства
```

---

## Совместимость

- ✅ React 18+
- ✅ TypeScript
- ✅ Tailwind CSS 3.x
- ✅ Lucide React (иконки)
- ✅ Все современные браузеры
- ✅ Поддержка touch-устройств (hover заменяется на tap)

---

## Возможные улучшения (будущее)

1. **Анимация появления tooltip**
   - Добавить `transition-all` с `translate-y`
   - Эффект "всплытия" снизу вверх

2. **Контекстное меню**
   - При длительном нажатии показывать меню с дополнительными действиями

3. **Кастомизация позиции tooltip**
   - Автоматическое определение доступного места
   - Переключение на показ снизу, если сверху не хватает места

4. **Анимация иконок**
   - Subtle анимация при hover (scale, rotate)
   - Пульсация при наличии непрочитанных уведомлений

5. **Клавиатурная навигация**
   - Hotkeys для быстрого доступа (например, Ctrl+H для истории)
   - Focus management для accessibility

---

## Связанные файлы

- `/src/NotificationsBar/NotificationSidebar.tsx` - основной компонент
- `/src/NotificationsBar/types.ts` - типы (ToastSize)
- `/__tests__/NotificationSidebar.test.tsx` - тесты компонента

---

## Автор изменений
GitHub Copilot

## Дата создания документации
10 октября 2025
