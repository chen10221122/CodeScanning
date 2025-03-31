import dayjs from 'dayjs';

import { getPevcListData, PevcListRequestProps } from '@/pages/area/areaCompany/api/regionFinancingApi';
import ModuleTemplate from '@/pages/area/areaCompany/components/moduleTemplate';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { PAGESIZE } from '@/pages/area/areaCompany/const';

import useColumns from './useColumns';

const filterKeyLists = ['disclosureDate', 'investorCode', 'trackCode', 'text', 'regionCode'];
const DEFAULTCONDITION: PevcListRequestProps = {
  disclosureDate: `[${dayjs().subtract(1, 'year').format('YYYYMMDD')}, ${dayjs().format('YYYYMMDD')}]`,
  investorCode: '',
  trackCode: '',
  text: '',
  from: 0,
  // 默认披露日期降序
  sort: 'disclosureDate:desc',
  size: PAGESIZE,
};

const PEVC = () => {
  return (
    <ModuleWrapper title="PE/VC">
      <ModuleTemplate
        title="PE/VC"
        id="PEVC"
        listApiFunction={getPevcListData}
        pageType={REGIONAL_PAGE.FINANCING_PEVC}
        defaultCondition={DEFAULTCONDITION}
        filterKeyLists={filterKeyLists}
        moduleType="regional_financing_PEVC"
        useColumnsHook={useColumns}
      />
    </ModuleWrapper>
  );
};

export default PEVC;
