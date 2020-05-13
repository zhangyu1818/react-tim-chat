import React from 'react';
import ConversationHeader from './Header';
import ConversationContent from './Content';
import ConversationInputArea from './Input';
import ConversationPanelAside from './Aside';
import { useRematchSelector } from '@/store';
import { UNSET_ID } from '@/store/models/tim';

import './index.less';

interface ConversationPanelProps {
  header?: React.ReactNode;
  content?: React.ReactNode;
  aside?: React.ReactNode;
  input?: React.ReactNode;
}

const ConversationPanel = ({ header, content, aside, input }: ConversationPanelProps) => {
  const activeConversationID = useRematchSelector(
    ({ tim: { activeConversationID } }) => activeConversationID
  );
  if (activeConversationID === UNSET_ID) return null;
  return (
    <div className='tim-conversation'>
      <ConversationHeader>{header}</ConversationHeader>
      <div className='tim-conversation-panel'>
        <div className='tim-conversation-panel-main'>
          <ConversationContent>{content}</ConversationContent>
          <ConversationInputArea>{input}</ConversationInputArea>
        </div>
        <ConversationPanelAside>{aside}</ConversationPanelAside>
      </div>
    </div>
  );
};

export default ConversationPanel;
