import { useMemoizedFn } from 'ahooks';

import { LINK_ENTERPRISE_DATA_VIEW } from '@/configs/routerMap';
import { useOpenDataView } from '@/models/transmission';
import { getCensusAnalyseTabData } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/api';
import useRequest from '@/utils/ahooks/useRequest';

interface Props {
  /** 外部表格接口初始化请求参数 */
  tableParamsData: Record<string, any>;
}

export default function useHandleDetailModal({ tableParamsData }: Props) {
  const openDataView = useOpenDataView();

  const { run: handleRequest1wData } = useRequest<any>(getCensusAnalyseTabData, {
    manual: true,
    onSuccess: ({ data }) => {
      openDataView(LINK_ENTERPRISE_DATA_VIEW, {
        indicators: [],
        rows: data?.list?.map((d: Record<string, any>) => ({
          key: d?.lessee?.[0]?.itcode2 ?? d?.leaser?.[0]?.itcode2,
          type: 'company',
          name: d?.lessee?.[0]?.itname ?? d?.leaser?.[0]?.itname,
        })),
      });
    },
  });

  /** 添加至数据浏览器 */
  const handleAddToEnterpriseDataView = useMemoizedFn(() => {
    handleRequest1wData({ ...tableParamsData.requestParams, from: 0, size: 1000, onlyReturnAggKey: 'true' });
  });

  return { handleAddToEnterpriseDataView };
}
