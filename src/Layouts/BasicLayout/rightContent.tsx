import { Dropdown, Avatar, Menu, Space } from 'antd';
import { useCallback } from 'react';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { getInitialData, useHistory } from 'ice';
function RightContent() {
  const initialData = getInitialData();
  const { userName } = initialData;
  const history = useHistory();
  const loginOut = async () => {
    // await outLogin();
    console.log(history.location);

    const { query = {}, search, pathname } = history.location;
    const { redirect } = query;
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: JSON.stringify({
          redirect: pathname + search,
        }),
      });
    }
  };
  const onMenuClick = useCallback((event: MenuInfo) => {
    const { key } = event;
    if (key === 'logout') {
      loginOut();
      return;
    }
    // history.push(`/account/${key}`);
  }, []);
  const menuHeaderDropdown = (
    <Menu selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="settings">
        <SettingOutlined />
        <span className="ml5">修改密码</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <LogoutOutlined />
        <span className="ml5">退出登录</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menuHeaderDropdown}>
      <Space className="hand">
        <Avatar shape="square" size="small" icon={<UserOutlined />} />
        <span>{userName}</span>
      </Space>
    </Dropdown>
  );
}

export default RightContent;
