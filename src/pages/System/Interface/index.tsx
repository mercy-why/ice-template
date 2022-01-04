import { useRef } from 'react';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Button, Tag, Space, Menu, Dropdown } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { getSysModuleList } from '../services';

interface GithubIssueItem {
  id: number;
  status: number;
  moduleName: string;
  remark: string;
}

const columns: Array<ProColumns<GithubIssueItem>> = [
  {
    title: '模块名称',
    dataIndex: 'moduleName',
    ellipsis: true,
  },
  {
    title: '模块状态',
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
    title: '模块描述',
    dataIndex: 'remark',
    ellipsis: true,
    search: false,
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
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];
const expandedRowRender = (data) => {
  return (
    <ProTable
      columns={[
        {
          dataIndex: 'moduleName',
          ellipsis: true,
          search: false,
        },
        {
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
          dataIndex: 'remark',
          ellipsis: true,
          search: false,
        },
        {
          title: 'Action',
          dataIndex: 'operation',
          key: 'operation',
          valueType: 'option',
          render: () => [<a key="Pause">Pause</a>, <a key="Stop">Stop</a>],
        },
      ]}
      headerTitle={false}
      rowKey="id"
      search={false}
      editable={{
        type: 'multiple',
      }}
      options={false}
      dataSource={data.childList}
      pagination={false}
    />
  );
};

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<GithubIssueItem>
      columns={columns}
      actionRef={actionRef}
      request={async () => {
        const data = await getSysModuleList();
        return {
          data,
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
      pagination={false}
      dateFormatter="string"
      options={false}
      headerTitle="接口管理"
      expandable={{ expandedRowRender }}
      toolBarRender={() => [
        <Button key="button" icon={<PlusOutlined />} type="primary">
          新建
        </Button>,
      ]}
    />
  );
};
