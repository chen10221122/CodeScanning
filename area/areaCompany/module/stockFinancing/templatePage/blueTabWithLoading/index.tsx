import { memo, Dispatch, SetStateAction } from 'react';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { Tabs } from '@/components/antd';
const { TabPane } = Tabs;

/**
 * tab变更只复责更新状态【当前激活页面】，
 * 不负责视图切换
 * 抛出tab变化的参数，
 * 逻辑在外部完成
 * 默认激活第一个tab
 */
const Tab = ({
  setActiveTab,
  defaultActiveKey,
  tabConfig,
  activeKey,
  destroyInactiveTabPane = true,
  onTabChange,
}: {
  activeKey: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  defaultActiveKey?: string;
  tabConfig: Record<string, any>[];
  destroyInactiveTabPane?: boolean;
  onTabChange?: any;
}) => {
  /** tab切换处理
   **/
  const handleTabChange = useMemoizedFn((tabKey) => {
    if (activeKey === tabKey) return;
    setActiveTab(tabKey);
    onTabChange?.();
  });
  return (
    <TopWrapper>
      <Tabs
        activeKey={activeKey}
        defaultActiveKey={defaultActiveKey ?? tabConfig[0]?.tabKey}
        size="small"
        onChange={handleTabChange}
        destroyInactiveTabPane={destroyInactiveTabPane}
      >
        {tabConfig.map((tab) => {
          return (
            <TabPane tab={tab.tabName} key={tab.tabKey}>
              {tab.tabContent ?? null}
            </TabPane>
          );
        })}
      </Tabs>
    </TopWrapper>
  );
};

export default memo(Tab);

const TopWrapper = styled.div`
  flex-grow: 1;
  .ant-tabs-top > .ant-tabs-nav::before,
  .ant-tabs-bottom > .ant-tabs-nav::before,
  .ant-tabs-top > div > .ant-tabs-nav::before,
  .ant-tabs-bottom > div > .ant-tabs-nav::before {
    display: none;
  }

  .ant-tabs-top > .ant-tabs-nav .ant-tabs-ink-bar-animated {
    transition: none !important;
  }
  .ant-tabs-content {
    height: 100%;
  }
  /* .ant-tabs-tabpane > div {
    min-height: calc(100% - 43px) !important;
  }*/
  .ant-tabs {
    overflow: visible;
    height: 100%;
    .ant-tabs-nav {
      border-bottom: 1px solid #99c6fc;
      position: sticky;
      top: 0;
      z-index: 9;
      background: #fff;
      padding-top: 10px;
      margin: 0 20px;
      .ant-tabs-nav-wrap {
        .ant-tabs-tab-active {
          background-color: #0171f6 !important;
          > div {
            color: #ffffff !important;
          }
        }
        .ant-tabs-tab {
          background: #f5f6f9;
          border-radius: 2px 2px 0px 0px;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px 16px;
          margin-right: 1px;
          .ant-tabs-tab-btn {
            color: #262626;
            line-height: 20px;
            font-size: 14px;
          }
          &:hover {
            background-color: #f5faff;
          }
        }
      }
    }
  }
`;
