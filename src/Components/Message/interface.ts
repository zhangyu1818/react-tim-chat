import { Message, MessageFlow } from '@/store/models/types';
import { TIMMessageType } from '@/TIMSDK';
import { MessagePayloadType } from './MessageType';

export interface MessageInfoProps {
  avatarSrc: string;
  name: string;
  time: number;
}

export interface MessageProps extends Omit<MessageInfoProps, 'time'> {
  message: Message;
}
