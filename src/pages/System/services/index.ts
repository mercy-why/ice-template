import { request } from 'ice';
import React from 'react';

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
export const getSysRoleList = (params: { currentPage?: number; pageSize?: number; id?: string }) => {
  return request({
    url: '/sys/getSysRoleList',
    method: 'get',
    params,
  });
};

// 新增或修改角色
export const addOrUpdateSysRole = (data: { roleKey: string; roleName: string; id?: number; status?: string }) => {
  return request({
    url: '/sys/addOrUpdateSysRole',
    method: 'post',
    data,
  });
};

export const deleteSysRole = (params: { id: number }) => {
  return request({
    url: '/sys/deleteSysRole',
    method: 'delete',
    params,
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

export const getMenuTree = () => {
  return request({
    url: '/sys/getMenuTree',
    method: 'get',
  });
};

export const updateMenu = (data: { name: string; url: string; icon: string; id: React.Key }) => {
  return request({
    url: '/sys/updateMenu',
    method: 'put',
    data,
  });
};

export const batchAddMenus = (data: {
  sysMenuList: Array<{
    name: string;
    url: string;
    icon: string;
    parentId: React.Key;
  }>;
}) => {
  return request({
    url: '/sys/batchAddMenus',
    method: 'post',
    data,
  });
};

export const deleteMenus = (params: { ids: string }) => {
  return request({
    url: '/sys/deleteMenus',
    method: 'delete',
    params,
  });
};

export const distributeMenus = (list: Array<{ roleId: React.Key; menuId: React.Key }>) => {
  const data = {
    roleMenuList: list,
  };
  return request({
    url: '/sys/distributeMenus',
    method: 'post',
    data,
  });
};
