import React, { useRef, useState } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { getSysResourceList, addSysResource, updateSysResource, deleteSysResource } from '../services';
import { useParams, getSearchParams, history } from 'ice';
import { message, Popconfirm } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

interface DataSourceType {
  id: React.Key;
  resourceUrl: string;
  resourceName: string;
  status: string;
  isCreate?: boolean;
}

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const { id: moduleId } = useParams<{ id: string }>();
  const { moduleName } = getSearchParams();
  const actionRef = useRef<ActionType>();
  const columns: Array<ProColumns<DataSourceType>> = [
    {
      title: '功能名称',
      dataIndex: 'resourceName',
    },
    {
      title: 'URL',
      dataIndex: 'resourceUrl',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        0: {
          text: '停用',
          status: 'Error',
        },
        1: {
          text: '正常',
          status: 'Success',
        },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="是否删除此模块?"
          onConfirm={async () => {
            await deleteSysResource({ resourceId: record.id, moduleId });
            action?.reload();
          }}
          okText="是"
          cancelText="否"
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <EditableProTable<DataSourceType>
      rowKey={(r) => r.id}
      actionRef={actionRef}
      headerTitle={
        <span className="c-title-x" onClick={history?.goBack}>
          <ArrowLeftOutlined />
          <span className="c-title">{moduleName}</span>
        </span>
      }
      recordCreatorProps={{
        record: {
          id: Date.now(),
          resourceName: '',
          resourceUrl: '',
          status: '1',
          isCreate: true,
        },
      }}
      request={async () => {
        const data = await getSysResourceList({ moduleId });
        return {
          data,
          success: true,
        };
      }}
      columns={columns}
      editable={{
        type: 'multiple',
        editableKeys,
        onChange: setEditableRowKeys,
        onSave: async (key, data) => {
          const { id, resourceName, resourceUrl, status, isCreate } = data;
          const msg = isCreate ? '新增' : '编辑';
          if (isCreate) {
            await addSysResource({
              resourceName,
              resourceUrl,
              moduleId,
              status,
            });
          } else {
            await updateSysResource({
              resourceName,
              resourceUrl,
              moduleId,
              status,
              id,
            });
          }
          message.success(`${msg}成功`);
          actionRef.current?.reload();
        },
      }}
    />
  );
};
