import { useEffect, useMemo } from 'react';

import * as ls from 'local-storage';

import { Spin } from '@/components/antd';
import { useSelector } from '@/pages/area/areaF9/context';
import useAreaInfo from '@/pages/area/areaFinancingBoard/hooks/useAreaInfo';

import Row from './components/layout/row';
import ModuleWrapper from './components/moduleWrapper';
import { Provider, useConditionCtx } from './context';
import BankResources from './modules/bankResources';
import BondNetFinancing from './modules/bondNetFinancing';
import BondRepaymentPressure from './modules/bondRepaymentPressure';
import EnterpriseCreditDistribution from './modules/enterpriseCreditDistribution';
import FinancingScale from './modules/financingScale';
import LeaseFinancing from './modules/leaseFinancing';
import ListedCompanyDistribution from './modules/listedCompanyDistribution';
import LoansScale from './modules/loansScale';
import PEVCFinancing from './modules/PEVCFinancing';
import PEVCTOP from './modules/PEVCTOP';
import ReceivableAccountsFinancing from './modules/receivableAccountsFinancing';
import RiskMonitoring from './modules/riskMonitoring';
import StockMarket from './modules/stockMarket';
import TrustFinancing from './modules/trustFinancing';

const AREAFINANCING_BOARD_CODE = 'areafinancing_board_code';

const AreaFinancingBoard = () => {
  return (
    <Provider>
      <Index />
    </Provider>
  );
};

const Index = () => {
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const { county } = useAreaInfo(areaInfo);
  const {
    state: {
      hideModule: {
        // riskMonitoring,
        bondNetFinancing,
        bondRepaymentPressure,
        leaseFinancing,
        receivableAccountsFinancing,
        trustFinancing,
        loansScale,
        stockMarket,
        bankResources,
        enterpriseCreditDistribution,
        listedCompanyDistribution,
        pevcFinancing,
        pevcTop,
      },
      firstLoading: {
        financingScaleLoading,
        riskMonitoringLoading,
        bondNetFinancingLoading,
        bondRepaymentPressureLoading,
        leaseFinancingLoading,
        receivableAccountsFinancingLoading,
        trustFinancingLoading,
      },
    },
  } = useConditionCtx();

  const firstLoading = useMemo(() => {
    return (
      financingScaleLoading ||
      riskMonitoringLoading ||
      bondNetFinancingLoading ||
      bondRepaymentPressureLoading ||
      leaseFinancingLoading ||
      receivableAccountsFinancingLoading ||
      trustFinancingLoading
    );
  }, [
    bondNetFinancingLoading,
    bondRepaymentPressureLoading,
    financingScaleLoading,
    leaseFinancingLoading,
    receivableAccountsFinancingLoading,
    riskMonitoringLoading,
    trustFinancingLoading,
  ]);

  useEffect(() => {
    if (process.env.REACT_APP_TERMINAL_FLAG) {
      if (areaInfo?.regionCode) {
        ls.set(AREAFINANCING_BOARD_CODE, areaInfo.regionCode);
      }
    }

    return () => ls.remove(AREAFINANCING_BOARD_CODE);
  }, [areaInfo?.regionCode]);

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <Spin spinning={firstLoading} type="thunder">
        <ModuleWrapper>
          <Row>
            <FinancingScale county={county} />
            <RiskMonitoring />
          </Row>
          <Row isHide={bondNetFinancing && bondRepaymentPressure}>
            <BondNetFinancing county={county} />
            <BondRepaymentPressure />
          </Row>
          <Row isHide={leaseFinancing && receivableAccountsFinancing && trustFinancing}>
            <LeaseFinancing />
            <ReceivableAccountsFinancing />
            {!trustFinancing ? <TrustFinancing /> : null}
          </Row>
          <Row isHide={loansScale}>
            <LoansScale />
          </Row>
          <Row isHide={bankResources && enterpriseCreditDistribution}>
            <BankResources />
            <EnterpriseCreditDistribution />
          </Row>
          <Row isHide={stockMarket && listedCompanyDistribution}>
            <StockMarket />
            <ListedCompanyDistribution />
          </Row>
          <Row isHide={pevcFinancing && pevcTop}>
            <PEVCFinancing />
            <PEVCTOP />
          </Row>
        </ModuleWrapper>
      </Spin>
    </div>
  );
};

export default AreaFinancingBoard;
