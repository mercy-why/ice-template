import { request } from 'ice';

export const getSysModuleList = () => {
  return request({
    url: '/sys/getSysModuleList',
    method: 'get',
  });
};

export const getSysResourceList = (params: { moduleId: number }) => {
  return request({
    url: '/sys/getSysResourceList',
    method: 'get',
    params,
  });
};

export const getSysRoleList = (params: { currentPage: number; pageSize: number }) => {
  return request({
    url: '/sys/getSysRoleList',
    method: 'get',
    params,
  });
};
