import React from 'react';

import './index.less';

interface MessageFileProps {
  name: string;
  fileUrl: string;
}

const MessageFile = ({ name, fileUrl }: MessageFileProps) => (
  <a href={fileUrl} download={name} target="_blank">
    <div>{name}</div>
  </a>
);

export default MessageFile;
