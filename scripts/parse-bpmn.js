// Скрипт для парсинга BPMN файлов и извлечения задач
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseBpmnFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Извлекаем Process ID и название
  const processMatch = content.match(/<bpmn:process\s+id="([^"]+)"\s+name="([^"]+)"/);
  const processId = processMatch ? processMatch[1] : 'unknown';
  const processName = processMatch ? processMatch[2] : 'Unknown Process';

  const userTasks = [];
  const serviceTasks = [];

  // Регулярное выражение для userTask
  const userTaskRegex = /<bpmn:userTask\s+id="([^"]+)"(?:\s+name="([^"]+)")?[\s\S]*?<zeebe:taskDefinition\s+type="([^"]+)"/g;
  let match;

  while ((match = userTaskRegex.exec(content)) !== null) {
    const [, id, name, taskDefinitionKey] = match;
    userTasks.push({
      id,
      name: name || id,
      taskDefinitionKey
    });
  }

  // Регулярное выражение для serviceTask
  const serviceTaskRegex = /<bpmn:serviceTask\s+id="([^"]+)"(?:\s+name="([^"]+)")?[\s\S]*?<zeebe:taskDefinition\s+type="([^"]+)"/g;

  while ((match = serviceTaskRegex.exec(content)) !== null) {
    const [, id, name, type] = match;
    serviceTasks.push({
      id,
      name: name || id,
      type
    });
  }

  return {
    fileName: path.basename(filePath),
    processId,
    processName,
    userTasks,
    serviceTasks
  };
}

// Парсим основной файл
const mainBpmnPath = path.join(__dirname, '../bpmn/credit-cpa-main.bpmn');
const result = parseBpmnFile(mainBpmnPath);

console.log(JSON.stringify(result, null, 2));
