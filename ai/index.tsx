import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { DragPageLayout } from '@dzh/pro-components';
import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import AiCore, { Refs } from '@pages/ai/aiCore';
import Tool from '@pages/ai/components/tool';

import History from '@/pages/ai/modules/history';
import { IRootState } from '@/store';
import { getUrlSearches } from '@/utils/url';

import { useHistoryList } from './hooks/useHistoryList';

const AiSide: FC = () => {
  const domRef = useRef<HTMLDivElement>(null);
  const userId = useSelector((store: IRootState) => store.user.info?.basic_info?.user);
  const ref = useRef<Refs>(null);
  const location = useLocation();
  const dragRef = useRef<any>(null);
  const [hideHistory, setHideHistory] = useState(false);
  const { historyList, runHistoryList, setHistoryList, handleSearch, cacheHistoryList } = useHistoryList(userId);
  const chatId = useMemo(() => {
    const params = getUrlSearches(location.hash.slice(1));
    return params.id || '';
  }, [location.hash]);
  const openLeftPanel = useMemoizedFn(() => {
    setHideHistory(false);
    dragRef.current?.onClickWidthBtn(true);
  });
  const getOpenStatus = useMemoizedFn((isOpen: boolean) => {
    setHideHistory(!isOpen);
  });
  useEffect(() => {
    userId && runHistoryList();
  }, [runHistoryList, userId]);
  const title = useMemo(() => {
    return historyList.length
      ? (cacheHistoryList.current.find((o) => o.currentSessionId === chatId)?.dialogFirstMsg as string) || ''
      : '';
  }, [cacheHistoryList, chatId, historyList]);
  return (
    <Outer ref={domRef} hideHistory={hideHistory}>
      <DragPageLayout
        type="rightLeft"
        dragRef={dragRef}
        defaultExpandWidth={false}
        hideWidthBtn={hideHistory}
        pagePaddingTop={0}
        leftNode={
          <History
            getStatus={getOpenStatus}
            userId={userId}
            chatId={chatId}
            historyList={historyList}
            handleSearch={handleSearch}
            setHistoryList={setHistoryList}
          />
        }
        rightNode={<AiCore ref={ref} chatId={chatId} userId={userId} title={title} setHistoryList={setHistoryList} />}
        maxWidth={245}
        startWidth={245}
        hideWidth={true}
      />
      {hideHistory && <Tool openLeftPanel={openLeftPanel} />}
    </Outer>
  );
};

export default AiSide;

const Outer = styled.div<{ hideHistory: boolean }>`
  height: 100%;
  overflow: hidden;
  position: relative;
  .dzh-content-wrapper {
    .dzh-resizable-box {
      ${({ hideHistory }) => (hideHistory ? 'width: 0 !important;' : null)}
    }
  }
  /*
  .inner {
    width: 660px;
    margin: 0 auto;
    height: 100%;
  } */

  /* h1 {
    height: 32px;
    background: url(${require(`./images/h1.png`)}) no-repeat center center / contain;
    margin: 24px;
  } */

  .ant-tabs {
    width: 288px;
    margin: 0 auto 16px;

    .ant-tabs-nav {
      margin-bottom: 0;

      &:before {
        display: none;
      }

      .ant-tabs-nav-wrap {
        background: #fff;
        border-radius: 17px;

        &:before,
        &:after {
          width: 4px;
        }

        .ant-tabs-tab {
          padding: 8px 18px;
          z-index: 9;

          &.ant-tabs-tab-active {
            .ant-tabs-tab-btn {
              color: #fff;

              &:before {
                color: #00ffe6;
              }
            }
          }

          + .ant-tabs-tab {
            margin-left: 4px;
          }

          .ant-tabs-tab-btn {
            color: #83859e;
            font-size: 13px;
            line-height: 18px;
            position: relative;
            padding: 0 0 0 8px;

            &:before {
              content: '·';
              color: transparent;
              position: absolute;
              top: 50%;
              left: -2px;
              transform: translateY(-50%);
            }
          }
        }

        .ant-tabs-ink-bar {
          bottom: 4px;
          height: 26px;
          opacity: 0.91;
          background: linear-gradient(250deg, #31f4ff 0%, #1a6eff);
          border-radius: 13px;
        }
      }
    }
  }

  .grid {
    display: grid;
    height: 220px;
    grid-gap: 8px;
    grid:
      'icon item1 item2'
      'icon item3 item4';
    grid-template-columns: 180px auto auto;

    > div {
      padding: 12px 24px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 22px 6px rgba(0, 0, 0, 0.02);

      &:first-of-type {
        grid-area: icon;
        background: url(${require(`./images/ad.png`)}) no-repeat center center / 100% 100%;
        box-shadow: none;
      }

      &:nth-of-type(2) {
        grid-area: item1;
      }

      &:nth-of-type(3) {
        grid-area: item2;
        dt {
          background-image: url(${require('./images/enterprise.png')});
        }
      }
      &:nth-of-type(4) {
        grid-area: item3;
        dt {
          background-image: url(${require('./images/indicator.png')});
        }
      }
      &:nth-of-type(5) {
        grid-area: item4;
        dt {
          background-image: url(${require('./images/bond.png')});
        }
      }

      dl {
        dt {
          padding: 0 0 0 18px;
          color: #141414;
          line-height: 22px;
          font-size: 16px;
          margin: 0 0 6px;
          background: url(${require('./images/found.png')}) no-repeat left 4px / 12px 12px;

          &.link {
            cursor: pointer;
          }
        }

        dd {
          font-size: 12px;
          color: #a5a5a5;
          line-height: 18px;
        }
      }
    }
  }
`;
