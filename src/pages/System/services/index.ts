import { request } from 'ice';

export const getSysModuleList = () => {
  return request({
    url: '/sys/getSysModuleList',
    method: 'get',
  });
};
