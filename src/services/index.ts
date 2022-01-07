import { request } from 'ice';

export const loginUserInfo = () => {
  return request({
    url: '/loginUserInfo',
    method: 'get',
  });
};

export const switchRole = (params: { roleId: number }) => {
  return request({
    url: '/switchRole',
    method: 'get',
    params,
    withFullResponse: true,
  });
};
