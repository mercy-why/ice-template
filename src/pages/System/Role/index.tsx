import { useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getSysRoleList } from '../services';
import { Link } from 'ice';

interface tableItem {
  id: number;
  status: number;
  moduleName: string;
  remark: string;
}
const columns: Array<ProColumns<tableItem>> = [
  {
    title: '权限标识',
    dataIndex: 'roleKey',
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
  },
  {
    title: '角色状态',
    dataIndex: 'status',
    search: false,
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
        key="del"
        onClick={() => {
          action.reload;
        }}
      >
        删除
      </a>,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<tableItem>
      columns={columns}
      actionRef={actionRef}
      request={async (params) => {
        const { data } = await getSysRoleList({
          currentPage: params.current || 1,
          pageSize: params.pageSize || 10,
        });
        return {
          data: data.records,
          total: data.total,
          success: true,
        };
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
      }}
      rowKey="id"
      search={false}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
            };
          }
          return values;
        },
      }}
      dateFormatter="string"
      options={false}
      headerTitle="角色管理"
      pagination={{
        pageSize: 10,
      }}
      toolBarRender={() => [
        <Button key="button" icon={<PlusOutlined />} type="primary">
          新建
        </Button>,
      ]}
    />
  );
};
