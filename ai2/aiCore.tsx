import { useState, ReactNode, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useHistory } from 'react-router-dom';

import { message } from '@dzh/components';
import { useBoolean, useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import QueryArea from '@pages/ai/components/queryArea';
import { AnswerData, ThinkList, useStreamFetch } from '@pages/ai/hooks/useStreamFetch';

import { postFeedback } from '@/apis/ai';

import Title from './components/answer/title';
import ListRenderer from './components/ListRenderer';
import { useChatDetail } from './hooks/useChatDetail';
import { IHistoryItem } from './hooks/useHistoryList';
import AiMain from './modules/main';
import { FEEDBACK_STATUS, QUESTION_TYPE } from './types';
import { generateMsgId, generateSessionId } from './utils/sessionId';

export type questionType = { type: 0; dom: ReactNode };
export type answerType = {
  type: QUESTION_TYPE;
  status: 0 | 1;
  dom: ReactNode;
  answer: string | string[];
  thinkList: ThinkList[];
  msgId: string;
  feedbackStatus: FEEDBACK_STATUS; // 1 赞 -1 踩
  lastFeedbackStatus?: FEEDBACK_STATUS; // 记录上一次状态
}; //type api接口， status: loading 状态

export const defaultAnswer = {
  type: QUESTION_TYPE.COMPANY,
  status: 0 as 0,
  dom: '',
  answer: '',
  thinkList: [],
  msgId: '',
  feedbackStatus: FEEDBACK_STATUS.NONE,
};
export interface Refs {
  getQuestion: (a: string) => void;
  openFindFunction: () => void;
}

interface Props {
  userId: string;
  chatId: string;
  title: string;
  setHistoryList: React.Dispatch<React.SetStateAction<IHistoryItem[]>>;
}

type Params = {
  msgId: string;
  question: string;
  type?: QUESTION_TYPE;
};

const AiCore = forwardRef<Refs, Props>(({ userId, chatId, title, setHistoryList }, ref) => {
  const sessionIdRef = useRef(generateSessionId());
  const [list, setList] = useState<(questionType | answerType)[]>([]);
  const [isFindFunction, { toggle, setTrue, setFalse }] = useBoolean(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [isLoadingFunction, setIsLoadingFunction] = useState(false);
  const answerIdRef = useRef(0);

  const { fetchStream, loading, handleAbortFetch, data: streamData } = useStreamFetch();
  const listRendererRef = useRef<{ scrollToBottom: () => void }>(null);
  const history = useHistory();
  const run = useMemoizedFn(async (param: Params) => {
    // 处理函数查找模式
    // if (isFindFunction || param.type === QUESTION_TYPE.FUNCTION) {
    //   try {
    //     setIsLoadingFunction(true);
    //     const controller = new AbortController();
    //     handleAbortFetch.current = () => controller.abort();
    //     const result = await getFunctionAnswer(
    //       {
    //         question: param.question,
    //         sessionId: sessionIdRef.current,
    //         userAction: list.length > 2 ? 'chat' : 'new_top',
    //         msgId: param.msgId,
    //       },
    //       {
    //         signal: controller.signal,
    //       },
    //     );
    //     updateListWithFunctionResult(result, param.msgId);
    //     updateHistoryIfNeeded(param.question);
    //   } catch {
    //     handleFunctionError(param.msgId);
    //   } finally {
    //     setIsLoadingFunction(false);
    //   }
    //   // return;
    // }

    // 处理普通对话模式
    try {
      const type =
        isFindFunction || param.type === QUESTION_TYPE.FUNCTION ? QUESTION_TYPE.FUNCTION : QUESTION_TYPE.COMPANY;
      const res = await fetchStream({
        url:
          type === QUESTION_TYPE.FUNCTION
            ? '/finchinaAPP/v1/finchina-discovery/v1/functionAI/getAnswer-stream'
            : '/finchinaAPP/v1/finchina-discovery/v1/companyAI/getAnswer-stream',
        question: param.question,
        sessionId: sessionIdRef.current,
        userAction: list.length > 2 ? 'chat' : 'new_top',
        msgId: generateMsgId(),
        type,
        isOnline,
      });
      if (type === QUESTION_TYPE.FUNCTION) {
        updateListWithFunctionResult(res as AnswerData);
      } else {
        updateListWithStreamResult(res);
      }
      updateHistoryIfNeeded(param.question);
      handleFinishState();
    } catch {
      handleStreamError(param.msgId);
    }
  });

  const updateListWithFunctionResult = (result: AnswerData) => {
    setList((list) => [
      ...list,
      {
        type: QUESTION_TYPE.FUNCTION,
        msgId: result.msgId,
        dom: '',
        status: 0,
        thinkList: [],
        answer: result.answer,
        feedbackStatus: FEEDBACK_STATUS.NONE,
      },
    ]);
  };

  const updateListWithStreamResult = (res: any) => {
    setList((list) => [
      ...list,
      {
        type: QUESTION_TYPE.COMPANY,
        status: 1,
        msgId: res.msgId,
        dom: res.answer,
        thinkList: res.thinkList,
        answer: res.answer,
        feedbackStatus: FEEDBACK_STATUS.NONE,
      },
    ]);
  };

  const updateHistoryIfNeeded = (question: string) => {
    if (!chatId) {
      setHistoryList((list) => [{ currentSessionId: sessionIdRef.current, dialogFirstMsg: question }, ...list]);
      history.push(`/ai#id=${sessionIdRef.current}`);
    }
  };

  const handleFinishState = () => {
    setIsFinish(true);
    setTimeout(() => setIsFinish(false), 10000);
  };

  const handleStreamError = (msgId: string) => {
    setList((list) => [
      ...list,
      {
        type: QUESTION_TYPE.COMPANY,
        status: 1,
        msgId,
        dom: '接口异常，请求失败',
        thinkList: [],
        answer: '接口异常，请求失败',
        feedbackStatus: FEEDBACK_STATUS.NONE,
      },
    ]);
  };
  const { getDetail, modifyTitle, deleteChat } = useChatDetail({ chatId, userId });

  useEffect(() => {
    if (sessionIdRef.current === chatId) {
      return;
    }

    if (chatId) {
      sessionIdRef.current = chatId;
      getDetail()
        .then((list) => {
          if (sessionIdRef.current === chatId) {
            setList(list);
            listRendererRef.current?.scrollToBottom();
            const lastItem = list[list.length - 1];
            if (lastItem?.type === QUESTION_TYPE.FUNCTION) {
              setTrue();
            } else {
              setFalse();
            }
          }
        })
        .catch((err) => {
          setList([]);
          message.error('获取对话详情失败');
        });
    } else {
      setList([]);
      sessionIdRef.current = generateSessionId();
    }
  }, [chatId, getDetail, setTrue, setFalse, userId]);

  const getQuestion = useMemoizedFn((node: string, type?: QUESTION_TYPE) => {
    answerIdRef.current++;
    setList((o) => [...o, { type: 0, dom: node }]);
    listRendererRef.current?.scrollToBottom();
    run({
      msgId: generateMsgId(),
      question: node,
      type,
    });
  });

  const openFindFunction = useMemoizedFn(() => {
    setTrue();
  });

  useImperativeHandle(ref, () => ({
    getQuestion: getQuestion,
    openFindFunction,
  }));

  const handleStop = useMemoizedFn(() => {
    handleAbortFetch.current();
  });
  const handleReply = useMemoizedFn((msgId: string) => {
    const index = list.findIndex((o) => (o as answerType).msgId === msgId);
    if (index > 0) {
      const item = list[index - 1] as answerType;
      const type = item.type;
      getQuestion(item.dom as string, type);
    }
  });
  const handleModifyTitle = useMemoizedFn((title: string) => {
    modifyTitle(title, setHistoryList);
  });
  const handleDelete = useMemoizedFn(() => {
    deleteChat(setHistoryList, chatId);
  });

  const handleFeedback = useMemoizedFn(
    async (
      question: string,
      answerItem: answerType,
      feedbackStatus: FEEDBACK_STATUS,
      questionType: string,
      feedback: string,
    ) => {
      const res = await postFeedback({
        questionType,
        question,
        feedback,
        answer: answerItem.answer.toString(),
        msgId: answerItem.msgId,
        type: answerItem.type,
        userId,
        status: answerItem.feedbackStatus,
        feedbackFlag: feedbackStatus,
        sessionId: chatId,
      });
      if (res.returncode === 0) {
        message.success('反馈成功');
      } else {
        message.error('反馈失败');
        return false;
      }
      return true;
    },
  );
  // 处理反馈状态
  const handleFeedbackStatus = useMemoizedFn((status: FEEDBACK_STATUS, answerItem: answerType) => {
    answerItem.feedbackStatus = status;
    setList((list) => {
      const newList = [...list];
      const index = newList.findIndex((o) => (o as answerType)?.msgId === answerItem.msgId);
      newList[index] = answerItem;
      return newList;
    });
  });
  const resetLoading = useMemoizedFn(() => {
    handleAbortFetch.current();
    setIsLoadingFunction(false);
  });
  useEffect(() => {
    if (chatId) {
      resetLoading();
    }
  }, [chatId, resetLoading]);
  return (
    <Wrapper>
      {list.length > 0 || chatId ? (
        <div className="list-wrapper">
          {title ? <Title title={title} onModifyTitle={handleModifyTitle} onDelete={handleDelete}></Title> : null}
          <ListRenderer
            ref={listRendererRef}
            list={list}
            isFinish={isFinish}
            loading={loading}
            streamData={streamData}
            handleReply={handleReply}
            handleFeedback={handleFeedback}
            handleFeedbackStatus={handleFeedbackStatus}
            handleStop={handleStop}
            isFindFunction={isFindFunction}
            isLoadingFunction={isLoadingFunction}
          />
          <div className="footer">
            <QueryArea
              getQuestion={getQuestion}
              isFindFunction={isFindFunction}
              toggleApi={toggle}
              loading={loading || isLoadingFunction}
              isOnline={isOnline}
              setIsOnline={setIsOnline}
            />
            <p className="footer-text">
              <span>以上内容均由AI生成, 仅供参考和借鉴，不构成投资建议；数据基于历史，不代表未来趋势</span>
            </p>
          </div>
        </div>
      ) : (
        <AiMain
          getQuestion={getQuestion}
          isFindFunction={isFindFunction}
          toggleApi={toggle}
          isOnline={isOnline}
          setIsOnline={setIsOnline}
        />
      )}
    </Wrapper>
  );
});

export default AiCore;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f9fdff;
  @keyframes loading-frame {
    100% {
      background-size: 120%;
    }
  }

  .list-wrapper {
    margin: 0 auto;
    position: relative;
    height: 100%;
    max-width: 675px;
    .footer {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      .box {
        width: 100%;
        height: 90px;
      }
      .footer-text {
        flex: none;
        font-size: 12px;
        text-align: center;
        color: #bfbfbf;
        line-height: 14px;
        padding: 8px 0;
        height: 20px;
        span {
          transform: scale(${12 / 18});
          transform-origin: center center;
        }
      }
    }
  }
`;
