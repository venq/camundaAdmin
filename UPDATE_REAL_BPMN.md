# Обновление: Интеграция реальных BPMN процессов

## 📅 Дата: 2025-10-01

## ✅ Что сделано

### 1. Добавлены реальные BPMN файлы
В директорию `bpmn/` добавлены 21 реальный BPMN файл процесса кредитования:

**Основные процессы:**
- `credit-cpa-main.bpmn` - Основной процесс выдачи кредитов
- `credit-cpa-documents.bpmn` - Сбор документов
- `credit-cpa-decision.bpmn` - Принятие решения (голосование)
- `credit-cpa-order-analyze.bpmn` - Анализ заявки
- `credit-cpa-enrich.bpmn` - Обогащение участников сделки

**Вспомогательные процессы:**
- `credit-cpa-pre-qualification.bpmn` - Предварительная квалификация
- `credit-cpa-prescoring.bpmn` - Прескоринг
- `credit-cpa-prescoring-evaluate.bpmn` - Оценка прескоринга
- `credit-cpa-evaluate-scorings.bpmn` - Оценка скорингов
- `credit-cpa-stop-factors.bpmn` - Проверка стоп-факторов
- `credit-cpa-cod-create.bpmn` - Формирование КОД
- `credit-cpa-cod-sign-bank.bpmn` - Подписание КОД банком
- `credit-cpa-cod-sign-members.bpmn` - Подписание КОД участниками
- `credit-cpa-issue-product.bpmn` - Выдача кредитного продукта
- И другие...

### 2. Создан скрипт парсинга BPMN

**Файл:** `scripts/parse-bpmn.js`

Скрипт автоматически извлекает из BPMN файлов:
- Process ID и название процесса
- Список всех UserTask с их taskDefinitionKey
- Список всех ServiceTask с их типами
- Количество задач каждого типа

**Использование:**
```bash
node scripts/parse-bpmn.js
```

**Для парсинга нескольких файлов:**
```bash
node scripts/parse-multiple-bpmn.js
```

### 3. Обновлены моковые данные

**Файл:** `src/data/mockData.ts`

Заменены тестовые процессы на реальные данные из BPMN:

#### Процесс 1: credit-cpa-main (Основной процесс)
- **Файл:** credit-cpa-main.bpmn
- **Process ID:** credit-cpa-main
- **Название:** Выдача кредитов: Основной процесс
- **UserTasks:** 1
  - `credit-cpa-main.UserTaskAnalyzeReject` - Анализ отказа
- **ServiceTasks:** 10 (из 23 всего)
  - Инициализация заявки
  - Сформировать РГ по заявке
  - Установить статус заявки (x4)
  - Проверить отлагательные условия
  - Загрузка документов в ЭА
  - Заморозка лимита
  - Генерация UUID
  - И другие...

#### Процесс 2: credit-cpa-documents (Сбор документов)
- **Файл:** credit-cpa-documents.bpmn
- **Process ID:** credit-cpa-documents
- **Название:** Сбор документов
- **UserTasks:** 3
  - Заполнение анкеты и сбор пакета документов
  - Приложите подписанные документы
  - Проверить подписанные документы
- **ServiceTasks:** 4 (из 8 всего)
  - Установить статус заявки
  - Получение участников сделки
  - Генерация анкеты-заявки
  - Сформировать список документов

#### Процесс 3: credit-cpa-decision (Принятие решения)
- **Файл:** credit-cpa-decision.bpmn
- **Process ID:** credit-cpa-decision
- **Название:** Принятие решения (голосование)
- **UserTasks:** 1
  - Подготовка и согласование материалов
- **ServiceTasks:** 1
  - Установить статус заявки

#### Процесс 4: credit-cpa-order-analyze (Анализ заявки)
- **Файл:** credit-cpa-order-analyze.bpmn
- **Process ID:** credit-cpa-order-analyze
- **Название:** Анализ заявки
- **UserTasks:** 2
  - Верификация и анализ ФХД
  - Дозапрос документов
- **ServiceTasks:** 3 (из 7 всего)
  - Установить статус заявки
  - Получение экспертиз для запуска
  - Запуск экспертиз

### 4. Статистика по задачам

**Всего в проекте "Выдача кредитов":**
- **4 BPMN процесса**
- **7 UserTasks** (настроено: 5, новых: 2)
- **18 ServiceTasks** (настроено: 6, новых: 12)
- **Общий прогресс настройки:** ~44%

### 5. Реальные типы задач

Теперь в моках используются реальные типы из BPMN:

**ServiceTask типы:**
- `credit-cpa-main.ServiceTaskFormRG`
- `credit-cpa-main.ServiceTaskInitialize`
- `common-cpa-main.ServiceTaskUpdateStatus`
- `credit-api-doc-template.ServiceTaskGenerateDocs`
- `PUT /api/limit-mediator/limit/freeze` (HTTP-коннекторы)
- `POST /api/bp-gateway/companyProduct/{businessId}`
- И другие...

**UserTask типы:**
- `credit-cpa-main.UserTaskAnalyzeReject`
- `credit-cpa-documents.UserTaskCollectDocuments`
- `credit-cpa-documents.UserTaskBankSignAgreements`
- `credit-cpa-decision.UserTaskEndorseMaterial`
- `credit-cpa-order-analyze.UserTaskOrderVerify`

## 📊 Визуализация в UI

После запуска приложения вы увидите:

1. **На странице проекта:**
   - Карточки всех 4 процессов
   - Прогресс-бары настройки для каждого
   - Количество UserTask и ServiceTask
   - Реальные названия из BPMN

2. **В BPMN Viewer:**
   - Боковая панель со всеми задачами процесса
   - Цветовая индикация статусов (зелёный/жёлтый)

3. **В редакторах задач:**
   - Реальные taskDefinitionKey
   - Правильные типы ServiceTask

## 🚀 Как посмотреть

```bash
cd camunda-admin
npm install
npm run dev
```

**Навигация:**
```
Тенанты → "Банковский департамент" → "Выдача кредитов"
→ Вы увидите 4 реальных процесса!
```

## 📁 Структура файлов

```
camunda-admin/
├── bpmn/                          # НОВАЯ ДИРЕКТОРИЯ
│   ├── credit-cpa-main.bpmn      # Основной процесс
│   ├── credit-cpa-documents.bpmn # Сбор документов
│   ├── credit-cpa-decision.bpmn  # Принятие решения
│   ├── credit-cpa-order-analyze.bpmn # Анализ
│   └── ... (17 других файлов)
├── scripts/                       # НОВАЯ ДИРЕКТОРИЯ
│   ├── parse-bpmn.js             # Парсер одного файла
│   └── parse-multiple-bpmn.js    # Парсер нескольких файлов
├── src/
│   └── data/
│       └── mockData.ts           # ОБНОВЛЕНО с реальными данными
└── README.md                      # ОБНОВЛЕНО
```

## 🔄 Дальнейшие шаги

### Для загрузки реального BPMN XML:
1. Можно создать endpoint для чтения BPMN файлов
2. Загружать XML по требованию при открытии BPMN Viewer
3. Использовать bpmn-js для визуализации

### Пример кода для загрузки:
```typescript
// В BpmnViewerPage.tsx
useEffect(() => {
  if (bpmnProcess.fileName) {
    fetch(`/bpmn/${bpmnProcess.fileName}`)
      .then(res => res.text())
      .then(xml => {
        // Загрузить в bpmn-js viewer
        viewer.importXML(xml);
      });
  }
}, [bpmnProcess]);
```

## ✨ Преимущества

1. **Реалистичность** - данные из реальных production процессов
2. **Полнота** - видны все виды задач и их типы
3. **Масштабируемость** - легко добавить новые процессы
4. **Автоматизация** - скрипт парсинга экономит время
5. **Соответствие FRD** - точное отражение требований

## 📝 Примечания

- BPMN XML не хранится в моках целиком (слишком большой)
- Используется placeholder XML для демонстрации
- В production XML будет загружаться с backend или из файлов
- Скрипт парсинга можно расширить для автоматической генерации моков

---

**Автор:** Claude Code
**Дата:** 2025-10-01
