import { useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { getSysModuleList } from '../services';
import { Link } from 'ice';

interface tableItem {
  id: number;
  status: number;
  moduleName: string;
  remark: string;
}
const linkRender = (t: string, r: tableItem) => (
  <Link
    to={{
      pathname: `/system/interface/${r.id}`,
      search: `moduleName=${r.moduleName}模块`,
    }}
  >
    {t}
  </Link>
);
const columns: Array<ProColumns<tableItem>> = [
  {
    title: '权限名称',
    dataIndex: 'moduleName',
    render: linkRender,
  },
  {
    title: '权限状态',
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
    title: '权限描述',
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
      linkRender('分配功能', record),
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
// const expandedRowRender = (data: tableItem) => {
//   return (
//     <ProTable
//       tableStyle={{ paddingLeft: 40 }}
//       columns={[
//         {
//           dataIndex: 'moduleName',
//           search: false,
//           render: linkRender,
//         },
//         {
//           dataIndex: 'status',
//           search: false,
//           valueEnum: {
//             0: {
//               text: '停用',
//               status: 'Error',
//             },
//             1: {
//               text: '正常',
//               status: 'Success',
//             },
//           },
//         },
//         {
//           dataIndex: 'remark',
//           ellipsis: true,
//           search: false,
//         },
//         {
//           title: 'Action',
//           dataIndex: 'operation',
//           key: 'operation',
//           valueType: 'option',
//           render: () => [<a key="Pause">Pause</a>, <a key="Stop">Stop</a>],
//         },
//       ]}
//       headerTitle={false}
//       rowKey="id"
//       search={false}
//       editable={{
//         type: 'multiple',
//       }}
//       showHeader={false}
//       options={false}
//       dataSource={data.childList}
//       pagination={false}
//     />
//   );
// };

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<tableItem>
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
      headerTitle="权限管理"
      // expandable={{ expandedRowRender }}
      toolBarRender={() => [
        <Button key="button" icon={<PlusOutlined />} type="primary">
          新建
        </Button>,
      ]}
    />
  );
};
