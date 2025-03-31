import { useCallback, useState } from 'react';

import { isEmpty } from 'lodash';
import styled from 'styled-components';

import { Empty, Spin } from '@/components/antd';
import { Empty as MyEmpty } from '@/pages/area/areaFinancingBoard/components';
import Tab from '@/pages/area/areaFinancingBoard/components/Tab';
import useTab, { TabType } from '@/pages/area/areaFinancingBoard/components/Tab/useTab';

import { Wrapper, Header, Center } from '../../components/moduleWrapper/styles';
import { useConditionCtx } from '../../context';
import Fitter from './components/Fitter';
import Bar from './modules/graph';
import FinancingTable from './modules/table';
import useBondNetFinancing from './useBondRepaymentPressure';

const BondRepaymentPressure = () => {
  const { tabConfig, tab, onTabChange } = useTab();
  const {
    state: {
      hideModule: { bondRepaymentPressure },
    },
  } = useConditionCtx();

  const [renderScreen, setRenderScreen] = useState(true);

  const [bondType, setBondType] = useState('');

  const { data, loading } = useBondNetFinancing(bondType);

  const handleReset = useCallback(() => {
    setRenderScreen(false);
    setBondType('');
    requestAnimationFrame(() => {
      setRenderScreen(true);
    });
  }, []);

  return (
    <Wrapper ratio={50} height={234}>
      <Header>
        <div className="wrapper-title">债券偿还压力</div>
        {!bondRepaymentPressure ? (
          <Center>
            {renderScreen ? <Fitter setBondType={setBondType} /> : null}
            <Tab {...{ tabConfig, tab, onTabChange }} />
          </Center>
        ) : null}
      </Header>
      <Spin type="square" spinning={loading}>
        {!isEmpty(data) ? (
          <>
            <div style={{ display: tab === TabType.GRAPH ? '' : 'none' }}>
              <Bar data={data} />
            </div>
            <div style={{ display: tab === TabType.TABLE ? '' : 'none' }}>
              <FinancingTable tableData={data} bondType={bondType} />
            </div>
          </>
        ) : bondType ? (
          <NoDataEmpty>
            <Empty type={Empty.NO_DATA_IN_FILTER_CONDITION_SMALL} onClick={handleReset} />
          </NoDataEmpty>
        ) : (
          <MyEmpty />
        )}
      </Spin>
    </Wrapper>
  );
};

export default BondRepaymentPressure;

export const NoDataEmpty = styled.div`
  height: 215px;
  padding-top: 36px;
`;
