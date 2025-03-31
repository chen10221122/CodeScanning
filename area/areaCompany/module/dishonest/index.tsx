import { getDishonestData } from '@/pages/area/areaCompany/api/regionFinancingApi';
import DishonestExecutedPeople from '@/pages/area/areaCompany/components/dishonestDetailModal/dishonestExecutedPeople';
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
  'enterpriseNature',
  'listingOrIssuance',
  'publishDate',
  'establishmentDate',
];
const DEFAULTCONDITION = {
  size: PAGESIZE,
  from: 0,
  sort: 'DeclareDate:desc,CaseDate:desc',
};

/** 失信被执行人 */
const EstablishPage = () => {
  const { visible, setVisible, openDetailModal, params, itName } = useDetails();
  const useNewColumns = useColumns({ openDetailModal });

  return (
    <ModuleWrapper title="失信被执行人">
      <ModuleTemplate
        title="失信被执行人"
        listApiFunction={getDishonestData}
        pageType={REGIONAL_PAGE.COMPANY_BLACKLISTED}
        defaultCondition={DEFAULTCONDITION}
        filterKeyLists={filterKeyLists}
        moduleType="region_dishonest_executor_list"
        useColumnsHook={useNewColumns}
      />
      <DishonestExecutedPeople itName={itName} visible={visible} onClose={setVisible} condition={params} />
    </ModuleWrapper>
  );
};

export default EstablishPage;
