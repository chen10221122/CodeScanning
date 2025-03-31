import { useMemoizedFn } from 'ahooks';

import { getIPOListData, IPOListRequestProps } from '@/pages/area/areaCompany/api/regionFinancingApi';
import rationIcon from '@/pages/area/areaCompany/assets/icon_qyrz_pg.svg';
import additionalIcon from '@/pages/area/areaCompany/assets/icon_qyrz_zf.svg';
import ModuleTemplate from '@/pages/area/areaCompany/components/moduleTemplate';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { SUBPAGESIZE } from '@/pages/area/areaCompany/const';
import useLoading from '@/pages/detail/hooks/useLoading';
import { useImmer } from '@/utils/hooks';

import useGetColumns from './useGetColumns';

const filterKeyLists = ['enterpriseNature', 'listingPlate', 'text', 'regionCode'];
const additionalFilterKeyLists = [...filterKeyLists, 'financingType'];
const DEFAULTCONDITION: IPOListRequestProps = {
  enterpriseNature: '',
  listingPlate: '',
  text: '',
  size: SUBPAGESIZE,
  from: 0,
};
const ADDITIONALDEFAULTCONDITIOIN: IPOListRequestProps = {
  ...DEFAULTCONDITION,
  sort: 'issuanceDate:desc',
  financingType: '公开增发,定向增发',
};
const RATIONDEFAULTCONDITION: IPOListRequestProps = {
  ...DEFAULTCONDITION,
  financingType: '配股',
  sort: 'listingDate:desc',
};

const Refinancing = () => {
  const [isAllLoaded, updateIsAllLoaded] = useImmer<Record<string, any>>({
    增发: true,
    配股: true,
  });

  const handleLoaded = useMemoizedFn((title: string) => {
    updateIsAllLoaded((d) => {
      d[title] = false;
    });
  });

  const isLoading = useLoading(Object.values(isAllLoaded).some((loading) => loading));

  return (
    <ModuleWrapper title="再融资" loading={isLoading}>
      <ModuleTemplate
        isSubModuleItem
        title="增发"
        iconPath={additionalIcon}
        listApiFunction={getIPOListData}
        pageType={REGIONAL_PAGE.FINANCING_ADDITIONAL_ISSUE}
        defaultCondition={ADDITIONALDEFAULTCONDITIOIN}
        filterKeyLists={additionalFilterKeyLists}
        moduleType="regional_financing_additional_issuance"
        useColumnsHook={useGetColumns(REGIONAL_PAGE.FINANCING_ADDITIONAL_ISSUE)}
        handleLoaded={handleLoaded}
      />
      <ModuleTemplate
        isSubModuleItem
        title="配股"
        iconPath={rationIcon}
        listApiFunction={getIPOListData}
        pageType={REGIONAL_PAGE.FINANCING_ADDITIONAL_ALLOTMENT}
        defaultCondition={RATIONDEFAULTCONDITION}
        filterKeyLists={filterKeyLists}
        moduleType="regional_financing_rights_issue"
        useColumnsHook={useGetColumns(REGIONAL_PAGE.FINANCING_ADDITIONAL_ALLOTMENT)}
        handleLoaded={handleLoaded}
      />
    </ModuleWrapper>
  );
};

export default Refinancing;
