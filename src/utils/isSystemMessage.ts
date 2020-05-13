import { CustomPayload } from '../Components/Message/MessageType/interface';

const systemDate = ['group_create'];
const isSystemMessage = ({ data }: CustomPayload) => systemDate.includes(data);

export default isSystemMessage;
