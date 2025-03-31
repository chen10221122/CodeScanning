import { useCreation, useMemoizedFn } from 'ahooks';

import { getTechCoList } from '@/pages/area/areaCompany/api/regionFinancingApi';
import ModuleTemplate, { TemplateKeyEnums } from '@/pages/area/areaCompany/components/moduleTemplate';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import { useSelector } from '@/pages/area/areaF9/context';
import { useParams } from '@/pages/area/areaF9/hooks';

import useColumns from './useColumns';

const filterKeyLists = [
  // 'cityCode',
  // 'countryCode',
  // 'provinceCode',
  'regionCode',

  'industryCodeLevel1',
  'industryCodeLevel2',
  'industryCodeLevel3',
  'industryCodeLevel4',

  'registeredCapital',

  'enterpriseNature', // 企业类型
  'listingOrIssuance', // 上市、发债
  'establishmentTime', // 成立日期
  'declareDate', // 公布日期

  'itName',
];

const DEFAULTCONDITION = {
  // cityCode: '',
  // companyType: '',
  // countryCode: '',
  // declareDate: '',
  // establishmentTime: '',
  // industryCodeLevel1: '',
  // industryCodeLevel2: '',
  // industryCodeLevel3: '',
  // industryCodeLevel4: '',
  // itName: '',
  pageSize: PAGESIZE,
  // provinceCode: '',
  // registeredCapital: '',
  skip: '0',
  sortKey: 'DeclareDate,CR0001_005_yuan',
  sortRule: 'desc,desc',
  tagCode: 'TAG1',
  // tagCode2: '',
  techType: 1,
  fromRegion: true,
};

const _area_tmp = ['regionCode'];

const _special_params = new Map([
  [TemplateKeyEnums.from, 'skip'],
  [TemplateKeyEnums.itName, 'text'],
  [TemplateKeyEnums.sortKey, 'sortKey'],
  [TemplateKeyEnums.sortType, 'sortRule'],
  // [TemplateKeyEnums.cityCode, 'registrationCityCode'],
  // [TemplateKeyEnums.countryCode, 'registrationDistrictCode'],
  // [TemplateKeyEnums.provinceCode, 'registrationProvinceCode'],
  [TemplateKeyEnums.establishmentTime, 'establishmentDate'],
]);

const ProvincialEnterprise = () => {
  const handleSuccess = useMemoizedFn((res) => {
    return { data: res.data?.list, totalCount: res.data.totalSize };
  });
  const tag = useParams()?.module;
  const currNode = useSelector((d) => d.curNodeBranchName);

  const initParams = useCreation(() => {
    return {
      ...DEFAULTCONDITION,
      tagCode: tag,
    };
  }, [tag]);

  return (
    <ModuleWrapper title={currNode}>
      <ModuleTemplate
        title="科创企业"
        listApiFunction={getTechCoList}
        pageType={REGIONAL_PAGE.COMPANY_SCIENCE_TECHNOLOGY}
        handleSuccess={handleSuccess}
        specialParamKeyMap={_special_params}
        defaultCondition={initParams}
        filterKeyLists={filterKeyLists}
        moduleType="high_tech_enter"
        useColumnsHook={useColumns}
        refreshPageKey={tag}
        paramsNeedLists={_area_tmp}
      />
    </ModuleWrapper>
  );
};

export default ProvincialEnterprise;
