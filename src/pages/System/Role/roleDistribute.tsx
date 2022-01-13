import ProCard from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';
import React, { useState, useEffect } from 'react';
import { Tree, Button, message } from 'antd';
import {
  getMenuTree,
  distributeMenus,
  getSysModuleList,
  getSysRoleList,
  getSysResourceList,
  distributeInterfaces,
} from '../services';
import { useRequest, useParams, useHistory } from 'ice';
import { ArrowLeftOutlined } from '@ant-design/icons';

interface menuItem {
  id: number;
  children?: menuItem[];
}
interface DataNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: DataNode[];
}

const loopMeneId = (menuList: menuItem[], arr: number[] = []) => {
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
function updateTreeData(list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] {
  return list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        checkable: true,
        disableCheckbox: children?.length === 0,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });
}

export default function DisturbList() {
  const history = useHistory();
  const [responsive, setResponsive] = useState(false);
  const [menuKeys, setMenuKeys] = useState<React.Key[]>([]);
  const [saveMenuKeys, setSaveMenuKeys] = useState<React.Key[]>([]);
  const [interfaceKeys, setInterfaceKeys] = useState<React.Key[]>([]);
  const [menuStatus, setMenuStatus] = useState(true);
  const [interfaceStatus, setInterfaceStatus] = useState(true);
  const { id } = useParams<{ id: string }>();
  const [interfaceTreeData, setinterfaceTreeData] = useState<DataNode[]>([]);
  const { data: menuTreeData, loading: menuLoading } = useRequest(getMenuTree, {
    manual: false,
  });
  const { loading: interfaceLoading } = useRequest(getSysModuleList, {
    manual: false,
    onSuccess: (res) => {
      setinterfaceTreeData(
        res.map((x: { moduleName: string; id: number }) => ({
          title: x.moduleName,
          key: `p_${x.id}`,
          checkable: false,
        })),
      );
    },
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
    await SetMenuReq(params);
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
    await distributeInterfaces(params);
    message.success('菜单权限分配成功');
    setInterfaceStatus(true);
  };

  const onLoadData = ({ key, children }: any) =>
    new Promise<void>((resolve) => {
      if (children) {
        resolve();
        return;
      }
      getSysResourceList({ moduleId: key.substring(2) }).then((list) => {
        const data = list.map((x) => ({
          title: `【${x.resourceName}】${x.resourceUrl}`,
          key: x.id,
          isLeaf: true,
        }));
        setinterfaceTreeData((origin) => updateTreeData(origin, key, data));
        resolve();
      });
    });
  useEffect(() => {
    if (roleInfo) {
      const { currentRoleMenuList, currentRoleResourceList } = roleInfo;
      const ids = loopMeneId(currentRoleMenuList);
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
          colSpan="40%"
          extra={
            <Button type="primary" onClick={saveMenu} loading={setBtnLoading} disabled={menuStatus}>
              保存
            </Button>
          }
        >
          <Tree
            checkable
            selectable={false}
            onCheck={onCheck}
            treeData={menuTreeData}
            checkedKeys={menuKeys}
            autoExpandParent
            defaultExpandAll={menuTreeData?.length < 5}
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
            <Button type="primary" onClick={saveInterface} loading={interfaceLoading} disabled={interfaceStatus}>
              保存
            </Button>
          }
        >
          <Tree
            checkable
            selectable={false}
            checkedKeys={interfaceKeys}
            onCheck={onInterFaceCheck}
            treeData={interfaceTreeData}
            loadData={onLoadData}
          />
        </ProCard>
      </ProCard>
    </RcResizeObserver>
  );
}
