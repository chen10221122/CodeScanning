import { useRef, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
// import dayjs from 'dayjs';

import { getListedOrIssuseList } from '@/pages/area/areaCompany/api/regionFinancingApi';
import IPO_PIC from '@/pages/area/areaCompany/assets/IPOReverse.svg';
import IPO_BACK from '@/pages/area/areaCompany/assets/listed-back.svg';
import RelatedAnnouncements from '@/pages/area/areaCompany/components/ipoModal';
import NoticeModal from '@/pages/area/areaCompany/components/ipoNoticeModal';
import ModuleTemplate from '@/pages/area/areaCompany/components/moduleTemplate';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { SUBPAGESIZE } from '@/pages/area/areaCompany/const';
import { useImmer } from '@/utils/hooks';

import useIPOColumns, { useReserveColumns } from './useColumns';

enum IPO_STATUS {
  INIT = 'initialDeclare',
  COACH = 'coachRecord',
  STANDBY = 'ipo',
}

const filterKeyLists_1 = [
  'regionCode',

  'industryCodeLevel1',
  'industryCodeLevel2',
  'industryCodeLevel3',
  'industryCodeLevel4',

  'registeredCapital',

  'enterpriseNature',
  'intendListingBlock',
  'newStatus',
  'establishmentDate',
  'actualControllerRatio',
  'firstShareholderRatio',

  'text',
];

const filterKeyLists_2 = [
  // 'regionCode',
  'industryCodeLevel1',
  'industryCodeLevel2',
  'industryCodeLevel3',
  'industryCodeLevel4',

  'registeredCapital',

  'enterpriseNature',
  'intendListingBlock',
  'newStatus',
  'establishmentDate',
  'actualControllerRatio',
  'firstShareholderRatio',

  'text',
];

const needPL = ['regionCode|areaCode'];

const DEFAULTCONDITION = {
  from: 0,
  // 默认发行日期降序排
  size: SUBPAGESIZE,
  treeNode: '900842',
};

const _paramsMap = new Map([
  ['辅导备案阶段', 'coachRecord'],
  ['首发申报阶段', 'initialDeclare'],
  ['待上市', 'ipo'],
]);

const cdt_1 = { ...DEFAULTCONDITION, tabType: '1', sort: 'registeredCapital:desc' };
const cdt_2 = { ...DEFAULTCONDITION, tabType: '2', sort: 'registeredCapital:desc' };

const ListedEnterprise = () => {
  const noticeRef = useRef<any>();
  const [announceVisible, setAnnounceVisible] = useState<boolean>(false);
  const [queryParams, update] = useImmer({
    ITCode2: '',
    itcode2: '',
    startDate: '',
    tabIndex: '',
    noticeType: '',
  });
  const handleOpenModal = useMemoizedFn((info) => {
    const currCode = info?.enterpriseInfo?.itCode ?? '';
    let status = '';
    if (info?.newStatus) {
      status = _paramsMap.get(info.newStatus) ?? '';
    }
    update((d) => {
      d.tabIndex = status;
      d.ITCode2 = currCode;
      d.itcode2 = currCode;
      d.noticeType = status === IPO_STATUS.INIT ? 'list' : '';
      d.startDate = status === IPO_STATUS.INIT ? info?.declareDate || '' : '';
    });

    if (status === IPO_STATUS.INIT && !info?.showList) {
      noticeRef.current?.openModal(
        // queryParams,
        Object.assign(
          {
            itcode2: currCode,
          },
          {
            noticeType: 'list',
            startDate: info?.declareDate || '',
          },
        ),
      );
    } else {
      setAnnounceVisible(true);
    }
  });

  const useColumns = useIPOColumns(handleOpenModal);

  return (
    <ModuleWrapper title="IPO储备企业">
      <ModuleTemplate
        isSubModuleItem
        title="IPO储备"
        listApiFunction={getListedOrIssuseList}
        pageType={REGIONAL_PAGE.COMPANY_LISTED_IPO}
        iconPath={IPO_PIC}
        defaultCondition={cdt_1}
        filterKeyLists={filterKeyLists_1}
        moduleType="region_IPO_reserve_enterprise"
        useColumnsHook={useColumns}
        paramsNeedLists={needPL}
      />
      <ModuleTemplate
        isSubModuleItem
        title="上市后备"
        listApiFunction={getListedOrIssuseList}
        pageType={REGIONAL_PAGE.COMPANY_LISTED_RESERVE}
        iconPath={IPO_BACK}
        defaultCondition={cdt_2}
        filterKeyLists={filterKeyLists_2}
        moduleType="region_IPO_reserve_listed_after"
        useColumnsHook={useReserveColumns}
        paramsNeedLists={needPL}
      />
      {announceVisible ? (
        <RelatedAnnouncements queryParams={queryParams} visible={announceVisible} setVisible={setAnnounceVisible} />
      ) : null}
      <NoticeModal ref={noticeRef} />
    </ModuleWrapper>
  );
};

export default ListedEnterprise;
