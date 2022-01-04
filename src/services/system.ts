import { transformFn } from '@/utils';
const apiList = [
  '/common/login', // 登录
  '/common/getCurrentUser',
  '/sys/org/selectOrgListPage', // 获取组织列表
  '/sys/org/insert', // 新增组织
  '/sys/org/updateById', // 编辑组织
  '/sys/org/selectOrgById', // 查看组织
  '/sys/org/delById', // 删除组织
];

export default transformFn(apiList);
