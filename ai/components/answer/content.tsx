// 回答内容
import { useEffect, useRef, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { message } from 'antd';
import markdownit from 'markdown-it';
import styled from 'styled-components';

import { answerType } from '../../aiCore';
import { FEEDBACK_STATUS, QUESTION_TYPE } from '../../types';
import IconImage from '../svg';
import Card from './card';
// import CustomService from './customService';
import Feedback from './feedback';
import styles from './styles.module.less';
const md = markdownit();
export default function Content({
  data,
  question,
  children,
  hideFooter = false,
  onReply,
  onFeedbackFetch,
  onFeedbackStatus,
}: {
  data: answerType;
  children: React.ReactNode;
  onReply?: (id: string) => void;
  hideFooter?: boolean;
  question: string;
  onFeedbackFetch?: (
    question: string,
    answerItem: answerType,
    feedbackStatus: FEEDBACK_STATUS,
    questionType: string,
    feedback: string,
  ) => Promise<any>;
  onFeedbackStatus?: (status: FEEDBACK_STATUS, answerItem: answerType) => void;
}) {
  const { type, msgId, feedbackStatus } = data || {};
  const [showFeedback, setShowFeedback] = useState(false);
  const lastFeedbackStatus = useRef<FEEDBACK_STATUS>(feedbackStatus);
  const handleCopy = () => {
    const text = children?.toString() || '';
    navigator.clipboard.writeText(text);
    message.success('复制成功');
  };

  const handleDislike = useMemoizedFn(async () => {
    const status = feedbackStatus === FEEDBACK_STATUS.DISLIKE ? FEEDBACK_STATUS.NONE : FEEDBACK_STATUS.DISLIKE;
    if (status === FEEDBACK_STATUS.NONE) {
      const res = await onFeedbackFetch?.(question, data, status, '', '');
      res && onFeedbackStatus?.(status, data);
      setShowFeedback(false);
    } else {
      lastFeedbackStatus.current = feedbackStatus;
      onFeedbackStatus?.(status, data);
      setShowFeedback(true);
    }
  });
  const handleCloseFeedback = useMemoizedFn((bool: boolean) => {
    setShowFeedback(false);
    if (!bool) {
      onFeedbackStatus?.(lastFeedbackStatus.current, data);
    }
  });
  useEffect(() => {
    if (feedbackStatus !== FEEDBACK_STATUS.DISLIKE) {
      setShowFeedback(false);
    }
  }, [feedbackStatus]);

  const onFeedback = useMemoizedFn(async (questionType: string, feedback: string) => {
    data.feedbackStatus = lastFeedbackStatus.current;
    const res = await onFeedbackFetch?.(question, data, FEEDBACK_STATUS.DISLIKE, questionType, feedback);
    data.feedbackStatus = FEEDBACK_STATUS.DISLIKE;
    res && setShowFeedback(false);
  });

  const handleLike = useMemoizedFn(async () => {
    const status = feedbackStatus === FEEDBACK_STATUS.LIKE ? FEEDBACK_STATUS.NONE : FEEDBACK_STATUS.LIKE;
    const res = await onFeedbackFetch?.(question, data, status, '', '');
    res && onFeedbackStatus?.(status, data);
  });
  return data.answer ? (
    <Container>
      {data.type === QUESTION_TYPE.COMPANY ? (
        <div
          dangerouslySetInnerHTML={{ __html: md.render(children as string) }}
          className={styles['tongyi-markdown']}
        />
      ) : (
        <Card data={data.answer || []} />
      )}

      {/* <CustomService /> */}
      {!hideFooter && (
        <div className="icon-container">
          <div className="icon-container-left">
            <IconImage type="copy" onClick={handleCopy} />
            <IconImage type="reload" onClick={() => msgId && onReply?.(msgId)} />
            <IconImage type="back" />
          </div>
          <div className="icon-container-right">
            <IconImage type="zan" active={feedbackStatus === FEEDBACK_STATUS.LIKE} onClick={handleLike} />
            <IconImage
              type="zan"
              className="turn-icon"
              onClick={handleDislike}
              active={feedbackStatus === FEEDBACK_STATUS.DISLIKE}
            />
          </div>
        </div>
      )}
      {showFeedback && <Feedback onClose={handleCloseFeedback} onFeedback={onFeedback} type={type} />}
    </Container>
  ) : null;
}

const Container = styled.div`
  ::selection {
    background-color: #5599ff;
    color: #fff;
  }
  .icon-container {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    svg {
      cursor: pointer;
    }
  }
  .icon-container-left,
  .icon-container-right {
    display: flex;
    align-items: center;
    > span {
      margin-right: 12px;
    }
    /* gap: 12px; */
  }
  .turn-icon {
    transform: rotate(180deg);
  }
  table {
    tr {
      th:first-child {
        white-space: nowrap;
        vertical-align: top;
      }
    }
  }
`;
