import { useRef, useState } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { getSysModuleList, addOrUpdateSysModule, deleteSysModule } from '../services';
import { Link } from 'ice';
import { message, Popconfirm } from 'antd';

interface tableItem {
  id: number;
  status: string;
  moduleName: string;
  isCreate?: boolean;
}
const linkRender = (t: string, r: tableItem) => (
  <Link
    key="link"
    to={{
      pathname: `/system/auth/${r.id}`,
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
    formItemProps: () => {
      return {
        rules: [{ required: true, message: '此项为必填项' }],
      };
    },
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
    title: '操作',
    valueType: 'option',
    dataIndex: 'option',
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
      <Popconfirm
        key="delete"
        title="是否删除此模块?"
        onConfirm={async () => {
          await deleteSysModule({ id: record.id });
          action?.reset && action?.reset();
        }}
        okText="是"
        cancelText="否"
      >
        <a>删除</a>
      </Popconfirm>,
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
      recordCreatorProps={{
        record: () => ({
          id: Date.now(),
          moduleName: '',
          status: '1',
          isCreate: true,
        }),
        creatorButtonText: '新增模块',
      }}
      request={async (params) => {
        const { moduleName } = params;
        const data = await getSysModuleList({ moduleName });
        return {
          data,
          success: true,
        };
      }}
      editable={{
        editableKeys,
        onSave: async (key, record) => {
          const { moduleName, status, isCreate, id } = record;
          const msg = isCreate ? '新增' : '编辑';
          if (isCreate) {
            await addOrUpdateSysModule({ moduleName, status });
            actionRef.current?.reset && actionRef.current?.reset();
          } else {
            await addOrUpdateSysModule({ id, moduleName, status });
            actionRef.current?.reload();
          }
          message.success(`${msg}成功`);
        },
        onChange: setEditableRowKeys,
        actionRender: (row, config, dom) => [dom.save, dom.cancel],
      }}
      search={{
        labelWidth: 'auto',
      }}
      rowKey={(r) => r.id}
      pagination={false}
      options={false}
      headerTitle="权限管理"
    />
  );
};
