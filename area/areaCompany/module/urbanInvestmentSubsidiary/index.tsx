// import { useMemo } from 'react';
import { getListedOrIssuseList } from '@/pages/area/areaCompany/api/regionFinancingApi';
import ModuleTemplate from '@/pages/area/areaCompany/components/moduleTemplate';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import SmallModal from '@/pages/area/areaCompany/components/smallModal';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import useRatioModal from '@/pages/area/areaCompany/hooks/useRatioModal';
// import { useSelector } from '@/pages/area/areaF9/context';

import useGetColumns from './useColumns';

const filterKeyLists = [
  'enterpriseNature',
  'establishmentDate',
  'industryCodeLevel1',
  'industryCodeLevel2',
  'industryCodeLevel3',
  'industryCodeLevel4',

  'listingOrIssuance',

  'actualControllerRatio',
  'firstShareholderRatio',
  'indirectControllerRatio',

  'enterpriseLevel',

  'regionCode',
  'registeredCapital',
  'text',
];

const defaultCdt = {
  from: 0,
  sort: 'enterpriseLevel:asc,registeredCapital:desc',
  size: PAGESIZE,
  treeNode: '900847',
};

const paramsNeedLists = ['enterpriseNature', 'releaseStatus', 'text', 'regionCode', 'treeNode'];

const ListedEnterprise = () => {
  const { visible, loading, data, setVisible, handleOpenModal } = useRatioModal();
  const useColumns = useGetColumns(handleOpenModal, visible);

  return (
    <>
      <ModuleWrapper title="城投企业子公司">
        <ModuleTemplate
          title="城投企业子公司"
          listApiFunction={getListedOrIssuseList}
          pageType={REGIONAL_PAGE.COMPANY_LISTED_ENTERPRISE}
          defaultCondition={defaultCdt}
          filterKeyLists={filterKeyLists}
          paramsNeedLists={paramsNeedLists}
          moduleType="region_urban_subsidiary"
          useColumnsHook={useColumns}
        />
      </ModuleWrapper>
      <SmallModal visible={visible} setVisible={setVisible} loading={loading} data={data} title="持股链路" />
    </>
  );
};

export default ListedEnterprise;
