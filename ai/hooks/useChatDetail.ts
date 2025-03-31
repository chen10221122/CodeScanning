import { message } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
import { get } from 'lodash';

import { getDialogDetail } from '@/apis/ai';
import { useHistory } from '@/utils/router';

import { QUESTION_TYPE } from '../types';
import { jsonParse } from '../utils';
import { IHistoryItem } from './useHistoryList';

export const useChatDetail = ({ chatId, userId }: { chatId: string; userId: string }) => {
  const { createChat } = useNewChat();
  const getDetail = useMemoizedFn(async () => {
    const res = await getDialogDetail({
      sessionId: chatId,
      operateType: 'check',
      userId,
    });
    const data = get(res, 'data.data', []);
    const list = data.reduce((pre: any, cur: any, idx: number) => {
      pre.push({
        type: 0,
        id: idx + 'q',
        dom: cur.question,
      });
      if (cur.type === '1') {
        pre.push({
          type: QUESTION_TYPE.COMPANY,
          status: 1,
          id: idx + 'a',
          dom: cur.answer,
          thinkList: [],
          answer: cur.answer,
          feedbackStatus: cur.status,
          msgId: cur.msgId,
        });
      } else {
        const res = jsonParse(cur.answer);
        pre.push({
          type: QUESTION_TYPE.FUNCTION,
          status: 1,
          id: idx + 'a',
          answer: ['', res],
          dom: '',
          thinkList: [],
          feedbackStatus: cur.status,
          msgId: cur.msgId,
        });
      }
      return pre;
    }, []);
    return list;
  });

  const modifyTitle = useMemoizedFn(
    (title: string, setHistoryList: React.Dispatch<React.SetStateAction<IHistoryItem[]>>) => {
      getDialogDetail({
        sessionId: chatId,
        operateType: 'update',
        userId,
        newFirstMsg: title,
      })
        .then((res) => {
          setHistoryList((o: IHistoryItem[]) => {
            const newList = [...o];
            const item = newList.find((o) => o.currentSessionId === chatId);
            if (item) {
              item.dialogFirstMsg = title;
            }
            return newList;
          });

          message.success('修改成功');
        })
        .catch((err) => {
          message.error('修改失败');
        });
    },
  );

  const deleteChat = useMemoizedFn(
    (setHistoryList: React.Dispatch<React.SetStateAction<IHistoryItem[]>>, id?: string) => {
      const sessionId = id || chatId;
      getDialogDetail({
        sessionId,
        operateType: 'delete',
        userId,
      })
        .then((res) => {
          id === chatId && createChat();
          setHistoryList((list) => {
            return list.filter((o) => o.currentSessionId !== sessionId);
          });
          message.success('删除成功');
        })
        .catch((err) => {
          message.error('删除失败');
        });
    },
  );

  return {
    getDetail,
    modifyTitle,
    deleteChat,
  };
};

export const useNewChat = () => {
  const history = useHistory();
  const createChat = useMemoizedFn(() => {
    history.push('/ai');
  });
  return {
    createChat,
  };
};
