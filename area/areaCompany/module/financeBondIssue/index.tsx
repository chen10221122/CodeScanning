import { getBondIssueList, getBondIssueDetailList } from '@/pages/area/areaCompany/api/regionFinancingApi';
import FinanceModuleTemplate from '@/pages/area/areaCompany/components/financeModuleTemplate';
import { getDefaultParam } from '@/pages/area/areaCompany/components/financeModuleTemplate/config';
import { useFinanceColumns } from '@/pages/area/areaCompany/components/financeModuleTemplate/hooks/useColumns';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';

const FinanceBondIssue = () => {
  return (
    <ModuleWrapper title="债券发行">
      <FinanceModuleTemplate
        title="债券发行"
        listApiFunction={getBondIssueList}
        detailListApiFunction={getBondIssueDetailList}
        pageType={REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_ISSUE}
        defaultCondition={getDefaultParam(REGIONAL_PAGE.FINANCING_FINANCIAL_BOND_ISSUE)}
        moduleType="bond_financing_issue_detail"
        useColumnsHook={useFinanceColumns}
      />
    </ModuleWrapper>
  );
};

export default FinanceBondIssue;
