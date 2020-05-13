import React from 'react';
import { Popover } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { emojiName, emojiMap, emojiUrl } from '@/utils/emojiMap';

interface EmojiInputProps {
  onClickEmoji: (emoji: string) => void;
}

const EmojiInput = ({ onClickEmoji }: EmojiInputProps) => {
  const emojiPanel = (
    <div className="tim-conversation-emoji-panel">
      {emojiName.map((emoji) => (
        <img
          onClick={() => onClickEmoji(emoji)}
          key={emoji}
          src={emojiUrl + emojiMap[emoji]}
          alt={emoji}
          title={emoji.replace(/^\[(.*)]$/, (_, $1) => $1)}
        />
      ))}
    </div>
  );

  return (
    <Popover
      overlayClassName="tim-conversation-emoji"
      arrowPointAtCenter
      placement="topLeft"
      trigger="click"
      content={emojiPanel}
    >
      <SmileOutlined title="发送表情" tabIndex={-1} />
    </Popover>
  );
};

export default EmojiInput;
