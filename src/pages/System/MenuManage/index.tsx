import React, { useRef, useState } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { getMenuTree, updateMenu, batchAddMenus, deleteMenus } from '../services';
import { message, Popconfirm } from 'antd';
import { useRequest } from 'ice';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm from '@ant-design/pro-form';

interface DataSourceType {
  key: React.Key;
  id: React.Key;
  url: string;
  name: string;
  icon: string;
  parentId: React.Key;
  children?: DataSourceType[];
  isCreate?: boolean;
}
export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const [editLine, setEditLine] = useState<{ name: string; url: string; icon: string }>({
    name: '',
    url: '',
    icon: '',
  });
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance<any>>();
  const loopMenuId = (list: DataSourceType[], arr: React.Key[] = []) => {
    list &&
      list.forEach((item) => {
        arr.push(item.id);
        if (item.children) {
          loopMenuId(item.children, arr);
        }
      });
    return arr;
  };
  const createItem = () => {
    return {
      parentId: 0,
      name: '',
      url: '',
      icon: '',
      isCreate: true,
      id: Date.now(),
      key: Date.now(),
    };
  };
  const columns: Array<ProColumns<DataSourceType>> = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: 'URL',
      dataIndex: 'url',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '图标',
      dataIndex: 'icon',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record: DataSourceType, _, action) => [
        <a
          key="create"
          onClick={() => {
            action?.addEditRecord(
              {
                ...createItem(),
                parentId: record.id,
              },
              {
                parentKey: record.key,
                newRecordType: 'dataSource',
              },
            );
            setExpandedRowKeys([...editableKeys, record.key]);
          }}
        >
          新增子菜单
        </a>,
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.key);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="是否删除此菜单?"
          onConfirm={async () => {
            const list = record.children ? loopMenuId(record.children) : [];
            list.push(record.id);
            await deleteMenus({ ids: list.join() });
            action?.reload(true);
            message.success('删除成功');
          }}
          okText="是"
          cancelText="否"
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  const { request: updateReq } = useRequest(updateMenu);
  const { request: createReq } = useRequest(batchAddMenus);

  return (
    <ProForm<{
      table: DataSourceType[];
    }>
      formRef={formRef}
      submitter={false}
      className="form-x"
    >
      <EditableProTable<DataSourceType>
        rowKey={(r) => r.key}
        headerTitle="菜单管理"
        actionRef={actionRef}
        name="table"
        expandable={{
          expandedRowKeys,
          onExpand: (expanded, record) => {
            if (expanded) {
              setExpandedRowKeys([...expandedRowKeys, record.key]);
            } else {
              setExpandedRowKeys(expandedRowKeys.filter((x) => x !== record.key));
            }
          },
        }}
        request={async () => {
          const data = await getMenuTree();
          return {
            data,
            success: true,
          };
        }}
        recordCreatorProps={{
          record: createItem,
          creatorButtonText: '新增目录菜单',
        }}
        columns={columns}
        editable={{
          editableKeys,
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.save, defaultDoms.cancel];
          },
          onSave: async (key, data) => {
            const { icon, name, url } = editLine;
            const { isCreate, id, parentId } = data;
            if (isCreate) {
              await createReq({ sysMenuList: [{ icon, name, url, parentId }] });
            } else {
              await updateReq({ icon, id, name, url });
            }
            const msg = isCreate ? '新增' : '编辑';
            message.success(`${msg}成功`);
            actionRef.current?.reload(true);
          },
          onChange: setEditableRowKeys,
          onValuesChange: (record) => {
            setEditLine(record);
          },
        }}
      />
    </ProForm>
  );
};
