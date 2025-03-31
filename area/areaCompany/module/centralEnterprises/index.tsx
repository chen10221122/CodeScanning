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
  'listingOrIssuance',
  'enterpriseNature',
  'establishmentDate',
];
const DEFAULTCONDITION: RegionEnterpriseListParams = {
  text: '',
  from: 0,
  // 默认注册资本降序、企业名称升序
  sort: 'registeredCapital:desc,enterpriseInfo.itName:asc',
  size: PAGESIZE,
  treeNode: '900836',
};

const CentralEnterprises = () => {
  return (
    <ModuleWrapper title="中央企业">
      <ModuleTemplate
        title="中央企业"
        listApiFunction={getRegionEnterpriseList}
        pageType={REGIONAL_PAGE.COMPANY_STATEOWNED}
        defaultCondition={DEFAULTCONDITION}
        filterKeyLists={filterKeyLists}
        moduleType="region_central_enterprise"
        useColumnsHook={useColumns}
      />
    </ModuleWrapper>
  );
};

export default CentralEnterprises;
