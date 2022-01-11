import React, { useRef, useState } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { getMenuTree, updateMenu, batchAddMenus } from '../services';
import { Button, message } from 'antd';
import { useRequest } from 'ice';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm from '@ant-design/pro-form';

interface DataSourceType {
  id: React.Key;
  url: string;
  name: string;
  icon: string;
  parentId?: React.Key;
  children?: DataSourceType[];
  isCreate?: boolean;
}

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const [dataSource, setDataSource] = useState<DataSourceType[]>(() => []);
  const actionRef = useRef<ActionType>();
  const createItem = () => {
    return {
      parentId: 0,
      name: '',
      url: '',
      icon: '',
      isCreate: true,
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
      render: (text, record, _, action) => [
        <EditableProTable.RecordCreator
          record={{
            ...createItem(),
          }}
          parentKey={record.id}
        >
          <a>新增子菜单</a>
        </EditableProTable.RecordCreator>,
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  const { request: updateReq } = useRequest(updateMenu);
  const { request: createReq } = useRequest(batchAddMenus);

  const saveFn = async () => {
    console.log(dataSource);
    const data = [];
    for (const item of dataSource) {
      const { name, url, icon, isCreate, parentId } = item;
      isCreate &&
        data.push({
          name,
          url,
          icon,
          parentId,
        });
    }
    await createReq({ sysMenuList: data });
    message.success('保存成功');
    actionRef.current?.reload(true);
  };
  return (
    <EditableProTable<DataSourceType>
      rowKey="key"
      expandable={{
        // 使用 request 请求数据时无效
        defaultExpandAllRows: true,
      }}
      controlled
      headerTitle="菜单管理"
      actionRef={actionRef}
      toolBarRender={() => [
        <Button key="button" onClick={saveFn} type="primary">
          保存数据
        </Button>,
      ]}
      name="table"
      request={async () => {
        const data = await getMenuTree();
        return {
          data,
          success: true,
        };
      }}
      recordCreatorProps={{
        record: () => createItem(),
        newRecordType: 'dataSource',
        creatorButtonText: '新增目录菜单',
      }}
      columns={columns}
      value={dataSource}
      onChange={setDataSource}
      editable={{
        type: 'multiple',
        editableKeys,
        actionRender: (row, config, defaultDoms) => {
          const doms = row.isCreate ? [defaultDoms.cancel] : [defaultDoms.save, defaultDoms.cancel];
          return doms;
        },
        onSave: async (key, data) => {
          const { icon, id, name, url } = data;
          await updateReq({ icon, id, name, url });
          message.success('编辑成功');
          actionRef.current?.reload();
        },
        onChange: setEditableRowKeys,
        onValuesChange: (record, list) => {
          setDataSource(list);
        },
      }}
    />
  );
};
