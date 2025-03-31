import { getIPOListData, IPOListRequestProps } from '@/pages/area/areaCompany/api/regionFinancingApi';
import ModuleTemplate from '@/pages/area/areaCompany/components/moduleTemplate';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { PAGESIZE } from '@/pages/area/areaCompany/const';

import useColumns from './useColumns';

const filterKeyLists = ['enterpriseNature', 'listingPlate', 'text', 'regionCode'];
const DEFAULTCONDITION: IPOListRequestProps = {
  enterpriseNature: '',
  listingPlate: '',
  text: '',
  financingType: 'IPO',
  from: 0,
  // 默认发行日期降序排
  sort: 'issuanceDate:desc',
  size: PAGESIZE,
};

const IPO = () => {
  return (
    <ModuleWrapper title="IPO融资明细">
      <ModuleTemplate
        title="IPO融资明细"
        listApiFunction={getIPOListData}
        pageType={REGIONAL_PAGE.FINANCING_IPO}
        defaultCondition={DEFAULTCONDITION}
        filterKeyLists={filterKeyLists}
        moduleType="regional_financing_IPO"
        useColumnsHook={useColumns}
      />
    </ModuleWrapper>
  );
};

export default IPO;
