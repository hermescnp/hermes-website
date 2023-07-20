import React, { memo, ReactNode } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

export type TurboNodeData = {
  title: string;
  icon?: ReactNode;
  subline?: string;
};

export default memo(({ data }: NodeProps<TurboNodeData>) => {
  return (
    <>
      <div className="wrapper gradient">
        <div className="inner">
          <div className="body">
            {data.icon && <div className="icon">{data.icon}</div>}
            <div>
              <div className="title">{data.title}</div>
              {data.subline && <div className="subline">{data.subline}</div>}
            </div>
          </div>
          <Handle type="target" position={Position.Top} />
          <Handle type="source" position={Position.Bottom} />
        </div>
      </div>
    </>
  );
});
