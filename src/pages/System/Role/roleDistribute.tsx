import ProCard from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';
import React, { useState, useEffect } from 'react';
import { Tree, Button, message } from 'antd';
import { getMenuTree, distributeMenus, getSysModuleList, getSysRoleList } from '../services';
import { useRequest, useParams } from 'ice';

interface menuItem {
  id: number;
  children?: menuItem[];
}
const loopMeneId = (menuList: menuItem[], arr = []) => {
  menuList &&
    menuList.forEach((item) => {
      if (!item.children) {
        arr.push(item.id);
      } else {
        loopMeneId(item.children, arr);
      }
    });
  return arr;
};

export default function DisturbList() {
  const [responsive, setResponsive] = useState(false);
  const [menuKeys, setMenuKeys] = useState<React.Key[]>([]);
  const [defaultKeys, setDefaultMenuKeys] = useState<React.Key[]>([]);
  const { id } = useParams<{ id: string }>();

  const { data: menuTreeData, loading: menuLoading, request: getMenuReq } = useRequest(getMenuTree);
  const { data: interfaceTreeData, loading: interfaceLoading, request: getinterfaceReq } = useRequest(getSysModuleList);
  const { data: roleInfo } = useRequest<{
    currentRoleMenuList: [
      {
        id: number;
      },
    ];
  }>(() => getSysRoleList({ id }), {
    manual: false,
    onSuccess: () => {
      getMenuReq();
      getinterfaceReq();
    },
  });
  const { loading: setBtnLoading, request: SetMenuReq } = useRequest(distributeMenus);
  const onCheck = (checkedKeys: React.Key[], info: any) => {
    setMenuKeys([...checkedKeys, ...info.halfCheckedKeys]);
  };
  const saveMenu = async () => {
    const params = menuKeys.map((x) => ({
      roleId: id,
      menuId: x,
    }));
    await SetMenuReq(params);
    message.success('菜单权限分配成功');
  };

  useEffect(() => {
    if (roleInfo) {
      const { currentRoleMenuList, currentRoleResourceList } = roleInfo;
      const ids = loopMeneId(currentRoleMenuList);
      const urlId = currentRoleResourceList.map((x) => x.id);
      setDefaultMenuKeys(ids);
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
        title="权限分配"
        split={responsive ? 'horizontal' : 'vertical'}
        bordered
        headerBordered
        className="main-card"
        loading={menuLoading}
      >
        <ProCard
          title="菜单权限"
          colSpan="50%"
          extra={
            <Button type="primary" onClick={saveMenu} loading={setBtnLoading} disabled={menuKeys.length === 0}>
              保存
            </Button>
          }
        >
          <Tree
            checkable
            selectable={false}
            onCheck={onCheck}
            treeData={menuTreeData}
            defaultCheckedKeys={defaultKeys}
            autoExpandParent
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
            <Button type="primary" onClick={saveMenu} loading={setBtnLoading} disabled={menuKeys.length === 0}>
              保存
            </Button>
          }
        >
          <Tree
            checkable
            selectable={false}
            onCheck={onCheck}
            treeData={interfaceTreeData}
            // defaultCheckedKeys={interfaceDefaultKeys}
            fieldNames={{
              title: 'moduleName',
              key: 'id',
            }}
          />
        </ProCard>
      </ProCard>
    </RcResizeObserver>
  );
}
