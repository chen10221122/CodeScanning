import { memo, useEffect, useMemo, useState, RefObject, FC } from 'react';

import { Tabs } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import styled from 'styled-components';

import LandDetail from '@pages/area/landTopic/modules/overview/modules/tabsContent/modules/landDetail';
import UnderArea from '@pages/area/landTopic/modules/overview/modules/tabsContent/modules/underArea';
import YearsTransfer from '@pages/area/landTopic/modules/overview/modules/tabsContent/modules/yearsTransfer';
import { useCtx } from '@pages/area/landTopic/modules/overview/provider';

import ExportDoc from '@/components/exportDoc';

const { TabPane } = Tabs;

export enum TabKey {
  LAND_DETAIL = 'land_detail',
  YEARS_TRANSFER = 'years_transfer',
  UNDER_AREA = 'under_area',
}
type TabsContentProps = {
  dragRef: RefObject<any>;
};

const TabsContent: FC<TabsContentProps> = ({ dragRef }) => {
  const {
    state: {
      checkRowArea: { areaLevel, areaCode },
    },
  } = useCtx();
  const [activeKey, setActiveKey] = useState(TabKey.LAND_DETAIL);
  const [condition, setCondition] = useState({});
  const onChange = useMemoizedFn((key) => {
    dragRef?.current?.setExpansionBottom();
    setActiveKey(key);
  });

  const underAreaDisabled = useMemo(() => areaLevel === '3', [areaLevel]);

  useEffect(() => {
    if (underAreaDisabled && activeKey === TabKey.UNDER_AREA) {
      setActiveKey(TabKey.LAND_DETAIL);
    }
  }, [activeKey, underAreaDisabled]);

  const areaCodeObj = useMemo(() => {
    const key = areaLevel === '1' ? 'provinceCode' : areaLevel === '2' ? 'cityCode' : 'countyCode';
    return { [key]: areaCode };
  }, [areaCode, areaLevel]);

  return (
    <Container>
      <MyTabs
        activeKey={activeKey}
        size="small"
        type="card"
        onChange={onChange}
        animated={false}
        tabBarGutter={1}
        tabBarExtraContent={
          activeKey === TabKey.UNDER_AREA ? (
            <ExportDoc
              className="seniorArea"
              condition={condition}
              filename={`招拍挂_土地出让统计_下属辖区_${dayjs().format('YYYYMMDD')}`}
            />
          ) : null
        }
      >
        <TabPane tab="土地明细" key={TabKey.LAND_DETAIL}>
          <LandDetail areaCodeObj={areaCodeObj} />
        </TabPane>
        <TabPane tab="历年出让" key={TabKey.YEARS_TRANSFER}>
          <YearsTransfer areaCodeObj={areaCodeObj} />
        </TabPane>
        <TabPane tab="下属辖区" key={TabKey.UNDER_AREA} disabled={underAreaDisabled}>
          <UnderArea areaCodeObj={areaCodeObj} setCondition={setCondition} />
        </TabPane>
      </MyTabs>
    </Container>
  );
};

export default memo(TabsContent);

const Container = styled.div`
  height: 100%;
  width: 100%;
  padding: 4px 2px 0 10px;
  background: #fff;
  .tab-content-filter {
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 100;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: 16px;
  }
  .tab-screen-label {
    display: inline-block;
    margin-right: 6px;
    color: #5c5c5c;
  }
  th .screen-wrapper {
    display: inline-block;
    margin-left: 16px;
    margin-right: 4px;
  }
  .ant-spin-container {
    height: 100%;
  }
  .tab-table-loading {
    .ant-spin-container {
      overflow: visible !important;
      height: 100%;
    }
    .ant-spin-show-text {
      top: 30% !important;
      z-index: 100 !important;
    }
    .ant-spin-container {
      opacity: 1;
      &,
      &::after {
        transition: none;
      }
    }
    .ant-spin-blur::after {
      opacity: 0.7;
      transition: none;
    }
  }
  .land-detail-loading {
    height: calc(100% - 30px);
    .ant-spin-blur::after {
      height: calc(100% - 30px);
      top: 30px;
    }
  }
  .years-transfer-loading {
    height: calc(100% - 30px);
    .ant-spin-blur::after {
      height: calc(100% - 48px);
      top: 48px;
    }
  }
  .under-area-loading {
    .ant-spin-blur::after {
      height: calc(100% - 60px);
      top: 60px;
    }
  }
`;

const MyTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin-right: 8px !important;
    .ant-tabs-tab {
      transition: none !important;
      padding-left: 10px !important;
      padding-right: 10px !important;
    }
  }
  &,
  .ant-tabs-content-holder,
  .ant-tabs-content,
  .ant-tabs-tabpane {
    height: 100%;
  }

  .ant-tabs-nav::before {
    border-bottom-color: #eee !important;
  }
  .ant-tabs-content-holder {
    padding-bottom: 4px;
  }
  .ant-tabs-extra-content {
    margin-right: 10px;
  }
`;
