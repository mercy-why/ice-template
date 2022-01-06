import { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { getSysModuleList, addSysModule } from '../services';
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
    title: '序号',
    dataIndex: 'index',
    search: false,
  },
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
    width: 250,
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
export default () => {
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  return (
    <EditableProTable<tableItem>
      columns={columns}
      actionRef={actionRef}
      recordCreatorProps={false}
      request={async () => {
        const data = await getSysModuleList();
        return {
          data,
          success: true,
        };
      }}
      editable={{
        editableKeys,
        onSave: async (key, record) => {
          const { moduleName, remark } = record;
          await addSysModule({ moduleName, remark });
        },
        onChange: setEditableRowKeys,
        actionRender: (row, config, dom) => [dom.save, dom.cancel],
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
      }}
      search={{
        labelWidth: 'auto',
      }}
      rowKey="id"
      pagination={false}
      options={false}
      headerTitle="权限管理"
    />
  );
};
