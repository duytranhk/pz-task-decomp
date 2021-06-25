import { GenerateTaskType } from './../contexts/azure-devops/azure-devops.model';
export const APP_TITLE = 'Patient Zero - Quick Task Decomp';
export const APP_COLORS = {
    success: '#4CAF50',
    warning: '#FFA000',
    subtitle: '#666',
    todo: '#FF5722',
    inprogress: '#1976D2',
    done: '#388E3C',
};
export const DEFAULT_TASKS = {
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
    [GenerateTaskType.Bug]: ['Fix It', 'Test It'],
    [GenerateTaskType.Single]: ['New Task'],
};
