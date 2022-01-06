import { IRouterConfig } from 'ice';
import Layout from '@/Layouts/BasicLayout';
import NotFound from '@/components/NotFound';
import NotAccess from '@/components/NotAccess';
import Login from '@/pages/Login';
import Auth from '@/pages/System/Auth';
import InterfaceList from '@/pages/System/Auth/list';
import User from '@/pages/System/User';
import Role from '@/pages/System/Role';

const routerConfig: IRouterConfig[] = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/system',
        children: [
          {
            path: '/user',
            component: User,
          },
          {
            path: '/role',
            component: Role,
          },
          {
            path: '/auth',
            component: Auth,
            exact: true,
          },
          {
            path: '/auth/:id',
            component: InterfaceList,
            exact: true,
          },
        ],
      },
      {
        path: '/403',
        component: NotAccess,
      },
      {
        component: NotFound,
      },
    ],
  },
];

export default routerConfig;
