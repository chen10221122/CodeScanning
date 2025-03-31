import { getNetFinancingList, getNetFinancingDetailList } from '@/pages/area/areaCompany/api/regionFinancingApi';
import FinanceModuleTemplate from '@/pages/area/areaCompany/components/financeModuleTemplate';
import { getDefaultParam } from '@/pages/area/areaCompany/components/financeModuleTemplate/config';
import { useFinanceColumns } from '@/pages/area/areaCompany/components/financeModuleTemplate/hooks/useColumns';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';

const FinanceBondNet = () => {
  return (
    <ModuleWrapper title="债券净融资">
      <FinanceModuleTemplate
        title="债券净融资"
        listApiFunction={getNetFinancingList}
        detailListApiFunction={getNetFinancingDetailList}
        pageType={REGIONAL_PAGE.FINANCING_FINANCIAL_NET_FINANCE}
        defaultCondition={getDefaultParam(REGIONAL_PAGE.FINANCING_FINANCIAL_NET_FINANCE)}
        moduleType="financing_bond_net_financing_detail"
        useColumnsHook={useFinanceColumns}
      />
    </ModuleWrapper>
  );
};

export default FinanceBondNet;
