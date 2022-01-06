import React, { useRef, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm from '@ant-design/pro-form';
import { getSysResourceList } from '../services';
import { useParams, getSearchParams, history } from 'ice';
import { Button, notification } from 'antd';

interface DataSourceType {
  id: React.Key;
  resourceUrl: string;
  resourceName: string;
  status: string;
  remark?: string;
}

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const { id } = useParams<{ id: string }>();
  const { moduleName } = getSearchParams();
  const formRef = useRef<ProFormInstance<any>>();
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
      title: '描述',
      dataIndex: 'remark',
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
        <a
          key="delete"
          onClick={() => {
            const tableDataSource = formRef.current?.getFieldValue('table') as DataSourceType[];
            formRef.current?.setFieldsValue({
              table: tableDataSource.filter((item) => item.id !== record.id),
            });
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  return (
    <ProForm<{
      table: DataSourceType[];
    }>
      formRef={formRef}
      className="form-x"
      submitter={{
        render: (props, doms) => {
          return [
            <Button htmlType="button" onClick={history?.goBack} key="edit">
              返回权限列表
            </Button>,
            ...doms,
          ];
        },
      }}
      onFinish={async (values) => {
        console.log(values);

        notification.success({
          message: '提交成功',
        });
      }}
    >
      <EditableProTable<DataSourceType>
        rowKey="id"
        headerTitle={moduleName}
        name="table"
        request={async () => {
          const data = await getSysResourceList({ moduleId: +id });
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
        }}
      />
    </ProForm>
  );
};
