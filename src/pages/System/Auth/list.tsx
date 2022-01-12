import ProCard from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';
import { useState } from 'react';
import { Tree } from 'antd';
export default function DisturbList() {
  const [responsive, setResponsive] = useState(false);
  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <ProCard title="权限分配" split={responsive ? 'horizontal' : 'vertical'} bordered headerBordered>
        <ProCard title="左侧详情" colSpan="50%">
          <div style={{ height: 360 }}>左侧内容</div>
        </ProCard>
        <ProCard title="流量占用情况">
          <div style={{ height: 360 }}>右侧内容</div>
        </ProCard>
      </ProCard>
    </RcResizeObserver>
  );
}
