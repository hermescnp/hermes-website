import React, { memo, ReactNode } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

export type TurboGroupData = {
  title: string;
  icon?: ReactNode;
  subline?: string;
};

export default memo(({ data }: NodeProps<TurboGroupData>) => {
  return (
    <>
          <div className="group">
              <div className="title">{data.title}</div>
              {data.subline && <div className="subline">{data.subline}</div>}
          </div>
          <Handle type="target" position={Position.Top} />
          <Handle type="source" position={Position.Bottom} />
    </>
  );
});