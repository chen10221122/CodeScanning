import { memo, Dispatch, SetStateAction } from 'react';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { Tabs } from '@/components/antd';

import { useConditionCtx } from './context';

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
  containerId,
}: {
  activeKey: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  defaultActiveKey?: string;
  tabConfig: Record<string, any>[];
  destroyInactiveTabPane?: boolean;
  containerId?: string;
}) => {
  const {
    state: { condition },
    update,
  } = useConditionCtx();
  /** tab切换处理
   * */
  const handleTabChange = useMemoizedFn((tabKey) => {
    if (activeKey === tabKey) return;
    setActiveTab(tabKey);
    update((d) => {
      if (condition) {
        const { regionCode, cityCode, countryCode, regionLevel } = condition;
        // 共享地区筛选项选中值
        d.tabFilterCache = Object.assign(d.tabFilterCache, { regionCode, cityCode, countryCode, regionLevel });
      }
    });
  });
  return (
    <TopWrapper id={containerId}>
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
  min-width: auto;
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
