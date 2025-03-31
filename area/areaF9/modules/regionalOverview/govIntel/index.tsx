import { FC, useState, useRef } from 'react';
import KeepAlive from 'react-activation';

import { Tabs } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
import { Tab } from 'rc-tabs/lib/interface';
import styled from 'styled-components';

import { WrapperContainer } from '@pages/area/areaF9/components';

import { LINK_INFORMATION_GOV_WORK_REPORT, LINK_INFORMATION_FIVE_YEAR_PLAN } from '@/configs/routerMap';

import Content from './module';

const Tabskey = {
  /** 政府工作报告 */
  GOV_REPORT: LINK_INFORMATION_GOV_WORK_REPORT,
  /** 五年规划 */
  FIVE_YEAR_PLAN: LINK_INFORMATION_FIVE_YEAR_PLAN,
};

const TabItems: Tab[] = [
  {
    key: Tabskey.GOV_REPORT,
    label: '政府工作报告',
  },
  {
    key: Tabskey.FIVE_YEAR_PLAN,
    label: '五年规划',
  },
];

const GovIntel: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeKey, setActiveKey] = useState(Tabskey.GOV_REPORT);

  const handleTabChange = useMemoizedFn((activeKey: string) => {
    setActiveKey(activeKey);
  });

  return (
    <WrapperContainerWithStyle>
      <WrapperContainer backup isShowHeader={false} containerRef={containerRef}>
        <Tabs
          onChange={handleTabChange}
          type="primary-card"
          size="small"
          animated={false}
          activeKey={activeKey}
          items={TabItems}
        />
        <KeepAlive id={activeKey}>
          <Content tabKey={activeKey} getContainer={() => containerRef.current || document.body} />
        </KeepAlive>
      </WrapperContainer>
    </WrapperContainerWithStyle>
  );
};

export default GovIntel;

const WrapperContainerWithStyle = styled.div`
  height: 100%;
  .main-container {
    scrollbar-gutter: stable;
    .main-content {
      padding: 0 4px 0 16px;
      .ant-tabs {
        position: sticky;
        top: 0;
        border-top: 6px solid #fff;
        background: #fff;
        z-index: 11;
      }
    }
  }
`;
