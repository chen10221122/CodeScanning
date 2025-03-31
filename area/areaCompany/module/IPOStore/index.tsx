import { getIPOStoreListData, IPOStoreListRequestProps } from '@/pages/area/areaCompany/api/regionFinancingApi';
import ModuleTemplate from '@/pages/area/areaCompany/components/moduleTemplate';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { PAGESIZE } from '@/pages/area/areaCompany/const';

import useColumns from './useColumns';

const filterKeyLists = ['enterpriseNature', 'releaseStatus', 'text', 'regionCode'];
const DEFAULTCONDITION: IPOStoreListRequestProps = {
  enterpriseNature: '',
  releaseStatus: '',
  text: '',
  from: 0,
  // 默认发行状态降序 同种状态再按最新公告日期、备案日期降序
  sort: 'releaseStatus:desc,publicationDate:desc,filingDate:desc',
  size: PAGESIZE,
};

const IPO = () => {
  return (
    <ModuleWrapper title="IPO储备">
      <ModuleTemplate
        title="IPO储备"
        listApiFunction={getIPOStoreListData}
        pageType={REGIONAL_PAGE.FINANCING_IPO_RESERVE}
        defaultCondition={DEFAULTCONDITION}
        filterKeyLists={filterKeyLists}
        moduleType="regional_financing_IPO_reserve"
        useColumnsHook={useColumns}
      />
    </ModuleWrapper>
  );
};

export default IPO;
