// BPMN XML для моков
// Импортируем реальные BPMN файлы как строки
import creditCpaMainXml from './bpmn/credit-cpa-main.bpmn?raw';
import creditCpaDocumentsXml from './bpmn/credit-cpa-documents.bpmn?raw';

// Простой placeholder для процессов без BPMN файлов
export const mockBpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:zeebe="http://camunda.org/schema/zeebe/1.0"
  id="Definitions_placeholder" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="placeholder" name="Placeholder Process" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="Начало">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:endEvent id="EndEvent_1" name="Конец">
      <bpmn:incoming>Flow_1</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="EndEvent_1" />
  </bpmn:process>
</bpmn:definitions>`;

export { creditCpaMainXml, creditCpaDocumentsXml };
