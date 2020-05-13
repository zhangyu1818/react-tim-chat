import React from 'react';
import './index.less';

interface UnReadProps {
  style?: React.CSSProperties;
  children: number;
}

const Unread = ({ style, children }: UnReadProps) => {
  const count = children > 999 ? '999+' : children;
  if (count <= 0) return null;
  return (
    <sup className="tim-unread" style={style}>
      {count}
    </sup>
  );
};

export default Unread;
