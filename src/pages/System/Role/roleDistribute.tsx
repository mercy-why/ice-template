import ProCard from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';
import React, { useState, useEffect } from 'react';
import { Tree, Button, message, Space } from 'antd';
import { getMenuTree, distributeMenus, getSysRoleList, getSysResourceList, distributeInterfaces } from '../services';
import { useRequest, useParams, useHistory } from 'ice';
import { ArrowLeftOutlined } from '@ant-design/icons';

interface menuItem {
  id: number;
  children?: menuItem[];
}

interface interfaceItem {
  id: number;
  moduleName?: string;
  resources?: Array<{
    resourceName: string;
    id: number;
  }>;
}
const loopMenuId = (menuList: menuItem[], arr: number[] = []) => {
  menuList &&
    menuList.forEach((item) => {
      if (!item.children) {
        arr.push(item.id);
      } else {
        loopMenuId(item.children, arr);
      }
    });
  return arr;
};

const loopAllMenuId = (menuList: menuItem[], arr: number[] = []) => {
  menuList &&
    menuList.forEach((item) => {
      arr.push(item.id);
      if (item.children) {
        loopAllMenuId(item.children, arr);
      }
    });
  return arr;
};

const loopInterFaceId = (list: interfaceItem[], arr: number[] = []) => {
  list &&
    list.forEach((item) => {
      if (!item.resources) {
        arr.push(item.id);
      } else {
        loopInterFaceId(item.resources, arr);
      }
    });
  return arr;
};

export default function DisturbList() {
  const history = useHistory();
  const [responsive, setResponsive] = useState(false);
  const [menuKeys, setMenuKeys] = useState<React.Key[]>([]);
  const [saveMenuKeys, setSaveMenuKeys] = useState<React.Key[]>([]);
  const [interfaceKeys, setInterfaceKeys] = useState<React.Key[]>([]);
  const [menuStatus, setMenuStatus] = useState(true);
  const [interfaceStatus, setInterfaceStatus] = useState(true);
  const [interfaceExpendKeys, setInterfaceExpendKeys] = useState<React.Key[]>([]);
  const [menuExpendKeys, setMenuExpendKeys] = useState<React.Key[]>([]);

  const { id } = useParams<{ id: string }>();
  const { data: menuTreeData, loading: menuLoading } = useRequest(getMenuTree, {
    manual: false,
  });
  const { data: interfaceTreeData, loading: interfaceLoading } = useRequest(getSysResourceList, {
    manual: false,
  });
  const { data: roleInfo } = useRequest<{
    currentRoleMenuList: [
      {
        id: number;
      },
    ];
    currentRoleResourceList: [
      {
        id: number;
      },
    ];
  }>(() => getSysRoleList({ id }), {
    manual: false,
  });
  const { loading: setBtnLoading, request: SetMenuReq } = useRequest(distributeMenus);
  const onCheck = (checkedKeys: React.Key[], info: any) => {
    setMenuKeys([...checkedKeys]);
    setSaveMenuKeys([...checkedKeys, ...info.halfCheckedKeys]);
    setMenuStatus(false);
  };
  const onInterFaceCheck = (checkedKeys: React.Key[]) => {
    setInterfaceKeys([...checkedKeys]);
    setInterfaceStatus(false);
  };
  const saveMenu = async () => {
    const params = saveMenuKeys.map((x) => ({
      roleId: id,
      menuId: x,
    }));
    await SetMenuReq({
      roleMenuList: params,
      roleId: id,
    });
    message.success('菜单权限分配成功');
    setMenuStatus(true);
  };
  const saveInterface = async () => {
    const params = interfaceKeys
      .filter((value) => typeof value === 'number' && !isNaN(value))
      .map((x) => ({
        roleId: id,
        resourceId: x,
      }));
    await distributeInterfaces({
      roleResourceList: params,
      roleId: id,
    });
    message.success('接口权限分配成功');
    setInterfaceStatus(true);
  };
  const chooseAll = () => {
    const keys = menuTreeData.map((x) => x.id);
    setMenuKeys(keys);
    setSaveMenuKeys(loopAllMenuId(menuTreeData));
    setMenuStatus(false);
  };
  const chooseAllInterface = () => {
    const keys = loopInterFaceId(interfaceTreeData);
    setInterfaceKeys(keys);
    setInterfaceStatus(false);
  };

  const expendAllInterface = () => {
    if (interfaceExpendKeys.length === 0) {
      setInterfaceExpendKeys(interfaceTreeData.map((x) => `_${x.id}`));
    } else {
      setInterfaceExpendKeys([]);
    }
  };
  const expendAllMenu = () => {
    if (menuExpendKeys.length === 0) {
      setMenuExpendKeys(menuTreeData.map((x) => x.id));
    } else {
      setMenuExpendKeys([]);
    }
  };

  useEffect(() => {
    if (roleInfo) {
      const { currentRoleMenuList, currentRoleResourceList } = roleInfo;
      const ids = loopMenuId(currentRoleMenuList);
      const urlId = currentRoleResourceList.map((x) => x.id);
      setMenuKeys(ids);
      setInterfaceKeys(urlId);
    }
  }, [roleInfo]);
  return (
    <RcResizeObserver
      key="main-card"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <ProCard
        title={
          <span onClick={history.goBack} className="c-title-x">
            <ArrowLeftOutlined />
            <span className="c-title">权限分配</span>
          </span>
        }
        split={responsive ? 'horizontal' : 'vertical'}
        bordered
        headerBordered
        className="main-card"
        loading={menuLoading}
      >
        <ProCard
          title="菜单权限"
          extra={
            <Space size={20}>
              <a onClick={expendAllMenu}>{`${menuExpendKeys.length === 0 ? '展开' : '收起'}全部`}</a>
              <a onClick={chooseAll}>全选</a>
              <Button type="primary" onClick={saveMenu} loading={setBtnLoading} disabled={menuStatus}>
                保存
              </Button>
            </Space>
          }
        >
          <Tree
            checkable
            selectable={false}
            onCheck={onCheck}
            treeData={menuTreeData}
            checkedKeys={menuKeys}
            autoExpandParent
            expandedKeys={menuExpendKeys}
            onExpand={(expandedKeys) => setMenuExpendKeys(expandedKeys)}
            fieldNames={{
              title: 'name',
              key: 'id',
            }}
          />
        </ProCard>
        <ProCard
          title="接口权限"
          loading={interfaceLoading}
          extra={
            <Space size={20}>
              <a onClick={expendAllInterface}>{`${interfaceExpendKeys.length === 0 ? '展开' : '收起'}全部`}</a>
              <a onClick={chooseAllInterface}>全选</a>
              <Button type="primary" onClick={saveInterface} loading={interfaceLoading} disabled={interfaceStatus}>
                保存
              </Button>
            </Space>
          }
        >
          <Tree
            checkable
            selectable={false}
            checkedKeys={interfaceKeys}
            expandedKeys={interfaceExpendKeys}
            onCheck={onInterFaceCheck}
            onExpand={(expandedKeys) => setInterfaceExpendKeys(expandedKeys)}
            treeData={interfaceTreeData?.map((x: interfaceItem) => ({ ...x, id: `_${x.id}` }))}
            fieldNames={{
              key: 'id',
              children: 'resources',
            }}
            titleRender={(nodeData: any) =>
              (nodeData.moduleName ? nodeData.moduleName : `【${nodeData.resourceName}】${nodeData.resourceUrl}`)
            }
          />
        </ProCard>
      </ProCard>
    </RcResizeObserver>
  );
}
