import React, { useRef, useLayoutEffect, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';

import { Avatar } from '@dzh/components';
import styled from 'styled-components';

import { baseColor } from '@/assets/styles';

import { answerType, questionType } from '../aiCore';
import { AnswerData } from '../hooks/useStreamFetch';
import { FEEDBACK_STATUS, QUESTION_TYPE } from '../types';
import Content from './answer/content';
import StopButton from './answer/stopButton';
import Thinking from './answer/thinking';
interface ListRendererProps {
  list: (questionType | answerType)[];
  isFinish: boolean;
  loading: boolean;
  streamData: AnswerData;
  handleReply: (msgId: string) => void;
  handleFeedback: (
    question: string,
    answerItem: answerType,
    feedbackStatus: FEEDBACK_STATUS,
    questionType: string,
    feedback: string,
  ) => Promise<boolean>;
  handleFeedbackStatus: (status: FEEDBACK_STATUS, answerItem: answerType) => void;
  handleStop: () => void;
  isFindFunction: boolean;
  isLoadingFunction: boolean;
}

const ListRenderer = forwardRef<{ scrollToBottom: () => void }, ListRendererProps>(
  (
    {
      list,
      isFinish,
      loading,
      streamData,
      handleReply,
      handleFeedback,
      handleFeedbackStatus,
      handleStop,
      isFindFunction,
      isLoadingFunction,
    },
    ref,
  ) => {
    const scrollDomRef = useRef<HTMLDivElement>(null);
    const isManualScroll = useRef(false);
    const isHandleScrollTrigger = useRef(false);

    const handleScroll = useCallback(() => {
      if (isManualScroll.current) {
        return;
      }

      requestAnimationFrame(() => {
        isHandleScrollTrigger.current = true;
        if (scrollDomRef.current) {
          scrollDomRef.current.scrollTop = 999999;
        }
        requestAnimationFrame(() => {
          isHandleScrollTrigger.current = false;
        });
      });
    }, []);

    useImperativeHandle(ref, () => ({
      scrollToBottom: () => {
        isManualScroll.current = false;
        handleScroll();
      },
    }));

    useLayoutEffect(() => {
      if (scrollDomRef.current) {
        scrollDomRef.current.addEventListener('scroll', () => {
          if (!isHandleScrollTrigger.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollDomRef.current as HTMLDivElement;
            if (Math.abs(scrollHeight - scrollTop - clientHeight) < 1) {
              isManualScroll.current = false;
            } else {
              isManualScroll.current = true;
            }
          }
        });
      }
    }, []);

    useEffect(() => {
      if (streamData?.msgId) {
        handleScroll();
      }
    }, [streamData, handleScroll]);

    useEffect(() => {
      if (!isLoadingFunction) {
        handleScroll();
      }
    }, [isLoadingFunction, handleScroll]);

    return (
      <Wrapper className="scroll" ref={scrollDomRef}>
        <ul className="list">
          {list.map((o, i) => {
            if (o.type === 0) {
              return (
                <li key={i} className="item question">
                  <span className="content" dangerouslySetInnerHTML={{ __html: o.dom as string }}></span>
                  <Avatar src={require('../images/avatar_q.png')} size={36} />
                </li>
              );
            } else {
              return (
                <li key={i} className="item answer">
                  <Avatar src={require('../images/avatar_a.png')} size={36} />
                  <div className="content">
                    {o.thinkList.length > 0 ? (
                      <Thinking list={o.thinkList} isFinish={isFinish && i === list.length - 1} />
                    ) : null}
                    <div className="answer-area">
                      <Content
                        data={o}
                        question={list[i - 1].dom as string}
                        onReply={handleReply}
                        onFeedbackFetch={handleFeedback}
                        onFeedbackStatus={handleFeedbackStatus}
                      >
                        {o.dom}
                      </Content>
                    </div>
                  </div>
                </li>
              );
            }
          })}
          {loading ? (
            <>
              <li key={list.length} className="item answer">
                <Avatar src={require('../images/avatar_a.png')} size={36} />
                <div className="content">
                  <Thinking list={streamData.thinkList} loading={loading} />
                  <div className="answer-area">
                    <Content
                      question=""
                      data={{
                        type: QUESTION_TYPE.COMPANY,
                        status: 0,
                        dom: '',
                        answer: streamData.answer.toString(),
                        thinkList: [],
                        msgId: '',
                        feedbackStatus: FEEDBACK_STATUS.NONE,
                      }}
                      hideFooter={true}
                    >
                      {streamData.answer.toString()}
                    </Content>
                  </div>
                </div>
              </li>
              <StopButton onClick={handleStop} />
            </>
          ) : null}
          {isFindFunction && isLoadingFunction ? <Thinking list={[]} loading={isLoadingFunction} /> : null}
        </ul>
      </Wrapper>
    );
  },
);

export default ListRenderer;
const Wrapper = styled.div`
  flex: auto;
  overflow-y: auto;
  font-size: 14px;
  margin: 0 0 10px;
  width: 660px;
  padding-top: 8px;
  height: calc(100% - 203px);
  &::-webkit-scrollbar {
    width: 8px;
  }
  .list {
    .question {
      justify-content: flex-end;
      .content {
        width: auto;
        background: ${baseColor.primary};
        border-radius: 12px 12px 0 12px;
        padding: 12px 14px;
        color: #fff;
        line-height: 20px;
        ::selection {
          background-color: #5599ff;
          color: #fff;
        }
        b {
          font-weight: normal;
        }
      }
    }
    .answer {
      .content {
        background: #ffffff;
        border-radius: 12px 12px 0px 12px;
        box-shadow: 0px 2px 19px 0px rgba(229, 231, 235, 0.36);
        padding: 12px 16px;
        flex: 1;
      }
    }
    .item {
      width: 100%;
      margin: 0 0 10px;
      line-height: 26px;
      color: #383838;
      overflow: hidden;
      display: flex;
      align-items: top;
      gap: 6px;
      .dzh-avatar {
        margin-top: 4px;
      }
      .info {
        overflow: hidden;
        padding: 0 0 4px;
        div {
          float: left;
          height: 34px;
          line-height: 34px;
          background: rgba(255, 255, 255, 0.86);
          border-radius: 10px;

          i {
            color: ${baseColor.primary};
            font-size: 14px;
            padding: 0 6px 0 12px;
            vertical-align: baseline;

            &:last-of-type {
              padding: 0 12px 0 6px;
              color: #8c8c8c;
              font-size: 12px;
            }
          }
        }
      }

      .loading {
        margin: 8px 0 0;
        width: 40px;
        height: 6px;
        //-webkit-mask: linear-gradient(90deg, #000, 70%, #0000 0) 0/20%;
        -webkit-mask: radial-gradient(circle closest-side, #000 94%, #0000) 0 0/33% 100%;
        background: linear-gradient(${baseColor.primary} 0 0) 0/0% no-repeat #ddd;
        animation: loading-frame 2s infinite steps(4);
      }
    }
  }
`;
