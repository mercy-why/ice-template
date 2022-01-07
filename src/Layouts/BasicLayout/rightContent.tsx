import { Dropdown, Avatar, Menu, Space, Modal } from 'antd';
import { useState } from 'react';
import type { MenuInfo } from 'rc-menu/lib/interface';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  DownCircleOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { useHistory, useRequest } from 'ice';
import { CheckCard } from '@ant-design/pro-card';
import { switchRole } from '@/services';
import store from '@/store';

function RightContent() {
  const [userState, userDispatchers] = store.useModel('user');
  const { userInfo } = userState;
  const { nickName, userName, currentRole, roles } = (userInfo as any) || {};
  const [showModal, setVisible] = useState(false);
  const [curRole, setcurRole] = useState(null);
  const history = useHistory();
  const loginOut = async () => {
    // await outLogin();
    const { pathname } = history.location;
    localStorage.clear();
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/login') {
      history.replace({
        pathname: '/login',
        search: JSON.stringify({
          redirect: pathname,
        }),
      });
    }
  };
  const onMenuClick = (event: MenuInfo) => {
    const { key } = event;
    switch (key) {
      case 'logout':
        loginOut();
        break;
      case 'changeRole':
        setVisible(true);
        break;
      default:
        break;
    }
  };
  const { loading: confirmLoading, request } = useRequest(switchRole, {
    onSuccess: (res) => {
      const { jwt } = res.headers;
      localStorage.setItem('jwt', jwt);
      setVisible(false);
      userDispatchers.getUserInfo();
    },
  });
  const handOk = () => {
    if (!curRole || curRole === currentRole?.id) {
      closeModal();
    } else {
      request({
        roleId: curRole,
      });
    }
  };
  const closeModal = () => {
    setTimeout(() => setVisible(false));
  };
  const menuHeaderDropdown = (
    <Menu selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="settings">
        <SettingOutlined />
        <span className="ml10">修改密码</span>
      </Menu.Item>
      {roles?.length > 1 ? (
        <Menu.Item key="changeRole">
          <UserSwitchOutlined />
          <span className="ml10">切换角色</span>
          <Modal
            title="切换角色"
            visible={showModal}
            destroyOnClose
            onCancel={closeModal}
            onOk={handOk}
            confirmLoading={confirmLoading}
          >
            <CheckCard.Group
              size="small"
              onChange={(value) => {
                setcurRole(value);
              }}
              defaultValue={currentRole.id}
            >
              {roles.map((item: { id: number; roleName: string; remark: string }) => (
                <CheckCard key={item.id} title={item.roleName} description={item.remark} value={item.id} />
              ))}
            </CheckCard.Group>
          </Modal>
        </Menu.Item>
      ) : (
        ''
      )}
      <Menu.Divider />
      <Menu.Item key="logout">
        <LogoutOutlined />
        <span className="ml10">退出登录</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menuHeaderDropdown}>
      <Space className="hand">
        <Avatar shape="square" size="small" icon={<UserOutlined />} />
        <span>{nickName || userName}</span>
        <span>({currentRole?.roleName})</span>
        <DownCircleOutlined />
      </Space>
    </Dropdown>
  );
}

export default RightContent;
