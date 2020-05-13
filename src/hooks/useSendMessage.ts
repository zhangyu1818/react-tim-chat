import { useCallback } from 'react';
import { Dispatch } from '../store';

export type CreateMessageFn<MessageType = any> = (
  to: string,
  conversationType: string,
) => Promise<MessageType>;

// sendMessage Hooks
const useSendMessage = <MessageType = any>(dispatch: Dispatch) =>
  useCallback(
    (conversationID, createMessage: (to: string, conversationType: string) => Promise<MessageType>) => {
      const result = conversationID.match(/^(C2C|GROUP)(.+)/);
      if (result) {
        const [, conversationType, to] = result;
        createMessage(to, conversationType).then((message) => {
          dispatch.tim.sendMessage(message);
        });
      }
    },
    [dispatch],
  );

export default useSendMessage;
