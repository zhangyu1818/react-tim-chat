import React from 'react';
import calcSize from '@/utils/calcSize';

import './index.less';

interface MessageVideoProps {
  src: string;
  width: number;
  height: number;
}

const MessageVideo = ({ src, width, height }: MessageVideoProps) => {
  const [calcWidth, calcHeight] = calcSize(width / height);
  return (
    <div style={{ width: calcWidth, height: calcHeight }} className="tim-conversation-message-type-video">
      <video controls src={src} />
    </div>
  );
};

export default MessageVideo;
