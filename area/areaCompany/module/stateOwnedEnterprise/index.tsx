import { getRegionEnterpriseList, RegionEnterpriseListParams } from '@/pages/area/areaCompany/api/regionFinancingApi';
import ModuleTemplate from '@/pages/area/areaCompany/components/moduleTemplate';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { PAGESIZE } from '@/pages/area/areaCompany/const';

import useColumns from './useColumns';

const filterKeyLists = [
  'text',
  'regionCode',
  'industryCodeLevel1',
  'industryCodeLevel2',
  'industryCodeLevel3',
  'industryCodeLevel4',
  'registeredCapital',
  'enterpriseNature',
  'listingOrIssuance',
  'establishmentDate',
  'actualControllerRatio',
  'firstShareholderRatio',
];
const DEFAULTCONDITION: RegionEnterpriseListParams = {
  text: '',
  from: 0,
  // 默认注册资本降序、企业名称升序
  sort: 'registeredCapital:desc,enterpriseInfo.itName:asc',
  size: PAGESIZE,
  treeNode: '900840',
};

const StateOwnedEnterprise = () => {
  return (
    <ModuleWrapper title="国有企业">
      <ModuleTemplate
        title="国有企业"
        listApiFunction={getRegionEnterpriseList}
        pageType={REGIONAL_PAGE.COMPANY_STATEOWNED}
        defaultCondition={DEFAULTCONDITION}
        filterKeyLists={filterKeyLists}
        moduleType="region_nation_owned_enterprise"
        useColumnsHook={useColumns}
      />
    </ModuleWrapper>
  );
};

export default StateOwnedEnterprise;
