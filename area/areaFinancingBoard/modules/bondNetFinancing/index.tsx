import { useState, useCallback } from 'react';

import { produce } from 'immer';
import { isEmpty } from 'lodash';

import { Empty, Spin } from '@/components/antd';
import { Empty as MyEmpty } from '@/pages/area/areaFinancingBoard/components';
import Tab from '@/pages/area/areaFinancingBoard/components/Tab';
import useTab, { TabType } from '@/pages/area/areaFinancingBoard/components/Tab/useTab';

import { Wrapper, Header, Center } from '../../components/moduleWrapper/styles';
import { useConditionCtx } from '../../context';
import { NoDataEmpty } from '../bondRepaymentPressure';
import Fitter from './components/Fitter';
import LineBar from './modules/graph';
import FinancingTable from './modules/table';
import useBondNetFinancing from './useBondNetFinancing';

//债券净融资
const BondNetFinancing = ({ county }: { county: boolean }) => {
  const { tabConfig, tab, onTabChange } = useTab();
  const {
    state: {
      hideModule: { bondNetFinancing },
    },
  } = useConditionCtx();

  const [renderScreen, setRenderScreen] = useState(true);

  const [condition, setCondition] = useState({
    timeType: '1',
    bondType: '',
  });

  const { data, loading } = useBondNetFinancing(condition);

  const handleReset = useCallback(() => {
    setRenderScreen(false);
    setCondition(
      produce((draft) => {
        draft.timeType = '1';
        draft.bondType = '';
      }),
    );
    requestAnimationFrame(() => {
      setRenderScreen(true);
    });
  }, []);

  return (
    <Wrapper ratio={50} height={234}>
      <Header>
        <div className="wrapper-title">债券净融资</div>
        {!bondNetFinancing ? (
          <Center>
            {renderScreen ? <Fitter setCondition={setCondition} /> : null}
            <Tab {...{ tabConfig, tab, onTabChange }} />
          </Center>
        ) : null}
      </Header>
      <Spin type="square" spinning={loading}>
        {!isEmpty(data) ? (
          <>
            {tab === TabType.GRAPH ? <LineBar data={data} /> : null}
            {tab === TabType.TABLE ? <FinancingTable tableData={data} params={condition} county={county} /> : null}
          </>
        ) : condition.bondType ? (
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

export default BondNetFinancing;
