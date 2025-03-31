/** 基础专题页面集成布局 */
import { memo, ReactNode, useMemo } from 'react';

import { Spin, Empty, Icon } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import displaySummery from '@/pages/information/images/displaySummery.svg';
import hideSummery from '@/pages/information/images/hideSummery.svg';
import Msg from '@/pages/report/newResearchReport/components/message';
import { divisionNumber } from '@/utils/format';

interface Children {
  firstLoaded: boolean;
  loading: boolean;
  total: number;
  msg: string;
  count: number;
  error?: boolean;
  hasData?: boolean;
  renderScreen?: boolean;
  showSummary?: boolean;
  showSummaryBtn?: boolean;
  top?: number; //筛选区域吸顶高度
  scrollViewHeight?: string | number;
  onCleanClick?: (() => void) | undefined;
  children: Partial<Record<'screen' | 'search' | 'excel' | 'table', ReactNode>>;
  scrollRef: React.MutableRefObject<HTMLDivElement> | React.MutableRefObject<null>;
  screenRef: React.MutableRefObject<HTMLDivElement> | React.MutableRefObject<null>;
  setShowSummary: React.Dispatch<React.SetStateAction<boolean>>;
}

const Layout = ({
  top,
  error,
  total,
  hasData,
  children,
  loading,
  firstLoaded,
  scrollRef,
  screenRef,
  scrollViewHeight = 500,
  renderScreen = true,
  onCleanClick,
  msg,
  count,
  showSummary,
  showSummaryBtn,
  setShowSummary,
}: Children) => {
  const msgStyle = { top: -15, zIndex: 14 };
  // const scrollViewStyle = useMemo(
  //   () => ({
  //     overflow: !loading ? 'auto' : 'hidden',
  //     height: scrollViewHeight,
  //     paddingRight: '2px',
  //     scrollbarGutter: 'stable',
  //   }),
  //   [loading, scrollViewHeight],
  // );
  const divisionTotal = useMemo(() => {
    const formattedTotal = divisionNumber(total);
    return total >= 1e4 ? `10,000+` : formattedTotal;
  }, [total]);

  /** 摘要展示隐藏 */
  const handleSummaryChange = useMemoizedFn(() => {
    setShowSummary(!showSummary);
  });

  return (
    <PageWrapper top={top}>
      <Spin type="thunder" direction="vertical" tip="加载中" spinning={firstLoaded}>
        {renderScreen ? (
          <div className="select" ref={screenRef}>
            <div className="select-left">
              {children.screen}
              <div className="search">{children.search}</div>
            </div>
            <div className="select-right">
              {showSummaryBtn && hasData ? (
                <div className="flex-right-btn" onClick={handleSummaryChange}>
                  {showSummary ? <Icon image={hideSummery} size={12} /> : <Icon image={displaySummery} size={12} />}
                  {showSummary ? '隐藏' : '显示'}摘要
                </div>
              ) : null}
              <div className="count">
                共<span className="nums">{divisionTotal}</span>条
              </div>
              <div className="export-excel">{children.excel}</div>
            </div>
          </div>
        ) : null}
        <Msg count={count} msg={msg} style={msgStyle} />
        <div className="scroll-wrap">
          <div /* style={scrollViewStyle} */ className="dzh-scrollbar dzh-scrollbar-always-gutter">
            <div ref={scrollRef} />
            {error ? (
              <Empty type={Empty.LOAD_FAIL} />
            ) : !hasData ? (
              <Empty type={Empty.NO_SCREEN_DATA} onCleanClick={onCleanClick} />
            ) : (
              children.table
            )}
          </div>
        </div>
      </Spin>
    </PageWrapper>
  );
};

export default memo(Layout);

export const PageWrapper = styled.div<{ top?: number }>`
  width: 100%;
  position: relative;
  background-color: #ffffff;
  .select {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 30px;
    position: sticky;
    top: ${({ top }) => (top ? top + 'px' : 0)};
    z-index: 10;
    padding-left: 8px;
    background: #ffffff;
    .search {
      margin-left: 24px;
      .topicSearch-wrapper input {
        font-size: 12px !important;
        line-height: 22px;
      }
      .ant-input {
        &::placeholder {
          font-size: 12px !important;
        }
      }
    }
    .select-left,
    .select-right {
      display: flex;
      align-items: center;
    }
    .select-right {
      .export-excel {
        margin-left: 24px;
        position: relative;
      }
      .flex-right-btn {
        i {
          margin-right: 4px;
        }
        font-size: 12px;
        color: #5c5c5c;
        margin-right: 24px;
        cursor: pointer;
      }
      .count {
        font-size: 12px;
        color: #8c8c8c;
        .nums {
          color: #3e3e3e;
          padding: 0 3px;
        }
      }
    }
  }
  .scroll-wrap {
    /* padding: 0 6px 0 20px; */
  }
`;
