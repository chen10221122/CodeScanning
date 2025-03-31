// 思考步骤
import { useMemo } from 'react';

import { Icon, Timeline } from '@dzh/components';
import { useBoolean } from 'ahooks';
import cn from 'classnames';
import styled from 'styled-components';

import { baseColor } from '@/assets/styles';

import { ThinkList } from '../../hooks/useStreamFetch';
import ThinkIcon from '../../images/svg/think.svg?react';
import { THINK_STEP_STATUS } from '../../types';
export default function Thinking({
  list,
  loading,
  isFinish,
}: {
  list: ThinkList[];
  loading?: boolean;
  isFinish?: boolean;
}) {
  // z测试提交
  const isThink = useMemo(() => list.length > 0 && list[list.length - 1].status === THINK_STEP_STATUS.FINISH, [list]);
  const [showThinking, { toggle }] = useBoolean(false);
  return (
    <Container>
      {loading ? (
        <div className={cn('thinking', isThink && 'thinking-finish')}>
          <ThinkIcon />
          正在思考中
        </div>
      ) : (
        <div className="thinking-title">
          <Icon unicode="&#xe762;" size={12} style={{ marginTop: -8 }} />
          <div>{isFinish ? '回答完成' : '思考步骤'}</div>
          <Icon unicode="&#xe77c;" onClick={toggle} className={cn(showThinking ? 'down-icon' : 'up-icon')} />
        </div>
      )}
      {showThinking || loading ? (
        <div className="thinking-list">
          <Timeline>
            {/* {list.map((it, idx) => {
              return idx === list.length - 1 && !isThink ? (
                <Timeline.Item dot={<div className="loadingCircle" />}>{it.text}</Timeline.Item>
              ) : (
                <Timeline.Item>{it.text}</Timeline.Item>
              );
            })} */}
            {list.map((it, idx) => {
              return <Timeline.Item>{it.text}</Timeline.Item>;
            })}
          </Timeline>
        </div>
      ) : null}
    </Container>
  );
}

const Container = styled.div`
  background: linear-gradient(180deg, #f0f8ff, #f8fcff 100%);
  border-radius: 10px;
  padding: 12px 12px 9px;
  i {
    color: ${baseColor.primary};
    margin: 0 4px;
  }
  .thinking-title {
    display: flex;
    align-items: center;
    margin-bottom: 3px;
    font-weight: 500;
    font-size: 13px;
    color: #262626;
    line-height: 20px;
    .up-icon,
    .down-icon {
      color: #8c8c8c;
      font-size: 12px;
      cursor: pointer;
      margin-top: -2px;
    }
    .up-icon {
      transform: rotate(180deg);
    }
  }
  .thinking {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-left: 3px;
    svg {
      animation: rotate 2s linear infinite;
      margin-right: 4px;
    }
    &.thinking-finish {
      svg {
        animation: none;
      }
    }
    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
  .thinking-list {
    margin-top: 6px;
    margin-left: 7px;
    .ant-timeline-item-tail {
      border-left-color: rgba(0, 108, 255, 0.3);
      margin-top: 1px;
      height: 100%;
      border-left-style: dashed;
      left: 3px;
      transform: translateX(-0.5px);
    }

    .ant-timeline-item-head-blue {
      background: #227fff;
      width: 6px;
      height: 6px;
      border-width: 0px;
      margin-top: -4px;
    }
    .ant-timeline-item {
      display: flex;
      align-items: center;
      padding-bottom: 4px;
    }
    .ant-timeline-item-content {
      margin-top: 0px;
      color: #515151;
      font-size: 12px;
      top: 0;
      margin-left: 16px;
    }
    .ant-timeline-item-last > .ant-timeline-item-content {
      min-height: 0;
    }
    /*
    .ant-timeline-item-head {
      background: none;
    }
    .ant-timeline-item-tail {
      border-left-color: #e7e7e7;
    }
    .ant-timeline-item-content {
      margin-top: 5px;
    }
    .ant-timeline-item-last > .ant-timeline-item-content {
      min-height: 0;
    } */
    .loadingCircle {
      margin: 4px 0 0;
      width: 18px;
      height: 4px;
      //-webkit-mask: linear-gradient(90deg, #000, 70%, #0000 0) 0/20%;
      -webkit-mask: radial-gradient(circle closest-side, #000 94%, #0000) 0 0/33% 100%;
      background: linear-gradient(${baseColor.primary} 0 0) 0/0% no-repeat #ddd;
      animation: loading-frame 2s infinite steps(3);
    }
  }
`;
