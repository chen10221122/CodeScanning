import { getNetFinancingList, getNetFinancingDetailList } from '@/pages/area/areaCompany/api/regionFinancingApi';
import FinanceModuleTemplate from '@/pages/area/areaCompany/components/financeModuleTemplate';
import { getDefaultParam } from '@/pages/area/areaCompany/components/financeModuleTemplate/config';
import useColumns from '@/pages/area/areaCompany/components/financeModuleTemplate/hooks/useColumns';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';

const NotFinanceBondNet = () => {
  return (
    <ModuleWrapper title="债券净融资">
      <FinanceModuleTemplate
        title="债券净融资"
        listApiFunction={getNetFinancingList}
        detailListApiFunction={getNetFinancingDetailList}
        pageType={REGIONAL_PAGE.FINANCING_NOTFINANCIAL_NET_FINANCE}
        defaultCondition={getDefaultParam()}
        moduleType="non_financing_bond_net_financing_detail"
        useColumnsHook={useColumns}
      />
    </ModuleWrapper>
  );
};

export default NotFinanceBondNet;
