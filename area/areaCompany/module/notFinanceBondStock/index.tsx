import { getStockBondList, getStockBondDetailList } from '@/pages/area/areaCompany/api/regionFinancingApi';
import FinanceModuleTemplate from '@/pages/area/areaCompany/components/financeModuleTemplate';
import { getDefaultParam } from '@/pages/area/areaCompany/components/financeModuleTemplate/config';
import useColumns from '@/pages/area/areaCompany/components/financeModuleTemplate/hooks/useColumns';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';

const NotFinanceBondStock = () => {
  return (
    <ModuleWrapper title="债券存量">
      <FinanceModuleTemplate
        title="债券存量"
        listApiFunction={getStockBondList}
        detailListApiFunction={getStockBondDetailList}
        pageType={REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_STOCK}
        moduleType="non_financing_bond_stock_detail"
        defaultCondition={getDefaultParam()}
        useColumnsHook={useColumns}
      />
    </ModuleWrapper>
  );
};

export default NotFinanceBondStock;
