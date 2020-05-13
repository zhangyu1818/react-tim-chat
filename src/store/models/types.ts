import { TIMMessageType } from '@/TIMSDK';
import { MessagePayloadType } from '@/Components/Message/MessageType';

export type ConversationType =
  | TIMMessageType['CONV_C2C']
  | TIMMessageType['CONV_GROUP']
  | TIMMessageType['CONV_SYSTEM'];

export enum MessageFlow {
  in = 'in',
  out = 'out',
}

interface ConversationItem {
  conversationID: string;
  unreadCount: number;
  lastMessage: {
    fromAccount: string;
    lastTime: number;
    messageForShow: string;
  };
  groupProfile?: {
    avatar: string;
    name: string;
    groupID: string;
  };
  userProfile?: {
    avatar: string;
    nick: string;
    userID: string;
  };
  type: ConversationType;
}

export interface Message {
  ID: string;
  avatar: string;
  nick: string;
  flow: MessageFlow;
  conversationID: string;
  conversationType: ConversationType;
  from: string;
  to: string;
  time: number;
  isRevoked: boolean;
  payload: MessagePayloadType;
  type: TIMMessageType[keyof TIMMessageType];
}

interface MessageList {
  list: Message[];
  nextReqMessageID?: string;
  isCompleted: boolean;
}

interface MessageListContainer {
  [conversationID: string]: MessageList | undefined;
}

export interface UserProfile {
  avatar: string;
  nick: string;
  useID: string;
}

export interface GroupProfile {
  groupID: string;
  name: string;
}

export type Profile = (UserProfile & GroupProfile) | null;

export type { ConversationItem, MessageList, MessageListContainer };
