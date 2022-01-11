import { createElement, useEffect } from 'react';
import ProLayout from '@ant-design/pro-layout';
import { Link } from 'ice';
import store from '@/store';
import RightContent from './rightContent';
import iconsMap from './icons';

interface menuItem {
  name: string;
  icon?: string;
  children?: menuItem[];
  url: string;
}
const loopMenuItem = (menuList: menuItem[]) =>
  menuList?.map(({ name, children, url, icon }) => {
    return {
      path: url,
      key: url,
      name,
      icon: icon && iconsMap[icon] && createElement(icon),
      children: children && loopMenuItem(children),
    };
  });

export default function BasicLayout({ children, history }) {
  const [userState, userDispatchers] = store.useModel('user');
  const { userInfo } = userState;
  useEffect(() => {
    if (!userInfo) {
      userDispatchers.getUserInfo();
    }
  }, [userInfo, userDispatchers]);

  return (
    <ProLayout
      title="管理平台"
      style={{
        minHeight: '100vh',
      }}
      location={{
        pathname: history.location.pathname,
      }}
      menuDataRender={() => loopMenuItem(userInfo?.menuList)}
      menuItemRender={(item, defaultDom) => {
        if (!item.path) {
          return defaultDom;
        }
        return <Link to={item.path}>{defaultDom}</Link>;
      }}
      rightContentRender={() => <RightContent />}
    >
      <div style={{ minHeight: '60vh' }}>{children}</div>
    </ProLayout>
  );
}
