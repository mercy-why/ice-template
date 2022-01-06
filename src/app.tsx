import { runApp, IAppConfig, config as iceConfig, history } from 'ice';
import { notification } from 'antd';
import sysService from '@/services/system';
import { codeMessage } from '@/utils';

const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
    getInitialData: async () => {
      try {
        const { data } = await sysService.getCurrentUser();
        const { name: userName, currentMenuList: menuList, id: userId, currentOrg, orgIdMapRoleList } = data;
        // 任意的操作：比如读写 cookie 等
        return {
          userName,
          menuList,
          userId,
          orgId: currentOrg?.id,
          orgName: currentOrg?.name || '无',
          userRoleId: orgIdMapRoleList && orgIdMapRoleList[currentOrg.id].map((el) => el.id).join(),
        };
      } catch (error) {
        return error;
      }
    },
  },
  router: {
    type: 'hash',
  },
  request: {
    baseURL: iceConfig.baseURL,
    // 拦截器
    interceptors: {
      request: {
        onConfig: (config) => {
          const jwt = localStorage.getItem('jwt');
          // 发送请求前：可以对 RequestConfig 做一些统一处理
          if (jwt && history?.location.pathname !== '/login') {
            Object.assign(config.headers, { jwt });
          }
          return config;
        },
        onError: (error) => {
          return Promise.reject(error);
        },
      },
      response: {
        onConfig: (response) => {
          // 请求成功：可以做全局的 toast 展示，或者对 response 做一些格式化
          if (response?.data.code !== 0) {
            notification.error({
              message: '请求失败',
              description: response.data.msg,
            });
          }
          return response;
        },
        onError: (error) => {
          const { status } = error.response || {};
          const msg = status ? codeMessage[status] : '';
          notification.destroy();
          notification.error({
            message: '请求失败',
            description: msg,
          });
          if (status === 401) {
            history?.replace({
              pathname: '/login',
              search: `redirect=${history?.location.pathname}`,
            });
          }
          if (status === 403) {
            history?.push({
              pathname: '/403',
            });
          }
          return Promise.reject(error);
        },
      },
    },
  },
};

runApp(appConfig);
