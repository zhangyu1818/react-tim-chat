import React from 'react';

import './index.less';

interface TIMAsideProps {
  aside?: React.ReactNode;
}

const TIMAside: React.FC<TIMAsideProps> = ({ aside, children }) => (
  <aside className="tim-aside">
    <div className="tim-aside-left">{aside}</div>
    <div className="tim-aside-right">{children}</div>
  </aside>
);

export default TIMAside;
