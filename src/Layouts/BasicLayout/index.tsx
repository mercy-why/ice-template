import { createElement } from 'react';
import menuConfig from './menuConfig';
import ProLayout from '@ant-design/pro-layout';
import { getInitialData, Link } from 'ice';
import RightContent from './rightContent';
const loopMenuItem = (menus) =>
  menus &&
  menus.map(({ name, children, url }) => {
    return {
      path: url,
      key: url,
      name,
      icon: menuConfig[name] && createElement(menuConfig[name]),
      children: children && loopMenuItem(children),
    };
  });

export default function BasicLayout({ children, history }) {
  const initialData = getInitialData();
  const { menuList } = initialData;
  return (
    <ProLayout
      title="管理平台"
      style={{
        minHeight: '100vh',
      }}
      location={{
        pathname: history.location.pathname,
      }}
      menuDataRender={() => loopMenuItem(menuList)}
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
