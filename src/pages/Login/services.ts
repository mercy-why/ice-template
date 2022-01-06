import { request } from 'ice';

export const loginReq = (data: { account: string; password: string; rememberMe: boolean; uuid: string }) =>
  request({
    url: '/login',
    method: 'post',
    data,
    withFullResponse: true,
  });

export const captchaImage = () =>
  request({
    url: '/captchaImage',
    method: 'get',
  });
