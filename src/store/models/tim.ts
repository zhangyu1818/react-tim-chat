import produce from 'immer';
import getTIM, { TIMMessageType } from '@/TIMSDK';
import { Dispatch, RootState } from '@/store';
import { ConversationItem, Message, MessageList, MessageListContainer, Profile, UserProfile } from './types';

export type TIMState = {
  activeConversationID: string;
  conversationList: ConversationItem[];
  message: MessageListContainer;
  activeProfile: Profile;
  myProfile: UserProfile;
  runningAudioID: string | null;
};

export const UNSET_ID = '@@unsetID';

const initialState: TIMState = {
  myProfile: {} as UserProfile,
  conversationList: [],
  message: {},
  activeProfile: null,
  activeConversationID: UNSET_ID,
  runningAudioID: null,
};

const tim = {
  state: initialState,
  reducers: {
    // 设置当前正在播放的语音id，让动画动起来
    setRunningAudioID(state: TIMState, runningAudioID: string | null) {
      return { ...state, runningAudioID };
    },
    // 更新自己的资料
    setMyProfile(state: TIMState, myProfile: UserProfile) {
      return { ...state, myProfile };
    },
    // 更新当前会话信息
    setActiveProfile(state: TIMState, activeProfile: Profile) {
      return { ...state, activeProfile };
    },
    // 更新聊天列表
    setConversationList(state: TIMState, conversationList: ConversationItem[]) {
      return { ...state, conversationList };
    },
    // 更新选中项
    setActiveConversationID(state: TIMState, activeConversationID: string) {
      const { activeConversationID: prevActiveConversationID } = state;
      if (prevActiveConversationID === activeConversationID) return state;
      return { ...state, activeConversationID };
    },
    // 更新当前聊天分页消息
    setMessageList(state: TIMState, { list, nextReqMessageID, isCompleted }: MessageList) {
      const { activeConversationID } = state;
      const newMessageList = { list, nextReqMessageID, isCompleted };
      return produce(state, (draftState) => {
        draftState.message[activeConversationID] = newMessageList;
      });
    },
    // 标记当前聊天消息已读
    sendMessageRead(state: TIMState, conversationID: string) {
      getTIM().then((tim) => tim.setMessageRead({ conversationID }));
      // 不等待结果返回了，直接设为0
      return produce(state, (draftState) => {
        // 这里不对对象浅复制会导致tim判断未读未0，不清空消息
        draftState.conversationList = draftState.conversationList.map((v) =>
          v.conversationID === conversationID ? { ...v, unreadCount: 0 } : v
        );
      });
    },
    // 新消息提示
    setNewMessage(state: TIMState, newMessage: Message) {
      // 寻找新消息应该放进哪个会话
      const { message } = state;
      const { conversationID } = newMessage;
      const currentMessageList = message[conversationID];
      // 会话未被初始化
      if (!currentMessageList) return state;
      // 对新消息排个序，以免出现因为网络原因时间乱掉
      const nextList = [...currentMessageList.list, newMessage];
      const sortedList = nextList.splice(nextList.length - 10).sort((a, b) => a.time - b.time);
      return produce(state, (draftState) => {
        draftState.message[conversationID]!.list = [...nextList, ...sortedList];
      });
    },
    // 处理撤回消息
    revokeMessage(state: TIMState, revokedMessages: Message[]) {
      const newState = produce(state, (draftState) => {
        revokedMessages.forEach((revokedMessage) => {
          const { conversationID } = revokedMessage;
          if (draftState.message[conversationID])
            draftState.message[conversationID]!.list = draftState.message[
              conversationID
            ]!.list.map((message) => (message.ID === revokedMessage.ID ? revokedMessage : message));
        });
      });
      return newState;
    },
  },
  effects: (dispatch: Dispatch) => ({
    async getConversationList() {
      const timInstance = await getTIM();
      const { data } = await timInstance.getConversationList();
      const { conversationList } = data;
      dispatch.tim.setConversationList(conversationList);
    },
    async getMessageList(
      payload: {
        conversationID: string;
        count?: number;
      },
      state: RootState
    ) {
      // 先通过activeConversationID找出当前的聊天
      const { activeConversationID, message } = state.tim;
      // 取出当前的值,对空值做判断
      const { nextReqMessageID: prevReqMessageID, list: prevList = [] } = message[activeConversationID] ?? {};
      if (payload.conversationID !== UNSET_ID) {
        const timInstance = await getTIM();
        // 获取新的消息
        const { data } = await timInstance.getMessageList({
          ...payload,
          nextReqMessageID: prevReqMessageID,
        });
        const { messageList: list, nextReqMessageID, isCompleted } = data;
        // 合并
        dispatch.tim.setMessageList({
          list: [...list, ...prevList],
          nextReqMessageID,
          isCompleted,
        });
      }
    },
    sendMessage(payload: Message) {
      dispatch.tim.setNewMessage(payload);
      getTIM().then((tim) => {
        tim.sendMessage(payload);
      });
    },
    getConversationProfile(conversationID: string) {
      dispatch.tim.setActiveProfile(null);
      getTIM()
        .then((tim) => tim.getConversationProfile(conversationID))
        .then(({ data }) => {
          const { conversation } = data;
          const { type } = conversation;
          if (type === TIMMessageType.CONV_C2C) {
            dispatch.tim.setActiveProfile(conversation.userProfile);
          } else if (type === TIMMessageType.CONV_GROUP) {
            dispatch.tim.setActiveProfile(conversation.groupProfile);
          }
        });
    },
    getMyProfile() {
      getTIM()
        .then((tim) => tim.getMyProfile())
        .then(({ data }) => {
          dispatch.tim.setMyProfile(data);
        });
    },
    // 删除当前会话
    deleteConversation(conversationID: string, { tim }: RootState) {
      // 当前会话的index
      const deletedItemIndex = tim.conversationList.findIndex((v) => v.conversationID == conversationID);
      if (!~deletedItemIndex) return;
      const deletedItem = tim.conversationList[deletedItemIndex];
      const activeConversationID = tim.activeConversationID;
      const newConversationList = tim.conversationList.filter((v) => v !== deletedItem);
      // 判断删除的是否是打开的会话
      if (activeConversationID === conversationID && activeConversationID !== UNSET_ID) {
        const [prevConversationID, nextConversationID] = [
          tim.conversationList[deletedItemIndex - 1]?.conversationID,
          tim.conversationList[deletedItemIndex + 1]?.conversationID,
        ];
        dispatch.tim.setActiveConversationID(nextConversationID ?? prevConversationID ?? UNSET_ID);
      }
      dispatch.tim.setConversationList(newConversationList);
      getTIM()
        .then((tim) => tim.deleteConversation(conversationID))
        .catch(() => {
          const rollback = [deletedItem!, ...tim.conversationList];
          dispatch.tim.setConversationList(rollback);
        });
    },
    // 撤回消息
    setMessageRevoke(message: Message) {
      getTIM()
        .then((tim) => tim.revokeMessage(message))
        .then(() => {
          dispatch.tim.revokeMessage([{ ...message, isRevoked: true }]);
        });
    },
  }),
};

export default tim;
