import { GenerateTaskType } from './../contexts/azure-devops/azure-devops.model';
export const APP_TITLE = 'Patient Zero - Quick Task Decomp';
export const appColor = {
    success: '#4CAF50',
    warning: '#FFA000',
    subtitle: '#666',
};
export const DefaultTasks = {
    [GenerateTaskType.Common]: ['QA', 'E2E Tests'],
    [GenerateTaskType.API]: [
        'DB Schema',
        'API Service',
        'API Controller/Dto',
        'API Entity',
        'DDD Refactor',
        'API Integration Tests',
        'API Unit Tests',
    ],
    [GenerateTaskType.UI]: ['UI Component', 'UI Component Tests'],
};
