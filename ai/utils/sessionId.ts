import dayjs from 'dayjs';

/**生成sessionId
 * 根据年月日+ 随机数
 */
export const generateSessionId = () => {
  const day = dayjs().format('YYYYMMDDHHmmss');
  const random = Math.random().toString(36).substring(2, 6);
  return `chat_${day}_${random}`;
};

/**
 * 生成messageID
 */
let messageId = 0;
export const generateMsgId = () => {
  const random = (+new Date()).toString(36);
  ++messageId;
  return `msg_${random}_${messageId}`;
};
