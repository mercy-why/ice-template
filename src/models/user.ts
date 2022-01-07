// src/models/user.ts
import { loginUserInfo } from '@/services';
import { IRootState, IRootDispatch } from '@/store';

interface role {
  id: number;
  roleName: string;
  remark: string;
}
interface userType {
  nickName: string;
  userName: string;
  menuList?: Array<{}>;
  userId: number;
  currentRole: role;
  roles: role[];
}
export default {
  // 定义 model 的初始 state
  state: {
    userInfo: null,
  },

  // 定义改变该模型状态的纯函数
  reducers: {
    update(prevState: IRootState, payload: { userInfo: userType }) {
      return {
        ...payload,
      };
    },
  },

  // 定义处理该模型副作用的函数
  effects: (dispatch: IRootDispatch) => ({
    async getUserInfo() {
      const { data } = await loginUserInfo();
      const { nickName, userName, currentMenuList: menuList, id: userId, currentRole, roles } = data;
      dispatch.user.update({
        userInfo: {
          nickName,
          userName,
          menuList,
          userId,
          currentRole,
          roles,
        },
      });
    },
  }),
};
