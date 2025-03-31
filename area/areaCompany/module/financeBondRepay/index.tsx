import { getBondRepayList, getBondRepayDetailList } from '@/pages/area/areaCompany/api/regionFinancingApi';
import FinanceModuleTemplate from '@/pages/area/areaCompany/components/financeModuleTemplate';
import { getDefaultParam } from '@/pages/area/areaCompany/components/financeModuleTemplate/config';
import { useFinanceColumns } from '@/pages/area/areaCompany/components/financeModuleTemplate/hooks/useColumns';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';

const FinanceBondRepay = () => {
  return (
    <ModuleWrapper title="债券偿还">
      <FinanceModuleTemplate
        title="债券偿还"
        listApiFunction={getBondRepayList}
        detailListApiFunction={getBondRepayDetailList}
        pageType={REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_REPAY}
        defaultCondition={getDefaultParam(REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_REPAY)}
        moduleType="bond_financing_repay_detail"
        useColumnsHook={useFinanceColumns}
      />
    </ModuleWrapper>
  );
};

export default FinanceBondRepay;
