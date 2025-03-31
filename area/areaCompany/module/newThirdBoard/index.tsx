// import { useMemo } from 'react';
import { getListedOrIssuseList } from '@/pages/area/areaCompany/api/regionFinancingApi';
import ModuleTemplate from '@/pages/area/areaCompany/components/moduleTemplate';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
// import { useSelector } from '@/pages/area/areaF9/context';

import { useColumns } from './useColumns';

const filterKeyLists = [
  'enterpriseNature',
  'establishmentDate',
  'industryCodeLevel1',
  'industryCodeLevel2',
  'industryCodeLevel3',
  'industryCodeLevel4',

  'marketLevel',

  'actualControllerRatio',
  'firstShareholderRatio',

  'regionCode',
  'registeredCapital',
  'text',
];

const defaultCdt = {
  from: 0,
  sort: 'registeredCapital:desc,enterpriseInfo.itName:asc',
  size: PAGESIZE,
  treeNode: '900843',
};

const paramsNeedLists = ['enterpriseNature', 'releaseStatus', 'text', 'regionCode', 'treeNode'];

const ListedEnterprise = () => {
  return (
    <ModuleWrapper title="新三板企业">
      <ModuleTemplate
        title="新三板企业"
        listApiFunction={getListedOrIssuseList}
        pageType={REGIONAL_PAGE.COMPANY_LISTED_ENTERPRISE}
        defaultCondition={defaultCdt}
        filterKeyLists={filterKeyLists}
        paramsNeedLists={paramsNeedLists}
        moduleType="region_new_third_board"
        useColumnsHook={useColumns}
      />
    </ModuleWrapper>
  );
};

export default ListedEnterprise;
