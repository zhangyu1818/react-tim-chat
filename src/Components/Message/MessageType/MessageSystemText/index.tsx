import React from 'react';
import { MessageInfoProps, MessageProps } from '@/Components/Message';
import { formatConversationDate } from '@/utils/dateFormat';
import classNames from 'classnames';

import './index.less';

interface SystemTextProps {
  children: string;
}

const componentClassName = 'tim-conversation-message';

// 系统消息的头部信息
const SystemMessageInfo = ({ time }: Pick<MessageInfoProps, 'time'>) => (
  <div className={`${componentClassName}-info`}>
    <span className={`${componentClassName}-info-date`}>{formatConversationDate(time)}</span>
  </div>
);

const SystemText = ({ children }: SystemTextProps) => (
  <div className='tim-conversation-message-type-system'>
    <span>{children}</span>
  </div>
);

const SystemMessage: React.FC<{ text: string; time: number }> = ({ time, text }) => (
  <div className={classNames(componentClassName, 'system')}>
    <SystemMessageInfo time={time} />
    <SystemText>{text}</SystemText>
  </div>
);

export default SystemMessage;
