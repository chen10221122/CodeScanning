import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useMemoizedFn } from 'ahooks';

import { IRootState } from '@/store';

import { QUESTION_TYPE, THINK_STEP_STATUS } from '../types';
export interface ThinkList {
  status: string;
  text: string;
}

export interface AnswerData {
  thinkList: ThinkList[];
  msgId: string;
  answer: string | string[];
}

const useStreamFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<AnswerData>({ msgId: '', answer: '', thinkList: [] });
  const cacheData = useRef<AnswerData>({ msgId: '', answer: '', thinkList: [] });
  const handleAbortFetch = useRef<() => void>(() => {});
  const userId = useSelector((store: IRootState) => store.user.info?.basic_info?.user);

  const fetchStream = useMemoizedFn(
    ({
      url,
      question,
      sessionId,
      userAction,
      msgId,
      type,
      isOnline,
    }: {
      url: string;
      question: string;
      sessionId: string;
      userAction: string;
      msgId: string;
      type: QUESTION_TYPE;
      isOnline: boolean;
    }) => {
      return new Promise((resolve, reject) => {
        const fetchData = async () => {
          setLoading(true);
          setError(null);
          setData({ msgId, answer: '', thinkList: [] });
          cacheData.current = { msgId, answer: '', thinkList: [] };
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
              // resolve({ id, answer: '请求超时', thinkList: [] });
              // controller.abort();
            }, 300000); // 30秒超时
            handleAbortFetch.current = () => {
              controller.abort();
              setLoading(false);
              setData({ ...cacheData.current });
              resolve(cacheData.current);
              clearTimeout(timeoutId);
            };
            let outline = '';
            fetchEventSource(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                accept: 'text/event-stream',
                user: userId,
                token: '000000',
              },
              openWhenHidden: true,
              signal: controller.signal,
              body: JSON.stringify({
                question,
                sessionId,
                msgId,
                userAction,
                onlineSearch: Number(isOnline),
              }),
              onmessage: (event) => {
                if (type === QUESTION_TYPE.FUNCTION) {
                  cacheData.current = {
                    ...cacheData.current,
                    msgId,
                    answer: cacheData.current.answer ? cacheData.current.answer.concat(event.data) : [event.data],
                  };
                  setData({ ...cacheData.current });
                  return;
                }

                if (event.data.includes('[DONE]')) {
                  return;
                }
                let status = 'OK';
                let thinkText = '';
                let _it = event.data;
                if (_it) {
                  let res = JSON.parse(_it);
                  thinkText = res.output;
                  if (res?.output && res.status === 'OK') {
                    outline = outline + res?.output;
                    // console.log('接收到的数据为:', outline, res);
                  }
                  status = res.status;
                  if (!status) {
                    console.error('err', _it, event);
                    throw new Error('请求失败');
                  }
                }
                cacheData.current = {
                  ...cacheData.current,
                  thinkList:
                    status !== 'OK'
                      ? [...cacheData.current.thinkList, { status, text: thinkText }]
                      : cacheData.current.thinkList,
                  msgId,
                  answer: outline,
                };
                setData({ ...cacheData.current });
              },
              onerror: (error) => {
                setError(error as Error);
                setLoading(false);
                reject(error);
                handleAbortFetch.current();
                console.error('error', error);
                return 10000000000;
              },
              onclose: () => {
                setLoading(false);
                cacheData.current = {
                  ...cacheData.current,
                  thinkList: [...cacheData.current.thinkList, { status: THINK_STEP_STATUS.FINISH, text: '回答完成' }],
                };
                setData({ ...cacheData.current });
                resolve(cacheData.current);
              },
              // async onopen(response) {
              //   if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
              //     return; // everything's good
              //   } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
              //     // client-side errors are usually non-retriable:
              //     throw new Error('请求失败1');
              //   } else {
              //     handleAbortFetch.current();
              //     throw new Error('请求失败122');
              //   }
              // },
            });
          } catch (err) {
            setError(err as Error);
            setLoading(false);
          }
        };
        fetchData();
      });
    },
  );

  return { fetchStream, loading, error, data, handleAbortFetch };
};

export { useStreamFetch };
