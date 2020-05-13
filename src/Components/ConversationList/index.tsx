import React, { useCallback, useMemo } from 'react';
import { Avatar, Menu, Dropdown } from 'antd';
import MessageListItem from './Item';
import { useRematchDispatch, useRematchSelector } from '@/store';
import { TIMMessageType } from '@/TIMSDK';
import { formatMessageListDate } from '@/utils/dateFormat';
import GroupAvatar from '@/Components/GroupAvatar';

import './index.less';

const ConversationList = () => {
  const { conversationList, activeConversationID } = useRematchSelector(
    ({ tim: { conversationList, activeConversationID } }) => ({
      conversationList,
      activeConversationID,
    })
  );

  const dispatch = useRematchDispatch();

  const onMessageItemClick = useCallback((id: string) => dispatch.tim.setActiveConversationID(id), []);

  return (
    <>
      {conversationList.map((item) => {
        const nickName = item.userProfile?.nick;
        const groupName = item.groupProfile?.name;
        const userAvatar = item.userProfile?.avatar;
        const date = formatMessageListDate(item.lastMessage.lastTime);

        const name = nickName || groupName || '未知';

        let avatar = null;

        if (item.type === TIMMessageType.CONV_C2C) {
          avatar = (
            <Avatar
              src={userAvatar}
              size={48}
              shape='square'
              className='tim-message-list-content-item-avatar'
            >
              {userAvatar || name}
            </Avatar>
          );
        } else if (item.type === TIMMessageType.CONV_GROUP) {
          const groupID = item.groupProfile!.groupID;
          avatar = <GroupAvatar groupID={groupID} />;
        }

        return (
          <Dropdown
            key={item.conversationID}
            overlay={
              <Menu>
                <Menu.Item onClick={() => dispatch.tim.deleteConversation(item.conversationID)}>
                  删除会话
                </Menu.Item>
              </Menu>
            }
            trigger={['contextMenu']}
          >
            <div>
              <MessageListItem
                active={activeConversationID === item.conversationID}
                name={name}
                date={date}
                description={item.lastMessage.messageForShow}
                avatar={avatar}
                unreadCount={activeConversationID === item.conversationID ? 0 : item.unreadCount}
                onClick={() => {
                  if (item.conversationID !== activeConversationID) onMessageItemClick(item.conversationID);
                }}
              />
            </div>
          </Dropdown>
        );
      })}
    </>
  );
};

export default ConversationList;
