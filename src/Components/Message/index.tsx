import React from 'react';
import { Avatar, Dropdown, Menu } from 'antd';
import classNames from 'classnames';
import { CustomPayload, generatorMessageContent, SystemMessage } from './MessageType';
import { MessageInfoProps, MessageProps } from './interface';
import { MessageFlow } from '@/store/models/types';
import { useRematchDispatch } from '@/store';
import isSystemMessage from '@/utils/isSystemMessage';
import { TIMMessageType } from '@/TIMSDK';
import { formatConversationDate } from '@/utils/dateFormat';
import { testCustomMessage } from '@/utils/IgnoreCustomMessage';
import canRevokeMessage from '@/utils/canRevokeMessage';

import './index.less';

const componentClassName = 'tim-conversation-message';

// 普通消息的头部信息,在普通聊天和群聊会有不同样式
const MessageInfo: React.FC<MessageInfoProps> = ({ name, time, avatarSrc, children }) => {
  const showName = name || '未知';
  return (
    <div className={`${componentClassName}-info`}>
      <Avatar shape='square' size={36} src={avatarSrc}>
        {showName}
      </Avatar>
      <div className={`${componentClassName}-info-content`}>
        <div className={`${componentClassName}-info-wrap`}>
          <h6 className={`${componentClassName}-info-content-name`}>{showName}</h6>
          <span className={`${componentClassName}-info-content-date`}>{formatConversationDate(time)}</span>
        </div>
        {children}
      </div>
    </div>
  );
};

const Message: React.FC<MessageProps> = ({ children, message, ...restProps }) => {
  const dispatch = useRematchDispatch();

  const { flow, type, payload, ID, isRevoked, time, conversationType } = message;

  const messageProps = { ...restProps, time };
  // 撤回消息
  if (isRevoked) return <SystemMessage {...messageProps} text={`${restProps.name}撤回了一条消息`} />;

  // 自定义消息
  if (type === TIMMessageType.MSG_CUSTOM) {
    // 需要忽略的自定义消息
    if (testCustomMessage(payload as CustomPayload)) return null;
    // 系统消息
    if (isSystemMessage(payload as CustomPayload))
      return <SystemMessage {...messageProps} text={payload.extension} />;
  }

  // 其他消息
  const messageNode = (
    <div
      data-message-id={ID}
      className={classNames(componentClassName, {
        // 是否消息来自对方
        others: flow === MessageFlow.in,
        // 是否群聊消息
        group: conversationType === TIMMessageType.CONV_GROUP,
      })}
    >
      <MessageInfo {...messageProps}>{generatorMessageContent(type, payload)}</MessageInfo>
    </div>
  );
  if (flow === MessageFlow.out)
    return (
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item
              disabled={!canRevokeMessage(time)}
              onClick={() => dispatch.tim.setMessageRevoke(message)}
            >
              撤回消息
            </Menu.Item>
          </Menu>
        }
        trigger={['contextMenu']}
      >
        {messageNode}
      </Dropdown>
    );
  return messageNode;
};

export default Message;
export * from './interface';
