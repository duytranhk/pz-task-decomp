import HomeIcon from '@material-ui/icons/Home';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { RouteItem } from '../models/route-item.model';
import TaskDecompPage from '../pages/decomp.page';
import HomePage from '../pages/home.page';

export const routes: Array<RouteItem> = [
    {
        key: 'router-home',
        title: 'Home',
        tooltip: 'Home',
        path: '/home',
        enabled: true,
        component: HomePage,
        icon: HomeIcon,
        background: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)',
    },
    {
        key: 'router-decomp',
        title: 'Task Decomp',
        tooltip: 'Decomp',
        path: '/task-decomp',
        enabled: true,
        component: TaskDecompPage,
        icon: AssignmentIcon,
        background: 'linear-gradient(132deg, #F4D03F 0%, #16A085 100%)',
    },
];
