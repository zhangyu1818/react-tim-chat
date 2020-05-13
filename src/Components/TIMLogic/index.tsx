import { useRematchDispatch, useRematchSelector } from '@/store';
import { useEffect } from 'react';
import getTIM, { TIMEventType } from '../../TIMSDK';
import { Message } from '../../store/models/types';
import { UNSET_ID } from '../../store/models/tim';

const Logic = () => {
  const activeConversationID = useRematchSelector(
    ({ tim: { activeConversationID } }) => activeConversationID,
  );

  const dispatch = useRematchDispatch();

  useEffect(() => {
    dispatch.tim.getConversationList();
    dispatch.tim.getMyProfile();
  }, []);

  useEffect(() => {
    getTIM().then((tim) => {
      // 绑定消息列表更新事件
      tim.on(TIMEventType.CONVERSATION_LIST_UPDATED, ({ data }) => {
        dispatch.tim.setConversationList(data);
      });
      // 绑定消息列表更新事件
      tim.on(TIMEventType.MESSAGE_RECEIVED, ({ data }) => {
        console.log(data);
        data.forEach((newMessage: Message) => dispatch.tim.setNewMessage(newMessage));
      });
      tim.on(TIMEventType.MESSAGE_REVOKED, ({ data }) => {
        dispatch.tim.revokeMessage(data);
      });
      tim.on(TIMEventType.ERROR, (e) => {
        console.warn(e);
      });
      tim.on(TIMEventType.KICKED_OUT, () => {
        console.error('被踢下线');
      });
    });
  }, []);

  useEffect(() => {
    if (activeConversationID !== UNSET_ID) {
      // 当前会话消息已读
      dispatch.tim.sendMessageRead(activeConversationID);
      dispatch.tim.getConversationProfile(activeConversationID);
    }
  }, [activeConversationID]);

  return null;
};

export default Logic;
