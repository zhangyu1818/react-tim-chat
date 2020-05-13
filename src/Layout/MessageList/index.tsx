import React from 'react';
import MessageListHeader from './Header';
import MessageListContent from './Content';

import './index.less';

interface MessageListProps {
  header?: React.ReactNode;
  content?: React.ReactNode;
}

const MessageList = ({ header, content }: MessageListProps) => (
  <div className="tim-message-list">
    <MessageListHeader>{header}</MessageListHeader>
    <MessageListContent>{content}</MessageListContent>
  </div>
);

export default MessageList;
