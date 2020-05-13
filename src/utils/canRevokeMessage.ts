import dayjs from 'dayjs';

const canRevokeMessage = (time: number, max: number = 2) => {
  const now = dayjs().unix();
  return (now - time) / 60 < max;
};

export default canRevokeMessage;
