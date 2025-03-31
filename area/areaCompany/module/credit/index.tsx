import { useMemo } from 'react';

import { getCreditEnterprise } from '@/pages/area/areaCompany/api/regionFinancingApi';
import ModuleTemplate from '@/pages/area/areaCompany/components/moduleTemplate';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import { useSelector } from '@/pages/area/areaF9/context';
import { useParams } from '@/pages/area/areaF9/hooks/useParams';

import useColumns from './useColumns';

const filterKeyLists = [
  'enterpriseNature',
  'establishmentDate',
  'industryCodeLevel1',
  'industryCodeLevel2',
  'industryCodeLevel3',
  'industryCodeLevel4',
  'listingOrIssuance',
  'mainRating',
  'ratingDate',
  'regionCode',
  'registeredCapital',
  'text',
  'ratingItCodes',
];

const paramsNeedLists = ['treeNode'];
const ListedEnterprise = () => {
  const branchId = useSelector((state) => state.curNodeBranchId);
  const creditType = useParams()?.module;
  const defaultCdt = useMemo(
    () => ({
      from: 0,
      sort: 'ratingDate:desc,ratingOutlook:desc',
      size: PAGESIZE,
      treeNode: branchId,
    }),
    [branchId],
  );
  const isShortAA = useMemo(() => creditType === 'AA-', [creditType]);
  const moduleType = useMemo(() => (isShortAA ? 'region_credit_rating' : 'region_credit_rating_one'), [isShortAA]);
  const useNewColumns = useColumns({ isShortAA });
  return (
    <ModuleWrapper title="企业信用评级">
      <ModuleTemplate
        title="企业信用评级"
        listApiFunction={getCreditEnterprise}
        pageType={REGIONAL_PAGE.COMPANY_CREDIT_RATING}
        defaultCondition={defaultCdt}
        filterKeyLists={filterKeyLists}
        paramsNeedLists={paramsNeedLists}
        moduleType={moduleType}
        useColumnsHook={useNewColumns}
        refreshPageKey={branchId}
      />
    </ModuleWrapper>
  );
};

export default ListedEnterprise;
