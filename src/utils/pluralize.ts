import plural from 'plural-ru';

export const pluralize = (count: number, one: string, two: string, five: string): string => {
  return `${count} ${plural(count, one, two, five)}`;
};

// Готовые функции для частых случаев
export const pluralizeProcesses = (count: number) => pluralize(count, 'процесс', 'процесса', 'процессов');
export const pluralizeBpmnProcesses = (count: number) => pluralize(count, 'BPMN процесс', 'BPMN процесса', 'BPMN процессов');
export const pluralizeTasks = (count: number) => pluralize(count, 'задача', 'задачи', 'задач');
export const pluralizeComponents = (count: number) => pluralize(count, 'компонент', 'компонента', 'компонентов');
export const pluralizeTabs = (count: number) => pluralize(count, 'таб', 'таба', 'табов');
export const pluralizeProperties = (count: number) => pluralize(count, 'свойство', 'свойства', 'свойств');
