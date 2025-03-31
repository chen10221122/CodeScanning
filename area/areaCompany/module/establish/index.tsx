import { useMemoizedFn } from 'ahooks';

import { getNewRegisteredEnterprises, RevokeListParams } from '@/pages/area/areaCompany/api/regionFinancingApi';
import ModuleTemplate, { TemplateKeyEnums } from '@/pages/area/areaCompany/components/moduleTemplate';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { PAGESIZE } from '@/pages/area/areaCompany/const';

import useColumns from './useColumns';

const filterKeyLists = [
  // 'registrationCityCode',
  // 'registrationDistrictCode',
  // 'registrationProvinceCode',
  'regionCode',
  'industryCodeLevel1',
  'industryCodeLevel2',
  'industryCodeLevel3',
  'industryCodeLevel4',
  'businessTypes',
  'registerCapital',
  'organizationalForm',
  'registerDate',
  'hasTelNo',
  'keyWord',
];
const DEFAULTCONDITION: RevokeListParams = {
  pagesize: `${PAGESIZE}`,
  skip: '0',
  sort: 'CR0001_002:desc,CR0001_005:desc',
};

const SpecialMap = new Map([
  [TemplateKeyEnums.from, 'skip'],
  [TemplateKeyEnums.keyWord, 'text'],
  [TemplateKeyEnums.sort, 'sort'],
]);

const list = ['regionCode'];

/** 新成立企业 */
const EstablishPage = () => {
  const onSuccess = useMemoizedFn((res: any) => {
    return {
      data: res?.data || [],
      totalCount: res?.length || 0,
    };
  });
  return (
    <ModuleWrapper title="新成立企业">
      <ModuleTemplate
        title="新成立企业"
        listApiFunction={getNewRegisteredEnterprises}
        pageType={REGIONAL_PAGE.COMPANY_ESTABLISH}
        defaultCondition={DEFAULTCONDITION}
        filterKeyLists={filterKeyLists}
        paramsNeedLists={list}
        moduleType="web_newRegisteredEnterprise_area"
        useColumnsHook={useColumns}
        handleSuccess={onSuccess}
        specialParamKeyMap={SpecialMap}
      />
    </ModuleWrapper>
  );
};

export default EstablishPage;
