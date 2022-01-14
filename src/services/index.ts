import { request } from 'ice';

export const loginUserInfo = () => {
  return request({
    url: '/loginUserInfo',
    method: 'get',
    instanceName: 'loginRequest',
  });
};

export const switchRole = (params: { roleId: string }) => {
  return request({
    url: '/switchRole',
    method: 'get',
    params,
    withFullResponse: true,
    instanceName: 'loginRequest',
  });
};

export const loginOut = () => {
  return request({
    url: '/logout',
    method: 'get',
    instanceName: 'loginRequest',
  });
};

export const updatePwd = (data: { oldPwd: string; newPwd: string }) => {
  return request({
    url: '/sys/updatePwd',
    method: 'put',
    data,
  });
};
