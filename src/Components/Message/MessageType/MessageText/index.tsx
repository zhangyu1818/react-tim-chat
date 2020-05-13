import React, { Fragment } from 'react';
import { emojiMap, emojiName, emojiUrl } from '@/utils/emojiMap';

import './index.less';

interface MessageTextProps {
  children: string;
}

const MessageText = ({ children }: MessageTextProps) => {
  const matchIcon = () =>
    children.split(new RegExp(`(${emojiName.map((name) => `\\${name}`).join('|')})`)).filter(Boolean);

  return (
    <p className="tim-conversation-message-type-text">
      {matchIcon().map((text, index) => (
        <Fragment key={index}>
          {emojiName.includes(text) ? (
            <img
              className="tim-conversation-message-type-text-emoji"
              alt={text}
              src={emojiUrl + emojiMap[text]}
            />
          ) : (
            text
          )}
        </Fragment>
      ))}
    </p>
  );
};

export default MessageText;
