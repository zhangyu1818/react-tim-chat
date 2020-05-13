import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import relativeTime from 'dayjs/plugin/relativeTime';
import zh from 'dayjs/locale/zh-cn';

export const messageListDateFormat = 'YYYY/MM/DD';
export const conversationDateFormat = 'YYYY/MM/DD HH:mm:ss';

dayjs.locale(zh);

dayjs.extend(isToday);
dayjs.extend(relativeTime);

// 格式化日期
const formatConversationDate = (unix: number) => {
  const messageTime = dayjs.unix(unix);
  if (messageTime.isBefore(dayjs(), 'year')) return messageTime.format('YYYY年MM月DD日 HH:mm:ss');
  if (messageTime.isBefore(dayjs(), 'day')) return messageTime.format('MM月DD日 HH:mm');
  return messageTime.format('HH:mm');
};

const formatMessageListDate = (unix: number) => {
  const messageTime = dayjs.unix(unix);
  return messageTime.fromNow();
};

export { formatConversationDate, formatMessageListDate };
