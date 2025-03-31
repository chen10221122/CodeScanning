import { useState } from 'react';

import styled from 'styled-components';

import Next from '@pages/area/areaF9/components/next';
import { isCity, isCounty, isProvince } from '@pages/area/areaF9/utils';

import { Spin, Empty } from '@/components/antd';
import BackTop from '@/components/backTop';

import BlueTabWithLoading from './components/blueTabWithLoading';
import { sideMenuMap } from './config';
import { Provider } from './context';
import useAllPageStatus from './hooks/useAllPageStatus';

interface IProps {
  /** 目录树节点key */
  activeKey?: string;
  /** 外部传入节点，区域融资专题引用时传递 */
  children?: any;
}
export const transformRegionCode = (areaCode: string) => {
  let regionCode = '',
    cityCode = '',
    countryCode = '';
  if (isProvince(areaCode)) {
    regionCode = areaCode;
  }
  if (isCity(areaCode)) {
    cityCode = areaCode;
  }
  if (isCounty(areaCode)) {
    countryCode = areaCode;
  }
  return {
    regionCode,
    cityCode,
    countryCode,
  };
};
const CensusAnalyse = ({ activeKey, children }: IProps) => {
  const { loading, error, handleError } = useAllPageStatus();
  const [currentKey] = useState(activeKey || 'scaleTotalAmount');

  const CurrentSubMenu = sideMenuMap.get(currentKey) || null;

  return (
    <LayoutWrapper hide={loading || error} isError={error}>
      <div className="main">
        {loading ? (
          <div className="full-empty-content">
            <Spin type={'thunder'} />
          </div>
        ) : null}

        {!loading && error ? (
          <div className="full-empty-content">
            <Empty type={Empty.FULL_PAGE_LOADED_FAIL} onClick={handleError} />
          </div>
        ) : null}
        {CurrentSubMenu && <CurrentSubMenu />}
      </div>
      {!loading ? <Next /> : null}
      <BackTop
        target={() => (document.querySelector('#areaF9censusAnalyseMountedId') as HTMLElement) || document.body}
      />
    </LayoutWrapper>
  );
};

const CensusAnalysePro = ({ activeKey }: IProps) => (
  <Provider>
    <CensusAnalyse activeKey={activeKey} />
  </Provider>
);
const ScaleStatistic = () => {
  const tabConfig = [
    {
      tabName: '投放总量',
      tabKey: '0',
      tabContent: <CensusAnalysePro activeKey={'scaleTotalAmount'} />,
    },
    {
      tabName: '将到期事件',
      tabKey: '1',
      tabContent: <CensusAnalysePro activeKey={'scaleExpiringEvents'} />,
    },
  ];
  const [activeTab, setActiveTab] = useState('0');
  return (
    <div
      id={'areaF9censusAnalyseMountedId'}
      style={{ display: 'flex', height: '100%', flexDirection: 'column', overflow: 'auto' }}
    >
      <BlueTabWithLoading
        activeKey={activeTab}
        setActiveTab={setActiveTab}
        tabConfig={tabConfig}
        destroyInactiveTabPane={false}
      />
    </div>
  );
};

export default ScaleStatistic;

const LayoutWrapper = styled.div<{ hide: boolean; isError: boolean }>`
  height: 100%;
  width: 100%;
  position: relative;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .full-empty-content {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #fff;
    z-index: 200;
    > div {
      position: absolute;
      left: 50%;
      top: max(calc(40% - ${({ isError }) => (isError ? '165px' : '10px')}), 90px);
      transform: translateX(-50%);
    }
  }

  .divider {
    height: 4px;
    background-color: #f6f6f6;
  }

  .main {
    flex-grow: 1;
    padding: 0 20px;
    .ant-picker-dropdown {
      z-index: 9 !important;
    }
    .ant-picker-cell-end:not(.ant-picker-cell-disabled),
    .ant-picker-cell-start:not(.ant-picker-cell-disabled) {
      color: #141414;
    }
    .ant-empty {
      width: 100%;
      padding: 13vh 0 60px;
      background-color: #ffffff;
      position: relative;

      @media screen and (max-height: 500px) {
        padding: 0 0 60px;
        &::before {
          content: '';
          display: block;
          width: 100%;
          height: 60px;
        }
      }
    }
  }
`;
