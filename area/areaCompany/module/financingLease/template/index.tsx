import { useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';

import tenantIcon from '@/pages/area/areaCompany/assets/icon_qyrz_chengzuren.svg';
import leaserIcon from '@/pages/area/areaCompany/assets/icon_qyrz_chuzuren.svg';
import exipreIcon from '@/pages/area/areaCompany/assets/icon_qyrz_jdqsj.svg';
import ModuleTemplate from '@/pages/area/areaCompany/components/moduleTemplate';
import ModuleWrapper from '@/pages/area/areaCompany/components/moduleWrapper';
import { REGIONAL_PAGE } from '@/pages/area/areaCompany/configs';
import { useSelector } from '@/pages/area/areaF9/context';
import { getFinancingLeaseEventList } from '@/pages/finance/financingLease/apis';
import { getCensusAnalyseTabData } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/api';

import {
  leaserDefaultParams,
  tenantDefaultParams,
  expireDefaultParams,
  tenantFilterKeys,
  leaserFilterKeys,
  exipreFilterKeys,
  specialParamKeyMap,
  expireSpecialParamKeyMap,
  DetailModalExportType,
  paramsNeedList,
  expireParamsNeedList,
} from './const';
import DetailModal from './detailModal';
import useChooseColumn from './useChooseColumn';
import useExpireColumns from './useExpireColumns';
import useHandleDetailModal from './useHandleDetailModal';
import useGetLeaserColumns from './useLeaserColumns';
import useGetTenantColumns from './useTenantColumns';
export enum FinancingType {
  ByLessee = 1,
  ByLessor,
  ByExpired,
}
const FinancingLease = ({ type = FinancingType.ByLessee }: { type: FinancingType }) => {
  const areaInfo = useSelector((store) => store.areaInfo);

  const [isLoading, updateIsAllLoaded] = useState<boolean>(true);

  const {
    title,
    visible,
    modalType,
    detailTotal,
    detailLoading,
    detailParams,
    detailResultData,
    curentDetailPage,
    handlePageChange,
    handleNumModal,
    closeNumModal,
  } = useHandleDetailModal();

  const { column } = useChooseColumn({ type: modalType });

  const useTenantColumns = useGetTenantColumns(handleNumModal);
  const useLeaserColumns = useGetLeaserColumns(handleNumModal);

  const handleLoaded = useMemoizedFn((title: string) => {
    updateIsAllLoaded(false);
  });

  const handleSuccess = useMemoizedFn((res: Record<string, any> | undefined) => {
    return {
      data: res && res.data ? res.data.list : [],
      totalCount: res && res.data ? res.data.total : 0,
    };
  });

  return (
    <>
      {type === FinancingType.ByLessee && (
        <ModuleWrapper title="按承租人统计" loading={isLoading}>
          <ModuleTemplate
            hasDefaultFilter
            title=""
            iconPath={tenantIcon}
            listApiFunction={getCensusAnalyseTabData}
            pageType={REGIONAL_PAGE.FINANCING_LEASING_LESSEE}
            defaultCondition={tenantDefaultParams}
            filterKeyLists={tenantFilterKeys}
            moduleType="region_finance_lessee"
            useColumnsHook={useTenantColumns}
            handleLoaded={handleLoaded}
            handleSuccess={handleSuccess}
            specialParamKeyMap={specialParamKeyMap}
            paramsNeedLists={paramsNeedList}
          />
        </ModuleWrapper>
      )}

      {type === FinancingType.ByLessor && (
        <ModuleWrapper title="按出租人统计" loading={isLoading}>
          <ModuleTemplate
            hasDefaultFilter
            title=""
            iconPath={leaserIcon}
            listApiFunction={getCensusAnalyseTabData}
            pageType={REGIONAL_PAGE.FINANCING_LEASING_LEASER}
            defaultCondition={leaserDefaultParams}
            filterKeyLists={leaserFilterKeys}
            moduleType="region_finance_leaser"
            useColumnsHook={useLeaserColumns}
            handleLoaded={handleLoaded}
            handleSuccess={handleSuccess}
            specialParamKeyMap={specialParamKeyMap}
            paramsNeedLists={paramsNeedList}
          />
        </ModuleWrapper>
      )}
      {type === FinancingType.ByExpired && (
        <ModuleWrapper title="将到期事件" loading={isLoading}>
          <ModuleTemplate
            needColumnCustomStyle={false}
            hasDefaultFilter
            title=""
            iconPath={exipreIcon}
            listApiFunction={getFinancingLeaseEventList as any}
            pageType={REGIONAL_PAGE.FINANCING_LEASING_EXPIRATION_EVENT}
            defaultCondition={expireDefaultParams}
            filterKeyLists={exipreFilterKeys}
            moduleType="region_fls_financeLeaseSpecialList"
            useColumnsHook={useExpireColumns}
            handleLoaded={handleLoaded}
            specialParamKeyMap={expireSpecialParamKeyMap}
            paramsNeedLists={expireParamsNeedList}
          />
        </ModuleWrapper>
      )}

      {visible ? (
        <DetailModal
          name={type === FinancingType.ByLessor ? 'leaser' : type === FinancingType.ByLessee ? 'lessee' : ''}
          title={title}
          visible={visible}
          total={detailTotal}
          loading={detailLoading}
          exportFileName={`${areaInfo?.regionName || ''}-${title}`}
          exportFileNameSuffix={dayjs().format('YYYY.MM.DD')}
          exportCondition={{
            ...detailParams,
            module_type: DetailModalExportType[modalType as string] || '',
            sheetNames: { 0: `区域融资-${title}` },
            from: 0,
            size: 1000,
          }}
          paginationSize={detailParams.size}
          columnsConf={column}
          columnNeedBlank={false}
          data={detailResultData?.data?.list}
          currentPage={curentDetailPage}
          onPageChange={handlePageChange}
          setVisible={closeNumModal}
          container={document.getElementById('area-company-index-container')}
        />
      ) : null}
    </>
  );
};

export default FinancingLease;
