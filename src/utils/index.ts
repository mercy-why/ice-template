import { request } from 'ice';
export const transformFn = (apiList) => {
  if (!apiList || apiList.length === 0) {
    return null;
  }
  return apiList.reduce((api, item) => {
    // 使用正则取到接口路径的最后一个子串，比如: getPublicKey
    const apiName = /[^/]+$/.exec(item);
    if (apiName && apiName[0]) {
      api[apiName[0]] = async (data) => {
        return await request.post(item, data);
      };
    }
    return api;
  }, {});
};

export function generateUUID() {
  let d = new Date().getTime();
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now();
  }
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // eslint-disable-next-line no-bitwise
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    // eslint-disable-next-line no-bitwise
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

export const codeMessage = {
  401: '用户没有权限',
  403: '禁止访问',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
