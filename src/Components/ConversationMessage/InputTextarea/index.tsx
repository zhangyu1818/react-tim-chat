import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { useRematchDispatch, useRematchSelector } from '@/store';
import useSendMessage from '@/hooks/useSendMessage';
import { createCustomMessage, createTextMessage } from '../messageCreator';
import { ImageUploadInput, VideoUploadInput, FileUploadInput, EmojiInput } from '../InputOptions';

import './index.less';

const ConversationMessageInputArea = () => {
  const activeConversationID = useRematchSelector(
    ({ tim: { activeConversationID } }) => activeConversationID,
  );
  const dispatch = useRematchDispatch();

  const sendMessageBindID = useSendMessage(dispatch).bind(null, activeConversationID);

  const [textValue, setTextValue] = useState('');
  const textAreaElement = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (textAreaElement.current) textAreaElement.current.focus();
  }, [activeConversationID]);

  const send = () => {
    sendMessageBindID(createTextMessage(textValue));
    setTextValue('');
  };

  return (
    <>
      <header className="tim-conversation-input-area-options">
        <EmojiInput onClickEmoji={(emoji) => setTextValue((prev) => prev + emoji)} />
        <ImageUploadInput sendMessage={sendMessageBindID} />
        <VideoUploadInput sendMessage={sendMessageBindID} />
        <FileUploadInput sendMessage={sendMessageBindID} />
      </header>
      <textarea
        placeholder="请输入消息"
        value={textValue}
        onChange={({ target }) => {
          setTextValue(target.value);
        }}
        onKeyDown={(e) => {
          const { keyCode, shiftKey } = e;
          if (keyCode === 13 && !shiftKey) {
            e.preventDefault();
            send();
          }
        }}
        className={`tim-conversation-input-area-textarea`}
      />
      <Button className={`tim-conversation-input-area-send`} size="small" onClick={send}>
        发送
      </Button>
    </>
  );
};

export default ConversationMessageInputArea;
