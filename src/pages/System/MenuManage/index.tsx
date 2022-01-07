import React, { useRef, useState } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm from '@ant-design/pro-form';
import { getMenuTree } from '../services';
import { useParams, getSearchParams, history } from 'ice';
import { Button, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
interface DataSourceType {
  id: React.Key;
  url: string;
  name: string;
}

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance<any>>();
  const [dataSource, setDataSource] = useState<DataSourceType[]>(() => []);
  const columns: Array<ProColumns<DataSourceType>> = [
    {
      title: '菜单名称',
      dataIndex: 'name',
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
      onFinish={async (values) => {
        console.log(values);

        notification.success({
          message: '提交成功',
        });
      }}
    >
      <EditableProTable<DataSourceType>
        rowKey="id"
        headerTitle="菜单管理"
        actionRef={actionRef}
        toolBarRender={() => [
          <Button key="button" onClick={() => {}} type="primary">
            保存数据
          </Button>,
        ]}
        name="table"
        request={async () => {
          const { data } = await getMenuTree();
          return {
            data,
            success: true,
          };
        }}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          record: () => ({
            id: Date.now(),
            name: '',
            url: '',
          }),
        }}
        value={dataSource}
        onChange={setDataSource}
        columns={columns}
        editable={{
          type: 'multiple',
          editableKeys,
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.delete];
          },
        //   onValuesChange: (record, recordList) => {
        //     setDataSource(recordList);
        //   },
          onChange: setEditableRowKeys,
        }}
      />
    </ProForm>
  );
};
