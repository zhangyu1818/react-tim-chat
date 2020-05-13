import { CustomPayload } from '@/Components/Message/MessageType';

const ignoreCustomMessage: string[] = [];

export const testCustomMessage = (payload: CustomPayload) =>
  ignoreCustomMessage.includes(payload.description);

export default ignoreCustomMessage;
