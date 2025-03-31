import { useMemoizedFn } from 'ahooks';

import { getRevokeEnterprises, RevokeListParams } from '@/pages/area/areaCompany/api/regionFinancingApi';
import ModuleTemplate, { TemplateKeyEnums } from '@/pages/area/areaCompany/components/moduleTemplate';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { PAGESIZE } from '@/pages/area/areaCompany/const';

import useColumns from './useColumns';

const filterKeyLists = [
  'status',
  // 'registrationCityCode',
  // 'registrationDistrictCode',
  // 'registrationProvinceCode',
  'regionCode',
  'industryCodeLevel1',
  'industryCodeLevel2',
  'industryCodeLevel3',
  'industryCodeLevel4',
  'registerCapital',
  'revocationAndCancelledDate',
  'keyWord',
];
const DEFAULTCONDITION: RevokeListParams = {
  pagesize: `${PAGESIZE}`,
  skip: '0',
  sort: 'CR0156_005:desc,CR0156_003:desc,CR0001_005:desc',
};

const SpecialMap = new Map([
  [TemplateKeyEnums.from, 'skip'],
  [TemplateKeyEnums.keyWord, 'text'],
  [TemplateKeyEnums.sort, 'sort'],
]);

const list = ['regionCode'];

/** 吊销/注销企业 */
const RevodePage = () => {
  const onSuccess = useMemoizedFn((res: any) => {
    return {
      data: res?.data || [],
      totalCount: res?.length || 0,
    };
  });
  return (
    <ModuleWrapper title="吊销/注销企业" id="revoke">
      <ModuleTemplate
        id="revoke"
        title="吊销/注销企业"
        listApiFunction={getRevokeEnterprises}
        pageType={REGIONAL_PAGE.COMPANY_REVODE}
        defaultCondition={DEFAULTCONDITION}
        filterKeyLists={filterKeyLists}
        paramsNeedLists={list}
        moduleType="web_revocationOrCancelledEnterprise"
        useColumnsHook={useColumns}
        handleSuccess={onSuccess}
        specialParamKeyMap={SpecialMap}
      />
    </ModuleWrapper>
  );
};

export default RevodePage;
