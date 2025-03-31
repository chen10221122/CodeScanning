import { getRegionEnterpriseList, RegionEnterpriseListParams } from '@/pages/area/areaCompany/api/regionFinancingApi';
import ModuleTemplate from '@/pages/area/areaCompany/components/moduleTemplate';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import SmallModal from '@/pages/area/areaCompany/components/smallModal';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import useRatioModal from '@/pages/area/areaCompany/hooks/useRatioModal';

import useGetColumns from './useColumns';

const filterKeyLists = [
  'text',
  'regionCode',
  'industryCodeLevel1',
  'industryCodeLevel2',
  'industryCodeLevel3',
  'industryCodeLevel4',
  'registeredCapital',
  'listingOrIssuance',
  'enterpriseLevel',
  'enterpriseNature',
  'establishmentDate',
  'indirectControllerRatio',
];
const DEFAULTCONDITION: RegionEnterpriseListParams = {
  text: '',
  from: 0,
  // 先按 企业层级 升序排序，再按 注册资本 降序排序
  sort: 'enterpriseLevel:asc,registeredCapital:desc',
  size: PAGESIZE,
  treeNode: '900837',
};

const CentralSubEnterprises = () => {
  const { visible, loading, data, setVisible, handleOpenModal } = useRatioModal();

  const useColumns = useGetColumns(handleOpenModal, visible);

  return (
    <>
      <ModuleWrapper title="央企子公司">
        <ModuleTemplate
          title="央企子公司"
          listApiFunction={getRegionEnterpriseList}
          pageType={REGIONAL_PAGE.COMPANY_STATEOWNED}
          defaultCondition={DEFAULTCONDITION}
          filterKeyLists={filterKeyLists}
          moduleType="region_sub_central_enterprise"
          useColumnsHook={useColumns}
        />
      </ModuleWrapper>
      <SmallModal visible={visible} setVisible={setVisible} loading={loading} data={data} title="持股链路" />
    </>
  );
};

export default CentralSubEnterprises;
