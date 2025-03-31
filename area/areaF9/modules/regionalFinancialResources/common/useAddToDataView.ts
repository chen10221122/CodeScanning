import { useMemo } from 'react';

import { useDebounceFn } from 'ahooks';

import { LINK_ENTERPRISE_DATA_VIEW, LINK_FINANCE_DATA_VIEW } from '@/configs/routerMap';
import { useOpenDataView } from '@/models/transmission';
import useRequest from '@/utils/ahooks/useRequest';
import { CommonResponse } from '@/utils/utility-types';

import { getScaleList, getDistributionByTypeList, getDistributionByBankList, getNoneBankList } from '../api';
import { useCtx } from '../context';
import { pageType } from '../type';

export default function useHandleDetailModal(toFiance?: boolean) {
  const {
    state: { page, tableCondition },
  } = useCtx();
  const openDataView = useOpenDataView();

  const tableDataApi = useMemo(() => {
    switch (page) {
      case pageType.SCALE:
        return getScaleList;
      case pageType.BYTYPE:
        return getDistributionByTypeList;
      case pageType.BYBANK:
        return getDistributionByBankList;
      case pageType.NONE:
        return getNoneBankList;
    }
  }, [page]);

  const { run: handleRequest1wData, loading } = useRequest<CommonResponse<{ data: any[]; total: number }>>(
    tableDataApi,
    {
      manual: true,
      onSuccess: ({ data }) => {
        openDataView(toFiance ? LINK_FINANCE_DATA_VIEW : LINK_ENTERPRISE_DATA_VIEW, {
          indicators: [],
          rows: data?.data?.map((d) => ({
            key: d.enterpriseInfo?.itCode,
            type: 'company',
            name: d.enterpriseInfo?.itName,
          })),
        });
      },
    },
  );

  /** 添加至数据浏览器 */
  const { run: handleAddToEnterpriseDataView } = useDebounceFn(
    () => handleRequest1wData({ ...tableCondition, pageSize: 1000, fields: 'code,name', skip: 0 }),
    { wait: 1000 },
  );

  return { handleAddToEnterpriseDataView, loading };
}
