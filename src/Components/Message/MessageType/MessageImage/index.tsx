import React from 'react';
import calcSize from '@/utils/calcSize';

import './index.less';

interface ImageMessageProps {
  alt: string;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
  original: {
    url: string;
    width: number;
    height: number;
  };
}

const MessageImage = ({ alt, thumbnail }: ImageMessageProps) => {
  const { width, height, url } = thumbnail;
  const ratio = width / height;
  const [calcWidth, calcHeight] = calcSize(ratio);
  return (
    <div style={{ width: calcWidth, height: calcHeight }} className="tim-conversation-message-type-image">
      <img src={url} alt={alt} />
    </div>
  );
};

export default MessageImage;
