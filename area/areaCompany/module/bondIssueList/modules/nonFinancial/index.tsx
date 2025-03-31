import { getBondIssueListData } from '@/pages/area/areaCompany/api/regionFinancingApi';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';

import { BondIssueOrgType, BondIssueModuleCode } from '../../constants';
import FinanceModuleTemplate from '../../template';
import useColumns from './useColumns';

const NotFinanceBondIssue = () => {
  return (
    <ModuleWrapper title="债券发行明细">
      <FinanceModuleTemplate
        title="债券发行明细"
        listApiFunction={getBondIssueListData}
        pageType={REGIONAL_PAGE.FINANCING_NOTFINANCIAL_BOND_ISSUE_LIST}
        defaultCondition={{ orgType: BondIssueOrgType.BOND_ISSUE_LIST_NOT_FINANCE }}
        useColumnsHook={useColumns}
        moduleType="financing_bond_issue_list"
        moduleCode={BondIssueModuleCode.BOND_ISSUE_LIST_NOT_FINANCE}
      />
    </ModuleWrapper>
  );
};

export default NotFinanceBondIssue;
