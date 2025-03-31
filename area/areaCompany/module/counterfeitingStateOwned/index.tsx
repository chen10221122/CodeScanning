import { getCounterfeitingData } from '@/pages/area/areaCompany/api/regionFinancingApi';
import DetailModal from '@/pages/area/areaCompany/components/blackListDetail/detailModal';
import ModuleTemplate from '@/pages/area/areaCompany/components/moduleTemplate';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { PAGESIZE } from '@/pages/area/areaCompany/const';

import useColumns from './useColumns';
import useDetails from './useDetails';

const filterKeyLists = [
  'text',
  'regionCode',
  'industryCodeLevel1',
  'industryCodeLevel2',
  'industryCodeLevel3',
  'industryCodeLevel4',
  'registeredCapital',
  'registrationStatus',
  'listingOrIssuance',
  'publishDate',
  'establishmentDate',
];
const DEFAULTCONDITION = {
  size: PAGESIZE,
  from: 0,
  sort: 'DeclareDate:desc,CR0001_005_sort:desc',
};

/** 假冒国企 */
const EstablishPage = () => {
  const { visible, setVisible, openDetailModal, params } = useDetails();
  const useNewColumns = useColumns({ openDetailModal });
  return (
    <ModuleWrapper title="假冒国企">
      <ModuleTemplate
        title="假冒国企"
        listApiFunction={getCounterfeitingData}
        pageType={REGIONAL_PAGE.COMPANY_BLACKLISTED}
        defaultCondition={DEFAULTCONDITION}
        filterKeyLists={filterKeyLists}
        moduleType="counterfeiting_enter_list"
        useColumnsHook={useNewColumns}
      />
      {visible ? <DetailModal params={params} tagType={'6'} visible={visible} setVisible={setVisible} /> : <></>}
    </ModuleWrapper>
  );
};

export default EstablishPage;
