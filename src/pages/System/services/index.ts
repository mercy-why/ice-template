import { request } from 'ice';

// 模块
export const getSysModuleList = () => {
  return request({
    url: '/sys/getSysModuleList',
    method: 'get',
  });
};

export const addSysModule = (data: { moduleName: string; remark: string }) => {
  return request({
    url: '/sys/addSysModule',
    method: 'post',
    data,
  });
};

// URL
export const getSysResourceList = (params: { moduleId: number }) => {
  return request({
    url: '/sys/getSysResourceList',
    method: 'get',
    params,
  });
};

// 角色
export const getSysRoleList = (params: { currentPage: number; pageSize: number }) => {
  return request({
    url: '/sys/getSysRoleList',
    method: 'get',
    params,
  });
};

export const addSysRole = (data: { roleKey: string; roleName: string }) => {
  return request({
    url: '/sys/addSysRole',
    method: 'post',
    data,
  });
};

// 分配接口
export const distributeInterfaces = (data: Array<{ roleId: string; resourceId: string }>) => {
  return request({
    url: '/sys/distributeInterfaces',
    method: 'post',
    data,
  });
};
