import type { ServiceTaskConfig } from '@/types';

export const mockServiceTaskConfig: ServiceTaskConfig = {
  id: 'stc-1',
  serviceTaskKey: 'creditProcess.calculateRisk',
  version: 2,
  type: 'RiskCalculator',
  ioMapping: {
    inputs: [
      { name: 'applicantIncome', value: '=applicantIncome' },
      { name: 'creditAmount', value: '=creditAmount' },
      { name: 'creditTerm', value: '=creditTerm' }
    ],
    outputs: [
      { source: 'riskScore', target: 'calculatedRiskScore' },
      { source: 'riskLevel', target: 'riskLevel' }
    ]
  },
  createdAt: '2025-07-10T11:00:00Z',
  updatedAt: '2025-09-25T16:45:00Z',
  author: 'Иван Админов'
};
